var urlInvite  = ''
var urlhref = ''
var checkplatfrom = ''
function geturlhref (){
  return urlhref;
}

function seturlhref (urlhref){
  this.urlhref = urlhref
}
function geturlInvite (){
  return urlInvite;
}

function seturlInvite (urlInvite){
  this.urlInvite = urlInvite
}
function setcheckplatfrom (checkplatfrom){
  this.checkplatfrom = checkplatfrom
}
export default{
  geturlInvite,
  seturlInvite,
  geturlhref,
  seturlhref,
  setcheckplatfrom
}