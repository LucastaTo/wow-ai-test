import { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import express from "express";
import Pusher from "pusher";
import { json, urlencoded } from "body-parser";
import { CONFIG } from "./config";

const app = express();
const port = 5174;

app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(json());
app.use(morgan("dev"));
const pusher = new Pusher({
  appId: CONFIG.PUSHER_ID,
  key: CONFIG.PUSHER_KEY,
  secret: CONFIG.PUSHER_SECRET,
  cluster: CONFIG.PUSHER_CLUSTER,
});

app.get("/ping", (req: Request, res: Response) => {
  res.send("pong");
});

app.post("/open", (req: Request, res: Response) => {
  const payload = req.body;
  pusher.trigger("todo", `open`, payload);
  res.send(true);
});

app.post("/block", (req: Request, res: Response) => {
  const payload = req.body;
  pusher.trigger("todo", `block`, payload);
  res.send(true);
});
app.listen(port, () => {
  console.log(`api listening on port ${port}`);
});
