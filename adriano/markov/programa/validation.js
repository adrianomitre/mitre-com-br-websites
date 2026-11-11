function validateInputText(TEXT, ALPHABET) {
//FORMERLY: function validateInputText() {
	if (TEXT.length < 1) {
		alert("Erro: texto vazio!");
		exit();
	}
	for (var i=0; i<TEXT.length; i++) {
		if (ALPHABET.indexOf(TEXT[i]) == -1) {
			alert("Erro: o texto possui caracteres que não estão no alfabeto, por ex. \'"+TEXT[i]+"\'.");
			exit();
		}
	}
}
