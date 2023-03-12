const router = require('express').Router();
const {getThoughts, createThought} = require('../../controllers/thoughtController');
const dayjs = require('dayjs');

router.route('/').get(getThoughts).post(createThought);

module.exports = router;