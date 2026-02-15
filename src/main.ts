import express, { type Request, type Response } from "express";
import productRoutes from "./routers/product.routes.ts";

const app = express();
const port = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/products", productRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
