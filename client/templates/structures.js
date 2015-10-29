Template.showStructuresCollection.helpers({
  // rendered: ->
  structures: function() {
    return Structures.find();
  }
});

// Template.showStructuresCollection.events({
//   // rendered: ->
//   'click button':  function(event, template) {
//     a = event.currentTarget
//     console.log(a);
//     $(event.target).parent().children(".toggleable").toggle();
//   }
// });

// Template.structureTemplate.onRendered(function() {
//   MathJax.Hub.Typeset();
//   console.log("mathjax");
// });

Template.structureTemplate.events({
  // rendered: function() {
  //   MathJax.Hub.Typeset()
  // },
  'click .btn-structure':  function(event, template) {
    event.preventDefault();
    $(event.currentTarget).parent().children(".toggleable").toggle();
  }
});

Template.structureTemplate.rendered = function(){
  // var formula = new Formula({ascii: Template.parentData(0).ascii})
  Deps.autorun(function(){

    var structure = new Structure({ascii: Template.parentData(0).ascii});
    var metaDomainSize = structure.metaDomainSize();

    graph = addLinks2structureGraph(structurePeg2graph(qmls.parse(
      Template.parentData(0).ascii
    )))

    // ************** Generate the tree diagram  *****************
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 300 + 20 * metaDomainSize / 5 - margin.right - margin.left,
    height = 250 + 20 * metaDomainSize / 5 - margin.top - margin.bottom,
    edgeLenght = 80;
    var color =  function() {return 'LightSteelBlue';}; //DarkSeaGreen Aquamarine d3.scale.category20();

    // var svg = d3.select("#d3svg" + Template.parentData(0)._id)
    var svg = d3.select("#d3svg-graph")
      .append("svg").attr("height",height).attr("width",width);

    /* Build the directional arrows for the links/edges */
    svg.append("svg:defs").selectAll("marker").data(["end"])
      .enter()
        .append("svg:marker")
            .attr("id", String)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 18)
            .attr("refY", 0)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
        .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5")
            .style("fill", "#ccc")
            .style("stroke", "#ccc")
            // .style("opacity", "0.5")
            ;

    /* Establish the dynamic force behavor of the nodes */
    var force = d3.layout.force().size([width,height])
      .nodes(graph.nodes)
      .links(graph.links)
      .linkDistance([edgeLenght])
      .charge([-1000])
      .gravity(0.3)
      .start();

    /* Draw the edges/links between the nodes */
    var edges = svg.selectAll("line").data(graph.links)
      .enter()
          .append("line")
              .style("stroke", "#ccc")
              .style("stroke-width", 2)
              .style("opacity", "0.7")
              .attr("marker-end", "url(#end)");

    /* Draw the nodes themselves */
    var nodes = svg.selectAll("circle").data(graph.nodes)
        .enter()
          .append("circle")
            .attr("r", 10)
            // .attr("opacity", 0.5)
            .style("fill", function(d,i) { return color(i); })
            .call(force.drag);

    nodes.append("title").text(function(d) { return d.hoverContent; });

    var labels = svg.selectAll("nodes").data(graph.nodes)
      .enter()
        .append("text")
          .attr("fill", "SteelBlue") /*PineGreen*/
          .attr("font-family", "sans-serif")
          .attr("font-size", "17px")
          .attr('x', 7).attr('y', 3)
          // .attr("x", function(d) { return d.x + 10; })
          .style("text-anchor", "start")
          // .text(function(d) { return d.valuation; });
          .text(function(d) { return d.name; });

    /* Run the Force effect */
    force.on("tick", function() {
     edges.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });
     nodes.attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
     // texts.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
     labels.attr("transform", function(d) { return "translate(" + (d.x + 7) + "," + (d.y + 5) + ")"; });
    }); // End tick func

  });
};
