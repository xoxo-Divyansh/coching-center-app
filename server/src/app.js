import cors from "cors";
import express from "express";
import errorMiddleware from "./middlewares/error.Middleware.js";
import routes from "./routes/index.js";
// import authMiddleware from "./middlewares/auth.middleware.js"
import jwt from "jsonwebtoken"

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Coching Center API Running..");
});

// All routes here
app.use("/api/v1", routes);

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
