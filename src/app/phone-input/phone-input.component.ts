import { Component, forwardRef, ElementRef, HostListener, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export interface PhoneCountry {
  name: string;
  iso2: string;
  dialCode: string;
}

export const PHONE_COUNTRIES: PhoneCountry[] = [
  { name: 'Afghanistan', iso2: 'af', dialCode: '+93' },
  { name: 'Åland Islands', iso2: 'ax', dialCode: '+358' },
  { name: 'Albania', iso2: 'al', dialCode: '+355' },
  { name: 'Algeria', iso2: 'dz', dialCode: '+213' },
  { name: 'American Samoa', iso2: 'as', dialCode: '+1684' },
  { name: 'Andorra', iso2: 'ad', dialCode: '+376' },
  { name: 'Angola', iso2: 'ao', dialCode: '+244' },
  { name: 'Anguilla', iso2: 'ai', dialCode: '+1264' },
  { name: 'Argentina', iso2: 'ar', dialCode: '+54' },
  { name: 'Armenia', iso2: 'am', dialCode: '+374' },
  { name: 'Aruba', iso2: 'aw', dialCode: '+297' },
  { name: 'Australia', iso2: 'au', dialCode: '+61' },
  { name: 'Austria', iso2: 'at', dialCode: '+43' },
  { name: 'Azerbaijan', iso2: 'az', dialCode: '+994' },
  { name: 'Bahamas', iso2: 'bs', dialCode: '+1242' },
  { name: 'Bahrain', iso2: 'bh', dialCode: '+973' },
  { name: 'Bangladesh', iso2: 'bd', dialCode: '+880' },
  { name: 'Barbados', iso2: 'bb', dialCode: '+1246' },
  { name: 'Belarus', iso2: 'by', dialCode: '+375' },
  { name: 'Belgium', iso2: 'be', dialCode: '+32' },
  { name: 'Belize', iso2: 'bz', dialCode: '+501' },
  { name: 'Benin', iso2: 'bj', dialCode: '+229' },
  { name: 'Bermuda', iso2: 'bm', dialCode: '+1441' },
  { name: 'Bhutan', iso2: 'bt', dialCode: '+975' },
  { name: 'Bolivia', iso2: 'bo', dialCode: '+591' },
  { name: 'Bosnia and Herzegovina', iso2: 'ba', dialCode: '+387' },
  { name: 'Botswana', iso2: 'bw', dialCode: '+267' },
  { name: 'Brazil', iso2: 'br', dialCode: '+55' },
  { name: 'Brunei', iso2: 'bn', dialCode: '+673' },
  { name: 'Bulgaria', iso2: 'bg', dialCode: '+359' },
  { name: 'Burkina Faso', iso2: 'bf', dialCode: '+226' },
  { name: 'Burundi', iso2: 'bi', dialCode: '+257' },
  { name: 'Cambodia', iso2: 'kh', dialCode: '+855' },
  { name: 'Cameroon', iso2: 'cm', dialCode: '+237' },
  { name: 'Canada', iso2: 'ca', dialCode: '+1' },
  { name: 'Cape Verde', iso2: 'cv', dialCode: '+238' },
  { name: 'Cayman Islands', iso2: 'ky', dialCode: '+1345' },
  { name: 'Central African Republic', iso2: 'cf', dialCode: '+236' },
  { name: 'Chad', iso2: 'td', dialCode: '+235' },
  { name: 'Chile', iso2: 'cl', dialCode: '+56' },
  { name: 'China', iso2: 'cn', dialCode: '+86' },
  { name: 'Colombia', iso2: 'co', dialCode: '+57' },
  { name: 'Comoros', iso2: 'km', dialCode: '+269' },
  { name: 'Congo', iso2: 'cg', dialCode: '+242' },
  { name: 'Congo (DRC)', iso2: 'cd', dialCode: '+243' },
  { name: 'Costa Rica', iso2: 'cr', dialCode: '+506' },
  { name: "Côte d'Ivoire", iso2: 'ci', dialCode: '+225' },
  { name: 'Croatia', iso2: 'hr', dialCode: '+385' },
  { name: 'Cuba', iso2: 'cu', dialCode: '+53' },
  { name: 'Cyprus', iso2: 'cy', dialCode: '+357' },
  { name: 'Czech Republic', iso2: 'cz', dialCode: '+420' },
  { name: 'Denmark', iso2: 'dk', dialCode: '+45' },
  { name: 'Djibouti', iso2: 'dj', dialCode: '+253' },
  { name: 'Dominica', iso2: 'dm', dialCode: '+1767' },
  { name: 'Dominican Republic', iso2: 'do', dialCode: '+1809' },
  { name: 'Ecuador', iso2: 'ec', dialCode: '+593' },
  { name: 'Egypt', iso2: 'eg', dialCode: '+20' },
  { name: 'El Salvador', iso2: 'sv', dialCode: '+503' },
  { name: 'Equatorial Guinea', iso2: 'gq', dialCode: '+240' },
  { name: 'Eritrea', iso2: 'er', dialCode: '+291' },
  { name: 'Estonia', iso2: 'ee', dialCode: '+372' },
  { name: 'Ethiopia', iso2: 'et', dialCode: '+251' },
  { name: 'Fiji', iso2: 'fj', dialCode: '+679' },
  { name: 'Finland', iso2: 'fi', dialCode: '+358' },
  { name: 'France', iso2: 'fr', dialCode: '+33' },
  { name: 'Gabon', iso2: 'ga', dialCode: '+241' },
  { name: 'Gambia', iso2: 'gm', dialCode: '+220' },
  { name: 'Georgia', iso2: 'ge', dialCode: '+995' },
  { name: 'Germany', iso2: 'de', dialCode: '+49' },
  { name: 'Ghana', iso2: 'gh', dialCode: '+233' },
  { name: 'Greece', iso2: 'gr', dialCode: '+30' },
  { name: 'Grenada', iso2: 'gd', dialCode: '+1473' },
  { name: 'Guatemala', iso2: 'gt', dialCode: '+502' },
  { name: 'Guinea', iso2: 'gn', dialCode: '+224' },
  { name: 'Guinea-Bissau', iso2: 'gw', dialCode: '+245' },
  { name: 'Guyana', iso2: 'gy', dialCode: '+592' },
  { name: 'Haiti', iso2: 'ht', dialCode: '+509' },
  { name: 'Honduras', iso2: 'hn', dialCode: '+504' },
  { name: 'Hong Kong', iso2: 'hk', dialCode: '+852' },
  { name: 'Hungary', iso2: 'hu', dialCode: '+36' },
  { name: 'Iceland', iso2: 'is', dialCode: '+354' },
  { name: 'India', iso2: 'in', dialCode: '+91' },
  { name: 'Indonesia', iso2: 'id', dialCode: '+62' },
  { name: 'Iran', iso2: 'ir', dialCode: '+98' },
  { name: 'Iraq', iso2: 'iq', dialCode: '+964' },
  { name: 'Ireland', iso2: 'ie', dialCode: '+353' },
  { name: 'Israel', iso2: 'il', dialCode: '+972' },
  { name: 'Italy', iso2: 'it', dialCode: '+39' },
  { name: 'Jamaica', iso2: 'jm', dialCode: '+1876' },
  { name: 'Japan', iso2: 'jp', dialCode: '+81' },
  { name: 'Jordan', iso2: 'jo', dialCode: '+962' },
  { name: 'Kazakhstan', iso2: 'kz', dialCode: '+7' },
  { name: 'Kenya', iso2: 'ke', dialCode: '+254' },
  { name: 'Kiribati', iso2: 'ki', dialCode: '+686' },
  { name: 'Kuwait', iso2: 'kw', dialCode: '+965' },
  { name: 'Kyrgyzstan', iso2: 'kg', dialCode: '+996' },
  { name: 'Laos', iso2: 'la', dialCode: '+856' },
  { name: 'Latvia', iso2: 'lv', dialCode: '+371' },
  { name: 'Lebanon', iso2: 'lb', dialCode: '+961' },
  { name: 'Lesotho', iso2: 'ls', dialCode: '+266' },
  { name: 'Liberia', iso2: 'lr', dialCode: '+231' },
  { name: 'Libya', iso2: 'ly', dialCode: '+218' },
  { name: 'Liechtenstein', iso2: 'li', dialCode: '+423' },
  { name: 'Lithuania', iso2: 'lt', dialCode: '+370' },
  { name: 'Luxembourg', iso2: 'lu', dialCode: '+352' },
  { name: 'Macau', iso2: 'mo', dialCode: '+853' },
  { name: 'Madagascar', iso2: 'mg', dialCode: '+261' },
  { name: 'Malawi', iso2: 'mw', dialCode: '+265' },
  { name: 'Malaysia', iso2: 'my', dialCode: '+60' },
  { name: 'Maldives', iso2: 'mv', dialCode: '+960' },
  { name: 'Mali', iso2: 'ml', dialCode: '+223' },
  { name: 'Malta', iso2: 'mt', dialCode: '+356' },
  { name: 'Mauritania', iso2: 'mr', dialCode: '+222' },
  { name: 'Mauritius', iso2: 'mu', dialCode: '+230' },
  { name: 'Mexico', iso2: 'mx', dialCode: '+52' },
  { name: 'Moldova', iso2: 'md', dialCode: '+373' },
  { name: 'Monaco', iso2: 'mc', dialCode: '+377' },
  { name: 'Mongolia', iso2: 'mn', dialCode: '+976' },
  { name: 'Montenegro', iso2: 'me', dialCode: '+382' },
  { name: 'Morocco', iso2: 'ma', dialCode: '+212' },
  { name: 'Mozambique', iso2: 'mz', dialCode: '+258' },
  { name: 'Myanmar', iso2: 'mm', dialCode: '+95' },
  { name: 'Namibia', iso2: 'na', dialCode: '+264' },
  { name: 'Nepal', iso2: 'np', dialCode: '+977' },
  { name: 'Netherlands', iso2: 'nl', dialCode: '+31' },
  { name: 'New Zealand', iso2: 'nz', dialCode: '+64' },
  { name: 'Nicaragua', iso2: 'ni', dialCode: '+505' },
  { name: 'Niger', iso2: 'ne', dialCode: '+227' },
  { name: 'Nigeria', iso2: 'ng', dialCode: '+234' },
  { name: 'North Korea', iso2: 'kp', dialCode: '+850' },
  { name: 'North Macedonia', iso2: 'mk', dialCode: '+389' },
  { name: 'Norway', iso2: 'no', dialCode: '+47' },
  { name: 'Oman', iso2: 'om', dialCode: '+968' },
  { name: 'Pakistan', iso2: 'pk', dialCode: '+92' },
  { name: 'Palestine', iso2: 'ps', dialCode: '+970' },
  { name: 'Panama', iso2: 'pa', dialCode: '+507' },
  { name: 'Papua New Guinea', iso2: 'pg', dialCode: '+675' },
  { name: 'Paraguay', iso2: 'py', dialCode: '+595' },
  { name: 'Peru', iso2: 'pe', dialCode: '+51' },
  { name: 'Philippines', iso2: 'ph', dialCode: '+63' },
  { name: 'Poland', iso2: 'pl', dialCode: '+48' },
  { name: 'Portugal', iso2: 'pt', dialCode: '+351' },
  { name: 'Puerto Rico', iso2: 'pr', dialCode: '+1787' },
  { name: 'Qatar', iso2: 'qa', dialCode: '+974' },
  { name: 'Romania', iso2: 'ro', dialCode: '+40' },
  { name: 'Russia', iso2: 'ru', dialCode: '+7' },
  { name: 'Rwanda', iso2: 'rw', dialCode: '+250' },
  { name: 'Saudi Arabia', iso2: 'sa', dialCode: '+966' },
  { name: 'Senegal', iso2: 'sn', dialCode: '+221' },
  { name: 'Serbia', iso2: 'rs', dialCode: '+381' },
  { name: 'Sierra Leone', iso2: 'sl', dialCode: '+232' },
  { name: 'Singapore', iso2: 'sg', dialCode: '+65' },
  { name: 'Slovakia', iso2: 'sk', dialCode: '+421' },
  { name: 'Slovenia', iso2: 'si', dialCode: '+386' },
  { name: 'Somalia', iso2: 'so', dialCode: '+252' },
  { name: 'South Africa', iso2: 'za', dialCode: '+27' },
  { name: 'South Korea', iso2: 'kr', dialCode: '+82' },
  { name: 'South Sudan', iso2: 'ss', dialCode: '+211' },
  { name: 'Spain', iso2: 'es', dialCode: '+34' },
  { name: 'Sri Lanka', iso2: 'lk', dialCode: '+94' },
  { name: 'Sudan', iso2: 'sd', dialCode: '+249' },
  { name: 'Suriname', iso2: 'sr', dialCode: '+597' },
  { name: 'Sweden', iso2: 'se', dialCode: '+46' },
  { name: 'Switzerland', iso2: 'ch', dialCode: '+41' },
  { name: 'Syria', iso2: 'sy', dialCode: '+963' },
  { name: 'Taiwan', iso2: 'tw', dialCode: '+886' },
  { name: 'Tajikistan', iso2: 'tj', dialCode: '+992' },
  { name: 'Tanzania', iso2: 'tz', dialCode: '+255' },
  { name: 'Thailand', iso2: 'th', dialCode: '+66' },
  { name: 'Togo', iso2: 'tg', dialCode: '+228' },
  { name: 'Trinidad and Tobago', iso2: 'tt', dialCode: '+1868' },
  { name: 'Tunisia', iso2: 'tn', dialCode: '+216' },
  { name: 'Turkey', iso2: 'tr', dialCode: '+90' },
  { name: 'Turkmenistan', iso2: 'tm', dialCode: '+993' },
  { name: 'Uganda', iso2: 'ug', dialCode: '+256' },
  { name: 'Ukraine', iso2: 'ua', dialCode: '+380' },
  { name: 'United Arab Emirates', iso2: 'ae', dialCode: '+971' },
  { name: 'United Kingdom', iso2: 'gb', dialCode: '+44' },
  { name: 'United States', iso2: 'us', dialCode: '+1' },
  { name: 'Uruguay', iso2: 'uy', dialCode: '+598' },
  { name: 'Uzbekistan', iso2: 'uz', dialCode: '+998' },
  { name: 'Venezuela', iso2: 've', dialCode: '+58' },
  { name: 'Vietnam', iso2: 'vn', dialCode: '+84' },
  { name: 'Yemen', iso2: 'ye', dialCode: '+967' },
  { name: 'Zambia', iso2: 'zm', dialCode: '+260' },
  { name: 'Zimbabwe', iso2: 'zw', dialCode: '+263' }
];

@Component({
  selector: 'app-phone-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneInputComponent),
      multi: true
    }
  ],
  template: `
    <div class="phone-input-wrapper">
      <div class="country-selector" (click)="toggleDropdown($event)">
        <img class="flag-img" [src]="getFlagUrl(selectedCountry.iso2)" [alt]="selectedCountry.name" />
        <span class="dial-code">{{ selectedCountry.dialCode }}</span>
        <span class="arrow">▼</span>
      </div>
      <input
        type="tel"
        class="phone-number"
        [placeholder]="placeholder"
        [(ngModel)]="phoneNumber"
        (ngModelChange)="onPhoneChange()"
        (blur)="onTouched()"
      />
      <div class="dropdown" *ngIf="dropdownOpen">
        <input
          type="text"
          class="search-input"
          placeholder="Search"
          [(ngModel)]="searchQuery"
          (click)="$event.stopPropagation()"
        />
        <div class="country-list">
          <div
            class="country-item"
            *ngFor="let country of filteredCountries"
            (click)="selectCountry(country, $event)"
          >
            <img class="flag-img" [src]="getFlagUrl(country.iso2)" [alt]="country.name" />
            <span class="country-name">{{ country.name }}</span>
            <span class="country-dial-code">{{ country.dialCode }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .phone-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      background: white;
      overflow: visible;
    }
    .country-selector {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 10px 8px 10px 12px;
      cursor: pointer;
      border-right: 1px solid #e5e7eb;
      user-select: none;
      white-space: nowrap;
    }
    .country-selector:hover {
      background: #f9fafb;
    }
    .flag-img {
      width: 24px;
      height: 16px;
      object-fit: cover;
      border-radius: 2px;
      box-shadow: 0 0 1px rgba(0,0,0,0.2);
    }
    .dial-code {
      font-size: 14px;
      color: #374151;
      font-weight: 500;
    }
    .arrow {
      font-size: 10px;
      color: #9ca3af;
    }
    .phone-number {
      flex: 1;
      border: none;
      outline: none;
      padding: 10px 12px;
      font-size: 14px;
      background: transparent;
      min-width: 0;
    }
    .phone-number::placeholder {
      color: #9ca3af;
    }
    .dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
      z-index: 1000;
      margin-top: 4px;
      max-height: 300px;
      display: flex;
      flex-direction: column;
    }
    .search-input {
      padding: 10px 12px;
      border: none;
      border-bottom: 1px solid #e5e7eb;
      outline: none;
      font-size: 14px;
      border-radius: 8px 8px 0 0;
    }
    .search-input::placeholder {
      color: #9ca3af;
    }
    .country-list {
      overflow-y: auto;
      max-height: 250px;
    }
    .country-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      cursor: pointer;
      font-size: 14px;
    }
    .country-item:hover {
      background: #f3f4f6;
    }
    .country-name {
      flex: 1;
      color: #374151;
    }
    .country-dial-code {
      color: #6b7280;
      font-size: 13px;
    }
  `]
})
export class PhoneInputComponent implements ControlValueAccessor, OnChanges {
  @Input() placeholder = 'Phone Number';
  @Input() countryIso2 = 'in';
  @Output() countryChange = new EventEmitter<PhoneCountry>();
  @ViewChild('dropdownEl') dropdownEl!: ElementRef;

  countries = PHONE_COUNTRIES;
  selectedCountry: PhoneCountry = this.countries.find(c => c.iso2 === 'in')!;
  phoneNumber = '';
  searchQuery = '';
  dropdownOpen = false;

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['countryIso2']?.currentValue) {
      const iso2 = String(changes['countryIso2'].currentValue).toLowerCase();
      const match = this.countries.find((c: PhoneCountry) => c.iso2 === iso2);
      if (match && match.iso2 !== this.selectedCountry.iso2) {
        this.selectedCountry = match;
        this.countryChange.emit(this.selectedCountry);
        this.emitValue();
      }
    }
  }

  get filteredCountries(): PhoneCountry[] {
    if (!this.searchQuery) return this.countries;
    const q = this.searchQuery.toLowerCase();
    return this.countries.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.dialCode.includes(q) ||
      c.iso2.includes(q)
    );
  }

  getFlagUrl(iso2: string): string {
    return `https://flagcdn.com/w40/${iso2.toLowerCase()}.png`;
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
    if (!this.dropdownOpen) {
      this.searchQuery = '';
    }
  }

  selectCountry(country: PhoneCountry, event: Event): void {
    event.stopPropagation();
    this.selectedCountry = country;
    this.dropdownOpen = false;
    this.searchQuery = '';
    this.countryChange.emit(this.selectedCountry);
    this.emitValue();
  }

  onPhoneChange(): void {
    this.emitValue();
  }

  private emitValue(): void {
    const value = this.phoneNumber
      ? `${this.selectedCountry.dialCode} ${this.phoneNumber}`
      : '';
    this.onChange(value);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.dropdownOpen = false;
    this.searchQuery = '';
  }

  writeValue(value: string): void {
    if (value) {
      const match = this.countries.find(c => value.startsWith(c.dialCode));
      if (match) {
        this.selectedCountry = match;
        this.countryChange.emit(this.selectedCountry);
        this.phoneNumber = value.replace(match.dialCode, '').trim();
      } else {
        this.phoneNumber = value;
      }
    } else {
      this.phoneNumber = '';
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
