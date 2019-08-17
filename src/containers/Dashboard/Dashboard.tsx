import React, { FunctionComponent } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { faPlus, faFile, faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { CardWithListGroup } from '../../components/Card';

const GET_ALL_SPACES = gql`
  {
    spaces @client {
      id
      name
      createdAt
      isBookmark
    }
  }
`;

const Dashboard: FunctionComponent = () => {
  const { loading, error, data } = useQuery(GET_ALL_SPACES);
  
  if (loading) return <div>Loading</div>;
  if (error) console.log(`error ${error.message}`);

  const spacesAll: any = data.spaces;
  const spacesBookmarked: any = spacesAll.filter((space: any) => space.isBookmark);

  return (
    <>
      <Container fluid className="p-4 p-md-5">
        <Row>
          <Col>
            <NavLink to="/spaces/new" className="d-flex align-items-center link-action">
              <FontAwesomeIcon icon={faPlus} size="2x" />
              <span className="ml-4">Start new workspace</span>
            </NavLink>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col lg="4">
            <SpacesList header="Recent" spaces={spacesAll} />
          </Col>

          <Col lg="4">
            <SpacesList header="Bookmarks" spaces={spacesBookmarked} />
          </Col>
        </Row>
      </Container>
    </>
  );
}
export default Dashboard;

type SpacesListProps = {
  header: string,
  spaces: any
};

const TOGGLE_SPACE_BOOKMARK = gql`
  mutation ToggleSpaceBookmark($id: Int!) {
    toggleSpaceBookmark(id: $id) @client
  }
`;

const SpacesList: FunctionComponent<SpacesListProps> = ({header, spaces}) => {
  const [toggleSpaceBookmark] = useMutation(TOGGLE_SPACE_BOOKMARK);

  const entries = spaces.map((space: any) => (
    { 
      to: `/spaces/${space.id}`, 
      name: space.name,
      subheader: space.createdAt,
      icon: <FontAwesomeIcon icon={faFile} size="lg" fixedWidth />,
      iconSecondary: <div className="py-3" 
        onClick={(e) => { e.preventDefault(); toggleSpaceBookmark({ variables: { id: space.id}})}}>
        {space.isBookmark 
          ? <FontAwesomeIcon icon={faStar} size="lg" className="text-muted" fixedWidth /> 
          : <FontAwesomeIcon icon={farStar} size="lg" className="text-muted" fixedWidth />
        }
        </div>
    }
  ));
  
  return <CardWithListGroup headerText={header} entries={entries} />;
}