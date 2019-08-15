import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Sidebar, Detail } from '../../components/Space';
import { ModalAddItem } from '../../components/Space/Modals';

type Props = {
  // no-op
}

type State = {
  isModalAddItemOpen: boolean
}

export class Space extends React.Component<Props, State> {
  state: Readonly<State> = {
    isModalAddItemOpen: false
  };

  toggleModalAddItem() {
    this.setState({
      isModalAddItemOpen: !this.state.isModalAddItemOpen
    });
  }

  onAddItem(base58check: string) {
    console.log("Adding address", base58check);
  }

  render(): JSX.Element {
    const { isModalAddItemOpen } = this.state;

    return (
      <>
        <Container fluid className="p-0 d-flex flex-column flex-grow-1">
          <Row noGutters className="flex-grow-1 bg-light">
            <Col className="bg-white shadow" lg="2">
              <Sidebar searchPlaceholder="Search Cluster" btnText="Add Item" onBtnClick={() => this.toggleModalAddItem()} />
            </Col>

            <Col style={{overflow: 'hidden'}}>
              {/*<div className="h-100" ref={this.graphElementDiv}>
                <ApolloConsumer>
                  {client => (
                    <Graph graphData={graph} 
                      height={mainElementHeight} width={mainElementWidth} 
                      onSelectItem={(item: any) => this.loadAddress(item, client)}
                      onExpandIncomingTransactions={(base58check: string) => this.onExpandIncomingTransactions(client, base58check)}
                      onExpandOutgoingTransactions={(base58check: string) => this.onExpandOutgoingTransactions(client, base58check)}
                      onDelete={(base58check: string) => this.onDelete(base58check)}
                    />
                  )}
                </ApolloConsumer>
              </div>*/}
            </Col>

            {this.renderDetail(null)}
          </Row>

          {/*<ApolloConsumer>
            {client => (<ModalAddItem isOpen={false} toggle={() => console.log('toggle')} onAddItem={(base58check: string) => console.log(base58check)} />)}
          </ApolloConsumer>*/}
        </Container>

        <ModalAddItem 
            isOpen={isModalAddItemOpen} 
            toggle={() => this.toggleModalAddItem()} 
            onAddItem={this.onAddItem} />
      </>
    );
  }

  renderDetail(selectedItem?: any | null): JSX.Element | undefined {
    if (!selectedItem || selectedItem == null) {
      return;
    }

    const balanceSatoshi = selectedItem.receivedMeta.sum - selectedItem.sentMeta.sum;
    const balanceBtc = balanceSatoshi / 100000000;

    return (
      <Col className="bg-white" lg="2">
        <Detail name={selectedItem.base58check} 
          balance={balanceBtc}
          sentCount={selectedItem.sentMeta.count} receivedCount={selectedItem.receivedMeta.count}
        />
      </Col>
    )
  }
}