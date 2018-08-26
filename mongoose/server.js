const express = require('express');
const bodyParser = require('body-parser');
const {
  ObjectID
} = require('mongodb');

const {
  Todo
} = require('./models/todo');

const app = express();

const port = process.env.PORT || 3000;

//middleware
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  let todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    console.log(JSON.stringify(doc));
    res.send(doc);
  }, (err) => res.status(400).send(err));
});

app.get('/todos', (req, res) => {
  Todo.find({}).then(todos => {
    res.send({
      todos
    });
  }, (e) => res.status(400).send(e));
});

// GET by id
app.get('/todos/:id', (req, res) => {
  const id = req.params.id;
  // check if id is valid
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  // findById
  // success
  // if todo - 200 and return body
  // if not - 404 and return empty body
  // error
  // 400 - and return empty body back
  Todo.findById(id)
    .then(doc => {
      if(!doc)
        return res.status(404).send();
      res.status(200).send({todo:doc});
    })
    .catch(e => {
      res.status(400).send();
    })
});

// DELETE by id
app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;
  // check if id is valid
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  // findById
  // success
  // if todo - 200 and return body
  // if not - 404 and return empty body
  // error
  // 400 - and return empty body back
  Todo.findByIdAndRemove(id)
    .then(todo => {
      if(!todo)
        return res.status(404).send();
      res.status(200).send({todo});
    })
    .catch(e => {
      res.status(400).send();
    })
});

app.listen(port, () => {
  console.log(`Listening at ${port}`);
})


module.exports = {
  app
};
