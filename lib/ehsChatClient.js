
const socketEvents = require('./socketEvents')

const axios = require('axios')

function ChatClient(appid, token, host="http://192.168.0.128:3000") {
  this.appId = appid
  this.token = token
  this.host = host
  this.socket = null
  this.onError = null
  this.onConnected = null
  this.onDisconnected = null
  this.onMessage = null
  this.isConnected = false
  this.isInited = false
}

ChatClient.socketMessageTypes = require('./socketMessageTypes')
ChatClient.messageContentTypes = require('./messageContentType')
ChatClient.conversationTypes = require('./conversationType')

ChatClient.prototype.init = function() {
  const self = this
  if (self.isInited) {
    return false
  }
  if (!this.appId || !this.token) {
    throw new Error('appId与token不能为空')
  }
  this.socket = require('socket.io-client')(self.host, {
    query: {
      token: this.token,
      appId: this.appId
    },
    transports: ['websocket']
  })
  this.socket.on('error', error => {
    if (self.onError) {
      self.onError(error)
    }
  })
  this.socket.on('connect', () => {
    self.isConnected = true
    if (self.onConnected) {
      self.onConnected(self.socket)
    }
  })
  this.socket.on('message', (message) => {
    if (self.onMessage) {
      self.onMessage(message)
    }
  })
  this.socket.on('disconnect', () => {
    self.isConnected = false
    if (self.onDisconnected) {
      self.onDisconnected()
    }
  })
  self.isInited = true
  return self
}

ChatClient.prototype.getMessageSessions = function () {
  const self = this
  return new Promise((resolve, reject) => {
    if (self.isConnected) {
      self.socket.emit(socketEvents.SESSION_LIST, (error, sessions) => {
        if (error) {
          return reject(error)
        }
        return resolve(sessions)
      })
    } else {
      reject(new Error('socket 未连接'))
    }
  })
}
ChatClient.prototype.getSessionMessages = function (sid, limit, lastmsgId) {
  const self = this
  return new Promise((resolve, reject) => {
    if (self.isConnected) {
      self.socket.emit(socketEvents.SESSION_MESSAGE_LIST, {sid, limit, lastmsgId}, (error, messages) => {
        if (error) {
          return reject(error)
        }
        return resolve(messages)
      })
    } else {
      reject(new Error('socket 未连接'))
    }
  })
}
ChatClient.prototype.sendPrivateMessage = function (message) {
  const self = this
  return new Promise((resolve, reject) => {
    if (self.isConnected) {
      self.socket.emit(socketEvents.SEND_PRIVATE_MESSAGE, message, (error, msg) => {
        if (error) {
          return reject(error)
        }
        return resolve(msg)
      })
    } else {
      reject(new Error('socket 未连接'))
    }
  })
}
ChatClient.prototype.sendGroupMessage = function (message) {
  const self = this
  return new Promise((resolve, reject) => {
    if (self.isConnected) {
      self.socket.emit(socketEvents.SEND_GROUP_MESSAGE, message, (error, msg) => {
        if (error) {
          return reject(error)
        }
        return resolve(msg)
      })
    } else {
      reject(new Error('socket 未连接'))
    }
  })
}
ChatClient.prototype.setMessageSessionRead = function (sid) {
  const self = this
  return new Promise((resolve, reject) => {
    if (self.isConnected) {
      self.socket.emit(socketEvents.SET_SESSION_READ, sid, (error) => {
        if (error) {
          return reject(error)
        }
        return resolve()
      })
    } else {
      reject(new Error('socket 未连接'))
    }
  })
}
ChatClient.prototype.uploadFile = function ({ formData, onProgress }) {
  const self = this
  return axios.post(`${host}/file/upload?appId=${self.appId}&token=${self.token}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress (progressEvent) {
      if (progressEvent.lengthComputable && onProgress) {
        onProgress(progressEvent.loaded / progressEvent.total * 100 )
      }
    }
  })
}
export default ChatClient
