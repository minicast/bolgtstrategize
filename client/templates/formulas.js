// Template.showFormulasCollection.helpers
//   rendered: ->
//
//   formulas: ->
//     Formulas.find()

Template.showFormulasCollection.helpers({
  // rendered: ->
  formulas: function() {
    return Formulas.find();
  }
});

// Template.showFormulasCollection.events({
//   // rendered: ->
//   'click button':  function(event, template) {
//     a = event.currentTarget
//     console.log(a);
//     $(event.target).parent().children(".toggleable").toggle();
//   }
// });

Template.formulaTemplate.events({
  // rendered: ->
  'click .btn-formula':  function(event, template) {
    $(event.currentTarget).parent().children(".toggleable").toggle();
  }
});

// D3 render template
Template.formulaTemplate.rendered = function(){
  var formula = new Formula({ascii: Template.parentData(0).ascii})
  Deps.autorun(function(){
    var leafNodeWidth = 60; // horizonthal distance between nodes
    var edgeLenght = 40; // vertical distance between nodes
    // ************** Generate the tree diagram  *****************
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
      // width = 300 - margin.right - margin.left,
      // height = 200 - margin.top - margin.bottom,
      width = formula.branch(formula.peg()) * leafNodeWidth,
      height = formula.depth(formula.peg()) * edgeLenght,
       nodeSeparation = 7;

    var i = 0, duration = 750, root;

    var tree = d3.layout.tree()
      .size([width, height])
      .separation(function() {return nodeSeparation;});

    var diagonal = d3.svg.diagonal()
     // .projection(function(d) { return [d.y, d.x]; });

    // var svg = d3.select("body").append("svg")
    // var svg = d3.select("#d3svg" + Template.parentData(0)._id).append("svg")
    var svg = d3.select("#d3svg-tree").append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
        .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var treeData = [
      formulaPeg2tree(
        qmlf.parse(Template.parentData(0).ascii)
      )
    ];

    // console.log('treeData: ', treeData);

    root = treeData[0];

    // update(root);
    update(root);
    root.x0 = width / 2;
    root.y0 = margin.top * 2;
    root.x = width / 2;
    root.y = margin.top * 2; //height;

function update(source) {

      // Compute the new tree layout.
      var nodes = tree.nodes(root).reverse(),
        links = tree.links(nodes);

      // Normalize for fixed-depth.
      nodes.forEach(function(d) { d.y = d.depth * edgeLenght + margin.top * 2; });

      // Declare the nodes…
      var node = svg.selectAll("g.node")
        .data(nodes, function(d) { return d.id || (d.id = ++i); });

      // Enter any new nodes at the parent's previous position.
      var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
          return "translate(" + 1 + "," + 1 + ")";
        });

      // nodeEnter.append("circle")
        // .attr("r", 10)
        // .style("fill", "#fff");

        nodeEnter.append("title").text(function(d) {
          return d.hoverLabel // ? "click to expand" : "atomic syntax element";
        });

      nodeEnter.append("text")
        // .attr("x", function(d) {
          // return d.children || d._children ? -13 : 13; })
        // .attr("dy", ".5em")
        // .attr("text-anchor", function(d) {
          // return d.children || d._children ? "end" : "start"; })
        .attr("text-anchor", 'middle')
        .text(function(d) {
          // return d._children ? d.unexpanded : ascii2unicode(d.name);
          return d.hoverLabel // ascii2unicode(d.name);
        })
        .style("fill", "black"
          // function(d) { return d._children ? "FireBrick" : "#00f"; }
        )
        .style("fill-opacity", 1)
        .style("font-size", 20)
        .style("padding", 3);
        // .style("margin", 30);

      // var rectHeight = d3.select('text').style('height');
      // var rectHeight = d3.select('text').node().getBBox().height;
      // var rectWidth = d3.select('text').node().getBBox().width;

      /*
      nodeEnter.append("rect")
        .attr("width", function(d) {
            // var w = this.previousElementSibling.scrollWidth;
            var w;
            // if (d._children) w = this.previousElementSibling.clientWidth + 10;
            if (d.children) w = this.previousElementSibling.clientWidth + 10;
            else w = 60;
            // console.log(w);
            // var l;
            // d._children ? l = d.unexpanded.length : l = d.name.length;
            // return l * 6 + 7;
            return w;
          })
        .attr('height', function(){ return this.previousElementSibling.clientHeight + 10;})
        .attr('rx', 5).attr('ry', 5)
        .style("fill", "yellow") //#5bc0de #D2E4D2 .style('stroke-color', "#D2E4D2").style('stroke', "1")
        .style('opacity', '0.5')
        .attr('transform', function(d){
            var xdev, ydev;
            if (d._children) xdev = (this.previousElementSibling.clientWidth+10)/2;
            else xdev = 30;
            ydev = (this.previousElementSibling.clientHeight+10)/2;
            return "translate("+ -xdev + ',' + -ydev + ')';
        });
        */

      // Transition nodes to their new position.
      var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + (0 + d.x) + "," + d.y + ")"; });

      // nodeUpdate.select("circle")
       //  .attr("r", 10)
       //  .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

       nodeUpdate.select("title").text(function(d) {
         return d.hoverLabel // return d.name  //d._children ? "click to expand" : "atomic syntax element";
       });

      nodeUpdate.select("text")
        .text(function(d) {
          // return d._children ? d.unexpanded : d.name;
          // return ascii2unicode(d.name);
          return formula.unicode(d.name);
        })
        .style("fill", function(d) {
          // return d._children ? "FireBrick" : "#00f";
          return "black" ;
        })
        .style("cursor", function(d) {
          return "pointer" //d._children ? "pointer" : "not-allowed";
        })
        .style("font-size", 20)
        .style("fill-opacity", 1);

      // nodeUpdate.select("rect")
      //   .attr("width", function(d) {
      //       var w;
      //       // if (d._children) w = this.previousElementSibling.clientWidth + 10;
      //       if (d.children) w = this.previousElementSibling.clientWidth + 10;
      //       else w = 60;
      //       return w;
      //     })
      //   .attr('height', function() { return this.previousElementSibling.clientHeight + 10;} )
      //   .attr('rx', 5).attr('ry', 5)
      //   // .style("fill", function(d) { return d._children ? "#f00" : "#5bc0de"; }) //#D2E4D2  "lightsteelblue"
      //   .style("fill", function(d) {
      //     return d.color;
      //   })
      //   .style("cursor", function(d) { return d._children ? "pointer" : "not-allowed"; })
      //   //.style('stroke-color', function(d) { return d._children ? "#f00" : "#D2E4D2"; })
      //   //.style('stroke', "1")
      //   .style('opacity', '0.5')
      //   .attr('transform', function(d){
      //       var xdev, ydev;
      //       // if (d._children) xdev = (this.previousElementSibling.clientWidth+10)/2;
      //       if (d.children) xdev = (this.previousElementSibling.clientWidth+10)/2;
      //       else xdev = 30;
      //       ydev = (this.previousElementSibling.clientHeight+10)/2 + 5;
      //       return "translate("+ -xdev + ',' + -ydev + ')';
      //   });

      // Transition exiting nodes to the parent's new position.
      var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + source.x + "," + source.y + ")"; })
        .remove();

      // nodeExit.select("circle")
       //  .attr("r", 1e-6);

      nodeExit.select("rect")
        .attr("width", 0)
        .attr('height', 0);

      nodeExit.select("text")
        .style("fill-opacity", 1e-6);

      // var ctx = document.getElementById("svgid"),
      // textElm = ctx.getElementById("text"),
      // SVGRect = textElm.getBBox();

      // var h = $('text').height()+11;
      // var w = $('text').width()+11;

      // $('rect').attr({'x': SVGRect.x-5, 'y': SVGRect.y-5, 'height': h, 'width': w, 'fill': 'pink'});

      // Update the links…
      // Declare the links…
      var link = svg.selectAll("path.link")
        .data(links, function(d) { return d.target.id; });

      // Enter the links.
      // link.enter().insert("path", "g")
       //  .attr("class", "link")
       //  .attr("d", diagonal);

      // Enter any new links at the parent's previous position.
      link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", function(d) {
          // var o = {x: source.x0, y: source.y0};
          var o = {x: 1, y: 1};
          return diagonal({source: o, target: o});
        });

      // Transition links to their new position.
      link.transition()
        .duration(duration)
        .attr("d", diagonal);

      // Transition exiting links to the parent's new position.
      link.exit().transition()
        .duration(duration)
        .attr("d", function(d) {
          var o = {x: source.x, y: source.y};
          return diagonal({source: o, target: o});
        })
        .remove();

      // Stash the old positions for transition.
      nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });

    // Toggle children on click.
    // function click(d) {
    //   if (d.children) {
    //   // d._children = d.children;
    //   // d.children = null;
    //   } else {
    //   d.children = d._children;
    //   d._children = null;
    //   }
    //   update(d);
    // }


/*   classic tree

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
   links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * edgeLenght; });

  // Declare the nodesâ€¦
  var node = svg.selectAll("g.node")
   .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter the nodes.
  var nodeEnter = node.enter().append("g")
   .attr("class", "node")
   .attr("transform", function(d) {
    return "translate(" + d.y + "," + d.x + ")"; });

  nodeEnter.append("circle")
   .attr("r", 10)
   .style("fill", "#fff");

  nodeEnter.append("text")
   .attr("x", function(d) {
    return d.children || d._children ? -13 : 13; })
   .attr("dy", ".35em")
   .attr("text-anchor", function(d) {
    return d.children || d._children ? "end" : "start"; })
   .text(function(d) { return d.name; })
   .style("fill-opacity", 1);

  // Declare the linksâ€¦
  var link = svg.selectAll("path.link")
   .data(links, function(d) { return d.target.id; });

  // Enter the links.
  link.enter().insert("path", "g")
   .attr("class", "link")
   .attr("d", diagonal);

*/

}

    });
};
