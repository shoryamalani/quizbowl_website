#!/usr/bin/python

from __future__ import print_function

import psycopg2
import os
import dotenv
# def connect_to_datbase(host,user,dbname): # connect to a database and return a connection item
#     conn = psycopg2.connect( host=host, user=user, dbname=dbname )
#     return conn
def is_docker():
    path = '/proc/self/cgroup'
    return (
        os.path.exists('/.dockerenv') or
        os.path.isfile(path) and any('docker' in line for line in open(path))
    )

def connect_to_datbase(host,user,dbname): # connect to a database and return a connection item
    # Path to .env file
    if not is_docker():
        dotenv_path = os.path.join(os.path.dirname(__file__), '../.env')
        # Load file from the path
        dotenv.load_dotenv(dotenv_path)

        if dbname == None:
            dbname = os.environ.get('POSTGRES_DB')
        # set up connection to postgres
        conn = psycopg2.connect(
            port=os.environ.get('DB_PORT'),
            host=os.environ.get('DB_HOST'),
            database=dbname,
            user=os.environ.get('POSTGRES_USER'),
            password=os.environ.get('POSTGRES_PASSWORD')
        )
        return conn

    else:

        # dotenv_path = os.path.join(os.path.dirname(__file__), '/postgres/.env')
        # print(dotenv_path)
        # # Load file from the path
        # print(dotenv.load_dotenv(dotenv_path,verbose=True))
        # print(dotenv.dotenv_values(dotenv_path).items())
        dotenv.load_dotenv()

        # set up connection to postgres

        conn = psycopg2.connect(
            host=os.environ.get('DB_HOST'),
            database=os.environ.get('POSTGRES_DB'),
            user=os.environ.get('POSTGRES_USER'),
            password=os.environ.get('POSTGRES_PASSWORD')
        )
        return conn