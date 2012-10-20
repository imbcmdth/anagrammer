/*jslint node: true, plusplus: true, bitwise: true*/
/*globals Map*/
'use strict';
var fs = require('fs'),
    repl = require('repl'),
    os = require('os');

// Alternatively to hashing like this, one could simply sort the characters in
// each word alphabetically so 'hello' would become 'ehllo', and use that as the
// key for a bucket.  This would also work on non-ASCII words.

function hashWord(word) {
    // I want to hash this to a number, but I'm limited in this bit-building approach
    // by Javascript, in that the left shift operator returns a 32 bit signed integer, so
    // since I need 26*3 = 78 bits total, I'm going to use 2 27 bit integers and 1 24 bit integer.
    // The resulting hash will be the concatenation of the base32 values for each of these pieces.
    var pieces = [0, 0, 0],
        counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        i;
    for (i = 0; i < word.length; i++) {
        counts[word.charCodeAt(i) - 97]++;
    }
    for (i = 0; i < 9; i++) {
        pieces[0] += counts[i] << (i * 3);
        pieces[1] += counts[i + 9] << (i * 3);
        if (i < 8) {
            pieces[2] += counts[i + 18] << (i * 3);
        }
    }
    return pieces[2].toString(32) + '@' + pieces[1].toString(32) + '@' + pieces[0].toString(32);
}

console.time('Reading dictionary');

var dictionary = fs.readFileSync('dictionary.txt').toString().split(os.EOL),
    table = new Map();  // Run node with --harmony

dictionary.forEach(function addWord(word) {
    var hash = hashWord(word),
        bucket = table.get(hash);
    if (!bucket) {
        bucket = [];
        table.set(hash, bucket);
    }
    bucket.push(word);
});

console.timeEnd('Reading dictionary');

console.log('Annagrammer ready, give me some words:');
var cleanRe = /^\s*\(|\s*\)\s*$/g;

repl.start({
    'eval': function (line, context, filename, callback) {
        var bucket = table.get(hashWord(line.replace(cleanRe, '')));
        console.log("Here's what I found:");
        callback(null, bucket);
    }
});