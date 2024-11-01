import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, map, Observable, take, tap } from 'rxjs';
import { PropertyDetailResponse, PropertyRequest, PropertyResponse } from '../models/property';
import { HttpClient } from '@angular/common/http';
import { KeyValuePair } from '../models/keyvaluepair';
import dataHelper from '../helpers/data.helper';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  apiUrl = environment.apiUrl;
  private bookmarksSource = new BehaviorSubject<PropertyResponse[]>([]);
  bookmarks$ = this.bookmarksSource.asObservable();

  constructor(private http: HttpClient) { }

  getCities(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl + '/v1/cities');
  }

  getCategoryTypes(): Observable<KeyValuePair[]> {
    return this.http.get<KeyValuePair[]>(this.apiUrl + '/v1/enums/category');
  }

  getFurnishTypes(): Observable<KeyValuePair[]> {
    return this.http.get<KeyValuePair[]>(this.apiUrl + '/v1/enums/furnish');
  }

  getProperty(id: number = 1) {
    return this.http.get<PropertyDetailResponse>(this.apiUrl + '/v1/properties/detail/' + id);
  }

  getProperties(): Observable<PropertyResponse[]> {
    return this.http.get<PropertyResponse[]>(this.apiUrl + '/v1/properties/list');
  }

  getAllProperties(): Observable<PropertyDetailResponse[]> {
    return this.http.get<PropertyDetailResponse[]>(this.apiUrl + '/v1/properties');
  }

  getPropertiesForUser(): Observable<PropertyDetailResponse[]> {
    return this.http.get<PropertyDetailResponse[]>(this.apiUrl + '/v1/properties/user');
  }

  createProperty(property: PropertyRequest): Observable<PropertyResponse> {
    return this.http.post<PropertyResponse>(this.apiUrl + '/v1/properties', dataHelper.objectToFormData(property));
  }

  updateProperty(id: number, property: PropertyRequest): Observable<PropertyResponse> {
    return this.http.put<PropertyResponse>(this.apiUrl + '/v1/properties/' + id, dataHelper.objectToFormData(property));
  }

  deleteProperty(id: number) {
    return this.http.delete(this.apiUrl + '/v1/properties/' + id);
  }

  loadImage(imageUrl: string): Observable<Blob> {
    return this.http.get(imageUrl, {
      responseType: "blob"
    });
  }

  getBookmarks(): Observable<PropertyResponse[]> {
    return this.http.get<PropertyResponse[]>(this.apiUrl + '/v1/properties/bookmarks');
  }

  setBookmarks() {
    this.getBookmarks().subscribe(bookmarks =>
      this.bookmarksSource.next(bookmarks)
    )
  }

  clearBookmarks() {
    this.bookmarksSource.next([]);
  }

  isBookmarked(id: number): boolean {
    var isBookmarked = false;
    this.bookmarks$.subscribe(bookmark => {
      if (bookmark.some(x => x.id === id)) {
        isBookmarked = true;
      }
    })
    return isBookmarked;
  }

  createBookmark(property: PropertyResponse): Observable<PropertyResponse[]> {
    return this.http.post<PropertyResponse[]>(this.apiUrl + '/v1/properties/add-bookmark/' + property.id, {}).pipe(
      map((response: PropertyResponse[]) => {
        this.bookmarks$.pipe(take(1)).subscribe({
          next: bookmarks => {
            this.bookmarksSource.next([...bookmarks, property]);
          }
        })
        return response;
      })
    );
  }

  deleteBookmark(id: number): Observable<any> {
    return this.http.delete<any>(this.apiUrl + '/v1/properties/delete-bookmark/' + id).pipe(
      tap(_ => {
        this.bookmarks$.pipe(take(1)).subscribe({
          next: bookmarks => {
            this.bookmarksSource.next([...bookmarks.filter(x => x.id !== id)]);
          }
        })
      })
    );
  }

}