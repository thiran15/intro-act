function createHttpBackendMock(a,b){function g(a,b,c){return angular.isFunction(a)?a:function(){return angular.isNumber(a)?[a,b,c]:[200,a,b]}}function h(g,h,i,j,k){function o(a){return angular.isString(a)||angular.isFunction(a)||a instanceof RegExp?a:angular.toJson(a)}var l=new MockXhr,m=d[0],n=!1;if(m&&m.match(g,h)){if(!m.matchData(i))throw Error("Expected "+m+" with different data\nEXPECTED: "+o(m.data)+"\nGOT:      "+i);if(!m.matchHeaders(k))throw Error("Expected "+m+" with different headers\nEXPECTED: "+o(m.headers)+"\nGOT:      "+o(k));if(d.shift(),m.response)return void e.push(function(){var a=m.response(g,h,i,k);l.$$respHeaders=a[2],j(a[0],a[1],l.getAllResponseHeaders())});n=!0}for(var q,p=-1;q=c[++p];)if(q.match(g,h,i,k||{})){if(q.response)(b?b.defer:f)(function(){var a=q.response(g,h,i,k);l.$$respHeaders=a[2],j(a[0],a[1],l.getAllResponseHeaders())});else{if(!q.passThrough)throw Error("No response defined !");a(g,h,i,j,k)}return}throw n?Error("No response defined !"):Error("Unexpected request: "+g+" "+h+"\n"+(m?"Expected "+m:"No more request expected"))}function i(a){angular.forEach(["GET","DELETE","JSONP"],function(b){h[a+b]=function(c,d){return h[a](b,c,void 0,d)}}),angular.forEach(["PUT","POST","PATCH"],function(b){h[a+b]=function(c,d,e){return h[a](b,c,d,e)}})}var c=[],d=[],e=[],f=angular.bind(e,e.push);return h.when=function(a,d,e,f){var h=new MockHttpExpectation(a,d,e,f),i={respond:function(a,b,c){h.response=g(a,b,c)}};return b&&(i.passThrough=function(){h.passThrough=!0}),c.push(h),i},i("when"),h.expect=function(a,b,c,e){var f=new MockHttpExpectation(a,b,c,e);return d.push(f),{respond:function(a,b,c){f.response=g(a,b,c)}}},i("expect"),h.flush=function(a){if(!e.length)throw Error("No pending request to flush !");if(angular.isDefined(a))for(;a--;){if(!e.length)throw Error("No more pending request to flush !");e.shift()()}else for(;e.length;)e.shift()();h.verifyNoOutstandingExpectation()},h.verifyNoOutstandingExpectation=function(){if(d.length)throw Error("Unsatisfied requests: "+d.join(", "))},h.verifyNoOutstandingRequest=function(){if(e.length)throw Error("Unflushed requests: "+e.length)},h.resetExpectations=function(){d.length=0,e.length=0},h}function MockHttpExpectation(a,b,c,d){this.data=c,this.headers=d,this.match=function(b,c,d,e){return a==b&&(!!this.matchUrl(c)&&(!(angular.isDefined(d)&&!this.matchData(d))&&!(angular.isDefined(e)&&!this.matchHeaders(e))))},this.matchUrl=function(a){return!b||(angular.isFunction(b.test)?b.test(a):b==a)},this.matchHeaders=function(a){return!!angular.isUndefined(d)||(angular.isFunction(d)?d(a):angular.equals(d,a))},this.matchData=function(a){return!!angular.isUndefined(c)||(c&&angular.isFunction(c.test)?c.test(a):c&&!angular.isString(c)?angular.toJson(c)==a:c==a)},this.toString=function(){return a+" "+b}}function MockXhr(){MockXhr.$$lastInstance=this,this.open=function(a,b,c){this.$$method=a,this.$$url=b,this.$$async=c,this.$$reqHeaders={},this.$$respHeaders={}},this.send=function(a){this.$$data=a},this.setRequestHeader=function(a,b){this.$$reqHeaders[a]=b},this.getResponseHeader=function(a){var b=this.$$respHeaders[a];return b?b:(a=angular.lowercase(a),(b=this.$$respHeaders[a])?b:(b=void 0,angular.forEach(this.$$respHeaders,function(c,d){b||angular.lowercase(d)!=a||(b=c)}),b))},this.getAllResponseHeaders=function(){var a=[];return angular.forEach(this.$$respHeaders,function(b,c){a.push(c+": "+b)}),a.join("\n")},this.abort=angular.noop}angular.mock={},angular.mock.$BrowserProvider=function(){this.$get=function(){return new angular.mock.$Browser}},angular.mock.$Browser=function(){var a=this;this.isMock=!0,a.$$url="http://server/uber_access/",a.$$lastUrl=a.$$url,a.pollFns=[],a.$$completeOutstandingRequest=angular.noop,a.$$incOutstandingRequestCount=angular.noop,a.onUrlChange=function(b){return a.pollFns.push(function(){a.$$lastUrl!=a.$$url&&(a.$$lastUrl=a.$$url,b(a.$$url))}),b},a.cookieHash={},a.lastCookieHash={},a.deferredFns=[],a.deferredNextId=0,a.defer=function(b,c){return c=c||0,a.deferredFns.push({time:a.defer.now+c,fn:b,id:a.deferredNextId}),a.deferredFns.sort(function(a,b){return a.time-b.time}),a.deferredNextId++},a.defer.now=0,a.defer.cancel=function(b){var c;return angular.forEach(a.deferredFns,function(a,d){a.id===b&&(c=d)}),void 0!==c&&(a.deferredFns.splice(c,1),!0)},a.defer.flush=function(b){if(angular.isDefined(b))a.defer.now+=b;else{if(!a.deferredFns.length)throw Error("No deferred tasks to be flushed");a.defer.now=a.deferredFns[a.deferredFns.length-1].time}for(;a.deferredFns.length&&a.deferredFns[0].time<=a.defer.now;)a.deferredFns.shift().fn()},a.$$baseHref="",a.baseHref=function(){return this.$$baseHref}},angular.mock.$Browser.prototype={poll:function(){angular.forEach(this.pollFns,function(a){a()})},addPollFn:function(a){return this.pollFns.push(a),a},url:function(a,b){return a?(this.$$url=a,this):this.$$url},cookies:function(a,b){return a?void(void 0==b?delete this.cookieHash[a]:angular.isString(b)&&b.length<=4096&&(this.cookieHash[a]=b)):(angular.equals(this.cookieHash,this.lastCookieHash)||(this.lastCookieHash=angular.copy(this.cookieHash),this.cookieHash=angular.copy(this.cookieHash)),this.cookieHash)},notifyWhenNoOutstandingRequests:function(a){a()}},angular.mock.$ExceptionHandlerProvider=function(){var a;this.mode=function(b){switch(b){case"rethrow":a=function(a){throw a};break;case"log":var c=[];a=function(a){1==arguments.length?c.push(a):c.push([].slice.call(arguments,0))},a.errors=c;break;default:throw Error("Unknown mode '"+b+"', only 'log'/'rethrow' modes are allowed!")}},this.$get=function(){return a},this.mode("rethrow")},angular.mock.$LogProvider=function(){function a(a,b,c){return a.concat(Array.prototype.slice.call(b,c))}this.$get=function(){var b={log:function(){b.log.logs.push(a([],arguments,0))},warn:function(){b.warn.logs.push(a([],arguments,0))},info:function(){b.info.logs.push(a([],arguments,0))},error:function(){b.error.logs.push(a([],arguments,0))}};return b.reset=function(){b.log.logs=[],b.warn.logs=[],b.info.logs=[],b.error.logs=[]},b.assertEmpty=function(){var a=[];if(angular.forEach(["error","warn","info","log"],function(c){angular.forEach(b[c].logs,function(b){angular.forEach(b,function(b){a.push("MOCK $log ("+c+"): "+String(b)+"\n"+(b.stack||""))})})}),a.length)throw a.unshift("Expected $log to be empty! Either a message was logged unexpectedly, or an expected log message was not checked and removed:"),a.push(""),new Error(a.join("\n---------\n"))},b.reset(),b}},function(){function b(b){var d;if(d=b.match(a)){var e=new Date(0),f=0,g=0;return d[9]&&(f=c(d[9]+d[10]),g=c(d[9]+d[11])),e.setUTCFullYear(c(d[1]),c(d[2])-1,c(d[3])),e.setUTCHours(c(d[4]||0)-f,c(d[5]||0)-g,c(d[6]||0),c(d[7]||0)),e}return b}function c(a){return parseInt(a,10)}function d(a,b,c){var d="";for(a<0&&(d="-",a=-a),a=""+a;a.length<b;)a="0"+a;return c&&(a=a.substr(a.length-b)),d+a}var a=/^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?:\:?(\d\d)(?:\:?(\d\d)(?:\.(\d{3}))?)?)?(Z|([+-])(\d\d):?(\d\d)))?$/;angular.mock.TzDate=function(a,c){var e=new Date(0);if(angular.isString(c)){var f=c;if(e.origDate=b(c),c=e.origDate.getTime(),isNaN(c))throw{name:"Illegal Argument",message:"Arg '"+f+"' passed into TzDate constructor is not a valid date string"}}else e.origDate=new Date(c);var g=new Date(c).getTimezoneOffset();e.offsetDiff=60*g*1e3-1e3*a*60*60,e.date=new Date(c+e.offsetDiff),e.getTime=function(){return e.date.getTime()-e.offsetDiff},e.toLocaleDateString=function(){return e.date.toLocaleDateString()},e.getFullYear=function(){return e.date.getFullYear()},e.getMonth=function(){return e.date.getMonth()},e.getDate=function(){return e.date.getDate()},e.getHours=function(){return e.date.getHours()},e.getMinutes=function(){return e.date.getMinutes()},e.getSeconds=function(){return e.date.getSeconds()},e.getTimezoneOffset=function(){return 60*a},e.getUTCFullYear=function(){return e.origDate.getUTCFullYear()},e.getUTCMonth=function(){return e.origDate.getUTCMonth()},e.getUTCDate=function(){return e.origDate.getUTCDate()},e.getUTCHours=function(){return e.origDate.getUTCHours()},e.getUTCMinutes=function(){return e.origDate.getUTCMinutes()},e.getUTCSeconds=function(){return e.origDate.getUTCSeconds()},e.getUTCMilliseconds=function(){return e.origDate.getUTCMilliseconds()},e.getDay=function(){return e.date.getDay()},e.toISOString&&(e.toISOString=function(){return d(e.origDate.getUTCFullYear(),4)+"-"+d(e.origDate.getUTCMonth()+1,2)+"-"+d(e.origDate.getUTCDate(),2)+"T"+d(e.origDate.getUTCHours(),2)+":"+d(e.origDate.getUTCMinutes(),2)+":"+d(e.origDate.getUTCSeconds(),2)+"."+d(e.origDate.getUTCMilliseconds(),3)+"Z"});var h=["getMilliseconds","getUTCDay","getYear","setDate","setFullYear","setHours","setMilliseconds","setMinutes","setMonth","setSeconds","setTime","setUTCDate","setUTCFullYear","setUTCHours","setUTCMilliseconds","setUTCMinutes","setUTCMonth","setUTCSeconds","setYear","toDateString","toGMTString","toJSON","toLocaleFormat","toLocaleString","toLocaleTimeString","toSource","toString","toTimeString","toUTCString","valueOf"];return angular.forEach(h,function(a){e[a]=function(){throw Error("Method '"+a+"' is not implemented in the TzDate mock")}}),e},angular.mock.TzDate.prototype=Date.prototype}(),angular.mock.dump=function(a){function b(a){var d;return angular.isElement(a)?(a=angular.element(a),d=angular.element("<div></div>"),angular.forEach(a,function(a){d.append(angular.element(a).clone())}),d=d.html()):angular.isArray(a)?(d=[],angular.forEach(a,function(a){d.push(b(a))}),d="[ "+d.join(", ")+" ]"):d=angular.isObject(a)?angular.isFunction(a.$eval)&&angular.isFunction(a.$apply)?c(a):a instanceof Error?a.stack||""+a.name+": "+a.message:angular.toJson(a,!0):String(a),d}function c(a,b){b=b||"  ";var d=[b+"Scope("+a.$id+"): {"];for(var e in a)a.hasOwnProperty(e)&&!e.match(/^(\$|this)/)&&d.push("  "+e+": "+angular.toJson(a[e]));for(var f=a.$$childHead;f;)d.push(c(f,b+"  ")),f=f.$$nextSibling;return d.push("}"),d.join("\n"+b)}return b(a)},angular.mock.$HttpBackendProvider=function(){this.$get=[createHttpBackendMock]},angular.mock.$RootElementProvider=function(){this.$get=function(){return angular.element("<div ng-app></div>")}},angular.module("ngMock",["ng"]).provider({$browser:angular.mock.$BrowserProvider,$exceptionHandler:angular.mock.$ExceptionHandlerProvider,$log:angular.mock.$LogProvider,$httpBackend:angular.mock.$HttpBackendProvider,$rootElement:angular.mock.$RootElementProvider}).config(function(a){a.decorator("$timeout",function(a,b){return a.flush=function(a){b.defer.flush(a)},a})}),angular.module("ngMockE2E",["ng"]).config(function(a){a.decorator("$httpBackend",angular.mock.e2e.$httpBackendDecorator)}),angular.mock.e2e={},angular.mock.e2e.$httpBackendDecorator=["$delegate","$browser",createHttpBackendMock],angular.mock.clearDataCache=function(){var a,b=angular.element.cache;for(a in b)if(b.hasOwnProperty(a)){var c=b[a].handle;c&&angular.element(c.elem).unbind(),delete b[a]}},window.jasmine&&function(a){function b(){return jasmine.getEnv().currentSpec}function c(){var a=b();return a&&a.queue.running}afterEach(function(){var a=b(),c=a.$injector;a.$injector=null,a.$modules=null,c&&(c.get("$rootElement").unbind(),c.get("$browser").pollFns.length=0),angular.mock.clearDataCache(),angular.forEach(angular.element.fragments,function(a,b){delete angular.element.fragments[b]}),MockXhr.$$lastInstance=null,angular.forEach(angular.callbacks,function(a,b){delete angular.callbacks[b]}),angular.callbacks.counter=0}),a.module=angular.mock.module=function(){function d(){var c=b();if(c.$injector)throw Error("Injector already created, can not register a module!");var d=c.$modules||(c.$modules=[]);angular.forEach(a,function(a){d.push(a)})}var a=Array.prototype.slice.call(arguments,0);return c()?d():d},a.inject=angular.mock.inject=function(){function e(){var c=b(),e=c.$modules||[];e.unshift("ngMock"),e.unshift("ng");var f=c.$injector;f||(f=c.$injector=angular.injector(e));for(var g=0,h=a.length;g<h;g++)try{f.invoke(a[g]||angular.noop,this)}catch(a){throw a.stack&&d&&(a.stack+="\n"+d.stack),a}finally{d=null}}var a=Array.prototype.slice.call(arguments,0),d=new Error("Declaration Location");return c()?e():e}}(window);