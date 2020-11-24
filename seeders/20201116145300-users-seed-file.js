'use strict';
var bcrypt = require('bcrypt')
var faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      id: 1,
      name: 'Tony',
      email: 'tony@example.com',
      account: '@Tony',
      password: bcrypt.hashSync('a123456', bcrypt.genSaltSync(10)),
      phone: faker.phone.phoneNumber(),
      address: faker.address.streetAddress(),
      role: 'customer',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: 'Emily',
      email: 'emily@example.com',
      account: '@Emily',
      password: bcrypt.hashSync('a123456', bcrypt.genSaltSync(10)),
      phone: faker.phone.phoneNumber(),
      address: faker.address.streetAddress(),
      role: 'customer',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      name: 'Admin',
      email: 'admin@example.com',
      account: '@Admin',
      password: bcrypt.hashSync('a123456', bcrypt.genSaltSync(10)),
      phone: faker.phone.phoneNumber(),
      address: faker.address.streetAddress(),
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
  }
};
