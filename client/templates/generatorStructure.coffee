Template.generatorStructure.events
  "submit": (event, template) ->
    # node.selectAll('rect')
    #     .attr("width", function(d) {return this.parentNode.getBBox().width;})

    event.preventDefault();

    extractArrayFromString = (array) ->
      if array then array.split(",") else []

    valuationString = template.$("#valuation").val()
    valuation = extractArrayFromString valuationString
    valuationUniverse = Combinatorics.power(valuation).toArray()

    domainString = template.$("#domain").val()
    domain = extractArrayFromString domainString
    domainUniverse = Combinatorics.power(domain).toArray()

    monadicPredicatesString = template.$("#monadicPredicates").val()
    monadicPredicates = extractArrayFromString monadicPredicatesString

    monadicPredicatesExtensions = monadicPredicates.map(
      (x) -> Combinatorics.cartesianProduct(x, domainUniverse).toArray()
    )

    monadicPredicatesExtensionsCombinations = Combinatorics.cartesianProduct
    .apply(null, monadicPredicatesExtensions).toArray()
    # if monadicPredicatesExtensions then [] else

    monadicPredicatesExtensionsCombinationsString =
    monadicPredicatesExtensionsCombinations.map(
      (x) ->
        x.map(
          (y) ->
            "\t #{y[0]}: {#{y[1].join(',')}}\n"
        )
    )

    diadicPredicatesString = template.$("#diadicPredicates").val()
    diadicPredicates = extractArrayFromString diadicPredicatesString

    domainPairs = Combinatorics.cartesianProduct(domain,domain).toArray()
    domainPairsUniverse = Combinatorics.power(domainPairs).toArray()

    diadicPredicatesExtensions = diadicPredicates.map(
      (x) -> Combinatorics.cartesianProduct(x, domainPairsUniverse).toArray()
    )

    diadicPredicatesExtensionsCombinations = Combinatorics.cartesianProduct
    .apply(null, diadicPredicatesExtensions).toArray()

    diadicPredicatesExtensionsCombinationsString =
    diadicPredicatesExtensionsCombinations.map(
      (x) ->
        x.map(
          (y) ->
            "\t #{y[0]}: {#{y[1].map((z) -> "(#{z.join(',')})").join(',')}}\n"
        )
    )

    universe =
    # if monadicPredicatesExtensionsCombinations then valuationUniverse else
    Combinatorics.cartesianProduct(valuationUniverse,
    monadicPredicatesExtensionsCombinations,
    diadicPredicatesExtensionsCombinations).toArray()

    universeObjects = universe.map (x) ->
      valuation: x[0]
      valuationText: "{#{x[0].join(',')}}"
      domain: domain
      domainText: "{#{domain.join(',')}}"
      monadicPredicatesExtensions: x[1]
      diadicPredicatesExtensions: x[2]
      hoverContent: "metanominal: w#{universe.indexOf(x)}\n
      domain: {#{domain.join(',')}}\n
      diadic predicates extensions:\n
      #{x[2]
      .map((y) ->
        "\t #{y[0]}: {#{y[1]
        .map((z) ->
          "(#{z.join(',')})"
        ).join(',')}}\n"
      ).join('')}
      monadic predicates extensions:\n
      #{x[1].map((y) -> "\t #{y[0]}: {#{y[1].join(',')}}\n").join('')}
      propositional valuation: {#{x[0].join(',')}}"

    console.log universeObjects

    nodes = universeObjects
    nodeRadius = 5
    fill = d3.scale.category10()
    links = [
      { source: 0, target: 1 },
      { source: 0, target: 99 },
      { source: 0, target: 109 },
      { source: 0, target: 119 },
    ]
    linkDistance = 40
    repulsiveCharge = -1 * (linkDistance + 5 * Math.log10(universe.length))
    # h = w = linkDistance + linkDistance * Math.log2(universe.length)
    h = w = -1 * repulsiveCharge * (1 + Math.sqrt(universe.length) )

    voronoi = d3.geom.voronoi()
    .x((d) -> d.x)
    .y((d) -> d.y)
    .clipExtent([[-10, -10], [w+10, h+10]])

    recenterVoronoi = (nodes) ->
      shapes = []
      voronoi(nodes).forEach((d) ->
        if !d.length
          return
        n = []
        d.forEach((c) ->
          n.push([ c[0] - d.point.x, c[1] - d.point.y ])
        )
        n.point = d.point
        shapes.push(n)
      )
      return shapes

    force = d3.layout.force()
      .nodes(nodes)
      .links(links)
      .size([w, h])
      .linkStrength(0.000001)
      .friction(0.9)
      .linkDistance(linkDistance)
      .charge(repulsiveCharge)
      .gravity(0.1)
      .theta(0.8)
      .alpha(0.1)
      .on("tick", (e) ->
        # Push different nodes in different directions for clustering.
        k = (Math.log2(universe.length) - 2)  * e.alpha
        nodes.forEach((o, i) ->
          o.y += if (o.monadicPredicatesExtensions[0][0] is "P" and
          "a" in o.monadicPredicatesExtensions[0][1]) then k else -k
          o.x += if (o.monadicPredicatesExtensions[0][0] is "P" and
          "b" in o.monadicPredicatesExtensions[0][1]) then k else -k
        )
      )
      .start()


    # svg = template.$("#generatorStructure")
    svg = d3.select("#generatorStructure").append('svg')
      .attr('width', w)
      .attr('height', h)

    links = svg.selectAll('.link')
        .data(links)
        .enter().append('line')
        .attr('class', 'link')

    hull = svg.append('path').attr('class', 'hull')
    hull2 = svg.append('path').attr('class', 'hull2')

    # nodes.attr("cx", (d) -> d.x).attr("cy", (d) -> d.y ))
    gnodes = svg.selectAll("g.gnode")
      .data(nodes)
      .enter()
      .append("g")
      .classed("gnode", true)

    gcircles = gnodes.append("circle").attr("class", "node")
    .attr("fill", (d, i) ->
      if (d.monadicPredicatesExtensions[0][0] is "P" and
      "a" in d.monadicPredicatesExtensions[0][1]) and
      (d.monadicPredicatesExtensions[0][0] is "P" and
      "b" not in d.monadicPredicatesExtensions[0][1])
        return d3.rgb(255,0,255).toString() # violet
      else if (d.monadicPredicatesExtensions[0][0] is "P" and
      "a" not in d.monadicPredicatesExtensions[0][1]) and
      (d.monadicPredicatesExtensions[0][0] is "P" and
      "b" in d.monadicPredicatesExtensions[0][1])
        return d3.rgb(255,255,0).toString() # yellow
      else if (d.monadicPredicatesExtensions[0][0] is "P" and
      "a" in d.monadicPredicatesExtensions[0][1]) and
      (d.monadicPredicatesExtensions[0][0] is "P" and
      "b" in d.monadicPredicatesExtensions[0][1])
        return d3.rgb(255,128,128).toString() # blend(violet,yellow)
      else if (d.monadicPredicatesExtensions[0][0] is "P" and
      "a" not in d.monadicPredicatesExtensions[0][1]) and
      (d.monadicPredicatesExtensions[0][0] is "P" and
      "b" not in d.monadicPredicatesExtensions[0][1])
        return d3.rgb(232,232,232).toString() # blend(black,white,10) gray
      )

    gnodes.append("title").text((d) -> d.hoverContent)

    glabels = gnodes.append("text")
        .style("text-anchor", "middle")
        .text((d) -> "w#{d.index}")

    force.on('end', () ->
      vertices = nodes.filter((d,i) ->
        if (d.monadicPredicatesExtensions[0][0] is "P" and
        "a" in d.monadicPredicatesExtensions[0][1]) then true else false
      ).map((z)-> [z.x, z.y])
      vertices2 = nodes.filter((d,i) ->
        if (d.monadicPredicatesExtensions[0][0] is "P" and
        "b" in d.monadicPredicatesExtensions[0][1]) then true else false
      ).map((z)-> [z.x, z.y])

      # circle = svg.selectAll('circle')

      redraw = ->
        hull.datum(d3.geom.hull(vertices)).attr 'd', (d) ->
          'M' + d.join('L') + 'Z'
        hull2.datum(d3.geom.hull(vertices2)).attr 'd', (d) ->
          'M' + d.join('L') + 'Z'
        # circle = circle.data(vertices)
        # circle.enter().append('circle').attr 'r', 3
        # circle.attr 'transform', (d) ->
          # 'translate(' + d + ')'
        return

      redraw()

      gcircles.attr('r', nodeRadius)
        .attr('cx', (d) -> d.x)
        .attr('cy', (d) -> d.y)
      glabels
        .attr('x', (d) -> d.x )
        .attr('y', (d) -> d.y + nodeRadius * 3 + 3)

      links.attr('x1', (d) -> d.source.x )
          .attr('y1', (d) -> d.source.y )
          .attr('x2', (d) -> d.target.x )
          .attr('y2', (d) -> d.target.y )

    )

    # randomX = d3.random.normal(w / 2, 60)
    # randomY = d3.random.normal(h / 2, 60)
    # vertices = d3.range(5).map(->
    #   [
    #     randomX()
    #     randomY()
    #   ]
    # )
