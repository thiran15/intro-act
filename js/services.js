'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
.factory('headerFooterData', ['$http', '$q',
         function($http, $q) {
         	return {
         		getHeaderFooterData: function(type) {
         			var deferred = $q.defer();
         			$http.get('apiv4/public/menus/').success(function(data) {
         				deferred.resolve(data);
         			}).error(function() {
         				deferred.reject();
         			});
         			return deferred.promise;
         		}
         	};
         }])
.factory('local', ['$http', '$q',
function($http, $q, $scope) {
    return {
        runHeader: function() {
            var deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        }
    };
 }])
.factory('Counters', ['$http', '$q',    // Getting Investor, Corporate, Broker, Events & Meeting Counts
function($http, $q) {
        return {
            getCounts: function(type) {
                var args = { type: type }
                var deferred = $q.defer();
                return $http.post('apiv4/public/dashboard/counts', { /*params: args,*/ headers: { 'Content-Type': 'application/json'} })
                       .then(function(res) {
                        return res;
                    }, function(reason) {
                        return res;

                    }
                );
            }
        };
 }])
.factory('validation', ['$http', '$q',    // Getting Investor, Corporate, Broker, Events & Meeting Counts
function($http, $q) {
        return {
            getEmpty: function(data) {
              var len = Object.keys(data).length;
              var ret = 0;
              angular.forEach(data, function(value, key) {
                if(value == ''){
                  ret = ret+1;
                } else {
                  ret = ret;
                }
              });
              return ret;
            },
            getEmailExist: function(data){
              var email = data;
              return $http.post('apiv4/public/user/checkEmail', { email: email, headers: { 'Content-Type': 'application/json'} })
              .then(function(res){
                  return res;
                }, function(reason){
                  return reason;
                }
              );
            }
        };
 }])
.factory('usertype', ['localStorageService', function(localStorageService){

}])

/*.config(function(captchaSettingsProvider) {
  captchaSettingsProvider.setSettings({
    captchaEndpoint: 
      'http://localhost/introact_v3/cap/cap.php'
  });
})*/

.factory('RequestDetail', ['$http', '$q',    // Getting Investor, Corporate, Broker, Events & Meeting Counts
function($http, $q) {
    return {
        getDetail: function(url,params) {
            params = encrypt(params);
            var deferred = $q.defer();
            return $http.post(url, { params: params})
                   .then(function(res) {
                     
                      //res= decrypts(res);                   
                      ////console.log(res);
                      return res;
                  }, function(reason) {
                    
                      return reason;
                  }
              );
        },
        getData: function(args) {

        }
    };
 }])
 .factory('Useractivity', ['$http', '$q',    // Getting Investor, Corporate, Broker, Events & Meeting Counts
function($http, $q) {
    return {
        getDetail: function(params) {
            url = 'apiv4/public/user/adduseractivity';
            params = encrypt(params);
            var deferred = $q.defer();
            return $http.post(url, { params: params})
                   .then(function(res) {
                     
                      res= decrypts(res);                   
                      ////console.log(res);
                      return res;
                  }, function(reason) {
                    
                      return reason;
                  }
              );
        },
        getData: function(args) {

        }
    };
 }])
.factory("IssueService", ["$resource", function($resource) {
    return $resource("api/user.js", {}, {
      query: { method: "GET", isArray: true }
    });
  }])
.value('version', '0.1')
.factory('alertService', function($rootScope, $timeout) {
    var alertService = {};
    $rootScope.alerts = [];
    alertService.add = function(type, msg, timeout) {
        $rootScope.alerts.push({
            type: type,
            msg: msg,
            close: function() {
                return alertService.closeAlert(this);
            }
        });
        if (timeout) {
            $timeout(function(){               
                alertService.closeAlert(this); 
            }, timeout); 
        }
    };
    alertService.closeAlert = function(index) {
        $rootScope.alerts.splice(index, 1);
    };
    return alertService;
})
.factory('AuthService', function($http,  $rootScope,$q){
    return {
      isLogged : function(){
      var deferred = $q.defer();
         return $http.post('apiv4/public/login') /* Checking Login status */
          .success(function(data, status, headers, config) {
              if(data.success == true) {
                  return data;
              } else {
                   return data;
              }
          });
      }
    }
}).factory('permissions', function ($rootScope) {
  var permissionList;
  return {
    setPermissions: function(permissions) {
      $rootScope.userPermission = permissions;
    },
    hasPermission: function (permission) {
      return $rootScope.userPermission;
    }
  };
});
angular.module('angular.css.injector', [])
.provider('cssInjector', ['$interpolateProvider', function($interpolateProvider) {
	var singlePageMode = false;

	function CssInjector($compile, $rootScope){
        // Variables
        var head = angular.element(document.getElementsByTagName('head')[0]),
            scope;

        // Capture the event `locationChangeStart` when the url change. If singlePageMode===TRUE, call the function `removeAll`
        $rootScope.$on('$locationChangeStart', function()
        {
            if(singlePageMode === true)
                removeAll();
        });

        // Always called by the functions `addStylesheet` and `removeAll` to initialize the variable `scope`
        var _initScope = function()
        {
            if(scope === undefined)
            {
                scope = $rootScope.$new(true);
            }
        };

        // Used to add a CSS files in the head tag of the page
        var addStylesheet = function(href)
        {
            _initScope();

            if(scope.injectedStylesheets === undefined)
            {
                scope.injectedStylesheets = [];
                head.append($compile("<link data-ng-repeat='stylesheet in injectedStylesheets' data-ng-href='" + $interpolateProvider.startSymbol() + "stylesheet.href" + $interpolateProvider.endSymbol() + "' rel='stylesheet' />")(scope)); // Found here : http://stackoverflow.com/a/11913182/1662766
            }
            else
            {
                for(var i in scope.injectedStylesheets)
                {
                    if(scope.injectedStylesheets[i].href == href) // An url can't be added more than once. I use a loop FOR, not the function indexOf to make the code IE < 9 compatible
                        return;
                }
            }

            scope.injectedStylesheets.push({href: href});
        };

        // gets all stylesheets
        var getStyleSheets = function() {
            _initScope();
            return scope.injectedStylesheets === undefined ? [] : scope.injectedStylesheets;
        }

		var remove = function(href){
			_initScope();

			if(scope.injectedStylesheets){
				for(var i = 0; i < scope.injectedStylesheets.length; i++){
					if(scope.injectedStylesheets[i].href === href){
						scope.injectedStylesheets.splice(i, 1);
						return;
					}
				}
			}
		};

        // Used to remove all of the CSS files added with the function `addStylesheet`
        var removeAll = function()
        {
            _initScope();

            if(scope.injectedStylesheets !== undefined)
                scope.injectedStylesheets = []; // Make it empty
        };

        return {
            add: addStylesheet,
			remove: remove,
            removeAll: removeAll,
            getAll: getStyleSheets
        };
	}

	this.$get = ['$compile', '$rootScope', function($compile, $rootScope){
		return new CssInjector($compile, $rootScope);
	}];

	this.setSinglePageMode = function(mode){
		singlePageMode = mode;
		return this;
	}
}]);
function encrypt(data){ /*
   if(ENCRYPT_VALUE.indexOf(data) > -1 || typeof data == 'number'){
     return data;
   }
   else if(typeof data == 'string'){
    var datas = CryptoJS.AES.encrypt(data, 'intro-act', {format: CryptoJSAesJson}).toString();
    return datas;
   }
   else if(typeof data == 'object'){
    if(data == null){return null;}
    if(Array.isArray(data)){var ret = [];}
    else{var ret = {};}
      $.each(data, function(key, value) {
        ret[key] = encrypt(value);
      });
    return ret;
   } */


   /*var ENCRYPT_VALUE = ['0','1','','undefined','true','false','TRUE','FALSE','null','NULL']; ENCRYPT_VALUE.indexOf(data) > -1 || */

   if(ENCRYPT_VALUE.indexOf(data) > -1 || typeof data == 'number'){
     return data;
   }   
   else if(typeof data == 'string'){
    //var datas = CryptoJS.AES.encrypt(data, 'intro-act', {format: CryptoJSAesJson}).toString();
    return data;
   }
   else if(typeof data == 'object'){
    if(data == null){return null;}
    if(Array.isArray(data)){var ret = [];}
    else{var ret = {};}
    if(Object.keys(data).length > 0){
      $.each(data, function(key, value) {
        ret[key] = encrypt(value);
      });
      return ret;
    }
    else{
        return data;
    }
   }
}
function decrypts(data){
   /*if(ENCRYPT_VALUE.indexOf(data) > -1){
     return data;
   }
   else*/
   if(typeof data == 'number'){
    return data;
   } 
   else if(typeof data == 'string'){
      if(data.indexOf('{"ct":') == 0){
        try { 
          data = JSON.parse(CryptoJS.AES.decrypt(data,'intro-act',{format:CryptoJSAesJson}).toString(CryptoJS.enc.Utf8));
        }
        catch(e){    
          data = CryptoJS.AES.decrypt(data,'intro-act',{format: CryptoJSAesJson}).toString(CryptoJS.enc.Utf8);    
        }
      }
      else{
        return data;
      }
      return data;
   }   
   else if(typeof data == 'object'){
    if(data == null){
        return null;
    }
    if(Array.isArray(data)){
        var ret = [];
    }
    else{
        var ret = {};
    }   
      $.each(data, function(key, value) {
        ret[key] = decrypts(value);
      });
      return ret;    
   }
}

