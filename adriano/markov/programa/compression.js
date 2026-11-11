/**
 * @author Adriano Brito Mitre
 */
function codificar()
{
	preparaCodificacao();
	
	if (VALIDATING == true) {
		validateInputText(TEXT, ALPHABET) ;
	}

	// I. Print the preamble

	printCommentLn("<acronym title=\"alphabet\">A</acronym> = {"+ALPHABET+"}");
	printCommentLn("<acronym title=\"alphabet size\">#A</acronym> = "+ALPHABET.length);
	printCommentLn("<acronym title=\"Markov chain order\">k</acronym> = "+NPREF);

	// II. Print the code (i.e., compress)
	
	var textEntropy;
	
	if (ADAPTIVE == true) textEntropy = adaptiveCoding();
	else textEntropy = nonAdaptiveCoding();
	
	// III. Print compression statistics
	
	var fixedCodeLen = getFixedCodeLength();
	var originalInputLen = TEXT.length*fixedCodeLen;
	printCommentLn("<acronym title=\"bits per symbol (average)\">bps</acronym>: "+CODELENGTH/TEXT.length);
	printCommentLn("<acronym title=\"size ratio against fixed length code\">size ratio</acronym>: "+CODELENGTH/originalInputLen);
	printCommentLn("<acronym title=\"concatination code size ratio lower bound\">CCSR lower bound</acronym>: "+TEXT.length/originalInputLen);
	printCommentLn("text entropy: "+textEntropy/originalInputLen);
	
	if (TURBOMODE == true) {
		print(CODE);
		medeCodigo();
	}
	if (ALERTWHENDONE == true) alert("Compressão concluída com sucesso!"); 
}

function adaptiveCoding() {
	var i, pref, suf, prob, fixedCodeLen, len, ord, textEntropy = 0;
	
	fixedCodeLen = getFixedCodeLength();
	for (i=0; i<NPREF && i<TEXT.length; i++) {
		printCode(getCode(fixedCodeLen, getAlphaIndex(TEXT[i])));
	}

	for (i=NPREF; i<TEXT.length; i++) {
		pref = getPref(i);
		suf = getSuf(i);
		prob = estProb(pref, suf);
		len = codeLen(prob);
		
		textEntropy += entropy(prob);
		
		if (DEBUGGING == true) {
			ord = getPrevSameLen(len, pref, suf);
			
			printDebugLn("reading TEXT["+i+"] : "+"("+pref+")"+suf);
			printDebugLn("p("+pref+suf+"): "+prob);
			printDebugLn("codelen: "+len);
			printDebugLn("prevSameLen("+pref+suf+"): "+ord);
		}
		
		printCode(getCode(len, getPrevSameLen(len, pref, suf)));
		updateFreq(pref, suf);

		if (PRINTINGFREQ == true) {
			printDebugLn("n="+i);
			printFreq();
		}
	}
	
	return textEntropy;
}

function nonAdaptiveCoding() {
	var i, pref, suf, prob, fixedCodeLen, len, ord, textEntropy = 0;
	
	fixedCodeLen = getFixedCodeLength();
	for (i=0; i<NPREF && i<TEXT.length; i++) {
		printCode(getCode(fixedCodeLen, getAlphaIndex(TEXT[i])));
	}

	for (i=NPREF; i<TEXT.length; i++) {
		pref = getPref(i);
		suf = getSuf(i);
		prob = estProb(pref, suf);
		len = codeLen(prob);
		
		updateFreq(pref, suf);

		if (PRINTINGFREQ == true) {
			printDebugLn("n="+i);
			printFreq();
		}
	}
	
	for (i=NPREF; i<TEXT.length; i++) {
		pref = getPref(i);
		suf = getSuf(i);
		prob = estProbMLE(pref, suf);
		len = codeLen(prob);
		ord = getPrevSameLenMLE(len, pref, suf);
		
		textEntropy += entropy(prob);
		
		if (DEBUGGING == true) {
			printDebugLn("reading TEXT["+i+"] : "+"("+pref+")"+suf);
			printDebugLn("p("+pref+suf+"): "+prob);
			printDebugLn("codelen: "+len);
			printDebugLn("prevSameLen("+pref+suf+"): "+ord);
		}
		
		printCode(getCode(len, ord));
	}
	
	return textEntropy;
}

function preparaCodificacao() {
	limparTxtCodificado();
	limpartxtComment();
	limparTxtDebug();
	FREQ = new Array(); // avoid wasting memory, but beware: simply zeroing doest NOT work
	resetCode();
	
	getGlobalsFromGUI();
}

