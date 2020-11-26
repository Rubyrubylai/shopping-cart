const db = require('../models')
const Product = db.Product
const Order = db.Order
const Payment = db.Payment
const Category = db.Category
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const sort = require('../config/sort')

adminController = {
  //order相關路由
  getOrders: (req, res) => {
    Order.findAll({ 
      include: [ Payment ],
      order: [ ['createdAt', 'DESC'] ]
    })
    .then(orders => {  
      //取得payment
      orders = sort.payments(orders)

      return res.render('admin/orders', { orders })
    })
  },

  editOrder: (req, res) => {
    Order.findByPk(req.params.id, {
      include: [{ model: Product, as: 'items' } , Payment]
    })
    .then(order => {
      items = order.items.map(item => ({
        ...item.dataValues,
        quantity: item.dataValues.OrderItem.dataValues.quantity
      }))
      let totalPrice = 0
      let totalQty = 0
      if (items) {
        items.forEach(item => {
          totalPrice += item.price * item.quantity
        })
        items.forEach(item => {
          totalQty += item.quantity
        })
      }

      //取得payment
      sort.payment(order)
  
      return res.render('admin/order', { order: order.toJSON(), items, totalPrice, totalQty, payment: payment[0] })
    })
  },

  putOrder: (req, res) => {
    Order.findByPk(req.params.id)
    .then(order => {
      const { shipping_status, payment_status, shipping_date } = req.body
      //有些商品尚未出貨，因此不會有shipping date
      if (shipping_date) {
        order.update({
          shipping_status,
          payment_status,
          shipping_date
        })
        .then(order => {
          req.flash('success_msg', 'The order has been successfully updated!')
          return res.redirect(`/admin/orders/${order.id}`)
        })
      }
      else {
        order.update({
          shipping_status,
          payment_status
        })
        .then(order => {
          req.flash('success_msg', 'The order has been successfully updated!')
          return res.redirect(`/admin/orders/${order.id}`)
        })
      }
      
    })
  },

  //product相關路由
  getProducts: (req, res) => {
    Product.findAll({
      raw: true,
      nest: true,
      order: [ ['createdAt', 'DESC'] ]
    })
    .then(products => {
      return res.render('admin/products', { products })
    })
  },

  getNewProduct: (req, res) => {
    let newProduct = true
    return res.render('admin/product', { newProduct })
  },

  postProduct: (req, res) => {
    let newProduct = true
    const { file } = req
    const { name, price, description, image } = req.body
    if (!name || !price || !description || !file) {
      req.flash('warning_msg', 'All fields are required!')
      return res.render('admin/product', { product : { name, image, description, price }, newProduct })
    }
    else {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Product.create({
          name,
          price,
          description,
          image: file ? img.data.link : null
        }).then(product => {
          return res.redirect('/admin/products')
        })
      })
    }
  },

  editProduct: (req, res) => {
    Product.findByPk(req.params.id)
    .then(product => {
      return res.render('admin/product', { product: product.toJSON() })
    })
  },

  putProduct: (req, res) => {
    Product.findByPk(req.params.id)
    .then(product => {
      const { file } = req
      const { id } = req.params
      const { name, image, description, price } = req.body
      console.log(file)
      if(!name ||　!description || !price) {
        console.log('no info')
        req.flash('warning_msg', 'All fields are required!')
        
        console.log(description)
        console.log(price)
        //return res.redirect('back')
        return res.render('admin/product', { product : { id, name, image, description, price } })
      }
      else {
        imgur.setClientID(IMGUR_CLIENT_ID)
        console.log(name)
        if (file) {
          imgur.upload(file.path, (err, img) => {
            return product.update({
              name,
              image: file ? img.data.link : null,
              description,
              price
            })
            .then(product => {
              return res.redirect('/admin/products')
            })
          })
        }
        else {
          console.log('product')
            product.update({
              name,
              image,
              description,
              price
            })
            .then(product => {
              return res.redirect('/admin/products')
            })
          
        }
        
      }
    })
  },

  removeProduct: (req, res) => {
    Product.findByPk(req.params.id)
    .then(product => {
      product.destroy().then(product => {
        req.flash('success_msg', 'The item has been successfully removed!')
        return res.redirect('back')
      })
    })
  },

  //category相關路由
  getCategories: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    })
    .then(categories => {
      if (req.params.id) {
        let edit = true
        category = categories.filter(c => { return c.id === Number(req.params.id) })
        return res.render('admin/categories', { categories, category: category[0], edit })
      }
      else {
        return res.render('admin/categories', { categories })
      }
    })
  },

  postCategory: (req, res) => {
    const { name } = req.body
    if (!name) {
      req.flash('warning_msg', 'Please input the category name.')
      return res.redirect('/admin/categories')
    }
    else {
      Category.create({
        name
      })
      .then(category => {
        req.flash('success_msg', 'The category has been successfully added.')
        return res.redirect('/admin/categories')
      })
    }
  },

  putCategory: (req, res) => {
    Category.findByPk(req.params.id)
    .then(category => {
      const { name } = req.body
      if (!name) {
        req.flash('warning_msg', 'Please input the category name.')
        return res.redirect('back')
      }
      else {
        category.update({
          name
        })
        .then(category => {
          req.flash('success_msg', 'The category has been successfully updated.')
          return res.redirect('/admin/categories')
        }) 
      }
    })  
  },

  removeCategory: (req, res) => {
    Category.findByPk(req.params.id)
    .then(category => {
      category.destroy().then(category => {
        req.flash('success_msg', 'The category has been successfully removed.')
        return res.redirect('/admin/categories')
      })
    })
  }
}

module.exports = adminController