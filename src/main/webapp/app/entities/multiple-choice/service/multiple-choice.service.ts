import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMultipleChoice, NewMultipleChoice } from '../multiple-choice.model';

export type PartialUpdateMultipleChoice = Partial<IMultipleChoice> & Pick<IMultipleChoice, 'id'>;

export type EntityResponseType = HttpResponse<IMultipleChoice>;
export type EntityArrayResponseType = HttpResponse<IMultipleChoice[]>;

@Injectable({ providedIn: 'root' })
export class MultipleChoiceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/multiple-choices');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(multipleChoice: NewMultipleChoice): Observable<EntityResponseType> {
    return this.http.post<IMultipleChoice>(this.resourceUrl, multipleChoice, { observe: 'response' });
  }

  update(multipleChoice: IMultipleChoice): Observable<EntityResponseType> {
    return this.http.put<IMultipleChoice>(`${this.resourceUrl}/${this.getMultipleChoiceIdentifier(multipleChoice)}`, multipleChoice, {
      observe: 'response',
    });
  }

  partialUpdate(multipleChoice: PartialUpdateMultipleChoice): Observable<EntityResponseType> {
    return this.http.patch<IMultipleChoice>(`${this.resourceUrl}/${this.getMultipleChoiceIdentifier(multipleChoice)}`, multipleChoice, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMultipleChoice>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMultipleChoice[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMultipleChoiceIdentifier(multipleChoice: Pick<IMultipleChoice, 'id'>): number {
    return multipleChoice.id;
  }

  compareMultipleChoice(o1: Pick<IMultipleChoice, 'id'> | null, o2: Pick<IMultipleChoice, 'id'> | null): boolean {
    return o1 && o2 ? this.getMultipleChoiceIdentifier(o1) === this.getMultipleChoiceIdentifier(o2) : o1 === o2;
  }

  addMultipleChoiceToCollectionIfMissing<Type extends Pick<IMultipleChoice, 'id'>>(
    multipleChoiceCollection: Type[],
    ...multipleChoicesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const multipleChoices: Type[] = multipleChoicesToCheck.filter(isPresent);
    if (multipleChoices.length > 0) {
      const multipleChoiceCollectionIdentifiers = multipleChoiceCollection.map(
        multipleChoiceItem => this.getMultipleChoiceIdentifier(multipleChoiceItem)!
      );
      const multipleChoicesToAdd = multipleChoices.filter(multipleChoiceItem => {
        const multipleChoiceIdentifier = this.getMultipleChoiceIdentifier(multipleChoiceItem);
        if (multipleChoiceCollectionIdentifiers.includes(multipleChoiceIdentifier)) {
          return false;
        }
        multipleChoiceCollectionIdentifiers.push(multipleChoiceIdentifier);
        return true;
      });
      return [...multipleChoicesToAdd, ...multipleChoiceCollection];
    }
    return multipleChoiceCollection;
  }
}
