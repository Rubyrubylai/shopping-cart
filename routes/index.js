module.exports = (app) => {
  app.use('/cart', require('./cart'))
  app.use('/product', require('./product'))
  app.use('/', (req, res) => { return res.redirect('/product')})
}