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
