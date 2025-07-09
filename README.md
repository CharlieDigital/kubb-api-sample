# OpenAPI + TanStack Query Example

This repo demonstrates:

- Backend implemented in Hono.js and ASP.NET web API
- Both output an OpenAPI specification
- Then the client side uses kubb.dev to generate the TanStack Query bindings (including "infinite" retrieval (really just paging))

|Note|`/backend`|`/backend-cs`|
|--|--|--|
|Backend|Hono.js|C# ASP.NET|
|OpenAPI|`app/src/gen`|`app/src/gen-cs`|
|Generate Client|`pnpm --filter app generate`|`pnpm --filter app generate-cs`|
|Kubb Config|`app/kubb.config.ts`|`app/kub.config-cs.ts`|

Evaluate the server configurations.

For the .NET one, you can run:

```shell
cd backend-cs
./watch-gen.sh
# Open the file app/src/gen-cs/openapi.json
# Then make a change to the code (like the description)
# What it hot reload the API
```
