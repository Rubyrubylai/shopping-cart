'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('CartItems',
      Array.from({ length: 20 }).map((item, index) => ({
        id: index + 1,
        quantity: Math.floor(Math.random()*5+1),
        ProductId: Math.floor(Math.random()*10+1),
        CartId: Math.floor(Math.random()*3+1),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('CartItems', null, {})
  }
};
