import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import Routes from './Routes'
import { ApolloProvider } from "react-apollo";
import 'semantic-ui-css/semantic.min.css'
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import ApolloClient from "apollo-boost";
import { createUploadLink } from 'apollo-upload-client'
import { WebSocketLink } from 'apollo-link-ws';


const httpLink = createUploadLink({
  uri: 'http://localhost:8080/graphql',
});


const wsLink = new WebSocketLink({
  uri: `ws://localhost:8080/graphql`,
  options: {
    reconnect: true,
  },
});

const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link,
})



const App = (
    <ApolloProvider client={client}>
        <Routes />
    </ApolloProvider>
)

ReactDOM.render(App, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();