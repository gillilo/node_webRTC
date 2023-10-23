import http from 'http'
import SocketIO from 'socket.io'
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

// 웹소켓 프로토콜 추가를 위해 http 패키지 사용
// 노드 기본 http 패키지를 사용하면 서로 다른 프로토콜을 동시에 사용할 수 있게 해줌
const httpServer = http.createServer(app)
const wsServer = SocketIO(httpServer)

wsServer.on("connection", (socket) => {
  socket['nickname'] = "Anon" // 닉네임이 입력되기 전에는 익명으로 표시
  socket.on("enter_room", (roomName, done) => { // 2번 방법: payload와 콜백함수를 인자로 전달받아 쓴다
    done()
    // console.log(roomName)
    // console.log(socket.id)
    // console.log(socket.rooms)
    socket.join(roomName)
    // console.log(socket.rooms)
    // socket.to(roomName).emit("welcome")
    socket.to(roomName).emit("welcome", socket.nickname)
  })
  socket.on("disconnecting", () => {
    // socket.rooms.forEach(room => socket.to(room).emit("bye"))
    socket.rooms.forEach(room => {
      socket.to(room).emit("bye", socket.nickname)
    })
  })
  socket.on("new_message", (msg, room, done) => {
    // socket.to(room).emit("new_message", msg)
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`)
    done()
  })
  socket.on("nickname", (nickname) => (socket['nickname'] = nickname))
})

const handleListen = () => console.log("Listening on http://localhost:3000")
httpServer.listen(3000, handleListen)