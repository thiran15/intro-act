'use strict';

/* Directives */
angular.module('myApp.directives', [])
  .directive('appVersion', ['version', function (version) {
    return function (scope, elm, attrs) {
      elm.text(version);
    };
  }])

  .directive('menu', ['headerFooterData', function (headerFooterData) {
    return {
      restrict: 'A',
      templateUrl: 'partials/menu.html',
      controller: function ($scope, headerFooterData) {
        headerFooterData.getHeaderFooterData().then(function (data) {
          $scope.nav = data.menu;
        });
      }
    };
  }])

  .directive('validPasswordC', function () {
    return {
      require: 'ngModel',
      scope: {
        reference: '=validPasswordC'
      },
      link: function (scope, elm, attrs, ctrl) {

        ctrl.$parsers.unshift(function (viewValue, $scope) {
          var noMatch = viewValue != scope.reference;
          ctrl.$setValidity('noMatch', !noMatch);
          return (noMatch) ? noMatch : !noMatch;
        });

        scope.$watch("reference", function (value) {
          ;
          ctrl.$setValidity('noMatch', value === ctrl.$viewValue);
        });
      }
    }
  })
  .directive('headerDirective', function ($location, localStorageService, RequestDetail, $rootScope, $controller, alertService, $timeout, $route, $window) {

    var user = localStorageService.get('usertype');
    var userdata = localStorageService.get('userdata');
    var userimage = localStorageService.get('userimage');

    
    
    if ($location.path().indexOf('/corporatecompany/') == 0 || $location.path().indexOf('/introactcompany/') == 0 || $location.path().indexOf('/introactcorporate/') == 0 || $location.path().indexOf('/research_ideaview/') == 0 || $location.path().indexOf('/eventresponse/') == 0 || $location.path().indexOf('/researchdashboardview/') == 0 || $location.path() == '/targetreport' || $location.path() == '/subscription' || $location.path() == '/stashsubscription' || $location.path() == '/samplereport' || $location.path().indexOf('/login/scorecard_video/') == 0 || $location.path().indexOf('/researchprovider/') == 0 || $location.path().indexOf('/components/') == 0 || $location.path().indexOf('/fairlistview/') == 0 || $location.path().indexOf('/reportsubscription/') == 0 ) {
      if (!userdata) {
        user = 'common';
      }

    }else{
      var apiurl = 'apiv4/public/user/logincheck';
      var params = {};
      RequestDetail.getDetail(apiurl, params).then(function (result) {
        if(result.data.count==0){
          $location.path('login');
        }
     });
    }

   



    if ($location.path().indexOf('/viewthemesDashboard/') != 0 && $location.path().indexOf('/corporatecompany/') != 0 && $location.path().indexOf('/introactcorporate/') != 0 && $location.path().indexOf('/introactcompany/') != 0 && $location.path().indexOf('/research_ideaview/') != 0 && $location.path().indexOf('/eventresponse/') != 0 && $location.path().indexOf('/researchdashboardview/') != 0 && $location.path() != '/targetreport' && $location.path() != '/subscription' && $location.path() != '/samplereport' || $location.path().indexOf('/login/scorecard_video/') != 0 || $location.path().indexOf('/researchprovider/') == 0 || $location.path().indexOf('/components/') == 0 || $location.path().indexOf('/fairlistview/') == 0 || $location.path().indexOf('/reportsubscription/') == 0) {

      if (!userdata) {
        //$location.path('login');
        return false;
      }

    }


    return {
      // controller: "mainControl",
      restrict: 'AE',
      scope: false,
      replace: false,
      templateUrl: function (elem, attrs) {
        return attrs.templateUrl || 'partials/' + user + '/user-header.html'
      },
      controller: function ($scope, $location) {

        $scope.innerShow = 'hide';
        $scope.innerShow1 = 'hide';
        $scope.innerShow2 = 'hide';
        // set corporate name and profile image
        if ($rootScope.searchText == '') {
          $scope.search = {};
          $scope.search.searchkey = '';
        } else {
          $scope.search = {};
          $scope.search.searchkey = $rootScope.searchText;
        }

        
        if (userdata != null) {

          var curators = ["paul@intro-act.com","peter@intro-act.com","ankit@intro-act.com","nick@intro-act.com","john@intro-act.com","anupam@intro-act.com","david@intro-act.com","alo@intro-act.com","seth@intro-act.com","rekha@intro-act.com","janis@intro-act.com","frank@intro-act.com","bill@intro-act.com"];    
    
          $scope.curators_profile = 0;

          //console.log(curators.indexOf(userdata.email));

          if(curators.indexOf(userdata.email)!='-1'){
            $scope.curators_profile = 1;
          }

          $scope.profileName = userdata.firstname + ' ' + userdata.lastname;
          //$scope.userimage = userimage;
          //$scope.company_name = userdata.company_name;

          var update_url = "apiv4/public/user/getprofileimage";

          var params = {};

          RequestDetail.getDetail(update_url, params).then(function (result) {
            $scope.userimage = result.data.image;
            $scope.company_name = result.data.company_name;
          });
        }

        $scope.loginuserdat = 1;

        if (!userdata) {
          $scope.loginuserdat = 0;
        }

        $scope.showsidemenu = true;


        
        $scope.investornoteslink = function () {
          if($location.path()=='/investornotes'){
            $route.reload();
          }
        }
        
        $scope.agencyid = 0;
        $scope.agencystatus = 0;
        $scope.agencytickers = [];

        if (userdata.agencyid) {
          $scope.agencyid = userdata.agencyid;
        }

        if (userdata.agencystatus) {
          $scope.agencystatus = userdata.agencystatus;
        }

        if (userdata.agencytickers) {
          $scope.agencytickers = userdata.agencytickers.split(',');

        }

        $scope.corporate_change_ticker = userdata.ticker;


        $scope.corporate_accountchange = function (corporate_change_ticker) {

          localStorageService.clearAll();
          var url = "apiv4/public/user/loginticker";
          var params = { corporate_change_ticker: corporate_change_ticker, agencyid: $scope.agencyid };
          RequestDetail.getDetail(url, params).then(function (result) {
            $scope.spinnerActive = true;

            var userType = result.data.items.user_type; // USER TYPE 

            localStorageService.set('research_provider_status', result.data.items.research_provider_status);
            localStorageService.set('admincontroluser', result.data.items.admincontroluser);
            $rootScope.research_provider_status = localStorageService.get('research_provider_status');

            localStorageService.set('usertype', 'corporate');
            localStorageService.set('userdata', result.data.items);
            $rootScope.usertype = localStorageService.get('usertype');
            localStorageService.set('userimage', result.data.items.image);
            localStorageService.set('email', result.data.items.email);
            $window.location.reload();
            $route.reload();


            $scope.spinnerActive = false;
          });
        }

        // if($location.path().indexOf('/research_ideaview/') != 0 || $location.path().indexOf('/eventresponse/') != 0 || $location.path().indexOf('/researchdashboardview/') != 0){
        // $scope.showsidemenu = false;
        // }

        /*
              if($location.path() == '/meetingPreparation/industry'){
                $scope.innerShow = '';
                $scope.companyActive = '';
                $scope.industryActive = 'inner-active';
              } else if($location.path() == '/meetingPreparation/company'){
                $scope.innerShow = '';
                $scope.industryActive = '';
                $scope.companyActive = 'inner-active';
              }
        */

        /* if($location.path().indexOf('/meetingPreparation/') > -1 || $location.path().indexOf('/themesDashboard') > -1){
             $scope.innerShow = '';
         }else{
     $scope.innerShow = 'hide';
         }*/

        $scope.hidedashboard = 1;
        if ($location.path() == '/dashboard' || $location.path() == '/search' || $location.path() == '/RPregsuccess' || $location.path() == '/targetreport' || $location.path() == '/subscription' || $location.path() == '/samplereport') {
          $scope.hidedashboard = 0;
        }

        $scope.hidesearch = 1;
        if ($location.path() == '/targetreport' || $location.path() == '/subscription' || $location.path() == '/samplereport') {
          $scope.hidesearch = 0;
        }



        $scope.menuset = 1;
        $scope.menusetitem = 1;

        if (!userdata) {
          if ($location.path().indexOf('/corporatecompany/') > -1) {
            $scope.menuset = 4;
            $scope.menusetitem = 1;
            return;
          }
        }

        $scope.submenu1 = 0;
        $scope.submenu2 = 0;
        $scope.submenu3 = 0;
        $scope.submenu4 = 0;


        $scope.logoclick = function () {

          if($location.path()=='/companyprofile'){
            $route.reload();
          }
        }

        
        $scope.opensubmenu = function (index) {
          $scope.submenu1 = 0;
          $scope.submenu2 = 0;
          $scope.submenu3 = 0;
          $scope.submenu4 = 0;
          if(index==1){
            if($scope.submenu1){
              $scope.submenu1 = 0;
            }else{
              $scope.submenu1 = 1;
            }
          }else if(index==2){
            if($scope.submenu2){
              $scope.submenu2 = 0;
            }else{
              $scope.submenu2 = 1;
            }
          }else if(index==3){
            if($scope.submenu3){
              $scope.submenu3 = 0;
            }else{
              $scope.submenu3 = 1;
            }
           
          }else if(index==4){
            if($scope.submenu4){
              $scope.submenu4 = 0;
            }else{
              $scope.submenu4 = 1;
            }
          }
        }

        if (localStorageService.get('usertype') == 'investor') {

          if ($location.path() == '/research_comments' || $location.path().indexOf('/research_ideaview/') > -1 || $location.path() == '/meetingArchive/aggregate_recommend' || $location.path() == '/action_leads' || $location.path().indexOf('/meetingPreparation/') > -1 || $location.path() == '/fair' || $location.path() == '/meeting_recommend' || $location.path() == '/fair/new' || $location.path() == '/meetingArchive/next_event' || $location.path().indexOf('/fairview/') > -1) {
            $scope.menuset = 1;
            if ($location.path() == '/meetingArchive/aggregate_recommend' || $location.path() == '/meeting_recommend') {
              $scope.menusetitem = 2;
            }
            if ($location.path() == '/action_leads' || $location.path() == '/fair' || $location.path() == '/fair/new' || $location.path().indexOf('/fairview/') > -1) {
              $scope.menusetitem = 3;
            }
            if ($location.path().indexOf('/meetingPreparation/') > -1 || $location.path() == '/meetingArchive/next_event') {
              $scope.menusetitem = 4;
            }
          }



          if ($location.path() == '/meeting/onDemand' || $location.path() == '/meetings' || $location.path().indexOf('/meeting/') > -1 || $location.path().indexOf('/meeting/new/') > -1 || $location.path().indexOf('/event/response/') > -1 || $location.path() == '/alleventslist' || $location.path() == '/meetingArchive' || $location.path() == '/eventslist') {
            $scope.menuset = 2;
            if ($location.path() == '/meetingArchive/aggregate_recommend' || $location.path() == '/eventslist') {
              $scope.menusetitem = 2;
            }
            if ($location.path() == '/action_leads' || $location.path() == '/meetingArchive') {
              $scope.menusetitem = 3;
            }
            if ($location.path().indexOf('/meetingPreparation/') > -1 || $location.path().indexOf('/event/response/') > -1 || $location.path() == '/alleventslist') {
              $scope.menusetitem = 4;
            }
          }

          if ($location.path() == '/manageresearchdashboard' || $location.path() == '/fair/analytics' || $location.path() == '/researchdashboard' || $location.path().indexOf('/researchdashboardview/') > -1 || $location.path().indexOf('/researchdashboardsubscripe/') > -1 || $location.path() == '/manageresearchdashboardrequest' || $location.path().indexOf('/proposalView/') > -1 || $location.path().indexOf('/researchProposal/view/') > -1) {
            $scope.menuset = 3;
            if ($location.path() == '/fair/analytics') {
              $scope.menusetitem = 2;
            }
            if ($location.path() == '/researchdashboard' || $location.path().indexOf('/researchdashboardview/') > -1 || $location.path().indexOf('/researchdashboardsubscripe/') > -1 || $location.path().indexOf('/proposalView/') > -1 || $location.path().indexOf('/researchProposal/view/') > -1) {
              $scope.menusetitem = 3;
            }
            if ($location.path().indexOf('/meetingPreparation/') > -1 || $location.path() == '/manageresearchdashboardrequest') {
              $scope.menusetitem = 4;
            }
          }

          if ($location.path() == '/profile' || $location.path() == '/watchlists' || $location.path() == '/settings' || $location.path() == '/settingInvestor' || $location.path() == '/companyprofile/edit' || $location.path() == '/myInterestedProposals' || $location.path().indexOf('/myInterestedProposals/view/') > -1) {
            $scope.menuset = 4;
            if ($location.path() == '/fair/analytics' || $location.path() == '/fair/new' || $location.path() == '/myInterestedProposals' || $location.path().indexOf('/myInterestedProposals/view/') > -1) {
              $scope.menusetitem = 2;
            }
            if ($location.path() == '/watchlists') {
              $scope.menusetitem = 3;
            }
            if ($location.path() == '/settings' || $location.path() == '/settingInvestor') {
              $scope.menusetitem = 4;
            }
          }

        }
        if (localStorageService.get('usertype') == 'corporate') {

          $scope.menuset = 1;

          if ($location.path() == '/companyprofile' || $location.path() == '/managetemplates' || $location.path() == '/managetemplates/new' || $location.path().indexOf('/managetemplates/edit/') > -1 || $location.path() == '/distributeanalytics/history' || $location.path().indexOf('/distributeanalyticsdetail/') > -1 || $location.path() == '/companyprofile/edit' || $location.path() == '/profile' || $location.path() == '/profile/edit' || $location.path() == '/contentstrategy' || $location.path() == '/unsubscribedlist' || $location.path() == '/investors/contactlist' || $location.path() == '/investors/contactlist' || $location.path().indexOf('/investors/contactview/') > -1){
            $scope.menuset = 2;
          }
          if ($location.path().indexOf('/distributeContent/edit/') > -1 || $location.path() == '/distributeContent' || $location.path() == '/fair' || $location.path() == '/investornotescontacts' || $location.path() == '/investornotescontactsupload' || $location.path() == '/createinvestornotecontact' || $location.path() == '/fair/new' || $location.path().indexOf('/fairedit/') > -1 || $location.path().indexOf('/fairview/') > -1 || $location.path() == '/fairinbound/company' || $location.path() == '/eventslist' || $location.path().indexOf('/event/response/') > -1 || $location.path().indexOf('/event/response/edit/') > -1 || $location.path() == '/event/new' || $location.path() == '/recording'){
            $scope.menuset = 3;
          }

          

          $scope.main_title = 'Account';
          if($location.path().indexOf('/distributeeventsdetail/') > -1){
            $scope.main_title = 'Event Registers';
          }
          if($location.path() == '/eventslist'){
            $scope.main_title = 'Events';
          }
          if($location.path() == '/companyprofile'){
            $scope.main_title = 'Company Profile';
          }
          else if($location.path() == '/fairinbound/company'){
            $scope.main_title = 'FAIR Request';
          }
          else if($location.path() == '/fair/apisetting'){
            $scope.main_title = 'FAIR API Setting';
          }
          else if($location.path().indexOf('/event/response/edit/') > -1){
            $scope.main_title = 'Event';
          }
          else if($location.path().indexOf('/event/response/') > -1){
            $scope.main_title = 'Event';
          }
          else if($location.path() == '/meetingArchive/factorsofinfluence'){
            $scope.main_title = 'Factors Of Influence';
          }
          else if($location.path() == '/scorecard'){
            $scope.main_title = 'Strategic Metrics';
          }
          else if($location.path() == '/investorengaging'){
            $scope.main_title = 'Investor Engagement';
          }
          else if($location.path() == '/investors'){
            $scope.main_title = 'Investors';
          }
          else if($location.path() == '/investors/contactlist'){
            $scope.main_title = 'Distribution Lists';
          }
          else if($location.path() == '/investors/new'){
            $scope.main_title = 'Distribution Lists';
          }
          else if($location.path().indexOf('/investors/contactview/') > -1){
            $scope.main_title = 'Distribution List';
          }
          else if($location.path() == '/profile'){
            $scope.main_title = 'Profile';
          }
          else if($location.path() == '/profile/edit'){
            $scope.main_title = 'Profile Edit';
          }
          else if($location.path() == '/managetemplates'){
            $scope.main_title = 'Manage Templates';
          }else if($location.path() == '/managetemplates/new'){
            $scope.main_title = 'New Template';
          }else if($location.path().indexOf('/managetemplates/edit/') > -1){
            $scope.main_title = 'Edit Template';
          }
          else if($location.path() == '/distributeanalytics/history'){
            $scope.main_title = 'Distribute Analytics';
          }
          else if($location.path() == '/distributearchives'){
            $scope.main_title = 'Distribute Archives';
          }
          else if($location.path().indexOf('/distributeanalyticsdetail/') > -1){
            $scope.main_title = 'Detail';
          }
          else if($location.path() == '/companyprofile/edit'){
            $scope.main_title = 'Company Profile';
          }
          else if($location.path() == '/Predictedleads'){
            $scope.main_title = 'Predicted leads';
          }
          else if($location.path().indexOf('/distributeContent/edit/') > -1){
            $scope.main_title = 'Edit Distribute content';
          }
          else if($location.path().indexOf('/fairview/') > -1){
            $scope.main_title = 'FAIR View';
          }
          
          else if($location.path() == '/distributeContent' || $location.path() == '/distribute'){
            $scope.main_title = 'Distribute';
          }
          else if($location.path() == '/unsubscribedlist'){
            $scope.main_title = 'Unsubscribed List';
          }
          else if ($location.path() == '/recording') {
            $scope.main_title = 'Presentation Videos';
          }
          else if($location.path() == '/fair'){
            $scope.main_title = 'FAIR';
          }
          else if($location.path() == '/investornotescontacts'){
            $scope.main_title = 'Investor notes';
          }
          else if($location.path() == '/investornotescontactsupload'){
            $scope.main_title = 'Investor notes';
          }
          else if($location.path() == '/createinvestornotecontact'){
            $scope.main_title = 'Create contact';
          }
          else if($location.path() == '/fair/new'){
            $scope.main_title = 'New FAIR';
          }
          else if($location.path() == '/event/new'){
            $scope.main_title = 'New Event';
          }
          else if($location.path() == '/contentstrategy'){
            $scope.main_title = 'Strategy';
          }
          else if($location.path() == '/campaignanalytics'){
            $scope.main_title = 'Campaign Analytics';
          }

          

          $scope.openmodelpagehelp = function () {
            $scope.showModalpageinfo = !$scope.showModalpageinfo;
          }


          /*if ($location.path() == '/Predictedleads' || $location.path() == '/action_leads' || $location.path() == '/meetingArchive/next_event'  || $location.path() == '/meetingPreparation/ownership1' || $location.path().indexOf('/Predictedleads/') > -1 || $location.path() == '/ResearchList' || $location.path() == '/meetingArchive/factorsofinfluence' || $location.path() == '/scorecard') {

          }

          if ($location.path() == '/Predictedleads' || $location.path() == '/action_leads' || $location.path() == '/meetingArchive/next_event'  || $location.path() == '/meetingPreparation/ownership1' || $location.path().indexOf('/Predictedleads/') > -1 || $location.path() == '/ResearchList' || $location.path() == '/meetingArchive/factorsofinfluence' || $location.path() == '/scorecard') {
            $scope.menuset = 1;
            if ($location.path().indexOf('/Predictedleads/') > -1 || $location.path() == '/meetingArchive/factorsofinfluence') {
              $scope.menusetitem = 2;
            }
            if ($location.path() == '/action_leads'  || $location.path() == '/meetingPreparation/ownership1') {
              $scope.menusetitem = 3;
            }
            if ($location.path() == '/ResearchList' || $location.path() == '/scorecard') {
              $scope.menusetitem = 4;
            }

          }

          if ($location.path() == '/meeting/onDemand' || $location.path().indexOf('/meeting/') > -1 || $location.path() == '/feedbackandfollow'  || $location.path().indexOf('/corporateuser/') > -1 || $location.path().indexOf('/investoruser/') > -1 || $location.path().indexOf('/brokeruser/') > -1 || $location.path().indexOf('/distributeContent/edit/') > -1 || $location.path() == '/companyprofile/edit' || $location.path() == '/companyprofile' || $location.path() == '/profile' || $location.path() == '/profile/edit' || $location.path() == '/fair' || $location.path().indexOf('/fairview/') > -1 || $location.path() == '/fair/new' || $location.path().indexOf('/distributeanalytics/') > -1  || $location.path().indexOf('/distributeanalyticsdetail/') > -1  || $location.path() == '/fair/analytics'  || $location.path() == '/investordistributeContent' || $location.path() == '/newslettercomponents' || $location.path() == '/managetemplates' || $location.path() == '/managetemplates/new' || $location.path().indexOf('/managetemplates/edit/') > -1 || $location.path().indexOf('/fairinbound/') > -1) {

            
            $scope.menuset = 2;

            if ($location.path() == '/fair' || $location.path().indexOf('/fairview/') > -1 || $location.path() == '/fair/new' || $location.path() == '/fair/analytics' || $location.path().indexOf('/fairinbound/') > -1) {
              $scope.menusetitem = 2;
            }
            if ($location.path() == '' || $location.path() == '/event/new' || $location.path().indexOf('/distributeanalytics/') > -1  || $location.path().indexOf('/distributeanalyticsdetail/') > -1 || $location.path() == '/investordistributeContent' || $location.path() == '/managetemplates' || $location.path() == '/managetemplates/new' || $location.path().indexOf('/managetemplates/edit/') > -1 ) {
              $scope.menusetitem = 3;
            }
            if ($location.path() == '/feedbackandfollow' || $location.path() == '/newslettercomponents' ) {
              $scope.menusetitem = 4;
            }
          }

          

          if ($location.path() == '/research_comments' || $location.path() == '/manageresearchdashboard' || $location.path().indexOf('/researchdashboardview/') > -1 || $location.path().indexOf('/researchideasubscripe/') > -1 || $location.path().indexOf('/researchdashboardsubscripe/') > -1 || $location.path().indexOf('/research_ideaview/') > -1 || $location.path().indexOf('/researchdashboarddata/') > -1 || $location.path().indexOf('/research_comments/') > -1 || $location.path().indexOf('/investoranalytics/') > -1 || $location.path() == '/meetingArchive/archieved' || $location.path().indexOf('/investoranalytics/') > -1 || $location.path().indexOf('/themesDashboard') > -1 || $location.path().indexOf('/proposalView/') > -1 || $location.path().indexOf('/researchProposal/view/') > -1 || $location.path() == '/researchdashboard' || $location.path().indexOf('/editinvestornote/') > -1 || $location.path().indexOf('/distributeanalytics/') > -1 || $location.path() == '/distributeanalytics/history' ||  $location.path() == '/investorengaging' || $location.path() == '/investornotes' || $location.path() == '/investornotescontacts' || $location.path() == '/investornotescontactsupload' || $location.path() == '/contactsupload' || $location.path() == '/newinvestornotecontact' || $location.path() == '/researchideas' || $location.path() == '/createinvestornotecontact' || $location.path() == '/investors/list' || $location.path() == '/investors/new/create' || $location.path().indexOf('/investors/view/' ) > -1 || $location.path().indexOf('/investors/edit/' ) > -1 || $location.path() == '/unsubscribedlist' || $location.path() == '/rpinfluencers' || $location.path() == '/investors/contactlist' || $location.path() == '/investors/new' || $location.path().indexOf('/investors/contactview/' ) > -1 || $location.path() == '/distributeanalytics' || $location.path() == '/ideas' || $location.path() == '/ideas/new' || $location.path().indexOf('/ideaedit/') > -1) {
            $scope.menuset = 3;
            if ($location.path().indexOf('/distributeanalytics/') > -1) {
              $scope.menusetitem = 1;
            }
            if ($location.path() == '/research_comments' || $location.path().indexOf('/research_ideaview/') > -1 || $location.path().indexOf('/researchideasubscripe/') > -1 || $location.path().indexOf('/research_comments/') > -1 || $location.path() == '/investorengaging' ) {
              $scope.menusetitem = 2;
            }
            if ($location.path() == '/manageresearchdashboard' || $location.path().indexOf('/themesDashboard') > -1 || $location.path().indexOf('/researchdashboarddata/') > -1 || $location.path() == '/investornotes' || $location.path() == '/investornotescontacts' || $location.path() == '/investornotescontactsupload' || $location.path() == '/contactsupload' || $location.path() == '/newinvestornotecontact' || $location.path() == '/createinvestornotecontact' || $location.path() == '/investors/list' || $location.path() == '/investors/new/create' || $location.path().indexOf('/investors/view/' ) > -1 || $location.path().indexOf('/investors/edit/' ) > -1 || $location.path() == '/investors/contactlist' || $location.path() == '/investors/new' || $location.path().indexOf('/investors/contactview/' ) > -1) {
              $scope.menusetitem = 3;
            }
            if ($location.path() == '/researchdashboard' || $location.path().indexOf('/researchdashboardview/') > -1 || $location.path().indexOf('/researchdashboardsubscripe/') > -1 || $location.path().indexOf('/proposalView/') > -1 || $location.path().indexOf('/researchProposal/view/') > -1 || $location.path() == '/researchideas' || $location.path() == '/rpinfluencers' || $location.path() == '/ideas' || $location.path() == '/ideas/new' || $location.path().indexOf('/ideaedit/') > -1) {
              $scope.menusetitem = 4;
            }
          }


          if ($location.path() == '/settings'  || $location.path().indexOf('/fairedit/') > -1   || $location.path().indexOf('/corporate/') > -1 || $location.path().indexOf('/corporatecompany/' ) > -1 || $location.path().indexOf('/introactcompany/' ) > -1 || $location.path().indexOf('/company/' ) > -1 || $location.path() == '/meeting/new' || $location.path() == '/meetings' || $location.path() == '/eventslist' || $location.path().indexOf('/event/response/') > -1 || $location.path().indexOf('/event/response/edit') > -1 || $location.path() == '/event/new' || $location.path() == '/meetingArchive' || $location.path() == '/distributeContent' || $location.path() == '/distributeEmail') {
            $scope.menuset = 4;
            if ($location.path() == '/fair'  || $location.path() == '/fair/new' || $location.path().indexOf('/fairview/') > -1 || $location.path().indexOf('/fairedit/') > -1 || $location.path() == '/eventslist' || $location.path().indexOf('/event/response/') > -1 || $location.path().indexOf('/event/response/edit') > -1 || $location.path() == '/meetings') {
              $scope.menusetitem = 2;
            }
            if ($location.path().indexOf('/investors/') > -1  || $location.path() == '/event/new') {
              $scope.menusetitem = 3;
            }
            if ($location.path() == '/settings' || $location.path() == '/meetingArchive') {
              $scope.menusetitem = 4;
            }
          }*/
        }


        if (localStorageService.get('usertype') == 'broker') {


          $scope.menuset = 1;

          if ($location.path() == '/distributeContent' || $location.path() == '/ManageProposal' || $location.path() == '/companyprofile' || $location.path() == '/rpprofile-edit' || $location.path() == '/profile' || $location.path() == '/settingsRp' || $location.path() == '/profile/edit' || $location.path() == '/distributeanalytics' || $location.path() == '/campaignanalytics' || $location.path() == '/unsubscribedlist' || $location.path().indexOf('/distributeContent/edit/') > -1 || $location.path().indexOf('/distributeanalyticsdetail/') > -1 || $location.path() == '/proposal/create' || $location.path().indexOf('/proposal/view/') > -1){
            $scope.menuset = 2;
          }
          if ($location.path() == '/meetings'  || $location.path() == '/meeting/new' || $location.path() == '/newevent' || $location.path() == '/eventslist' || $location.path() == '/eventresponseview' || $location.path() == '/meetingArchive' || $location.path().indexOf('/meeting/') > -1 ||  $location.path().indexOf('/eventresponseview/edit/') > -1){
            $scope.menuset = 3;
          }
          if ($location.path() == '/recording' || $location.path() == '/investornotescontacts' || $location.path() == '/createinvestornotecontact' || $location.path() == '/prospectstrials' || $location.path() == '/researchexclude' || $location.path() == '/reportanalytics' || $location.path() == '/investors/contactlist' || $location.path().indexOf('/investors/contactview/') > -1){
            $scope.menuset = 4;
          }
          
         

          $scope.main_title = 'Account';
          
          if($location.path() == '/researchProviderPredictedLeads'){
            $scope.main_title = 'Predicted Buyers & Sellers';
          }
          else if($location.path() == '/investorcompatibility'){
            $scope.main_title = 'Investor Compatability';
          }
          else if($location.path() == '/investorcompatibility'){
            $scope.main_title = 'Investors Engaging with Your Content';
          }
          else if($location.path().indexOf('/convictionsells/') > -1){
            $scope.main_title = 'Conviction Sells';
          }
          else if($location.path().indexOf('/convictionbuys/') > -1){
            $scope.main_title = 'Conviction Buys';
          }
          else if($location.path() == '/ResearchList'){
            $scope.main_title = 'Bespoke Requests';
          }
          else if($location.path() == '/distributeContent' || $location.path().indexOf('/distributeContent/') > -1 || $location.path().indexOf('/distributeContent/edit/') > -1){
            $scope.main_title = 'Distribute Content';
          }
          else if($location.path() == '/distributeanalytics'){
            $scope.main_title = 'Distribution Dashboard';
          }
          else if($location.path() == '/distributearchives'){
            $scope.main_title = 'Archives';
          }
          else if($location.path() == '/companyprofile'){
            $scope.main_title = 'Manage Profile';
          }
          else if($location.path() == '/ManageProposal'){
            $scope.main_title = 'Propose Research Idea to Investors';
          }
          else if($location.path() == '/meetings'){
            $scope.main_title = 'Meeting Requests';
          }
          else if($location.path() == '/newevent'){
            $scope.main_title = 'Create an Event';
          }
          else if($location.path() == '/eventslist'){
            $scope.main_title = 'Manage Events';
          }
          else if($location.path() == '/meetingArchive'){
            $scope.main_title = 'Feedback & Follow-Up';
          }
          else if($location.path() == '/investornotescontacts'){
            $scope.main_title = 'Investor Notes';
          }
          else if($location.path() == '/investors/contactlist'){
            $scope.main_title = 'Distribution List';
          }
          else if($location.path() == '/prospectstrials'){
            $scope.main_title = 'Manage Trials';
          }
          else if($location.path() == '/reportanalytics'){
            $scope.main_title = 'Report Analytics';
          }
          else if($location.path().indexOf('/distributeanalyticsdetail/') > -1){
            $scope.main_title = 'Distribution Detail';
          }
          else if($location.path() == '/investorengaging'){
            $scope.main_title = 'Investors Engaging with Your Content';
          }
          else if($location.path().indexOf('/researchProposal/view/') > -1){
            $scope.main_title = 'View Proposal';
          }
          else if($location.path() == '/campaignanalytics'){
            $scope.main_title = 'Campaign Analytics';
          }
          else if($location.path() == '/unsubscribedlist'){
            $scope.main_title = 'Unsubscribed List';
          }
          else if($location.path() == '/profile'){
            $scope.main_title = 'Profile';
          }
          else if($location.path() == '/profile/edit'){
            $scope.main_title = 'Profile Edit';
          }
          else if($location.path() == '/settingsRp'){
            $scope.main_title = 'Settings';
          }
          else if($location.path() == '/rpprofile-edit'){
            $scope.main_title = 'Update Profile';
          }
          else if($location.path() == '/proposal/create'){
            $scope.main_title = 'Create Idea Proposal';
          }
          else if($location.path() == '/meeting/new'){
            $scope.main_title = 'Request a Meeting';
          }
          else if($location.path().indexOf('/meeting/') > -1){
            $scope.main_title = 'Meeting View';
          }
          else if($location.path().indexOf('/eventresponseview/edit/') > -1){
            $scope.main_title = 'Event Edit';
          }
          else if($location.path().indexOf('/eventresponseview/') > -1){
            $scope.main_title = 'Event View';
          }
          else if($location.path() == '/investornotescontactsupload'){
            $scope.main_title = 'Investor Notes Import';
          }
          else if($location.path() == '/createinvestornotecontact'){
            $scope.main_title = 'Add New Contact';
          }
          else if($location.path().indexOf('/investors/contactview/') > -1){
            $scope.main_title = 'Distribution List - View';
          }
          else if($location.path() == '/researchexclude'){
            $scope.main_title = 'Research Exclude list';
          }
          

        }


        if (localStorageService.get('usertype') == 'sales') {

          
            $scope.menuset = 1;

            $scope.menusetitem = 1;
            
            $scope.main_title = 'Account';
          
            if($location.path() == '/researchanalytics'){
              $scope.main_title = 'Readership Dashboard';
            }
            else if($location.path().indexOf('/researchDetail/') > -1){
              $scope.main_title = 'Distribution Detail';
            }
            else if($location.path().indexOf('/researchreadership/') > -1){
              $scope.main_title = 'Readership Detail';
            }
            else if($location.path() == '/investornotescontacts'){
              $scope.main_title = 'Investor Notes';
            }
            else if($location.path() == '/unsubscribedlist'){
              $scope.main_title = 'Unsubscribed List';
            }
            else if($location.path() == '/createinvestornotecontact'){
              $scope.main_title = 'Add New Contact';
            }
            else if($location.path() == '/investors/contactlist'){
              $scope.main_title = 'Distribution List';
            }
            else if($location.path().indexOf('/investors/contactview/') > -1){
              $scope.main_title = 'Distribution List - View';
            }
            else if($location.path() == '/investornotescontactsupload'){
              $scope.main_title = 'Investor Notes Import';
            }
            else if($location.path() == '/researchContent'){
              $scope.main_title = 'Research Content';
            }
            else if($location.path() == '/distributeContent'){
              $scope.main_title = 'Distribute Content';
            }
            else if($location.path() == '/ideas'){
              $scope.main_title = 'Manage Ideas';
            }
            else if($location.path() == '/ideas/new'){
              $scope.main_title = 'New Idea';
            }
            else if($location.path() == '/researchengaging'){
              $scope.main_title = 'Investor Engagement';
            }
            else if($location.path() == '/eventsarchive'){
              $scope.main_title = 'Events';
            }
            else if($location.path() == '/companyprofile'){
              $scope.main_title = 'Manage Profile';
            }
            else if($location.path() == '/profile'){
              $scope.main_title = 'Profile';
            }
            else if($location.path() == '/profile'){
              $scope.main_title = 'Profile';
            }
            else if($location.path() == '/profile/edit'){
              $scope.main_title = 'Profile Edit';
            }
            else if($location.path() == '/rpprofile-edit'){
              $scope.main_title = 'Update Profile';
            }
            else if($location.path() == '/setting'){
              $scope.main_title = 'Settings';
            }
        }


        $scope.showModalpageinfo = false;

        $scope.openmodelpagehelp = function () {
            $scope.showModalpageinfo = !$scope.showModalpageinfo;
        }


        $scope.toggle_contactsuport = function () {
          $scope.contactformmodel = !$scope.contactformmodel;
        }

        $scope.admincontroluser = localStorageService.get('admincontroluser');
        $scope.research_provider_status = localStorageService.get('research_provider_status');
        ////console.log($scope.research_provider_status);

        $rootScope.sidemenu = true;

        var windowSize = $(window).width();

        if ($location.path() == '/Predictedleads') {
          if (windowSize <= 1300) {
            $rootScope.sidemenu = false;
          }
        } else {
          if (windowSize <= 1024) {
            $rootScope.sidemenu = false;
          }
        }




        $scope.contactsupport = {};
        $scope.toggle_sidemenu = function () {
          $rootScope.sidemenu = !$rootScope.sidemenu;
        }

        $scope.contactsupport.name = $scope.profileName;
        if (userdata != null) {
          $scope.contactsupport.email = userdata.email;
        }

        $scope.contactsupport.path = '';

        if ($location.path() == '/Predictedleads') {
          $scope.contactsupport.path = 'Predicted Leads';
        }
        else if ($location.path().indexOf('/Predictedleads/') > -1) {
          $scope.contactsupport.path = 'Factors of Influence';
        }
        else if ($location.path() == '/action_leads') {
          $scope.contactsupport.path = 'Action-based Leads';
        }
        else if ($location.path().indexOf('/meetingPreparation/') > -1) {
          $scope.contactsupport.path = 'Plan Next Events';
        }
        else if ($location.path() == '/research_comments') {
          $scope.contactsupport.path = 'Research Ideas';
        }
        else if ($location.path() == '/manageresearchdashboard') {
          $scope.contactsupport.path = 'My Intro-act';
        }
        else if ($location.path() == '/researchdashboard') {
          $scope.contactsupport.path = 'Marketplace';
        }
        else if ($location.path().indexOf('/researchdashboardview/') > -1) {
          $scope.contactsupport.path = 'Dashboard Details';
        }
       
        else if ($location.path() == '/companyprofile') {
          $scope.contactsupport.path = 'Company Profile View';
        }
        else if ($location.path().indexOf('/companyprofile/') > -1) {
          $scope.contactsupport.path = 'Company Profile Edit';
        }
        else if ($location.path() == '/fair') {
          $scope.contactsupport.path = 'Fair';
        }
        else if ($location.path().indexOf('/fair/') > -1) {
          $scope.contactsupport.path = 'Fair';
        }
        else if ($location.path() == '/settings') {
          $scope.contactsupport.path = 'Fair';
        }

        $scope.contactsupport.sucess = '';

        $scope.sendcontactmail = function () {

          if (angular.isUndefined($scope.contactsupport.name) || $scope.contactsupport.name == '') {
            alertService.add("warning", "Name Invalid !", 2000);
            return false;
          }
          if (angular.isUndefined($scope.contactsupport.email) || $scope.contactsupport.email == '') {
            alertService.add("warning", "Email Invalid !", 2000);
            return false;
          }
          if (angular.isUndefined($scope.contactsupport.Message) || $scope.contactsupport.Message == '') {
            alertService.add("warning", "Message Invalid !", 2000);
            return false;
          }

          var url = 'apiv4/public/user/sendcontactmail';
          var params = { data: $scope.contactsupport };
          RequestDetail.getDetail(url, params).then(function (result) {
            $scope.contactsupport.sucess = 'Sent Successfully';
            $scope.contactsupport.Message = "";
            $timeout(function () {
              $scope.contactsupport.sucess = '';
            }, 3000);
          });
        }



        $scope.searchData = function () {

          $scope.searchinput = [];


          $rootScope.searchkey = $scope.searchkey;

          var usertype = localStorageService.get('usertype');
          $scope.pageHeading = 'Search Result';
          $scope.dasboardActive = 'active';

          if (usertype == 'investor') {
            $scope.searchinput.searchData = '2';
          } else if (usertype == 'corporate') {
            $scope.searchinput.searchData = '1';
          } else if (usertype == 'broker') {
            $scope.searchinput.searchData = '3';
          } else if (usertype == 'sales') {
            $scope.searchinput.searchData = '3';
          }

          $rootScope.searchText = $scope.searchkey;
          $rootScope.pageno = 0;
          // Getting Investors and Corporates List
          var url = 'apiv4/public/dashboard/getSearchList';

          var searchdata = {
            searchkey: $rootScope.searchkey,
          }


          var params = {
            usertype: $scope.searchinput.searchData,
            searchdata: searchdata,
            page: $rootScope.pageno
          }

          getSearchList(url, params);

          function getSearchList(url, params) {
            $scope.spinnerActive = true;
            RequestDetail.getDetail(url, params).then(function (result) {

              $rootScope.searchResult = result.data;
              if ($location.path() == '/search') {
                $controller('searchCtrl', { $scope: $scope, $rootScope: $rootScope });
              } else {
                $scope.spinnerActive = false;
                $location.path('search');
              }
            });
          }
        }

        $scope.mobile_submenu_count = 0;
        $scope.mobile_submenu = function (index) {
          $scope.mobile_submenu_count = index;
        }


        $scope.setUserType = function (type) {
          localStorageService.set('usertype', type);
          $location.path('login').replace();
        }

        $scope.innerMenu = function () {
          if ($scope.innerShow == '') {
            $scope.innerShow = 'hide';
          } else {
            $scope.innerShow = '';
          }
        }
        $scope.innerMenu1 = function () {
          if ($scope.innerShow1 == '') {
            $scope.innerShow1 = 'hide';
          } else {
            $scope.innerShow1 = '';
          }
        }
        $scope.innerMenu2 = function () {
          if ($scope.innerShow2 == '') {
            $scope.innerShow2 = 'hide';
          } else {
            $scope.innerShow2 = '';
          }
        }

        $scope.logout = function () {
          var url = "apiv4/public/user/logout";
          var params = {
            params: 'logout'
          }
          RequestDetail.getDetail(url, params).then(function (result) {
            localStorageService.clearAll();
            window.location.href = "";
          });
        }
      }
    }
  })
  .directive('staticnewheaderDirective', function ($location, localStorageService, RequestDetail, $rootScope, $controller, alertService, $timeout, $route, $window, validation, $http, $routeParams, usertype, configdetails, Useractivity) {


    var user = localStorageService.get('usertype');
    var userdata = localStorageService.get('userdata');
    var userimage = localStorageService.get('userimage');


   
   

   
    return {
      // controller: "mainControl",
      restrict: 'AE',
      scope: false,
      replace: false,
      templateUrl: function (elem, attrs) {
        return attrs.templateUrl || 'partials/common/header.html'
      },
      controller: function ($scope, $location) {

        $scope.loadingbutton = false;
       
        $scope.sactivemenu = 2;

        if($location.path()=='/login' || $location.path()=='/newslettercategory'  || $location.path()=='/stasharchive' || $location.path()=='/irarchive' || $location.path()=='/spacarchive' || $location.path()=='/topresearchproviders' || $location.path().indexOf('/researchspotlight/') != -1){
          $scope.sactivemenu = 1;
        }else if($location.path()=='/about'){
          $scope.sactivemenu = 3;
        }else if($location.path()=='/investor' || $location.path()=='/corporate' || $location.path()=='/researchproviders' || $location.path()=='/foreignbrokers' || $location.path()=='/becomecontributor' || $location.path()=='/samplereport' || $location.path()=='/targetreport'){
          $scope.sactivemenu = 4;
        }else if($location.path()=='/contact'){
          $scope.sactivemenu = 5;
        }

        var dah = $location.path().toLowerCase();

        if ($location.path() == '/login' || $location.path() == '/login/demo' || $location.path() == '/login/video' || $location.path() == '/login/scorecard_video' || dah == '/New Capital' || dah == '/new-capital' || dah == '/Consumer Staples' || dah == '/consumerstaples' || dah == '/Consumer Discretionary' || dah == '/consumerdiscretionary' || dah == '/financial' || dah == '/Technology/Communication' || dah == '/technology' || dah == '/communication' || dah == '/Health Care' || dah == '/healthcare' || dah == '/space-tech' || dah == '/materials' || dah == '/Energy/Utilities' || dah == '/EnergyUtilities' || dah == '/energy' || dah == '/Utilities' || dah == '/Real Estate' || dah == '/realestate' || dah == '/EnvironmentalSocialandGovernance' || dah == '/esg' || dah == '/Quantitative Screens' || dah == '/quantitativescreens'){
         
        }else{
           

        }

 
        
       

        var trackingpage = '';
        var id = '';
        
        if($location.path().indexOf('/companyresearch/') != -1){
          trackingpage = 'Company Research';
          id = $routeParams.researchid;
        }else if($location.path().indexOf('/eventview/') != -1){
          trackingpage = 'Event View';
          id = $routeParams.eventid;
        }  
        else if($location.path().indexOf('/news/') != -1){
          trackingpage = 'News';
          id = $routeParams.newsid;
        }  
        
        if(trackingpage!=''){
          var trackingdetail = {page:trackingpage,id:id};
          Useractivity.getDetail(trackingdetail);
        }

       
        
        

        $scope.login_modal_class = 'hidden';

      if ($scope.popupid == 'auto') {
        $scope.demo_modal = false;
        $scope.login_modal = true;
        $scope.login_modal_class = '';
      } else {
        $scope.login_modal = false;
        $scope.login_modal_class = 'hidden';
      }

      if ($scope.popupid == 'demo') {
        $scope.login_modal = false;
        $scope.login_modal_class = 'hidden';
        $scope.demo_modal = true;
      } else {
        $scope.demo_modal = false;
      }

    $scope.loginpopup = function () {
			//  ******************** To avoid the api calling second time in same page Store in the variable and fetched the data ising $index value
			//$scope.values = $scope.FetchedData.items[index];
			// Assign the values to the variables
			$scope.login_modal = !$scope.login_modal;
			$scope.login_modal_class = '';
      $scope.register_modal_class = 'hidden';
      $scope.demo_modal_class = 'hidden';
		};
        
		// On click redirection
		$scope.checkLogins = function () {

     

			var valid = validation.getEmpty($scope.login);
			if (valid != 0) {
				alertService.add("warning", 'Username or Password Cannot be Empty !', 2000);

				$scope.errorMsg = 'Username or Password Cannot be Empty !';
				$timeout(function () {
					$scope.errorMsg = '';
				}, 3000);
				return false;
			} else {
				$scope.errorMsg = '';
				var url = "apiv4/public/user/login";
				var params = $scope.login;
				//  var getType = RequestDetail.getDetail(url,params);
				RequestDetail.getDetail(url, params).then(function (result) { // Result return

					$scope.spinnerActive = false;

					if (!angular.isUndefined(result.data) && result.data.status == "success") {


						var userType = result.data.items.user_type; // USER TYPE 

						

						localStorageService.set('research_provider_status', result.data.items.research_provider_status);
						localStorageService.set('admincontroluser', result.data.items.admincontroluser);
						$rootScope.research_provider_status = localStorageService.get('research_provider_status');

						if (userType == 1) {
							localStorageService.set('usertype', 'investor');
							localStorageService.set('userdata', result.data.items);
							$rootScope.usertype = localStorageService.get('usertype');
							usertype.doService($rootScope.usertype);
						} else if (userType == 2) {
							localStorageService.set('usertype', 'corporate');
							localStorageService.set('userdata', result.data.items);
							$rootScope.usertype = localStorageService.get('usertype');
							usertype.doService($rootScope.usertype);
						} else if (userType == 3) {
							localStorageService.set('usertype', 'broker');
							localStorageService.set('userdata', result.data.items);
							$rootScope.usertype = localStorageService.get('usertype');
							usertype.doService($rootScope.usertype);
						} else if (userType == 4) {
							localStorageService.set('usertype', 'sales');
							localStorageService.set('userdata', result.data.items);
							$rootScope.usertype = localStorageService.get('usertype');
							usertype.doService($rootScope.usertype);
						} else {
							$scope.errorMsg = 'Username or Password not valid !';
							$timeout(function () {
								$scope.errorMsg = false;
							}, 3000);
							return false;
						}


						localStorageService.set('userimage', result.data.items.image);
						// localStorageService.set('password',result.data.items.password);
						localStorageService.set('email', result.data.items.email);

						var keyonly = localStorageService.get('keyonly');
						var isurl = localStorageService.get('url');

						$scope.login_modal = false;

					
            $window.location.reload();
            
						if (isurl && isurl != '' && isurl != '/login/auto' && isurl != '/login' && isurl != '/login/demo') {
						//	localStorageService.set('url', '');
						} else {
							
						}

						
					} else {
						$scope.errorMsg = 'Username or Password not valid !';
						$timeout(function () {
							$scope.errorMsg = false;
						}, 3000);
						return false;
					}


					
				});

			}
		}


    var userdata = localStorageService.get('userdata');
    
   

    //localStorageService.clearAll();

    var apiurl = 'apiv4/public/user/UserPermission';
		var apiparams = '';
    RequestDetail.getDetail(apiurl, apiparams).then(function (result) {
      if(result.data.user_id){
        $scope.logged = true;

        $scope.profileName = userdata.firstname + ' ' + userdata.lastname;
         
        $scope.static_userstatus = userdata.static_userstatus;
  
        var update_url = "apiv4/public/user/getprofileimage";
        var params = {};
  
        RequestDetail.getDetail(update_url, params).then(function (result) {
          $scope.userimage = result.data.image;
          $scope.company_name = result.data.company_name;
        });
      }else{
        $scope.logged = false;
        localStorageService.clearAll();
      }

      $scope.loadingbutton = true;
       
    });


    

        /* Close Modal   11-09-2018  By Jayapriya */
        $scope.closeModalLogin = function () {
          $scope.login = {};
          $scope.login_modal = false;
          $scope.login_modal_class = 'hidden';
        }

        $scope.register_modal_class = 'hidden';

        $scope.registerpopup = function () {
          $scope.register_modal_class = '';
          $scope.login_modal_class = 'hidden';
        }
    
        $scope.closeModalRegister = function () {
          $scope.register_modal_class = 'hidden';
        }


        $scope.video_modal_class = 'hidden';

        $scope.videopopup = function () {
          $scope.video_modal_class = '';
        }
    
        $scope.closeModalvideo = function () {
          $scope.video_modal_class = 'hidden';
        }
        
        if($scope.popupid=='video'){
          $scope.video_modal_class = ''; 
        }


        $scope.score_video_modal_class = 'hidden';

        $scope.scorevideopopup = function () {
          $scope.score_video_modal_class = '';
        }
    
        $scope.closescoreModalvideo = function () {
          $scope.score_video_modal_class = 'hidden';
        }
        
        if($scope.popupid=='scorecard_video'){
          $scope.score_video_modal_class = ''; 
        }

        


        
        $scope.innerpageprofile_modal_class = 'hidden';

        $scope.innerpageprofile = function () {
          $scope.innerpageprofile_modal_class = '';
        }
    
        $scope.closeModalinnerpageprofile = function () {
          $scope.innerpageprofile_modal_class = 'hidden';
        }

        $scope.popupid = $routeParams.popupID;

        

        $scope.demo_modal_class = 'hidden';

        $scope.demopopup = function () {
          $scope.demo_modal_class = ''; 
        }
        $scope.closeModaldemo = function () {
          $scope.demo_modal_class = 'hidden';
        }
        if($scope.popupid=='demo'){
          $scope.demo_modal_class = ''; 
        }

        $scope.demorequest = {};
        $scope.demorequest.email = '';
        $scope.demorequest.name = '';
        $scope.demorequest.company_request_demo = '';

        $scope.RequestDemo = function () {

          

          var valid = validation.getEmpty($scope.demorequest);
          if (valid != 0) {
            alertService.add("warning", 'Name or Email Cannot be Empty !', 2000);
            $scope.demoerrorMsg = 'Name or Email Cannot be Empty !';
          } else {
            $scope.demoerrorMsg = '';
            var url = "apiv4/public/user/requestdemo";
            var params = $scope.demorequest;
            RequestDetail.getDetail(url, params).then(function (result) { // Result return
              if (result.data.status == "success") {
                $scope.demosuccessMsg = 'Demo request submitted successfully!';
                alertService.add("success", 'Demo request submitted successfully!', 2000);
                $scope.demorequest.email = '';
                $scope.demorequest.name = '';
                $scope.demorequest.phone = '';
                $scope.demorequest.company_request_demo = '';
                $scope.demo_modal = false;
              } else if (result.data.status == "invalid") {
                $scope.demoerrorMsg = 'Email is Invalid!';
                alertService.add("warning", 'Email is Invalid!', 2000);
              } else {
                $scope.demoerrorMsg = 'Please try again later!';
                alertService.add("warning", 'Please try again later!', 2000);
              }
            });
          }
        }


        $scope.acregister = {}; 
        $scope.registersucessstate = false;

        $scope.checkemailval = function (email) {
          var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return re.test(String(email).toLowerCase());
        }
      
        
        $scope.checkregister = function () {
          $scope.registererrorMsg = '';

          if (!$scope.valid) {
            alertService.add("warning", "Please enter correct captcha!", 2000);
            return false;
          }

          if (angular.isUndefined($scope.acregister.firstname) || $scope.acregister.firstname == '') {
            alertService.add("warning", "Please enter first name !", 2000);
            return false;
          }
          if (angular.isUndefined($scope.acregister.lastname) || $scope.acregister.lastname == '') {
            alertService.add("warning", "Please enter last name!", 2000);
            return false;
          }
          if (angular.isUndefined($scope.acregister.email) || $scope.acregister.email == '') {
            alertService.add("warning", "Please enter email !", 2000);
            return false;
          }
          if (!$scope.checkemailval($scope.acregister.email)) {
            alertService.add("warning", "Please enter valid email!", 2000);
            return false;
          }
          if (angular.isUndefined($scope.acregister.company) || $scope.acregister.company == '') {
            alertService.add("warning", "Please enter company!", 2000);
            return false;
          }
          if (angular.isUndefined($scope.acregister.password) || $scope.acregister.password == '') {
            alertService.add("warning", "Please enter password!", 2000);
            return false;
          }
          if (angular.isUndefined($scope.acregister.confirm) || $scope.acregister.confirm == '') {
            alertService.add("warning", "Please enter confirm password!", 2000);
            return false;
          }
          if ($scope.acregister.confirm != $scope.acregister.password) {
            alertService.add("warning", "Password does not match with confirm password!", 2000);
            return false;
          }

          var url = "apiv4/public/corporate/staticuserregister";
          var params = {user:$scope.acregister};
          RequestDetail.getDetail(url, params).then(function (result) { // Result return
            if(result.data.status==2){
              $scope.registererrorMsg = 'Email already exists!';
            }else{
              $scope.acregister = {}; 

              $scope.registersucessstate = true;

              
              var userType = result.data.items.user_type; // USER TYPE 

						

              localStorageService.set('research_provider_status', result.data.items.research_provider_status);
              localStorageService.set('admincontroluser', result.data.items.admincontroluser);
              $rootScope.research_provider_status = localStorageService.get('research_provider_status');
  
              if (userType == 1) {
                localStorageService.set('usertype', 'investor');
                localStorageService.set('userdata', result.data.items);
                $rootScope.usertype = localStorageService.get('usertype');
                usertype.doService($rootScope.usertype);
              } else if (userType == 2) {
                localStorageService.set('usertype', 'corporate');
                localStorageService.set('userdata', result.data.items);
                $rootScope.usertype = localStorageService.get('usertype');
                usertype.doService($rootScope.usertype);
              } else if (userType == 3) {
                localStorageService.set('usertype', 'broker');
                localStorageService.set('userdata', result.data.items);
                $rootScope.usertype = localStorageService.get('usertype');
                usertype.doService($rootScope.usertype);
              } else if (userType == 4) {
                localStorageService.set('usertype', 'sales');
                localStorageService.set('userdata', result.data.items);
                $rootScope.usertype = localStorageService.get('usertype');
                usertype.doService($rootScope.usertype);
              } else {
                $scope.errorMsg = 'Username or Password not valid !';
                $timeout(function () {
                  $scope.errorMsg = false;
                }, 3000);
                return false;
              }
  
  
              localStorageService.set('userimage', result.data.items.image);
              // localStorageService.set('password',result.data.items.password);
              localStorageService.set('email', result.data.items.email);
  
              var keyonly = localStorageService.get('keyonly');
              var isurl = localStorageService.get('url');
  
              $timeout(function () {
                $window.location.reload();
              }, 5000);
            }
            
            
          });
        }


       

        $scope.forgot_modal_class = 'hidden';

        $scope.forgotpopup = function () {
          $scope.forgot_modal_class = '';
          $scope.login_modal_class = 'hidden';
        }
    
        $scope.closeModalforgot = function () {
          $scope.forgot_modal_class = 'hidden';
        }

        $scope.forgotar = {};

        $scope.resetPassword = function () {
          
           if (angular.isUndefined($scope.forgotar.email) || $scope.forgotar.email == '') {
            alertService.add("warning", "Please enter valid email!", 2000);
            return false;
          }
           
          var url = "apiv4/public/user/reset";
          var params = $scope.forgotar.email; 
          RequestDetail.getDetail(url, params).then(function (result) {
              if (result.data == 'true') {
                alertService.add("success", 'Kindly check your inbox!', 2000);
                $scope.forgot_modal_class = 'hidden';
              } else {
                alertService.add("warning", 'Email not exists!', 2000);
              } 
          });
        }

        $scope.logout = function () {
          var url = "apiv4/public/user/logout";
          var params = {
            params: 'logout'
          }
          RequestDetail.getDetail(url, params).then(function (result) {
            localStorageService.clearAll();
            window.location.href = "";
          });
        }
      }
    }
  })

  .directive('staticnewfooterDirective', function ($location, localStorageService, RequestDetail, $rootScope, $controller, alertService, $timeout, $route, $window, validation, $http, $routeParams, usertype, configdetails) {


    var user = localStorageService.get('usertype');
    var userdata = localStorageService.get('userdata');
    var userimage = localStorageService.get('userimage');



   
    return {
      // controller: "mainControl",
      restrict: 'AE',
      scope: false,
      replace: false,
      templateUrl: function (elem, attrs) {
        return attrs.templateUrl || 'partials/common/footer.html'
      },
      controller: function ($scope, $location) {

        

      }
    }
  })
  .directive('scrollData', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var raw = element[0];

        element.bind('scroll', function () {
          if ((raw.scrollTop + raw.offsetHeight) + 1 >= raw.scrollHeight) {
            scope.$apply(attrs.scrollTrigger);
          }
        });
      }
    };
  })
  .directive('footerDirective', function (localStorageService) {
    return {
      restrict: 'E',
      scope: {},
      replace: false,
      templateUrl: function (elem, attrs) {
        return attrs.templateUrl || 'partials/' + localStorageService.get('usertype') + '/user-footer.html'
      },
      controller: function ($scope, $location) {
        $scope.ShowWSHattribution = 'hide';
        if ($location.path().indexOf('/dashboard/') > -1)
          $scope.ShowWSHattribution = '';
        if ($location.path().indexOf('/responseEvents/') > -1)
          $scope.ShowWSHattribution = '';


        //ZACKS ATTRIBUTION
        $scope.ShowZACKSattribution = 'hide';
        if ($location.path().indexOf('/meetingPreparation/') > -1)
          $scope.ShowZACKSattribution = '';
        if ($location.path().indexOf('/meetingArchive/aggregate') > -1)
          $scope.ShowZACKSattribution = '';

      }
    }
  })
  .directive('autoComplete', function ($timeout) {    // Autocomplete
    return function (scope, iElement, iAttrs) {
      iElement.autocomplete({
        source: scope[iAttrs.uiItems],
        select: function () {
          $timeout(function () {
            iElement.trigger('input');
          }, 0);
        }
      });
    };
  })
  .directive('ngConfirmBoxClick', [
    function () {
      return {
        link: function (scope, element, attr) {
          var msg = attr.ngConfirmBoxClick;
          var clickAction = attr.confirmedClick;
          element.bind('click', function (event) {
            if (window.confirm(msg)) {
              scope.$apply(clickAction);
            }
          });
        }
      };
    }
  ])
  .directive('modal', function () {
    return {
      template: '<div class="modal"><button type="button" class="close" data-dismiss="modal">&times;</button>' +
        '<div class="modal-dialog" style="width:{{width}}">' +
        '<div class="modal-content">' +
        '<div class="modal-body" ng-transclude></div>' +
        '</div>' +
        '</div>' +
        '</div>',
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: true,
      link: function postLink(scope, element, attrs) {
        scope.width = attrs.width;

        scope.title = attrs.title;

        scope.$watch(attrs.visible, function (value) {
          if (value == true)
            $(element).modal('show');
          else
            $(element).modal('hide');
        });
        /*
        $(element).on('shown.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = true;
          });
        });
    */
        /* $(element).on('hidden.bs.modal', function(){
           scope.$apply(function(){
             scope.$parent[attrs.visible] = false;
           });
         });*/
      }
    };
  })
  .directive('unlink', function ($rootScope) {
    return {
      link: function (scope, elem, attrs, modelCtrl) {
        if ($rootScope.unlink == '') { $rootScope.unlink = {}; }
        elem.bind('click', function () {
          $rootScope.url = this.attributes.href.nodeValue;
          if ($(".customvalidatefun").length > 0) {
            var data = $(".customvalidatefun input,select,textarea").filter(function () {
              return !!this.value;
            }).serializeArray();
            if (data.length > 0) {
              scope.$apply(function () {
                scope.warningconfirmbox = true;
              })
              return false;
            }
            else {
              return true;
            }
          }
        });
      }
    };
  })
  .directive('golink', function ($rootScope, $location) {
    return {
      link: function (scope, elem, attrs, modelCtrl) {
        elem.bind('click', function () {
          var url = $rootScope.url;
          var url1 = url.substring(1);
          $location.path(url1);
        });
      }
    };
  })
  .directive('emailexist', function ($timeout, $http, $q) {
    return {
      restrict: 'AE',
      require: 'ngModel',
      scope: {
        emailval: '=emailValue',
        emailProcess: '&',
      },
      link: function (scope, elm, attr, model) {

        model.$asyncValidators.usernameExists = function () {
          //here you should access the backend, to check if username exists
          //and return a promise
          scope.emailProcess()(false);
          var email = elm.context.value;
          return $http.post('apiv4/public/user/checkEmail', { email: email, headers: { 'Content-Type': 'application/json' } })
            .then(function (res) {
              if (res.data == 1) {
                $timeout(function () {
                  model.$setValidity('emailExist', false);
                }, 1000);
              } else {
                model.$setValidity('emailExist', true);
              }
              scope.emailProcess()(true);
            }/*, function(reason){
            return res;
          }*/
            );

        };
        scope.$watch("emailval", function (value) {
          ;
          model.$setViewValue(value);
        });
      }
    }
  })
  .directive('onErrorSrc', function () {
    return {
      link: function (scope, element, attrs) {
        element.bind('error', function () {
          attrs.$set('src', 'images/profile_avatar.jpg');
        });
      }
    }
  })
  .directive('noImage', function () {

    var setDefaultImage = function (el) {
      el.attr('src', "images/no-image.jpg");
    };

    return {
      restrict: 'A',
      link: function (scope, el, attr) {
        scope.$watch('attr.ngSrc', function () {
          var src = attr.ngSrc;

          if (!src) {
            setDefaultImage(el);
          }
        });

        el.bind('error', function () { setDefaultImage(el); });
      }
    };
  })
  .directive('checkStrength', function () {

    return {
      replace: false,
      restrict: 'EACM',
      link: function (scope, iElement, iAttrs) {

        var strength = {
          colors: ['#F00', '#F90', '#FF0', '#9F0', '#0F0'],
          mesureStrength: function (p) {

            var _force = 0;
            var _regex = /[$-:-?{-~!"^_`\[\]]/g;

            var _lowerLetters = /[a-z]+/.test(p);
            var _upperLetters = /[A-Z]+/.test(p);
            var _numbers = /[0-9]+/.test(p);
            var _symbols = _regex.test(p);

            var _flags = [_lowerLetters, _upperLetters, _numbers, _symbols];
            var _passedMatches = $.grep(_flags, function (el) { return el === true; }).length;

            _force += 2 * p.length + ((p.length >= 10) ? 1 : 0);
            _force += _passedMatches * 10;

            // penality (short password)
            _force = (p.length <= 6) ? Math.min(_force, 10) : _force;

            // penality (poor variety of characters)
            _force = (_passedMatches == 1) ? Math.min(_force, 10) : _force;
            _force = (_passedMatches == 2) ? Math.min(_force, 20) : _force;
            _force = (_passedMatches == 3) ? Math.min(_force, 40) : _force;

            return _force;

          },
          getColor: function (s) {

            var idx = 0;
            if (s <= 10) { idx = 0; }
            else if (s <= 20) { idx = 1; }
            else if (s <= 30) { idx = 2; }
            else if (s <= 40) { idx = 3; }
            else { idx = 4; }

            return { idx: idx + 1, col: this.colors[idx] };

          }
        };

        scope.$watch(iAttrs.checkStrength, function () {
          var pass = $("#password").val();
          if (!scope.step2.password && pass == '') {
            scope.step2.password = '';
          } else if (pass != '') {
            scope.step2.password = pass;
          }
          if (scope.step2.password == '') {
            iElement.css({ "display": "none" });
          } else {
            var c = strength.getColor(strength.mesureStrength(scope.step2.password));
            iElement.css({ "display": "inline" });
            iElement.children('li')
              .css({ "background": "#DDD" })
              .slice(0, c.idx)
              .css({ "background": c.col });
            if (pass.length <= 5) {
              iElement.css({ "display": "none" });
            }
          }
        });

      },
      template: '<li class="point"></li><li class="point"></li><li class="point"></li><li class="point"></li><li class="point"></li>'
    };
  })
  .directive('iframeSetDimensionsOnload', ['$window', function ($window) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        element.on('load', function () {
          //var iFrameHeight = ($window.innerHeight - 100) + 'px';
          var iFrameHeight = $window.innerHeight + 'px';
          var iFrameWidth = '100%';
          element.css('width', iFrameWidth);
          element.css('height', iFrameHeight);
        })
      }
    }
  }])
  .directive('datetimepickerNeutralTimezone', function () {
    return {
      restrict: 'A',
      priority: 1,
      require: 'ngModel',
      link: function (scope, element, attrs, ctrl) {
        ctrl.$formatters.push(function (value) {
          var date = new Date(Date.parse(value));
          date = new Date(date.getTime() + (60000 * date.getTimezoneOffset()));
          return date;
        });

        ctrl.$parsers.push(function (value) {
          var date = new Date(value.getTime() - (60000 * value.getTimezoneOffset()));
          return date;
        });
      }
    };
  })
  .directive('meetingTime', function ($timeout) {
    return {
      restrict: 'A',
      link: function (scope, elm, attrbs, ngmodel) {
        scope.disableOptions = function (attr, element, data, dis) {

          $("option", element).each(function (i) {
            if (angular.isDefined(data[i]) && angular.isDefined(data[i].value) && data[i].value != '') {
              var locals = {};
              var isdisable = false;
              angular.forEach(dis, function (val, k) {
                if (val.meeting_time != "" && data[i].value == val.meeting_time) {
                  isdisable = true;
                }
              });
              $(this).attr("disabled", isdisable);
              locals[attr] = data[i];
            }
          });
        }
        attrbs.$observe('meetingTime', function () {
          scope.disableOptions(ngmodel, elm, scope.meeting_times_array, scope.corporates);
        });
        $timeout(function () {
          scope.disableOptions(ngmodel, elm, scope.meeting_times_array, scope.corporates);
        }, 1000);
      }
    }
  })
  .directive('datecompare', function () {
    return {
      link: function ($scope, $element, $attrs) {
        var nowadate = new Date();
        var datecompareas = $attrs.datecompare;
        if (datecompareas.indexOf('-') > 0) {
          var datecompareass = datecompareas.split('-');
          var datecompareasss = datecompareass[datecompareass.length - 1]
          var evedate = new Date(datecompareasss);
        }
        else {
          var evedate = new Date($attrs.datecompare);
        }

        if (nowadate > evedate) {
          $element.hide();
        }
        else {
          $element.show();
        }
      }
    };
  })
  .directive('hasPermission', function (permissions) {
    return {
      link: function (scope, element, attrs) {

        var value = attrs.hasPermission.trim();
        var notPermissionFlag = value[0] === '!';
        if (notPermissionFlag) {
          value = value.slice(1).trim();
        }

        function toggleVisibilityBasedOnPermission() {
          var hasPermission = permissions.hasPermission(value);
          if (hasPermission && !notPermissionFlag || !hasPermission && notPermissionFlag) {
            element.show();
          }
          else {
            element.hide();
          }
        }

        toggleVisibilityBasedOnPermission();
        scope.$on('permissionsChanged', toggleVisibilityBasedOnPermission);
      }
    };
  })
  .directive('numbersOnly', function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, modelCtrl) {
        modelCtrl.$parsers.push(function (inputValue) {
          // this next if is necessary for when using ng-required on your input.
          // In such cases, when a letter is typed first, this parser will be called
          // again, and the 2nd time, the value will be undefined
          if (inputValue == undefined) return ''
          var transformedInput = inputValue.replace(/[^0-9]/g, '');
          if (transformedInput != inputValue) {
            modelCtrl.$setViewValue(transformedInput);
            modelCtrl.$render();
          }
          return transformedInput;
        });
      }
    };
  })
  .directive('removescript', function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, modelCtrl) {
        modelCtrl.$parsers.push(function (inputValue) {
          // this next if is necessary for when using ng-required on your input.
          // In such cases, when a letter is typed first, this parser will be called
          // again, and the 2nd time, the value will be undefined
          if (inputValue == undefined) return ''
          var transformedInput = inputValue.replace(/(<([^>]+)>)/ig, '');
          if (transformedInput != inputValue) {
            modelCtrl.$setViewValue(transformedInput);
            modelCtrl.$render();

          }
          return transformedInput;
        });
      }
    };
  })
  .directive('charonly', function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, modelCtrl) {
        modelCtrl.$parsers.push(function (inputValue) {
          // this next if is necessary for when using ng-required on your input.
          // In such cases, when a letter is typed first, this parser will be called
          // again, and the 2nd time, the value will be undefined
          if (inputValue == undefined) return ''
          var transformedInput = inputValue.replace(/[^A-Za-z@#?;,. ]/, '');
          if (transformedInput != inputValue) {
            modelCtrl.$setViewValue(transformedInput);
            modelCtrl.$render();

          }
          return transformedInput;
        });
      }
    };
  })
  .directive('strictcharonly', function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, modelCtrl) {
        modelCtrl.$parsers.push(function (inputValue) {
          // this next if is necessary for when using ng-required on your input.
          // In such cases, when a letter is typed first, this parser will be called
          // again, and the 2nd time, the value will be undefined
          if (inputValue == undefined) return ''
          var transformedInput = inputValue.replace(/[^A-Za-z]/, '');
          if (transformedInput != inputValue) {
            modelCtrl.$setViewValue(transformedInput);
            modelCtrl.$render();

          }
          return transformedInput;
        });
      }
    };
  })
  .directive('charnumonlyonly', function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, modelCtrl) {
        modelCtrl.$parsers.push(function (inputValue) {
          // this next if is necessary for when using ng-required on your input.
          // In such cases, when a letter is typed first, this parser will be called
          // again, and the 2nd time, the value will be undefined
          if (inputValue == undefined) return ''
          var transformedInput = inputValue.replace(/[^0-9a-zA-Z-]/, '');
          if (transformedInput != inputValue) {
            modelCtrl.$setViewValue(transformedInput);
            modelCtrl.$render();

          }
          return transformedInput;
        });
      }
    };
  })
  .directive('numonly', function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, modelCtrl) {
        modelCtrl.$parsers.push(function (inputValue) {
          // this next if is necessary for when using ng-required on your input.
          // In such cases, when a letter is typed first, this parser will be called
          // again, and the 2nd time, the value will be undefined
          if (inputValue == undefined) return ''
          var transformedInput = inputValue.replace(/[^0-9]/, '');
          if (transformedInput != inputValue) {
            modelCtrl.$setViewValue(transformedInput);
            modelCtrl.$render();
            // alertService('warning','Only For numeric only','2000');
          }
          return transformedInput;
        });
      }
    };
  })
  .directive('charnumonly', function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, modelCtrl) {
        modelCtrl.$parsers.push(function (inputValue) {
          // this next if is necessary for when using ng-required on your input.
          // In such cases, when a letter is typed first, this parser will be called
          // again, and the 2nd time, the value will be undefined
          if (inputValue == undefined) return ''
          var transformedInput = inputValue.replace(/[^0-9a-zA-Z@#;,. ]/, '');
          if (transformedInput != inputValue) {
            modelCtrl.$setViewValue(transformedInput);
            modelCtrl.$render();

          }
          return transformedInput;
        });
      }
    };
  })
  .directive('numcharonly', function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, modelCtrl) {
        modelCtrl.$parsers.push(function (inputValue) {
          // this next if is necessary for when using ng-required on your input.
          // In such cases, when a letter is typed first, this parser will be called
          // again, and the 2nd time, the value will be undefined
          if (inputValue == undefined) return ''
          var transformedInput = inputValue.replace(/[^0-9a-zA-Z ]/, '');
          if (transformedInput != inputValue) {
            modelCtrl.$setViewValue(transformedInput);
            modelCtrl.$render();

          }
          return transformedInput;
        });
      }
    };
  })
  .directive('charcommaonly', function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, modelCtrl) {
        modelCtrl.$parsers.push(function (inputValue) {
          // this next if is necessary for when using ng-required on your input.
          // In such cases, when a letter is typed first, this parser will be called
          // again, and the 2nd time, the value will be undefined
          if (inputValue == undefined) return ''
          var transformedInput = inputValue.replace(/[^0-9a-zA-Z@,. -_]/, '');
          if (transformedInput != inputValue) {
            modelCtrl.$setViewValue(transformedInput);
            modelCtrl.$render();

          }
          return transformedInput;
        });
      }
    };
  })
  .directive('mailtofun', function () {
    return {
      link: function (scope, element, attrs) {
        element.bind('click', function () {
          var val = attrs.mailtofun;
          if ((navigator.userAgent.indexOf("Chrome") != -1) || (navigator.userAgent.indexOf("Safari") != -1)) {
            var wnd = window.open('mailto:' + val, '_blank');
            setTimeout(function () {
              wnd.close();
            }, 100);
          }
          else if ((navigator.userAgent.indexOf("Firefox")) != -1 || (navigator.userAgent.indexOf("Opera") != -1 || (navigator.userAgent.indexOf('OPR')) != -1) || (!!document.documentMode == true) || (navigator.userAgent.indexOf("MSIE") != -1)) {
            window.open('mailto:' + val, '_blank');
          }
          else {
            window.open('mailto:' + val, '_blank');
          }
        });
      }
    };
  }).directive('summernote', [function () {
    'use strict';

    return {
      restrict: 'EA',
      transclude: 'element',
      replace: true,
      require: ['summernote', '?ngModel'],
      controller: 'SummernoteController',
      scope: {
        summernoteConfig: '=config',
        editable: '=',
        editor: '=',
        init: '&onInit',
        enter: '&onEnter',
        focus: '&onFocus',
        blur: '&onBlur',
        paste: '&onPaste',
        keyup: '&onKeyup',
        keydown: '&onKeydown',
        change: '&onChange',
        imageUpload: '&onImageUpload',
        mediaDelete: '&onMediaDelete'
      },
      template: '<div class="summernote"></div>',
      link: function (scope, element, attrs, ctrls, transclude) {
        var summernoteController = ctrls[0],
          ngModel = ctrls[1];

        if (!ngModel) {
          transclude(scope, function (clone, scope) {
            // to prevent binding to angular scope (It require `tranclude: 'element'`)
            element.append(clone.html());
          });
          summernoteController.activate(scope, element, ngModel);
        } else {
          var clearWatch = scope.$watch(function () { return ngModel.$viewValue; }, function (value) {
            clearWatch();
            element.append(value);
            summernoteController.activate(scope, element, ngModel);
          }, true);
        }
      }
    };
  }])
  .directive("owlCarousel", function() {
    return {
      restrict: 'E',
      transclude: false,
      link: function (scope) {
        scope.initCarousel = function(element) {
          // provide any default options you want
          var defaultOptions = {
          };
          var customOptions = scope.$eval($(element).attr('data-options'));
          // combine the two options objects
          for(var key in customOptions) {
            defaultOptions[key] = customOptions[key];
          }

          $scope.innerdwidh = $window.innerWidth;

          if($scope.innerdwidh>760){
            defaultOptions[items] = 3;
          }else{
            defaultOptions[items] = 1;
          }

         
          // init carousel
          $(element).owlCarousel(defaultOptions);
        };
      }
    };
  })
  .directive('owlCarouselItem', [function() {
    return {
      restrict: 'A',
      transclude: false,
      link: function(scope, element) {
        // wait for the last item in the ng-repeat then call init
        if(scope.$last) {
          scope.initCarousel(element.parent());
        }
      }
    };
  }])
  /*.directive('jwplayer', ['$compile', function ($compile) {
    return {
      restrict: 'EC',
      scope: {
        playerId: '@',
        setupVars: '=setup'

      },
      link: function (scope, element, attrs) {
        var id = scope.playerId || 'random_player_' + Math.floor((Math.random() * 999999999) + 1),
          getTemplate = function (playerId) {
            return '<div id="' + playerId + '"></div>';
          };

        element.html(getTemplate(id));
        $compile(element.contents())(scope);
        jwplayer(id).setup(scope.setupVars);
      }
    };
  }])*/
  .directive('ngEnter', function () {
    return function (scope, element, attrs) {
      element.bind('keydown keypress', function (event) {
        if (event.which === 13) {
          scope.$apply(function () {
            scope.$eval(attrs.ngEnter);
          });
          event.preventDefault();
        }
      });
    };
  })
  .directive('simpleCaptcha', function($timeout) {
    return {
        restrict: 'E',
        scope: { valid: '=valid' },
        template: '<input ng-model="a.value" ng-show="a.input" style="width:2em; text-align: center;" class="shadow-sm bg-gray-50 border border-darkGrey text-darkGrey text-sm rounded-md focus:border-lightBlue ng-pristine ng-empty ng-invalid ng-invalid-required ng-touched"><span ng-hide="a.input">{{a.value}}</span>&nbsp;{{operation}}&nbsp;<input ng-model="b.value" ng-show="b.input" style="width:2em; text-align: center;" class="shadow-sm bg-gray-50 border border-darkGrey text-darkGrey text-sm rounded-md focus:border-lightBlue ng-pristine ng-empty ng-invalid ng-invalid-required ng-touched"><span ng-hide="b.input">{{b.value}}</span>&nbsp;=&nbsp;{{result}} <input value="{{result1}}" ng-model="valid" style="display:none"/>',
        controller: function($scope) {
            
            var show = Math.random() > 0.5;
            
            var value = function(max){
                return Math.floor(max * Math.random());
            };
            
            var int = function(str){
                return parseInt(str, 10);
            };
            
            $scope.a = {
                value: show? undefined : 1 + value(4),
                input: show
            };
            $scope.b = {
                value: !show? undefined : 1 + value(4),
                input: !show
            };
            $scope.operation = '+';
            
            $scope.result = 5 + value(5);
            
            var a = $scope.a;
            var b = $scope.b;
            var result = $scope.result;
            
            var checkValidity = function(){
              //console.log(a.value);
              //console.log(b.value);
              
                if (a.value && b.value) {
                    var calc = int(a.value) + int(b.value);
                    $scope.valid = calc == result;
                } else {
                    $scope.valid = false;
                }
                ////console.log(result);
                //$scope.result1 = $scope.valid;

                $scope.$apply(); // needed to solve 2 cycle delay problem;
            };
            
            
            $scope.$watch('a.value', function(){    
              $timeout(function() {
                checkValidity();
              });
            });
            
            $scope.$watch('b.value', function(){    
              $timeout(function() {
                checkValidity();
              });
            });
            
            
            
        }
    };
});

(function () {
  angular.module('ngLoadingSpinner', ['angularSpinner'])
    .directive('usSpinner', ['$http', '$rootScope', function ($http, $rootScope) {
      return {
        link: function (scope, elm, attrs) {
          $rootScope.spinnerActive = false;
          scope.isLoading = function () {
            return $http.pendingRequests.length > 0;
          };

          scope.$watch(scope.isLoading, function (loading) {
            $rootScope.spinnerActive = loading;
            if (loading) {
              elm.removeClass('ng-hide');
            } else {
              elm.addClass('ng-hide');
            }
          });
        }
      };

    }]);
}).call(this);