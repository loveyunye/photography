const User = require('./User');
const Work = require('./Work');
const Img = require('./Img');
const WorkUser = require('./WorkUser');

User.hasMany(WorkUser, {
  foreignKey: 'userId',
});

Work.hasMany(WorkUser, {
  foreignKey: 'workId',
});

Work.hasMany(Img, {
  foreignKey: 'workId',
});
