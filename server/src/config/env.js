import dotenv from "dotenv";


dotenv.config();

function required(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }

  return value;
}

export const env = {
  port: Number(required("PORT")),
  nodeEnv: process.env.NODE_ENV || "",
  clientOrigin: process.env.CLIENT_ORIGIN || "",
  mongodbUrl: required("MONGODB_URL"),
  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "",
  authCookieName: process.env.AUTH_COOKIE_NAME || "",
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || ""
  }
};

export function hasCloudinaryConfig() {
  return Boolean(
    env.cloudinary.cloudName && env.cloudinary.apiKey && env.cloudinary.apiSecret
  );
}

export function isProd() {
  return env.nodeEnv === "production";
}
