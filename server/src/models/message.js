export default (sequelize, DataTypes) => {
    const Message = sequelize.define('message', {
      text: DataTypes.STRING,
      url: DataTypes.STRING,
      filetype: DataTypes.STRING,
    }, {
      indexes: [
        {
          fields:['created_at']
        }
      ]
    });
  
    Message.associate = (models) => {
      // 1:M
      Message.belongsTo(models.Group, {
        foreignKey: {
          name: 'groupId',
          field: 'group_id',
        },
      });
      Message.belongsTo(models.User, {
        foreignKey: {
          name: 'userId',
          field: 'user_id',
        },
      });
    };
  
    return Message;
  };
  