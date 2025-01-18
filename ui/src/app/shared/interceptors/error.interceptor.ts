// import { catchError } from 'rxjs/operators';
// import { signOut } from 'aws-amplify/auth';
// import { throwError } from 'rxjs';
// import { HttpInterceptorFn } from '@angular/common/http';

// export const errorInterceptor: HttpInterceptorFn = (req, next) => {
//   return next(req).pipe(
//     catchError((err) => {
//       if (err.status === 401) {
//         // auto logout if 401 response returned from api
//         signOut({ global: true })
//           .then((data) => console.log(data))
//           .catch((err) => console.log(err));
//       }

//       // err.error is not null, if the ResponsenEntity contains an Exception
//       // err.error.message will give the custom message send from the server
//       const error = err.error.message || err.statusText;
//       return throwError(() => new Error(error));
//     }),
//   );
// };
