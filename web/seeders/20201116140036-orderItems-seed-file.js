'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('OrderItems', 
      Array.from({ length: 20 }).map((item, index) => ({
        id: index + 1,
        price: Math.floor(Math.random()*500+1),
        quantity: Math.floor(Math.random()*10+1),
        ProductId: Math.floor(Math.random()*10+1),
        OrderId: Math.floor(Math.random()*2+1),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('OrderItems', null, {})
  }
};
