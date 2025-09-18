const config = require('./config');
const TelegramBot = require('node-telegram-bot-api');
const { Octokit } = require('@octokit/rest');

// Инициализация Telegram бота
const bot = new TelegramBot(config.telegram.token, config.telegram.options);

// Инициализация GitHub клиента
const octokit = new Octokit({
  auth: config.github.token,
  userAgent: 'telegram-github-bot',
  baseUrl: 'https://api.github.com',
  log: {
    debug: () => {},
    info: () => {},
    warn: console.warn,
    error: console.error
  }
});

// Пример использования конфигурации
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `Bot is running in ${config.environment} mode`);
});

// Обработка ошибок
bot.on('error', (error) => {
  console.error('Telegram Bot Error:', error);
});

console.log(`Bot started in ${config.environment} mode on port ${config.server.port}`);