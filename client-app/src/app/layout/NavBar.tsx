import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Container, Button } from 'semantic-ui-react';

export default function NavBar() {
  return (
    <Menu inverted fixed="top">
      <Container>
        <Menu.Item as={NavLink} to="/" exact header>
          <img src="/assets/logo.png" alt="" style={{ marginRight: 10 }} />
          Reactrivites
        </Menu.Item>
        <Menu.Item as={NavLink} to="/activities" name="Activities" />
        <Menu.Item as={NavLink} to="/errors" name="Erros" />
        <Menu.Item>
          <Button
            as={NavLink}
            to="/createActivity"
            positive
            content="Create Actitvity"
          />
        </Menu.Item>
      </Container>
    </Menu>
  );
}
