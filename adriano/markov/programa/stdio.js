function print(s) {
	document.getElementById("txtCodificado").value += s;
}

function printLn(s) {
	print(s+'\n');
}

function printDebug(s) {
	document.getElementById("txtDebug").innerHTML += s;
}

function printDebugLn(s) {
	printDebug(s+'<br />');
}

function printComment(s) {
	document.getElementById("commentBox").innerHTML += s;
}

function printCommentLn(s) {
	printComment(s+'<br />');
}

function printCode(c) {
	CODELENGTH += c.length;
	if (TURBOMODE == true) {
		CODE += c;
	} else {
		print(c);
		medeCodigo();
	}
}

function resetCode() {
	CODE = "";
	CODELENGTH = 0;
}

function printFreq() {
	for (var p in FREQ) {
		for (var s in FREQ[p]) {
		// TODO: ajeitar isso aqui
			//if (FREQ[p][s] != 0) {
			if (s != TOTAL_FREQ) {
				printDebugLn("N["+p+"]["+s+"]="+FREQ[p][s]);
			}
		}
	}
}

function selecionaAlfabeto()
{
	const proteins = 'acgt'; // formerly 'ACGT'
	const numbers = '0123456789';
	const punct = ' -()"\',:;.!?';
	const lowerAlfa = 'abcdefghijklmnopqrstuvxywz';
	const upperAlfa = 'ABCDEFGHIJKLMNOPQRSTUVXYWZ'
	const lowerPort= '·‡„‚ÈÍÌÛıÙ˙¸Á';
	const upperPort = '¡¿√¬… Õ”’‘⁄‹«';
	const binary = '01';
	
	var selAlfa = document.getElementById("listaAlfabetos");
	var opcao = selAlfa.options[selAlfa.selectedIndex].value;
	var txtAlfa = document.getElementById("alfabeto");
	var alfabeto = "";
	
	switch (opcao) {
		case 'restricted-numeric':
			alfabeto = '01234';
			break;
		case 'numeric':
			alfabeto = numbers;
			break;
		case 'genetic':
			alfabeto = proteins; 
			break;
		case 'mini-alfanumeric':
			alfabeto = '1234abcd';
			break;
		case 'alfaCaseInsens':
			alfabeto = alfabeto.concat(lowerAlfa, numbers, punct);
			break;
		case 'alfaCaseSens':
			alfabeto = alfabeto.concat(lowerAlfa, upperAlfa, numbers, punct);
			break;
		case 'portCaseInsens':
			alfabeto = alfabeto.concat(lowerAlfa, numbers, punct, lowerPort);
			break;			
		case 'portCaseSens':
			alfabeto = alfabeto.concat(lowerAlfa, upperAlfa, numbers, punct, lowerPort, upperPort);
			break;
		case 'binary':
			alfabeto = binary;
			break;
		default:
			alert("it shouldn't have happened... default option on switch inside function selecionaAlfabeto()");
	}
	txtAlfa.value = sortString(alfabeto);
	
	medeEntrada();
}


function sortString(s) {
	return s.split("").sort().join("");
}

/*
function _old_stringSort(s) {
	var a = new Array();
	for (var i=0; i<s.length; i++) {
		a.push(s[i]);
	}
	a.sort();
	//t = a.toString(); 
	var t = "";
	for (var letra in a) {
		t = t.concat(a.shift());
	}
	return t;
}
*/

function medeEntrada() {
	var txt = document.getElementById("txtEntrada").value;
	var inputLen = 0;

	if (txt) {
		inputLen = txt.length * getFixedCodeLength();
	}
	
	document.getElementById("contEntrada").innerHTML =
txt.length + " sÌmbolo(s) &#151 " + inputLen + " bit(s)";
}

function medeCodigo() {
	document.getElementById("contCodigo").innerHTML = CODELENGTH + " bit(s)";
}
