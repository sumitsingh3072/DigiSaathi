FROM python:3.11-slim
WORKDIR /app
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY ./backend/requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir --upgrade pip -r requirements.txt

COPY ./backend /app/backend
EXPOSE 8000

CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "backend.main:app", "-b", "0.0.0.0:8000"]

