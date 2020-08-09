
var auth = {id:'' , pass: '' , nickname: '' , option: '' , roomname: '' , meetingid: ''}

function getauth (){
  return auth;
}

function setauth (auth){
  this.auth = auth
}

export default{
  getauth,
  setauth
}