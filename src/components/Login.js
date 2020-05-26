import React from 'react';
import { BrowserRouter as Route, Link } from "react-router-dom";
import { Form, Grid, Message, Segment } from 'semantic-ui-react'

class Login extends React.Component {
    state = {
        username: "",
        password: "",
    }

    handleInputChange = event => {
        this.setState({
        [event.target.name]: event.target.value
        })
    }

    handleSubmit = event => {
        event.preventDefault()
        fetch("http://localhost:3000/login", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(this.state)
        })
        .then(r => {
            if (!r.ok) {
            alert('Username or password do not match.')
            throw r
            }
            return r.json()
        }
        )
        .then(user => {
            this.props.handleUpdateCurrentUser(user)
            this.props.history.push("/home")
        })
        .catch(console.error)
    }

    render() {
        const { username, password } = this.state
        return (
        <div id="login" className="form-container">
            <Grid textAlign='center' style={{ height: '80vh' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                    <h1>Log-in to PetTown</h1>
                    <Form size='large' onSubmit={this.handleSubmit}>
                        <Segment stacked>
                        <Form.Input 
                            fluid icon='user' 
                            iconPosition='left' 
                            placeholder='Username' 
                            name="username" 
                            onChange={this.handleInputChange} 
                            value={username} 
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
                        <button type="submit" className="ui fluid button">Login</button>
                        </Segment>
                    </Form>
                    <Message>
                        New to Pettown? <Link to="/signup">Sign Up</Link>
                    </Message>
                </Grid.Column>
            </Grid>
        </div>
        )
    }
}

export default Login;


// {/* <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
//     <Grid.Column style={{ maxWidth: 450 }}>
//         <Header as='h2' color='teal' textAlign='center'>
//             Log-in to your account
//         </Header>
//         <Form size='large'>
//             <Segment stacked>
//             <Form.Input 
//                 fluid icon='user' 
//                 iconPosition='left' 
//                 placeholder='Username' 
//                 name="username" 
//                 onChange={this.handleInputChange} 
//                 value={username} 
//             />
//             <Form.Input
//                 fluid
//                 icon='lock'
//                 iconPosition='left'
//                 placeholder='Password'
//                 type='password'
//                 name="password" 
//                 onChange={this.handleInputChange} 
//                 value={password} 
//             />

//             <Button color='teal' fluid size='large'>
//                 Login
//             </Button>
//             </Segment>
//         </Form>
//         <Message>
//             New to us? <a href='#'>Sign Up</a>
//         </Message>
//     </Grid.Column>
// </Grid> */}