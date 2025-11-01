import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomConfigService {
  private roomTypesSubject = new BehaviorSubject<string[]>([]);
  private floorsSubject = new BehaviorSubject<string[]>([]);

  roomTypes$: Observable<string[]> = this.roomTypesSubject.asObservable();
  floors$: Observable<string[]> = this.floorsSubject.asObservable();

  constructor() {
    const savedRoomTypes = localStorage.getItem('roomTypes');
    const savedFloors = localStorage.getItem('floors');

    if (savedRoomTypes) {
      this.roomTypesSubject.next(JSON.parse(savedRoomTypes));
    }

    if (savedFloors) {
      this.floorsSubject.next(JSON.parse(savedFloors));
    }
  }

  getRoomTypes(): string[] {
    return this.roomTypesSubject.value;
  }

  getFloors(): string[] {
    return this.floorsSubject.value;
  }

  addRoomType(roomType: string): void {
    const currentTypes = this.roomTypesSubject.value;
    if (!currentTypes.includes(roomType)) {
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

  removeRoomType(roomType: string): void {
    const updatedTypes = this.roomTypesSubject.value.filter(t => t !== roomType);
    this.roomTypesSubject.next(updatedTypes);
    localStorage.setItem('roomTypes', JSON.stringify(updatedTypes));
  }

  removeFloor(floor: string): void {
    const updatedFloors = this.floorsSubject.value.filter(f => f !== floor);
    this.floorsSubject.next(updatedFloors);
    localStorage.setItem('floors', JSON.stringify(updatedFloors));
  }
}
