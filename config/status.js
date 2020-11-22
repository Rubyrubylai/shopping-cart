module.exports = {
  orders: function status (orders) {
    orders.forEach(order => {
      if (order.shipping_status === '-1') {
        order.shipping_status = 'Not shipped'
      }
      else if (order.shipping_status === '0') {
        order.shipping_status = 'shipping'
      }
      else if (order.shipping_status === '1') {
        order.shipping_status = 'Arrived'
      }
    })
  },

  order: function status (order) {
    if (order.shipping_status === '-1') {
      order.shipping_status = 'Not shipped'
    }
    else if (order.shipping_status === '0') {
      order.shipping_status = 'shipping'
    }
    else if (order.shipping_status === '1') {
      order.shipping_status = 'Arrived'
    }
  },

}

