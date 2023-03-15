const router = require('express').Router();
const apiRoutes = require('./api');

router.use('/api', apiRoutes);
router.use('*', (req, res) => {
  res.status(404).json({ message: 'Location not found!' });
});

module.exports = router;