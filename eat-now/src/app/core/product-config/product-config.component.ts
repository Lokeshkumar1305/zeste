import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoomConfigService } from '../../shared/services/room-config.service';

@Component({
    selector: 'app-product-config',
    templateUrl: './product-config.component.html',
    styleUrls: ['./product-config.component.scss']
})
export class ProductConfigComponent implements OnInit {
    activeSection: string = 'rooms';
    quickAddForm: FormGroup;

    sections = [
        {
            id: 'rooms',
            title: 'Room Configuration',
            icon: 'bi-door-open',
            description: 'Manage floors, room types, beds, and standard amenities.',
            items: [
                { label: 'Floors', route: 'floors-management', icon: 'bi-layers' },
                { label: 'Room Types', route: 'room-type-management', icon: 'bi-house-gear' },
                { label: 'Beds', route: 'beds-management', icon: 'bi-bed' },
                { label: 'Amenities', route: 'amenities-management', icon: 'bi-stars' }
            ]
        },
        {
            id: 'maintenance',
            title: 'Maintenance',
            icon: 'bi-tools',
            description: 'Define categories for maintenance tasks and service requests.',
            items: [
                { label: 'Categories', route: 'maintenance-category', icon: 'bi-tags' }
            ]
        },
        {
            id: 'expenses',
            title: 'Expenses',
            icon: 'bi-wallet2',
            description: 'Configure expense categories for better financial tracking.',
            items: [
                { label: 'Categories', route: 'expenses-category', icon: 'bi-receipt' }
            ]
        }
    ];

    constructor(
        private fb: FormBuilder,
        private roomService: RoomConfigService
    ) {
        this.quickAddForm = this.fb.group({
            name: ['', Validators.required],
            description: [''],
            assignedFloor: ['']
        });
    }

    ngOnInit(): void {
    }

    setActiveSection(sectionId: string) {
        this.activeSection = sectionId;
        this.quickAddForm.reset();
    }

    onSave() {
        if (this.quickAddForm.valid) {
            const formData = this.quickAddForm.value;
            console.log('Saving config:', this.activeSection, formData);
            // Integration with specific services would go here
            // e.g. this.roomService.addRoomType({ name: formData.name, beds: 1 });
            this.quickAddForm.reset();
            // Add a success hint or notification
        }
    }
}
