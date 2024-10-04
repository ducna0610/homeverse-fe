import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
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

  getPropertiesForUser(): Observable<PropertyDetailResponse[]> {
    return this.http.get<PropertyDetailResponse[]>(this.apiUrl + '/v1/properties/user');
  }

  createProperty(property: PropertyRequest) {
    return this.http.post(this.apiUrl + '/v1/properties', dataHelper.objectToFormData(property));
  }

  updateProperty(id: number, property: PropertyRequest) {
    return this.http.put(this.apiUrl + '/v1/properties/' + id, dataHelper.objectToFormData(property));
  }

  deleteProperty(id: number) {
    return this.http.delete(this.apiUrl + '/v1/properties/' + id);
  }

  loadImage(imageUrl: string): Observable<Blob> {
    return this.http.get(imageUrl, {
      responseType: "blob"
    });
  }
}