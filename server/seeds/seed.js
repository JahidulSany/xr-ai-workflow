// Import required packages
const sequelize = require('../config/connection');
// const bcrypt = require('bcrypt');
// import models
const { Project, User } = require('../models');
// import seed data
const projectsData = require('./projects.json');
const usersData = require('./users.json');

// Seed database
const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  // Seed users
  await User.bulkCreate(usersData, {
    individualHooks: true,
    validate: true,
  });

  // Seed projects
  await Project.bulkCreate(projectsData, {
    validate: true,
  });

  console.log('Database seeded successfully!');
  process.exit(0);
};

// Call seedDatabase function
seedDatabase();
