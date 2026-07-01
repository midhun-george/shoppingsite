import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, UserProfile } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  profile: UserProfile = { name: '', phone: '', address: '', city: '', pincode: '' };

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.profile);
    // Address saved! Now push them automatically into the guarded checkout page
    this.router.navigate(['/checkout']);
  }
}