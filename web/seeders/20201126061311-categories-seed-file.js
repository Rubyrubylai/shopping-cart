'use strict';
var faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Categories',
      Array.from({ length: 3 }).map((item, index) => ({
        id: index + 1,
        name: faker.lorem.word(),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Categories', null, {})
  }
};
