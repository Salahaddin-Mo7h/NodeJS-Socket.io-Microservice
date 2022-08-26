/* eslint-disable */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Messages", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      tenant: {
        type: Sequelize.STRING,
        allowNull: false
      },
      roomUid: {
        type: Sequelize.STRING,
        allowNull: false
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false
      },
      data: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      messageType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      senderId: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      senderName: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
  },
  down: (queryInterface, Sequelize) => queryInterface.dropTable("Messages")
};
