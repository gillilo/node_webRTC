import http from 'http'
import WebSocket from 'ws'
import express from 'express'

const app = express()

// 뷰 템플릿 엔진 설정
app.set("view engine", "pug")
app.set("views", __dirname + "/views")

// /public 경로 설정
app.use("/public", express.static(__dirname + "/public"))

// url 요청 페이지 설정
app.get("/", (req, res) => res.render("home"))
app.get("/*", (req, res) => res.redirect("/"))

const handleListen = () => console.log("Listening on http://localhost:3000")
// app.listen(3000, handleListen)
// 웹소켓 프로토콜 추가를 위해 http 패키지 사용
// 노드 기본 http 패키지를 사용하면 서로 다른 프로토콜을 동시에 사용할 수 있게 해줌
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

const sockets = []

// 웹소켓 커넥션 이벤트 설정
wss.on("connection", (socket) => {
  sockets.push(socket) // 서버에 연결된 소켓들을 배열로 관리.. (db쓰면 더 좋음!)
  socket["nickname"] = "Anonymous" // 소켓 연결 유저 디폴트 닉네임 값 세팅
  console.log("Connected to Browser")
  socket.on('close', () => console.log("Disconnected from Browser"))
  socket.on("message", (msg) => {
    const message = JSON.parse(msg)
    // console.log(message.type, message.payload)
    switch(message.type) {
      case "new_message":
        sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.payload}`))
        break
      case "nickname":
        socket["nickname"] = message.payload
        break
    }
  })
})

server.listen(3000, handleListen)