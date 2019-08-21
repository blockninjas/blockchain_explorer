import gql from "graphql-tag";

const QUERY_SPACES = gql`
  query AllSpaces {
    spaces {
      id
      name
      createdAt
      isBookmark
    }
  }
`;

const GET_NODE_ADDRESSES = gql`
  query GetNodeAddresses {
    nodeAddresses @client {
      spaceId
      base58check
    }
  }
`;

export { QUERY_SPACES, GET_NODE_ADDRESSES };