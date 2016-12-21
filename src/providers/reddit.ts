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

  fetchData(): void {

    //Crie o URL que será usado para acessar a API com base nas preferências atuais do usuário
    let url = 'https://www.reddit.com/r/' + this.subreddit + '/' + this.sort + '/.json?limit='+ this.perPage;

    // Se não estivermos na primeira página, precisamos adicionar o parâmetro after para que possamos obter novos resultados
    //Este parâmetro diz basicamente "me dê os posts que vêm depois deste post"
    if(this.after){
      url += '&after=' + this.after;
    }

    //Estamos agora buscando dados, portanto, defina a variável de carregamento como verdadeira
    this.loading = true;

    //Fazer uma solicitação Http para o URL e assinar a resposta
    this.http.get(url).map(res => res.json()).subscribe(data => {

      let stopIndex = this.posts.length;
      this.posts = this.posts.concat(data.data.children);

      //Loop através de todas as novas postagens que foram adicionadas. Estamos fazendo um loop
      //Em sentido inverso, uma vez que estamos removendo alguns itens.
      for(let i = this.posts.length - 1; i >= stopIndex; i--){

        let post = this.posts[i];

        //Adicione uma nova propriedade que será usada mais tarde para alternar uma animação de carregamento
        //Para postagens individuais
        post.showLoader = false;
        post.alreadyLoaded = false;

        //Adiciono  NSFW thumbnail para NSFW posts
        if(post.data.thumbnail == 'nsfw'){
          this.posts[i].data.thumbnail = 'images/nsfw.png';
        }

          /*
          * Remova todas as mensagens que não estejam no formato .gifv vs .webm e converta as que são para arquivos .mp4.
          */
        if(post.data.url.indexOf('.gifv') > -1 || post.data.url.indexOf('.webm') > -1){
          this.posts[i].data.url = post.data.url.replace('.gifv', '.mp4');
          this.posts[i].data.url = post.data.url.replace('.webm', '.mp4');

              //Se uma imagem de pré-visualização estiver disponível, atribua-a à publicação como 'snapshot' (Instantâneo)
          if(typeof(post.data.preview) != "undefined"){
            this.posts[i].data.snapshot = post.data.preview.images[0].source.url.replace(/&amp;/g, '&');

                //Se o snapshot (instantâneo) não estiver definido, altere-o para que fique em branco para que ele não use uma imagem quebrada
            if(this.posts[i].data.snapshot == "undefined"){
              this.posts[i].data.snapshot = "";
            }
          }
          else {
            this.posts[i].data.snapshot = "";
          }
        }
        else {
          this.posts.splice(i, 1);
        }
      }

      //Continue buscando mais GIFs se não recuperarmos o suficiente para preencher uma página
      //Mas desista depois de 20 tentativas se ainda não temos o suficiente
      if(data.data.children.length === 0 || this.moreCount > 20){

        this.moreCount = 0;
        this.loading = false;

      }
      else {

        this.after = data.data.children[data.data.children.length - 1].data.name;

        if(this.posts.length < this.perPage * this.page){
          this.fetchData();
          this.moreCount++;
        } 
        else {
      this.loading = false;
          this.moreCount = 0;
        }
      }

    }, (err) => {
      //Caso ocorra algum erro, tratamos ele com essa mensagem
      console.log("subreddit não existe!");
    });

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
===================================
===================================
Função fetchData
-

Essa é uma função muito grande. Eu adicionei alguns comentários inline para ajudar 
o entendimento, mas vamos falar sobre cada linha de código com detalhe.

Primeiro, construímos a URL que vamos usar para buscar dados da API Reddit. 
Usamos quaisquer valores de subreddit, sort e perPage que o usuário tenha 
definido atualmente. 

Você pode modificar esta URL com quaisquer valores para estes que você gosta e ele 
vai retornar o JSON relevante.

Se tivermos um conjunto de valores após, então nós fornecemos isso também. 
Isto é como a API Reddit faz "paginação", se o usuário clicou no botão 
"Carregar mais" três vezes, então só queremos retornar as mensagens para a 
terceira página, por exemplo, resultados 10-15 se o usuário tem um tamanho de 
página de 5. Com o reddit API você pode fornecer um post "name" como o parâmetro 
after(depois de) e ele retornará somente o Postagens depois dessa postagem.

Em seguida, usamos essa URL para fazer uma solicitação Http e assinar o Observable 
retornado depois de mapear a resposta para um objeto JSON, isso converte a seqüência 
JSON retornada da API Reddit em um objeto que podemos usar mais facilmente.

Depois disso, queremos percorrer todos os posts que carregamos para executar alguma 
mágica. Não queremos percorrer todos os posts que armazenamos na variável this.posts, 
porque muitos deles já foram "processados", só queremos percorrer as novas postagens 
então criamos Um "stopIndex"(Pare o Index) que é o comprimento da atual 
this.posts array, e então nós adicionamos as novas postagens para ele.

Quando estamos fazendo um loop pelos posts recém-carregados, estamos fazendo algumas 
coisas:
  • Remover todos os posts que não estejam nos formatos .gifv ou .webm 250 
  • Conversão de links .gifv e .webm para .mp4
  • Criando uma nova propriedade 'showLoader' nas postagens que serão usadas para 
    alternar uma animação de carregamento mais tarde
  • Atribuir uma miniatura NSFW a postagens NSFW
  • Atribuir uma imagem de pré-visualização para ser utilizada como cartaz de vídeo 
    se estiver disponível

Assim que terminarmos o loop, devemos ter um array de posts no formato que precisamos, 
prontos para serem exibidos na lista. Há uma questão mais importante que precisamos 
cuidar. Se estamos carregando 10 posts por página da API Reddit, mas então apenas 
3 desses são GIFS adequado, nosso tamanho da página só vai ser 3.

Isso pode não é legal para o usuário.

Para resolver esse problema, recursivamente buscaremos mais dados chamando a função 
fetchData () da função fetchData (). Isso continuará adicionando mais e mais 
postagens à o array de postagens até que tenhamos nossos GIFs de 10 (ou seja qual for 
o tamanho da página atualmente). Nós precisamos definir um limite, porém, 
porque esta função poderia apenas executar infinitamente, por isso, se ainda não 
temos GIFs suficientes após 20 tentativas, em seguida, desistir.

Observe também que temos um manipulador de erros para o pedido http.get também. 
Se uma solicitação bem-sucedida é feita, todo o código que acabamos de discutir 
será executado, mas se não (ou seja, se o subreddit o usuário está tentando recuperar 
os resultados em um 404), então o erro será passado para o manipulador de erro e que 
será executado ao invés.
Agora que temos a nossa lista de GIFs carregando no aplicativo, podemos exibir dados 
reais em nossa lista. Mas primeiro, precisamos atualizar nosso modelo para realmente 
usar os dados.
 */