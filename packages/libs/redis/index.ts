import Redis from "ioredis";

// Make sure REDIS_DATABASE_URI is defined
if (!process.env.REDIS_DATABASE_URI) {
  throw new Error("REDIS_DATABASE_URI is not set in .env");
}

// Initialize Redis with TLS for Upstash
const redis = new Redis(process.env.REDIS_DATABASE_URI, {
  tls: {} // enables secure connection
});

// Optional: add connection event logging
redis.on("connect", () => console.log("✅ Connected to Redis"));
redis.on("error", (err) => console.error("❌ Redis error:", err));

export default redis;
