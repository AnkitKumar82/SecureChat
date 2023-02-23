const server = require('./index')
const io = require('socket.io')(server)
io.origins('*:*')
module.exports = io
