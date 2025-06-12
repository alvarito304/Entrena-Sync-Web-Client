import {Component, OnInit} from '@angular/core';
import {Trainer} from '../worker-page/worker-page.component';
import {ActivatedRoute, Router} from '@angular/router';
import {AdminPanelService, WorkerResponse} from '../admin-bo/services/admin-panel.service';
import {FitnessService, FitnessServiceService} from './services/fitness-service.service';
import {Button} from 'primeng/button';
import {NgForOf, NgIf} from '@angular/common';
import {catchError, of} from 'rxjs';
import {MessageService} from 'primeng/api';
import {AuthService} from '../keycloak/services/auth.service';

@Component({
  selector: 'app-services-page',
  imports: [
    Button,
    NgIf,
    NgForOf
  ],
  templateUrl: './services-page.component.html',
  standalone: true,
  styleUrl: './services-page.component.css'
})
export class ServicesPageComponent implements OnInit {
  trainer: WorkerResponse | null = null
  services: FitnessService[] = []
  loading = false
  trainerId = ""

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminPanelService,
    private fitnessService: FitnessServiceService,
    private messageService: MessageService,
    private authService: AuthService
  ) {}


  loadTrainerData() {
    const navigation = this.router.getCurrentNavigation()
    if (navigation?.extras.state?.["trainer"]) {
      this.trainer = navigation.extras.state["trainer"]
      console.log("Trainer data loaded from navigation:", this.trainer)
    } else {
      this.loadTrainerFromApi()
    }
  }

  loadTrainerFromApi() {
    this.adminService.getWorkerById(this.trainerId).subscribe({
      next: (worker) => {
        if (worker) {
          this.trainer = worker;
          console.log("Trainer loaded from API:", this.trainer);
        } else {
          console.warn("No trainer found for id", this.trainerId);
        }
      },
      error: (err) => {
        console.error("Error loading trainer from API:", err);
      }
    });
  }


  loadServices() {
    if (!this.trainerId) {
      console.error("No trainer ID provided")
      return
    }

    this.loading = true
    console.log("Loading services for trainer:", this.trainerId)

    // Obtener el worker por ID para conseguir su service_list
    this.adminService
      .getWorkerById(this.trainerId)
      .pipe(
        catchError((error) => {
          console.error("Error loading worker:", error)
          this.loading = false
          return of(null)
        }),
      )
      .subscribe((worker) => {
        if (!worker) {
          this.loading = false
          return
        }

        console.log("Worker data:", worker)

        if (!worker.service_list || !Array.isArray(worker.service_list) || worker.service_list.length === 0) {
          console.log("Worker has no services")
          this.services = []
          this.loading = false
          return
        }

        this.fitnessService
          .getServicesByIds(worker.service_list)
          .pipe(
            catchError((error) => {
              console.error("Error loading services:", error)
              this.loading = false
              return of([])
            }),
          )
          .subscribe((services) => {
            this.services = services
            this.loading = false
            console.log("Services loaded:", this.services)
          })
      })
  }

  goBack() {
    this.router.navigate(["/trainers"])
  }

  subscribeToService(service: FitnessService) {
    this.authService.isAuthenticated().subscribe(isAuth => {
      const amountInCents = service.price * 100;
      sessionStorage.setItem('pendingServiceId', service.id);
      sessionStorage.setItem('pendingServicePrice', amountInCents.toString());
      if (!isAuth) {
        this.router.navigate(['/login']);
        return;
      }
      this.fitnessService.makePayment(amountInCents.toString());
    });
  }



  retryLoadServices() {
    this.loadServices()
  }

  getCategoryClass(service?: FitnessService): string {
    if (!service) {
      return ''; // Evita error si service no está definido
    }
    return service.location ? 'pi pi-map-marker' : 'pi pi-desktop';
  }

  ngOnInit(): void {
    console.log("Initializing ServicesPageComponent")
    this.trainerId = this.route.snapshot.paramMap.get('id') || '';
    this.loadTrainerData()
    this.loadServices()
  }


}
