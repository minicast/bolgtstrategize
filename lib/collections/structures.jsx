/* global Mongo, SimpleSchema, qmls, EJSON,
   Structure: true, Structures: true, StructureSchema: true,
   PossibleWorldSchema: true */
/* jshint esnext: true */

// define the colection + transform function: from JSON to Structure
Structures = new Mongo.Collection('structures', {
  transform: function f(doc) {
    return new Structure(doc);
  },
});
// define the Schema for PossibleWorld
PossibleWorldSchema = new SimpleSchema({
  metanominal: {
    type: String,
    regEx: /^[lt-w]+[_\-]?[0-9]*$/,
    label: 'Metanominal (Possible World Name)',
  },
  propositionalValuation: {
    type: Array,
    // label: 'Propositional Valuation'
  },
  'propositionalValuation.$': {
    type: String,
    regEx: /^[p-s]+[_\-]?[0-9]*$/,
    label: 'Propositional Symbol',
  },
  accessibleSuccessors: {
    type: Array,
  },
  'accessibleSuccessors.$': {
    type: String,
    regEx: /^[lt-w]+[_\-]?[0-9]*$/,
    label: 'Metanominal Symbol', //(Accessible Successor)
  },
});
// define the Schema for Structure
StructureSchema = new SimpleSchema({
  relationalStructure: {
    type: Array,
    optional: true,
    minCount: 0,
    // label: 'Structure'
    //, maxCount: 5
    // label: 'Relational Structure'
   },
  'relationalStructure.$': {
    type: PossibleWorldSchema,
    label: 'Possible World',
  },
  ascii: {
    type: String,
    label: 'Structure',
    // regEx: /.+/,
    unique: true,
    custom: function f() {
      // 'use strict';
      // if (true) { //this.isSet
      var peg;
      try {
        peg = qmls.parse(this.value);
      } catch (e) {
        console.log(e);
      } finally {
        if (!peg) { return 'notAllowed'; }
      }
      // console.log('ok');
      // Meteor.call('validateStructure', this.value, function (error, result) {
      //   if (error) {
      //     console.log('notAllowed');
      //     Structures.simpleSchema().namedContext().addInvalidKeys(
      //       [{name: 'ascii', type: 'notAllowed'}]
      //     );
      //     return 'notAllowed';
      //   }
      //   if (result) {
      //     console.log(result);
      //     return false;
      //   }
          // if (!result) {
            // 'insertStructureForm'
          // }
        // });
      // }
    },
  },
});

Structures.attachSchema(StructureSchema);

// Structures.allow({
//   insert: function(){ 'use strict';
//     return true;
//   },
//   update: function(){ 'use strict';
//     return true;
//   },
//   remove: function(){ 'use strict';
//     return true;
//   }
// });

// add the Structure Extended JSON type + fromJSONValue() function
EJSON.addType('Structure', function fromJSONValue(value) {
  return new Structure(value);
});

// define the Structure class
Structure = class Structure {
  typeName() {
    return 'Structure';
  }
  toJSONValue() {
    return { ascii: this.ascii };
    // f = new Structure({ascii: 'w:VLpRLwDOa'})
    // >>> Structure {ascii: 'w:VLpRLwDOa'}
    // EJSON.toJSONValue(f)
    // >>> Object {$type: 'Structure', $value: {ascii: 'w:VLpRLwDOa'}}
    // EJSON.fromJSONValue(EJSON.toJSONValue(f))
    // >>> Structure {ascii: 'w:VLpRLwDOa'};
  }
  constructor(value) {
    this.ascii = value.ascii ? value.ascii : value;
  }
  peg() {
    return qmls.parse(this.ascii);
  }
  metaDomainSize() {
    return this.ascii.split(';').length;
  }
  printableAscii() {
    return this.ascii.replace(/;/g, '; ');
  }
  latex() {
    return this.ascii
      .replace(/\{/g, '\\{ ') // needs to be first, before any other {}inro rule
      .replace(/\}/g, ' \\}') // needs to be first, before any other {}inro rule
      .replace(/:/g, '\\begin{Bmatrix} ')
      .replace(/DO/g, ' \\\\ ')
      .replace(/UF/g, ' \\\\ ')
      .replace(/BF/g, ' \\\\ ')
      .replace(/EQ/g, ' \\\\ ')
      .replace(/MP/g, ' \\\\ ')
      .replace(/DP/g, ' \\\\ ')
      .replace(/VL/g, ' \\\\ ')
      .replace(/RL/g, ' \\\\ ')
      .replace(/~/g, ' \\lnot{}')
      .replace(/;/g, ' \\end{Bmatrix}')
      .replace(/$/g, ' \\end{Bmatrix}')
      // .replace(/\\begin\{Bmatrix\}  \\\\/g, ' \\begin{Bmatrix} ')
      .replace(/\\begin\{Bmatrix\} {2}\\\\/g, ' \\begin{Bmatrix} ')
      // .replace(/\\\\  \\end\{Bmatrix\}/g, ' \\end{Bmatrix}')
      .replace(/\\\\ {2}\\end\{Bmatrix\}/g, ' \\end{Bmatrix}')
      .replace(/ /g, '')
      ;
  }
};
