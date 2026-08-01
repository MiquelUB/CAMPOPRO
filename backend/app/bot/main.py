import logging
from aiogram import Bot, Dispatcher
from aiogram.enums import ParseMode
from aiogram.client.default import DefaultBotProperties

from app.config import get_settings
from app.bot.handlers import router as main_router

settings = get_settings()

# Initialize Bot and Dispatcher
try:
    bot = Bot(
        token=settings.TELEGRAM_BOT_TOKEN, 
        default=DefaultBotProperties(parse_mode=ParseMode.HTML)
    )
except Exception as e:
    logging.warning(f"Telegram Bot disabled or token invalid: {e}")
    bot = None

dp = Dispatcher()

# Include routers
dp.include_router(main_router)

async def setup_bot():
    """Setup webhook or any other bot initialization"""
    logging.info("Bot setup completed.")
    pass
