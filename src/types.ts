import gql from "graphql-tag";

const TYPE_NAMES = {
  SPACE: "Space",
  NODE_ADDRESS: "NodeAddress"
};

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

const GET_ADDRESS = gql`
  query getAddress($base58check: String!) {
    address(base58check: $base58check) {
      base58check
      incoming {
        value
        transaction {
          hash
          inputs {
            address {
              base58check
            }
          }
          outputs {
            address {
              base58check
            }
          }
        }
      }
      outgoing {
        value
        transaction {
          hash
          inputs {
            address {
              base58check
            }
          }
          outputs {
            address {
              base58check
            }
          }
        }
      }
      tags {
        title
        category
        priority
      } 
      cluster {
        tags {
          title
          category
          priority
        }
      }
    }
  }
`;

export { TYPE_NAMES, QUERY_SPACES, GET_NODE_ADDRESSES, GET_ADDRESS };