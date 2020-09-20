import React, { Component } from 'react';
import {
    Modal,
    ListGroup
} from "react-bootstrap";
class About extends Component {
    constructor(props){
        super(props);
        this.state={
            show : this.props.show,
        }
    }
    render() {
        return (
            <div>
                <Modal show={this.props.show} onHide={(e)=>this.props.handleClose(e)}>
                    <Modal.Header closeButton>
                    <Modal.Title style={{fontWeight:"bold"}}>About</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ListGroup>
                            <ListGroup.Item>Don't refresh, until you want to start new session</ListGroup.Item>
                            <ListGroup.Item>No data is stored anywhere</ListGroup.Item>
                            <ListGroup.Item>All data is end-to-end encrypted</ListGroup.Item>
                            <ListGroup.Item>Don't leave tab open after you are done</ListGroup.Item>
                        </ListGroup>
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}

export default About
