import React, { FunctionComponent, useState } from 'react';
import { Container, Row, Col, Alert } from 'reactstrap';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Sidebar, Detail } from '../../components/Space';
import { ModalAddItem } from '../../components/Space/Modals';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Graph from './Graph';
import { Loading } from '../../components/Loading';

type RouteProps = {
  id: string
}

const GET_SPACE = gql`
  query getSpace($spaceId: Int!) {
    space(id: $spaceId) @client {
      id
      name
      createdAt
      isBookmark
      nodeAddresses @client {
        base58check
        spaceId
        address @client {
          base58check
          incoming {
            value
            transaction {
              block {
                creationTime
              }
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
              block {
                creationTime
              }
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
        }
      }
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
          block {
            creationTime
          }
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
          block {
            creationTime
          }
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

const ADD_NODE_ADDRESS_TO_SPACE= gql`
  mutation addNodeAddressToSpace($name: String!, $spaceId: Integer!) {
    addNodeAddressToSpace(base58check: $base58check, spaceId: $spaceId) @client
  }
`;

const Space: FunctionComponent<RouteComponentProps<RouteProps>> = ({ match }) => {
  const currentSpaceId = match.params.id;
  const [isModalAddItemOpen, toggleAddItemModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState();
  const [addNodeAddressToSpace] = useMutation(ADD_NODE_ADDRESS_TO_SPACE);

  const { loading, error, data } = useQuery<TypedQuerySpace>(GET_SPACE, { variables: { spaceId: currentSpaceId }});
  if (loading) return <LoadingSpace />;
  if (error) return <div>Error: ${error}</div>;

  const space = data!.space;

  console.log("Current Space", space);

  const addresses = space!.nodeAddresses.map((nodeAdd) => nodeAdd.base58check);
  
  const edges = [];
  
  for (let nodeAddress of space.nodeAddresses) {
    const source = nodeAddress.base58check;
    
    const outputs = nodeAddress.address.outgoing.map((tx) => tx.transaction.outputs).flat();
    for (let output of outputs) {
      const target = output.address.base58check;
      edges.push({ source: source, target: target });
    }
  }

  const tags = space.nodeAddresses.map((nodeAdd: any) => nodeAdd.address.tags).flat();

  return (
    <>
      <Container fluid className="p-0 d-flex flex-column flex-grow-1">
        <Row noGutters className="flex-grow-1 bg-light">
          <Col className="bg-white shadow" lg="2">
            <Sidebar 
              searchPlaceholder="Search Cluster" 
              btnText="Add Item" 
              onBtnClick={() => toggleAddItemModal(!isModalAddItemOpen)}
              items={tags.map((tag: { title: string }) => tag.title)}
            />
          </Col>

          <Col style={{overflow: 'hidden'}}>
            <Graph 
              addresses={addresses} 
              edges={edges} 
              onSelectAddress={setSelectedAddress} 
            />
          </Col>

          {selectedAddress && <NodeDetail base58check={selectedAddress} />}
        </Row>
      </Container>

      <ModalAddItem 
          isOpen={isModalAddItemOpen} 
          toggle={() => toggleAddItemModal(!isModalAddItemOpen)} 
          onAddItem={(base58check: string) => { 
            addNodeAddressToSpace({ 
              variables: { base58check: base58check, spaceId: match.params.id },
              refetchQueries: ["getSpace"]
            });
            /*
            setAddresses(oldAddresses => [...oldAddresses, base58check]);*/
            //setSelectedAddress(base58check);

            toggleAddItemModal(!isModalAddItemOpen);
          }}
      />
    </>);
}

const NodeDetail: FunctionComponent<{base58check: string}> = (props) => {
  const { loading, error, data }= useQuery<{address: TypedQueryAddress}>(GET_ADDRESS, { variables: { base58check: props.base58check }});
  if (loading) return <div>Loading...</div>;
  if (error) { 
    console.error(error);
    return <Alert color="danger">Sorry, could not fetch address for given crypto hash.</Alert>;
  }

  const address = data!.address;
  const base58check = address.base58check;
  const priorityTag =  address.tags.length >= 1 ? address.tags.reduce((tagL: any, tagR: any) => tagL.priority < tagR.priority ? tagR: tagL).title : "";
  const balanceReceived = address.incoming.reduce((sum: number, current: any) => sum + current.value, 0)
  const balanceSent = address.outgoing.reduce((sum: number, current: any) => sum + current.value, 0)
  const balanceBtc = balanceReceived - balanceSent;

  return (
    <Col className="bg-white" lg="2">
      <Detail 
        tag={priorityTag}
        name={base58check} 
        balance={balanceBtc}
        sentCount={balanceSent} 
        receivedCount={balanceReceived}
      />
    </Col>
  )
}

const LoadingSpace = () => <div className="w-100 h-100 d-flex justify-content-center align-items-center"><Loading /></div>;

export default withRouter(Space);

type TypedQuerySpace = {
  space: {
    nodeAddresses: Array<TypedQueryNodeAddress>;
  };
};

type TypedQueryNodeAddress = {
  base58check: string;
  address: TypedQueryAddress;
};

type TypedQueryAddress = {
  base58check: string;
  incoming: Array<TypedQueryInOut>;
  outgoing: Array<TypedQueryInOut>;
  tags: Array<TypedQueryTags>;
}

type TypedQueryInOut = {
  value: number;
  transaction: TypedQueryTransaction;
};

type TypedQueryTransaction = {
  hash: string;
  block: TypedQueryBlock;
  inputs: Array<{
    address: {
      base58check: string;
    }
  }>
  outputs: Array<{
    address: {
      base58check: string;
    }
  }>
}

type TypedQueryBlock = {
  creationTime: string;
}

type TypedQueryTags = {
  title: string;
  category: string;
  priority: number;
};