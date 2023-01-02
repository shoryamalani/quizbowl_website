from dbs_scripts import get_data_from_database, get_question
from dbs_scripts import execute_db
import pypika
from pypika import functions
import uuid
import json
import datetime
from random import choice
from misc_scripts.parse_answer import parse_question
import string
import random
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
    a = pypika.Query.from_(users).select("*").where(users.public == True)
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

# if __name__ == "__main__":
#     print(add_public_column_to_users())

def get_game_from_round(user,time):
    conn = get_data_from_database.connect_to_datbase()
    users = pypika.Table("users")
    a = pypika.Query.from_(users).select(users.user_data).where(users.user_token == user)
    response = execute_db.execute_database_command(conn,a.get_sql())
    if response[1].rowcount == 1:
        user = response[1].fetchone()
        user_info = user[-1]
        for round in user_info["rounds"]:
            if round["time"] == time:
                return {"questions":get_round_questions(round)}
    else:
        return {"status":"failed"}
    
def get_round_questions(round):
    questions = []
    question = 0
    while question < len(round["questions"]):
        questions.append(make_question_response(get_question_from_db(round["questions"][question])))
        question += 1
    return questions

def get_question_from_db(questionId):
    original_questions = pypika.Table("original_questions")
    a = pypika.Query.from_(original_questions).select("*").where(original_questions.uuid == questionId)
    conn = get_data_from_database.connect_to_datbase()
    print(a.get_sql())
    res = execute_db.execute_database_command(conn,a.get_sql())
    if res[1].rowcount == 1:
        return res[1].fetchone()
    else:
        return {"status":"failed"}

def update_user_public(token,public):
    conn = get_data_from_database.connect_to_datbase()
    users = pypika.Table("users")
    a = pypika.Query.update(users).set(users.public, public).where(users.user_token == token)
    res = execute_db.execute_database_command(conn,a.get_sql())
    res[0].commit()
    return {"status":"success"}



def save_answerline(token,answerline):
    conn = get_data_from_database.connect_to_datbase()
    users = pypika.Table("users")
    a = pypika.Query.select("*").where(users.user_token == token)
    res = execute_db.execute_database_command(conn,a.get_sql())
    if res[1].rowcount == 1:
        user = res[1].fetchone()
        user_info = user[-1]
        user_info["answerlines_to_learn"].append(answerline)
        a = pypika.Query.update(users).set(users.user_data, json.dumps(user_info)).where(users.user_token == token)
        res = execute_db.execute_database_command(conn,a.get_sql())
        res[0].commit()
        return {"status":"success"}
    else:
        return {"status":"failed"}

def create_room(token,topics):
    conn = get_data_from_database.connect_to_datbase()
    no_room_id = True
    while no_room_id:
        room_id = random.randint(1000000,9999999)
        if not get_room_by_id(room_id):
            no_room_id = False
    rooms = pypika.Table("rooms")
    user = get_user(token)
    a = pypika.Query.into(rooms).columns(rooms.id,rooms.name,rooms.owner,rooms.users,rooms.settings,rooms.public,rooms.created_at,rooms.join_code,rooms.active).insert(room_id,user[1] + "'s Room",token,json.dumps([token]),json.dumps({"rounds":[],"settings":{"speechSpeed":4,"difficulty":11,"topics":topics}, "current_round":0,"current_round_points":{},"users":[token],"all_user_points":{}}),True,functions.Now(),"".join([random.choice(string.ascii_letters) for _ in range(4)]).lower(),True)
    res = execute_db.execute_database_command(conn,a.get_sql())
    res[0].commit()
    return {"status":"success","room_id":room_id}

def get_room_by_id(room_id):
    conn = get_data_from_database.connect_to_datbase()
    rooms = pypika.Table("rooms")
    a = pypika.Query.from_(rooms).select("*").where(rooms.id == room_id)
    res = execute_db.execute_database_command(conn,a.get_sql())
    if res[1].rowcount == 1:
        return res[1].fetchone()
    else:
        return False

def get_all_rooms():
    conn = get_data_from_database.connect_to_datbase()
    rooms = pypika.Table("rooms")
    a = pypika.Query.from_(rooms).select("*").where(rooms.active == True)
    res = execute_db.execute_database_command(conn,a.get_sql())
    if res[1].rowcount > 0:
        return res[1].fetchall()
    else:
        return []

def create_rooms_table():
    conn = get_data_from_database.connect_to_datbase()
    a = pypika.Query.create_table("rooms").columns(
        pypika.Column('id', "int", nullable=False),
        pypika.Column('name', "varchar", nullable=False),
        pypika.Column('owner', "varchar", nullable=False),
        pypika.Column('users', 'JSON', nullable=False),
        pypika.Column('settings', 'JSON', nullable=False),
        pypika.Column('active', "BOOLEAN", nullable=False),
        pypika.Column('created_at', "TIMESTAMP", nullable=False),
        pypika.Column('public', "BOOLEAN", nullable=False),
        pypika.Column('join_code', "varchar", nullable=False)

    ).if_not_exists().primary_key('id')
    res = execute_db.execute_database_command(conn,a.get_sql())
    res[0].commit()
    return {"status":"success"}

def join_room(room_id,token):
    conn = get_data_from_database.connect_to_datbase()
    rooms = pypika.Table("rooms")
    a = pypika.Query.from_(rooms).select("*").where(rooms.id == room_id)
    res = execute_db.execute_database_command(conn,a.get_sql())
    if res[1].rowcount == 1:
        room = res[1].fetchone()
        room_users = room[3]
        room_users.append(token)
        room_info = room[4]
        room_info["users"].append(token)
        a = pypika.Query.update(rooms).set(rooms.users, json.dumps(room_users)).set(rooms.settings,json.dumps(room_info)).where(rooms.id == room_id)
        res = execute_db.execute_database_command(conn,a.get_sql())
        res[0].commit()
        return {"status":"success", "room_id":room_id,"room_info":room_info,"room_users":get_users(room_users)}
    else:
        return {"status":"failed"}

def start_room_game(room_id,settings={}):
    conn = get_data_from_database.connect_to_datbase()
    rooms = pypika.Table("rooms")
    a = pypika.Query.from_(rooms).select("*").where(rooms.id == room_id)
    res = execute_db.execute_database_command(conn,a.get_sql())
    if res[1].rowcount == 1:
        room = res[1].fetchone()
        room_info = room[4]
        if settings:
            room_info["settings"] = settings
        print(room_info)
        room_info["current_round"] += 1
        topics = room_info["settings"]["topics"]
        a = pypika.Query.update(rooms).set(rooms.settings, json.dumps(room_info)).where(rooms.id == room_id)
        res = execute_db.execute_database_command(conn,a.get_sql())
        res[0].commit()
        topics_to_get = []
        for key,value in topics.items():
            if value:
                topics_to_get.append(key)
        topics = make_topics_to_get(topics_to_get,16)
        questions = get_round_questions_with_settings(room_info["settings"]["difficulty"],topics)
        return {"status":"success","questions":questions,"roomId":room[0]}
    else:
        return {"status":"failed"}
def make_topics_to_get(topics_to_get,questions):
    final_topics_to_get = {}
    for _ in range(int(questions/len(topics_to_get))):
        for x in topics_to_get:
            if x not in final_topics_to_get:
                final_topics_to_get[x] = 1
            else:
                final_topics_to_get[x] += 1
    questions_left = questions % len(topics_to_get)
    for _ in range(questions_left):
        final_topics_to_get[choice(topics_to_get)] += 1 
    return final_topics_to_get

def get_round_questions_with_settings(difficulty,topics):
    final_questions = []
    if difficulty == 11:
        for item,value in topics.items():
            for x in range(value):
                question = get_question.get_full_question_with_specific_difficulty_and_topic(difficulty=random.randint(1,9),topic=item)
                final_questions.append(make_question_response(question))
    else:
        for item,value in topics.items():
            for x in range(value):
                question = get_question.get_full_question_with_specific_difficulty_and_topic(difficulty=difficulty,topic=item)
                final_questions.append(make_question_response(question))
    random.shuffle(final_questions)
    return final_questions

def make_question_response(question):
    return {"question":parse_question(question[3]),"answer":question[4],"questionId":question[0],"topic":question[9],"difficulty":question[8]}

def leave_room(room_id,token):
    conn = get_data_from_database.connect_to_datbase()
    rooms = pypika.Table("rooms")
    a = pypika.Query.from_(rooms).select("*").where(rooms.id == room_id)
    res = execute_db.execute_database_command(conn,a.get_sql())
    if res[1].rowcount == 1:
        room = res[1].fetchone()
        room_info = room[4]
        room_info["users"].remove(token)
        if room[2] == token and len(room_info["users"]) > 0:
            owner = choice(room_info["users"])
            a = pypika.Query.update(rooms).set(rooms.owner, owner).set(rooms.room_users, json.dumps(room_info["users"])).where(rooms.id == room_id)
        elif len(room_info["users"]) == 0:
            return deactivate_room(room_id)
        else:
            a = pypika.Query.update(rooms).set(rooms.room_users, json.dumps(room_info["users"])).where(rooms.id == room_id)
        res = execute_db.execute_database_command(conn,a.get_sql())
        res[0].commit()
        return {"status":"success","users":room_info["users"],"roomId":room[0]}
    else:
        return {"status":"failed"}

def deactivate_room(room_id):
    conn = get_data_from_database.connect_to_datbase()
    rooms = pypika.Table("rooms")
    a = pypika.Query.update(rooms).set(rooms.active, False).where(rooms.id == room_id)
    res = execute_db.execute_database_command(conn,a.get_sql())
    res[0].commit()
    if res[1].rowcount == 1:
        return {"status":"success"}
    else:
        return {"status":"failed"}
    
def get_users(users):
    final_users = []
    for user in users:
        final_users.append(get_user(user))
    return final_users

if __name__ == "__main__":
    # print(leave_room("7028631","9d0cb7f3-d8da-410a-a154-ecb2c13698b4"))
    # print(create_room("9d0cb7f3-d8da-410a-a154-ecb2c13698b4",{
    #   "14": True,
    #   "15": True,
    #   "16": True,
    #   "17": True,
    #   "18": True,
    #   "19": True,
    #   "20": True,
    #   "21": True,
    #   "22": True,
    #   "25": True,
    #   "26": True,
    # }))
    # print(join_room("8511570","8989b4a2-0400-4638-8b89-747943e967f0"))
    print(start_room_game("6634626"))
    # create_rooms_table()