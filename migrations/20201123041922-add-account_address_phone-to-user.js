'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Users', 'account', {
        type: Sequelize.STRING,
        allowNull: false
      }),
      queryInterface.addColumn('Users', 'address', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.addColumn('Users', 'phone', {
        type: Sequelize.STRING,
        allowNull: true
      })
    ])
    
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Users', 'account'),
      queryInterface.removeColumn('Users', 'address'),
      queryInterface.removeColumn('Users', 'phone')
    ])
  }
};
