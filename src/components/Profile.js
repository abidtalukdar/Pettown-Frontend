import React, { Component } from 'react';
import ImagesContainer from '../containers/ImagesContainer'
import {BrowserRouter as Route, Redirect} from "react-router-dom";
import {
    Modal,
    Form,
    Card,
    Icon,
    Grid,
    Header,
    Image,
    Feed,
    Segment
} from 'semantic-ui-react'
import SuggestedFolloweeItem from './SuggestedFolloweeItem'


class Profile extends Component {
    
    state = {
        user: "pending",
        userImages: [],
        followers: [],
        followees: [],
        followButton: false,
        open: false,
        image: {},
        caption: ""
    }

    componentDidMount() {
        const userId = this.props.location.userId
        fetch(`http://localhost:3000/users/${userId}`)
            .then(r => r.json())
            .then(object => {
                this.setState({
                    user: object
                })
            })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.user !== prevState.user && this.state.user !== "pending") {
            let userId = this.state.user.id
            fetch(`http://localhost:3000/users/${userId}/images`)
                .then(r => r.json())
                .then(object => {
                    this.setState({
                        userImages: []
                    })
                    this.setState({
                        userImages: object
                    })
                })
            fetch(`http://localhost:3000/followers/${userId}`)
                .then(r => r.json())
                .then(object => {
                    this.setState({
                        followers: []
                    })
                    this.setState({
                        followers: object
                    })
                    this.state.followers.map(follower => {
                        const currentUserFollowing = this.state.followers.filter(follower => {
                            return follower.id === this.props.currentUser.id
                        })
                        if (currentUserFollowing.length === 0) {
                            this.setState({followButton: false}) 
                        } else {
                            this.setState({followButton: true}) 
                        }
                    })
                })
            fetch(`http://localhost:3000/followees/${userId}`)
                .then(r => r.json())
                .then(object => {
                    this.setState({
                    followees: []
                    })
                    this.setState({
                        followees: object
                    })
                })
        }
    }

    toggleFollow = () => {
        let userId = this.state.user.id
        if (this.state.followButton === true) {
            fetch(`http://localhost:3000/follows/${this.props.currentUser.id}/${userId}`, {
                    method: "DELETE"
                })
                .then(r => r.json())
                .then(() => {
                    this.setState({followButton: false})
                    this.props.handleUnfollow()
                    return fetch(`http://localhost:3000/followers/${userId}`)
                                .then(r => r.json())
                                .then(object => {
                                    this.setState({
                                    followers: []
                                    })
                                    this.setState({
                                        followers: object
                                    })
                                })
                })
        } else if (this.state.followButton === false ) {
            const followObj = {follower_id: this.props.currentUser.id, followee_id: userId}
            fetch(`http://localhost:3000/follows`, {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(followObj)
                })
                .then(r => r.json())
                .then(() => {
                    this.setState({followButton: true})
                    this.props.handleNewFollowee()
                    return fetch(`http://localhost:3000/followers/${userId}`)
                                .then(r => r.json())
                                .then(object => {
                                    this.setState({
                                    followers: []
                                    })
                                    this.setState({
                                        followers: object
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

    handleFileInputChange = (event) => {
        event.persist()
        this.setState(() => {
            return {
                [event.target.name]: event.target.files[0]
            }
        })
    }

    handleSubmit = (event) => {
        event.preventDefault()
        const form = new FormData()
        form.append("user_id", this.props.currentUser.id)
        form.append("image", this.state.image)
        form.append("caption", this.state.caption)
        this.props.handlePostImage(form)
        this.setState({ open: false })
    }

    render() {
        const { open, dimmer, caption } = this.state
        const { username, name, bio, profile_picture} = this.props.currentUser
        return (
            <div>
                {this.props.currentUser === "pending" ? <Redirect to="/login" /> : null}
                    {this.props.currentUser.id === this.props.location.userId ?  
                        <Segment style={{ padding: '2em' }} vertical>
                            <Grid container stackable>
                                <Grid.Row>
                                    <Grid.Column width={8}>
                                        <Header as='h3' style={{ fontSize: '2em', fontFamily: "Bungee Shade", color: "palevioletred" }}>
                                            Your Uploads
                                        </Header>
                                        <ImagesContainer images={this.props.userImages} currentUser={this.props.currentUser} handleDeleteImage={this.props.handleDeleteImage} />
                                    </Grid.Column>
                                    <Grid.Column floated='right' width={6}>
                                        <Card style={{position: "sticky", top: 0}}>
                                            <Image src={profile_picture} style={{borderRadius: "8px"}} />
                                            <Card.Content>
                                                <Card.Header>{name}</Card.Header>
                                                <Card.Meta>
                                                    <span className='date'>{username}</span>
                                                </Card.Meta>
                                                <Card.Description>
                                                    {bio}
                                                </Card.Description>
                                            </Card.Content>
                                            <Card.Content extra>
                                                <a className="right floated" style={{marginRight: '1em' }}><Icon name='user'/>{this.props.followers.length} Followers</a>
                                                <a className="left floated" style={{marginLeft: '1em' }}><Icon name='user'/>{this.props.followees.length} Following</a>
                                            </Card.Content>
                                            <button className="ui button" style={{backgroundColor: "palevioletred", color: "white", border: "1px solid white"}} onClick={this.show('blurring')}>
                                                <Icon name='add' /><Icon name='photo' />
                                            </button>
                                            <Modal size="small" dimmer={dimmer} open={open} onClose={this.close} closeIcon>
                                                <Modal.Header>Upload to Pettown</Modal.Header>
                                                    <Form onSubmit={this.handleSubmit}>
                                                        <Segment stacked>
                                                            <input type="file" placeholder="Image" name="image" onChange={this.handleFileInputChange} style={{fontFamily: "Arial", fontSize: "13px", marginBottom: "1em"}} />
                                                            <Form.Input 
                                                                fluid icon='write' 
                                                                iconPosition='left' 
                                                                placeholder='Caption' 
                                                                name="caption" 
                                                                onChange={this.handleInputChange} 
                                                                value={caption} 
                                                            />
                                                            <button type="submit" className="ui fluid button">Post to Pettown</button>
                                                        </Segment>
                                                    </Form>
                                                </Modal>
                                            </Card>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Segment>
                        :
                            <Segment style={{ padding: '2em' }} vertical>
                                <Grid container stackable>
                                    <Grid.Row>
                                        <Grid.Column width={8}>
                                            <Header as='h3' style={{ fontSize: '2em', fontFamily: "Bungee Shade", color: "palevioletred" }}>
                                            {this.state.user.username}'s Uploads
                                            </Header>
                                            <ImagesContainer images={this.state.userImages} currentUser={this.props.currentUser} />
                                        </Grid.Column>
                                        <Grid.Column floated='right' width={6}>
                                            <Card>
                                                <Image src={this.state.user.profile_picture} style={{borderRadius: "8px"}} />
                                                <Card.Content>
                                                    <Card.Header>{this.state.user.name}</Card.Header>
                                                    <Card.Meta>
                                                        <span className='date'>{this.state.user.username}</span>
                                                    </Card.Meta>
                                                    <Card.Description>
                                                        {this.state.user.bio}
                                                    </Card.Description>
                                                </Card.Content>
                                                <Card.Content extra>
                                                    <a className="right floated" style={{marginRight: '1em' }}><Icon name='user'/>{this.state.followers.length} Followers</a>
                                                    <a className="left floated" style={{marginLeft: '1em' }}><Icon name='user'/>{this.state.followees.length} Following</a>
                                                </Card.Content>
                                                {this.state.followButton ? 
                                                    <button className="ui button" style={{backgroundColor: "palevioletred", color: "white", border: "1px solid white"}} onClick={this.toggleFollow}>
                                                        Unfollow
                                                    </button>
                                                    :
                                                    <button className="ui button" style={{backgroundColor: "palevioletred", color: "white", border: "1px solid white"}} onClick={this.toggleFollow}>
                                                        Follow
                                                    </button>
                                                }
                                            </Card>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Segment>
                    }
            </div>
        );
    }
}

export default Profile;