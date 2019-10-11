import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  constructor() { }

  logObject(dto: any) {
    console.log(JSON.stringify(dto));
  }

  log(message: string) {
    console.log(message);
  }
}
