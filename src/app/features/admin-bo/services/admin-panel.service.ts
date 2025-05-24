import { Injectable } from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminPanelService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient, private router: Router) {}

  getUserPhotoUrl() {
    const photoId = 'entrenaSyncLogo_cpm2vo';
    return this.http.get<{ secure_url: string }>(`${this.apiUrl}/storage/images/${photoId}`);
  }
}
