console.log(process.env.NODE_ENV)
var env = process.env.NODE_ENV || 'development';
console.log('env *****' + env);

if (env === 'development') {
  process.env.mongodb_URI = 'mongodb://localhost:27017/TodoApp';
  process.env.PORT = 3000;
} else if (env === 'test') {
  process.env.mongodb_URI = 'mongodb://localhost:27017/TodoApp_Test';
  process.env.PORT = 3001;
}


const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {
  authenticate
} = require('./middleware/authentication');
const {
  ObjectID
} = require('mongodb');

const {
  Todo
} = require('./models/todo');
const {
  User
} = require('./models/user');

const app = express();

const port = process.env.PORT;

//middleware
app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
  let todo = new Todo({
    text: req.body.text,
    creator: req.user._id
  });

  todo.save().then((doc) => {
    console.log(JSON.stringify(doc));
    res.send(doc);
  }, (err) => res.status(400).send(err));
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    creator: req.user._id
  }).then(todos => {
    res.send({
      todos
    });
  }, (e) => res.status(400).send(e));
});

// GET by id
app.get('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id;
  // check if id is valid
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  // findById
  // success
  // if todo - 200 and return body
  // if not found - 404 and return empty body
  // error
  // 400 - and return empty body back
  Todo.findOne({
      _id: id,
      creator: req.user._id
    })
    .then(doc => {
      if (!doc)
        return res.status(404).send();
      res.status(200).send({
        todo: doc
      });
    })
    .catch(e => {
      res.status(400).send();
    })
});

// DELETE by id
app.delete('/todos/:id', authenticate, (req, res) => {
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
  Todo.findOneAndRemove({
      _id: id,
      creator: req.user._id
    })
    .then(todo => {
      console.log('found:' + todo);
      if (!todo)
        return res.status(404).send();
      res.status(200).send({
        todo
      });
    })
    .catch(e => {
      res.status(400).send();
    })
});

// update by id
app.patch('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ['text', 'completed']);
  console.log(body);
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime()
  } else {
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({
    _id: id,
    creator: req.user._id
  }, {
    $set: body
  }, {
    new: true
  }).then((todo) => {
    if (!todo)
      return res.status(404).send();
    res.send({
      todo
    });
  }).catch(e => res.status(400).send())
});


// User apis
app.post('/users', (req, res) => {
  // console.log('req.body:'+ JSON.stringify(req.body))
  let body = _.pick(req.body, ['email', 'password']);
  let user = new User(body);

  user.save().then((user) => {
    return user.generateAuthToken();
  }).then(token => {
    res.header('x-auth', token).send(user);
  }).catch(e => {
    res.status(400).send(e);
  });
});



// GET users/me
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

// POST users/login
app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then(user => {
    return user.generateAuthToken().then(token => {
      res.header('x-auth', token).send(user)
    });
  }).catch(err => {
    res.status(400).send();
  });
});



app.listen(port, () => {
  console.log(`Listening at ${port}`);
});


module.exports = {
  app
};
