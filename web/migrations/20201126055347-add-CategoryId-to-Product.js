'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Products', 'CategoryId', {
      type: Sequelize.INTEGER
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Products', 'CategoryId')
  }
};
