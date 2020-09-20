import React, { Component } from 'react';
import {
    Navbar,
    Button,
    Alert,
    Spinner,
    Nav
} from 'react-bootstrap';
import { withCookies } from 'react-cookie';
import About from "./About";
class Header extends Component {
    constructor(props){
        super(props);
        this.state = {
            showAbout: false,
            socketId: -1,
            connected : props.connected,
        }
        this.socket = props.socket;
    }
    componentWillReceiveProps(props){
        this.setState({
            socketId : props.socket.id,
            connected : props.connected
        });
    }
    handleAbout(){
        this.setState({
            showAbout: true
        });
    }
    handleAboutClose(){
        this.setState({
            showAbout: false
        })
    }
    copyToClipboard(){
        navigator.clipboard.writeText(this.state.socketId);
    }
    
    render() {
        return (
            <div>
            <Navbar bg="light">
                <Navbar.Brand href="/">SecureChat</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Button variant="success" size="sm" onClick={(e)=>{this.handleAbout(e)}}>About</Button>
                        <About show={this.state.showAbout} handleClose={(e)=>{this.handleAboutClose(e)}}/>
                        {this.state.connected?<Button style={{marginLeft:"1em"}} variant="success" onClick={()=>this.props.handleConnectTerminate()}>Connected</Button>:
                        <Button style={{marginLeft:"1em"}} variant="danger">Not Connected</Button>}
                    </Nav>
                    <span style={{lineHeight:'1em',float:"right"}}>
                        {this.state.socketId!==-1?(<Alert style={{padding:"0.2em",margin:"0px",float:'right'}} variant='danger' onClick={()=>this.copyToClipboard()}>
                            {'Share your socket id: '} <span style={{fontWeight:"bold"}}>{this.state.socketId}</span>
                        </Alert>):(
                            <Alert  style={{float:'right',padding:"0.2em",margin:"0px"}} variant='danger'>
                                {"Getting socket id  "}
                                {this.state.socketId===-1 && <><Spinner as="span"
                                animation="border"
                                size="sm"
                                aria-hidden="true" /></>}
                            </Alert>
                        )}
                    </span>
                </Navbar.Collapse>

            </Navbar>
        </div>
        )
    }
}

export default withCookies(Header);