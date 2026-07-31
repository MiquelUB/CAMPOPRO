from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional
from app.bot.main import bot
from app.bot.handlers import get_budget_keyboard

router = APIRouter()

class NotificationBase(BaseModel):
    chat_id: int
    message: str

class NotificationArribant(NotificationBase):
    pass

class NotificationPressupost(NotificationBase):
    budget_id: str

@router.post("/estem-arribant", status_code=status.HTTP_200_OK)
async def notify_estem_arribant(notification: NotificationArribant):
    """
    Endpoint per disparar una notificació de tipus 'Estem arribant' al client via Telegram.
    """
    try:
        await bot.send_message(
            chat_id=notification.chat_id,
            text=f"🚜 <b>Avís de l'equip:</b>\n{notification.message}"
        )
        return {"status": "success", "detail": "Notification sent successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to send Telegram message: {str(e)}"
        )

@router.post("/pressupost", status_code=status.HTTP_200_OK)
async def notify_pressupost(notification: NotificationPressupost):
    """
    Endpoint per enviar un pressupost per aprovar amb el botó 'Acceptar Pressupost' i l'enllaç al Memòndum.
    """
    try:
        await bot.send_message(
            chat_id=notification.chat_id,
            text=f"📋 <b>Nou Pressupost:</b>\n{notification.message}",
            reply_markup=get_budget_keyboard(notification.budget_id)
        )
        return {"status": "success", "detail": "Budget notification sent successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to send Telegram message: {str(e)}"
        )

from aiogram.types import Update
from fastapi import Header
from app.bot.main import dp
from app.config import get_settings

async def verify_telegram_token(x_telegram_bot_api_secret_token: str = Header(None)):
    settings = get_settings()
    if not x_telegram_bot_api_secret_token or x_telegram_bot_api_secret_token != settings.TELEGRAM_WEBHOOK_SECRET:
        raise HTTPException(status_code=403, detail="Invalid Secret Token")

@router.post("/webhook", include_in_schema=False, dependencies=[Depends(verify_telegram_token)])
async def telegram_webhook(update: dict):
    """
    Webhook per rebre peticions de Telegram (updates).
    """
    try:
        telegram_update = Update(**update)
        await dp.feed_update(bot=bot, update=telegram_update)
        return {"status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
