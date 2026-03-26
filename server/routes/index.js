const router = require('express').Router();

const projectRoutes = require('./project');
const userRoutes = require('./user');

// create a default route for /api
router.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

router.use('/api/projects', projectRoutes);
router.use('/api/users', userRoutes);

module.exports = router;
