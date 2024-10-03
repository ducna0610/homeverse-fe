import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { RegisterRequest } from '../models/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.apiUrl;

  constructor(
    private httpClient: HttpClient, 
  ) { }

  register(request: RegisterRequest) {
    return this.httpClient.post(this.apiUrl + '/v1/users/register', request);
  }
}