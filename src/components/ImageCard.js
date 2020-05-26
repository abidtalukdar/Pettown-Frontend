import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {
    Card,
    Icon,
    Image,
} from 'semantic-ui-react'


class ImageCard extends Component {

    state = {
        likes: [],
        likeButton: null
    }

    componentDidMount() {
        fetch(`http://localhost:3000/images/${this.props.image.id}/likes`)
            .then(r => r.json())
            .then(object => {
                this.setState({
                    likes: object
                })
                const currentUserLike = this.state.likes.filter(like => {
                    return like.user_id === this.props.currentUser.id
                })
                if (currentUserLike.length === 0) {
                    this.setState({likeButton: false}) 
                } else {
                    this.setState({likeButton: true}) 
                }
        })
    }

    toggleLike = () => {
        if (this.state.likeButton === true) {
            fetch(`http://localhost:3000/likes/${this.props.image.id}/${this.props.currentUser.id}`, {
                method: "DELETE"
            })
            .then(r => r.json())
            .then(() => {
                this.setState({likeButton: false})
                return  fetch(`http://localhost:3000/images/${this.props.image.id}/likes`)
                            .then(r => r.json())
                            .then(object => {
                                this.setState({
                                    likes: object
                                })
                            })
            })
        } else if (this.state.likeButton === false) {
            const likeObj = {image_id: this.props.image.id, user_id: this.props.currentUser.id}
            fetch(`http://localhost:3000/likes`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(likeObj)
            })
            .then(r => r.json())
            .then(() => {
                this.setState({likeButton: true})
                return  fetch(`http://localhost:3000/images/${this.props.image.id}/likes`)
                            .then(r => r.json())
                            .then(object => {
                                this.setState({
                                    likes: object
                                })
                            })
                })
        }
    }

        // will also need a fetch to get all comments, comment model might need to change

    render() {
        const { image_url, caption, date } = this.props.image
        return (
            <div>
                <Card style={{width:"100%", padding: "10px", marginBottom: "10px"}}>
                    <div className="header" style={{ padding: "10px"}}>
                        <div style={{ textAlign: "left" }}>
                            <img src={this.props.image.user.profile_picture} className="ui avatar image" alt="profile" /> 
                            <Link to={{
                                pathname: `/profile/${this.props.image.user.id}`,
                                userId: this.props.image.user.id
                                }}> {this.props.image.user.username} 
                            </Link>
                        </div>
                    </div>
                    <Image src={image_url} style={{borderRadius: "8px"}} alt="image"/>
                    <Card.Content>
                        <Card.Description style={{ textAlign: "left" }}>
                        {this.state.likes.length === undefined ? <strong style={{fontSize: '12px'}}> Be the first to like this post!</strong> : this.state.likes.length === 1 ? <strong style={{fontSize: '12px'}}>{this.state.likes.length} like</strong> : <strong style={{fontSize: '12px'}}>{this.state.likes.length} likes</strong>}
                        <br></br>
                            <strong>
                                <Link to={{
                                    pathname: `/profile/${this.props.image.user.id}`,
                                    userId: this.props.image.user.id
                                }}> {this.props.image.user.username} 
                            </Link></strong> {caption}
                            <br></br>
                            {/* <strong>{props.location === undefined ? null: props.location.address1}</strong> */}
                        </Card.Description>
                        <Card.Meta style={{ textAlign: "left", fontSize: "10px" }}>
                            <span className='date'>{date}</span>
                        </Card.Meta>
                    </Card.Content>
                    <div className="two ui buttons">
                            {this.state.likeButton === true ? <button className="ui button" style={{backgroundColor: "palevioletred", color: "white"}} onClick={this.toggleLike}><Icon name='like' color='red'/></button> : <button className="ui button" style={{backgroundColor: "palevioletred", color: "white"}} onClick={this.toggleLike}><Icon name='like' color='white'/></button>} 
                        <button className="ui button" style={{backgroundColor: "palevioletred", color: "white"}}><Icon name='comments' color='white'/></button>
                    </div>
                </Card>
            </div>
        );
    }
}

export default ImageCard;