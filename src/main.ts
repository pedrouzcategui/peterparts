import express, { type Request, type Response } from "express";
import { productRouter } from "@routers/index";
import { checkDatabaseConnection } from "@db/index";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/products", productRouter);

app.listen(port, async () => {
  await checkDatabaseConnection();
  console.log(`Example app listening on port ${port}`);
});
