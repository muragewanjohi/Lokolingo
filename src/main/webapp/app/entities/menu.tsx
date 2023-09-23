import React from 'react';

import MenuItem from 'app/shared/layout/menus/menu-item';

const EntitiesMenu = () => {
  return (
    <>
      {/* prettier-ignore */}
      <MenuItem icon="asterisk" to="/parent">
        Parent
      </MenuItem>
      <MenuItem icon="asterisk" to="/child">
        Child
      </MenuItem>
      <MenuItem icon="asterisk" to="/subject">
        Subject
      </MenuItem>
      <MenuItem icon="asterisk" to="/lesson">
        Lesson
      </MenuItem>
      <MenuItem icon="asterisk" to="/learning">
        Learning
      </MenuItem>
      <MenuItem icon="asterisk" to="/tile">
        Tile
      </MenuItem>
      <MenuItem icon="asterisk" to="/question">
        Question
      </MenuItem>
      <MenuItem icon="asterisk" to="/multiple-choice">
        Multiple Choice
      </MenuItem>
      {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
    </>
  );
};

export default EntitiesMenu;
