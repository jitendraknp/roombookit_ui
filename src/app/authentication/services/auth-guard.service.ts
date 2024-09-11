import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../authentication/services/auth.service';
import { Observable, map, of } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class AuthGuardService {
    isLogIn$!: Observable<boolean>;
    constructor(private authService: AuthService, private router: Router) {
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const url: string = state.url;
        this.authService.setRedirectUrl(url);
        // Allowing the user to login if they are not logged in and trying to access a restricted route.
        return this.authService.isUserLoggedIn().pipe(map((user) => {
            if (user) {
                return true;
            } else {
                this.authService.getRedirectUrl().subscribe((url) => {
                    this.router.navigate([this.authService.getLoginUrl()], {
                        queryParams: { returnUrl: url }
                    });
                });

                return false;
            }
        }));
        // console.log(this.isLogIn$)
        // this.isLogIn$.subscribe((result: boolean) => {
        //     console.log('User is already logged in. Proceeding with the requested route.');
        //     console.log(result)
        //     // return result;
        // });
        // if (this.authService.isUserLoggedIn())
        //     return true;
        this.authService.setRedirectUrl(url);
        console.log('Redirecting to login page for authentication.');
        this.router.navigate([this.authService.getLoginUrl()]);
        return false;
    }
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const loggedInUser = this.authService.getLoggedInUser();
        loggedInUser.subscribe({
            next: (user) => {
                if (user)
                    return true;
                else
                    return false;
            },
            error: (err) => console.log(err)
        });
        return true;
        // if (loggedInUser.role === 'ADMIN') {
        //     return true;
        // } else {
        //     console.log('Unauthorized to open link: ' + state.url);
        //     return false;
        // }
    }
}