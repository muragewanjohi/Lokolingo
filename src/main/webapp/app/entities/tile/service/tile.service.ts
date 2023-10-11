import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITile, NewTile } from '../tile.model';

export type PartialUpdateTile = Partial<ITile> & Pick<ITile, 'id'>;

export type EntityResponseType = HttpResponse<ITile>;
export type EntityArrayResponseType = HttpResponse<ITile[]>;

@Injectable({ providedIn: 'root' })
export class TileService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/tiles');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(tile: NewTile): Observable<EntityResponseType> {
    return this.http.post<ITile>(this.resourceUrl, tile, { observe: 'response' });
  }

  update(tile: ITile): Observable<EntityResponseType> {
    return this.http.put<ITile>(`${this.resourceUrl}/${this.getTileIdentifier(tile)}`, tile, { observe: 'response' });
  }

  partialUpdate(tile: PartialUpdateTile): Observable<EntityResponseType> {
    return this.http.patch<ITile>(`${this.resourceUrl}/${this.getTileIdentifier(tile)}`, tile, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITile>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITile[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTileIdentifier(tile: Pick<ITile, 'id'>): number {
    return tile.id;
  }

  compareTile(o1: Pick<ITile, 'id'> | null, o2: Pick<ITile, 'id'> | null): boolean {
    return o1 && o2 ? this.getTileIdentifier(o1) === this.getTileIdentifier(o2) : o1 === o2;
  }

  addTileToCollectionIfMissing<Type extends Pick<ITile, 'id'>>(
    tileCollection: Type[],
    ...tilesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const tiles: Type[] = tilesToCheck.filter(isPresent);
    if (tiles.length > 0) {
      const tileCollectionIdentifiers = tileCollection.map(tileItem => this.getTileIdentifier(tileItem)!);
      const tilesToAdd = tiles.filter(tileItem => {
        const tileIdentifier = this.getTileIdentifier(tileItem);
        if (tileCollectionIdentifiers.includes(tileIdentifier)) {
          return false;
        }
        tileCollectionIdentifiers.push(tileIdentifier);
        return true;
      });
      return [...tilesToAdd, ...tileCollection];
    }
    return tileCollection;
  }
}
