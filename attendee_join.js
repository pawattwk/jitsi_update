var name  = ''
var pass = ''
var option = ''
var roomname = ''
var userid = ''
var meetingid = ''
function getname (){
  return name;
}

function setname (name){
  this.name = name
}

function getpass (){
  return pass;
}

function setpass (pass){
  this.pass = pass
}
function getoption (){
  return option;
}

function setoption (option){
  this.option = option
}
function getroomname (){
  return roomname;
}

function setroomname (roomname){
  this.roomname = roomname
}
function getuserid (){
  return userid;
}

function setuserid (userid){
  this.userid = userid
}
function getmeetingid (){
  return meetingid;
}

function setmeetingid (meetingid){
  this.meetingid = meetingid
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