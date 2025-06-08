import express, { Application, Request, Response } from "express";
import cors from "cors";

const app: Application = express();

app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(express.json()); // Parses incoming JSON requests

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ url: req.url, message: "App is running" });
});

export default app;
