var grid; // assigned by clearDrawing()
var gridSize = 28; // how many colums/rows to have
var cellSize; // calculated by resetCellSize()
var inputSize = 0; // updated by getLiveGuess()
var timeSinceGuess = 0; // updated by getLiveGuess()
var bgColor; // assign in setup()
var drawColor; // assign in setup()
var maxCanvasSize = 1000; // keep canvas from getting too big
var minCanvasSize = 200; // keep canvas from getting too small
var canvasSize; // updated by resetCanvasSize()
var modelIsTrained; // used by getLiveGuess()

// REQUIRED P5.JS FUNCTIONS
function setup() {
  resetCanvasSize();
  createCanvas(canvasSize, canvasSize);
  resetCellSize();
  clearDrawing();
  bgColor = color(50, 50, 50); // dark gray
  drawColor = color(50,170,200); // teal
  moveElementsBelowCanvas();
  train();
}

function draw() {
  background(bgColor);
  noStroke();
  drawGrid(grid);
}

// PAGE UPDATES
function moveElementsBelowCanvas() {
  document.body.appendChild(
    document.getElementById('below-canvas')
  );
}

function windowResized() {
  resetCanvasSize();
  resizeCanvas(canvasSize, canvasSize);
  resetCellSize();
}

function resetCanvasSize() {
  canvasSize = max(min(windowWidth-60, maxCanvasSize),minCanvasSize);
}

function resetCellSize() {
  cellSize = width / gridSize;
}

function updateFromResponse(response) {
  print(response)
  if (response["training"] == "complete") {
    modelIsTrained = true;
  }
  if (response["prediction"] == "complete") {
    document.getElementById("guessed").innerHTML = response["guess"];
  }
  if (response["samples"]) {
    document.getElementById("trained").innerHTML = formatTrainingInfo(response["samples"]);
  }
  if (response["deletion"] == "complete") {
    document.getElementById("trained").innerHTML = "none...";
  }
}

// CANVAS UPDATES
function drawGrid(grid) {
  for (var column = 0; column < grid.length; column++) {
    for (var row = 0; row < grid[0].length; row++) {
      var cellValue = grid[column][row];
      if (cellValue > 0) {
        drawColor.setAlpha(cellValue*255)
        fill(drawColor);
      } else {
        fill(bgColor);
      }
      rect(column * cellSize, row * cellSize + 1, cellSize, cellSize);
    }
  }
}

function addToDrawing() {
  var increment = .3;
  var cellLoc = getcellLoc(mouseX, mouseY);  
  var cellValue = grid[cellLoc[0]][cellLoc[1]];
  
  cellValue += increment;
  cellValue = roundTo(min(1, cellValue),1);
  grid[cellLoc[0]][cellLoc[1]] = cellValue;

  if (cellValue < 1) {
    inputSize += increment;
  }
}

function resetGrid() {
  if (!grid) {
    grid = new Array(gridSize);
    for (var i = 0; i < grid.length; i ++) {
      grid[i] = new Array(gridSize);
    }
  }
  for (var column = 0; column < grid.length; column++) {
    for (var row = 0; row < grid[0].length; row++) {
      grid[column][row] = 0;
    }
  }
}

// USER INTERACTIONS
function mouseDragged() {
  if (onCanvas()) { // don't interfere with other scrolling
    addToDrawing();
    if (getLiveGuess()) {  // live prediction as you draw
      getPrediction();
      timeSinceGuess = 0;
    } else {
      timeSinceGuess += 1;
    }
    return false;
  }
}

function clearDrawing() {
  resetGrid();
  document.getElementById("guessed").innerHTML = "waiting...";
}

// HELPERS
function onCanvas() {
  return (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY < height)
}

function getLiveGuess() {
  if (modelIsTrained && inputSize > 10 && timeSinceGuess > 100) {
    return true;
  }
  return false;
}

function roundTo(value, decimals) {
  var result = parseFloat(value.toFixed(decimals))
  return result;
}

function getcellLoc(x,y) {
  var col = floor(x / cellSize);
  var row = floor(y / cellSize);
  col = max(min(col, gridSize-1),0);
  row = max(min(row, gridSize-1),0);

  return [col, row];
}

function formatTrainingInfo(info) {
  // print(info)
  var result = [];
  for (var label in info) {
    string = label + info[label] + "x";
    result.push(string);
  }
  return result.join("  //  ");
}

// HTTP REQUESTS
function train(value) {
  var dataString = JSON.stringify({collection: "requested", training: "requested"});
  if (value) {
    dataString = JSON.stringify({label: value, features: grid, training: "requested"});
  }
  (async () => {
    const rawResponse = await fetch("/train", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: dataString
    });
    
    const content = await rawResponse.json();
    clearDrawing();
    updateFromResponse(content);
  })();
}

function getPrediction() {
  (async () => {
    const rawResponse = await fetch("/guess", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({features: grid, prediction: "requested"})
    });
    
    const content = await rawResponse.json();
    updateFromResponse(content);
  })();
}

function deleteSamples() {
  (async () => {
    const rawResponse = await fetch("/delete", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({deletion: "requested"})
    });

    const content = await rawResponse.json();
    updateFromResponse(content);
  })();
}
