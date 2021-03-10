const sequelize = require('./index')
const { Umzug, SequelizeStorage } = require('umzug');
const path = require('path')

const umzug = new Umzug({
    migrations: { glob: path.resolve(__dirname,'migrations', '*.js')},
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  });

  module.exports = umzug