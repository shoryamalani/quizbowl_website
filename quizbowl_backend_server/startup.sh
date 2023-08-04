#!/bin/bash
# gunicorn -b :5000 -k geventwebsocket.gunicorn.workers.GeventWebSocketWorker -w 1 app:app
uwsgi --http :5000 --gevent 1000 --http-websockets --master --wsgi-file app.py --callable app