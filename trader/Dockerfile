FROM python:3.8.5

WORKDIR /app/

RUN mkdir -p /app/strategies

COPY requirements.txt /app/

RUN pip install -r ./requirements.txt

COPY run.py local_settings.py /app/
COPY strategies/*.py /app/strategies/

EXPOSE 5000

ENV ENVIRONMENT local

ENTRYPOINT python run.py
