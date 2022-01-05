# SELECT * FROM original_questions TABLESAMPLE SYSTEM(1) where difficulty=8 and topic=19 and status=1 limit 1;
from write_and_read_to_database import *
from get_data_from_database import *
from execute_db import *
current_db_g = "trivia_app_db"
db_connection = connect_to_datbase("localhost","smalani",current_db_g) # IO
all_questions = {}
while len(all_questions) < 349:
    print(356 - len(all_questions))
    id_data = execute_database_command(db_connection,"SELECT uuid FROM original_questions TABLESAMPLE SYSTEM(1) where difficulty=8 and topic=19 and status=1 limit 1;")
    id = id_data[1].fetchone()
    if id != None:
        id = id[0]
    if id in all_questions:
        all_questions[id] += 1
    else:
        all_questions[id] = 1
print(all_questions)