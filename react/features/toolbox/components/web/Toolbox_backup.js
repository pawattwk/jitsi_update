this.state = {
    windowWidth: window.innerWidth,
    visible: false,
    visiblecreate: false,
    activeStep: 0,
    arrpoll: [],
    isHost: false,
    listanswer: [],
    newchoice:[{text : '' , select : false , user_answer : []} , {text : '' , select : false , user_answer : []}],
    newcontent: '',
    meetingid: '',
    userid:'',
    display: '',
    counterpoll: '',
    endpoint: env.config.API_SOCKET_IO
    }
}
pollcounter(){
try {
    axios.post( env.config.API_NODE +'/getvotes', {meetingid: this.state.meetingid , userid: this.state.userid}).then(result => {
        let formatanswer = result.data.data.map( e => { return {pollid: e.pollid , choice : -1}})
        this.setState({
            arrpoll: result.data.data,
            listanswer: formatanswer, 
            visible: true,
            display: 'none'
        })
    })
    return this.state.arrpoll.length  
} catch (error) {
    console.log(error)
    return null
}
}
openModal = async () => {
const header = {headers: {Authorization: '0938fb91bfdb3995e986d10ecc4e7f5050da86f165c1b725fce7808043d0d51acbf4bbcb365f9da248fff5251ecf07bd68888201e9f196d3663d773d4bced8ad'}}
// console.log(header , 'DonwLoad >>> ___ >>> ')
let download = await axios.get('https://box.one.th/onebox_uploads/api/dowloads_file?file_id=d180cdb0d65c6e65deb153ad84cb1b2a&user_id=12495781624',header)
// console.log(download)
try {
    if(moderator.auth.nickname){
        this.setState({
            isHost: true,
            meetingid: moderator.auth.meetingid,
            userid: moderator.auth.userid
        })
    }
    axios.post( env.config.API_NODE +'/getvotes', {meetingid: moderator.auth.meetingid , userid: moderator.auth.userid}).then(result => {
        let formatanswer = result.data.data.map( e => { return {pollid: e.pollid , choice : -1}})
        this.setState({
            arrpoll: result.data.data,
            listanswer: formatanswer,
            visible: true
        })
    })
} catch (error) {
    this.setState({
        isHost: false,
        meetingid: attendee.meetingid,
        userid: attendee.userid
    })
    axios.post( env.config.API_NODE +'/getvotes', {meetingid: this.state.meetingid , userid: this.state.userid}).then(result => {
        let formatanswer = result.data.data.map( e => { return {pollid: e.pollid , choice : -1}})
        this.setState({
            arrpoll: result.data.data,
            listanswer: formatanswer, 
            display: 'none',
            visible: true
        })
    })
}  
}
setdatapoll = async () =>{
// console.log('SetData____________= >>> <<< =______________SetData')
try {
    // console.log('TRY____________= >>> <<< =______________TRY')
    await axios.post( env.config.API_NODE +'/getvotes', {meetingid: moderator.auth.meetingid , userid: moderator.auth.userid}).then(result => {
        let formatanswer = result.data.data.map( e => { return {pollid: e.pollid , choice : -1}})
        console.log('_____>>> First check meetingID' , moderator.auth.meetingid)
        this.setState({
            isHost: true,
            meetingid: moderator.auth.meetingid,
            userid: moderator.auth.userid,
            arrpoll: result.data.data,
            listanswer: formatanswer
        })
        this.responsepoll()
        // console.log('_____>>> Second check meetingID' , this.state.meetingid)
    })
} catch (error) {
    // console.log('Catch____________= >>> <<< =______________Catch')
    this.setState({
        isHost: false,
        meetingid: attendee.meetingid,
        userid: attendee.userid
    })
    axios.post( env.config.API_NODE +'/getvotes', {meetingid: this.state.meetingid , userid: this.state.userid}).then(result => {
        let formatanswer = result.data.data.map( e => { return {pollid: e.pollid , choice : -1}})
        this.setState({
            arrpoll: result.data.data,
            listanswer: formatanswer, 
            display: 'none'
        })
    })
}  
}
closeModal() {
this.setState({
    visible: false,
    visiblecreate: false
});
}

async submitpoll(){
await axios.post( env.config.API_NODE +'/saveanswer', {meetingid: this.state.meetingid , userid: this.state.userid , answer: this.state.listanswer})
.then(this.setdatapoll())
.then(console.log('savepoll'))
this.setState({
    activeStep: 0
});
this.setdatapoll()
this.closeModal()
}

handleNext = () => {
 let preActiveStep = this.state.activeStep
 preActiveStep  = preActiveStep + 1
this.setState({
    activeStep: preActiveStep
});
};

handleBack = () => {
let preActiveStep = this.state.activeStep
preActiveStep  = preActiveStep - 1
this.setState({
    activeStep: preActiveStep
});
};

handleChange = (question, choice) => {
let answer = this.state.arrpoll
let listanswer = this.state.listanswer
answer[question].choice.map(select => select.select = false)
answer[question].choice[choice].select = true
listanswer[question].choice = choice
this.setState({
    arrpoll: answer,
    listanswer : listanswer
})
}
openModalcreate(){
this.setState({
    visible:false,
    visiblecreate: true
});
}
addchoice(){
let prechoice = this.state.newchoice
if(prechoice.length <= 4){
    prechoice.push({text : '' , select : false , user_answer : []})
    this.setState({
    newchoice : prechoice
})
}
}
deletechoice(){
let prechoice = this.state.newchoice
if(this.state.newchoice.length > 2){
    prechoice.pop()
    this.setState({
    newchoice : prechoice
})
}
}
createPoll(){
let addpoll = {pollid : Date.now() , user_votes : [] , content : this.state.newcontent , choice : this.state.newchoice}
axios.post( env.config.API_NODE +'/addpoll', {meetingid: this.state.meetingid , userid: this.state.userid , data: addpoll})
.then(console.log('createpoll'))
.then(this.trickerpoll())
this.setState({
    newchoice : [{text : '' , select : false , user_answer : []} , {text : '' , select : false , user_answer : []}],
    newcontent: ''
})
this.closeModal()
}
setnewcontent = (event) =>{
this.setState({
    newcontent :  event.target.value
})
}
setnewchoice = (e) =>{
let newarr = this.state.newchoice
newarr[e.target.name].text = e.target.value
this.setState({
    newchoice :  newarr
})
}
_createPollmodal(){
return (
    <Modal visible={this.state.visiblecreate} width="350" height="600" effect="fadeInUp" onClickAway={() => this.closeModal()} >
    <div>
    <h1 style={{"text-align" : "center" , color: "black" , "margin-top" : "15px"}} >{'Create Poll'}</h1>
    <div style={{"text-align" : "center" , "margin-top" : "15px"}}><TextField id="outlined-basic" label="Content" variant="outlined" name="newcontent" onChange={this.setnewcontent}/></div>
    {this.state.newchoice.map((choice, i) => (
        <div key={i} style={{color: "black" , "text-align" : "center" , "margin-top" : "15px"}} >
          <TextField id="outlined-basic" label={ 'choice ' + (i + 1)} variant="outlined" name={i} onChange={this.setnewchoice}/>
        </div>
      ))}
        <div style={{"text-align" : "center" , "margin-top" : "10px" , display: 'flex' , "justify-content": "center"}}>   
        <IconButton color="primary" aria-label="upload picture" component="span" onClick={() => this.addchoice()}>
        <Icon style={{ color: "green[500]" }}>{"+"}</Icon>
        </IconButton> 
        <IconButton color="primary" aria-label="upload picture" component="span" onClick={() => this.deletechoice()}>
        <Icon style={{ color: "green[500]" }}>{"-"}</Icon>
        </IconButton> </div>
    <div style={{"text-align" : "center" }}>
    <Button onClick={() => this.createPoll()} style={{color: "white" , background: "royalblue" , "border-radius": "20px" , "margin-top" : "10px"}}>{'Create'}</Button>
    </div>
  </div>
    </Modal>
)
}
_openPollmodal() {
// this.getpoll()
if(this.state.arrpoll.length == 0){
    return (
        <Modal visible={this.state.visible} width="400" height="380" effect="fadeInUp" onClickAway={() => this.closeModal() } >
        <div style={{"margin-top" : "10px" , "text-align": "center"}}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Logo_vote.svg" width="250px" height="250px"></img>
        </div>
        <div >
            <h1 style={{"text-align" : "center" , color: "black" , "margin-top" : "15px" , cursor: 'move'}} >{'Not Have Polls'}</h1>
            <div style={{"text-align" : "center" , "margin-top" : "10px"}}>
            <Button onClick={() => this.openModalcreate()} visible={this.state.isHost} style={{color: "white" , background: "royalblue" , "border-radius": "20px" , display : this.state.display }}>{'AddPoll'}</Button>
        </div>
      </div>
        </Modal>
    )
}else{
    let maxSteps = this.state.arrpoll.length;
    let height = 180 + (this.state.arrpoll[this.state.activeStep].choice.length * 40) 
return (
    <Modal style={{position: "absolute" , zIndex: 100}} visible={this.state.visible} width="400" height="380" effect="fadeInUp" onClickAway={() => this.closeModal()} >
    <div >
    <Paper square elevation={0} style={{color: "black" , display: "flex" , alignItems: "center" , height: 50 , paddingLeft: "25px"}}>
        <Typography> { (this.state.activeStep+1)+ '. ' + this.state.arrpoll[this.state.activeStep].content} </Typography>
    </Paper>
    {this.state.arrpoll[this.state.activeStep].choice.map((choice, i) => (
        <div key={i} style={{color: "black"}} >
          <Checkbox 
            checked={choice.select}
            onChange={() => this.handleChange(this.state.activeStep, i)}
          />
          { (i+1) + '. ' + choice.text}
        </div>
      ))}
      <MobileStepper
        steps={maxSteps}
        position="static"
        variant="text"
        activeStep={this.state.activeStep}
        nextButton={
        <Button
            size="small"
            onClick={() => this.handleNext()}
            disabled={this.state.activeStep === maxSteps - 1}
        >
        Next
        </Button>
        }
        backButton={
        <Button size="small" onClick={() => this.handleBack()} disabled={this.state.activeStep === 0}>
        Back
        </Button>
        }
    />
    <div style={{alignItems: "center" , "text-align": "center"}}>
    <Button onClick={() => this.submitpoll()} style={{color: "white" , background: "royalblue" , "border-radius": "20px" , "margin-top" : "25px"}}>{'Submit'}</Button></div>
  </div>
    </Modal>
)
}

}
trickerpoll = () => {
// console.log('emit____________= >>> <<< =______________emit')
const socket = socketIOClient(this.state.endpoint)
socket.emit('sent-message', this.state.meetingid)
}
responsepoll = async () => {
// console.log('Respone _________>> <<_____________')
const socket = socketIOClient(this.state.endpoint)
try {
    socket.on(moderator.auth.meetingid, (messageNew) => {
        if(messageNew == moderator.auth.meetingid){
            this.setdatapoll()
        }
    }) 
} catch (error) {
    console.log('Respone _________>> <<_____________' , attendee.meetingid)
    socket.on(attendee.meetingid, (messageNew) => {
        if(messageNew == attendee.meetingid){
            this.setdatapoll()
        }
    })
} 
}