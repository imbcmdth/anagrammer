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

				console.log('Anagrammer ready, give me some words:');
				console.log(wordUtils.partsOfSpeechDescriptions);
				repl.start({
					'eval': function (line, context, filename, callback) {
						line = line.replace(wordUtils.cleanRe, '');
						var partsOfSpeech = wordUtils.getPartsOfSpeech(line);
						line = line.replace(wordUtils.partsofSpeechRe, '');

						var reqWildcardCount = wordUtils.getMatchCount(line, wordUtils.reqWildcardRe);
						var optWildcardCount = wordUtils.getMatchCount(line, wordUtils.optWildcardRe);
						var letterCounts = wordUtils.countLetters(line.toLowerCase());

						var bucket = tree.findWords(letterCounts, reqWildcardCount, optWildcardCount, partsOfSpeech);

						var response = {};
						var isEmpty = true;

						for(var POS in bucket) {
							if(bucket.hasOwnProperty(POS)) {
								isEmpty = false;
								var description = wordUtils.formatPartsOfSpeech(POS);
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


