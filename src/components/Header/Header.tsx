import React, { FunctionComponent, useState } from 'react';
import { useApolloClient } from '@apollo/react-hooks';
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

const Header: FunctionComponent = () => {
  const [isOpen, toggle] = useState(false);
  const apolloClient = useApolloClient();

  return (
    <Navbar color="dark" dark expand="md" className="pr-3 sticky-top flex-shrink-0">
      <NavbarBrand tag={Link} to="/">
        <img src={Logo} width="64" alt="blockninjas" />
        <span className="ml-2 d-none">blockninjas</span>
      </NavbarBrand>
      <NavbarToggler onClick={() => toggle(!isOpen)} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="ml-auto" navbar>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav>
              <span className="smaller">Thomas Schmidleithner</span>
              <img src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm" alt="Avatar" height="45" className="rounded-circle ml-3 border border-white" />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem onClick={() => apolloClient.resetStore()}>
                Reset current session
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

export default Header;