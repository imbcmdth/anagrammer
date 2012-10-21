var sort = require('./inplace_qsort.js');

function ATree(){
	this._T = [];
}

ATree.prototype = {
	addWord: function (wordCode, word, partsOfSpeech) {
		var location = this.makeLocation(wordCode);

		partsOfSpeech.forEach(function(POS){
			if(location[POS] == null)
				location[POS] = [];

			location[POS].push(word);
		});
	},

	makeLocation: function (wordCode, d) {
		var nextCursor,
		    cursor = this._T,
		    len = wordCode.length - 1;

		wordCode.forEach(function(e, i){
			nextCursor = cursor[e];
			if(nextCursor == null) {
				if(i === len) 
					nextCursor = {};
				else
					nextCursor = [];
				cursor[e] = nextCursor;
			}
			cursor = nextCursor;
		});
		return cursor;
	},

	findWords: function (wordCode, numPlaceholders, numWildcards, partsOfSpeech) {
		var cursor,
		    count,
		    maxCodePos = wordCode.length,
		    wordCodeStack = [wordCode],
		    wildcardStack = [numWildcards],
		    placeHolderStack = [numPlaceholders],
		    cursorStack = [this._T],
		    results = {};

		while(cursorStack.length) {
			wordCode = wordCodeStack.pop();
			cursor = cursorStack.pop();
			numWildcards = wildcardStack.pop();
			numPlaceholders = placeHolderStack.pop();
			var totalVariableLetters = numWildcards + numPlaceholders;

			if(wordCode.length > 0) {
				count = wordCode.shift();
				for(var w = 1; w <= totalVariableLetters; w++) {
					if(cursor[count + w] != null) {
						wordCodeStack.push(wordCode.slice());
						placeHolderStack.push(Math.max(numPlaceholders - w, 0));
						wildcardStack.push(numWildcards - Math.max(w - numPlaceholders, 0));
						cursorStack.push(cursor[count + w]);
					}
				}

				if(cursor[count] != null) {
					wordCodeStack.push(wordCode);
					placeHolderStack.push(numPlaceholders);
					wildcardStack.push(numWildcards);
					cursorStack.push(cursor[count]);
				}
			} else if(numPlaceholders === 0) {
				for(var POS in cursor) {
					if(cursor.hasOwnProperty(POS)) {
						if (partsOfSpeech.indexOf(POS) >= 0) {
							if(results[POS] == null) results[POS] = [];
							results[POS].push.apply(results[POS], cursor[POS]);
						}
					}
				}
			}
		}

		for(var POS in results) {
			if(results.hasOwnProperty(POS)) {
				sort(results[POS]);
			}
		}

		return results;
	}
};

module.exports = ATree;