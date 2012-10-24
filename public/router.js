app.AnagramRouter = Backbone.Router.extend({
	routes: {
		"anagram/:anagram": "getAnagram"
	}
});
// Instantiate the router
var app_router = new app.AnagramRouter;
app_router.on('route:getAnagram', function (anagram) {
	var anagramObj = new app.Anagram({id: anagram});

	setIfValueDiffers("#anagram-input", anagram);

	anagramObj.fetch({
		success: function (model) {
			var anagram_view = new app.AnagramView({ el: $("#anagram_container") });
			anagram_view.render(model.attributes);
		}
	});
});

function setIfValueDiffers(element, value) {
	var anagramInput = $(element);
	if(anagramInput.val() !== value) anagramInput.val(value);
}