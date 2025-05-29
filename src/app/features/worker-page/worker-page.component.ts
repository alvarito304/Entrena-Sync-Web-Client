import {Component, OnInit} from '@angular/core';
import {Paginator} from 'primeng/paginator';
import {NgClass, NgForOf} from '@angular/common';
import {Button} from 'primeng/button';
import {Tag} from 'primeng/tag';
import {Avatar} from 'primeng/avatar';

export interface Trainer {
  id: number
  name: string
  field: string
  description: string
  image: string
  rating: number
  location: string
}

@Component({
  selector: 'app-worker-page',
  imports: [
    Paginator,
    NgClass,
    Button,
    Tag,
    Avatar,
    NgForOf
  ],
  templateUrl: './worker-page.component.html',
  standalone: true,
  styleUrl: './worker-page.component.css'
})
export class WorkerPageComponent implements OnInit {
  trainers: Trainer[] = [
    {
      id: 1,
      name: "María González",
      field: "Gym",
      description:
        "Especialista en entrenamiento funcional y pérdida de peso. 5 años de experiencia ayudando a personas a alcanzar sus objetivos fitness.",
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.9,
      location: "Madrid Centro",
    },
    {
      id: 2,
      name: "Carlos Ruiz",
      field: "Powerlifting",
      description:
        "Entrenador certificado en powerlifting con múltiples competencias nacionales. Especializado en fuerza máxima y técnica.",
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.8,
      location: "Barcelona",
    },
    {
      id: 3,
      name: "Ana Martín",
      field: "Nutrición",
      description:
        "Nutricionista deportiva con enfoque en planes personalizados. Ayudo a optimizar el rendimiento a través de la alimentación.",
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.9,
      location: "Valencia",
    },
    {
      id: 4,
      name: "David López",
      field: "Fisio",
      description:
        "Fisioterapeuta especializado en lesiones deportivas y rehabilitación. Trabajo con atletas de alto rendimiento.",
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.7,
      location: "Sevilla",
    },
    {
      id: 5,
      name: "Laura Sánchez",
      field: "Fútbol",
      description:
        "Ex-jugadora profesional, ahora entreno equipos juveniles y adultos. Especializada en técnica y preparación física.",
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.8,
      location: "Bilbao",
    },
    {
      id: 6,
      name: "Roberto Fernández",
      field: "Gym",
      description:
        "Personal trainer con 8 años de experiencia. Me especializo en hipertrofia muscular y transformaciones corporales.",
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.6,
      location: "Málaga",
    },
    {
      id: 7,
      name: "Elena Torres",
      field: "Yoga",
      description:
        "Instructora certificada de yoga y mindfulness. Ayudo a encontrar el equilibrio entre cuerpo y mente.",
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.9,
      location: "Granada",
    },
    {
      id: 8,
      name: "Miguel Ángel",
      field: "Crossfit",
      description:
        "Coach de CrossFit nivel 2. Especializado en entrenamientos de alta intensidad y preparación para competencias.",
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.7,
      location: "Zaragoza",
    },
    {
      id: 9,
      name: "Carmen Jiménez",
      field: "Pilates",
      description:
        "Instructora de Pilates con formación en rehabilitación. Trabajo con personas de todas las edades y condiciones físicas.",
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.8,
      location: "Murcia",
    },
    {
      id: 10,
      name: "Alejandro Vega",
      field: "Natación",
      description:
        "Ex-nadador olímpico, ahora entreno a nadadores de todas las edades. Especializado en técnica y resistencia.",
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.9,
      location: "Las Palmas",
    },
  ]

  currentTrainers: Trainer[] = []
  trainersPerPage = 6
  totalRecords = 0
  currentPage = 0

  ngOnInit() {
    this.totalRecords = this.trainers.length
    this.loadTrainers()
  }

  loadTrainers() {
    const startIndex = this.currentPage * this.trainersPerPage
    const endIndex = startIndex + this.trainersPerPage
    this.currentTrainers = this.trainers.slice(startIndex, endIndex)
  }

  onPageChange(event: any) {
    this.currentPage = event.page
    this.loadTrainers()
    window.scrollTo({ top: 0, behavior: "smooth" })
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
      Fisio: "bg-blue-100 text-blue-800",
      Fútbol: "bg-emerald-100 text-emerald-800",
      Yoga: "bg-purple-100 text-purple-800",
      Crossfit: "bg-orange-100 text-orange-800",
      Pilates: "bg-indigo-100 text-indigo-800",
      Natación: "bg-cyan-100 text-cyan-800",
    }
    return classes[field] || "bg-gray-100 text-gray-800"
  }
}
