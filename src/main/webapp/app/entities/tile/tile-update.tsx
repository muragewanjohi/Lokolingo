import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, ValidatedField, ValidatedForm, ValidatedBlobField } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IQuestion } from 'app/shared/model/question.model';
import { getEntities as getQuestions } from 'app/entities/question/question.reducer';
import { ILesson } from 'app/shared/model/lesson.model';
import { getEntities as getLessons } from 'app/entities/lesson/lesson.reducer';
import { ITile } from 'app/shared/model/tile.model';
import { LockedStatus } from 'app/shared/model/enumerations/locked-status.model';
import { getEntity, updateEntity, createEntity, reset } from './tile.reducer';

export const TileUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const questions = useAppSelector(state => state.question.entities);
  const lessons = useAppSelector(state => state.lesson.entities);
  const tileEntity = useAppSelector(state => state.tile.entity);
  const loading = useAppSelector(state => state.tile.loading);
  const updating = useAppSelector(state => state.tile.updating);
  const updateSuccess = useAppSelector(state => state.tile.updateSuccess);
  const lockedStatusValues = Object.keys(LockedStatus);

  const handleClose = () => {
    navigate('/tile');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getQuestions({}));
    dispatch(getLessons({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    const entity = {
      ...tileEntity,
      ...values,
      question: questions.find(it => it.id.toString() === values.question.toString()),
      lesson: lessons.find(it => it.id.toString() === values.lesson.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          status: 'LOCKED',
          ...tileEntity,
          question: tileEntity?.question?.id,
          lesson: tileEntity?.lesson?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="lokolingoApp.tile.home.createOrEditLabel" data-cy="TileCreateUpdateHeading">
            Create or edit a Tile
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? <ValidatedField name="id" required readOnly id="tile-id" label="ID" validate={{ required: true }} /> : null}
              <ValidatedField label="Status" id="tile-status" name="status" data-cy="status" type="select">
                {lockedStatusValues.map(lockedStatus => (
                  <option value={lockedStatus} key={lockedStatus}>
                    {lockedStatus}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedBlobField
                label="Image"
                id="tile-image"
                name="image"
                data-cy="image"
                isImage
                accept="image/*"
                validate={{
                  required: { value: true, message: 'This field is required.' },
                }}
              />
              <ValidatedBlobField
                label="Audio"
                id="tile-audio"
                name="audio"
                data-cy="audio"
                openActionLabel="Open"
                validate={{
                  required: { value: true, message: 'This field is required.' },
                }}
              />
              <ValidatedField
                label="Language Title"
                id="tile-languageTitle"
                name="languageTitle"
                data-cy="languageTitle"
                type="text"
                validate={{
                  required: { value: true, message: 'This field is required.' },
                }}
              />
              <ValidatedField
                label="English Title"
                id="tile-englishTitle"
                name="englishTitle"
                data-cy="englishTitle"
                type="text"
                validate={{
                  required: { value: true, message: 'This field is required.' },
                }}
              />
              <ValidatedField id="tile-question" name="question" data-cy="question" label="Question" type="select">
                <option value="" key="0" />
                {questions
                  ? questions.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField id="tile-lesson" name="lesson" data-cy="lesson" label="Lesson" type="select">
                <option value="" key="0" />
                {lessons
                  ? lessons.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/tile" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">Back</span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp; Save
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default TileUpdate;
