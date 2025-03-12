const pool = require('../../../../config/databaseSet');

//새로운 방 생성
const createRoom = async (sendId, receiveId) => {

    let sql = `INSERT INTO chatroom (user, professor) values (?,?,NOW())`;

    try{
        const [result] = await pool.query(sql, [sendId, receiveId]);
        return result.insertId;
    }catch(error){
        console.log(error);
        return error;
    }

}

//채팅방이 존재하는지 확인
const checkChat = async (sendId, receiveId) => {

    let sql = `SELECT chat_id from chatroom where user = ? and professor = ?`;

    try{
        let [result] = await pool.query(sql, [sendId, receiveId]);
        
        if(result.length == 0){
            result[0].exists = false;
        }else{
            result[0].exists = true;
        }

        return result;

    }catch(error){
        console.log(error);
    }
}

const postMessage = async (chatRoomId, userId, message) => {

    let sql = `INSERT INTO chat (chat_is_read, room_id, cus_id, chat_message, chat_date) VALUES (0, ?, ?, ?, now())`;

    try{
        // 메시지를 DB에 저장
        await pool.query(sql,[chatRoomId, userId, message]);

        return true;
    }catch(error){
        console.log(error);
        return false;
    }

}

const getChattingRoom = async(user_id) => {

    let sql =`SELECT room_id, cus1, cus2 from chatroom where cus1 = ? or cus2 = ?`;
    
    try{
        let [result] = await pool.query(sql, [user_id, user_id]);
        sql = `SELECT pro.pro_name proname, cus.cus_name cusname from pro, cus where pro.pro_id = ? OR cus.cus_id = ?`;
        let [name] = await pool.query(sql, [result[0].cus1, result[0].cus2]);
      
        return {result, name};
    }catch(error){
        console.log(error);
        return undefined;
    }
}


const getChatDetail = async (room_id) => {
    let sql = `SELECT chat_id, cus_id, chat_message, chat_date from chat where room_id = ?`;

    try{
        let [result] = await pool.query(sql, [room_id]);

        return result;
    }catch(error){
        console.log(error);

        return undefined;
    }
}

const deleteChat = async (room_id) => {
    let sql = `DELETE from chatroom where room_id = ?; DELETE from chat where room_id = ?`;

    try{
        let result = await pool.query(sql, [room_id, room_id]);

        return result;
    }catch(error){
        console.log(error);

        return undefined;
    }   
}

module.exports = {createRoom, checkChat, postMessage, getChattingRoom,getChatDetail,deleteChat};