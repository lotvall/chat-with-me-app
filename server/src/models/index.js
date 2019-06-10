import Sequelize from 'sequelize'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export default async () => {
  let maxReconnects = 20;
  let connected = false;

  const sequelize = new Sequelize('chat_with_me', 'postgres', 'postgres', {
    dialect: 'postgres',
    operatorsAliases: Sequelize.Op,
    host: process.env.DB_HOST || 'localhost',
    define: {
      underscored: true,
    },
  })

  while (!connected && maxReconnects) {
    try {
      await sequelize.authenticate();
      connected = true;
    } catch (err) {
      await sleep(5000);
      maxReconnects -= 1;
    }
  }

  if (!connected) {
    return null;
  }

  const models = {
    User: sequelize['import']('./user'),
    Group: sequelize['import']('./group'),
    Message: sequelize['import']('./message'),
    Member: sequelize['import']('./member'),
};

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;
models.op = Sequelize.Op

return models

}



