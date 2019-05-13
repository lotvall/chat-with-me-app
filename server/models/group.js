export default (sequelize, DataTypes) => {
    const Group = sequelize.define('group', {
      name: DataTypes.STRING,
    });
  
    Group.associate = (models) => {
      // N:M
      Group.belongsToMany(models.User, {
        through: models.Member,
        foreignKey: {
          name: 'groupId',
          field: 'group_id',
        },
      });
    };  
    return Group;
  };