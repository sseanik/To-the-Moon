FROM python:3.8.5

WORKDIR /app/

COPY requirements.txt /app/

RUN pip install -r ./requirements.txt

COPY run.py train.py model.yaml sarimax_model.pickle sarimax_results.pickle /app/

# ENTRYPOINT /bin/bash
EXPOSE 5000

ENV ENVIRONMENT local

# ENTRYPOINT FLASK_APP="run.py" flask run
ENTRYPOINT python run.py
