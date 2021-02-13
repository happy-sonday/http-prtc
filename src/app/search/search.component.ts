import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  heroes$: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  /*키 입력 후 http요청이 많아 서버 리소스 낭비와 부하때문에 방지하고자 ngOnInit에 둔다. */
  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      // 입력 단어를 비교하기전에 300ms 기달린다
      debounceTime(100),

      // 이전과 동일한 용어를 입력시 무시
      distinctUntilChanged(),

      // debounce()와 distinctUntilChanged() 거쳐 검색 서비스를 호출하고
      // 이전 검색 옵저버블을 버리고 오직 최신 검색 서비스 옵저버블을 반환
      // 300ms동안 이전에 처리중이던 호출은 정지되는것이 아니다. 그냥 취소
      switchMap((term: string) => this.heroService.searchHeroes(term))
    );
  }
}
