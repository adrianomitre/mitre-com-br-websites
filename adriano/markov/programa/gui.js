function getGlobalsFromGUI() {
	ALPHABET = getALPHABET();
	TURBOMODE = isTurboMode();
	DEBUGGING = isDebugging();
	PRINTINGFREQ = isPrintingFreq();
	TEXT = getInputText();
	NPREF = getNPREF();
	VALIDATING = isValidating();
	ADAPTIVE = isAdaptive();
	ALERTWHENDONE = isAlertWhenDone();
}

function isValidating() {
	return document.getElementById("isValidating").checked;
}

function isTurboMode() {
	return document.getElementById("isTurboMode").checked;
}

function isAdaptive() {
	return document.getElementById("isAdaptive").checked;
}

function isPrintingFreq() {
	return document.getElementById("isPrintingFreq").checked;
}

function isDebugging() {
	return document.getElementById("isDebugging").checked;
}

function getALPHABET() {
	return document.getElementById("alfabeto").value;
}

function getNPREF() {
	return document.getElementById("selModelo").value;
}

function getNUMPASSOS(){
	return parseInt(document.getElementById("txtNumPassos").value);
}

function getInputText() {
	return document.getElementById("txtEntrada").value;
}

function limparTxts() {
	limparTxtEntrada();
	limparTxtCodificado();
	limpartxtComment();
	limparTxtDebug();
}

function limparTxtEntrada() {
	document.getElementById("txtEntrada").value = "";
	document.getElementById("contEntrada").innerHTML = "nenhum bit";
}

function limparTxtCodificado() {
	document.getElementById("txtCodificado").value = "";
	document.getElementById("contCodigo").innerHTML = "nenhum bit";
}

function limpartxtComment() {
	document.getElementById("commentBox").innerHTML = "";
}

function limparTxtDebug() {
	document.getElementById("txtDebug").innerHTML = "";
}

function isAlertWhenDone() {
	return document.getElementById("isAlertWhenDone").checked;
}
