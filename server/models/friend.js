// # Table name: friends
// #
// #  id         :integer          not null, primary key
// #  user1      :integer          not null
// #  user2      :integer          not null
// #  status     :string           default(false), not null
// #  created_at :datetime         not null
// #  updated_at :datetime         not null

export default (sequelize, DataTypes) => {
  const Friend = sequelize.define('friend', {
      active: {
          type:DataTypes.STRING,
          default: false,
      }
  });

  Friend.associate = (models) => {
    // 1:M
    Friend.belongsTo(models.User, {
      foreignKey: {
        name: 'friender',
        field: 'user1',
      },
    });
    Friend.belongsTo(models.User, {
      foreignKey: {
        name: 'friendee',
        field: 'user2',
      },
    });
  };

  return Friend;
}