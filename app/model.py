### IMPORT HELPERS ###
import json
from sklearn import tree


### CUSTOM DISPLAY VARIABLES ###
# TODO: add global display variables here.
created_by = "Justin J Ramalho"
learn_emoji = ["🙂", "🌈", "💎"]
use_stylesheet = True


### MACHINE LEARNING MODEL VARIABLES ###
# TODO: add machine learning variables here.
training_features = []
training_labels = []
model = tree.DecisionTreeClassifier()


### DATA COLLECTION ###
# TODO: add the collect_sample(data) function here


# TODO: add the save_sample(data) function here.
def save_sample(data):
  if "label" in data.keys() and "features" in data.keys():
    sample = {"label": data["label"], "features":data["features"]}
    data_string = json.dumps(sample)
    text = open("samples.txt","a+")
    text.write(f'{data_string}\n')
    text.close() 
    return True

# TODO: add the delete_samples() function here.
def delete_samples():
  open("samples.txt", "w").close()
  return True


### DATA FORMATTING ###
# TODO: add the load_training_data() function here.
def load_training_data():
  global training_features, training_labels
  training_features = []
  training_labels = [] 
  sample_counts = {}
   
  text=open("samples.txt", "r")
  lines = text.readlines()
  for line in lines:
    data = json.loads(line)
    label = data["label"]
    features = flatten_list(data["features"])
    training_labels.append(label)
    training_features.append(features)
    sample_counts[label] = sample_counts.get(label, 0) + 1

  #print(sample_counts)
  return sample_counts

# TODO: add the flatten_list(list_2d) function here.
def flatten_list(list_2d):
  flat_list = []
  for sublist in list_2d:
    for item in sublist:
      flat_list.append(item)
  return flat_list

'''
 example_list = [["a", "b", "c"],["d", "e", "f"]]
 print(example_list)
 print(flatten_list(example_list))
'''

### MODEL TRAINING ###
# TODO: add the update_training() function here.
def update_training():
  global model, training_features, training_labels
  training_summary = {}
  try:
    model = model.fit(training_features,training_labels)    
    training_summary["tree_depth"] = int(model.get_depth());
    training_summary["tree_leaves"] = int(model.get_n_leaves());

    return training_summary
  except:
    return False


### MODEL PREDICTION ###
# TODO: add the predict(data) function here.
def predict(data):
  global model
  try:
    features = flatten_list(data["features"])
    guess = model.predict([features])
    return { "guess": guess[0] }
  except:
    return None
