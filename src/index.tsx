import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient, { InMemoryCache, gql } from 'apollo-boost';
import './custom.scss';
import { Router } from './Router';

const cache = new InMemoryCache();

type Space = {
  id: number,
  name: string,
  createdAt: string,
  isBookmark: boolean
};

const client = new ApolloClient({
  uri: 'http://localhost:4000/api/graphql',
  cache: cache,
  resolvers: {
    Query: {
      space: (_parent, variables, { cache, getCacheKey }) => {
        const id = getCacheKey({ __typename: 'Space', id: variables.id })
        const fragment = gql`
          fragment singleSpace on Space {
            name
            createdAt
            isBookmark
          }
        `;
        const space = cache.readFragment({ fragment, id });
        return space;
      }
    },
    Mutation: {
      addSpace: (_root, variables, { _cache, _getCacheKey }) => {
        const querySpaces = gql`
          query AllSpaces {
            spaces {
              id
              name
              createdAt
              isBookmark
            }
          }
        `;

        const allSpaces = client.readQuery({query: querySpaces});

        const newSpace: Space = {
          id: allSpaces.spaces.length + 1,
          ...variables,
          createdAt: "A few seconds ago",
          isBookmark: false,
          __typename: "Space",
        };

        client.writeQuery({query: querySpaces, data: { spaces: [...allSpaces.spaces, newSpace] }});

        return newSpace;
      },
      toggleSpaceBookmark: (_root, variables, { cache, getCacheKey }) => {
        const id = getCacheKey({ __typename: 'Space', id: variables.id })
        const fragment = gql`
          fragment bookmarkSpace on Space {
            isBookmark
          }
        `;
        const space = cache.readFragment({ fragment, id });
        const data = { ...space, isBookmark: !space.isBookmark };
        cache.writeData({ id, data });
        return null;
      },
    },
  }
});

// TODO: add apollo-cache-persistent to use localStorage for cache, see:
// https://github.com/apollographql/apollo-cache-persist/issues/73#issuecomment-473985201

const initialCacheData = {
  data: {
    spaces: [
      {__typename: 'Space', id: 1, name: 'Akt A4144', createdAt: 'Today, 12:30', isBookmark: true},
      {__typename: 'Space', id: 2, name: 'Akt AB132', createdAt: 'Today, 11:10', isBookmark: true},
      {__typename: 'Space', id: 3, name: 'Akt EX333', createdAt: 'Yesterday, 14:23', isBookmark: false},
    ]
  }
}

ReactDOM.render(<ApolloProvider client={client}><Router /></ApolloProvider>, document.getElementById('root'));

cache.writeData(initialCacheData);
client.onResetStore(async () => cache.writeData(initialCacheData));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
