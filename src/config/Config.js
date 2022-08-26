import "dotenv/config";

export const Config = () => {
  return {
    PORT: process.env.PORT || 5262,
    JWT_SECRET: process.env.JWT_SECRET,
    SOCKET_AUTH_TIMEOUT: process.env.SOCKET_AUTH_TIMEOUT,
    BACKEND_URL: process.env.BACKEND_URL,
    SERVICE_AUTH_KEY: process.env.SERVICE_AUTH_KEY
  };
};

export default Config;
