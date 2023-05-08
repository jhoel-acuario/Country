import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, map, delay, tap } from 'rxjs';

import { Country } from '../interfaces/country';
import { CacheStore } from '../interfaces/cache-store.interface';
import { Region } from '../interfaces/region.type';

@Injectable({ providedIn: 'root' })
export class CountriesService {
  private apiUrl: string = 'https://restcountries.com/v3.1';
  public  cacheStore: CacheStore ={
    byCapital:{term:'', countries:[]},
    byCountries:{term:'', countries:[]},
    byRegion:{region:'', countries:[]}
  }

  constructor(private http: HttpClient) {
    console.log('hola estoy en constrtuctor del servicio');
    this.loadToLocalstorage()
  }
  private saveToLocalstorage(){
    localStorage.setItem('cacheStore', JSON.stringify(this.cacheStore))
  }
  private loadToLocalstorage(){
    if (!localStorage.getItem('cacheStore')) return
    this.cacheStore=JSON.parse(localStorage.getItem('cacheStore')!)
  }


  private getCountryRequest(url: string): Observable<Country[]> {
    return this.http.get<Country[]>(url)
    .pipe(catchError(() => of([])),
    //delay(2000)
    );
  }

  searchCountryByAlphaCode(code: string): Observable<Country | null> {
    const url = `${this.apiUrl}/alpha/${code}`;

    return this.http.get<Country[]>(url).pipe(
      map((countries) => (countries.length > 0 ? countries[0] : null)),
      catchError(() => of(null))
    );
  }

  searchCapital(term: string): Observable<Country[]> {
    const url = `${this.apiUrl}/capital/${term}`;
    return this.getCountryRequest(url)
          .pipe(
            tap(countries=>this.cacheStore.byCapital={term, countries}),
            tap(()=>this.saveToLocalstorage()),
          )
  }

  searchCountry(term: string): Observable<Country[]> {
    const url = `${this.apiUrl}/name/${term}`;
    return this.getCountryRequest(url)
            .pipe(
              tap(countries=>this.cacheStore.byCountries={ term, countries}),
              tap(()=>this.saveToLocalstorage()),
            );
  }

  searchRegion(region: Region): Observable<Country[]> {
    const url = `${this.apiUrl}/region/${region}`;
    return this.getCountryRequest(url)
            .pipe(
              tap(countries=>this.cacheStore.byRegion={region, countries}),
              tap(()=>this.saveToLocalstorage()),
            );
  }
}
