import ess from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import bikeRoutes from "./routes/bike.js";

dotenv.config();
const app = ess();

// Middleware
app.use(ess.json());
app.use(cors());
app.use(helmet());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/bikes", bikeRoutes);

// DB + Server
connectDB()
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`🚀 Server running on port ${process.env.PORT}`)
    );
  })
  .catch(err => console.error(err));
