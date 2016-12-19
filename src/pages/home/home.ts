import { Component } from '@angular/core';

import { ModalController, Platform } from 'ionic-angular';
import { Keyboard } from 'ionic-native';
import { SettingsPage } from '../settings/settings';
import { Data } from '../../providers/data';
import { Reddit } from '../../providers/reddit';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  subredditValue: string;
  subredditControl: FormControl;

  constructor(public dataService: Data, public redditService: Reddit, public modalCtrl: ModalController, public platform: Platform) {
    
    this.subredditControl = new FormControl();
  }

  ionViewDidLoad(){

    this.subredditControl.valueChanges.debounceTime(1500).distinctUntilChanged().subscribe(subreddit => {

      if(subreddit != '' && subreddit){
        this.redditService.subreddit = subreddit;
        this.changeSubreddit();
        Keyboard.close();
      }
    });

    this.platform.ready().then(() => {
      this.loadSettings();
    })
  
  }
  loadSettings(): void{
    console.log("");
  }
  openSettings(): void{
    console.log("sdd");
  }
  playVideo(e, post): void{
    console.log("aaa");
  }
  changeSubreddit(): void{
    console.log("aaaa");
  }
  loadMore(): void{
    console.log("aaa");
  }
}

/*
Há obviamente ainda um pouco de código que precisa ser adicionado a esta classe, mas mesmo a configuração básica de
A classe que acabamos de adicionar é bastante complicada. Então vamos começar a falar através dele.
Primeiro são nossas declarações de importação:

Há um monte de importações aqui porque estamos configurando tudo o que usaremos mais tarde, mas isso ainda é
Provavelmente mais algumas importações do que você provavelmente usará na maioria de suas classes.
O primeiro é bastante básico, ModalController nos permite criar uma página modal que pode ser exibida no topo
Da página atual ea Plataforma nos permitirá executar as operações após o carregamento do dispositivo ter terminado.
Depois disso, importamos o plug-in do Teclado (que vamos usar brevemente).
Também importamos o SettingsPage que geramos anteriormente (mas ainda estamos para concluir), nosso provedor de dados que
Também geramos anteriormente, mas não concluímos, e nosso provedor Reddit inacabado. O FormControl
Nos permitirá criar um "FormControl" para entradas (o que nos dará acesso ao nosso Observável). Todos os
Rxjs importações são da biblioteca RxJS - um pouco irritante, você tem que importar qualquer operador que você deseja
Para usar com um observável, por isso estamos fazendo isso aqui. Nós estaremos fazendo uso destes em breve, então eu vou salvar
A discussão em torno dessas importações até então.
Na próxima seção de código temos a nossa função de construtor e gancho ionViewDidLoad. O con-
Estruturador é uma parte importante da classe porque é o primeiro bit de código que será executado quando o
É criado. Permite-nos injetar e configurar referências a quaisquer componentes ou serviços que
E é também um bom local para fazer qualquer chamada de função que você precisa para executar imediatamente. Tenha em mente
Que é geralmente considerado como a melhor prática para evitar fazer muito "trabalho" no construtor, para que você
Pode preferir colocar código que você precisa para executar imediatamente dentro do ionViewDidLoad ()
Gancho de ciclo de vida (isso também será executado quando a página for carregada pela primeira vez).

Função ionViewDidLoad

Primeiro, criamos um novo FormControl e, em seguida, inscrevemos-nos no valueChanges Observable que fornece.
Se você leu a seção sobre Observáveis ​​na seção básica deste livro, então a maior parte
Muito estranho. Subscrevemos o observável para que cada vez que emite um valor executamos algum código. o
Coisas estranhas aqui, porém, é o valueChanges.debounceTime (1500) .distinctUntilChanged ().
Basicamente, podemos encadear como muitos desses operadores como queremos (porque cada função que chamamos
Também retornará um observável, então ainda podemos assinar o resultado) e todos eles fazem coisas diferentes. Para
Exemplo, se apenas fizemos isso:
This.subredditControl.valueChanges.subscribe
Em seguida, executaríamos o código fornecido acima toda vez que o valor da entrada subredditControl
alterar. Se mudá-lo para isso:
This.subredditControl.valueChanges.debounceTime (1500) .subscribe
Nós só iria executar o código quando a entrada foi alterada, e quando não houve outra mudança
Dentro de 1,5 segundos. Isso impede que enviemos muitas solicitações inúteis para a API. Se o usuário
Estava digitando 'chemicalreactiongifs', por exemplo, o código seria acionado para 'c', depois 'ch', então 'che',
Então, 'chem' e assim por diante até que a seqüência completa tenha sido digitado. Não só isso vai enviar um monte de inútil
Consultas para a API, vai ser uma experiência ruim para o usuário, bem como a lista está constantemente piscando
E mudando como eles tipo. Ao adicionar debouncing, o código só será executado uma vez que a seqüência completa tenha sido
(Supondo que o usuário não demora mais de 1,5 segundo entre a digitação de cada letra).
Finalmente, podemos adicionar um operador final:
This.subredditControl.valueChanges.debounceTime (1500)
.distinctUntilChanged (). Subscrever
Isso só executará o código se o valor for diferente da última vez que ele foi executado. Então, se um usuário digitar 'gifs',
Backspace chave para torná-lo 'gif', mas, em seguida, retyped o 's' para torná-lo 'gifs' novamente nada iria acontecer. Nós
Não é necessário recarregar os dados para 'gifs' porque já estamos lá.
O resultado final é que o código só será acionado quando o valor for alterado, o usuário não está digitando atualmente
Eo valor de entrada é diferente do que era a última vez. O código que estamos acionando simplesmente verifica
Se um valor não vazio foi fornecido e, em seguida, altera o subreddit ativo alterando o subreddit
Membro variável no provedor Reddit e chamar a função changeSubreddit (). Também chamamos de
Close () no plug-in de teclado; Uma vez que estamos indo contra o comportamento padrão de
Um campo de entrada (que normalmente seria submetido) o teclado não sabe quando fechar, então nós acionamos
Manualmente após a operação ter terminado.
Esta será provavelmente uma das partes mais confusas deste aplicativo, especialmente se você estiver completamente
Novo para Observables. Como você pode dizer isso nos permitiu criar algumas funcionalidades muito úteis realmente
Facilmente, mas nós poderíamos ter tão facilmente usado o normal ngModel abordagem e apenas usado um botão para
Desencadeando pesquisas em vez disso.


 */
