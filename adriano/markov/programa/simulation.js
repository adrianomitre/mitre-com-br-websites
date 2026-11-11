/**
 * @author Helton Massato Kishi
 * @mofiedBy Adriano Mitre (where indicated)
 */
function simular() {
	// Funcao que simula uma cadeia de markov de memoria finita k.
	// A inicialização será dada pelos k primeiros símbolos da entrada que foi codificada.

	//TODO: Acho que ele não simula se vc escolhe o modelo independente. (Talvez só precise fazer um if(independente){ cria só um vetor e vai rodando...	
		
			
	preparaSimulacao(); //Limpa todas as saídas, pega a variável global NUMPASSOS.
	
	if(DEBUGGING == true){
		printDebugLn("\n\nINICIANDO SIMULACAO\n\n Alcance = " + NPREF + "\nInicio: " + prefixo);
	}

	//criando a Matriz de Transição, usando os estimadores calculados ao comprimir a o arquivo original.
	var matriz = criaMatrizTransicaoCumulativa(); 
	
	prefixo = TEXT.substring(0, NPREF); //criando o prefixo de início  // ADRIANO MODIF
	printCode(prefixo);
	//laço principal
	for(var i=0; i < NUMPASSOS; i++){

		var atual = proximoPassoMarkov(prefixo, matriz);
		printCode(atual); // ADRIANO MODIF
		prefixo = atualizaPrefixo(prefixo, atual);
	}
	
	if (TURBOMODE == true) {
		print(CODE);
		medeCodigo();
	}

	if (ALERTWHENDONE == true) alert("Simulação concluída com sucesso!"); 
}

/**
 * @author Helton Massato Kishi
 */
function preparaSimulacao(){
	getGlobalsFromGUI();
	
	limparTxtCodificado();	
	limpartxtComment();
	limparTxtDebug();
	NUMPASSOS = getNUMPASSOS();	
	
	resetCode();
}

/**
 * @author Helton Massato Kishi
 */
function atualizaPrefixo(prefixo, atual){
	// Dada um prefixo e a nova letra, atualiza o prefixo.
	
	if(prefixo.length == 0){
		return "";
	}

	else if(prefixo.length == 1){
		return atual;
	}	

	else{
		prefixo = prefixo.concat(atual).substring(1, prefixo.length +1);		
		return prefixo;
	}

}



/**
 * @author Helton Massato Kishi
 */
function proximoPassoMarkov(passado, MatrizCum){
// Esta funcao faz um passo da cadeia de Markov. ATENCAO: ele recebe a matriz de transicao CUMULATIVA!
	
	// Gera um número aleatório.
	var aleatorio = Math.random();
	
	for(i=0; i < MatrizCum[passado].length; i++){
		if (aleatorio <= MatrizCum[passado][i]){
			if(DEBUGGING == true){
				printDebugLn("aleatorio = " + aleatorio + "\n <= P[" + passado + "][" + i + "] = " + MatrizCum[passado][i]);
			}
			return ALPHABET[i];
		}
	
	}
	
}

/**
 * @author Helton Massato Kishi
 */
function permuta_alfabeto(alfabeto, n){
// Dada um alfabeto, gera todas as possíveis "strings" de n letras.
// Exemplo: A = {a, b} ; n=2 => permuta retorna [aa, ab, ba, bb]
	

	if (n <= 0){
		alert("ERRO! Permutando 0 ou menos letras!");
		return 0;
	}


	if (n == 1){
		result = new Array;
		
		for(i=0; i < alfabeto.length; i++){
			result.push(alfabeto[i]);
		}
		
		return result;
	}
	
	else{
		var PermutacoesMenores;
		PermutacoesMenores = permuta_alfabeto(alfabeto, n-1);
		//alert(PermutacoesMenores.toString());
		//Agora falta fazer todas as combinacoes entre todas as letras do alfabeto com todas as permutacoes de n-1 letras.
		var result = new Array;
		
		for(i=0; i < alfabeto.length; i++){
			for(j=0; j < PermutacoesMenores.length; j++){
				result.push( alfabeto[i].concat(PermutacoesMenores[j]));
			}
		}
		return result;
	}


}

/**
 * @author Helton Massato Kishi
 */
function criaMatrizTransicaoCumulativa() {
// Cria a matriz de transicao cumulativa dada o contexto atual (dps de rodar o comprimir() ).
	var PassadosPossiveis = permuta_alfabeto(ALPHABET, NPREF);
	
	var result= new Array; 
	
	for(i=0; i< PassadosPossiveis.length; i++){
		
		result[ PassadosPossiveis[i] ] = criaLinhaTransicaoCumulativa(PassadosPossiveis[i]);
		
	}
	
	return result;
}

/**
 * @author Helton Massato Kishi
 */
function criaLinhaTransicaoCumulativa(prefixo) {
//retorna um vetor de transicao dado o prefixo
	
	var result = new Array;
	var acumulador = 0;
	
	for (var i=0; i < ALPHABET.length; i++){
		acumulador += estProbMLE(prefixo, ALPHABET[i]);
		result[i] =   acumulador;
		
	}
	return result;
}

// Funções de Teste para criar a função simula(). (Funções feitas ao longo do processo de codificação, para ver se eu estava fazendo as coisas certas...)

/**
 * @author Helton Massato Kishi
 */
function testaProximoPassoMarkov(){
	var matrizcum = new Array;
	matrizcum["ab"] = new Array;
	matrizcum["ab"].push(0.25, 0.5, 1);
	//alert("array: " + matrizcum["ab"].toString());
	var letra = proximoPassoMarkov("ab", matrizcum);
	print(letra);
	

}

/**
 * @author Helton Massato Kishi
 */
function testaPermuta() {
	
	x = permuta_alfabeto(ALPHABET, 0);
	y = permuta_alfabeto(ALPHABET, 1);
	//alert(y.toString());
	
	z = permuta_alfabeto(ALPHABET, 3);
	alert(z.toString());
}

/**
 * @author Helton Massato Kishi
 */
function BLAH(s) { 
//Serve apenas para debug... (Mostra uma janela com a string s e botoes OK CANCEL)

	if (!s) s = "";
	if (!confirm("blah" + s)) {
		exit();
	}
}
