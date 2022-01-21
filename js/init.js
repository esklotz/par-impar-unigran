$(document).ready(()=>{
	var cor = "";
	var nome = "";
	var conectado = false;
	
	$("#enviar").click(()=>{
		var mensagem = $("#mensagem").val();
		if(mensagem!=""&&conectado){
			if(nome==""){
				connection.send(JSON.stringify({type:"set-name", message:mensagem}));
				nome=mensagem;
			}else{
				connection.send(JSON.stringify({type:"set-message", message:mensagem}));
			}
			$("#mensagem").val("");
		}
	});
	window.Websocket = window.Websocket || window.MozWebSocket;
	var locate = $(location).attr('href');
	var connection = new WebSocket('ws://'+locate.split("/")[2]+':80');

	connection.onerror = function (error){
		console.log(error);
	};
	
	connection.onopen = function(){
		conectado = true;
	};
	
	connection.onmessage = function (message){
		var dados = JSON.parse(message.data);
		if(dados.type=="show-message"){
			mensagens(dados.sender, dados.message, dados.color, dados.side);
			$("#par-impar").scrollTop($("#par-impar")[0].scrollHeight);
		}
	};
	
	var mensagens = (nome, mensagem, cor, lado)=> {
		var linha = '<div class="row" style="margin-right'+lado+':1-px;">';
		if (lado == 'right'){
			linha += '<div class="col s2">'+
			'<img src="https://cdn-icons-png.flaticon.com/512/71/71739.png" alt="Par-Impar" width="60" height="50">'+
			'</div>'+
			'<div class="col s10 '+cor+' lighten-4 z-depth-2" style="min-height: 40px;">'+nome+' diz:<br>'+mensagem+'</div>';
		}else{
			linha += '<div class="col s10 '+
			cor+' lighten-4 z-depth-2" style="min-height: 40px;">'+nome+' diz:<br>'+mensagem+'</div>'+
			'<div class="col s2">'+
			'<img src="https://image.flaticon.com/icons/png/512/17/17004.png" alt="Par-Impar" width="50" height="50">'+ 
			'</div>';
		}
		linha += '</div>';
		$("#par-impar").append(linha);
	};
});