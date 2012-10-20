/*jslint node: true, plusplus: true, bitwise: true*/
/*globals Map*/
'use strict';

var fs = require('fs'),
    repl = require('repl'),
    os = require('os'),
    readLines = require('./lib/readlines.js'),
    ATree = require('./lib/atree.js');

function getMatchCount(string, re) {
    var matchCount = string.match(re);
    matchCount = matchCount ? matchCount.length : 0;
    return matchCount;
}

function countLetters(word) {
    var pieces = [0, 0, 0],
        counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        i;
    for (i = 0; i < word.length; i++) {
        counts[word.charCodeAt(i) - 97]++;
    }
    return counts;
}

var filename = 'dictionary.txt';

console.time('Reading dictionary');

var dictionary = fs.createReadStream(filename);
var tree = new ATree();

dictionary.on("open", function(fd){
        readLines(
            dictionary,
            function(line, lineNumber) {
                var hash = countLetters(line);
                tree.addWord(hash, line);
            },
            function(){
                console.timeEnd('Reading dictionary');

                console.log('Annagrammer ready, give me some words:');
                var cleanRe = /^\s*\(|\s*\)\s*$/g;
                var reqWildcardRe = /[\?]/g;
                var optWildcardRe = /[\*]/g;

                repl.start({
                    'eval': function (line, context, filename, callback) {
                        line = line.toLowerCase();

                        var reqWildcardCount = getMatchCount(line, reqWildcardRe);
                        var optWildcardCount = getMatchCount(line, optWildcardRe);

                        var bucket = tree.findWords(countLetters(line.replace(cleanRe, '')), reqWildcardCount, optWildcardCount);

                        if(Array.isArray(bucket))
                            console.log("Here's what I found:");

                        callback(null, bucket);
                    }
                });
            });
    });


