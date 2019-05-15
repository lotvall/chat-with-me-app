import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
//import Routes from './Routes'
import { ApolloProvider } from "react-apollo";
import 'semantic-ui-css/semantic.min.css'
// import client from './apollo'

import ApolloClient from "apollo-boost";
import { createUploadLink } from 'apollo-upload-client'


const httpLink = createUploadLink({
  uri: 'http://localhost:8080/graphql',
});

const client = new ApolloClient({
  link: httpLink,
})

const App = (
    <ApolloProvider client={client}>
        <h2>An apollo app</h2> 
    </ApolloProvider>
)

ReactDOM.render(App, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();