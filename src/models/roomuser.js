/* eslint-disable */
module.exports = (sequelize, DataTypes) => {
  const RoomUser = sequelize.define(
    "RoomUser",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      tenant: { type: DataTypes.STRING, allowNull: false },
      roomUid: {
        type: DataTypes.BIGINT,
      },
      userId: DataTypes.BIGINT,
    },
    {}
  );
  RoomUser.associate = function (models) {
    RoomUser.belongsTo(models.Room, { foreignKey: "roomUid" });
  };
  return RoomUser;
};
