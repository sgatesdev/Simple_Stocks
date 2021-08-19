const router = require('express').Router();

const userRoutes = require('./userRoutes');
const stockRoutes = require('./stockRoutes');
const authRoutes = require('./authRoutes');

router.use('/user', userRoutes);
router.use('/stock', stockRoutes);
router.use('/auth', authRoutes);

module.exports = router;