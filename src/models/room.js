/* eslint-disable */
module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define(
    "Room",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      tenant: { type: DataTypes.STRING, allowNull: false },
      type: DataTypes.STRING,
      title: DataTypes.STRING,
      createdBy: DataTypes.BIGINT,
    },
    {}
  );
  Room.associate = function (models) {
    Room.hasMany(models.Message, { foreignKey: "roomUid", sourceKey: "id" });
    Room.hasMany(models.RoomUser, { foreignKey: "roomUid", sourceKey: "id" });
  };
  return Room;
};
