import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as ct from 'countries-and-timezones';
import { PhoneInputComponent, PhoneCountry } from './phone-input/phone-input.component';
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
  redirectCountdown = 2;

  webinars: Webinar[] = [];
  showMoreSessions = false;
  readonly sessionsPerPage = 4;
  selectedDetailWebinar: Webinar | null = null;
  showDetailPanel = false;
  selectedTimezone = 'Asia/Kolkata';

  private readonly byStartTimeAsc = (a: Webinar, b: Webinar): number =>
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime();

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
        this.webinars = data
          .map((w: Webinar) => ({ ...w, selected: true }))
          .sort(this.byStartTimeAsc);
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
          .map((w: Webinar) => `${w.topic}, ${this.formatDate(w.startTime)} ${this.formatTime(w.startTime)}`)
          .join(',');
        this.thankYouData = {
          attendee: fullName,
          email: email,
          sessionsCount: this.selectedWebinars.length,
          registrationDate: this.formatDate(new Date().toISOString()),
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
    let countdown = 2;
    const interval = setInterval(() => {
      countdown--;
      this.redirectCountdown = countdown;
      if (countdown <= 0) {
        clearInterval(interval);
        window.location.assign('https://positivty.com/');
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
    }).sort(this.byStartTimeAsc);
  }

  private get activeWebinars(): Webinar[] {
    const now = new Date();
    const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    return this.webinars.filter((w: Webinar) => {
      const sessionDate = new Date(w.startTime);
      const sessionUTC = Date.UTC(sessionDate.getUTCFullYear(), sessionDate.getUTCMonth(), sessionDate.getUTCDate());
      return sessionUTC >= todayUTC;
    }).sort(this.byStartTimeAsc);
  }

  get visibleWebinars(): Webinar[] {
    return this.showMoreSessions || this.activeWebinars.length <= this.sessionsPerPage
      ? this.activeWebinars
      : this.activeWebinars.slice(0, this.sessionsPerPage);
  }

  get hasMoreSessions(): boolean {
    return this.activeWebinars.length > this.sessionsPerPage;
  }

  get remainingSessions(): number {
    return this.activeWebinars.length - this.sessionsPerPage;
  }

  get upcomingWebinar(): Webinar | null {
    return this.activeWebinars[0] || null;
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
    return this.activeWebinars.length > 0 && this.activeWebinars.every((w: Webinar) => w.selected);
  }

  toggleAll(): void {
    const shouldSelect = !this.allSelected;
    this.activeWebinars.forEach((w: Webinar) => w.selected = shouldSelect);
  }

  toggleSelection(webinar: Webinar): void {
    webinar.selected = !webinar.selected;
  }

  openDetailPanel(webinar: Webinar): void {
    this.selectedDetailWebinar = webinar;
    this.showDetailPanel = true;
  }

  closeDetailPanel(scrollTargetId?: string): void {
    setTimeout(() => {
      this.showDetailPanel = false;
      this.selectedDetailWebinar = null;

      if (scrollTargetId) {
        const target = document.getElementById(scrollTargetId);
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  }

  onCountryChange(country: PhoneCountry): void {
    this.selectedTimezone = this.getTimezoneForCountry(country.iso2);
  }

  private getTimezoneForCountry(iso2: string): string {
    const countryData = ct.getCountry(iso2.toUpperCase());
    return countryData?.timezones?.[0] || 'Asia/Kolkata';
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: this.selectedTimezone
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: this.selectedTimezone
    });
  }

  backToRegistrationForm(): void {
    this.closeDetailPanel();
    setTimeout(() => {
      this.phoneForm.reset();
      this.registrationError = '';
      this.thankYouData = null;
      this.showThankYou = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
  }
}
