import Redis  from "ioredis"
import { config } from "../config"

const REDIS_URL = config.redis.redisURL;

const redisOptions = REDIS_URL.startsWith('rediss://')
  ? {
      tls: { rejectUnauthorized: false },
      maxRetriesPerRequest: 3,
      enableReadyCheck: false,
      connectTimeout: 10000
    }
  : {
      maxRetriesPerRequest: 3,
      enableReadyCheck: false
    };

export const producer = new Redis(REDIS_URL, redisOptions);
export const dbConsumer = new Redis(REDIS_URL, redisOptions);
export const emailConsumer = new Redis(REDIS_URL, redisOptions);

producer.on("connect", () => {
    console.log("Redis producer connected");
});

producer.on("error", (error) => {
    console.error("Redis producer error:", error);
});

dbConsumer.on("connect", () => {
    console.log("Redis dbConsumer connected");
});

dbConsumer.on("error", (error) => {
    console.error("Redis dbConsumer error:", error);
});

emailConsumer.on("connect", () => {
    console.log("Redis emailConsumer connected");
});

emailConsumer.on("error", (error) => {
    console.error("Redis emailConsumer error:", error);
});