import cors from "cors";
import express from "express";
import jwt from "jsonwebtoken";
import errorMiddleware from "./middlewares/error.middleware.js";
import routes from "./routes/index.js";

const app = express();

// middlewares
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  }),
);
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Coching Center API Running..");
});

// All routes here
app.use("/api", routes);

// Error handling middleware (always last)
app.use(errorMiddleware);

app.get("/debug-token", (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json(decoded);
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

export default app;
