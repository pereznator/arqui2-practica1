import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

enum RequestMethod {
  POST = "POST",
  GET = "GET",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

@Injectable({
  providedIn: 'root',
})
export class AppService {

  private serverUrl: string = "http://localhost:5000";

  constructor(private httpClient: HttpClient) { }

  private request(method: RequestMethod, url: string, body?: any, params?: any): Observable<any> {
    const requestUrl = `${this.serverUrl}${url}`;
    let requestObservable: Observable<any>;
    switch (method) {
      case RequestMethod.GET:
      requestObservable = this.httpClient.get(requestUrl, { params });
      break;
      case RequestMethod.POST:
      requestObservable = this.httpClient.post(requestUrl, body, { params });  
      break;
      case RequestMethod.PUT:
      requestObservable = this.httpClient.put(requestUrl, body, { params });  
      break;
      case RequestMethod.PATCH:
      requestObservable = this.httpClient.patch(requestUrl, body, { params });  
      break;
      case RequestMethod.DELETE:
      requestObservable = this.httpClient.delete(requestUrl, { params });  
      break;
    }
    return requestObservable;
  }

  dashboarEspaciosOcupados(): Observable<any> {
    return this.request(RequestMethod.GET, "/espacionOcupados");
  }

  dashboardPersonasPorVehiculo(): Observable<any> {
    return this.request(RequestMethod.GET, "/personaVehiculo");
  }
  dashboardVehiculosPorRol(): Observable<any> {
    return this.request(RequestMethod.GET, "/vehiculoRol");
  }

  dashboardEntradas(): Observable<any> {
    return this.request(RequestMethod.GET, "/ingresosDia");
  }
  
  dashboardSalidas(): Observable<any> {
    return this.request(RequestMethod.GET, "/egresosDia");
  }

  historialDeIngresosYEgresos(params: any): Observable<any> {
    return this.request(RequestMethod.GET, "/historial_ingresosEgresos", {}, params);
  }
  
  historialDeVehiculosPorRol(params: any): Observable<any> {
    return this.request(RequestMethod.GET, "/historial_VehiducloRol", {}, params);
  }

  historialDePersonasPorDia(params: any): Observable<any> {
    return this.request(RequestMethod.GET, "/historial_Personas", {}, params);
  }

}
