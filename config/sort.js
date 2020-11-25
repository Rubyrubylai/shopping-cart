module.exports = {
  payments: function(orders) {
    return orders.map(order => ({
      ...order.dataValues,
      payment: order.Payments.filter(payment => { return payment.params === 'success' })[0]
    }))
  },

  payment: function(order) {
    payment = order.Payments.map(payment => ({
      ...payment.dataValues
    }))
    return payment.filter(payment => { return payment.params === 'success'})
  }
}