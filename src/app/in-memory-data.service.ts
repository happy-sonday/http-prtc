import { Injectable } from '@angular/core';
import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';
import { Observable } from 'rxjs';
import { Hero } from './hero';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  constructor() {}
  /*   createDb(reqInfo?: RequestInfo): {} | Observable<{}> | Promise<{}> {
    throw new Error('Method not implemented.');
  } */

  createDb() {
    const heroes = [
      { id: 11, name: '아이언맨' },
      { id: 12, name: '스파이더맨' },
      { id: 13, name: '캡틴아메리카' },
      { id: 14, name: '헐크' },
      { id: 15, name: '타노스' },
      { id: 16, name: '토르' },
      { id: 17, name: '닥터스트레인지' },
      { id: 18, name: '블랙팬서' },
      { id: 19, name: '로키' },
      { id: 20, name: '울버린' },
    ];
    return { heroes };
  }

  /**
   *
   * hearo가 비어있으면 초기값 11
   * 비어있지 않으면 가장 높은 번호를 가진 id에 +1
   * @param {Hero[]} heroes
   * @return {*}  {number}
   * @memberof InMemoryDataService
   */
  genId(heroes: Hero[]): number {
    return heroes.length > 0
      ? Math.max(...heroes.map((hero) => hero.id)) + 1
      : 11;
  }
}
