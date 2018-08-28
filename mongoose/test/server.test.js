const expect = require('expect');
const request = require('supertest');
const {
  ObjectID
} = require('mongodb');
const {
  app
} = require('../server');
const {
  Todo
} = require('../models/todo');
const {
  User
} = require('../models/user');

const {
  mock_Todos,
  populateTodos,
  user_mock,
  populateUsers
} = require('./seed');

beforeEach(populateTodos);
beforeEach(populateUsers);
// POST /todos
describe('POST /todos', () => {
  it('should create new todo', (done) => {
    var text = 'Test todo text';
    request(app)
      .post('/todos')
      .set('x-auth', user_mock[0].tokens[0].token)
      .send({
        text
      })
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) return done(err);
        Todo.find({
          text
        }).then(todos => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch(err => done(err));
      })
  });

  it('should not create new todo with invalid body', (done) => {
    var text = 'Test todo text';
    request(app)
      .post('/todos')
      .set('x-auth', user_mock[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        Todo.find().then(todos => {
          expect(todos.length).toBe(2);
          done();
        }).catch(err => done(err));
      })
  });
});

// GET /todos
describe('GET /todos', () => {
  it('should get todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', user_mock[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

// GET /todos/:id
describe('GET /todos/:id', () => {
  it('should get todo by correct id', (done) => {
    request(app)
      .get(`/todos/${mock_Todos[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(mock_Todos[0].text);
      })
      .end(done);
  });
  it('should return 404 if todo not found', (done) => {
    var newkey = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${newkey}`)
      .expect(404)
      .end(done);
  });
  it('should return 404 if id structure is not valid', (done) => {
    request(app)
      .get(`/todos/123abc`)
      .expect(404)
      .end(done);
  });
});

//DELETE /todos/:id
describe('DELETE /todos/:id', () => {
  it('should delete the todo by correct id', (done) => {
    request(app)
      .delete(`/todos/${mock_Todos[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(mock_Todos[0].text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.findById(mock_Todos[0]._id.toHexString()).then(todo => {
          expect(null).toNotExist();
          done();
        }).catch(e => done(e));
      });
  });
  it('should return 404 if todo not found', (done) => {
    var newkey = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${newkey}`)
      .expect(404)
      .end(done);
  });
  it('should return 404 if id structure is not valid', (done) => {
    request(app)
      .delete(`/todos/123abc`)
      .expect(404)
      .end(done);
  });
});

// PATCH /todos/:id
describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    let id = mock_Todos[0]._id.toHexString();
    request(app)
      .patch(`/todos/${id}`)
      .send({
        completed: true
      })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);
  });
  it('should clear completedAt when todo is not completed', (done) => {
    let id = mock_Todos[0]._id.toHexString();
    request(app)
      .patch(`/todos/${id}`)
      .send({
        completed: false
      })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBe(null);
      })
      .end(done);
  });
});

//GET /users/me
describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', user_mock[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(user_mock[0]._id.toHexString());
        expect(res.body.email).toBe(user_mock[0].email);
      })
      .end(done);
  });
  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', 'asd')
      .expect(401)
      .end(done);
  });
});

// POST /users
describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'example@example.com';
    var password = '123mnb!';

    request(app)
      .post('/users')
      .send({
        email,
        password
      })
      .expect(200)
      .expect(res => {
        expect(res.body.email).toBe(email);
        expect(res.body._id).toExist();
        expect(res.header['x-auth']).toExist();
      })
      .end(err => {
        if (err) {
          return done(err);
        }
        User.findOne({
          email
        }).then(doc => {
          expect(doc).toExist();
          expect(doc.password).toNotBe(password);
          done();
        })
      });
  });

  it('should not create a user with duplicate email', (done) => {
    request(app)
      .post('/users')
      .send({
        'email': user_mock[0].email,
        'password': user_mock[0].password
      })
      .expect(400)
      .end(done);
  });

  it('should check the validation', (done) => {
    request(app)
      .post('/users')
      .send({
        'email': 'email',
        'password': '123'
      })
      .expect(400)
      .end(done);
  });

});

// POST /users/login
describe('POST /users/login', () => {
  it('should be login with correct login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: user_mock[1].email,
        password: user_mock[1].password
      })
      .expect(200)
      .expect(res => {
        expect(res.header['x-auth']).toExist();
      })
      .end((err, res) => {
        if (err) done(err);

        User.findById(user_mock[1]._id).then(user => {
          expect(user.email).toBe(user_mock[1].email);
          expect(user.tokens[0]).toInclude({
            access: 'auth',
            token: res.header['x-auth']
          });
          done();
        }).catch(e => done(e))
      })
  });

  it('should invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: user_mock[1].email,
        password: ''
      })
      .expect(400)
      .expect(res => {
        expect(res.header['x-auth']).toNotExist();
      })
      .end(done)
  })
})
