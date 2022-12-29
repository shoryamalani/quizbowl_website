from dbs_scripts import get_data_from_database
from dbs_scripts import execute_db
import pypika
from pypika import functions
import uuid
import json
# user functions
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
    users = pypika.Table("users")
    a = pypika.Query.into(users).columns('sign_in_count',"last_sign_in","user_token","created_at","questions_attempted","questions_correct","xp","rank","user_data")
    token = str(uuid.uuid4())
    a = a.insert(0,functions.Now(),token,functions.Now(),0,0,0,0,json.dumps({})) 
    print(a.get_sql())
    res = execute_db.execute_database_command(conn,a.get_sql())
    res[0].commit()
    return {"token":token}

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
        return {"status":"failed"}

def log_question_attempt(questionId,correct_or_not):
    original_questions = pypika.Table("original_questions")
    # add one to attepted and correct if correct
    a = pypika.Query.update(original_questions).set("attempts",original_questions.attempts + 1)
    if correct_or_not:
        a = a.set("correct",original_questions.correct + 1)
    a = a.where(original_questions.question_id == questionId)
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
    final_round_save = {'questions':[],'points':[]}
    question_num = 0
    added_xp = 0
    for points in round_data["round_points"]:
        if points > 0:
            user_data["questions_correct"] += 1
            user_data["difficulty_cumulative"] += round_data["game_questions"][question_num]['difficulty']
            user_data["categories"][round_data["game_questions"][question_num]['category']]["questions_correct"] += 1
            added_xp += points * round_data["game_questions"][question_num]['difficulty']
        user_data["categories"][round_data["game_questions"][question_num]['category']]["questions_attempted"] += 1
        final_round_save['questions'].append(round_data["game_questions"][question_num]['questionId'])
        user_data["questions_attempted"] += 1
        final_round_save['points'].append(points)
        question_num += 1
    return final_round_save,user_data,added_xp

def update_user_data_with_new_round(token,user_info,more_xp,round):
    conn = get_data_from_database.connect_to_datbase()
    users = pypika.Table("users")
    user_info["rounds"].append(round)
    a = pypika.Query.update(users).set(users.user_data == json.dumps(user_info)).set('xp', users.xp +more_xp).where(users.user_token == token)
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