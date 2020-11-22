module.exports = (app) => {
  app.use('/', require('./routes'))
  app.use('/admin', require('./admin'))
}