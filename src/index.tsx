import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient, { InMemoryCache, gql, NormalizedCacheObject } from 'apollo-boost';
import { persistCache } from 'apollo-cache-persist';
import { PersistentStorage, PersistedData } from 'apollo-cache-persist/types';
import './custom.scss';
import { Router } from './Router';
import { QUERY_SPACES, GET_NODE_ADDRESSES } from './types';

type Address = {
  __typename: string,
  //id: string,
  spaceId: number,
  base58check: string
}

type Space = {
  __typename: string,
  id: number,
  name: string,
  createdAt: string,
  isBookmark: boolean
};

const cache = new InMemoryCache();
const client = new ApolloClient({
  uri: 'http://localhost:4000/api/graphql',
  cache: cache,
  resolvers: {
    Space: {
      nodeAddresses: (space, _args, { cache }) => {
        const { nodeAddresses } = cache.readQuery({ query: GET_NODE_ADDRESSES });
        return nodeAddresses;
      }
    },
    Query: {
      space: (_parent, variables, { cache, getCacheKey }) => {
        const id = getCacheKey({ __typename: 'Space', id: variables.id })
        const fragment = gql`
          fragment singleSpace on Space {
            id
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
        const allSpaces = client.readQuery({query: QUERY_SPACES});

        const newSpace: Space = {
          id: allSpaces.spaces.length + 1,
          ...variables,
          createdAt: "A few seconds ago",
          isBookmark: false,
          __typename: "Space",
        };

        client.writeQuery({query: QUERY_SPACES, data: { spaces: [...allSpaces.spaces, newSpace] }});

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
      addAddressToSpace: (_root, { address, spaceId }, { cache, getCacheKey }) => {
        // TODO: may be removed in the near future
        const allNodeAddresses = client.readQuery({query: GET_NODE_ADDRESSES});
        
        const newAddress: Address = {
          base58check: address,
          spaceId: spaceId,
          //id: variables.address,
          __typename: "NodeAddress"
        }

        client.writeQuery({query: GET_NODE_ADDRESSES, data: { nodeAddresses: [...allNodeAddresses.nodeAddresses, newAddress] }});

        return newAddress;
      }
    },
  }
});

const initialCacheData = {
  data: {
    spaces: [
      {
        __typename: 'Space', 
        id: 1, 
        name: 'Akt A4144', 
        createdAt: 'Today, 12:30', 
        isBookmark: true
      },
      { __typename: 'Space', id: 2, name: 'Akt AB132', createdAt: 'Today, 11:10', isBookmark: true },
      { __typename: 'Space', id: 3, name: 'Akt EX333', createdAt: 'Yesterday, 14:23', isBookmark: false },
    ],
    nodeAddresses: [
      {
        __typename: 'NodeAddress',
        id: 'A1',
        spaceId: 1,
        base58check: "1DcJGpZvUyqhNCbxKADXPUTznn8Np55vwb"
      },
      {
        __typename: 'NodeAddress',
        id: 'A2',
        spaceId: 1,
        base58check: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
      },
    ]
  }
}

const setupAndRender = async () => {
  // await before instantiating ApolloClient, else queries might run before the cache is persisted
  await persistCache({
    cache: cache,
    storage: window.localStorage as PersistentStorage<PersistedData<NormalizedCacheObject>>
  });
  ReactDOM.render(<ApolloProvider client={client}><Router /></ApolloProvider>, document.getElementById('root'));
}

setupAndRender();

cache.writeData(initialCacheData);
client.onResetStore(async () => cache.writeData(initialCacheData));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
