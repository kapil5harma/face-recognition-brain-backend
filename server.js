const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

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
  res.json(database.users);
});

app.post('/signin', (req, res) => {
  // console.log('Post /signin');
  // console.log('req: ', req.body);
  // res.json(`${req.url} is working!`);

  const { email, password } = req.body;
  db.select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then(data => {
      // console.log('\n******\n[/signin]\ndata: ', data);
      const isValid = bcrypt.compareSync(password, data[0].hash);
      // console.log('isValid: ', isValid);
      if (isValid) {
        return db
          .select('*')
          .from('users')
          .where('email', '=', email)
          .then(user => {
            // console.log('user: ', user);
            res.json(user[0]);
          })
          .catch(err => res.status(400).json('User Not Found'));
      } else {
        res.status(400).json('Incorrect email and/or password');
      }
    })
    .catch(err => res.status(400).json('Incorrect email and/or password'));
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;

  const hash = bcrypt.hashSync(password);

  // bcrypt.compareSync('bacon', hash); // true
  // bcrypt.compareSync('veggies', hash); // false
  db.transaction(trx => {
    trx
      .insert({ hash: hash, email: email })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
            name: name,
            email: loginEmail[0],
            joined: new Date()
          })
          .then(user => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch(err => res.status(400).json('Email already exists'));
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*')
    .from('users')
    .where({ id: id })
    .then(user => {
      // console.log('\n ***** ***** ***** ***** ***** \n');
      // console.log('[/profile/:id] user:\n\n', user[0]);
      // console.log('\n ***** ***** ***** ***** ***** \n');
      if (user.length) {
        res.status(200).json(user[0]);
      } else {
        res.status(404).json('User Not Found');
      }
    })
    .catch(err => res.status(404).json('Error getting User'));
});

app.put('/image', (req, res) => {
  // console.log('req.body: ', req.body);
  // console.log('Entered "/image"');
  const { id } = req.body;
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      if (entries.length) {
        res.status(200).json(entries[0]);
      } else {
        res.status(404).json('User Not Found');
      }
    })
    .catch(err => res.status(400).json('Cannot get entries count.'));
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
