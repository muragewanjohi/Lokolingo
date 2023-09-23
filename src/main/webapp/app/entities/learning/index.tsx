import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Learning from './learning';
import LearningDetail from './learning-detail';
import LearningUpdate from './learning-update';
import LearningDeleteDialog from './learning-delete-dialog';

const LearningRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Learning />} />
    <Route path="new" element={<LearningUpdate />} />
    <Route path=":id">
      <Route index element={<LearningDetail />} />
      <Route path="edit" element={<LearningUpdate />} />
      <Route path="delete" element={<LearningDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default LearningRoutes;
