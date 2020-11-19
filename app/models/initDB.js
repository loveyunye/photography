const User = require('./User');
const Work = require('./Work');
const Img = require('./Img');
const Share = require('./Share');
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

Work.hasMany(Share, {
  foreignKey: 'workId',
});
