var listInfo = {
  name: '',
  pass: '',
  option: '',
  roomname: '',
  userid : '',
  meetingid: ''
}


function getname (){
  return listInfo.name;
}

function setname (name){
  listInfo.name = name
}

function getpass (){
  return listInfo.pass;
}

function setpass (pass){
  listInfo.pass = pass
}
function getoption (){
  return listInfo.option;
}

function setoption (option){
  listInfo.option = option
}
function getroomname (){
  return listInfo.roomname;
}

function setroomname (roomname){
  listInfo.roomname = roomname
}
function getuserid (){
  return listInfo.userid;
}

function setuserid (userid){
  listInfo.userid = userid
}
function getmeetingid (){
  return listInfo.meetingid;
}

function setmeetingid (meetingid){
  listInfo.meetingid = meetingid
}
export default{
  getname,
  setname,
  getpass,
  setpass,
  getoption,
  setoption,
  getroomname,
  setroomname,
  getuserid,
  setuserid,
  getmeetingid,
  setmeetingid
}