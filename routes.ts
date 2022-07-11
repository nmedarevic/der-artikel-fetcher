import { Router } from "https://deno.land/x/oak/mod.ts";

export const applyRoutes = (router: Router) => {
  return router.get("/", (context) => {
    context.response.body = "Hello world!";
  })
  .get("/:word/article", (context) => {
    context.response.body = "word";
  })
}