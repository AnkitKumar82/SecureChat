const connectRequest = function (body, socket, io) {
  if (body.otherSocketId === socket.id) {
    io.to(socket.id).emit('connect_request_fail', { errorMessage: 'Cannot connect with yourself' })
  } else if (io.sockets.sockets[body.otherSocketId] === undefined) {
    io.to(socket.id).emit('connect_request_fail', { errorMessage: 'Wrong socket id' })
  } else {
    io.to(body.otherSocketId).emit('connect_request_receive', { otherSocketId: socket.id, otherPublicKey: body.publicKey })
  }
}

const connectRequestAccept = function (body, socket, io) {
  io.to(body.otherSocketId).emit('connect_request_success', { otherSocketId: socket.id, otherPublicKey: body.publicKey })
}

const connectRequestReject = function (body, socket, io) {
  io.to(body.otherSocketId).emit('connect_request_fail', { errorMessage: 'User rejected your Request' })
}

const connectTerminate = function (body, socket, io) {
  io.to(body.otherSocketId).emit('connect_terminated', { errorMessage: 'Other user terminated connection' })
}

module.exports = {
  connectRequest,
  connectRequestAccept,
  connectRequestReject,
  connectTerminate
}
