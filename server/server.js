import app from "./src/app.js";
import config from "./src/config/config.js";
import connectDB from "./src/config/db.js";
import logger from "./src/utils/logger.js";

const PORT = config.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
