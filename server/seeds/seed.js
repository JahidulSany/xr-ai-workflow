// Import required packages
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');
// import models
const { Project, User } = require('../models');
// import seed data
const projectsData = require('./projects.json');
const usersData = require('./users.json');

// Seed database
const seedDatabase = async () => {
  await sequelize.sync({ force: true });
  
  await User.bulkCreate(usersData, { individualHooks: true });
  await Project.bulkCreate(projectsData);

  process.exit(0);
};

// Call seedDatabase function
seedDatabase();
