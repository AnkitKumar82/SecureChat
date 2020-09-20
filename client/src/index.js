import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withCookies} from "react-cookie";
import 'bootstrap/dist/css/bootstrap.min.css';
import { 
    Button,
    Toast
}from 'react-bootstrap';
import Header from "./components/Header";
import Main from "./components/Main";
import Connect from "./components/Connect";
import io from "socket.io-client";
import { RSA } from 'hybrid-crypto-js';
const port = process.env.PORT || 5000;
const myServerAddr = `http://localhost:${port}`;
class App extends Component {
  constructor(props){
        super(props);
        this.state = {
            socket: io(myServerAddr),
            publicKey : '',
            privatekey : '',
            otherSocketId : -1,
            otherPublicKey : '',
            connected : false,
            request : true,
            showToastNewConnection : false,
            showToastNewConnectionSocketId : -1,
            showToastNewConnectionPublicKey : -1,
            errorMessage: '',
            showError:false
        };
        this.handleConnectTerminate = this.handleConnectTerminate.bind(this);
  }
  componentDidMount(){
        var rsa = new RSA();
        rsa.generateKeyPairAsync().then(keyPair => {
            this.setState({
                publicKey : keyPair.publicKey,
                privateKey : keyPair.privateKey
            });
        });

        this.state.socket.on("connect_request_success",(data)=>{
            this.setState({
                otherSocketId:data.otherSocketId,
                otherPublicKey:data.otherPublicKey,
                connected:true
            });
        });
        this.state.socket.on("connect_terminated",(data)=>{
            this.setState({
                otherSocketId:-1,
                otherPublicKey:-1,
                connected:false,
                showError:true,
                errorMessage:data.errorMessage
            });
        });
        this.state.socket.on("connect_request_fail",(data)=>{
            this.setState({
                errorMessage: data.errorMessage || "Unknown Error",
                showError:true,
                connected:false
            });
        });
        this.state.socket.on("connect_request_receive",(data)=>{
            this.setState({
                showToastNewConnection : true,
                showToastNewConnectionSocketId : data.otherSocketId,
                showToastNewConnectionPublicKey : data.otherPublicKey
            });
        });
    }
    handleNewConnectAccept(){
        let oldOtherSocketId = this.state.otherSocketId;
        let newOtherSocketId = this.state.showToastNewConnectionSocketId;
        let newOtherPublicKey = this.state.showToastNewConnectionPublicKey;
        this.setState({
            showToastNewConnection : false,
            showToastNewConnectionPublicKey : -1,
            showToastNewConnectionSocketId : -1,
            otherSocketId:newOtherSocketId,
            otherPublicKey:newOtherPublicKey,
            connected:true,
        });
        this.state.socket.emit("connect_request_accept",{publicKey:this.state.publicKey,otherSocketId:newOtherSocketId});
        if(oldOtherSocketId!==-1){
            this.state.socket.emit("connect_terminate",{otherSocketId:oldOtherSocketId});
        }
    }
    handleConnectTerminate(){
        let oldOtherSocketId = this.state.otherSocketId;
        this.setState({
            otherSocketId:-1,
            otherPublicKey:-1,
            connected:false,
        });
        this.state.socket.emit("connect_terminate",{otherSocketId:oldOtherSocketId});
    }
    handleNewConnectReject(){
        let showToastNewConnectionSocketId = this.state.showToastNewConnectionSocketId;
        this.setState({
            showToastNewConnection : false,
            showToastNewConnectionPublicKey : -1,
            showToastNewConnectionSocketId : -1
        });
        this.state.socket.emit("connect_request_reject",{otherSocketId:showToastNewConnectionSocketId});
    }
    render(){
        return (
            <div style={{fontFamily:"Arial",overflowY:"hidden"}} >
                <Header socket={this.state.socket} connected={this.state.connected} handleConnectTerminate={this.handleConnectTerminate}/>
                {this.state.otherSocketId===-1 ?(
                        <Connect socket={this.state.socket} publicKey={this.state.publicKey}/>
                    ):(
                        <Main otherSocketId={this.state.otherSocketId} otherPublicKey={this.state.otherPublicKey} publicKey={this.state.publicKey} privateKey={this.state.privateKey} socket={this.state.socket}/>
                    )
                }
                
                <Toast style={{
                    position: 'absolute',
                    bottom: '1em',
                    right: '1em',
                    }}
                    onClose={()=>{this.handleNewConnectReject()}} 
                    delay={30000}
                    autohide
                    show={this.state.showToastNewConnection} 
                >
                    <Toast.Header>
                    Connect Request
                    </Toast.Header>
                    <Toast.Body>{this.state.showToastNewConnectionSocketId+" wants to connect"}
                    <br/>
                    <Button variant="success" size="sm" onClick={()=>{this.handleNewConnectAccept()}}>Accept</Button>
                    {" "}
                    <Button variant="danger" size="sm" onClick={()=>{this.handleNewConnectReject()}}>Reject</Button>
                    </Toast.Body>
                </Toast>
                <Toast style={{
                    position: 'absolute',
                    bottom: '1em',
                    right: '1em',
                    }}
                    onClose={()=>this.setState({showError:false})} 
                    show={this.state.showError} 
                    delay={10000} 
                    autohide
                >
                    <Toast.Header>
                        Connect Failed
                    </Toast.Header>
                    <Toast.Body>{this.state.errorMessage}</Toast.Body>
                </Toast>
            </div>
        )
    }
}
var AppWithCookies = withCookies(App);
ReactDOM.render(<AppWithCookies/>, document.getElementById('root'));
