import React, { Component } from "react";

import "semantic-ui-css/semantic.min.css";

import { Button, Container, Header, Menu, Segment } from "semantic-ui-react";
import "./LandingPage.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Segment inverted vertical textAlign="center">
          <Container as="nav">
            <Header inverted as="h1">
              Chat with me
            </Header>
            <Menu borderless compact inverted>
              <Menu.Item active>Home</Menu.Item>
              <Menu.Item>Feature</Menu.Item>
              <Menu.Item>Contact</Menu.Item>
            </Menu>
          </Container>
          <Container className="content">
            <Header inverted as="h1">
              Chat with me.
            </Header>
            <Button size="huge">Register</Button>
            <Button size="huge">Login</Button>
          </Container>
          <Segment inverted vertical as="footer">
            An application by Alexander Lötvall
          </Segment>
        </Segment>
      </div>
    );
  }
}

export default App;