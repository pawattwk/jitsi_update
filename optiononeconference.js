var urlInvite  = ''
var urlhref = ''
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
export default{
  geturlInvite,
  seturlInvite,
  geturlhref,
  seturlhref
}