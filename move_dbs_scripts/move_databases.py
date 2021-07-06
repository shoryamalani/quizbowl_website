#!/usr/bin/python

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
    questions_table_list = [["UUID","SERIAL PRIMARY KEY"],["question","text"],["unformatted_question","text"],["answer","text"],["unformatted_answer","text"],["source","integer"],["marked_for_review","boolean"],["difficulty","integer"],["topic","integer"],["subtopic","integer"],["question_number","integer"],["filename","text"],["created_at","date"],["updated_at","date"],["errors","text"],["correct_to_attempts","text"]]
    questions_table = create_table_command("original_questions",questions_table_list)
    tournament_table_list = [["UUID","SERIAL PRIMARY KEY"],["year","integer"],["name","text"],["difficulty","integer"]]
    tournaments_table = create_table_command("tournaments",tournament_table_list)
    categories_table_list = [["UUID","SERIAL PRIMARY KEY"],["name","text"]]
    categories_table = create_table_command("categories",categories_table_list)
    subcategories_table_list = [["UUID","SERIAL PRIMARY KEY"],["name","text"],["category","integer"]]
    subcategories_table = create_table_command("subcategories",subcategories_table_list)
    users_table_list = [["UUID","SERIAL PRIMARY KEY"],["username","text"],["password","text"],["reset_password_token","text"],["reset_password_sent_at","timestamp"],["sign_in_count","int"],["last_sign_in","timestamp"],["created_at","timestamp"],["updated_at","timestamp"],["confirmation_token","text"],["confirmation_sent_at","timestamp"],["questions_attempted","text"],["questions_correct_to_attempted","text"],["questions_correct","text"],["friends","text"]]
    users_table = create_table_command("users",users_table_list)
    print(questions_table)
    # cur = db_connection.cursor()
    # cur.execute(questions_table)
    execute_database_command(db_connection,questions_table)
    execute_database_command(db_connection,categories_table)
    execute_database_command(db_connection,tournaments_table)
    execute_database_command(db_connection,subcategories_table)
    execute_database_command(db_connection,users_table)
    db_connection.commit()
    db_connection.close()
    old_db_connection = connect_to_datbase("localhost","smalani","postgres")
    read_tossups = make_read_from_db(["text","formatted_text","answer","formatted_answer","tournament_id","category_id","subcategory_id","number","round","created_at","updated_at","errors_count"],"tossups")
    # submit in ["question","unformatted_question","answer","unformatted_answer","source","marked_for_review","topic","subtopic","question_number","filename","created_at","updated_at","errors","correct_to_attempts"]
    
    
    db_connection = connect_to_datbase("localhost","smalani","trivia_app_db")


    read_tournaments = make_read_from_db(["id","year","name","difficulty"],"tournaments")
    tournaments = execute_database_command(old_db_connection,read_tournaments)[1].fetchall()
    finished_tournaments = []
    for item_tuple in tournaments:
        finished_tournaments.append(tuple([item_tuple[0],item_tuple[1],item_tuple[2],item_tuple[3]]))
    write_tournaments = make_write_to_db(finished_tournaments,"tournaments",["UUID","year","name","difficulty"])
    execute_database_command(db_connection,write_tournaments)
    db_connection.commit()
    # print(write_questions)
    questions = execute_database_command(old_db_connection,read_tossups)[1].fetchall()
    finished_questions = []
    for item_tuple in questions:
        difficulty = None
        for tournament in tournaments:
            if item_tuple[4] == tournament[0]:
                difficulty = tournament[3]
        finished_questions.append((item_tuple[1],item_tuple[0],item_tuple[3],item_tuple[2],int(item_tuple[4]) if (type(item_tuple[4])==int) else None,False,item_tuple[5],item_tuple[6],item_tuple[7],item_tuple[8],item_tuple[9].strftime("%Y-%m-%d %H:%M:%S"),item_tuple[10].strftime("%Y-%m-%d %H:%M:%S"),item_tuple[11],"0/0",difficulty))
    format_to_write_to_original_questions = ["question","unformatted_question","answer","unformatted_answer","source","marked_for_review","topic","subtopic","question_number","filename","created_at","updated_at","errors","correct_to_attempts","difficulty"]
    write_questions = make_write_to_db(finished_questions,"original_questions",format_to_write_to_original_questions)
    execute_database_command(db_connection,write_questions)
    
    
    read_categories = make_read_from_db(["id","name"],"categories")
    categories = execute_database_command(old_db_connection,read_categories)[1].fetchall()
    finished_categories = []
    for item_tuple in categories:
        finished_categories.append(tuple([item_tuple[0],item_tuple[1]]))
    write_categories = make_write_to_db(finished_categories,"categories",["UUID","name"])
    execute_database_command(db_connection,write_categories)
    db_connection.commit()

    read_subcategories = make_read_from_db(["id","name","category_id"],"subcategories")
    subcategories = execute_database_command(old_db_connection,read_subcategories)[1].fetchall()
    finished_subcategories = []
    for item_tuple in subcategories:
        finished_subcategories.append(tuple([item_tuple[0],item_tuple[1],item_tuple[2]]))
    write_categories = make_write_to_db(finished_subcategories,"subcategories",["UUID","name","category"])
    execute_database_command(db_connection,write_categories)
    db_connection.commit()
    
    # time to do the inner relations
    join_subcategory_to_category = create_relation_in_tables("subcategories","category","categories","UUID")
    execute_database_command(db_connection,join_subcategory_to_category)
    join_orignal_questions_to_tournaments = create_relation_in_tables("original_questions","source","tournaments","UUID")
    execute_database_command(db_connection,join_orignal_questions_to_tournaments)
    join_orignal_questions_to_categories = create_relation_in_tables("original_questions","topic","categories","UUID")
    execute_database_command(db_connection,join_orignal_questions_to_categories)
    join_orignal_questions_to_subcategories = create_relation_in_tables("original_questions","subtopic","subcategories","UUID")
    execute_database_command(db_connection,join_orignal_questions_to_subcategories)
    db_connection.commit()
    db_connection.close()
    # print(data)
if __name__ == "__main__":
    main()
def clear_database():
    db_connection = connect_to_datbase("localhost","smalani","trivia_app_db")
    clear = delete_database()
    execute_database_command(db_connection,clear)
    db_connection.commit()
    db_connection.close()