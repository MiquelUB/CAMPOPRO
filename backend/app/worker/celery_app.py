from celery import Celery
from app.config import get_settings

settings = get_settings()

celery_app = Celery(
    "campopro_worker",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=["app.worker.tasks"]
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Europe/Madrid",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=3600,
)

# Optional: Celery Beat schedule can be configured here
celery_app.conf.beat_schedule = {
    # 'daily-backup': {
    #     'task': 'app.worker.tasks.daily_backup',
    #     'schedule': crontab(hour=3, minute=0),
    # },
}
