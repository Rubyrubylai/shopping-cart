const db = require('../models')
const Product = db.Product
const Order = db.Order
const Payment = db.Payment
const Category = db.Category

const sharp = require('sharp')
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

      //上方導覽列的分類
      Category.findAll({
        raw: true,
        nest: true
      })
      .then(categories => {
        return res.render('admin/orders', { orders, categories })
      })
    })
  },

  getOrder: (req, res) => {
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
      var payment = sort.payment(order)

      //上方導覽列的分類
      Category.findAll({
        raw: true,
        nest: true
      })
      .then(categories => {
        return res.render('admin/order', { order: order.toJSON(), items, totalPrice, totalQty, payment: payment[0], categories })
      })
    })
  },

  putOrder: (req, res) => {
    Order.findByPk(req.params.id)
    .then(order => {
      const { shipping_status, payment_status, shipping_date, paid_at, payment_method, paymentId } = req.body

      //如果有付款日期，才需成立一筆payment
      if (paid_at) {
        order.update({
          shipping_status,
          payment_status,
          shipping_date: shipping_date || null //有些商品尚未出貨，因此不會有shipping date
        })
        .then(order => {
          Payment.create({
            paid_at: paid_at,
            OrderId: order.id,
            sn: order.sn,
            amount: order.amount,
            params: 'success',
            payment_method
          })
          .then(payment => {
            req.flash('success_msg', `The order has been updated!`)
            return res.redirect(`/admin/order/${order.id}`)
          })
          
        })
      }
      else {
        order.update({
          shipping_status,
          payment_status,
          shipping_date: shipping_date || null
        })
        .then(order => {
          req.flash('success_msg', `The order has been updated!`)
          return res.redirect(`/admin/order/${order.id}`)
          
        })
      }
      
    })
  },

  //product相關路由
  getProducts: (req, res) => {
    Product.findAll({
      raw: true,
      nest: true,
      order: [ ['id', 'DESC'] ],
      include: [ Category ]
    })
    .then(products => {
      //上方導覽列的分類
      Category.findAll({
        raw: true,
        nest: true
      })
      .then(categories => {
        return res.render('admin/products', { products, categories })
      })
    })
  },

  getNewProduct: (req, res) => {
    let newProduct = true
    //上方導覽列的分類
    Category.findAll({
      raw: true,
      nest: true
    })
    .then(categories => {
      return res.render('admin/product', { newProduct, categories })
    })
  },

  postProduct: async (req, res) => {
    let newProduct = true
    const { file } = req
    const { name, price, description, image } = req.body
    const CategoryId = Number(req.body.CategoryId)
    if (!name || !price || !description || !file || !CategoryId) {
      //上方導覽列的分類
      Category.findAll({
        raw: true,
        nest: true
      })
      .then(categories => {
        let errors = [{ error_msg: 'All fields are required!'}]
        return res.render('admin/product', { product : { name, image, description, price, CategoryId }, newProduct, categories, errors })
      })
    }
    else {
      imgur.setClientID(IMGUR_CLIENT_ID)
      const buffer = await sharp(file.path)
          .resize({ width: 320, height: 240 })
          .toFile(`./public/images/${file.originalname}`)
      imgur.upload(`./public/images/${file.originalname}`, (err, img) => {
        return Product.create({
          name,
          price,
          description,
          image: file ? img.data.link : null,
          CategoryId
        }).then(product => {
          req.flash('success_msg', `${product.name} has been added!`)
          return res.redirect('/admin/products')
        })
      })
    }
  },

  editProduct: (req, res) => {
    Product.findByPk(req.params.id)
    .then(product => {
      //上方導覽列的分類
      Category.findAll({
        raw: true,
        nest: true
      })
      .then(categories => {
        return res.render('admin/product', { product: product.toJSON(), categories })
      })
    })
  },

  putProduct: async (req, res) => {
    const { file } = req
    if (file) {
      const buffer = await sharp(file.path)
        .resize({ width: 320, height: 240 })
        .toFile(`./public/images/${file.originalname}`)
    }
    Product.findByPk(req.params.id)
    .then(product => {
      const { id } = req.params
      const { name, image, description, price } = req.body
      const CategoryId = Number(req.body.CategoryId)
      if(!name ||　!description || !price || !CategoryId) {
        Category.findAll({
          raw: true,
          nest: true
        })
        .then(categories => {
          let errors = [{ error_msg: 'All fields are required!'}]
          return res.render('admin/product', { product : { id, name, image, description, price, CategoryId }, categories, errors })
        })
        
      }
      else {
        imgur.setClientID(IMGUR_CLIENT_ID)
        if (file) {
          imgur.upload(`./public/images/${file.originalname}`, (err, img) => {
            return product.update({
              name,
              image: file ? img.data.link : null,
              description,
              price,
              CategoryId
            })
            .then(product => {
              req.flash('success_msg', `The product has been updated!`)
              return res.redirect('/admin/products')
            })
          })
        }
        else {
            product.update({
              name,
              image,
              description,
              price,
              CategoryId
            })
            .then(product => {
              req.flash('success_msg', `The product has been updated!`)
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
        req.flash('success_msg', `${product.name} has been removed!`)
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
        req.flash('success_msg', `${category.name} has been added!`)
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
          req.flash('success_msg', `The category has been updated to ${category.name}!`)
          return res.redirect('/admin/categories')
        }) 
      }
    })  
  },

  removeCategory: (req, res) => {
    Category.findByPk(req.params.id)
    .then(category => {
      category.destroy().then(category => {
        req.flash('success_msg', `${category.name} has been removed!`)
        return res.redirect('/admin/categories')
      })
    })
  }
}

module.exports = adminController