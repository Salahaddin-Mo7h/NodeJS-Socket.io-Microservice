/* eslint-disable */
module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define(
    "LastSeen",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      tenant: { type: DataTypes.STRING, allowNull: false },
      roomUid: {
        type: DataTypes.STRING,
      },
      userId: DataTypes.BIGINT,
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {}
  );
  Room.associate = function (models) {};
  return Room;
};
