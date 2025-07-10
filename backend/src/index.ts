import { serve } from "@hono/node-server";
import { createRoute } from "@hono/zod-openapi";
import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { cors } from "hono/cors";
import z from "zod";
import fs from "fs";
import path from "path";

const app = new OpenAPIHono();

// Add CORS middleware
app.use("*", cors());

const PostsSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
});

const PostsListingSchema = z.object({
  data: PostsSchema.array(),
  nextPage: z.coerce.number().nullable(),
});

const PostsRequestSchema = z.object({
  page: z.coerce.number(),
  pageSize: z.coerce.number().min(1).max(100).default(10),
});

const postsRoute = createRoute({
  method: "get",
  path: "/posts",
  request: {
    query: PostsRequestSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: PostsListingSchema,
        },
      },
      description: "A list of posts",
    },
  },
  tags: ["Posts"],
});

app.openapi(postsRoute, (c) => {
  const { page, pageSize } = c.req.valid("query");

  // Mock data for demonstration
  const mockPosts = Array.from({ length: pageSize }, (_, i) => ({
    id: `post-${i + 1}`,
    title: `Post ${i + 1}`,
    content: `This is the content for post ${i + 1}`,
  }));

  return c.json({
    data: mockPosts,
    nextPage: mockPosts.length === pageSize ? page + 1 : null,
  });
});

// OpenAPI documentation endpoint
app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Blog API",
    description: "A simple blog API built with Hono.js",
  },
});

// Swagger UI
app.get("/ui", swaggerUI({ url: "/doc" }));

// Generate OpenAPI schema file for kubb
function generateOpenAPISchema() {
  const openAPISpec = app.getOpenAPIDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Blog API",
      description: "A simple blog API built with Hono.js",
    },
  });

  // Ensure the gen directory exists
  const genDir = path.join(process.cwd(), "..", "app", "src", "gen");
  if (!fs.existsSync(genDir)) {
    fs.mkdirSync(genDir, { recursive: true });
  }

  // Write the OpenAPI schema
  const schemaPath = path.join(genDir, "openapi.json");
  fs.writeFileSync(schemaPath, JSON.stringify(openAPISpec, null, 2));
  console.log(`OpenAPI schema generated at: ${schemaPath}`);
}

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
    console.log(`OpenAPI docs available at: http://localhost:${info.port}/doc`);
    console.log(`Swagger UI available at: http://localhost:${info.port}/ui`);

    // Generate the schema file when server starts
    generateOpenAPISchema();
  },
);
