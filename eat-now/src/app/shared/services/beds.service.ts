import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Bed {
  id: string;
  bedNumber: string;
  roomNumber: string;
  floor: string;
  roomType: string;
  rent: number;
  amenities: string[];
  status: 'Available' | 'Occupied' | 'Maintenance';
}

@Injectable({
  providedIn: 'root'
})
export class BedsService {
  private bedsSubject = new BehaviorSubject<Bed[]>([]);
  public beds$: Observable<Bed[]> = this.bedsSubject.asObservable();

  constructor() {}

  addBedsForRoom(
    roomNumber: string,
    floor: string,
    roomType: string,
    bedCount: number,
    rent: number,
    amenities: string[]
  ): void {
    const currentBeds = this.bedsSubject.value;
    const newBeds: Bed[] = [];

    for (let i = 1; i <= bedCount; i++) {
      const bedId = `${floor}${roomNumber}-${i}`;
      
      const existingBed = currentBeds.find(b => b.id === bedId);
      if (!existingBed) {
        newBeds.push({
          id: bedId,
          bedNumber: i.toString(),
          roomNumber: roomNumber,
          floor: floor,
          roomType: roomType,
          rent: rent,
          amenities: [...amenities],
          status: 'Available'
        });
      }
    }

    if (newBeds.length > 0) {
      this.bedsSubject.next([...currentBeds, ...newBeds]);
    }
  }

  updateBed(updatedBed: Bed): void {
    const currentBeds = this.bedsSubject.value;
    const index = currentBeds.findIndex(b => b.id === updatedBed.id);
    
    if (index !== -1) {
      currentBeds[index] = { ...updatedBed };
      this.bedsSubject.next([...currentBeds]);
    }
  }

  deleteBed(bedId: string): void {
    const currentBeds = this.bedsSubject.value;
    const filtered = currentBeds.filter(b => b.id !== bedId);
    this.bedsSubject.next(filtered);
  }

  getAllBeds(): Bed[] {
    return this.bedsSubject.value;
  }
}
