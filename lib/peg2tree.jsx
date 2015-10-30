/* jshint esnext: true */
// 'use strict';

/* global leafsInGameTree : true, */
leafsInGameTree = (gameTree) => {
  if (gameTree.children.length === 0) {
    return 1;
  } else {
    return _(_(gameTree.children).map((x) => {
      return leafsInGameTree(x);
    })).reduce(function(x,y){return x + y}, 0)
  }
};

depthOfGameTree = (gameTree) => {
  if (gameTree.children.length === 0)
    return 1
  else
    return _(_(gameTree.children).map((x) => {
      return depthOfGameTree(x)
    })).max() + 1
}

formulaPeg2tree = (formulaPeg) => {
  if (typeof formulaPeg === "string")
    return {
      name: formulaPeg,
      hoverLabel: "boolean atom",
      children: []
    }
  else if (formulaPeg[1] === "(") { // qmlf.parse("P(a)")  >>>  ["P", "(", "a", ")"]
    return {
      name: formulaPeg.join(""),
      hoverLabel: "relational atom",
      children: []
    }
  } else if (formulaPeg[2] === "=") { // qmlf.parse("(x=a)")  >>>  [(", "x", "=", "a", ")"]
    return {
      name: formulaPeg.join("").slice(1,-1),
      hoverLabel: "equality atom",
      children: []
    }
  } else if (formulaPeg[0] === "~" ||
      formulaPeg[0] === "*" || formulaPeg[0] === "#")
    return {
      name: formulaPeg[0],
      hoverLabel: "negation",
      children: [ formulaPeg2tree(formulaPeg[1]) ]
    }
  else if ( formulaPeg[2] === "&" || formulaPeg[2] === "|" ||
       formulaPeg[2] === ">" || formulaPeg[2] === "^")
    return {
      name: formulaPeg[2],
      hoverLabel: "junctor",
      children: [
        formulaPeg2tree(formulaPeg[1]),
        formulaPeg2tree(formulaPeg[3])
      ]
    }
  else if ( formulaPeg[1] === "$" || formulaPeg[1] === "!")
    return {
      name: formulaPeg[1] + formulaPeg[2],
      hoverLabel: "quantifier",
      children: [
        formulaPeg2tree(formulaPeg[3])
      ]
    }
  else
    throw new Error("formulaPeg2tree called with bad imput")
}

addLinks2structureGraph = (structureGraph) => {
  collectLinks = []
  structureGraph.nodes.map((x) => {
    collectLinks = collectLinks.concat(x.links)
  })
  structureGraph["links"] = collectLinks.map(
    (x) => {
      return {
        source: structureGraph.metadomain.indexOf(x.source),
        target: structureGraph.metadomain.indexOf(x.target)
      }
    }
  )
  return structureGraph
}

//assumes unique metanominals
structurePeg2graph = (structurePeg) => {
  if (typeof structurePeg[0] === "string") {
    // console.log('uno');
    var nodeName;
    var hoverContent = `metanominal: ${structurePeg[0]}
valuation: { ${getValuation(structurePeg).toString()} }
relations: { ${getRelations(structurePeg).toString()} }
domain: { ${getDomain(structurePeg).toString()} }
predicates:
    monadic: ${JSON.stringify(getMonadicPredicates(structurePeg))} `
    if (getDomain(structurePeg).length) {
      nodeName = `${getDomain(structurePeg).toString()}@${structurePeg[0]}`
    } else {
      nodeName = `${getValuation(structurePeg).toString()}@${structurePeg[0]}`
    }
    let structure = {
      metadomain: [ structurePeg[0] ],
      nodes: [
        {
          name: nodeName,
          hoverContent: hoverContent,
          metanominal: structurePeg[0],
          valuation: getValuation(structurePeg),
          domain: getDomain(structurePeg),
          monadicPredicates: getMonadicPredicates(structurePeg),
          relations: getRelations(structurePeg),
          links: getRelations(structurePeg).map(
            (x) => {
              return {source: structurePeg[0], target: x}
            }
          )
        }
      ]
    }
    return structure;
  } else if (typeof structurePeg[0] === "object") {
    // console.log('many');
    hoverContent = `metanominal: ${structurePeg[0][0]}
valuation: { ${getValuation(structurePeg[0]).toString()} }
relations: { ${getRelations(structurePeg[0]).toString()} }
domain: { ${getDomain(structurePeg[0]).toString()} }
predicates:
    monadic: ${JSON.stringify(getMonadicPredicates(structurePeg[0]))}`
    let tailStructure = structurePeg2graph(structurePeg[2])
    var nodeName;
    if (getDomain(structurePeg[0]).length) {
      nodeName = `${getDomain(structurePeg[0]).toString()}@${structurePeg[0][0]}`
    } else {
      nodeName = `${getValuation(structurePeg[0]).toString()}@${structurePeg[0][0]}`
    }
    tailStructure.metadomain.push(structurePeg[0][0]);
    tailStructure.nodes.push(
      {
        name: nodeName,
        metanominal: structurePeg[0][0],
        hoverContent: hoverContent,
        valuation: getValuation(structurePeg[0]),
        domain: getDomain(structurePeg[0]),
        monadicPredicates: getMonadicPredicates(structurePeg[0]),
        //_(_().flatten()).without(",")
        relations: getRelations(structurePeg[0]),
        links: getRelations(structurePeg[0]).map(
          (x) => {
            return {source: structurePeg[0][0], target: x}
          }
        )
      }
    );
    return tailStructure;
  } else {
    console.log("error");
  }
}

getPointWorldString = (structurePeg, pointWorld) => {
  return pointWorld + ":" +
    structurePeg2ascii(structurePeg).split(pointWorld + ":")[1]
      .split(";")[0]
}

//assumes the VaLuation comes first
getValuation = (structurePeg, pointWorld) => {
  if (typeof structurePeg[0] === "string") {
    return _(_(structurePeg[2][0][1]).flatten()).without(",")
  } else if (typeof structurePeg[0] === "object") {
    return getValuation(qmls.parse(getPointWorldString(structurePeg,pointWorld)))
  } else {
    throw new Error("getValuation called with bad input")
  }
}

//assumes the ReLations come second
getRelations = (structurePeg, pointWorld) => {
  if (typeof structurePeg[0] === "string") {
    return _(_(structurePeg[2][1][0][1]).flatten()).without(",")
  } else if (typeof structurePeg[0] === "object") {
    return getRelations(qmls.parse(getPointWorldString(structurePeg,pointWorld)))
  } else {
    throw new Error("getRelations called with bad input")
  }
}

//assumes the DOmain comes third
getDomain = (structurePeg, pointWorld) => {
  if (typeof structurePeg[0] === "string") {
    if (structurePeg[2][1][1]) {
      return _(_(structurePeg[2][1][1][0][1]).flatten()).without(",")
    } else {
      return []
    }
  } else if (typeof structurePeg[0] === "object") {
    return getDomain(qmls.parse(getPointWorldString(structurePeg,pointWorld)))
  } else {
    throw new Error("getDomain called with bad input")
  }
}

//assumes the MonadicPredicates come fourth
getMonadicPredicates = (structurePeg, pointWorld) => {
  if (typeof structurePeg[0] === "string") {
    if (structurePeg[2][1][1][1]) {
      return _.object(
          structurePeg[2][1][1][1][0][1].filter(
          (x) => { return x !== "," }
        ).map(
          (x) => {
            // predicates = {}
            predicates = [
              x[0],
              typeof x[2] === "string" ? [ x[2] ] : x[2].filter(
                (x) => {return x !== ","}
              )
            ]
            // typeof x[2] === "string" ? [ x[2] ] : x[2].filter(
            //   (x) => {return x !== ","}
            // )
            return predicates
          }
        )
      )
    } else {
      return {}
    }
  } else if (typeof structurePeg[0] === "object") {
    return getMonadicPredicates(qmls.parse(getPointWorldString(structurePeg,pointWorld)))
  } else {
    throw new Error("getDomain called with bad input")
  }
}

atomTruthValue = (formulaPeg, structurePeg, pointWorld) => {
  if (typeof formulaPeg === "string" && typeof structurePeg[0] === "string") {
    let valuation = getValuation(structurePeg, pointWorld);
    return valuation.indexOf(formulaPeg) !== -1
  } else if (typeof formulaPeg === "string" && typeof structurePeg[0] === "object") {
    let valuation = getValuation(qmls.parse(getPointWorldString(structurePeg,pointWorld)));
    return valuation.indexOf(formulaPeg) !== -1
  } else {
    throw new Error("atomTruthValue called with bad imput")
  }
}

atomPredicateTruthValue = (formulaPeg, structurePeg, pointWorld) => {
  let predicate = formulaPeg[0]
  if (typeof structurePeg[0] === "string") {
    let monadicPredicates = getMonadicPredicates(structurePeg, pointWorld);
    return monadicPredicates[predicate].indexOf(formulaPeg[2]) !== -1
  } else if (typeof structurePeg[0] === "object") {
    let monadicPredicates =
    getMonadicPredicates(qmls.parse(getPointWorldString(structurePeg,pointWorld)));
    return monadicPredicates[predicate].indexOf(formulaPeg[2]) !== -1
  } else {
    throw new Error("atomPredicateTruthValue called with bad imput")
  }
}

formulaPeg2ascii = (formulaPeg) => {
  return _(_(_(formulaPeg).flatten()).without(",")).join('')
}

structurePeg2ascii = (structurePeg) => {
  return _(structurePeg).flatten().join('')
}

substitution = (formulaPeg, variable, groundTerm) => {
  var re = new RegExp(variable,"g");
  return qmlf.parse(
    formulaPeg2ascii(formulaPeg).replace(re, groundTerm)
  );
}

formulaStructure2Game = (formulaPeg, structurePeg, pointWorld) => {
  if (typeof formulaPeg === "string") {
    let valuation = getValuation(structurePeg, pointWorld);
    let domain = getDomain(structurePeg, pointWorld);
    // console.log(valuation);
    return {
      name: `${formulaPeg}@${pointWorld}`,
      valuation: valuation,
      domain: domain,
      truthValue: atomTruthValue(formulaPeg, structurePeg, pointWorld),
      player: "checker", color: "PowderBlue",
      children: [
        {
          name: JSON.stringify(atomTruthValue(formulaPeg, structurePeg, pointWorld)),
          color: (() => {
            if (atomTruthValue(formulaPeg, structurePeg, pointWorld)) {
              return "green"
            } else {
              return "red"
            }
          })(),
          strokeColor: (() => {
            if (atomTruthValue(formulaPeg, structurePeg, pointWorld)) {
              return "green"
            } else {
              return "red"
            }
          })(),
          children: []
        }
      ]
    }
  } else if (formulaPeg[1] === "(") {
    let valuation = getValuation(structurePeg, pointWorld);
    let domain = getDomain(structurePeg, pointWorld);
    return {
      name: `${formulaPeg.join('')}@${pointWorld}`,
      valuation: valuation,
      domain: domain,
      truthValue: atomPredicateTruthValue(formulaPeg, structurePeg, pointWorld),
      player: "checker", color: "PowderBlue",
      children: [
        {
          name: JSON.stringify(
            atomPredicateTruthValue(formulaPeg, structurePeg, pointWorld)
          ),
          color: (() => {
            if (atomPredicateTruthValue(formulaPeg, structurePeg, pointWorld)) {
              return "green"
            } else {
              return "red"
            }
          })(),
          strokeColor: (() => {
            if (atomPredicateTruthValue(formulaPeg, structurePeg, pointWorld)) {
              return "green"
            } else {
              return "red"
            }
          })(),
          children: []
        }
      ]
    }
  } else if (formulaPeg[1] === "$") {
    let valuation = getValuation(structurePeg, pointWorld);
    let domain = getDomain(structurePeg, pointWorld);
    return {
      name: `${_(formulaPeg).flatten().join('')}@${pointWorld}`,
      valuation: valuation,
      domain: domain,
      // truthValue: atomPredicateTruthValue(formulaPeg, structurePeg, pointWorld),
      player: "falsifier", color: "Pink",
      children: domain.map(
        (x) => {
          return formulaStructure2Game(
            substitution(formulaPeg[3],formulaPeg[2],x), structurePeg, pointWorld)
        }
      )
    }
  } else if (formulaPeg[1] === "!") {
    let valuation = getValuation(structurePeg, pointWorld);
    let domain = getDomain(structurePeg, pointWorld);
    return {
      name: `${_(formulaPeg).flatten().join('')}@${pointWorld}`,
      valuation: valuation,
      domain: domain,
      // truthValue: atomPredicateTruthValue(formulaPeg, structurePeg, pointWorld),
      player: "verifier", color: "PaleGreen",
      children: domain.map(
        (x) => {
          return formulaStructure2Game(
            substitution(formulaPeg[3],formulaPeg[2],x), structurePeg, pointWorld)
        }
      )
    }
  } else if (formulaPeg[0] === "~") {
    return {
      name: `${formulaPeg2ascii(formulaPeg)}@${pointWorld}`,
      player: "swaper", color: "PaleGoldenRod",
      children: [ formulaStructure2Game(formulaPeg[1], structurePeg, pointWorld) ]
    }
  } else if (formulaPeg[0] === "*") {
    if (getRelations(structurePeg, pointWorld).length === 0) {
      return {
        name: `${formulaPeg2ascii(formulaPeg)}@${pointWorld}`,
        player: "verifier", color: "PaleGreen",
        deadlock: "deadlock",
        children: [
          {
            name: "blind",
            color: "red",
            strokeColor: "red",
            children: []
          }
        ]
      }
    } else {
      return {
        name: `${formulaPeg2ascii(formulaPeg)}@${pointWorld}`,
        player: "verifier", color: "PaleGreen",
        children: getRelations(structurePeg, pointWorld).map(
          (x) => {
            return formulaStructure2Game(formulaPeg[1], structurePeg, x)
          }
        )
      }
    }
  } else if (formulaPeg[0] === "#") {
    if (getRelations(structurePeg, pointWorld).length === 0) {
      return {
        name: `${formulaPeg2ascii(formulaPeg)}@${pointWorld}`,
        player: "falsifier", color: "Pink",
        deadlock: "deadlock",
        children: [
          {
            name: "blind",
            color: "green",
            strokeColor: "green",
            children: []
          }
        ]
      }
    } else {
      return {
        name: `${formulaPeg2ascii(formulaPeg)}@${pointWorld}`,
        player: "falsifier", color: "Pink",
        children: getRelations(structurePeg, pointWorld).map(
          (x) => {
            return formulaStructure2Game(formulaPeg[1], structurePeg, x)
          }
        )
      }
    }
  } else if (formulaPeg[2] === "&") {
    return {
      name: `${formulaPeg2ascii(formulaPeg)}@${pointWorld}`,
      player: "falsifier", color: "Pink",
      children: [
        formulaStructure2Game(formulaPeg[1], structurePeg, pointWorld),
        formulaStructure2Game(formulaPeg[3], structurePeg, pointWorld),
      ]
    }
  } else if (formulaPeg[2] === "|") {
    return {
      name: `${formulaPeg2ascii(formulaPeg)}@${pointWorld}`,
      player: "verifier", color: "PaleGreen",
      children: [
        formulaStructure2Game(formulaPeg[1], structurePeg, pointWorld),
        formulaStructure2Game(formulaPeg[3], structurePeg, pointWorld),
      ]
    }
  } else {
    throw new Error("formulaStructure2Game called with bad imput")
  }
}

colorize = (gameTree) => {
  if (gameTree.children.length) {
    if (gameTree.children.length === 1) {
      // console.log("single");
      gameTree["children"] = gameTree.children.map(
        (x) => { return colorize(x); }
      );
      if (gameTree.player === "swaper") {
        if (gameTree.children[0].strokeColor === "red") {
          // gameTree["color"] = "green";
          gameTree["strokeColor"] = "green";
        }
        if (gameTree.children[0].strokeColor === "green") {
          // gameTree["color"] = "red";
          gameTree["strokeColor"] = "red";
        }
      } else {
        // gameTree["color"] = gameTree.children[0].color;
        gameTree["strokeColor"] = gameTree.children[0].strokeColor;
      }
      return gameTree;
    } else if (gameTree.children.length === 2) {
      // console.log("double");
      gameTree["children"] = gameTree.children.map(
        (x) => { return colorize(x); }
      );
      if (gameTree.children[0].strokeColor === gameTree.children[1].strokeColor) {
        // gameTree["color"] = gameTree.children[0].color;
        gameTree["strokeColor"] = gameTree.children[0].strokeColor;
      } else if (gameTree.children[0].strokeColor !== gameTree.children[1].strokeColor) {
        if (gameTree.player === "verifier") {
          // gameTree["color"] = "green";
          gameTree["strokeColor"] = "green";
        } else if (gameTree.player === "falsifier") {
          // gameTree["color"] = "red";
          gameTree["strokeColor"] = "red";
        } else {
          console.log("error");
        }
      } else {
        console.log("error");
      }
      return gameTree;
    } else if (gameTree.children.length >= 2) {
      // console.log("multiple");
      gameTree["children"] = gameTree.children.map(
        (x) => { return colorize(x); }
      );
      let kidsColors = gameTree.children.map((x) => { return x.strokeColor })
      if (kidsColors.every((x) => { return x === "red" }) ||
          kidsColors.every((x) => { return x === "green" })) {
        // gameTree["color"] = gameTree.children[0].color;
        gameTree["strokeColor"] = gameTree.children[0].strokeColor;
      } else if (kidsColors.some((x) => { return x === "red" }) &&
                 kidsColors.some((x) => { return x === "green"})) {
        if (gameTree.player === "verifier") {
          // gameTree["color"] = "green";
          gameTree["strokeColor"] = "green";
        } else if (gameTree.player === "falsifier") {
          // gameTree["color"] = "red";
          gameTree["strokeColor"] = "red";
        } else {
          console.log("error");
        }
      } else {
        console.log("error");
      }
      return gameTree;
    } else {
      console.log("error");
    }
  } else {
    // console.log("leaf");
    return gameTree;
  }
}

extractWinner = (colorGameTree) => {
  if (colorGameTree.strokeColor === "green") {
    return "verifier"
  } else if (colorGameTree.strokeColor === "red") {
    return "falsifier"
  } else {
    return "undecided"
  }
}

getWinningStrategy = (colorGameTree, role) => {
  if (role === extractWinner(colorGameTree)) {
    return winningStrategy (colorGameTree, role);
  } else if (role !== extractWinner(colorGameTree)) {
    return {name: `The ${role}'s set`,
      color: "red",
      children: [
        {name:"of winning strategies",color:"red",
          children:[
            {name:"is",color:"red",children:[]},
            {name:"empty",color:"red",children:[]},
            {name:"in this",color:"red",children:[]},
            {name:"game",color:"red",children:[]}
          ]
        }
      ],
      player: role
    }
  } else {
    throw new Error("getWinningStrategy called with bad input")
  }
}

winningStrategy = (colorGameTree, role) => {
  colorGameTree["children"] = colorGameTree.children.map(
    (x) => {
      return winningStrategy(x, role)
    }
  )
  if (role === "verifier") {
    if (colorGameTree.player === role) {
      if (colorGameTree.children.some((x) => {
        return x.strokeColor === "green"
      })
      ) {
        colorGameTree["children"] = colorGameTree.children.filter(
          (x) => {
            return x.strokeColor === "green"
          }
        )//.slice(0,1)
      }
    }
  } else if (role === "falsifier") {
    if (colorGameTree.player === role) {
      if (colorGameTree.children.some((x) => {
        return x.strokeColor === "red"
      })
      ) {
        colorGameTree["children"] = colorGameTree.children.filter(
          (x) => {
            return x.strokeColor === "red"
          }
        )//.slice(0,1)
      }
    }
  }
  return colorGameTree
}


/*

backwardInductionColorizeNode = (gameTreeNode) => {
  let x = gameTreeNode
  if (x.children.length) {
    if (x.children[0].color === "red" || x.children[0].color === "green") {
      if (x.children.length === 1) {
        x["color"] = x.children[0].color
      }
      if (x.children.length === 2 && x.children[0].color === x.children[1].color) {
        x["color"] = x.children[0].color
      }
      if (x.children.length === 2 && x.children[0].color !== x.children[1].color) {
        if (x.player === "verifier") {
          x["color"] = "green"
        }
        if (x.player === "falsifier") {
          x["color"] = "red"
        }
      }
    }
  }
  return x
}

backwardInductionColorize = (gameTree) => {
  if (gameTree.children.length &&
      gameTree.color !== "red" &&
      gameTree.color !== "green") {
    // console.log("children");
    let newChildren = (gameTree.children).map(
      (x) => backwardInductionColorize(x)
    );
    // console.log(newChildren);
    gameTree["children"] = newChildren
    return gameTree
  } else {
    backwardInductionColorizeNode(gameTree);
    return gameTree
  }
}


  if (colorGameTree.color === "green" && role === "falsifier" ||
      colorGameTree.color === "red" && role === "verifier") {
    console.log("no can do");
    return "no winningStrategy for the ${role} in this game"
  }
  if (colorGameTree.color === "green" && role === "verifier") {
    colorGameTree["children"] = colorGameTree.children.map(
      (x) => {
        return winningStrategy(x, role)
      }
    )
    if (colorGameTree.player === "verifier") {
      colorGameTree["children"] = colorGameTree.children.filter(
        (x) => {
          return x.color === "green"
        }
      )
    }
  } else if (colorGameTree.color === "red") {

  } else {
    throw new Error("winningStrategy called with bad imput")
  }

*/
