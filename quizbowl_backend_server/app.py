#Dependencies
from flask import Flask,render_template,session,redirect,url_for,jsonify,send_from_directory
from random import randint
from dbs_scripts.get_question import *
# App stuff
app = Flask(__name__)

#Routers
# @app.route("/",methods=["GET"])
# def home():
#     return render_template("index.html")

# @app.route("/echo/<text>")
# def repeat(text):
#     return render_template("text.html",txt=text)


@app.route("/get_question")
def return_template_question():
    # questions = [{"question":"Who was the first president of the United States? This moron had white hair.","questionId":0,"answer":"George Washington"},{"question":"When was the constitution written","questionId":1,"answer":"1776"},{"question":"How tall is the Statue of Liberty","questionId":2,"answer":"305 feet"},{"question":"Who is the most epic of the four Malani cousins","questionId":3,"answer":"Arnav"},{"question":"Who wrote the Great Gatsby","questionId":4,"answer":"Francis Scott Fitzgerald"},{"question":"Who is the best Mom","questionId":5,"answer":"Shailaja Malani"}]
    # question_to_answer = questions[randint(0,5)]
    # question_to_answer["question"] = question_to_answer["question"].split()
    question = get_random_question()
    question_to_answer = {"question":question[2].replace("&apos;","'").split(),"questionId":question[0],"answer":question[4]}

    return jsonify(question_to_answer)

@app.route("/get_round_questions")
# get many questions in one round
def return_template_questions():
    questions = get_many_questions()
    final_questions = []
    for question in questions:
        print(question)
        print(question[2])
        question[2] = question[2].replace("&apos;","'").split()
        final_questions.append({"question":question[2],"questionId":question[0],"answer":question[4]})
    return jsonify(final_questions)





#Run
if __name__ == "__main__":
    app.run(host="0.0.0.0",port=5000)
