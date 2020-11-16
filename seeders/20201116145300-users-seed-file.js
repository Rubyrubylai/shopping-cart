'use strict';
var bcrypt = require('bcrypt')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      id: 1,
      name: 'Tony',
      email: 'tony@example.com',
      password: bcrypt.hashSync('a123456', bcrypt.genSaltSync(10)),
      role: 'customer',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: 'Emily',
      email: 'emily@example.com',
      password: bcrypt.hashSync('a123456', bcrypt.genSaltSync(10)),
      role: 'customer',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      name: 'Admin',
      email: 'admin@example.com',
      password: bcrypt.hashSync('a123456', bcrypt.genSaltSync(10)),
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
