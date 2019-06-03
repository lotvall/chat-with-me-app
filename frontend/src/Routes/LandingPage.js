import React, { Component } from "react";
import backgroundPhoto from '../static/images/backgroundPhoto3.jpg'

import "semantic-ui-css/semantic.min.css";

import { Button, Container, Header, Menu, Segment } from "semantic-ui-react";
import "./LandingPage.css";

class App extends Component {
  render() {
    return (
      <div className="App" >
          <Segment inverted vertical textAlign="center" style={{
        backgroundImage: 'url(' + backgroundPhoto + ')',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#000000',    
        opacity: '0.8',
        width: '100%'
        
      }}>
  
            <Container className="content"
              
            >
              <Header inverted as="h1">
                Chat with me.
            </Header>
              <Button onClick={() => {
                this.props.history.push('/register')

              }} size="large">Register</Button>
              <Button onClick={() => {
                this.props.history.push('/login')

              }} size="large">Login</Button>
            </Container>
          </Segment>
        </div>    
        );
  }
}

export default App;