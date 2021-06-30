#!/usr/bin/python

from __future__ import print_function

import psycopg2
def execute_database(conn,command):
    cur = conn.cursor()
    cur.execute(command )
    x = 0
    for text, answer in cur.fetchall() :
        print(text, answer)
        print(x)
        x+=1
    return conn
