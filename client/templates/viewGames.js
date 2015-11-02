Template.showViewGamesCollection.helpers({
  // rendered: ->
  viewGames: function() {
    // return ViewGames.find({},{sort: {createdAt: -1}, limit: 1});
    return [Session.get('currentGame')];
  }
});

Template.viewGameTemplate.events({
  // rendered: ->
  "click .btn-game": function(event, template) {
    $(event.currentTarget).parent().children(".toggleable").toggle();
  },
  "click #gameForm": function(event, template) {
    // var el = template.find("#d3svg-game");
    $("#d3svg-game").empty();
    Session.set("mode", "strategicForm");
    var id = template.data._id;
    // ViewGames.update({_id:id}, {$set:{
    //   createdAt: JSON.stringify(Date.now())
    // }});
    // var formula = new Formula({ascii: Template.parentData(0).formulaAscii});
    // var structure = new Formula({ascii: Template.parentData(0).structureAscii});
    var formula = new Formula({ascii: Session.get('currentGame').formulaAscii});
    var structure = new Formula({ascii: Session.get('currentGame').structureAscii});
    var gameTree = formulaStructure2Game(
      // qmlf.parse(Template.parentData(0).formulaAscii),
      // qmls.parse(Template.parentData(0).structureAscii),
      qmlf.parse(Session.get('currentGame').formulaAscii),
      qmls.parse(Session.get('currentGame').structureAscii),
      "w" //replace this with the first possible world in the model
    );
    var leafsNo = leafsInGameTree(gameTree);
    var treeDepth = depthOfGameTree(gameTree);
    Session.set("treeData", [gameTree]);

    // ViewGames.update({_id: "iPCzi7ERb2dTxdcRc"}, {$set: {createdAt: Date.now()}});
    makeD3treeFromGameData(formula, structure, gameTree, leafsNo, treeDepth, "#d3svg-game svg");

    // $(event.currentTarget).parent().children(".toggleable").toggle();
  },
  "click #colorize": function(event, template) {
    $("#d3svg-game").empty();
    Session.set("mode", "colorize");
    // var formula = new Formula({ascii: Template.parentData(0).formulaAscii});
    // var structure = new Formula({ascii: Template.parentData(0).structureAscii});
    var formula = new Formula({ascii: Session.get('currentGame').formulaAscii});
    var structure = new Formula({ascii: Session.get('currentGame').structureAscii});

    var gameTree = colorize(
      formulaStructure2Game(
        // qmlf.parse(Template.parentData(0).formulaAscii),
        // qmls.parse(Template.parentData(0).structureAscii),
        qmlf.parse(Session.get('currentGame').formulaAscii),
        qmls.parse(Session.get('currentGame').structureAscii),
        "w"
      )
    ); //colorize
    var leafsNo = leafsInGameTree(gameTree);
    var treeDepth = depthOfGameTree(gameTree);
    Session.set("treeData", [gameTree]);
    makeD3treeFromGameData(formula, structure, gameTree, leafsNo, treeDepth, "#d3svg-game svg");
  },
  "click #synthesizeVerif": function(event, template) {
    $("#d3svg-game").empty();
    // var formula = new Formula({ascii: Template.parentData(0).formulaAscii});
    // var structure = new Formula({ascii: Template.parentData(0).structureAscii});
    var formula = new Formula({ascii: Session.get('currentGame').formulaAscii});
    var structure = new Formula({ascii: Session.get('currentGame').structureAscii});

    var gameTree = getWinningStrategy(
        colorize(
          formulaStructure2Game(
            // qmlf.parse(Template.parentData(0).formulaAscii),
            // qmls.parse(Template.parentData(0).structureAscii),
            qmlf.parse(Session.get('currentGame').formulaAscii),
            qmls.parse(Session.get('currentGame').structureAscii),
            "w"
          )
        ) //colorize
      // , "falsifier") //winningStrategy
      , "verifier"); //winningStrategy
    var leafsNo = leafsInGameTree(gameTree);
    var treeDepth = depthOfGameTree(gameTree);

    Session.set("treeData", [gameTree]);
    Session.set("mode", "synthesizeVerif");
    // console.log("synthesizeVerif");
    makeD3treeFromGameData(formula, structure, gameTree, leafsNo, treeDepth, "#d3svg-game svg");

  },
  "click #synthesizeFalsi": function(event, template) {
    $("#d3svg-game").empty();
    Session.set("mode", "synthesizeFalsi");
    // var formula = new Formula({ascii: Template.parentData(0).formulaAscii});
    // var structure = new Formula({ascii: Template.parentData(0).structureAscii});
    var formula = new Formula({ascii: Session.get('currentGame').formulaAscii});
    var structure = new Formula({ascii: Session.get('currentGame').structureAscii});
    var gameTree = getWinningStrategy(
        colorize(
          formulaStructure2Game(
            // qmlf.parse(Template.parentData(0).formulaAscii),
            // qmls.parse(Template.parentData(0).structureAscii),
            qmlf.parse(Session.get('currentGame').formulaAscii),
            qmls.parse(Session.get('currentGame').structureAscii),
            "w"
          )
        ) //colorize
      , "falsifier"); //winningStrategy
    var leafsNo = leafsInGameTree(gameTree);
    var treeDepth = depthOfGameTree(gameTree);

    Session.set("treeData", [gameTree]);
    // console.log("synthesizeFalsi");
    makeD3treeFromGameData(formula, structure, gameTree, leafsNo, treeDepth, "#d3svg-game svg");
  }
});


// D3 render template
Template.viewGameTemplate.rendered = function(){
  // var formula = new Formula({ascii: Template.parentData(0).formulaAscii});
  // var structure = new Formula({ascii: Template.parentData(0).structureAscii});
  var formula = new Formula({ascii: Session.get('currentGame').formulaAscii});
  var structure = new Formula({ascii: Session.get('currentGame').structureAscii});
  var gameTree = formulaStructure2Game(
    // qmlf.parse(Template.parentData(0).formulaAscii),
    // qmls.parse(Template.parentData(0).structureAscii),
    qmlf.parse(Session.get('currentGame').formulaAscii),
    qmls.parse(Session.get('currentGame').structureAscii),
    "w" //replace this with the first possible world in the model
  );
  var leafsNo = leafsInGameTree(gameTree);
  var treeDepth = depthOfGameTree(gameTree);
  // console.log('leafsNo', leafsNo);

  // console.log(gameTree);

  // Tracker.autorun(
  Deps.autorun(
    makeD3treeFromGameData(formula, structure, gameTree, leafsNo, treeDepth, "#d3svg-game")
  );
};

function makeD3treeFromGameData(formula, structure, gameTree, leafsNo, treeDepth, svgElement) {
      // console.log(gameTree);

      var leafNodeWidth = 85; // horizonthal distance between nodes
      var edgeLenght = 70; // vertical distance between nodes
      // ************** Generate the tree diagram  *****************
      var margin = {top: 20, right: 10, bottom: 10, left: 10},
        // width = 300 - margin.right - margin.left,
        // height = 200 - margin.top - margin.bottom,
        width = leafsNo * leafNodeWidth,
        height = treeDepth * edgeLenght,
         nodeSeparation = 7;

      var i = 0, duration = 750, root;

      var tree = d3.layout.tree()
        .size([width, height])
        .separation(function() {return nodeSeparation;});

      var diagonal = d3.svg.diagonal();
       // .projection(function(d) { return [d.y, d.x]; });

      // var svg = d3.select("body").append("svg")
      // var svg = d3.select("#d3svg" + Template.parentData(0)._id).append("svg")
      var svg = d3.select("#d3svg-game")
        .append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
          .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // console.log(Session.get("mode"));

      var treeData = [ gameTree ];
        // var treeData = [
        //     formulaStructure2Game(
        //       qmlf.parse(Template.parentData(0).formulaAscii),
        //       qmls.parse(Template.parentData(0).structureAscii),
        //       "w"
        //     )
        //   ];


      // if(Session.get("mode")==="strategicForm") {
      //   var treeData = [
      //       formulaStructure2Game(
      //         qmlf.parse(Template.parentData(0).formulaAscii),
      //         qmls.parse(Template.parentData(0).structureAscii),
      //         "w"
      //       )
      //     ];
      // } else if(Session.get("mode")==="colorize") {
      //   var treeData = [
      //     // getWinningStrategy(
      //       colorize(
      //         formulaStructure2Game(
      //           qmlf.parse(Template.parentData(0).formulaAscii),
      //           qmls.parse(Template.parentData(0).structureAscii),
      //           "w"
      //         )
      //       ) //colorize
      //     // , "falsifier") //winningStrategy
      //     // , "verifier") //winningStrategy
      //   ];
      // } else if(Session.get("mode")==="synthesizeVerif") {
      //   var treeData = [
      //     getWinningStrategy(
      //       colorize(
      //         formulaStructure2Game(
      //           qmlf.parse(Template.parentData(0).formulaAscii),
      //           qmls.parse(Template.parentData(0).structureAscii),
      //           "w"
      //         )
      //       ) //colorize
      //     // , "falsifier") //winningStrategy
      //     , "verifier") //winningStrategy
      //   ];
      // } else { //if(Session.get("mode")==="synthesizeFalsi")
      //   var treeData = [
      //     getWinningStrategy(
      //       colorize(
      //         formulaStructure2Game(
      //           qmlf.parse(Template.parentData(0).formulaAscii),
      //           qmls.parse(Template.parentData(0).structureAscii),
      //           "w"
      //         )
      //       ) //colorize
      //     , "falsifier") //winningStrategy
      //     // , "verifier") //winningStrategy
      //   ];
      // }

      // console.log('treeData: ', treeData);

      root = treeData[0];

      // update(root);
      root.x0 = width / 2;
      root.y0 = margin.top * 2;
      root.x = width / 2;
      root.y = margin.top * 2; //height;
      update(root);

      function update(source) {

        // Compute the new tree layout.
        var nodes = tree.nodes(root).reverse(),
          links = tree.links(nodes);

        // Normalize for fixed-depth.
        nodes.forEach(function(d) { d.y = d.depth * edgeLenght + margin.top * 2; });

        // Declare the nodes…
        var node = svg.selectAll("g.node")
          .data(nodes, function(d) { return d.id || (d.id = ++i); });

        // Enter the nodes.
        // var nodeEnter = node.enter().append("g")
         //  .attr("class", "node")
         //  .attr("transform", function(d) {
          //   return "translate(" + d.x + "," + d.y + ")"; });

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
            if (d.strokeColor === "red") {
              return d.player ? "move by " + d.player + "\nwinning strategy for falsifier" : "leaf node";
            }
            else if (d.strokeColor === "green") {
              return d.player ? "move by " + d.player + "\nwinning strategy for verifier" : "leaf node";
            } else {
              return d.player ? "move by " + d.player + "\nunknown winning strategy" : "leaf node";
            }
          //   return d._children ? "click to expand" : "atomic syntax element";
          })
          .style('cursor', 'help');

        nodeEnter.append("text")
          // .attr("x", function(d) {
            // return d.children || d._children ? -13 : 13; })
          // .attr("dy", ".5em")
          // .attr("text-anchor", function(d) {
            // return d.children || d._children ? "end" : "start"; })
          .attr("text-anchor", 'middle')
          .text(function(d) {
            // return d._children ? d.unexpanded : ascii2unicode(d.name);
            // return ascii2unicode(d.name);
            return formula.unicode(d.name);
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

        // /*
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
          .style("fill", "#5bc0de") //#D2E4D2 .style('stroke-color', "#D2E4D2").style('stroke', "1")
          .style("stroke", function(d){
            if (d.strokeColor)
              return d.strokeColor;
            // if (d.player === "verifier")
            //   return "PaleGreen";
            // else if (d.player === "falsifier")
            //   return "Pink";
            // else if (d.player === "swaper")
            //   return "yellow";
            // else if (d.player === "checker")
            //   return "blue";
            else
              // return "black";
              return d.color;
          })
          .style("stroke-width", 3)
          .style('opacity', '0.5')
          .style("cursor", function(d) {
            return "help"; //d._children ? "pointer" : "not-allowed";
          });

        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
          .duration(duration)
          .attr("transform", function(d) { return "translate(" + (0 + d.x) + "," + d.y + ")"; });

        // nodeUpdate.select("circle")
         //  .attr("r", 10)
         //  .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

        nodeUpdate.select("title").text(function(d) {
          if (d.strokeColor === "red") {
            return d.player ? "move by " + d.player + "\nwinning strategy for falsifier" : "leaf node";
          } else if (d.strokeColor === "green") {
            return d.player ? "move by " + d.player + "\nwinning strategy for verifier" : "leaf node";
          } else {
            return d.player ? "move by " + d.player + "\nunknown winning strategy" : "leaf node";
          }
        }).style('cursor', 'help');

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
          // .style("cursor", function(d) { return "pointer"; })
          .style("font-size", 20)
          .style("fill-opacity", 1);

        nodeUpdate.select("rect")
          .attr("width", function(d) {
              var w;
              // if (d._children) w = this.previousElementSibling.clientWidth + 10;
              if (d.children) w = this.previousElementSibling.clientWidth + 10;
              else w = 60;
              return w;
            })
          .attr('height', function() { return this.previousElementSibling.clientHeight + 10;} )
          .attr('rx', 10).attr('ry', 10)
          // .style("fill", function(d) { return d._children ? "#f00" : "#5bc0de"; }) //#D2E4D2  "lightsteelblue"
          .style("fill", function(d) {
            if (d.strokeColor) {
              return d.strokeColor;
            } else {
              return d.color;
            }
          })
          .style("stroke", function(d){
              return d.color;
          })
          .style("stroke-width", 5)
          // .style("cursor", function(d) { return d._children ? "pointer" : "not-allowed"; })
          //.style('stroke-color', function(d) { return d._children ? "#f00" : "#D2E4D2"; })
          //.style('stroke', "1")
          .style('opacity', '0.5')
          .attr('transform', function(d){
              var xdev, ydev;
              // if (d._children) xdev = (this.previousElementSibling.clientWidth+10)/2;
              if (d.children) xdev = (this.previousElementSibling.clientWidth+10)/2;
              else xdev = 30;
              ydev = (this.previousElementSibling.clientHeight+10)/2 + 5;
              return "translate("+ -xdev + ',' + -ydev + ')';
          });

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
          .duration(duration)
          .attr("transform", function(d) { return "translate(" + source.x + "," + source.y + ")"; })
          .remove();

        nodeExit.select("rect")
          .attr("width", 0)
          .attr('height', 0);

        nodeExit.select("text")
          .style("fill-opacity", 1e-6);

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
      }
}





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



      /*
        var dataset = ["d", "3", "s", "v", "g"];

        var text = svg.selectAll("text").data(dataset);

        text.enter().append("text")
            .text(function(d) { return d; })
            .attr("x", function(d, i) {
                    return i * (w / dataset.length);
               })
               .attr("y", function(d) {
                    return 25; //h - (d * 4);
               });
      */

        // var bars = svg.selectAll("rect").data(["s","v","g"]);
        // bars.enter().append("rect")
            // .attr("x", 5).attr("y", 5)
            // .attr("width", 10).attr("height", 10);

        // bars.transition().append("rect");

        // bars.exit().append("rect");
