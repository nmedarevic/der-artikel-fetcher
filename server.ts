import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import {applyRoutes} from "./routes.ts";

const PORT = 5000;

const router = new Router();

applyRoutes(router);

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Server started on port ${PORT}`);

await app.listen({ port: PORT });