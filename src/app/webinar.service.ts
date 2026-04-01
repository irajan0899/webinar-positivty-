import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Webinar {
  id: number;
  webinarId?: number;
  topic: string;
  agenda: string;
  startTime: string;
  duration: number;
  timezone: string;
  panelist: string | null;
  panelistName?: string | null;
  panelistDesignation: string | null;
  thumbnail: string;
  panelistThumbnail?: string | null;
  joinUrl: string;
  recordingLink: string;
  hostId: string;
  createdAt: string;
  isSimulive: boolean;
  supportGoLive: boolean;
  transitionToLive: boolean;
  uuid: string;
  selected?: boolean;
}

export interface RegistrationPayload {
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  organizationName: string;
  referrer: string;
  webinarIds: string[];
}

export interface RegistrationResponse {
  message?: string;
  success?: boolean;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class WebinarService {
  private apiUrl = 'https://api.positivty.com/api/Zoom/getWebinarList?fetchFromDb=true';
  private registrationUrl = 'https://api.positivty.com/api/Zoom/RegisterWebinarParticipant';

  constructor(private http: HttpClient) {}

  getWebinars(): Observable<Webinar[]> {
    return this.http.get<Webinar[]>(this.apiUrl);
  }

  registerParticipant(payload: RegistrationPayload): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(this.registrationUrl, payload);
  }
}
