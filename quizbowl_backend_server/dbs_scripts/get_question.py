from .write_and_read_to_database import *
from .get_data_from_database import *
from .execute_db import *
from .create_database import *
from datetime import datetime

def get_random_question():
    db_connection = connect_to_datbase("localhost","smalani","trivia_app_db") # IO
    question_id = get_random_id_command()
    id_data = execute_database_command(db_connection,question_id)
    id = int(id_data[1].fetchone()[0])
    get_random_question = get_from_where_db("original_questions","uuid",id)
    get_question_data = execute_database_command(db_connection,get_random_question)
    return get_question_data[1].fetchone()


def get_many_questions():
    db_connection = connect_to_datbase("localhost","smalani","trivia_app_db") # IO
    questions = []
    for _ in range(10):
        question_id = get_random_id_command()
        id_data = execute_database_command(db_connection,question_id)
        questions.append(int(id_data[1].fetchone()[0]))
        get_random_question = get_from_where_db("original_questions","uuid",id)
        get_question_data = execute_database_command(db_connection,get_random_question)
        questions.append(get_question_data[1].fetchall())
    print(questions)
    return questions    

def get_random_id_command():
    return """SELECT CASE WHEN uuid = 0 THEN 1 ELSE uuid END
from(SELECT ROUND(RANDOM() * (SELECT MAX(uuid) FROM original_questions)) as uuid) as r;
"""

def main():
    get_random_question()
if __name__ == "__main__":
    main()
