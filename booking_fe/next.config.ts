import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  pageExtensions: ['ts', 'tsx', 'library'],
  env: {
    FIELD_API_URL: process.env.FIELD_API_URL,
    USER_API_URL: process.env.USER_API_URL,
    ORDER_API_URL: process.env.ORDER_API_URL,
    FIELD_SERVICE_NAME: process.env.FIELD_SERVICE_NAME,
    USER_SERVICE_NAME: process.env.USER_SERVICE_NAME,
    ORDER_SERVICE_NAME: process.env.ORDER_SERVICE_NAME,
    FIELD_SIGNATURE_KEY: process.env.FIELD_SIGNATURE_KEY,
    USER_SIGNATURE_KEY: process.env.USER_SIGNATURE_KEY,
    ORDER_SIGNATURE_KEY: process.env.ORDER_SIGNATURE_KEY,
    CONSUL_HTTP_URL: process.env.CONSUL_HTTP_URL,
    CONSUL_HTTP_PATH: process.env.CONSUL_HTTP_PATH,
    CONSUL_HTTP_TOKEN: process.env.CONSUL_HTTP_TOKEN,
  }
};

export default nextConfig;
