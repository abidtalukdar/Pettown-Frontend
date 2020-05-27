import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Divider } from 'semantic-ui-react';

class Comment extends Component {

    state = {
        user: "pending"
    }

    componentDidMount() {
        fetch(`http://localhost:3000/users/${this.props.comment.user_id}`)
            .then(r => r.json())
            .then(object => {
                this.setState({
                    user: object
                })
            })
    }

    render() {
        return (
            <div>
                <div style={{ textAlign: "left" }}>
                    <img src={this.state.user.profile_picture} className="ui avatar image" alt="profile" /> 
                    <strong>
                        <Link to={{
                            pathname: `/profile/${this.state.user.id}`,
                            userId: this.state.user.id
                            }}> {this.state.user.username} 
                        </Link> 
                    </strong> {this.props.comment.comment}
                </div>
                <Divider/>
            </div>
        );
    }
}

export default Comment;