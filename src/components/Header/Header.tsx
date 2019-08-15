import * as React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import Logo from './blockninjas-logo.svg';

type Props = {
  // no-op
};

type State = {
  isOpen: boolean
};

export class Header extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
    };
  }
  
  toggle() {
    this.setState(prevState => ({isOpen: !prevState.isOpen}));
  }

  render(): JSX.Element {
    return (
      <Navbar color="dark" dark expand="md" className="pr-3 sticky-top flex-shrink-0">
        <NavbarBrand tag={Link} to="/">
          <img src={Logo} width="64" alt="blockninjas" />
          <span className="ml-2 d-none">blockninjas</span>
        </NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav>
                <span className="smaller">Thomas Schmidleithner</span>
                <img src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm" alt="Avatar" height="45" className="rounded-circle ml-3 border border-white" />
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>
                  Option 1
                </DropdownItem>
                <DropdownItem>
                  Option 2
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem>
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}