from __future__ import print_function
from typing import Tuple
from create_database import create_table_command

import psycopg2
from write_and_read_to_database import *
from get_data_from_database import *
from execute_db import *
from create_database import *
from datetime import datetime
def main():
    db_connection = connect_to_datbase("localhost","smalani","trivia_app_db")