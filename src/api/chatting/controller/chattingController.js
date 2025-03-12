const pool = require('../../../../config/databaseSet');
const chattingService = require('../service/chattingService');

//채팅방 생성
const createRoom = (data) => {

    const sendId = data.sendId;
    const receiveId = data.sendId;
    const result  = chattingService.checkChat(sendId, receiveId);

    // 생성된 채팅방이 있는지 확인.
    if(result.exists){
        return result[0].chat_id;
    }else{
        return chattingService.createRoom(sendId, receiveId);
    }
    
}

//채팅 작성
const postMessage = (room_id, sender_id, message) => {
    chattingService.postMessage(room_id, sender_id, message);
}

//채팅방 조회
const getChattingRoom = async(req, res) => {
    const user_id = req.cookies.user_id;
   
    let result = await chattingService.getChattingRoom(user_id);
    
    if(result){
        res.status(200).send(result);
    }else{
        res.status(500).send({success: false, message: "채팅방 목록을 조회할 수 없습니다."});
    }
}

//채팅 조회
const getChatDetail = async(req, res) => {
    const room_id = req.params.room_id;
  
    let result = await chattingService.getChatDetail(room_id);

    if(result){
        res.status(200).send({success: true, data:result});
    }else{
        res.status(500).send({success: false, message: "채팅 목록을 조회할 수 없습니다."});
    }
}

//채팅방 삭제
const deleteChat = (req, res) => {
    const room_id = req.params;

    let result = chattingService.deleteChat(room_id);

    if(result) {
        res.status(200).send({success: true, message: "성공적으로 삭제하였습니다."});
    }else{ 
        res.status(500).send({success: false, message: "채팅방 삭제에 실패하였습니다."});
    }
}

module.exports = {createRoom, postMessage, getChattingRoom, getChattingRoom, getChatDetail, deleteChat};