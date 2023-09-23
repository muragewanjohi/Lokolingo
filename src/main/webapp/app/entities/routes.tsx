import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Parent from './parent';
import Child from './child';
import Subject from './subject';
import Lesson from './lesson';
import Learning from './learning';
import Tile from './tile';
import Question from './question';
import MultipleChoice from './multiple-choice';
/* jhipster-needle-add-route-import - JHipster will add routes here */

export default () => {
  return (
    <div>
      <ErrorBoundaryRoutes>
        {/* prettier-ignore */}
        <Route path="parent/*" element={<Parent />} />
        <Route path="child/*" element={<Child />} />
        <Route path="subject/*" element={<Subject />} />
        <Route path="lesson/*" element={<Lesson />} />
        <Route path="learning/*" element={<Learning />} />
        <Route path="tile/*" element={<Tile />} />
        <Route path="question/*" element={<Question />} />
        <Route path="multiple-choice/*" element={<MultipleChoice />} />
        {/* jhipster-needle-add-route-path - JHipster will add routes here */}
      </ErrorBoundaryRoutes>
    </div>
  );
};
