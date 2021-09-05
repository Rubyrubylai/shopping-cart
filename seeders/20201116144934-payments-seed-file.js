'use strict';
var faker = require('faker')
const payment = [ 'CREDIT', 'WEBATM', 'VACC', 'CVS', 'BARCODE' ]
const params = ['success', 'failure']

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Payments', 
      Array.from({ length: 5 }).map((item, index) => ({
        id: index + 1,
        sn: faker.datatype.number(),
        amount: faker.datatype.number(),
        payment_method: payment[Math.floor(Math.random()*3)],
        paid_at: new Date(),
        params: null,
        OrderId: Math.floor(Math.random()*2+1),
        createdAt: new Date(),
        updatedAt: new Date(),
        params: params[Math.floor(Math.random()*2)]
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Payments', null, {})
  }
};
