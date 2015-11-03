Meteor.startup(function(){
  if(!Session.get('currentGame')) {
    Session.set("currentGame", JSON.parse('{"formulaAscii":"(!x(~($y((P(x)&Q(y))|#p))|(*~q&~#Q(x))))","formula":{"ascii":"(!x(~($y((P(x)&Q(y))|#p))|(*~q&~#Q(x))))"},"structureAscii":"w:VLp,qRLv,u,tDOaMPP{a},Q{b};v:VLpRLuDOa,bMPP{},Q{a};u:VLqRLtDOb,cMPP{},Q{a};t:VLrRLvDOcMPP{},Q{b}","structure":{"ascii":"w:VLp,qRLv,u,tDOaMPP{a},Q{b};v:VLpRLuDOa,bMPP{},Q{a};u:VLqRLtDOb,cMPP{},Q{a};t:VLrRLvDOcMPP{},Q{b}"},"createdAt":"1446556849817"}'));
  }
});
