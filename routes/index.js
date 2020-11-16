module.exports = (app) => {
  app.use('/cart', require('./cart'))
}