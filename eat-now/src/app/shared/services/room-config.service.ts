import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface RoomType {
  name: string;
  beds: number;
}

@Injectable({
  providedIn: 'root'
})
export class RoomConfigService {
  private roomTypesSubject = new BehaviorSubject<RoomType[]>([
    { name: 'Single', beds: 1 },
    { name: '2 Share', beds: 2 },
    { name: '3 Share', beds: 3 },
    { name: '4 Share', beds: 4 }
  ]);

  private floorsSubject = new BehaviorSubject<string[]>([
    'Floor 1',
    'Floor 2',
    'Floor 3'
  ]);

  private amenitiesSubject = new BehaviorSubject<string[]>([
    'WiFi', 'AC', 'TV', 'Mini Fridge', 'Common Kitchen', 'Laundry'
  ]);

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const savedRoomTypes = localStorage.getItem('roomTypes');
    const savedFloors = localStorage.getItem('floors');
    const savedAmenities = localStorage.getItem('amenities_master_list');

    if (savedRoomTypes) {
      try {
        const parsed = JSON.parse(savedRoomTypes);
        if (Array.isArray(parsed)) this.roomTypesSubject.next(parsed);
      } catch (e) { }
    }

    if (savedFloors) {
      try {
        const parsed = JSON.parse(savedFloors);
        if (Array.isArray(parsed)) this.floorsSubject.next(parsed);
      } catch (e) { }
    }

    if (savedAmenities) {
      try {
        const parsed = JSON.parse(savedAmenities);
        if (Array.isArray(parsed)) this.amenitiesSubject.next(parsed);
      } catch (e) { }
    }
  }

  public roomTypes$: Observable<RoomType[]> = this.roomTypesSubject.asObservable();
  public floors$: Observable<string[]> = this.floorsSubject.asObservable();
  public amenities$: Observable<string[]> = this.amenitiesSubject.asObservable();

  getRoomTypes(): RoomType[] { return this.roomTypesSubject.value; }
  getFloors(): string[] { return this.floorsSubject.value; }
  getAmenities(): string[] { return this.amenitiesSubject.value; }

  setRoomTypes(types: RoomType[]): void {
    this.roomTypesSubject.next(types);
    localStorage.setItem('roomTypes', JSON.stringify(types));
  }

  setFloors(floors: string[]): void {
    this.floorsSubject.next(floors);
    localStorage.setItem('floors', JSON.stringify(floors));
  }

  setAmenities(amenities: string[]): void {
    this.amenitiesSubject.next(amenities);
    localStorage.setItem('amenities_master_list', JSON.stringify(amenities));
  }

  getBedCountForRoomType(roomTypeName: string): number {
    const type = this.roomTypesSubject.value.find(t => t.name === roomTypeName);
    return type?.beds ?? 0;
  }

  addRoomType(roomType: RoomType): void {
    const current = this.roomTypesSubject.value;
    if (!current.some(t => t.name === roomType.name)) {
      this.setRoomTypes([...current, roomType]);
    }
  }

  addFloor(floor: string): void {
    const current = this.floorsSubject.value;
    if (!current.includes(floor)) {
      this.setFloors([...current, floor]);
    }
  }

  addAmenity(amenity: string): void {
    const current = this.amenitiesSubject.value;
    if (!current.includes(amenity)) {
      this.setAmenities([...current, amenity]);
    }
  }
}