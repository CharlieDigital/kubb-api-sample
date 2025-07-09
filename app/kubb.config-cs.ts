import { defineConfig } from "@kubb/core";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginReactQuery } from "@kubb/plugin-react-query";
import { pluginTs } from "@kubb/plugin-ts";

export default defineConfig({
  root: ".",
  input: {
    path: "./src/gen-cs/openapi.json",
  },
  output: {
    path: "./src/gen-cs/api",
    clean: true,
  },
  plugins: [
    pluginOas({
      output: {
        path: "./schemas",
      },
    }),
    pluginTs({
      output: {
        path: "./types",
      },
    }),
    pluginReactQuery({
      output: {
        path: "./hooks",
      },
      client: {
        baseURL: "http://localhost:3000",
      },
      infinite: {
        queryParam: "page",
        initialPageParam: 0,
        cursorParam: "nextPage",
      },
    }),
  ],
});
