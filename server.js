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
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});

// console.log('db.select: ', db.select('*').from('users'));
// db.select('*')
//   .from('users')
//   .then(data => {
//     console.log('data: ', data);
//   });

const app = express();

var whitelist = [
  'https://face-recognition-front-end.herokuapp.com/',
  'https://face-recognition-brain-backend.herokuapp.com/'
];
var corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

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

app.post('/imageurl', cors(corsOptions), (req, res) => {
  image.handleApiCall(req, res);
});
let x;
app.listen((x = process.env.PORT || port), () => {
  console.log('App is running on port:', x);
});
