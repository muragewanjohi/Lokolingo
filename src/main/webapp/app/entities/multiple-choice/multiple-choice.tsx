import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { openFile, byteSize, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IMultipleChoice } from 'app/shared/model/multiple-choice.model';
import { getEntities } from './multiple-choice.reducer';

export const MultipleChoice = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const multipleChoiceList = useAppSelector(state => state.multipleChoice.entities);
  const loading = useAppSelector(state => state.multipleChoice.loading);

  useEffect(() => {
    dispatch(getEntities({}));
  }, []);

  const handleSyncList = () => {
    dispatch(getEntities({}));
  };

  return (
    <div>
      <h2 id="multiple-choice-heading" data-cy="MultipleChoiceHeading">
        Multiple Choices
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} /> Refresh list
          </Button>
          <Link to="/multiple-choice/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp; Create a new Multiple Choice
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {multipleChoiceList && multipleChoiceList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Status</th>
                <th>Image</th>
                <th>Question</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {multipleChoiceList.map((multipleChoice, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/multiple-choice/${multipleChoice.id}`} color="link" size="sm">
                      {multipleChoice.id}
                    </Button>
                  </td>
                  <td>{multipleChoice.status}</td>
                  <td>
                    {multipleChoice.image ? (
                      <div>
                        {multipleChoice.imageContentType ? (
                          <a onClick={openFile(multipleChoice.imageContentType, multipleChoice.image)}>
                            <img
                              src={`data:${multipleChoice.imageContentType};base64,${multipleChoice.image}`}
                              style={{ maxHeight: '30px' }}
                            />
                            &nbsp;
                          </a>
                        ) : null}
                        <span>
                          {multipleChoice.imageContentType}, {byteSize(multipleChoice.image)}
                        </span>
                      </div>
                    ) : null}
                  </td>
                  <td>
                    {multipleChoice.question ? (
                      <Link to={`/question/${multipleChoice.question.id}`}>{multipleChoice.question.id}</Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/multiple-choice/${multipleChoice.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/multiple-choice/${multipleChoice.id}/edit`}
                        color="primary"
                        size="sm"
                        data-cy="entityEditButton"
                      >
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/multiple-choice/${multipleChoice.id}/delete`}
                        color="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
                      >
                        <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && <div className="alert alert-warning">No Multiple Choices found</div>
        )}
      </div>
    </div>
  );
};

export default MultipleChoice;
