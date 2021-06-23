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



#Run
if __name__ == "__main__":
    app.run(host="0.0.0.0",port=5000)