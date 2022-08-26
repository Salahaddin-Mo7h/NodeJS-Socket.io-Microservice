/* eslint-disable */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("RoomUsers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      roomUid: {
        type: Sequelize.BIGINT,
        references: {
          model: "Rooms",
          key: "id",
        },
      },
      tenant: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      userId: {
        type: Sequelize.BIGINT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("RoomUsers");
  },
};
