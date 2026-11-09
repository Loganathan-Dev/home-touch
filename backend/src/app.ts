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

// Initialize Express application
const app: Application = express();

// ==========================================
// 1. CORS CONFIGURATION
// ==========================================

const allowedOrigins = [
  env.CLIENT_URL,
  "http://localhost:3000",
  "https://home-touch-hu9o.onrender.com",
]
  .filter((origin): origin is string => Boolean(origin))
  .map((origin) => origin.replace(/\/$/, ""));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without Origin (Postman, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.replace(/\/$/, "");

      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      console.error("Blocked CORS origin:", origin);

      // Reject unauthorized origins without generating an application 500
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ==========================================
// 2. SECURITY MIDDLEWARE
// ==========================================

app.use(helmet());

// ==========================================
// 3. BODY PARSING MIDDLEWARE
// ==========================================

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ==========================================
// 4. SWAGGER API DOCUMENTATION
// ==========================================

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// OpenAPI JSON
app.get("/api-docs.json", (_req, res) => {
  res.json(swaggerSpec);
});

// ==========================================
// 5. HEALTH CHECK
// ==========================================

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "HomeTouch API is running",
    status: "ok",
  });
});

// ==========================================
// 6. API ROUTES
// ==========================================

// Authentication
app.use("/api/auth", authRoutes);

// Property CRUD operations
app.use("/api/properties", propertyRoutes);

// Property inquiries
app.use("/api/inquiries", inquiryRoutes);

// ==========================================
// 7. ERROR HANDLING
// ==========================================

app.use(notFoundHandler);
app.use(errorHandler);

// Export application
export default app;
