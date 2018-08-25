const express = require('express');
const bodyParser = require('body-parser');

const {
  Todo
} = require('./models/todo');

const app = express()

//middleware
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  console.log(req.body);
  let todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    console.log(JSON.stringify(doc));
    res.send(doc);
  }, (err) =>  res.status(400).send(err));
});

app.listen(3001, () => {
  console.log(`Listening at 3001`);
})
