import { Routes } from '@angular/router';
import { Landing } from './landing/landing';
import { Login } from './login/login';
import { Register } from './register/register';
import { PoliticoDetalhes } from './politico-detalhes/politico-detalhes';
import { Dashboard } from './dashboard/dashboard';
import { Perfil } from './perfil/perfil';
import { Sobre } from './sobre/sobre';
import { Favoritos } from './favoritos/favoritos';

export const routes: Routes = [
    {
        path: '',
        component: Landing
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'register',
        component: Register
    },
    {
        path: 'dashboard',
        component: Dashboard
    },
    {
        path: 'perfil',
        component: Perfil
    },
    {
        path: 'sobre',
        component: Sobre
    },
    {
        path: 'favoritos',
        component: Favoritos
    },
    {
        
        path: 'politico/:id',
        component: PoliticoDetalhes
},

    

];
