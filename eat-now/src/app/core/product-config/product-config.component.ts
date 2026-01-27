import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoomConfigService, RoomType } from '../../shared/services/room-config.service';
import { ActivatedRoute } from '@angular/router';

interface ConfigItem {
    id: string;
    name: string;
    description?: string;
    extra?: any;
}

@Component({
    selector: 'app-product-config',
    templateUrl: './product-config.component.html',
    styleUrls: ['./product-config.component.scss']
})
export class ProductConfigComponent implements OnInit {
    activeSection: string = 'rooms';
    selectedSubItem: string | null = null;

    quickAddForm: FormGroup;
    isEditMode: boolean = false;
    editingId: string | null = null;

    // Pagination
    public pageSizeOptions: number[] = [5, 10, 25];
    public pageSize = 5;
    public currentPage = 1;

    masterData: { [key: string]: ConfigItem[] } = {
        'floors-management': [],
        'room-type-management': [],
        'beds-management': [],
        'amenities-management': [],
        'maintenance-category': [],
        'expenses-category': []
    };

    public pagedData: ConfigItem[] = [];

    sections = [
        {
            id: 'rooms',
            title: 'Room Configuration',
            icon: 'bi-door-open',
            description: 'Manage floors, room types, beds, and standard amenities.',
            items: [
                { id: 'floors-management', label: 'Floors', icon: 'bi-layers' },
                { id: 'room-type-management', label: 'Room Types', icon: 'bi-house-gear' },
                { id: 'beds-management', label: 'Beds', icon: 'bi-bed' },
                { id: 'amenities-management', label: 'Amenities', icon: 'bi-stars' }
            ]
        },
        {
            id: 'maintenance',
            title: 'Maintenance',
            icon: 'bi-tools',
            description: 'Define categories for maintenance tasks and service requests.',
            items: [
                { id: 'maintenance-category', label: 'Categories', icon: 'bi-tags' }
            ]
        },
        {
            id: 'expenses',
            title: 'Expenses',
            icon: 'bi-wallet2',
            description: 'Configure expense categories for better financial tracking.',
            items: [
                { id: 'expenses-category', label: 'Categories', icon: 'bi-receipt' }
            ]
        }
    ];

    constructor(
        private fb: FormBuilder,
        private roomService: RoomConfigService,
        private route: ActivatedRoute
    ) {
        this.quickAddForm = this.fb.group({
            name: ['', Validators.required],
            description: [''],
            extra: ['']
        });
    }

    ngOnInit(): void {
        this.loadAllData();
        this.checkQueryParams();
    }

    checkQueryParams() {
        this.route.queryParams.subscribe(params => {
            if (params['section']) {
                this.activeSection = params['section'];
            }
            if (params['item']) {
                this.selectedSubItem = params['item'];
                this.updatePagedData();
            }
        });
    }

    loadAllData() {
        this.masterData['floors-management'] = this.loadDetailed('floors_detailed');
        this.masterData['room-type-management'] = this.loadDetailed('roomTypes_detailed');
        this.masterData['beds-management'] = this.loadDetailed('bedsMaster');
        this.masterData['amenities-management'] = this.loadDetailed('amenities_detailed_info');
        this.masterData['maintenance-category'] = this.loadDetailed('maintenanceCategories');
        this.masterData['expenses-category'] = this.loadDetailed('expenseCategories');

        // Fallback/Sync for Rooms from Service
        if (this.masterData['floors-management'].length === 0) {
            const floors = this.roomService.getFloors();
            this.masterData['floors-management'] = floors.map((f, i) => ({ id: 'F' + i, name: f }));
        }
        if (this.masterData['room-type-management'].length === 0) {
            const types = this.roomService.getRoomTypes();
            this.masterData['room-type-management'] = types.map((t, i) => ({ id: 'RT' + i, name: t.name, extra: t.beds }));
        }
        if (this.masterData['amenities-management'].length === 0) {
            const amenities = this.roomService.getAmenities();
            this.masterData['amenities-management'] = amenities.map((a, i) => ({ id: 'AM' + i, name: a }));
        }
    }

    private loadDetailed(key: string): ConfigItem[] {
        const data = localStorage.getItem(key);
        if (!data) return [];
        try {
            return JSON.parse(data);
        } catch (e) {
            return [];
        }
    }

    setActiveSection(sectionId: string) {
        this.activeSection = sectionId;
        this.selectedSubItem = null;
        this.resetForm();
    }

    selectSubItem(itemId: string) {
        this.selectedSubItem = itemId;
        this.currentPage = 1;
        this.resetForm();
        this.updatePagedData();
    }

    backToMain() {
        this.selectedSubItem = null;
        this.resetForm();
    }

    resetForm() {
        this.quickAddForm.reset();
        this.isEditMode = false;
        this.editingId = null;
        this.quickAddForm.patchValue({ extra: '' });
    }

    onEdit(item: ConfigItem) {
        this.isEditMode = true;
        this.editingId = item.id;
        this.quickAddForm.patchValue({
            name: item.name,
            description: item.description,
            extra: item.extra
        });
    }

    onDelete(item: ConfigItem) {
        if (confirm(`Are you sure you want to delete ${item.name}?`)) {
            if (this.selectedSubItem) {
                this.masterData[this.selectedSubItem] = this.masterData[this.selectedSubItem].filter(i => i.id !== item.id);
                this.saveData();
                this.updatePagedData();
            }
        }
    }

    onSave() {
        if (this.quickAddForm.valid && this.selectedSubItem) {
            const formVal = this.quickAddForm.value;

            if (this.isEditMode && this.editingId) {
                const index = this.masterData[this.selectedSubItem].findIndex(i => i.id === this.editingId);
                if (index !== -1) {
                    this.masterData[this.selectedSubItem][index] = {
                        ...this.masterData[this.selectedSubItem][index],
                        name: formVal.name,
                        description: formVal.description,
                        extra: formVal.extra
                    };
                }
            } else {
                const newItem: ConfigItem = {
                    id: 'ITEM_' + Date.now(),
                    name: formVal.name,
                    description: formVal.description,
                    extra: formVal.extra
                };
                this.masterData[this.selectedSubItem].push(newItem);
            }

            this.saveData();
            this.updatePagedData();
            this.resetForm();
        }
    }

    saveData() {
        if (!this.selectedSubItem) return;

        const data = this.masterData[this.selectedSubItem];
        let detailedKey = '';

        switch (this.selectedSubItem) {
            case 'floors-management':
                detailedKey = 'floors_detailed';
                this.roomService.setFloors(data.map(i => i.name));
                break;
            case 'room-type-management':
                detailedKey = 'roomTypes_detailed';
                const rt: RoomType[] = data.map(i => ({ name: i.name, beds: Number(i.extra) || 0 }));
                this.roomService.setRoomTypes(rt);
                break;
            case 'amenities-management':
                detailedKey = 'amenities_detailed_info';
                this.roomService.setAmenities(data.map(i => i.name));
                break;
            case 'beds-management': detailedKey = 'bedsMaster'; break;
            case 'maintenance-category': detailedKey = 'maintenanceCategories'; break;
            case 'expenses-category': detailedKey = 'expenseCategories'; break;
        }

        if (detailedKey) {
            localStorage.setItem(detailedKey, JSON.stringify(data));
        }
    }

    /* ------------------- Pagination Logic ------------------- */
    get totalItems(): number {
        return this.selectedSubItem ? this.masterData[this.selectedSubItem].length : 0;
    }

    get totalPages(): number {
        return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
    }

    get showingFrom(): number {
        return this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
    }

    get showingTo(): number {
        return Math.min(this.currentPage * this.pageSize, this.totalItems);
    }

    get pageNumbers(): number[] {
        return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    onPageSizeChange(size: number): void {
        this.pageSize = +size;
        this.currentPage = 1;
        this.updatePagedData();
    }

    goToPage(page: number): void {
        if (page < 1 || page > this.totalPages) return;
        this.currentPage = page;
        this.updatePagedData();
    }

    prevPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updatePagedData();
        }
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.updatePagedData();
        }
    }

    updatePagedData(): void {
        if (!this.selectedSubItem) {
            this.pagedData = [];
            return;
        }
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        this.pagedData = this.masterData[this.selectedSubItem].slice(start, end);
    }

    get currentSubItemLabel() {
        if (!this.selectedSubItem) return '';
        for (const section of this.sections) {
            const item = section.items.find(i => i.id === this.selectedSubItem);
            if (item) return item.label;
        }
        return '';
    }
}
