import {Component, OnInit} from '@angular/core';
import {Paginator} from 'primeng/paginator';
import {NgForOf, NgIf} from '@angular/common';
import {Button} from 'primeng/button';

import {AdminPanelService} from '../admin-bo/services/admin-panel.service';
import {Router, RouterLink} from '@angular/router';
import {catchError, forkJoin, map, of} from 'rxjs';

export interface Trainer {
  userId: string
  workerId: string | undefined
  name: string
  field: string
  description: string
  avatar: string
  rating: number
  location: string
  email: string
  phone?: string
  gender?: string
  birthdate?: string
  service_list?: string[]
}

@Component({
  selector: 'app-worker-page',
  imports: [
    Paginator,
    Button,
    NgForOf,
    RouterLink,
    NgIf
  ],
  templateUrl: './worker-page.component.html',
  standalone: true,
  styleUrl: './worker-page.component.css'
})
export class WorkerPageComponent implements OnInit {
  constructor(private adminService: AdminPanelService, private router: Router) {
  }
  trainers: Trainer[] = []
  currentTrainers: Trainer[] = []
  trainersPerPage = 6
  totalRecords = 0
  currentPage = 0
  loading = false

  ngOnInit() {
    this.loadTrainers()
  }

  loadTrainers() {
    this.loading = true

    // Cargar todos los trabajadores para obtener el total
    this.adminService.getWorkersUsers(0, 1000).subscribe({
      next: (userPaged) => {
        const users = userPaged.content

        this.adminService.getWorkers().subscribe({
          next: (workersResponse) => {
            const workers = Array.isArray(workersResponse) ? workersResponse : workersResponse.content

            const combinedObservables = users.map((user) => {
              const worker = workers.find((w) => w.id_user === user.id)

              if (!worker) {
                return of({
                  userId: user.id,
                  workerId: undefined,
                  name: `${user.firstName} ${user.lastName}`,
                  field: "Desconocido",
                  description: "Información no disponible",
                  avatar: "undefinedAvatar_w8za89",
                  rating: 0,
                  location: "No especificada",
                  email: user.email,
                  phone: undefined,
                  gender: undefined,
                  birthdate: undefined,
                })
              }

              return this.adminService.getWorkerTypeById(worker.id_workerType).pipe(
                map((workerType) => {
                  const trainer: Trainer = {
                    userId: user.id,
                    workerId: worker.id,
                    name: `${user.firstName} ${user.lastName}`,
                    field: workerType?.name ?? "Desconocido",
                    description: this.generateDescription(workerType?.name ?? "Desconocido"),
                    avatar: worker.avatar,
                    rating: this.generateRandomRating(),
                    location: worker.address || "No especificada",
                    email: user.email,
                    phone: worker.phone?.trim(),
                    gender: worker.gender,
                    birthdate: worker.birthdate,
                  }

                  // Cargar imagen si el usuario tiene avatar
                  if (worker.avatar) {
                    this.loadUserPhoto(worker.avatar, trainer)
                  }

                  return trainer
                }),
                catchError(() =>
                  of({
                    userId: user.id,
                    workerId: worker.id,
                    name: `${user.firstName} ${user.lastName}`,
                    field: "Desconocido",
                    description: "Información no disponible",
                    avatar: "undefinedAvatar_w8za89",
                    rating: this.generateRandomRating(),
                    location: worker.address || "No especificada",
                    email: user.email,
                    phone: worker.phone?.trim(),
                    gender: worker.gender,
                    birthdate: worker.birthdate,
                  }),
                ),
              )
            })

            forkJoin(combinedObservables).subscribe((combined) => {
              this.trainers = combined
              this.totalRecords = this.trainers.length
              this.updateCurrentTrainers()
              this.loading = false
              console.log("trainers loaded:", this.trainers)
            })
          },
          error: (error) => {
            console.error("Error loading workers:", error)
            this.loading = false
          },
        })
      },
      error: (error) => {
        console.error("Error loading worker users:", error)
        this.loading = false
      },
    })
  }

  loadUserPhoto(photoId: string, trainer: Trainer) {
    this.adminService.getUserPhotoUrl(photoId).subscribe({
      next: (response) => {
        trainer.avatar = response.secure_url
      },
      error: (error) => {
        console.error("Error loading user photo:", error)
        // Mantener imagen placeholder en caso de error
      },
    })
  }

  updateCurrentTrainers() {
    const startIndex = this.currentPage * this.trainersPerPage
    const endIndex = startIndex + this.trainersPerPage
    this.currentTrainers = this.trainers.slice(startIndex, endIndex)
  }

  onPageChange(event: any) {
    this.currentPage = event.page
    this.loadTrainers()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  generateDescription(workerType: string): string {
    const descriptions: { [key: string]: string } = {
      Gym: "Especialista en entrenamiento funcional y acondicionamiento físico general.",
      Powerlifting: "Entrenador especializado en fuerza máxima y técnicas de powerlifting.",
      Nutrición: "Profesional en nutrición deportiva con enfoque en planes personalizados.",
      Fisioterapia: "Fisioterapeuta especializado en lesiones deportivas y rehabilitación.",
      Fútbol: "Entrenador de fútbol con experiencia en técnica y preparación física.",
      Yoga: "Instructor certificado de yoga y mindfulness.",
      Crossfit: "Coach de CrossFit especializado en entrenamientos de alta intensidad.",
      Pilates: "Instructor de Pilates con formación en rehabilitación.",
      Natación: "Entrenador de natación especializado en técnica y resistencia.",
      Desconocido: "Profesional del fitness con experiencia en entrenamiento personalizado.",
    }
    return descriptions[workerType] || descriptions["Desconocido"]
  }

  generateRandomRating(): number {
    // Generar rating entre 4.5 y 5.0
    return Math.round((4.5 + Math.random() * 0.5) * 10) / 10
  }

  getFieldSeverity(field: string): string {
    const severities: { [key: string]: string } = {
      Gym: "danger",
      Powerlifting: "warning",
      Nutrición: "success",
      Fisio: "info",
      Fútbol: "help",
      Yoga: "secondary",
      Crossfit: "contrast",
      Pilates: "primary",
      Natación: "info",
    }
    return severities[field] || "primary"
  }

  getFieldClass(field: string): string {
    const classes: { [key: string]: string } = {
      Gym: "bg-pink-100 text-pink-800",
      Powerlifting: "bg-red-100 text-red-800",
      Nutrición: "bg-green-100 text-green-800",
      Fisioterapia: "bg-blue-100 text-blue-800",
      Fútbol: "bg-emerald-100 text-emerald-800",
      Yoga: "bg-purple-100 text-purple-800",
      Crossfit: "bg-orange-100 text-orange-800",
      Pilates: "bg-indigo-100 text-indigo-800",
      Natación: "bg-cyan-100 text-cyan-800",
    }
    return classes[field] || "bg-gray-100 text-gray-800"
  }
}
