import { Injectable } from '@angular/core';

export interface UserProfile {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInUser: UserProfile | null = null;

  // Check if user has filled out their profile credentials
  isLoggedIn(): boolean {
    return this.loggedInUser !== null;
  }

  getUser(): UserProfile | null {
    return this.loggedInUser;
  }

  login(profile: UserProfile) {
    this.loggedInUser = profile;
  }

  logout() {
    this.loggedInUser = null;
  }
}