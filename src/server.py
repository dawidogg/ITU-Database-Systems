from flask import *

app = Flask(__name__)

@app.route("/")
def home_page():
    return render_template("index.html")

@app.route("/register")
def register_page():
    return render_template("register.html")

@app.route("/map")
def map_page():
    return render_template("map.html")

@app.route("/calculator")
def calculator_page():
    return render_template("calculator.html")

@app.route("/order")
def order_page():
    return render_template("order.html")

@app.route("/calendar")
def calendar_page():
    return render_template("calendar.html")

@app.route("/admin")
def admin_page():
    return render_template("admin.html")

@app.route("/about")
def about_page():
    return render_template("about.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
