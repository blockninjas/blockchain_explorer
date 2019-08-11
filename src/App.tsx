import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { Header } from './components/Header';

library.add(fas, far);

const client = new ApolloClient({
  uri: 'http://localhost:4000/api/graphql',
});

export const App: React.FC = ({ children }) => (
  <ApolloProvider client={client}>
    <Header />
    {children}
  </ApolloProvider>
);
