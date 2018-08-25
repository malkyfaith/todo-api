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

  //read Users
  db.collection('Users').find({
    _id: new ObjectID('5b80e4bf3ec8ef2634756a73')
  }).toArray().then((doc) => {
    console.log(`Users`);
    console.log(JSON.stringify(doc, undefined, 2));
  }, (err) => {
    console.log(`Unable to fetch ${err}`);
  })

  //  read Todos
  db.collection('Todos').find().toArray().then(docs => {
    console.log('Todos');
    console.log(JSON.stringify(docs, undefined, 2))
  }, (err) => {
    console.log('Unable to fetch the doc' + err);
  });

  client.close();
});
