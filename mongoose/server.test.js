const expect = require('expect');
const request = require('supertest');
const {
  ObjectID
} = require('mongodb');
const {
  app
} = require('./server');
const {
  Todo
} = require('./models/todo');


const mock_Todos = [{
  _id: new ObjectID(),
  "text": "mock text 1"
}, {
  _id: new ObjectID(),
  "text": "mock text 2"
}]
beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(mock_Todos)
  }).then(() => done());
});

describe('POST /todos', () => {
  it('should create new todo', (done) => {
    var text = 'Test todo text';
    request(app)
      .post('/todos')
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

describe('GET /todos', () => {
  it('should get todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

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

describe.only('DELETE /todos/:id', () => {
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
