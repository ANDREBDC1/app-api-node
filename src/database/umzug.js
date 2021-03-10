const siquelizer = require('./index')
const { Umzug, SequelizeStorage } = require('umzug');

const umzug = new Umzug({
    migrations: { glob: 'migrations/*.js' },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  });

  module.exports = umzug