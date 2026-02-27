import { it, describe, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

// Mock jwt-decode to avoid errors with fake tokens
vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn(() => ({ role: 'admin' })),
}));

try {
  TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
} catch (e) {}

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy = { navigate: vi.fn().mockResolvedValue(true) };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, { provide: Router, useValue: routerSpy }],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should process login and set userRole signal', () => {
    const mockResponse = { access_token: 'fake.jwt.token' };
    const credentials = { username: 'testuser', password: 'password123' };

    service.login(credentials).subscribe();

    // Note: your service uses the full URL 'http://localhost:3000/auth/login'
    const req = httpMock.expectOne('http://localhost:3000/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    // Verify signals and storage
    expect(localStorage.getItem('token')).toBe('fake.jwt.token');
    expect(service.isLoggedIn()).toBe(true);
    expect(service.userRole()).toBe('admin'); // From our mock
  });

  it('should clear data and navigate on logout', () => {
    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(service.userRole()).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
