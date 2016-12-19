import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the Reddit provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Reddit {

  settings: any;
  loading: boolean = false;
  posts: any = [];
  subreddit: string = 'gifs';
  page: number = 1;
  perPage: number = 15;
  after: string;
  stopIndex: number;
  sort: string = 'hot'
  moreCount: number = 0;

  constructor(public http: Http) {
  }

  fetchData(): void{

  }
}
/*
Este é o esqueleto básico para o seu provedor, ele define um monte de variáveis ​​de 
membro e um fetchData função
Que irá lidar com a captura dos dados de reddit. O que as variáveis ​​membro 
podem não ser imediatamente
Óbvio, então vamos passar por eles (em ordem):
    • As definições fornecidas pelo utilizador
    • Se os novos GIFs estão sendo buscados
    • As entradas para todos os GIFs atualmente carregados
    • O subreddit atual
    • A página atual (ou seja, quantas vezes o usuário clicou em "Carregar mais")
    • A quantidade de GIFs a serem exibidos por página
    • Uma referência ao último post recuperado do Reddit (por isso sabemos por onde começar para a próxima página)
    • Isso será usado para armazenar uma referência ao comprimento do conjunto de posts
    • A ordem de classificação para GIFs
    • O aplicativo continuará tentando carregar mais postagens do reddit até que ele tenha o suficiente para uma página cheia de GIFs,
MoreCount é usado para informá-lo quando ele deve parar de tentar carregar mais 
(ou seja, se não forem encontrados GIFs suficientes
Depois de bater a API 20 vezes)
 */