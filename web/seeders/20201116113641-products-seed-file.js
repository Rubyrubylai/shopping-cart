'use strict';
var faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Products', 
      Array.from({ length: 20 }).map((item, index) => ({
        id: index + 1,
        name: faker.commerce.productName(),
        price: faker.commerce.price(),
        description: faker.commerce.productDescription(),
        image: `https://picsum.photos/640/480?random=${index+1}`,
        CategoryId: Math.floor(Math.random()*3+1),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Products', null, {})
  }
};
