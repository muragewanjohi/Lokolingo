import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ParentFormService } from './parent-form.service';
import { ParentService } from '../service/parent.service';
import { IParent } from '../parent.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { ParentUpdateComponent } from './parent-update.component';

describe('Parent Management Update Component', () => {
  let comp: ParentUpdateComponent;
  let fixture: ComponentFixture<ParentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let parentFormService: ParentFormService;
  let parentService: ParentService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ParentUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ParentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ParentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    parentFormService = TestBed.inject(ParentFormService);
    parentService = TestBed.inject(ParentService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const parent: IParent = { id: 456 };
      const user: IUser = { id: 53439 };
      parent.user = user;

      const userCollection: IUser[] = [{ id: 89168 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ parent });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const parent: IParent = { id: 456 };
      const user: IUser = { id: 19545 };
      parent.user = user;

      activatedRoute.data = of({ parent });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.parent).toEqual(parent);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IParent>>();
      const parent = { id: 123 };
      jest.spyOn(parentFormService, 'getParent').mockReturnValue(parent);
      jest.spyOn(parentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parent });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: parent }));
      saveSubject.complete();

      // THEN
      expect(parentFormService.getParent).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(parentService.update).toHaveBeenCalledWith(expect.objectContaining(parent));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IParent>>();
      const parent = { id: 123 };
      jest.spyOn(parentFormService, 'getParent').mockReturnValue({ id: null });
      jest.spyOn(parentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parent: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: parent }));
      saveSubject.complete();

      // THEN
      expect(parentFormService.getParent).toHaveBeenCalled();
      expect(parentService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IParent>>();
      const parent = { id: 123 };
      jest.spyOn(parentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parent });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(parentService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
