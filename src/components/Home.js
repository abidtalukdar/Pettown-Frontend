import React, { Component } from 'react';
import ImagesContainer from '../containers/ImagesContainer'
import {BrowserRouter as Route, Redirect, Link} from "react-router-dom";
import {
    Form,
    Card,
    Icon,
    Grid,
    Header,
    Button,
    Image,
    Segment,
    Modal
  } from 'semantic-ui-react'

class Home extends Component {

    state = {
        open: false,
        image: {},
        caption: ""
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
                    <Segment style={{ padding: '2em' }} vertical>
                        <Grid container stackable>
                            <Grid.Row>
                                <Grid.Column width={8}>
                                    <Header as='h3' style={{ fontSize: '1em' }}>
                                        Image Feed
                                    </Header>
                                    <ImagesContainer images={this.props.followeeImages} currentUser={this.props.currentUser} />
                                </Grid.Column>
                                <Grid.Column floated='right' width={6}>
                                    <Card>
                                        <Image src={profile_picture} wrapped ui={false} />
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
                                            <Icon name='add'/><Icon name='photo'/>
                                        </button>
                                        <Modal size="small" dimmer={dimmer} open={open} onClose={this.close} closeIcon>
                                            <Modal.Header>Select a Photo</Modal.Header>
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
            </div>
        );
    }
}

export default Home;