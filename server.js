const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const knex = require('knex');

const postgres = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'kapil5harma',
    password: '',
    database: 'face-recognition-brain'
  }
});

console.log('postgres.select: ', postgres.select('*').from('users'));

const app = express();

const port = 3001;
app.use(bodyParser.json());
app.use(cors());

const database = {
  users: [
    {
      id: 102,
      name: 'Kapil Sharma',
      email: 'kapil.sharma@beebom.com',
      password: '123123',
      entries: 0,
      joined: new Date()
    },
    {
      id: 100,
      name: 'John',
      email: 'john@mail.com',
      password: 'bananas',
      entries: 0,
      joined: new Date()
    },
    {
      id: 101,
      name: 'Katy',
      email: 'katy@mail.com',
      password: 'mangoes',
      entries: 0,
      joined: new Date()
    }
  ],
  login: [
    {
      id: 987,
      hash: '',
      email: 'john@gmail.com'
    }
  ]
};

app.get('/', (req, res) => {
  // res.send(`${req.url} is working!`);
  console.log('Get /');
  res.json(database.users);
});

app.post('/signin', (req, res) => {
  console.log('Post /signin');
  console.log('req: ', req.body);
  // res.json(`${req.url} is working!`);
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    // res.json('Success');
    res.json(database.users[0]);
  } else {
    res.status(400).json('User Not Found');
  }
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  bcrypt.hash(password, null, null, function(err, hash) {
    console.log('hash: ', hash);
  });
  database.users.push({
    id: 102,
    name: name,
    email: email,
    entries: 0,
    joined: new Date()
  });
  res.json(database.users[database.users.length - 1]);
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach(user => {
    if (user.id == id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) {
    res.status(404).json('No Such User');
  }
});

app.put('/image', (req, res) => {
  // console.log('req.body: ', req.body);
  console.log('Entered "/image"');
  const { id } = req.body;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) {
    res.status(404).json('No Such User');
  }
});

// Bcrypt Hashing of passwords

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//   // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//   // res = false
// });

app.listen(port, () => {
  console.log('App is running on port:', port);
});

/*
/ --> res = ${req.url} is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT = user
*/
