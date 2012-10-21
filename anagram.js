/*jslint node: true, plusplus: true, bitwise: true*/
/*globals Map*/
'use strict';

var fs = require('fs'),
    repl = require('repl'),
    os = require('os'),
    readLines = require('./lib/readlines.js'),
    ATree = require('./lib/atree.js');

var cleanRe = /^\s*\(|\s*\)\s*$/g;
var reqWildcardRe = /[\?]/g;
var optWildcardRe = /[\*]/g;
var partsofSpeechRe = /\(([\w\!]+)\)/;

//var filename = 'dictionary.txt';
var filename = 'part-of-speech.txt';

var dictionary = fs.createReadStream(filename);
var tree = new ATree();

function getMatchCount(string, re) {
    var matchCount = string.match(re);
    matchCount = matchCount ? matchCount.length : 0;
    return matchCount;
}

function countLetters(word) {
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
}

function formatPartsOfSpeech(POS) {
    return partsOfSpeechDescriptions[POS];
}

var allPartsOfSpeech = [
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
];

var partsOfSpeechDescriptions = {
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
};

function makeWordObject(lineData) {
    var a = lineData.split("\t"); // split into [word, part_of_speech];
    var b = a[1].split("|"); // split part of speech into old and new
    var c = b[b.length-1].split(''); // split into letters
    var word = {
        'word': a[0],
        'pos': c
    };

//    word['parts of speech'] = c.map(function(e){ return partsOfSpeech[e]; });

    return word;
}

function getPartsOfSpeech(word) {
    var partsOfSpeech = word.match(partsofSpeechRe);
    if(partsOfSpeech == null || partsOfSpeech.length < 2) return allPartsOfSpeech;
    return partsOfSpeech[1].split('');
}

console.time('Reading dictionary and creating tree');

dictionary.on("open", function(fd){
        readLines(
            dictionary,
            function(line, lineNumber) {
                var wordObject = makeWordObject(line);
                var letterCounts = countLetters(wordObject.word.toLowerCase());

                tree.addWord(letterCounts, wordObject.word, wordObject.pos);
            },
            function(){
                console.timeEnd('Reading dictionary and creating tree');

                console.log('Anagrammer ready, give me some words:');
                console.log(partsOfSpeechDescriptions);
                repl.start({
                    'eval': function (line, context, filename, callback) {
                        line = line.replace(cleanRe, '');
                        var partsOfSpeech = getPartsOfSpeech(line);
                        line = line.replace(partsofSpeechRe, '');

                        var reqWildcardCount = getMatchCount(line, reqWildcardRe);
                        var optWildcardCount = getMatchCount(line, optWildcardRe);
                        var letterCounts = countLetters(line.toLowerCase());

                        var bucket = tree.findWords(letterCounts, reqWildcardCount, optWildcardCount, partsOfSpeech);

                        var response = {};
                        var isEmpty = true;

                        for(var POS in bucket) {
                            if(bucket.hasOwnProperty(POS)) {
                                isEmpty = false;
                                var description = formatPartsOfSpeech(POS);
                                response[description] = bucket[POS];
                            }
                        }

                        if(!isEmpty) {
                            console.log("Here's what I found:");
                            callback(null, response);
                        } else {
                            callback(null, "No matches found.");
                        }
                    }
                });
            });
    });


