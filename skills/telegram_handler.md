# Skill: Telegram Handler (aiogram 3.x)

## Descripció
Aquesta skill serveix de plantilla per crear un bot interactiu per als treballadors i clients amb aiogram 3.x. Inclou comandaments, menús interactius amb botons integrats, i plantilles Jinja2 per als missatges. També s'hi pot trobar un "fallback" a missatges no reconeguts.

## Template

```python
import logging
from aiogram import Bot, Dispatcher, Router, F
from aiogram.filters import CommandStart, Command
from aiogram.types import Message, CallbackQuery, InlineKeyboardMarkup, InlineKeyboardButton
from jinja2 import Template

# Router per modularitzar el codi
router = Router()

# Menú principal de botons
def create_main_keyboard():
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="🕒 Horaris i Torn", callback_data="btn_horari")],
            [InlineKeyboardButton(text="👨‍🌾 Les meves feines", callback_data="btn_feines")],
            [InlineKeyboardButton(text="🚨 Informar de Problema", callback_data="btn_problema")],
            [InlineKeyboardButton(text="📞 Contactar Encarregat", callback_data="btn_contactar")]
        ]
    )
    return keyboard

# Templates de missatges
WELCOME_TEMPLATE = Template(
    "👋 Hola {{ nom }}!\n"
    "Benvingut al teu assistent de Campopro.\n\n"
    "Selecciona una opció per començar:"
)

# 1. Comandament /start
@router.message(CommandStart())
async def cmd_start(message: Message):
    # Aquì podem buscar qui és per message.from_user.id
    nom = message.from_user.first_name
    text = WELCOME_TEMPLATE.render(nom=nom)
    await message.answer(text, reply_markup=create_main_keyboard())

# 2. Callback Handlers (Botons)
@router.callback_query(F.data == "btn_horari")
async def process_horari(callback: CallbackQuery):
    await callback.message.answer("🕒 El teu horari per avui és de 8:00 a 16:00.")
    await callback.answer() # Confirmar que s'ha pitjat

@router.callback_query(F.data == "btn_problema")
async def process_problema(callback: CallbackQuery):
    await callback.message.answer("Escriu el problema que t'ha sorgit i el notificaré al responsable.")
    await callback.answer()

# 3. Notificacions (servei extern cridable pel worker)
async def send_notification(bot: Bot, chat_id: int, message_type: str, dades: dict):
    if message_type == 'incidencia':
        tpl = Template("🚨 <b>NOVA INCIDÈNCIA</b> 🚨\nFeina: {{ feina }}\nDesc: {{ desc }}")
        await bot.send_message(chat_id, tpl.render(**dades), parse_mode="HTML")
    # Altres tipus...

# 4. Fallback handler (qualsevol text no capturat abans)
@router.message(F.text)
async def process_unknown_message(message: Message):
    # Ideal per passar aquest text cap a un xat grupal d'encarregats
    logging.info(f"Missatge d'usuari {message.from_user.id}: {message.text}")
    await message.answer("He guardat el teu missatge. Un responsable el llegirà aviat.")

# Setup bàsic per l'aplicació principal
async def main(bot_token: str):
    bot = Bot(token=bot_token)
    dp = Dispatcher()
    dp.include_router(router)
    
    # Mode Polling per dev, o configuració Webhook per producció.
    # A producció cal registrar-ho a FastAPI
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)
```

## Exemple d'ús
En `main.py` de l'aplicació s'haurà de córrer en paral·lel o configurar els Webhooks del bot amb FastAPI (`aiogram.webhook.aiohttp_server.SimpleRequestHandler` o similar). Si utilitzes Celery per enviar notificacions autònomes:
```python
bot = Bot(token=config('BOT_TOKEN'))
await send_notification(bot, 12345678, 'incidencia', {"feina": "Collita Pomes", "desc": "Tractor espatllat"})
```

## Validació
- Llança el bot: crida el `/start` des de Telegram i veu com apareixen els 4 botons en línia.
- Prem els botons i valida que respongui i desaparegui l'indicador de càrrega del botó (gràcies a `callback.answer()`).

## Errors comuns
- No fer el `await callback.answer()` en els processadors de callbacks.
- Bloquejar el bucle d'esdeveniments si fas una crida a Base de dades que no és asíncrona; en aiogram 3 i asyncpg s'ha d'utilitzar TOT l'stack asíncron per evitar colls d'ampolla a l'atendre varis usuaris.
