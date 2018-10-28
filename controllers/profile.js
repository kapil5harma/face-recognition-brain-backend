const handleProfileGet = (req, res, db) => {
  const { id } = req.params;
  db.select('*')
    .from('users')
    .where({ id: id })
    .then(user => {
      if (user.length) {
        res.status(200).json(user[0]);
      } else {
        res.status(404).json('User Not Found');
      }
    })
    .catch(err => res.status(404).json('Error getting User'));
};

module.exports = {
  handleProfileGet: handleProfileGet
};
