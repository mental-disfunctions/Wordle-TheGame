const path = require("path");
const bodyParser = require("body-parser");
const words = require("./dictionary/words").words;
const wordToday = require("./dictionary/todaywords").todayword;
var word;

const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.get("/getTodayWord", (request, response, next) => {
  let randomedWords = wordToday[Math.floor(Math.random() * wordToday.length)];
  let uppercasedWords = randomedWords.toUpperCase();
  word = uppercasedWords;
  response.send(word);
});
app.get("/isIncluded", (request, response, next) => {
    response.json(JSON.stringify({
        isInDict:words.includes(request.query.word),
        isThisWord:word===request.query.word,
    }));
});

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

const server = app.listen(port, () => console.log(`App listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
