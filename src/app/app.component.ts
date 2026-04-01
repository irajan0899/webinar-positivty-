import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { COUNTRIES } from './countries';
import { WebinarService, Webinar, RegistrationPayload } from './webinar.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  countries = COUNTRIES;
  fullName: string = '';
  organisation: string = '';
  email: string = '';
  mobileNumber: string = '';
  country: string = '';
  isSubmitting: boolean = false;
  isLoading: boolean = false;
  error: string = '';
  registrationError: string = '';

  // Thank you page state
  showThankYou: boolean = false;
  thankYouData: { attendee: string; email: string; sessionsCount: number; registrationDate: string; sessionDetails: string } | null = null;
  redirectCountdown: number = 3;

  webinars: Webinar[] = [];
  showMoreSessions: boolean = false;
  readonly sessionsPerPage: number = 4;
  selectedDetailWebinar: Webinar | null = null;
  showDetailPanel: boolean = false;

  constructor(private webinarService: WebinarService) {}

  ngOnInit(): void {
    this.loadWebinars();
  }

  loadWebinars(): void {
    this.isLoading = true;
    this.error = '';
    this.webinarService.getWebinars().subscribe({
      next: (data) => {
        this.webinars = data.map(w => ({ ...w, selected: true }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching webinars:', err);
        this.error = 'Failed to load webinars. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  register(): void {
    // Validation
    if (!this.fullName.trim() || !this.organisation.trim() || !this.email.trim() || !this.mobileNumber.trim()) {
      this.registrationError = 'Please fill in all required fields.';
      return;
    }

    if (this.selectedWebinars.length === 0) {
      this.registrationError = 'Please select at least one webinar to register.';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.registrationError = 'Please enter a valid email address.';
      return;
    }

    this.isSubmitting = true;
    this.registrationError = '';

    const nameParts = this.fullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    const payload: RegistrationPayload = {
      firstName: firstName,
      lastName: lastName,
      email: this.email.trim(),
      contactNumber: this.mobileNumber.trim(),
      organizationName: this.organisation.trim(),
      referrer: 'Positivty',
      webinarIds: this.selectedWebinars.map(w => w.webinarId?.toString() || w.id.toString())
    };

    this.webinarService.registerParticipant(payload).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        
        const sessionDetails = this.selectedWebinars
          .map(w => `${w.topic}, ${new Date(w.startTime).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} ${this.formatTime(w.startTime)}`)
          .join(',');
        
        // Show thank you page
        this.thankYouData = {
          attendee: this.fullName,
          email: this.email,
          sessionsCount: this.selectedWebinars.length,
          registrationDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          sessionDetails: sessionDetails
        };
        this.showThankYou = true;

        // Start countdown and redirect
        this.startRedirectCountdown();
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Registration error:', err);
        this.registrationError = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }

  private startRedirectCountdown(): void {
    let countdown = 3;
    const interval = setInterval(() => {
      countdown--;
      this.redirectCountdown = countdown;

      if (countdown <= 0) {
        clearInterval(interval);
        window.location.href = 'https://www.positivty.com/';
      }
    }, 1000);
  }

  resetForm(): void {
    this.fullName = '';
    this.organisation = '';
    this.email = '';
    this.mobileNumber = '';
    this.country = '';
    this.webinars.forEach(w => w.selected = false);
    this.registrationError = '';
  }

  get selectedWebinars() {
    return this.webinars.filter(w => w.selected);
  }

  get visibleWebinars() {
    return this.showMoreSessions || this.webinars.length <= this.sessionsPerPage
      ? this.webinars
      : this.webinars.slice(0, this.sessionsPerPage);
  }

  get hasMoreSessions() {
    return this.webinars.length > this.sessionsPerPage;
  }

  get remainingSessions() {
    return this.webinars.length - this.sessionsPerPage;
  }

  get upcomingWebinar(): Webinar | null {
    if (this.webinars.length === 0) return null;
    const now = new Date();
    const upcoming = this.webinars.find(w => new Date(w.startTime) > now);
    return upcoming || null;
  }

  getDaysUntil(dateString: string): number {
    const date = new Date(dateString);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  toggleShowMore() {
    this.showMoreSessions = !this.showMoreSessions;
  }

  get allSelected() {
    return this.webinars.length > 0 && this.selectedWebinars.length === this.webinars.length;
  }

  toggleAll() {
    const shouldSelect = !this.allSelected;
    this.webinars.forEach(w => w.selected = shouldSelect);
  }

  toggleSelection(webinar: Webinar) {
    webinar.selected = !webinar.selected;
  }

  openDetailPanel(webinar: Webinar) {
    this.selectedDetailWebinar = webinar;
    this.showDetailPanel = true;
  }

  closeDetailPanel() {
    setTimeout(() => {
      this.showDetailPanel = false;
      this.selectedDetailWebinar = null;
    }, 300);
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }
}
