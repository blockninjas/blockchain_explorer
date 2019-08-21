import React, { FunctionComponent, useState } from 'react';
import { Container, Row, Col, Alert } from 'reactstrap';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Sidebar, Detail } from '../../components/Space';
import { ModalAddItem } from '../../components/Space/Modals';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Graph from './Graph';

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
      }
      outgoing {
        value
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

const Space: FunctionComponent<RouteComponentProps<RouteProps>> = ({ match }) => {
  const currentSpaceId = match.params.id;
  const [isModalAddItemOpen, toggleAddItemModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState();
  const [addresses, setAddresses] = useState(Array<String>());

  const { loading, error, data } = useQuery(GET_SPACE, { variables: { spaceId: currentSpaceId }});
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: ${error}</div>;

  console.log("Current Space", data.space);

  return (
    <>
      <Container fluid className="p-0 d-flex flex-column flex-grow-1">
        <Row noGutters className="flex-grow-1 bg-light">
          <Col className="bg-white shadow" lg="2">
            <Sidebar searchPlaceholder="Search Cluster" btnText="Add Item" onBtnClick={() => toggleAddItemModal(!isModalAddItemOpen)} />
          </Col>

          <Col style={{overflow: 'hidden'}}>
            <Graph addresses={addresses} />
          </Col>

          {selectedAddress && <NodeDetail base58check={selectedAddress} />}
        </Row>
      </Container>

      <ModalAddItem 
          isOpen={isModalAddItemOpen} 
          toggle={() => toggleAddItemModal(!isModalAddItemOpen)} 
          onAddItem={(base58check: String) => { 
            setAddresses(oldAddresses => [...oldAddresses, base58check]);
            setSelectedAddress(base58check);
            toggleAddItemModal(!isModalAddItemOpen);
          }}
      />
    </>);
}

const NodeDetail: FunctionComponent<{base58check: string}> = (props) => {
  const { loading, error, data }= useQuery(GET_ADDRESS, { variables: { base58check: props.base58check }});
  if (loading) return <div>Loading...</div>;
  if (error) { 
    console.error(error);
    return <Alert color="danger">Sorry, could not fetch address for given crypto hash.</Alert>;
  }

  const { address } = data;
  const base58check = address.base58check;
  const priorityTag =  address.tags.length >= 1 && address.tags.reduce((tagL: any, tagR: any) => tagL.priority < tagR.priority ? tagR: tagL).title;
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

export default withRouter(Space);