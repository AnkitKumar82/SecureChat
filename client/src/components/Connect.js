import React, { Component } from 'react'
import {
    Form,
    Button,
    Spinner
}from "react-bootstrap";
class Connect extends Component {
    constructor(props){
        super(props);
        this.state = {
            publicKey : props.publicKey,
            otherSocketId : -1,
            showSpinner: false
        };
        this.socket=this.props.socket;
    }
    componentDidMount(){
        this.socket.on("connect_request_fail",(data)=>{
            this.setState({
                showSpinner:false
            });
        });
    }
    componentWillReceiveProps(props){
        this.setState({
            publicKey : props.publicKey
        });
    }
    onChange(e){
        this.setState({
            otherSocketId : e.target.value
        });
    }
    connect(e){
        e.preventDefault();
        this.socket.emit("connect_request",{publicKey:this.state.publicKey,otherSocketId:this.state.otherSocketId});
        this.setState({
            showSpinner:true
        });
    }
    render() {
        return (
            <div style={{margin:'auto',width:'60%',textAlign:'center'}}>
                <Form>
                    <Form.Group controlId="formBasic" style={{marginTop:"20%"}}>
                        <Form.Control type="text" placeholder="Socket id" onChange={(e)=>this.onChange(e)}/>
                        <Form.Text className="text-muted">
                        </Form.Text>
                    </Form.Group>
                    <Button variant="primary" type="submit" onClick={(e)=>this.connect(e)}>
                    {this.state.showSpinner && 
                    <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        />
                    }
                        Connect
                    </Button>
                    </Form>
            </div>
        )
    }
}

export default Connect
