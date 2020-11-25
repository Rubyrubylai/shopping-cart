'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Orders', 'shipping_date', {
      type: Sequelize.DATE,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Orders', 'shipping_date')
  }
};
