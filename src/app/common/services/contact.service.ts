import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ContactRequest, ContactResponse } from '../models/contact';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getContacts(): Observable<ContactResponse[]> {
    return this.http.get<ContactResponse[]>(this.apiUrl + '/v1/contacts');
  }

  createContact(request: ContactRequest) {
    return this.http.post(this.apiUrl + '/v1/contacts', request);
  }

  deleteContact(id: number) {
    return this.http.delete(this.apiUrl + '/v1/contacts/' + id);
  }
}
