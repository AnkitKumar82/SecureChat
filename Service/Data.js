const dataTransfer = function (body, socket, io) {
  io.to(body.otherSocketId).emit('data_receive', { data: body.data })
}
module.exports = {
  dataTransfer
}
