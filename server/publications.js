Meteor.publish('viewGames', function() {
  return ViewGames.find({});
});

Meteor.publish('structures', function() {
  return Structures.find({});
});

// Meteor.publish('formulas', function() {
//   return Formulas.find({});
// });
