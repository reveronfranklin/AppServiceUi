import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from './general.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CobTipoTransaccionService {

  basePath: string;
  accionPath: string;
  controller: string;
  constructor(private http: HttpClient, private gensvc: GeneralService) {
    this.basePath = gensvc.basePath;
  }

  ListCobTipoTransaccion(data): Observable<any> {
    this.controller = 'CobTipoTransaccion/';
    this.accionPath = "GetListCobTipoTransaccion";

    return this.http.post<any>(this.basePath + this.controller + this.accionPath, JSON.stringify(data)).pipe(
    );
  }
}
