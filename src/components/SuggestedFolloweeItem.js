import React, { Component } from 'react';
import {
    Feed, Divider, Button
  } from 'semantic-ui-react'
  import {BrowserRouter as Route, Redirect, Link} from "react-router-dom";


class SuggestedFolloweeItem extends Component {
    render() {
        const { id, username, profile_picture} = this.props.suggestedFollowee
        return (
            <div style={{ textAlign: "left" }}>
            <img src={profile_picture} className="ui avatar image" alt="profile" /> 
            <strong>
                <Link to={{
                    pathname: `/profile/${id}`,
                    userId: id
                    }}> {username} 
                </Link>
            </strong>
            <Divider />
        </div>
        );
    }
}

export default SuggestedFolloweeItem;