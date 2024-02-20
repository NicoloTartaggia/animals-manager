import { Router, CanActivateFn } from '@angular/router';

import { inject } from '@angular/core';
import { environment } from '../environments/environment';

export const authGuard: CanActivateFn = (route, state) => {
    const router: Router = inject(Router);
        if (localStorage.getItem(environment.config.jwtTokenKey)) {
            return router.navigate(['/home']);
        } else {
            return router.navigate(['/login']);
        }
}