import parent from 'app/entities/parent/parent.reducer';
import child from 'app/entities/child/child.reducer';
import subject from 'app/entities/subject/subject.reducer';
import lesson from 'app/entities/lesson/lesson.reducer';
import learning from 'app/entities/learning/learning.reducer';
import tile from 'app/entities/tile/tile.reducer';
import question from 'app/entities/question/question.reducer';
import multipleChoice from 'app/entities/multiple-choice/multiple-choice.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const entitiesReducers = {
  parent,
  child,
  subject,
  lesson,
  learning,
  tile,
  question,
  multipleChoice,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default entitiesReducers;
