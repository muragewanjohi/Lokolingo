import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'parent',
        data: { pageTitle: 'Parents' },
        loadChildren: () => import('./parent/parent.module').then(m => m.ParentModule),
      },
      {
        path: 'child',
        data: { pageTitle: 'Children' },
        loadChildren: () => import('./child/child.module').then(m => m.ChildModule),
      },
      {
        path: 'subject',
        data: { pageTitle: 'Subjects' },
        loadChildren: () => import('./subject/subject.module').then(m => m.SubjectModule),
      },
      {
        path: 'subject-lessons',
        data: { pageTitle: 'SubjectLessons' },
        loadChildren: () => import('./subject-lessons/subject-lessons.module').then(m => m.SubjectLessonsModule),
      },
      {
        path: 'lesson',
        data: { pageTitle: 'Lessons' },
        loadChildren: () => import('./lesson/lesson.module').then(m => m.LessonModule),
      },
      {
        path: 'learning',
        data: { pageTitle: 'Learnings' },
        loadChildren: () => import('./learning/learning.module').then(m => m.LearningModule),
      },
      {
        path: 'child-learnings',
        data: { pageTitle: 'ChildLearnings' },
        loadChildren: () => import('./child-learnings/child-learnings.module').then(m => m.ChildLearningsModule),
      },
      {
        path: 'tile',
        data: { pageTitle: 'Tiles' },
        loadChildren: () => import('./tile/tile.module').then(m => m.TileModule),
      },
      {
        path: 'lesson-tiles',
        data: { pageTitle: 'LessonTiles' },
        loadChildren: () => import('./lesson-tiles/lesson-tiles.module').then(m => m.LessonTilesModule),
      },
      {
        path: 'question',
        data: { pageTitle: 'Questions' },
        loadChildren: () => import('./question/question.module').then(m => m.QuestionModule),
      },
      {
        path: 'multiple-choice',
        data: { pageTitle: 'MultipleChoices' },
        loadChildren: () => import('./multiple-choice/multiple-choice.module').then(m => m.MultipleChoiceModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
