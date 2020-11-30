'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Favorites', 
      Array.from({ length: 10 }).map((item, index) => ({
        UserId: Math.floor(Math.random()*3+1),
        ProductId: Math.floor(Math.random()*20+1),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Favorites', null, {})
  }
};
