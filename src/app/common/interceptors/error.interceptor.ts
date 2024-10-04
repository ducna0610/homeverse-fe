import type { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, retry, throwError } from 'rxjs';
import { AlertifyService } from '../services/alertify.service';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {

    constructor(
        private alertifyService: AlertifyService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler) {
        console.log('HTTP Request started');
        return next.handle(request)
            .pipe(
                retry(3),
                catchError((error: HttpErrorResponse) => {
                    console.log(error);
                    const errorMessage = this.setError(error);
                    console.log(errorMessage);

                    this.alertifyService.error(errorMessage);
                    return throwError(errorMessage);
                })
            );
    }

    setError(error: HttpErrorResponse): string {
        let errorMessage = 'Unknown error occured';
        if (error.error instanceof ErrorEvent) {
            // Client side error
            errorMessage = error.error.message;
        } else {
            // server side error
            if (typeof error.error == 'string') {
                errorMessage = error.error;
            } else if (error.statusText) {
                return error.statusText;
            }
        }
        return errorMessage;
    }
}