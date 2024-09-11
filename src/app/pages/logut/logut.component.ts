import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../authentication/services/auth.service';
import { StorageService } from '../../_services/storage.service';
import { NgHttpLoaderModule } from 'ng-http-loader';

@Component({
  selector: 'app-logut',
  standalone: true,
  imports: [NgHttpLoaderModule, RouterModule],
  templateUrl: './logut.component.html',
  styleUrl: './logut.component.css'
})
export class LogutComponent implements OnInit {
  constructor(
    private router: Router,
    private storageService: StorageService,
    private authService: AuthService // Assuming AuthService is injected
  ) {
    // this.message$ = this.authService.logoutUser();
  }
  isUserLogout: any = false;
  ngOnInit(): void {
    this.authService.logoutUser().subscribe((resp) => {
      if (resp) {
        this.storageService.clean();
        this.isUserLogout = resp;
        this.router.navigate(['/']);
      }
    });
  }
}
