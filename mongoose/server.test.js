const expect = require('expect');
const request = require('supertest');
const {app} = require('./server');
const {Todo} = require('./models/todo');
beforeEach((done) => {
  Todo.remove({}).then(() => done());
})

describe('Post /todos', () => {
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
            Todo.find({}).then(todos => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch(err => done(err));
        })
  })

})


// it('should get todos', (done) => {
//   request(app)
//     .get('/todos')
//     .expect(200)
//     .expect(res=>{
//       expect(res.body.todos[0]).toInclude({
//         text: 'take a break from lunch',
//       });
//       expect(res.body.todos.length).toBe(1);
//     })
//     .end(done);
// });
