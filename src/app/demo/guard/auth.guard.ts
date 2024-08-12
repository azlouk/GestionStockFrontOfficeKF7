import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthentificationService} from "../service/authentification.service";

export const authGuard: CanActivateFn = (route, state) => {
    const auth = inject(AuthentificationService);
    const router = inject(Router);

    if(!auth.isAuthenticated()) {
        router.navigateByUrl('/auth/login')
        return false
    }

    return true};
