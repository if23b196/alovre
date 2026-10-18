import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Notification } from '../services/notification';
import { TranslocoService } from '@jsverse/transloco';

export const errorInterceptor: HttpInterceptorFn
  = (req, next) => {
  const notification = inject(Notification);
  const transloco = inject(TranslocoService);

  return next(req).pipe(
    catchError((error) => {
      let errorMessage = transloco.translate('errors.generic');

      if (error.status === 0) {
        // Backend server is completely offline / unreachable
        errorMessage = transloco.translate('errors.serverUnavailable');
      } else if (error.status >= 400 && error.status < 500) {
        // Client-side errors (400 Bad Request, 404 Not Found, etc.)
        errorMessage = error.error?.message || transloco.translate('errors.clientError');
      } else if (error.status >= 500) {
        // Server-side errors (500 Internal Server Error)
        errorMessage = transloco.translate('errors.serverError');
      }

      notification.show(errorMessage, true);
      return throwError(() => error);
    })
  );
};
