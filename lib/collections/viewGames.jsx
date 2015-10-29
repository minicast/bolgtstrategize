// define the colection + transform function: from JSON to ViewGames
ViewGames = new Mongo.Collection("viewGames",{
  transform: function(doc) {
    return new ViewGame(doc);
  }
});
ViewGames.allow({
  insert: function (userId, doc) {
    return true;
  },
  // update: function (userId, doc, fields, modifier) {},
  // remove: function (userId, doc) {}
});
// define the Schema for ViewGame
ViewGameSchema = new SimpleSchema({
  formulaAscii: {
    type: String,
    label: "Formula",
    // unique: true,
    custom: function() {
      var peg;
      try {
        peg = qmlf.parse(this.value);
      } catch (e) {
        console.log(e);
      } finally {
        if (!peg) { return "notAllowed"; }
      }
    }
  },
  structureAscii: {
    type: String,
    label: "Structure",
    // unique: true,
    custom: function() {
      var peg;
      try {
        peg = qmls.parse(this.value);
      } catch (e) {
        console.log(e);
      } finally {
        if (!peg) { return "notAllowed"; }
      }
    }
  },
  actualWorld: {
    type: String,
    label: "Metanominal",
    regEx: /^[lt-w]+[_\-]?[0-9]*$/,
    // unique: true,
    // custom: function() {
    //   var peg;
    //   try {
    //     peg = qmls.parse(this.value);
    //   } catch (e) {
    //     console.log(e);
    //   } finally {
    //     if (!peg) { return "notAllowed"; }
    //   }
    // }
  },
  createdAt: {
    type: String,
    autoform: {
      type: "hidden",
      value: JSON.stringify(Date.now())
    }
  }
});

ViewGames.attachSchema(ViewGameSchema);

// add the ViewGame Extended JSON type + fromJSONValue() function
EJSON.addType("ViewGame", function fromJSONValue(value) {
  return new ViewGame(value);
});

// define the ViewGame class
ViewGame = class ViewGame {
  typeName() {
    return "ViewGame";
  }
  toJSONValue() {
    return {
      formulaAscii: this.formulaAscii,
      structureAscii: this.structureAscii,
      createdAt: this.createdAt
    };
    // f = new ViewGame({ascii: "w:VLpRLwDOa"}) >>> ViewGame {ascii: "w:VLpRLwDOa"}
    // EJSON.toJSONValue(f) >>> Object {$type: "ViewGame", $value: {ascii: "w:VLpRLwDOa"}}
    // EJSON.fromJSONValue(EJSON.toJSONValue(f)) >>> ViewGame {ascii: "w:VLpRLwDOa"};
  }
  constructor(value) {
    this.formulaAscii = value.formulaAscii;
    this.formula = new Formula({ascii: this.formulaAscii});
    this.structureAscii = value.structureAscii;
    this.structure = new Structure({ascii: this.structureAscii});
    this.createdAt = JSON.stringify(Date.now());
  }
  // peg() {
    // return qmls.parse(this.ascii)
  // }
};
