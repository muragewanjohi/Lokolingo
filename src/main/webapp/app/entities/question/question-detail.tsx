import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { openFile, byteSize } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './question.reducer';

export const QuestionDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const questionEntity = useAppSelector(state => state.question.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="questionDetailsHeading">Question</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{questionEntity.id}</dd>
          <dt>
            <span id="description">Description</span>
          </dt>
          <dd>{questionEntity.description}</dd>
          <dt>
            <span id="audio">Audio</span>
          </dt>
          <dd>
            {questionEntity.audio ? (
              <div>
                {questionEntity.audioContentType ? (
                  <a onClick={openFile(questionEntity.audioContentType, questionEntity.audio)}>Open&nbsp;</a>
                ) : null}
                <span>
                  {questionEntity.audioContentType}, {byteSize(questionEntity.audio)}
                </span>
              </div>
            ) : null}
          </dd>
          <dt>
            <span id="audioDescription">Audio Description</span>
          </dt>
          <dd>{questionEntity.audioDescription}</dd>
        </dl>
        <Button tag={Link} to="/question" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/question/${questionEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

export default QuestionDetail;
