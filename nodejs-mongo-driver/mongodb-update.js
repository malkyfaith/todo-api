const {
  MongoClient,
  ObjectID
} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to DB server');
  }
  console.log('Connected to DB server');
  // which db to connet
  const db = client.db('TodoApp');

  //update User
  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5b80f0593ec8ef2634756a75')
  }, {
    $set: {
      name: 'Amar'
    },
    $inc: {
      age: 2
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  });

  client.close();
});
