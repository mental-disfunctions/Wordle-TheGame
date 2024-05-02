var wordToday;

fetch("/getWord", { method: "GET" })
  .then((response) => {
    return response.text();
  })
  .then((response) => {
    wordToday = response;
    console.log(response);
  });

var height = 6;
var width = 5;

var row = 0;
var col = 0;

var gameOver = false;

window.onload = function () {
  initialize();
};

function initialize() {
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      let cell = document.createElement("span");
      cell.id = r.toString() + "-" + c.toString();
      cell.classList.add("cell");
      cell.innerText = "";
      document.getElementById("board").appendChild(cell);
    }
  }
}

document.addEventListener("keyup", (e) => {
  if (gameOver) return;

  let typedChar = e.key;
  let typedWord = "";

  for (let c = 0; c < width; c++) {
    let currCell = document.getElementById(row.toString() + "-" + c.toString());
    let letter = currCell.innerText;
    typedWord += letter;
  }
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
    let currCell = document.getElementById(row.toString() + "-" + col.toString());
    currCell.innerHTML = "";
  } else if (e.code == "Enter" && typedWord.length == 5) {
    fetch(`/isIncluded?word=${typedWord.toLowerCase()}`, { method: "GET" })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        return JSON.parse(response);
      })
      .then((json) => {
        console.log(json);
        if (json.isInDict == false) {
          alert(
            `Помилка: Слово "${typedWord}" відсутнє у словнику. Введіть слово, яке є в словнику.`
          );
          return;
        } else {
          update(json);
          row += 1;
          col = 0;
        }
      });
  }
  if (!gameOver && row == height) {
    gameOver = true;
    document.getElementById("answer").innerText = wordToday;
  }
});

function update(obj) {
  let correct = 0;
  let uniqueLetters = new Set();

  for (let c = 0; c < width; c++) {
    let currCell = document.getElementById(row.toString() + "-" + c.toString());
    let letter = currCell.innerText;

    if (wordToday[c] == letter) {
      currCell.classList.add("correct");
      correct += 1;
    } else if (
      wordToday.includes(letter) &&
      !uniqueLetters.has(letter) &&
      wordToday.indexOf(letter) !== c
    ) {
      currCell.classList.add("present");
      uniqueLetters.add(letter);
    } else {
      currCell.classList.add("absent");
    }

    if (correct == width) {
      gameOver = true;
    }

    if (gameOver) {
      setInterval(function () {
        alert("Перемога, конгретулейшн!");
        location.reload();
      }, 1000);
    }
  }
}

document.getElementById("keyboard-cont").addEventListener("click", (e) => {
  const target = e.target;

  if (!target.classList.contains("keyboard-button")) {
    return;
  }
  let key = target.textContent;
  if (key === "Del") {
    if (0 < col && col <= width) {
      col -= 1;
    }
    let currCell = document.getElementById(row.toString() + "-" + col.toString());
    currCell.innerHTML = "";
  }
  if (key === "Enter") {
    let typedWord = "";

    for (let c = 0; c < width; c++) {
      let currCell = document.getElementById(row.toString() + "-" + c.toString());
      let letter = currCell.innerText;
      typedWord += letter;
    }

    if (!FiveLetterWords.includes(typedWord.toLowerCase())) {
      alert(`Помилка: Слово "${typedWord}" відсутнє у словнику. Введіть слово, яке є в словнику.`);
      return;
    }
    update();
    row += 1;
    col = 0;
  }
  document.dispatchEvent(new KeyboardEvent("keyup", { key: key }));
});
