import express, { Express, Request, Response } from "express";
import { PORT } from "./secrets";
import rootRouter from "./routes";
import { PrismaClient } from "./generated/prisma";
import { errorMiddleware } from "./middleware/errors";

const app: Express = express();
app.use(express.json());
app.use("/api/v1", rootRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Working");
});

export const prismaClient = new PrismaClient({
  log: ["query"],
});

app.use(errorMiddleware);
app.listen(PORT, () => {
  console.log("app is working");
});
