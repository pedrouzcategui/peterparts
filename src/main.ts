import express, { type Request, type Response } from "express";
import productRoutes from "./routers/product.routes.ts";
import { checkDatabaseConnection } from "./db/prisma.ts";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/products", productRoutes);

app.listen(port, async () => {
  await checkDatabaseConnection();
  console.log(`Example app listening on port ${port}`);
});
