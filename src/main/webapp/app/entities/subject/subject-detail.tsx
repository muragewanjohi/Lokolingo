import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import {} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './subject.reducer';

export const SubjectDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const subjectEntity = useAppSelector(state => state.subject.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="subjectDetailsHeading">Subject</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{subjectEntity.id}</dd>
          <dt>
            <span id="age">Age</span>
          </dt>
          <dd>{subjectEntity.age}</dd>
          <dt>
            <span id="language">Language</span>
          </dt>
          <dd>{subjectEntity.language}</dd>
          <dt>
            <span id="title">Title</span>
          </dt>
          <dd>{subjectEntity.title}</dd>
          <dt>Learning</dt>
          <dd>{subjectEntity.learning ? subjectEntity.learning.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/subject" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/subject/${subjectEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

export default SubjectDetail;
