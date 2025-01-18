import { signal } from '@angular/core';
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';

export function activeHttpCountInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const ongoingRequestsCount = signal(0);

  // effect(() => {
  //   loadingScreenService.isLoading.set(ongoingRequestsCount() > 0);
  // });

  ongoingRequestsCount.set(ongoingRequestsCount() + 1);

  return next(req).pipe(
    finalize(() => {
      ongoingRequestsCount.set(ongoingRequestsCount() - 1);
    })
  );
}
