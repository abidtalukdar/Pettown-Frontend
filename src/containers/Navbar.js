import React from 'react';
// import SearchBar from '../components/SearchBar';
import { BrowserRouter as Route, Link } from "react-router-dom";
import {
    Container,
    Menu,
    Segment,
    Visibility,
    Input,
} from 'semantic-ui-react'


class Navbar extends React.Component {

    state = {}

    hideFixedMenu = () => this.setState({ fixed: false })
    showFixedMenu = () => this.setState({ fixed: true })

    handleLogout = () => {
        fetch("http://localhost:3000/logout", {
          method: "POST",
          credentials: "include"
        })
          .then(r => r.json())
          .then(() => {
            this.props.handleUpdateCurrentUser("pending")
          })
      }

    render() {
        const { fixed } = this.state
        return (
            <Visibility
                once={false}
                onBottomPassed={this.showFixedMenu}
                onBottomPassedReverse={this.hideFixedMenu}
                >
                <Segment
                    textAlign='center'
                    style={{height: 100}}
                    vertical
                >
                        {this.props.user === "pending" ? 
                            <Menu
                                widths={2}
                                fixed={fixed ? 'top' : null}
                                secondary={!fixed}
                                size='large'
                            >
                                <Menu.Item>
                                    <Link to="/home"><h1 className="logo">PETTOWN</h1></Link>
                                </Menu.Item>
                                <Menu.Item position='left'>
                                    <Link to="/login"><button className="ui right floated large button">Log in</button></Link>
                                    <Link to="/signup"><button className="ui right floated large button">Sign Up</button></Link>
                                </Menu.Item>
                            </Menu>
                        :

                            <Menu
                                widths={2}
                                fixed={fixed ? 'top' : null}
                                secondary={!fixed}
                                size='large'
                            >
                                <Menu.Item>
                                    <Link to="/home"><h1 className="logo">PETTOWN</h1></Link>
                                </Menu.Item>
                                {/* <Menu.Item position='right'>
                                    <SearchBar users={this.props.users} />
                                </Menu.Item> */}
                                <Menu.Item position='left'>
                                <Link to={{
                                        pathname: `/profile/${this.props.user.id}`,
                                        userId: this.props.user.id
                                    }}><button className="ui right floated large button">My Profile</button></Link>
                                    <Link to="/login"><button className="ui right floated large button" onClick={this.handleLogout}>Logout</button></Link>
                                </Menu.Item>
                            </Menu>
                        }
                </Segment>
            </Visibility>
        );
    }
}

export default Navbar;