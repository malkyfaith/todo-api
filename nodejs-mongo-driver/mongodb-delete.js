const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to DB server');
  }
  console.log('Connected to DB server');
  // which db to connet
  const db = client.db('TodoApp');

  //delete many users
  // db.collection('Users').deleteOne({name:'Harpal'}).then((result) => {
  //   console.log(result);
  // });

  db.collection('Users').findOneAndDelete({name:'Amar'}).then((result) => {
    console.log(result);
  });

  client.close();
});
