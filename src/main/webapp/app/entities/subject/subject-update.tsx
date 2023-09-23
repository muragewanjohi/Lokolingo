import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { ILearning } from 'app/shared/model/learning.model';
import { getEntities as getLearnings } from 'app/entities/learning/learning.reducer';
import { ISubject } from 'app/shared/model/subject.model';
import { AgeGrouping } from 'app/shared/model/enumerations/age-grouping.model';
import { Language } from 'app/shared/model/enumerations/language.model';
import { getEntity, updateEntity, createEntity, reset } from './subject.reducer';

export const SubjectUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const learnings = useAppSelector(state => state.learning.entities);
  const subjectEntity = useAppSelector(state => state.subject.entity);
  const loading = useAppSelector(state => state.subject.loading);
  const updating = useAppSelector(state => state.subject.updating);
  const updateSuccess = useAppSelector(state => state.subject.updateSuccess);
  const ageGroupingValues = Object.keys(AgeGrouping);
  const languageValues = Object.keys(Language);

  const handleClose = () => {
    navigate('/subject' + location.search);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getLearnings({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    const entity = {
      ...subjectEntity,
      ...values,
      learning: learnings.find(it => it.id.toString() === values.learning.toString()),
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
          age: 'OneToSix',
          language: 'KIKUYU',
          ...subjectEntity,
          learning: subjectEntity?.learning?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="lokolingoApp.subject.home.createOrEditLabel" data-cy="SubjectCreateUpdateHeading">
            Create or edit a Subject
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? <ValidatedField name="id" required readOnly id="subject-id" label="ID" validate={{ required: true }} /> : null}
              <ValidatedField label="Age" id="subject-age" name="age" data-cy="age" type="select">
                {ageGroupingValues.map(ageGrouping => (
                  <option value={ageGrouping} key={ageGrouping}>
                    {ageGrouping}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField label="Language" id="subject-language" name="language" data-cy="language" type="select">
                {languageValues.map(language => (
                  <option value={language} key={language}>
                    {language}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                label="Title"
                id="subject-title"
                name="title"
                data-cy="title"
                type="text"
                validate={{
                  required: { value: true, message: 'This field is required.' },
                }}
              />
              <ValidatedField id="subject-learning" name="learning" data-cy="learning" label="Learning" type="select">
                <option value="" key="0" />
                {learnings
                  ? learnings.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/subject" replace color="info">
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

export default SubjectUpdate;
