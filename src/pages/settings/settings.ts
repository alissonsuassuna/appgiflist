import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

/*
  Generated class for the Settings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  perPage: number;
  sort: string;
  subreddit: string;

  constructor(public view: ViewController, public navParams: NavParams) {

    this.perPage = this.navParams.get('perPage');
    this.sort = this.navParams.get('sort');
    this.subreddit = this.navParams.get('subreddit');
  }

  save(): void {

    let settings = {
      perPage: this.perPage,
      sort: this.sort,
      subreddit: this.subreddit
    };
    this.view.dismiss(settings);
  }

  close(): void{
    this.view.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

}
/*
A primeira coisa estranha que você pode notar aqui é que estamos usando navParams 
para pegar alguns valores. Nós
Passará esses valores para a página Configurações na página inicial quando 
lançarmos o Modal porque nós
Deseja pré definir os valores na página de configurações para o que eles 
estão atualmente.
Outra coisa estranha sobre esta página é que estamos importando o ViewController 
- precisamos isso em ordem

Para permitir que descartem esta página de dentro de sua própria classe quando é
lançado como um Modal. Neste caso,
Quer fechar a página tanto quando o usuário bate o botão Salvar, e quando o 
usuário bate o botão fechar.
Se o usuário acertar o botão Fechar, não salvaremos as configurações fornecidas.
Vamos estar trabalhando em salvar as configurações na próxima parte desta lição,
mas você pode ser
Perguntando como exatamente isso vai acontecer - não deve salvar a função aqui 
realmente fazer alguma coisa
Com os dados? Com a maneira como os Modals funcionam, podemos retornar dados da
Página que foi lançada como um Modal
Quando ele é demitido, então neste caso, quando chamamos a função de despedir a 
vista, estaremos enviando
Os valores das configurações de volta para a página inicial, que será a página 
que lançou o Modal - aqui é onde
Vamos lidar com salvar os dados.
 */