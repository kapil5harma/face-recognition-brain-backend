const handleRegister = (req, res, db, bcrypt) => {
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
};

module.exports = {
  handleRegister: handleRegister
};
