from .write_and_read_to_database import *
from .get_data_from_database import *
from .execute_db import *
from .create_database import *
from datetime import datetime
import random
current_db_g = "trivia_app_db"
def get_random_question():
    db_connection = connect_to_datbase("localhost","smalani",current_db_g) # IO
    question_id = get_random_id_command()
    id_data = execute_database_command(db_connection,question_id)
    id = int(id_data[1].fetchone()[0])
    get_random_question = get_from_where_db("original_questions","uuid",id)
    get_question_data = execute_database_command(db_connection,get_random_question)
    return get_question_data[1].fetchone()


def get_many_questions():
    db_connection = connect_to_datbase("localhost","smalani",current_db_g) # IO
    questions = []
    for _ in range(10):
        question_id = get_random_id_command()
        id_data = execute_database_command(db_connection,question_id)
        id = int(id_data[1].fetchone()[0])
        get_random_question = get_from_where_db("original_questions","uuid",id)
        get_question_data = execute_database_command(db_connection,get_random_question)
        questions.append(get_question_data[1].fetchall())
    
    return questions    
def get_question_info(quesiton_id):
    db_connection = connect_to_datbase("localhost","smalani",current_db_g) # IO
    get_random_question = get_from_where_db("original_questions","uuid",quesiton_id)
    get_question_data = execute_database_command(db_connection,get_random_question)
    return get_question_data[1].fetchone()

def get_question_with_specific_difficulty(difficulty):
    db_connection = connect_to_datbase("localhost","smalani",current_db_g)
    questions_with_difficulty = get_from_where_db("original_questions","difficulty",difficulty)
    get_question_data = execute_database_command(db_connection,questions_with_difficulty)
    questions = get_question_data[1].fetchall()
    final_questions = []
    for _ in range(10):
        final_questions.append(random.choice(questions))
    print(final_questions)
    return final_questions

def get_question_with_specific_difficulty_and_topic(difficulty,topic):
    db_connection = connect_to_datbase("localhost","smalani",current_db_g)
    command = "SELECT uuid,question,answer FROM original_questions TABLESAMPLE SYSTEM(1) where difficulty=(%s) and topic=(%s) and status=(%s) limit 1;"
    data = (difficulty,topic,1)
    question = None
    while question == None:
        get_question_data = execute_database_command(db_connection,command,data)
        question = get_question_data[1].fetchone()
    print(question)
    return question
def get_random_id_command():
    return """SELECT CASE WHEN uuid = 0 THEN 1 ELSE uuid END
from(SELECT ROUND(RANDOM() * (SELECT MAX(uuid) FROM original_questions)) as uuid) as r;
"""

def main():
    get_random_question()
if __name__ == "__main__":
    main()
