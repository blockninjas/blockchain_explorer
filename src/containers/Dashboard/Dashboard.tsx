import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { faPlus, faFile, faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CardWithListGroup } from '../../components/Card';

type Props = {
  // no-op
}

type State = {
  // no-op
}

export class Dashboard extends React.Component<Props, State> {
  render(): JSX.Element {
    const lastOpenendEntries = [
      {
        to: '/spaces/A4144',
        name: 'Akt A4144',
        subheader: 'Today, 12:30',
        icon: <FontAwesomeIcon icon={faFile} size="lg" fixedWidth />,
        iconSecondary: <FontAwesomeIcon icon={faStar} size="lg" className="text-muted" fixedWidth />
      },
      {
        to: '/spaces/AB132',
        name: 'Akt AB132',
        subheader: 'Today, 11:10',
        icon: <FontAwesomeIcon icon={faFile} size="lg" fixedWidth />,
        iconSecondary: <FontAwesomeIcon icon={farStar} size="lg" className="text-muted" fixedWidth />
      },
      {
        to: '/spaces/EX333',
        name: 'Akt EX333',
        subheader: 'Yesterday, 14:23',
        icon: <FontAwesomeIcon icon={faFile} size="lg" fixedWidth />,
        iconSecondary: <FontAwesomeIcon icon={farStar} size="lg" className="text-muted" fixedWidth />
      }
    ];

    const bookmarkEntries = [
      {
        to: '/spaces/A4144',
        name: 'Akt A4144',
        subheader: 'Today, 12:30',
        icon: <FontAwesomeIcon icon={faFile} size="lg" fixedWidth />,
        iconSecondary: <FontAwesomeIcon icon={faStar} size="lg" className="text-muted" fixedWidth />
      },
      {
        to: '/spaces/AB132',
        name: 'Akt AB132',
        subheader: 'Today, 11:10',
        icon: <FontAwesomeIcon icon={faFile} size="lg" fixedWidth />,
        iconSecondary: <FontAwesomeIcon icon={faStar} size="lg" className="text-muted" fixedWidth />
      }
    ];

    return (
      <Container fluid className="p-4 p-md-5">
        <Row>
          <Col>
            <NavLink to="/spaces" className="d-flex align-items-center link-action">
              <FontAwesomeIcon icon={faPlus} size="2x" />
              <span className="ml-4">Start new workspace</span>
            </NavLink>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col lg="4">
            <CardWithListGroup headerText="Last Opened" entries={lastOpenendEntries} />
          </Col>

          <Col lg="4">
            <CardWithListGroup headerText="Bookmarks" entries={bookmarkEntries} />
          </Col>
        </Row>
      </Container>
    )
  }
}