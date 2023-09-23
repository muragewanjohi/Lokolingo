import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { openFile, byteSize } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './multiple-choice.reducer';

export const MultipleChoiceDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const multipleChoiceEntity = useAppSelector(state => state.multipleChoice.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="multipleChoiceDetailsHeading">Multiple Choice</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{multipleChoiceEntity.id}</dd>
          <dt>
            <span id="status">Status</span>
          </dt>
          <dd>{multipleChoiceEntity.status}</dd>
          <dt>
            <span id="image">Image</span>
          </dt>
          <dd>
            {multipleChoiceEntity.image ? (
              <div>
                {multipleChoiceEntity.imageContentType ? (
                  <a onClick={openFile(multipleChoiceEntity.imageContentType, multipleChoiceEntity.image)}>
                    <img
                      src={`data:${multipleChoiceEntity.imageContentType};base64,${multipleChoiceEntity.image}`}
                      style={{ maxHeight: '30px' }}
                    />
                  </a>
                ) : null}
                <span>
                  {multipleChoiceEntity.imageContentType}, {byteSize(multipleChoiceEntity.image)}
                </span>
              </div>
            ) : null}
          </dd>
          <dt>Question</dt>
          <dd>{multipleChoiceEntity.question ? multipleChoiceEntity.question.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/multiple-choice" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/multiple-choice/${multipleChoiceEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

export default MultipleChoiceDetail;
