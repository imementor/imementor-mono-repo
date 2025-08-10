import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-searchable-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="searchable-dropdown" [class.open]="isDropdownOpen">
      <div class="dropdown-input-container">
        <input
          #searchInput
          type="text"
          class="dropdown-input"
          [placeholder]="placeholder"
          [(ngModel)]="searchTerm"
          (focus)="onFocus()"
          (blur)="onBlur()"
          (input)="onSearch()"
          (keydown)="onKeyDown($event)"
        />
        <button
          type="button"
          class="dropdown-toggle"
          (click)="toggleDropdown()"
          [class.rotated]="isDropdownOpen">
          ▼
        </button>
      </div>
      
      <div class="dropdown-menu" *ngIf="isDropdownOpen">
        <div class="dropdown-options" #optionsList>
          <!-- Filtered existing options -->
          <div
            *ngFor="let option of filteredOptions; let i = index"
            class="dropdown-option"
            [class.highlighted]="i === highlightedIndex"
            (click)="selectOption(option)"
            (mouseenter)="setHighlightedIndex(i)">
            {{ option }}
          </div>
          
          <!-- Add custom option -->
          <div
            *ngIf="canAddCustom"
            class="dropdown-option custom-option"
            [class.highlighted]="highlightedIndex === filteredOptions.length"
            (click)="addCustomOption()"
            (mouseenter)="setHighlightedIndex(filteredOptions.length)">
            <span class="add-icon">+</span>
            Add "{{ searchTerm }}"
          </div>
          
          <!-- No results message -->
          <div *ngIf="filteredOptions.length === 0 && !canAddCustom" class="no-results">
            No results found
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .searchable-dropdown {
      position: relative;
      width: 100%;
    }

    .dropdown-input-container {
      position: relative;
      display: flex;
      align-items: center;
    }

    .dropdown-input {
      width: 100%;
      padding: 0.75rem 2.5rem 0.75rem 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 1rem;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .dropdown-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .dropdown-toggle {
      position: absolute;
      right: 0.75rem;
      background: none;
      border: none;
      cursor: pointer;
      color: #6b7280;
      transition: transform 0.2s, color 0.2s;
      padding: 0.25rem;
    }

    .dropdown-toggle:hover {
      color: #374151;
    }

    .dropdown-toggle.rotated {
      transform: rotate(180deg);
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      max-height: 200px;
      overflow-y: auto;
      margin-top: 0.25rem;
    }

    .dropdown-options {
      padding: 0.25rem 0;
    }

    .dropdown-option {
      padding: 0.75rem;
      cursor: pointer;
      transition: background-color 0.2s;
      border-bottom: 1px solid #f3f4f6;
    }

    .dropdown-option:last-child {
      border-bottom: none;
    }

    .dropdown-option:hover,
    .dropdown-option.highlighted {
      background-color: #f3f4f6;
    }

    .dropdown-option.custom-option {
      color: #3b82f6;
      font-weight: 500;
      background-color: #eff6ff;
    }

    .dropdown-option.custom-option:hover,
    .dropdown-option.custom-option.highlighted {
      background-color: #dbeafe;
    }

    .add-icon {
      display: inline-block;
      margin-right: 0.5rem;
      font-weight: bold;
    }

    .no-results {
      padding: 0.75rem;
      color: #6b7280;
      text-align: center;
      font-style: italic;
    }

    .searchable-dropdown.open .dropdown-input {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  `]
})
export class SearchableDropdownComponent implements OnInit, OnDestroy {
  @Input() options: string[] = [];
  @Input() placeholder: string = 'Search or add...';
  @Input() allowCustom: boolean = true;
  @Output() optionSelected = new EventEmitter<string>();

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('optionsList') optionsList!: ElementRef<HTMLDivElement>;

  searchTerm = '';
  isDropdownOpen = false;
  highlightedIndex = -1;

  get filteredOptions(): string[] {
    const searchTerm = this.searchTerm.trim().toLowerCase();
    if (!searchTerm) {
      return this.options;
    }
    
    return this.options.filter(option =>
      option.toLowerCase().includes(searchTerm)
    );
  }

  get canAddCustom(): boolean {
    if (!this.allowCustom || !this.searchTerm.trim()) {
      return false;
    }
    
    const normalizedSearch = this.searchTerm.trim().toLowerCase();
    const exactMatch = this.options.some(option => 
      option.toLowerCase() === normalizedSearch
    );
    
    return !exactMatch;
  }

  ngOnInit() {
    // Listen for clicks outside the dropdown
    document.addEventListener('click', this.onDocumentClick.bind(this));
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.onDocumentClick.bind(this));
  }

  onFocus() {
    this.isDropdownOpen = true;
    this.highlightedIndex = -1;
  }

  onBlur() {
    // Small delay to allow option selection
    setTimeout(() => {
      if (!this.isDropdownOpen) return; // Already closed
      this.isDropdownOpen = false;
      this.highlightedIndex = -1;
    }, 200);
  }

  onSearch() {
    this.highlightedIndex = -1;
    if (!this.isDropdownOpen) {
      this.isDropdownOpen = true;
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      this.searchInput.nativeElement.focus();
    }
  }

  onKeyDown(event: KeyboardEvent) {
    const totalOptions = this.filteredOptions.length + (this.canAddCustom ? 1 : 0);
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.highlightedIndex = Math.min(this.highlightedIndex + 1, totalOptions - 1);
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        this.highlightedIndex = Math.max(this.highlightedIndex - 1, -1);
        break;
        
      case 'Enter':
        event.preventDefault();
        if (this.highlightedIndex >= 0) {
          if (this.highlightedIndex < this.filteredOptions.length) {
            this.selectOption(this.filteredOptions[this.highlightedIndex]);
          } else if (this.canAddCustom) {
            this.addCustomOption();
          }
        } else if (this.canAddCustom) {
          this.addCustomOption();
        }
        break;
        
      case 'Escape':
        event.preventDefault();
        this.isDropdownOpen = false;
        this.searchInput.nativeElement.blur();
        break;
    }
  }

  selectOption(option: string) {
    this.optionSelected.emit(option);
    this.searchTerm = '';
    this.isDropdownOpen = false;
    this.highlightedIndex = -1;
  }

  addCustomOption() {
    if (this.canAddCustom) {
      const customOption = this.searchTerm.trim();
      this.optionSelected.emit(customOption);
      this.searchTerm = '';
      this.isDropdownOpen = false;
      this.highlightedIndex = -1;
    }
  }

  setHighlightedIndex(index: number) {
    this.highlightedIndex = index;
  }

  private onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.searchable-dropdown')) {
      this.isDropdownOpen = false;
    }
  }
}
