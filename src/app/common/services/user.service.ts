import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LoginRequest, RegisterRequest, UpdateUserRequest, UserResponse } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.apiUrl;
  currentUser = signal<UserResponse | null>(null);

  constructor(
    private httpClient: HttpClient, 
  ) { }

  register(request: RegisterRequest) {
    return this.httpClient.post(this.apiUrl + '/v1/users/register', request);
  }

  login(request: LoginRequest) {
    return this.httpClient.post(this.apiUrl + '/v1/users/login', request).pipe(
      map((response: any) => {
        localStorage.setItem('token', response.token);
        this.setCurrentUser();
        return response;
      })
    );
  }

  getProfile(): Observable<UserResponse> {
    return this.httpClient.get<UserResponse>(this.apiUrl + '/v1/users/profile');
  }

  updateProfile(request: UpdateUserRequest): Observable<UserResponse> {
    return this.httpClient.put<UserResponse>(this.apiUrl + '/v1/users/profile', request).pipe(
      map((response: UserResponse) => {
        this.setCurrentUser();
        return response;
      })
    )
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUser.set(null);
  }

  getToken() {
    return localStorage.getItem('token') ?? '';
  }

  getDecodeToken() {
    let token = this.getToken();
    if (!token) return null;

    let decodeToken = jwtDecode(token) as any;

    if (!decodeToken || decodeToken.exp * 1000 < Date.now().valueOf()) {
      return null;
    }
    return decodeToken;
  }

  setCurrentUser() {
    if (!this.getDecodeToken()) {
      return;
    }
    this.getProfile().subscribe(
      response => this.currentUser.set(response)
    );
  }
}