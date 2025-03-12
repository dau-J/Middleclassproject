const express = require("express");
const app = express();
const router = express.Router();
const http = require("http");
const socketIO = require("socket.io");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require('path');
const chattingController = require('../api/chatting/controller/chattingController');

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/../../view/chat.html"));
});

router.get("/payment", (req, res) => {
  res.sendFile(path.join(__dirname, "/../../view/payment.html"))
});

//채팅방 목록 조회
router.get("/list", chattingController.getChattingRoom);

router.get("/detail/:room_id", chattingController.getChatDetail);

router.delete("/room/:room_id", chattingController.deleteChat);

module.exports = router;