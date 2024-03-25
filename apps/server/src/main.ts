import express, {
  type Request,
  type Response,
  type Application,
} from "express";
import { test } from "shared";
import cors from "cors";

const app: Application = express();

app.use(cors({
  origin: "http://localhost:5173",
  allowedHeaders: "*"
}));

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.json({ text: test });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
