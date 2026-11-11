/**
 * @author Helton Massato Kishi
 */
 
/* Variáveis globais */ 
var TEXT_INDEX; // o próximo indice do vetor TEXT[] que o programa irá processar...
 

function decodificar()
{

	preparaDecodificacao();
	
	if (VALIDATING == true) {
		validateInputText(TEXT, ALPHABET) ;
	}

	// I. Print the preamble
	
	printCommentLn(" A = {"+ALPHABET+"} // alphabet");
	printCommentLn("#A = "+ALPHABET.length+" // alphabet size");
	printCommentLn(" k = "+NPREF+" // Markov chain order");

	// II. Print the code (i.e., decompress)

	var i, pref, suf, prob, fixedCodeLen, len, ord;
	var dicionario;
	var contexto;
	
	/* As primeiras K (cadeia de alcance K) letras a serem decomprimidas terao a distribuicao uniforme. 
	 * Cada letra tem comprimento fixo.
	 */


	dicionario = new Array;
	
	fixedCodeLen = getFixedCodeLength();
	criaDicionarioUniforme(dicionario, fixedCodeLen);
	
	TEXT_INDEX = 0;
	var TextoDecodificado = ""; //iniciando String que vai ir guardando o texto descomprimido.

	for (i=0; i< NPREF && i<TEXT.length; i++) {
		TextoDecodificado = TextoDecodificado.concat(proximaLetra(dicionario));
		
	}
	
	//Agora já tenho UM prefixo. 
	
	//A proxima letra após os K letras descomprimidas, também terá distribuição uniforme.
	TextoDecodificado = TextoDecodificado.concat(proximaLetra(dicionario));

	
	var IndiceDecodificado = TextoDecodificado.length - 1;
	
	
	//IndiceDecodificado aponta para o proxima letra a ser decodificada.
	
	/* Laço Principal */	
	while(TEXT_INDEX < TEXT.length) {
		
		pref =  pegaPrefixo(TextoDecodificado, IndiceDecodificado);
		suf = TextoDecodificado[IndiceDecodificado];
		
		updateFreq(pref, suf);
		
		//contexto são os últimos K símbolos decodificados, que são necessários para decodificarmos a próxima letra.
		
		contexto = pegaPrefixo(TextoDecodificado, IndiceDecodificado+1);
		
		updateDicionario(dicionario, contexto);
		
		TextoDecodificado = TextoDecodificado.concat(proximaLetra(dicionario));
		IndiceDecodificado++;
	
	
	}
	
	printCode(TextoDecodificado);
	
	if (ALERTWHENDONE == true) alert("Descompressão concluída com sucesso!"); 
}

//Funções Auxiliares 

function preparaDecodificacao() {
	limparTxtCodificado();
	limpartxtComment();
	limparTxtDebug();
	FREQ = new Array(); // avoid wasting memory, but beware: simply zeroing doest NOT work
	
	resetCode();
	
	getGlobalsFromGUI();
}


//Funcao similar ao getPref() do Adriano, mas ao invés de pegar no TEXT, pega no texto q vai sendo decodificado...
function pegaPrefixo(texto_decodificado, i) {
	var pref = "";
	
	for (j=NPREF; j > 0; j--) {
		pref += texto_decodificado[i-j];
	}
	
	return pref;
}


//Funções de manipulação do dicionário
function criaDicionarioUniforme(dicionario, fixedCodeLen){
	/* Modifica o dicionario para que ele tenha para toda letra do alfabeto, um codigo associado. 
	 * O codigo eh aquele que eh gerado pela distribuicao uniforme, ou seja, eh simplesmente a ordem lexicologica.
	 */
	 
	for(var i=0; i< ALPHABET.length; i++){
		
		dicionario[ ALPHABET[i] ] = getCode(fixedCodeLen, i);

	}
}


function imprimeDicionario(dicionario){
	//Imprime na parte de debug o dicionario.
	printDebug("DICIONARIO: (letra -> codigo)\n\n");
	for(var i=0; i< ALPHABET.length; i++){
		printDebug(ALPHABET[i]);
		printDebug(" -> ");
		printDebug(dicionario[ALPHABET[i]]);
		printDebug("\n");
	}

}


function procuraDicionario(dicionario, codigo){
/*
 * Dada um dicionario, retorna a letra que é codificada por codigo.
 * Se não achar retorna -1.. (Não sei se é o valor mais apropriado...)
 * @returns letra do alfabeto que é codificada por codigo
*/

	for(var i=0; i< ALPHABET.length; i++){
	
		if ( dicionario[ALPHABET[i]] == codigo){
			return ALPHABET[i];
		}
	}

	// Não achou!
	return -1;

}

function proximaLetra(dicionario){
// Dada um dicionario, um indice de onde está a entrada, decodifica a proxima letra.
	var buffer="";
	var result;
	for(var i= TEXT_INDEX; i < TEXT.length; i++){
		buffer = buffer.concat(TEXT[i]);
		result = procuraDicionario(dicionario, buffer);
		if (result != -1){
			TEXT_INDEX++;
			return result;	
		}
		TEXT_INDEX++;
	}


}


function updateDicionario(dicionario, contexto){
// Dada um contexto, atualizo o dicionário, usando as estatísticas calculadas até o momento.
	
	for(var i=0; i < ALPHABET.length; i++){

		prob = estProb(contexto, ALPHABET[i]);
		len = codeLen(prob);
		dicionario[ALPHABET[i]] = getCode(len, getPrevSameLen(len, contexto, ALPHABET[i]));

	}

}
