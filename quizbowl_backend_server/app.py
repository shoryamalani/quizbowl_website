#Dependencies
from flask import Flask,render_template,session,redirect,url_for,jsonify,send_from_directory


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
    question = {"question":"Who was the first president of the United States","questionId":0,"Answer":"George Washington"}
    return jsonify(question)


#Run
if __name__ == "__main__":
    app.run(host="0.0.0.0",port=5000)
