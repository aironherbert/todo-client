import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider
} from "@apollo/client";

const uri = process.env.NODE_ENV === 'production' ? 'https://misty-voice-2266.fly.dev/api' : 'http://localhost:4000/api';

const client = new ApolloClient({
  // uri: 'https://misty-voice-2266.fly.dev/api',
  // uri: 'http://localhost:4000/api',
  uri: uri,
  cache: new InMemoryCache()
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);



