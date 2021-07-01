#!/usr/bin/python

from __future__ import print_function
from create_database import create_table_command

import psycopg2
from write_and_read_to_database import *
from get_data_from_database import *
from execute_db import *

def main():
    db_connection = connect_to_datbase("localhost","smalani","trivia_app_db")
    questions_table = create_table_command("questions",[["question","varchar(255)"],["answer","varchar(255)"]])
    print(questions_table)
    # cur = db_connection.cursor()
    # cur.execute(questions_table)
    execute_database_command(db_connection,questions_table)
    db_connection.commit()
    db_connection.close()
if __name__ == "__main__":
    main()
def clear_database():
    db_connection = connect_to_datbase("localhost","smalani","trivia_app_db")
    clear = clear_database()
    execute_database_command(db_connection,clear)
    db_connection.commit()
    db_connection.close()