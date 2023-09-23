import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Tile from './tile';
import TileDetail from './tile-detail';
import TileUpdate from './tile-update';
import TileDeleteDialog from './tile-delete-dialog';

const TileRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Tile />} />
    <Route path="new" element={<TileUpdate />} />
    <Route path=":id">
      <Route index element={<TileDetail />} />
      <Route path="edit" element={<TileUpdate />} />
      <Route path="delete" element={<TileDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default TileRoutes;
