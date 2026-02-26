export const authInterceptor = (request: any, next: any) => {
  const token = localStorage.getItem('token');
  // Clone the request and add the Authorization header if the token exists
  if (token) {
    const authReq = request.clone({
      // Clone the original request to add the new header
      setHeaders: {
        Authorization: `Bearer ${token}`, // Attach the token in the Authorization header for all outgoing requests
      },
    });
    return next(authReq); // Pass the modified request to the next handler
  }
  // If no token, just pass the original request (e.g., for the login call itself)
  return next(request); // Pass the original request to the next handler
};
