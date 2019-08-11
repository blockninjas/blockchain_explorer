import * as React from 'react';
import { 
  Button, 
  Modal, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Form,
  Input 
} from 'reactstrap';

export interface Props {
  isOpen: boolean;
  toggle: any;
  onAddItem: any;
  className?: string;
}

interface State {
  address: string;
}

export class ModalAddItem extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      address: ''
    };
  }

  onSubmit = (event: any) => {
    event.preventDefault();
    this.props.onAddItem(this.state.address);
    this.setState({ address: '' });
  }

  handleChange = (event: any) => {
    this.setState({
      'address': event.target.value
    });
  }

  render() {
    const { isOpen, toggle, className } = this.props;
    const { address } = this.state;

    return (
      <Modal isOpen={isOpen} toggle={toggle} className={className} centered>
        <Form onSubmit={this.onSubmit}>
          <ModalHeader toggle={toggle}>Add Item</ModalHeader>
          <ModalBody>
            <Input id="address" value={address} placeholder="Insert crypto hash ..." onChange={this.handleChange} />
          </ModalBody>
          <ModalFooter>
            <Button color="primary">Add Item</Button>{' '}
            <Button outline color="secondary" onClick={toggle}>Cancel</Button>
          </ModalFooter>
        </Form>
      </Modal>
    );
  }
}