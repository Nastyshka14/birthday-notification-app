"use strict";(self.webpackChunkcalendar=self.webpackChunkcalendar||[]).push([[482],{30482:function(e,t,n){n.r(t),n.d(t,{solr:function(){return c}});var r=/[^\s\|\!\+\-\*\?\~\^\&\:\(\)\[\]\{\}\"\\]/,o=/[\|\!\+\-\*\?\~\^\&]/,u=/^(OR|AND|NOT|TO)$/i;function i(e){return function(t,n){for(var o=e;(e=t.peek())&&null!=e.match(r);)o+=t.next();return n.tokenize=a,u.test(o)?"operator":function(e){return parseFloat(e).toString()===e}(o)?"number":":"==t.peek()?"propertyName":"string"}}function a(e,t){var n,u,c=e.next();return'"'==c?t.tokenize=(u=c,function(e,t){for(var n,r=!1;null!=(n=e.next())&&(n!=u||r);)r=!r&&"\\"==n;return r||(t.tokenize=a),"string"}):o.test(c)?t.tokenize=(n=c,function(e,t){return"|"==n?e.eat(/\|/):"&"==n&&e.eat(/\&/),t.tokenize=a,"operator"}):r.test(c)&&(t.tokenize=i(c)),t.tokenize!=a?t.tokenize(e,t):null}var c={name:"solr",startState:function(){return{tokenize:a}},token:function(e,t){return e.eatSpace()?null:t.tokenize(e,t)}}}}]);
//# sourceMappingURL=482.bbb49254.chunk.js.map