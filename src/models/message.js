/* eslint-disable */
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    "Message",
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
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      data: { type: DataTypes.JSONB, allowNull: false },
      messageType: { type: DataTypes.STRING, allowNull: true },
      senderId: { type: DataTypes.BIGINT, allowNull: false },
      senderName: { type: DataTypes.STRING, allowNull: false },
    },
    {
      timestamps: false,
    }
  );
  Message.associate = function (models) {
    Message.belongsTo(models.Room, { foreignKey: "roomUid", targetKey: "id" });
    // Message.hasMany(models.Mention, { as: 'mentions', foreignKey: 'messageId', targetKey: 'id' });
    // Message.hasMany(models.MessageSeen, {
    //   as: 'messageSeens',
    //   foreignKey: 'messageId',
    //   targetKey: 'id',
    // });
  };
  return Message;
};
