// dependencies
import React, { Component } from 'react';
import { withRouter, BrowserRouter, Route, NavLink } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
// components
import Profile from './profile/Profile';
import Locals from './locals/Locals';
import Chat from './chat/Chat';
import Splash from './splash/Splash';


// creates navigation bar by which users will navigate through app

class Navigator extends Component {

    constructor (props) {
      super(props);
      this.state = {
        locationQuery: '',
        profile: null,
        userData: {},
        myMessages: {},
      }
    }

    componentDidMount() {
      // The token is passed down from the App component 
      // and used to retrieve the profile
      this.props.lock.getProfile(this.props.idToken, function (err, profile) {
        if (err) {
          console.log("Error loading the Profile", err);
          return;
        }
        this.setState({ profile }, () => {
          axios.get(`/api/profiles/${this.state.profile.given_name}_${this.state.profile.family_name}`)
            .then( (results) => {
              if (results.data) {
                console.log('results found', results.data)
                this.setState({userData: results.data});
              } else {
                console.log('results not found', results.data)
                axios.post('/api/profiles/createnew', {
                  username: `${this.state.profile.given_name}_${this.state.profile.family_name}`,
                  location: '',
                  biography: '',
                  isLocal: false,
                  rating: '[]',
                  imageUrl: this.state.profile.picture_large,
                })
                  .then(results => this.setState({userData: results.data}))
                  .catch(err => console.error(err))
                }
              })
            .catch( (err) => {
              throw err;
            })
            .then(() => {
              axios.get(`/api/messages/${this.state.userData.username}`)
              .then((results) => {
                this.setState({ myMessages: this.sortByRoom(results.data) })
              }).catch(err => console.error(err));
            }).catch(err => console.error(err));
        });
      }.bind(this));
    }

    handleKeyPress (val, event) {
      if(event.key == 'Enter'){
        val.history.push('/Locals');
      }
      this.setState({ locationQuery: val.text });
    }

    sortByRoom = (messagesArray) => {
      let objectOfConvos = {};
      messagesArray.forEach((message) => {
        if (objectOfConvos[message.conversationId]) {
          objectOfConvos[message.conversationId].push(message);
        } else {
          objectOfConvos[message.conversationId] = [message];
        }
      });
      return objectOfConvos;
    }
    

    render() {
      console.log('!!!!!!!!!!!!', this.state.userData.imageUrl);
      return (
        <div>
          <div>
            <div>

              <BrowserRouter lock={this.props.lock}>
                <div>
                  <nav className="navbar navbar-toggleable-md navbar-light bg-faded">
                  <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav main-nav">		
                      <li className="nav-item active left-logo">		
                        <NavLink to='/' className="navbar-brand">localhost</NavLink>		
                      </li>		
                      <li className="nav-item right-logo">		
                        <ul className="right-list">		
                          <li className="right-list-item">		
                          <NavLink to='/Profile' >Edit Profile</NavLink>		
                          </li>		
                          <li className="right-list-item">                        		
                            <NavLink to='/' className="nav-link">		
                              <span onClick={this.props.logout}>Logout</span>	 	
                              <span>< img className='profile-pic' src={this.state.userData.imageUrl} /></span>		
                            </NavLink>		
                          </li>		
                          </ul>		
                        </li>		
                    </ul>		
                  </div>		
                  </nav>

                  <Route exact path='/' render={(props) => (
                    <Splash
                      {...props}
                      lock={this.props.lock}
                      idToken={this.props.idToken}
                      handleKeyPress={this.handleKeyPress.bind(this)}
                      myMessages={this.state.myMessages}
                    />
                  )}/>
                  <Route path='/Locals' render={(props) => (
                    <Locals
                      {...props}
                      lock={this.props.lock}
                      idToken={this.props.idToken}
                      locationQuery={this.state.locationQuery}
                    />
                  )}/>
                  <Route path='/Profile' render={(props) => (
                    <Profile
                      {...props}
                      user={this.state.userData}
                      lock={this.props.lock}
                      idToken={this.props.idToken}
                    />
                  )}/>
                  <Route path='/Chat' render={(props) => (
                    <Chat
                      {...props}
                      lock={this.props.lock}
                      idToken={this.props.idToken}
                    />
                  )}/>
                </div>
              </BrowserRouter>
            </div>
          </div>
        </div>
      )
    }
    
}

export default Navigator;