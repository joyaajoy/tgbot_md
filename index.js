const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Замените на свой токен Telegram
const TELEGRAM_TOKEN = 'ВАШ_ТОКЕН';
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// GitHub raw file fetcher
async function fetchGithubFile(owner, repo, file = 'README.md', branch = 'main') {
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${file}`;
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (e) {
    return null;
  }
}

// Простая функция для преобразования Markdown GitHub в Telegram Markdown
function githubToTelegramMarkdown(md) {
  // Экранирование спецсимволов Telegram MarkdownV2
  const escape = (text) => text
    .replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
  // Заголовки
  md = md.replace(/^# (.*)$/gm, (m, p1) => `*${escape(p1)}*`);
  md = md.replace(/^## (.*)$/gm, (m, p1) => `_${escape(p1)}_`);
  // Многострочный код
  md = md.replace(/```([^`]*)```/gm, (m, p1) => `\`\`\`\n${escape(p1)}\n\`\`\``);
  // Однострочный код
  md = md.replace(/`([^`]*)`/g, (m, p1) => `\`${escape(p1)}\``);
  // Ссылки [text](url) → text (url)
  md = md.replace(/\[([^\]]+)]\(([^)]+)\)/g, (m, p1, p2) => `${escape(p1)} (${p2})`);
  // Картинки ![alt](url) → (удалить)
  md = md.replace(/!\[([^\]]*)]\(([^)]+)\)/g, '');
  // Списки
  md = md.replace(/^\s*-\s+/gm, '• ');
  md = md.replace(/^\s*\*\s+/gm, '• ');
  // Остальное — по необходимости
  return md;
}

// /get owner repo [file] [branch]
bot.onText(/\/get (\w[\w-]*) (\w[\w-]*)(?: ([^\s]+))?(?: ([^\s]+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const owner = match[1];
  const repo = match[2];
  const file = match[3] || 'README.md';
  const branch = match[4] || 'main';

  const content = await fetchGithubFile(owner, repo, file, branch);
  if (!content) {
    return bot.sendMessage(chatId, 'Файл не найден или ошибка.', { parse_mode: 'MarkdownV2' });
  }
  const md = githubToTelegramMarkdown(content);
  // Ограничение Telegram — 4096 символов
  const chunks = md.match(/[\s\S]{1,4000}/g) || [];
  for (const chunk of chunks) {
    await bot.sendMessage(chatId, chunk, { parse_mode: 'MarkdownV2' });
  }
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Привет! Отправь команду /get owner repo [file] [branch]');
});