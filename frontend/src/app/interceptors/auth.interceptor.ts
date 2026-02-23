export const authInterceptor = (request: any, next: any) => {
    const token = localStorage.getItem('token');
    // Clone the request and add the Authorization header if the token exists
    if (token) {
        const authReq = request .clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
    }
    // If no token, just pass the original request (e.g., for the login call itself)
    return next(request);

}