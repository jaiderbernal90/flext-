import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiBaseService {
  protected apiUrl = environment.apiUrl;
  protected http = inject(HttpClient);

  /**
   * Método genérico para obtener datos
   * @param endpoint Endpoint de la API
   * @param params Parámetros de la petición
   * @returns Promise con los datos
   */
  protected async get<T>(endpoint: string, params?: any): Promise<T> {
    try {
      let httpParams = new HttpParams();
      if (params) {
        Object.keys(params).forEach((key) => {
          if (params[key] !== null && params[key] !== undefined) {
            httpParams = httpParams.set(key, params[key].toString());
          }
        });
      }

      const observable: Observable<T> = this.http.get<T>(
        `${this.apiUrl}/${endpoint}`,
        { params: httpParams }
      );
      return await lastValueFrom(observable);
    } catch (error) {
      this.handleError(error as HttpErrorResponse);
      throw error;
    }
  }

  /**
   * Método genérico para crear datos
   * @param endpoint Endpoint de la API
   * @param data Datos a enviar
   * @returns Promise con la respuesta
   */
  protected async post<T>(endpoint: string, data: any): Promise<T> {
    try {
      const observable: Observable<T> = this.http.post<T>(
        `${this.apiUrl}/${endpoint}`,
        data
      );
      return await lastValueFrom(observable);
    } catch (error) {
      this.handleError(error as HttpErrorResponse);
      throw error;
    }
  }

  /**
   * Método genérico para actualizar datos
   * @param endpoint Endpoint de la API
   * @param id ID del recurso
   * @param data Datos a actualizar
   * @returns Promise con la respuesta
   */
  protected async put<T>(
    endpoint: string,
    id: number | string,
    data: any
  ): Promise<T> {
    try {
      const observable: Observable<T> = this.http.put<T>(
        `${this.apiUrl}/${endpoint}/${id}`,
        data
      );
      return await lastValueFrom(observable);
    } catch (error) {
      this.handleError(error as HttpErrorResponse);
      throw error;
    }
  }

  /**
   * Método genérico para actualizar parcialmente datos
   * @param endpoint Endpoint de la API
   * @param id ID del recurso
   * @param data Datos a actualizar
   * @returns Promise con la respuesta
   */
  protected async patch<T>(
    endpoint: string,
    id: number | string,
    data: any
  ): Promise<T> {
    try {
      const observable: Observable<T> = this.http.patch<T>(
        `${this.apiUrl}/${endpoint}/${id}`,
        data
      );
      return await lastValueFrom(observable);
    } catch (error) {
      this.handleError(error as HttpErrorResponse);
      throw error;
    }
  }

  /**
   * Método genérico para eliminar datos
   * @param endpoint Endpoint de la API
   * @param id ID del recurso
   * @returns Promise con la respuesta
   */
  protected async delete<T>(endpoint: string, id: number | string): Promise<T> {
    try {
      const observable: Observable<T> = this.http.delete<T>(
        `${this.apiUrl}/${endpoint}/${id}`
      );
      return await lastValueFrom(observable);
    } catch (error) {
      this.handleError(error as HttpErrorResponse);
      throw error;
    }
  }

  /**
   * Manejador de errores genérico
   * @param error Error HTTP
   */
  private handleError(error: HttpErrorResponse): void {
    // console.error('API Error:', error);
    // if (error.status === 401) {
    //   console.warn('Session expired or unauthorized');
    // }
  }
}
