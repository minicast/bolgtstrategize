Template.showViewGamesCollectionSimple.helpers({
  // rendered: ->
  viewGames: function() {
    return ViewGames.find({},{sort: {createdAt: -1}, limit: 7});
  }
});

Template.viewGameTemplateSimple.events({
  // rendered: ->
  "click": function(event, template) {
    $("#d3svg-game").empty();
    console.log(template.data);
    Session.set('currentGame', template.data);
  }
});


// D3 render template
Template.viewGameTemplateSimple.rendered = function(){
}
