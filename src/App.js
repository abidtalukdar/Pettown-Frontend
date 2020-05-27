import React from 'react';
import './App.css';
import Home from './components/Home'
import Navbar from './containers/Navbar'
import Login from './components/Login'
import Divider from './components/Divider'
import SignUp from './components/SignUp'
import Profile from './components/Profile';
import { BrowserRouter as Router, Route } from "react-router-dom"; 

class App extends React.Component {
    state = {
        // lat: 0,
        // long:0,
        // currentLat: 0,
        // currentLong: 0,
        // currentLocation: "",
        currentUser: "pending",
        userImages: [],
        followers: [],
        followees: [],
        followeeImages: [],
        users: []
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.currentUser !== prevState.currentUser && this.state.currentUser !== "pending") {
            let userId = this.state.currentUser.id
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
            fetch(`http://localhost:3000/users/${userId}/followees/images`)
                .then(r => r.json())
                .then(object => {
                    this.setState({
                        followeeImages: []
                    })
                    this.setState({
                        followeeImages: object
                    })
                })
            fetch(`http://localhost:3000/users`)
                .then(r => r.json())
                .then(object => {
                    this.setState({
                        users: []
                    })
                    this.setState({
                        users: object
                    })
                })
        }
    }

    handlePostImage = (form) => {
        fetch("http://localhost:3000/images", {
            method: "POST",
            body: form
        })
        .then(r => r.json())
        .then(imageObj => {
            this.setState(prevState => {
                return {
                    userImages: [...prevState.userImages, imageObj]
                }
            })
        })
    }

    // handlePostComment = (commentData) => {
    //     console.log(commentData)
    //     fetch("http://localhost:3000/comments", {
    //         method: "POST",
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(commentData)
    //     })
    //     .then(r => r.json())
    // }

    handleUpdateCurrentUser = (user) => {
        this.setState({
            currentUser: user
        })
    }

    render() {  
        return (
        <div className="App">
            <Router>
                <Navbar user={this.state.currentUser} users={this.state.users} handleUpdateCurrentUser={this.handleUpdateCurrentUser}/> 
                <Divider />
                <div className="main">
                    <Route exact path={`/home`} render={routeProps => <Home {...routeProps} currentUser={this.state.currentUser} followers={this.state.followers} followees={this.state.followees} followeeImages={this.state.followeeImages} handlePostImage={this.handlePostImage}/>} />
                    <Route path={'/profile/:id'} render={routeProps => <Profile {...routeProps} currentUser={this.state.currentUser} followers={this.state.followers} followees={this.state.followees} userImages={this.state.userImages} handlePostImage={this.handlePostImage}/>} />
                    <Route exact path={`/signup`} render={routeProps => <SignUp {...routeProps} currentUser={this.state.currentUser}/>} />
                    <Route exact path={`/login`} render={routeProps=> <Login {...routeProps} handleUpdateCurrentUser={this.handleUpdateCurrentUser}/>}/> 
                </div>
            </Router>
        </div>
        );
    }
}

export default App;
