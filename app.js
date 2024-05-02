const path = require("path");
const bodyParser = require("body-parser");
const words = require("./dictionary/words").words;
var word;

const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.get("/getWord", (request, response, next) => {
  let randomedWords = words[Math.floor(Math.random() * words.length)];
  let uppercasedWords = randomedWords.toUpperCase();
  var wordToday = uppercasedWords;
  word = uppercasedWords;
  response.send(wordToday);
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
