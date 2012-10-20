var sort = require('./inplace_qsort.js');

function ATree(){
	this._T = [];
}

ATree.prototype = {
	addWord: function (wordCode, word) {
		var location = this.makeLocation(wordCode);

		location.push(word);
	},

	makeLocation: function (wordCode, d) {
		var nextCursor,
		    cursor = this._T,
		    len = wordCode.length - 1;

		wordCode.forEach(function(e, i){
			nextCursor = cursor[e];
			if(nextCursor == null) {
				nextCursor = [];
				cursor[e] = nextCursor;
			}
			cursor = nextCursor;
		});
		return cursor;
	},

	findWords: function (wordCode, numPlaceholders, numWildcards) {
		var cursor,
		    count,
		    maxCodePos = wordCode.length,
		    wordCodeStack = [wordCode],
		    wildcardStack = [numWildcards],
		    placeHolderStack = [numPlaceholders],
		    cursorStack = [this._T],
		    results = [];

		while(cursorStack.length) {
			wordCode = wordCodeStack.pop();
			count = wordCode.shift();
			cursor = cursorStack.pop();
			numWildcards = wildcardStack.pop();
			numPlaceholders = placeHolderStack.pop();
			var totalVariableLetters = numWildcards + numPlaceholders;

			if(count != null) {
				if(cursor[count] != null) {

					for(var w = 1; w <= totalVariableLetters; w++) {
						if(cursor[count + w] != null) {
							wordCodeStack.push(wordCode.slice());

							placeHolderStack.push(Math.max(numPlaceholders - w, 0));
							wildcardStack.push(numWildcards - Math.max(w - numPlaceholders, 0));
							cursorStack.push(cursor[count + w]);
						}
					}

					placeHolderStack.push(numPlaceholders);
					wordCodeStack.push(wordCode);
					wildcardStack.push(numWildcards);
					cursorStack.push(cursor[count]);
				}
			} else if(numPlaceholders === 0) {
				results.push.apply(results, cursor);
			}
		}

		return sort(results);
	}
};

module.exports = ATree;