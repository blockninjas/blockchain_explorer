import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient, { InMemoryCache, gql, NormalizedCacheObject } from 'apollo-boost';
import uuid from 'uuid';
import { persistCache } from 'apollo-cache-persist';
import { PersistentStorage, PersistedData } from 'apollo-cache-persist/types';
import './custom.scss';
import { Router } from './Router';
import { QUERY_SPACES, GET_NODE_ADDRESSES, GET_ADDRESS, TYPE_NAMES } from './types';

type Address = {
  __typename: string,
  id: string,
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
        return nodeAddresses.filter((nodeAddress: Address) => nodeAddress.spaceId === space.id);
      }
    },
    NodeAddress: {
      /**
       * Resolver to fetch remote Address for given local-only NodeAddress
       */
      address: async (parent: { base58check: string, spaceId: number }, _variables, _context) => {
        const { data }: any = await client.query({ query: GET_ADDRESS, variables: { base58check: parent.base58check }});
        return data.address;
      },
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
          id: uuid.v4(),
          ...variables,
          createdAt: "A few seconds ago",
          isBookmark: false,
          __typename: TYPE_NAMES.SPACE,
        };

        client.writeQuery({query: QUERY_SPACES, data: { spaces: [...allSpaces.spaces, newSpace] }});

        return newSpace;
      },
      toggleSpaceBookmark: (_root, variables, { cache, getCacheKey }) => {
        const id = getCacheKey({ __typename: TYPE_NAMES.SPACE, id: variables.id })
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
      addNodeAddressToSpace: (_root, { base58check, spaceId }, { _cache, _getCacheKey }) => {
        const allNodeAddresses = client.readQuery({query: GET_NODE_ADDRESSES});
        
        const newAddress: Address = {
          base58check: base58check,
          spaceId: spaceId,
          id: uuid.v4(),
          __typename: TYPE_NAMES.NODE_ADDRESS
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
        __typename: TYPE_NAMES.SPACE, 
        id: "1", 
        name: 'Akt A4144', 
        createdAt: 'Today, 12:30', 
        isBookmark: true
      },
      { __typename: TYPE_NAMES.SPACE, id: "2", name: 'Akt AB132', createdAt: 'Today, 11:10', isBookmark: true },
      { __typename: TYPE_NAMES.SPACE, id: "3", name: 'Akt EX333', createdAt: 'Yesterday, 14:23', isBookmark: false },
    ],
    nodeAddresses: [
      {
        __typename: TYPE_NAMES.NODE_ADDRESS,
        id: uuid.v4(),
        spaceId: "1",
        base58check: "18fu4QYhAtNt5yJvB7BSEo5twmrm6QUiTx"
      },
      {
        __typename: TYPE_NAMES.NODE_ADDRESS,
        id: uuid.v4(),
        spaceId: "1",
        base58check: "1AGqp9CLEhzsB5eiMyNFHvEgwXeH1ELQVS"
      }
    ]
  }
}

const setupAndRender = async () => {
  // await before instantiating ApolloClient, else queries might run before the cache is persisted
  /*await persistCache({
    cache: cache,
    storage: window.localStorage as PersistentStorage<PersistedData<NormalizedCacheObject>>
  });*/
  ReactDOM.render(<ApolloProvider client={client}><Router /></ApolloProvider>, document.getElementById('root'));
}

setupAndRender();

cache.writeData(initialCacheData);
client.onResetStore(async () => cache.writeData(initialCacheData));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
