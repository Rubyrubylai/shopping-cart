const multer= require('multer')

module.exports.upload = () => multer({ dest: 'temp/' })
