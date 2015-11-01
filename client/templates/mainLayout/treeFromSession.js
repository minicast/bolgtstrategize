Template.treeFromSession.helpers({
  rendered: function(){

  },
  session: function session() {
    return Session.get("mode");
  }
});
