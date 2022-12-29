from dbs_scripts import get_data_from_database
from dbs_scripts import execute_db
import pypika
from pypika import functions
import uuid
import json
import datetime
from random import choice
# user functions
ANIMAL_ADJECTIVES = ['alert','alive','amazing','fast','poisionous','noisy','fierce','aggressive','agile','agitated','intelligent','ferocious','terrifying','bovine','docile','cunning']
with open('animals.txt','r') as f:
    ANIMALS = f.read().splitlines()
def createUser():
    conn = get_data_from_database.connect_to_datbase()
    #pypika make new user in users table
    # uuid
    # username
    # sign_in_count
    # last_sign_in
    # user_token
    # created_at
    # questions_attempted
    # questions_correct
    # xp
    # rank
    # user_data
    found_username = False
    while found_username == False:
        username = choice(ANIMAL_ADJECTIVES).capitalize() + " " + choice(ANIMALS)
        if find_user_by_username(username) == False:
            found_username = True
    users = pypika.Table("users")
    a = pypika.Query.into(users).columns('public','username','sign_in_count',"last_sign_in","user_token","created_at","questions_attempted","questions_correct","xp","rank","user_data")
    token = str(uuid.uuid4())
    a = a.insert(True,username,1,functions.Now(),token,functions.Now(),0,0,0,0,json.dumps(update_user_data({}))) 
    print(a.get_sql())
    res = execute_db.execute_database_command(conn,a.get_sql())
    res[0].commit()
    return {"token":token,'username':username,'status':'success'}

def find_user_by_username(username):
    conn = get_data_from_database.connect_to_datbase()
    users = pypika.Table("users")
    a = pypika.Query.from_(users).select("*").where(users.username == username)
    response = execute_db.execute_database_command(conn,a.get_sql())
    if response[1].rowcount == 1:
        return response[1].fetchone()
    else:
        return False



def get_all_users():
    conn = get_data_from_database.connect_to_datbase()
    users = pypika.Table("users")
    a = pypika.Query.from_(users).select("*")
    response = execute_db.execute_database_command(conn,a.get_sql())
    return response[1].fetchall()



def log_login(token):
    conn = get_data_from_database.connect_to_datbase()
    users = pypika.Table("users")
    a = pypika.Query.from_(users).select("*").where(users.user_token == token)
    response = execute_db.execute_database_command(conn,a.get_sql())
    #incresase sign in count
    #update last sign in
    if response[1].rowcount == 1:
        # print(response[1].fetchone())
        user_info = response[1].fetchone()[-1]
        data = update_user_data(user_info)
        a = pypika.Query.update(users).set("sign_in_count",users.sign_in_count + 1).set("last_sign_in",functions.Now()).set("user_data",json.dumps(data)).where(users.user_token == token)
        res = execute_db.execute_database_command(conn,a.get_sql())
        res[0].commit()
        return {"status":"success"}
    else:
        return {"status":"no user"}

def log_question_attempt(questionId,correct_or_not):
    original_questions = pypika.Table("original_questions")
    # add one to attepted and correct if correct
    a = pypika.Query.update(original_questions).set("attempts",original_questions.attempts + 1)
    if correct_or_not:
        a = a.set("correct",original_questions.correct + 1)
    a = a.where(original_questions.uuid == questionId)
    conn = get_data_from_database.connect_to_datbase()
    print(a.get_sql())
    res = execute_db.execute_database_command(conn,a.get_sql())
    res[0].commit()
    return {"status":"success"}

def update_user_data(user_data):
    if 'version' not in user_data:
        version =  0
    else:
        version = user_data['version']
    if version < 1:
        user_data['version'] = 1
        user_data['questions_attempted'] = 0
        user_data['questions_correct'] = 0
        user_data["rounds"] = []
        user_data["categories"] = {}
        user_data["difficulty_cumulative"] = 0
        user_data["powers"] = 0
        user_data["answerlines_to_learn"] = []
    return user_data
    
def end_round(round_data,user_data):
    final_round_save = {'questions':[],'points':[],'time':datetime.datetime.now().timestamp()}
    question_num = 0
    added_xp = 0
    user_data = user_data[-1]
    for points in round_data["round_points"]:
        if round_data["game_questions"][question_num]['topic'] not in user_data["categories"]:
            user_data["categories"][round_data["game_questions"][question_num]['topic']] = {"questions_attempted":0,"questions_correct":0}
        if points > 0:
            user_data["questions_correct"] += 1
            user_data["categories"][round_data["game_questions"][question_num]['topic']]["questions_correct"] += 1
            added_xp += points * round_data["game_questions"][question_num]['difficulty']
            if points > 10:
                user_data["powers"] += 1
        user_data["difficulty_cumulative"] += round_data["game_questions"][question_num]['difficulty']
        user_data["categories"][round_data["game_questions"][question_num]['topic']]["questions_attempted"] += 1
        final_round_save['questions'].append(round_data["game_questions"][question_num]['questionId'])
        user_data["questions_attempted"] += 1
        final_round_save['points'].append(points)
        question_num += 1
    return final_round_save,user_data,added_xp

def update_user_data_with_new_round(token,user_info,more_xp,round):
    conn = get_data_from_database.connect_to_datbase()
    users = pypika.Table("users")
    user_info["rounds"].append(round)
    a = pypika.Query.update(users).set(users.user_data, json.dumps(user_info)).set('xp', users.xp +more_xp).where(users.user_token == token)
    res = execute_db.execute_database_command(conn,a.get_sql())
    res[0].commit()
    return {"status":"success"}



def get_user(token):
    conn = get_data_from_database.connect_to_datbase()
    users = pypika.Table("users")
    a = pypika.Query.from_(users).select("*").where(users.user_token == token)
    response = execute_db.execute_database_command(conn,a.get_sql())
    if response[1].rowcount == 1:
        return response[1].fetchone()
    else:
        return {"status":"failed"}

def set_user_username(token,username):
    if find_user_by_username(username):
        return {"status":"failed"}
    conn = get_data_from_database.connect_to_datbase()
    users = pypika.Table("users")
    a = pypika.Query.update(users).set(users.username, username).where(users.user_token == token)
    res = execute_db.execute_database_command(conn,a.get_sql())
    res[0].commit()
    return {"status":"success"}

def add_public_column_to_users():
    conn = get_data_from_database.connect_to_datbase()
    users = pypika.Table("users")
    a = pypika.Query.update(users).set(users.public, True)
    res = execute_db.execute_database_command(conn,a.get_sql())
    res[0].commit()
    return {"status":"success"}

if __name__ == "__main__":
    print(add_public_column_to_users())