'use strict';
var faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Payments', 
      Array.from({ length: 5 }).map((item, index) => ({
        id: index + 1,
        sn: faker.random.number(),
        amount: faker.random.number(),
        payment_method: Math.floor(Math.random()*3+1),
        paid_at: new Date(),
        params: null,
        OrderId: Math.floor(Math.random()*2+1),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Payments', null, {})
  }
};
