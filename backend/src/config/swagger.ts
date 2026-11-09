
import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Real Estate Platform API",
      version: "1.0.0",
      description:
        "API documentation for the Fullstack Real Estate Platform",
    },

    servers: [
  {
    url: "https://home-touch-hu9o.onrender.com",
    description: "Production server",
  },
  {
    url: "http://localhost:5000",
    description: "Development server",
  },
],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },

  // Read Swagger documentation comments from route files
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
