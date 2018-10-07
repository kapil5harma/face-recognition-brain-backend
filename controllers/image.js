const handleImage = (req, res, db) => {
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
};

module.exports = {
  handleImage: handleImage
};
