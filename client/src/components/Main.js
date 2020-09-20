import React, { Component } from 'react'
import { 
    Form,
    FormControl,
    Button,
    ListGroup,
    Alert
}from 'react-bootstrap';
import { animateScroll } from "react-scroll";
import { Crypt, RSA } from 'hybrid-crypto-js';
class Main extends Component {
    constructor(props){
        super(props);
        this.state={
            allData:[],
            currentData:"",
            publicKey:props.publicKey,
            privateKey:props.privateKey,
            otherPublicKey:props.otherPublicKey,
            otherSocketId:props.otherSocketId
        }
        
        this.crypt = new Crypt({ entropy: 50 });
        this.rsa = new RSA({ entropy: 50 });
        this.socket = this.props.socket;
    }
    componentDidMount(){
        this.socket.on("data_receive",(val)=>{
            var encrypted = val.data;
            var decrypted = this.crypt.decrypt(this.state.privateKey,encrypted);
            var verified = this.crypt.verify(
                this.state.otherPublicKey,
                decrypted.signature,
                decrypted.message
            );
            if(verified===true){
                this.setState({
                    allData:[...this.state.allData,{who:1,data:decrypted.message}]
                });
            }
        });
        this.scrollToBottom();
    }
    componentDidUpdate() {
        this.scrollToBottom();
    }
    componentWillReceiveProps(props){
        this.setState({
            publicKey:props.publicKey,
            privateKey:props.privateKey,
            otherPublicKey:props.otherPublicKey,
            otherSocketId:props.otherSocketId
        });
    }
    //npx react-codemod rename-unsafe-lifecycles
    handleChange(e){
        this.setState({
            currentData:e.target.value
        });
    }
    handleSend(e){
        e.preventDefault();
        if(this.state.currentData.length!==0){
            var signature = this.crypt.signature(this.state.privateKey,this.state.currentData);
            var encrypted = this.crypt.encrypt(this.state.otherPublicKey,this.state.currentData,signature);
            this.setState({
                allData : [...this.state.allData,{who:0,data:this.state.currentData}]
            });
            this.setState({
                currentData:''
            });
            this.socket.emit('data_send',{data:encrypted,otherSocketId:this.state.otherSocketId});
        }
    }
    scrollToBottom() {
        animateScroll.scrollToBottom({
          containerId: 'dataBox'
        });
    }
    render() {
        var colorScheme = ["primary","danger"];
        var alignScheme = ["right","left"];
        return (
            <div>
                <Alert variant="success">
                    {"Socket id of other user: "}
                    <span style={{fontWeight:"bold"}}>{this.state.otherSocketId}</span>
                </Alert>
                <div id="dataBox" style={{overflow:"auto",maxHeight: "78vh"}}>
                    <ListGroup variant="flush">
                    {this.state.allData.length>0 && 
                         this.state.allData.map((val,index)=>{
                            return (
                            <ListGroup.Item id={index}>
                                <span style={{float:alignScheme[val.who]}} className={`text-${colorScheme[val.who]}`}>
                                    {val.data}
                                </span>
                            </ListGroup.Item>
                            );})
                    }
                    </ListGroup>
                </div>
                <div style={{position:"absolute",bottom: "0.1em",left:"0.1%",right:"0.1%",width:"99.8%"}}>
                    <Form inline>
                    <FormControl id='dataBox' style={{width:"80%"}} value={this.state.currentData} type="text" placeholder="type here...." size="sm" onChange={(e)=>this.handleChange(e)}/>
                        <Button
                            type='submit'
                            onClick={(e) => this.handleSend(e)}
                            variant='outline-success'
                            size="sm"
                            style={{width:"20%",float:"right"}}
                            aria-controls="search"
                            aria-expanded={this.state.openModal}
                        >
                            Send
                        </Button>
                    </Form>  
                </div>         
            </div>
        )
    }
}
export default Main
