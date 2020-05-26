import React from 'react';
import {BrowserRouter as Route, Redirect, Link} from "react-router-dom";
import { Form, Grid, Message, Segment} from 'semantic-ui-react'

class SignUp extends React.Component {
    state = {
        profile_picture: {},
        username: "",
        name: "",
        bio: "",
        password: "",
        password_confirmation: ""
    }

    fileInputRef = React.createRef();

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
        if (this.state.password === this.state.password_confirmation) {
            const form = new FormData()
            form.append("profile_picture", this.state.profile_picture)
            form.append("username", this.state.username)
            form.append("name", this.state.name)
            form.append("bio", this.state.bio)
            form.append("password", this.state.password)
            fetch("http://localhost:3000/signup", {
                method: "POST",
                body: form
            })
            .then(r => {
                if (!r.ok) {
                alert('hey you did something wrong')
                throw r
                }
                return r.json()
            })
            .then(user => { // console.log(user) add logic here to make sure user gets re rendered to SignUp page if invalid sign up
                this.props.history.push("/login")
            })
            .catch(console.error)
        } else {
            alert("Your passwords do not match.")
        }
    }

    render() {
        const { username, name, bio, password, password_confirmation } = this.state
        return (
        <div id="signup" className="form-container">
            {this.props.currentUser === "pending" ? null : <Redirect to="/profile" />}
                <Grid textAlign='center' style={{ height: '80vh' }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <h1>Sign Up for PetTown</h1>
                        <Form size='large' onSubmit={this.handleSubmit}>
                            <Segment stacked>
                            {/* <Button as="label" htmlFor="file" type="button">
                                Choose Profile Picture
                            </Button>
                            <input id="file" type="file" style={{ display: "none" }} name="profile_picture" onChange={this.handleFileInputChange} /> */}
                            <input type="file" placeholder="Profile Picture" name="profile_picture" onChange={this.handleFileInputChange} style={{fontFamily: "Arial", fontSize: "13px", marginBottom: "1em"}}/>
                            <Form.Input 
                                fluid icon='user' 
                                iconPosition='left' 
                                placeholder='Username' 
                                name="username" 
                                onChange={this.handleInputChange} 
                                value={username} 
                            />
                            <Form.Input 
                                fluid icon='user' 
                                iconPosition='left' 
                                placeholder='Name' 
                                name="name" 
                                onChange={this.handleInputChange} 
                                value={name} 
                            />
                            <Form.Input 
                                fluid icon='write' 
                                iconPosition='left' 
                                placeholder='Bio' 
                                name="bio" 
                                onChange={this.handleInputChange} 
                                value={bio} 
                            />
                            <Form.Input
                                fluid
                                icon='lock'
                                iconPosition='left'
                                placeholder='Password'
                                type='password'
                                name="password" 
                                onChange={this.handleInputChange} 
                                value={password} 
                            />
                            <Form.Input
                                fluid
                                icon='lock'
                                iconPosition='left'
                                placeholder='Confirm Password'
                                type='password'
                                name="password_confirmation" 
                                onChange={this.handleInputChange} 
                                value={password_confirmation} 
                            />
                            <button type="submit" className="ui fluid button">Sign Up</button>
                            </Segment>
                        </Form>
                        <Message>
                            Already have an Account? <Link to="/login">Log In</Link>
                        </Message>
                    </Grid.Column>
                </Grid>
        </div>
        )
    }
}

export default SignUp;