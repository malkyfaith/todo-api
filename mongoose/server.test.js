const expect = require('expect');
const request = require('supertest');
const {
  app
} = require('./server');
const {
  Todo
} = require('./models/todo');

const mock_Todos = [{
  "text": "mock text 1"
}, {
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
