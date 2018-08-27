const {
  ObjectID
} = require('mongodb');
const {
  Todo
} = require('../models/todo');
const {
  User
} = require('../models/user');
const jwt = require('jsonwebtoken');

const mock_Todos = [{
  _id: new ObjectID(),
  "text": "mock text 1"
}, {
  _id: new ObjectID(),
  "text": "mock text 2",
  completed: true,
  completedAt: 333
}];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(mock_Todos)
  }).then(() => done());
}

const id1 = new ObjectID();
const id2 = new ObjectID();
const user_mock = [{
    _id: id1,
    email: 'test@test.com',
    password: 'test123',
    tokens: [{
      'access': 'auth',
      'token': jwt.sign({
        _id: id1,
        access: 'auth'
      }, '123abc').toString()
    }]
  },
  {
    _id: id2,
    email: 'test2@test.com',
    password: '2test123'
  }
];

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var user1 = new User(user_mock[0]).save();
    var user2 = new User(user_mock[1]).save();
    return Promise.all([user1, user2]);;
  }).then(() => done());
}

module.exports = {
  populateTodos,
  mock_Todos,
  user_mock,
  populateUsers
};
