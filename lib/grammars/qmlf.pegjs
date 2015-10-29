/* specification language for quantified modal logic */

start = metaformula / formula

metaformula "metaformula"
  = formula "@" metaterm

formula "formula"
  = atomic / unary / binary / quanty / metaterm2form

metaterm "metaterm"
  = metanominal
  / metafunction "(" metaterm "," formula ")"

quanty "quantified"
  = "(" quantifier variable formula ")"

binary "binary"
  = "(" formula "&" formula ")" //and
  / "(" formula "|" formula ")" //or
  / "(" formula ">" formula ")" //impl
  / "(" formula "^" formula ")" //eqvl

unary "unary"
  = "~" formula //neg
  / "#" formula //nec
  / "*" formula //pos

metaterm2form "metaterm2form"
  = "{" metaterm

// reductionaxiom = "<" atomic

atomic "atomic"
  = nominal
  / propsym
  / equality
  / predicate "(" term ")"
  / predicate "(" term "," term ")"

term "term"
  = constant
  / variable
  / function "(" term ")"
  / function "(" term "," term ")"

equality "equality"
  = "(" term "=" term ")"

quantifier "quantifier"
  = "$" //univ
  / "!" //exis

metafunction "metafunction"
  = "F*"  //skolem 4 pos
  / "F~#" //skolem 4 neg nec

predicate "predicate"
  = chars:([P-SA-EMN0-9_\-]+) {return chars.join("")}

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
