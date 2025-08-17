import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectDB } from "./config/databaseConfig";
import { createServer } from "http";

const PORT = process.env.PORT || 5000;
(async () => {
  const server = createServer(app);
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();
