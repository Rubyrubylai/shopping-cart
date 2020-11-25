'use strict';
var faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Orders', 
      Array.from({ length : 2 }).map((item, index) => ({
        id: index + 1,
        sn: faker.random.number(),
        amount: faker.random.number(),
        name: faker.commerce.productName(),
        phone: faker.phone.phoneNumber(),
        address: faker.address.streetAddress(),
        payment_status: Math.floor(Math.random()+1),
        shipping_status: Math.floor(Math.random()+1),
        UserId: Math.floor(Math.random()*3+1),
        createdAt: new Date(),
        updatedAt: new Date(),
        shipping_Date: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Orders', null, {})
  }
};
