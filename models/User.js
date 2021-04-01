module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      profileImg: DataTypes.STRING,
      motto: DataTypes.STRING,
      location: DataTypes.STRING
    },
    {
      underscored: true
    }
  );

  User.associate = models => {
    User.hasMany(models.Post, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
    User.hasMany(models.Friend, {
      as: 'RequestTo',
      foreignKey: {
        name: 'requestToId',
        allowNull: false
        // field: 'request_to'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
    User.hasMany(models.Friend, {
      as: 'RequestFrom',
      foreignKey: {
        name: 'requestFromId',
        allowNull: false
        // field: 'request_from'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
  };

  return User;
};
