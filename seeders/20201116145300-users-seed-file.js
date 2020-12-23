'use strict';
var bcrypt = require('bcrypt')
var faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      id: 1,
      name: 'User1',
      email: 'user1@example.com',
      account: '@User1',
      password: bcrypt.hashSync('a123456', bcrypt.genSaltSync(10)),
      phone: faker.phone.phoneNumber(),
      address: faker.address.streetAddress(),
      role: 'customer',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: 'User2',
      email: 'user2@example.com',
      account: '@User2',
      password: bcrypt.hashSync('a123456', bcrypt.genSaltSync(10)),
      phone: faker.phone.phoneNumber(),
      address: faker.address.streetAddress(),
      role: 'customer',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      name: 'Root',
      email: 'root@example.com',
      account: '@Root',
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
