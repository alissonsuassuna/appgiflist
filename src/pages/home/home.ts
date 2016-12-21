import { Component } from '@angular/core';

import { ModalController, Platform } from 'ionic-angular';
import { Keyboard } from 'ionic-native';
import { SettingsPage } from '../settings/settings';
import { Data } from '../../providers/data';
import { Reddit } from '../../providers/reddit';
import { FormControl } from '@angular/forms';
import { InAppBrowser } from 'ionic-native';
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
    this.redditService.fetchData();
  }
  openSettings(): void{
    
    let settingsModal = this.modalCtrl.create(SettingsPage, {
      perPage: this.redditService.perPage,
      sort: this.redditService.sort,
      subreddit: this.redditService.subreddit
    });

    settingsModal.onDidDismiss(settings => {

      if(settings){
        this.redditService.perPage = settings.perPage;
        this.redditService.sort = settings.sort;
        this.redditService.subreddit = settings.subreddit;

        //this.dataService.save(settings);
        this.changeSubreddit();
      }
    });

    settingsModal.present();
  }
  playVideo(e, post): void{
    
    //Criar uma referências para vídeo
    let video = e.target;

    if(!post.alreadyLoaded){
      post.showLoader = true;
    }

    //Alternar a reprodução de vídeo
    if(video.paused){

      //Mostra o loader gif
      video.play();

      //Uma vez que o vídeo começa a ser reproduzido, remova o carregador gif
      video.addEventListener("playing", function(e){
        post.showLoader = false;
        post.alreadyLoader = true;
      });
    }else{
      video.pause();
    }
  }
  changeSubreddit(): void{
    this.redditService.resetPosts();
  }
  loadMore(): void{
    this.redditService.nextPage();
  }
  showComments(post): void{
    let browser = new InAppBrowser('http://reddit.com' + post.data.permalink, '_system');
  }
}

/*
Comentarios sobre o código a título de estudos e pesquisas futuras ..
=================================================================================

Há um monte de importações aqui porque estamos configurando tudo o que 
usaremos mais tarde.

O primeiro é bastante básico, ModalController nos permite criar uma 
página modal que pode ser exibida no topo
Da página atual e a Plataforma nos permitirá executar as operações 
após o carregamento do dispositivo ter terminado.
Depois disso, importamos o plug-in do Teclado (que vamos usar brevemente).

Também importamos o SettingsPage que geramos anteriormente (mas ainda estamos para 
concluir), nosso provedor de dados que
Também geramos anteriormente, mas não concluímos, e nosso provedor Reddit 
inacabado. 

O FormControl Nos permitirá criar um "FormControl" para entradas 
(o que nos dará acesso ao nosso Observável). 

Todos os Rxjs importações são da biblioteca RxJS - um pouco irritante, 
você tem que importar qualquer operador que você deseja Para usar com um 
observável, por isso estamos fazendo isso aqui. 

A estrutura é uma parte importante da classe porque é a primeira parte 
do código que será executado quando o É criado. 

Permite-nos injetar e configurar referências a quaisquer componentes ou serviços que
E é também um bom local para fazer qualquer chamada de função que você precisa 
para executar imediatamente. 

Tenha em mente Que é geralmente considerado como a melhor prática para evitar 
fazer muito "trabalho" no construtor, para que você Pode preferir colocar 
código que você precisa para executar imediatamente dentro do ionViewDidLoad ()
ciclo de vida (isso também será executado quando a página for carregada pela primeira vez).
===================================================================================
Função ionViewDidLoad

Primeiro, criamos um novo FormControl e, em seguida, inscrevemos-nos no 
valueChanges Observable que fornece.

Subscrevemos o observável para que cada vez que emite um valor executamos algum código. o
Coisas estranhas aqui, porém, é o valueChanges.debounceTime (1500) 
.distinctUntilChanged (). Basicamente, podemos encadear como muitos desses 
operadores como queremos (porque cada função que chamamos Também retornará um 
observável, então ainda podemos assinar o resultado) e todos eles fazem coisas 
diferentes. Para Exemplo, se apenas fizemos isso:
  
  This.subredditControl.valueChanges.subscribe

Em seguida, executaríamos o código fornecido acima toda vez que o valor da entrada 
subredditControl alterar. Se mudá-lo para isso:
  This.subredditControl.valueChanges.debounceTime (1500) .subscribe

Nós só iria executar o código quando a entrada for alterada, e quando não houve 
outra mudança Dentro de 1,5 segundos. Isso impede que enviemos muitas 
solicitações inúteis para a API. 

Se o usuário Estava digitando 'chemicalreactiongifs', por exemplo, o código 
seria acionado para 'c', depois 'ch', então 'che', Então, 'chem' e assim por 
diante até que a seqüência completa tenha sido digitado. 

Não só isso vai enviar um monte de inútil Consultas para a API, vai ser uma 
experiência ruim para o usuário, bem como a lista está constantemente piscando
E mudando como eles tipo. Ao adicionar debouncing, o código só será executado uma vez que a seqüência completa tenha sido
(Supondo que o usuário não demora mais de 1,5 segundo entre a digitação de cada letra).
Finalmente, podemos adicionar um operador final:

  This.subredditControl.valueChanges.debounceTime (1500)
  .distinctUntilChanged (). Subscrever

Isso só executará o código se o valor for diferente da última vez que ele foi 
executado. Então, se um usuário digitar 'gifs', Backspace chave para 
torná-lo 'gif', mas, em seguida, retyped o 's' para torná-lo 'gifs' 
novamente nada iria acontecer. 

Nós Não é necessário recarregar os dados para 'gifs' porque já estamos lá.
O resultado final é que o código só será acionado quando o valor for alterado, 
o usuário não está digitando atualmente E o valor de entrada é diferente do 
que era a última vez. O código que estamos acionando simplesmente verifica
Se um valor não vazio foi fornecido e, em seguida, altera o subreddit ativo 
alterando o subreddit Membro variável no provedor Reddit e chamar a função 
changeSubreddit (). Também chamamos de Close () no plug-in de teclado; 
Uma vez que estamos indo contra o comportamento padrão de
Um campo de entrada (que normalmente seria submetido) o teclado 
não sabe quando fechar, então nós acionamos Manualmente após a 
operação ter terminado. 

Esta será provavelmente uma das partes mais confusas deste aplicativo, 
especialmente se você estiver completamente Novo para Observables. 

Como você pode dizer isso nos permitiu criar algumas funcionalidades 
muito úteis realmente Facilmente, mas nós poderíamos ter tão facilmente 
usado o normal ngModel abordagem e apenas usado um botão para
Desencadeando pesquisas em vez disso.
========================================
função playVideo

Se o usuário tocar no vídeo, então nós queremos reproduzir o vídeo (ou pausá-lo 
se ele já está jogando). Nós usamos
O evento que passamos a partir do modelo para pegar uma referência para o vídeo 
em si, o que nos permite
Para fazer coisas como jogá-lo e pausá-lo. Também alternamos a propriedade 
showLoader aqui para determinar se o
Ícone de carregamento deve ser exibido ou não. Só queremos que o carregamento 
seja exibido na primeira vez que o usuário
Vídeo, caso contrário, o ícone de carregamento seria acionado quando pausar 
o vídeo também, então verificamos
Já Loaded antes de ligá-lo.
===============================
função showComments

Comparado com os outros, esta é uma função muito simples. Nós simplesmente pegar o link dos dados dos posts e
Use InAppBrowser para iniciá-lo.
=====================================
função openSettings

Como você pode ver acima, passamos a página de Configurações que criamos para o 
Modal que estamos criando e também Passar pelos dados que estão a acumular na 
página Definições aqui. Nós configuramos um ouvinte onDidDismiss que irá detectar 
quando o Modal é fechado e passar em todos os dados que
Foi enviado de volta quando o Modal foi demitido. Uma vez que estamos apenas 
fornecendo dados Função quando o usuário acerta salvar, esta é a única vez este 
código será executado. Se houver configurações passadas de volta
Então atualizamos os valores atuais com os novos valores, e também usamos o 
nosso dataService para salvar o
Valores para o armazenamento (ainda precisamos definir este serviço embora). 
Como temos novos valores de configurações agora
Também chamar changeSubreddit para redefinir tudo e carregar novos GIFs com base 
nas novas configurações.
NOTA: Como ainda não implementamos o serviço de dados, comentamos a chamada 
para ele por enquanto.
Finalmente, chamamos o presente método para exibir o Modal para o usuário.

 */
