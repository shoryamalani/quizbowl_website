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
    a = pypika.Query.into(users).columns("UUID",'sign_in_count',"last_sign_in","user_token","created_at","questions_attempted","questions_correct","xp","rank","user_data")
    user_id = str(uuid.uuid4())
    token = str(uuid.uuid4())
    a.insert(user_id,0,functions.Now(),token,functions.Now,0,0,0,0,json.jsonify({})) 
    execute_db.execute_database_command(conn,a.get_sql())
    return {"user_id":user_id,"token":token}


