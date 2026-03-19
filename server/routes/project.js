// create a new router
const app = require('express').Router();
const { authMiddleware } = require('../utils/auth');

// import the models
const { Project, User } = require('../models/index');

// Route to add a new Project
app.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, name, description, filename } = req.body;
    const post = await Project.create({
      title,
      name,
      description,
      filename,
      userId,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Error adding Project' });
  }
});

// Route to get all projects
app.get('/', authMiddleware, async (req, res) => {
  try {
    const Projects = await Project.findAll();

    res.json(Projects);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving Projects', error });
  }
});

// Route to get a specific project
app.get('/:id', authMiddleware, async (req, res) => {
  try {
    // get the Project and all the users associated with it
    const Project = await Project.findByPk(req.params.id, {
      include: [
        { model: Category, as: 'category' },
        { model: User, as: 'users', through: EnrolledUser },
      ],
    });

    res.json({ Project });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error retrieving Project' });
  }
});

// Route to update a Project
// app.put('/:id', authMiddleware, async (req, res) => {
//   try {
//     const { title, description, created_by, categoryId } = req.body;
//     const Project = await Project.update(
//       { title, description, created_by, categoryId },
//       { where: { id: req.params.id } },
//     );
//     res.json(Project);
//   } catch (error) {
//     res.status(500).json({ error: 'Error updating Project' });
//   }
// });

// Route to delete a Project
app.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const Project = await Project.destroy({ where: { id: req.params.id } });
    res.json(Project);
  } catch (error) {
    res.status(500).json({ error: 'Error deleting Project' });
  }
});

// export the router
module.exports = app;
