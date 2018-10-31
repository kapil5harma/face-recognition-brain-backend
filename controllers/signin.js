// const handleSignin = (db, bcrypt) => (req, res) => {
const handleSignin = (req, res, db, bcrypt) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json('Incorrect Form Submission');
  }

  db.select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
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
