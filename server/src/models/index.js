import Sequelize from 'sequelize'

const sequelize = new Sequelize('chat_with_me', 'postgres', 'postgres', {
  dialect: 'postgres',
  operatorsAliases: Sequelize.Op,
  host: process.env.DB_HOST || 'localhost',
  define: {
    underscored: true,
  },
})


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

export default models