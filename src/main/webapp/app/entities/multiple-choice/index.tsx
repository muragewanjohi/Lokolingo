import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import MultipleChoice from './multiple-choice';
import MultipleChoiceDetail from './multiple-choice-detail';
import MultipleChoiceUpdate from './multiple-choice-update';
import MultipleChoiceDeleteDialog from './multiple-choice-delete-dialog';

const MultipleChoiceRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<MultipleChoice />} />
    <Route path="new" element={<MultipleChoiceUpdate />} />
    <Route path=":id">
      <Route index element={<MultipleChoiceDetail />} />
      <Route path="edit" element={<MultipleChoiceUpdate />} />
      <Route path="delete" element={<MultipleChoiceDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default MultipleChoiceRoutes;
