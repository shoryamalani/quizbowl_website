#!/usr/bin/python

from __future__ import print_function

import psycopg2
def connect_to_datbase():
    conn = psycopg2.connect( host="localhost", user="smalani", dbname="postgres" )
    cur = conn.cursor()
    cur.execute( "SELECT text, answer FROM tossups" )
    x = 0
    for text, answer in cur.fetchall() :
        print(text, answer)
        print(x)
        x+=1
    conn.close()
connect_to_datbase()