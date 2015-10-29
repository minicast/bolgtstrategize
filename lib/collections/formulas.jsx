// define the colection + transform function: from JSON to Formula
Formulas = new Mongo.Collection("formulas", {
    transform: function(doc) {
      return new Formula(doc);
    }
  }
);
// define the Schema for Formula
FormulaSchema = new SimpleSchema({
  ascii: {
    type: String,
    label: "Formula",
    // regEx: /.+/,
    // unique: true,
    custom: function() {
      "use strict";
      // if (true) { //this.isSet
        var peg;
        try {
          peg = qmlf.parse(this.value);
        } catch (e) {
          console.log(e);
        } finally {
          if (!peg) { return "notAllowed"; }
        }

        // console.log("ok");
        // Meteor.call("validateFormula", this.value, function (error, result) {
        //   if (error) {
        //     console.log('notAllowed');
        //     Formulas.simpleSchema().namedContext().addInvalidKeys(
        //       [{name: "ascii", type: "notAllowed"}]
        //     );
        //     return "notAllowed";
        //   }
        //   if (result) {
        //     console.log(result);
        //     return false;
        //   }
          // if (!result) {
            // "insertFormulaForm"
          // }
        // });
      // }
    }
  }
});
// attach the schema to the collection
Formulas.attachSchema(FormulaSchema);
// Formulas.allow({
//   insert: function(){ "use strict";
//     return true;
//   },
//   update: function(){ "use strict";
//     return true;
//   },
//   remove: function(){ "use strict";
//     return true;
//   }
// });

// add the Formula Extended JSON type + fromJSONValue() function
EJSON.addType("Formula", function fromJSONValue(value) {
  return new Formula(value);
});

// define the Formula class
Formula = class Formula {
  typeName() {
    return "Formula"
  }
  toJSONValue() {
    return { ascii: this.ascii }
    // f = new Formula({ascii: "p"}) >>> Formula {ascii: "p"}
    // EJSON.toJSONValue(f) >>> Object {$type: "Formula", $value: {ascii: "p"}}
    // EJSON.fromJSONValue(EJSON.toJSONValue(f)) >>> Formula {ascii: "p"};
  }
  constructor(value) {
    this.ascii = value.ascii ? value.ascii : value
  }
  peg() {
    return qmlf.parse(this.ascii)
  }
  unicode(ascii) {
    var text = ascii ? ascii : this.ascii;
    return text
      .replace(/~/g, '\u00ac')
      .replace(/&/g, '\u2227')
      .replace(/\|/g,'\u2228')
      .replace(/\>/g,'\u27f6') // 2192 '\uE2A1') \uE124 &#8594;
      .replace(/\^/g,'\u27f7') // 2194'\uE2A5') \uE121
      .replace(/#/g, '\u25FD') //25A1 2610 '\u25a1') E285  9744 20DE
      .replace(/\*/g,'\u25c7') // 20df '\u25ca') E281 9826
      .replace(/\$/g,'\u2200')
      .replace(/!/g, '\u2203')
      .replace(/@/g, '\u0040')
      .replace(/\{/g,'\u007B')
      .replace(/</g,'\u003C');
  }

  latex() {
    return this.ascii
      .replace(/\{/g, '\\{ ') //this needs to be first, before any other {}inro rule
      .replace(/~/g, '\\lnot{}')
      .replace(/&/g, '\\land{}')
      .replace(/\|/g,'\\lor{}')
      .replace(/\>/g,'\\rightarrow{}')
      .replace(/\^/g,'\\leftrightarrow{}')
      .replace(/#/g, '\\Box{}')
      .replace(/\*/g,'\\Diamond{}')
      .replace(/\$/g,'\\forall{}')
      .replace(/!/g, '\\exists{}')
      .replace(/@/g, '@{}')
      .replace(/</g, '<{}');
  }
  depth(parsed) {
    if (typeof parsed === "string" //atomic
        || parsed[1] === "("
        || parsed[2] === "="
    )
      return 1;
    else if (parsed[0] === '~' //unary
            || parsed[0] === '#'
            || parsed[0] === '*'
    )
      return 1 + this.depth(parsed[1]);
    else if (parsed[1] === '$' || parsed[1] === '!') //quanty
        return 1 + this.depth(parsed[3]);
    else if (parsed[2] === "&" || parsed[2] === "|" || parsed[2] === ">" || parsed[2] === "^") //binary
      return 1 + _.max([this.depth(parsed[1]), this.depth(parsed[3])]);
    else //not well formed formula / invalid parse
        throw new Error('Invalid parsed input!');
  }
  branch(parsed) {
    if(typeof parsed === "string" || parsed[1] === "(" || parsed[2] === "=") //atomic
      return 1;
    else if(parsed[0] === '~' || parsed[0] === '#' || parsed[0] === '*') //unary
      return this.branch(parsed[1]);
    else if(parsed[1] === '$' || parsed[1] === '!') //quanty
      return this.branch(parsed[3]);
    else if(parsed[2] === "&" || parsed[2] === "|" || parsed[2] === ">" || parsed[2] === "^") //binary
      return this.branch(parsed[1]) + this.branch(parsed[3]);
    else //not well formed formula / invalid parse
      throw new Error('Invalid parsed input!');
  }
}


//   // Return a copy of this instance
//   clone: function() {
//     return new Formula(this.formulaAscii);
//   },
//
//   // Compare this instance to another instance
//   equals: function(other) {
//     if (!(other instanceof Formula))
//       return false;
//
//     return this.formulaAscii == other.formulaAscii;
//   },
//
//   // Return the name of this type which should be the same as the one
//   // padded to EJSON.addType
//   typeName: function() {
//     return "Formula";
//   },
