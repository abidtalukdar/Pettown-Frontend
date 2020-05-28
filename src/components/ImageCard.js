import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Comment from './Comment'
import {
    Modal,
    Form,
    Segment,
    Card,
    Icon,
    Image,
    Divider,
} from 'semantic-ui-react'


class ImageCard extends Component {

    state = {
        likes: [],
        comments: [],
        comment: "",
        likeButton: null,
        open: false,
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
        fetch(`http://localhost:3000/images/${this.props.image.id}/comments`)
        .then(r => r.json())
        .then(object => {
            this.setState({
                comments: object
            })
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.comments.length !== prevState.comments.length) {
            fetch(`http://localhost:3000/images/${this.props.image.id}/comments`)
            .then(r => r.json())
            .then(object => {
                this.setState({
                    comments: object
                })
            })
        }
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
                return fetch(`http://localhost:3000/images/${this.props.image.id}/likes`)
                            .then(r => r.json())
                            .then(object => {
                                this.setState({
                                    likes: object
                                })
                            })
                })
        }
    }

    show = (dimmer) => () => this.setState({ dimmer, open: true })
    close = () => this.setState({ open: false })

    handleInputChange = (event) => {
        event.persist()
        this.setState(() => {
            return {
                [event.target.name]: event.target.value
            }
        })
    }

    handleSubmit = (event) => {
        event.preventDefault()
        const commentData = {
            image_id: this.props.image.id,
            user_id: this.props.currentUser.id,
            comment: this.state.comment
        }
        this.setState({comment: ""})
        fetch("http://localhost:3000/comments", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(commentData)
        })
        .then(r => r.json())
        .then(commentData => {
            this.setState(prevstate => {
                return { comments : [...prevstate.comments, commentData]}
            })
        })
    }

    renderComments = () => {
        return this.state.comments.map(comment => {
            return <Comment key={comment.id} comment={comment} currentUser={this.props.currentUser} handleDeleteComment={this.handleDeleteComment}/> 
        })
    }

    handleDeleteComment = (commentId) => {
        const updatedComments = this.state.comments.filter(comment => {
            return commentId !== comment.id 
        })
        this.setState({comments: updatedComments})
        fetch(`http://localhost:3000/comments/${commentId}`, {
            method: "DELETE"
        })
        .then(r => r.json())
    }

    render() {
        const { open, dimmer, comment } = this.state
        const { image_url, caption, date } = this.props.image
        return (
            <div>
                {this.props.currentUser.id === this.props.image.user.id ?
                    <Card style={{width:"100%", padding: "10px", marginBottom: "10px"}}>
                    <div className="header" style={{ padding: "10px"}}>
                        <div style={{ textAlign: "left" }}>
                            <img src={this.props.image.user.profile_picture} className="ui avatar image" alt="profile" /> 
                            <strong>
                                <Link to={{
                                    pathname: `/profile/${this.props.image.user.id}`,
                                    userId: this.props.image.user.id
                                    }}> {this.props.image.user.username} 
                                </Link>
                            </strong>
                        </div>
                    </div>
                    <Image src={image_url} style={{borderRadius: "8px"}} alt="image"/>
                    <Card.Content>
                        <Card.Description style={{ textAlign: "left" }}>
                        {this.state.likes.length === 0 ? <strong style={{fontSize: '12px'}}> Be the first to like this post!</strong> : this.state.likes.length === 1 ? <strong style={{fontSize: '12px'}}>{this.state.likes.length} like</strong> : <strong style={{fontSize: '12px'}}>{this.state.likes.length} likes</strong>}
                        <br></br>
                            <strong>
                                <Link to={{
                                    pathname: `/profile/${this.props.image.user.id}`,
                                    userId: this.props.image.user.id
                                }}> {this.props.image.user.username} 
                            </Link></strong> {caption}
                            <br></br>
                        </Card.Description>
                        <Card.Meta style={{ textAlign: "left", fontSize: "10px" }}>
                            <span className='date'>{date}</span>
                        </Card.Meta>
                    </Card.Content>
                    <div className="three ui buttons">
                            {this.state.likeButton === true ? <button className="ui button" style={{backgroundColor: "palevioletred"}} onClick={this.toggleLike}><Icon name='like' color="red"/></button> : <button className="ui button" style={{backgroundColor: "palevioletred", color: "white"}} onClick={this.toggleLike}><Icon name='like'/></button>} 
                        <button className="ui button" style={{backgroundColor: "palevioletred", color: "white"}} onClick={this.show('blurring')}><Icon name='comments'/></button>
                        <button className="ui button" style={{backgroundColor: "palevioletred", color: "white"}} onClick={() => this.props.handleDeleteImage(this.props.image.id)}><Icon name='delete'/></button>
                        <Modal size="small" dimmer={dimmer} open={open} onClose={this.close} closeIcon>
                                <Segment stacked>
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
                                            {this.state.likes.length === undefined ? <strong style={{fontSize: '12px', padding: "5px"}}> Be the first to like this post!</strong> : this.state.likes.length === 1 ? <strong style={{fontSize: '12px', padding: "5px"}}>{this.state.likes.length} like</strong> : <strong style={{fontSize: '12px', padding: "5px"}}>{this.state.likes.length} likes</strong>}
                                                <div style={{padding: "5px"}}>
                                                    <strong>
                                                        <Link to={{
                                                                pathname: `/profile/${this.props.image.user.id}`,
                                                                userId: this.props.image.user.id
                                                            }}> {this.props.image.user.username} 
                                                        </Link>
                                                    </strong> {caption}
                                                </div>
                                            </Card.Description>
                                            <Card.Meta style={{ textAlign: "left", fontSize: "10px", paddingLeft: "5px" }}>
                                                <span className='date'>{date}</span>
                                            </Card.Meta>
                                            <Divider />
                                            {this.state.comments.length > 0 ? null : <div style={{fontSize: '12px'}}>Be the first to comment on this post!<Divider/></div>}
                                            {this.renderComments()}
                                            <Form onSubmit={this.handleSubmit}>
                                                <Form.TextArea 
                                                    placeholder='Add a comment...'
                                                    name="comment" 
                                                    onChange={this.handleInputChange} 
                                                    value={comment} 
                                                />
                                                <button type="submit" className="ui fluid button" style={{backgroundColor: "palevioletred", color: "white", border: "1px solid white"}}>
                                                    Post Your Comment
                                                </button>
                                            </Form>
                                        </Card.Content>
                                    </Card>
                                </Segment>
                            </Modal>
                        </div>
                    </Card>
                :
                    <Card style={{width:"100%", padding: "10px", marginBottom: "10px"}}>
                        <div className="header" style={{ padding: "10px"}}>
                            <div style={{ textAlign: "left" }}>
                                <img src={this.props.image.user.profile_picture} className="ui avatar image" alt="profile" /> 
                                <strong>
                                    <Link to={{
                                        pathname: `/profile/${this.props.image.user.id}`,
                                        userId: this.props.image.user.id
                                        }}> {this.props.image.user.username} 
                                    </Link>
                                </strong>
                            </div>
                        </div>
                        <Image src={image_url} style={{borderRadius: "8px"}} alt="image"/>
                        <Card.Content>
                            <Card.Description style={{ textAlign: "left" }}>
                            {this.state.likes.length === 0 ? <strong style={{fontSize: '12px'}}> Be the first to like this post!</strong> : this.state.likes.length === 1 ? <strong style={{fontSize: '12px'}}>{this.state.likes.length} like</strong> : <strong style={{fontSize: '12px'}}>{this.state.likes.length} likes</strong>}
                            <br></br>
                                <strong>
                                    <Link to={{
                                        pathname: `/profile/${this.props.image.user.id}`,
                                        userId: this.props.image.user.id
                                    }}> {this.props.image.user.username} 
                                </Link></strong> {caption}
                                <br></br>
                            </Card.Description>
                            <Card.Meta style={{ textAlign: "left", fontSize: "10px" }}>
                                <span className='date'>{date}</span>
                            </Card.Meta>
                        </Card.Content>
                        <div className="three ui buttons">
                                {this.state.likeButton === true ? <button className="ui button" style={{backgroundColor: "palevioletred"}} onClick={this.toggleLike}><Icon name='like' color="red"/></button> : <button className="ui button" style={{backgroundColor: "palevioletred", color: "white"}} onClick={this.toggleLike}><Icon name='like'/></button>} 
                            <button className="ui button" style={{backgroundColor: "palevioletred", color: "white"}} onClick={this.show('blurring')}><Icon name='comments'/></button>
                            <Modal size="small" dimmer={dimmer} open={open} onClose={this.close} closeIcon>
                                    <Segment stacked>
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
                                                {this.state.likes.length === undefined ? <strong style={{fontSize: '12px', padding: "5px"}}> Be the first to like this post!</strong> : this.state.likes.length === 1 ? <strong style={{fontSize: '12px', padding: "5px"}}>{this.state.likes.length} like</strong> : <strong style={{fontSize: '12px', padding: "5px"}}>{this.state.likes.length} likes</strong>}
                                                    <div style={{padding: "5px"}}>
                                                        <strong>
                                                            <Link to={{
                                                                    pathname: `/profile/${this.props.image.user.id}`,
                                                                    userId: this.props.image.user.id
                                                                }}> {this.props.image.user.username} 
                                                            </Link>
                                                        </strong> {caption}
                                                    </div>
                                                </Card.Description>
                                                <Card.Meta style={{ textAlign: "left", fontSize: "10px", paddingLeft: "5px" }}>
                                                    <span className='date'>{date}</span>
                                                </Card.Meta>
                                                <Divider />
                                                {this.state.comments.length > 0 ? null : <div style={{fontSize: '12px'}}>Be the first to comment on this post!<Divider/></div>}
                                                {this.renderComments()}
                                                <Form onSubmit={this.handleSubmit}>
                                                    <Form.TextArea 
                                                        placeholder='Add a comment...'
                                                        name="comment" 
                                                        onChange={this.handleInputChange} 
                                                        value={comment} 
                                                    />
                                                    <button type="submit" className="ui fluid button" style={{backgroundColor: "palevioletred", color: "white", border: "1px solid white"}}>
                                                        Post Your Comment
                                                    </button>
                                                </Form>
                                            </Card.Content>
                                        </Card>
                                    </Segment>
                            </Modal>
                        </div>
                    </Card>
                }
            </div>
        );
    }
}

export default ImageCard;