/* eslint-disable */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("LastSeens", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      tenant: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      roomUid: {
        type: Sequelize.STRING,
      },
      userId: {
        type: Sequelize.BIGINT,
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
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
