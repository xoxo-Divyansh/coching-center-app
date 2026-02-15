import cors from "cors";
import express from "express";
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

export default app;
