app.AnagramView = Backbone.View.extend({
	render: function(anagrams) {
		var template = _.template( $("#anagram_template").html(), anagrams );
		this.$el.html( template );
	},
	events: {
	}
});