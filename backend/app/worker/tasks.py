from app.worker.celery_app import celery_app
import logging

logger = logging.getLogger(__name__)

@celery_app.task(name="app.worker.tasks.dummy_task")
def dummy_task():
    logger.info("Dummy task executed.")
    return "Success"
