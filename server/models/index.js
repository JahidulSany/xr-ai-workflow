// import all models
const Project = require('./project');
const User = require('./user');

User.hasMany(Project, {
  foreignKey: 'userId',
  as: 'projects',
});

Project.belongsTo(User, {
  foreignKey: 'id',
  as: 'user',
});

module.exports = {
  Project,
  User,
};
