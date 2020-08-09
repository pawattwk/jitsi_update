var name  = ''
var pass = ''
var option = ''
var roomname = ''
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
export default{
  getname,
  setname,
  getpass,
  setpass,
  getoption,
  setoption,
  getroomname,
  setroomname
}