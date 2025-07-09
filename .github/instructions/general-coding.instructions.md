---
applyTo: "**"
---
# Overview

The application has the following structure:

/backend: Hono.js application server in TypeScript
/app: React.js SPA application using Vite with TypeScript
/app/gen: The OpenAPI spec should go here
/app/gen/api: The `kubb` generated output should go here


## Tooling

- Use the `pnpm` package manager
- Use `kubb` to create client bindings from the OpenAPI spec (output to /app/gen)
- Use tanstack/react-query on in the React app
