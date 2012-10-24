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

						var response = tree.findWords(letterCounts, reqWildcardCount, optWildcardCount, partsOfSpeech);

						var isEmpty = true;

						for(var POS in response.words) {
							if(response.words.hasOwnProperty(POS)) {
								isEmpty = false;
								var description = wordUtils.formatPartsOfSpeech(POS);
								response.words[description] = response.words[POS];
								delete response.words[POS];
							}
						}

						if(response.count > 0) {
							console.log("Here's what I found:");
							callback(null, response.words);
						} else {
							callback(null, "No matches found.");
						}
					}
				});
			});
	});


