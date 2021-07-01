#!/usr/bin/python

from __future__ import print_function
from typing import final

import psycopg2
def create_table_command(table_name,items): # The table name is just a normal string and the items are a list in the order of item and then datatype
    final_string = f"CREATE TABLE {table_name} ("
    for item in items:
        final_string+= f"\n {item[0]} {item[1]},"
    final_string = final_string[:-1] # removes the comma from the last item
    final_string += "\n);"
    return final_string
def add_item_to_table_command(item,table): # add an item to a table
    return f"ALTER TABLE {table}\nADD {item[0]} {item[1]};"
def remove_item_in_table_command(item,table):
    return f"ALTER TABLE {table}\nDROP {item[0]} {item[1]};"
def truncate_table_command(table): # removes the table
    return f"TRUNCATE TABLE {table}"
def drop_table_command(table): # removes all data in the table but leaves teh table
    return f"DROP TABLE {table}"
def clear_database():
    confirm = input('would you like to clear the whole database (yes for yes and anything else is no): ')
    if confirm == "yes":
        return """DROP SCHEMA public CASCADE;\nCREATE SCHEMA public;\nGRANT ALL ON SCHEMA public TO postgres;\nGRANT ALL ON SCHEMA public TO public;\nCOMMENT ON SCHEMA public IS 'standard public schema';"""