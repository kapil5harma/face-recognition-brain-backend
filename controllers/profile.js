const handleProfileGet = (req, res, db) => {
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
};

module.exports = {
  handleProfileGet: handleProfileGet
};
