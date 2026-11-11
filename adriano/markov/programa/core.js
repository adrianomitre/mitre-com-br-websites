// GLOBALS FLMC_COMPRESS

const INV_LOG2 = 1.0/Math.log(2);
const TOTAL_FREQ = "*";

var FREQ, ALPHABET, TEXT, NPREF;
var TURBOMODE, DEBUGGING, PRINTINGFREQ, VALIDATING, ADAPTIVE, ALERTWHENDONE;
var CODE, CODELENGTH;

var NUMPASSOS; // variável global que guarda quantos símbolos quero gerar.

/**
 * Determine the code from its length and order (i.e. sequence).
 * Beware: getCode() does not verify if ord < 2^len - 1
 * @author Adriano Brito Mitre
 */
function getCode(len, ord) {
	var code = "";
	
	if (ord == 0) { // not necessary, but speeds things up
		for (var i=0; i<len;i++) {
			code += "0";
		}
		return code;
	 }

	for (i=len-1; i>=0; i--) {
		var power = Math.pow(2, i); // prevent recalculation
		var bit = Math.floor(ord/power);
		ord %= power;
		code += bit.toString();
	}
	
	return code;
}

/**
 * Estimate the probability using Maximum Likelihood Estimator
 * with Laplace succession rule (independent uniform a priori)
 * @param pref Prefix, i.e., the context
 * @param suf Sufix, i.e., the symbol whose probability is to be calculated
 * @author Adriano Brito Mitre
 */
function estProb(pref, suf) {
	ensure(pref, suf);
	return (FREQ[pref][suf]+1)/(FREQ[pref][TOTAL_FREQ] + ALPHABET.length);
}

/**
 * Estimate the probability using Maximum Likelihood Estimator
 * WITHOUT Laplace succession rule (independent uniform a priori)
 * @param pref Prefix, i.e., the context
 * @param suf Sufix, i.e., the symbol whose probability is to be calculated
 * @author Adriano Brito Mitre
 */
function estProbMLE(pref, suf) {
	ensure(pref, suf);

	if (FREQ[pref][TOTAL_FREQ] > 0) {
		return FREQ[pref][suf] / FREQ[pref][TOTAL_FREQ];
	}
	return 1/ALPHABET.length;
}


/**
 * Determine the codelength of a symbol based on its entropy.
 * As one would expect, the codelength is always greater than zero
 * (even for probabilities greater than the inverse of the coding
 * alphabet size, tipically 2).
 * @param prob Probability of the symbol
 * @author Adriano Brito Mitre
 * @return symbol code length
 */
function codeLen(prob) {
	var len = Math.ceil(entropy(prob));
	return (len > 0 ? len : 1);
}

/**
 * Determine the entropy of a symbol.
 * @param prob Probability of the symbol
 * @author Adriano Brito Mitre
 * @return symbol code length
 */
function entropy(prob) {
	return -1 * Math.log(prob)*INV_LOG2;
}

/**
 * @author Adriano Brito Mitre
 */
function getAlphaIndex(c) {
	return ALPHABET.indexOf(c);
}

/**
 * Ensures that the frequency counter exists.
 * If it is not the case, the counter is initialized with zero.
 * @param pref Prefix, i.e., the context
 * @param suf Sufix, i.e., the symbol whose probability is to be calculated
 * @author Adriano Brito Mitre
 */
function ensure(pref, suf) {
	if (!FREQ[pref]) {
		FREQ[pref] = new Array();
		FREQ[pref][TOTAL_FREQ] = 0; // not necessary  but speed things up
		for (var i=0; i<ALPHABET.length; i++) {
			FREQ[pref][ALPHABET[i]] = 0;
		}
	}
}

/**
 * Update the frequency counters.
 * @param pref Prefix, i.e., the context
 * @param suf Sufix, i.e., the symbol whose probability is to be calculated
 * @author Adriano Brito Mitre
 */
function updateFreq(pref, suf) {
	
	ensure(pref, suf);
	
	FREQ[pref][suf]++;
	FREQ[pref][TOTAL_FREQ]++;
}

/**
 * Gets the context of a symbol by its index in the text.
 * @param i The index of the symbol.
 * @author Adriano Brito Mitre
 */
function getPref(i) {
	var pref = "";
	
	for (j=NPREF; j > 0; j--) {
		pref += TEXT[i-j];
	}
	
	return pref;
}

/**
 * Gets a symbol by its index in the text.
 * @param i The index of the symbol.
 * @author Adriano Brito Mitre
 */
function getSuf(i) {
	return TEXT[i];
}

/**
 * Determine the order (i.e. sequence) of the code to be used by a symbol
 * without explicitly building the code tree.
 * @param len The code length.
 * @param pref Prefix, i.e., the symbol context. 
 * @param actualSuf Actual suffix, i.e., the symbol to be coded.
 * @author Adriano Brito Mitre
 */
function getPrevSameLen(len, pref, actualSuf) {
	if (FREQ[pref][TOTAL_FREQ] > 0) {
		var sameLenSufs = new Array();
		var m=0;
		
		for (var k in FREQ[pref]) {
			if (k == TOTAL_FREQ) continue;
			
			var ckLen = codeLen(estProb(pref, k));
			
			if (ckLen < len)  m+= Math.pow(2, (len - ckLen));
			if (ckLen == len) sameLenSufs.push(k);
		}
		return m+sameLenSufs.sort().indexOf(actualSuf);
	}
	return getAlphaIndex(actualSuf);
}


/**
 * Determine the order (i.e. sequence) of the code to be used by a symbol
 * without explicitly building the code tree and using the Maximum
 * Likelihood Estimator withou the Sucession Rule.
 * @param len The code length.
 * @param pref Prefix, i.e., the symbol context. 
 * @param actualSuf Actual suffix, i.e., the symbol to be coded.
 * @author Adriano Brito Mitre
 */
function getPrevSameLenMLE(len, pref, actualSuf) {
	if (FREQ[pref][TOTAL_FREQ] > 0) {
		var sameLenSufs = new Array();
		var m=0;
		
		for (var k in FREQ[pref]) {
			if (k == TOTAL_FREQ) continue;
			
			var ckLen = codeLen(estProbMLE(pref, k));
			
			if (ckLen < len)  m+= Math.pow(2, (len - ckLen));
			if (ckLen == len) sameLenSufs.push(k);
		}
		return m+sameLenSufs.sort().indexOf(actualSuf);
	}
	return getAlphaIndex(actualSuf);
}


/**
 * Determine the code length to be used by a fixed length coding system.
 * @author Adriano Brito Mitre
 */
function getFixedCodeLength() {
	return Math.ceil(Math.log(getALPHABET().length)*INV_LOG2);
}
