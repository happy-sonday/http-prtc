import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { MessageService } from './message.service';

@Injectable({ providedIn: 'root' })
export class HeroService {
  private heroesUrl = 'api/heroes'; // URL to web api

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  /** 서버로부터 초기 등록된 정보 가져오기 */
  /* 제네릭 타입은 필수이며 any로 설정해도 되지만 컴파일시 발생하는 에러를 줄일 수 있다. */
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap((_) => this.log('heroes 리스트 가져오기 '))
      //catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** messageService 통해 add 메서드를 호출하여 push()
   *  messages 컴포넌트에 데이터 바인딩
   */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  /** 상세정보시 확인시 등록된 ID로 data 읽어오기 */
  /* 
     hero[]와 달리 ID는 unique이기때문에 배열[]을 쓰지 않는다. */
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(() => this.log(`hero 상세보기  id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  /**
   * 수정 메서드
   *
   */
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((_) => this.log(`정보 수정 id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  /**
   * 삭제  메서드
   */
  /** DELETE: delete the hero from the server */
  deleteHero(hero: Hero): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const name = hero.name;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap((_) => this.log(`삭제 ${name} id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  /**
   *
   * 목록 추가하기
   * @param {Hero} hero
   * @return {*}  {Observable<Hero>}
   * @memberof HeroService
   */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`목록 추가 id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  /** 자동완성 검색 서비스 */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap((x) =>
        x.length
          ? this.log(`입력결과 비교중  "${term}"`)
          : this.log(`매칭되는 결과 없음 "${term}"`)
      ),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }
}
