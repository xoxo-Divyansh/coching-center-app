import express from "express";
import cors from "cors";
import errorMiddleware from "./middlewares/error.Middleware.js";
import routes from "./routes/index.js";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// All routes here
app.use("/api/v1", yourRoutesHere);

// Error handling middleware (always last)
app.use(errorMiddleware);

// Use all routes
app.use("/api", routes);


// test route
app.get('/', (req, res)=> {
   res.send('Coching Center API Running..')
});

export default app;