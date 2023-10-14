'use strict';

// Declare app level module which depends on filters, and services
var apps = angular.module('myApp', [
	'ngRoute', 'ngSanitize','angular.css.injector',
	'ngStorage',
	'ui.router',
	'ngAnimate',
	'ui.bootstrap',
	//"ng-fusioncharts",
	"angucomplete-alt",
	"ngTable",
	//"ngMessages",
	"ngResource", 'ui.select',
	"xeditable", 'ui.sortable', 
	//'ngDraggable', 
	//'infinite-scroll',
	"LocalStorageModule", 'myApp.constants',
	'myApp.filters',
	'myApp.services',
	'myApp.directives',
	//'myApp.accessCtrl',
	//'myApp.dashboardCtrl',
	'myApp.meetingCtrl',
	//'blueimp.fileupload',
	//'myApp.meetingArchiveCtrl',
	'myApp.profileCtrl',
	'myApp.corporateCtrl',
	'myApp.brokerviewCtrl',
	//'myApp.watchlistCtrl',
	//'myApp.eventCtrl',
	//'myApp.analysisCtrl',
	//'myApp.investorsCtrl',
	//'myApp.predictedLeadsCtrl',
	//'myApp.customResearchCtrl',
	//'myApp.proposalCtrl',
	//'myApp.ResearchproposalCtrl',
	'myApp.distributeContentCtrl',
	//'myApp.activitiesLeadsCtrl',
	//'myApp.prospectsCtrl',
	//'myApp.updatePageCtrl',
	//'myApp.settingsCtrl',
	//'myApp.investornotesCtrl',
	//'myApp.meetingPreparation',
	//'myApp.themesDashboard',
	//'myApp.researchProvider',
	//'myApp.fairCtrl',
	//'myApp.crmCtrl',
	//'ngLoadingSpinner',
	'angular.filter',
	//'myApp.holdersListCtrl',
	//'myApp.researchideaCtrl',
	'socialshare',
	'BotDetectCaptcha'
]);
apps.run(['$rootScope', 'usertype', 'localStorageService', '$location', function ($rootScope, usertype, localStorageService, $location) {
	//usertype.doService('investor');
	var locat = $location.$$path;
	if (locat.indexOf("secretkey") > 0) { // secret key in url Present stored in local storage 
		var keyonly = locat.split("/");
		keyonly = keyonly[2];
		localStorageService.set('keyonly', keyonly);
	}

	$rootScope.$on('$routeChangeSuccess', function(event, current) {
		if (current.$$route && current.$$route.originalPath) {
		  gtag('config', 'G-7YRPXV79GJ', {'page_path': current.$$route.originalPath});
		}
	});

	$rootScope.userPermission = '';
	$rootScope.sessionStat = '';

}]);
apps.run(['$rootScope', '$uibModalStack', function ($rootScope, $uibModalStack) {
	//usertype.doService('investor');
	$rootScope.$on('$stateChangeSuccess', function(toState, toParams, fromState, fromParams) {
        $uibModalStack.dismissAll();
    });
}]);

apps.run(function (editableOptions, $rootScope, $location, usertype, localStorageService, permissions, RequestDetail, cssInjector, $window) {

	

	editableOptions.theme = 'bs3';

	$rootScope.$on("$locationChangeStart", function (event, next, current) {

		 

		$rootScope.sessionStat = '';
		var apiurl = 'apiv4/public/user/UserPermission';
		var apiparams = '';

		/*

		New Capital
NewCapital
Consumer Staples
consumerstaples
Consumer Discretionary
consumerdiscretionary
financial
Technology/Communication
Technology
Communication
Health Care
HealthCare
Industrials
Materials
Energy/Utilities
Energy
Utilities
Real Estate
RealEstate
EnvironmentalSocialandGovernance
esg
Quantitative Screens
QuantitativeScreens

		*/
		

		if ($location.path() != '/login' && $location.path() != '/register' && $location.path() != '/RPregistration' && $location.path() != '/RPlogin' && $location.path() != '/forgotPassword' && $location.path().indexOf('/setpassword/') == -1 && $location.path().indexOf('/setrppassword/') == -1 && $location.path().indexOf('/viewthemesDashboard/') == -1 && $location.path().indexOf('/corporatecompany/') == -1 && $location.path().indexOf('/introactcorporate/') == -1 && $location.path().indexOf('/introactcompany/') == -1 && $location.path() != '/login/auto' && $location.path() != '/login/demo' && $location.path() != '/login/video' && $location.path() != '/login/scorecard_video' && $location.path().indexOf('/autologin/') == -1 && $location.path().indexOf('/daily/') == -1 && $location.path().indexOf('/fundamentals/') == -1 && $location.path().indexOf('/research/') == -1 && $location.path().indexOf('/stash/') == -1 && $location.path().indexOf('/research_ideaview/') == -1 && $location.path().indexOf('/eventresponse/') == -1 && $location.path().indexOf('/researchdashboardview/') == -1 && $location.path() != '/targetreport' && $location.path() != '/subscription' && $location.path() != '/researchsubscription' && $location.path() != '/stashsubscription' && $location.path() != '/spacetechsubscription' && $location.path() != '/newcapitalsubscription' && $location.path() != '/samplereport' && $location.path().indexOf('/login/scorecard_video/') == -1 && $location.path() != '/stasharchive' && $location.path() != '/spacearchive' && $location.path() != '/researcharchive' && $location.path() != '/spacarchive' && $location.path() != '/irarchive' && $location.path().indexOf('/researchprovider/') == -1 && $location.path().indexOf('/components/') == -1 && $location.path().indexOf('/fairlistview/') == -1 && $location.path().indexOf('/fairlist/list/') == -1 && $location.path().indexOf('/fairlist/askquestion/') == -1 && $location.path().indexOf('/fairlist/notification/') == -1 && $location.path().indexOf('/reportsubscription/') == -1 && $location.path() != '/coverage' && $location.path().indexOf('/coverage/') == -1 && $location.path().indexOf('/upcomingevents/') == -1 && $location.path().indexOf('/industryresearch/') == -1 && $location.path().indexOf('/companyresearch/') == -1 && $location.path().indexOf('/eventview/') == -1 && $location.path().indexOf('/accessexpertise/') == -1 && $location.path().indexOf('/news/') == -1 && $location.path().indexOf('/podcast/') == -1 && $location.path() != '/investor' && $location.path() != '/corporate' && $location.path() != '/researchproviders' && $location.path() != '/foreignbrokers' && $location.path() != '/about' && $location.path() != '/contact' && $location.path().indexOf('/reset/') == -1 && $location.path() != '/newslettercategory' && $location.path() != '/becomecontributor' && $location.path() != '/topresearchproviders' && $location.path().indexOf('/researchspotlight/') == -1 && $location.path().toLowerCase() != '/New Capital' && $location.path().toLowerCase() != '/new-capital' && $location.path().toLowerCase() != '/Consumer Staples' && $location.path().toLowerCase() != '/consumerstaples' && $location.path().toLowerCase() != '/Consumer Discretionary' && $location.path().toLowerCase() != '/consumerdiscretionary' && $location.path().toLowerCase() != '/financial' && $location.path().toLowerCase() != '/Technology/Communication' && $location.path().toLowerCase() != '/technology' && $location.path().toLowerCase() != '/communication' && $location.path().toLowerCase() != '/Health Care' && $location.path().toLowerCase() != '/healthcare' && $location.path().toLowerCase() != '/space-tech' && $location.path().toLowerCase() != '/materials' && $location.path().toLowerCase() != '/Energy/Utilities' && $location.path().toLowerCase() != '/EnergyUtilities' && $location.path().toLowerCase() != '/energy' && $location.path().toLowerCase() != '/Utilities' && $location.path().toLowerCase() != '/Real Estate' && $location.path().toLowerCase() != '/realestate' && $location.path().toLowerCase() != '/EnvironmentalSocialandGovernance' && $location.path().toLowerCase() != '/esg' && $location.path().toLowerCase() != '/Quantitative Screens' && $location.path().toLowerCase() != '/quantitativescreens') {
			localStorageService.set('url', $location.path());
			usertype.doService(localStorageService.get('usertype'));
			var x = localStorageService.get('usertype');
			var y = localStorageService.get('userdata');
			if (angular.isUndefined(x) || x == '' || x == null) {
				$rootScope.usertype = '';
				
				

				if ($location.path() == '/login/auto' || $location.path() != '' && $location.path() != '/login' && $location.path().indexOf('/autologin/') != -1 ) {
					$location.path('/login/auto');
				} else if ($location.path() == '/login/demo' || $location.path() != '' && $location.path() != '/login' && $location.path().indexOf('/autologin/') != -1) {
					$location.path('/login/demo');
				}else if ($location.path() == '/login/video' || $location.path() != '' && $location.path() != '/login' && $location.path().indexOf('/autologin/') != -1) {
					$location.path('/login/video');
				}else if ($location.path() == '/login/scorecard_video' || $location.path() != '' && $location.path() != '/login' && $location.path().indexOf('/autologin/') != -1) {
					$location.path('/login/scorecard_video');
				} else if ($location.path().indexOf('/autologin/') == -1 || $location.path() != '' && $location.path() != '/login') {
					if($location.path().indexOf('/autologin/') == '-1'){
						$location.path('/login');
					}
				} else {
					$location.path('/login');
				}

			}
			if (angular.isUndefined(y) || y == '' || y == null) {
				$rootScope.usertype = '';
				if ($location.path() == '/login/auto' || $location.path() != '' && $location.path() != '/login' && $location.path().indexOf('/autologin/') != -1) {
					$location.path('/login/auto');
				} else if ($location.path() == '/login/demo' || $location.path() != '' && $location.path() != '/login' && $location.path().indexOf('/autologin/') != -1) {
					$location.path('/login/demo');
				}else if ($location.path() == '/login/video' || $location.path() != '' && $location.path() != '/login' && $location.path().indexOf('/autologin/') != -1) {
					$location.path('/login/video');
				}else if ($location.path() == '/login/scorecard_video' || $location.path() != '' && $location.path() != '/login' && $location.path().indexOf('/autologin/') != -1) {
					$location.path('/login/scorecard_video');
				} else if ($location.path().indexOf('/autologin/') == -1 || $location.path() != '' && $location.path() != '/login') {
					if($location.path().indexOf('/autologin/') == '-1'){
						$location.path('/login');
					}
				} else {
					$location.path('/login');
				}
			}
		}

		RequestDetail.getDetail(apiurl, apiparams).then(function (result) {
			var user_permission = '';
			if (angular.isDefined(result.data) && angular.isDefined(result.data.subscription_type) && result.data.subscription_type != '') {
				if (result.data.subscription_type == '0' || result.data.subscription_type == 0) {
					user_permission = 'trial';
				} else if (result.data.subscription_type == '1' || result.data.subscription_type == 1) {
					user_permission = 'free';
				} else if (result.data.subscription_type == '2' || result.data.subscription_type == 2) {
					user_permission = 'premium';
				}
			}
			permissions.setPermissions(user_permission);



			if (angular.isDefined(result.data) && angular.isDefined(result.data.items) && angular.isDefined(result.data.items.user_type) &&
				($location.path() == '/login' || $location.path() == '/register' || $location.path() == '/RPregistration' || $location.path() == '/RPlogin' || $location.path() == '/forgotPassword' || $location.path().indexOf('/setpassword/') != -1 || $location.path().indexOf('/setrppassword/') != -1 || $location.path() == '/login/auto' || $location.path() == '/login/demo' || $location.path() == '/login/video' || $location.path() == '/login/scorecard_video' || $location.path().indexOf('/autologin/') != -1)) {
				var userType = result.data.items.user_type; // USER TYPE 
				if (userType == 1) {
					localStorageService.set('usertype', 'investor');
					localStorageService.set('userdata', result.data.items);
					$rootScope.usertype = localStorageService.get('usertype');
					usertype.doService($rootScope.usertype);
					localStorageService.set('userimage', result.data.items.image);
					localStorageService.set('email', result.data.items.email);
					$rootScope.sessionStat = 'exist';
					//$location.path('dashboard');
				} else if (userType == 2) {
					localStorageService.set('usertype', 'corporate');
					localStorageService.set('userdata', result.data.items);
					$rootScope.usertype = localStorageService.get('usertype');
					usertype.doService($rootScope.usertype);
					localStorageService.set('userimage', result.data.items.image);
					localStorageService.set('email', result.data.items.email);
					$rootScope.sessionStat = 'exist';
					//$location.path('dashboard');
				} else if (userType == 3) {
					localStorageService.set('usertype', 'broker');
					localStorageService.set('userdata', result.data.items);
					$rootScope.usertype = localStorageService.get('usertype');
					usertype.doService($rootScope.usertype);
					localStorageService.set('userimage', result.data.items.image);
					localStorageService.set('email', result.data.items.email);
					$rootScope.sessionStat = 'exist';
					//$location.path('dashboard');
				}
				else if (userType == 4) {
					localStorageService.set('usertype', 'sales');
					localStorageService.set('userdata', result.data.items);
					$rootScope.usertype = localStorageService.get('usertype');
					usertype.doService($rootScope.usertype);
					localStorageService.set('userimage', result.data.items.image);
					localStorageService.set('email', result.data.items.email);
					$rootScope.sessionStat = 'exist';
					//$location.path('researchanalytics');
				}
			}

			if ($rootScope.sessionStat == '') {
				$rootScope.sessionStat = 'notExist';
			}
			$rootScope.url = '';
			if ($location.path() != '/search') {
				$rootScope.searchText = '';
			}
			if ($location.path() != '/event/new') {
				var obj = new Object();
				localStorageService.set('live_events', obj);
			}


			

			if ($location.path() != '/login' && $location.path() != '/register' && $location.path() != '/RPregistration' && $location.path() != '/RPlogin' && $location.path() != '/forgotPassword' && $location.path().indexOf('/setpassword/') == -1 && $location.path().indexOf('/setrppassword/') == -1  && $location.path().indexOf('/viewthemesDashboard/') == -1 && $location.path().indexOf('/corporatecompany/') == -1 && $location.path().indexOf('/introactcorporate/') == -1 && $location.path().indexOf('/introactcompany/') == -1 && $location.path() != '/login/auto' && $location.path() != '/login/demo' && $location.path() != '/login/video' && $location.path() != '/login/scorecard_video' && $location.path().indexOf('/autologin/') == -1 && $location.path().indexOf('/daily/') == -1 && $location.path().indexOf('/fundamentals/') == -1 && $location.path().indexOf('/research/') == -1 && $location.path().indexOf('/stash/') == -1 && $location.path().indexOf('/research_ideaview/') == -1 && $location.path().indexOf('/eventresponse/') == -1 && $location.path().indexOf('/researchdashboardview/') == -1 && $location.path() != '/targetreport' && $location.path() != '/subscription' && $location.path() != '/researchsubscription' && $location.path() != '/stashsubscription' && $location.path() != '/spacetechsubscription' && $location.path() != '/spacarchive' && $location.path() != '/newcapitalsubscription' && $location.path() != '/samplereport' && $location.path().indexOf('/login/scorecard_video/') == -1 && $location.path() != '/stasharchive' && $location.path() != '/spacearchive' && $location.path() != '/researcharchive' && $location.path() != '/irarchive' && $location.path().indexOf('/researchprovider/') == -1 && $location.path().indexOf('/components/') == -1 && $location.path().indexOf('/fairlistview/') == -1 && $location.path().indexOf('/fairlist/list/') == -1 && $location.path().indexOf('/fairlist/askquestion/') == -1 && $location.path().indexOf('/fairlist/notification/') == -1 && $location.path().indexOf('/reportsubscription/') == -1 && $location.path() != '/coverage' && $location.path().indexOf('/coverage/') == -1 && $location.path().indexOf('/upcomingevents/') == -1 && $location.path().indexOf('/industryresearch/') == -1 && $location.path().indexOf('/eventview/') == -1 && $location.path().indexOf('/companyresearch/') == -1 && $location.path().indexOf('/accessexpertise/') == -1 && $location.path().indexOf('/news/') == -1 && $location.path().indexOf('/podcast/') == -1 && $location.path() != '/investor' && $location.path() != '/corporate' && $location.path() != '/researchproviders' && $location.path() != '/foreignbrokers' && $location.path() != '/about' && $location.path().indexOf('/reset/') == -1 && $location.path() != '/contact' && $location.path() != '/newslettercategory' && $location.path() != '/becomecontributor' && $location.path() != '/topresearchproviders' && $location.path().indexOf('/researchspotlight/') == -1 && $location.path().toLowerCase() != '/New Capital' && $location.path().toLowerCase() != '/new-capital' && $location.path().toLowerCase() != '/Consumer Staples' && $location.path().toLowerCase() != '/consumerstaples' && $location.path().toLowerCase() != '/Consumer Discretionary' && $location.path().toLowerCase() != '/consumerdiscretionary' && $location.path().toLowerCase() != '/financial' && $location.path().toLowerCase() != '/Technology/Communication' && $location.path().toLowerCase() != '/technology' && $location.path().toLowerCase() != '/communication' && $location.path().toLowerCase() != '/Health Care' && $location.path().toLowerCase() != '/healthcare' && $location.path().toLowerCase() != '/space-tech' && $location.path().toLowerCase() != '/materials' && $location.path().toLowerCase() != '/Energy/Utilities' && $location.path().toLowerCase() != '/EnergyUtilities' && $location.path().toLowerCase() != '/energy' && $location.path().toLowerCase() != '/Utilities' && $location.path().toLowerCase() != '/Real Estate' && $location.path().toLowerCase() != '/realestate' && $location.path().toLowerCase() != '/EnvironmentalSocialandGovernance' && $location.path().toLowerCase() != '/esg' && $location.path().toLowerCase() != '/Quantitative Screens' && $location.path().toLowerCase() != '/quantitativescreens') {

				

				localStorageService.set('url', $location.path());

				usertype.doService(localStorageService.get('usertype'));

				var x = localStorageService.get('usertype');

				var y = localStorageService.get('userdata');

				if (angular.isUndefined(x) || x == '' || x == null) {

					$rootScope = {};
					$rootScope.usertype = '';
					if ($location.path() == '/login/auto' || $location.path() != '' && $location.path() != '/login' && $location.path().indexOf('/autologin/') != -1) {
						$location.path('/login/auto');
					} else if ($location.path() == '/login/demo' || $location.path() != '' && $location.path() != '/login' && $location.path().indexOf('/autologin/') != -1) {
						$location.path('/login/demo');
					}else if ($location.path() == '/login/video' || $location.path() != '' && $location.path() != '/login' && $location.path().indexOf('/autologin/') != -1) {
						$location.path('/login/video');
					}else if ($location.path() == '/login/scorecard_video' || $location.path() != '' && $location.path() != '/login' && $location.path().indexOf('/autologin/') != -1) {
						$location.path('/login/scorecard_video');
					} else if ($location.path().indexOf('/autologin/') == -1 || $location.path() != '' && $location.path() != '/login') {
						if($location.path().indexOf('/autologin/') == '-1'){
							$location.path('/login');
						}
					} else {
						$location.path('/login');
					}

				}

				if (angular.isUndefined(y) || y == '' || y == null) {

					$rootScope = {};
					$rootScope.usertype = '';
					if ($location.path() == '/login/auto' || $location.path() != '' && $location.path() != '/login' && $location.path().indexOf('/autologin/') != -1) {
						$location.path('/login/auto');
					} else if ($location.path() == '/login/demo' || $location.path() != '' && $location.path() != '/login' && $location.path().indexOf('/autologin/') != -1) {
						$location.path('/login/demo');
					}else if ($location.path() == '/login/video' || $location.path() != '' && $location.path() != '/login' && $location.path().indexOf('/autologin/') != -1) {
						$location.path('/login/video');
					}else if ($location.path() == '/login/scorecard_video' || $location.path() != '' && $location.path() != '/login' && $location.path().indexOf('/autologin/') != -1) {
						$location.path('/login/scorecard_video');
					} else if ($location.path().indexOf('/autologin/') == -1 || $location.path() != '' && $location.path() != '/login') {
						if($location.path().indexOf('/autologin/') == '-1'){
							$location.path('/login');
						}
					} else {
						$location.path('/login');
					}

				}
			}
			window.scrollTo(0, 0);
		});

		

		var dah = $location.path().toLowerCase();

		if ($location.path() == '/login' || $location.path() == '/coverage' || $location.path().indexOf('/coverage/') != -1 || $location.path().indexOf('/upcomingevents/') != -1 || $location.path().indexOf('/industryresearch/') != -1 || $location.path().indexOf('/companyresearch/') != -1 || $location.path().indexOf('/eventview/') != -1 || $location.path().indexOf('/accessexpertise/') != -1 || $location.path().indexOf('/news/') != -1 || $location.path().indexOf('/podcast/') != -1 || $location.path() == '/samplereport' || $location.path() == '/targetreport' || $location.path() == '/investor' || $location.path() == '/corporate' || $location.path() == '/researchproviders' || $location.path() == '/foreignbrokers' || $location.path() == '/about' || $location.path() == '/contact' || $location.path().indexOf('/reset/') != -1 || $location.path() == '/newslettercategory' || $location.path() == '/becomecontributor' || $location.path() == '/topresearchproviders' || $location.path().indexOf('/researchspotlight/') != -1 || $location.path() == '/login/auto' || $location.path() == '/login/demo' || $location.path() == '/login/video' || $location.path() == '/login/scorecard_video' || $location.path().indexOf('/research_ideaview/') != -1 || $location.path() == '/subscription' || $location.path() == '/researchsubscription' || $location.path() == '/stashsubscription' || $location.path() == '/spacetechsubscription' || $location.path() == '/newcapitalsubscription' || $location.path() == '/stasharchive' || $location.path() == '/spacarchive' || $location.path() == '/spacearchive' || $location.path() == '/irarchive' || $location.path() == '/researcharchive' || dah == '/New Capital' || dah == '/new-capital' || dah == '/Consumer Staples' || dah == '/consumerstaples' || dah == '/Consumer Discretionary' || dah == '/consumerdiscretionary' || dah == '/financial' || dah == '/Technology/Communication' || dah == '/technology' || dah == '/communication' || dah == '/Health Care' || dah == '/healthcare' || dah == '/space-tech' || dah == '/materials' || dah == '/Energy/Utilities' || dah == '/EnergyUtilities' || dah == '/energy' || dah == '/Utilities' || dah == '/Real Estate' || dah == '/realestate' || dah == '/EnvironmentalSocialandGovernance' || dah == '/esg' || dah == '/Quantitative Screens' || dah == '/quantitativescreens'){
			
			setTimeout(function myGreeting() {
				cssInjector.removeAll();
				//cssInjector.add("components/assets/css/flowbite.min.css");
				//cssInjector.add("components/assets/css/owl.carousel.min.css");
				//cssInjector.add("components/assets/css/main.css");
			  }, 200);

			$rootScope.csstype = 2;
		}else{
			
			if($location.path().indexOf('/distributeContent/preview/') == -1 && $location.path().indexOf('/research/') == -1 && $location.path().indexOf('/fundamentals/') == -1 && $location.path().indexOf('/daily/') == -1 && $location.path().indexOf('/stash/') == -1 && $location.path().indexOf('/research_ideaview/') == -1 && $location.path().indexOf('/managetemplates/preview/') == -1 && $location.path().indexOf('/investordistributeContent/preview/') == -1){
				
				if($rootScope.csstype==2 || $rootScope.csstype==undefined){
					setTimeout(function myGreeting() {
						cssInjector.removeAll();
						cssInjector.add("css/bootstrap.min.css");
						cssInjector.add("css/richtext_new.min.css"); 
						cssInjector.add("css/style_new.css");
					  }, 200);
					
				}
				$rootScope.csstype = 1;
			}
			
		}
		
		
		
		

	});
});

/*.provider('movie', function () {
  this.version='';
  this.setVersion= function (value) {
      this.version = value;
    }
  this.$get = function () {
      return this.version
      
    }

})*/

apps.provider("usertype", function () {
	var provider = {};
	var user = '';
	/*  this.setUser = function(vals){
	    	this.user = vals;
	    }*/
	provider.$get = function () {
		var service = {};

		service.doService = function (data) {
			user = data;
			return user;
		}
		service.getService = function () {
			return user;
		}
		return service;
	}
	return provider;
});



apps.config(function($locationProvider) {
	$locationProvider.html5Mode({
		enabled: true
	});
});
apps.config(['$routeProvider', 'usertypeProvider', function ($routeProvider, usertypeProvider, $rootScope) {


	var refresh = '?t=V1AB24';

	 
	$rootScope = {};
	$rootScope.usertype = ''; 

	$routeProvider.when('/login', {
		templateUrl: 'partials/common/login.html'+refresh,
		controller: 'accessCtrl'
	});

	
	$routeProvider.when('/coverage', {
		templateUrl: 'partials/common/coverage.html'+refresh,
		controller: 'coverageCtrl'
	});
	$routeProvider.when('/coverage/:industry/:initialfilter', {
		templateUrl: 'partials/common/industry.html'+refresh,
		controller: 'industryCtrl'
	});

	$routeProvider.when('/upcomingevents/:industry', {
		templateUrl: 'partials/common/upcomingevents.html'+refresh,
		controller: 'upcomingeventsCtrl'
	});

	$routeProvider.when('/industryresearch/:articletype/:researchid', {
		templateUrl: 'partials/common/coverageresearch.html'+refresh,
		controller: 'coverageresearchCtrl'
	});

	$routeProvider.when('/companyresearch/:researchid', {
		templateUrl: 'partials/common/companyresearch.html'+refresh,
		controller: 'companyresearchCtrl'
	});
	
	$routeProvider.when('/eventview/:eventid', {
		templateUrl: 'partials/common/eventview.html'+refresh,
		controller: 'eventviewCtrl'
	});

	$routeProvider.when('/news/:newsid', {
		templateUrl: 'partials/common/news.html'+refresh,
		controller: 'newsCtrl'
	});

	$routeProvider.when('/reset/:hashId', {
		templateUrl: 'partials/common/resetpassword.html'+refresh,
		controller: 'resetCtrl'
	});

	$routeProvider.when('/podcast/:podcastid', {
		templateUrl: 'partials/common/podcastnew.html'+refresh,
		controller: 'podcastCtrl'
	});

	$routeProvider.when('/topresearchproviders', {
		templateUrl: 'partials/common/topresearchproviders.html'+refresh,
		controller: 'topresearchprovidersCtrl'
	});
	$routeProvider.when('/researchspotlight/:researchId', {
		templateUrl: 'partials/common/researchspotlight.html'+refresh,
		controller: 'researchspotlightCtrl'
	});

	$routeProvider.when('/accessexpertise/:curratorId', { 
		templateUrl: 'partials/common/accessexpertise.html'+refresh,
		controller: 'accessexpertiseCtrl'
	});

	$routeProvider.when('/becomecontributor', {
		templateUrl: 'partials/common/becomecontributor.html'+refresh,
		controller: 'becomecontributorCtrl'
	});

	$routeProvider.when('/investor', {
		templateUrl: 'partials/common/investorstatic.html'+refresh,
		controller: 'investorstaticCtrl'
	});
	$routeProvider.when('/corporate', {
		templateUrl: 'partials/common/corporatestatic.html'+refresh,
		controller: 'corporatestaticCtrl'
	});
	$routeProvider.when('/researchproviders', {
		templateUrl: 'partials/common/researchprovidersstatic.html'+refresh,
		controller: 'researchprovidersstaticCtrl'
	});
	$routeProvider.when('/foreignbrokers', {
		templateUrl: 'partials/common/foreignbrokersstatic.html'+refresh,
		controller: 'foreignbrokersstaticCtrl'
	});

	$routeProvider.when('/about', {
		templateUrl: 'partials/common/aboutstatic.html'+refresh,
		controller: 'aboutstaticCtrl'
	});
	$routeProvider.when('/contact', {
		templateUrl: 'partials/common/contactstatic.html'+refresh,
		controller: 'contactstaticCtrl'
	});
	$routeProvider.when('/newslettercategory', {
		templateUrl: 'partials/common/newslettercategory.html'+refresh,
		controller: 'newslettercategoryCtrl'
	});

	$routeProvider.when('/logout', {
		templateUrl: 'partials/common/login.html'+refresh,
		controller: 'logout'
	});

	$routeProvider.when('/autologin/:userid', {
		templateUrl: 'partials/common/login.html'+refresh,
		controller: 'autologinCtrl'
	});

	$routeProvider.when('/RPlogin', {
		templateUrl: 'partials/common/rplogin.html'+refresh,
		controller: 'rplogin'
	});

	$routeProvider.when('/login/:popupID', {
		templateUrl: 'partials/common/login.html'+refresh,
		controller: 'accessCtrl'
	});

	$routeProvider.when('/login/:popupID/:email', {
		templateUrl: 'partials/common/login.html'+refresh,
		controller: 'accessCtrl'
	});

	$routeProvider.when('/register', {
		templateUrl: 'partials/common/register.html'+refresh,
		controller: 'registerCtrl'
	});


	$routeProvider.when('/RPregistration', {
		templateUrl: 'partials/common/researchprovidersregister.html'+refresh,
		controller: 'researchprovidersregisterCtrl'
	});
	$routeProvider.when('/registerSuccess', {
		templateUrl: 'partials/common/registerSuccess.html'+refresh,
		controller: 'registerCtrl'
	});
	$routeProvider.when('/setpassword/:emailId', {
		templateUrl: 'partials/common/setPassword.html'+refresh,
		controller: 'passwordSet'
	});
	$routeProvider.when('/setrppassword/:emailId', {
		templateUrl: 'partials/common/rpsetPassword.html'+refresh,
		controller: 'passwordrpSet'
	});

	
	$routeProvider.when('/forgotPassword', {
		templateUrl: 'partials/common/forgotPassword.html'+refresh,
		controller: 'passwordReset'
	});

	$routeProvider.when('/dashboard', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/dashboard.html'+refresh;
		},
		controller: 'homeCtrl'
	});
	$routeProvider.when('/crm/:module_name', {
		templateUrl: function () {
			return 'partials/common/blank.html'+refresh;
		},
		controller: 'crmModule'
	});

	$routeProvider.when('/recordvideo', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/recordvideo.html'+refresh;
		},
		controller: 'recordVideo'
	});								  
	$routeProvider.when('/rpprofile-edit', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/rp_profile_edit.html'+refresh;
		},
		controller: 'rphomeCtrl'
	});
	$routeProvider.when('/Rpdashboard_analyst', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/rpdashbaord_analyst.html'+refresh;
		},
		controller: 'rpanalystCtrl'
	});

	$routeProvider.when('/targetreport', {
		templateUrl: function () {
			return 'partials/common/tickerreport.html'+refresh;
		},
		controller: 'tickerreportCtrl'
	});

	$routeProvider.when('/samplereport', {
		templateUrl: function () {
			return 'partials/common/samplereport.html'+refresh;
		},
		controller: 'samplereportCtrl'
	});

	$routeProvider.when('/subscription', {
		templateUrl: function () {
			return 'partials/common/subscriptiondaily.html'+refresh;
		},
		controller: 'subscriptiondailyCtrl'
	});

	$routeProvider.when('/researchsubscription', {
		templateUrl: function () {
			return 'partials/common/subscriptionresearch.html'+refresh;
		},
		controller: 'subscriptionresearchCtrl'
	});

	$routeProvider.when('/stashsubscription', {
		templateUrl: function () {
			return 'partials/common/stash.html'+refresh;
		},
		controller: 'subscriptionstashCtrl'
	});

	$routeProvider.when('/spacetechsubscription', {
		templateUrl: function () {
			return 'partials/common/space.html'+refresh;
		},
		controller: 'subscriptionspaceCtrl'
	});

	$routeProvider.when('/newcapitalsubscription', {
		templateUrl: function () {
			return 'partials/common/newcapital.html'+refresh;
		},
		controller: 'subscriptionnewcapitalCtrl'
	});
	
	$routeProvider.when('/profilecoveragelist', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/rpprofile_step3.html'+refresh;
		},
		controller: 'rpanalystprofileCtrl'
	});


	$routeProvider.when('/profilemarketingdeck', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/profilemarketingdeck.html'+refresh;
		},
		controller: 'profilemarketingdeckCtrl'
	});

	$routeProvider.when('/Rpanalyst_activate', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/rpdashbaord_analyst_activate.html'+refresh;
		},
		controller: 'rpanalystactCtrl'
	});

	$routeProvider.when('/Rpcoverage', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/rpcoverage.html'+refresh;
		},
		controller: 'rpcoverageCtrl'
	});
	$routeProvider.when('/profilecoverage', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/rpprofilecoverage.html'+refresh;
		},
		controller: 'rpprofilecoverageCtrl'
	});

	$routeProvider.when('/Rpsubscribers/:coveragelistId', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/rpsubscribers.html'+refresh;
		},
		controller: 'rpsubscribersCtrl'
	});

	$routeProvider.when('/profilesubscribers', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/rpprofilesubscribers.html'+refresh;
		},
		controller: 'rpprofilesubscribersCtrl'
	});


	$routeProvider.when('/Rpsuccess', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/rpdashbaord_success.html'+refresh;
		},
		controller: 'rpsuccessCtrl'
	});
	$routeProvider.when('/RPregsuccess', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/rpreg_success.html'+refresh;
		},
		controller: 'rpsuccessCtrl'
	});

	$routeProvider.when('/meeting/onDemand', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/ondemand.html'+refresh;
		},
		controller: 'onDemandMeetingCtrl'
	});

	$routeProvider.when('/meeting/new', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/meetingnew.html'+refresh;
		},
		controller: 'newMeetingCtrl'
	});
	$routeProvider.when('/meeting/new/:userId', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/meetingnew.html'+refresh;
		},
		controller: 'newMeetingCtrl'
	});
	
	$routeProvider.when('/meetingArchive', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/meetArch.html'+refresh;
		},
		controller: 'meetingArchiveCtrl'
	});
	$routeProvider.when('/meetingArchive/archieved', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/archievedMeeting.html'+refresh;
		},
		controller: 'archivedMeetingCtrl'
	});
	$routeProvider.when('/meetingArchive/aggregate', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/aggregateMeeting.html'+refresh;
		},
		controller: 'aggregateMeetingCtrl'
	});
	$routeProvider.when('/meetingArchive/aggregate/:ticker', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/recommendanalytics.html'+refresh;
		},
		controller: 'aggregateMeetinganalyticsCtrl'
	});

	$routeProvider.when('/investoranalytics/:investorId', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/investoranalytics.html'+refresh;
		},
		controller: 'investoranalyticsCtrl'
	});


	/*$routeProvider.when('/Predictedleads', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/aggregateMeeting.html'+refresh;
		},
		controller: 'aggregateMeetingCtrl'
	});*/


	$routeProvider.when('/stasharchive', {
		templateUrl: function () {
			return 'partials/common/stasharchive.html'+refresh;
		},
		controller: 'stasharchiveCtrl'
	});

	$routeProvider.when('/spacearchive', {
		templateUrl: function () {
			return 'partials/common/spacearchive.html'+refresh;
		},
		controller: 'spacearchiveCtrl'
	});

	$routeProvider.when('/spacarchive', {
		templateUrl: function () {
			return 'partials/common/spacarchive.html'+refresh;
		},
		controller: 'spacarchiveCtrl'
	});

	$routeProvider.when('/researcharchive', {
		templateUrl: function () {
			return 'partials/common/researcharchive.html'+refresh;
		},
		controller: 'researcharchive'
	});

	$routeProvider.when('/researchideaarchive/:userId', {
		templateUrl: function () {
			return 'partials/sales/researcharchive.html'+refresh;
		},
		controller: 'salesresearcharchive'
	});

	$routeProvider.when('/researchidea/:distribute_content_ideasId', {
		templateUrl: function () {
			return 'partials/sales/dailymailview.html'+refresh;
		},
		controller: 'researchidea_viewCtrl'
	});

	$routeProvider.when('/researchdistribute/:distribute_content_ideasId', {
		templateUrl: function () {
			return 'partials/sales/dailymailview.html'+refresh;
		},
		controller: 'researchidea_viewCtrl'
	});

	$routeProvider.when('/eventsarchive', {
		templateUrl: function () {
			return 'partials/sales/eventsarchive.html'+refresh;
		},
		controller: 'eventsarchive'
	});

	$routeProvider.when('/eventsarchive/new', {
		templateUrl: function () {
			return 'partials/sales/createresearchevent.html'+refresh;
		},
		controller: 'createresearchevent'
	});

	$routeProvider.when('/eventsarchive/edit/:eventId', {
		templateUrl: function () {
			return 'partials/sales/createresearchevent.html'+refresh;
		},
		controller: 'editresearchevent'
	});

	$routeProvider.when('/eventsarchive/contacts/:eventId', {
		templateUrl: function () {
			return 'partials/sales/eventscontacts.html'+refresh;
		},
		controller: 'viewresearchevent'
	});
	
	$routeProvider.when('/irarchive', {
		templateUrl: function () {
			return 'partials/common/irarchive.html'+refresh;
		},
		controller: 'irarchive'
	});


	$routeProvider.when('/Predictedleads', {
		templateUrl: function () {
			return 'partials/common/predictedLeadsList.html'+refresh;
		},
		controller: 'predictedLeadsList'
	});

	$routeProvider.when('/investors', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/holders.html'+refresh;
		},
		controller: 'holdersList'
	});

	$routeProvider.when('/scorecard', {
		templateUrl: function () {
			return 'partials/common/scorecard.html'+refresh;
		},
		controller: 'scorecardCtrl'
	});

	$routeProvider.when('/Predictedleads/:fund_id', {
		templateUrl: function () {
			return 'partials/common/factorsofinfluence.html'+refresh;
		},
		controller: 'aggregateMeetinganalyticsCtrl'
	});
	$routeProvider.when('/Predictedleads/:fund_id/:ticker', {
		templateUrl: function () {
			return 'partials/common/factorsofinfluence.html'+refresh;
		},
		controller: 'aggregateMeetinganalyticsCtrl'
	});

	$routeProvider.when('/meetingArchive/factorsofinfluence', {
		templateUrl: function () {
			return 'partials/common/factorsofinfluence.html'+refresh;
		},
		controller: 'factorsofinfluenceCtrl'
	});


	//investor
	$routeProvider.when('/meeting_recommend', {
		templateUrl: function () {
			return 'partials/common/recommendanalytics.html'+refresh;
		},
		controller: 'meeting_recommendanalyticsCtrl'
	});


	$routeProvider.when('/meetingArchive/next_event', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/next_event.html'+refresh;
		},
		controller: 'aggregateMeetinganalyticsCtrl'
	});

	$routeProvider.when('/action_leads', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/action_leads.html'+refresh;
		},
		controller: 'actionsLeadsCtrl'
	});

	$routeProvider.when('/research_comments', {
		templateUrl: function () {
			return 'partials/common/research_comments.html'+refresh;
		},
		controller: 'research_commentsCtrl'
	});

	$routeProvider.when('/research_comments/:dailyname', {
		templateUrl: function () {
			return 'partials/common/research_comments.html'+refresh;
		},
		controller: 'research_commentsCtrl'
	});

	$routeProvider.when('/research_ideaview/:ideasid', {
		templateUrl: function () {
			return 'partials/common/corpideaview.html'+refresh;
		},
		controller: 'rpideasview'
	});
	
	$routeProvider.when('/researchideasubscripe/:researchproviderId', {
		templateUrl: function () {
			return 'partials/common/researchideasubscripe.html'+refresh;
		},
		controller: 'researchideasubscripe'
	});

	$routeProvider.when('/meetingArchive/:meetingid', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/meetArch.html'+refresh;
		},
		controller: 'meetingArchiveCtrl'
	});
	$routeProvider.when('/profile/edit', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/profileEdit.html'+refresh;
		},
		controller: 'profileEditCtrl'
	});
	$routeProvider.when('/profile', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/profile.html'+refresh;
		},
		controller: 'profileCtrl'
	});
	$routeProvider.when('/companyprofile', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/cmyprofile.html'+refresh;
		},
		controller: 'cmyprofileCtrl'
	});

	$routeProvider.when('/companyprofile/edit', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/cmyprofileEdit.html'+refresh;
		},
		controller: 'companyprofileEditCtrl'
	});


	$routeProvider.when('/search', {
		templateUrl: function () {
			return 'partials/common/search.html'+refresh;
		},
		controller: 'searchCtrl'
	}); /* Controller in dashboardCtrl.js */
	$routeProvider.when('/corporateuser/:userId', {
		templateUrl: function () {
			return 'partials/common/corporateProfile.html'+refresh;
		},
		controller: 'corporateCtrl'
	});
	$routeProvider.when('/corporatecompany/:userId/:secretKey', {
		templateUrl: function () {
			return 'partials/common/corporateProfile_cmy.html'+refresh;
		},
		controller: 'corporatecompanyCtrl'
	});
	$routeProvider.when('/corporatecompany/:userId', {
		templateUrl: function () {
			return 'partials/common/corporateProfile_cmy.html'+refresh;
		},
		controller: 'corporatecompanyCtrl'
	});

	$routeProvider.when('/introactcompany/:userId', {
		templateUrl: function () {
			return 'partials/common/corporateProfile_cmy.html'+refresh;
		},
		controller: 'introactcompanyCtrl'
	});

	$routeProvider.when('/introactcorporate/:ticker', {
		templateUrl: function () {
			return 'partials/common/corporateProfile_cmy.html'+refresh;
		},
		controller: 'introactcorporateCtrl'
	});

	$routeProvider.when('/reportsubscription/:irpuser', {
		templateUrl: function () {
			return 'partials/common/IRPsubscription.html'+refresh;
		},
		controller: 'reportsubscriptionCtrl'
	});
	$routeProvider.when('/reportsubscription/:irpuser/:email', {
		templateUrl: function () {
			return 'partials/common/IRPsubscription.html'+refresh;
		},
		controller: 'reportsubscriptionCtrl'
	});

	$routeProvider.when('/company/:userId', {
		templateUrl: function () {
			return 'partials/common/profile_cmy.html'+refresh;
		},
		controller: 'corporatecompanyCtrl'
	});

	$routeProvider.when('/reports', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/reports.html'+refresh;
		},
		controller: 'reportsCtrl'
	});

	$routeProvider.when('/watchlists', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/watchlist.html'+refresh;
		},
		controller: 'watchlistCtrl'
	});
	$routeProvider.when('/events', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/events.html'+refresh;
		},
		controller: 'eventCtrl'
	});
	$routeProvider.when('/meeting/:meetingid', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/meetingDetail.html'+refresh;
		},
		controller: 'meetingDetail'
	});
	$routeProvider.when('/analysis', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/analysis.html'+refresh;
		},
		controller: 'analysisCtrl'
	});


	$routeProvider.when('/settingInvestor', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/settings.html'+refresh;
		},
		controller: 'investorSettings'
	});

	$routeProvider.when('/settingsRp', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/settings.html'+refresh;
		},
		controller: 'rpSettings'
	});
	$routeProvider.when('/setting', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/settings.html'+refresh;
		},
		controller: 'rpSettings'
	});				
	$routeProvider.when('/customers', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/customers.html'+refresh;
		},
		controller: 'customers'
	});

	$routeProvider.when('/prospects', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/prospects.html'+refresh;
		},
		controller: 'prospects'
	});

	//event
	$routeProvider.when('/event/new', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/newEvent.html'+refresh;
		},
		controller: 'newEventCtrl'
	});

	$routeProvider.when('/newevent', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/newEvent.html'+refresh;
		},
		controller: 'brokernewEventCtrl'
	});


	$routeProvider.when('/eventslist', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/eventslist.html'+refresh;
		},
		controller: 'eventlistCtrl'
	});

	$routeProvider.when('/event/view/:eventId', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/viewevent.html'+refresh;
		},
		controller: 'vieweventctrl'
	});

	$routeProvider.when('/event/response/:eventId', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/responseEvent.html'+refresh;
		},
		controller: 'vieweventctrl'
	});

	$routeProvider.when('/event/response/edit/:eventId', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/responseEditEvent.html'+refresh;
		},
		controller: 'editeventctrl'
	});


	// broker pages
	$routeProvider.when('/eventresponseview/:eventId', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/responseEvent.html'+refresh;
		},
		controller: 'brokervieweventctrl'
	});
	$routeProvider.when('/eventresponseview/edit/:eventId', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/responseEditEvent.html'+refresh;
		},
		controller: 'brokerediteventctrl'
	});


	$routeProvider.when('/alleventslist', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/alleventslist.html'+refresh;
		},
		controller: 'eventlistCtrl'
	});

	/* For Corpotrates */
	
	$routeProvider.when('/event/own', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/ownEvent.html'+refresh;
		},
		controller: 'ownEventCtrl'
	});
	
	$routeProvider.when('/eventresponse/:eventId', {
		templateUrl: function () {
			return 'partials/common/responseEvent.html'+refresh;
		},
		controller: 'vieweventctrl'
	});

	$routeProvider.when('/event/response/:eventId/:secretKey', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/responseEvent.html'+refresh;
		},
		controller: 'vieweventctrl'
	});
	$routeProvider.when('/event/responseEvents/:eventId', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/responseliveEvent.html'+refresh;
		},
		controller: 'liveeventResponseCtrl'
	});

	$routeProvider.when('/event/schedule/:eventId', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/scheduleEvent.html'+refresh;
		},
		controller: 'scheduleEventCtrl'
	});

	$routeProvider.when('/researchProviderPredictedLeads', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/predictedLeadsList.html'+refresh;
		},
		controller: 'predictedLeadsList'
	});

	$routeProvider.when('/investorcompatibility', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/investorcompatibility.html'+refresh;
		},
		controller: 'investorcompatibility'
	});


	$routeProvider.when('/convictionbuys/:fundId', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/convictionbuys.html'+refresh;
		},
		controller: 'convictionbuys'
	});


	$routeProvider.when('/convictionsells/:fundId', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/convictionsells.html'+refresh;
		},
		controller: 'convictionsells'
	});


	$routeProvider.when('/ManageProposal', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/manage_proposalList.html'+refresh;
		},
		controller: 'manageProposals_List'
	});

	$routeProvider.when('/proposal/create', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/create_proposal.html'+refresh;
		},
		controller: 'createProposal'
	});
	$routeProvider.when('/proposal/view/:proposal_id', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/view_proposal.html'+refresh;
		},
		controller: 'viewProposal'
	});

	$routeProvider.when('/proposal/edit/:proposal_id', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/edit_proposal.html'+refresh;
		},
		controller: 'editProposalCtrl'
	});

	$routeProvider.when('/myInterestedProposals', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/proposalList.html'+refresh;
		},
		controller: 'myInterestedProposalsCtrl'
	});

	$routeProvider.when('/myInterestedProposals/view/:proposal_id', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/proposal_view.html'+refresh;
		},
		controller: 'viewInterestedProposal'
	});
	$routeProvider.when('/ResearchList', {
		templateUrl: function () {
			return 'partials/common/custom_researchList.html'+refresh;
		},
		controller: 'allEventListBroker'
	});
	$routeProvider.when('/allEventListBroker', {
		templateUrl: function () {
			return 'partials/common/customresearchlist_dashboard.html'+refresh;
		},
		controller: 'CustomresearchList_dashboard'
	});
	$routeProvider.when('/researchProposal/create', {
		templateUrl: function () {
			return 'partials/common/create_research_proposal.html'+refresh;
		},
		controller: 'createResearchProposal'
	});
	$routeProvider.when('/researchProposal/view/:requirementId', {
		templateUrl: function () {
			return 'partials/common/view_research_proposal.html'+refresh;
		},
		controller: 'viewResearchrequest'
	});

	$routeProvider.when('/distribute', {
		templateUrl: function () {
			return 'partials/common/distribute.html'+refresh;
		},
		controller: 'distributePath'
	});

	$routeProvider.when('/distributeContent', {
		templateUrl: function () {
			return 'partials/common/create_distributeContent.html'+refresh;
		},
		controller: 'createDContent'
	});

	
	
	$routeProvider.when('/researchContent', {
		templateUrl: function () {
			return 'partials/sales/create_distributeContent.html'+refresh;
		},
		controller: 'createRContent'
	});
	
	$routeProvider.when('/researchContent/edit/:distribute_content_ideasId', {
		templateUrl: function () {
			return 'partials/sales/create_distributeContent.html'+refresh;
		},
		controller: 'editRContent'
	});

	$routeProvider.when('/researchDetail/:distribute_content_ideasId', {
		templateUrl: function () {
			return 'partials/sales/researchDetail.html'+refresh;
		},
		controller: 'researchDetail'
	});
	
	$routeProvider.when('/distributeEmail', {
		templateUrl: function () {
			return 'partials/common/distributeEmail.html'+refresh;
		},
		controller: 'distributeEmail'
	});
	

	$routeProvider.when('/distributeContent/edit/:distributeId', {
		templateUrl: function () {
			return 'partials/common/create_distributeContent.html'+refresh;
		},
		controller: 'editDContent'
	});
	$routeProvider.when('/distributeContent/preview/:distributeId', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/distributemailview.html'+refresh;
		},
		controller: 'previewDContent'
	});

	
	

	$routeProvider.when('/distributeContent/:distributeId', {
		templateUrl: function () {
			return 'partials/common/create_distributeContent.html'+refresh;
		},
		controller: 'createDContent'
	});
	$routeProvider.when('/senddistributeContent/email/:email', {
		templateUrl: function () {
			return 'partials/common/create_distributeContent.html'+refresh;
		},
		controller: 'createDContent'
	});
	$routeProvider.when('/distributeContent/:distributeId/:filterStatus', {
		templateUrl: function () {
			return 'partials/common/create_distributeContent.html'+refresh;
		},
		controller: 'createDContent'
	});
	$routeProvider.when('/distributeContent/:distributeId/:filterStatus/:email', {
		templateUrl: function () {
			return 'partials/common/create_distributeContent.html'+refresh;
		},
		controller: 'createDContent'
	});

	$routeProvider.when('/corporatedistributeContent', {
		templateUrl: function () {
			return 'partials/common/corporatedistributeContent.html'+refresh;
		},
		controller: 'corporatecreateDContent'
	});

	$routeProvider.when('/corporatedistributeContent/edit/:distributeId', {
		templateUrl: function () {
			return 'partials/common/corporatedistributeContent.html'+refresh;
		},
		controller: 'corporateeditDContent'
	});
	$routeProvider.when('/corporatedistributeContent/preview/:distributeId', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/distributemailview.html'+refresh;
		},
		controller: 'previewDContent'
	});
	$routeProvider.when('/corporatedistributeContent/:distributeId', {
		templateUrl: function () {
			return 'partials/common/create_distributeContent.html'+refresh;
		},
		controller: 'corporatecreateDContent'
	});
	$routeProvider.when('/sendcorporatedistributeContent/email/:email', {
		templateUrl: function () {
			return 'partials/common/create_distributeContent.html'+refresh;
		},
		controller: 'corporatecreateDContent'
	});
	$routeProvider.when('/corporatedistributeContent/:distributeId/:filterStatus', {
		templateUrl: function () {
			return 'partials/common/create_distributeContent.html'+refresh;
		},
		controller: 'corporatecreateDContent'
	});
	$routeProvider.when('/corporatedistributeContent/:distributeId/:filterStatus/:email', {
		templateUrl: function () {
			return 'partials/common/create_distributeContent.html'+refresh;
		},
		controller: 'corporatecreateDContent'
	});

	$routeProvider.when('/topol', {
		templateUrl: function () {
			return 'partials/common/topol.html'+refresh;
		},
		controller: 'topolCtrl'
	});
	$routeProvider.when('/investordistributeContent', {
		templateUrl: function () {
			return 'partials/common/investordistributeContent.html'+refresh;
		},
		controller: 'investorcreateDContent'
	});

	$routeProvider.when('/investordistributeContent/:distributeId', {
		templateUrl: function () {
			return 'partials/common/investordistributeContent.html'+refresh;
		},
		controller: 'investorcreateDContent'
	});
	$routeProvider.when('/resendinvestordistributeContent/:distributeId', {
		templateUrl: function () {
			return 'partials/common/investordistributeContent.html'+refresh;
		},
		controller: 'investorcreateDContent'
	});
	$routeProvider.when('/resendinvestordistributeContent/:distributeId/:filterStatus', {
		templateUrl: function () {
			return 'partials/common/investordistributeContent.html'+refresh;
		},
		controller: 'investorcreateDContent'
	});
	$routeProvider.when('/resendinvestordistributeContent/:distributeId/:filterStatus/:email', {
		templateUrl: function () {
			return 'partials/common/investordistributeContent.html'+refresh;
		},
		controller: 'investorcreateDContent'
	});


	$routeProvider.when('/investordistributeContent/edit/:distributeId', {
		templateUrl: function () {
			return 'partials/common/investordistributeContent.html'+refresh;
		},
		controller: 'investoreditDContent'
	});


	$routeProvider.when('/investordistributeContent/preview/:distributeId', {
		templateUrl: function () {
			return 'partials/common/distributemailview.html'+refresh;
		},
		controller: 'previewinvestorDContent'
	});

	$routeProvider.when('/managetemplates', {
		templateUrl: function () {
			return 'partials/common/managetemplates.html'+refresh;
		},
		controller: 'managetemplates'
	});

	$routeProvider.when('/managetemplates/new', {
		templateUrl: function () {
			return 'partials/common/newinvestortemplate.html'+refresh;
		},
		controller: 'newinvestortemplate'
	});

	$routeProvider.when('/managetemplates/edit/:id', {
		templateUrl: function () {
			return 'partials/common/newinvestortemplate.html'+refresh;
		},
		controller: 'newinvestortemplate'
	});

	$routeProvider.when('/managetemplates/preview/:Id', {
		templateUrl: function () {
			return 'partials/common/templatemailview.html'+refresh;
		},
		controller: 'previewinvestortemplate'
	});

	$routeProvider.when('/newslettercomponents', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/newslettercomponents.html'+refresh;
		},
		controller: 'newsletterComponents'
	});

	$routeProvider.when('/components/:contentType/:userId', {
		templateUrl: function () {
			return 'partials/common/components.html'+refresh;
		},
		controller: 'newsletterComponents'
	});

	$routeProvider.when('/fairlist/:view/:userId', {
		templateUrl: function () {
			return 'partials/common/fairlist.html'+refresh;
		},
		controller: 'fairlist'
	});

	$routeProvider.when('/fairlist/:type/:userId/:email/:company', {
		templateUrl: function () {
			return 'partials/common/fairlist.html'+refresh;
		},
		controller: 'fairlist'
	});

	$routeProvider.when('/fairlistview/:userId/:fair_id', {
		templateUrl: function () {
			return 'partials/common/fairview.html'+refresh;
		},
		controller: 'fairMyview'
	});

	$routeProvider.when('/engagementdashboard', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/engagementdashboard.html'+refresh;
		},
		controller: 'engagementDashboard'
	});

	$routeProvider.when('/distributeanalytics', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/distributanalytics.html'+refresh;
		},
		controller: 'distributeanalytics'
	});

	$routeProvider.when('/distributearchives', {
		templateUrl: function () {
			return 'partials/common/distributearchives.html'+refresh;
		},
		controller: 'distributearchives'
	});

	$routeProvider.when('/researchanalytics', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/distributanalytics.html'+refresh;
		},
		controller: 'researchanalytics'
	});

	$routeProvider.when('/researchanalytics/:distributePath', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/distributanalytics.html'+refresh;
		},
		controller: 'researchanalytics'
	});

	

	$routeProvider.when('/researchengaging', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/researchengaging.html'+refresh;
		},
		controller: 'researchengaging'
	});

	$routeProvider.when('/researchreadership/:distribute_id', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/researchreadership.html'+refresh;
		},
		controller: 'researchreadership'
	});


	$routeProvider.when('/researchContentpreview/:distributeId', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/distributemailview.html'+refresh;
		},
		controller: 'previewRContent'
	});

	$routeProvider.when('/campaignanalytics', {
		templateUrl: function () {
			return 'partials/common/campaignanalytics.html'+refresh;
		},
		controller: 'campaignanalytics'
	});

	

	$routeProvider.when('/distributeanalytics/:distributePath', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/distributanalytics.html'+refresh;
		},
		controller: 'distributeanalytics'
	});


	$routeProvider.when('/distributeeventsdetail/:webinar_template_id', {
		templateUrl: function () {
			return 'partials/common/webinar_investors.html'+refresh;
		},
		controller: 'distributeeventanalytics'
	});

	

	$routeProvider.when('/investorengaging', {
		templateUrl: function () {
			return 'partials/common/investorengaging.html'+refresh;
		},
		controller: 'investorengaging'
	});

	$routeProvider.when('/contentstrategy', {
		templateUrl: function () {
			return 'partials/common/contentstrategy.html'+refresh;
		},
		controller: 'contentstrategy'
	});
	
	$routeProvider.when('/prospectstrials', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/prospectstrials.html'+refresh;
		},
		controller: 'prospectstrials'
	});

	$routeProvider.when('/researchexclude', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/researchexclude.html'+refresh;
		},
		controller: 'researchexclude'
	});

	$routeProvider.when('/readershipreport', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/readershipreport.html'+refresh;
		},
		controller: 'readershipreport'
	});

	$routeProvider.when('/researchreadershipreport/:userId', {
		templateUrl: function () {
			return 'partials/common/readershipreport.html'+refresh;
		},
		controller: 'readershipreport'
	});

	$routeProvider.when('/unsubscribedlist', {
		templateUrl: function () {
			return 'partials/common/unsubscribedlist.html'+refresh;
		},
		controller: 'unsubscribedlist'
	});
	$routeProvider.when('/distributeanalyticsdetail/:distributeId', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/distributanalytics.html'+refresh;
		},
		controller: 'distributeanalytics'
	});
	$routeProvider.when('/distributeanalyticsview/:distributeId', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/distributeanalyticsview.html'+refresh;
		},
		controller: 'distributeanalyticsview'
	});
	$routeProvider.when('/activities_leads', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/activities_leadsList.html'+refresh;
		},
		controller: 'actionsLeadsCtrl'
	});
	$routeProvider.when('/prospects_customers', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/prospectsList.html'+refresh;
		},
		controller: 'prospects_customersList'
	});
	$routeProvider.when('/upderConstruction', {
		templateUrl: function () {
			return 'partials/common/empty_page.html'+refresh;
		},
		controller: 'upderConstructionCtrl'
	});
	$routeProvider.when('/customersUsage', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/customersUsage.html'+refresh;
		},
		controller: 'customersUsageCtrl'
	});
	$routeProvider.when('/reportanalytics', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/reportanalytics.html'+refresh;
		},
		controller: 'reportAnalyticsCtrl'
	});
	$routeProvider.when('/contentPerformance', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/contentPerformance.html'+refresh;
		},
		controller: 'contentPerformanceCtrl'
	});

	$routeProvider.when('/prospects_customers/activityLog/:activityId', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/activityLog.html'+refresh;
		},
		controller: 'activityLog'
	});

	$routeProvider.when('/investors/list', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/addInvestorsList.html'+refresh;
		},
		controller: 'addInvestorsList'
	});
	$routeProvider.when('/investors/new/:investorListId', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/addInvestorsList_Add.html'+refresh;
		},
		controller: 'addInvestorsList_Add'
	});
	$routeProvider.when('/investors/edit/:investorListId', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/addInvestorsList_Edit.html'+refresh;
		},
		controller: 'editInvestors'
	});
	$routeProvider.when('/investors/view/:investorListId', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/addInvestorsList_View.html'+refresh;
		},
		controller: 'editInvestors'
	});
	$routeProvider.when('/investors/contactlist', {
		templateUrl: function () {
			return 'partials/common/addInvestorscontactList.html'+refresh;
		},
		controller: 'addInvestorscontactList'
	});
	$routeProvider.when('/investors/contactview/:investorListId', {
		templateUrl: function () {
			return 'partials/common/addInvestorsListcontact_View.html'+refresh;
		},
		controller: 'editInvestorscontact'
	});
	$routeProvider.when('/investors/new', {
		templateUrl: function () {
			return 'partials/common/addInvestorscontactList_Add.html'+refresh;
		},
		controller: 'addInvestorscontactsList_Add'
	});


	$routeProvider.when('/recording', {
		templateUrl: function () {
			return 'partials/common/recording.html'+refresh;
		},
		controller: 'addrecordingCtrl'
	});


	$routeProvider.when('/investoruser/:userId', {
		templateUrl: function () {
			return 'partials/common/investor.html'+refresh;
		},
		controller: 'investorView'
	});
	$routeProvider.when('/investorcompany/:userId', {
		templateUrl: function () {
			return 'partials/common/investorProfile_cmy.html'+refresh;
		},
		controller: 'corporatecompanyCtrl'
	});
	$routeProvider.when('/acceptMeeting/:meetingid', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/acceptMeeting.html'+refresh;
		},
		controller: 'acceptMeeting'
	});
	$routeProvider.when('/settings', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/settings.html'+refresh;
		},
		controller: 'corporateSettings'
	});
	$routeProvider.when('/setting', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/settings.html'+refresh;
		},
		controller: 'rpSettings'
	});
	$routeProvider.when('/meetingPreparation/:dashboardName', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/meetingDashboard.html'+refresh;
		},
		controller: 'industryMeeting'
	});
	$routeProvider.when('/meetingPreparation/:dashboardName/:fundId', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/meetingDashboard.html'+refresh;
		},
		controller: 'industryMeeting'
	});

	$routeProvider.when('/themesDashboard', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/themesDashboard.html'+refresh;
		},
		controller: 'listThemes'
	});
	$routeProvider.when('/themesDashboard/auto', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/themesDashboard.html'+refresh;
		},
		controller: 'listThemes'
	});
	$routeProvider.when('/themesDashboard/:themeID/:auto', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/themesDashboardView.html'+refresh;
		},
		controller: 'viewTheme'
	});
	$routeProvider.when('/themesDashboard/:themeID', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/themesDashboardView.html'+refresh;
		},
		controller: 'viewTheme'
	});

	$routeProvider.when('/viewthemesDashboard/:ticker', {
		templateUrl: function () {
			return 'partials/corporate/themesDashboardViewstatic.html'+refresh;
		},
		controller: 'viewthemesDashboard'
	});

	$routeProvider.when('/meetingInvestment', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/meetingInvestment.html'+refresh;
		},
		controller: 'meetingInvestment'
	});
	$routeProvider.when('/peer', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/peer.html'+refresh;
		},
		controller: 'peer'
	});
	$routeProvider.when('/meeting_recommendation', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/meeting_recommendation.html'+refresh;
		},
		controller: 'meetingrecommendationctrl'
	});

	$routeProvider.when('/respond/:meetingid', {
		templateUrl: function () {
			return 'partials/common/login.html'+refresh;
		},
		controller: 'meetingviewResponse'
	});

	$routeProvider.when('/meetings', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/meetingslist.html'+refresh;
		},
		controller: 'meetinglist'
	});

	$routeProvider.when('/meetingProposed/:meetingid', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/meetingProposed.html'+refresh;
		},
		controller: 'meetingProposed'
	});
	$routeProvider.when('/meetingAccepted/:meetingid', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/meetingAccepted.html'+refresh;
		},
		controller: 'meetingProposed'
	});
	$routeProvider.when('/brokeruser/:userId', {
		templateUrl: function () {
			return 'partials/common/brokerview.html'+refresh;
		},
		controller: 'brokerviewCtrl'
	});
	$routeProvider.when('/brokercompany/:userId', {
		templateUrl: function () {
			return 'partials/common/brokerProfile_cmy.html'+refresh;
		},
		controller: 'corporatecompanyCtrl'
	});

	$routeProvider.when('/researchprovider/:companyId', {
		templateUrl: function () {
			return 'partials/common/cmyprofile.html'+refresh;
		},
		controller: 'researchprovidercompanyCtrl'
	});
	$routeProvider.when('/peer_review', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/peer_review.html'+refresh;
		},
		controller: 'peer_reviewCtrl'
	});


	$routeProvider.when('/dashboardResearch', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/dashboard_research.html'+refresh;
		},
		controller: 'dashboardResearch'
	});
	$routeProvider.when('/dashboardResearch/new', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/dashboard_research_new.html'+refresh;
		},
		controller: 'dashboardResearchnew'
	});

	$routeProvider.when('/dashboardResearch/new/:dashboardId', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/dashboard_research_new.html'+refresh;
		},
		controller: 'dashboardResearchnew'
	});

	$routeProvider.when('/dashboardaccess/:dashboardId', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/dashboard_access.html'+refresh;
		},
		controller: 'dashboardAccess'
	});

	$routeProvider.when('/dashboardAnalytics', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/dashboard_analytics.html'+refresh;
		},
		controller: 'dashboardAnalytics'
	});

	$routeProvider.when('/dashboardPayments', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/dashboard_payments.html'+refresh;
		},
		controller: 'dashboardAnalytics'
	});

	$routeProvider.when('/Subscriptions', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/dashboard_subscription.html'+refresh;
		},
		controller: 'dashboardSubscription'
	});

	

	$routeProvider.when('/Subscriptions/:userId', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/dashboard_subscription.html'+refresh;
		},
		controller: 'dashboardSubscription'
	});

	$routeProvider.when('/dashboardComment', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/dashboard_comment.html'+refresh;
		},
		controller: 'dashboardComment'
	});

	$routeProvider.when('/shareDashboard/:dashboardId', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/dashboard_share.html'+refresh;
		},
		controller: 'shareDashboard'
	});
	$routeProvider.when('/loadData/:dashboardId', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/dashboard_data.html'+refresh;
		},
		controller: 'dataDashboard'
	});

	$routeProvider.when('/researchdashboard', {
		templateUrl: function () {
			return 'partials/common/researchdashboard.html'+refresh;
		},
		controller: 'researchDashboard'
	});

	$routeProvider.when('/researchideas', {
		templateUrl: function () {
			return 'partials/common/researchideas.html'+refresh;
		},
		controller: 'researchideas'
	});

	$routeProvider.when('/proposalView/:proposal_id', {
		templateUrl: function () {
			return 'partials/common/proposal_view.html'+refresh;
		},
		controller: 'CommonProposalViewCtrl'
	});

	$routeProvider.when('/researchdashboardview/:dashboardId', {
		templateUrl: function () {
			return 'partials/common/researchdashboardview.html'+refresh;
		},
		controller: 'researchDashboardview'
	});

	$routeProvider.when('/manageresearchdashboard', {
		templateUrl: function () {
			return 'partials/common/manageresearchdashboard.html'+refresh;
		},
		controller: 'manageresearchdashboard'
	});

	$routeProvider.when('/manageresearchdashboardrequest', {
		templateUrl: function () {
			return 'partials/common/manageresearchdashboardrequest.html'+refresh;
		},
		controller: 'manageresearchdashboard'
	});

	$routeProvider.when('/dashboardrequests', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/manageresearchdashboardrequest.html'+refresh;
		},
		controller: 'rpresearchdashboard'
	});

	$routeProvider.when('/contracts', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/contracts.html'+refresh;
		},
		controller: 'brokercontracts'
	});

	$routeProvider.when('/researchdashboarddata/:dashboardId', {
		templateUrl: function () {
			return 'partials/common/researchdashboarddata.html'+refresh;
		},
		controller: 'dashboardData'
	});


	$routeProvider.when('/manageresearchdashboard/:Id', {
		templateUrl: function () {
			return 'partials/common/manageresearchdashboard.html'+refresh;
		},
		controller: 'manageresearchdashboard'
	});

	$routeProvider.when('/researchdashboardsubscripe/:dashboardId', {
		templateUrl: function () {
			return 'partials/common/researchdashboardsubscripe.html'+refresh;
		},
		controller: 'researchdashboardsubscripe'
	});

	$routeProvider.when('/paymentsuccess', {
		templateUrl: function () {
			return 'partials/common/paymentsuccess.html'+refresh;
		},
		controller: 'paymentsuccess'
	});

	$routeProvider.when('/paymentfailed', {
		templateUrl: function () {
			return 'partials/common/paymentfailed.html'+refresh;
		},
		controller: 'paymentfailed'
	});

	$routeProvider.when('/companyfair', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/faircontent.html'+refresh;
		},
		controller: 'fairMylist'
	});

	$routeProvider.when('/fair', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/fairlist.html'+refresh;
		},
		controller: 'fairMylist'
	});
	$routeProvider.when('/fairinbound/:type', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/fairlist.html'+refresh;
		},
		controller: 'fairMylist'
	});

	$routeProvider.when('/fair/new', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/fairnew.html'+refresh;
		},
		controller: 'fairMynew'
	});
	$routeProvider.when('/fair/new/:userId', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/fairnew.html'+refresh;
		},
		controller: 'fairMynew'
	});
	$routeProvider.when('/fairview/:fair_id', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/fairview.html'+refresh;
		},
		controller: 'fairMyview'
	});
	$routeProvider.when('/fairedit/:fair_id', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/fairnew.html'+refresh;
		},
		controller: 'fairedit'
	});

	$routeProvider.when('/fairexist/:fair_id', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/fairexist.html'+refresh;
		},
		controller: 'fairexist'
	});

	$routeProvider.when('/fair/upload', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/fairuploadlist.html'+refresh;
		},
		controller: 'fairupload'
	});

	$routeProvider.when('/fair/apisetting', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/fairapisetting.html'+refresh;
		},
		controller: 'fairapisetting'
	});

	$routeProvider.when('/fair/analytics', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/fairanalytics.html'+refresh;
		},
		controller: 'fairanalytics'
	});

	$routeProvider.when('/fair/analyticsdetail', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/analyticsdetail.html'+refresh;
		},
		controller: 'analyticsdetail'
	});

	$routeProvider.when('/fair/faircategory', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/faircategory.html'+refresh;
		},
		controller: 'faircategory'
	});

	$routeProvider.when('/ideas', {
		templateUrl: function () {
			return 'partials/common/ideas.html'+refresh;
		},
		controller: 'rpideas'
	});


	$routeProvider.when('/ideas_report', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/ideas_report.html'+refresh;
		},
		controller: 'rpideas'
	});

	$routeProvider.when('/ideaedit/:ideaid', {
		templateUrl: function () {
			return 'partials/common/ideasnew.html'+refresh;
		},
		controller: 'rpideasedit'
	});
	$routeProvider.when('/ideas/new', {
		templateUrl: function () {
			return 'partials/common/ideasnew.html'+refresh;
		},
		controller: 'rpideasnew'
	});
	$routeProvider.when('/dashboardrequest', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/dashboardrequest.html'+refresh;
		},
		controller: 'rpideasrequest'
	});

	$routeProvider.when('/investornotescontacts', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/investornotescontacts.html'+refresh;
		},
		controller: 'editinvestornotecontacts'
	});

	$routeProvider.when('/investornotescontactsupload', {
		templateUrl: function () {
			return 'partials/common/investornotescontactsupload.html'+refresh;
		},
		controller: 'investornotecontactsupload'
	});

	$routeProvider.when('/contactsupload', {
		templateUrl: function () {
			return 'partials/common/contactsupload.html'+refresh;
		},
		controller: 'contactsupload'
	});


	$routeProvider.when('/investornotes', {
		templateUrl: function () {
			return 'partials/common/investornotes1.html'+refresh;
		},
		controller: 'editinvestornote'
	});

	$routeProvider.when('/investornotes/:investor_contacts_id', {
		templateUrl: function () {
			return 'partials/common/investornotesedit.html'+refresh;
		},
		controller: 'editinvestornotepage'
	});

	$routeProvider.when('/newinvestornotecontact', {
		templateUrl: function () {
			return 'partials/common/newinvestornote.html'+refresh;
		},
		controller: 'newinvestornote'
	});

	$routeProvider.when('/createinvestornotecontact', {
		templateUrl: function () {
			return 'partials/common/createinvestornote.html'+refresh;
		},
		controller: 'createinvestornote'
	});

	$routeProvider.when('/feedbackandfollow', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/under.html'+refresh;
		},
		controller: 'rpideasrequest'
	});

	$routeProvider.when('/analytics', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/analytics.html'+refresh;
		},
		controller: 'analyticsCtrl'
	});

	$routeProvider.when('/rpinfluencers', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/rpinfluencers.html'+refresh;
		},
		controller: 'rpinfluencers'
	});
	$routeProvider.when('/rpinfluencers/:filter_text', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/rpinfluencers.html'+refresh;
		},
		controller: 'rpinfluencers'
	});

	$routeProvider.when('/rpdatabase/:filter_text', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/rpdatabase.html'+refresh;
		},
		controller: 'rpdatabase'
	});

	$routeProvider.when('/resource/:filter_text', {
		templateUrl: function () {
			return 'partials/' + usertypeProvider.$get().getService() + '/resource.html'+refresh;
		},
		controller: 'resource'
	});

	$routeProvider.when('/daily/:dailyId', {
		templateUrl: function () {
			return 'partials/common/dailymailview.html'+refresh;
		},
		controller: 'daily_viewCtrl'
	});

	$routeProvider.when('/research/:dailyId', {
		templateUrl: function () {
			return 'partials/common/dailymailview.html'+refresh;
		},
		controller: 'dailyidea_viewCtrl'
	});
	$routeProvider.when('/fundamentals/:dailyId', {
		templateUrl: function () {
			return 'partials/common/dailymailview.html'+refresh;
		},
		controller: 'dailyfundamentals_viewCtrl'
	});

	$routeProvider.when('/stash/:stashId', {
		templateUrl: function () {
			return 'partials/common/stashmailview.html'+refresh;
		},
		controller: 'stash_viewCtrl'
	});

	$routeProvider.when('/:rootpath', {
		templateUrl: 'partials/common/industry.html'+refresh,
		controller: 'industryCtrl'
	});
	 

	$routeProvider.otherwise({
		redirectTo: '/login'
	});
}]);




apps.config(function (dateFilterProvider) {
	var original$get = dateFilterProvider.$get;
	dateFilterProvider.$get = function ($injector) {
		var original = $injector.invoke(original$get);

		function recognized(date) {
			return (original(date, '42') === '42') ? date : false;
		}

		function native(date) {
			var d = new Date(date);
			return isNaN(d.getTime()) ? false : d;
		}
		return function (date, format) {
			if (typeof date == 'string') {
				date = recognized(date) || //maybe it is already ok?
					recognized(date.replace(' ', 'T')) || // or maybe it uses common sense format?
					native(date) || // or maybe the native date.parse can handle it ok?
					date; // give up and keep it unchanged
			}
			return original(date, format);
		}
	}

});
apps.config(['$httpProvider', function ($httpProvider) {
	$httpProvider.interceptors.push(function ($q) {
		return {
			'response': function (response) {
				if (angular.isDefined(response) && angular.isDefined(response.data) && angular.isDefined(response.data.userLogin) &&
					angular.isDefined(response.data.userLogin.user_id) && response.data.userLogin.user_id != "") {
					window.location.reload();
				}
				return response;
			},
			'responseError': function (rejection) {
				if (rejection.status === 401) {
					window.location.href = "/login";
					$('.modal-backdrop').hide();
				}
				return $q.reject(rejection);
			}
		};
	});
}]);
/*apps.config(['$httpProvider', 'fileUploadProvider', function ($httpProvider, fileUploadProvider) {
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
	$httpProvider.defaults.withCredentials = true;
	fileUploadProvider.defaults.redirect = window.location.href.replace(
		/\/[^\/]*$/,
		'/cors/result.html?%s'
	);
	if (isOnGitHub) {
		// Demo settings:
		angular.extend(fileUploadProvider.defaults, {
			// Enable image resizing, except for Android and Opera,
			// which actually support image resizing, but fail to
			// send Blob objects via XHR requests:
			disableImageResize: /Android(?!.*Chrome)|Opera/
				.test(window.navigator.userAgent),
			maxFileSize: 999000,
			acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i
		});
	}
}]);*/