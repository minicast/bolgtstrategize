// D3 render template
Template.d3svg.rendered = function(){
  // var w = 40, h = 80;

  // var svg = d3.select("#d3svg")
    // .append("svg").attr("width", w).attr("height", h);

  Deps.autorun(function(){

    // ************** Generate the tree diagram  *****************
    var margin = {top: 25, right: 20, bottom: 10, left: 20},
      width = 1500 - margin.right - margin.left,
      height = 700 - margin.top - margin.bottom,
      edgeLenght = 80, nodeSeparation = 7;

    var i = 0, duration = 750, root;

    var tree = d3.layout.tree()
      .size([width, height])
      .separation(function() {return nodeSeparation;});

    var diagonal = d3.svg.diagonal()
     // .projection(function(d) { return [d.y, d.x]; });

    // var svg = d3.select("body").append("svg")
    var svg = d3.select("#d3svg").append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
        .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // var treeData = [ formulaPeg2tree(qmlf.parse("(~(q|~s)>~(p^(q&r)))")) ];
    // var treeData = [ formulaPeg2tree(qmlf.parse("(~(q&~s)|(~p&(~q|r)))")) ];
    // var treeData = [ formulaPeg2tree(qmlf.parse("*(~#(q&~s)|(~*p&#(~q|r)))")) ];
    // var treeData = [ formulaPeg2tree(qmlf.parse("~(P(a)&~(Q(b)|~P(c)))")) ];
    var treeData = [
      // getWinningStrategy(colorize(formulaStructure2Game(
      getWinningStrategy(colorize(formulaStructure2Game(
      // colorize(formulaStructure2Game(
      // formulaStructure2Game(
        // qmlf.parse("(~(q&~s)|(~p&(~q|r)))"),
        // qmlf.parse("*p"),
        // qmlf.parse("#p"),
        // qmlf.parse("*(p&q)"),
        // qmlf.parse("~(p|r)"),
        // qmlf.parse("*(~#(q&~s)|(~*p&#(~q|r)))"),
        // qmlf.parse("#*(~#(q&~s)|(~*p&#(~q|r)))"),
        // qmlf.parse("~(P(a)&~(Q(b)|~P(c)))"),
        // qmlf.parse("($xP(a))"),
        // qmlf.parse("(!xP(x))"),
        // qmlf.parse("($x(!y(P(x)|Q(y))))"),
        // qmlf.parse("#($x(!y(P(x)|Q(y))))"),
        qmlf.parse("(~(!x#P(x))|#(!xP(x)))"),
        // qmls.parse("w:VLp,q"),
        // qmls.parse("w:VLp,qRLw,v"),
        // qmls.parse("w:VLp,qRLw,v;v:VLr,sRL;u:VLp,rRLw"),
        // qmls.parse("w:VLp,qRLw,v,u;v:VLr,sRL;u:VLp,rRLw"),
        // qmls.parse("w:VLp,qRLw,v;v:VLr,sRLw,u;u:VLp,rRLw"),
        // qmls.parse("w:VLp,qRLv;v:VLr,sRLu,t;u:VLp,rRL;t:VLp,rRLl1,l2,l3;l1:VLRL;l2:VLRL;l3:VLRL"),
        // qmls.parse("w:VLp,qRLvDOa,b,cMPP{a,b},Q{c};v:VLr,sRLu,t;u:VLp,rRL;t:VLp,rRLl1,l2,l3;l1:VLRL;l2:VLRL;l3:VLRL"),
        qmls.parse("w:VLp,qRLvDOa,bMPP{a},Q{b};v:VLr,sRLu,tDOa,bMPP{a},Q{b};u:VLp,rRL;t:VLp,rRLl1,l2,l3;l1:VLRL;l2:VLRL;l3:VLRL"),
        // qmls.parse("w_0:VLpRLw_0,w_1,w_2DOa,b,cMPP{a,b};w_1:VLpRLw_0,w_1,w_2DOa,bMPP{a,b};w_2:VLpRLw_0,w_1,w_2DOa,b,c,dMPP{a,c}"),
        "w"
        // "w_0"
      )
      ) //colorize
      , "verifier") //winningStrategy
    ];

    console.log(treeData);

    // var treeData = [
    //   {
    //     "name": "Top Level",
    //     "parent": "null",
    //     "children": [
    //       {
    //         "name": "Level 2: A",
    //         "parent": "Top Level",
    //         "children": [
    //           {
    //             "name": "Son of A",
    //             "parent": "Level 2: A"
    //           },
    //           {
    //             "name": "Daughter of A",
    //             "parent": "Level 2: A"
    //           }
    //         ]
    //       },
    //       {
    //         "name": "Level 2: B",
    //         "parent": "Top Level"
    //       }
    //     ]
    //   }
    // ];

    root = treeData[0];

    // update(root);
    update(root);
    root.x0 = width / 2;
    root.y0 = 1;
    root.x = width / 2;
    root.y = 1; //height;

function update(source) {

      // Compute the new tree layout.
      var nodes = tree.nodes(root).reverse(),
        links = tree.links(nodes);

      // Normalize for fixed-depth.
      nodes.forEach(function(d) { d.y = d.depth * edgeLenght; });

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
          var x0, y0;
          if (source.x0)
            x0 = source.x0;
          else
            x0 = source.x0; // 1; //width / 2;
          if (source.y0)
            y0 = source.y0;
          else y0 = source.y0; // 1;// height;
          return "translate(" + x0 + "," + y0 + ")"; })
        .on("click", click);

      // nodeEnter.append("circle")
        // .attr("r", 10)
        // .style("fill", "#fff");

        nodeEnter.append("title").text(function(d) {
          return d._children ? "click to expand" : "atomic syntax element";
        });

var ascii2unicode = function(ascii) {
    return ascii
      .replace(/~/g, '\u00ac')
      .replace(/&/g, '\u2227')
      .replace(/\|/g,'\u2228')
      .replace(/\>/g,'\u2192') //'\uE2A1') \uE124 &#8594;
      .replace(/\^/g,'\u2194') //'\uE2A5') \uE121
      .replace(/#/g, '\u25FD') //25A1 2610 '\u25a1') E285  9744 20DE
      .replace(/\*/g,'\u25c7') //'\u25ca') E281 9826
      .replace(/\$/g,'\u2200')
      .replace(/!/g, '\u2203')
      .replace(/@/g, '\u0040')
      .replace(/\{/g,'\u007B')
      .replace(/</g,'\u003C');
}

      nodeEnter.append("text")
        // .attr("x", function(d) {
          // return d.children || d._children ? -13 : 13; })
        // .attr("dy", ".5em")
        // .attr("text-anchor", function(d) {
          // return d.children || d._children ? "end" : "start"; })
        .attr("text-anchor", 'middle')
        .text(function(d) {
          // return d._children ? d.unexpanded : ascii2unicode(d.name);
          return ascii2unicode(d.name);
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
        .style('opacity', '0.5')
        .attr('transform', function(d){
            var xdev, ydev;
            if (d._children) xdev = (this.previousElementSibling.clientWidth+10)/2;
            else xdev = 30;
            ydev = (this.previousElementSibling.clientHeight+10)/2;
            return "translate("+ -xdev + ',' + -ydev + ')';
        });
        // */

      // Transition nodes to their new position.
      var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + (0 + d.x) + "," + d.y + ")"; });

      // nodeUpdate.select("circle")
       //  .attr("r", 10)
       //  .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

       nodeUpdate.select("title").text(function(d) {
         return d._children ? "click to expand" : "atomic syntax element";
       });

      nodeUpdate.select("text")
        .text(function(d) {
          // return d._children ? d.unexpanded : d.name;
          return ascii2unicode(d.name);
        })
        .style("fill", function(d) {
          // return d._children ? "FireBrick" : "#00f";
          return "black" ;
        })
        .style("cursor", function(d) { return d._children ? "pointer" : "not-allowed"; })
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
        .attr('rx', 5).attr('ry', 5)
        // .style("fill", function(d) { return d._children ? "#f00" : "#5bc0de"; }) //#D2E4D2  "lightsteelblue"
        .style("fill", function(d) {
          return d.color;
        })
        .style("cursor", function(d) { return d._children ? "pointer" : "not-allowed"; })
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
          var o = {x: source.x0, y: source.y0};
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
    function click(d) {
      if (d.children) {
      // d._children = d.children;
      // d.children = null;
      } else {
      d.children = d._children;
      d._children = null;
      }
      update(d);
    }


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
    });
};
