#!/usr/bin/python

from __future__ import print_function

import psycopg2
def write_to_database(conn,command):
    cur = conn.cursor()
    cur.execute(command)
    return conn
def make_read_from_db(items,table):
    pass