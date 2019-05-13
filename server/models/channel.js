export default (sequelize, DataTypes) => {
    const Channel = sequelize.define('channel', {
      name: DataTypes.STRING,
      password: {
        type: DataTypes.STRING,
        validate: {
            len: {
                args: [8, 20],
                msg: "The password needs to be between 8 and 20 characters long"
            },
        }
      },
    });
  
    Channel.associate = (models) => {
      // N:M
      Channel.belongsToMany(models.User, {
        through: 'channel_member',
        foreignKey: {
          name: 'channelId',
          field: 'channel_id',
        },
      });

    };
  
    return Channel;
  };