import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { openFile, byteSize, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { ITile } from 'app/shared/model/tile.model';
import { getEntities } from './tile.reducer';

export const Tile = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const tileList = useAppSelector(state => state.tile.entities);
  const loading = useAppSelector(state => state.tile.loading);

  useEffect(() => {
    dispatch(getEntities({}));
  }, []);

  const handleSyncList = () => {
    dispatch(getEntities({}));
  };

  return (
    <div>
      <h2 id="tile-heading" data-cy="TileHeading">
        Tiles
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} /> Refresh list
          </Button>
          <Link to="/tile/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp; Create a new Tile
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {tileList && tileList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Status</th>
                <th>Image</th>
                <th>Audio</th>
                <th>Language Title</th>
                <th>English Title</th>
                <th>Question</th>
                <th>Lesson</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {tileList.map((tile, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/tile/${tile.id}`} color="link" size="sm">
                      {tile.id}
                    </Button>
                  </td>
                  <td>{tile.status}</td>
                  <td>
                    {tile.image ? (
                      <div>
                        {tile.imageContentType ? (
                          <a onClick={openFile(tile.imageContentType, tile.image)}>
                            <img src={`data:${tile.imageContentType};base64,${tile.image}`} style={{ maxHeight: '30px' }} />
                            &nbsp;
                          </a>
                        ) : null}
                        <span>
                          {tile.imageContentType}, {byteSize(tile.image)}
                        </span>
                      </div>
                    ) : null}
                  </td>
                  <td>
                    {tile.audio ? (
                      <div>
                        {tile.audioContentType ? <a onClick={openFile(tile.audioContentType, tile.audio)}>Open &nbsp;</a> : null}
                        <span>
                          {tile.audioContentType}, {byteSize(tile.audio)}
                        </span>
                      </div>
                    ) : null}
                  </td>
                  <td>{tile.languageTitle}</td>
                  <td>{tile.englishTitle}</td>
                  <td>{tile.question ? <Link to={`/question/${tile.question.id}`}>{tile.question.id}</Link> : ''}</td>
                  <td>{tile.lesson ? <Link to={`/lesson/${tile.lesson.id}`}>{tile.lesson.id}</Link> : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/tile/${tile.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                      </Button>
                      <Button tag={Link} to={`/tile/${tile.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                      </Button>
                      <Button tag={Link} to={`/tile/${tile.id}/delete`} color="danger" size="sm" data-cy="entityDeleteButton">
                        <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && <div className="alert alert-warning">No Tiles found</div>
        )}
      </div>
    </div>
  );
};

export default Tile;
