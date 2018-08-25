const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to DB server');
  }
  console.log('Connected to DB server');
  // which db to connet
  const db = client.db('TodoApp');

  //insert a document - Todo
  db.collection('Todos').insertOne({
    text: 'Something to do',
    completed: false
  }, (err, result) => {
    if(err) {
      return console.log('Unable to insert' + err);
    }
    console.log('Document inserted' + JSON.stringify(result.ops, undefined, 2));
  });

  //insert a document - User
  db.collection('Users').insertOne({
    name: 'Malkeet',
    location: 'Sydney',
    age: 25
  }, (err, result) => {
    if(err) {
      return console.log('Unable to insert' + err);
    }
    console.log('Document inserted' + JSON.stringify(result.ops, undefined, 2));
  });

  client.close();
});
