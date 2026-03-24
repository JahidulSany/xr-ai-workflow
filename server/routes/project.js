// create a new router
const router = require('express').Router();
const { authMiddleware } = require('../utils/auth');

// import the models
const { Project, User } = require('../models/index');

// Route to add a new Project
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, xrType, objectMethod, environmentMethod, platform } =
      req.body;
    const post = await Project.create({
      name,
      xrType,
      objectMethod,
      environmentMethod,
      platform,
      userId: req.user.id,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Error adding Project' });
  }
});

// Route to get all projects
router.get('/', authMiddleware, async (req, res) => {
  try {
    const Projects = await Project.findAll();

    res.json(Projects);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving Projects', error });
  }
});

// Route to get a specific project
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    // get the Project and all the users associated with it
    const Project = await Project.findByPk(req.params.id, {
      include: [
        { model: Project, as: 'project' },
        { model: User, as: 'user' },
      ],
    });

    res.json({ Project });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error retrieving Project' });
  }
});

// Route to delete a Project
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const Project = await Project.destroy({ where: { id: req.params.id } });
    res.json(Project);
  } catch (error) {
    res.status(500).json({ error: 'Error deleting Project' });
  }
});

// export the router
module.exports = router;
