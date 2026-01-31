const isServer = typeof window === "undefined";
const clientBase = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

// 服务端直接用内部地址，避免绕外网
export const API_BASE_URL = isServer ? "http://127.0.0.1:3000/api" : clientBase;
