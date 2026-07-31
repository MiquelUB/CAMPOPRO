from aiogram import Router, F
from aiogram.filters import CommandStart
from aiogram.types import Message, CallbackQuery, InlineKeyboardMarkup, InlineKeyboardButton

router = Router()

@router.message(CommandStart())
async def cmd_start(message: Message):
    """
    Handle /start command.
    """
    welcome_text = (
        "Hola! Sóc el bot de CampoPro.\n"
        "Si us plau, utilitza els botons per interactuar amb les teves notificacions i pressupostos."
    )
    await message.answer(welcome_text)

@router.callback_query(F.data.startswith("accept_budget_"))
async def accept_budget_handler(callback_query: CallbackQuery):
    """
    Handle 'Acceptar Pressupost' button click.
    """
    budget_id = callback_query.data.split("_")[2]
    # Here you would typically call a service to mark the budget as accepted
    # For now we just reply
    await callback_query.answer(f"Has acceptat el pressupost {budget_id}!")
    
    await callback_query.message.edit_text(
        text=callback_query.message.html_text + f"\n\n✅ <b>Pressupost {budget_id} acceptat.</b>"
    )

def get_budget_keyboard(budget_id: str) -> InlineKeyboardMarkup:
    """
    Helper to generate keyboard for budget approval.
    """
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(text="Llegir Memòndum", url=f"https://campopro.app/memondum/{budget_id}")
            ],
            [
                InlineKeyboardButton(text="✅ Acceptar Pressupost", callback_data=f"accept_budget_{budget_id}")
            ]
        ]
    )
    return keyboard

# Filtre Anti-Spam (s'avalua després de la resta de handlers si cap altre fa match)
BAD_WORDS = ["puta", "merda", "cabron", "gilipollas", "hòstia", "conyo", "mierda", "coño", "joder", "idiota"]

@router.message(F.photo | F.document | F.video | F.audio)
async def discard_attachments(message: Message):
    await message.answer("Ho sentim, el nostre bot no processa arxius adjunts. Si us plau, escriu el teu missatge de text.")
    # Depenent de la política, podem eliminar o ignorar
    try:
        await message.delete()
    except Exception:
        pass

@router.message(F.text)
async def check_bad_words_and_text(message: Message):
    text = message.text.lower()
    if any(word in text for word in BAD_WORDS):
        try:
            await message.delete()
        except Exception:
            pass
        return
    await message.answer("Missatge rebut. En breu un dels nostres enginyers et respondrà. Gràcies.")
