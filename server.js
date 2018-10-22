const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'kapil5harma',
    password: '',
    database: 'face-recognition-brain'
  }
});

// console.log('db.select: ', db.select('*').from('users'));
// db.select('*')
//   .from('users')
//   .then(data => {
//     console.log('data: ', data);
//   });

const app = express();

const port = 3001;
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  // res.send(`${req.url} is working!`);
  // console.log('Get /');
  // res.json(database.users);
  res.json(`It's working!`);
});

// app.post('/signin', signin.handleSignin(db, bcrypt)(req, res));
app.post('/signin', (req, res) => {
  signin.handleSignin(req, res, db, bcrypt);
});

app.post('/register', (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

app.get('/profile/:id', (req, res, db) => {
  profile.handleProfileGet(req, res, db);
});

app.put('/image', (req, res) => {
  image.handleImage(req, res, db);
});

app.post('/imageurl', (req, res) => {
  image.handleApiCall(req, res);
});
let x = process.env.port || port;
app.listen(x, () => {
  console.log('App is running on port:', x);
});
