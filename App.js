import React from "react";
import { AsyncStorage } from 'react-native';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { HttpLink } from 'apollo-link-http';
import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { ApolloProvider } from 'react-apollo';
import AppContainer from "./AppContainer";

// Local machine IPv4 address:
const API_URL = 'http://192.168.0.12:4000/graphql';
const SOCKET_URL = 'ws://192.168.0.12/graphql';

const httpLink = new HttpLink({
  uri: API_URL,
});

const wsLink = new WebSocketLink({
  uri: SOCKET_URL,
  options: {
    reconnect: true,
  },
});

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem('token');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);

    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const cache = new InMemoryCache();

const client = new ApolloClient({
  link: authLink.concat(link),
  cache,
});

const App = () => (
  <ApolloProvider client={client}>
    <AppContainer />
  </ApolloProvider>
);

export default App;

// package.json
// expo init house-listing
// expo install react-navigation react-navigation-stack react-navigation-tabs
// expo install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-community/masked-view
// expo install lottie-react-native
// expo install styled-components
// expo install graphql-tag
// expo install graphql apollo-client apollo-link-http apollo-cache-inmemory react-apollo
// expo install apollo-link-context
// expo install apollo-link-ws subscriptions-transport-ws apollo-utilities
