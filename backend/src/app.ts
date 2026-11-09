
import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";

import { env } from "./config/env";
import { swaggerSpec } from "./config/swagger";

import {
  errorHandler,
  notFoundHandler,
} from "./middleware/errorMiddleware";

import authRoutes from "./routes/authRoutes";
import propertyRoutes from "./routes/propertyRoutes";
import inquiryRoutes from "./routes/inquiryRoutes";

const app: Application = express();

// 1. Security headers
app.use(helmet());

// 2. CORS configuration
const allowedOrigins = [
  env.CLIENT_URL,
  "http://localhost:3000",
]
  .filter((origin): origin is string => Boolean(origin))
  .map((origin) => origin.replace(/\/$/, ""));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.replace(/\/$/, "");

      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked for origin: ${origin}`)
      );
    },
    credentials: true,
  })
);

// 3. Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// 4. Swagger UI
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// 5. OpenAPI JSON
app.get("/api-docs.json", (_req, res) => {
  res.status(200).json(swaggerSpec);
});

// 6. Health check
app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "HomeTouch API is running",
    status: "ok",
  });
});

// 7. API routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/inquiries", inquiryRoutes);

// 8. Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
