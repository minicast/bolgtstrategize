/* syntactic generation language for quantified modal logic structures */

start = model

model "model"
  = left:world ";" right:model
  / world

world "world"
  = metanominal ":" extensionnotationslist

extensionnotationslist "extensionnotationslist"
  = left:extensionnotation right:extensionnotationslist
  / extensionnotation / ""

extensionnotation "extensionnotation"
  = domainsymb domain
  / unarysymb unaryextslist
  / binarysymb binaryextslist
  / equalsymb equalext
  / monadicsymb monadicextslist
  / diadicsymb diadicextslist
  / valsymb valuation
  / relsymb relations
  // = extsymb extension

extsymb "extsymb"
  = domainsymb
  / unarysymb / binarysymb
  / equalsymb
  / monadicsymb / diadicsymb
  / valsymb
  / relsymb

extension "extension"
  = domain
  / unaryext / binaryext
  / equalext
  / monadicext / diadicext
  / valuation
  / relations

domainsymb "domainsymb" = "DO"

domain "domain"
  = left:groundterm "," right:domain
  / groundterm / ""
  // = left:constant "," right:domain
  // / constant / ""

unarysymb "unarysymb" = "UF"

objectslist "objectslist"
  = left: groundterm "," right: objectslist
  / groundterm / ""
  // = left: constant "," right: objectslist
  // / objectslist / ""

pairslist "pairslist"
  = left: tuple2 "," right: pairslist
  / tuple2 / ""

unaryext "unaryext"
  = function "{" pairslist "}"

unaryextslist "unaryextslist"
  = left:unaryext "," right:unaryextslist
  / unaryext / ""

binarysymb "binarysymb" = "BF"

tripleslist "tripleslist"
  = left: tuple3 "," right: tripleslist
  / tuple3 / ""

binaryext "binaryext"
  = function "{" tripleslist "}"

binaryextslist "binaryextslist"
  = left:binaryext "," right:binaryextslist
  / binaryext / ""

equalsymb "equalsymb" = "EQ"

equalext "equalext"
  = "{" pairslist "}"

monadicsymb "monadicsymb" = "MP"

monadicext "monadicext"
  = predicate "{" objectslist "}"

monadicextslist "monadicextslist"
  = left:monadicext "," right:monadicextslist
  / monadicext / ""

diadicsymb "diadicsymb" = "DP"

diadicext "diadicext"
  = predicate "{" pairslist "}"

diadicextslist "diadicextslist"
  = left:diadicext "," right:diadicextslist
  / diadicext / ""

tuple0 "tuple0"
  = "(" ")"

tuple1 "tuple1"
  = "(" groundterm ")"
  // = "(" constant ")"

tuple2 "tuple2"
  = "(" groundterm "," groundterm ")"
  // = "(" constant "," constant ")"

tuple3 "tuple3"
  = "(" groundterm "," groundterm "," groundterm ")"
  // = "(" constant "," constant "," constant ")"

valsymb "valsymb" = "VL"

valuation "valuation"
  = left:literal "," right:valuation
  / literal / ""

literal "literal"
  = atomic
  / "~" atomic:atomic {return "~" + atomic;}

relsymb "relsymb" = "RL"

relations "relations"
  = left:metanominal "," right:relations
  / metanominal / ""

atomic "atomic"
  = nominal
  / propsym
  / equality
  / predicate "(" groundterm ")"
  / predicate "(" groundterm "," groundterm ")"

groundterm "groundterm"
  = constant
  / function "(" groundterm ")"
  / function "(" groundterm "," groundterm ")"

equality "equality"
  = "(" groundterm "=" groundterm ")"

predicate "predicate"
  = chars:([P-SA-C0-9_\-]+) {return chars.join("")}

function "function"
  = chars:([f-h0-9_\-]+) {return chars.join("")}

variable "variable"
  = chars:([X-Zx-z0-9_\-]+) {return chars.join("")}

constant "constant"
  = chars:([a-emn0-9_\-]+) {return chars.join("")}

metanominal "metanominal"
  = chars:([lt-w0-9_\-]+) {return chars.join("")}

nominal "nominal"
  = chars:([i-k0-9_\-]+) {return chars.join("")}

propsym "proposition"
  = chars:([p-s0-9_\-]+) {return chars.join("")}

integer "integer"
  = digits:[0-9]+ { return parseInt(digits.join(""), 10); }
