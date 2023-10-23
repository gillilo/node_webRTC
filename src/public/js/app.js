const socket = io()

const welcome = document.getElementById("welcome")
const form = welcome.querySelector("form")
const room = document.getElementById("room")

room.hidden = true

let roomName

function addMessage(message) {
  const ul = room.querySelector('ul')
  const li = document.createElement('li')
  li.innerText = message
  ul.appendChild(li)
}

function handleMessageSubmit(event) {
  event.preventDefault()
  const input = room.querySelector('#msg input')
  const value = input.value
  socket.emit("new_message", value, roomName, () => {
    addMessage(`You: ${value}`)
  })
}

function handleNicknameSubmit(event) {
  event.preventDefault()
  const input = room.querySelector('#name input')
  const value = input.value
  socket.emit("nickname", value)
  input.value = ''
}

function showRoom() {
  welcome.hidden = true
  room.hidden = false
  const h3 = room.querySelector("h3")
  h3.innerText = `Room ${roomName}`
  // const form = room.querySelector('form')
  // form.addEventListener("submit", handleMessageSubmit)
  const msgForm = room.querySelector('#msg')
  const nameForm = room.querySelector('#name')
  msgForm.addEventListener("submit", handleMessageSubmit)
  nameForm.addEventListener("submit", handleNicknameSubmit)
}

function handleRoomSubmit(event) {
  event.preventDefault()
  const input = form.querySelector("input")
  // socket.emit("enter_room", { payload: input.value })
  // 2번 방법: 서버 쪽 콜백 함수를 클라이언트 쪽에서 정의해 줄 수도 있음!
  // socket.emit("enter_room", input.value, () => {
  //   console.log("server is done!")
  // })
  socket.emit("enter_room", input.value, showRoom)
  roomName = input.value
  input.value = ""
}

form.addEventListener("submit", handleRoomSubmit)

// socket.on("welcome", () => {
//   addMessage("someone joined!")
// })

// socket.on("bye", () => {
//   addMessage("someone left ㅠㅠ")
// })

socket.on("welcome", (userNickname) => {
  addMessage(`${userNickname} arrived!`)
})

socket.on("bye", (userNickname) => {
  addMessage(`${userNickname} left ㅠㅠ`)
})

socket.on("new_message", (msg) => {
  addMessage(msg)
})