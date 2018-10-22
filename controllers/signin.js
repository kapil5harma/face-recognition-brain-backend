const handleSignin = (db, bcrypt) => (req, res) => {
  // console.log('Post /signin');
  // console.log('req: ', req.body);
  // res.json(`${req.url} is working!`);

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json('Incorrect Form Submission');
  }

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
};

module.exports = {
  handleSignin: handleSignin
};
