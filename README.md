# Nome do Produto
> Jogo do Par ou Impar - Desenvolvimento voltado à Web III 

## Como jogar: 

Iniciar o servidor com o `node server.js`

Para criar instancias do jogo no navegador, é necessário fazer uma requisição para: `http://localhost`.

## Importante:
Só é possível jogar com duas instancias ao mesmo tempo, caso abra uma terceira instancia a mensagem principal de
boas vindas do servidor será convertida em um aviso, informando que apenas 2 jogadores serao aceitos.

A primeira mensagem enviada pelo usuário será uma mensagem de boas vindas e a solicitacao do nome dos jogadores.
Após isso o servidor irá determinar quem dos usuários será par ou ímpar e solicita que o mesmo envie um numero entre 1 a 10.
Caso este, escolha um número ou até uma letra diferente do que foi solicitado, ele irá pedir novamente, 
até que o jogador envie um número aceito pelas regras.

O jogador nao saberá qual número o oponente escolheu. 
Logo após os dois jogadores enviarem os seus números, o servidor fará uma soma dos valores e enviará o valor total com 
o nome do vencedor para os dois jogadores.
