import express, {
  type Request,
  type Response,
  type Application,
} from "express";
import { test } from "shared";

const app: Application = express();

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send(test);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
