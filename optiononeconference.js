var listUrl = {
  nameJoin: '',
  urlInvite: '',
  urlhref: '',
  checkplatfrom: ''
}

function setNameJoin (nameJoin) {
  listUrl.nameJoin = nameJoin
}

function seturlhref (urlhref) {
  listUrl.urlhref = urlhref
}

function seturlInvite (urlInvite){
  listUrl.urlInvite = urlInvite
}
function setcheckplatfrom (checkplatfrom){
  listUrl.checkplatfrom = checkplatfrom
}

function getNameJoin () {
  return listUrl.nameJoin;
}

function geturlhref () {
  return listUrl.urlhref;
}

function geturlInvite () {
  return listUrl.urlInvite;
}

function getcheckplatfrom () {
  return listUrl.checkplatfrom;
}

export default{
  getNameJoin,
  geturlInvite,
  seturlInvite,
  geturlhref,
  getcheckplatfrom,
  setNameJoin,
  seturlhref,
  setcheckplatfrom
}