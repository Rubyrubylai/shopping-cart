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
  },

  //右側購物車
  rightCartItem: function(cart) {
    return items = cart ? cart.dataValues.items.map(item => ({
      ...item.dataValues,
      cartItemId: item.CartItem.dataValues.id,
      quantity: item.CartItem.dataValues.quantity,
      subtotalPrice: item.CartItem.dataValues.quantity * item.dataValues.price
    })) : null
  },

  rightCartPrice: function(items, totalPrice) {
    items.forEach(item => {
      totalPrice += item.price * item.quantity
    })
    return totalPrice
  }
}