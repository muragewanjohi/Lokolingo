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
import { IMultipleChoice } from 'app/shared/model/multiple-choice.model';
import { AnswerStatus } from 'app/shared/model/enumerations/answer-status.model';
import { getEntity, updateEntity, createEntity, reset } from './multiple-choice.reducer';

export const MultipleChoiceUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const questions = useAppSelector(state => state.question.entities);
  const multipleChoiceEntity = useAppSelector(state => state.multipleChoice.entity);
  const loading = useAppSelector(state => state.multipleChoice.loading);
  const updating = useAppSelector(state => state.multipleChoice.updating);
  const updateSuccess = useAppSelector(state => state.multipleChoice.updateSuccess);
  const answerStatusValues = Object.keys(AnswerStatus);

  const handleClose = () => {
    navigate('/multiple-choice');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getQuestions({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    const entity = {
      ...multipleChoiceEntity,
      ...values,
      question: questions.find(it => it.id.toString() === values.question.toString()),
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
          status: 'CORRECT',
          ...multipleChoiceEntity,
          question: multipleChoiceEntity?.question?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="lokolingoApp.multipleChoice.home.createOrEditLabel" data-cy="MultipleChoiceCreateUpdateHeading">
            Create or edit a Multiple Choice
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? (
                <ValidatedField name="id" required readOnly id="multiple-choice-id" label="ID" validate={{ required: true }} />
              ) : null}
              <ValidatedField label="Status" id="multiple-choice-status" name="status" data-cy="status" type="select">
                {answerStatusValues.map(answerStatus => (
                  <option value={answerStatus} key={answerStatus}>
                    {answerStatus}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedBlobField
                label="Image"
                id="multiple-choice-image"
                name="image"
                data-cy="image"
                isImage
                accept="image/*"
                validate={{
                  required: { value: true, message: 'This field is required.' },
                }}
              />
              <ValidatedField id="multiple-choice-question" name="question" data-cy="question" label="Question" type="select">
                <option value="" key="0" />
                {questions
                  ? questions.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/multiple-choice" replace color="info">
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

export default MultipleChoiceUpdate;
