import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss'],
})
export class HeroesComponent implements OnInit {
  heroesArray: Hero[];

  constructor(private heroService: HeroService) {}

  ngOnInit() {
    this.getHeroes();
  }

  /**
   * 상세보기
   * @memberof HeroesComponent
   */
  getHeroes(): void {
    this.heroService
      .getHeroes()
      .subscribe((initDb) => (this.heroesArray = initDb));
  }

  /**
   * 삭제하기
   * @param {Hero} hero
   * @memberof HeroesComponent
   */
  delete(hero: Hero): void {
    //getHeroes에 의해 heroesArray전역에 저장된 heroesArray와 전달받은 hero와 비교
    //heroesArray의 각 요소를h라 하고 인자이 hero와 같지 않은 것들만 herosArray 배열에 다시 대입
    //이것이 deleteHero() 실행 후 목록을 불러올때 변경된 herosArray로 리스트로 view에 노출된게된다.
    this.heroesArray = this.heroesArray.filter((h) => h !== hero);
    this.heroService.deleteHero(hero).subscribe();
  }
}
