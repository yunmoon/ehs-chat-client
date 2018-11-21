## 众望智慧IM服务系统 js-sdk

### 安装

#### 在浏览器中
直接在html中通过script引用
```html
<script src="/dist/ehsChat.client.js"></script>
```
#### 在vue中

```bash
npm install ehs-chat-client
```

### 如何使用

#### 在浏览器中使用
```javascript
var chatClient = new ehsChatClient('appid', 'token', 'host')
chatClient.onConnected = function() {
  console.log('connected')
}
chatClient.onError = function(error) {
  console.log(error)
}
chatClient.init()
```
#### 在vue中使用
在main.js中
```javascript
import EhsChatClient from 'ehs-chat-client'
const whiteRouteList = ['Login']
router.beforeEach((to, form, next) => {
  const userToken = store.getters['user/userToken']
  const appId = store.getters['user/appId']
  const userId = store.getters['user/userId']
  if ((!userToken || !appId || !userId) && whiteRouteList.indexOf(to.name) === -1) {
    next({ name: 'Login' })
  } else {
    if (!Vue.prototype.$ehsChatClient) {
      Vue.prototype.$ehsChatClient = new EhsChatClient(appId, userToken)
    }
    next()
  }
})
```
在聊天应用入口 比如session.vue中初始化
```javascript
export default {
  created () {
    const self = this
    self.$ehsChatClient.onError = (error) => {
      console.log(error)
    }
    self.$ehsChatClient.onConnected = () => {
      // do something
    }
    self.$ehsChatClient.init()
  }
}
```
#### API

##### 初始化 SDK

```javascript
var chatClient = new ehsChatClient('appid', 'token', 'host')
chatClient.onConnected = function() {
  console.log('connected')
}
chatClient.onError = function(error) {
  console.log(error)
}
chatClient.init()
```

##### socket 对象
```javascript
const socket = chatClient.socket
```
socket.io 使用方法请参考[官方文档](https://socket.io/docs/client-api/)

##### Methods

- init()
- getMessageSessions()
> 方法说明：获取当前用户的会话列表
```javascript
chatClient.getMessageSessions().then(sessions => {
  console.log(sessions)
  //do something
})
```
- getSessionMessages(sid, limit, lastmsgId)
> 方法说明：获取会话内的历史消息  
> 参数说明：  
> sid: 会话ID  
> limit: 每次请求获取的条数  
> lastmsgId: 小于次ID的数据，为空则从最新消息开始
```js
chatClient.getSessionMessages(sid, limit, lastmsgId).then(messages => {
  console.log(messages)
  //do something
}).catch(error => {
  console.log(error)
})
```
- sendPrivateMessage(message)
> 方法说明：发送单聊消息  
> 参数说明：  
> message对象说明
```json
{
    "senderUserId": "当前发送者用户ID",
    "targetId": "接收方用户ID",
    "content": "消息内容 参考消息内容对象说明",
    "messageType": "消息类型 参考消息类型说明"
}
```
> content说明，暂时支持文字和图片消息  
> 1.文字消息
```json
{
  "content": "文字消息"
}
```
> 2.图片消息
```json
{
  "content": "图片base64编码",
  "fullUrl": "图片访问路径"
}
```
```js
chatClient.sendPrivateMessage(message).then(res => {
  //do something
}).catch(error => {
  console.log(error)
})
```
- sendGroupMessage(message)
> 方法说明：发送群聊消息  
> 参数说明：参考单聊消息
- setMessageSessionRead (sid)
> 方法说明：设置会话为已读  
> 参数说明：  
> sid: 会话ID
```js
chatClient.setMessageSessionRead(sid).then(() => {
  //do something
}).catch(error => {
  console.log(error)
})
```
- uploadFile({formData, onProgress})
> 方法说明：上传聊天文件（图片，语音等）
> 参数说明：  
> formData：FormData对象，放置上传的文件  
> onProgress：上传进度回调函数
```js
const formData = new FormData()
formData.append('up_file', File)
chatClient.uploadFile({formData, onProgress (percent) {
  console.log(percent)
}}).then(result => {
  // do something
}).catch(error => {
  console.log(error)
})
```
##### 属性

- onError
> socket 发生错误时的回调方法  
> 等同于如下事件：  
```js
chatClient.socket.on('error', (error) => {})
```
- onConnected
> socket 连接成功后的回调方法  
> 等同于如下事件：  
```js
chatClient.socket.on('connect', () => {})
```
- onDisconnected
> socket 断开连接的回调方法  
> 等同于如下事件：  
```js
chatClient.socket.on('disconnect', () => {})
```
- onMessage
> socket 接收到消息后的回调方法  
> 等同于如下事件：  
```js
chatClient.socket.on('message', (message) => {})
```
- isConnected
> boolean 判断socket是否已处于连接状态

##### 常量说明

- socketMessageTypes
> socket 消息类型，onMessage 回调得到的数据中去判断使用
```js
module.exports = {
  USER_MESSAGE: 'user' // 用户消息
}
```
> 使用说明：
```js
import EhsChatClient from 'ehs-chat-client'
const type = EhsChatClient.socketMessageTypes.USER_MESSAGE
```
- messageContentTypes
> 消息内容类型
```js
// 1 文字消息 2语音消息 3图片消息 4文件消息 5位置消息 6自定义消息
module.exports = {
  TEXT_MESSAGE: 1,
  VOICE_MESSAGE: 2,
  IMAGE_MESSAGE: 3,
  FILE_MESSAGE: 4,
  LOCATION_MESSAGE: 5,
  CUSTOM_MESSAGE: 6
}
```
> 使用说明：
```js
import EhsChatClient from 'ehs-chat-client'
const type = EhsChatClient.messageContentTypes.TEXT_MESSAGE
```
- conversationTypes
> 会话类型
```js
module.exports = {
  PRIVATE: 1, // 单聊
  GROUP: 2 // 群聊
}
```
> 使用说明：
```js
import EhsChatClient from 'ehs-chat-client'
const type = EhsChatClient.conversationTypes.PRIVATE
```
