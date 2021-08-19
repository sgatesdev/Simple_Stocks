const router = require('express').Router();

const userRoutes = require('./userRoutes');
const stockRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes.js');

router.use('/user', userRoutes);
router.use('/stock', stockRoutes);
router.use('/auth', authRoutes);

module.exports = router;