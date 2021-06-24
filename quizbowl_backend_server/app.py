#Dependencies
from flask import Flask,render_template,session,redirect,url_for,jsonify,send_from_directory
from random import randint

# App stuff
app = Flask(__name__)

#Routers
@app.route("/",methods=["GET"])
def home():
    return render_template("index.html")

@app.route("/echo/<text>")
def repeat(text):
    return render_template("text.html",txt=text)


@app.route("/get_question")
def return_template_question():
    questions = [{"question":"Who was the first president of the United States","questionId":0,"answer":"George Washington"},{"question":"When was the constitution written","questionId":1,"answer":"1776"},{"question":"How tall is the Statue of Liberty","questionId":2,"answer":"305 feet"}]
    return jsonify(questions[randint(0,2)])


#Run
if __name__ == "__main__":
    app.run(host="0.0.0.0",port=5000)
