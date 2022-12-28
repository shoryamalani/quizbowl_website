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
    execute_db.execute_database_command(conn,a.get_sql())
    return {"token":token}

def login(user_id,token):
    conn = get_data_from_database.connect_to_datbase()
    users = pypika.Table("users")
    a = pypika.Query.from_(users).select("user_token").where(users.UUID == user_id).where(users.user_token == token)
    response = execute_db.execute_database_command(conn,a.get_sql())
    #incresase sign in count
    #update last sign in
    if response[1].rowcount == 1:
        a = pypika.Query.update(users).set("sign_in_count",users.sign_in_count + 1).set("last_sign_in",functions.Now()).where(users.UUID == user_id)
        execute_db.execute_database_command(conn,a.get_sql())
        return {"status":"success"}
    else:
        return {"status":"failed"}