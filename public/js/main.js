var wordToday;

fetch("/getTodayWord", { method: "GET" })
  .then((response) => {
    return response.text();
  })
  .then((response) => {
    wordToday = response;
    if (wordToday === "путін"){
      alert('малорос їбаний')
    }
    console.log(wordToday);
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

// keyups
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
          alert(`Такого слова ${typedWord} немає в словнику`);
          return;
        } else {
          update(json);
          row += 1;
          col = 0;
        }
      });
  }
  if (e.code == "Enter" && typedWord.length != 5) {
    alert("Слово має бути з 5 букв!");
  }
});

// klava
document.getElementById("keyboard-cont").addEventListener("click", (e) => {
  const target = e.target;
  let key = target.textContent;
  let typedWord = "";

  for (let c = 0; c < width; c++) {
    let currCell = document.getElementById(row.toString() + "-" + c.toString());
    let letter = currCell.innerText;
    typedWord += letter;
  }

  if (!target.classList.contains("keyboard-button")) {
    return;
  } else if (key === "Del") {
    if (0 < col && col <= width) {
      col -= 1;
    }
    let currCell = document.getElementById(row.toString() + "-" + col.toString());
    currCell.innerHTML = "";
  } else if (key === "Enter") {
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
          alert(`Такого слова ${typedWord} немає в словнику`);
          return;
        } else {
          update(json);
          row += 1;
          col = 0;
        }
      });
  }
  document.dispatchEvent(new KeyboardEvent("keyup", { key: key }));
});

function update(obj) {
  let correct = 0;
  const button = document.querySelectorAll(".keyboard-button");
  const uniqueLetters = [];

  for (let c = 0; c < width; c++) {
    let currCell = document.getElementById(row.toString() + "-" + c.toString());
    let letter = currCell.innerText;

    if (wordToday[c] === letter) {
      currCell.classList.add("correct");
      correct += 1;
      if (!uniqueLetters.includes(letter)) {
        uniqueLetters.push(letter);
        console.log(uniqueLetters);
      }
      button.forEach(function (button) {
        if (button.textContent == `${letter}`) {
          button.style.backgroundColor = "#6aaa64";
          button.style.color = "white";
        }
      });
    } else if (wordToday.includes(letter) && !uniqueLetters.includes(letter)) {
      console.log(uniqueLetters.includes(letter));
      currCell.classList.add("present");
      button.forEach(function (button) {
        if (button.textContent == `${letter}`) {
          button.style.backgroundColor = "#c9b458";
          button.style.color = "white";
        }
      });
      uniqueLetters.push(letter);
    } else {
      currCell.classList.add("absent");
      button.forEach(function (button) {
        if (button.textContent == `${letter}`) {
          button.style.backgroundColor = "#787c7e";
          button.style.color = "white";
        }
      });
    }

    if (correct == width) {
      gameOver = true;
    }
  }

  if (gameOver) {
    setInterval(function () {
      alert("Перемога, конгретулейшн!");
      location.reload();
    }, 1000);
  }
}
