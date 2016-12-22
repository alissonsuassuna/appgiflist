import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/*
  A peça final do quebra-cabeça é criar nosso serviço de dados para lidar com salvar nossas configurações na memória e
  Também recuperando essas configurações da memória.

  Para salvar os dados, vamos usar o serviço de armazenamento fornecido pelo Ionic. Este é um dos meus favoritos
  Adições em Ionic 2, porque torna o processo complicado de armazenamento extremamente fácil. Existem vários
  Problemas com o armazenamento de dados, como o sistema operacional aleatoriamente limpar dados de armazenamento local, mas este armazenamento
  Serviço irá usar automaticamente a melhor opção disponível.
*/
@Injectable()
export class Data {

  constructor(public storage: Storage) {
    
  }
  getData(): Promise<any> {
    return this.storage.get('settings');
  }
  save(data): void {
    let newData = JSON.stringify(data);
    this.storage.set('settings', newData);
  }
}

/*
  Primeiro, no nosso construtor nós injetar o serviço de armazenamento. 
  Então nós apenas temos duas funções, uma para obter dados
  E um para salvar dados. A função getData () retornará todos os dados que 
  armazenamos em 'settings'
  Em armazenamento e save () atualizará 'configurações' no armazenamento 
  com um novo conjunto de dados. Já criamos o

  Chamada para salvar () quando o Modalidades de Configuração é descartado, 
  agora só precisamos definir o loadSettings
  Que controlará o carregamento de configurações salvas anteriormente quando o 
  aplicativo for aberto.
 */
