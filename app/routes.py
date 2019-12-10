from flask import request, render_template, jsonify
from app import app
from app.model import * # import all of the variables and functions from model.py

@app.route('/', methods=['GET'])
@app.route('/index', methods=['GET'])
def index():
  # get or assign default display values
  try:
    emojis = learn_emoji
  except:
    emojis = []
  
  try:
    creator = created_by
  except:
    creator = None
  
  try:
    explanation = explain_ml
  except:
    explanation = None
  
  try:
    stylesheet = use_stylesheet
  except:
    stylesheet = None

  return render_template(
    'index.html', 
    emojis=emojis,
    creator=creator,
    explanation=explanation,
    stylesheet=stylesheet
  )

@app.route("/train", methods=['POST'])
def train():
  data = request.json 
  try:
    result = save_sample(data)
    if result:
      data["collection"] = "complete"
  except:
    data["collection"] = "failed"
  
  try:
    samples = load_training_data()
    training = update_training()
    if training:
      data.update(training)
      data["samples"] = samples
      data["training"] = "complete"
  except:
    data["training"] = "failed"

  return jsonify(data)

@app.route("/guess", methods=['POST'])
def guess():
  data = request.json
  try: 
    result = predict(data)
    if result:
      data.update(result)
      data["prediction"] = "complete"
  except:
    data["prediction"] = "failed"

  return jsonify(data)

@app.route("/delete", methods=['POST'])
def delete():
  data = request.json
  try:
    delete_samples()
    data["deletion"] = "complete"
  except:
    data["deletion"] = "failed"
  
  return jsonify(data)
