import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { openFile, byteSize } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './tile.reducer';

export const TileDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const tileEntity = useAppSelector(state => state.tile.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="tileDetailsHeading">Tile</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{tileEntity.id}</dd>
          <dt>
            <span id="status">Status</span>
          </dt>
          <dd>{tileEntity.status}</dd>
          <dt>
            <span id="image">Image</span>
          </dt>
          <dd>
            {tileEntity.image ? (
              <div>
                {tileEntity.imageContentType ? (
                  <a onClick={openFile(tileEntity.imageContentType, tileEntity.image)}>
                    <img src={`data:${tileEntity.imageContentType};base64,${tileEntity.image}`} style={{ maxHeight: '30px' }} />
                  </a>
                ) : null}
                <span>
                  {tileEntity.imageContentType}, {byteSize(tileEntity.image)}
                </span>
              </div>
            ) : null}
          </dd>
          <dt>
            <span id="audio">Audio</span>
          </dt>
          <dd>
            {tileEntity.audio ? (
              <div>
                {tileEntity.audioContentType ? <a onClick={openFile(tileEntity.audioContentType, tileEntity.audio)}>Open&nbsp;</a> : null}
                <span>
                  {tileEntity.audioContentType}, {byteSize(tileEntity.audio)}
                </span>
              </div>
            ) : null}
          </dd>
          <dt>
            <span id="languageTitle">Language Title</span>
          </dt>
          <dd>{tileEntity.languageTitle}</dd>
          <dt>
            <span id="englishTitle">English Title</span>
          </dt>
          <dd>{tileEntity.englishTitle}</dd>
          <dt>Question</dt>
          <dd>{tileEntity.question ? tileEntity.question.id : ''}</dd>
          <dt>Lesson</dt>
          <dd>{tileEntity.lesson ? tileEntity.lesson.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/tile" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tile/${tileEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

export default TileDetail;
