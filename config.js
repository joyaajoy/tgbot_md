require('dotenv').config();

const config = {
  telegram: {
    token: process.env.TELEGRAM_BOT_TOKEN,
    options: {
      polling: true
    }
  },
  github: {
    token: process.env.GITHUB_TOKEN,
    apiVersion: '2022-11-28'
  },
  server: {
    port: process.env.PORT || 3000
  },
  environment: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info'
};

// Проверка обязательных переменных окружения
const requiredEnvVars = ['TELEGRAM_BOT_TOKEN', 'GITHUB_TOKEN'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

module.exports = config;