import cors from "cors";
import express from "express";
import errorMiddleware from "./middlewares/error.middleware.js";
import routes from "./routes/index.js";

const app = express();

// 🚀 Disable etag to avoid 304 cache issues
// app.set("etag", false);

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"], // ADD port 3000
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // ADD methods
    optionsSuccessStatus: 200 // Legacy browser fix
  }),
);


// 🚫 Disable browser caching for GET APIs
app.use((req, res, next) => {
  if (req.method === "GET") {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
  }
  next();
});

app.use(express.json());

app.use("/api", routes);

app.use(errorMiddleware);

export default app;
