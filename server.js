const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const port = 3001;
app.use(bodyParser.json());

const database = {
  users: [
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
  ]
};

app.get('/', (req, res) => {
  // res.send(`${req.url} is working!`);
  res.json(database.users);
});

app.post('/signin', (req, res) => {
  console.log('req: ', req.body);
  // res.json(`${req.url} is working!`);
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json('Success');
  } else {
    res.status(400).json('Error Signing In');
  }
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  database.users.push({
    id: 102,
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date()
  });
  res.json(database.users[database.users.length - 1]);
});

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
