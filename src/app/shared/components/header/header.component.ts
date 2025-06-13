import {Component, computed, HostBinding, HostListener} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {AsyncPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {
  trigger,
  transition,
  style,
  animate,
} from '@angular/animations';
import {Button} from 'primeng/button';
import {AuthService, UserResponse} from '../../../features/keycloak/services/auth.service';
import {Menu} from 'primeng/menu';
import {MenuItem} from 'primeng/api';
import {AdminPanelService} from '../../../features/admin-bo/services/admin-panel.service';
import {switchMap, tap} from 'rxjs';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [
    RouterLink,
    NgForOf,
    NgIf,
    NgClass,
    RouterLinkActive,
    Button,
    Menu,
    AsyncPipe
  ],
  standalone: true,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' })),
      ]),
    ]),
  ],
})
export class HeaderComponent {
  isScrolled = false;
  isMobileMenuOpen = false;
  user: UserResponse | null = null;
  userPhotoUrl: string | null = null;
  menuItems: MenuItem[] = [];
  constructor(protected authService: AuthService, private router: Router, private adminPanelService: AdminPanelService) {}

  navLinks = [
    { path: '', label: 'Home' },
    { path: 'human-body', label: 'Ejercicios' },
    { path: 'trainers', label: 'Trainers' },
    { path: 'workouts', label: 'Entrenamientos' },
  ];

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 10;
  }

  darkTheme = false;
  
  private detectSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.darkTheme = true;
      document.querySelector('html')?.classList.add('my-app-dark');
    } else {
      this.darkTheme = false;
      document.querySelector('html')?.classList.remove('my-app-dark');
    }
  }

  isDarkTheme() {
    return this.darkTheme;
  }

  ngOnInit(): void {
    // Detecta el tema del sistema al iniciar
    this.detectSystemTheme();
    
    // Escucha cambios en el tema del sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      this.darkTheme = e.matches;
      if (e.matches) {
        document.querySelector('html')?.classList.add('my-app-dark');
      } else {
        document.querySelector('html')?.classList.remove('my-app-dark');
      }
    });
    
    this.authService.isAuthenticated().subscribe(isAuth => {
      if (isAuth) {
        this.loadUserData();
        this.setupUserMenu();
      } else {
        this.user = null;
        this.userPhotoUrl = null;
        this.menuItems = [];
      }
    });
  }



  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  private loadUserData(): void {
    this.authService.getUserInfo().pipe(
      tap(user => this.user = user),
      switchMap(user => {
        if (!user || !user.id || !user.type) throw new Error('Usuario no válido o sin tipo');

        const userId = user.id;


        if (user.type === 'client') {
          return this.adminPanelService.getClientsByUserId(userId);
        } else if (user.type === 'worker') {
          return this.adminPanelService.getWorkerByUserId(userId);
        } else {
          throw new Error(`Tipo de usuario no soportado: ${user.type}`);
        }
      }),
      switchMap(userData => {
        if (!userData.avatar) throw new Error('El usuario no tiene avatar');
        return this.adminPanelService.getUserPhotoUrl(userData.avatar).pipe(
          tap(photo => {
            this.userPhotoUrl = photo.secure_url;
          })
        );
      })
    ).subscribe({
      next: () => {
        console.log('Usuario y foto cargados correctamente');
      },
      error: (err) => {
        console.error('Error al cargar datos del usuario o la foto:', err);
        this.user = null;
        this.userPhotoUrl = null;
      }
    });
  }


  private setupUserMenu(): void {
    this.menuItems = [
      {
        label: 'Ver perfil',
        icon: 'pi pi-user',
        command: () => {
          console.log('Ver perfil');
          this.router.navigate(['/edit-profile']);
        }
      },
      {
        label: 'Mis suscripciones',
        icon: 'pi pi-list',
        command: () => {
          this.router.navigate(['/my-services']);
        }
      },
      {
        label: 'Cerrar sesión',
        icon: 'pi pi-sign-out',
        command: () => {
          this.authService.logout();
        }
      }
    ];
  }


  getUserInitials(): string {
    if (!this.user) return 'U';
    const username = this.user.username || '';
    return username.substring(0, 2).toUpperCase();
  }

  toggleDarkMode() {
    const element = document.querySelector('html');
    if (element !== null) {
      element.classList.toggle('my-app-dark');
      this.darkTheme = !this.darkTheme;
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

}
