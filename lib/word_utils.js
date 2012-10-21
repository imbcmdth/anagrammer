var wordUtilities = {
    cleanRe: /^\s*\(|\s*\)\s*$/g,
    reqWildcardRe: /[\?]/g,
    optWildcardRe: /[\*]/g,
    partsofSpeechRe: /\(([\w\!]+)\)/,

    getMatchCount: function _getMatchCount(string, re) {
        var matchCount = string.match(re);
        matchCount = matchCount ? matchCount.length : 0;
        return matchCount;
    },

    countLetters: function _countLetters(word) {
        var counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            i;
        for (i = 0; i < word.length; i++) {
            var code = word.charCodeAt(i);
            if(code >= 97) code -= 97;
            else if(code >= 48 && code <= 57) code -= 22;
            else continue;
            counts[code]++;
        }
        return counts;
    },

    formatPartsOfSpeech: function _formatPartsOfSpeech(POS) {
        return wordUtilities.partsOfSpeechDescriptions[POS];
    },

    allPartsOfSpeech: [
        "N",
        "p",
        "h",
        "V",
        "t",
        "i",
        "A",
        "v",
        "C",
        "P",
        "!",
        "r",
        "D",
        "I",
        "o"
    ],

    partsOfSpeechDescriptions: {
        "N" : "Noun",
        "p" : "Plural",
        "h" : "Noun Phrase",
        "V" : "Verb (usu participle)",
        "t" : "Verb (transitive)",
        "i" : "Verb (intransitive)",
        "A" : "Adjective",
        "v" : "Adverb",
        "C" : "Conjunction",
        "P" : "Preposition",
        "!" : "Interjection",
        "r" : "Pronoun",
        "D" : "Definite Article",
        "I" : "Indefinite Article",
        "o" : "Nominative"
    },

    makeWordObject: function _makeWordObject(lineData) {
        var a = lineData.split("\t"); // split into [word, part_of_speech];
        var b = a[1].split("|"); // split part of speech into old and new
        var c = b[b.length-1].split(''); // split into letters
        var word = {
            'word': a[0],
            'pos': c
        };

    //    word['parts of speech'] = c.map(function(e){ return partsOfSpeech[e]; });

        return word;
    },

    getPartsOfSpeech: function _getPartsOfSpeech(word) {
        var partsOfSpeech = word.match(wordUtilities.partsofSpeechRe);
        if(partsOfSpeech == null || partsOfSpeech.length < 2) return wordUtilities.allPartsOfSpeech;
        return partsOfSpeech[1].split('');
    }
};

module.exports = wordUtilities;