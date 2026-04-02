import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PhoneInputComponent } from './phone-input/phone-input.component';
import { WebinarService, Webinar, RegistrationPayload } from './webinar.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PhoneInputComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  phoneForm!: FormGroup;

  isSubmitting = false;
  isLoading = false;
  error = '';
  registrationError = '';

  showThankYou = false;
  thankYouData: { attendee: string; email: string; sessionsCount: number; registrationDate: string; sessionDetails: string } | null = null;
  redirectCountdown = 5;

  webinars: Webinar[] = [];
  showMoreSessions = false;
  readonly sessionsPerPage = 4;
  selectedDetailWebinar: Webinar | null = null;
  showDetailPanel = false;

  constructor(private webinarService: WebinarService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.phoneForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: [undefined, [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      organisation: ['']
    });
    this.loadWebinars();
  }

  loadWebinars(): void {
    this.isLoading = true;
    this.error = '';
    this.webinarService.getWebinars().subscribe({
      next: (data: Webinar[]) => {
        this.webinars = data.map((w: Webinar) => ({ ...w, selected: true }));
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error fetching webinars:', err);
        this.error = 'Failed to load webinars. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  register(): void {
    if (this.phoneForm.invalid) {
      this.registrationError = 'Please fill in all required fields.';
      this.phoneForm.markAllAsTouched();
      return;
    }
    if (this.selectedWebinars.length === 0) {
      this.registrationError = 'Please select at least one webinar to register.';
      return;
    }
    this.isSubmitting = true;
    this.registrationError = '';
    const { fullName, phone, email, organisation } = this.phoneForm.value;
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    const payload: RegistrationPayload = {
      firstName: firstName,
      lastName: lastName,
      email: email.trim(),
      contactNumber: phone || '',
      organizationName: organisation.trim(),
      referrer: 'Positivty',
      webinarIds: this.selectedWebinars.map((w: Webinar) => w.webinarId?.toString() || w.id.toString())
    };
    this.webinarService.registerParticipant(payload).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        const sessionDetails = this.selectedWebinars
          .map((w: Webinar) => `${w.topic}, ${new Date(w.startTime).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} ${this.formatTime(w.startTime)}`)
          .join(',');
        this.thankYouData = {
          attendee: fullName,
          email: email,
          sessionsCount: this.selectedWebinars.length,
          registrationDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          sessionDetails: sessionDetails
        };
        this.showThankYou = true;
        this.startRedirectCountdown();
      },
      error: (err: any) => {
        this.isSubmitting = false;
        console.error('Registration error:', err);
        this.registrationError = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }

  private startRedirectCountdown(): void {
    let countdown = 5;
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
    this.phoneForm.reset();
    this.webinars.forEach((w: Webinar) => w.selected = false);
    this.registrationError = '';
  }

  get selectedWebinars(): Webinar[] {
    const now = new Date();
    const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    return this.webinars.filter((w: Webinar) => {
      if (!w.selected) return false;
      const sessionDate = new Date(w.startTime);
      const sessionUTC = Date.UTC(sessionDate.getUTCFullYear(), sessionDate.getUTCMonth(), sessionDate.getUTCDate());
      return sessionUTC >= todayUTC;
    });
  }

  get visibleWebinars(): Webinar[] {
    const now = new Date();
    const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const filtered = this.webinars.filter((w: Webinar) => {
      const sessionDate = new Date(w.startTime);
      const sessionUTC = Date.UTC(sessionDate.getUTCFullYear(), sessionDate.getUTCMonth(), sessionDate.getUTCDate());
      return sessionUTC >= todayUTC;
    });
    return this.showMoreSessions || filtered.length <= this.sessionsPerPage
      ? filtered
      : filtered.slice(0, this.sessionsPerPage);
  }

  get hasMoreSessions(): boolean {
    const now = new Date();
    const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const filtered = this.webinars.filter((w: Webinar) => {
      const sessionDate = new Date(w.startTime);
      const sessionUTC = Date.UTC(sessionDate.getUTCFullYear(), sessionDate.getUTCMonth(), sessionDate.getUTCDate());
      return sessionUTC >= todayUTC;
    });
    return filtered.length > this.sessionsPerPage;
  }

  get remainingSessions(): number {
    const now = new Date();
    const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const filtered = this.webinars.filter((w: Webinar) => {
      const sessionDate = new Date(w.startTime);
      const sessionUTC = Date.UTC(sessionDate.getUTCFullYear(), sessionDate.getUTCMonth(), sessionDate.getUTCDate());
      return sessionUTC >= todayUTC;
    });
    return filtered.length - this.sessionsPerPage;
  }

  get upcomingWebinar(): Webinar | null {
    if (this.webinars.length === 0) return null;
    const now = new Date();
    const upcoming = this.webinars.find((w: Webinar) => new Date(w.startTime) > now);
    return upcoming || null;
  }

  getDaysUntil(dateString: string): number {
    const date = new Date(dateString);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  toggleShowMore(): void {
    this.showMoreSessions = !this.showMoreSessions;
  }

  get allSelected(): boolean {
    return this.webinars.length > 0 && this.selectedWebinars.length === this.webinars.length;
  }

  toggleAll(): void {
    const shouldSelect = !this.allSelected;
    this.webinars.forEach((w: Webinar) => w.selected = shouldSelect);
  }

  toggleSelection(webinar: Webinar): void {
    webinar.selected = !webinar.selected;
  }

  openDetailPanel(webinar: Webinar): void {
    this.selectedDetailWebinar = webinar;
    this.showDetailPanel = true;
  }

  closeDetailPanel(): void {
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
