FlowRouter.route( '/', {
  name: 'home',
  action: function() {
    BlazeLayout.render( 'applicationLayout', {
      header: 'headerTemplate',
      main: 'mainContent',
      // footer: 'footerTemplate',
    } );
  },
});



FlowRouter.route( '/terms', {
  triggersEnter: [ function() {
    console.log( "Something to do on ENTER." );
  }],
  action: function() {
    // Do whatever we need to do when we visit http://app.com/terms.
    BlazeLayout.render( 'applicationLayout', {
      header: 'headerTemplate',
      sidebar: 'sidebarTemplate',
      main: 'termsOfService',
      footer: 'footerTemplate',
    } );
    console.log( "Okay, we're on the Terms of Service page!" );
  },
  triggersExit: [ function() {
    console.log( "Something to do on EXIT." );
  }],
  name: 'termsOfService' // Optional route name.
});

FlowRouter.route( '/documents/:_id', {
  action: function( params, queryParams ) {
    BlazeLayout.render( 'applicationLayout', {
      header: 'headerTemplate',
      sidebar: 'sidebarTemplate',
      main: 'termsOfService',
      footer: 'footerTemplate',
    } );
    console.log( params._id );
    console.log( queryParams );
  }
});



var groupRouter = FlowRouter.group({
  prefix: '/groupRouter',
  triggersEnter: [ function(){
    console.log( "ENTER ACCOUNT ROUTE!" );
  }],
  triggersExit: [ function(){
    console.log( "EXIT ACCOUNT ROUTE!" );
  }]
});

// http://app.com/documents
groupRouter.route( '/', {
  action: function() {
    console.log( "We're viewing a route inside groupRouter." );
  }
});

// http://app.com/documents/:_id
groupRouter.route( '/:_id', {
  action: function() {
    console.log( "We're viewing a single document." );
  }
});

// http://app.com/documents/:_id/edit
groupRouter.route( '/:_id/edit', {
  action: function() {
    console.log( "We're editing a single document." );
  }
});

FlowRouter.triggers.enter( [ enterFunction ], {
  only: [
    'somePage',
    'anotherPage',
    'thisPage'
  ]
}); // use route name
FlowRouter.triggers.exit( [ exitFunction ], {
  except: [
    'page',
    'notThisPage',
    'thatPage'
  ]
}); // use route name

function enterFunction() {
  console.log( "Entering a route!" );
}

function exitFunction() {
  console.log( "Exiting a route!" );
}





FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render("mainLayout", {content: "blogHome"});
  }
});

FlowRouter.route('/:postId', {
  action: function() {
    BlazeLayout.render("mainLayout", {content: "blogPost"});
  }
});


FlowRouter.route('/blog/:category/:postId', {
  name: 'blogPost',
  action: function(params, queryParams) {
    console.log("This is the category:", params.category);
    console.log("This is the postId:", params.postId);
    console.log("These are the queryParams:", queryParams);
  }
});


// group routes

var adminSection = FlowRouter.group({
  prefix: "/admin"
});

// for the /admin page
adminSection.route('/', {
  action: function() {
    console.log("inside / route");
  }
});

// for the /admin/new-post page
adminSection.route('/new-post', {
  action: function() {
    console.log("inside /new-post route");
  }
});

// nested groups
var superAdminSection = adminSection.group({
  prefix: "/super"
});

superAdminSection.route('/access-control', {
  action: function() {
    console.log("inside super/access-control route");
  }
})
