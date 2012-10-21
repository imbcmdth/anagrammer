'use strict';

var fs = require('fs'),
    repl = require('repl'),
    os = require('os'),
    readLines = require('./lib/readlines.js'),
    ATree = require('./lib/atree.js'),
    wordUtils = require('./lib/word_utils.js');

var filename = 'part-of-speech.txt';

var dictionary = fs.createReadStream(filename);
var tree = new ATree();

function getAnagram(req, res) {
    var lastSlash = req.url.lastIndexOf('/') + 1
    var line = req.url.slice(lastSlash);
    line = line.replace(wordUtils.cleanRe, '');
    var partsOfSpeech = wordUtils.getPartsOfSpeech(line);
    line = line.replace(wordUtils.partsofSpeechRe, '');

    var reqWildcardCount = wordUtils.getMatchCount(line, wordUtils.reqWildcardRe);
    var optWildcardCount = wordUtils.getMatchCount(line, wordUtils.optWildcardRe);
    var letterCounts = wordUtils.countLetters(line.toLowerCase());

    var bucket = tree.findWords(letterCounts, reqWildcardCount, optWildcardCount, partsOfSpeech);

   /* var response = {};

    for(var POS in bucket) {
        if(bucket.hasOwnProperty(POS)) {
            var description = wordUtils.formatPartsOfSpeech(POS);
            response[description] = bucket[POS];
        }
    }*/

    res.end(JSON.stringify(bucket));
}

console.time('Reading dictionary and creating tree');

dictionary.on("open", function(fd){
        readLines(
            dictionary,
            function(line, lineNumber) {
                var wordObject = wordUtils.makeWordObject(line);
                var letterCounts = wordUtils.countLetters(wordObject.word.toLowerCase());

                tree.addWord(letterCounts, wordObject.word, wordObject.pos);
            },
            function(){
                console.timeEnd('Reading dictionary and creating tree');
                var connect = require('connect')
                  , http = require('http');

                var app = connect()
                    .use(connect.favicon())
                    .use(connect.logger('dev'))
                    .use(connect.static('public'))
                    .use(connect.directory('public'))
                    .use(connect.cookieParser())
                    .use(connect.session({ secret: ' pink hippos can\'t fly at noon '}))
                    .use('/anagram', getAnagram)
                    .use(function(req, res){
                        res.end('Hello from Connect!\n');
                });

                http.createServer(app).listen(3000);
                console.log("Server created on port 3000");
            }
        )
    }
);