export default (sequelize, DataTypes) => {
    const Member = sequelize.define('member', {
        admin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }

    });

    Member.associate = (models) => { 
        Member.belongsTo(models.User, {
        foreignKey: {
          name: 'inviter',
          field: 'inviter',
        },
      });
    }
    
    return Member;
};