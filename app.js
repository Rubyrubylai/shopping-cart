const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

app.engine('hbs', exphbs({
  extname: '.hbs', 
  defaultLayout: 'main'
}))
app.set('view engine', 'hbs')

app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: true }))

app.listen(port, () => {
  console.log(`app is running on http://localhost:${port}`)
})

require('./routes')(app)