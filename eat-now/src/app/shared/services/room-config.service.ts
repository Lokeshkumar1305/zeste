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
  constructor() {
    const savedRoomTypes = localStorage.getItem('roomTypes');
    const savedFloors = localStorage.getItem('floors');

    if (savedRoomTypes) {
      const parsed = JSON.parse(savedRoomTypes);
      // Validate parsed data to ensure it matches RoomType[]
      if (Array.isArray(parsed) && parsed.every((t: any) => typeof t.name === 'string' && typeof t.beds === 'number')) {
        this.roomTypesSubject.next(parsed);
      }
    }

    if (savedFloors) {
      const parsed = JSON.parse(savedFloors);
      // Validate parsed data to ensure it's string[]
      if (Array.isArray(parsed) && parsed.every((f: any) => typeof f === 'string')) {
        this.floorsSubject.next(parsed);
      }
    }
  }

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

  public roomTypes$: Observable<RoomType[]> = this.roomTypesSubject.asObservable();
  public floors$: Observable<string[]> = this.floorsSubject.asObservable();

  getRoomTypes(): RoomType[] {
    return this.roomTypesSubject.value;
  }

  getFloors(): string[] {
    return this.floorsSubject.value;
  }

  setRoomTypes(types: RoomType[]): void {
    this.roomTypesSubject.next(types);
    localStorage.setItem('roomTypes', JSON.stringify(types));
  }

  setFloors(floors: string[]): void {
    this.floorsSubject.next(floors);
    localStorage.setItem('floors', JSON.stringify(floors));
  }

  getBedCountForRoomType(roomTypeName: string): number {
    const type = this.roomTypesSubject.value.find(t => t.name === roomTypeName);
    return type?.beds ?? 0;
  }

  addRoomType(roomType: RoomType): void {
    const currentTypes = this.roomTypesSubject.value;
    const exists = currentTypes.some(t => t.name === roomType.name);
    if (!exists) {
      const updatedTypes = [...currentTypes, roomType];
      this.roomTypesSubject.next(updatedTypes);
      localStorage.setItem('roomTypes', JSON.stringify(updatedTypes));
    }
  }

  addFloor(floor: string): void {
    const currentFloors = this.floorsSubject.value;
    if (!currentFloors.includes(floor)) {
      const updatedFloors = [...currentFloors, floor];
      this.floorsSubject.next(updatedFloors);
      localStorage.setItem('floors', JSON.stringify(updatedFloors));
    }
  }

  // Uncomment and update if you need to remove room types (ensure beds remains number)
  // removeRoomType(roomTypeName: string): void {
  //   const updatedTypes = this.roomTypesSubject.value.filter(t => t.name !== roomTypeName);
  //   this.roomTypesSubject.next(updatedTypes);
  //   localStorage.setItem('roomTypes', JSON.stringify(updatedTypes));
  // }

  removeFloor(floor: string): void {
    const updatedFloors = this.floorsSubject.value.filter(f => f !== floor);
    this.floorsSubject.next(updatedFloors);
    localStorage.setItem('floors', JSON.stringify(updatedFloors));
  }
}