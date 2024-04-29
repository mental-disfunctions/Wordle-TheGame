var height = 6;
var width = 5;

var row = 0;
var col = 0;

var gameOver = false;

var word = "РОМАН";

window.onload = function() {
  initialize();
}

function initialize() {
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      let cell = document.createElement("span");
      cell.id = r.toString() + "-" + c.toString();
      cell.classList.add('cell');
      cell.innerText = "";
      document.getElementById('board').appendChild(cell);
    }
  }
}

document.addEventListener("keyup", (e) => {
    if (gameOver) return;
  
    let typedChar = e.key;
  
    if (/^[а-яґєії']$/i.test(typedChar)) {
      if (col < width) {
        let currCell = document.getElementById(row.toString() + "-" + col.toString());
        if (currCell.innerText == "") {
          currCell.innerText = typedChar;
          col += 1;
        }
      }
    } else if (e.code == "Backspace") {
      if (0 < col && col <= width) {
        col -= 1;
      }
      let currCell = document.getElementById(row.toString() + '-' + col.toString());
      currCell.innerHTML = "";
    } else if (e.code == "Enter") {
      update();
      row += 1;
      col = 0;
    }
    if (!gameOver && row == height) {
      gameOver = true;
      document.getElementById('answer').innerText = word;
    }
  });

function update() {
  let correct = 0;
  for (let c = 0; c < width; c++) {
    let currCell = document.getElementById(row.toString() + "-" + c.toString());
    let letter = currCell.innerText;
  
    if (word[c] == letter) {
      currCell.classList.add("correct");
      correct += 1;
    } else if(word.includes(letter)){
      currCell.classList.add('present');
    } else {
      currCell.classList.add('absent');
    }
  
    if (correct == width) {
      gameOver = true;
    } if (gameOver == true){
        setInterval(
            function(){
                alert('Перемога, конгретулейшн!');
            }
        ,1000);
    }
  }
}