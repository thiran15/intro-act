'use strict';

/* Controllers */

angular.module('myApp.corporateCtrl', ['ui.bootstrap','socialshare'])
    .controller('investorstaticCtrl', function ($scope, $http, $location, $routeParams, localStorageService, RequestDetail, configdetails, $sce, usertype,alertService,$timeout) {

       

    })
    .controller('corporatestaticCtrl', function ($scope, $http, $location, $routeParams, localStorageService, RequestDetail, configdetails, $sce, usertype,alertService,$timeout) {

       
       

    })
    .controller('aboutstaticCtrl', function ($scope, $http, $location, $routeParams, localStorageService, RequestDetail, configdetails, $sce, usertype,alertService,$timeout) {

      

    })
    .controller('newslettercategoryCtrl', function ($scope, $http, $location, $routeParams, localStorageService, RequestDetail, configdetails, $sce, usertype,alertService,$timeout) {

      $scope.emailhash = $routeParams.hashId;

      $scope.managenewsletterpopup = 'hidden';

      $scope.managesubpopopen = function () {
        $scope.managenewsletterpopup = '';
      }

      $scope.manageclosenewsletterpopup = function () {
        $scope.managenewsletterpopup = 'hidden';
      }

      $scope.managenewslettercontact = {};
      $scope.managenewslettercontact.type = {};

      
      $scope.login_status = 0;


      $scope.newsletterpopup = 'hidden';
      $scope.opennewsletterpopup = function () {
        $scope.newsletterpopup = '';
      }

      $scope.closenewsletterpopup = function () {
        $scope.newsletterpopup = 'hidden';
      }

      $scope.checkbutton = '0';


      if($routeParams.hashId){
        $scope.managenewsletterpopup = '';
      }
 

      var url = "apiv4/public/user/getallnewsletters";
      var params = {emailhash:$scope.emailhash};
      RequestDetail.getDetail(url, params).then(function (result) { // Result return
        $scope.login_status = result.data.login_status; 

       

        if(result.data.type.ResearchSpotlight){
          $scope.managenewslettercontact.type['ResearchSpotlight'] = true;
        }
        if(result.data.type.irfundamental){
          $scope.managenewslettercontact.type['irfundamental'] = true;
        }
        if(result.data.type.stash){
          $scope.managenewslettercontact.type['stash'] = true;
        }
        if(result.data.type.spac){
          $scope.managenewslettercontact.type['spac'] = true;
        }
        if(result.data.type.spacetech){
          $scope.managenewslettercontact.type['spacetech'] = true;
        }
        if(result.data.type.fintech){
          $scope.managenewslettercontact.type['fintech'] = true;
        }
        if(result.data.type.metaverse){
          $scope.managenewslettercontact.type['metaverse'] = true;
        } 
        
        $timeout(function () {
					$scope.checkbutton = '1';		
				}, 1000);
      });


      $scope.newsletterupdate = function () { 

        if (!$scope.valid) {
            alertService.add("warning", "Please enter correct captcha!", 2000);
            return false;
        }
  
        $scope.typearray = [];

        $scope.spinnerActive = true; 

        $.each($scope.managenewslettercontact.type, function (indus,index) {
           if(index){
              $scope.typearray.push({
                status: 1,
                type: indus
              }); 
           }else{
              $scope.typearray.push({
                status: 0,
                type: indus
              }); 
           }
           
        });
 
        var url = "apiv4/public/corporate/newsletterupdate";
        var params = {contact:$scope.typearray,email:$scope.emailhash};
        RequestDetail.getDetail(url, params).then(function (result) { // Result return
          $scope.managenewslettersucessstate = true;
          
          $scope.spinnerActive = false;

          $timeout(function () {
            $scope.managenewslettersucessstate = false;
            $scope.managenewsletterpopup = 'hidden';		
          }, 1000);
        });
      }


      $scope.newslettercontact = {};
		$scope.newslettercontact.type={};
		$scope.newslettersucessstate = false;
		$scope.newsletterregister = function () {
			if (!$scope.valid) {
				alertService.add("warning", "Please enter correct captcha!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.newslettercontact.name) || $scope.newslettercontact.name == '') {
				alertService.add("warning", "Please enter name !", 2000);
				return false;
			}
			if (angular.isUndefined($scope.newslettercontact.email) || $scope.newslettercontact.email == '') {
				alertService.add("warning", "Please enter email !", 2000);
				return false;
			}
			if (!$scope.checkemailval($scope.newslettercontact.email)) {
				alertService.add("warning", "Please enter valid email!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.newslettercontact.company) || $scope.newslettercontact.company == '') {
				alertService.add("warning", "Please enter company!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.newslettercontact.type) || $scope.newslettercontact.type == '') {
				alertService.add("warning", "Please enter type!", 2000);
				return false;
			}else{
				var checknewsletterinput = true;
				$.each($scope.newslettercontact.type, function (index, industry) {
					if (industry == true) {
						checknewsletterinput = false;
					}
				});

				if(checknewsletterinput){
					alertService.add("warning", "Please enter type!", 2000);
					return false;
				}
			}
			
			$scope.newslettercontact.typearray = [];

			$.each($scope.newslettercontact.type, function (index, data) {
				if (data == true) {
					$scope.newslettercontact.typearray.push(index);
				}
			});


			var url = "apiv4/public/corporate/newsletterregister";
			var params = {contact:$scope.newslettercontact};
			RequestDetail.getDetail(url, params).then(function (result) { // Result return
				$scope.newslettersucessstate = true;
				$scope.newslettercontact = {};

				$timeout(function () {
					$scope.newslettersucessstate = false;
					$scope.newsletterpopup = 'hidden';		
				}, 1000);
			});
		}

      
      
       

    })

   .controller('contactstaticCtrl', function ($scope, $http, $location, $routeParams, localStorageService, RequestDetail, configdetails, $sce, usertype,alertService,$rootScope, Captcha) {
        $scope.contact = {}; 
		$scope.sucessstate = false;

        $scope.privacy = false;

        $scope.checkemailval = function (email) {
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(String(email).toLowerCase());
		}

		$scope.contactsubmit = function () {

            
      if (!$scope.valid) {
				alertService.add("warning", "Please enter correct captcha!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.contact.name) || $scope.contact.name == '') {
				alertService.add("warning", "Please enter name !", 2000);
				return false;
			}
			if (angular.isUndefined($scope.contact.email) || $scope.contact.email == '') {
				alertService.add("warning", "Please enter valid email !", 2000);
				return false;
			}
			if (!$scope.checkemailval($scope.contact.email)) {
				alertService.add("warning", "Please enter valid email!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.contact.company) || $scope.contact.company == '') {
				alertService.add("warning", "Please enter company!", 2000);
				return false;
			}
            if (angular.isUndefined($scope.contact.message) || $scope.contact.message == '') {
				alertService.add("warning", "Please enter message!", 2000);
				return false;
			}
            
            
            $scope.spinnerActive = true;

			var url = "apiv4/public/user/contactformrequest";
			var params = {contact:$scope.contact};
			RequestDetail.getDetail(url, params).then(function (result) { // Result return
				$scope.sucessstate = true;
                $scope.spinnerActive = false;
				$scope.contact = {};

				alertService.add("success", "Sent sucessfully !",2000);
			});
		}
       

    })

    .controller('newdealflowstaticCtrl', function ($scope, $http, $location, $routeParams, localStorageService, RequestDetail, configdetails, $sce, usertype,alertService,$rootScope, Captcha) {
      $scope.dealflow = {}; 
      $scope.sucessstate = false;

      $scope.privacy = false;

      $scope.checkemailval = function (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      }

      $scope.upload_prfhomebanner_img = function (imgdata) {
        $scope.dealflow.homebanner = 'uploads/dealflow/'+imgdata;
      }

      $scope.newdealflowsubmit = function () {
    
        if (angular.isUndefined($scope.dealflow.title) || $scope.dealflow.title == '') {
          alertService.add("warning", "Please enter title !", 2000);
          return false;
        }
        if (angular.isUndefined($scope.dealflow.homebanner) || $scope.dealflow.homebanner == '') {
          alertService.add("warning", "Please upload logo !", 2000);
          return false;
        } 
        if (angular.isUndefined($scope.dealflow.type) || $scope.dealflow.type == '') {
          alertService.add("warning", "Please select type!", 2000);
          return false;
        }
        if (angular.isUndefined($scope.dealflow.sector) || $scope.dealflow.sector == '') {
          alertService.add("warning", "Please select sector!", 2000);
          return false;
        }
        if (angular.isUndefined($scope.dealflow.raisesize) || $scope.dealflow.raisesize == '') {
          alertService.add("warning", "Please select raisesize!", 2000);
          return false;
        }
        
        if (angular.isUndefined($scope.dealflow.content) || $scope.dealflow.content == '') {
          alertService.add("warning", "Please enter content!", 2000);
          return false;
        }
              
              
        $scope.spinnerActive = true;

        var url = "apiv4/public/user/dealflowadd";
        var params = {data:$scope.dealflow};
        RequestDetail.getDetail(url, params).then(function (result) { // Result return
          $scope.sucessstate = true;
          $scope.spinnerActive = false;
          $scope.dealflow = {};

          alertService.add("success", "Sent sucessfully !",2000);
        });
      }
     

  })
    
    .controller('resetCtrl', function ($scope, $http, $location, $routeParams, localStorageService, RequestDetail, configdetails, $sce, usertype,alertService,$rootScope, Captcha, $timeout) {

  
         
        //console.log($routeParams.hashId);

        $scope.validlink = 0;

       // $scope.spinnerActive = true;

        var url = "apiv4/public/user/checkresetpassword";
		var params = {hashId:$routeParams.hashId};
		RequestDetail.getDetail(url, params).then(function (result) { // Result return
            $scope.spinnerActive = false;
            $scope.validlink = result.data;
            
		});

        $scope.contact = {}; 		 

        
		$scope.contactsubmit = function () {
 
			if (angular.isUndefined($scope.contact.password) || $scope.contact.password == '') {
				alertService.add("warning", "Please enter password !", 2000);
				return false;
			}
			if (angular.isUndefined($scope.contact.confirm) || $scope.contact.confirm == '') {
				alertService.add("warning", "Please enter confirm password !", 2000);
				return false;
			}
            if ($scope.contact.password.length<6) {
				alertService.add("warning", "Your password must have at least 6 chars!", 5000);
				return false;
			}
			if ($scope.contact.password!=$scope.contact.confirm) {
				alertService.add("warning", "New password and confirm password doesn't match!", 2000);
				return false;
			}
			 
            
            $scope.spinnerActive = true;

			var url = "apiv4/public/user/resetpassword";
			var params = {contact:$scope.contact,hashId:$routeParams.hashId};
			RequestDetail.getDetail(url, params).then(function (result) { // Result return
				$scope.sucessstate = true;
                $scope.spinnerActive = false;
				$scope.contact = {}; 
				alertService.add("success", "Password updated sucessfully!",2000);
                $timeout(function () {
                    $location.path('login');
				}, 2000);
               
			});
		}
       

    })
    .controller('researchprovidersstaticCtrl', function ($scope, $http, $location, $routeParams, localStorageService, RequestDetail, configdetails, $sce, usertype,alertService) {

        $scope.newsletterpopup = 'hidden';
		$scope.opennewsletterpopup = function () {
			$scope.newsletterpopup = '';
		}

		$scope.closenewsletterpopup = function () {
			$scope.newsletterpopup = 'hidden';
		}

        $scope.checkemailval = function (email) {
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(String(email).toLowerCase());
		}

		$scope.newslettercontact = {};
		$scope.newslettercontact.type={};
		$scope.newslettersucessstate = false;
		$scope.newsletterregister = function () {
            if (!$scope.valid) {
                alertService.add("warning", "Please enter correct captcha!", 2000);
                return false;
            }
			if (angular.isUndefined($scope.newslettercontact.name) || $scope.newslettercontact.name == '') {
				alertService.add("warning", "Please enter name !", 2000);
				return false;
			}
			if (angular.isUndefined($scope.newslettercontact.email) || $scope.newslettercontact.email == '') {
				alertService.add("warning", "Please enter email !", 2000);
				return false;
			}
			if (!$scope.checkemailval($scope.newslettercontact.email)) {
				alertService.add("warning", "Please enter valid email!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.newslettercontact.company) || $scope.newslettercontact.company == '') {
				alertService.add("warning", "Please enter company!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.newslettercontact.type) || $scope.newslettercontact.type == '') {
				alertService.add("warning", "Please enter type!", 2000);
				return false;
			}else{
				var checknewsletterinput = true;
				$.each($scope.newslettercontact.type, function (index, industry) {
					if (industry == true) {
						checknewsletterinput = false;
					}
				});

				if(checknewsletterinput){
					alertService.add("warning", "Please enter type!", 2000);
					return false;
				}
			}
			
			$scope.newslettercontact.typearray = [];

			$.each($scope.newslettercontact.type, function (index, data) {
				if (data == true) {
					$scope.newslettercontact.typearray.push(index);
				}
			});

            $scope.spinnerActive = true;


			var url = "apiv4/public/corporate/newsletterregister";
			var params = {contact:$scope.newslettercontact};
			RequestDetail.getDetail(url, params).then(function (result) { // Result return
				$scope.newslettersucessstate = true;
				$scope.newslettercontact = {};

                $scope.spinnerActive = false;

				$timeout(function () {
					$scope.newslettersucessstate = false;
					$scope.newsletterpopup = 'hidden';		
				}, 1000);
			});
		}
       

    })
    .controller('foreignbrokersstaticCtrl', function ($scope, $http, $location, $routeParams, localStorageService, RequestDetail, configdetails, $sce, usertype,alertService,$timeout) {

        
       

    })
    .controller('coverageCtrl', function ($scope, $http, $location, $routeParams, localStorageService, RequestDetail, configdetails, $sce, usertype,alertService) {
        $scope.configdetails = configdetails; 

        

        var GetcoveragesList = 'apiv4/public/corporate/getcoverage';
        var params = {};

        RequestDetail.getDetail(GetcoveragesList, params).then(function (result) {
            $scope.coverages = result.data;
            $scope.spinnerActive = false;
        });

        
        
    })
    .controller('upcomingeventsCtrl', function ($scope, $http, $location, $routeParams, localStorageService, RequestDetail, configdetails, $sce, usertype,alertService,Useractivity) {

       

        $scope.industry_title = $routeParams.industry;

        $scope.companies = [];
        $scope.upcomingevents = [];
        $scope.tickerfilter = '';
        $scope.filtertext = '';

        $scope.filter = {};

        $scope.activetab = 1;

        var GetindustrydataList = 'apiv4/public/corporate/getcuratordata';
        var params = {industry:$routeParams.industry};

        RequestDetail.getDetail(GetindustrydataList, params).then(function (result) {
            $scope.curatordata = result.data;
            $scope.spinnerActive = false;
        });


        $scope.profilecontentpopup = 'hidden';
        $scope.popupprofile = [];
        $scope.openprofilecentent = function (profile) {
            $scope.popupprofile = profile; 
            $scope.profilecontentpopup = '';
        }

        $scope.closeprofilecentent = function () {
            $scope.profilecontentpopup = 'hidden';
        }

        $scope.getcompaniesdata = function () {
            
            $scope.spinnerActive = true;

            var GetindustrydataList = 'apiv4/public/corporate/getcompaniesdata';
            var params = {industry:$routeParams.industry,filtered:$scope.filtered};

            RequestDetail.getDetail(GetindustrydataList, params).then(function (result) {
                $scope.companies = result.data;

                $scope.spinnerActive = false;
            });
        }

        $scope.getcompaniesdata();


        $scope.selecttickerfilter = function (ticker) {
            $scope.tickerfilter = ticker; 
            $scope.getupcomingevents();
        }
        

        $scope.getupcomingevents = function () {
            $scope.spinnerActive = true;

            var GetindustrydataList = 'apiv4/public/corporate/getupcomingevents';
            var params = {industry:$routeParams.industry,tickerfilter:$scope.tickerfilter,filtertext:$scope.filtertext,datefilter:$scope.filter};

            RequestDetail.getDetail(GetindustrydataList, params).then(function (result) {
                $scope.upcomingevents = result.data;
                //console.log($scope.upcomingevents);
                $scope.spinnerActive = false;
            });
        }

        $scope.getupcomingevents();

        $scope.clearindusdatasearch = function () {
            $scope.filtertext = '';
            $scope.getupcomingevents();
        }

        $scope.popup1 = {
            opened: false
        };
        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];


        $scope.dateOptions = {
            // dateDisabled: disabled,
            formatYear: 'yy',
            //maxDate: new Date().setDate(new Date().getDate() + 7),
            //minDate: new Date().toLocaleString("en-US", {timeZone: "America/New_York"}),
            //startingDay: 1
          };


        $scope.toggleMin = function () {
            //$scope.inlineOptions.minDate = new Date();
            var myDate = new Date();
            //add a day to the date
            myDate.setDate(myDate.getDate());
           // $scope.dateOptions.minDate = myDate;
        };
      
        $scope.toggleMin();
    
        $scope.popup1 = {
          opened: false
        };

        

        $scope.filter.realstart_date = '';
        $scope.filter.realend_date = '';
        $scope.selecteventdat = function (dat) {

            var monthNames = [
                "January", "February", "March",
                "April", "May", "June", "July",
                "August", "September", "October",
                "November", "December"
            ];
            
            var day = dat.getDate();
            var monthIndex = dat.getMonth();
            var year = dat.getFullYear();

            $scope.filter.realstart_date = day + ' ' + monthNames[monthIndex] + ' ' + year;
           
        }
        
        $scope.popup2 = {
            opened: false
        };
        $scope.open2 = function () {
            $scope.popup2.opened = true;
        };
        $scope.popup2 = {
            opened: false
          };
        $scope.selecteventdat1 = function (dat) {
            var monthNames = [
                "January", "February", "March",
                "April", "May", "June", "July",
                "August", "September", "October",
                "November", "December"
            ];
            
            /*if($scope.filter.startdate<$scope.filter.enddate){
               
            }else{
                $scope.filter.enddate = '';
            }*/
            
            

            //console.log(dat);

            var day = dat.getDate();
            var monthIndex = dat.getMonth();
            var year = dat.getFullYear();

            $scope.filter.realend_date = day + ' ' + monthNames[monthIndex] + ' ' + year;

            if($scope.filter.realstart_date!='' && $scope.filter.realend_date!=''){
                $scope.getupcomingevents();
            }
           
        }

        $scope.getsectorslinks = function () {
            $scope.spinnerActive = true;

            var GetindustrydataList = 'apiv4/public/corporate/getsectorslinks';
            var params = {industry:$routeParams.industry};

            RequestDetail.getDetail(GetindustrydataList, params).then(function (result) {
                $scope.sectors = result.data;
                $scope.spinnerActive = false;
            });
        }

        $scope.getsectorslinks();

    })
    .controller('industryCtrl', function ($scope, $http, $location, $routeParams, localStorageService, RequestDetail, configdetails, $sce, usertype,alertService,Useractivity) {
        $scope.configdetails = configdetails;

        $scope.spinnerActive = true;

         
        $scope.filter = {};
        $scope.filtered = [];

        $scope.companies = [];

        $scope.dealflowfilter = [];
        $scope.dealflowfiltered = {};

        $scope.upcomingevents = [];

        $scope.industry_title = $routeParams.industry;
        $scope.initialfilter = $routeParams.initialfilter;

        
     
        if($routeParams.rootpath){
            if($routeParams.rootpath.toLowerCase()=='new capital' || $routeParams.rootpath.toLowerCase()=='new-capital' || $routeParams.rootpath.toLowerCase()=='newcapital'){
                $scope.industry_title = 'SPACs';
                $scope.initialfilter = 'All';
            }
            else if($routeParams.rootpath.toLowerCase()=='consumer staples' || $routeParams.rootpath.toLowerCase()=='consumerstaples'){
                $scope.industry_title = 'Cannabis';
                $scope.initialfilter = 'All';
            }
            else if($routeParams.rootpath.toLowerCase()=='consumer discretionary' || $routeParams.rootpath.toLowerCase()=='consumerdiscretionary'){
                $scope.industry_title = 'Mobility';
                $scope.initialfilter = 'All';
            }
            else if($routeParams.rootpath.toLowerCase()=='financial'){
                $scope.industry_title = 'FinTech';
                $scope.initialfilter = 'All';
            }
            else if($routeParams.rootpath.toLowerCase()=='technology/communication' || $routeParams.rootpath.toLowerCase()=='technology' || $routeParams.rootpath.toLowerCase()=='communication'){
                $scope.industry_title = 'Disruptive Tech';
                $scope.initialfilter = 'All';
            }
            else if($routeParams.rootpath.toLowerCase()=='health care' || $routeParams.rootpath.toLowerCase()=='healthcare'){
                $scope.industry_title = 'Genomics';
                $scope.initialfilter = 'All';
            }
            else if($routeParams.rootpath.toLowerCase()=='industrials' || $routeParams.rootpath.toLowerCase()=='space-tech'){
                $scope.industry_title = 'SpaceTech';
                $scope.initialfilter = 'All';
            }
            else if($routeParams.rootpath.toLowerCase()=='materials'){
                $scope.industry_title = 'AgTech';
                $scope.initialfilter = 'All';
            }
            else if($routeParams.rootpath.toLowerCase()=='energy/utilities' || $routeParams.rootpath.toLowerCase()=='energy' || $routeParams.rootpath.toLowerCase()=='utilities'){
                $scope.industry_title = 'CleanTech';
                $scope.initialfilter = 'All';
            }
            else if($routeParams.rootpath.toLowerCase()=='real estate' || $routeParams.rootpath.toLowerCase()=='realestate'){
                $scope.industry_title = 'Metaverse';
                $scope.initialfilter = 'All';
            }
            else if($routeParams.rootpath.toLowerCase()=='esg' || $routeParams.rootpath.toLowerCase()=='environmentalsocialandgovernance'){
                $scope.industry_title = 'ESG';
                $scope.initialfilter = 'All';
            }
            else if($routeParams.rootpath.toLowerCase()=='quantitativescreens' || $routeParams.rootpath.toLowerCase()=='quantitative screens'){
                $scope.industry_title = 'AI Labs';
                $scope.initialfilter = 'All';
            }else{
                if(!$routeParams.industry){
                    $location.path('/login');
                }
                
            }
        }

        $scope.primer_popup = 'hidden';
		 
		$scope.openprimer_popup = function () {
			$scope.primer_popup = '';
		}

		$scope.closeprimer_popup = function () {
			$scope.primer_popup = 'hidden';
		}
        
        $scope.primer_status = 0;
        $scope.primer_popup_status = 0;
        $scope.primer_array = [];
        $scope.primer_file='';

        $scope.dash_url='';

        $scope.monthly_text='Latest Monthly';

        $scope.dashboarddatas = []; 

        if($scope.industry_title=='AgTech'){
            $scope.primer_popup_status = 1;

            
            $scope.primer_array = {
                0: { pdf: "AgTech_111722.pdf", name: "Agriculture – A $3.2 Trillion Industry Ready to be Disrupted"},
                1: { pdf: "Vertical Farming_Climbing Higher_060921.pdf", name: "Vertical Farming Climbing Higher"},
            };

            //["AgTech_111722.pdf", "Vertical Farming_Climbing Higher_060921.pdf"];
        }

        if($scope.industry_title=='Mobility'){
            $scope.primer_popup_status = 1;
             
            $scope.primer_array = {
                0: { pdf: "Mobility_EV and Beyond 11-20-2020.pdf", name: "Mobility – EV and Beyond"},
                1: { pdf: "Air Mobility_Ready for Take Off_030221.pdf", name: "Air Mobility – Ready for Take Off"},
                2: { pdf: "Autonomous Trucking Redefining Freight Transportation September 2021.pdf", name: "Autonomous Trucking Redefining Freight Transportation"},
            };

        }

        if($scope.industry_title=='Cannabis'){
            $scope.primer_status = 1;
            $scope.primer_file='Cannabis Industry Primer_083022.pdf';
            $scope.monthly_text='Latest Weekly';
        }

        if($scope.industry_title=='Disruptive Tech'){
            $scope.primer_status = 1;
            $scope.primer_file='Creator Economy_Riding the Monetization Wave_033022.pdf';
        }
        
        if($scope.industry_title=='FinTech'){
            $scope.primer_popup_status = 1;
             
            $scope.primer_array = {
                0: { pdf: "Fintech Industry Primer_040423.pdf", name: "Fintech Industry Primer"},
                1: { pdf: "Life Settlement Industry_Unlocking Technology-Driven Growth_092822.pdf", name: "Life Settlement Industry Unlocking Technology-Driven Growth"},
                 
            };

        }

        if($scope.industry_title=='SpaceTech'){
            $scope.primer_status = 1;
            $scope.primer_file='Space Tech_Primer.pdf';
 
            $scope.dashboarddatas = {
                0: { pdf: "https://app.powerbi.com/view?r=eyJrIjoiZDZmODE5ZWItNjFlYS00NDlmLTlmMmItN2UwODMxMjA4NThiIiwidCI6IjQzZDI5NzNlLTJiYTQtNDljNy1iYTM5LTllZDc4MmQwMWEwZiIsImMiOjN9", name: "Launches Dashboard"},
                1: { pdf: "https://app.powerbi.com/view?r=eyJrIjoiNDc5YjJhMjQtMTdlZC00MWMwLTkxMTktZjJjZmMyMWIwMjY3IiwidCI6IjQzZDI5NzNlLTJiYTQtNDljNy1iYTM5LTllZDc4MmQwMWEwZiIsImMiOjN9", name: "Government Contracts and Private Funding Dashboard"},
            };

        }

        if($scope.industry_title=='SPACs'){
            $scope.primer_status = 1;
            $scope.primer_file='SPACs_The Engines of Sustainable Economic Value Creation_050622.pdf';
        }

        if($scope.industry_title=='AI Labs'){
            $scope.primer_status = 1;
            $scope.primer_file='AILABS - PPT-19Jan2023_PW.pdf';
        }

        if($scope.industry_title=='CleanTech'){
            $scope.primer_status = 1;
            $scope.primer_file='EnergyTrends.pdf';
        }

        $scope.trustSrc = function (url) {
            return $sce.trustAsResourceUrl(url);
        }
        
        
        
 
       
        $scope.tickerfilter = '';
        $scope.sector_title = '';

        $scope.showeventblock = false;

        if($scope.initialfilter=='company_research' || $scope.initialfilter=='industry_research' || $scope.initialfilter=='events'  || $scope.initialfilter=='news'){
            $scope.filtered.push($scope.initialfilter);

            $scope.filter[$scope.initialfilter] = true;

            if($scope.initialfilter=='events'){
                $scope.showeventblock = true;
            }
        }else{
            $scope.showeventblock = true;
        }

        if($scope.filtered.length==1 && $scope.showeventblock){
            $scope.showeventblock = false;
        } 


        var GetindustrydataList = 'apiv4/public/corporate/getcomptable';
        var params = {industry:$scope.industry_title};

        RequestDetail.getDetail(GetindustrydataList, params).then(function (result) {
            $scope.comptabledatas = result.data;
            
        });
        

        
        var GetindustrydataList = 'apiv4/public/corporate/getcuratordata';
        var params = {industry:$scope.industry_title};

        RequestDetail.getDetail(GetindustrydataList, params).then(function (result) {
            $scope.curatordata = result.data;
            $scope.sector_title = result.data.sector;
            
        });

        $scope.filtertext = '';
        $scope.nextpage = 1;
        $scope.loadnextpage = 1;

        $scope.column = 'date';
        $scope.reverse = true;

        $scope.loadingindustrydata = '0';
         
        $scope.getindustrydata = function (page) {

            $scope.loadnextpage = 0;

            if(page>1){
              $scope.loadingindustrydata = '1';
            }
            
            var GetindustrydataList = 'apiv4/public/corporate/getindustrydata';
            var params = {industry:$scope.industry_title,filtered:$scope.filtered,tickerfilter:$scope.tickerfilter,filtertext:$scope.filtertext,page:page};

            RequestDetail.getDetail(GetindustrydataList, params).then(function (result) {

                if(page==1){ 
                    $scope.industrydatas = []; 
                    $scope.industrydata_total_count = result.data.page_count;
                  //  $scope.total_industrydata_count = result.data.total_list_count;
                }
                $scope.loadingindustrydata = '0';
                $scope.nextpage = result.data.page;

                if($scope.industrydata_total_count>=result.data.page){
                       // $scope.getindustrydata(result.data.page);
                }
          
                angular.forEach(result.data.industrydatas, function (industry) {
                    $scope.industrydatas.push(industry);
                });

                $scope.column = 'date';
                $scope.reverse = true;

                $scope.loadnextpage = 1;
                $scope.spinnerActive = false;
            });
        }

        $scope.loadmoreindustry = function () {
            $scope.$apply(function () {
                if($scope.industrydata_total_count>=$scope.nextpage){
                    if($scope.loadnextpage){
                        $scope.getindustrydata($scope.nextpage);
                    }
                }
            });
        }

        $scope.clearindusdatasearch = function () {
            $scope.filtertext = '';
            $scope.getindustrydata(1);
        }

        $scope.getindustrydata(1);

        $scope.trackdealflow = function (article) { 
            var trackingpage = 'Deal Flow';
            var id = article.dealflow_id;
            var trackingdetail = {page:trackingpage,id:id};
            Useractivity.getDetail(trackingdetail);
        }

       
        $scope.profilecontentpopup = 'hidden';
        $scope.popupprofile = [];
        $scope.openprofilecentent = function (profile) {
            $scope.popupprofile = profile; 
            $scope.profilecontentpopup = '';
        }

        $scope.closeprofilecentent = function () {
            $scope.profilecontentpopup = 'hidden';
        }
        


        $scope.showdealpopid = '';

        $scope.showdealflow = function (id) {
            $scope.showdealpopid = id;
        }

        $scope.showdealflowclose = function () {
            $scope.showdealpopid = '';
        }
        

        $scope.getcompaniesdata = function () {
            var GetindustrydataList = 'apiv4/public/corporate/getcompaniesdata';
            var params = {industry:$scope.industry_title,filtered:$scope.filtered};

            RequestDetail.getDetail(GetindustrydataList, params).then(function (result) {
                $scope.companies = result.data;    
                $scope.spinnerActive = false;            
            });
        }

        $scope.getcompaniesdata();


        $scope.selecttickerfilter = function (ticker) {
            $scope.tickerfilter = ticker;
            $scope.getindustrydata(1);
            $scope.getdealflowdata();
            //$scope.getupcomingevents();
        }
        

        $scope.getupcomingevents = function () {

            var GetindustrydataList = 'apiv4/public/corporate/getupcomingevents';
            var params = {industry:$scope.industry_title,tickerfilter:$scope.tickerfilter};

            RequestDetail.getDetail(GetindustrydataList, params).then(function (result) {
                $scope.upcomingevents = result.data; 
            });
        }

        $scope.getupcomingevents();


        //filter for researh tab
        $scope.filterlist = function () {
            
            $scope.filtered = [];
            $scope.showeventblock = false;
            
            angular.forEach($scope.filter, function (data,key) {
               if(data){
                  $scope.filtered.push(key);
                  if(key=='events'){
                    $scope.showeventblock = true;
                  }
               }
            });

            if($scope.filtered.length==1 && $scope.showeventblock){
                $scope.showeventblock = false;
            } 

            $scope.getindustrydata(1);
        }

        $scope.activetab = 1;
        $scope.industrytabchange = function (index) {
            $scope.activetab = index;
        }

        if($scope.initialfilter=='dealflow'){
            $scope.activetab = 4;
        }
        

        $scope.activedashtab = 0;
        $scope.industrydashtabchange = function (index) {
            $scope.activedashtab = index;
        }

       
        $scope.getdealflowdata = function () {  
            var GetindustrydataList = 'apiv4/public/corporate/getdealflowdata';
            var params = {industry:$scope.industry_title,dealflowfiltered:$scope.dealflowfiltered,tickerfilter:$scope.tickerfilter};

            RequestDetail.getDetail(GetindustrydataList, params).then(function (result) {
                $scope.dealflowdatas = result.data; 
            });
        }

        $scope.getpodcastdata = function () { 
            var GetindustrydataList = 'apiv4/public/corporate/getpodcastdata';
            var params = {industry:$scope.industry_title};

            RequestDetail.getDetail(GetindustrydataList, params).then(function (result) {
                $scope.podcastdatas = result.data; 
            });
        }

        $scope.getpodcastdata();
    
        
        $scope.dealflowfilter.raisesize = {};
        $scope.dealflowfilter.type = {};
        $scope.dealflowfilter.status = {};
        $scope.dealflowfilter.sector = {};

        $scope.dealflowfilter.raisesize['All']=true;
        $scope.dealflowfilter.type['All']=true;
        $scope.dealflowfilter.status['All']=true;
        $scope.dealflowfilter.sector['All']=true;


        $scope.dealflowfiltered.raisesize = {};
        $scope.dealflowfiltered.type = {};
        $scope.dealflowfiltered.status = {};
        $scope.dealflowfiltered.sector = {};

        //filter dealflow 
        $scope.filterdealflow = function () {
            $scope.dealflowfiltered.raisesize = [];
            $scope.dealflowfiltered.type = [];
            $scope.dealflowfiltered.status = [];
            $scope.dealflowfiltered.sector = [];

            angular.forEach($scope.dealflowfilter.raisesize, function (data,key) {
                if(data){
                    if(key!='All'){
                         $scope.dealflowfilter.raisesize['All']=false;
                    } 
                    $scope.dealflowfiltered.raisesize.push(key);
                }
             }); 

            angular.forEach($scope.dealflowfilter.type, function (data,key) {
                if(data){
                     if(key!='All'){
                         $scope.dealflowfilter.type['All']=false;
                     } 
                     $scope.dealflowfiltered.type.push(key);
                }
             }); 

            angular.forEach($scope.dealflowfilter.status, function (data,key) {
               if(data){
                    if(key!='All'){
                        $scope.dealflowfilter.status['All']=false;
                    } 
                    $scope.dealflowfiltered.status.push(key);
               }
            }); 
            angular.forEach($scope.dealflowfilter.sector, function (data,key) {
                if(data){
                     if(key!='All'){
                         $scope.dealflowfilter.sector['All']=false;
                     } 
                     $scope.dealflowfiltered.sector.push(key);
                }
             }); 

            $scope.getdealflowdata();
        }

        
        
        $scope.filterdealflowallchek = function () {
            angular.forEach($scope.dealflowfilter.raisesize, function (data,key) {
                if(data){
                    if(key=='All'){
                        $scope.dealflowfilter.raisesize={};   
                        $scope.dealflowfilter.raisesize['All']=true;
                    }
                }
            }); 

            angular.forEach($scope.dealflowfilter.type, function (data,key) {
                if(data){
                    if(key=='All'){
                        $scope.dealflowfilter.type={};     
                        $scope.dealflowfilter.type['All']=true;
                    }
                }
            }); 

            angular.forEach($scope.dealflowfilter.status, function (data,key) {
                if(data){
                    if(key=='All'){
                        $scope.dealflowfilter.status={};   
                        $scope.dealflowfilter.status['All']=true;
                    }
                }
            }); 

            angular.forEach($scope.dealflowfilter.sector, function (data,key) {
                if(data){
                    if(key=='All'){
                        $scope.dealflowfilter.sector={};   
                        $scope.dealflowfilter.sector['All']=true;
                    }
                }
            }); 

            $scope.filterdealflow();
        }
        
        $scope.filterdealflow();

        $scope.sectors = [];

        $scope.getsectorslinks = function () { 

            var GetindustrydataList = 'apiv4/public/corporate/getsectorslinks';
            var params = {industry:$scope.industry_title};

            RequestDetail.getDetail(GetindustrydataList, params).then(function (result) {
                $scope.sectors = result.data; 
            });
        }

        $scope.getsectorslinks();


        $scope.getsectorsfilter = function () { 

            var GetindustrydataList = 'apiv4/public/corporate/getsectorsfilter';
            var params = {};

            RequestDetail.getDetail(GetindustrydataList, params).then(function (result) {
                $scope.filtersectors = result.data;
                
            });
        }

        
        $scope.getsectorsfilter();
        

       /* var GetindustrydataList = 'apiv4/public/corporate/getindustrydata';
        var params = {industry:$routeParams.industry,filtered:$scope.filtered};

        RequestDetail.getDetail(GetindustrydataList, params).then(function (result) {
            $scope.industrydatas = result.data;
        });*/

       
        

       
    })
    
    .controller('topresearchprovidersCtrl', function ($scope, $http, $location, $routeParams, localStorageService, RequestDetail, configdetails, $sce, usertype,alertService,validation, $rootScope,$timeout,$window) {

        $scope.getirps = function () {
            $scope.spinnerActive = true;

            var GetindustrydataList = 'apiv4/public/corporate/getirps';
            var params = {};

            RequestDetail.getDetail(GetindustrydataList, params).then(function (result) {
                $scope.irps = result.data;
                //console.log($scope.irps);

                $scope.spinnerActive = false;
            });
        }

        $scope.getirps();

        $scope.goresearchspotlight = function (url_id) {
            $location.path('researchspotlight/'+url_id);
        }
        
    })
    .controller('researchspotlightCtrl', function ($scope, $http, $location, $routeParams, localStorageService, RequestDetail, configdetails, $sce, usertype,alertService,validation, $rootScope,$timeout,$window) {

        $scope.dailyideaslistid = $routeParams.researchId;

        $scope.getirpsarticles = function (term) {
            $scope.spinnerActive = true;

            var GetindustrydataList = 'apiv4/public/corporate/getirpsarticles';
            var params = {dailyideaslistid:$scope.dailyideaslistid,keyword:term};

            RequestDetail.getDetail(GetindustrydataList, params).then(function (result) {
                $scope.articles_result = result.data;
                //console.log($scope.articles);
                $scope.spinnerActive = false;
            });
        }

        $scope.getirpsarticles();

        $scope.searcharticles = function (search_term) {
            $scope.getirpsarticles(search_term);
        }
        
    })
    
    .controller('coverageresearchCtrl', function ($scope, $http, $location, $routeParams, localStorageService, RequestDetail, configdetails, $sce, usertype,alertService,validation, $rootScope,$timeout,$window,Useractivity) {

        

        var userdata = localStorageService.get('userdata');
        
        $scope.logged = false;

        if (userdata != null) {
          $scope.logged = true;

          $scope.profileName = userdata.firstname + ' ' + userdata.lastname;
           
    
          var update_url = "apiv4/public/user/getprofileimage";
          var params = {};
    
          RequestDetail.getDetail(update_url, params).then(function (result) {
            $scope.userimage = result.data.image;
            $scope.company_name = result.data.company_name;
            $scope.spinnerActive = false;
          });
        }

        $scope.activeaccordion = 1;
        $scope.activeaccordionchange = function (index) {
            if($scope.activeaccordion==index){
                $scope.activeaccordion = 0;
            }else{
                $scope.activeaccordion = index;
            }
        }

        $scope.articletype = $routeParams.articletype;

        $scope.researchid = $routeParams.researchid;

        
        var trackingdetail = {page:'Industry Research',id:$routeParams.researchid, article_type:$scope.articletype};
        Useractivity.getDetail(trackingdetail); 


        $scope.loginside = {};

        // On click redirection
		$scope.sidecheckLogins = function () {

     
            if (angular.isUndefined($scope.loginside.email) || $scope.loginside.email == '') {
				alertService.add("warning", "Username or Password Cannot be Empty !", 2000);
				return false;
			}
            if (angular.isUndefined($scope.loginside.password) || $scope.loginside.password == '') {
				alertService.add("warning", "Username or Password Cannot be Empty !", 2000);
				return false;
			}
			 
				$scope.errorMsg = '';
				var url = "apiv4/public/user/login";
				var params = $scope.loginside;
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

        
     
        var GetindustrydataList = 'apiv4/public/corporate/getresearchdetail';
        var params = {researchid:$routeParams.researchid,articletype:$scope.articletype};

        RequestDetail.getDetail(GetindustrydataList, params).then(function (result) {
            $scope.researchdetail = result.data;

            $scope.curatordata = [];
            $scope.curatordata.photo = result.data.photo;
            $scope.curatordata.firstname = result.data.currator_firstname;
            $scope.curatordata.lastname = result.data.currator_lastname;
            $scope.curatordata.title = result.data.currator_title;
            $scope.curatordata.company = result.data.currator_company;
            $scope.curatordata.content = result.data.currator_content;
            $scope.curatordata.currator_id_url = result.data.currator_id_url;

            $scope.spinnerActive = false;
        });

    })
    .controller('companyresearchCtrl', function ($scope, $http, $location, $routeParams, localStorageService, RequestDetail, configdetails, $sce, usertype,alertService,validation,$timeout,$rootScope,$window) {

        

        var userdata = localStorageService.get('userdata');

        $scope.logged = false;

        $scope.researchid = $routeParams.researchid; 
        

        if (userdata != null) {
          $scope.logged = true;

          $scope.profileName = userdata.firstname + ' ' + userdata.lastname;
           
    
          var update_url = "apiv4/public/user/getprofileimage";
          var params = {};
    
          RequestDetail.getDetail(update_url, params).then(function (result) {
            $scope.userimage = result.data.image;
            $scope.company_name = result.data.company_name;

            $scope.spinnerActive = false;
          });
        }

        $scope.loginside = {};

        
        $scope.activeaccordion = 1;
        $scope.activeaccordionchange = function (index) {
            if($scope.activeaccordion==index){
                $scope.activeaccordion = 0;
            }else{
                $scope.activeaccordion = index;
            }
        }

        // On click redirection
		$scope.sidecheckLogins = function () {

            if (angular.isUndefined($scope.loginside.email) || $scope.loginside.email == '') {
				alertService.add("warning", "Username or Password Cannot be Empty !", 2000);
				return false;
			}
            if (angular.isUndefined($scope.loginside.password) || $scope.loginside.password == '') {
				alertService.add("warning", "Username or Password Cannot be Empty !", 2000);
				return false;
			}

			 
				$scope.errorMsg = '';
				var url = "apiv4/public/user/login";
				var params = $scope.loginside;
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

        $scope.spinnerActive = true;

        var GetindustrydataList = 'apiv4/public/corporate/getcompanyresearchdetail';
        var params = {researchid:$routeParams.researchid};

        RequestDetail.getDetail(GetindustrydataList, params).then(function (result) {
 
            $scope.researchdetail = result.data;
            $scope.curatordata = [];
            $scope.curatordata.photo = result.data.photo;
            $scope.curatordata.firstname = result.data.currator_firstname;
            $scope.curatordata.lastname = result.data.currator_lastname;
            $scope.curatordata.title = result.data.currator_title;
            $scope.curatordata.company = result.data.currator_company;
            $scope.curatordata.content = result.data.currator_content;
            $scope.curatordata.currator_id_url = result.data.currator_id_url;
            

            $scope.spinnerActive = false;
        });

    })
    .controller('newsCtrl', function ($scope, $http, $location, $routeParams, localStorageService, RequestDetail, configdetails, $sce, usertype,alertService) {


        

        $scope.newsid = $routeParams.newsid;

        var GetindustrydataList = 'apiv4/public/corporate/getnewsdetail';
        var params = {newsid:$routeParams.newsid};

        RequestDetail.getDetail(GetindustrydataList, params).then(function (result) {
            $scope.newsdetail = result.data;
            $scope.curatordata = [];
            $scope.curatordata.photo = result.data.photo;
            $scope.curatordata.firstname = result.data.currator_firstname;
            $scope.curatordata.lastname = result.data.currator_lastname;
            $scope.curatordata.title = result.data.currator_title;
            $scope.curatordata.company = result.data.currator_company;
            $scope.curatordata.content = result.data.currator_content;
            $scope.curatordata.currator_id_url = result.data.currator_id_url;
            $scope.spinnerActive = false;
        });

    })
    .controller('podcastCtrl', function ($scope, $http, $location, $routeParams, localStorageService, RequestDetail, configdetails, $sce, usertype,alertService) {


       
        $scope.podcastid = $routeParams.podcastid;

        var GetindustrydataList = 'apiv4/public/corporate/getpodcastdetail';
        var params = {podcastid:$routeParams.podcastid};

        RequestDetail.getDetail(GetindustrydataList, params).then(function (result) {
            $scope.podcastdetail = result.data;

            

            $scope.curatordata = [];
            $scope.curatordata.photo = result.data.photo;
            $scope.curatordata.firstname = result.data.currator_firstname;
            $scope.curatordata.lastname = result.data.currator_lastname;
            $scope.curatordata.title = result.data.currator_title;
            $scope.curatordata.company = result.data.currator_company;
            $scope.curatordata.content = result.data.currator_content;
            $scope.curatordata.currator_id_url = result.data.currator_id_url;
            $scope.spinnerActive = false;
        });

        $scope.trustSrc = function () {
            return $sce.trustAsResourceUrl($scope.podcastdetail.youtube);
        }

        $scope.otherpodcasts = [];

        $scope.otherpodcasts = function () {
            $scope.spinnerActive = true;

            var GetindustrydataList = 'apiv4/public/corporate/otherpodcasts';
            var params = {podcastid:$routeParams.podcastid};

            RequestDetail.getDetail(GetindustrydataList, params).then(function (result) {
                $scope.otherpodcasts = result.data;
                $scope.spinnerActive = false;
            });
        }

        $scope.otherpodcasts();

    })
    .controller('eventviewCtrl', function ($scope, $http, $location, $routeParams, localStorageService, RequestDetail, configdetails, $sce, usertype,alertService,$timeout) {

       
        $scope.user_data = localStorageService.get('userdata');
        
 
        
        var GetindustrydataList = 'apiv4/public/corporate/geteventviewdetail';
        var params = {eventid:$routeParams.eventid};

        RequestDetail.getDetail(GetindustrydataList, params).then(function (result) {
            $scope.eventdetail = result.data;
            $scope.eventcontact.evetitle = result.data.title;
            $scope.curatordata = [];
            $scope.curatordata.photo = result.data.photo;
            $scope.curatordata.firstname = result.data.currator_firstname;
            $scope.curatordata.lastname = result.data.currator_lastname;
            $scope.curatordata.title = result.data.currator_title;
            $scope.curatordata.company = result.data.currator_company;
            $scope.curatordata.content = result.data.currator_content;
            $scope.curatordata.currator_id_url = result.data.currator_id_url;
        });

        $scope.eventcontact = {};
        $scope.eventcontact.eventid = $routeParams.eventid;
		$scope.eventsucessstate = false;
        
        if($scope.user_data ){
            $scope.eventcontact.firstname = $scope.user_data.firstname;
            $scope.eventcontact.lastname = $scope.user_data.lastname;
            $scope.eventcontact.email = $scope.user_data.email;
            $scope.eventcontact.firmname = $scope.user_data.company_name;
            $scope.eventcontact.contact = $scope.user_data.contact;

        }

        $scope.upcomingevents = [];

      
        $scope.getupcomingevents = function () {
            $scope.spinnerActive = true;

            var GetindustrydataList = 'apiv4/public/corporate/getupcomingevents_eventpage';
            var params = {eventid:$routeParams.eventid};

            RequestDetail.getDetail(GetindustrydataList, params).then(function (result) {
                $scope.upcomingevents = result.data;
                $scope.spinnerActive = false;
            });
        }

        $scope.getupcomingevents();

        $scope.checkemailval = function (email) {
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(String(email).toLowerCase());
		}

		$scope.eventregister = function () {
            if (angular.isUndefined($scope.eventcontact.firstname) || $scope.eventcontact.firstname == '') {
				alertService.add("warning", "Please enter firstname !", 2000);
				return false;
			}
            if (angular.isUndefined($scope.eventcontact.lastname) || $scope.eventcontact.lastname == '') {
				alertService.add("warning", "Please enter lastname !", 2000);
				return false;
			}
			if (angular.isUndefined($scope.eventcontact.email) || $scope.eventcontact.email == '') {
				alertService.add("warning", "Please enter email !", 2000);
				return false;
			}
			if (!$scope.checkemailval($scope.eventcontact.email)) {
				alertService.add("warning", "Please enter valid email!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.eventcontact.firmname) || $scope.eventcontact.firmname == '') {
				alertService.add("warning", "Please enter firmname!", 2000);
				return false;
			}

            $scope.spinnerActive = true;

			var url = "apiv4/public/corporate/eventregister";
			var params = {contact:$scope.eventcontact};
			RequestDetail.getDetail(url, params).then(function (result) { // Result return
				$scope.eventsucessstate = true;
				$scope.eventcontact = {};
                $scope.spinnerActive = false;
				$timeout(function () {
					$scope.eventsucessstate = false;
				}, 1000);
			});
		}

    })
    .controller('accessexpertiseCtrl', function ($scope, $http, $location, $routeParams, localStorageService, RequestDetail, configdetails, $sce, usertype,alertService,$timeout) {
        $scope.configdetails = configdetails;

        
        $scope.curratorId = $routeParams.curratorId;

        $scope.accessexpertisecontact = {};
		$scope.accessexpertisesucessstate = false;
        
        $scope.checkemailval = function (email) {
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(String(email).toLowerCase());
		}
 

		$scope.accessexpertiseregister = function () {
            if (!$scope.valid) {
                alertService.add("warning", "Please enter correct captcha!", 2000);
                return false;
            }
            if (angular.isUndefined($scope.accessexpertisecontact.first_name) || $scope.accessexpertisecontact.first_name == '') {
				alertService.add("warning", "Please enter first name !", 2000);
				return false;
			}
            if (angular.isUndefined($scope.accessexpertisecontact.last_name) || $scope.accessexpertisecontact.last_name == '') {
				alertService.add("warning", "Please enter last name !", 2000);
				return false;
			}
			if (angular.isUndefined($scope.accessexpertisecontact.email) || $scope.accessexpertisecontact.email == '') {
				alertService.add("warning", "Please enter email !", 2000);
				return false;
			}
			if (!$scope.checkemailval($scope.accessexpertisecontact.email)) {
				alertService.add("warning", "Please enter valid email!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.accessexpertisecontact.firm_name) || $scope.accessexpertisecontact.firm_name == '') {
				alertService.add("warning", "Please enter firm name!", 2000);
				return false;
			}

            
           
			var url = "apiv4/public/corporate/accessexpertiseregister";
			var params = {contact:$scope.accessexpertisecontact,curratorId:$scope.curratorId};
			RequestDetail.getDetail(url, params).then(function (result) { // Result return
				$scope.accessexpertisesucessstate = true;
				$scope.accessexpertisecontact = {};
                
                $scope.spinnerActive = false;
				
                $timeout(function () {
					//$scope.accessexpertisesucessstate = false;
				}, 1000);
			});
		}

        
        
    })
    .controller('becomecontributorCtrl', function ($scope, $http, $location, $routeParams, localStorageService, RequestDetail, configdetails, $sce, usertype,alertService,$timeout) {
        $scope.configdetails = configdetails;
         

        $scope.becomecontributorcontact = {};
		$scope.becomecontributorsucessstate = false;
        
        $scope.checkemailval = function (email) {
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(String(email).toLowerCase());
		}

        

		$scope.becomecontributorregister = function () {
            if (!$scope.valid) {
                alertService.add("warning", "Please enter correct captcha!", 2000);
                return false;
            }
            if (angular.isUndefined($scope.becomecontributorcontact.first_name) || $scope.becomecontributorcontact.first_name == '') {
				alertService.add("warning", "Please enter first name !", 2000);
				return false;
			}
            if (angular.isUndefined($scope.becomecontributorcontact.last_name) || $scope.becomecontributorcontact.last_name == '') {
				alertService.add("warning", "Please enter last name !", 2000);
				return false;
			}
			if (angular.isUndefined($scope.becomecontributorcontact.email) || $scope.becomecontributorcontact.email == '') {
				alertService.add("warning", "Please enter email !", 2000);
				return false;
			}
			if (!$scope.checkemailval($scope.becomecontributorcontact.email)) {
				alertService.add("warning", "Please enter valid email!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.becomecontributorcontact.firm_name) || $scope.becomecontributorcontact.firm_name == '') {
				alertService.add("warning", "Please enter firm name!", 2000);
				return false;
			}

            
			var url = "apiv4/public/corporate/becomecontributor";
			var params = {contact:$scope.becomecontributorcontact};
			RequestDetail.getDetail(url, params).then(function (result) { // Result return
				$scope.becomecontributorsucessstate = true;
				$scope.becomecontributorcontact = {};
                
                $scope.spinnerActive = false;
				
                $timeout(function () {
					$scope.becomecontributorsucessstate = false;
				}, 1000);
			});
		}

        
        
    })
    .controller('corporateCtrl', function ($scope, $http, $location, $routeParams, localStorageService, RequestDetail, configdetails, $sce, usertype,alertService) {
        $scope.configdetails = configdetails;
        $scope.spinnerActive = true;
        $scope.profileData = {};
        $scope.userDetailFull = {};
        $scope.act = {};

        $scope.profile_id = $routeParams.userId;

        $scope.getactivity = function () {
            $scope.spinnerActive = true;

            var GetInvestorsListUrl = 'apiv4/public/researchprovider/getactivitylog';
            var paramsA = {
                user_id: $routeParams.userId
            };

            RequestDetail.getDetail(GetInvestorsListUrl, paramsA).then(function (result) {
                $scope.spinnerActive = false;
                $scope.results_ActivityLogs = result.data;
            });
         }

        $scope.addactivity = function () {
            
            if($scope.act.viewed_email=="" || !angular.isDefined($scope.act.viewed_email)){
                alertService.add("warning", "Please Enter Email!", 2000);
                return false;
            }
            if($scope.act.viewed_company_name=="" || !angular.isDefined($scope.act.viewed_company_name)){
                alertService.add("warning", "Please Enter Company Name!", 2000);
                return false;
            }
            if($scope.act.activity=="" || !angular.isDefined($scope.act.activity)){
                alertService.add("warning", "Please Enter Activity!", 2000);
                return false;
            }
            if($scope.act.item_type=="" || !angular.isDefined($scope.act.item_type)){
                alertService.add("warning", "Please Enter Activity Type!", 2000);
                return false;
            }

            $scope.spinnerActive = true;

			var addactivityUrl = 'apiv4/public/researchprovider/addactivity';
			var params = {
				item_type: $scope.act.item_type,
				activity: $scope.act.activity,
                user_detail : $scope.act,
                profile_id: $scope.profile_id
			};
            

			RequestDetail.getDetail(addactivityUrl, params).then(function (result) {
				$scope.results = result.data;
				$scope.showModalActivity = !$scope.showModalActivity;
                $scope.getactivity();
                $scope.spinnerActive = false;
                alertService.add("success", "Activity Created successfully!", 2000);
			});
		}
        $scope.getactivity();
        $scope.user_data = localStorageService.get('userdata');

        $scope.user_type = $scope.user_data.user_type;

        
        $scope.openmodelActivity = function () {
			$scope.showModalActivity = !$scope.showModalActivity;
		}


        var contactids = localStorageService.get('contact_user');
        var contact_user_type = localStorageService.get('contact_user_type');

        var url = 'apiv4/public/dashboard/getInvestorDetails';
        var params = {
            user_id: $routeParams.userId
        };

        if (angular.isDefined(contact_user_type) && contact_user_type == 'mc') {
            params.type = contact_user_type;
        }
        if (angular.isDefined(contactids) && contactids != '') {
            params.contactIds = contactids;
        }
        RequestDetail.getDetail(url, params).then(function (result) {
            if (angular.isDefined(result.data)) {
                if (angular.isDefined(result.data.user_details)) {
                    $scope.userDetailFull = result.data.user_details;
                }
            }
            $scope.spinnerActive = false;
        });

    })
    .controller('corporateCtrl_old', function ($scope, $http, $location, $routeParams, localStorageService, RequestDetail, configdetails, $sce, usertype) {
        $scope.configdetails = configdetails;
        $scope.spinnerActive = true;
        $scope.pageHeading = 'Corporate Profile';
        $scope.dasboardActive = 'active';
        $scope.profileData = {};
        $scope.userDetailFull = {};
        $scope.industryTags = {};
        $scope.userContacts = {};
        $scope.userColleagues = {};
        $scope.eventlist = {};
        $scope.presentaion_file = {};
        $scope.profileData.searchcontact = '';
        $scope.presentation_filings = [];
        // On click redirection
        // Fetching Event lists

        $scope.profile_id = $routeParams.userId;

        var contactids = localStorageService.get('contact_user');
        var contact_user_type = localStorageService.get('contact_user_type');


        $scope.showModal = false;
        $scope.toggleModal = function (contact) {

            $scope.contactEdit = contact;
            $scope.showModal = !$scope.showModal;

        };

        $scope.activetab = 0;

        $scope.changeactive = function (index) {
            $scope.activetab = index;
        };

        var url = 'apiv4/public/dashboard/getInvestorDetails';
        var params = {
            user_id: $routeParams.userId
        };

        if (angular.isDefined(contact_user_type) && contact_user_type == 'mc') {
            params.type = contact_user_type;
        }
        if (angular.isDefined(contactids) && contactids != '') {
            params.contactIds = contactids;
        }
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.userContacts = [];
            if (angular.isDefined(result.data)) {
                if (angular.isDefined(result.data.user_details)) {
                    $scope.userDetailFull = result.data.user_details;
                }



                if ($scope.profileData.videourl != "" && $scope.profileData.videourl != null) {
                    $scope.showvideo = true;
                } else {
                    $scope.showvideo = false;
                }

                $scope.showvideopopupModal = false;
                //$scope.showvideopopupModal = true;
                $scope.togglevideopopupModal = function () {
                    //  ******************** To avoid the api calling second time in same page Store in the variable and fetched the data ising $index value
                    //$scope.values = $scope.FetchedData.items[index];
                    // Assign the values to the variables

                    $scope.showvideopopupModal = !$scope.showvideopopupModal;

                };


                $scope.trustSrc = function () {
                    return $sce.trustAsResourceUrl($scope.userDetailFull.videourl);
                }


                if (angular.isDefined(result.data.industry_tags)) {
                    $scope.industryTags = result.data.industry_tags;
                }
                if (angular.isDefined(result.data.user_contacts)) {
                    if (angular.isDefined(result.data.user_contacts) && result.data.user_contacts.length > 0) {
                        angular.forEach(result.data.user_contacts, function (con, ind) {
                            if (angular.isDefined(con) && angular.isDefined(con.firstname) && con.firstname != '' && con.firstname != 'null' && con.firstname != null) {
                                $scope.userContacts.push(con);
                            }
                        });
                    }
                }
                if (angular.isDefined($scope.userDetailFull.firstname) && $scope.userDetailFull.firstname != '') {
                    var obj = new Object();
                    obj.firstname = $scope.userDetailFull.firstname;
                    obj.lastname = '';
                    obj.title = '';

                    if (angular.isDefined($scope.userDetailFull.lastname) && $scope.userDetailFull.lastname != '') {
                        obj.lastname = $scope.userDetailFull.lastname;
                    }
                    if (angular.isDefined($scope.userDetailFull.title) && $scope.userDetailFull.title != '') {
                        obj.job_title = $scope.userDetailFull.title;
                    }
                    if (angular.isDefined($scope.userDetailFull.email) && $scope.userDetailFull.email != '') {
                        obj.Email = $scope.userDetailFull.email;
                    }
                    $scope.userContacts.push(obj);
                }


                if (angular.isDefined(result.data.presentation_research)) {
                    if (angular.isDefined(result.data.presentation_research) && angular.isDefined(result.data.presentation_research.user_documents_id) &&
                        angular.isDefined(result.data.presentation_research.file_location) && result.data.presentation_research.file_location != '') {
                        $scope.presentaion_file = result.data.presentation_research;
                    }
                }
                if (angular.isDefined(result.data) && angular.isDefined(result.data.research_detail) && result.data.research_detail.length > 0) {
                    angular.forEach(result.data.research_detail, function (data, ind) {
                        $scope.presentation_filings.push(data);
                    });
                }
                // if(angular.isDefined(result.data.user_colleagues)){ 
                //   $scope.userColleagues = result.data.user_colleagues;
                // }
            }
            $scope.spinnerActive = false;
        });







        // Fetching Messages
        var getMessages = 'apiv4/public/user/getMessages';
        var params = {
            key: 'userId',
            user_id: $routeParams.userId
        }
        RequestDetail.getDetail(getMessages, params).then(function (result) {
            $scope.profileData.profileMessages = result.data;
        });


        $scope.fairList = [];
        // Fetching FAIR
        var getFair = 'apiv4/public/fair/getCorporatefair';
        var params = {
            user_id: $routeParams.userId
        }
        RequestDetail.getDetail(getFair, params).then(function (result) {
            $scope.fairList = result.data;
        });

        $scope.askquestionstate = 1;

        if (usertype.getService() == 'corporate') {
            $scope.askquestionstate = 0;
        }


        $scope.newMeeting = function (user_id) {

            if (angular.isDefined(user_id) && user_id != '') {
                var url = 'apiv4/public/dashboard/encrypt_id';
                var params = {
                    user_id: user_id
                };
                RequestDetail.getDetail(url, params).then(function (result) {
                    $location.path('meeting/new/' + result.data);
                });
            } else {
                $location.path('meeting/new/');
            }
        }

        $scope.peer = function () {
            $location.path('peer');
        }

    }).controller('introactcompanyCtrl', function ($scope, $http, $location, $routeParams, localStorageService, RequestDetail, configdetails, $sce, usertype) {
        $scope.configdetails = configdetails;
        $scope.spinnerActive = true;
        $scope.pageHeading = 'Corporate Profile';
        $scope.profileData = {};
        $scope.user_details = {};
        $scope.industryTags = {};
        $scope.contacts = {};
        $scope.userColleagues = {};
        $scope.presentaion_file = {};
        $scope.research_file = {};
        $scope.fact_sheet_file = {};
        $scope.profileData.searchcontact = '';
        $scope.presentation_filings = [];
        // On click redirection
        // Fetching Event lists

        $scope.profile_id = $routeParams.userId;
        $scope.secret_key = $routeParams.secretKey;
		

        //$routeParams.userId=230;
        $scope.showModal = false;
        $scope.toggleModal = function (contact) {
            $scope.contactEdit = contact;
            $scope.showModal = !$scope.showModal;
        };

      

        //GET PROFILE DETAILS
        var params = {
            user_id: $scope.profile_id,
            user_type: 'mc'
        }
        var url = "apiv4/public/user/get_user_profile_by_id";
        RequestDetail.getDetail(url, params).then(function (result) {
           
            if (angular.isDefined(result.data)) {
                if (angular.isDefined(result.data.user_details)) {
                    $scope.profileData = result.data.user_details;
                    $scope.user_details = angular.copy(result.data.user_details);
                }
                if (angular.isDefined(result.data.industry_tags)) {
                    $scope.profileData.IndustryTags = result.data.industry_tags;
                    $scope.profileData.IndustryTagsLength = $scope.profileData.IndustryTags.length;
                }
                if (angular.isDefined(result.data.corporate_list)) {
                    $scope.profileData.CorporateList = result.data.corporate_list;
                    $scope.profileData.CorporateListLength = $scope.profileData.CorporateList.length;
                }
                if (angular.isDefined(result.data.presentation_research)) {
                    if (angular.isDefined(result.data.presentation_research) && angular.isDefined(result.data.presentation_research.user_documents_id) &&
                        angular.isDefined(result.data.presentation_research.file_location) && result.data.presentation_research.file_location != '') {
                        $scope.presentaion_file = result.data.presentation_research;
                    }
                }
                if (angular.isDefined(result.data.research_file)) {
                    if (angular.isDefined(result.data.research_file) && angular.isDefined(result.data.research_file.research_id) &&
                        angular.isDefined(result.data.research_file.file_location) && result.data.research_file.file_location != '') {
                        $scope.research_file = result.data.research_file;
                    }
                }
				if (angular.isDefined(result.data.fact_sheet_file)) {
					if (angular.isDefined(result.data.fact_sheet_file) && angular.isDefined(result.data.fact_sheet_file.fact_sheet_id)
						&& angular.isDefined(result.data.fact_sheet_file.file_location) && result.data.fact_sheet_file.file_location != '') {
						$scope.fact_sheet_file = result.data.fact_sheet_file;
					}
				}
                if (angular.isDefined(result.data.user_contacts)) {
                    $scope.profileData.contacts = result.data.user_contacts;
                }
                if (angular.isDefined(result.data.user_colleagues)) {
                    $scope.profileData.userColleagues = result.data.user_colleagues;
                }

                $scope.profileData.presentation_filings = [];
                if (angular.isDefined(result.data) && angular.isDefined(result.data.research_detail) && result.data.research_detail.length > 0) {
                    angular.forEach(result.data.research_detail, function (data, ind) {
                        $scope.profileData.presentation_filings.push(data);
                    });
                }

                $scope.profileData.videourl = undefined;
                $scope.profileData.videourl = $scope.user_details.youtubeurl;

                $scope.profileData.rp_c_description = $scope.user_details.rp_c_description;

                if ($scope.profileData.videourl != "" && $scope.profileData.videourl != null) {
                    $scope.showvideo = true;
                } else {
                    $scope.showvideo = false;
                }

                $scope.trustSrc = function () {
                    return $sce.trustAsResourceUrl($scope.profileData.videourl);
                }
            } else {
                $location.path('login');
            }

            $scope.spinnerActive = false;

			if($scope.secret_key != 'video'){
				$scope.addsearchprofileactivity('Profile Viewed');
			}
        });

        // Fetching Model
        var profile_model = 'apiv4/public/user/getcorporate_model';
        var params = {
            user_id: $scope.profile_id
        }
        RequestDetail.getDetail(profile_model, params).then(function (result) {

            if (angular.isDefined(result.data.file_location) && result.data.file_location != '' &&
                angular.isDefined(result.data.file_name) && result.data.file_name != '') {
                $scope.modelpresentaion_file = result.data;

            }

        });

        // Fetching FAIR
        $scope.fairList = [];
        var getFair = 'apiv4/public/fair/getCorporatefair';
        var params = {
            user_id: $scope.profile_id
        }
        RequestDetail.getDetail(getFair, params).then(function (result) {
            $scope.fairList = result.data;
        });

        $scope.showvideopopupModal = false;
        //$scope.showvideopopupModal = true;
        $scope.togglevideopopupModal = function () {
            //  ******************** To avoid the api calling second time in same page Store in the variable and fetched the data ising $index value
            //$scope.values = $scope.FetchedData.items[index];
            // Assign the values to the variables

            $scope.showvideopopupModal = !$scope.showvideopopupModal;
			if($scope.secret_key != 'video'){
				$scope.addsearchprofileactivity('Video Viewed');
			}
        };

        if($scope.secret_key == 'video'){
			$scope.showvideopopupModal = true;
		}else{
			$scope.addsearchprofileactivity = function (type) {
				var addactivity = 'apiv4/public/user/addsearchprofileactivity';
				var params = {
					profile_id: $scope.profile_id,
					type: type,
					secret_key: $scope.secret_key,
				}
				RequestDetail.getDetail(addactivity, params).then(function (result) {
					
				});
			}
        }

        $scope.closeModalScorecardvideo = function () {
            $scope.showvideopopupModal = false;
        }
        


}).controller('introactcorporateCtrl', function ($scope, $http, $location, $routeParams, localStorageService, RequestDetail, configdetails, $sce, usertype) {
    $scope.configdetails = configdetails;
    $scope.spinnerActive = true;
    $scope.pageHeading = 'Corporate Profile';
    $scope.profileData = {};
    $scope.user_details = {};
    $scope.industryTags = {};
    $scope.contacts = {};
    $scope.userColleagues = {};
    $scope.presentaion_file = {};
    $scope.research_file = {};
    $scope.fact_sheet_file = {};
    $scope.profileData.searchcontact = '';
    $scope.presentation_filings = [];
    // On click redirection
    // Fetching Event lists

    $scope.ticker = $routeParams.ticker;
    $scope.secret_key = $routeParams.secretKey;
    

    //$routeParams.userId=230;
    $scope.showModal = false;
    $scope.toggleModal = function (contact) {
        $scope.contactEdit = contact;
        $scope.showModal = !$scope.showModal;
    };


    $scope.tab = 1;
        
    $scope.tabchange = function (act) {
        $scope.tab = act;
    }

    $scope.profiletabde = 1;
    $scope.profiletabdes = function (act) {
        $scope.profiletabde = act;
    }

    $scope.filings = [];
    var url = 'apiv4/public/dashboard/getprofilefilings';
    var params = {ticker: $scope.ticker}
    RequestDetail.getDetail(url, params).then(function (result) {
       $scope.filings = result.data;
    });

    $scope.tradingdata = [];
    var url = 'apiv4/public/dashboard/gettradingdata';
    var params = {ticker: $scope.ticker}
    RequestDetail.getDetail(url, params).then(function (result) {
        $scope.tradingdata = result.data;
    });


    $scope.tab_news = 1;
        
    $scope.tabnewschange = function (act) {
        $scope.tab_news = act;
    }

    $scope.tab_news = 1;
        
    $scope.tabnewschange = function (act) {
        $scope.tab_news = act;
    }

    $scope.newss = [];
    var url = 'apiv4/public/dashboard/getprofilenewss';
    var params = {ticker: $scope.ticker}
    RequestDetail.getDetail(url, params).then(function (result) {
        $scope.newss = result.data;
    });

    $scope.fairList = [];
    $scope.researchs = [];

    //GET PROFILE DETAILS
    var params = {
        ticker: $scope.ticker
    }
    var url = "apiv4/public/user/get_profile_ticker";
    RequestDetail.getDetail(url, params).then(function (result) {
       

        if (angular.isDefined(result.data)) {
            if (angular.isDefined(result.data.user_details)) {
                $scope.profileData = result.data.user_details;
                $scope.user_details = angular.copy(result.data.user_details);
            }
            if (angular.isDefined(result.data.industry_tags)) {
                $scope.profileData.IndustryTags = result.data.industry_tags;
                $scope.profileData.IndustryTagsLength = $scope.profileData.IndustryTags.length;
            }
            if (angular.isDefined(result.data.corporate_list)) {
                $scope.profileData.CorporateList = result.data.corporate_list;
                $scope.profileData.CorporateListLength = $scope.profileData.CorporateList.length;
            }
            if (angular.isDefined(result.data.presentation_research)) {
                if (angular.isDefined(result.data.presentation_research)) {
                    $scope.presentaion_file = result.data.presentation_research;
                }
            }
            if (angular.isDefined(result.data.research_file)) {
                if (angular.isDefined(result.data.research_file) && angular.isDefined(result.data.research_file.research_id) &&
                    angular.isDefined(result.data.research_file.file_location) && result.data.research_file.file_location != '') {
                    $scope.research_file = result.data.research_file;
                }
            }
            if (angular.isDefined(result.data.fact_sheet_file)) {
                if (angular.isDefined(result.data.fact_sheet_file)) {
                    $scope.fact_sheet_file = result.data.fact_sheet_file;
                }
            }
            if (angular.isDefined(result.data.user_contacts)) {
                $scope.profileData.contacts = result.data.user_contacts;
            }
            if (angular.isDefined(result.data.user_colleagues)) {
                $scope.profileData.userColleagues = result.data.user_colleagues;
            }

            $scope.profileData.presentation_filings = [];
            if (angular.isDefined(result.data) && angular.isDefined(result.data.research_detail) && result.data.research_detail.length > 0) {
                angular.forEach(result.data.research_detail, function (data, ind) {
                    $scope.profileData.presentation_filings.push(data);
                });
            }

            $scope.profileData.videourl = undefined;
            $scope.profileData.videourl = $scope.user_details.youtubeurl;

            $scope.profileData.rp_c_description = $scope.user_details.rp_c_description;

            if ($scope.profileData.videourl != "" && $scope.profileData.videourl != null) {
                $scope.showvideo = true;
				$scope.youtubevidstatus = false;

                if($scope.profileData.videourl.indexOf("youtube.com")>0){
                    $scope.youtubevidstatus = true;
                }								
            } else {
                $scope.showvideo = false;
            }

            $scope.trustSrc = function () {
                return $sce.trustAsResourceUrl($scope.profileData.videourl);
            }

            // Fetching FAIR
            
            var getFair = 'apiv4/public/fair/getCorporatefair';
            var params = {
                user_id: result.data.user_details.user_id
            }
            RequestDetail.getDetail(getFair, params).then(function (result) {
                $scope.fairList = result.data;
            });

            var url = 'apiv4/public/dashboard/getprofileresearch';
            var params = {user_id: result.data.user_details.user_id}
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.researchs = result.data;
            });

        } else {
            $location.path('login');
        }

        

        $scope.spinnerActive = false;

        if($scope.secret_key != 'video'){
            $scope.addsearchprofileactivity('Profile Viewed');
        }
    });

    $scope.trustAsHtml = function(html) {
        return $sce.trustAsHtml(html);
    }
 
    

    // Fetching Model
    var profile_model = 'apiv4/public/user/getcorporate_model';
    var params = {
        user_id: $scope.profile_id
    }
    RequestDetail.getDetail(profile_model, params).then(function (result) {

        if (angular.isDefined(result.data.file_location) && result.data.file_location != '' &&
            angular.isDefined(result.data.file_name) && result.data.file_name != '') {
            $scope.modelpresentaion_file = result.data;

        }

    });

    

    $scope.showvideopopupModal = false;
    //$scope.showvideopopupModal = true;
    $scope.togglevideopopupModal = function () {
        //  ******************** To avoid the api calling second time in same page Store in the variable and fetched the data ising $index value
        //$scope.values = $scope.FetchedData.items[index];
        // Assign the values to the variables

        $scope.showvideopopupModal = !$scope.showvideopopupModal;
        if($scope.secret_key != 'video'){
            $scope.addsearchprofileactivity('Video Viewed');
        }
    };

    if($scope.secret_key == 'video'){
        $scope.showvideopopupModal = true;
    }else{
        $scope.addsearchprofileactivity = function (type) {
            var addactivity = 'apiv4/public/user/addsearchprofileactivity';
            var params = {
                profile_id: $scope.profile_id,
                type: type,
                secret_key: $scope.secret_key,
            }
            RequestDetail.getDetail(addactivity, params).then(function (result) {
                
            });
        }
    }

    $scope.closeModalScorecardvideo = function () {
        $scope.showvideopopupModal = false;
    }
    


})
.controller('corporatecompanyCtrl', function ($scope, $http, $location, $routeParams, localStorageService, RequestDetail, configdetails, $sce, usertype) {
        $scope.configdetails = configdetails;
        $scope.spinnerActive = true;
        $scope.pageHeading = 'Corporate Profile';
        $scope.profileData = {};
        $scope.user_details = {};
        $scope.industryTags = {};
        $scope.contacts = {};
        $scope.userColleagues = {};
        $scope.presentaion_file = {};
        $scope.research_file = {};
        $scope.fact_sheet_file = {};
        $scope.profileData.searchcontact = '';
        $scope.presentation_filings = [];
        // On click redirection
        // Fetching Event lists

        $scope.profile_id = $routeParams.userId;
        $scope.secret_key = $routeParams.secretKey;

        if($scope.profile_id==650){
            window.location = "https://www.intro-act.com/#/introactcorporate/NMRD";
        }

        //$routeParams.userId=230;
        $scope.showModal = false;
        $scope.toggleModal = function (contact) {
            $scope.contactEdit = contact;
            $scope.showModal = !$scope.showModal;
        };

        

        //GET PROFILE DETAILS
        var params = {
            user_id: $scope.profile_id,
            user_type: localStorageService.get('contact_user_type'),
        }
        var url = "apiv4/public/user/get_user_profile_by_id";
        RequestDetail.getDetail(url, params).then(function (result) {
           
            if (angular.isDefined(result.data)) {
                if (angular.isDefined(result.data.user_details)) {
                    $scope.profileData = result.data.user_details;
                    $scope.user_details = angular.copy(result.data.user_details);
                }
                if (angular.isDefined(result.data.industry_tags)) {
                    $scope.profileData.IndustryTags = result.data.industry_tags;
                    $scope.profileData.IndustryTagsLength = $scope.profileData.IndustryTags.length;
                }
                if (angular.isDefined(result.data.corporate_list)) {
                    $scope.profileData.CorporateList = result.data.corporate_list;
                    $scope.profileData.CorporateListLength = $scope.profileData.CorporateList.length;
                }
                if (angular.isDefined(result.data.presentation_research)) {
                    if (angular.isDefined(result.data.presentation_research) && angular.isDefined(result.data.presentation_research.user_documents_id) &&
                        angular.isDefined(result.data.presentation_research.file_location) && result.data.presentation_research.file_location != '') {
                        $scope.presentaion_file = result.data.presentation_research;
                    }
                }
                if (angular.isDefined(result.data.presentationfiles)) {
                    $scope.presentationfiles = result.data.presentationfiles;
                }
                
                if (angular.isDefined(result.data.research_file)) {
                    if (angular.isDefined(result.data.research_file) && angular.isDefined(result.data.research_file.research_id) &&
                        angular.isDefined(result.data.research_file.file_location) && result.data.research_file.file_location != '') {
                        $scope.research_file = result.data.research_file;
                    }
                }
				if (angular.isDefined(result.data.fact_sheet_file)) {
					if (angular.isDefined(result.data.fact_sheet_file) && angular.isDefined(result.data.fact_sheet_file.fact_sheet_id)
						&& angular.isDefined(result.data.fact_sheet_file.file_location) && result.data.fact_sheet_file.file_location != '') {
						$scope.fact_sheet_file = result.data.fact_sheet_file;
					}
				}
                if (angular.isDefined(result.data.user_contacts)) {
                    $scope.profileData.contacts = result.data.user_contacts;
                }
                if (angular.isDefined(result.data.user_colleagues)) {
                    $scope.profileData.userColleagues = result.data.user_colleagues;
                }

                $scope.profileData.presentation_filings = [];
                if (angular.isDefined(result.data) && angular.isDefined(result.data.research_detail) && result.data.research_detail.length > 0) {
                    angular.forEach(result.data.research_detail, function (data, ind) {
                        $scope.profileData.presentation_filings.push(data);
                    });
                }

                $scope.profileData.videourl = undefined;
                $scope.profileData.videourl = $scope.user_details.youtubeurl;

                $scope.profileData.rp_c_description = $scope.user_details.rp_c_description;

                if ($scope.profileData.videourl != "" && $scope.profileData.videourl != null) {
                    $scope.showvideo = true;
                } else {
                    $scope.showvideo = false;
                }

                $scope.trustSrc = function () {
                    return $sce.trustAsResourceUrl($scope.profileData.videourl);
                }
            } else {
                $location.path('login');
            }

            $scope.spinnerActive = false;

			if($scope.secret_key != 'video'){
				$scope.addsearchprofileactivity('Profile Viewed');
			}
        });

        // Fetching Model
        var profile_model = 'apiv4/public/user/getcorporate_model';
        var params = {
            user_id: $scope.profile_id
        }
        RequestDetail.getDetail(profile_model, params).then(function (result) {

            if (angular.isDefined(result.data.file_location) && result.data.file_location != '' &&
                angular.isDefined(result.data.file_name) && result.data.file_name != '') {
                $scope.modelpresentaion_file = result.data;

            }

        });

        $scope.profiletabde = 1;
        $scope.profiletabdes = function (act) {
            $scope.profiletabde = act;
        }


        // Fetching FAIR
        $scope.fairList = [];
        var getFair = 'apiv4/public/fair/getCorporatefair';
        var params = {
            user_id: $scope.profile_id
        }
        RequestDetail.getDetail(getFair, params).then(function (result) {
            $scope.fairList = result.data;
        });

        $scope.showvideopopupModal = false;
        //$scope.showvideopopupModal = true;
        $scope.togglevideopopupModal = function () {
            //  ******************** To avoid the api calling second time in same page Store in the variable and fetched the data ising $index value
            //$scope.values = $scope.FetchedData.items[index];
            // Assign the values to the variables

            $scope.showvideopopupModal = !$scope.showvideopopupModal;
			if($scope.secret_key != 'video'){
				$scope.addsearchprofileactivity('Video Viewed');
			}
        };

        if($scope.secret_key == 'video'){
			$scope.showvideopopupModal = true;
		}else{
			$scope.addsearchprofileactivity = function (type) {
				var addactivity = 'apiv4/public/user/addsearchprofileactivity';
				var params = {
					profile_id: $scope.profile_id,
					type: type,
					secret_key: $scope.secret_key,
				}
				RequestDetail.getDetail(addactivity, params).then(function (result) {
					
				});
			}
        }

        $scope.closeModalScorecardvideo = function () {
            $scope.showvideopopupModal = false;
        }
        


})
.controller('researchprovidercompanyCtrl', function ($scope, $http, $location, $routeParams, localStorageService, RequestDetail, configdetails, $sce, usertype) {
    $scope.configdetails = configdetails;
    $scope.spinnerActive = true;
    $scope.pageHeading = 'Corporate Profile';
    
    $scope.profile = {};
    $scope.profileData = {};
    $scope.profileData.IndustryTags = {};
    $scope.profileData.IndustryTagsLength = 0;
    $scope.profileMessages = {};
    $scope.postmsg = {};
    $scope.searchcontact = '';



    $scope.company_id = $routeParams.companyId;
    $scope.secret_key = $routeParams.secretKey;

    $scope.showvideopopupModal = false;
    $scope.togglevideopopupModal = function () {
        //  ******************** To avoid the api calling second time in same page Store in the variable and fetched the data ising $index value
       
        // Assign the values to the variables

        $scope.showvideopopupModal = !$scope.showvideopopupModal;

    };

	$scope.closeModalScorecardvideo = function () {
        //  ******************** To avoid the api calling second time in same page Store in the variable and fetched the data ising $index value
       
        // Assign the values to the variables

        $scope.showvideopopupModal = false;

    };
									   
    $scope.showModalpageinfo = false;

    $scope.openmodelpagehelp = function () {
        $scope.showModalpageinfo = !$scope.showModalpageinfo;
    }

    $scope.pageHeading = 'Broker Profile';
    $scope.cmyprofileActive = 'inner-active';

    $scope.user_details = {};
    $scope.presentaion_file = {};
    $scope.research_file = {};
    $scope.fact_sheet_file = {};
    $scope.showvideo = false;

    // Fetching Model
    var profile_model = 'apiv4/public/user/getresearchprofile';
    var params = {
        company_id: $scope.company_id
    }
    RequestDetail.getDetail(profile_model, params).then(function (result) {
        $scope.profileData = result.data;
        $scope.profileData.c_description = result.data.description;
        $scope.profileData.c_address_1 = result.data.address;
        $scope.profileData.c_address_2 = result.data.address2;

        $scope.profileData.c_location = result.data.location;

		$scope.profileData.videourl = $scope.profileData.utube;

        if ($scope.profileData.videourl != "" && $scope.profileData.videourl != null) {
            $scope.showvideo = true;
            $scope.youtubevidstatus = false;

            if($scope.profileData.videourl.indexOf("youtube.com")>0){
                $scope.youtubevidstatus = true;
            }
        } else {
            $scope.showvideo = false;
        }
        $scope.trustSrc = function () {
            return $sce.trustAsResourceUrl($scope.profileData.videourl);
        }													   
        $scope.spinnerActive = false;
    });

    var url = "apiv4/public/user/listtocoveragelistmarketfile";
    var params = {company_id: $scope.company_id};
    RequestDetail.getDetail(url, params).then(function (result) {
        $scope.old_marketingFile = result.data;
    });

    var url = "apiv4/public/user/get_user_providerprofile";
    var params = {company_id: $scope.company_id};
    RequestDetail.getDetail(url, params).then(function (result) {
        ////console.log(result.data);
        $scope.rpprofile = result.data;
        $scope.old_samples = result.data.old_samples;
    });

    $scope.coveragelist = [];
    var url = "apiv4/public/user/listtocoveragelist";
    var params = {company_id: $scope.company_id};
    RequestDetail.getDetail(url, params).then(function (result) {
        $scope.coveragelist = result.data;
    });

    // Show Analysts Detail Added By Jayapriya on 23-01-2019
    $scope.showModalAnalyst = false;
    $scope.toggleModalAnalyst = function (index) {
        $scope.coverage = [];
        $scope.coverage = $scope.coveragelist[index];

        
        // Assign the values to the variables
        $scope.update = true;
        $scope.insert = false;
        $scope.showModalAnalyst = !$scope.showModalAnalyst;
        $('#imgsrcdefault').show();
        $('#theDiv').html('');
    };

    $scope.closeModalAnalyst = function () {
        $scope.showModalAnalyst = false;
    }

})

.controller('newsletterComponents', function ($scope, $http, $location, $routeParams, localStorageService, RequestDetail, configdetails, $sce, usertype,alertService) {
    $scope.configdetails = configdetails;

    $scope.analysts = [];
    $scope.addanalyst = {};
   
    $scope.pageHeading = 'Newsletter Component';
    $scope.dasboardActive = 'active';
    $scope.dashboardTitle = 'Newsletter Component	';

    $scope.addanalysts = function () {
        $scope.showModalAnalyst = true;
    }
    $scope.closeModalAnalyst = function () {
        $scope.showModalAnalyst = false;
    }

    $scope.user_id = '';
    $scope.content_type = 'blog';

    if($routeParams.userId){
        $scope.user_id = $routeParams.userId;
    }

    if($routeParams.contentType){
        $scope.content_type = $routeParams.contentType;
    }

    $scope.company_detail = [];

	// Fetching Profile
	var getCorporate = 'apiv4/public/fair/getCorporateprofile';
	var params = { user_id: $routeParams.userId,static:1 }
	RequestDetail.getDetail(getCorporate, params).then(function (result) {
		$scope.company_detail = result.data;
	});

    $scope.editinvestor_message_status = 0;
    
    $scope.getNewsletterComponents = function () {
        var url = 'apiv4/public/dashboard/getNewsletterComponents';
        var params = { user_id:$scope.user_id };
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.introact_commentary = result.data.commentary;
            $scope.investor_message = result.data.investor_message;
            $scope.investor_message_view = result.data.investor_message;
            
            $scope.investor_relations_message.file_path = result.data.investor_message_file;
            $scope.investor_relations_message.file_name = result.data.investor_message_file;
            
            $scope.intro_act_commentary.file_path = result.data.intro_act_commentary_file;
            $scope.intro_act_commentary.file_name = result.data.intro_act_commentary_file;

            $scope.result_investor_messages = result.data.result_investor_messages;
        });
    }
    

    $scope.getNewsletterComponents();

    
    $scope.View_investor_messages = function (investor_message) {
        $scope.investor_message_view = investor_message;
        $scope.showModalRelationsMessage = true;
    }

    $scope.closemodelRelationsMessage = function (investor_message) {
        $scope.showModalRelationsMessage = false;
    }


    $scope.getAnalyst = function () {
        var url = 'apiv4/public/dashboard/getAnalyst';
        var params = { user_id:$scope.user_id };
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.analysts = result.data;
        });
    }
    $scope.getAnalyst();

    $scope.saveAnalyst = function () {
        var url = 'apiv4/public/dashboard/saveAnalyst';
        var params = {
            data: $scope.addanalyst
        };
        RequestDetail.getDetail(url, params).then(function (result) {
            alertService.add("success", "Analyst added successfully!", 2000);
            $scope.addanalyst = {};
            $scope.getAnalyst();
        });
    }

    $scope.deleteAnalysts = function (id) {
        if (confirm("Are you sure?")) {
            var url = 'apiv4/public/dashboard/deleteAnalysts';
            var params = {
                analyst_id: id
            };
            RequestDetail.getDetail(url, params).then(function (result) {
                alertService.add("success", "Delected successfully!", 2000);
                $scope.getAnalyst();
            });
        }
    }

    $scope.content = {};

    $scope.addContent = function () {
        $scope.showModalContent = true;
    }
    $scope.closeModalContent = function () {
        $scope.showModalContent = false;
    }

    $scope.addinvestor_message = function () {
        $scope.investor_messagecontent.message = '';
        $scope.showinvestor_message = true;
    }

    $scope.closeModalinvestor_message = function () {
        $scope.showinvestor_message = false;
    }
    
    $scope.editinvestor_message = function () {
        $scope.investor_messagecontent.message = $scope.investor_message;
        $scope.editinvestor_message_status = 1;
        $scope.showinvestor_message = true;
    }

    
    $scope.import_investor_excel = function (data) {
        $scope.$apply(function () {
           $scope.content.file_path = data;
        });
    }

    $scope.removecontentFile = function () {
        $scope.content.file_path = '';
    }
    

    $scope.getContent = function () {
        var url = 'apiv4/public/dashboard/getContent';
        var params = { user_id:$scope.user_id };
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.contents = result.data;
        });
    }
    $scope.getContent();

    $scope.saveContent = function () {
        var url = 'apiv4/public/dashboard/saveContent';
        var params = {
            data: $scope.content
        };
        RequestDetail.getDetail(url, params).then(function (result) {
            alertService.add("success", "Content added successfully!", 2000);
            $scope.content = {};
            $scope.getContent();
            $scope.showModalContent = false;
        });
    }
    $scope.deleteContent = function (id) {
        if (confirm("Are you sure?")) {
            var url = 'apiv4/public/dashboard/deleteContent';
            var params = {
                content_id: id
            };
            RequestDetail.getDetail(url, params).then(function (result) {
                alertService.add("success", "Deleted Successfully!", 2000);
                $scope.content = {};
                $scope.getContent();
            });
        }
    }

    

    $scope.investor_relations_message = {};

    $scope.import_investor_relations_excel = function (data) {
        $scope.$apply(function () {
           $scope.investor_relations_message.file_path = data;
           $scope.investor_relations_message.file_name = data;
        });
    }
    $scope.removeInvestor_relationsFile = function () {
        $scope.investor_relations_message = {};
    }


    $scope.intro_act_commentary = {};
    $scope.import_intro_act_commentary_excel = function (data) {
        $scope.$apply(function () {
           $scope.intro_act_commentary.file_path = data;
           $scope.intro_act_commentary.file_name = data;
        });
    }
    
    $scope.removeintro_act_commentaryFile = function () {
        $scope.intro_act_commentary = {};
    }
    
    $scope.newfilings = {};
    $scope.addFilings = function () {
        $scope.showModalFilings = true;
    }
    $scope.closeModalFilings = function () {
        $scope.showModalFilings = false;
    }
    
    
    $scope.import_Filings_excel = function (data) {
        $scope.$apply(function () {
           $scope.newfilings.file_path = data;
        });
    }
    $scope.import_Filings_exceledit = function (data) {
        $scope.$apply(function () {
           $scope.filingeditdata.file_path = data;
        });
    }
    $scope.removeFilingsFile = function () {
        $scope.newfilings.file_path = '';
    }

    $scope.tab = 1;

    
    $scope.tabchange = function (count) {
        $scope.tab = count;
    }
    $scope.saveFilings = function () {

        if (angular.isUndefined($scope.newfilings.name) || $scope.newfilings.name == '') {
            alertService.add("warning", "Please select name !", 2000);
            return false;
        }
        if (angular.isUndefined($scope.newfilings.type) || $scope.newfilings.type == '') {
            alertService.add("warning", "Please enter type !", 2000);
            return false;
        }
        if($scope.newfilings.type=='Link'){
            if (angular.isUndefined($scope.newfilings.link) || $scope.newfilings.link == '') {
                alertService.add("warning", "Please enter link !", 2000);
                return false;
            }
        }
        if($scope.newfilings.type=='File'){
            if (angular.isUndefined($scope.newfilings.file_path) || $scope.newfilings.file_path == '') {
                alertService.add("warning", "Please enter file !", 2000);
                return false;
            }
        }
        if($scope.newfilings.type=='Summary'){
            if (angular.isUndefined($scope.newfilings.summary) || $scope.newfilings.summary == '') {
                alertService.add("warning", "Please enter file !", 2000);
                return false;
            }
        }

        var url = 'apiv4/public/dashboard/saveFilings';
        var params = {
            data: $scope.newfilings
        };
        RequestDetail.getDetail(url, params).then(function (result) {
            //console.log(result.data);
            if(result.data.status){
                alertService.add("success", "Filings added successfully!", 2000);
                $scope.filings = {};
                $scope.filings.link = '';
                $scope.filings.summary = '';
                $scope.getFilings();
                $scope.showModalFilings = false;
            }else{
                alertService.add("warning", "Delete or edit existing "+$scope.newfilings.name+"!", 2000);   
            }
        });
    }

    
    $scope.investor_messagecontent = {};
    $scope.investor_messagecontent.message = '';

    $scope.saveinvestor_message = function () {
        if (angular.isUndefined($scope.investor_messagecontent.message) || $scope.investor_messagecontent.message == '') {
            alertService.add("warning", "Please enter investor message!", 2000);
            return false;
        }
        var url = 'apiv4/public/dashboard/saveinvestor_messagecontent';
        var params = {
            data: $scope.investor_messagecontent.message,editinvestor_message_status:$scope.editinvestor_message_status
        };
        RequestDetail.getDetail(url, params).then(function (result) {
            alertService.add("success", "Added successfully!", 2000);
            $scope.investor_messagecontent = {};
            $scope.showinvestor_message = false;
            $scope.getNewsletterComponents();
        });
    }

    $scope.editFilings = function () {

        if (angular.isUndefined($scope.filingeditdata.name) || $scope.filingeditdata.name == '') {
            alertService.add("warning", "Please enter name !", 2000);
            return false;
        }
        if (angular.isUndefined($scope.filingeditdata.type) || $scope.filingeditdata.type == '') {
            alertService.add("warning", "Please enter type !", 2000);
            return false;
        }
        if($scope.filingeditdata.type=='Link'){
            if (angular.isUndefined($scope.filingeditdata.link) || $scope.filingeditdata.link == '') {
                alertService.add("warning", "Please enter link !", 2000);
                return false;
            }
        }
        if($scope.filingeditdata.type=='File'){
            if (angular.isUndefined($scope.filingeditdata.file_path) || $scope.filingeditdata.file_path == '') {
                alertService.add("warning", "Please enter file !", 2000);
                return false;
            }
        }
        if($scope.filingeditdata.type=='Summary'){
            if (angular.isUndefined($scope.filingeditdata.summary) || $scope.filingeditdata.summary == '') {
                alertService.add("warning", "Please enter file !", 2000);
                return false;
            }
        }

        var url = 'apiv4/public/dashboard/saveFilings';
        var params = {
            data: $scope.filingeditdata
        };
        RequestDetail.getDetail(url, params).then(function (result) {
            alertService.add("success", "Filings added successfully!", 2000);
            $scope.filings = {};
            $scope.getFilings();
            $scope.showModalFilingsedit = false;
        });
    }
    
    $scope.closeModalFilingsedit = function () {
        $scope.showModalFilingsedit = false;
    }

    $scope.getFilings = function () {
        var url = 'apiv4/public/dashboard/getFilings';
        var params = { user_id:$scope.user_id };
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.filings = result.data;

            $scope.youtubeid = '';

            angular.forEach($scope.filings, function (data,key) {
                if(data['name']=='Youtube'){
                    $scope.youtubeid = data['summary'];
                    
                }
            });
            
        });
    }

    $scope.trustSrc = function () {
        return $sce.trustAsResourceUrl($scope.youtubeid);
    }

    $scope.getFilings();
    $scope.deleteFiling = function (id) {
        if (confirm("Are you sure?")) {
            var url = 'apiv4/public/dashboard/deleteFiling';
            var params = {
                newsletterfiling_id: id
            };
            RequestDetail.getDetail(url, params).then(function (result) {
                alertService.add("success", "Filing Deleted Successfully!", 2000);
                $scope.filings = {};
                $scope.getFilings();
            });
        }
    }

    $scope.viewFiling = function (filing) {
        $scope.filingview = filing;
        $scope.showModalFilingsview = true;
    }
    $scope.closeModalFilingsview = function () {
        $scope.showModalFilingsview = false;
    }
    $scope.EditFiling = function (filing) {
        $scope.filingeditdata = filing;
        $scope.showModalFilingsedit = true;
    }

    $scope.import_filingfile_excel = function (data,newsletterfiling_id) {
        $scope.$apply(function () {
            
           var url = 'apiv4/public/dashboard/uploadnewsletterFilingsfile';
           var params = { file_path: data,newsletterfiling_id:newsletterfiling_id  };
           RequestDetail.getDetail(url, params).then(function (result) {
              alertService.add("success", "File Uploaded Successfully!", 2000);
              $scope.getFilings();
           });
        });
    }
    

    $scope.newfilings2 = {};
    $scope.filings2 = {};

    $scope.addFilings2 = function () {
        $scope.showModalFilings2 = true;
    }
    $scope.closeModalFilings2 = function () {
        $scope.showModalFilings2 = false;
    }
    $scope.import_Filings_excel2 = function (data) {
        $scope.$apply(function () {
           $scope.newfilings2.file_path = data;
        });
    }
    $scope.removeFilingsFile2 = function () {
        $scope.newfilings2.file_path = '';
    }
    $scope.saveFilings2 = function () {
        var url = 'apiv4/public/dashboard/saveFilings2';
        var params = {
            data: $scope.newfilings2
        };
        RequestDetail.getDetail(url, params).then(function (result) {
            alertService.add("success", "Filings added successfully!", 2000);
            $scope.filings2 = {};
            $scope.getFilings2();
            $scope.showModalFilings2 = false;
        });
    }
    $scope.getFilings2 = function () {
        var url = 'apiv4/public/dashboard/getFilings2';
        var params = { user_id:$scope.user_id };
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.filings2 = result.data;
        });
    }
    $scope.getFilings2();
    $scope.deleteFiling2 = function (id) {
        if (confirm("Are you sure?")) {
            var url = 'apiv4/public/dashboard/deleteFiling2';
            var params = {
                newsletterfiling_id: id
            };
            RequestDetail.getDetail(url, params).then(function (result) {
                alertService.add("success", "Filing Deleted Successfully!", 2000);
                $scope.filings2 = {};
                $scope.getFilings2();
            });
        }
    }

    $scope.pressrelease = {};
    $scope.pressreleases = {};

    
    $scope.import_Pressrelease_excel = function (data) {
        $scope.$apply(function () {
           $scope.pressrelease.file_path = data;
        });
    }
    $scope.addpressrelease = function () {
        $scope.showModalpressrelease = true;
    }
    $scope.closeModalpressrelease = function () {
        $scope.showModalpressrelease = false;
    }
    $scope.savepressrelease = function () {
        var url = 'apiv4/public/dashboard/savepressrelease';
        var params = {
            data: $scope.pressrelease
        };
        RequestDetail.getDetail(url, params).then(function (result) {
            alertService.add("success", "Press Release added successfully!", 2000);
            $scope.pressrelease = {};
            $scope.getPressrelease();
            $scope.showModalpressrelease = false;
        });
    }
    $scope.getPressrelease = function () {
        var url = 'apiv4/public/dashboard/getPressrelease';
        var params = { };
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.pressreleases = result.data;
        });
    }
    $scope.getPressrelease();
    $scope.deletepressrelease = function (id) {
        if (confirm("Are you sure?")) {
            var url = 'apiv4/public/dashboard/deletePressrelease';
            var params = {
                pressrelease_id: id
            };
            RequestDetail.getDetail(url, params).then(function (result) {
                alertService.add("success", "Filing Deleted Successfully!", 2000);
                $scope.pressrelease = {};
                $scope.getPressrelease();
            });
        }
    }
    $scope.savenewsletterDesign = function () {

        //console.log($scope.investor_relations_message);
        //console.log($scope.intro_act_commentary);

        var url = 'apiv4/public/dashboard/savenewsletterDesign';
        var params = {
            investor_message: $scope.investor_message,introact_commentary: $scope.introact_commentary,investor_relations_message:$scope.investor_relations_message,intro_act_commentary:$scope.intro_act_commentary
        };
        RequestDetail.getDetail(url, params).then(function (result) {
            alertService.add("success", "Updated successfully!", 2000);
        });
    }


    //Date Picker
		$scope.inlineOptions = {
			customClass: getDayClass,
			// minDate: new Date(),
			showWeeks: true
		};


		$scope.dateOptions = {
			// dateDisabled: disabled,
			formatYear: 'yy',
			// maxDate: new Date(2020, 5, 22),
			// minDate: new Date(),
			startingDay: 1
		};
		
		// Disable weekend selection
		function disabled(data) {
			// var date = data.date,
			// mode = data.mode;
			// return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6); /* Disable weak days */
		}

		$scope.toggleMin = function () {
			// $scope.inlineOptions.minDate = new Date();
			var myDate = new Date();
			//add a day to the date
			myDate.setDate(myDate.getDate() + 1);
			// $scope.dateOptions.minDate = myDate;
		};

		//Date popup
		$scope.open1 = function () {
			$scope.popup1.opened = true;
		};

		$scope.opendeadline = function () {
			$scope.deadline.opened = true;
		};

		$scope.setDate = function (year, month, day) {
			$scope.dt = new Date(year, month, day);
		};

		$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		$scope.format = $scope.formats[0];
		$scope.altInputFormats = ['M!/d!/yyyy'];

		$scope.popup1 = {
			opened: false
        };
        

		function getDayClass(data) {
			var date = data.date,
				mode = data.mode;
			if (mode === 'day') {
				var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

				for (var i = 0; i < $scope.events.length; i++) {
					var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

					if (dayToCheck === currentDay) {
						return $scope.events[i].status;
					}
				}
			}
			return '';
		}


    $scope.event = {};

    $scope.addEvent = function () {
        $scope.showModalEvent = true;
    }
    $scope.closeModalEvent = function () {
        $scope.showModalEvent = false;
    }
    $scope.saveEvent = function () {
        var url = 'apiv4/public/dashboard/saveevent';
        var params = {
            data: $scope.event
        };
        RequestDetail.getDetail(url, params).then(function (result) {
            alertService.add("success", "Event added successfully!", 2000);
            $scope.event = {};
            $scope.getEvent();
            $scope.showModalEvent = false;
        });
    }
    $scope.getEvent = function () {
        var url = 'apiv4/public/dashboard/getevent';
        var params = {user_id:$scope.user_id };
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.events = result.data;
        });
    }
    $scope.getEvent();

    $scope.viewevent = function (id) {
        var url = 'apiv4/public/dashboard/geteventview';
        var params = { event_id: id };
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.eventview = result.data;
            $scope.showModalEventview = true;
        });
    }
    $scope.removeevent = function (id) {
        if (confirm("Are you sure?")) {
            var url = 'apiv4/public/dashboard/deleteEvent';
            var params = {
                event_id: id
            };
            RequestDetail.getDetail(url, params).then(function (result) {
                alertService.add("success", "Event Deleted Successfully!", 2000);
                $scope.event = {};
                $scope.getEvent();
            });
        }
    }
    
    $scope.closeModalEventview = function () {
        $scope.showModalEventview = false;
    }

    $scope.import_contentfile_excel = function (data,newsletter_id) {
        $scope.$apply(function () {
            
           var url = 'apiv4/public/dashboard/uploadnewslettercontentfile';
           var params = { file_path: data,newsletter_id:newsletter_id  };
           RequestDetail.getDetail(url, params).then(function (result) {
              alertService.add("success", "File Uploaded Successfully!", 2000);
              $scope.getContent();
           });
        });
    }
    
    
    

})

.controller('addrecordingCtrl', function ($scope, $http, $location, $routeParams, localStorageService, RequestDetail, configdetails, $sce, usertype, alertService) {
    
    $scope.presentation = [];
    $scope.videos = [];

    $scope.openPresentation = function () {
        $scope.showModaladd = true;
    }

    $scope.closeModaladd = function () {
        $scope.showModaladd = false;
    }

    $scope.getvideos = function () {
        var url = 'apiv4/public/dashboard/getrecordings';
        var params = {};
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.videos = result.data;
        });
    }

    $scope.addPresentaion = function (URL,presentaion_name) {
        if(angular.isUndefined(presentaion_name) || presentaion_name == '') {
            alertService.add("warning", "Please enter presentation name !", 2000);
            return false;
        }
        var url = 'apiv4/public/dashboard/addrecording';
        var params = { presentation_name: presentaion_name,URL:URL  };
        RequestDetail.getDetail(url, params).then(function (result) {

            $scope.showModaladd = false;
            $scope.getvideos();
            alertService.add("success", "Video Created Successfully!", 2000);
            //$scope.getContent();
        });
    }

    $scope.showerror = function () {
        alertService.add("warning", "Please enter presentation name !", 2000);
    }
    
    $scope.removeVideo = function (id) {
        if (confirm("Are you sure?")) {
            var url = 'apiv4/public/dashboard/deleterecording';
            var params = {
                vid: id
            };
            RequestDetail.getDetail(url, params).then(function (result) {
                alertService.add("success", "Delected successfully!", 2000);
                $scope.getvideos();
            });
        }
    }

    
    $scope.getvideos();

    // Chrome 1 - 79
    $scope.browsercheck = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
    

});

angular.module('myApp.brokerviewCtrl', []).controller('brokerviewCtrl', function ($scope, $http, $location, $routeParams, RequestDetail, localStorageService, alertService, configdetails, $sce) {
    $scope.configdetails = configdetails;
    $scope.spinnerActive = true;
    $scope.pageHeading = 'Broker Profile';
    $scope.dasboardActive = 'active';
    $scope.profileData = {};

    $scope.userDetailFull = {};
    $scope.industryTags = {};
    $scope.userContacts = {};
    $scope.userColleagues = {};
    $scope.eventlist = {};
    $scope.presentaion_file = {};
    $scope.firm_contacts = [];
    $scope.profileData.searchcontact = '';
    // On click redirection
    // Fetching Event lists
    var contactids = localStorageService.get('contact_user');
    var contact_user_type = localStorageService.get('contact_user_type');
    var profile_contacts = 'apiv4/public/event/getCorpevents';
    var params = {
        key: 'contacts',
        profile_id: $routeParams.userId
    }

    /*RequestDetail.getDetail(profile_contacts,params).then(function(result){
        if(angular.isDefined(result.data) && result.data!="null" && result.data.length>0){
          $scope.eventlist = result.data;
      }
    });*/

    $scope.activetab = 0;

    $scope.changeactive = function (index) {
        $scope.activetab = index;
    };


    var url = 'apiv4/public/dashboard/getInvestorDetails';
    var params = {
        user_id: $routeParams.userId
    };
    if (angular.isDefined(contact_user_type) && contact_user_type == 'mb') {
        params.type = contact_user_type;
    }
    if (angular.isDefined(contactids) && contactids != '') {
        params.contactIds = contactids;
    }

    RequestDetail.getDetail(url, params).then(function (result) {
        $scope.userContacts = [];
        if (angular.isDefined(result.data)) {
            if (angular.isDefined(result.data.user_details)) {
                $scope.userDetailFull = result.data.user_details;
            }


            if ($scope.profileData.videourl != "" && $scope.profileData.videourl != null) {
                $scope.showvideo = true;
            } else {
                $scope.showvideo = false;
            }

            $scope.showvideopopupModal = false;
            //$scope.showvideopopupModal = true;
            $scope.togglevideopopupModal = function () {
                //  ******************** To avoid the api calling second time in same page Store in the variable and fetched the data ising $index value
                //$scope.values = $scope.FetchedData.items[index];
                // Assign the values to the variables

                $scope.showvideopopupModal = !$scope.showvideopopupModal;

            };

            $scope.trustSrc = function () {
                return $sce.trustAsResourceUrl($scope.userDetailFull.videourl);
            }

            if (angular.isDefined(result.data.industry_tags)) {
                $scope.industryTags = result.data.industry_tags;
            }
            if (angular.isDefined(result.data.corporate_list)) {
                $scope.CorporateList = result.data.corporate_list;
            }
            if (angular.isDefined(result.data.user_contacts)) {
                if (angular.isDefined(result.data.user_contacts) && result.data.user_contacts.length > 0) {
                    angular.forEach(result.data.user_contacts, function (con, ind) {
                        if (angular.isDefined(con) && angular.isDefined(con.firstname) && con.firstname != '' && con.firstname != 'null' && con.firstname != null) {
                            $scope.userContacts.push(con);
                        }
                    });
                }
            }
            if (angular.isDefined(result.data.presentation_research)) {
                $scope.presentaion_file = result.data.presentation_research;
            }
            if (angular.isDefined(result.data.firm_contact)) {
                $scope.firm_contacts = result.data.firm_contact;
            }
            // if(angular.isDefined(result.data.user_colleagues)){ 
            //   $scope.userColleagues = result.data.user_colleagues;
            // }
        }
        $scope.spinnerActive = false;

    });

    // Fetching Messages
    var getMessages = 'apiv4/public/user/getMessages';
    var params = {
        key: 'userId',
        user_id: $routeParams.userId
    }
    RequestDetail.getDetail(getMessages, params).then(function (result) {
        $scope.profileData.profileMessages = result.data;
    });

    $scope.addContact = function () {
        $scope.contactAdd = {};

        $scope.showAddcontact = !$scope.showAddcontact;

    };

    $scope.newMeeting = function (user_id) {
        if (angular.isDefined(user_id) && user_id != '') {
            var url = 'apiv4/public/dashboard/encrypt_id';
            var params = {
                user_id: user_id
            };
            RequestDetail.getDetail(url, params).then(function (result) {
                $location.path('meeting/new/' + result.data);
            });
        } else {
            $location.path('meeting/new/');
        }
    }


    $scope.insert_contact = function () {
        if (angular.isDefined($scope.contactAdd)) {
            if (!angular.isDefined($scope.contactAdd.firstname) || $scope.contactAdd.firstname == '') {
                alertService.add("warning", 'Please enter the first name !', 2000);
                return false;
            }
            if (!angular.isDefined($scope.contactAdd.job_title) || $scope.contactAdd.job_title == '') {
                alertService.add("warning", 'Please enter the job title !', 2000);
                return false;
            }
            if (!angular.isDefined($scope.contactAdd.email) || $scope.contactAdd.email == '') {
                alertService.add("warning", 'Please enter the email address !', 2000);
                return false;
            }
            if (!angular.isDefined($scope.contactAdd.phone) || $scope.contactAdd.phone == '') {
                alertService.add("warning", 'Please enter the phone number !', 2000);
                return false;
            }

            $scope.spinnerActive = true;
            var getMessages = 'apiv4/public/user/insertfirmContacts';
            var params = {
                key: 'userId',
                user_id: $routeParams.userId,
                contacts: $scope.contactAdd
            }
            RequestDetail.getDetail(getMessages, params).then(function (result) {
                if (angular.isDefined(result.data)) {
                    $scope.firm_contacts = result.data;
                }
                $scope.showAddcontact = !$scope.showAddcontact;
                $scope.spinnerActive = false;
            });
        }
    }

    $scope.request_mail = function (subject) {
        var localUserdata = localStorageService.get('userdata');
        if (angular.isDefined(localUserdata.user_id) && localUserdata.user_id != '' && angular.isDefined(localUserdata.email) &&
            localUserdata.email != '' && angular.isDefined($scope.userDetailFull.firstname) && $scope.userDetailFull.firstname != '') {
            var name = '';
            if (angular.isDefined(localUserdata.firstname) && localUserdata.firstname != '' && localUserdata != null) {
                name = name + localUserdata.firstname;
            } else {
                return false;
            }
            if (angular.isDefined(localUserdata.lastname) && localUserdata.lastname != '' && localUserdata.lastname != null) {
                name = name + ' ' + localUserdata.lastname;
            }
            var toname = '';
            if ($scope.userDetailFull.firstname != null) {
                toname = toname + $scope.userDetailFull.firstname;
            } else {
                return false;
            }
            if (angular.isDefined($scope.userDetailFull.lastname) && $scope.userDetailFull.lastname != '' && $scope.userDetailFull.lastname != null) {
                toname = toname + ' ' + $scope.userDetailFull.lastname;
            }
            var profile_contacts = 'apiv4/public/email/sendrequest';

            var params = {
                frombroker: name,
                sub: subject,
                type: 'Collaborate Request',
                to_detail: $scope.userDetailFull,
                user_detail: localUserdata,
                tobroker: toname
            }
            $scope.spinnerActive = true;
            RequestDetail.getDetail(profile_contacts, params).then(function (result) {
                if (angular.isDefined(result.data) && result.data == 'success') {

                }
                $scope.spinnerActive = false;
            });
        }
    }
})
.controller('addInvestorsList_Add', function ($scope, $interval, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails) {
    $scope.configdetails = configdetails;

    $scope.openmodelpagehelp = function () {
      $scope.showModalpageinfo = !$scope.showModalpageinfo;
    }
    if (localStorageService.get('usertype') == 'corporate') {
      $scope.pageHeading = 'Investor list';
    } else {
      $scope.pageHeading = 'Distribution list';
    }
    $scope.editinvdata = true;
    $scope.dasboardActive = 'active';
    $scope.error = {};
    $scope.investorListName = '';
    $scope.insertButton = true;
    $scope.users = [];
    $scope.emails = [];
    $scope.errorthrow = {};

    $scope.investorsList = {};


    // On click redirection
    $scope.users = [];
    var pushdata = new Object();

    var getInvestorListUrl = 'apiv4/public/dashboard/getInvestorListbyId';
    var params = {
      type: 'get',
      id: $routeParams.investorListId
    };


    $scope.investorsList = [];





    $scope.getList = function () {
      var GetInvestorsListUrl = 'apiv4/public/dashboard/getInvestorsList';
      var params = {
        type: 'get'
      };

      RequestDetail.getDetail(GetInvestorsListUrl, params).then(function (result) {
        $scope.investorsList = result.data;
      });
    }

    $scope.getList();


    $scope.InvestorNew = function (listId) {
      $location.path('investors/new/' + listId);
    }
    $scope.InvestorEdit = function (listId) {
      $location.path('investors/edit/' + listId);
    }
    $scope.InvestorView = function (listId) {
      $location.path('investors/view/' + listId);
    }
    // COLUMN TO SORT
    $scope.column = 'sno';

    // SORT ORDERING (ASCENDING OR DESCENDING). SET TRUE FOR DESENDING
    $scope.reverse = false;

    // CALLED ON HEADER CLICK
    $scope.sortColumn = function (col) {
      $scope.column = col;
      if ($scope.reverse) {
        $scope.reverse = false;
        $scope.reverseclass = 'arrow-up';
      } else {
        $scope.reverse = true;
        $scope.reverseclass = 'arrow-down';
      }
    };


    $scope.sortClass = function (col) {
      if ($scope.column == col) {
        if ($scope.reverse) {
          return 'arrow-down';
        } else {
          return 'arrow-up';
        }
      } else {
        return '';
      }
    };

    $scope.removeGroup = function (id, index) {
      if (angular.isDefined(id) && id != '') {
        $('#confirmation').modal('show');
        $scope.confirmation = true;
        $('#hidden_id').val(id);
      } else {
        var id = $('#hidden_id').val();
        var url = 'apiv4/public/dashboard/removeContactGroup';
        var params = {
          type: 'post',
          values: id
        };
        RequestDetail.getDetail(url, params).then(function (result) {
          if (result.data == 0) {
            $scope.getList();
            $('#confirmation').modal('hide');
            $scope.confirmation = false;
            alertService.add("success", 'Removed group Successfully !', 2000);
          }
        });
      }
    }

    $scope.closemodel = function () {
      $scope.confirmation = false;
    }

    $scope.import_investor_vcard = function (data) {

      var userdata = [];
      var data1 = JSON.parse(data);
      if (data1.error) {
        alertService.add("warning", "File Format is wrong Try again!", 5000);
        alert('File Format is wrong Try again!');
        return false;
      } else {
        if ($scope.users.length == '0') {
          $scope.users = [];
        }
        if (angular.isDefined(data) && data != '') {
          var data = JSON.parse(data);
          var usersdata = [];
          angular.forEach(data, function (todo, key) {
            var pushdata = new Object();
            var tickers = '';
            if (todo.Tickers) {
              tickers = todo.Tickers;
            }

            var sectors = [];
            if (todo.Sectors) {
              sectors = todo.Sectors.split(',');
            }

            var industries = [];
            if (todo.Industries) {
              industries = todo.Industries.split(',');
            }
            pushdata = {
              company: todo.company,
              firstname: todo.firstname,
              lastname: todo.lastname,
              fundname: todo.fundname,
              title: todo.title,
              office_phone: todo.officephone,
              phone: todo.phone,
              email: todo.email,
              tickers: tickers,
              sectors: sectors,
              industries: industries,
              salesperson: todo.salesperson,
              assistant_firstname: '',
              assistant_lastname: '',
              assistant_phone: '',
              assistant_email: '',
              address1: todo.address1,
              address2: todo.address2,
              city: todo.city,
              state: todo.state,
              region: todo.region,
              country: todo.country,
              zip: todo.zip,
              customer_type: todo.customer_type,
              customer_style: todo.customer_style,
              customer_size: todo.customer_size,
              join: new Date(todo.join_date),
            }
            if ($scope.find_duplicatemail(todo.email)) {
              $scope.$apply(function () {
                $scope.users.push(pushdata);
                $scope.emails.push(todo.email);
              });
            } else {
              alertService.add("warning", "File Format is wrong Try again!", 5000);
              return false;
            }
          });


        } else {
          alertService.add("warning", "File Format is wrong Try again!", 5000);
          return false;
        }
      }
    }

    $scope.collapse = false;
    $scope.collapses = function () {
      $scope.collapse = !$scope.collapse;
    }

    $scope.availableIndustry = [];
    $scope.availableIndustry_sector = [];
    var tagUrl = 'apiv4/public/user/get_industries_Mid_macro';
    RequestDetail.getDetail(tagUrl, params).then(function (result) {
      if (angular.isDefined(result.data)) {
        $scope.availableIndustry = result.data.industries_macro;
        
        $scope.industriesfilters = result.data.industriesfilters;
        $scope.availableIndustry_sector = result.data.industries_sectors;
      } else {
        $scope.availableIndustry = [];
        $scope.industriesfilters = [];
        $scope.availableIndustry_sector = [];
      }
    });




    $scope.show_dashboard = function () {

      $location.path('dashboard');
    }

    // Investor Import Excel File 
    $scope.import_investor_excel = function (data) {

     
     

      if ($scope.users.length == '0') {
        $scope.users = [];
      }

      
      $scope.$apply(function () { $scope.spinnerActive = true; });

     

      var data1 = JSON.parse(data);
     // var data1 = data;

      if (data1.error) {
        alertService.add("warning", "File Format is wrong Try again!", 5000);
        alert('File Format is wrong Try again!');
        $scope.spinnerActive = false;
        return false;
      } else {
        if (angular.isDefined(data) && data != '') {
          var usersdata = [];
         data = JSON.parse(data);
         // data = data;
          if ($scope.emails.length == '0') {
            $scope.emails = [];
          }
          
          var i = 1;
          
            angular.forEach(data, function (todo, key) {
              var pushdata = new Object();

              if(!todo){
                $scope.spinnerActive = false;
                alertService.add("warning", "File Format is wrong Try again!", 5000);
                alert('File Format is wrong Try again!');
              }

              var Str =  todo.Email.replace("'", "");

              var tickers = '';
              if (todo.Tickers) {
                tickers = todo.Tickers;
              }

              var sectors = [];
              if (todo.Sectors) {
                sectors = todo.Sectors.split(',');
              }

              var industries = [];
              if (todo.Industries) {
                industries = todo.Industries.split(',');
              }
              Str = Str.trim();
              
              pushdata = {
                company: todo.FirmName,
                firstname: todo.FirstName,
                lastname: todo.LastName,
                fundname: todo.FundName,
                title: todo.Title,
                office_phone: todo.OfficePhone,
                phone: todo.CellPhone,
                email: Str,
                tickers: tickers,
                sectors: sectors,
                industries: industries,
                city: todo.City,
                state: todo.State,
                region: todo.Region,
                country: todo.Country,
                salesperson: todo.salesperson,
                assistant_firstname: todo.AssistantFirstName,
                assistant_lastname: todo.AssistantLastName,
                assistant_phone: todo.AssistantPhone,
                assistant_email: todo.AssistantEmail,
                address1: todo.Address1,
                address2: todo.Address2,
                zip: todo.Zip,
                customer_type: todo.customer_type,
                customer_style: todo.customer_style,
                customer_size: todo.customer_size,
                join: new Date(),
                temp_track: i++,
              }
              if ($scope.find_duplicatemail(todo.Email)) {
                if(todo.Email!=''){
                  $scope.$apply(function () {
                    $scope.users.push(pushdata);
                   
                    $scope.emails.push(todo.Email);
                  });
                }
              
              }
              return false;
            });
         
          $scope.loadMore();
         
        } else {
          alertService.add("warning", "File Format is wrong Try again!", 5000);
          return false;
        }
      }
    }

  
    // COUNT TO DISPLAY
    $scope.totalDisplayed = 2;
    $scope.incrementDisplayed = 100;

    //LAZY LOADER
    var stop;
    $scope.loadMore = function () {
      // Don't start a new fight if we are already fighting
      if (angular.isDefined(stop)) return;

      stop = $interval(function () {
        $scope.totalDisplayed += $scope.incrementDisplayed;
        if ($scope.totalDisplayed > $scope.users.length) {
          
          $scope.spinnerActive = false;
          $scope.stoploadMore();
        }
      }, 2000);
    };

    $scope.stoploadMore = function () {
      if (angular.isDefined(stop)) {
        $interval.cancel(stop);
        stop = undefined;
        //console.log('stopped');
      }
    };



    $scope.find_duplicatemail = function (data) {
      if ($scope.emails && $scope.emails.length > 0) {
        var dupl = 0;
        angular.forEach($scope.emails, function (todo, key) {
          
          if (todo == data) {
            //console.log(data);
            dupl++;
          }
        });
        if (dupl == 0) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    }
    $scope.con_init = function () {
      $scope.datepickersOptions = {
        minDate: new Date('2010-05-01'),
        initDate: new Date()
      };
    }

    $scope.date_picker_opened = [];

    $scope.date_picker_open = function (index) {
      $timeout(function () {
        $scope.date_picker_opened[index] = true;
      });
    }

    $scope.clearUser = function (index) {
      $scope.users = [];
      $scope.emails = [];
    }

    $scope.uploadexcelfile = function (data) {
      if ($scope.users.length == '0') {
        var totallength = '1';
      } else {
        var totallength = $scope.users.length;
      }
      angular.forEach(data, function (todo, key) {
        var pushdata = new Object();
        pushdata = {
          id: totallength,
          address: todo.address,
          company: todo.company,
          fundname: todo.fundname,
          email: todo.email,
          tickers: todo.tickers,
          sectors: todo.sectors,
          industries: todo.industries,
          salesperson: todo.salesperson,
          join: new Date(todo.join),
          firstname: todo.firstname,
          lastname: todo.lastname,
          location: todo.location,
          phone: todo.phone
        }
        totallength = totallength + 1
        $scope.$apply(function () {
          $scope.users.push(pushdata);
        });
      });
    }

    $scope.statuses = [{
        value: 1,
        text: 'status1'
      },
      {
        value: 2,
        text: 'status2'
      },
      {
        value: 3,
        text: 'status3'
      },
      {
        value: 4,
        text: 'status4'
      }
    ];

    $scope.addInvestorList = function () {

      if ($scope.investorListName == '') {
        alertService.add("warning", "Group name cannot be empty !", 5000);
        $scope.error.required = 'required_input';
        $('#name').focus();
        return false;
      } else if ($scope.users == '') {
        alertService.add("warning", "Should enter atleast one investor detail !", 5000);
        return false;
      }
      if ($scope.users[0].email == '' || angular.isUndefined($scope.users[0].email) || $scope.users[0].email == null) {
        alertService.add("warning", "Should enter atleast one investor email id !", 5000);
        return false;
      }
      if (angular.isDefined($scope.users) && $scope.users != '' && $scope.users.length != 0) {
        $scope.emails = [];
        $scope.email_ids = [];
        var initgo = 0;
        angular.forEach($scope.users, function (todo, key) {
          $scope.emails.push(todo.email);
          var cls = "cls_" + key;
          $scope.errorthrow[cls] = false;
          if ($scope.checkmailid(todo.email)) {
            $('#cls_'+key).focus();
            $scope.errorthrow[cls] = true;
            initgo++;
          }
        });
        if (initgo > 0) {
          alertService.add("warning", "Kindly check Invalid Email!", 5000);
          return false;
        }
        if ($scope.emails.length == 0) {
          alertService.add("warning", "Should enter investor email id !", 5000);
          return false;
        }

        
        if ($scope.users.length > 5000) {
          alertService.add("warning", "Contacts should not be more then 5000 !", 5000);
          //return false;
        }
        if ($scope.emails.length > 5000) {
          alertService.add("warning", "Contacts should not be more then 5000 !", 5000);
          //return false;
        }
        var duplicates = [];
        for (var i = 0; i < $scope.emails.length; i++) {
          if (duplicates.hasOwnProperty($scope.emails[i])) {
            duplicates.push(i);
          } else if ($scope.emails.lastIndexOf($scope.emails[i]) !== i) {
            duplicates.push(i);
          }
          $('#email' + i).removeClass('duplicate_email');
        }
        //console.log(duplicates);
        if (duplicates.length != 0) {
        
          for (var j = 0; j < duplicates.length; j++) {
            $('#email' + duplicates[j]).addClass('duplicate_email');
          }
          alertService.add("warning", "Email id already added!", 5000);
          return false;
        }
      }

      if ($scope.users.length > 5000) {
        alertService.add("warning", "Contacts should not be more then 5000 !", 5000);
        //return false;
      }
      if ($scope.emails.length > 5000) {
        alertService.add("warning", "Contacts should not be more then 5000 !", 5000);
        //return false;
      }
      

     $scope.spinnerActive = true;
      var url = 'apiv4/public/dashboard/newInvestor';
      var params = {
        user_id: $scope.users,
        investername: $scope.investorListName
      };

      RequestDetail.getDetail(url, params).then(function (result) {
        $scope.spinnerActive = false;

        if (result.data == 1) {
          alertService.add("success", "Distribution Group Added Successfully  !", 2000);
          $timeout(function () {
            $location.path('investors/list');
          }, 1000);
        } else {
          alertService.add("warning", "Distribution Group name already taken !", 5000);
          return false;
        }
      });   
    }
    $scope.checkmailid = function (email) {
      var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if (filter.test(email)) {
        return false;
      } else {
        return true;
      }
    }

    $scope.validateEmail= function (email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
        return re.test(email);
    };

    $scope.checkName = function (data, form, row) {
      if ($scope.validateEmail(data)) {
        form.$setError('email', '');
        var cls = "cls_" + row;
        $scope.errorthrow[cls] = false;
      } else {
        var msg = "Required Mail-Id";
        form.$setError('email', msg);
        return msg;
      }
    };
    $scope.checkfName = function (data, form) {
      if (data) {
        form.$setError('firstname', '');
      } else {
        var msg = "Required firstname";
        form.$setError('firstname', msg);
        return msg;
      }
    };

    $scope.saveUser = function (data, id) {
      //return false;
    };

    // remove user
    $scope.removeUser = function (index) {
      $scope.users.splice(index, 1);
      $scope.emails.splice(index, 1);

      angular.forEach($scope.users, function (todo, key) {
        var cls = "cls_" + key;
        $scope.errorthrow[cls] = false;
      });
    };

    // add user
    $scope.addUser = function () {
      $scope.inserted = {
        id: $scope.users.length + 1,
        name: '',
        email: '',
        status: null,
        group: null
      };
      $scope.users.push($scope.inserted);
      var ele_test = 'email' + (parseInt($scope.inserted.id) - 2) + ' td:nth-child(2) input';

      $('#' + ele_test).focus();

    };



  })
  .controller('addInvestorscontactsList_Add', function ($scope, $interval, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails) {
    $scope.configdetails = configdetails;

    $scope.openmodelpagehelp = function () {
      $scope.showModalpageinfo = !$scope.showModalpageinfo;
    }
    if (localStorageService.get('usertype') == 'corporate') {
      $scope.pageHeading = 'Investor list';
    } else {
      $scope.pageHeading = 'Distribution list';
    }

    $scope.dasboardActive = 'active';
   
    $scope.addInvestorList = function () {
      if (angular.isUndefined($scope.investorListName) || $scope.investorListName == '') {
        alertService.add("warning", "Enter List Name!", 2000);
				return false;
      }
      
      var GetInvestorsListUrl = 'apiv4/public/investornotes/addInvestorscontactsList';
      var params = {
        investorListName: $scope.investorListName
      };

      RequestDetail.getDetail(GetInvestorsListUrl, params).then(function (result) {
           if(result.data.investor_list_id){
          alertService.add("success", "Distribution Group Added Successfully  !", 2000);
          $timeout(function () {
            $location.path('investors/contactview/'+result.data.investor_list_id);
          }, 1000);
        }else{
          alertService.add("warning", "Distribution list name already exists!", 2000);
        }
      });
    }


  })
  .controller('addInvestorsList', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails) {
    $scope.configdetails = configdetails;

    $scope.openmodelpagehelp = function () {
      $scope.showModalpageinfo = !$scope.showModalpageinfo;
    }
    if (localStorageService.get('usertype') == 'corporate') {
      $scope.pageHeading = 'Investor list';
    } else {
      $scope.pageHeading = 'Distribution list';
    }
    $scope.editinvdata = true;
    $scope.dasboardActive = 'active';
    $scope.error = {};
    $scope.investorListName = '';
    $scope.insertButton = true;
    $scope.users = [];
    $scope.emails = [];
    $scope.errorthrow = {};

    $scope.investorsList = {};


    // On click redirection
    $scope.users = [];
    var pushdata = new Object();

    var getInvestorListUrl = 'apiv4/public/dashboard/getInvestorListbyId';
    var params = {
      type: 'get',
      id: $routeParams.investorListId
    };


    $scope.investorsList = [];



    $scope.getList = function () {
      var GetInvestorsListUrl = 'apiv4/public/dashboard/getInvestorsList';
      var params = {
        type: 'get'
      };

      RequestDetail.getDetail(GetInvestorsListUrl, params).then(function (result) {
        $scope.investorsList = result.data;
      });
    }

    $scope.getList();


    $scope.InvestorNew = function (listId) {
      $location.path('investors/new/' + listId);
    }
    $scope.InvestorEdit = function (listId) {
      $location.path('investors/edit/' + listId);
    }
    $scope.InvestorView = function (listId) {
      $location.path('investors/view/' + listId);
    }

    $scope.removeGroup = function (id, index) {
      if (angular.isDefined(id) && id != '') {
        $('#confirmation').modal('show');
        $scope.confirmation = true;
        $('#hidden_id').val(id);
      } else {
        var id = $('#hidden_id').val();
        var url = 'apiv4/public/dashboard/removeContactGroup';
        var params = {
          type: 'post',
          values: id
        };
        RequestDetail.getDetail(url, params).then(function (result) {
          if (result.data == 0) {
            $scope.getList();
            $('#confirmation').modal('hide');
            $scope.confirmation = false;
            alertService.add("success", 'Removed group Successfully !', 2000);
          }
        });
      }
    }

    
    $scope.closemodel = function () {
      $scope.confirmation = false;
    }

    $scope.import_investor_vcard = function (data) {

      var userdata = [];
      var data1 = JSON.parse(data);
      if (data1.error) {
        alertService.add("warning", "File Format is wrong Try again!", 5000);
        alert('File Format is wrong Try again!');
        return false;
      } else {
        if ($scope.users.length == '0') {
          $scope.users = [];
        }
        if (angular.isDefined(data) && data != '') {
          var data = JSON.parse(data);
          var usersdata = [];

          var tickers = [];
          if (todo.Tickers) {
            tickers = todo.Tickers.split(',');
          }

          var sectors = [];
          if (todo.Sectors) {
            sectors = todo.Sectors.split(',');
          }

          var industries = [];
          if (todo.Industries) {
            industries = todo.Industries.split(',');
          }



          angular.forEach(data, function (todo, key) {
            var pushdata = new Object();
            pushdata = {
              company: todo.company,
              firstname: todo.firstname,
              lastname: todo.lastname,
              fundname: todo.fundname,
              title: todo.title,
              office_phone: todo.officephone,
              phone: todo.phone,
              email: todo.email,
              tickers: tickers,
              sectors: sectors,
              industries: industries,
              salesperson: todo.salesperson,
              assistant_firstname: '',
              assistant_lastname: '',
              assistant_phone: '',
              assistant_email: '',
              address1: todo.address1,
              address2: todo.address2,
              city: todo.city,
              state: todo.state,
              region: todo.region,
              country: todo.country,
              zip: todo.zip,
              customer_type: todo.customer_type,
              customer_style: todo.customer_style,
              customer_size: todo.customer_size,
              join: new Date(todo.join_date),
            }
            if ($scope.find_duplicatemail(todo.email)) {
              $scope.$apply(function () {
                $scope.users.push(pushdata);
                $scope.emails.push(todo.email);
              });
            } else {
              alertService.add("warning", "File Format is wrong Try again!", 5000);
              return false;
            }
          });

        } else {
          alertService.add("warning", "File Format is wrong Try again!", 5000);
          return false;
        }
      }
    }

    $scope.collapse = false;
    $scope.collapses = function () {
      $scope.collapse = !$scope.collapse;
    }



    $scope.show_dashboard = function () {

      $location.path('dashboard');
    }



    // Investor Import Excel File 
    $scope.import_investor_excel = function (data) {
      if ($scope.users.length == '0') {
        $scope.users = [];
      }
      var data1 = JSON.parse(data);
      if (data1.error) {
        alertService.add("warning", "File Format is wrong Try again!", 5000);
        alert('File Format is wrong Try again!');
        $scope.spinnerActive = false;
        return false;
      } else {
        if (angular.isDefined(data) && data != '') {
          var usersdata = [];
          data = JSON.parse(data);
          if ($scope.emails.length == '0') {
            $scope.emails = [];
          }

          angular.forEach(data, function (todo, key) {
            var pushdata = new Object();

            var tickers = '';
            if (todo.Tickers) {
              tickers = todo.Tickers;
            }

            var sectors = [];
            if (todo.Sectors) {
              sectors = todo.Sectors.split(',');
            }

            var industries = [];
            if (todo.Industries) {
              industries = todo.Industries.split(',');
            }

            pushdata = {
              company: todo.FirmName,
              firstname: todo.FirstName,
              lastname: todo.LastName,
              fundname: todo.FundName,
              title: todo.Title,
              office_phone: todo.OfficePhone,
              phone: todo.CellPhone,
              email: todo.Email.replace("'", "").trim(),
              tickers: tickers,
              sectors: sectors,
              industries: industries,
              city: todo.City,
              state: todo.State,
              region: todo.Region,
              country: todo.Country,
              salesperson: todo.salesperson,
              assistant_firstname: todo.AssistantFirstName,
              assistant_lastname: todo.AssistantLastName,
              assistant_phone: todo.AssistantPhone,
              assistant_email: todo.AssistantEmail,
              address1: todo.Address1,
              address2: todo.Address2,
              zip: todo.Zip,
              customer_type: todo.customer_type,
              customer_style: todo.customer_style,
              customer_size: todo.customer_size,
              join: new Date(),
            }
            if ($scope.find_duplicatemail(todo.Email)) {
              $scope.$apply(function () {
                $scope.users.push(pushdata);
                $scope.emails.push(todo.Email);
              });
            }
          });
        } else {
          alertService.add("warning", "File Format is wrong Try again!", 5000);
          return false;
        }
      }
    }
    $scope.find_duplicatemail = function (data) {
      if ($scope.emails && $scope.emails.length > 0) {
        var dupl = 0;
        angular.forEach($scope.emails, function (todo, key) {
          if (todo == data) {
            dupl++;
          }
        });
        if (dupl == 0) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    }
    $scope.con_init = function () {
      $scope.datepickersOptions = {
        minDate: new Date('2010-05-01'),
        initDate: new Date()
      };
    }

    $scope.date_picker_opened = [];

    $scope.date_picker_open = function (index) {
      $timeout(function () {
        $scope.date_picker_opened[index] = true;
      });
    }

    $scope.clearUser = function (index) {
      $scope.users = [];
      $scope.emails = [];
    }

    $scope.uploadexcelfile = function (data) {
      if ($scope.users.length == '0') {
        var totallength = '1';
      } else {
        var totallength = $scope.users.length;
      }
      angular.forEach(data, function (todo, key) {
        var pushdata = new Object();

        var tickers = '';
        if (todo.tickers) {
          tickers = todo.tickers.split(',');
        }

        var sectors = '';
        if (todo.sectors) {
          sectors = todo.sectors.split(',');
        }

        var industries = '';
        if (todo.industries) {
          industries = todo.industries.split(',');
        }

        pushdata = {
          id: totallength,
          address: todo.address,
          company: todo.company,
          fundname: todo.fundname,
          email: todo.email,
          tickers: tickers,
          sectors: sectors,
          industries: industries,
          salesperson: todo.salesperson,
          join: new Date(todo.join),
          firstname: todo.firstname,
          lastname: todo.lastname,
          location: todo.location,
          phone: todo.phone
        }
        totallength = totallength + 1
        $scope.$apply(function () {
          $scope.users.push(pushdata);
        });
      });
    }

    $scope.statuses = [{
        value: 1,
        text: 'status1'
      },
      {
        value: 2,
        text: 'status2'
      },
      {
        value: 3,
        text: 'status3'
      },
      {
        value: 4,
        text: 'status4'
      }
    ];

    $scope.addInvestorList = function () {


      if ($scope.investorListName == '') {
        alertService.add("warning", "Group name cannot be empty !", 5000);
        $scope.error.required = 'required_input';
        $('#name').focus();
        return false;
      } else if ($scope.users == '') {
        alertService.add("warning", "Should enter atleast one investor detail !", 5000);
        return false;
      }
      if ($scope.users[0].email == '' || angular.isUndefined($scope.users[0].email) || $scope.users[0].email == null) {
        alertService.add("warning", "Should enter atleast one investor email id !", 5000);
        return false;
      }
      if (angular.isDefined($scope.users) && $scope.users != '' && $scope.users.length != 0) {
        $scope.emails = [];
        $scope.email_ids = [];
        var initgo = 0;
        angular.forEach($scope.users, function (todo, key) {
          $scope.emails.push(todo.email);

          var cls = "cls_" + key;
          $scope.errorthrow[cls] = false;
          if ($scope.checkmailid(todo.email)) {
            $scope.errorthrow[cls] = true;
            initgo++;
          }
        });
        if (initgo > 0) {
          alertService.add("warning", "Kindly check Mail-Id is a not valid!", 5000);
          return false;
        }
        if ($scope.emails.length == 0) {
          alertService.add("warning", "Should enter investor email id !", 5000);
          return false;
        }
        if ($scope.emails.length > 5000) {
          alertService.add("warning", "Contacts limit should not be more then 5000!", 5000);
          //return false;
        }
        var duplicates = [];
        for (var i = 0; i < $scope.emails.length; i++) {
          if (duplicates.hasOwnProperty($scope.emails[i])) {
            duplicates.push(i);
          } else if ($scope.emails.lastIndexOf($scope.emails[i]) !== i) {
            duplicates.push(i);
          }
          $('#email' + i).removeClass('duplicate_email');
        }
        if (duplicates.length != 0) {
          for (var j = 0; j < duplicates.length; j++) {
            $('#email' + duplicates[j]).addClass('duplicate_email');
          }
          alertService.add("warning", "Email id already added!", 5000);
          return false;
        }
      }

      $scope.spinnerActive = true;
      var url = 'apiv4/public/dashboard/newInvestor';
      var params = {
        user_id: $scope.users,
        investername: $scope.investorListName
      };

      RequestDetail.getDetail(url, params).then(function (result) {
        $scope.spinnerActive = false;

        if (result.data == 1) {
          alertService.add("success", "Distribution Group Added Successfully  !", 2000);
          $timeout(function () {
            $location.path('investors/list');
          }, 1000);
        } else {
          alertService.add("warning", "Distribution Group name already taken !", 5000);
          return false;
        }
      });
    }
    $scope.checkmailid = function (email) {
      var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if (filter.test(email)) {
        return false;
      } else {
        return true;
      }
    }

    $scope.validateEmail= function (email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
        return re.test(email);
    };

    $scope.checkName = function (data, form, row) {
      if ($scope.validateEmail(data)) {
        form.$setError('email', '');
        var cls = "cls_" + row;
        $scope.errorthrow[cls] = false;
      } else {
        var msg = "Required Mail-Id";
        form.$setError('email', msg);
        return msg;
      }
    };
    $scope.checkfName = function (data, form) {
      if (data) {
        form.$setError('firstname', '');
      } else {
        var msg = "Required firstname";
        form.$setError('firstname', msg);
        return msg;
      }
    };

    $scope.saveUser = function (data, id) {
      //return false;
    };

    // remove user
    $scope.removeUser = function (index) {
      $scope.users.splice(index, 1);
      $scope.emails.splice(index, 1);
      angular.forEach($scope.users, function (todo, key) {
        var cls = "cls_" + key;
        $scope.errorthrow[cls] = false;
      });
    };

    // add user
    $scope.addUser = function () {
      /* var length = $scope.users.length;
       if($scope.users.length >= 1){
         if(!$scope.users[length].email){
           alertService.add("warning", "Please add previous Investor !",5000);
           return false;
         }
       }*/
      $scope.inserted = {
        id: $scope.users.length + 1,
        name: '',
        status: null,
        group: null
      };
      $scope.users.push($scope.inserted);
      var ele_test = 'email' + (parseInt($scope.inserted.id) - 2) + ' td:nth-child(2) input';
      /* $('#'+ele_test).css('border','4px solid red'); */
      $('#' + ele_test).focus();
    };
  })
  .controller('addInvestorscontactList', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails) {

		$scope.configdetails = configdetails;

		$scope.openmodelpagehelp = function () {
			$scope.showModalpageinfo = !$scope.showModalpageinfo;
		}
		if (localStorageService.get('usertype') == 'corporate') {
			$scope.pageHeading = 'Investor list';
		} else {
			$scope.pageHeading = 'Distribution list';
		}
		$scope.editinvdata = true;
		$scope.dasboardActive = 'active';
		$scope.error = {};
		$scope.investorListName = '';
		$scope.insertButton = true;
		$scope.users = [];
		$scope.emails = [];
		$scope.errorthrow = {};

		$scope.investorsList = {};

		$scope.agencystatus = 0;
		$scope.agencytickers = [];

		var userdata = localStorageService.get('userdata');

		if (userdata.agencyid) {
		  $scope.agencyid = userdata.agencyid;
		}

		if (userdata.agencystatus) {
		  $scope.agencystatus = userdata.agencystatus;
		}
		if (userdata.agencytickers) {
		  $scope.agencytickers = userdata.agencytickers.split(',');
		}

		// On click redirection
		$scope.users = [];
		
		$scope.investorsList = [];

		$scope.getList = function () {
		  $scope.spinnerActive = true;
		  var GetInvestorsListUrl = 'apiv4/public/dashboard/getInvestorsListsplit';
		  var params = {
			type: 'get'
		  };

		  RequestDetail.getDetail(GetInvestorsListUrl, params).then(function (result) {
			  $scope.investorsList = result.data;
			  //console.log($scope.investorsList);
			  $scope.spinnerActive = false;
		  });
		}

		$scope.getList();

    $scope.investorsListcop = [];

		$scope.getListcop = function () {
		  $scope.spinnerActive = true;
		  var GetInvestorsListUrl = 'apiv4/public/dashboard/getInvestorsList';
		  var params = {
			type: 'get'
		  };

		  RequestDetail.getDetail(GetInvestorsListUrl, params).then(function (result) {
			  $scope.investorsListcop = result.data;
			  //console.log($scope.investorsList);
			  $scope.spinnerActive = false;
		  });
		}

		$scope.getListcop();
		
		
    var Url = 'apiv4/public/dashboard/gettotaluniquecontacts';
		var params = {};
		RequestDetail.getDetail(Url, params).then(function (result) {
        $scope.totalunique = result.data.total;
		});

		// Add Investor List
		$scope.distributionList = {};
		$scope.openModaladdlist = function () {
		  $scope.showModaladdlist = true;
		}
		$scope.closeModaladdlist = function () {
		  $scope.showModaladdlist = false;
		}

		$scope.addInvestorList = function () {
			// //console.log($scope.distributionList.Name);
			if (angular.isUndefined($scope.distributionList.Name) || $scope.distributionList.Name == '') {
				alertService.add("warning", "Enter Distribution List Name!", 2000);
				return false;
			}
		  
			var GetInvestorsListUrl = 'apiv4/public/investornotes/addInvestorscontactsList';
			var params = {
				investorListName: $scope.distributionList.Name
			};

			RequestDetail.getDetail(GetInvestorsListUrl, params).then(function (result) {
        if(result.data.investor_list_id){
          $scope.showModaladdlist = false;
          alertService.add("success", "Distribution List Added Successfully  !", 2000);
          $timeout(function () {
            $location.path('investors/contactview/'+result.data.investor_list_id);
          }, 1000);
        }else{
          alertService.add("warning", "Distribution list name already exists!", 2000);
        }
				
			});
		}

		$scope.opentickercopylist = function () {
			$scope.showModalcopylist = true;
		}
		$scope.closeModalcopylist = function () {
			$scope.showModalcopylist = false;
		}

		$scope.copyinvestorlist = '';
		$scope.copyinvestorticker = '';

		$scope.copy = {};
		
		$scope.tickercopylist = function () {
		  $scope.spinnerActive = true;
		  var GetInvestorsListUrl = 'apiv4/public/dashboard/tickercopylist';
		  var params = {
			  investorlistdetail: $scope.copy,
		  };
		  RequestDetail.getDetail(GetInvestorsListUrl, params).then(function (result) {
        $scope.showModalcopylist = false;
        $scope.spinnerActive = false;
        alertService.add("success", 'Copied Successfully !', 2000);
        //$scope.getList();
		  });
		}
		
		

		$scope.InvestorNew = function (listId) {
		  $location.path('investorscontact/new/' + listId);
		}
		$scope.InvestorEdit = function (listId) {
		  $location.path('investorscontact/edit/' + listId);
		}
		$scope.InvestorView = function (listId) {
		  $location.path('investors/contactview/' + listId);
		}



		$scope.removeGroup = function (id, index) {
		  if (angular.isDefined(id) && id != '') {
			$('#confirmation').modal('show');
			$scope.confirmation = true;
			$('#hidden_id').val(id);
		  } else {
			var id = $('#hidden_id').val();
			var url = 'apiv4/public/dashboard/removenotesContactGroup';
			var params = {
			  type: 'post',
			  values: id
			};
			RequestDetail.getDetail(url, params).then(function (result) {
			  if (result.data == 0) {
				$scope.getList();
				$('#confirmation').modal('hide');
				$scope.confirmation = false;
				alertService.add("success", 'Removed group Successfully !', 2000);
			  }
			});
		  }
		}

		$scope.closemodel = function () {
		  $scope.confirmation = false;
		}
   
  })
  .controller('investorView', function ($scope, $http, $location, local, $filter, $rootScope, RequestDetail, localStorageService, $routeParams, alertService, configdetails, $sce) {
    $scope.configdetails = configdetails;
    $scope.spinnerActive = true;
    $scope.emails = [];
    if (localStorageService.get('usertype') == 'corporate') {
      $scope.pageHeading = 'Investor list';
    } else {
      $scope.pageHeading = 'Distribution list';
    }



    $scope.activetab = 0;

    $scope.changeactive = function (index) {
      $scope.activetab = index;
    };




    $scope.dasboardActive = 'active';
    $scope.userDetailFull = {};
    $scope.industryTags = {};
    $scope.userContacts = {};
    $scope.userColleagues = {};
    var contactids = localStorageService.get('contact_user');
    var contact_user_type = localStorageService.get('contact_user_type');
    var url = 'apiv4/public/dashboard/getInvestorDetails';
    var params = {
      user_id: $routeParams.userId
    };
    if (angular.isDefined(contactids) && contactids != '') {
      params.contactIds = contactids;
    }
    if (angular.isDefined(contact_user_type) && contact_user_type == 'mi') {
      params.type = contact_user_type;
    }

    RequestDetail.getDetail(url, params).then(function (result) {
      $scope.userContacts = [];
      if (angular.isDefined(result.data)) {
        if (angular.isDefined(result.data.user_details)) {
          $scope.userDetailFull = result.data.user_details;
        }



        if (angular.isDefined($scope.userDetailFull.videourl) && $scope.userDetailFull.videourl != null && $scope.userDetailFull.videourl != "") {
          $scope.showvideo = true;
        } else {
          $scope.showvideo = false;
        }

        $scope.showvideopopupModal = false;
        $scope.togglevideopopupModal = function () {
          //  ******************** To avoid the api calling second time in same page Store in the variable and fetched the data ising $index value
          //$scope.values = $scope.FetchedData.items[index];
          // Assign the values to the variables



          $scope.showvideopopupModal = !$scope.showvideopopupModal;

        };

        $scope.trustSrc = function () {
          return $sce.trustAsResourceUrl($scope.userDetailFull.videourl);
        }


        $scope.newMeeting = function (user_id) {

          if (angular.isDefined(user_id) && user_id != '') {
            var url = 'apiv4/public/dashboard/encrypt_id';
            var params = {
              user_id: user_id
            };
            RequestDetail.getDetail(url, params).then(function (result) {
              $location.path('meeting/new/' + result.data);
            });
          } else {
            $location.path('meeting/new/');
          }
        }




        if (angular.isDefined(result.data.industry_tags)) {
          $scope.industryTags = result.data.industry_tags;
        }
        if (angular.isDefined(result.data.user_contacts)) {
          if (angular.isDefined(result.data.user_contacts) && result.data.user_contacts.length > 0) {
            angular.forEach(result.data.user_contacts, function (con, ind) {
              if (angular.isDefined(con) && angular.isDefined(con.firstname) && con.firstname != '' && con.firstname != 'null' && con.firstname != null) {
                $scope.userContacts.push(con);
              }
            });
          }
        }
        if (angular.isDefined(result.data.user_colleagues)) {
          $scope.userColleagues = result.data.user_colleagues;
        }
      }

      $scope.collapse = false;
      $scope.collapses = function () {
        $scope.collapse = !$scope.collapse;
      }
      // COLUMN TO SORT
      $scope.column = 'sno';

      // SORT ORDERING (ASCENDING OR DESCENDING). SET TRUE FOR DESENDING
      $scope.reverse = false;

      // CALLED ON HEADER CLICK
      $scope.sortColumn = function (col) {
        $scope.column = col;
        if ($scope.reverse) {
          $scope.reverse = false;
          $scope.reverseclass = 'arrow-up';
        } else {
          $scope.reverse = true;
          $scope.reverseclass = 'arrow-down';
        }
      };


      $scope.sortClass = function (col) {
        if ($scope.column == col) {
          if ($scope.reverse) {
            return 'arrow-down';
          } else {
            return 'arrow-up';
          }
        } else {
          return '';
        }
      };

      // $scope.getUser = function(items){
      //     if(angular.isDefined(items) && angular.isDefined(items.user_id) && angular.isDefined(items.user_type)){
      //       if(items.user_type=='1'){
      //     $rootScope.searchUserId = items.user_id;
      //     localStorageService.set('contact_user','');
      //     localStorageService.set('contact_user_type','');
      //     if(angular.isDefined(items.contact_id) && items.contact_id!=''){
      //       localStorageService.set('contact_user',items.contact_id);  
      //       if(angular.isDefined(items.user_detail) && items.user_detail=='masters'){
      //         localStorageService.set('contact_user_type','mi');  
      //       }
      //     }
      //     $location.path('investor/'+items.user_id);
      //   }else if(items.user_type=='2'){
      //     $rootScope.searchUserId = items.user_id;
      //     localStorageService.set('contact_user','');
      //     localStorageService.set('contact_user_type','');
      //     if(angular.isDefined(items.contact_id) && items.contact_id!=''){
      //       localStorageService.set('contact_user',items.contact_id);  
      //       if(angular.isDefined(items.user_detail) && items.user_detail=='masters'){
      //         localStorageService.set('contact_user_type','mc');  
      //       }
      //     }
      //     $location.path('corporate/'+items.user_id);

      //   }
      //   else if(items.user_type=='3'){
      //     $rootScope.searchUserId = items.user_id;
      //     localStorageService.set('contact_user','');
      //     localStorageService.set('contact_user_type','');
      //     if(angular.isDefined(items.contact_id) && items.contact_id!=''){
      //       localStorageService.set('contact_user',items.contact_id);  
      //       if(angular.isDefined(items.user_detail) && items.user_detail=='masters'){
      //         localStorageService.set('contact_user_type','mb');  
      //       }
      //     }

      //     $location.path('broker/'+items.user_id);
      //   }
      //     }
      //   }
      $scope.spinnerActive = false;
    });

  })
  .controller('editInvestors', function ($scope, $interval, $http, $location, local, $filter, $rootScope, RequestDetail, $routeParams, alertService, localStorageService, $timeout, configdetails) {
    $scope.configdetails = configdetails;
    $scope.emails = [];
    $scope.errorthrow = {};
    if (localStorageService.get('usertype') == 'corporate') {
      $scope.pageHeading = "Investor  Group Contact's";
    } else {
      $scope.pageHeading = "Distribution  Group Contact's";
    }
    $scope.dasboardActive = 'active';
    $scope.userDetailFull = '';
    $scope.updateButton = true;
    $scope.users = [];

    $scope.investorListId = $routeParams.investorListId;

    function chunk(arr, size) {
			var newArr = [];
			for (var i = 0; i < arr.length; i += size) {
				newArr.push(arr.slice(i, i + size));
			}
			return newArr;
    }


      var url = 'apiv4/public/dashboard/editInvestorDetails';
      var params = {
        user_id:  $scope.investorListId
      };
      $scope.spinnerActive = true;
      RequestDetail.getDetail(url, params).then(function (result) {
        if (result.data) {
          
          var usersdata = [];

          angular.forEach(result.data['contacts'], function (todo, key) {

            //result.data['contacts'][key].id = key + 1;
            var pushdata = new Object();

            var tickers = '';
            if (todo.tickers) {
              tickers = todo.tickers;
            }

            var sectors = [];
            if (todo.sectors) {
              sectors = todo.sectors.split(',');
            }

            var industries = [];
            if (todo.industries) {
              industries = todo.industries.split(',');
            }

            pushdata = {
              company: todo.company,
              firstname: todo.firstname,
              lastname: todo.lastname,
              fundname: todo.fundname,
              title: todo.title,
              office_phone: todo.officephone,
              phone: todo.phone,
              email: todo.email,
              tickers: tickers,
              sectors: sectors,
              industries: industries,
              salesperson: todo.salesperson,
              tickers_text: todo.tickers,
              sectors_text: todo.sectors,
              industries_text: todo.industries,
              assistant_firstname: todo.assistfirstname,
              assistant_lastname: todo.assistlastname,
              assistant_phone: todo.assistphone,
              assistant_email: todo.assistemail,
              address1: todo.address1,
              address2: todo.address2,
              city: todo.city,
              state: todo.state,
              region: todo.region,
              country: todo.country,
              zip: todo.zip,
              customer_type: todo.customer_type,
              customer_style: todo.customer_style,
              customer_size: todo.customer_size,
              join: new Date(todo.join_date),
              investor_contacts_id: todo.investor_contacts_id,
            }
            $scope.emails.push(todo.email);
            usersdata.push(pushdata);
          });

          $scope.investorListName = result.data['groupname'];
          $scope.hiddeninvestorListName = result.data['groupname'];
          
          $scope.users = usersdata;
          $scope.loadMore();
        }
      // $scope.spinnerActive = false;
        // $scope.spinnerActive = false;
        
      });
    
    

    $scope.investorListchange = function () {
      var url = 'apiv4/public/dashboard/editInvestorDetails';
      var params = {
        user_id:  $scope.investorListId
      };
      $scope.spinnerActive = true;
      RequestDetail.getDetail(url, params).then(function (result) {
        if (result.data) {
          
          var usersdata = [];

          angular.forEach(result.data['contacts'], function (todo, key) {

            //result.data['contacts'][key].id = key + 1;
            var pushdata = new Object();

            var tickers = '';
            if (todo.tickers) {
              tickers = todo.tickers;
            }

            var sectors = [];
            if (todo.sectors) {
              sectors = todo.sectors.split(',');
            }

            var industries = [];
            if (todo.industries) {
              industries = todo.industries.split(',');
            }

            pushdata = {
              company: todo.company,
              firstname: todo.firstname,
              lastname: todo.lastname,
              fundname: todo.fundname,
              title: todo.title,
              office_phone: todo.officephone,
              phone: todo.phone,
              email: todo.email,
              tickers: tickers,
              sectors: sectors,
              industries: industries,
              salesperson: todo.salesperson,
              tickers_text: todo.tickers,
              sectors_text: todo.sectors,
              industries_text: todo.industries,
              assistant_firstname: todo.assistfirstname,
              assistant_lastname: todo.assistlastname,
              assistant_phone: todo.assistphone,
              assistant_email: todo.assistemail,
              address1: todo.address1,
              address2: todo.address2,
              city: todo.city,
              state: todo.state,
              region: todo.region,
              country: todo.country,
              zip: todo.zip,
              customer_type: todo.customer_type,
              customer_style: todo.customer_style,
              customer_size: todo.customer_size,
              join: new Date(todo.join_date),
              investor_contacts_id: todo.investor_contacts_id,
            }
            $scope.emails.push(todo.email);
            usersdata.push(pushdata);
          });

          $scope.investorListName = result.data['groupname'];
          $scope.hiddeninvestorListName = result.data['groupname'];
          
          $scope.users = usersdata;
          $scope.loadMore();
        }
      // $scope.spinnerActive = false;
        // $scope.spinnerActive = false;
        
      });
    }

    

    $scope.investorsList = [];

    $scope.getList = function () {
      var GetInvestorsListUrl = 'apiv4/public/dashboard/getInvestorsList';
      var params = {
        type: 'get'
      };

      RequestDetail.getDetail(GetInvestorsListUrl, params).then(function (result) {
        $scope.investorsList = result.data;
      });
    }

    $scope.getList();


    $scope.InvestorNew = function (listId) {
      $location.path('investors/new/' + listId);
    }
    $scope.InvestorEdit = function (listId) {
      $location.path('investors/edit/' + listId);
    }
    $scope.InvestorView = function (listId) {
      $location.path('investors/view/' + listId);
    }
    $scope.removeGroup = function (id, index) {
      if (angular.isDefined(id) && id != '') {
        $('#confirmation').modal('show');
        $scope.confirmation = true;
        $('#hidden_id').val(id);
      } else {
        var id = $('#hidden_id').val();
        var url = 'apiv4/public/dashboard/removeContactGroup';
        var params = {
          type: 'post',
          values: id
        };
        RequestDetail.getDetail(url, params).then(function (result) {
          if (result.data == 0) {
            $scope.getList();
            $('#confirmation').modal('hide');
            $scope.confirmation = false;
            alertService.add("success", 'Removed group Successfully !', 2000);
          }
        });
      }
    }

    $scope.closemodel = function () {
      $scope.confirmation = false;
    }

    $scope.availableIndustry = [];
    $scope.availableIndustry_sector = [];
    var tagUrl = 'apiv4/public/user/get_industries_Mid_macro';
    RequestDetail.getDetail(tagUrl, params).then(function (result) {
      if (angular.isDefined(result.data)) {
        $scope.availableIndustry = result.data.industries_macro;
        $scope.industriesfilters = result.data.industriesfilters;
        $scope.availableIndustry_sector = result.data.industries_sectors;
      } else {
        $scope.availableIndustry = [];
        $scope.availableIndustry_sector = [];
      }
    });

    $scope.get_search_details = function (type, searchkey, industype) {
      if (angular.isDefined(searchkey) && searchkey != '') {
        if (type != '') {
          var tagUrl = 'apiv4/public/user/get_search_details1';
          var searchterm = searchkey;

          if (type == 'industry') {
            var params = {
              term: searchterm,
              key: type,
              industype: industype
            };
            RequestDetail.getDetail(tagUrl, params).then(function (result) {
              if (angular.isDefined(result.data) && result.data.length > 0) {
                $scope.availableIndustry = result.data;
                if (industype == 'sectors') {
                  $scope.availableIndustry_sector = result.data;
                }
              } else {
                $scope.availableIndustry = [];
                if (industype == 'sectors') {
                  $scope.availableIndustry_sector = [];
                }
              }
            });
          }

          if (type == 'ticker') {
            var params = searchterm;
            var tagUrl = 'apiv4/public/dashboard/get_auto_ticker_stock';
            RequestDetail.getDetail(tagUrl, params).then(function (result) {
              if (angular.isDefined(result.data) && result.data.length > 0) {
                $scope.availableTickers = result.data;
              } else {
                $scope.availableTickers = [];
              }
            });
          }

        }
      }
    }

    $scope.validateEmail= function (email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
        return re.test(email);
    };

    var editdata = $location.path();
    editdata = editdata.indexOf('view');
    $scope.editinvdata = editdata > -1 ? false : true;
    $scope.collapsebut = true;
    $scope.checkName = function (data, form, row) {
      if ($scope.validateEmail(data)) {
        form.$setError('email', '');
        var cls = "cls_" + row;
        $scope.errorthrow[cls] = false;
      } else {
        var msg = "Required Mail-Id";
        form.$setError('email', msg);
        return msg;
      }
    };

    $scope.collapse = false;
    $scope.collapses = function () {
      $scope.collapse = !$scope.collapse;
    }


    $scope.show_dashboard = function () {

      $location.path('dashboard');
    }

    // COUNT TO DISPLAY
    $scope.totalDisplayed = 2;
    $scope.incrementDisplayed = 100;

    // COLUMN TO SORT
    $scope.column = 'sno';

    // SORT ORDERING (ASCENDING OR DESCENDING). SET TRUE FOR DESENDING
    $scope.reverse = false;

    // CALLED ON HEADER CLICK
    $scope.sortColumn = function (col) {
      $scope.column = col;
      if ($scope.reverse) {
        $scope.reverse = false;
        $scope.reverseclass = 'arrow-up';
      } else {
        $scope.reverse = true;
        $scope.reverseclass = 'arrow-down';
      }
    };


    $scope.sortClass = function (col) {
      if ($scope.column == col) {
        if ($scope.reverse) {
          return 'arrow-down';
        } else {
          return 'arrow-up';
        }
      } else {
        return '';
      }
    };

    //LAZY LOADER
    var stop;
    $scope.loadMore = function () {
      // Don't start a new fight if we are already fighting
      if (angular.isDefined(stop)) return;

      stop = $interval(function () {
        $scope.totalDisplayed += $scope.incrementDisplayed;
        if ($scope.totalDisplayed > $scope.users.length) {
          $scope.spinnerActive = false;
          $scope.stoploadMore();
        }
      }, 2000);
    };

    $scope.stoploadMore = function () {
      if (angular.isDefined(stop)) {
        $interval.cancel(stop);
        stop = undefined;
      }
    };

    //Remove User In DB after Confirmation   By Jayapriya  on 23-01-2019
    $scope.removeUserPermanent = function (x, investor_contacts_id) {
      $scope.spinnerActive = true;
      var isConfirmed = confirm("Are you sure you want to remove this record?");
      if (isConfirmed) {
        var url = 'apiv4/public/dashboard/removeUserInvestorPermanent';
        var params = {
          investor_contacts_id: investor_contacts_id,

        };
        RequestDetail.getDetail(url, params).then(function (result) {
          if (result.data == 1) {
            alertService.add("success", "Contact User Details Removed Successfully  !", 2000);
            /* $scope.users.splice(index, 1);
            $scope.emails.splice(index, 1); */

            $scope.spinnerActive = false;

            angular.forEach($scope.users, function (value, index) {
              if (x.firstname == value.firstname) {
                $scope.users.splice(index, 1);
              }
            });
          } else {
            alertService.add("warning", "Contact User Details already Removed !", 5000);
            return false;
          }
        });

        /* $scope.users.splice(index, 1);
        $scope.emails.splice(index, 1); */
      } else {
        return false;
      }
    };

    // remove user
    $scope.removeUser = function (index, investor_contacts_id) {
      $scope.users.splice(index, 1);
      $scope.emails.splice(index, 1);
      angular.forEach($scope.users, function (todo, key) {
        var cls = "cls_" + key;
        $scope.errorthrow[cls] = false;
      });
    };

    // add user
    $scope.addUser = function () {
      var length = $scope.users.length - 1;


      if ($scope.users.length >= 1) {
        if (!$scope.users[length].email) {
          alertService.add("warning", "Please add previous Investor !", 5000);
          return false;
        }
      }
      $scope.inserted = {
        id: $scope.users.length + 1,
        name: '',
        status: null,
        group: null
      };
      $scope.users.push($scope.inserted);
      var ele_test = 'email' + (parseInt($scope.inserted.id) - 2) + ' td:nth-child(2) input';
      /* $('#'+ele_test).css('border','4px solid red'); */
      $('#' + ele_test).focus();
    };
    $scope.checkfName = function (data, form) {
      if (data) {
        form.$setError('firstname', '');
      } else {
        var msg = "Required firstname";
        form.$setError('firstname', msg);
        return msg;
      }
    };
    $scope.updateInvestorList = function () {

      if ($scope.investorListName == '') {
        alertService.add("warning", "Group name cannot be empty !", 5000);
        $scope.error.required = 'required_input';
        return false;
      } else if ($scope.users == '') {
        alertService.add("warning", "Should enter atleast one investor detail !", 5000);
        return false;
      }

      if ($scope.users.length > 5000) {
        alertService.add("warning", "Contacts should not be more then 5000 !", 5000);
       // return false;
      }
      if ($scope.emails.length > 5000) {
        alertService.add("warning", "Contacts should not be more then 5000 !", 5000);
       // return false;
      }


      if (angular.isDefined($scope.users) && $scope.users != '') {

        $scope.email_ids = [];

        $scope.emails = [];
        var initgo = 0;
        angular.forEach($scope.users, function (todo, key) {
          $scope.emails.push(todo.email);

          var cls = "cls_" + key;
          $scope.errorthrow[cls] = false;
          if ($scope.checkmailid(todo.email)) {
            $scope.errorthrow[cls] = true;
            initgo++;
          }

        });
        if (initgo > 0) {
          alertService.add("warning", "Kindly check Mail-Id is a not valid!", 5000);
          return false;
        }
        var duplicates = [];
        for (var i = 0; i < $scope.emails.length; i++) {
          if (duplicates.hasOwnProperty($scope.emails[i])) {
            duplicates.push(i);
          } else if ($scope.emails.lastIndexOf($scope.emails[i]) !== i) {
            duplicates.push(i);
          }
         
          //console.log(duplicates);

          $('#email' + i).removeClass('duplicate_email');
        }

        if (duplicates.length != 0) {
          for (var j = 0; j < duplicates.length; j++) {
            $('#email' + duplicates[j]).addClass('duplicate_email');
          }

          alertService.add("warning", "Email id already added!", 5000);
          return false;
        }

      }

      if ($scope.users.length > 5000) {
        alertService.add("warning", "Contacts should not be more then 5000 !", 5000);
        //return false;
      }
      if ($scope.emails.length > 5000) {
        alertService.add("warning", "Contacts should not be more then 5000 !", 5000);
        //return false;
      }

      var url = 'apiv4/public/dashboard/updateInvestor';
      var params = {
        user_id: $scope.users,
        edit_id: $routeParams.investorListId,
        investername: $scope.investorListName,
        hiddeninvestorListName: $scope.hiddeninvestorListName
      };
      RequestDetail.getDetail(url, params).then(function (result) {

        if (result.data != "" && result.data == 0) {
          alertService.add("success", "Distribution Group Updated Successfully  !", 2000);
          $timeout(function () {
            $location.path('investors/list');
          }, 1000);
        } else {
          alertService.add("warning", "Distribution Group name already taken !", 5000);
          return false;
        }
      });
    }

    $scope.import_investor_vcard = function (data) {

      var userdata = [];
      var data1 = JSON.parse(data);
      if (data1.error) {
        alertService.add("warning", "File Format is wrong Try again!", 5000);
        alert('File Format is wrong Try again!');
        return false;
      } else {
        if ($scope.users.length == '0') {
          $scope.users = [];
        }
        if (angular.isDefined(data) && data != '') {
          var data = JSON.parse(data);
          var usersdata = [];
          angular.forEach(data, function (todo, key) {
            var pushdata = new Object();
            var tickers = '';
            if (todo.Tickers) {
              tickers = todo.Tickers;
            }

            var sectors = '';
            if (todo.Sectors) {
              sectors = todo.Sectors;
            }

            var industries = '';
            if (todo.Industries) {
              industries = todo.Industries;
            }
            pushdata = {
              company: todo.company,
              firstname: todo.firstname,
              lastname: todo.lastname,
              fundname: todo.fundname,
              title: todo.title,
              office_phone: todo.officephone,
              phone: todo.phone,
              email: todo.email,
              tickers: tickers,
              sectors: sectors,
              industries: industries,
              salesperson: todo.salesperson,
              assistant_firstname: '',
              assistant_lastname: '',
              assistant_phone: '',
              assistant_email: '',
              address1: todo.address1,
              address2: todo.address2,
              city: todo.city,
              state: todo.state,
              region: todo.region,
              country: todo.country,
              zip: todo.zip,
              customer_type: todo.customer_type,
              customer_style: todo.customer_style,
              customer_size: todo.customer_size,
              join: new Date(todo.join_date),
            }
            if ($scope.find_duplicatemail(todo.email)) {
              $scope.$apply(function () {
                $scope.users.push(pushdata);
                $scope.emails.push(todo.email);
              });
            } else {
              alertService.add("warning", "File Format is wrong Try again!", 5000);
              return false;
            }
          });

        } else {
          alertService.add("warning", "File Format is wrong Try again!", 5000);
          return false;
        }
      }
    }
    $scope.checkmailid = function (email) {
      var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if (filter.test(email)) {
        return false;
      } else {
        return true;
      }
    }
    // Investor Import Excel File 
    $scope.import_investor_excel = function (data) {
      if ($scope.users.length == '0') {
        $scope.users = [];
      }
      var data1 = JSON.parse(data);
      if (data1.error) {
        alertService.add("warning", "File Format is wrong Try again!", 5000);
        alert('File Format is wrong Try again!');
        $scope.spinnerActive = false;
        return false;
      } else {
        if (angular.isDefined(data) && data != '') {
          var usersdata = [];
          data = JSON.parse(data);
          if ($scope.emails.length == '0') {
            $scope.emails = [];
          }

          angular.forEach(data, function (todo, key) {
            var pushdata = new Object();
            var tickers = '';
            if (todo.Tickers) {
              tickers = todo.Tickers;;
            }

            var sectors = [];
            if (todo.Sectors) {
              sectors = todo.Sectors.split(',');;
            }

            var industries =[];
            if (todo.Industries) {
              industries = todo.Industries.split(',');;
            }
            pushdata = {
              company: todo.FirmName,
              firstname: todo.FirstName,
              lastname: todo.LastName,
              fundname: todo.FundName,
              title: todo.Title,
              office_phone: todo.OfficePhone,
              phone: todo.CellPhone,
              email: todo.Email.replace("'", "").trim(),
              tickers: tickers,
              sectors: sectors,
              industries: industries,
              city: todo.City,
              state: todo.State,
              region: todo.Region,
              country: todo.Country,
              salesperson: todo.salesperson,
              assistant_firstname: todo.AssistantFirstName,
              assistant_lastname: todo.AssistantLastName,
              assistant_phone: todo.AssistantPhone,
              assistant_email: todo.AssistantEmail,
              address1: todo.Address1,
              address2: todo.Address2,
              zip: todo.Zip,
              customer_type: todo.customer_type,
              customer_style: todo.customer_style,
              customer_size: todo.customer_size,
              join: new Date(),
            }
            if ($scope.find_duplicatemail(todo.Email)) {
              $scope.$apply(function () {
                $scope.users.push(pushdata);
                $scope.emails.push(todo.Email);
              });
            }
          });
        } else {
          alertService.add("warning", "File Format is wrong Try again!", 5000);
          return false;
        }
      }
    }
    $scope.find_duplicatemail = function (data) {
      if ($scope.emails && $scope.emails.length > 0) {
        var dupl = 0;
        angular.forEach($scope.emails, function (todo, key) {
          if (todo == data) {
            dupl++;
          }
        });
        if (dupl == 0) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    }
    $scope.con_init = function () {
      $scope.datepickersOptions = {
        minDate: new Date('2010-05-01'),
        initDate: new Date()
      };
    }

    $scope.date_picker_opened = [];

    $scope.date_picker_open = function (index) {
      $timeout(function () {
        $scope.date_picker_opened[index] = true;
      });
    }

    $scope.clearUser = function (index) {
      $scope.users = [];
      $scope.emails = [];
    }
  })
  .controller('editInvestorscontact', function ($scope, $interval, $http, $location, local, $filter, $rootScope, RequestDetail, $routeParams, alertService, localStorageService, $timeout, configdetails, $route) {
    $scope.configdetails = configdetails;
    $scope.emails = [];
    $scope.errorthrow = {};
    if (localStorageService.get('usertype') == 'corporate') {
      $scope.pageHeading = "Investor  Group Contact's";
    } else {
      $scope.pageHeading = "Distribution  Group Contact's";
    }
    $scope.dasboardActive = 'active';
    $scope.userDetailFull = '';
    $scope.updateButton = true;
    $scope.users = [];

    $scope.investorListId = $routeParams.investorListId;

    function chunk(arr, size) {
			var newArr = [];
			for (var i = 0; i < arr.length; i += size) {
				newArr.push(arr.slice(i, i + size));
			}
			return newArr;
    }

    $scope.searchtxtresult1 = '';

    $scope.openmodelpagehelp = function() {
      $scope.showModalpageinfo=!$scope.showModalpageinfo;
   }


      $scope.agencystatus = 0;
      $scope.agencytickers = [];

      var userdata = localStorageService.get('userdata');

      $scope.user_type = userdata.user_type;

      if (userdata.agencyid) {
        $scope.agencyid = userdata.agencyid;
      }

      if (userdata.agencystatus) {
        $scope.agencystatus = userdata.agencystatus;
      }

      $scope.loadmorestatus = 1;

      $scope.getlist = function (count) {

        $scope.searchtxtresult1 = '';

        if(count==1){
          $scope.users = [];
          $scope.loadmorestatus = 1;
        }

        var url = 'apiv4/public/dashboard/editInvestorcontactDetails';
        var params = {
          investorListId:  $scope.investorListId,
          page: count,
          searchtext: $scope.searchtxt
        };
        
        

        $scope.spinnerActive = true;
        RequestDetail.getDetail(url, params).then(function (result) {
          if (result.data) {

            if($scope.searchtxt){
              $scope.searchtxtresult1 = $scope.searchtxt;
            }
            
            var usersdata = [];

            angular.forEach(result.data['contacts'], function (todo, key) {

              //result.data['contacts'][key].id = key + 1;
              var pushdata = new Object();

              var tickers = '';
              if (todo.tickers) {
                tickers = todo.tickers;
              }

              var sectors = [];
              if (todo.sectors) {
                sectors = todo.sectors.split(',');
              }

              var industries = [];
              if (todo.industries) {
                industries = todo.industries.split(',');
              }

              pushdata = {
                company: todo.company,
                firstname: todo.firstname,
                lastname: todo.lastname,
                fundname: todo.fundname,
                title: todo.title,
                office_phone: todo.officephone,
                phone: todo.phone,
                email: todo.email,
                tickers: tickers,
                sectors: sectors,
                industries: industries,
                salesperson: todo.salesperson,
                tickers_text: todo.tickers,
                sectors_text: todo.sectors,
                industries_text: todo.industries,
                assistant_firstname: todo.assistfirstname,
                assistant_lastname: todo.assistlastname,
                assistant_phone: todo.assistphone,
                assistant_email: todo.assistemail,
                address1: todo.address1,
                address2: todo.address2,
                city: todo.city,
                state: todo.state,
                region: todo.region,
                country: todo.country,
                zip: todo.zip,
                customer_type: todo.customer_type,
                customer_style: todo.customer_style,
                customer_size: todo.customer_size,
                join: new Date(todo.join_date),
                investor_contacts_id: todo.investor_contacts_id,
                investor_list_contacts_id: todo.investor_list_contacts_id
              }
              $scope.emails.push(todo.email);
              usersdata.push(pushdata);
              $scope.users.push(pushdata);
            });

            if(count==1){
              $scope.total_count = result.data.total_count;
              $scope.count = $scope.count+1;
            }
            $scope.total_contacts = result.data.total_contacts;

            $scope.loadmorecount = result.data.page;


            if($scope.total_count >= result.data.page){
                //$scope.getlist(result.data.page);
               
            }else{
              $scope.loadmorestatus = 0;
            }

            $scope.investorListName = result.data['groupname'];
            $scope.hiddeninvestorListName = result.data['groupname'];
            
           
            $scope.spinnerActive = false;
            //$scope.loadMore();
          }
        // $scope.spinnerActive = false;
          // $scope.spinnerActive = false;
          
        });
      }

      

      $scope.getlist(1);

      
      $scope.clearcontactssearch = function () {
        $scope.searchtxt = '';
        $scope.searchtxtresult1 = '';
        $scope.getlist(1);
      };
      
    
    $scope.investornotesusers = [];
    $scope.searchtxtresult = '';
    $scope.searchinvestornotecontacts = function () {
      var url = 'apiv4/public/dashboard/searchinvestornotecontacts';
      var params = {
        searchtxt:  $scope.searchtxt,
        investor_list_id:  $scope.investorListId
      };
      RequestDetail.getDetail(url, params).then(function (result) {
        $scope.searchtxtresult = $scope.searchtxt;
        $scope.investornotesusers = result.data;
      });
    }

    
    $scope.closeinvestornotessearch = function () {
      $scope.searchtxtresult = '';
    }

    $scope.addtoinvestorlist = function (user,index) {
      var url = 'apiv4/public/dashboard/addtoinvestorlist';
      var params = {
        investor_contacts_id:  user.investor_contacts_id,
        investor_list_id:  $scope.investorListId
      };
      RequestDetail.getDetail(url, params).then(function (result) {
        $scope.investornotesusers.splice(index, 1);
        
        if(result.data.investor_list_contacts_id){
          user['investor_list_contacts_id'] = result.data.investor_list_contacts_id;
          $scope.users.push(user);
          $scope.emails.push(user.email);
          $scope.getlist(1);
        }

      });
    }

    $scope.importstashcontacts = function () {
      $scope.spinnerActive = true;
      var url = 'apiv4/public/dashboard/importstashcontacts';
      var params = {
        investor_list_id:  $scope.investorListId
      };
      RequestDetail.getDetail(url, params).then(function (result) {
        $scope.getlist(1);
      });
    }

    $scope.importresearchcontacts = function () {
      $scope.spinnerActive = true;
      var url = 'apiv4/public/dashboard/importresearchcontacts';
      var params = {
        investor_list_id:  $scope.investorListId
      };
      RequestDetail.getDetail(url, params).then(function (result) {
        $scope.getlist(1);
      });
    }

    $scope.investorListchange = function () {
      var url = 'apiv4/public/dashboard/editInvestorcontactDetails';
      var params = {
        investorListId:  $scope.investorListId,
        page: 1,
      };
      $scope.spinnerActive = true;
      RequestDetail.getDetail(url, params).then(function (result) {
        if (result.data) {
          
          var usersdata = [];

          angular.forEach(result.data['contacts'], function (todo, key) {

            //result.data['contacts'][key].id = key + 1;
            var pushdata = new Object();

            var tickers = '';
            if (todo.tickers) {
              tickers = todo.tickers;
            }

            var sectors = [];
            if (todo.sectors) {
              sectors = todo.sectors.split(',');
            }

            var industries = [];
            if (todo.industries) {
              industries = todo.industries.split(',');
            }

            pushdata = {
              company: todo.company,
              firstname: todo.firstname,
              lastname: todo.lastname,
              fundname: todo.fundname,
              title: todo.title,
              office_phone: todo.officephone,
              phone: todo.phone,
              email: todo.email,
              tickers: tickers,
              sectors: sectors,
              industries: industries,
              salesperson: todo.salesperson,
              tickers_text: todo.tickers,
              sectors_text: todo.sectors,
              industries_text: todo.industries,
              assistant_firstname: todo.assistfirstname,
              assistant_lastname: todo.assistlastname,
              assistant_phone: todo.assistphone,
              assistant_email: todo.assistemail,
              address1: todo.address1,
              address2: todo.address2,
              city: todo.city,
              state: todo.state,
              region: todo.region,
              country: todo.country,
              zip: todo.zip,
              customer_type: todo.customer_type,
              customer_style: todo.customer_style,
              customer_size: todo.customer_size,
              join: new Date(todo.join_date),
              investor_contacts_id: todo.investor_contacts_id,
              investor_list_contacts_id: todo.investor_list_contacts_id
            }
            $scope.emails.push(todo.email);
            usersdata.push(pushdata);
          });

          $scope.investorListName = result.data['groupname'];
          $scope.hiddeninvestorListName = result.data['groupname'];
          
          $scope.users = usersdata;
          $scope.loadMore();
          
        }
      // $scope.spinnerActive = false;
        // $scope.spinnerActive = false;
        
      });
    }

    

    $scope.investorsList = [];

    $scope.getList = function () {
      var GetInvestorsListUrl = 'apiv4/public/dashboard/getInvestorsList';
      var params = {
        type: 'get'
      };

      RequestDetail.getDetail(GetInvestorsListUrl, params).then(function (result) {
        $scope.investorsList = result.data;
      });
    }

    $scope.getList();


    $scope.availableIndustry = [];
    $scope.availableIndustry_sector = [];
    var tagUrl = 'apiv4/public/user/get_industries_Mid_macro';
    var params = {};
    RequestDetail.getDetail(tagUrl, params).then(function (result) {
      if (angular.isDefined(result.data)) {
        $scope.availableIndustry = result.data.industries_macro;
        $scope.industriesfilters = result.data.industriesfilters;
        $scope.availableIndustry_sector = result.data.industries_sectors;
      } else {
        $scope.availableIndustry = [];
        $scope.availableIndustry_sector = [];
      }
    });

    $scope.get_search_details = function (type, searchkey, industype) {
      if (angular.isDefined(searchkey) && searchkey != '') {
        if (type != '') {
          var tagUrl = 'apiv4/public/user/get_search_details1';
          var searchterm = searchkey;

          if (type == 'industry') {
            var params = {
              term: searchterm,
              key: type,
              industype: industype
            };
            RequestDetail.getDetail(tagUrl, params).then(function (result) {
              if (angular.isDefined(result.data) && result.data.length > 0) {
                $scope.availableIndustry = result.data;
                if (industype == 'sectors') {
                  $scope.availableIndustry_sector = result.data;
                }
              } else {
                $scope.availableIndustry = [];
                if (industype == 'sectors') {
                  $scope.availableIndustry_sector = [];
                }
              }
            });
          }

          if (type == 'ticker') {
            var params = searchterm;
            var tagUrl = 'apiv4/public/dashboard/get_auto_ticker_stock';
            RequestDetail.getDetail(tagUrl, params).then(function (result) {
              if (angular.isDefined(result.data) && result.data.length > 0) {
                $scope.availableTickers = result.data;
              } else {
                $scope.availableTickers = [];
              }
            });
          }

        }
      }
    }

    var editdata = $location.path();
    editdata = editdata.indexOf('view');
    $scope.editinvdata = editdata > -1 ? false : true;
    $scope.collapsebut = true;

     
    $scope.checkName = function (data, form, row) {
      if ($scope.validateEmail(data)) {
        form.$setError('email', '');
        var cls = "cls_" + row;
        $scope.errorthrow[cls] = false;
      } else {
        var msg = "Required Mail-Id";
        form.$setError('email', msg);
        return msg;
      }
    };

    $scope.collapse = false;
    $scope.collapses = function () {
      $scope.collapse = !$scope.collapse;
    }

    // COUNT TO DISPLAY
    $scope.totalDisplayed = 2;
    $scope.incrementDisplayed = 100;

    // COLUMN TO SORT
    $scope.column = 'sno';

    // SORT ORDERING (ASCENDING OR DESCENDING). SET TRUE FOR DESENDING
    $scope.reverse = false;

    // CALLED ON HEADER CLICK
    $scope.sortColumn = function (col) {
      $scope.column = col;
      if ($scope.reverse) {
        $scope.reverse = false;
        $scope.reverseclass = 'arrow-up';
      } else {
        $scope.reverse = true;
        $scope.reverseclass = 'arrow-down';
      }
    };


    $scope.sortClass = function (col) {
      if ($scope.column == col) {
        if ($scope.reverse) {
          return 'arrow-down';
        } else {
          return 'arrow-up';
        }
      } else {
        return '';
      }
    };

    //LAZY LOADER
    var stop;
    $scope.loadMore = function () {
      // Don't start a new fight if we are already fighting
      if (angular.isDefined(stop)) return;

      stop = $interval(function () {
        $scope.totalDisplayed += $scope.incrementDisplayed;
        if ($scope.totalDisplayed > $scope.users.length) {
          
          $scope.stoploadMore();
        }
      }, 2000);
    };

    $scope.stoploadMore = function () {
      if (angular.isDefined(stop)) {
        $interval.cancel(stop);
        stop = undefined;
      }
    };

    
   
    $scope.checkmailid = function (email) {
      var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if (filter.test(email)) {
        return false;
      } else {
        return true;
      }
    }


    
    $scope.Openpopupcustomlist = function () {
      $scope.showModaladdcontacts = true;
    }

    $scope.closeaddcontacts = function () {
      $scope.showModaladdcontacts = false;
    }

    $scope.addcontact = {};

    $scope.invalid_list_emails = [];

    $scope.addContacts = function () {
      $scope.spinnerActive = true; 
      if($scope.addcontact.contacts){
        $scope.addcontact.contacts = $scope.addcontact.contacts.replace(/\n/g, ",");
        $scope.addcontact.contacts = $scope.addcontact.contacts.replace(/\s/g, '').trim();

        if($scope.addcontact.contacts){
          var emails_array = $scope.addcontact.contacts.split(',');
          $scope.addnewContacts(emails_array);
        }

      }else{
          alertService.add("warning", "Email cannot be empty !", 5000);
          return false;
      }
      $scope.getlist(1);
      $scope.spinnerActive = false; 
      
    }

    

    $scope.invalidemailval = function (invalid_emails) {
      if(!isEmail(invalid_emails.email)){
        invalid_emails.status=0;
      }else{
        invalid_emails.status=1;
      }
    }

    $scope.removeinvalidEmail = function (index) {
      $scope.invalid_list_emails.splice(index, 1);
    }

    $scope.invalidContacts = function () {
      var pass = 1;
      angular.forEach($scope.invalid_list_emails, function (value,key) {
        value.email = value.email.replace(/\s/g, '').trim();
        if(!isEmail(value.email)){
          pass = 0;

          alertService.add("warning", "Fix or Remove the invalid email! - "+value.email, 5000);
          value.status=0;
        }else{
          value.status=1;
        }
      });


      if(pass){
        var emails_array1 = [];
        angular.forEach($scope.invalid_list_emails, function (value,key) {
          emails_array1.push(value.email);
        });

        $scope.addnewContacts(emails_array1);
      }else{
        alertService.add("warning", "Fix All Invalid Emails or Remove!", 5000);
      }

    }

    $scope.addnewContacts = function (emails_array) {
      var params = {
        emails_array: emails_array,
        investorListId: $scope.investorListId
      };
      var tagUrl = 'apiv4/public/investornotes/adddistributecontactsemails';
      RequestDetail.getDetail(tagUrl, params).then(function (result) {
         
        $scope.importeddata = result.data;
        $scope.invalid_list_emails = [];

        angular.forEach(result.data.invalid_list_emails, function (value,key) {
          $scope.invalid_list_emails.push({
            email: value,
            status: 0
          })
        });

        $scope.importeddata_status = 1;
        $scope.investorListchange();
        $scope.showModaladdcontacts = false;
        $scope.spinnerActive = false;
      });
    }



    
    
    function isEmail(email) {
      var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      return regex.test(email);
    }

    $scope.importeddata = [];
    $scope.importeddata_status = 0;

    // Investor Import Excel File 
    $scope.import_investor_excel = function (data) {
      $scope.spinnerActive = true;
      if ($scope.users.length == '0') {
        $scope.users = [];
      }
      var data1 = JSON.parse(data);
      if (data1.error) {
        alertService.add("warning", "File Format is wrong Try again!", 5000);
        alert('File Format is wrong Try again!');
        $scope.spinnerActive = false;
        return false;
      } else {
        if (angular.isDefined(data) && data != '') {
          data = JSON.parse(data);

          var params = {
            file_src: data.file_src,
            investorListId: $scope.investorListId
          };
          var tagUrl = 'apiv4/public/investornotes/addinvestornotesdistributecontacts';
          RequestDetail.getDetail(tagUrl, params).then(function (result) {
            
            $scope.invalid_list_emails = [];
            $scope.importeddata = result.data;
            $scope.invalid_list_emails = [];

            angular.forEach(result.data.invalid_list_emails, function (value,key) {
              $scope.invalid_list_emails.push({
                email: value,
                status: 0
              })
            });
            $scope.importeddata_status = 1;
            $scope.investorListchange();
            $scope.spinnerActive = false;
          });

        } else {
          alertService.add("warning", "File Format is wrong Try again!", 5000);
          $scope.spinnerActive = false;
          return false;
        }
      }
    }


    $scope.hideimporteddata_status = function () {
      $scope.importeddata_status = 0;
    }
    
    $scope.find_duplicatemail = function (data) {
      if ($scope.emails && $scope.emails.length > 0) {
        var dupl = 0;
        angular.forEach($scope.emails, function (todo, key) {
          if (todo == data) {
            dupl++;
          }
        });
        if (dupl == 0) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    }
    $scope.con_init = function () {
      $scope.datepickersOptions = {
        minDate: new Date('2010-05-01'),
        initDate: new Date()
      };
    }

    $scope.date_picker_opened = [];

    $scope.date_picker_open = function (index) {
      $timeout(function () {
        $scope.date_picker_opened[index] = true;
      });
    }

    $scope.clearUser = function (index) {
      $scope.users = [];
      $scope.emails = [];
    }

    

    // remove user
    $scope.removeUser = function (investor_list_contacts_id,index) {
      if (confirm("Are you sure?")) {
       // $scope.spinnerActive = true;
        
        var params = {
          investor_list_contacts_id: investor_list_contacts_id
        };
        var tagUrl = 'apiv4/public/investornotes/removeinvestor_list_contact';
        RequestDetail.getDetail(tagUrl, params).then(function (result) {
          $scope.spinnerActive = false;
          //$scope.users.splice(index, 1);
          //$scope.emails.splice(index, 1);

          angular.forEach($scope.users, function (col, index) {
            if(col.investor_list_contacts_id==investor_list_contacts_id){
              $scope.users.splice(index, 1);
              angular.forEach($scope.emails, function (col1, index1) {
                if(col.email==col1){
                  $scope.emails.splice(index, 1);
                }
              });
            }
          });

          //console.log($scope.emails);

          alertService.add("success", "Removed successfully!", 2000);
        
        });
      }
    };

  })
  .controller('predictedLeadsList', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails,$sce) {
    $scope.configdetails = configdetails;
    $scope.openmodelpagehelp = function () {
        $scope.showModalpageinfo = !$scope.showModalpageinfo;
    }
    $scope.sidepopupactive = false;

    $scope.sidepopup = function () {
        $scope.sidepopupactive = !$scope.sidepopupactive;
    }

    $scope.current_quarter = 0; // default for filter

    $scope.predictedleads = [];
    $scope.copypredictedleadsall = [];

    $scope.filter = {};
    $scope.filter.type = 'Ticker';
    $scope.filter.region = '';

    $scope.staticfilter = {};

    

    
    $scope.get_search_details = function (searchkey) {
        if (angular.isDefined(searchkey) && searchkey != '') {
            if ($scope.filter.type != '') {
                var tagUrl = 'apiv4/public/user/get_search_details1';
                var searchterm = searchkey;

                if ($scope.filter.type == 'Industry') {
                    var params = { term: searchterm, key: 'industry' };
                    RequestDetail.getDetail(tagUrl, params).then(function (result) {
                        if (angular.isDefined(result.data) && result.data.length > 0) {
                            $scope.availableData = result.data;
                        } else {
                            $scope.availableData = [];
                        }
                    });
                }

                if ($scope.filter.type == 'Ticker') {
                    var params = searchterm;
                    var tagUrl = 'apiv4/public/dashboard/get_auto_ticker_stock';
                    RequestDetail.getDetail(tagUrl, params).then(function (result) {
                        if (angular.isDefined(result.data) && result.data.length > 0) {
                            $scope.availableData = result.data;
                        } else {
                            $scope.availableData = [];
                        }
                    });
                }

            }
        }
    }

    $scope.typechange = function () {
        $scope.filter.data = '';
        $scope.availableData = [];
    }

    $scope.onSelecteddata = function (value) {
        
        $scope.filter.data = '';
        $scope.filter.data = value;
    }

    $scope.staticfilter.trade_side = "";
    $scope.staticfilter.region = "";
    

    // COLUMN TO SORT
    $scope.column = 'target_original/1';

    // SORT ORDERING (ASCENDING OR DESCENDING). SET TRUE FOR DESENDING
    $scope.reverse = true; 	

    // CALLED ON HEADER CLICK
    $scope.sortColumn = function(col){
        $scope.column = col;
        if($scope.reverse){
            $scope.reverse = false;
            $scope.reverseclass = 'arrow-up';
        }else{
            $scope.reverse = true;
            $scope.reverseclass = 'arrow-down';
        }
    };	

    // REMOVE AND CHANGE CLASS
    $scope.sortClass = function(col){
        if($scope.column == col ){
            if($scope.reverse){
                return 'arrow-down'; 
            }else{
                return 'arrow-up';
            }
        }else{
            return '';
        }
    }; 

    $scope.staticfilter.limit = '501'; 		

    $scope.limitfilter = function(){
            var allpredict =[];

            $scope.spinnerActive = true;
            
            $scope.predictedleads = [];
            allpredict = $scope.copypredictedleadsall;


            var predicts = [];
            if($scope.staticfilter['trade_side']){
                var sel_filters = $scope.staticfilter['trade_side'].split(',');
                angular.forEach(sel_filters,function(sel_filter,index){
                    angular.forEach(allpredict,function(col,index){
                        if(sel_filter == col.action){
                            predicts.push(col);
                        }
                    });
                });
                allpredict = predicts;
            }

            if($scope.staticfilter['region']){
                var predicts = [];
                angular.forEach(allpredict,function(col,index){
                    if($scope.staticfilter['region']==col.region_fitler){
                        predicts.push(col);
                    }
                });
                allpredict = predicts;
            }

            if($scope.staticfilter['filter_active_passive']){
                var predicts = [];
                angular.forEach(allpredict,function(col,index){
                    if($scope.staticfilter['filter_active_passive'] == 'p'){
                        if(col.invst_style == 'Index'){
                            predicts.push(col);
                        }
                    }else{
                        if(col.invst_style != 'Index'){
                            predicts.push(col);
                        }
                    }
                });
                allpredict = predicts;
            }


            // if($scope.staticfilter['filter_aum']){
                // var predicts = [];
                // angular.forEach(allpredict,function(col,index){
                    // if($scope.staticfilter['filter_aum']=='1'){
                        // if(col.inst_size<50000000){
                            // predicts.push(col);
                        // }
                    // }else if($scope.staticfilter['filter_aum']=='2'){
                        // if(col.inst_size>50000000 && col.inst_size<500000000){
                            // predicts.push(col);
                        // }
                    // }else if($scope.staticfilter['filter_aum']=='3'){
                        // if(col.inst_size>500000000 && col.inst_size<2000000000){
                            // predicts.push(col);
                        // }
                    // }else if($scope.staticfilter['filter_aum']=='4'){
                        // if(col.inst_size>2000000000 && col.inst_size<10000000000){
                            // predicts.push(col);
                        // }
                    // }else if($scope.staticfilter['filter_aum']=='5'){
                        // if(col.inst_size>10000000000 && col.inst_size<50000000000){
                            // predicts.push(col);
                        // }
                    // }else if($scope.staticfilter['filter_aum']=='6'){
                        // if(col.inst_size>50000000000){
                            // predicts.push(col);
                        // }
                    // }

                // });
                // allpredict = predicts;
            // }

            // //console.log($scope.staticfilter.limit);
            // var filteredpredicts = allpredict.slice(0, $scope.staticfilter.limit);

            var filteredpredicts = allpredict;

            var recommend_counts = [];
            recommend_counts.add_count = 0;
            recommend_counts.buy_count = 0;
            recommend_counts.reduce_count = 0;
            recommend_counts.hold_count = 0;
            recommend_counts.exit_count = 0;

            

            angular.forEach(filteredpredicts,function(predict,index){
                if(predict.action == 'Add'){
                    recommend_counts.add_count = recommend_counts.add_count+1;
                }else if(predict.action == 'Buy'){
                    recommend_counts.buy_count = recommend_counts.buy_count+1;
                }else if(predict.action == 'Reduce'){
                    recommend_counts.reduce_count = recommend_counts.reduce_count+1;
                }else if(predict.action == 'Exit'){
                    recommend_counts.exit_count = recommend_counts.exit_count+1;
                }else if(predict.action == 'Hold'){
                    recommend_counts.hold_count = recommend_counts.hold_count+1;
                }


                var confidence_fitler = 0;
                if(predict.confidence == 'High')
                    confidence_fitler = 3;
                if(predict.confidence == 'Medium')
                    confidence_fitler = 2;
                if(predict.confidence == 'Low')
                    confidence_fitler = 1;

                var region_fitler =  predict.region;
                if(region_fitler == 'Caribbean' || region_fitler == 'Middle East' || region_fitler == 'others' || region_fitler == 'South Africa' || region_fitler == 'Other'){
                    region_fitler = 'Other';
                }


                $scope.predictedleads.push({
                    'investor' : predict.investor,
                    'action' : predict.action,
                    'confidence' : predict.confidence,
                    'confidence_fitler' : predict.confidence_fitler,
                    'target' : predict.target,
                    'value' : predict.value,
                    'Last_Trade' : predict.Last_Trade,
                    'industry_tickers' : predict.industry_tickers,
                    'distributor' : predict.distributor,
                    'action_filter' : predict.action_filter,
                    'region_fitler' : predict.region_fitler,
                    'position_original' : predict.position_original,
                    'last_change_original' : predict.last_change_original,
                    'target_original' : predict.target_original,
                    'position' : predict.position,
                    'last_change' : predict.last_change,
                    'sector_mkt' : predict.sector_mkt,
                    'stock_sector' : predict.stock_sector,
                    'prev_owner' : predict.prev_owner
                })
             
            });

            $scope.recommend_counts = recommend_counts;

            /*var url = 'apiv4/public/dashboard/filtergetpredicted';
            var params = { predicted_leads: $scope.copypredictedleadsall, staticfilter:$scope.staticfilter };
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.predictedleads = [];
                $scope.predictedleads = result.data.predictedleads;
                $scope.recommend_counts = result.data.recommend_counts;
                $scope.spinnerActive = false;
            });*/

            $scope.spinnerActive = false;

    }
    $scope.clear_filter = function(){
        $scope.staticfilter.limit = '501'; 		
        $scope.staticfilter.trade_side = "";
        $scope.staticfilter.region = "";
        $scope.staticfilter.filter_active_passive = "";
        $scope.staticfilter.filter_aum = "";
        $scope.filter_investor.investor = "";
        $scope.predictedleads = [];
        $scope.predictedleads = $scope.copypredictedleadsall;
        $scope.recommend_counts = $scope.copyrecommend_countsall;
    }
    

    // FITLER ON THE RESULTS
    /*$scope.predictedFilter = function(element){
        if($scope.staticfilter.trade_side && $scope.staticfilter.region)
            return (element.action_filter == $scope.staticfilter.trade_side && element.region_fitler == $scope.staticfilter.region);
        if($scope.staticfilter.trade_side)
            return element.action_filter == $scope.staticfilter.trade_side;
        if($scope.staticfilter.region)
            return element.region_fitler == $scope.staticfilter.region;
        return element;
    }	*/

    $scope.recommend_counts = []; 

    $scope.copyrecommend_countsall = []; 
    
    $scope.total_predictcount = 0;

    var localUserdata = localStorageService.get('userdata');
    $scope.filter.data = localUserdata.ticker;

    $scope.report_link = "";

    $scope.tickerpermission = 0;

    var url = 'apiv4/public/dashboard/gettickerpermission';
    var params = {};
    RequestDetail.getDetail(url, params).then(function (result) {
        $scope.tickerpermission = result.data.ticker_permission;
    });
    // $scope.filter.data = 'VOYA';
    $scope.getpredicted = function (qdata,count) {

        if($scope.filter.data){
                $scope.filter.count = count;
        
                if(count==1){
                    $scope.spinnerActive = true;
                }
                var url = 'apiv4/public/dashboard/getpredicted';
                var params = { filter: $scope.filter,count:count,qdata:qdata };
                $scope.current_request = RequestDetail.getDetail(url, params).then(function (result) {
                    
                    if(($scope.filter.data).toUpperCase()==(result.data.Ticker).toUpperCase()){

                        if(result.data.msg=='limit exceeded'){
                            alertService.add("warning", "Search limit 5 exceeded", 2000);
                        }
                        $scope.result_row = result.data.result_row;

                        if(!qdata){
                            $scope.staticfilter.quat= '0';
                        }
                        
                        if(result.data.count==1){
                            $scope.predictedleads = [];
                            $scope.copypredictedleadsall = [];

                            $scope.predictedleads = result.data.predictedleads;
                            $scope.copypredictedleadsall = result.data.predictedleads;

                            $scope.all_counts = result.data.all_counts;
                            $scope.current_counts = result.data.current_counts;
                            
                            $scope.recommend_counts = result.data.recommend_counts;
                            $scope.copyrecommend_countsall = result.data.recommend_counts;

                            $scope.spinnerActive = false;
                            //$scope.getpredicted(qdata,1);

                            $scope.total_predictcount = +result.data.total_predictcount+1;
                            
                            $scope.report_link = result.data.report_link;
                            // $scope.limitfilter();
                        }else{
                            angular.forEach(result.data.predictedleads,function(col,index){
                                $scope.predictedleads.push(col);
                            });
                            
                            //RESET MASTER ARRAY
                            $scope.copypredictedleadsall = $scope.predictedleads;

                            $scope.recommend_counts.add_count = parseInt($scope.recommend_counts.add_count) + parseInt(result.data.recommend_counts.add_count);
                            $scope.recommend_counts.buy_count = parseInt($scope.recommend_counts.buy_count) + parseInt(result.data.recommend_counts.buy_count);
                            $scope.recommend_counts.reduce_count = parseInt($scope.recommend_counts.reduce_count) + parseInt(result.data.recommend_counts.reduce_count);
                            $scope.recommend_counts.hold_count = parseInt($scope.recommend_counts.hold_count) + parseInt(result.data.recommend_counts.hold_count);
                            $scope.recommend_counts.exit_count = parseInt($scope.recommend_counts.exit_count) + parseInt(result.data.recommend_counts.exit_count);

                            $scope.copyrecommend_countsall = $scope.recommend_counts;
                            // $scope.limitfilter();

                        }
                        
                        if(+result.data.count!=+$scope.total_predictcount){
                            $scope.getpredicted(qdata,+result.data.count+1);
                        }

                    }


                });
        }

        
    }


    
    $scope.getpredicted(0,1);

    $scope.vieweduser = [];
    $scope.showModalActivity = false;
    $scope.addnotesopen = function (distributor) {
        $scope.showModalActivity = !$scope.showModalActivity;
        $scope.vieweduser = distributor;
    }

    $scope.act = {};

    $scope.addactivity = function () {
        if ($scope.vieweduser.length != 0) {
            var url = 'apiv4/public/dashboard/adddistributoractivity';
            var params = { user: $scope.vieweduser, act: $scope.act };
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.showModalActivity = !$scope.showModalActivity;
                alertService.add("success", "Activity Added Successfully !", 2000);
                $scope.vieweduser = [];
            });
        }
    }



    //INITIALIZE DISPLAY VARIABLES
    $scope.pageloaded = true;
    $scope.show_predictions = true;
    $scope.ownershipdashboaordshow = false;
    $scope.investordashboaordshow = false;

    //SHOW PREDICITIONS DASHBOARD
    $scope.showpredictions = function(){
        $scope.show_predictions = true;
        $scope.ownershipdashboaordshow = false;
        $scope.investordashboaordshow = false;
    }

    //SHOW OWNERSHIP DASHBOARD
    $scope.showownership = function(){
        $scope.show_predictions = false;
        $scope.ownershipdashboaordshow = true;
        $scope.investordashboaordshow = false;
    }

    

    //LOAD INVESTOR ANALYTICS DASHBOARD
    $scope.showInvAnalDashboard = function(fund_id){
        $location.path('Predictedleads/' + fund_id + '/' + $scope.filter.data);
        /*//HIDE OTHER SECTIONS
        $scope.show_predictions = false;
        $scope.ownershipdashboaordshow = false;
        $scope.investordashboaordshow = true;
        
        var data = {accountName: 'anon_user', password: 'anon_P@ss', isWindowsLogOn: false};
        var Tokenurl = $scope.dashboardurl+'apiv4/public/LogOn/token';
        var dashboardId = '63ca33a9-63d5-42bf-b44d-4d2bbb50d05d';
        var dash_url = $scope.dashboardurl+'dashboard/'+dashboardId+'?e=false&vo=viewonly';
        
        //LOGIN DISABLED DUE TO CORS ISSUE
        var res = $http({
            url:$scope.dashboardurl+'apiv4/public/LogOn/token',
            method:"POST",
            data    : $.param(data),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        });

        res.success(function (data, status, headers, config) {
            var inv_dash_url = $scope.dashboardurl+'dashboard/'+dashboardId+'?e=false&vo=viewonly&ticker='+$scope.filter.data+'&fund='+fund_id;
            
            $scope.InvestorDashboardUrl = $sce.trustAsResourceUrl(inv_dash_url);
        });*/
    }




}).controller('investorcompatibility', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails, $sce, $anchorScroll) {
    $scope.predictedleads = [];
    $scope.filter = {};
    $scope.coveragelist = [];

    $scope.showCoveragetickers = function () {
        $scope.showModalCompatibility = !$scope.showModalCompatibility;
    }

    $scope.hideCoveragetickers = function () {
        $scope.showModalCompatibility = !$scope.showModalCompatibility;
    }

    $scope.openmodelpagehelp = function() {
        $scope.showModalpageinfo=!$scope.showModalpageinfo;
     }

    $scope.coveragelist = [];

    //Coverage list
    $scope.coveragelist.buy = "";
    $scope.coveragelist.hold = "";
    $scope.coveragelist.sell = "";


    // COLUMN TO SORT
    $scope.column = 'target_original/1';

    // SORT ORDERING (ASCENDING OR DESCENDING). SET TRUE FOR DESENDING
    $scope.reverse = true; 	

    // CALLED ON HEADER CLICK
    $scope.sortColumn = function(col){
        $scope.column = col;
        if($scope.reverse){
            $scope.reverse = false;
            $scope.reverseclass = 'arrow-up';
        }else{
            $scope.reverse = true;
            $scope.reverseclass = 'arrow-down';
        }
    };	

    // REMOVE AND CHANGE CLASS
    $scope.sortClass = function(col){
        if($scope.column == col ){
            if($scope.reverse){
                return 'arrow-down'; 
            }else{
                return 'arrow-up';
            }
        }else{
            return '';
        }
    }; 

    $scope.overlap_percentage = '0';
    
    $scope.getpredicted = function (investorname) {

        //auto scroll to top of the page when investor at page bottom got clikced
        $anchorScroll();

        $scope.filter.investorname = investorname;

        if (angular.isUndefined($scope.filter.investorname) || $scope.filter.investorname == '' || $scope.filter.investorname == null) {	
            alertService.add("warning", "Enter Investor Name!", 2000);
            return false;
        }

        $scope.spinnerActive = true;

        var url = 'apiv4/public/dashboard/getinvestorpredicted';
        var params = { filter:$scope.filter };
        RequestDetail.getDetail(url, params).then(function (result) {

            //console.log(result.data);

            $scope.predictedleads = [];
            $scope.predictedleads = result.data.predictedleads;
            
            if($scope.predictedleads){
                if($scope.predictedleads.length>0){
                    //overlap calculation

                    // $scope.val_tickers = result.data.predictedleads.filter(predict => predict.filter_shares_owned != null).length;
                    $scope.val_tickers = result.data.overlap_count;

                    

                    if($scope.val_tickers!='0'){
                        $scope.overlap_percentage = ($scope.val_tickers/result.data.predictedleads.length)*100;
                    }else{
                        $scope.overlap_percentage = 0;
                    }
                    //overlap calculation
                    
                    //compatibility percentage calculation
                    $scope.total_compatibility = result.data.total_compatibility;
                    $scope.compatibility_percent = parseInt(($scope.total_compatibility*100)/($scope.predictedleads.length*4));
                    //compatibility percentage calculation
                    
                    $scope.buy_count1 = result.data.buy_count1;
                    $scope.buy_count2 = result.data.buy_count2;
                    $scope.buy_percentage = result.data.buy_percentage;
                    $scope.sell_count1 = result.data.sell_count1;
                    $scope.sell_count2 = result.data.sell_count2;
                    $scope.sell_percentage = result.data.sell_percentage;
                    $scope.add_buy_totalcount = result.data.add_buy_totalcount;
                    $scope.add_buy = result.data.add_buy;
                    $scope.reduce_totalcount = result.data.reduce_totalcount;
                    $scope.reduce_count = result.data.reduce_count;
                    

                }
            }
            $scope.spinnerActive = false;
            
            
        });
    }

    //Get coverage lists
    $scope.getCoveragelisttickers = function () {
        var url = 'apiv4/public/dashboard/getCoveragelisttickers';
        var params = {  };
        RequestDetail.getDetail(url, params).then(function (result) {
            if(result.data.length>0){
                $scope.coveragelist = result.data[0];
                if($scope.coveragelist.buy){
                    $scope.buylist = $scope.coveragelist.buy.split(',');
                }
                if($scope.coveragelist.hold){
                    $scope.holdlist = $scope.coveragelist.hold.split(',');
                }
                if($scope.coveragelist.sell){
                    $scope.selllist = $scope.coveragelist.sell.split(',');
                }
                
                
                
                $scope.getInvestorsWithHighestOverlap();
            }
        });
    }
    
    $scope.limit_investor = 10;
    $scope.show_more_investor = 1;
    //Investors With Highest Overlap - Show All List
    $scope.showCompleteInvestorList = function () {
        $scope.limit_investor = 100;
        $scope.show_more_investor = 0;
    }

    //Investors With Highest Overlap
    $scope.getInvestorsWithHighestOverlap = function () {
        var url = 'apiv4/public/dashboard/getInvestorsWithHighestOverlap';
        var params = {  };
        RequestDetail.getDetail(url, params).then(function (result) {
            // //console.log(result.data);
            if(result.data.length>0){
                $scope.limit_investor = 10;
                $scope.show_more_investor = 1;
                $scope.high_overlap_inv_list = result.data;
            }
        });
    }

    $scope.getCoveragelisttickers();

    //Update coverage lists
    $scope.updateCoveragelisttickers = function () {
        $scope.spinnerActive = true;
        var url = 'apiv4/public/dashboard/updateCoveragelisttickers';
        var params = { coveragelist: $scope.coveragelist};
        RequestDetail.getDetail(url, params).then(function (result) {
            
            $scope.showModalCompatibility = !$scope.showModalCompatibility;
            $scope.spinnerActive = false;
            alertService.add("success", "Coverage List Updated Successfully !", 2000);
            $scope.getCoveragelisttickers();
        });
    }
    

    //get broker for ndr
    $scope.get_matchedinvestorname = function () {

        var tagUrl = 'apiv4/public/dashboard/get_matchedinvestorname';
        var params = {
            company_name: $('#investorname').val()
        };
        RequestDetail.getDetail(tagUrl, params).then(function (result) {
            //console.log(result.data);
            if (angular.isDefined(result.data) && result.data != '') {
                if (result.data == 0) {
                    //$('#user').removeClass('hidden');
                } else {
                    $("#investorname").autocomplete({
                        source: result.data,
                        select: function (a, b) {

                            $scope.filter.investorname = b.item.value;


                        }
                    });
                    //$('#user').addClass('hidden');
                }
            }
        });
    }
    
    
}).controller('convictionbuys', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails,$sce) {
    $scope.predictedleads = [];
    $scope.allpredictedleadscopy = [];

    $scope.spinnerActive = true;

    // SORT ORDERING (ASCENDING OR DESCENDING). SET TRUE FOR DESENDING
    $scope.reverse = false;
    $scope.column = 'ticker';
    $scope.openmodelpagehelp = function() {
        $scope.showModalpageinfo=!$scope.showModalpageinfo;
     }

    // CALLED ON HEADER CLICK
    $scope.sortColumn = function(col){
        $scope.column = col;
        if($scope.reverse){
            $scope.reverse = false;
            $scope.reverseclass = 'arrow-up';
        }else{
            $scope.reverse = true;
            $scope.reverseclass = 'arrow-down';
        }
    };	

    // REMOVE AND CHANGE CLASS
    $scope.sortClass = function(col){
        if($scope.column == col ){
            if($scope.reverse){
                return 'arrow-down'; 
            }else{
                return 'arrow-up';
            }
        }else{
            return '';
        }
    }; 

    $scope.staticfilter = [];

    $scope.industries = [];
    $scope.sectors = [];
    $scope.capitalizations = [];
    $scope.investor_name = '';

    //GET INVESTOR NAME
    var url = 'apiv4/public/dashboard/get_fund_house_name';
    var params = { fund_id:$routeParams.fundId };
    RequestDetail.getDetail(url, params).then(function (result) {
        $scope.investor_name = result.data.fund_house_name;	
    });

    //GET MOST CONVICTION BUYS
    var url = 'apiv4/public/dashboard/getinvestorpredictedbuys';
    var params = { fund_id:$routeParams.fundId };
    RequestDetail.getDetail(url, params).then(function (result) {
        
        $scope.predictedleads = result.data;	

        $scope.allpredictedleadscopy = result.data;
        
        $scope.sortfilter(result.data);
        
        $scope.spinnerActive = false;
    });

    $scope.sortfilter = function (data) {
        angular.forEach(data,function(col,index){
            $scope.industries.push(col.industry);
            $scope.sectors.push(col.sector);
            $scope.capitalizations.push(col.capitalization);
        });

        $scope.industries.sort(); 
        $scope.sectors.sort(); 
        $scope.capitalizations.sort(); 

        $scope.industries = $scope.industries.filter( changeunique ); 
        $scope.sectors = $scope.sectors.filter( changeunique ); 
        $scope.capitalizations = $scope.capitalizations.filter( changeunique ); 
    }

    function changeunique(value, index, self) { 
        return self.indexOf(value) === index;
    }

    $scope.limitfilter = function () {
        $scope.predictedleads = [];
        var predictedleadsfiltered = $scope.allpredictedleadscopy;

        var predicts = [];
        if($scope.staticfilter.indutryfilter){
            angular.forEach(predictedleadsfiltered,function(col,index){
                if(col.industry==$scope.staticfilter.indutryfilter){
                    predicts.push(col);					
                }
            });

            predictedleadsfiltered = predicts;

        }

        if($scope.staticfilter.sectorfilter){
            var predicts = [];
            angular.forEach(predictedleadsfiltered,function(col,index){
                if(col.sector==$scope.staticfilter.sectorfilter){
                    predicts.push(col);			
                }
            });
            predictedleadsfiltered = predicts;
        }

        if($scope.staticfilter.capitalizfilter){
            var predicts = [];
            angular.forEach(predictedleadsfiltered,function(col,index){
                if(col.capitalization==$scope.staticfilter.capitalizfilter){
                    predicts.push(col);			
                }
            });
            predictedleadsfiltered = predicts;
        }

        if($scope.staticfilter['filter_aum']){
            var predicts = [];
            angular.forEach(predictedleadsfiltered,function(col,index){
                if($scope.staticfilter['filter_aum']=='1'){
                    if(col.filter_shares_owned<'50000000'){
                        predicts.push(col);
                    }
                }else if($scope.staticfilter['filter_aum']=='2'){
                    if(col.filter_shares_owned>'50000000' && col.filter_shares_owned<'500000000'){
                        predicts.push(col);
                    }
                }else if($scope.staticfilter['filter_aum']=='3'){
                    if(col.filter_shares_owned>'500000000' && col.filter_shares_owned<'2000000000'){
                        predicts.push(col);
                    }
                }else if($scope.staticfilter['filter_aum']=='4'){
                    if(col.filter_shares_owned>'2000000000' && col.filter_shares_owned<'10000000000'){
                        predicts.push(col);
                    }
                }else if($scope.staticfilter['filter_aum']=='5'){
                    if(col.filter_shares_owned>'10000000000' && col.filter_shares_owned<'50000000000'){
                        predicts.push(col);
                    }
                }else if($scope.staticfilter['filter_aum']=='6'){
                    if(col.filter_shares_owned>'50000000000'){
                        predicts.push(col);
                    }
                }

            });
            predictedleadsfiltered = predicts;
        }

        $scope.predictedleads = predictedleadsfiltered;
        $scope.sortfilter(predictedleadsfiltered);
    
    }
    $scope.clear_filter = function () {
        $scope.predictedleads = $scope.allpredictedleadscopy;
        $scope.staticfilter = [];
        $scope.sortfilter($scope.allpredictedleadscopy);
    }
    


}).controller('convictionsells', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails,$sce) {
    $scope.predictedleads = [];

    $scope.allpredictedleadscopy = [];
    $scope.spinnerActive = true;

    // SORT ORDERING (ASCENDING OR DESCENDING). SET TRUE FOR DESENDING
    $scope.reverse = false; 	
    $scope.column = 'ticker';

    $scope.openmodelpagehelp = function() {
        $scope.showModalpageinfo=!$scope.showModalpageinfo;
     }

    // CALLED ON HEADER CLICK
    $scope.sortColumn = function(col){
        $scope.column = col;
        if($scope.reverse){
            $scope.reverse = false;
            $scope.reverseclass = 'arrow-up';
        }else{
            $scope.reverse = true;
            $scope.reverseclass = 'arrow-down';
        }
    };	

    // REMOVE AND CHANGE CLASS
    $scope.sortClass = function(col){
        if($scope.column == col ){
            if($scope.reverse){
                return 'arrow-down'; 
            }else{
                return 'arrow-up';
            }
        }else{
            return '';
        }
    }; 

    $scope.staticfilter = [];

    $scope.industries = [];
    $scope.sectors = [];
    $scope.capitalizations = [];
    $scope.investor_name = '';

    //GET INVESTOR NAME
    var url = 'apiv4/public/dashboard/get_fund_house_name';
    var params = { fund_id:$routeParams.fundId };
    RequestDetail.getDetail(url, params).then(function (result) {
        $scope.investor_name = result.data.fund_house_name;	
    });

    //GET MOST CONVICTION SELLS
    var url = 'apiv4/public/dashboard/getinvestorpredictedsells';
    var params = { fund_id:$routeParams.fundId };
    RequestDetail.getDetail(url, params).then(function (result) {
        
        $scope.predictedleads = result.data;	
        $scope.allpredictedleadscopy = result.data;
        
        $scope.sortfilter(result.data);
        $scope.spinnerActive = false;
    });


    $scope.sortfilter = function (data) {
        angular.forEach(data,function(col,index){
            $scope.industries.push(col.industry);
            $scope.sectors.push(col.sector);
            $scope.capitalizations.push(col.capitalization);
        });

        $scope.industries.sort(); 
        $scope.sectors.sort(); 
        $scope.capitalizations.sort(); 

        $scope.industries = $scope.industries.filter( changeunique ); 
        $scope.sectors = $scope.sectors.filter( changeunique ); 
        $scope.capitalizations = $scope.capitalizations.filter( changeunique ); 
    }

    function changeunique(value, index, self) { 
        return self.indexOf(value) === index;
    }

    
    $scope.limitfilter = function () {
        $scope.predictedleads = [];
        var predictedleadsfiltered = $scope.allpredictedleadscopy;

        var predicts = [];
        if($scope.staticfilter.indutryfilter){
            angular.forEach(predictedleadsfiltered,function(col,index){
                if(col.industry==$scope.staticfilter.indutryfilter){
                    predicts.push(col);					
                }
            });

            predictedleadsfiltered = predicts;

        }

        if($scope.staticfilter.sectorfilter){
            var predicts = [];
            angular.forEach(predictedleadsfiltered,function(col,index){
                if(col.sector==$scope.staticfilter.sectorfilter){
                    predicts.push(col);			
                }
            });
            predictedleadsfiltered = predicts;
        }

        if($scope.staticfilter.capitalizfilter){
            var predicts = [];
            angular.forEach(predictedleadsfiltered,function(col,index){
                if(col.capitalization==$scope.staticfilter.capitalizfilter){
                    predicts.push(col);			
                }
            });
            predictedleadsfiltered = predicts;
        }

        if($scope.staticfilter['filter_aum']){
            var predicts = [];
            angular.forEach(predictedleadsfiltered,function(col,index){
                if($scope.staticfilter['filter_aum']=='1'){
                    if(col.filter_shares_owned<'50000000'){
                        predicts.push(col);
                    }
                }else if($scope.staticfilter['filter_aum']=='2'){
                    if(col.filter_shares_owned>'50000000' && col.filter_shares_owned<'500000000'){
                        predicts.push(col);
                    }
                }else if($scope.staticfilter['filter_aum']=='3'){
                    if(col.filter_shares_owned>'500000000' && col.filter_shares_owned<'2000000000'){
                        predicts.push(col);
                    }
                }else if($scope.staticfilter['filter_aum']=='4'){
                    if(col.filter_shares_owned>'2000000000' && col.filter_shares_owned<'10000000000'){
                        predicts.push(col);
                    }
                }else if($scope.staticfilter['filter_aum']=='5'){
                    if(col.filter_shares_owned>'10000000000' && col.filter_shares_owned<'50000000000'){
                        predicts.push(col);
                    }
                }else if($scope.staticfilter['filter_aum']=='6'){
                    if(col.filter_shares_owned>'50000000000'){
                        predicts.push(col);
                    }
                }

            });
            predictedleadsfiltered = predicts;
        }


        $scope.predictedleads = predictedleadsfiltered;
        $scope.sortfilter(predictedleadsfiltered);
    
    }
    $scope.clear_filter = function () {
        $scope.predictedleads = $scope.allpredictedleadscopy;
        $scope.staticfilter = [];
        $scope.sortfilter($scope.allpredictedleadscopy);
    }


}).controller('scorecardCtrl', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails,$sce) {

    
    $scope.configdetails = configdetails;
    $scope.openmodelpagehelp = function () {
        $scope.showModalpageinfo = !$scope.showModalpageinfo;
    }
    $scope.sidepopupactive = false;

    $scope.sidepopup = function () {
        $scope.sidepopupactive = !$scope.sidepopupactive;
    }

    $scope.tab = 1;
    $scope.tabchange = function (tab) {
        $scope.tab =tab;
    }

    var localUserdata = localStorageService.get('userdata');
    $scope.ticker = localUserdata.ticker;

    //$scope.ticker = 'AAPL';
    
    $scope.spinnerActive = true;

    //GET MOST CONVICTION SELLS
    var url = 'apiv4/public/researchprovider/getscorecard';
    var params = { ticker : $scope.ticker };
    RequestDetail.getDetail(url, params).then(function (result) {
        $scope.scorecard = result.data;
        //console.log($scope.scorecard);
        
    });

    $scope.openpeersedit = function () {
        $scope.scorecardpeersModal =true;
    }

    $scope.scorecardpeersmodalclose = function () {
        $scope.scorecardpeersModal =false;
    }

    $scope.getpeers = function () {
        $scope.spinnerActive = true;
        var url = 'apiv4/public/researchprovider/getpeers';
        var params = { ticker : $scope.ticker };
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.spinnerActive = false;
            //console.log(result.data);

            $scope.scorecard_peers = [];
            $scope.original_peers = result.data.original_peers;
            $scope.report_link = result.data.report_link;
            //console.log($scope.report_link);
            $scope.status = result.data.status;
            if(result.data.scorecard_peers.length>0){
                $scope.scorecard_peers = result.data.scorecard_peers;
            }else{ 
                for (var i = 0; i < 7; i++) { 
                    var scrorecard = {ticker:'', name:''}; 
                    $scope.scorecard_peers.push(scrorecard);
                }
            }
                
            $scope.stock_id = result.data.stock_id;

        });
    }
    $scope.getpeers();


    $scope.updatescorecardpeers = function () {
        $scope.scorecardpeersModal =true;
        $scope.select = 1;
        $scope.spinnerActive = true;
        $.each($scope.scorecard_peers, function (index, peer) {
            if(peer.ticker==''){
                alertService.add("warning", "Enter All Tickers!", 2000);
                
                $scope.select = 0;
                return false;
            }
        });
        if($scope.select){
            var url = 'apiv4/public/researchprovider/updatescorecardpeers';
            var params = { scorecard_peers:$scope.scorecard_peers, stock_id: $scope.stock_id, ticker: $scope.ticker };
            RequestDetail.getDetail(url, params).then(function (result) {
                    
                    if(result.data==2){
                        alertService.add("warning", "Invalid or Duplicate Tickers!", 2000);
                        $scope.spinnerActive = false;
                    }else{
                        alertService.add("successs", "Peers updated successfully !", 2000);
                        $scope.scorecardpeersModal =false;
                        $scope.spinnerActive = false;
                        $scope.report_link = '';
                    }
           
            });
        }
        
        
    }

}).controller('allEventListBroker', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails) {
    $scope.configdetails = configdetails;
    $scope.openmodelpagehelp = function () {
        $scope.showModalpageinfo = !$scope.showModalpageinfo;
    }
    $scope.sidepopupactive = false;

    $scope.sidepopup = function () {
        $scope.sidepopupactive = !$scope.sidepopupactive;
    }

    $scope.usertype = localStorageService.get('usertype');

    $scope.filter = {};

    $scope.filter.status = "";


    $scope.get_search_details = function (type, searchkey) {
        if (angular.isDefined(searchkey) && searchkey != '') {
            if (type != '') {
                var tagUrl = 'apiv4/public/user/get_search_details1';
                var searchterm = searchkey;

                if (type == 'industry') {
                    var params = {
                        term: searchterm,
                        key: type
                    };
                    RequestDetail.getDetail(tagUrl, params).then(function (result) {
                        if (angular.isDefined(result.data) && result.data.length > 0) {
                            $scope.availableIndustry = result.data;
                        } else {
                            $scope.availableIndustry = [];
                        }
                    });
                }

                if (type == 'ticker') {
                    var params = searchterm;
                    var tagUrl = 'apiv4/public/dashboard/get_auto_ticker_stock';
                    RequestDetail.getDetail(tagUrl, params).then(function (result) {
                        if (angular.isDefined(result.data) && result.data.length > 0) {
                            $scope.availableTickers = result.data;
                        } else {
                            $scope.availableTickers = [];
                        }
                    });
                }

            }
        }
    }

    $scope.clearresearchfilter = function () {
        $scope.filter = {};
        $scope.getrequestlt();
    }

    $scope.getrequestlt = function () {
        var tagUrl = 'apiv4/public/researchprovider/getrequestlist';
        var params = {
            filter: $scope.filter
        };
        RequestDetail.getDetail(tagUrl, params).then(function (result) {
            //console.log(result.data);
            $scope.requestlists = result.data;
        });
    }



    $scope.inlineOptions = {
        customClass: getDayClass,
        minDate: new Date(),
        showWeeks: true
    };

    $scope.dateOptions = {
        // dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(2015, 5, 22),
        startingDay: 1,
        showButtonPanel: false
    };

    $scope.open1 = function () {
        $scope.popup1.opened = true;
    };

    // Disable weekend selection
    function disabled(data) {
        var date = data.date,
            mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6); /* Disable weak days */
    }


    $scope.open1 = function () {
        $scope.popup1.opened = true;
    };

    $scope.open2 = function () {
        $scope.popup2.opened = true;
    };

    $scope.setDate = function (year, month, day) {
        $scope.dt = new Date(year, month, day);
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popup1 = {
        opened: false
    };

    $scope.popup2 = {
        opened: false
    };



    function getDayClass(data) {
        var date = data.date,
            mode = data.mode;
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    }

    $scope.clickToOpen = function (index) {
        $scope.view_showModal = $scope.classes[index];
        ngDialog.open({
            template: 'ext.html'
        });
    };

    $scope.getrequestlt();

}).controller('createResearchProposal', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails,$route) {
    $scope.configdetails = configdetails;
    $scope.openmodelpagehelp = function () {
        $scope.showModalpageinfo = !$scope.showModalpageinfo;
    }
    $scope.sidepopupactive = false;

    $scope.sidepopup = function () {
        $scope.sidepopupactive = !$scope.sidepopupactive;
    }



    $scope.request = {};
    $scope.request.invite_type = "All Intro-act Providers";
    $scope.request.type = "";
    $scope.request.identify = "Identify as Requestor";
    $scope.request.nondisclosure = "Own Work Exclusively";
    $scope.request.industry_tag = [];
    $scope.request.tickers = [];

    var tagUrl = 'apiv4/public/dashboard/getInvestorsList';
    var params = {
        key: 'tags'
    };
    RequestDetail.getDetail(tagUrl, params).then(function (result) {

        $scope.investerslist = {};
        $scope.investerslist = result.data;
    });




    $scope.request.researchfiles = [];

    $scope.uploadFile = function (filedata) {
        $scope.$apply(function () {
            $scope.request.researchfiles = [];
            $scope.request.researchfiles.push({
                file_name: filedata,
                file_location: 'uploads/proposal/' + filedata
            })
        });
    }
    $scope.removeFiles = function (index) {
        $scope.request.researchfiles.splice(index, 1);
    }



    $scope.request.addinvesterslists = [];
    $scope.investers = '';

    $scope.selectinvestors = function (selected) {
        if (selected != undefined) {
            $scope.investers = selected.title;
        }

    }

    $scope.addinvesterlist = function () {

        if ($scope.investers != '') {
            if ($scope.request.addinvesterslists.indexOf($scope.investers) == -1) {
                $scope.request.addinvesterslists.push($scope.investers);
                $scope.investers = '';
                $scope.$broadcast('angucomplete-alt:clearInput', 'tagInvestor');
            } else {
                alertService.add("warning", "Already entered this item!", 2000);
                $scope.investersgrp = '';
                $scope.$broadcast('angucomplete-alt:clearInput', 'tagInvestor');
            }
        }
    }

    $scope.removeInvester = function (index) {
        $scope.request.addinvesterslists.splice(index, 1);
    }



    $scope.inlineOptions = {
        customClass: getDayClass,
        minDate: new Date(),
        showWeeks: true
    };

    $scope.dateOptions = {
        // dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1,
        showButtonPanel: false
    };

    $scope.open1 = function () {
        $scope.popup1.opened = true;
    };

    // Disable weekend selection
    function disabled(data) {
        var date = data.date,
            mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6); /* Disable weak days */
    }


    $scope.open1 = function () {
        $scope.popup1.opened = true;
    };

    $scope.open2 = function () {
        $scope.popup2.opened = true;
    };

    $scope.setDate = function (year, month, day) {
        $scope.dt = new Date(year, month, day);
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popup1 = {
        opened: false
    };

    $scope.popup2 = {
        opened: false
    };



    function getDayClass(data) {
        var date = data.date,
            mode = data.mode;
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    }

    $scope.clickToOpen = function (index) {
        $scope.view_showModal = $scope.classes[index];
        ngDialog.open({
            template: 'ext.html'
        });
    };

    $scope.get_search_details = function (type, searchkey) {
        if (angular.isDefined(searchkey) && searchkey != '') {
            if (type != '') {
                var tagUrl = 'apiv4/public/user/get_search_details1';
                var searchterm = searchkey;

                if (type == 'industry') {
                    var params = {
                        term: searchterm,
                        key: type
                    };
                    RequestDetail.getDetail(tagUrl, params).then(function (result) {
                        if (angular.isDefined(result.data) && result.data.length > 0) {
                            $scope.availableIndustry = result.data;
                        } else {
                            $scope.availableIndustry = [];
                        }
                    });
                }

                if (type == 'ticker') {
                    var params = searchterm;
                    var tagUrl = 'apiv4/public/dashboard/get_auto_ticker_stock';
                    RequestDetail.getDetail(tagUrl, params).then(function (result) {
                        if (angular.isDefined(result.data) && result.data.length > 0) {
                            $scope.availableTickers = result.data;
                        } else {
                            $scope.availableTickers = [];
                        }
                    });
                }

            }
        }
    }



    $scope.addrequest = function () {

        
        if (angular.isUndefined($scope.request.enddate)) {
            alertService.add("warning", "Please enter expiration date !", 2000);
            return false;
        }

        if (angular.isUndefined($scope.request.title) || $scope.request.title == '') {
            alertService.add("warning", "Please enter title !", 2000);
            return false;
        }
        if (angular.isUndefined($scope.request.description) || $scope.request.description == '') {
            alertService.add("warning", "Please enter description !", 2000);
            return false;
        }
        if (angular.isUndefined($scope.request.type) || $scope.request.type == '') {
            alertService.add("warning", "Please enter type !", 2000);
            return false;
        }
        if (angular.isUndefined($scope.request.target_budget) || $scope.request.target_budget == '') {
            alertService.add("warning", "Please enter Budget !", 2000);
            return false;
        }
        
        if ($scope.request.industry_tag.length == 0) {
            alertService.add("warning", "Please enter industry !", 2000);
            return false;
        }
        if ($scope.request.tickers.length == 0) {
            alertService.add("warning", "Please enter ticker !", 2000);
            return false;
        }
        if (angular.isUndefined($scope.request.keywords) || $scope.request.keywords == '') {
            alertService.add("warning", "Please enter keywords !", 2000);
            return false;
        }
        if ($scope.request.invite_type == 'Invite to Distributed List') {
            if ($scope.request.addinvesterslists.length == 0) {
                alertService.add("warning", "Please enter Budget !", 2000);
                return false;
            }
        }

        var tagUrl = 'apiv4/public/researchprovider/addresearchrequest';
        var params = {
            data: $scope.request
        };
        RequestDetail.getDetail(tagUrl, params).then(function (result) {
            alertService.add("success", "Request Added Successfully !", 2000);
            $scope.request = {};
            $scope.request.invite_type = "All Intro-act Providers";
            $scope.request.type = "";
            $scope.request.identify = "Identify as Requestor";
            $scope.request.nondisclosure = "Own Work Exclusively";
            $route.reload();
        });

    }
})
.controller('viewResearchrequest', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails, $route) {
    $scope.configdetails = configdetails;
    $scope.openmodelpagehelp = function () {
        $scope.showModalpageinfo = !$scope.showModalpageinfo;
    }
    $scope.sidepopupactive = false;

    $scope.sidepopup = function () {
        $scope.sidepopupactive = !$scope.sidepopupactive;
    }

    $scope.activetab = 0;

    $scope.changeactive = function (index) {
        $scope.activetab = index;
    };

    $scope.requirement_id = $routeParams.requirementId;

    var tagUrl = 'apiv4/public/researchprovider/getresearchrequest';
    var params = {
        requirement_id: $scope.requirement_id
    };
    RequestDetail.getDetail(tagUrl, params).then(function (result) {
        $scope.researchdata = result.data;
        //console.log($scope.researchdata);
    });

    $scope.openmodelbid = function () {
        $scope.showModalbidupdate = !$scope.showModalbidupdate;
    }
    $scope.bid = {};

    $scope.bid.bidfile = [];

    $scope.uploadFile = function (filedata) {
        $scope.$apply(function () {
            $scope.bid.bidfile.push({
                file_name: filedata,
                file_location: 'uploads/proposal/' + filedata
            });
        });
    }
    $scope.removeFiles = function (index) {
        $scope.bid.bidfile.splice(index, 1);
    }


    $scope.confirmbid = function () {
        if (angular.isUndefined($scope.bid.bidamount) || $scope.bid.bidamount == '') {
            alertService.add("warning", "Please enter bid !", 2000);
            return false;
        }

        var tagUrl = 'apiv4/public/researchprovider/confirmbid';
        var params = {
            requirement_id: $scope.requirement_id,
            bid: $scope.bid
        };
        RequestDetail.getDetail(tagUrl, params).then(function (result) {
            $scope.showModalbidupdate = !$scope.showModalbidupdate;
            alertService.add("success", "Bided Successfully !", 2000);
            $timeout(function () {
                $route.reload();
            }, 1000);
        });


    }


    $scope.bidaward = function (requirement_bid_id) {
        var tagUrl = 'apiv4/public/researchprovider/awardresearchrequestbid';
        var params = {
            requirement_id: $scope.requirement_id,
            requirement_bid_id: requirement_bid_id
        };
        RequestDetail.getDetail(tagUrl, params).then(function (result) {
            //console.log(result.data);
            if (result.data.msg == 'success') {
                alertService.add("success", "Awarded Successfully !", 2000);
                $route.reload();
            } else if (result.data.msg == 'before duedate') {
                alertService.add("warning", "Award Bid After Due Date !", 2000);
            } else {
                alertService.add("warning", "Awarded Already Given !", 2000);
            }
        });

    }

    $scope.Withdrawbid = function () {
        var tagUrl = 'apiv4/public/researchprovider/withdrawbid';
        var params = {
            requirement_id: $scope.requirement_id
        };

        RequestDetail.getDetail(tagUrl, params).then(function (result) {
            alertService.add("success", "Bid Withdrawed Successfully !", 2000);
            $route.reload();
        });
    }



})
.controller('manageProposals_List', function($scope,$http,$location,local,$filter,alertService,localStorageService,RequestDetail,$routeParams,$timeout,configdetails) {
	$scope.configdetails=configdetails;
	$scope.openmodelpagehelp = function() {
	   $scope.showModalpageinfo=!$scope.showModalpageinfo;
	}
	$scope.sidepopupactive=false;
	$scope.sidepopup = function() {
		$scope.sidepopupactive=!$scope.sidepopupactive;
	}
	$scope.data={};
	/* $scope.data.industry = [];
	$scope.data.keyword = ''; */
	
	// Search Box Industry Tag values
	$scope.get_search_details = function (type, searchkey) {
		if (angular.isDefined(searchkey) && searchkey != '') {
			if (type != '') {
				var tagUrl = 'apiv4/public/researchprovider/get_search_details';
				var searchterm = searchkey;

				if (type == 'industry') {
					var params = { term: searchterm, key: type };
					RequestDetail.getDetail(tagUrl, params).then(function (result) {
						if (angular.isDefined(result.data) && result.data.length > 0) {
							$scope.availableIndustry = result.data;
							$scope.availableIndustry.push('All');
						} else {
							$scope.availableIndustry = [];
						}
					});
				}

			}
		}
	}
	$scope.onSelectedindustry = function (selectedItem) {
		if (selectedItem == 'All') {
			$scope.dashboard.industry_tag = [];
			$scope.dashboard.industry_tag.push('All');
		}
	}
	/* Get Proposal Details  */
	$scope.proposalDetails = [];
	$scope.searchProposalLists = [];
	var proposalUrl = 'apiv4/public/proposal/getProposals';
	var params = {
		type : 'proposals',
	};
	RequestDetail.getDetail(proposalUrl,params).then(function(result){
		if(angular.isDefined(result))
		{
			 $scope.proposalDetails = result.data; 
		}
	});

	$scope.closefair_sear = function() {
		$scope.sidepopupactive=false;
		//console.log($scope.sidepopupactive);
 	}
	
	//Clear Search Data
	$scope.clearProposalSearch = function() {
	 	$scope.data.industry = [];
		$scope.data.keyword = '';
		$scope.searchProposalLists = [];
	}
	// Search Function
	$scope.searchProposal = function (initial) {
		if (angular.isUndefined($scope.data.industry)) {
			$scope.data.industry = [];
		}
		if (angular.isUndefined($scope.data.keyword)) {
			$scope.data.keyword = '';
		}

		var industry = $scope.data.industry;
		var keyword = $scope.data.keyword;
		
		if (!initial) {
			$scope.proposalDetails = [];
			$scope.searchProposalLists = [];
			
			var searchProposalUrl = 'apiv4/public/proposal/getSearchProposals';
			var getProposalParams = {
				industry: industry,
				keyword: keyword
			};

			RequestDetail.getDetail(searchProposalUrl, getProposalParams).then(function (result) {
				if (result.data) {
					$scope.searchProposalLists = result.data;
				}else{
					$scope.searchProposalLists = [];
				}
				$scope.sidepopupactive=false;
			});
		}

	};
		
	
})
.controller('createProposal', function($scope,$http,$location,local,$filter,alertService,localStorageService,RequestDetail,$routeParams,$timeout,configdetails) {
	$scope.configdetails=configdetails;
	$scope.openmodelpagehelp = function() {
	   $scope.showModalpageinfo=!$scope.showModalpageinfo;
	}
	$scope.sidepopupactive=false;
	$scope.sidepopup = function() {
		$scope.sidepopupactive=!$scope.sidepopupactive;
	}
	
	$scope.clearDashboardSearch = function() {
	/* 	$scope.data.industry = [];
		$scope.data.ticker  = [];
		$scope.data.keyword = '';
		$scope.data.provider = '';
		$scope.data.type = '';
		$scope.showsearchtext = false;
		$scope.searchdashboardlists = [];
		$scope.getlist(); */
	}
	
	// For Industry Tags
	$scope.tags = {};
	$scope.tags.industry_tagsData = '';
	$scope.tags.valMacroTags = '';
	$scope.tags.valMidTags = '';
	$scope.tags.valMicroTags = '';
	$scope.industryTagsAdded = [];
	//For Keywords
	$scope.valKeywordTags = '';
	$scope.keywordTagsAdded = [];
	//For Tickers
	$scope.valTickerTags = '';
	$scope.tickerTagsAdded = [];
	//For Investor
	$scope.cdata = {};
	$scope.cdata.addinvesterslist = [];
	/* $scope.tagsInvestor = {}; */
	$scope.valInvestorTags = '';
	$scope.tags.investers = '';
	$scope.investorTagsAdded = [];
	
	//Other Feilds
	$scope.title					= $('#title').val();
	$scope.description 				= $('#description').val();
	$scope.type_of_research			= $('#type_of_research').val();
	$scope.cost_participation 		= $('#cost_participation').val();
	$scope.min_no_of_participants 	= $('#min_no_of_participants').val();
	$scope.max_no_of_participants 	= $('#max_no_of_participants').val();
	$scope.expiry_date 				= $('#expiry_date').val();
	
	
	$scope.presentaion_file = [];
	$scope.uploadpresentaionFile = function(imgdata){
		
		if($scope.presentaion_file.length == '0'){
			$scope.presentaion_file = [];
		}
		$scope.$apply(function () {
			$scope.presentaion_file.push({file_name : imgdata,file_location:'uploads/temp/'+imgdata})
		});
	}
	
	$scope.selectMacroTag = function(selected){
		if(selected != undefined){
			$scope.tags.valMacroTags = selected.title;
		}
	}
	
	$scope.selectMidTag = function(selected){
		if(selected != undefined){
			$scope.tags.valMidTags = selected.title;
		}
	}
	
	$scope.selectMicroTag = function(selected){
		if(selected != undefined){
			$scope.tags.valMicroTags = selected.title;
		}
	}
	$scope.selectinvestors = function(selected){
	if(selected != undefined){
		$scope.tags.investers = selected.title;
	}
}
	var tagUrl = 'apiv4/public/meeting/getAllIndustryTags';
	var params = {key : 'tags'};
	RequestDetail.getDetail(tagUrl,params).then(function(result){
		$scope.macroTags = result.data.macro;
		$scope.midTags = result.data.mid;
		$scope.microTags = result.data.micro;
	});
	// Industry Tags Add Function
	$scope.addMacroTag = function(){
		if($scope.tags.valMacroTags != ''){
			if($scope.industryTagsAdded.indexOf($scope.tags.valMacroTags) == -1){
				$scope.industryTagsAdded.push($scope.tags.valMacroTags);
				$scope.tags.valMacroTags = '';
				$scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
			} else {
				alertService.add("warning", "Allready entered this item!",2000);
				$scope.tags.valMacroTags = '';
				$scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
			}
		}
	}

	$scope.addMidTag = function(){
		if($scope.tags.valMidTags != ''){
			if($scope.industryTagsAdded.indexOf($scope.tags.valMidTags) == -1){
				$scope.industryTagsAdded.push($scope.tags.valMidTags);
				$scope.tags.valMidTags = '';
				$scope.$broadcast('angucomplete-alt:clearInput', 'tagMid');
			} else {
				alertService.add("warning", "Allready entered this item!",2000);
				$scope.tags.valMidTags = '';
				$scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
			}
		}
	}
	
	$scope.addMicroTag = function(){
		if($scope.tags.valMicroTags != ''){
			if($scope.industryTagsAdded.indexOf($scope.tags.valMicroTags) == -1){
				$scope.industryTagsAdded.push($scope.tags.valMicroTags);
				$scope.tags.valMicroTags = '';
				$scope.$broadcast('angucomplete-alt:clearInput', 'tagMicro');
			} else {
				alertService.add("warning", "Allready entered this item!",2000);
				$scope.tags.valMicroTags = '';
				$scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
			}
		}
	}	
	//Keyword Add Function	
	$scope.addKeywordTag = function(){
		$scope.valKeywordTags = $('#keyword').val();
		if($scope.valKeywordTags != ''){
			 if($scope.keywordTagsAdded.indexOf($scope.valKeywordTags) == -1){
				$scope.keywordTagsAdded.push($scope.valKeywordTags);
				$scope.valKeywordTags = '';
				$('#keyword').val('');
			} else {
				$scope.valKeywordTags = '';
				$('#keyword').val('');
			} 
		}
	}
	// Ticker Add function
	$scope.addTickerTag = function(){
		$scope.valTickerTags = $('#ticker').val();
		if($scope.valTickerTags != ''){
			 if($scope.tickerTagsAdded.indexOf($scope.valTickerTags) == -1){
				$scope.tickerTagsAdded.push($scope.valTickerTags);
				$scope.valTickerTags = '';
				$('#ticker').val('');
				
			} else {
				$scope.valTickerTags = '';
				$('#ticker').val('');
			} 
		}
	}
	// Investor List Add Function
	$scope.addinvesterlist = function()
	{	
		if($scope.tags.investers != ''){
			if($scope.cdata.addinvesterslist.indexOf($scope.tags.investers) == -1){
				$scope.cdata.addinvesterslist.push($scope.tags.investers);
				$scope.tags.investers = '';
				$scope.$broadcast('angucomplete-alt:clearInput', 'tagInvestor');
				/* $('#investor').val(''); */
			} else {
				alertService.add("warning", "Allready entered this item!",2000);
				$scope.cdata.investersgrp= '';
				$scope.$broadcast('angucomplete-alt:clearInput', 'tagInvestor');
				/* $('#investor').val(''); */
			}
		}
	}
	
	var tagUrl = 'apiv4/public/dashboard/getInvestorsList';
	var params = {key : 'tags'};
	RequestDetail.getDetail(tagUrl,params).then(function(result){

		$scope.investerslist = {};
		$scope.investerslist = result.data;
	});
	
	//Removing Added Mutilple Datas - Remove Industry Tag, Ticker , Keyword
	$scope.removeTag = function(item){
		$scope.industryTagsAdded.splice(item, 1);
	}
	
	$scope.removeTickerTag = function(item){
		$scope.tickerTagsAdded.splice(item, 1);
	}
	
	$scope.removeKeywordTag = function(item){
		$scope.keywordTagsAdded.splice(item, 1);
	}
	
	$scope.removeInvester = function(index){
		$scope.cdata.addinvesterslist.splice(index,1);    
	}
	$scope.removeFiles = function(index){
		$scope.presentaion_file.splice(index,1);    
	}
	
	// Add Proposal 
	$scope.addProposal = function(){

		//console.log($scope.expiry_date);
		var error_flag = 0;
		if(!$scope.title || $scope.title  == ''){
			$('#title').attr('required',true);
			$('#title').focus();
			alertService.add("warning", "Please enter proposal title !",2000);
			error_flag++;
			return false;
		}else if(!$scope.description || $scope.description  == ''){
			$('#description').attr('required',true);
			$('#description').focus();
			alertService.add("warning", "Please enter proposal description !",2000);
			error_flag++;
			return false;
		}else if(!$scope.type_of_research || $scope.type_of_research  == ''){
			$('#type_of_research').attr('required',true);
			$('#type_of_research').focus();
			alertService.add("warning", "Please select type of research !",2000);
			error_flag++;
			return false;
		}else if(!$scope.cost_participation || $scope.cost_participation  == ''){
			$('#cost_participation').attr('required',true);
			$('#cost_participation').focus();
			alertService.add("warning", "Please enter cost/ participation !",2000);
			error_flag++;
			return false;
		}else if(!$scope.cost_participation || $scope.cost_participation  == ''){
			$('#cost_participation').attr('required',true);
			$('#cost_participation').focus();
			alertService.add("warning", "Please enter cost/ participation !",2000);
			error_flag++;
			return false;
		}else if(!$scope.min_no_of_participants || $scope.min_no_of_participants  == ''){
			$('#min_no_of_participants').attr('required',true);
			$('#min_no_of_participants').focus();
			alertService.add("warning", "Please enter min number of participants !",2000);
			error_flag++;
			return false;
		}else if(!$scope.max_no_of_participants || $scope.max_no_of_participants  == ''){
			$('#max_no_of_participants').attr('required',true);
			$('#max_no_of_participants').focus();
			alertService.add("warning", "Please enter max number of participants !",2000);
			error_flag++;
			return false;
		}else if( parseFloat($scope.max_no_of_participants)  <= parseFloat($scope.min_no_of_participants) ){
			$('#max_no_of_participants').attr('required',true);
			$('#max_no_of_participants').focus();
			alertService.add("warning", "Max number of participants Should be greater than minimum !",2000);
			error_flag++;
			return false;
		}else if(!$scope.expiry_date || $scope.expiry_date  == ''){
			$('#expiry_date').attr('required',true);
			$('#expiry_date').focus();
			alertService.add("warning", "Please enter expiry date !",2000);
			error_flag++;
			return false;
		}
		/*else if(!$scope.report_available || $scope.report_available  == ''){
			$('#report_available').attr('required',true);
			$('#report_available').focus();
			alertService.add("warning", "Please enter expiry date !",2000);
			error_flag++;
			return false;
		}*/
		else{
			if(error_flag == 0){
				$scope.cdata.presentaion_file = {};
				$scope.cdata.presentaion_file = $scope.presentaion_file;
				
				$scope.formData = {};
				$scope.formData = [{
					title 					: $scope.title,
					description				: $scope.description,
					type_of_research		: $scope.type_of_research,
					cost_participation		: $scope.cost_participation,
					min_no_of_participants 	: $scope.min_no_of_participants,
					max_no_of_participants	: $scope.max_no_of_participants,
					expiry_date				: $scope.expiry_date,
					addinvesterslist		: $scope.cdata.addinvesterslist,
					industryTagsAdded		: $scope.industryTagsAdded,
					tickerTagsAdded			: $scope.tickerTagsAdded,
					keywordTagsAdded		: $scope.keywordTagsAdded,
					presentaion_file		: $scope.cdata.presentaion_file,
					report_available		: $scope.report_available
				}];
				
				var insertProposalUrl = 'apiv4/public/proposal/save_proposal';
				var params = {type:$scope.formData};

				 RequestDetail.getDetail(insertProposalUrl,params).then(function(result){
					if(result){
						alertService.add("success", "New Proposal Created successfully!",2000);
						$location.path('ManageProposal');
					}
				}); 
			}
		}
	}	
	
	$scope.dateOptions = {
		// dateDisabled: disabled,
		formatYear: 'yy',
		maxDate: new Date(2020, 5, 22),
		minDate: new Date(),
		startingDay: 1
	};
	$scope.deaddateOptions = {
		dateDisabled: disabled,
		formatYear: 'yy',
		maxDate: new Date(2020, 5, 22),
		minDate: new Date(),
		startingDay: 1
	};

	// Disable weekend selection
	function disabled(data) {
		// var date = data.date,
		// mode = data.mode;
		// return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6); /* Disable weak days */
	}

	$scope.toggleMin = function() {
		$scope.inlineOptions.minDate = new Date();    
		var myDate = new Date();
	  //add a day to the date
	  myDate.setDate(myDate.getDate() + 1);
	  $scope.dateOptions.minDate =myDate;
	};

	$scope.open1 = function() {
		$scope.minDate = new Date();
		$scope.popup1.opened = true;
	};
	$scope.popup1 = {
		opened: false
	};
	
})

.controller('viewProposal', function($scope,$http,$location,local,$filter,alertService,localStorageService,RequestDetail,$routeParams,$timeout,configdetails) {
	  $scope.configdetails=configdetails;
	  $scope.openmodelpagehelp = function() {
		   $scope.showModalpageinfo=!$scope.showModalpageinfo;
		}
	  $scope.sidepopupactive=false;
	$scope.proposal_data ={};
	$scope.proposal_id = $routeParams.proposal_id;
	/* alert($scope.proposal_id); */
	$scope.sidepopup = function() {
		$scope.sidepopupactive=!$scope.sidepopupactive;
	}
	$scope.clearDashboardSearch = function() {
	/* 	$scope.data.industry = [];
		$scope.data.ticker  = [];
		$scope.data.keyword = '';
		$scope.data.provider = '';
		$scope.data.type = '';
		$scope.showsearchtext = false;
		$scope.searchdashboardlists = [];
		$scope.getlist(); */
	 }
	$scope.activetab=0;
 
	$scope.changeactive = function(index) {
		$scope.activetab=index;
	}; 
	
	if($scope.fairpagetype !="" && !angular.isUndefined($scope.fairpagetype)){
		$scope.activetab=1;
	}
	var proposalUrl = 'apiv4/public/proposal/getProposalById';
	var params = {
		type : 'proposals',
		id	 : $scope.proposal_id
	};
    
	RequestDetail.getDetail(proposalUrl,params).then(function(result){
		if(angular.isDefined(result))
		{
			
			 $scope.proposalDetails = result.data; 
			 $scope.proposalInterestDetails = result.data.proposalInterestDetails;
			 $scope.proposaladdInterestDetails = result.data.proposaladdInterestDetails;
			 //console.log($scope.proposaladdInterestDetails);

		}
	});
	
	$scope.proposalAward = function(){
		//console.log($scope.proposalInterestDetails);
		// Min and max participants validation needs to be added
		var total	= 0;
		var i;
		$scope.award = [];
		for(i= 0; i < $scope.proposalInterestDetails.length;i++ ){
			var value = $scope.proposalInterestDetails[i]['selected'];
			if( (value) && value == true){
				total++;
				$scope.award.push(parseInt($scope.proposalInterestDetails[i]['proposal_interest_id']));
			}
		}
		////console.log($scope.award);
		var awardUrl = 'apiv4/public/proposal/awardProposals';
		var awardParams = {
			type : 'proposalsAward',
			ids	 : $scope.award
		};
		
		RequestDetail.getDetail(awardUrl,awardParams).then(function(result){
			if(angular.isDefined(result))
			{
				/* alert('test'); */
				alertService.add("success", "Proposals are awarded successfully!",2000);
				$location.path('proposal/view/'+$scope.proposal_id);
				location.reload();
			}
		});
	}
	
	$scope.proposalInsufficient = function(){
		// Min and max participants validation needs to be added
		var total	= 0;
		var i;
		$scope.insufficient = [];
		for(i= 0; i < $scope.proposalInterestDetails.length;i++ ){
			var value = $scope.proposalInterestDetails[i]['selected'];
			if( (value) && value == true){
				total++;
				$scope.insufficient.push(parseInt($scope.proposalInterestDetails[i]['proposal_interest_id']));
			}
		}
		//console.log($scope.insufficient);
		var insufficientUrl = 'apiv4/public/proposal/insufficientProposals';
		var insufficientParams = {
			type : 'proposalsInsufficient',
			ids	 : $scope.insufficient
		};
		
		RequestDetail.getDetail(insufficientUrl,insufficientParams).then(function(result){
			if(angular.isDefined(result))
			{
				/* alert('test'); */
				alertService.add("success", "Proposals award function has been done successfully!",2000);
				$location.path('proposal/view/'+$scope.proposal_id);
				location.reload();
			}
		});
	}
	// Delete Proposal
	$scope.showModalDeleteProposal = false;
	$scope.openDeleteProposalModal = function(){
		$scope.showModalDeleteProposal = !$scope.showModalDeleteProposal ;
	}
	
	$scope.closeDeleteProposalModal = function(){
		$scope.showModalDeleteProposal = false ;
	}
	
	$scope.delete_proposal = function(){
		$scope.showModalDeleteProposal = false ;
		$scope.formData = {};
		$scope.formData = [{
			type : 'delete_proposal',
			id	 : $scope.proposal_id
		}];
		
		var deleteProposalUrl = 'apiv4/public/proposal/deleteProposal';
		var params = {type:$scope.formData};

		 RequestDetail.getDetail(deleteProposalUrl,params).then(function(result){
			if(result){
				alertService.add("success", "Proposals deleted successfully!",2000);
				$location.path('ManageProposal');
			}
		}); 
	}
})
.controller('CommonProposalViewCtrl', function($scope,$http,$location,local,$filter,alertService,localStorageService,RequestDetail,$routeParams,$timeout,configdetails) {
	$scope.configdetails=configdetails;
	$scope.openmodelpagehelp = function() {
	   $scope.showModalpageinfo=!$scope.showModalpageinfo;
	}
	$scope.sidepopupactive=false;
	$scope.sidepopup = function() {
		$scope.sidepopupactive=!$scope.sidepopupactive;
	}
	
	$scope.showModalProposalInterest=false;
	$scope.openProposalModal = function() {
		$scope.showModalProposalInterest=!$scope.showModalProposalInterest;
	}
	
	$scope.closeProposalModal = function() {
		$scope.showModalProposalInterest=false;
	}
	
	
	$scope.openaddProposalModal = function() {
		$scope.showModaladdProposalInterest=!$scope.showModaladdProposalInterest;
	}

	$scope.closeaddProposalModal = function(){
		$scope.showModaladdProposalInterest = false ;
	}
	

	//Proposal Id 
	$scope.proposal_data ={};
	$scope.proposal_id = $routeParams.proposal_id;
	
	$scope.activetab=0;
	$scope.changeactive = function(index) {
		$scope.activetab=index;
	}; 
	if($scope.fairpagetype !="" && !angular.isUndefined($scope.fairpagetype)){
		$scope.activetab=1;
	}
	// Get Proposal Details
	var proposalUrl = 'apiv4/public/proposal/getProposalById';
	var params = {
		type : 'proposals',
		id	 : $scope.proposal_id
	};
    
	RequestDetail.getDetail(proposalUrl,params).then(function(result){
		if(angular.isDefined(result))
		{
			 //console.log(result.data);
			 $scope.proposalDetails = result.data; 

		}
	});
	
	$scope.indicateInterest = function(){
		var proposalInterestUrl = 'apiv4/public/proposal/indicateProposalInterest';
		var paramsInterest = {
			type : 'proposals_interest',
			id	 : $scope.proposal_id
		};
		
		RequestDetail.getDetail(proposalInterestUrl,paramsInterest).then(function(result){
			if(angular.isDefined(result)){
				/* alert('test'); */
				alertService.add("success", "Proposal interest  added successfully!",2000);
				$location.path('proposalView/'+$scope.proposal_id);
				location.reload();
			}
		});
	};

	$scope.additional = [];

	$scope.addindicateInterest = function(){
		var proposalInterestUrl = 'apiv4/public/proposal/addindicateProposalInterest';
		var paramsInterest = {
			type : 'proposals_interest',
			id	 : $scope.proposal_id,
			additionalinterest	 : $scope.additional.additionalinterest,
		};
		
		RequestDetail.getDetail(proposalInterestUrl,paramsInterest).then(function(result){
			if(angular.isDefined(result)){
				/* alert('test'); */
				alertService.add("success", "Proposal interest  added successfully!",2000);
				$location.path('proposalView/'+$scope.proposal_id);
				location.reload();
			}
		});
	};

	$scope.openremoveProposalModal = function(){
		var proposalInterestUrl = 'apiv4/public/proposal/removeaddindicateProposalInterest';
		var paramsInterest = {
			type : 'proposals_interest',
			id	 : $scope.proposal_id,
		};
		
		RequestDetail.getDetail(proposalInterestUrl,paramsInterest).then(function(result){
			if(angular.isDefined(result)){
				/* alert('test'); */
				alertService.add("success", "Proposal interest  Removed successfully!",2000);
				$location.path('proposalView/'+$scope.proposal_id);
				location.reload();
			}
		});
	}

	
	
	$scope.showModalWithdrawInterest = false;
	$scope.openWithdrawProposalModal = function(){
		$scope.showModalWithdrawInterest = !$scope.showModalWithdrawInterest ;
	}
	
	$scope.closeWithdrawProposalModal = function(){
		$scope.showModalWithdrawInterest = false ;
	}
	// Withdraw Indicated Interest
	var error_flag= 0;
	$scope.withdrawInterest = function(){
		
		/* //console.log($scope.withdraw_reason); */
		/* if(!$scope.withdraw_reason || $scope.withdraw_reason  == ''){
			$('#withdraw_reason').attr('required',true);
			$('#withdraw_reason').focus();
			alertService.add("warning", "Please enter reason for withdraw of interest !",2000);
			error_flag++;
			return false;
		}else */ {
			/* if(error_flag == 0) */{
				/* ,
					withdraw_reason	 : $scope.withdraw_reason */
				$scope.formData = {};
				$scope.formData = [{
					type : 'Withdraw_proposals',
					id	 : $scope.proposal_id
				}];
				
				var insertProposalUrl = 'apiv4/public/proposal/withdrawInterest';
				var params = {type:$scope.formData};

				 RequestDetail.getDetail(insertProposalUrl,params).then(function(result){
					if(result){
						alertService.add("success", "Indicated Interest has been withdrawn successfully!",2000);
						$location.path('proposalView/'+$scope.proposal_id);
						location.reload(); 
					}
				}); 
			}
		}
	
	}
})
.controller('myInterestedProposalsCtrl', function($scope,$http,$location,local,$filter,alertService,localStorageService,RequestDetail,$routeParams,$timeout,configdetails) {
	$scope.configdetails=configdetails;
	$scope.openmodelpagehelp = function() {
	   $scope.showModalpageinfo=!$scope.showModalpageinfo;
	}
	$scope.sidepopupactive=false;
	$scope.sidepopup = function() {
		$scope.sidepopupactive=!$scope.sidepopupactive;
	}
	$scope.data={};
	/* $scope.data.industry = [];
	$scope.data.keyword = ''; */
	
	// Search Box Industry Tag values
	$scope.get_search_details = function (type, searchkey) {
		if (angular.isDefined(searchkey) && searchkey != '') {
			if (type != '') {
				var tagUrl = 'apiv4/public/researchprovider/get_search_details';
				var searchterm = searchkey;

				if (type == 'industry') {
					var params = { term: searchterm, key: type };
					RequestDetail.getDetail(tagUrl, params).then(function (result) {
						if (angular.isDefined(result.data) && result.data.length > 0) {
							$scope.availableIndustry = result.data;
							$scope.availableIndustry.push('All');
						} else {
							$scope.availableIndustry = [];
						}
					});
				}

			}
		}
	}
	$scope.onSelectedindustry = function (selectedItem) {
		if (selectedItem == 'All') {
			$scope.dashboard.industry_tag = [];
			$scope.dashboard.industry_tag.push('All');
		}
	}
	/* Get Proposal Details  */
	$scope.proposalDetails = [];
	$scope.searchProposalLists = [];
	var proposalUrl = 'apiv4/public/proposal/getInterestedProposals';
	var params = {
		type : 'proposals',
	};
	RequestDetail.getDetail(proposalUrl,params).then(function(result){
		if(angular.isDefined(result))
		{
			 $scope.proposalDetails = result.data; 
		}
	});
	
	//Clear Search Data
	$scope.clearProposalSearch = function() {
	 	$scope.data.industry = [];
		$scope.data.keyword = '';
		$scope.searchProposalLists = [];
	}
	// Search Function
	$scope.searchProposal = function (initial) {
		if (angular.isUndefined($scope.data.industry)) {
			$scope.data.industry = [];
		}
		if (angular.isUndefined($scope.data.keyword)) {
			$scope.data.keyword = '';
		}

		var industry = $scope.data.industry;
		var keyword = $scope.data.keyword;
		
		if (!initial) {
			$scope.proposalDetails = [];
			$scope.searchProposalLists = [];
			
			var searchProposalUrl = 'apiv4/public/proposal/getSearchInterestedProposals';
			var getProposalParams = {
				industry: industry,
				keyword: keyword
			};

			RequestDetail.getDetail(searchProposalUrl, getProposalParams).then(function (result) {
				if (result.data) {
					$scope.searchProposalLists = result.data;
				}else{
					$scope.searchProposalLists = [];
				}
			});
		}

	};
		
	
})
.controller('viewInterestedProposal', function($scope,$http,$location,local,$filter,alertService,localStorageService,RequestDetail,$routeParams,$timeout,configdetails) {
	$scope.configdetails=configdetails;
	$scope.openmodelpagehelp = function() {
	   $scope.showModalpageinfo=!$scope.showModalpageinfo;
	}
	$scope.withdraw_reason = $('#withdraw_reason').val();
	
	$scope.sidepopupactive=false;
	$scope.proposal_data ={};
	$scope.proposal_id = $routeParams.proposal_id;
	/* alert($scope.proposal_id); */
	$scope.sidepopup = function() {
		$scope.sidepopupactive=!$scope.sidepopupactive;
	}
	$scope.clearDashboardSearch = function() {
	
	}
	$scope.activetab=0;
 
	$scope.changeactive = function(index) {
		$scope.activetab=index;
	}; 
	
	if($scope.fairpagetype !="" && !angular.isUndefined($scope.fairpagetype)){
		$scope.activetab=1;
	}
	var proposalUrl = 'apiv4/public/proposal/getProposalById';
	var params = {
		type : 'proposals',
		id	 : $scope.proposal_id
	};
    
	RequestDetail.getDetail(proposalUrl,params).then(function(result){
		if(angular.isDefined(result))
		{
			 $scope.proposalDetails = result.data; 
			 $scope.proposalInterestDetails = result.data.proposalInterestDetails;
		}
	});
	
	
	$scope.showModalWithdrawInterest = false;
	$scope.openWithdrawProposalModal = function(){
		$scope.showModalWithdrawInterest = !$scope.showModalWithdrawInterest ;
	}
	
	$scope.closeWithdrawProposalModal = function(){
		$scope.showModalWithdrawInterest = false ;
	}
	
	// Withdraw Indicated Interest
	var error_flag= 0;
	$scope.withdrawInterest = function(){
		
		/* //console.log($scope.withdraw_reason); */
		/* if(!$scope.withdraw_reason || $scope.withdraw_reason  == ''){
			$('#withdraw_reason').attr('required',true);
			$('#withdraw_reason').focus();
			alertService.add("warning", "Please enter reason for withdraw of interest !",2000);
			error_flag++;
			return false;
		}else */ {
			/* if(error_flag == 0) */{
				/* ,
					withdraw_reason	 : $scope.withdraw_reason */
				$scope.formData = {};
				$scope.formData = [{
					type : 'Withdraw_proposals',
					id	 : $scope.proposal_id
				}];
				
				var insertProposalUrl = 'apiv4/public/proposal/withdrawInterest';
				var params = {type:$scope.formData};

				 RequestDetail.getDetail(insertProposalUrl,params).then(function(result){
					if(result){
						alertService.add("success", "Indicated Interest has been withdrawn successfully!",2000);
						$location.path('myInterestedProposals/view/'+$scope.proposal_id);
						location.reload(); 
					}
				}); 
			}
		}
	
	}
})

.controller('editProposalCtrl', function($scope,$http,$location,local,$filter,alertService,localStorageService,RequestDetail,$routeParams,$timeout,configdetails) {
	$scope.configdetails=configdetails;
	$scope.openmodelpagehelp = function() {
	   $scope.showModalpageinfo=!$scope.showModalpageinfo;
	}
	$scope.sidepopupactive=false;
	$scope.sidepopup = function() {
		$scope.sidepopupactive=!$scope.sidepopupactive;
	}
	
	$scope.clearDashboardSearch = function() {
	}
	
	// For Industry Tags
	$scope.tags = {};
	$scope.tags.industry_tagsData = '';
	$scope.tags.valMacroTags = '';
	$scope.tags.valMidTags = '';
	$scope.tags.valMicroTags = '';
	$scope.industryTagsAdded = [];
	//For Keywords
	$scope.valKeywordTags = '';
	$scope.keywordTagsAdded = [];
	//For Tickers
	$scope.valTickerTags = '';
	$scope.tickerTagsAdded = [];
	//For Investor
	$scope.cdata = {};
	$scope.cdata.addinvesterslist = [];
	/* $scope.tagsInvestor = {}; */
	$scope.valInvestorTags = '';
	$scope.tags.investers = '';
	$scope.investorTagsAdded = [];
	
	//Other Feilds
	$scope.title					= $('#title').val();
	$scope.description 				= $('#description').val();
	$scope.type_of_research			= $('#type_of_research').val();
	$scope.cost_participation 		= $('#cost_participation').val();
	$scope.min_no_of_participants 	= $('#min_no_of_participants').val();
	$scope.max_no_of_participants 	= $('#max_no_of_participants').val();
	$scope.expiry_date 				= $('#expiry_date').val();
		
	$scope.presentaion_file = [];
	$scope.uploadpresentaionFile = function(imgdata){
		
		if($scope.presentaion_file.length == '0'){
			$scope.presentaion_file = [];
		}
		$scope.$apply(function () {
			$scope.presentaion_file.push({file_name : imgdata,file_location:'uploads/temp/'+imgdata})
		});
	}
	
	// Get and Load Added Values
	$scope.proposal_id = $routeParams.proposal_id;
	var proposalUrl = 'apiv4/public/proposal/getProposalById';
	var params = {
		type : 'proposals',
		id	 : $scope.proposal_id
	};
    
	RequestDetail.getDetail(proposalUrl,params).then(function(result){
		if(angular.isDefined(result))
		{
			 $scope.proposalDetails = result.data; 
			 $scope.proposalInterestDetails = result.data.proposalInterestDetails;
			 if($scope.proposalDetails){
				 $scope.title 					= $scope.proposalDetails.title;
				 $scope.description 			= $scope.proposalDetails.description;
				 $scope.type_of_research 		= $scope.proposalDetails.type_of_research;
				 $scope.cost_participation 		= $scope.proposalDetails.cost_participation;
				 $scope.min_no_of_participants 	= $scope.proposalDetails.min_no_of_participants;
				 $scope.max_no_of_participants 	= $scope.proposalDetails.max_no_of_participants;
				 $scope.industryTagsAdded 		= $scope.proposalDetails.industry_tags;
				 $scope.tickerTagsAdded 		= $scope.proposalDetails.tickers;
				 $scope.keywordTagsAdded 		= $scope.proposalDetails.keywords;
				 $scope.cdata.addinvesterslist 	= $scope.proposalDetails.distrbution_list;
				 $scope.presentaion_file 		= $scope.proposalDetails.attachments;
				 
				 $scope.expiry_date 			= $scope.proposalDetails.expiry_date;
				 $scope.expiry_date = new Date($scope.expiry_date.replace(/-/g, "/"));
				
			 }
		}
	});
	
	// Tages Added Dynamically
	$scope.selectMacroTag = function(selected){
		if(selected != undefined){
			$scope.tags.valMacroTags = selected.title;
		}
	}
	
	$scope.selectMidTag = function(selected){
		if(selected != undefined){
			$scope.tags.valMidTags = selected.title;
		}
	}
	
	$scope.selectMicroTag = function(selected){
		if(selected != undefined){
			$scope.tags.valMicroTags = selected.title;
		}
	}
	$scope.selectinvestors = function(selected){
	if(selected != undefined){
		$scope.tags.investers = selected.title;
	}
}
	var tagUrl = 'apiv4/public/meeting/getAllIndustryTags';
	var params = {key : 'tags'};
	RequestDetail.getDetail(tagUrl,params).then(function(result){
		$scope.macroTags = result.data.macro;
		$scope.midTags = result.data.mid;
		$scope.microTags = result.data.micro;
	});
	// Industry Tags Add Function
	$scope.addMacroTag = function(){
		if($scope.tags.valMacroTags != ''){
			if($scope.industryTagsAdded.indexOf($scope.tags.valMacroTags) == -1){
				$scope.industryTagsAdded.push($scope.tags.valMacroTags);
				$scope.tags.valMacroTags = '';
				$scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
			} else {
				alertService.add("warning", "Allready entered this item!",2000);
				$scope.tags.valMacroTags = '';
				$scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
			}
		}
	}

	$scope.addMidTag = function(){
		if($scope.tags.valMidTags != ''){
			if($scope.industryTagsAdded.indexOf($scope.tags.valMidTags) == -1){
				$scope.industryTagsAdded.push($scope.tags.valMidTags);
				$scope.tags.valMidTags = '';
				$scope.$broadcast('angucomplete-alt:clearInput', 'tagMid');
			} else {
				alertService.add("warning", "Allready entered this item!",2000);
				$scope.tags.valMidTags = '';
				$scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
			}
		}
	}
	
	$scope.addMicroTag = function(){
		if($scope.tags.valMicroTags != ''){
			if($scope.industryTagsAdded.indexOf($scope.tags.valMicroTags) == -1){
				$scope.industryTagsAdded.push($scope.tags.valMicroTags);
				$scope.tags.valMicroTags = '';
				$scope.$broadcast('angucomplete-alt:clearInput', 'tagMicro');
			} else {
				alertService.add("warning", "Allready entered this item!",2000);
				$scope.tags.valMicroTags = '';
				$scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
			}
		}
	}	
	//Keyword Add Function	
	$scope.addKeywordTag = function(){
		$scope.valKeywordTags = $('#keyword').val();
		if($scope.valKeywordTags != ''){
			 if($scope.keywordTagsAdded.indexOf($scope.valKeywordTags) == -1){
				$scope.keywordTagsAdded.push($scope.valKeywordTags);
				$scope.valKeywordTags = '';
				$('#keyword').val('');
			} else {
				$scope.valKeywordTags = '';
				$('#keyword').val('');
			} 
		}
	}
	// Ticker Add function
	$scope.addTickerTag = function(){
		$scope.valTickerTags = $('#ticker').val();
		if($scope.valTickerTags != ''){
			 if($scope.tickerTagsAdded.indexOf($scope.valTickerTags) == -1){
				$scope.tickerTagsAdded.push($scope.valTickerTags);
				$scope.valTickerTags = '';
				$('#ticker').val('');
				
			} else {
				$scope.valTickerTags = '';
				$('#ticker').val('');
			} 
		}
	}
	// Investor List Add Function
	$scope.addinvesterlist = function()
	{	
		if($scope.tags.investers != ''){
			if($scope.cdata.addinvesterslist.indexOf($scope.tags.investers) == -1){
				$scope.cdata.addinvesterslist.push($scope.tags.investers);
				$scope.tags.investers = '';
				$scope.$broadcast('angucomplete-alt:clearInput', 'tagInvestor');
				/* $('#investor').val(''); */
			} else {
				alertService.add("warning", "Allready entered this item!",2000);
				$scope.cdata.investersgrp= '';
				$scope.$broadcast('angucomplete-alt:clearInput', 'tagInvestor');
				/* $('#investor').val(''); */
			}
		}
	}
	
	var tagUrl = 'apiv4/public/dashboard/getInvestorsList';
	var params = {key : 'tags'};
	RequestDetail.getDetail(tagUrl,params).then(function(result){

		$scope.investerslist = {};
		$scope.investerslist = result.data;
	});
	
	//Removing Added Mutilple Datas - Remove Industry Tag, Ticker , Keyword
	$scope.removeTag = function(item){
		$scope.industryTagsAdded.splice(item, 1);
	}
	
	$scope.removeTickerTag = function(item){
		$scope.tickerTagsAdded.splice(item, 1);
	}
	
	$scope.removeKeywordTag = function(item){
		$scope.keywordTagsAdded.splice(item, 1);
	}
	
	$scope.removeInvester = function(index){
		$scope.cdata.addinvesterslist.splice(index,1);    
	}
	$scope.removeFiles = function(index){
		$scope.presentaion_file.splice(index,1);    
	}
	var error_flag = 0;
	// Add Proposal 
	$scope.editProposal = function(){
		if(!$scope.title || $scope.title  == ''){
			$('#title').attr('required',true);
			$('#title').focus();
			alertService.add("warning", "Please enter proposal title !",2000);
			error_flag++;
			return false;
		}else if(!$scope.description || $scope.description  == ''){
			$('#description').attr('required',true);
			$('#description').focus();
			alertService.add("warning", "Please enter proposal description !",2000);
			error_flag++;
			return false;
		}else if(!$scope.type_of_research || $scope.type_of_research  == ''){
			$('#type_of_research').attr('required',true);
			$('#type_of_research').focus();
			alertService.add("warning", "Please select type of research !",2000);
			error_flag++;
			return false;
		}else if(!$scope.cost_participation || $scope.cost_participation  == ''){
			$('#cost_participation').attr('required',true);
			$('#cost_participation').focus();
			alertService.add("warning", "Please enter cost/ participation !",2000);
			error_flag++;
			return false;
		}else if(!$scope.cost_participation || $scope.cost_participation  == ''){
			$('#cost_participation').attr('required',true);
			$('#cost_participation').focus();
			alertService.add("warning", "Please enter cost/ participation !",2000);
			error_flag++;
			return false;
		}else if(!$scope.min_no_of_participants || $scope.min_no_of_participants  == ''){
			$('#min_no_of_participants').attr('required',true);
			$('#min_no_of_participants').focus();
			alertService.add("warning", "Please enter min number of participants !",2000);
			error_flag++;
			return false;
		}else if(!$scope.max_no_of_participants || $scope.max_no_of_participants  == ''){
			$('#max_no_of_participants').attr('required',true);
			$('#max_no_of_participants').focus();
			alertService.add("warning", "Please enter max number of participants !",2000);
			error_flag++;
			return false;
		}else if( parseFloat($scope.max_no_of_participants)  <= parseFloat($scope.min_no_of_participants) ){
			$('#max_no_of_participants').attr('required',true);
			$('#max_no_of_participants').focus();
			alertService.add("warning", "Max number of participants Should be greater than minimum !",2000);
			error_flag++;
			return false;
		}else if(!$scope.expiry_date || $scope.expiry_date  == ''){
			$('#expiry_date').attr('required',true);
			$('#expiry_date').focus();
			alertService.add("warning", "Please enter expiry date !",2000);
			error_flag++;
			return false;
		}else{
			if(error_flag == 0){
				$scope.cdata.presentaion_file = {};
				$scope.cdata.presentaion_file = $scope.presentaion_file;
				
				$scope.formData = {};
				$scope.formData = [{
					proposal_id 			: $scope.proposal_id,
					title 					: $scope.title,
					description				: $scope.description,
					type_of_research		: $scope.type_of_research,
					cost_participation		: $scope.cost_participation,
					min_no_of_participants 	: $scope.min_no_of_participants,
					max_no_of_participants	: $scope.max_no_of_participants,
					expiry_date				: $scope.expiry_date,
					addinvesterslist		: $scope.cdata.addinvesterslist,
					industryTagsAdded		: $scope.industryTagsAdded,
					tickerTagsAdded			: $scope.tickerTagsAdded,
					keywordTagsAdded		: $scope.keywordTagsAdded,
					presentaion_file		: $scope.cdata.presentaion_file
				}];
				
				var insertProposalUrl = 'apiv4/public/proposal/update_proposal';
				var params = {type:$scope.formData};

				 RequestDetail.getDetail(insertProposalUrl,params).then(function(result){
					if(result){
						alertService.add("success", "New Proposal Created successfully!",2000);
						$location.path('ManageProposal');
					}
				}); 
			}
		}
	}	
	
	$scope.dateOptions = {
		// dateDisabled: disabled,
		formatYear: 'yy',
		maxDate: new Date(2020, 5, 22),
		minDate: new Date(),
		startingDay: 1
	};
	$scope.deaddateOptions = {
		dateDisabled: disabled,
		formatYear: 'yy',
		maxDate: new Date(2020, 5, 22),
		minDate: new Date(),
		startingDay: 1
	};

	// Disable weekend selection
	function disabled(data) {
		// var date = data.date,
		// mode = data.mode;
		// return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6); /* Disable weak days */
	}

	$scope.toggleMin = function() {
		$scope.inlineOptions.minDate = new Date();    
		var myDate = new Date();
	  //add a day to the date
	  myDate.setDate(myDate.getDate() + 1);
	  $scope.dateOptions.minDate =myDate;
	};

	$scope.open1 = function() {
		$scope.minDate = new Date();
		$scope.popup1.opened = true;
	};
	$scope.popup1 = {
		opened: false
	};
	
})
/*  .controller('investornotes', function ($scope, $http, $location, $routeParams, localStorageService, RequestDetail, configdetails, $sce, usertype) {
          $scope.configdetails = configdetails;
          $scope.pageHeading = 'Corporate Profile';
  
  
          $scope.tabactive = '0';
          $scope.listitems = [];
  
          // COLUMN TO SORT
          $scope.column = 'sno';
  
          // SORT ORDERING (ASCENDING OR DESCENDING). SET TRUE FOR DESENDING
          $scope.reverse = false;
  
          // CALLED ON HEADER CLICK
          $scope.sortColumn = function (col) {
          $scope.column = col;
              if ($scope.reverse) {
                  $scope.reverse = false;
                  $scope.reverseclass = 'arrow-up';
              } else {
                  $scope.reverse = true;
                  $scope.reverseclass = 'arrow-down';
              }
          };
  
  
          $scope.editinvestornotesid = 'sno';
  
  
          $scope.sortClass = function (col) {
              if ($scope.column == col) {
                  if ($scope.reverse) {
                  return 'arrow-down';
                  } else {
                  return 'arrow-up';
                  }
              } else {
                  return '';
              }
          };
  
          $scope.changetab = function (index) {
              $scope.tabactive = index;
  
              if ($scope.tabactive == '1') {
                  $scope.listitems = $scope.investornotesstep1;
              } else if ($scope.tabactive == '2') {
                  $scope.listitems = $scope.investornotesstep2;
              } else if ($scope.tabactive == '3') {
                  $scope.listitems = $scope.investornotesstep3;
              } else if ($scope.tabactive == '4') {
                  $scope.listitems = $scope.investornotesstep4;
              } else if ($scope.tabactive == '5') {
                  $scope.listitems = $scope.investornotesndrs;
              } else if ($scope.tabactive == '6') {
                  $scope.listitems = $scope.investornotesowners;
              }else{
                  $scope.listitems = $scope.investornotesprestep;
              }
  
          }
  
          $scope.showModalpageinfo = false;
  
          $scope.openmodelpagehelp = function () {
              $scope.showModalpageinfo = !$scope.showModalpageinfo;
          }
  
  
        
  
            
          $scope.investornotesprestep = [];
          $scope.investornotesstep1 = [];
          $scope.investornotesstep2 = [];
          $scope.investornotesstep3 = [];
          $scope.investornotesstep4 = [];
          $scope.investornotesndrs = [];
          $scope.investornotesowners = [];
  
  
          $scope.total_count = 1;
  
  
          $scope.selectinvestor_notescompanies_id = function (page) {
              if(page==1){
                  $scope.spinnerActive = true;
              }
             
              var url = 'apiv4/public/investornotes/getinvestornotes';
              var params = {page:page};
              RequestDetail.getDetail(url, params).then(function (result) {
  
                  if(page==1){
                      $scope.total_count = result.data.total_page;
                  }
  
                  if(page<$scope.total_count){
                      $scope.selectinvestor_notescompanies_id(page+1);
                  }
  
                  angular.forEach(result.data.investornotesprestep,function(col,index){
                      $scope.investornotesprestep.push(col);
                  });
                  angular.forEach(result.data.investornotesstep1,function(col,index){
                      $scope.investornotesstep1.push(col);
                      
                  });
                  angular.forEach(result.data.investornotesstep2,function(col,index){
                      $scope.investornotesstep2.push(col);
  
                     
                  });
                  angular.forEach(result.data.investornotesstep3,function(col,index){
                      $scope.investornotesstep3.push(col);
                     
                  });
                  angular.forEach(result.data.investornotesstep4,function(col,index){
                      $scope.investornotesstep4.push(col);
                      
                  });
                  angular.forEach(result.data.investornotesowners,function(col,index){
                      $scope.investornotesowners.push(col);
                      
                  });
  
                 
  
                 //$scope.investornotesprestep = result.data.investornotesprestep;
                 // $scope.investornotesstep1 = result.data.investornotesstep1;
                 // $scope.investornotesstep2 = result.data.investornotesstep2;
                 // $scope.investornotesstep3 = result.data.investornotesstep3;
                //  $scope.investornotesstep4 = result.data.investornotesstep4;
                //  $scope.investornotesndrs = result.data.investornotesndrs;
                //  $scope.investornotesowners = result.data.investornotesowners;
  
                 
                  $scope.spinnerActive = false;
  
              });
          }
  
          $scope.listitems = $scope.investornotesprestep;
  
         $scope.selectinvestor_notescompanies_id(1);
  
          
  
          $scope.editpage = function (investor) {
             
             // //console.log(investor);
              //console.log(investor.investor_contacts_id);
             // $location.path('editinvestornote/' + investor.investor_contacts_id_url);
          }
  
  
  
      })*/

      .controller('editinvestornote', function ($scope, $http, $location, $routeParams, localStorageService, RequestDetail, configdetails, $sce, usertype, alertService) {
        $scope.configdetails = configdetails;
        $scope.pageHeading = 'Corporate Profile';
        $scope.investor = {};

        $scope.searchtext = "";
        $scope.report = {};

        $scope.investor.investor_contacts_id = '';

        $scope.tabactive = 'prestage';
        $scope.listitems = [];
        $scope.investorslected = [];

        // COLUMN TO SORT
        $scope.column = 'sno';

        // SORT ORDERING (ASCENDING OR DESCENDING). SET TRUE FOR DESENDING
        $scope.reverse = false;

        // CALLED ON HEADER CLICK
        $scope.sortColumn = function (col) {
            $scope.column = col;
            if ($scope.reverse) {
                $scope.reverse = false;
                $scope.reverseclass = 'arrow-up';
            } else {
                $scope.reverse = true;
                $scope.reverseclass = 'arrow-down';
            }
        };


        $scope.editinvestornotesid = 'sno';


        $scope.sortClass = function (col) {
            if ($scope.column == col) {
                if ($scope.reverse) {
                    return 'arrow-down';
                } else {
                    return 'arrow-up';
                }
            } else {
                return '';
            }
        };

        $scope.user_data = localStorageService.get('userdata');

        $scope.user_type = $scope.user_data.user_type;

        $scope.changetab = function (index) {
            $scope.tabactive = index;

            if ($scope.tabactive == 'prestage') {
                $scope.listitems = $scope.investornotesprestep;
            } else {
                angular.forEach($scope.userinvestornotes, function (col, index) {
                    if ($scope.tabactive == col.investor_notes_category_id) {
                        $scope.listitems = col.contacts;
                    }
                });
            }

        }

        var GetInvestorsNotesUrl = 'apiv4/public/dashboard/getInvestorsNotesCategory';
        var params = {
            type: 'get'
        };

        RequestDetail.getDetail(GetInvestorsNotesUrl, params).then(function (result) {
            $scope.investorsnotescategories = result.data;
        });


        /*$scope.investornotesprestep = [];
        $scope.investornotesstep1 = [];
        $scope.investornotesstep2 = [];
        $scope.investornotesstep3 = [];
        $scope.investornotesstep4 = [];
        $scope.investornotesndrs = [];
        $scope.investornotesowners = [];
        $scope.investornotesnoninvestors = [];
        $scope.investornotesremoved = [];*/

        $scope.investornotesprestep = [];
        $scope.userinvestornotes = [];

        $scope.total_count = 1;


        $scope.selectinvestor_notescompanies_id = function (page) {
            if (page == 1) {
                $scope.spinnerActive = true;
            }

            var url = 'apiv4/public/investornotes/getinvestornotes';
            var params = { page: page, user_id: $scope.user_id };
            RequestDetail.getDetail(url, params).then(function (result) {

                if ($scope.user_id == result.data.user_id) {
                    if (page == 1) {
                        /*$scope.investornotesprestep = [];
                        $scope.investornotesstep1 = [];
                        $scope.investornotesstep2 = [];
                        $scope.investornotesstep3 = [];
                        $scope.investornotesstep4 = [];
                        $scope.investornotesndrs = [];
                        $scope.investornotesowners = [];
                        $scope.investornotesnoninvestors = [];
                        $scope.investornotesremoved = [];*/

                        $scope.investornotesprestep = [];
                        $scope.userinvestornotes = result.data.userinvestornotes;
                        $scope.total_count = result.data.total_page;

                    } else {

                        angular.forEach(result.data.userinvestornotes, function (col, index) {
                            if (col.contacts.length > 0) {
                                angular.forEach(col.contacts, function (col1, index1) {
                                    $scope.userinvestornotes[index].contacts.push(col1);
                                });
                            }

                        });
                    }



                    if (page < $scope.total_count) {
                        $scope.selectinvestor_notescompanies_id(page + 1);
                    }

                    angular.forEach(result.data.investornotesprestep, function (col, index) {
                        $scope.investornotesprestep.push(col);
                    });



                    /*angular.forEach(result.data.investornotesstep1,function(col,index){
                        $scope.investornotesstep1.push(col);
                        
                    });
                    angular.forEach(result.data.investornotesstep2,function(col,index){
                        $scope.investornotesstep2.push(col);

                    
                    });
                    angular.forEach(result.data.investornotesstep3,function(col,index){
                        $scope.investornotesstep3.push(col);
                    
                    });
                    angular.forEach(result.data.investornotesstep4,function(col,index){
                        $scope.investornotesstep4.push(col);
                        
                    });
                    angular.forEach(result.data.investornotesndrs,function(col,index){
                        $scope.investornotesndrs.push(col);
                        
                    });
                    angular.forEach(result.data.investornotesowners,function(col,index){
                        $scope.investornotesowners.push(col);
                        
                    }); 
                    angular.forEach(result.data.investornotesnoninvestors,function(col,index){
                        $scope.investornotesnoninvestors.push(col);
                        
                    }); 
                    angular.forEach(result.data.investornotesremoved,function(col,index){
                        $scope.investornotesremoved.push(col);
                        
                    }); */

                    $scope.spinnerActive = false;

                    if ($scope.tabactive == 'prestage') {
                        $scope.listitems = $scope.investornotesprestep;
                    }

                }

            });


        }

        $scope.Promotecontacts = function () {
            var url = 'apiv4/public/investornotes/getPromotecontacts';
            var params = {};
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.selectinvestor_notescompanies_id(1);
            });
        }

        $scope.admin_status = 0;
        $scope.users = [];

        var url = 'apiv4/public/investornotes/getinvestornotesusers';
        var params = {};
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.admin_status = result.data.admin_status;
            $scope.users = result.data.users;
            $scope.user_id = result.data.user_id;
            $scope.selectinvestor_notescompanies_id(1);
        });


        $scope.listitems = $scope.investornotesprestep;


        $scope.filter_user = function () {
            $scope.selectinvestor_notescompanies_id(1);
        }

        $scope.showModalnewtouch = false;

        $scope.openmodelnewtouch = function () {
            $scope.showModalnewtouch = true;
        }

        $scope.closeModalnewtouch = function () {
            $scope.showModalnewtouch = false;
        }


        $scope.newinvestor = {};


        $scope.investor.tickerssAdded = [];

        $scope.get_investornote = function () {
            $scope.spinnerActive = true;
            var url = 'apiv4/public/investornotes/getinvestornote';
            var params = { investor_contacts_id: $scope.investor_contacts_id, investornewcontacts: $scope.investornewcontacts };
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.investor = {};
                // //console.log(result.data);
                $scope.investor = result.data;

                if (result.data.phone) {
                    $scope.investor.cell_phone = result.data.phone;
                }

                if (result.data.stage_investment_firm) {
                    $scope.investor.stage_investment_firm = result.data.stage_investment_firm;
                }

                if (!$scope.investor.stage_investor) {
                    $scope.investor.stage_investor = "";
                }
                if (!$scope.investor.stage_investment_firm) {
                    $scope.investor.stage_investment_firm = "Stage 1";
                }
                if ($scope.investor.tickerssAdded) {
                    if ($scope.investor.tickerssAdded.length > 0) {
                        $scope.investor.tickerssAdded = $scope.investor.tickerssAdded.split(',');
                    }
                } else {
                    $scope.investor.tickerssAdded = [];
                }

                $scope.spinnerActive = false;

            });
        }

        $scope.requestreport = function () {
            $scope.showModalreport = true;
        }

        $scope.saverequest = function () {
            if (!$scope.report.email || $scope.report.email == '') {
                alertService.add("warning", "Please enter email !", 2000);
                return false;
            } else if (!$scope.checkemailval($scope.report.email)) {
                alertService.add("warning", "Please enter valid email !", 2000);
                return false;
            }
            else if (!$scope.report.institution1 || $scope.report.institution1 == '') {
                alertService.add("warning", "Please enter institution 1 !", 2000);
                return false;
            }
            else if (!$scope.report.personname1 || $scope.report.personname1 == '') {
                alertService.add("warning", "Please enter person name 1 !", 2000);
                return false;
            }
            else if (!$scope.report.institution2 || $scope.report.institution2 == '') {
                alertService.add("warning", "Please enter institution 2 !", 2000);
                return false;
            }
            else if (!$scope.report.personname2 || $scope.report.personname2 == '') {
                alertService.add("warning", "Please enter person name 2 !", 2000);
                return false;
            }
            else if (!$scope.report.institution3 || $scope.report.institution3 == '') {
                alertService.add("warning", "Please enter institution 3 !", 2000);
                return false;
            }
            else if (!$scope.report.personname3 || $scope.report.personname3 == '') {
                alertService.add("warning", "Please enter person name 3 !", 2000);
                return false;
            }
            else if (!$scope.report.objections1 || $scope.report.objections1 == '') {
                alertService.add("warning", "Please enter objections 1 !", 2000);
                return false;
            }
            else if (!$scope.report.objections2 || $scope.report.objections2 == '') {
                alertService.add("warning", "Please enter objections 2 !", 2000);
                return false;
            }
            else if (!$scope.report.objections3 || $scope.report.objections3 == '') {
                alertService.add("warning", "Please enter objections 3 !", 2000);
                return false;
            } else {
                var params = $scope.report;
                var tagUrl = 'apiv4/public/investornotes/addrequestreport';
                RequestDetail.getDetail(tagUrl, params).then(function (result) {
                    $scope.report = {};
                    alertService.add("success", "Requested successfully!", 2000);
                    $scope.showModalreport = false;
                });
            }
        }

        $scope.closeModalreport = function () {
            $scope.showModalreport = false;
        }

        $scope.checkemailval = function (email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }


        $scope.triggerview = function (index) {
            $scope.poptimes = $scope.investor.triggers[index].mailviewes_status.mailviewed;
            $scope.titletimes = 'Open Detail';
            $scope.showModalpagetimes = true;
        }
        $scope.triggerclick = function (index) {
            $scope.poptimes = $scope.investor.triggers[index].mailviewes_status.mailclicked;
            $scope.titletimes = 'Click Detail';
            $scope.showModalpagetimes = true;
        }
        $scope.closetimes = function () {
            $scope.showModalpagetimes = false;
        }

        $scope.researchsview = function (index) {
            $scope.poptimes = $scope.investor.researchs[index].mailviewes_status.mailviewed;
            $scope.titletimes = 'Open Detail';
            $scope.showModalpagetimes = true;
        }
        $scope.researchsclick = function (index) {
            $scope.poptimes = $scope.investor.researchs[index].mailviewes_status.mailclicked;
            $scope.titletimes = 'Click Detail';
            $scope.showModalpagetimes = true;
        }

        // $scope.get_investornote();


        $scope.get_search_details = function (type, searchkey, industype) {
            if (angular.isDefined(searchkey) && searchkey != '') {
                if (type != '') {
                    var tagUrl = 'apiv4/public/user/get_search_details1';
                    var searchterm = searchkey;

                    if (type == 'industry') {
                        var params = { term: searchterm, key: type, industype: industype };
                        RequestDetail.getDetail(tagUrl, params).then(function (result) {
                            if (angular.isDefined(result.data) && result.data.length > 0) {
                                $scope.availableIndustry = result.data;
                                if (industype == 'sectors') {
                                    $scope.availableIndustry_sector = result.data;
                                }
                            } else {
                                $scope.availableIndustry = [];
                                if (industype == 'sectors') {
                                    $scope.availableIndustry_sector = [];
                                }
                            }
                        });
                    }

                    if (type == 'ticker') {
                        var params = searchterm;
                        var tagUrl = 'apiv4/public/dashboard/get_auto_ticker_stock';
                        RequestDetail.getDetail(tagUrl, params).then(function (result) {
                            if (angular.isDefined(result.data) && result.data.length > 0) {
                                $scope.availableTickers = result.data;
                            } else {
                                $scope.availableTickers = [];
                            }
                        });
                    }

                }
            }
        }

        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }
        $scope.addticker = function () {

            var arrays = $scope.investor.add_ticker.split(',');

            angular.forEach(arrays, function (data, key) {
                $scope.investor.tickerssAdded.push(data);
                $scope.investor.tickerssAdded = $scope.investor.tickerssAdded.filter(onlyUnique);
                $scope.investor.add_ticker = '';
            });

            // if($scope.investor.add_ticker[0]){
            //     $scope.investor.tickerssAdded.push($scope.investor.add_ticker[0]);
            //     $scope.investor.tickerssAdded = $scope.investor.tickerssAdded.filter( onlyUnique );
            //     $scope.investor.add_ticker = [];
            // }
        }

        $scope.removeTagging = function (index) {
            $scope.investor.tickerssAdded.splice(index, 1);
        }



        $scope.editInvestornotes = function () {


            var error_flag = 0;
            /*  if(!$scope.investor.firstname || $scope.investor.firstname  == ''){
                 alertService.add("warning", "Please enter first name !",2000);
                 error_flag++;
                 return false;
             }else if(!$scope.investor.lastname || $scope.investor.lastname  == ''){
                 alertService.add("warning", "Please enter last name !",2000);
                 error_flag++;
                 return false;
             }
             else if(!$scope.investor.company || $scope.investor.company  == ''){
                 alertService.add("warning", "Please enter firm name !",2000);
                 error_flag++;
                 return false;
             }
            else if(!$scope.investor.fund_name || $scope.investor.fund_name  == ''){
                 alertService.add("warning", "Please enter fund name !",2000);
                 error_flag++;
                 return false;
             }
             else if(!$scope.investor.title || $scope.investor.title  == ''){
                 alertService.add("warning", "Please select title !",2000);
                 error_flag++;
                 return false;
             }
             /*else if(!$scope.investor.phone || $scope.investor.phone  == ''){
                 alertService.add("warning", "Please select phone !",2000);
                 error_flag++;
                 return false;
             }
             else if(!$scope.investor.cell_phone || $scope.investor.cell_phone  == ''){
                 alertService.add("warning", "Please select cell phone !",2000);
                 error_flag++;
                 return false;
             }
             else if(!$scope.investor.email || $scope.investor.email  == ''){
                 alertService.add("warning", "Please select email !",2000);
                 error_flag++;
                 return false;
             }else if(!$scope.investor.address1 || $scope.investor.address1  == ''){
                 alertService.add("warning", "Please select address 1 !",2000);
                 error_flag++;
                 return false;
             }else if(!$scope.investor.city || $scope.investor.city  == ''){
                 alertService.add("warning", "Please select city !",2000);
                 error_flag++;
                 return false;
             }else if(!$scope.investor.state || $scope.investor.state  == ''){
                 alertService.add("warning", "Please select state !",2000);
                 error_flag++;
                 return false;
             }else if(!$scope.investor.zip || $scope.investor.zip  == ''){
                 alertService.add("warning", "Please select zip !",2000);
                 error_flag++;
                 return false;
             }
             else if(!$scope.investor.region || $scope.investor.region  == ''){
                 alertService.add("warning", "Please select region !",2000);
                 error_flag++;
                 return false;
             }
            if (!$scope.investor.stage_investor || $scope.investor.stage_investor == '') {
                alertService.add("warning", "Please select stage investor !", 2000);
                error_flag++;
                return false;
            } else*/
            /* if($scope.investor.stage_investor!='Deferred'){
                 if (!$scope.investor.method_of_contact || $scope.investor.method_of_contact == '') {
                     alertService.add("warning", "Please select method of contact !", 2000);
                     error_flag++;
                     return false;
                 } else if (!$scope.investor.time_of_contact || $scope.investor.time_of_contact == '') {
                     alertService.add("warning", "Please select time of contact !", 2000);
                     error_flag++;
                     return false;
                 } else if (!$scope.investor.personal_notes || $scope.investor.personal_notes == '') {
                     alertService.add("warning", "Please select personal notes !", 2000);
                     error_flag++;
                     return false;
                 }
             }*/



            var Url = 'apiv4/public/investornotes/update_investornotes';
            var params = { data: $scope.investor, tickers: $scope.investor.tickerssAdded, id: $scope.investor.investornoteId };

            RequestDetail.getDetail(Url, params).then(function (result) {
                if (result) {
                    alertService.add("success", "Updated successfully!", 2000);

                    if ($scope.investorslected.stage_investor == '' || !$scope.investorslected.stage_investor || $scope.investorslected.stage_investor == 'prestage') {
                        var this_index = $scope.investornotesprestep.indexOf($scope.investorslected);
                        $scope.investornotesprestep.splice(this_index, 1);

                    } else {

                        angular.forEach($scope.userinvestornotes, function (col, index) {
                            if ($scope.investorslected.stage_investor == col.investor_notes_category_id) {
                                var this_index = $scope.userinvestornotes[index].contacts.indexOf($scope.investorslected);
                                $scope.userinvestornotes[index].contacts.splice(this_index, 1);
                            }
                        });

                    }

                    if ($scope.investor.stage_investor == '' || !$scope.investor.stage_investor || $scope.investor.stage_investor == 'prestage') {
                        $scope.investorslected.stage_investor = '';
                        $scope.investornotesprestep.push($scope.investor);
                    } else {
                        angular.forEach($scope.userinvestornotes, function (col, index) {
                            if ($scope.investor.stage_investor == col.investor_notes_category_id) {
                                $scope.userinvestornotes[index].contacts.push($scope.investor);
                            }
                        });
                    }



                    $scope.investor = [];

                    $scope.investorslected = [];

                    $scope.changetab($scope.tabactive);

                }
            });


        }


        $scope.removeInvestornotes = function (investor) {

            var Url = 'apiv4/public/investornotes/delete_investornotes';
            var params = { data: investor };

            RequestDetail.getDetail(Url, params).then(function (result) {
                if (result) {


                    if (investor.stage_investor == '' || !investor.stage_investor || investor.stage_investor == 'prestage') {
                        var this_index = $scope.investornotesprestep.indexOf(investor);
                        $scope.investornotesprestep.splice(this_index, 1);

                    } else {
                        angular.forEach($scope.userinvestornotes, function (col, index) {
                            if ($scope.investor.stage_investor == col.investor_notes_category_id) {
                                var this_index = $scope.userinvestornotes[index].contacts.indexOf(investor);
                                $scope.userinvestornotes[index].contacts.splice(this_index, 1);
                            }
                        });
                    }

                    angular.forEach($scope.userinvestornotes, function (col, index) {
                        if (col.name == 'Deferred') {
                            investor.stage_investor = col.investor_notes_category_id;
                            $scope.userinvestornotes[index].contacts.push(investor);
                        }
                    });


                }
            });
        }


        $scope.openinvestorlist = function () {
            $scope.investor.investor_contacts_id = '';
        }

        $scope.touch_editstatus = 0;

        $scope.savetouch = function () {
            var error_flag = 0;




            if (!$scope.newinvestor.person_that_made_touch || $scope.newinvestor.person_that_made_touch == '') {
                alertService.add("warning", "Please enter person !", 2000);
                error_flag++;
                return false;
            }
            else if (!$scope.newinvestor.type_touch || $scope.newinvestor.type_touch == '') {
                alertService.add("warning", "Please select type !", 2000);
                error_flag++;
                return false;
            }
            else if (!$scope.newinvestor.action || $scope.newinvestor.action == '') {
                alertService.add("warning", "Please select action !", 2000);
                error_flag++;
                return false;
            }
            /*else if (!$scope.newinvestor.interest || $scope.newinvestor.interest == '') {
                alertService.add("warning", "Please select interest !", 2000);
                error_flag++;
                return false;
            }*/
            else if (!$scope.newinvestor.personal_notes || $scope.newinvestor.personal_notes == '') {
                alertService.add("warning", "Please enter personal notes !", 2000);
                error_flag++;
                return false;
            } else {
                if (error_flag == 0) {
                    var Url = 'apiv4/public/investornotes/add_investornotestouch';
                    var params = { data: $scope.investor, tickers: $scope.investor.tickerssAdded, newinvestor: $scope.newinvestor };

                    RequestDetail.getDetail(Url, params).then(function (result) {
                        if (result) {
                            $scope.newinvestor = [];
                            $scope.get_investornote();
                            $scope.showModalnewtouch = false;
                            alertService.add("success", "Added successfully!", 2000);
                            // $location.path('investornotes');
                            if ($scope.investorslected.stage_investor == '' || !$scope.investorslected.stage_investor) {
                                var this_index = $scope.investornotesprestep.indexOf($scope.investorslected);
                                $scope.investornotesprestep[this_index].touch_date_added = result.data.date;
                                $scope.investornotesprestep[this_index].stage_investor = $scope.newinvestor.interest;

                            } else {
                                angular.forEach($scope.userinvestornotes, function (col, index) {
                                    if ($scope.investor.stage_investor == col.investor_notes_category_id) {
                                        var this_index = $scope.userinvestornotes[index].contacts.indexOf($scope.investorslected);
                                        $scope.userinvestornotes[index].contacts[this_index].touch_date_added = result.data.date;
                                        $scope.userinvestornotes[index].contacts[this_index].stage_investor = $scope.newinvestor.interest;
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }


        $scope.edittouch = function (index) {
            $scope.touch_editstatus = 1;
            $scope.newinvestor = $scope.investor.investor_notes_touch[index];
            $scope.showModalnewtouch = true;
        }

        $scope.updatetouch = function () {
            var error_flag = 0;

            if (!$scope.newinvestor.person_that_made_touch || $scope.newinvestor.person_that_made_touch == '') {
                alertService.add("warning", "Please enter person !", 2000);
                error_flag++;
                return false;
            }
            else if (!$scope.newinvestor.type_touch || $scope.newinvestor.type_touch == '') {
                alertService.add("warning", "Please select type !", 2000);
                error_flag++;
                return false;
            }
            else if (!$scope.newinvestor.action || $scope.newinvestor.action == '') {
                alertService.add("warning", "Please select action !", 2000);
                error_flag++;
                return false;
            }
            else if (!$scope.newinvestor.interest || $scope.newinvestor.interest == '') {
                alertService.add("warning", "Please select interest !", 2000);
                error_flag++;
                return false;
            }
            else if (!$scope.newinvestor.personal_notes || $scope.newinvestor.personal_notes == '') {
                alertService.add("warning", "Please enter personal notes !", 2000);
                error_flag++;
                return false;
            } else {
                if (error_flag == 0) {
                    var Url = 'apiv4/public/investornotes/update_investornotestouch';
                    var params = { data: $scope.investor, tickers: $scope.investor.tickerssAdded, newinvestor: $scope.newinvestor };

                    RequestDetail.getDetail(Url, params).then(function (result) {
                        if (result) {
                            $scope.touch_editstatus = 0;
                            $scope.newinvestor = [];
                            $scope.get_investornote();
                            $scope.showModalnewtouch = false;
                            alertService.add("success", "Updated successfully!", 2000);
                            // $location.path('investornotes');
                        }
                    });
                }
            }
        }


        $scope.editpage = function (investor) {
            $scope.spinnerActive = true;
            $scope.investorslected = investor;
            $scope.investor_contacts_id = investor.investor_contacts_id;
            $scope.investornewcontacts = investor.investornewcontacts;
            $scope.get_investornote();
        }


    })
    .controller('editinvestornotecontacts', function ($scope, $http, $location, $routeParams, localStorageService, RequestDetail, configdetails, $sce, usertype, alertService, $timeout) {
        
        $scope.configdetails = configdetails;
        $scope.pageHeading = 'Corporate Profile';
        $scope.investor = {};

        $scope.searchtext = "";
        $scope.report = {};

        $scope.investor.investor_contacts_id = '';

        $scope.interestswitch = false;

        $scope.tabactive = 'prestage';
        $scope.listitems = [];
        $scope.investorslected = [];

        // COLUMN TO SORT
        $scope.column = 'sno';

        // SORT ORDERING (ASCENDING OR DESCENDING). SET TRUE FOR DESENDING
        $scope.reverse = false;

        // CALLED ON HEADER CLICK
        $scope.sortColumn = function (col) {
            $scope.column = col;
            if ($scope.reverse) {
                $scope.reverse = false;
                $scope.reverseclass = 'arrow-up';
            } else {
                $scope.reverse = true;
                $scope.reverseclass = 'arrow-down';
            }
        };

		$scope.sortColumn("totalreport");								 

        $scope.editinvestornotesid = 'sno';


        $scope.sortClass = function (col) {
            if ($scope.column == col) {
                if ($scope.reverse) {
                    return 'arrow-down';
                } else {
                    return 'arrow-up';
                }
            } else {
                return '';
            }
        };

        $scope.activetab = 0;
        // //console.log($scope.activetab);

        $scope.changecontacttab = function (tab) {
            $scope.activetab = tab;
        };
        


        $scope.user_data = localStorageService.get('userdata');

        $scope.user_type = $scope.user_data.user_type;

        $scope.activetabtext = 'Pre Stage';

        $scope.changetab = function (index) {
            $scope.tabactive = index;

            if ($scope.tabactive == 'prestage') {
                $scope.listitems = $scope.investornotesprestep;
                $scope.activetabtext = 'Pre Stage';
            } else {
                angular.forEach($scope.userinvestornotes, function (col, index) {
                    if ($scope.tabactive == col.investor_notes_category_id) {
                        $scope.listitems = col.contacts;
                        $scope.activetabtext = col.name;
                    }
                });
            }

        }

        var GetInvestorsNotesUrl = 'apiv4/public/dashboard/getInvestorsNotesCategory';
        var params = {
            type: 'get'
        };

        RequestDetail.getDetail(GetInvestorsNotesUrl, params).then(function (result) {
            $scope.investorsnotescategories = result.data;
        });

        $scope.importeddata = [];
        $scope.importeddata_status = 0;
        $scope.import_investor_excel = function (data) {
            $scope.$apply(function () {
                $scope.importeddata = JSON.parse(data);
                $scope.importeddata_status = 1;
                $scope.selectinvestor_notescompanies_id(1);
            });
        }

        $scope.investornotesprestep = [];
        $scope.userinvestornotes = [];

        $scope.total_count = 1;

        $scope.loadmorestatus = 1;
        $scope.loadmorecount = 1;

        $scope.searchtextstatus = "";
        $scope.investornotesprestepcount = 0;

        $scope.selectinvestor_notescompanies_id = function (page) {
            // //console.log($scope.user_id);
            if (page == 1) {
                $scope.spinnerActive = true;
            }

            $scope.searchtextstatus = $scope.searchtext;

            var url = 'apiv4/public/investornotes/getinvestornotescontacts';
            var params = { page: page, user_id: $scope.user_id, search: $scope.searchtext };
            RequestDetail.getDetail(url, params).then(function (result) {

                // //console.log(result.data);
                if ($scope.user_id == result.data.user_id) {
                    if (page == 1) {
                        $scope.investornotesprestep = [];
                        $scope.userinvestornotes = result.data.userinvestornotes;
                        $scope.total_count = result.data.total_page;
                    } else {
                        angular.forEach(result.data.userinvestornotes, function (col, index) {
                            if (col.contacts.length > 0) {
                                angular.forEach(col.contacts, function (col1, index1) {
                                    if (col.firstname) {
                                        col.firstname = col.firstname.replace(/\\/g, "");
                                    }
                                    if (col.lastname) {
                                        col.lastname = col.lastname.replace(/\\/g, "");
                                    }
                                    if (col.company) {
                                        col.company = col.company.replace(/\\/g, "");
                                    }
                                    $scope.userinvestornotes[index].contacts.push(col1);
                                });
                            }

                        });
                    }

                    $scope.investornotesprestepcount = result.data.investornotesprestepcount;

                    if (page < $scope.total_count) {
                        // $scope.selectinvestor_notescompanies_id(page+1);
                        $scope.loadmorecount = page + 1;
                    } else {
                        $scope.loadmorestatus = 0;
                    }

                    angular.forEach(result.data.investornotesprestep, function (col, index) {
                        if (col.firstname) {
                            col.firstname = col.firstname.replace(/\\/g, "");
                        }
                        if (col.lastname) {
                            col.lastname = col.lastname.replace(/\\/g, "");
                        }
                        if (col.company) {
                            col.company = col.company.replace(/\\/g, "");
                        }
                        $scope.investornotesprestep.push(col);
                    });


                    $scope.spinnerActive = false;

                    if ($scope.tabactive == 'prestage') {
                        $scope.listitems = $scope.investornotesprestep;
                    }

                }

            });


        }

        $scope.adddistributelist = function () {
            if ($scope.investor.distributelist && $scope.investor.distributelist != '0') {
                var selecteddistribute = $scope.investor.distributelist.split('|@|');

                var distribute = {
                    list_name: selecteddistribute[0],
                    list_id: selecteddistribute[1]
                };

                $scope.addstatus = 1;
                angular.forEach($scope.investor.distributesAdded, function (data, key) {
                    if (data.list_id == selecteddistribute[1]) {
                        $scope.addstatus = 0;
                    }
                });

                if ($scope.addstatus) {
                    $scope.investor.distributesAdded.push(distribute);
                }

            }
            if ($scope.investor.distributelist == '0') {
                var distribute = {
                    list_name: '',
                    list_id: 0
                };
                $scope.investor.newdistributelists.push(distribute);
            }
        }

        $scope.removedistributeTagging = function (index) {
            $scope.investor.distributesAdded.splice(index, 1);
        }
        $scope.removenewdistributeTagging = function (index) {
            $scope.investor.newdistributelists.splice(index, 1);
        }
        $scope.removeaddeddistributeTagging = function (index, investor_list_id) {
            $scope.investor.distribute_lists.splice(index, 1);
            $scope.investor.removeddistributelists.push(investor_list_id);
        }


        $scope.hideimporteddata_status = function () {
            $scope.importeddata_status = 0;
        }

        $scope.clearsearch = function () {
            $scope.searchtext = '';
            $scope.selectinvestor_notescompanies_id(1);
        }

        $scope.investorsloadmore = function (count) {
            $scope.spinnerActive = true;
            $scope.selectinvestor_notescompanies_id(count);
        }

        $scope.searchinvestors = function () {
            $scope.spinnerActive = true;
            $scope.selectinvestor_notescompanies_id(1);
        }


        $scope.Promotecontacts = function () {
            $scope.spinnerActive = true;
            var url = 'apiv4/public/investornotes/Promotecontacts';
            var params = {};
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.selectinvestor_notescompanies_id(1);
                if(result.data.updated_count){
                    alertService.add("success", result.data.updated_count+" contacts moved to Propects successfully !", 2000);
                }else{
                    alertService.add("warning", "No leads to promote!", 2000);
                }
                
                $scope.spinnerActive = false;
            });
        }

        $scope.admin_status = 0;
        
         $scope.users = [];

        var url = 'apiv4/public/investornotes/getinvestornotesusers';
        var params = {};
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.admin_status = result.data.admin_status;
            $scope.users = result.data.users;
            $scope.user_id = result.data.user_id;
            $scope.selectinvestor_notescompanies_id(1);
        }); 


        $scope.investorsList = [];
        $scope.getList = function () {
            var GetInvestorsListUrl = 'apiv4/public/dashboard/getInvestorsList';
            var params = {
                type: 'get'
            };

            RequestDetail.getDetail(GetInvestorsListUrl, params).then(function (result) {
                $scope.investorsList = result.data;
            });
        }

        $scope.getList();


        $scope.listitems = $scope.investornotesprestep;


        $scope.filter_user = function () {
            $scope.selectinvestor_notescompanies_id(1);
        }

        $scope.showModalnewtouch = false;

        $scope.openmodelnewtouch = function () {
            $scope.showModalnewtouch = true;
        }

        $scope.closeModalnewtouch = function () {
            $scope.showModalnewtouch = false;
        }



        $scope.showreadershiptable = 0;

        $scope.showreadershiptab = function () {
            $scope.showreadershiptable = 1;
        }
        
        $scope.showModalreadershiptimes = false;

        $scope.readershiptimes = [];
        $scope.viewreadershipclik = function (readership) {
            $scope.readershiptimes = readership.clicks;
            $scope.showModalreadershiptimes = true;
        }

        $scope.closereadershiptimes = function () {
            $scope.showModalreadershiptimes = false;
        }

		// COLUMN TO SORT
		$scope.column_holders = 'position_original/1';

		// SORT ORDERING (ASCENDING OR DESCENDING). SET TRUE FOR DESENDING
		$scope.reverse_holders = true;

		// CALLED ON HEADER CLICK
		$scope.sortColumnHolders = function (col) {
			$scope.column_holders = col;
			if ($scope.reverse_holders) {
				$scope.reverse_holders = false;
				$scope.reverseclass = 'arrow-up';
			} else {
				$scope.reverse_holders = true;
				$scope.reverseclass = 'arrow-down';
			}
		};

		$scope.sortClassHolders = function (col) {
			if ($scope.column_holders == col) {
				if ($scope.reverse_holders) {
					return 'arrow-down';
				} else {
					return 'arrow-up';
				}
			} else {
				return '';
			}
		};
		
		$scope.show_sector_interest = true;
		$scope.show_captilization_interest = false;
		
		//MASTER INDUSTRIES
		$scope.industries = [
			{ industry_name: 'Aerospace & Defense' },
			{ industry_name: 'Air Freight & Logistics' },
			{ industry_name: 'Airlines' },
			{ industry_name: 'Auto Components' },
			{ industry_name: 'Automobiles' },
			{ industry_name: 'Banks' },
			{ industry_name: 'Beverages' },
			{ industry_name: 'Biotechnology' },
			{ industry_name: 'Building Products' },
			{ industry_name: 'Capital Markets' },
			{ industry_name: 'Chemicals' },
			{ industry_name: 'Commercial Services & Supplies' },
			{ industry_name: 'Communications Equipment' },
			{ industry_name: 'Construction & Engineering' },
			{ industry_name: 'Construction Materials' },
			{ industry_name: 'Containers & Packaging' },
			{ industry_name: 'Distributors' },
			{ industry_name: 'Diversified Consumer Services' },
			{ industry_name: 'Diversified Financial Services' },
			{ industry_name: 'Diversified Telecommunication Services' },
			{ industry_name: 'Electric Utilities' },
			{ industry_name: 'Electrical Equipment' },
			{ industry_name: 'Electronic Equipment, Instruments & Components' },
			{ industry_name: 'Energy Equipment & Services' },
			{ industry_name: 'Entertainment' },
			{ industry_name: 'ETFs/Close-End Funds' },
			{ industry_name: 'Food & Staples Retailing' },
			{ industry_name: 'Food Products' },
			{ industry_name: 'Gas Utilities' },
			{ industry_name: 'Health Care Providers & Services' },
			{ industry_name: 'Hotels, Restaurants & Leisure' },
			{ industry_name: 'Household Durables' },
			{ industry_name: 'Independent Power and Renewable Electricity Producers' },
			{ industry_name: 'Industrial Conglomerates' },
			{ industry_name: 'Insurance' },
			{ industry_name: 'Internet & Direct Marketing Retail' },
			{ industry_name: 'Internet Software & Services' },
			{ industry_name: 'IT Services' },
			{ industry_name: 'Leisure Products' },
			{ industry_name: 'Machinery' },
			{ industry_name: 'Media' },
			{ industry_name: 'Metals & Mining' },
			{ industry_name: 'Mortgage Real Estate Investment Trusts (REITs)' },
			{ industry_name: 'Multiline Retail' },
			{ industry_name: 'Oil, Gas & Consumable Fuels' },
			{ industry_name: 'Paper & Forest Products' },
			{ industry_name: 'Personal Products' },
			{ industry_name: 'Pharmaceuticals' },
			{ industry_name: 'Real Estate Management & Development' },
			{ industry_name: 'Road & Rail' },
			{ industry_name: 'Semiconductors & Semiconductor Equipment' },
			{ industry_name: 'Specialty Retail' },
			{ industry_name: 'Technology Hardware, Storage & Peripherals' },
			{ industry_name: 'Textiles, Apparel & Luxury Goods' },
			{ industry_name: 'Tobacco' },
			{ industry_name: 'Trading Companies & Distributors' },
			{ industry_name: 'Transportation Infrastructure' },
			{ industry_name: 'Water Utilities' },
			{ industry_name: 'Wireless Telecommunication Services' }
		];
		
		//MASTER SECTOR
		$scope.sectors = [
			{ sector_name: 'Communication Services' },
			{ sector_name: 'Consumer Discretionary' },
			{ sector_name: 'Consumer Staples' },
			{ sector_name: 'Energy' },
			{ sector_name: 'ETFs/Close-End Funds' },
			{ sector_name: 'Financials' },
			{ sector_name: 'Health Care' },
			{ sector_name: 'Industrials' },
			{ sector_name: 'Information Technology' },
			{ sector_name: 'Materials' },
			{ sector_name: 'Real Estate' },
			{ sector_name: 'Utilities' },
		];
		
		//COLOUR CODE CELL
		$scope.colorCodeHolders = function (val1,val2) {
			if (val1 != val2) {
				if (val1 > val2) {
					return 'actual_Increased';
				} else {
					return 'actual_Decreased';
				}
			} else {
				return '';
			}
		};

		$scope.staticfilter = {};
		$scope.staticfilter.limit = '501'; 		
		$scope.filter = {};

		$scope.limitfilter = function(){
			var allpredict =[];

			$scope.spinnerActive = true;
			
			$scope.holders = [];
			allpredict = $scope.copyholdersall;

			var predicts = [];

			if($scope.staticfilter['capitalization']){
				var predicts = [];
				angular.forEach(allpredict,function(col,index){
					if($scope.staticfilter['capitalization']==col.capitalization){
						predicts.push(col);
					}
				});
				allpredict = predicts;
			}

			if($scope.staticfilter['industry']){
				var predicts = [];
				angular.forEach(allpredict,function(col,index){
					if($scope.staticfilter['industry']==col.industry){
						predicts.push(col);
					}
				});
				allpredict = predicts;
			}
			
			if($scope.staticfilter['sector']){
				var predicts = [];
				angular.forEach(allpredict,function(col,index){
					if($scope.staticfilter['sector']==col.sector){
						predicts.push(col);
					}
				});
				allpredict = predicts;
			}

			$scope.holders = allpredict;

			$scope.spinnerActive = false;

		}

		// CLEAR CURRENT FILTER
		$scope.clear_filter = function(){
			$scope.staticfilter.limit = '501'; 		
			$scope.staticfilter.capitalization = "";
			$scope.staticfilter.industry = "";
			$scope.staticfilter.sector = "";
			$scope.holders = [];
			$scope.holders = $scope.copyholdersall;
		}


		// DEFINE OWNERSHIP CALL
		$scope.getHolders = function (qdata,count) {
			if($scope.investor_contacts_id){
				$scope.filter.count = count;
		
				// GET OWNERSHIP DETAILS
				var url = 'apiv4/public/investornotes/getcontactownership';
				var params = { investor_contacts_id: $scope.investor_contacts_id, count:count };
				RequestDetail.getDetail(url, params).then(function (result) {
					// //console.log(result.data);
					if(!qdata){
						$scope.staticfilter.quat= '0';
					}
					
					if(result.data.count==1){
						$scope.holders = [];
						$scope.copyholdersall = [];

						$scope.holders = result.data.holders;
						$scope.copyholdersall = result.data.holders;

						$scope.total_holders = +result.data.total_holders+1;
						
					}else{
						angular.forEach(result.data.holders,function(col,index){
							$scope.holders.push(col);
						});
						
						//RESET MASTER ARRAY
						$scope.copyholdersall = $scope.holders;

					}
					
					if(+result.data.count!=+$scope.total_holders){
						$scope.getHolders(qdata,+result.data.count+1);
					}
				});
			}
		}

        
        $scope.toggleinterest = function () {
            $scope.interestswitch = !$scope.interestswitch;
        }

		// DEFINE SECTOR INTEREST CALL
		$scope.getSectorInterest = function () {
			if($scope.investor_contacts_id){
		
				$scope.sector_interest = [];
				$scope.SecQuarterYears = [];
				// GET OWNERSHIP DETAILS
				var url = 'apiv4/public/investornotes/getsectorinterest';
				var params = { investor_contacts_id: $scope.investor_contacts_id };
				RequestDetail.getDetail(url, params).then(function (result) {
					// //console.log(result.data);
					$scope.sector_interest = result.data.holders;
					$scope.SecQuarterYears = result.data.QuarterYears;

                    // //console.log($scope.QuarterYears);
					
					$scope.labels_graph_sector = result.data.ChartValueSector;
					$scope.data_graph_sector = result.data.ChartValueAum;
					// '#062437',
					$scope.colors_graph_sector = ['#041825','#0C496E','#0d5480','#116DA7','#1486CC','#209CE9','#45ADED','#6ABDF0','#A2D6F6','#C7E6F9','#EDF7FD' ];
					$scope.options_graph_sector = {
						legend: {
							display: true,
							position: 'right',
						}
					}
				});
			}
		}

		// DEFINE SECTOR INTEREST CALL
		$scope.getCapitalizationInterest = function () {
			if($scope.investor_contacts_id){
		
				$scope.capitalization_interest = [];
				$scope.CapQuarterYears = [];
				// GET OWNERSHIP DETAILS
				var url = 'apiv4/public/investornotes/getcapitalizationinterest';
				var params = { investor_contacts_id: $scope.investor_contacts_id };
				RequestDetail.getDetail(url, params).then(function (result) {
					// //console.log(result.data);
					$scope.capitalization_interest = result.data.holders;
					$scope.CapQuarterYears = result.data.QuarterYears;
					
					// //console.log(result.data.ChartValueSector);
					$scope.labels_graph_captilization = result.data.ChartValueCapitalization;
					$scope.data_graph_captilization = result.data.ChartValueAum;
					$scope.colors_graph_captilization = [ '#0C496E', '#116DA7', '#209CE9', '#6ABDF0', '#C7E6F9' ];
					$scope.options_graph_captilization = {
						legend: {
							display: true,
							position: 'right',
						}
					}
				});
			}
		}

        $scope.newinvestor = {};

        $scope.investor.tickerssAdded = [];

        $scope.get_investornote = function () {
			
			// SHOW LOADER
            $scope.spinnerActive = true;
			
			// GET CONTACT DETAILS
            var url = 'apiv4/public/investornotes/getinvestornotecontact';
            var params = { investor_contacts_id: $scope.investor_contacts_id, investornewcontacts: $scope.investornewcontacts };
            RequestDetail.getDetail(url, params).then(function (result) {
				// //console.log(result.data);
                $scope.investor = {};
                $scope.investor = result.data;
                $scope.investor.distributesAdded = [];
                $scope.investor.newdistributelists = [];
                $scope.investor.removeddistributelists = [];
                if (result.data.phone) {
                    $scope.investor.cell_phone = result.data.phone;
                }

                if (result.data.stage_investment_firm) {
                    $scope.investor.stage_investment_firm = result.data.stage_investment_firm;
                }

                if (!$scope.investor.stage_investor) {
                    $scope.investor.stage_investor = "";
                }
                if (!$scope.investor.stage_investment_firm) {
                    $scope.investor.stage_investment_firm = "Stage 1";
                }
                if ($scope.investor.tickerssAdded) {
                    if ($scope.investor.tickerssAdded.length > 0) {
                        $scope.investor.tickerssAdded = $scope.investor.tickerssAdded.split(',');
                    }
                } else {
                    $scope.investor.tickerssAdded = [];
                }

				// HIDE LOADER
                $scope.spinnerActive = false;
            });
			
			//CALL SECTOR INTEREST
			$scope.getSectorInterest();
			
			//CALL SECTOR INTEREST
			$scope.getCapitalizationInterest();

			//CALL OWNERSHIP
			$scope.getHolders(0,1);
			
        }

		
        $scope.requestreport = function () {
            $scope.showModalreport = true;
        }

        $scope.saverequest = function () {
            if (!$scope.report.email || $scope.report.email == '') {
                alertService.add("warning", "Please enter email !", 2000);
                return false;
            } else if (!$scope.checkemailval($scope.report.email)) {
                alertService.add("warning", "Please enter valid email !", 2000);
                return false;
            }
            else if (!$scope.report.institution1 || $scope.report.institution1 == '') {
                alertService.add("warning", "Please enter institution 1 !", 2000);
                return false;
            }
            else if (!$scope.report.personname1 || $scope.report.personname1 == '') {
                alertService.add("warning", "Please enter person name 1 !", 2000);
                return false;
            }
            else if (!$scope.report.institution2 || $scope.report.institution2 == '') {
                alertService.add("warning", "Please enter institution 2 !", 2000);
                return false;
            }
            else if (!$scope.report.personname2 || $scope.report.personname2 == '') {
                alertService.add("warning", "Please enter person name 2 !", 2000);
                return false;
            }
            else if (!$scope.report.institution3 || $scope.report.institution3 == '') {
                alertService.add("warning", "Please enter institution 3 !", 2000);
                return false;
            }
            else if (!$scope.report.personname3 || $scope.report.personname3 == '') {
                alertService.add("warning", "Please enter person name 3 !", 2000);
                return false;
            }
            else if (!$scope.report.objections1 || $scope.report.objections1 == '') {
                alertService.add("warning", "Please enter objections 1 !", 2000);
                return false;
            }
            else if (!$scope.report.objections2 || $scope.report.objections2 == '') {
                alertService.add("warning", "Please enter objections 2 !", 2000);
                return false;
            }
            else if (!$scope.report.objections3 || $scope.report.objections3 == '') {
                alertService.add("warning", "Please enter objections 3 !", 2000);
                return false;
            } else {
                var params = $scope.report;
                var tagUrl = 'apiv4/public/investornotes/addrequestreport';
                RequestDetail.getDetail(tagUrl, params).then(function (result) {
                    $scope.report = {};
                    alertService.add("success", "Requested successfully!", 2000);
                    $scope.showModalreport = false;
                });
            }
        }

        $scope.closeModalreport = function () {
            $scope.showModalreport = false;
        }

        $scope.checkemailval = function (email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }


        $scope.triggerview = function (index) {
            $scope.poptimes = $scope.investor.triggers[index].mailviewes_status.mailviewed;
            $scope.titletimes = 'Open Detail';
            $scope.showModalpagetimes = true;
        }
        $scope.triggerclick = function (index) {
            $scope.poptimes = $scope.investor.triggers[index].mailviewes_status.mailclicked;
            $scope.titletimes = 'Click Detail';
            $scope.showModalpagetimes = true;
        }
        $scope.closetimes = function () {
            $scope.showModalpagetimes = false;
        }

        $scope.researchsview = function (index) {
            $scope.poptimes = $scope.investor.researchs[index].mailviewes_status.mailviewed;
            $scope.titletimes = 'Open Detail';
            $scope.showModalpagetimes = true;
        }
        $scope.researchsclick = function (index) {
            $scope.poptimes = $scope.investor.researchs[index].mailviewes_status.mailclicked;
            $scope.titletimes = 'Click Detail';
            $scope.showModalpagetimes = true;
        }

        // $scope.get_investornote();


        $scope.get_search_details = function (type, searchkey, industype) {
            if (angular.isDefined(searchkey) && searchkey != '') {
                if (type != '') {
                    var tagUrl = 'apiv4/public/user/get_search_details1';
                    var searchterm = searchkey;

                    if (type == 'industry') {
                        var params = { term: searchterm, key: type, industype: industype };
                        RequestDetail.getDetail(tagUrl, params).then(function (result) {
                            if (angular.isDefined(result.data) && result.data.length > 0) {
                                $scope.availableIndustry = result.data;
                                if (industype == 'sectors') {
                                    $scope.availableIndustry_sector = result.data;
                                }
                            } else {
                                $scope.availableIndustry = [];
                                if (industype == 'sectors') {
                                    $scope.availableIndustry_sector = [];
                                }
                            }
                        });
                    }

                    if (type == 'ticker') {
                        var params = searchterm;
                        var tagUrl = 'apiv4/public/dashboard/get_auto_ticker_stock';
                        RequestDetail.getDetail(tagUrl, params).then(function (result) {
                            if (angular.isDefined(result.data) && result.data.length > 0) {
                                $scope.availableTickers = result.data;
                            } else {
                                $scope.availableTickers = [];
                            }
                        });
                    }

                }
            }
        }

        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }
        $scope.addticker = function () {

            var arrays = $scope.investor.add_ticker.split(',');

            angular.forEach(arrays, function (data, key) {
                $scope.investor.tickerssAdded.push(data);
                $scope.investor.tickerssAdded = $scope.investor.tickerssAdded.filter(onlyUnique);
                $scope.investor.add_ticker = '';
            });

            // if($scope.investor.add_ticker[0]){
            //     $scope.investor.tickerssAdded.push($scope.investor.add_ticker[0]);
            //     $scope.investor.tickerssAdded = $scope.investor.tickerssAdded.filter( onlyUnique );
            //     $scope.investor.add_ticker = [];
            // }
        }

        $scope.removeTagging = function (index) {
            $scope.investor.tickerssAdded.splice(index, 1);
        }



        $scope.editInvestornotes = function () {


            var error_flag = 0;
            /*  if(!$scope.investor.firstname || $scope.investor.firstname  == ''){
                 alertService.add("warning", "Please enter first name !",2000);
                 error_flag++;
                 return false;
             }else if(!$scope.investor.lastname || $scope.investor.lastname  == ''){
                 alertService.add("warning", "Please enter last name !",2000);
                 error_flag++;
                 return false;
             }
             else if(!$scope.investor.company || $scope.investor.company  == ''){
                 alertService.add("warning", "Please enter firm name !",2000);
                 error_flag++;
                 return false;
             }
            else if(!$scope.investor.fund_name || $scope.investor.fund_name  == ''){
                 alertService.add("warning", "Please enter fund name !",2000);
                 error_flag++;
                 return false;
             }
             else if(!$scope.investor.title || $scope.investor.title  == ''){
                 alertService.add("warning", "Please select title !",2000);
                 error_flag++;
                 return false;
             }
             /*else if(!$scope.investor.phone || $scope.investor.phone  == ''){
                 alertService.add("warning", "Please select phone !",2000);
                 error_flag++;
                 return false;
             }
             else if(!$scope.investor.cell_phone || $scope.investor.cell_phone  == ''){
                 alertService.add("warning", "Please select cell phone !",2000);
                 error_flag++;
                 return false;
             }
             else if(!$scope.investor.email || $scope.investor.email  == ''){
                 alertService.add("warning", "Please select email !",2000);
                 error_flag++;
                 return false;
             }else if(!$scope.investor.address1 || $scope.investor.address1  == ''){
                 alertService.add("warning", "Please select address 1 !",2000);
                 error_flag++;
                 return false;
             }else if(!$scope.investor.city || $scope.investor.city  == ''){
                 alertService.add("warning", "Please select city !",2000);
                 error_flag++;
                 return false;
             }else if(!$scope.investor.state || $scope.investor.state  == ''){
                 alertService.add("warning", "Please select state !",2000);
                 error_flag++;
                 return false;
             }else if(!$scope.investor.zip || $scope.investor.zip  == ''){
                 alertService.add("warning", "Please select zip !",2000);
                 error_flag++;
                 return false;
             }
             else if(!$scope.investor.region || $scope.investor.region  == ''){
                 alertService.add("warning", "Please select region !",2000);
                 error_flag++;
                 return false;
             }
            if (!$scope.investor.stage_investor || $scope.investor.stage_investor == '') {
                alertService.add("warning", "Please select stage investor !", 2000);
                error_flag++;
                return false;
            } else*/
            /* if($scope.investor.stage_investor!='Deferred'){
                 if (!$scope.investor.method_of_contact || $scope.investor.method_of_contact == '') {
                     alertService.add("warning", "Please select method of contact !", 2000);
                     error_flag++;
                     return false;
                 } else if (!$scope.investor.time_of_contact || $scope.investor.time_of_contact == '') {
                     alertService.add("warning", "Please select time of contact !", 2000);
                     error_flag++;
                     return false;
                 } else if (!$scope.investor.personal_notes || $scope.investor.personal_notes == '') {
                     alertService.add("warning", "Please select personal notes !", 2000);
                     error_flag++;
                     return false;
                 }
             }*/

            var Url = 'apiv4/public/investornotes/check_investornotescontacts';
            var params = { data: $scope.investor, id: $scope.investor.investornoteId };

            RequestDetail.getDetail(Url, params).then(function (result) {
                if(result.data.check){
                    var Url = 'apiv4/public/investornotes/update_investornotescontacts';
                    var params = { data: $scope.investor, tickers: $scope.investor.tickerssAdded, id: $scope.investor.investornoteId };
        
                    RequestDetail.getDetail(Url, params).then(function (result) {
                        if (result) {
                            alertService.add("success", "Updated successfully!", 2000);

                          
        
                            if ($scope.investorslected.stage_investor == '' || !$scope.investorslected.stage_investor || $scope.investorslected.stage_investor == 'prestage' || $scope.investorslected.stage_investor == '0') {
                               
                                var this_index = $scope.investornotesprestep.indexOf($scope.investorslected); 
                                $scope.investornotesprestep.splice(this_index, 1);
                                $scope.investornotesprestepcount = parseInt($scope.investornotesprestepcount) - 1;
                            } else {
                               
                                angular.forEach($scope.userinvestornotes, function (col, index) {
                                    if ($scope.investorslected.stage_investor == col.investor_notes_category_id) {
                                        var this_index = $scope.userinvestornotes[index].contacts.indexOf($scope.investorslected);
                                        $scope.userinvestornotes[index].contacts.splice(this_index, 1);
                                        $scope.userinvestornotes[index].count =  $scope.userinvestornotes[index].count-1;
                                    }
                                });
                            }
        
                            if ($scope.investor.stage_investor == '' || !$scope.investor.stage_investor || $scope.investor.stage_investor == 'prestage') {
                                $scope.investorslected.stage_investor = '';
                                $scope.investor.stage_investor_name = 'Pre Stage';
                                $scope.investornotesprestep.push($scope.investor);
                                $scope.investornotesprestepcount = parseInt($scope.investornotesprestepcount) + 1;
                            } else {
                                angular.forEach($scope.userinvestornotes, function (col, index) {
                                    if ($scope.investor.stage_investor == col.investor_notes_category_id) {
                                        $scope.investor.stage_investor_name = col.name;
                                        $scope.userinvestornotes[index].contacts.push($scope.investor);
                                        $scope.userinvestornotes[index].count =  $scope.userinvestornotes[index].count+1;
                                    }
                                });
                            }
        
        
        
                            $scope.investor = [];
        
                            $scope.investorslected = [];
        
                            $scope.changetab($scope.tabactive);
        
                        }
                    });
                }else{
                    alertService.add("warning", "Email Already Exists !", 2000);
                }
            });



            


        }

        

        $scope.UnsubscribeInvestornote = function (investor) {
            if (confirm("Are you sure? Want to unsubscribe "+investor.email+"?")) {
                var Url = 'apiv4/public/investornotes/Unsubscribe_investornotescontacts';
                var params = { data: investor };
                RequestDetail.getDetail(Url, params).then(function (result) {
                    alertService.add("success", "Unsubscribed successfully!", 2000);
                    if (investor.stage_investor == '' || !investor.stage_investor || investor.stage_investor == 'prestage') {
                        var this_index = $scope.investornotesprestep.indexOf(investor);
                        $scope.investornotesprestep.splice(this_index, 1);
                        $scope.investornotesprestepcount = parseInt($scope.investornotesprestepcount) - 1;
                    } else {
                       
                        angular.forEach($scope.userinvestornotes, function (col, index) {
                            if (investor.stage_investor == col.investor_notes_category_id) {
                               
                                var this_index = $scope.userinvestornotes[index].contacts.indexOf(investor);
                                $scope.userinvestornotes[index].contacts.splice(this_index, 1);
                                $scope.userinvestornotes[index].count = $scope.userinvestornotes[index].count -1;
                            }
                        });
                    }
                });
            }
            
        }


        $scope.freetrialactivate = function (investor) {

            var Url = 'apiv4/public/investornotes/freetrialactivate';
            var params = { data: investor };

            RequestDetail.getDetail(Url, params).then(function (result) {
                if (result) {

                    if (investor.stage_investor == '' || !investor.stage_investor || investor.stage_investor == 'prestage') {
                        var this_index = $scope.investornotesprestep.indexOf(investor);
                        $scope.investornotesprestep.splice(this_index, 1);
                        $scope.investornotesprestepcount = parseInt($scope.investornotesprestepcount) - 1;
                    } else {
                       
                        angular.forEach($scope.userinvestornotes, function (col, index) {
                            if (investor.stage_investor == col.investor_notes_category_id) {
                               
                                var this_index = $scope.userinvestornotes[index].contacts.indexOf(investor);
                                $scope.userinvestornotes[index].contacts.splice(this_index, 1);
                                $scope.userinvestornotes[index].count = $scope.userinvestornotes[index].count -1;
                            }
                        });
                    }

                    angular.forEach($scope.userinvestornotes, function (col, index) {
                        if (col.name == 'Free Trial') {
                            investor.stage_investor = col.investor_notes_category_id;
                            investor.stage_investor_name = col.name;
                            $scope.userinvestornotes[index].contacts.push(investor);
                            $scope.userinvestornotes[index].count = $scope.userinvestornotes[index].count+1;
                        }
                    });

                    alertService.add("success", "Activated successfully!", 2000);

                }
            });
        }

        $scope.removeInvestornotes = function (investor) {

            var Url = 'apiv4/public/investornotes/delete_investornotescontacts';
            var params = { data: investor };

            RequestDetail.getDetail(Url, params).then(function (result) {
                if (result) {

                    if (investor.stage_investor == '' || !investor.stage_investor || investor.stage_investor == 'prestage') {
                        var this_index = $scope.investornotesprestep.indexOf(investor);
                        $scope.investornotesprestep.splice(this_index, 1);
                        $scope.investornotesprestepcount = parseInt($scope.investornotesprestepcount) - 1;
                    } else {
                       
                        angular.forEach($scope.userinvestornotes, function (col, index) {
                            if (investor.stage_investor == col.investor_notes_category_id) {
                               
                                var this_index = $scope.userinvestornotes[index].contacts.indexOf(investor);
                                $scope.userinvestornotes[index].contacts.splice(this_index, 1);
                                $scope.userinvestornotes[index].count = $scope.userinvestornotes[index].count -1;
                            }
                        });
                    }

                    angular.forEach($scope.userinvestornotes, function (col, index) {
                        if (col.name == 'Deferred') {
                            investor.stage_investor = col.investor_notes_category_id;
                            investor.stage_investor_name = col.name;
                            $scope.userinvestornotes[index].contacts.push(investor);
                            $scope.userinvestornotes[index].count = $scope.userinvestornotes[index].count+1;
                        }
                    });
                }
            });
        }

        $scope.deleteInvestornotes = function (investor) {
            if (confirm("Are you sure you want to delete this contact permanently?")) {
            }
            var Url = 'apiv4/public/investornotes/permanentdelete_investornotescontacts';
            var params = { data: investor };

            RequestDetail.getDetail(Url, params).then(function (result) {
                if (result) {

                    if (investor.stage_investor == '' || !investor.stage_investor || investor.stage_investor == 'prestage') {
                        var this_index = $scope.investornotesprestep.indexOf(investor);
                        $scope.investornotesprestep.splice(this_index, 1);
                        $scope.investornotesprestepcount = parseInt($scope.investornotesprestepcount) - 1;
                    } else {
                       
                        angular.forEach($scope.userinvestornotes, function (col, index) {
                            if (investor.stage_investor == col.investor_notes_category_id) {
                               
                                var this_index = $scope.userinvestornotes[index].contacts.indexOf(investor);
                                $scope.userinvestornotes[index].contacts.splice(this_index, 1);
                                $scope.userinvestornotes[index].count = $scope.userinvestornotes[index].count -1;
                            }
                        });
                    }
                }
            });
        }

        $scope.openinvestorlist = function () {
            $scope.investor.investor_contacts_id = '';
            $scope.showreadershiptable = 0;
        }

        $scope.touch_editstatus = 0;

        $scope.savetouch = function () {
            var error_flag = 0;




            if (!$scope.newinvestor.person_that_made_touch || $scope.newinvestor.person_that_made_touch == '') {
                alertService.add("warning", "Please enter person !", 2000);
                error_flag++;
                return false;
            }
            else if (!$scope.newinvestor.type_touch || $scope.newinvestor.type_touch == '') {
                alertService.add("warning", "Please select type !", 2000);
                error_flag++;
                return false;
            }
            else if (!$scope.newinvestor.action || $scope.newinvestor.action == '') {
                alertService.add("warning", "Please select action !", 2000);
                error_flag++;
                return false;
            }
            /*else if (!$scope.newinvestor.interest || $scope.newinvestor.interest == '') {
                alertService.add("warning", "Please select interest !", 2000);
                error_flag++;
                return false;
            }*/
            else if (!$scope.newinvestor.personal_notes || $scope.newinvestor.personal_notes == '') {
                alertService.add("warning", "Please enter personal notes !", 2000);
                error_flag++;
                return false;
            } else {
                if (error_flag == 0) {
                    var Url = 'apiv4/public/investornotes/add_investornotescontactstouch';
                    var params = { data: $scope.investor, tickers: $scope.investor.tickerssAdded, newinvestor: $scope.newinvestor };

                    RequestDetail.getDetail(Url, params).then(function (result) {
                        if (result) {
                            $scope.newinvestor = [];
                            $scope.get_investornote();
                            $scope.showModalnewtouch = false;
                            alertService.add("success", "Added successfully!", 2000);
                            // $location.path('investornotes');
                            if ($scope.investorslected.stage_investor == '' || !$scope.investorslected.stage_investor) {
                                var this_index = $scope.investornotesprestep.indexOf($scope.investorslected);
                                $scope.investornotesprestep[this_index].touch_date_added = result.data.date;
                                $scope.investornotesprestep[this_index].stage_investor = $scope.newinvestor.interest;

                            } else {
                                angular.forEach($scope.userinvestornotes, function (col, index) {
                                    if ($scope.investor.stage_investor == col.investor_notes_category_id) {
                                        var this_index = $scope.userinvestornotes[index].contacts.indexOf($scope.investorslected);
                                        $scope.userinvestornotes[index].contacts[this_index].touch_date_added = result.data.date;
                                        $scope.userinvestornotes[index].contacts[this_index].stage_investor = $scope.newinvestor.interest;
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }


        $scope.edittouch = function (index) {
            $scope.touch_editstatus = 1;
            $scope.newinvestor = $scope.investor.investor_notes_touch[index];
            $scope.showModalnewtouch = true;
        }

        $scope.updatetouch = function () {
            var error_flag = 0;

            if (!$scope.newinvestor.person_that_made_touch || $scope.newinvestor.person_that_made_touch == '') {
                alertService.add("warning", "Please enter person !", 2000);
                error_flag++;
                return false;
            }
            else if (!$scope.newinvestor.type_touch || $scope.newinvestor.type_touch == '') {
                alertService.add("warning", "Please select type !", 2000);
                error_flag++;
                return false;
            }
            else if (!$scope.newinvestor.action || $scope.newinvestor.action == '') {
                alertService.add("warning", "Please select action !", 2000);
                error_flag++;
                return false;
            }
            else if (!$scope.newinvestor.interest || $scope.newinvestor.interest == '') {
                alertService.add("warning", "Please select interest !", 2000);
                error_flag++;
                return false;
            }
            else if (!$scope.newinvestor.personal_notes || $scope.newinvestor.personal_notes == '') {
                alertService.add("warning", "Please enter personal notes !", 2000);
                error_flag++;
                return false;
            } else {
                if (error_flag == 0) {
                    var Url = 'apiv4/public/investornotes/update_investornotestouch';
                    var params = { data: $scope.investor, tickers: $scope.investor.tickerssAdded, newinvestor: $scope.newinvestor };

                    RequestDetail.getDetail(Url, params).then(function (result) {
                        if (result) {
                            $scope.touch_editstatus = 0;
                            $scope.newinvestor = [];
                            $scope.get_investornote();
                            $scope.showModalnewtouch = false;
                            alertService.add("success", "Updated successfully!", 2000);
                            // $location.path('investornotes');
                        }
                    });
                }
            }
        }


        $scope.editpage = function (investor) {
            $scope.spinnerActive = true;
            $scope.investorslected = investor;
            $scope.investor_contacts_id = investor.investor_contacts_id;
            // $scope.investornewcontacts = investor.investornewcontacts;
            $scope.get_investornote();
        }
		$scope.readershipdata = [];
        $scope.showreadershiptable = 0;

        $scope.showreadershiptab = function () {
            $scope.showreadershiptable = 1;
        }

        $scope.showreadershiptab_irp = function (investor) {
            $scope.spinnerActive = true;
            var url = 'apiv4/public/investornotes/getreadershipdata';
            var params = { email: investor.email};
            RequestDetail.getDetail(url, params).then(function (result) {

                $scope.readershipdata = result.data.readerships;
                //console.log(result.data.readerships);

                $scope.spinnerActive = false;
                $scope.showreadershiptable = 1;
            });
           
        }

        $scope.openinvestorlist = function () {
            $scope.investor.investor_contacts_id = '';
            $scope.showreadershiptable = 0;
        }					   
    })
    .controller('editinvestornotepage', function ($scope, $http, $location, $routeParams, localStorageService, RequestDetail, configdetails, $sce, usertype, alertService) {
        $scope.configdetails = configdetails;
        $scope.pageHeading = 'Corporate Profile';
        $scope.investor = {};

        $scope.searchtext = "";
        $scope.report = {};

        $scope.investor.investor_contacts_id = $routeParams.investor_contacts_id;

        $scope.tabactive = '0';
        $scope.listitems = [];
        $scope.investorslected = [];

        // COLUMN TO SORT
        $scope.column = 'sno';

        // SORT ORDERING (ASCENDING OR DESCENDING). SET TRUE FOR DESENDING
        $scope.reverse = false;

        // CALLED ON HEADER CLICK
        $scope.sortColumn = function (col) {
            $scope.column = col;
            if ($scope.reverse) {
                $scope.reverse = false;
                $scope.reverseclass = 'arrow-up';
            } else {
                $scope.reverse = true;
                $scope.reverseclass = 'arrow-down';
            }
        };


        $scope.editinvestornotesid = 'sno';


        $scope.sortClass = function (col) {
            if ($scope.column == col) {
                if ($scope.reverse) {
                    return 'arrow-down';
                } else {
                    return 'arrow-up';
                }
            } else {
                return '';
            }
        };

        $scope.user_data = localStorageService.get('userdata');

        $scope.user_type = $scope.user_data.user_type;



        $scope.total_count = 1;




        $scope.Promotecontacts = function () {
            var url = 'apiv4/public/investornotes/getPromotecontacts';
            var params = {};
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.selectinvestor_notescompanies_id(1);
            });
        }

        $scope.admin_status = 0;
        $scope.users = [];

        var url = 'apiv4/public/investornotes/getinvestornotesusers';
        var params = {};
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.admin_status = result.data.admin_status;
            $scope.users = result.data.users;
            $scope.user_id = result.data.user_id;
        });


        $scope.listitems = $scope.investornotesprestep;


        $scope.filter_user = function () {
            $scope.selectinvestor_notescompanies_id(1);
        }

        $scope.showModalnewtouch = false;

        $scope.openmodelnewtouch = function () {
            $scope.showModalnewtouch = true;
        }

        $scope.closeModalnewtouch = function () {
            $scope.showModalnewtouch = false;
        }


        $scope.newinvestor = {};


        $scope.investor.tickerssAdded = [];

        $scope.get_investornote = function () {
            $scope.spinnerActive = true;
            var url = 'apiv4/public/investornotes/getinvestornoteedit';
            var params = { investor_contacts_id: $scope.investor.investor_contacts_id };
            RequestDetail.getDetail(url, params).then(function (result) {

                $scope.investor = result.data;

                $scope.investor.cell_phone = result.data.phone;
                $scope.investor.stage_investment_firm = result.data.stage_investment_firm;

                if (!$scope.investor.stage_investor) {
                    $scope.investor.stage_investor = "";
                }
                if (!$scope.investor.stage_investment_firm) {
                    $scope.investor.stage_investment_firm = "Stage 1";
                }
                if ($scope.investor.tickerssAdded) {
                    if ($scope.investor.tickerssAdded.length > 0) {
                        $scope.investor.tickerssAdded = $scope.investor.tickerssAdded.split(',');
                    }
                } else {
                    $scope.investor.tickerssAdded = [];
                }

                $scope.spinnerActive = false;

            });
        }

        $scope.get_investornote();

        $scope.requestreport = function () {
            $scope.showModalreport = true;
        }

        $scope.saverequest = function () {
            if (!$scope.report.email || $scope.report.email == '') {
                alertService.add("warning", "Please enter email !", 2000);
                return false;
            } else if (!$scope.checkemailval($scope.report.email)) {
                alertService.add("warning", "Please enter valid email !", 2000);
                return false;
            }
            else if (!$scope.report.institution1 || $scope.report.institution1 == '') {
                alertService.add("warning", "Please enter institution 1 !", 2000);
                return false;
            }
            else if (!$scope.report.personname1 || $scope.report.personname1 == '') {
                alertService.add("warning", "Please enter person name 1 !", 2000);
                return false;
            }
            else if (!$scope.report.institution2 || $scope.report.institution2 == '') {
                alertService.add("warning", "Please enter institution 2 !", 2000);
                return false;
            }
            else if (!$scope.report.personname2 || $scope.report.personname2 == '') {
                alertService.add("warning", "Please enter person name 2 !", 2000);
                return false;
            }
            else if (!$scope.report.institution3 || $scope.report.institution3 == '') {
                alertService.add("warning", "Please enter institution 3 !", 2000);
                return false;
            }
            else if (!$scope.report.personname3 || $scope.report.personname3 == '') {
                alertService.add("warning", "Please enter person name 3 !", 2000);
                return false;
            }
            else if (!$scope.report.objections1 || $scope.report.objections1 == '') {
                alertService.add("warning", "Please enter objections 1 !", 2000);
                return false;
            }
            else if (!$scope.report.objections2 || $scope.report.objections2 == '') {
                alertService.add("warning", "Please enter objections 2 !", 2000);
                return false;
            }
            else if (!$scope.report.objections3 || $scope.report.objections3 == '') {
                alertService.add("warning", "Please enter objections 3 !", 2000);
                return false;
            } else {
                var params = $scope.report;
                var tagUrl = 'apiv4/public/investornotes/addrequestreport';
                RequestDetail.getDetail(tagUrl, params).then(function (result) {
                    $scope.report = {};
                    alertService.add("success", "Requested successfully!", 2000);
                    $scope.showModalreport = false;
                });
            }
        }

        $scope.closeModalreport = function () {
            $scope.showModalreport = false;
        }

        $scope.checkemailval = function (email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }


        $scope.triggerview = function (index) {
            $scope.poptimes = $scope.investor.triggers[index].mailviewes_status.mailviewed;
            $scope.titletimes = 'Open Detail';
            $scope.showModalpagetimes = true;
        }
        $scope.triggerclick = function (index) {
            $scope.poptimes = $scope.investor.triggers[index].mailviewes_status.mailclicked;
            $scope.titletimes = 'Click Detail';
            $scope.showModalpagetimes = true;
        }
        $scope.closetimes = function () {
            $scope.showModalpagetimes = false;
        }

        $scope.researchsview = function (index) {
            $scope.poptimes = $scope.investor.researchs[index].mailviewes_status.mailviewed;
            $scope.titletimes = 'Open Detail';
            $scope.showModalpagetimes = true;
        }
        $scope.researchsclick = function (index) {
            $scope.poptimes = $scope.investor.researchs[index].mailviewes_status.mailclicked;
            $scope.titletimes = 'Click Detail';
            $scope.showModalpagetimes = true;
        }


        $scope.get_investornote();


        $scope.get_search_details = function (type, searchkey, industype) {
            if (angular.isDefined(searchkey) && searchkey != '') {
                if (type != '') {
                    var tagUrl = 'apiv4/public/user/get_search_details1';
                    var searchterm = searchkey;

                    if (type == 'industry') {
                        var params = { term: searchterm, key: type, industype: industype };
                        RequestDetail.getDetail(tagUrl, params).then(function (result) {
                            if (angular.isDefined(result.data) && result.data.length > 0) {
                                $scope.availableIndustry = result.data;
                                if (industype == 'sectors') {
                                    $scope.availableIndustry_sector = result.data;
                                }
                            } else {
                                $scope.availableIndustry = [];
                                if (industype == 'sectors') {
                                    $scope.availableIndustry_sector = [];
                                }
                            }
                        });
                    }

                    if (type == 'ticker') {
                        var params = searchterm;
                        var tagUrl = 'apiv4/public/dashboard/get_auto_ticker_stock';
                        RequestDetail.getDetail(tagUrl, params).then(function (result) {
                            if (angular.isDefined(result.data) && result.data.length > 0) {
                                $scope.availableTickers = result.data;
                            } else {
                                $scope.availableTickers = [];
                            }
                        });
                    }

                }
            }
        }

        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }
        $scope.addticker = function () {

            var arrays = $scope.investor.add_ticker.split(',');

            angular.forEach(arrays, function (data, key) {
                $scope.investor.tickerssAdded.push(data);
                $scope.investor.tickerssAdded = $scope.investor.tickerssAdded.filter(onlyUnique);
                $scope.investor.add_ticker = '';
            });

            // if($scope.investor.add_ticker[0]){
            //     $scope.investor.tickerssAdded.push($scope.investor.add_ticker[0]);
            //     $scope.investor.tickerssAdded = $scope.investor.tickerssAdded.filter( onlyUnique );
            //     $scope.investor.add_ticker = [];
            // }
        }

        $scope.removeTagging = function (index) {
            $scope.investor.tickerssAdded.splice(index, 1);
        }



        $scope.editInvestornotes = function () {


            var error_flag = 0;
            /*  if(!$scope.investor.firstname || $scope.investor.firstname  == ''){
                 alertService.add("warning", "Please enter first name !",2000);
                 error_flag++;
                 return false;
             }else if(!$scope.investor.lastname || $scope.investor.lastname  == ''){
                 alertService.add("warning", "Please enter last name !",2000);
                 error_flag++;
                 return false;
             }
             else if(!$scope.investor.company || $scope.investor.company  == ''){
                 alertService.add("warning", "Please enter firm name !",2000);
                 error_flag++;
                 return false;
             }
            else if(!$scope.investor.fund_name || $scope.investor.fund_name  == ''){
                 alertService.add("warning", "Please enter fund name !",2000);
                 error_flag++;
                 return false;
             }
             else if(!$scope.investor.title || $scope.investor.title  == ''){
                 alertService.add("warning", "Please select title !",2000);
                 error_flag++;
                 return false;
             }
             /*else if(!$scope.investor.phone || $scope.investor.phone  == ''){
                 alertService.add("warning", "Please select phone !",2000);
                 error_flag++;
                 return false;
             }
             else if(!$scope.investor.cell_phone || $scope.investor.cell_phone  == ''){
                 alertService.add("warning", "Please select cell phone !",2000);
                 error_flag++;
                 return false;
             }
             else if(!$scope.investor.email || $scope.investor.email  == ''){
                 alertService.add("warning", "Please select email !",2000);
                 error_flag++;
                 return false;
             }else if(!$scope.investor.address1 || $scope.investor.address1  == ''){
                 alertService.add("warning", "Please select address 1 !",2000);
                 error_flag++;
                 return false;
             }else if(!$scope.investor.city || $scope.investor.city  == ''){
                 alertService.add("warning", "Please select city !",2000);
                 error_flag++;
                 return false;
             }else if(!$scope.investor.state || $scope.investor.state  == ''){
                 alertService.add("warning", "Please select state !",2000);
                 error_flag++;
                 return false;
             }else if(!$scope.investor.zip || $scope.investor.zip  == ''){
                 alertService.add("warning", "Please select zip !",2000);
                 error_flag++;
                 return false;
             }
             else if(!$scope.investor.region || $scope.investor.region  == ''){
                 alertService.add("warning", "Please select region !",2000);
                 error_flag++;
                 return false;
             }
            if (!$scope.investor.stage_investor || $scope.investor.stage_investor == '') {
                alertService.add("warning", "Please select stage investor !", 2000);
                error_flag++;
                return false;
            } else*/
            /* if($scope.investor.stage_investor!='Deferred'){
                 if (!$scope.investor.method_of_contact || $scope.investor.method_of_contact == '') {
                     alertService.add("warning", "Please select method of contact !", 2000);
                     error_flag++;
                     return false;
                 } else if (!$scope.investor.time_of_contact || $scope.investor.time_of_contact == '') {
                     alertService.add("warning", "Please select time of contact !", 2000);
                     error_flag++;
                     return false;
                 } else if (!$scope.investor.personal_notes || $scope.investor.personal_notes == '') {
                     alertService.add("warning", "Please select personal notes !", 2000);
                     error_flag++;
                     return false;
                 }
             }*/



            var Url = 'apiv4/public/investornotes/update_investornotes';
            var params = { data: $scope.investor, tickers: $scope.investor.tickerssAdded, id: $scope.investor.investornoteId };

            RequestDetail.getDetail(Url, params).then(function (result) {
                if (result) {
                    alertService.add("success", "Updated successfully!", 2000);

                    $scope.investor = [];

                    $scope.investorslected = [];

                    $scope.changetab($scope.tabactive);

                }
            });


        }


        $scope.removeInvestornotes = function (investor) {

            var Url = 'apiv4/public/investornotes/delete_investornotes';
            var params = { data: investor };

            RequestDetail.getDetail(Url, params).then(function (result) {
                if (result) {
                    if (investor.stage_investor == '' || !investor.stage_investor) {
                        var this_index = $scope.investornotesprestep.indexOf(investor);
                        $scope.investornotesprestep.splice(this_index, 1);

                    } else if (investor.stage_investor == 'Stage 1') {
                        var this_index = $scope.investornotesstep1.indexOf(investor);
                        $scope.investornotesstep1.splice(this_index, 1);

                    } else if (investor.stage_investor == 'Stage 2') {
                        var this_index = $scope.investornotesstep2.indexOf(investor);
                        $scope.investornotesstep2.splice(this_index, 1);

                    } else if (investor.stage_investor == 'Stage 3') {
                        var this_index = $scope.investornotesstep3.indexOf(investor);
                        $scope.investornotesstep3.splice(this_index, 1);

                    } else if (investor.stage_investor == 'Stage 4') {
                        var this_index = $scope.investornotesstep4.indexOf(investor);
                        $scope.investornotesstep4.splice(this_index, 1);

                    } else if (investor.stage_investor == 'NDRs') {
                        var this_index = $scope.investornotesndrs.indexOf(investor);
                        $scope.investornotesndrs.splice(this_index, 1);

                    } else if (investor.stage_investor == 'Owners') {
                        var this_index = $scope.investornotesowners.indexOf(investor);
                        $scope.investornotesowners.splice(this_index, 1);

                    } else if (investor.stage_investor == 'NonInvestors') {
                        var this_index = $scope.investornotesnoninvestors.indexOf(investor);
                        $scope.investornotesnoninvestors.splice(this_index, 1);

                    } else if (investor.stage_investor == 'Deferred') {
                        var this_index = $scope.investornotesremoved.indexOf(investor);
                        $scope.investornotesremoved.splice(this_index, 1);

                    }


                    investor.stage_investor = 'Deferred';
                    $scope.investornotesremoved.push(investor);


                }
            });
        }


        $scope.openinvestorlist = function () {
            $scope.investor.investor_contacts_id = '';
        }

        $scope.touch_editstatus = 0;

        $scope.savetouch = function () {
            var error_flag = 0;




            if (!$scope.newinvestor.person_that_made_touch || $scope.newinvestor.person_that_made_touch == '') {
                alertService.add("warning", "Please enter person !", 2000);
                error_flag++;
                return false;
            }
            else if (!$scope.newinvestor.type_touch || $scope.newinvestor.type_touch == '') {
                alertService.add("warning", "Please select type !", 2000);
                error_flag++;
                return false;
            }
            else if (!$scope.newinvestor.action || $scope.newinvestor.action == '') {
                alertService.add("warning", "Please select action !", 2000);
                error_flag++;
                return false;
            }
            /* else if (!$scope.newinvestor.interest || $scope.newinvestor.interest == '') {
                 alertService.add("warning", "Please select interest !", 2000);
                 error_flag++;
                 return false;
             }*/
            else if (!$scope.newinvestor.personal_notes || $scope.newinvestor.personal_notes == '') {
                alertService.add("warning", "Please enter personal notes !", 2000);
                error_flag++;
                return false;
            } else {
                if (error_flag == 0) {
                    var Url = 'apiv4/public/investornotes/add_investornotestouch';
                    var params = { data: $scope.investor, tickers: $scope.investor.tickerssAdded, newinvestor: $scope.newinvestor };

                    RequestDetail.getDetail(Url, params).then(function (result) {
                        if (result) {
                            $scope.newinvestor = [];
                            $scope.get_investornote();
                            $scope.showModalnewtouch = false;
                            alertService.add("success", "Added successfully!", 2000);
                            // $location.path('investornotes');
                            if ($scope.investorslected.stage_investor == '' || !$scope.investorslected.stage_investor) {
                                var this_index = $scope.investornotesprestep.indexOf($scope.investorslected);
                                $scope.investornotesprestep[this_index].touch_date_added = result.data.date;
                                $scope.investornotesprestep[this_index].stage_investor = $scope.newinvestor.interest;

                            } else if ($scope.investorslected.stage_investor == 'Stage 1') {
                                var this_index = $scope.investornotesstep1.indexOf($scope.investorslected);
                                $scope.investornotesstep1[this_index].touch_date_added = result.data.date;
                                $scope.investornotesstep1[this_index].stage_investor = $scope.newinvestor.interest;

                            } else if ($scope.investorslected.stage_investor == 'Stage 2') {
                                var this_index = $scope.investornotesstep2.indexOf($scope.investorslected);
                                $scope.investornotesstep2[this_index].touch_date_added = result.data.date;
                                $scope.investornotesstep2[this_index].stage_investor = $scope.newinvestor.interest;

                            } else if ($scope.investorslected.stage_investor == 'Stage 3') {
                                var this_index = $scope.investornotesstep3.indexOf($scope.investorslected);
                                $scope.investornotesstep3[this_index].touch_date_added = result.data.date;
                                $scope.investornotesstep3[this_index].stage_investor = $scope.newinvestor.interest;

                            } else if ($scope.investorslected.stage_investor == 'Stage 4') {
                                var this_index = $scope.investornotesstep4.indexOf($scope.investorslected);
                                $scope.investornotesstep4[this_index].touch_date_added = result.data.date;
                                $scope.investornotesstep4[this_index].stage_investor = $scope.newinvestor.interest;

                            } else if ($scope.investorslected.stage_investor == 'NDRs') {
                                var this_index = $scope.investornotesndrs.indexOf($scope.investorslected);
                                $scope.investornotesndrs[this_index].touch_date_added = result.data.date;
                                $scope.investornotesndrs[this_index].stage_investor = $scope.newinvestor.interest;

                            } else if ($scope.investorslected.stage_investor == 'Owners') {
                                var this_index = $scope.investornotesowners.indexOf($scope.investorslected);
                                $scope.investornotesowners[this_index].touch_date_added = result.data.date;
                                $scope.investornotesowners[this_index].stage_investor = $scope.newinvestor.interest;


                            } else if ($scope.investorslected.stage_investor == 'NonInvestors') {
                                var this_index = $scope.investornotesnoninvestors.indexOf($scope.investorslected);
                                $scope.investornotesnoninvestors[this_index].touch_date_added = result.data.date;
                                $scope.investornotesnoninvestors[this_index].stage_investor = $scope.newinvestor.interest;

                            } else if ($scope.investorslected.stage_investor == 'Deferred') {
                                var this_index = $scope.investornotesremoved.indexOf($scope.investorslected);
                                $scope.investornotesremoved[this_index].touch_date_added = result.data.date;
                                $scope.investornotesremoved[this_index].stage_investor = $scope.newinvestor.interest;

                            }
                        }
                    });
                }
            }
        }


        $scope.edittouch = function (index) {
            $scope.touch_editstatus = 1;
            $scope.newinvestor = $scope.investor.investor_notes_touch[index];
            $scope.showModalnewtouch = true;
        }

        $scope.updatetouch = function () {
            var error_flag = 0;

            if (!$scope.newinvestor.person_that_made_touch || $scope.newinvestor.person_that_made_touch == '') {
                alertService.add("warning", "Please enter person !", 2000);
                error_flag++;
                return false;
            }
            else if (!$scope.newinvestor.type_touch || $scope.newinvestor.type_touch == '') {
                alertService.add("warning", "Please select type !", 2000);
                error_flag++;
                return false;
            }
            else if (!$scope.newinvestor.action || $scope.newinvestor.action == '') {
                alertService.add("warning", "Please select action !", 2000);
                error_flag++;
                return false;
            }
            else if (!$scope.newinvestor.interest || $scope.newinvestor.interest == '') {
                alertService.add("warning", "Please select interest !", 2000);
                error_flag++;
                return false;
            }
            else if (!$scope.newinvestor.personal_notes || $scope.newinvestor.personal_notes == '') {
                alertService.add("warning", "Please enter personal notes !", 2000);
                error_flag++;
                return false;
            } else {
                if (error_flag == 0) {
                    var Url = 'apiv4/public/investornotes/update_investornotestouch';
                    var params = { data: $scope.investor, tickers: $scope.investor.tickerssAdded, newinvestor: $scope.newinvestor };

                    RequestDetail.getDetail(Url, params).then(function (result) {
                        if (result) {
                            $scope.touch_editstatus = 0;
                            $scope.newinvestor = [];
                            $scope.get_investornote();
                            $scope.showModalnewtouch = false;
                            alertService.add("success", "Updated successfully!", 2000);
                            // $location.path('investornotes');
                        }
                    });
                }
            }
        }


        $scope.editpage = function (investor) {
            $scope.investorslected = investor;
            $scope.investor_contacts_id = investor.investor_contacts_id;
            $scope.investornewcontacts = investor.investornewcontacts;
            $scope.get_investornote();
        }


    })
    .controller('newinvestornote', function ($scope, $http, $location, $routeParams, localStorageService, RequestDetail, configdetails, $sce, usertype, alertService) {
        $scope.configdetails = configdetails;
        $scope.pageHeading = 'Corporate Profile';
        $scope.investor = {};

        $scope.searchtext = "";


        $scope.showModalnewtouch = false;

        $scope.openmodelnewtouch = function () {
            $scope.showModalnewtouch = true;
        }

        $scope.closeModalnewtouch = function () {
            $scope.showModalnewtouch = false;
        }


        $scope.video_status_class = '';
        $scope.initiation_status_class = '';
        $scope.quickfacts_status_class = '';
        $scope.flash_status_class = '';
        $scope.EPSflash_status_class = '';
        $scope.NDR_status_class = '';
        $scope.Conference_status_class = '';
        $scope.AnalystDay_status_class = '';
        $scope.EPSFollowup_status_class = '';



        $scope.newinvestor = {};


        $scope.investor.tickerssAdded = [];
        $scope.investor.other_contacts = [];

        $scope.get_investornotecontacts = function () {
            var url = 'apiv4/public/investornotes/getinvestornoteothercontacts';
            var params = { company: $scope.investor.company };
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.investor.other_contacts = result.data;
            });
        }


        $scope.investorsList = [];
        $scope.getList = function () {
            var GetInvestorsListUrl = 'apiv4/public/dashboard/getInvestorsList';
            var params = {
                type: 'get'
            };

            RequestDetail.getDetail(GetInvestorsListUrl, params).then(function (result) {
                $scope.investorsList = result.data;
            });
        }

        $scope.getList();


        var GetInvestorsNotesUrl = 'apiv4/public/dashboard/getInvestorsNotesCategory';
        var params = {
            type: 'get'
        };

        RequestDetail.getDetail(GetInvestorsNotesUrl, params).then(function (result) {
            $scope.investorsnotescategories = result.data;
        });



        $scope.get_search_details = function (type, searchkey, industype) {
            if (angular.isDefined(searchkey) && searchkey != '') {
                if (type != '') {
                    var tagUrl = 'apiv4/public/user/get_search_details1';
                    var searchterm = searchkey;

                    if (type == 'industry') {
                        var params = { term: searchterm, key: type, industype: industype };
                        RequestDetail.getDetail(tagUrl, params).then(function (result) {
                            if (angular.isDefined(result.data) && result.data.length > 0) {
                                $scope.availableIndustry = result.data;
                                if (industype == 'sectors') {
                                    $scope.availableIndustry_sector = result.data;
                                }
                            } else {
                                $scope.availableIndustry = [];
                                if (industype == 'sectors') {
                                    $scope.availableIndustry_sector = [];
                                }
                            }
                        });
                    }

                    if (type == 'ticker') {
                        var params = searchterm;
                        var tagUrl = 'apiv4/public/dashboard/get_auto_ticker_stock';
                        RequestDetail.getDetail(tagUrl, params).then(function (result) {
                            if (angular.isDefined(result.data) && result.data.length > 0) {
                                $scope.availableTickers = result.data;
                            } else {
                                $scope.availableTickers = [];
                            }
                        });
                    }

                }
            }
        }

        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }
        $scope.addticker = function () {

            var arrays = $scope.investor.add_ticker.split(',');

            angular.forEach(arrays, function (data, key) {
                $scope.investor.tickerssAdded.push(data);
                $scope.investor.tickerssAdded = $scope.investor.tickerssAdded.filter(onlyUnique);
                $scope.investor.add_ticker = '';
            });

            // if($scope.investor.add_ticker[0]){
            //     $scope.investor.tickerssAdded.push($scope.investor.add_ticker[0]);
            //     $scope.investor.tickerssAdded = $scope.investor.tickerssAdded.filter( onlyUnique );
            //     $scope.investor.add_ticker = [];
            // }
        }

        $scope.removeTagging = function (index) {
            $scope.investor.tickerssAdded.splice(index, 1);
        }




        $scope.investor.stage_investor = "";

        $scope.addInvestornotes = function () {


            var error_flag = 0;
            if (!$scope.investor.firstname || $scope.investor.firstname == '') {
                alertService.add("warning", "Please enter first name !", 2000);
                error_flag++;
                return false;
            } else if (!$scope.investor.lastname || $scope.investor.lastname == '') {
                alertService.add("warning", "Please enter last name !", 2000);
                error_flag++;
                return false;
            }
            else if (!$scope.investor.company || $scope.investor.company == '') {
                alertService.add("warning", "Please enter firm name !", 2000);
                error_flag++;
                return false;
            }
            /*  else if(!$scope.investor.fundname || $scope.investor.fundname  == ''){
                   alertService.add("warning", "Please enter fund name !",2000);
                   error_flag++;
                   return false;
               }
               else if(!$scope.investor.title || $scope.investor.title  == ''){
                   alertService.add("warning", "Please select title !",2000);
                   error_flag++;
                   return false;
               }
               else if(!$scope.investor.phone || $scope.investor.phone  == ''){
                   alertService.add("warning", "Please select phone !",2000);
                   error_flag++;
                   return false;
               }
               else if(!$scope.investor.cell_phone || $scope.investor.cell_phone  == ''){
                   alertService.add("warning", "Please select cell phone !",2000);
                   error_flag++;
                   return false;
               }*/
            else if (!$scope.investor.email || $scope.investor.email == '') {
                alertService.add("warning", "Please select email !", 2000);
                error_flag++;
                return false;
            }
            else if ($scope.investor.distributesAdded.length == 0 && $scope.investor.newdistributelists.length == 0) {
                alertService.add("warning", "Please add or select distribute list !", 2000);
                error_flag++;
                return false;
            }
            /*else if(!$scope.investor.address1 || $scope.investor.address1  == ''){
                alertService.add("warning", "Please select address 1 !",2000);
                error_flag++;
                return false;
            }else if(!$scope.investor.city || $scope.investor.city  == ''){
                alertService.add("warning", "Please select city !",2000);
                error_flag++;
                return false;
            }else if(!$scope.investor.state || $scope.investor.state  == ''){
                alertService.add("warning", "Please select state !",2000);
                error_flag++;
                return false;
            }else if(!$scope.investor.zip || $scope.investor.zip  == ''){
                alertService.add("warning", "Please select zip !",2000);
                error_flag++;
                return false;
            }
            else if(!$scope.investor.country || $scope.investor.country  == ''){
                alertService.add("warning", "Please select region !",2000);
                error_flag++;
                return false;
            }*/
            /*  else if (!$scope.investor.stage_investor || $scope.investor.stage_investor == '') {
                 alertService.add("warning", "Please select stage investor !", 2000);
                 error_flag++;
                 return false;
             } 
             else if (!$scope.investor.method_of_contact || $scope.investor.method_of_contact == '') {
                 alertService.add("warning", "Please select method of contact !", 2000);
                 error_flag++;
                 return false;
             } else if (!$scope.investor.time_of_contact || $scope.investor.time_of_contact == '') {
                 alertService.add("warning", "Please select time of contact !", 2000);
                 error_flag++;
                 return false;
             }
             else if (!$scope.investor.personal_notes || $scope.investor.personal_notes == '') {
                 alertService.add("warning", "Please select personal notes !", 2000);
                 error_flag++;
                 return false;
             }*/
            else {
                if (error_flag == 0) {
                    var Url = 'apiv4/public/investornotes/add_investornotes';
                    var params = { data: $scope.investor, tickers: $scope.investor.tickerssAdded, id: $scope.investor.investornoteId };

                    RequestDetail.getDetail(Url, params).then(function (result) {
                        if (result) {
                            alertService.add("success", "Updated successfully!", 2000);
                            $location.path('investornotes');
                        }
                    });
                }
            }
        }



        $scope.investor.distributesAdded = [];
        $scope.investor.newdistributelists = [];

        $scope.adddistributelist = function () {
            if ($scope.investor.distributelist && $scope.investor.distributelist != '0') {
                var selecteddistribute = $scope.investor.distributelist.split('|@|');

                var distribute = {
                    list_name: selecteddistribute[0],
                    list_id: selecteddistribute[1]
                };

                $scope.addstatus = 1;
                angular.forEach($scope.investor.distributesAdded, function (data, key) {
                    if (data.list_id == selecteddistribute[1]) {
                        $scope.addstatus = 0;
                    }
                });

                if ($scope.addstatus) {
                    $scope.investor.distributesAdded.push(distribute);
                    ////console.log($scope.investor.distributesAdded);
                }

            }
            if ($scope.investor.distributelist == '0') {
                var distribute = {
                    list_name: '',
                    list_id: 0
                };
                $scope.investor.newdistributelists.push(distribute);
            }
        }

        $scope.removedistributeTagging = function (index) {
            $scope.investor.distributesAdded.splice(index, 1);
        }

        $scope.touch_editstatus = 0;



        $scope.removenewdistributeTagging = function (index) {
            $scope.investor.newdistributelists.splice(index, 1);
        }

        $scope.savetouch = function () {
            var error_flag = 0;

            if (!$scope.newinvestor.person_that_made_touch || $scope.newinvestor.person_that_made_touch == '') {
                alertService.add("warning", "Please enter person !", 2000);
                error_flag++;
                return false;
            }
            else if (!$scope.newinvestor.type_touch || $scope.newinvestor.type_touch == '') {
                alertService.add("warning", "Please select type !", 2000);
                error_flag++;
                return false;
            }
            else if (!$scope.newinvestor.action || $scope.newinvestor.action == '') {
                alertService.add("warning", "Please select action !", 2000);
                error_flag++;
                return false;
            }
            /*else if (!$scope.newinvestor.interest || $scope.newinvestor.interest == '') {
                alertService.add("warning", "Please select interest !", 2000);
                error_flag++;
                return false;
            }*/
            else if (!$scope.newinvestor.personal_notes || $scope.newinvestor.personal_notes == '') {
                alertService.add("warning", "Please enter personal notes !", 2000);
                error_flag++;
                return false;
            } else {
                if (error_flag == 0) {
                    var Url = 'apiv4/public/investornotes/add_investornotestouch';
                    var params = { data: $scope.investor, tickers: $scope.investor.tickerssAdded, newinvestor: $scope.newinvestor };

                    RequestDetail.getDetail(Url, params).then(function (result) {
                        if (result) {
                            $scope.newinvestor = [];
                            $scope.get_investornote();
                            $scope.showModalnewtouch = false;
                            alertService.add("success", "Added successfully!", 2000);
                            // $location.path('investornotes');
                        }
                    });
                }
            }
        }


        $scope.edittouch = function (index) {
            $scope.touch_editstatus = 1;
            $scope.newinvestor = $scope.investor.investor_notes_touch[index];
            $scope.showModalnewtouch = true;
        }

        $scope.updatetouch = function () {
            var error_flag = 0;

            if (!$scope.newinvestor.person_that_made_touch || $scope.newinvestor.person_that_made_touch == '') {
                alertService.add("warning", "Please enter person !", 2000);
                error_flag++;
                return false;
            }
            else if (!$scope.newinvestor.type_touch || $scope.newinvestor.type_touch == '') {
                alertService.add("warning", "Please select type !", 2000);
                error_flag++;
                return false;
            }
            else if (!$scope.newinvestor.action || $scope.newinvestor.action == '') {
                alertService.add("warning", "Please select action !", 2000);
                error_flag++;
                return false;
            }
            else if (!$scope.newinvestor.interest || $scope.newinvestor.interest == '') {
                alertService.add("warning", "Please select interest !", 2000);
                error_flag++;
                return false;
            }
            else if (!$scope.newinvestor.personal_notes || $scope.newinvestor.personal_notes == '') {
                alertService.add("warning", "Please enter personal notes !", 2000);
                error_flag++;
                return false;
            } else {
                if (error_flag == 0) {
                    var Url = 'apiv4/public/investornotes/update_investornotestouch';
                    var params = { data: $scope.investor, tickers: $scope.investor.tickerssAdded, newinvestor: $scope.newinvestor };

                    RequestDetail.getDetail(Url, params).then(function (result) {
                        if (result) {
                            $scope.touch_editstatus = 0;
                            $scope.newinvestor = [];
                            $scope.get_investornote();
                            $scope.showModalnewtouch = false;
                            alertService.add("success", "Updated successfully!", 2000);
                            // $location.path('investornotes');
                        }
                    });
                }
            }
        }

    })
    .controller('createinvestornote', function ($scope, $http, $location, $routeParams, localStorageService, RequestDetail, configdetails, $sce, usertype, alertService) {
        $scope.configdetails = configdetails;
        $scope.pageHeading = 'Corporate Profile';
        $scope.investor = {};

        $scope.searchtext = "";


        $scope.showModalnewtouch = false;

        $scope.openmodelnewtouch = function () {
            $scope.showModalnewtouch = true;
        }

        $scope.closeModalnewtouch = function () {
            $scope.showModalnewtouch = false;
        }


        $scope.video_status_class = '';
        $scope.initiation_status_class = '';
        $scope.quickfacts_status_class = '';
        $scope.flash_status_class = '';
        $scope.EPSflash_status_class = '';
        $scope.NDR_status_class = '';
        $scope.Conference_status_class = '';
        $scope.AnalystDay_status_class = '';
        $scope.EPSFollowup_status_class = '';



        $scope.newinvestor = {};


        $scope.investor.tickerssAdded = [];
        $scope.investor.other_contacts = [];

        $scope.get_investornotecontacts = function () {
            var url = 'apiv4/public/investornotes/getinvestornoteothersamecontacts';
            var params = { company: $scope.investor.company };
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.investor.other_contacts = result.data;
            });
        }


        $scope.investorsList = [];
        $scope.getList = function () {
            var GetInvestorsListUrl = 'apiv4/public/dashboard/getInvestorsList';
            var params = {
                type: 'get'
            };

            RequestDetail.getDetail(GetInvestorsListUrl, params).then(function (result) {
                $scope.investorsList = result.data;
            });
        }

        $scope.getList();


        var GetInvestorsNotesUrl = 'apiv4/public/dashboard/getInvestorsNotesCategory';
        var params = {
            type: 'get'
        };

        RequestDetail.getDetail(GetInvestorsNotesUrl, params).then(function (result) {
            $scope.investorsnotescategories = result.data;
        });



        $scope.get_search_details = function (type, searchkey, industype) {
            if (angular.isDefined(searchkey) && searchkey != '') {
                if (type != '') {
                    var tagUrl = 'apiv4/public/user/get_search_details1';
                    var searchterm = searchkey;

                    if (type == 'industry') {
                        var params = { term: searchterm, key: type, industype: industype };
                        RequestDetail.getDetail(tagUrl, params).then(function (result) {
                            if (angular.isDefined(result.data) && result.data.length > 0) {
                                $scope.availableIndustry = result.data;
                                if (industype == 'sectors') {
                                    $scope.availableIndustry_sector = result.data;
                                }
                            } else {
                                $scope.availableIndustry = [];
                                if (industype == 'sectors') {
                                    $scope.availableIndustry_sector = [];
                                }
                            }
                        });
                    }

                    if (type == 'ticker') {
                        var params = searchterm;
                        var tagUrl = 'apiv4/public/dashboard/get_auto_ticker_stock';
                        RequestDetail.getDetail(tagUrl, params).then(function (result) {
                            if (angular.isDefined(result.data) && result.data.length > 0) {
                                $scope.availableTickers = result.data;
                            } else {
                                $scope.availableTickers = [];
                            }
                        });
                    }

                }
            }
        }

        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }
        $scope.addticker = function () {

            var arrays = $scope.investor.add_ticker.split(',');

            angular.forEach(arrays, function (data, key) {
                $scope.investor.tickerssAdded.push(data);
                $scope.investor.tickerssAdded = $scope.investor.tickerssAdded.filter(onlyUnique);
                $scope.investor.add_ticker = '';
            });
        }

        $scope.removeTagging = function (index) {
            $scope.investor.tickerssAdded.splice(index, 1);
        }

        $scope.emailcheckstatus = 1;

        $scope.get_checkcontacts = function () {
            var url = 'apiv4/public/investornotes/getinvestorcheckemail';
            var params = { email: $scope.investor.email };
            RequestDetail.getDetail(url, params).then(function (result) {
                if (result.data.investor_contacts_id) {
                    $scope.emailcheckstatus = 1;
                } else {
                    $scope.emailcheckstatus = 0;
                }
            });
        }



        $scope.investor.stage_investor = "";

        $scope.addInvestornotes = function () {

            // //console.log($scope.emailcheckstatus);
            var error_flag = 0;
            if (!$scope.investor.firstname || $scope.investor.firstname == '') {
                alertService.add("warning", "Please enter first name !", 2000);
                error_flag++;
                return false;
            } else if (!$scope.investor.lastname || $scope.investor.lastname == '') {
                alertService.add("warning", "Please enter last name !", 2000);
                error_flag++;
                return false;
            }
            else if (!$scope.investor.company || $scope.investor.company == '') {
                alertService.add("warning", "Please enter firm name !", 2000);
                error_flag++;
                return false;
            }
            else if (!$scope.investor.email || $scope.investor.email == '') {
                alertService.add("warning", "Please select email !", 2000);
                error_flag++;
                return false;
            } else if (!$scope.checkemailval($scope.investor.email)) {
                alertService.add("warning", "Invalid email !", 2000);
                error_flag++;
                return false;
            }
            // else if ($scope.emailcheckstatus == 1) {
           //     //console.log('yes');
                
           // }
							 
			 
            /* else if($scope.investor.distributesAdded.length==0 && $scope.investor.newdistributelists.length==0){
                alertService.add("warning", "Please add or select distribute list !", 2000);
                error_flag++;
                return false;
             }*/

            else {
                 var url = 'apiv4/public/investornotes/getinvestorcheckemail';
                var params = { email: $scope.investor.email };
                RequestDetail.getDetail(url, params).then(function (result) {
                    if (result.data.investor_contacts_id) {
                        alertService.add("warning", "Email already exists !", 2000);
                        error_flag++;
                        return false;
                    } else {
                        if (error_flag == 0) {
                            var Url = 'apiv4/public/investornotes/add_investornotescontacts';
                            var params = { data: $scope.investor, tickers: $scope.investor.tickerssAdded, id: $scope.investor.investornoteId };
        
                            RequestDetail.getDetail(Url, params).then(function (result) {
                                if (result) {
                                    alertService.add("success", "Updated successfully!", 2000);
                                    $location.path('investornotescontacts');
                                }
                            });
                        }
                    }
                });
            }
        }


        $scope.checkemailval = function (email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }


        $scope.investor.distributesAdded = [];
        $scope.investor.newdistributelists = [];

        $scope.adddistributelist = function () {
            if ($scope.investor.distributelist && $scope.investor.distributelist != '0') {
                var selecteddistribute = $scope.investor.distributelist.split('|@|');

                var distribute = {
                    list_name: selecteddistribute[0],
                    list_id: selecteddistribute[1]
                };

                $scope.addstatus = 1;
                angular.forEach($scope.investor.distributesAdded, function (data, key) {
                    if (data.list_id == selecteddistribute[1]) {
                        $scope.addstatus = 0;
                    }
                });

                if ($scope.addstatus) {
                    $scope.investor.distributesAdded.push(distribute);
                    ////console.log($scope.investor.distributesAdded);
                }

            }
            if ($scope.investor.distributelist == '0') {
                var distribute = {
                    list_name: '',
                    list_id: 0
                };
                $scope.investor.newdistributelists.push(distribute);
            }
        }

        $scope.removedistributeTagging = function (index) {
            $scope.investor.distributesAdded.splice(index, 1);
        }

        $scope.touch_editstatus = 0;



        $scope.removenewdistributeTagging = function (index) {
            $scope.investor.newdistributelists.splice(index, 1);
        }

        $scope.savetouch = function () {
            var error_flag = 0;

            if (!$scope.newinvestor.person_that_made_touch || $scope.newinvestor.person_that_made_touch == '') {
                alertService.add("warning", "Please enter person !", 2000);
                error_flag++;
                return false;
            }
            else if (!$scope.newinvestor.type_touch || $scope.newinvestor.type_touch == '') {
                alertService.add("warning", "Please select type !", 2000);
                error_flag++;
                return false;
            }
            else if (!$scope.newinvestor.action || $scope.newinvestor.action == '') {
                alertService.add("warning", "Please select action !", 2000);
                error_flag++;
                return false;
            }
            /*else if (!$scope.newinvestor.interest || $scope.newinvestor.interest == '') {
                alertService.add("warning", "Please select interest !", 2000);
                error_flag++;
                return false;
            }*/
            else if (!$scope.newinvestor.personal_notes || $scope.newinvestor.personal_notes == '') {
                alertService.add("warning", "Please enter personal notes !", 2000);
                error_flag++;
                return false;
            } else {
                if (error_flag == 0) {
                    var Url = 'apiv4/public/investornotes/add_investornotestouch';
                    var params = { data: $scope.investor, tickers: $scope.investor.tickerssAdded, newinvestor: $scope.newinvestor };

                    RequestDetail.getDetail(Url, params).then(function (result) {
                        if (result) {
                            $scope.newinvestor = [];
                            $scope.get_investornote();
                            $scope.showModalnewtouch = false;
                            alertService.add("success", "Added successfully!", 2000);
                            // $location.path('investornotes');
                        }
                    });
                }
            }
        }


        $scope.edittouch = function (index) {
            $scope.touch_editstatus = 1;
            $scope.newinvestor = $scope.investor.investor_notes_touch[index];
            $scope.showModalnewtouch = true;
        }

        $scope.updatetouch = function () {
            var error_flag = 0;

            if (!$scope.newinvestor.person_that_made_touch || $scope.newinvestor.person_that_made_touch == '') {
                alertService.add("warning", "Please enter person !", 2000);
                error_flag++;
                return false;
            }
            else if (!$scope.newinvestor.type_touch || $scope.newinvestor.type_touch == '') {
                alertService.add("warning", "Please select type !", 2000);
                error_flag++;
                return false;
            }
            else if (!$scope.newinvestor.action || $scope.newinvestor.action == '') {
                alertService.add("warning", "Please select action !", 2000);
                error_flag++;
                return false;
            }
            else if (!$scope.newinvestor.interest || $scope.newinvestor.interest == '') {
                alertService.add("warning", "Please select interest !", 2000);
                error_flag++;
                return false;
            }
            else if (!$scope.newinvestor.personal_notes || $scope.newinvestor.personal_notes == '') {
                alertService.add("warning", "Please enter personal notes !", 2000);
                error_flag++;
                return false;
            } else {
                if (error_flag == 0) {
                    var Url = 'apiv4/public/investornotes/update_investornotestouch';
                    var params = { data: $scope.investor, tickers: $scope.investor.tickerssAdded, newinvestor: $scope.newinvestor };

                    RequestDetail.getDetail(Url, params).then(function (result) {
                        if (result) {
                            $scope.touch_editstatus = 0;
                            $scope.newinvestor = [];
                            $scope.get_investornote();
                            $scope.showModalnewtouch = false;
                            alertService.add("success", "Updated successfully!", 2000);
                            // $location.path('investornotes');
                        }
                    });
                }
            }
        }



    })
    .controller('investornotecontactsupload', function ($scope, $http, $location, $routeParams, localStorageService, RequestDetail, configdetails, $sce, usertype, alertService, $timeout) {
        $scope.configdetails = configdetails;
        $scope.pageHeading = 'Corporate Profile';

        $scope.tabactive = 'prestage';
        $scope.listitems = [];
        $scope.investorslected = [];

        // COLUMN TO SORT
        $scope.column = 'sno';

        // SORT ORDERING (ASCENDING OR DESCENDING). SET TRUE FOR DESENDING
        $scope.reverse = false;

        // CALLED ON HEADER CLICK
        $scope.sortColumn = function (col) {
            $scope.column = col;
            if ($scope.reverse) {
                $scope.reverse = false;
                $scope.reverseclass = 'arrow-up';
            } else {
                $scope.reverse = true;
                $scope.reverseclass = 'arrow-down';
            }
        };


        $scope.editinvestornotesid = 'sno';

        $scope.sortClass = function (col) {
            if ($scope.column == col) {
                if ($scope.reverse) {
                    return 'arrow-down';
                } else {
                    return 'arrow-up';
                }
            } else {
                return '';
            }
        };

        $scope.user_data = localStorageService.get('userdata');
        $scope.user_type = $scope.user_data.user_type;

        $scope.admin_status = 0;
        $scope.users = [];

        $scope.importeddata = [];
        $scope.importeddata_status = 0;

        $scope.import_investor_excel = function (data) {

            $scope.$apply(function () {
                $scope.spinnerActive = true;
                $scope.importeddata = JSON.parse(data);
                $scope.importeddata_status = 1;
                $scope.spinnerActive = false;
            });
        }

        $scope.checkemailval = function (email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }


        $scope.removeinvalid_email = function (index) {
            $scope.importeddata.invalid_emails.splice(index, 1);
        }

        $scope.changetype = "";

        $scope.changetypeselect = function () {
            if ($scope.changetype != '') {
                $scope.importeddata
                angular.forEach($scope.importeddata.exists_emails, function (col, index) {
                    $scope.importeddata.exists_emails[index].changetype = $scope.changetype;
                });
            }
        }

        $scope.updateInvestornotecontacts = function () {
            $scope.spinnerActive = true;
            angular.forEach($scope.importeddata.invalid_emails, function (col, index) {
                if (!$scope.checkemailval(col.email)) {
                    alertService.add("warning", "Fix or Remove Invalid Emails!", 2000);
                    return false;
                }
            });

            var Url = 'apiv4/public/investornotes/update_investornotesinvalidcontacts';
            var params = { data: $scope.importeddata };

            RequestDetail.getDetail(Url, params).then(function (result) {
                
                    if (result) {
                        $scope.importeddata = result.data;
                        alertService.add("success", "Updated successfully!", 2000);
                    }
                    $scope.spinnerActive = false;
            });


        }

        $scope.hideimporteddata_status = function (index) {
            $scope.importeddata_status = 0;
        }


    })
    .controller('contactsupload', function ($scope, $http, $location, $routeParams, localStorageService, RequestDetail, configdetails, $sce, usertype, alertService, $timeout) {
        $scope.configdetails = configdetails;
        $scope.pageHeading = 'Corporate Profile';

        $scope.tabactive = 'prestage';
        $scope.listitems = [];
        $scope.investorslected = [];

        // COLUMN TO SORT
        $scope.column = 'sno';

        // SORT ORDERING (ASCENDING OR DESCENDING). SET TRUE FOR DESENDING
        $scope.reverse = false;

        // CALLED ON HEADER CLICK
        $scope.sortColumn = function (col) {
            $scope.column = col;
            if ($scope.reverse) {
                $scope.reverse = false;
                $scope.reverseclass = 'arrow-up';
            } else {
                $scope.reverse = true;
                $scope.reverseclass = 'arrow-down';
            }
        };


        $scope.editinvestornotesid = 'sno';

        $scope.sortClass = function (col) {
            if ($scope.column == col) {
                if ($scope.reverse) {
                    return 'arrow-down';
                } else {
                    return 'arrow-up';
                }
            } else {
                return '';
            }
        };

        $scope.new_contacts = {};

        $scope.new_contacts.upload_type = 1;
        $scope.new_contacts.showupload_file = 1;

        $scope.upload_typechange = function (upload_type) {
            if(upload_type!=1){
                $scope.new_contacts.showupload_file = 0;
            }else{
                $scope.new_contacts.showupload_file = 1;
            }
        }

        $scope.onSelectedcontactslistname = function (list) {
           if(list.investor_list_id){
                $scope.new_contacts.showupload_file = 1;
           }
        }

        $scope.newcontactslistnamecheck = function (name) {
            if(name.length>=3){
                $scope.new_contacts.showupload_file = 1;
            }else{
                $scope.new_contacts.showupload_file = 0;
            }
        }

        $scope.newcontactslistnamecheckblur = function (name) {
            if(name.length>=3){
                $scope.new_contacts.showupload_file = 1;
            }else{
                $scope.new_contacts.showupload_file = 0;
                alertService.add("warning", "Invalid List Name, must be at least two characters!", 2000);
                return false;
            }
        }
        
        
        
        

       /* var tagUrl = 'apiv4/public/dashboard/getInvestorsList';
        var params = { key: 'tags' };
        RequestDetail.getDetail(tagUrl, params).then(function (result) {
            $scope.investerslist = {};
            $scope.investerslist = result.data;
        });*/

        var tagUrl = 'apiv4/public/dashboard/getInvestorsListonly';
        var params = { key: 'tags' };
        RequestDetail.getDetail(tagUrl, params).then(function (result) {
            $scope.investerslist = {};
            $scope.investerslist = result.data;
        });
        

        $scope.user_data = localStorageService.get('userdata');
        $scope.user_type = $scope.user_data.user_type;

        $scope.admin_status = 0;
        $scope.users = [];

        $scope.importeddata = [];
        $scope.importeddata_status = 0;

        /*$scope.import_investor_excel = function (data) {

            $scope.$apply(function () {
                $scope.spinnerActive = true;
                $scope.importeddata = JSON.parse(data);
                $scope.importeddata_status = 1;
                $scope.spinnerActive = false;
            });
        }*/

        $scope.import_contacts_excel = function (path) {
            $scope.spinnerActive = true;
            var tagUrl = 'apiv4/public/investornotes/addContactsList';
            var params = { file_path:path,new_contacts:$scope.new_contacts };
            RequestDetail.getDetail(tagUrl, params).then(function (result) {
                    $scope.importeddata = result.data;
                    $scope.importeddata_status = 1;
                    $scope.spinnerActive = false;
            });
        }
        

        $scope.checkemailval = function (email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }


        $scope.removeinvalid_email = function (index) {
            $scope.importeddata.invalid_emails.splice(index, 1);
        }

        $scope.changetype = "";

        $scope.changetypeselect = function () {
            if ($scope.changetype != '') {
                $scope.importeddata
                angular.forEach($scope.importeddata.exists_emails, function (col, index) {
                    $scope.importeddata.exists_emails[index].changetype = $scope.changetype;
                });
            }
        }

        $scope.updatecontactsexists = function () {
            $scope.spinnerActive = true;
            angular.forEach($scope.importeddata.invalid_emails, function (col, index) {
                if (!$scope.checkemailval(col.email)) {
                    alertService.add("warning", "Fix or Remove Invalid Emails!", 2000);
                    return false;
                }
            });

            var Url = 'apiv4/public/investornotes/updatecontactsexists';
            var params = { data: $scope.importeddata,new_contacts:$scope.new_contacts };

            RequestDetail.getDetail(Url, params).then(function (result) {
                
                    if (result) {
                        $scope.importeddata = result.data;
                        alertService.add("success", "Updated successfully!", 2000);
                    }
                    $scope.spinnerActive = false;
            });


        }

        $scope.hideimporteddata_status = function (index) {
            $scope.importeddata_status = 0;
        }


    })
    .controller('prospectstrials', function ($scope, $http, $location, $routeParams, localStorageService, RequestDetail, configdetails, $sce, usertype, alertService) {

        $scope.prospects = [];

        $scope.getideas_trials = function () {
            var tagUrl = 'apiv4/public/settings/getideas_trials';
            var params = {};
            RequestDetail.getDetail(tagUrl, params).then(function (result) {
                $scope.ideas_trials = result.data.rptrials;
                // //console.log($scope.ideas_trials);
            });
        }
        $scope.getideas_trials();


        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };
        $scope.open2 = function () {
            $scope.popup2.opened = true;
        };
        $scope.open3 = function () {
            $scope.popup3.opened = true;
        };
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.dateOptions = {
            // dateDisabled: disabled,
            formatYear: 'yy',
            // maxDate: new Date(),
            // minDate: '-3M',
            startingDay: 1
        };


        $scope.toggleMin = function () {
            //$scope.inlineOptions.minDate = new Date();
            var myDate = new Date();
            //add a day to the date
            myDate.setDate(myDate.getDate());
            // $scope.dateOptions.minDate = myDate;
        };

        $scope.toggleMin();

        $scope.popup1 = {
            opened: false
        };
        $scope.popup2 = {
            opened: false
        };
        $scope.popup3 = {
            opened: false
        };
        $scope.totals = [];

        $scope.realsearch_startdate = '';
        $scope.realsearch_enddate = '';

        $scope.admin_status = 0;
        $scope.users = [];

        var url = 'apiv4/public/investornotes/getinvestornotesusers';
        var params = {};
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.admin_status = result.data.admin_status;
            $scope.users = result.data.users;
        });

        $scope.selectdistributedat_start = function (dat) {
            var monthNames = [
                "January", "February", "March",
                "April", "May", "June", "July",
                "August", "September", "October",
                "November", "December"
            ];

            var day = dat.getDate();
            var monthIndex = dat.getMonth();
            var year = dat.getFullYear();

            $scope.realsearch_startdate = day + ' ' + monthNames[monthIndex] + ' ' + year;

        }

        $scope.selectdistributedat_end = function (dat) {



            var monthNames = [
                "January", "February", "March",
                "April", "May", "June", "July",
                "August", "September", "October",
                "November", "December"
            ];

            var day = dat.getDate();
            var monthIndex = dat.getMonth();
            var year = dat.getFullYear();

            $scope.realsearch_enddate = day + ' ' + monthNames[monthIndex] + ' ' + year;

            if(Date.parse($scope.realsearch_startdate)<Date.parse($scope.realsearch_enddate)){
               
            }else{
                $scope.realsearch_enddate = '';
                $scope.search_enddate= '';
                alertService.add("warning", "End date must be greater!", 2000);
				return false;
            }

        }

        // COLUMN TO SORT
        $scope.column = 'sno';

        // SORT ORDERING (ASCENDING OR DESCENDING). SET TRUE FOR DESENDING
        $scope.reverse = false;

        // CALLED ON HEADER CLICK
        $scope.sortColumn = function (col) {
            $scope.column = col;
            if ($scope.reverse) {
                $scope.reverse = false;
                $scope.reverseclass = 'arrow-up';
            } else {
                $scope.reverse = true;
                $scope.reverseclass = 'arrow-down';
            }
        };


        $scope.sortClass = function (col) {
            if ($scope.column == col) {
                if ($scope.reverse) {
                    return 'arrow-down';
                } else {
                    return 'arrow-up';
                }
            } else {
                return '';
            }
        };

        $scope.get_prospectstrials = function () {
            var url = 'apiv4/public/investornotes/getprospectstrials';
            var params = { search_text: $scope.search_text, search_startdate: $scope.realsearch_startdate, search_enddate: $scope.realsearch_enddate, filter_user_id: $scope.user_id };
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.prospects = [];
                if (result.data.trials) {
                    $scope.prospects = result.data.trials;
                }
            });
        }

        $scope.get_prospectstrials();

        $scope.cleartrials = function () {
            $scope.search_text = "";
            $scope.search_startdate = "";
            $scope.search_enddate = "";
            $scope.realsearch_startdate = "";
            $scope.realsearch_enddate = "";
            $scope.get_prospectstrials();
        }


        $scope.trial = {};

        $scope.selecttrialsdat_start = function (dat) {
            var monthNames = [
                "January", "February", "March",
                "April", "May", "June", "July",
                "August", "September", "October",
                "November", "December"
            ];

            var day = dat.getDate();
            var monthIndex = dat.getMonth();
            var year = dat.getFullYear();

            $scope.trial.realtrialsdate = day + ' ' + monthNames[monthIndex] + ' ' + year;

        }
        $scope.addtrial = function (propect) {
            // //console.log(propect);
            $scope.showModaltrialrules = true;
            $scope.trial.investor_contacts_id = propect.investor_contacts_id;
        }
        $scope.hidetrialrules = function () {
            $scope.showModaltrialrules = false;
        }
        $scope.addrule_trial = function () {
            var url = 'apiv4/public/investornotes/addrule_trial';
            var params = { rptrial_id: $scope.trial.rptrial_id, trialstartdate: $scope.trial.realtrialsdate, investor_contacts_id: $scope.trial.investor_contacts_id };
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.get_prospectstrials();
                $scope.showModaltrialrules = false;
            });
        }

        $scope.disabletrial = function (propect) {
            var url = 'apiv4/public/investornotes/disable_trial';
            var params = { prospects_trials_id: propect.prospects_trials_id };
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.get_prospectstrials();
            });
        }

        $scope.addtoexclude = function (propect) {
            var url = 'apiv4/public/investornotes/addtoexclude';
            var params = { prospects: propect };
            RequestDetail.getDetail(url, params).then(function (result) {
                alertService.add("success", "Added successfully!", 2000);
                $scope.get_prospectstrials();                
            });
        }


    })
    .controller('researchexclude', function ($scope, $http, $location, $routeParams, localStorageService, RequestDetail, configdetails, $sce, usertype, alertService) {

        $scope.prospects = [];


        // COLUMN TO SORT
        $scope.column = 'sno';

        // SORT ORDERING (ASCENDING OR DESCENDING). SET TRUE FOR DESENDING
        $scope.reverse = false;

        // CALLED ON HEADER CLICK
        $scope.sortColumn = function (col) {
            $scope.column = col;
            if ($scope.reverse) {
                $scope.reverse = false;
                $scope.reverseclass = 'arrow-up';
            } else {
                $scope.reverse = true;
                $scope.reverseclass = 'arrow-down';
            }
        };


        $scope.sortClass = function (col) {
            if ($scope.column == col) {
                if ($scope.reverse) {
                    return 'arrow-down';
                } else {
                    return 'arrow-up';
                }
            } else {
                return '';
            }
        };

        $scope.get_researchexclude = function () {
            var url = 'apiv4/public/investornotes/getresearchexclude';
            var params = { search_text: $scope.search_text, search_startdate: $scope.realsearch_startdate, search_enddate: $scope.realsearch_enddate, filter_user_id: $scope.user_id };
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.prospects = [];
                if (result.data) {
                    $scope.prospects = result.data;
                }
            });
        }

        $scope.get_researchexclude();

        
        $scope.removefromexclude = function (propect) {
            // //console.log(propect);
            var url = 'apiv4/public/investornotes/removefromexclude';
            var params = { id: propect.id };
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.get_researchexclude();
            });
        }


    })
    .controller('reportAnalyticsCtrl', function ($scope, $http, $location, $routeParams, localStorageService, RequestDetail, configdetails, $sce, usertype, alertService) {

        $scope.distributetitles = [];

        $scope.getdistributetitles = function () {
            var url = 'apiv4/public/researchprovider/getdistributetitles';
            var params = {};
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.distributetitles = result.data;
            });
        }

        $scope.getdistributetitles();



        $scope.getreportanalyticsperson = function () {
            var url = 'apiv4/public/researchprovider/getreportanalyticsperson';
            var params = { data: $scope.staticfilter };
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.analyticsperson = result.data;
                $scope.labels_graph2 = [];
                var open_array = [];
                var click_array = [];

                angular.forEach($scope.analyticsperson, function (analytic) {
                    open_array.push(analytic.open_total);
                    click_array.push(analytic.click_total);
                    $scope.labels_graph2.push(analytic.firstname + ' ' + analytic.lastname);
                });

                if (open_array.length == 0 && click_array.length == 0) {
                    $scope.data_graph2 = [
                        ['0', '0', '0', '0', '0', '0'],
                        ['0', '0', '0', '0', '0', '0'],
                    ];
                } else {
                    $scope.data_graph2 = [
                        open_array,
                        click_array
                    ];
                }


            });
        }

        $scope.getreportanalyticsperson();

        $scope.getreportanalytics = function () {
            var url = 'apiv4/public/researchprovider/getreportanalytics';
            var params = { data: $scope.staticfilter };
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.distributeanalytics = result.data;
                $scope.data_graph1 = [
                    [$scope.distributeanalytics.open_total],
                    [$scope.distributeanalytics.click_total]
                ];

                $scope.labels_graph3 = [];
                $scope.data_graph3 = [];
                angular.forEach($scope.distributeanalytics.regions, function (count, key) {
                    $scope.labels_graph3.push(key);
                    $scope.data_graph3.push(count);
                });

                if ($scope.labels_graph3.length == 0 && $scope.data_graph3.length == 0) {
                    $scope.data_graph3 = [
                        ['0', '0']
                    ];
                    $scope.labels_graph3 = ['', ''];
                }


                $scope.labels_graph4 = [];
                $scope.data_graph4 = [];
                angular.forEach($scope.distributeanalytics.customer_types, function (count, key) {
                    $scope.labels_graph4.push(key);
                    $scope.data_graph4.push(count);
                });

                if ($scope.labels_graph4.length == 0 && $scope.data_graph4.length == 0) {
                    $scope.data_graph4 = [
                        ['0', '0', '0', '0', '0', '0'],
                        ['0', '0', '0', '0', '0', '0'],
                    ];
                    $scope.labels_graph4 = ['', '', '', '', ''];
                }


                $scope.labels_graph5 = [];
                $scope.data_graph5 = [];
                angular.forEach($scope.distributeanalytics.customer_styles, function (count, key) {
                    $scope.labels_graph5.push(key);
                    $scope.data_graph5.push(count);
                });

                if ($scope.labels_graph5.length == 0 && $scope.data_graph5.length == 0) {
                    $scope.data_graph5 = [
                        ['0', '0', '0', '0', '0', '0'],
                        ['0', '0', '0', '0', '0', '0'],
                    ];
                    $scope.labels_graph5 = ['', '', '', '', ''];
                }


                $scope.labels_graph6 = [];
                $scope.data_graph6 = [];
                angular.forEach($scope.distributeanalytics.customer_sizes, function (count, key) {
                    $scope.labels_graph6.push(key);
                    $scope.data_graph6.push(count);
                });

                if ($scope.labels_graph6.length == 0 && $scope.data_graph6.length == 0) {
                    $scope.data_graph6 = [
                        ['0', '0', '0', '0', '0', '0'],
                        ['0', '0', '0', '0', '0', '0'],
                    ];
                    $scope.labels_graph6 = ['', '', '', '', ''];
                }

            });

            $scope.getreportanalyticsperson();
        }

        $scope.getreportanalytics();


        $scope.colors_graph1 = ['#0F74BA', '#29A8E0', '#e0ea49', '#e0ea93', '#29A8E0'];

        $scope.data_graph1 = [];
        $scope.data_graph1 = [
            ['0'],
            ['0']
        ];

        $scope.datasetOverride1 = [{ yAxisID: 'y-axis-1' }];

        $scope.labels_graph1 = [];
        $scope.labels_graph1 = ['Open', 'Click'];

        $scope.options_graph1 = {
            legend: {
                display: true
            },
            scales: {
                xAxes: [{
                    stacked: false, gridLines: { display: true, drawBorder: true, drawOnChartArea: false }
                }],
                yAxes: [{
                    stacked: false, id: 'y-axis-1', position: 'left', gridLines: { display: true, drawBorder: true, drawOnChartArea: false }, scaleLabel: { display: true, labelString: 'Open & Click' }, ticks: { min: 0, callback: function (value) { if (Number.isInteger(value)) { return value; } } }
                }]
            },

            title: {
                display: true,
                text: '',
                fontSize: 15,
            },
        };

        $scope.series_graph1 = ['Open', 'Click'];



        $scope.colors_graph2 = ['#0F74BA', '#29A8E0', '#e0ea49', '#e0ea93', '#29A8E0'];

        $scope.data_graph2 = [];
        $scope.data_graph2 = [
            ['0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0'],
        ];

        $scope.datasetOverride2 = [{ yAxisID: 'y-axis-1' }];

        $scope.labels_graph2 = [];
        $scope.labels_graph2 = ['Oct2018'];

        $scope.options_graph2 = {
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    stacked: false, gridLines: { display: true, drawBorder: true, drawOnChartArea: false }
                }],
                yAxes: [{
                    stacked: false, id: 'y-axis-1', position: 'left', gridLines: { display: true, drawBorder: true, drawOnChartArea: false }, scaleLabel: { display: true, labelString: 'Open & Click' }, ticks: { min: 0, callback: function (value) { if (Number.isInteger(value)) { return value; } } }
                }]
            },

            title: {
                display: true,
                text: '',
                fontSize: 15,
            },
        };

        // $scope.series_graph2 = ['Open', 'Click'];



        $scope.colors_graph3 = ['#0F74BA', '#29A8E0', '#e0ea49', '#e0ea93', '#29A8E0'];

        $scope.data_graph3 = [];
        $scope.data_graph3 = [
            ['0', '0']
        ];



        $scope.datasetOverride3 = [{ yAxisID: 'y-axis-1' }];

        $scope.labels_graph3 = [];
        $scope.labels_graph3 = ['', ''];

        $scope.options_graph3 = {
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    stacked: false, gridLines: { display: true, drawBorder: true, drawOnChartArea: false }
                }],
                yAxes: [{
                    stacked: false, id: 'y-axis-1', position: 'left', gridLines: { display: true, drawBorder: true, drawOnChartArea: false }, scaleLabel: { display: true, labelString: 'Open & Click' }, ticks: { min: 0, callback: function (value) { if (Number.isInteger(value)) { return value; } } }
                }]
            },

            title: {
                display: true,
                text: '',
                fontSize: 15,
            },
        };

        //$scope.series_graph3 = ['Open', 'Click'];




        $scope.colors_graph4 = ['#0F74BA', '#29A8E0', '#e0ea49', '#e0ea93', '#29A8E0'];

        $scope.data_graph4 = [];
        $scope.data_graph4 = [
            ['0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0'],
        ];

        $scope.datasetOverride4 = [{ yAxisID: 'y-axis-1' }];

        $scope.labels_graph4 = [];
        $scope.labels_graph4 = ['', '', '', '', ''];

        $scope.options_graph4 = {
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    stacked: false, gridLines: { display: true, drawBorder: true, drawOnChartArea: false }
                }],
                yAxes: [{
                    stacked: false, id: 'y-axis-1', position: 'left', gridLines: { display: true, drawBorder: true, drawOnChartArea: false }, scaleLabel: { display: true, labelString: 'Open & Click' }, ticks: { min: 0, callback: function (value) { if (Number.isInteger(value)) { return value; } } }
                }]
            },

            title: {
                display: true,
                text: '',
                fontSize: 15,
            },
        };

        //$scope.series_graph4 = ['Open', 'Click'];




        $scope.colors_graph5 = ['#0F74BA', '#29A8E0', '#e0ea49', '#e0ea93', '#29A8E0'];

        $scope.data_graph5 = [];
        $scope.data_graph5 = [
            ['0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0'],
        ];

        $scope.datasetOverride5 = [{ yAxisID: 'y-axis-1' }];

        $scope.labels_graph5 = [];
        $scope.labels_graph5 = ['', '', '', '', ''];

        $scope.options_graph5 = {
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    stacked: false, gridLines: { display: true, drawBorder: true, drawOnChartArea: false }
                }],
                yAxes: [{
                    stacked: false, id: 'y-axis-1', position: 'left', gridLines: { display: true, drawBorder: true, drawOnChartArea: false }, scaleLabel: { display: true, labelString: 'Open & Click' }, ticks: { min: 0, callback: function (value) { if (Number.isInteger(value)) { return value; } } }
                }]
            },

            title: {
                display: true,
                text: '',
                fontSize: 15,
            },
        };

        // $scope.series_graph5 = ['Open', 'Click'];


        $scope.colors_graph6 = ['#0F74BA', '#29A8E0', '#e0ea49', '#e0ea93', '#29A8E0'];

        $scope.data_graph6 = [];
        $scope.data_graph6 = [
            ['0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0'],
        ];

        $scope.datasetOverride6 = [{ yAxisID: 'y-axis-1' }];

        $scope.labels_graph6 = [];
        $scope.labels_graph6 = ['', '', '', '', ''];

        $scope.options_graph6 = {
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    stacked: false, gridLines: { display: true, drawBorder: true, drawOnChartArea: false }
                }],
                yAxes: [{
                    stacked: false, id: 'y-axis-1', position: 'left', gridLines: { display: true, drawBorder: true, drawOnChartArea: false }, scaleLabel: { display: true, labelString: 'Open & Click' }, ticks: { min: 0, callback: function (value) { if (Number.isInteger(value)) { return value; } } }
                }]
            },

            title: {
                display: true,
                text: '',
                fontSize: 15,
            },
        };

        //$scope.series_graph6 = ['Open', 'Click'];

    })

    .controller('createRContent', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails,$route,$window) {
        $scope.configdetails = configdetails;
        $scope.openmodelpagehelp = function () {
            $scope.showModalpageinfo = !$scope.showModalpageinfo;
        }
        $scope.sidepopupactive = false;
    
        $scope.sidepopup = function () {
            $scope.sidepopupactive = !$scope.sidepopupactive;
        }
    
        $scope.dcdata = {};
        $scope.dcdata.archive_status = "0";
        $scope.dcdata.event_status = '0';
        $scope.dcdata.event_type = '1';
        $scope.dcdata.selectedideas = [];
        
        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];
    
    
        $scope.dateOptions = {
            // dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date().setDate(new Date().getDate() + 7),
            minDate: new Date(),
            startingDay: 1
          };
    
    
        $scope.toggleMin = function () {
            //$scope.inlineOptions.minDate = new Date();
            var myDate = new Date();
            //add a day to the date
            myDate.setDate(myDate.getDate());
            $scope.dateOptions.minDate = myDate;
        };
      
        $scope.toggleMin();
    
        $scope.popup1 = {
          opened: false
        };
    
        $scope.stamptimes = [];
    
        $scope.dcdata.realsend_date = '';
        $scope.selectdistributedat = function (dat) {
            var monthNames = [
                "January", "February", "March",
                "April", "May", "June", "July",
                "August", "September", "October",
                "November", "December"
            ];
            
            var day = dat.getDate();
            var monthIndex = dat.getMonth();
            var year = dat.getFullYear();
    
            $scope.dcdata.realsend_date = day + ' ' + monthNames[monthIndex] + ' ' + year;
        }
    
    
        var daily = 'apiv4/public/researchidea/gettimezone';
        var params = {}
        RequestDetail.getDetail(daily,params).then(function(result){  
            $scope.timezone = result.data;
            //console.log($scope.timezone);
        });
    
    
        $scope.ideas = [];
        $scope.searchideas = function(keyword){
            var daily = 'apiv4/public/researchidea/getideas';
            var params = {keyword:keyword}
            RequestDetail.getDetail(daily,params).then(function(result){  
                $scope.ideas = result.data;
                angular.forEach($scope.ideas,function(col,index){
                    $scope.ideas[index].selected = 0;
                });
            });
        }
    
        $scope.searchideas('');
    
        $scope.addideas = function (index) {
            $scope.ideas[index].selected = 1;
            $scope.dcdata.selectedideas.push($scope.ideas[index].daily_ideas_list_id);
        }
        $scope.removedideas = function (index) {
            $scope.ideas[index].selected = 0;
            const valueindex = $scope.dcdata.selectedideas.indexOf($scope.ideas[index].daily_ideas_list_id);
            if (valueindex > -1) {
                $scope.dcdata.selectedideas.splice(valueindex, 1);
            }
        }
        
       
    
        $scope.dcdata.sectors = ['Macro','Technology','Health Care','Consumer Staples','Consumer Discretionary','Financials','Digital Banking','Materials','Industrials','Energy'];
    
    
        $scope.get_search_details = function (type, searchkey) {
            if (angular.isDefined(searchkey) && searchkey != '') {
                if (type != '') {
                    var tagUrl = 'apiv4/public/user/get_search_details1';
                    var searchterm = searchkey;
      
                    if (type == 'event') {
                        var params = searchterm;
                        var tagUrl = 'apiv4/public/researchidea/getevents';
                        RequestDetail.getDetail(tagUrl, params).then(function (result) {
                            //console.log(result.data);
                            if (angular.isDefined(result.data) && result.data.length > 0) {
                                $scope.availableevents = result.data;
                            } else {
                                $scope.availableevents = [];
                            }
                        });
                    }
                    if (type == 'sectors') {
                        var params = { term: searchterm, key: 'industry', industype:'sectors' };
                        RequestDetail.getDetail(tagUrl, params).then(function (result) {
                            if (angular.isDefined(result.data) && result.data.length > 0) {
                                $scope.availableIndustry_sector = result.data;
                            } else {
                                $scope.availableIndustry = [];
                                $scope.availableIndustry_sector = result.data;
                            }
                        });
                    }
      
                }
            }
        }
    
     
        
        $scope.researchSubmit = function(){ 
            if(angular.isUndefined($scope.dcdata.date) || $scope.dcdata.date== ''){         
                alertService.add("warning", "Date Invalid !",2000);
                return false;
            } 
            
            if(angular.isUndefined($scope.dcdata.mail_subject) || $scope.dcdata.mail_subject== ''){         
                alertService.add("warning", "Subject Invalid !",2000);
                return false;
            } 
            
            var daily = 'apiv4/public/researchidea/addresearch';
            var params = {
                researchdata:$scope.dcdata,
            };
            
            RequestDetail.getDetail(daily,params).then(function(result){ // The fasctory RequestDetail reused in Investors and corporates
                $location.path('researchanalytics/history');
            });
        }
    
    }).controller('editRContent', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails,$route) {
    
        $scope.dcdata = [];
    
        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];
    
    
        $scope.dateOptions = {
            // dateDisabled: disabled,
            formatYear: 'yy',
          //  maxDate: new Date().setDate(new Date().getDate() + 7),
          //  minDate: new Date(),
            startingDay: 1
        };
    
    
        $scope.toggleMin = function () {
            //$scope.inlineOptions.minDate = new Date();
            var myDate = new Date();
            //add a day to the date
            myDate.setDate(myDate.getDate());
           // $scope.dateOptions.minDate = myDate;
        };
      
        $scope.toggleMin();
    
        $scope.popup1 = {
          opened: false
        };
    
        $scope.stamptimes = [];
    
        $scope.dcdata.realsend_date = '';
        $scope.selectdistributedat = function (dat) {
            var monthNames = [
                "January", "February", "March",
                "April", "May", "June", "July",
                "August", "September", "October",
                "November", "December"
            ];
            
            var day = dat.getDate();
            var monthIndex = dat.getMonth();
            var year = dat.getFullYear();
    
            $scope.dcdata.realsend_date = day + ' ' + monthNames[monthIndex] + ' ' + year;
        }
    
        $scope.ideas = [];
        $scope.searchideas = function(keyword){
            var daily = 'apiv4/public/researchidea/getideas';
            var params = {keyword:keyword}
            RequestDetail.getDetail(daily,params).then(function(result){  
                $scope.ideas = result.data;
                angular.forEach($scope.ideas,function(col,index){
                     $scope.ideas[index].selected = 0;
                });
            });
        }
        
        $scope.searchideas('');
    
        $scope.addideas = function (index) {
            $scope.ideas[index].selected = 1;
            $scope.dcdata.selectedideas.push($scope.ideas[index].daily_ideas_list_id);
        }
        $scope.removedideas = function (index) {
            $scope.ideas[index].selected = 0;
            $scope.dcdata.removedideas.push($scope.ideas[index].daily_ideas_list_id);
    
            const valueindex = $scope.dcdata.selectedideas.indexOf($scope.ideas[index].daily_ideas_list_id);
            if (valueindex > -1) {
                $scope.dcdata.selectedideas.splice(valueindex, 1);
            }
        }
    
        var daily = 'apiv4/public/researchidea/gettimezone';
        var params = {}
        RequestDetail.getDetail(daily,params).then(function(result){  
            $scope.timezone = result.data;
            //console.log($scope.timezone);
        });
    
        var daily = 'apiv4/public/researchidea/getResearch';
        var params = {
            distribute_content_ideasId:$routeParams.distribute_content_ideasId
        }
        RequestDetail.getDetail(daily,params).then(function(result){ // The factory RequestDetail reused in Investors and corporates
            $scope.dcdata = result.data;
            $scope.dcdata.removedideas = [];
    
            $scope.dcdata.realsend_date = result.data.date;
    
            var ddd = result.data.date;
            var myDate = new Date(ddd);
            $scope.dcdata.date= myDate;
    
            if(result.data.event_status){
                if(result.data.events){
                    $scope.dcdata.event = [];
                    var object = {
                        event_id: result.data.events,
                        title: result.data.event_title
                    };
                    $scope.dcdata.event.push(object);
                }
            }
            if(result.data.event_status){
                if(result.data.event_replay){
                    $scope.dcdata.event_replay_data = [];
                    var object = {
                        event_id: result.data.event_replay,
                        title: result.data.eventreplay_title
                    };
                    $scope.dcdata.event_replay_data.push(object);
                }
            }
            
                ////console.log(result.data);
            
            
            
            $timeout(function () {
                angular.forEach($scope.ideas, function (data,key1) {
                    if(result.data.selectedideas){
                        if(!data.selected){
                            angular.forEach(result.data.selectedideas, function (selecteddata,key2) {
                                if(data.daily_ideas_list_id==selecteddata){
                                     $scope.ideas[key1].selected = 1;
                                }
                            });
                        }
                    }
                });  
            }, 1000);
    
              /* $scope.dcdata.event = [];
                var object = {
                    event_id: 1,
                    title: 'test'
                };
                $scope.dcdata.event.push(object);*/
    
        });
    
        $scope.dcdata.sectors = ['Macro','Technology','Health Care','Consumer Staples','Consumer Discretionary','Financials','Digital Banking','Materials','Industrials','Energy'];
    
    
        $scope.get_search_details = function (type, searchkey) {
            if (angular.isDefined(searchkey) && searchkey != '') {
                if (type != '') {
                    var tagUrl = 'apiv4/public/user/get_search_details1';
                    var searchterm = searchkey;
      
                    if (type == 'event') {
                        var params = searchterm;
                        var tagUrl = 'apiv4/public/researchidea/getevents';
                        RequestDetail.getDetail(tagUrl, params).then(function (result) {
                            //console.log(result.data);
                            if (angular.isDefined(result.data) && result.data.length > 0) {
                                $scope.availableevents = result.data;
                            } else {
                                $scope.availableevents = [];
                            }
                        });
                    }
                    if (type == 'sectors') {
                        var params = { term: searchterm, key: 'industry', industype:'sectors' };
                        RequestDetail.getDetail(tagUrl, params).then(function (result) {
                            if (angular.isDefined(result.data) && result.data.length > 0) {
                                $scope.availableIndustry_sector = result.data;
                            } else {
                                $scope.availableIndustry = [];
                                $scope.availableIndustry_sector = result.data;
                            }
                        });
                    }
      
                }
            }
        }
    
        $scope.researchSubmit = function(){
            
            //console.log($scope.dcdata.realsend_date);
            if(angular.isUndefined($scope.dcdata.title) || $scope.dcdata.title== ''){         
                alertService.add("warning", "Title Invalid !",2000);
                return false;
            } 
    
            
           // $scope.dcdata.event_replay = [];
    
            
    
            var daily = 'apiv4/public/researchidea/editresearch';
            var params = {researchdata:$scope.dcdata};
            
            RequestDetail.getDetail(daily,params).then(function(result){ // The fasctory RequestDetail reused in Investors and corporates
                $location.path('researchanalytics/history');
            });
        }
    
    })
    .controller('researchanalytics', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails,$route) {
    
        $scope.tab =1;
        
       
        $scope.histories = [];
    
         // COLUMN TO SORT
        $scope.column = 'sno';
    
        // SORT ORDERING (ASCENDING OR DESCENDING). SET TRUE FOR DESENDING
        $scope.reverse = false;
    
        // CALLED ON HEADER CLICK
        $scope.sortColumn = function (col) {
            $scope.column = col;
            if ($scope.reverse) {
                $scope.reverse = false;
                $scope.reverseclass = 'arrow-up';
            } else {
                $scope.reverse = true;
                $scope.reverseclass = 'arrow-down';
            }
        };
    
    
        $scope.sortClass = function (col) {
            if ($scope.column == col) {
                if ($scope.reverse) {
                    return 'arrow-down';
                } else {
                    return 'arrow-up';
                }
            } else {
                return '';
            }
        };
    
        $scope.tabchange = function (tab) {
            $scope.tab =tab;
        }
    
        if($routeParams.distributePath){
            $scope.tab =2;
        }
    
        $scope.sortColumn("date");
    
        $scope.dashboard_values = function () {
    
            var url = 'apiv4/public/researchidea/dashboard_values_most_active_readers';
            var params = {start_date:$scope.realsearch_startdate,end_date:$scope.realsearch_enddate};
            RequestDetail.getDetail(url, params).then(function (result) {
                if(result.data){
                   $scope.labels_graph4 = result.data.readers.lables;
                   $scope.data_graph4 = result.data.readers.values;
                }
            });
    
            var url = 'apiv4/public/researchidea/dashboard_values_top_providers';
            var params = {start_date:$scope.realsearch_startdate,end_date:$scope.realsearch_enddate};
            RequestDetail.getDetail(url, params).then(function (result) {
                if(result.data){
                    $scope.labels_graph3 = result.data.topproviders.lables;
                    $scope.data_graph3 = result.data.topproviders.values;
                }
            });
    
            var url = 'apiv4/public/researchidea/dashboard_values_engagements';
            var params = {start_date:$scope.realsearch_startdate,end_date:$scope.realsearch_enddate};
            RequestDetail.getDetail(url, params).then(function (result) {
                if(result.data){
                    $scope.labels_graph1 = result.data.engagements.dates;
                    $scope.data_graph1 = result.data.engagements.values;
                    $scope.labels_graph2 = result.data.engagements.dates;
                }
            });
    
            var url = 'apiv4/public/researchidea/dashboard_values';
            var params = {start_date:$scope.realsearch_startdate,end_date:$scope.realsearch_enddate};
            RequestDetail.getDetail(url, params).then(function (result) {
                if(result.data){
                    $scope.data_graph2 = result.data.engagementproviders.values;
                    $scope.series_graph2 =  result.data.engagementproviders.rps;
                }
                
    
                $scope.spinnerActive = false;
            });
    
        }
    
    
        $scope.dashboard_values();
    
       
    
    
        $scope.colors_graph1 = ['#0F74BA', '#29A8E0', '#e0ea49', '#e0ea93', '#29A8E0'];
    
        $scope.data_graph1 = [];
        $scope.data_graph1 = [
            ['0','0','0','0','0']
        ]; 
    
        $scope.datasetOverride1 = [{ yAxisID: 'y-axis-1' },{ yAxisID: 'y-axis-2' },{ yAxisID: 'y-axis-2' }];
    
        $scope.labels_graph1 = ['dhamu','varun'];
    
        $scope.options_graph1 = {
            legend: {
                display: true
            },
            scales: {
                xAxes: [{
                    stacked: false,gridLines: {display: true,drawBorder: true,drawOnChartArea: false}
                }],
                yAxes: [{
                    stacked: false,id: 'y-axis-1', position: 'right',gridLines: {display: true,drawBorder: true,drawOnChartArea: false},scaleLabel: { display: true, labelString: 'TotalContacts'},  ticks: {min: 0,callback: function (value) { if (Number.isInteger(value)) { return value; } }}
                },{
                    stacked: false,id: 'y-axis-2', position: 'left',gridLines: {display: true,drawBorder: true,drawOnChartArea: false},scaleLabel: { display: true, labelString: 'Open & Click'},  ticks: {min: 0,callback: function (value) { if (Number.isInteger(value)) { return value; } }}
                }
                ,{
                    stacked: false,id: 'y-axis-2', position: 'left',gridLines: {display: true,drawBorder: true,drawOnChartArea: false},scaleLabel: { display: true, labelString: 'Open & Click'},  ticks: {min: 0,callback: function (value) { if (Number.isInteger(value)) { return value; } }}
                }]
            },
    
            title: {
                display: true,
                text: 'Total Engagement over Time',
                fontSize: 15,
            },
        };
        
        $scope.series_graph1 = ['TotalContacts', 'Open', 'Click'];
    
    
        
    
        $scope.colors_graph2 = ['#0F74BA', '#29d8E0', '#e0ef49', '#29E8E0', '#29D8E0'];
    
        $scope.data_graph2 = [];
        $scope.data_graph2 = [
            ['10','40'],
            ['5','6'],
        ]; 
    
        $scope.datasetOverride2 = [{ yAxisID: 'y-axis-1' }];
    
        $scope.labels_graph2 = ['2-10-2021','2-11-2021'];
    
        $scope.options_graph2 = {
            legend: {
                display: true
            },
            scales: {
                xAxes: [{
                    stacked: false,gridLines: {display: true,drawBorder: true,drawOnChartArea: false}
                }],
                yAxes: [{
                    stacked: false,id: 'y-axis-1', position: 'left',gridLines: {display: true,drawBorder: true,drawOnChartArea: false},scaleLabel: { display: true, labelString: 'Click'},  ticks: {min: 0,callback: function (value) { if (Number.isInteger(value)) { return value; } }}
                }]
            },
    
            title: {
                display: true,
                text: 'Engagement by Research Provider',
                fontSize: 15,
            },
        };
        
        $scope.series_graph2 = ['Datatrek', 'Bond Angle'];
    
    
    
        $scope.colors_graph3 = ['#0F74BA', '#29A8E0', '#e0ea49', '#e0ea93', '#29A8E0'];
    
        $scope.data_graph3 = [];
        $scope.data_graph3 = [
            ['0','0','0','0','0'],
        ]; 
    
        $scope.datasetOverride3 = [{ xAxisID: 'y-axis-1' }];
    
        $scope.labels_graph3 = [];
    
        $scope.options_graph3 = {
            legend: {
                display: true
            },
            scales: {
                xAxes: [{
                    stacked: false,id: 'y-axis-1', position: 'left',gridLines: {display: true,drawBorder: true,drawOnChartArea: false},scaleLabel: { display: true, labelString: 'Click Count'},  ticks: {min: 0,callback: function (value) { if (Number.isInteger(value)) { return value; } }}
                }],
                yAxes: [{
                    stacked: false, gridLines: {display: true,drawBorder: true,drawOnChartArea: false}
                }]
            },
    
            title: {
                display: true,
                text: 'Top Research Providers',
                fontSize: 15,
            },
        };
        
        $scope.series_graph3 = ['Click'];
    
    
    
        $scope.colors_graph4 = ['#0F74BA', '#29A8E0', '#e0ea49', '#e0ea93', '#29A8E0'];
    
        $scope.data_graph4 = [];
        $scope.data_graph4 = []; 
    
        $scope.datasetOverride4 = [{ xAxisID: 'y-axis-1' }];
    
        $scope.labels_graph4 = [];
    
        $scope.options_graph4 = {
            legend: {
                display: true
            },
            scales: {
                xAxes: [{
                    stacked: false,id: 'y-axis-1', gridLines: {display: true,drawBorder: true,drawOnChartArea: false},scaleLabel: { display: true, labelString: 'Reports Count'},  ticks: {min: 0,callback: function (value) { if (Number.isInteger(value)) { return value; } }}
                }],
                yAxes: [{
                    stacked: false,gridLines: {display: true,drawBorder: true,drawOnChartArea: false}
                }]
            },
    
            title: {
                display: true,
                text: 'Most Active Readers',
                fontSize: 15,
            },
        };
        
        $scope.series_graph4 = ['Click'];
    
    
        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };
        $scope.open2 = function () {
            $scope.popup2.opened = true;
        };
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];
    
        $scope.dateOptions = {
            // dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(),
            //minDate: new Date().setDate(new Date().getDate() - 30),
            startingDay: 1
        };
    
    
        $scope.toggleMin = function () {
            //$scope.inlineOptions.minDate = new Date();
            var myDate = new Date();
            //add a day to the date
            myDate.setDate(myDate.getDate());
           // $scope.dateOptions.minDate = myDate;
        };
      
        $scope.toggleMin();
    
        $scope.popup1 = {
          opened: false
        };
        $scope.popup2 = {
            opened: false
        };
        
        $scope.totals = [];
    
     $scope.recountdistribute = function (distribute_content_id) {
            $scope.spinnerActive = true;
            var url = 'apiv4/public/researchidea/recountdistribute';
            var params = { distribute_content_id:distribute_content_id};
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.getalldistribute();
            });
        }											 
       
    
        $scope.getalldistribute = function () {
            
            $scope.spinnerActive = true;
            $scope.histories = [];
    
            var url = 'apiv4/public/researchidea/getalldistribute';
            var params = {};
            RequestDetail.getDetail(url, params).then(function (result) {
                
                angular.forEach(result.data, function (history) {
                   // history.total_emails = parseInt(history.total_emails);
                   //  history.unique_open = parseInt(history.unique_open);
    
                        $scope.histories.push(history);
    
                       // //console.log($scope.histories);
                });
    
             
                $scope.spinnerActive = false;
            });
        }
    
        $scope.getalldistribute();
    
        
        $scope.topresearchs = function () {
            $scope.spinnerActive = true;
    
            var url = 'apiv4/public/researchidea/topresearchs';
            var params = {startdate:$scope.realsearch_startdate,enddate:$scope.realsearch_enddate};
            RequestDetail.getDetail(url, params).then(function (result) {
    $scope.topdistributes = [];
                angular.forEach(result.data, function (distribut) {
                  $scope.topdistributes.push(distribut);
                });
                $scope.spinnerActive = false;
            });
        }
    
       // $scope.topresearchs();
    
        $scope.realsearch_startdate = '';
        $scope.realsearch_enddate = '';
    
        $scope.selectdistributedat = function (dat,type) {
            var monthNames = [
                "January", "February", "March",
                "April", "May", "June", "July",
                "August", "September", "October",
                "November", "December"
            ];
            
            var day = dat.getDate();
            var monthIndex = dat.getMonth();
            var year = dat.getFullYear();
    
            if(type==1){
                $scope.realsearch_startdate = day + ' ' + monthNames[monthIndex] + ' ' + year;
            }else{
                $scope.realsearch_enddate = day + ' ' + monthNames[monthIndex] + ' ' + year;
            }
            $scope.fill = 1;
            if($scope.realsearch_startdate){
                if(!$scope.realsearch_enddate){
                    $scope.fill = 0;
                }
            }
            if($scope.realsearch_enddate){
                if(!$scope.realsearch_startdate){
                    $scope.fill = 0;
                }
            }
            if($scope.fill){
                $scope.topresearchs();
                $scope.dashboard_values();
            }
    
        }
    
        var enddate = new Date();
        var startdate = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    
        $scope.search_startdate = startdate;
        $scope.search_enddate = enddate;
    
        $scope.selectdistributedat($scope.search_startdate,1); 
        $scope.selectdistributedat($scope.search_enddate,2);
        
        
        $scope.approvedistribute = function (history) {
            $scope.spinnerActive = true;
            var url = 'apiv4/public/researchidea/approvedistribute';
            var params = {distribute_content_ideas_id_url: history.distribute_content_ideas_id_url};
            RequestDetail.getDetail(url, params).then(function (result) {
                history.status=1;
                alertService.add("success", 'Approved Successfully !', 2000);
                $scope.spinnerActive = false;
            });
        }
        
    
        $scope.deletedistribute = function (distribute_content_id) {
            if (confirm("Are you sure?")) {
                $scope.spinnerActive = true;
                var url = 'apiv4/public/researchidea/deactivedistribute';
                var params = {
                    distribute_content_id: distribute_content_id
                };
                RequestDetail.getDetail(url, params).then(function (result) {
                    $scope.spinnerActive = false;
                    $scope.getalldistribute();
                });
    
            }
        };
    
    })
    .controller('researchDetail', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails,$route) {
       
    
        $scope.processed_total = 0;
        $scope.delivered_total = 0;
        $scope.open_total = 0;
        $scope.click_total = 0;
        $scope.bounce_total = 0;
        $scope.analyticsresults = {};
        $scope.analyticsresults.analytics = [];
        $scope.bounces = [];
    
        $scope.loaderstatus = 0;
    
    
        $scope.distribute_content_ideasId = $routeParams.distribute_content_ideasId;
        
        $scope.getalldistribute = function (count) {
            
    
             // COLUMN TO SORT
            $scope.column2 = 'sno';
    
            // SORT ORDERING (ASCENDING OR DESCENDING). SET TRUE FOR DESENDING
            $scope.reverse2 = false;
    
            // CALLED ON HEADER CLICK
            $scope.sortColumn2 = function (col) {
                $scope.column2 = col;
                if ($scope.reverse2) {
                    $scope.reverse2 = false;
                    $scope.reverseclass2 = 'arrow-up';
                } else {
                    $scope.reverse2= true;
                    $scope.reverseclass2 = 'arrow-down';
                }
            };
    
    
            $scope.sortClass2 = function (col) {
                if ($scope.column2 == col) {
                    if ($scope.reverse2) {
                        return 'arrow-down';
                    } else {
                        return 'arrow-up';
                    }
                } else {
                    return '';
                }
            };
    
    
            $scope.spinnerActive = true;
    
    
            var url = 'apiv4/public/researchidea/getdistributedetail';
            var params = {distribute_content_ideasId:$scope.distribute_content_ideasId, page: count};
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.spinnerActive = false;
    
                $scope.titleresults = result.data.title;
                $scope.research_distribution_status = result.data.research_distribution_status;
               
    
                angular.forEach(result.data.analytics, function (analytic) {
                    $scope.analyticsresults.analytics.push(analytic);
                    if(analytic.bounce){
                        $scope.bounces.push({
                            email: analytic.email,
                            updatedemail: analytic.updatedemail,
                            editstatus: 0,
                            investor_contacts_id: analytic.investor_contacts_id,
                        });
                    }
                });
    
                $scope.loaderstatus = 0;
    
                if($scope.count==1){
                    $scope.total_count = result.data.total_count;
                    $scope.count = $scope.count+1;
                }
               if($scope.total_count >= result.data.page){
                    $scope.getlist(result.data.page);
               }
    
                $scope.processed_total = parseInt($scope.processed_total)+parseInt(result.data.processed_total);
                $scope.delivered_total = parseInt($scope.delivered_total)+parseInt(result.data.delivered_total);
                $scope.open_total = parseInt($scope.open_total)+parseInt(result.data.open_total);
                $scope.click_total = parseInt($scope.click_total)+parseInt(result.data.click_total);
                $scope.bounce_total = parseInt($scope.bounce_total)+parseInt(result.data.bounce_total);
              
                $scope.sortColumn2("click");
            });
        }
    
        
    
        $scope.getalldistribute(1);
    
        $scope.poptimes = {};
        $scope.titletimes = '';
        $scope.timesopen = function (index) {
            $scope.poptimes = $scope.analyticsresults.analytics[index].open_times;
            $scope.titletimes = 'Open Detail';
            $scope.showModalpagetimes = true;
        }
            
        $scope.timesclick = function (index) {
            $scope.poptimes = $scope.analyticsresults.analytics[index].click_times;
            $scope.titletimes = 'Click Detail';
            $scope.showModalpagetimes = true;
        }
    
        $scope.closetimes = function () {
            $scope.showModalpagetimes = false;
        }
    
    })
    .controller('researchengaging', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails,$route) {
    
    
        $scope.distributes = [];
    
    
         // COLUMN TO SORT
        $scope.column = 'sno';
    
        // SORT ORDERING (ASCENDING OR DESCENDING). SET TRUE FOR DESENDING
        $scope.reverse = false;
    
        // CALLED ON HEADER CLICK
        $scope.sortColumn = function (col) {
            $scope.column = col;
            if ($scope.reverse) {
                $scope.reverse = false;
                $scope.reverseclass = 'arrow-up';
            } else {
                $scope.reverse = true;
                $scope.reverseclass = 'arrow-down';
            }
        };
    
    
        $scope.sortClass = function (col) {
            if ($scope.column == col) {
                if ($scope.reverse) {
                    return 'arrow-down';
                } else {
                    return 'arrow-up';
                }
            } else {
                return '';
            }
        };
    
       // $scope.spinnerActive = true;
    
        $scope.distribute_total_count = 1;
    
        $scope.search_region = "";
        $scope.search_user = "";
    
        $scope.search_filterby = '1';
    
        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };
        $scope.open2 = function () {
            $scope.popup2.opened = true;
        };
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];
    
        $scope.dateOptions = {
            // dateDisabled: disabled,
            formatYear: 'yy',
           // maxDate: new Date(),
           // minDate: '-3M',
            startingDay: 1
        };
    
    
        $scope.toggleMin = function () {
            //$scope.inlineOptions.minDate = new Date();
            var myDate = new Date();
            //add a day to the date
            myDate.setDate(myDate.getDate());
           // $scope.dateOptions.minDate = myDate;
        };
      
        $scope.toggleMin();
    
        $scope.popup1 = {
          opened: false
        };
        $scope.popup2 = {
            opened: false
        };
    
        $scope.realsearch_startdate = '';
        $scope.realsearch_enddate = '';
    
        $scope.selectdistributedat_start = function (dat) {
            var monthNames = [
                "January", "February", "March","April", "May", "June", "July","August", "September", "October","November", "December"
            ];
            
            var day = dat.getDate();
            var monthIndex = dat.getMonth();
            var year = dat.getFullYear();
    
            $scope.realsearch_startdate = day + ' ' + monthNames[monthIndex] + ' ' + year;
    
        }
        $scope.selectdistributedat_end = function (dat) {
            var monthNames = [
                "January", "February", "March","April", "May", "June", "July","August", "September", "October","November", "December"
            ];
            
            var day = dat.getDate();
            var monthIndex = dat.getMonth();
            var year = dat.getFullYear();
    
            $scope.realsearch_enddate = day + ' ' + monthNames[monthIndex] + ' ' + year;
    
        }
        
        
        var url = 'apiv4/public/researchidea/getirps';
        var params = { };
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.users = result.data;
        });
    
        $scope.get_search_details = function (type, searchkey, industype) {
            if (angular.isDefined(searchkey) && searchkey != '') {
                if (type != '') {
                    var tagUrl = 'apiv4/public/user/get_search_details1';
                    var searchterm = searchkey;
      
                    if (type == 'industry') {
                        var params = { term: searchterm, key: type, industype:industype };
                        RequestDetail.getDetail(tagUrl, params).then(function (result) {
                            if (angular.isDefined(result.data) && result.data.length > 0) {
                                $scope.availableIndustry = result.data;
                                if(industype=='sectors'){
                                    $scope.availableIndustry_sector = result.data;
                                }
                            } else {
                                $scope.availableIndustry = [];
                                if(industype=='sectors'){
                                    $scope.availableIndustry_sector = [];
                                }
                            }
                        });
                    }
      
                    if (type == 'ticker') {
                        var params = searchterm;
                        var tagUrl = 'apiv4/public/dashboard/get_auto_ticker_stock';
                        RequestDetail.getDetail(tagUrl, params).then(function (result) {
                            if (angular.isDefined(result.data) && result.data.length > 0) {
                                $scope.availableTickers = result.data;
                            } else {
                                $scope.availableTickers = [];
                            }
                        });
                    }
      
                }
            }
        }
    
        $scope.filter = {};
    
        $scope.getInvestorsEngaging = function () {
            $scope.spinnerActive = true;
    
            var url = 'apiv4/public/researchidea/getInvestorsEngaging';
            var params = { filter: $scope.filter };
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.distributes = [];
                if( result.data.analytics !== null && result.data.analytics !== ''){
                    $scope.distributes = result.data.analytics;
                }
                //console.log($scope.distributes);
                $scope.spinnerActive = false;
            });
    
            
        }
    
        $scope.poptimes = {};
        $scope.titletimes = '';
       
        
        $scope.timesclick = function (id) {
            
            $.each($scope.distributes, function (index, distri) {
                if(distri.id==id){
                    $scope.poptimes = distri.click_times;
                }
            });
    
            $scope.titletimes = 'Click Detail';
            $scope.showModalpagetimes = true;
        }
    
        $scope.closetimes = function () {
            $scope.showModalpagetimes = false;
        }
        
    
        //$scope.getalldistribute();
    
        $scope.cleardistribute = function () {
            $scope.search_text = "";
            $scope.search_region = "";
            $scope.search_user = "";
            $scope.realsearch_startdate = '';
    
            $scope.search_startdate = '';
            $scope.search_enddate = '';
    
            $scope.realsearch_enddate = '';
            $scope.distributes = [];
            $scope.regions = [];
            $scope.users = [];
           // $scope.getalldistribute();
        }
        
        
       
       
    
    }).controller('previewRContent', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails,$route,$sce) {
        $scope.configdetails = configdetails;
        $scope.openmodelpagehelp = function () {
            $scope.showModalpageinfo = !$scope.showModalpageinfo;
        }
        $scope.sidepopupactive = false;
    
        $scope.sidepopup = function () {
            $scope.sidepopupactive = !$scope.sidepopupactive;
        }
    
        $scope.distributeId = $routeParams.distributeId;
    
        
        $scope.trustAsHtml = function(html) {
            return $sce.trustAsHtml(html);
        }
    
        var tagUrl = 'apiv4/public/researchidea/getdistributepreview';
        var params = { distributeId: $scope.distributeId };
        RequestDetail.getDetail(tagUrl, params).then(function (result) {
            $scope.distributehtml = result.data;
        });
       
        $scope.mailid = 'dhamu@creativebees.in'
    
        $scope.senddistributemail = function(){
            var senddailymail = 'apiv4/public/researchidea/senddailymail';
            var params = {
                distributeId:$scope.distributeId,mailid:$scope.mailid
            };
            RequestDetail.getDetail(senddailymail,params).then(function(result){ // The fasctory RequestDetail reused in Investors and corporates
               // alertService.add("success", "Email sent sucessfully !",2000);
               
               $scope.success_message = 'Email sent sucessfully !';
               $timeout(function() {
                   $scope.success_message ='';
               }, 3000);
               
            });
       }
    
    
    })
    .controller('researchreadership', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails,$route,$window) {
    
        $scope.distribute_content_ideasId = $routeParams.distribute_id;
        
        $scope.spinnerActive = true;
    
        $scope.researchreaderships = [];
    
        $scope.openindex = 0;
    
        var url = 'apiv4/public/researchidea/getresearchreadership';
        var params = {distribute_id: $scope.distribute_content_ideasId};
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.researchreaderships = result.data.output;
            //console.log($scope.researchreaderships);
            $scope.spinnerActive = false;
        });
    
    
        $scope.readershipacc = function (index) {
            $scope.openindex = index;
        };
    
        
    
    
    }).controller('salesresearcharchive', function ($scope, $routeParams, $http, $location, RequestDetail, alertService, configdetails, localStorageService) {
        
        $scope.userId = $routeParams.userId;
    
        $scope.spinnerActive = true;
    
        var url = 'apiv4/public/researchidea/getresearcharchive';
        var params = {userId: $scope.userId};
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.archives = result.data;
            $scope.spinnerActive = false;
        });
    })
    
    .controller('researchidea_viewCtrl', function ($scope, $http, $location, $route, $routeParams, localStorageService, RequestDetail, $window, configdetails, alertService,$sce) {
        $scope.dailyhtml = "";
    
        $scope.trustAsHtml = function(html) {
          return $sce.trustAsHtml(html);
        }
        $scope.spinnerActive = true;
    
        var senddailymail = 'apiv4/public/researchidea/senddailyideamailcontent';
        var params = {
            distribute_content_ideasId:$routeParams.distribute_content_ideasId
        }
        RequestDetail.getDetail(senddailymail,params).then(function(result){ // The fasctory RequestDetail reused in Investors and corporates
            $scope.dailyhtml  = result.data.htmlview;
            $scope.spinnerActive = false;
        });
        
    
    })
    
    
    .controller('eventsarchive', function ($scope, $http, $location, $route, $routeParams, localStorageService, RequestDetail, $window, configdetails, alertService,$sce) {
        
        $scope.spinnerActive = true;
    
        $scope.getevent = function () {
            var url = 'apiv4/public/researchidea/geteventsarchive';
            var params = {};
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.archives = result.data;
                $scope.spinnerActive = false;
            });
        }
        $scope.getevent();
    
        $scope.deleteevent = function (event) {
            if (confirm("Are you sure?")) {
                var url = 'apiv4/public/researchidea/delecteevent';
                var params = {event:event}
                RequestDetail.getDetail(url, params).then(function (result) {
                    alertService.add("success", "Delected Successfully !", 2000);
                    $scope.getevent();
                });
            }
        };
    
    })
    
    .controller('viewresearchevent', function ($scope, $http, $location, $route, $routeParams, localStorageService, RequestDetail, $window, configdetails, alertService,$sce) {
        
        $scope.spinnerActive = true;
    
        $scope.getevent = function () {
            var url = 'apiv4/public/researchidea/vieweventsarchive';
            var params = {eventId: $routeParams.eventId};
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.events = result.data;
                $scope.spinnerActive = false;
            });
        }
        $scope.getevent();
    })
    .controller('createresearchevent', function ($scope, $http, $location, $route, $routeParams, localStorageService, RequestDetail, $window, configdetails, alertService,$sce) {
        $scope.dcdata = {};
        
        $scope.dcdata.registration_status = '0';
    
        $scope.upload_prf_img = function (imgdata) {
            $scope.$apply(function () {
                $scope.dcdata.logo = 'uploads/researchidea/' + imgdata;
            });
        }
    
        $scope.removelogo = function () {
            $scope.dcdata.logo = '';
        }
    
        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];
    
    
        $scope.dateOptions = {
            // dateDisabled: disabled,
            formatYear: 'yy',
           // maxDate: new Date().setDate(new Date().getDate() + 7),
          //  minDate: new Date(),
            startingDay: 1
          };
    
    
        $scope.toggleMin = function () {
            //$scope.inlineOptions.minDate = new Date();
            var myDate = new Date();
            //add a day to the date
            myDate.setDate(myDate.getDate());
           //$scope.dateOptions.minDate = myDate;
        };
      
        $scope.toggleMin();
    
        $scope.popup1 = {
          opened: false
        };
    
        $scope.stamptimes = [];
    
        $scope.dcdata.real_date = '';
        $scope.selectdistributedat = function (dat) {
            var monthNames = [
                "January", "February", "March",
                "April", "May", "June", "July",
                "August", "September", "October",
                "November", "December"
            ];
            
            var day = dat.getDate();
            var monthIndex = dat.getMonth();
            var year = dat.getFullYear();
    
            $scope.dcdata.real_date = day + ' ' + monthNames[monthIndex] + ' ' + year;
        }
    
        
    
        $scope.researchSubmit = function(){
            
    
            if(angular.isUndefined($scope.dcdata.title) || $scope.dcdata.title== ''){         
                alertService.add("warning", "Title Invalid !",2000);
                return false;
            } 
           
            $scope.spinnerActive = true;
            var url = 'apiv4/public/researchidea/createresearchevent';
            var params = {data:$scope.dcdata};
            RequestDetail.getDetail(url, params).then(function (result) {
                $location.path('eventsarchive');
                $scope.spinnerActive = false;
            });
        }
        
    
    })
    
    .controller('editresearchevent', function ($scope, $http, $location, $route, $routeParams, localStorageService, RequestDetail, $window, configdetails, alertService,$sce) {
    
        $scope.dcdata = {};
        
        $scope.upload_prf_img = function (imgdata) {
            $scope.$apply(function () {
                $scope.dcdata.logo = 'uploads/researchidea/' + imgdata;
            });
        }
    
        $scope.removelogo = function () {
            $scope.dcdata.logo = '';
        }
    
        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];
    
    
        $scope.dateOptions = {
            // dateDisabled: disabled,
            formatYear: 'yy',
           // maxDate: new Date().setDate(new Date().getDate() + 7),
          //  minDate: new Date(),
            startingDay: 1
          };
    
    
        $scope.toggleMin = function () {
            //$scope.inlineOptions.minDate = new Date();
            var myDate = new Date();
            //add a day to the date
            myDate.setDate(myDate.getDate());
           //$scope.dateOptions.minDate = myDate;
        };
      
        $scope.toggleMin();
    
        $scope.popup1 = {
          opened: false
        };
    
        $scope.stamptimes = [];
    
        $scope.dcdata.real_date = '';
        $scope.selectdistributedat = function (dat) {
            var monthNames = [
                "January", "February", "March",
                "April", "May", "June", "July",
                "August", "September", "October",
                "November", "December"
            ];
            
            var day = dat.getDate();
            var monthIndex = dat.getMonth();
            var year = dat.getFullYear();
    
            $scope.dcdata.real_date = day + ' ' + monthNames[monthIndex] + ' ' + year;
        }
    
        $scope.spinnerActive = true;
    
        
    
        var url = 'apiv4/public/researchidea/getresearchevent';
        var params = {eventId: $routeParams.eventId};
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.dcdata = result.data;
            $scope.dcdata.real_date = result.data.date;
    
            var ddd = result.data.date;
            var myDate = new Date(ddd);
            $scope.dcdata.date= myDate;
    
            $scope.spinnerActive = false;
        });
    
        $scope.researchSubmit = function(){
            
    
            if(angular.isUndefined($scope.dcdata.title) || $scope.dcdata.title== ''){         
                alertService.add("warning", "Title Invalid !",2000);
                return false;
            } 
            if(angular.isUndefined($scope.dcdata.what) || $scope.dcdata.what== ''){         
                alertService.add("warning", "What Invalid !",2000);
                return false;
            } 
            if(angular.isUndefined($scope.dcdata.when) || $scope.dcdata.when== ''){         
                alertService.add("warning", "When Invalid !",2000);
                return false;
            } 
            $scope.spinnerActive = true;
            var url = 'apiv4/public/researchidea/editresearchevent';
            var params = {data:$scope.dcdata};
            RequestDetail.getDetail(url, params).then(function (result) {
                $location.path('eventsarchive');
                $scope.spinnerActive = false;
            });
        }
        
    
    })

    .controller('holdersList', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails,$sce) {
        $scope.configdetails=configdetails;
        
        $scope.openmodelpagehelp = function() {
           $scope.showModalpageinfo=!$scope.showModalpageinfo;
        }
        
        $scope.tab =1;
        $scope.showFundName = true;
        $scope.showContactName = false;
       
        $scope.mastercontactstatus = false;
        
        // COLUMN TO SORT
        $scope.column = 'value_original/1';
    
        // SORT ORDERING (ASCENDING OR DESCENDING). SET TRUE FOR DESENDING
        $scope.reverse = true;
    
        // CALLED ON HEADER CLICK
        $scope.sortColumn = function (col) {
            $scope.column = col;
            if ($scope.reverse) {
                $scope.reverse = false;
                $scope.reverseclass = 'arrow-up';
            } else {
                $scope.reverse = true;
                $scope.reverseclass = 'arrow-down';
            }
        };
    
        $scope.sortClass = function (col) {
            if ($scope.column == col) {
                if ($scope.reverse) {
                    return 'arrow-down';
                } else {
                    return 'arrow-up';
                }
            } else {
                return '';
            }
        };
    
        // COLUMN TO SORT
        $scope.column_historic = 'q1_original/1';
    
        // SORT ORDERING (ASCENDING OR DESCENDING). SET TRUE FOR DESENDING
        $scope.reverse_historic = true;
    
        // CALLED ON HEADER CLICK
        $scope.sortColumnHistoric = function (col) {
            $scope.column_historic = col;
            if ($scope.reverse_historic) {
                $scope.reverse_historic = false;
                $scope.reverseclass = 'arrow-up';
            } else {
                $scope.reverse_historic = true;
                $scope.reverseclass = 'arrow-down';
            }
        };
    
        $scope.sortClassHistoric = function (col) {
            if ($scope.column_historic == col) {
                if ($scope.reverse_historic) {
                    return 'arrow-down';
                } else {
                    return 'arrow-up';
                }
            } else {
                return '';
            }
        };
    
        //COLOUR CODE CELL
        $scope.colorCodeHistoric = function (val1,val2) {
            if (val1 != val2) {
                if (val1 > val2) {
                    return 'actual_Increased';
                } else {
                    return 'actual_Decreased';
                }
            } else {
                return '';
            }
        };
    
        $scope.tabchange = function (tab) {
            $scope.tab =tab;
        }
     
        $scope.toggleFundDispaly = function () {
            if ($scope.showFundName) {
                $scope.showFundName = false;
                $scope.showContactName = true;
            }else{
                $scope.showFundName = true;
                $scope.showContactName = false;
            }
        }
    
        // DECLARE VARIABLES
        $scope.current_quarter = 0; // default for filter
        $scope.total_holders = 0;
    
        $scope.QuarterYears = [];
        $scope.holders = [];
        $scope.historicholders = [];
        $scope.copyholdersall = [];
    
        $scope.filter = {};
        $scope.filter.type = 'Ticker';
        $scope.filter.region = '';
    
        var localUserdata = localStorageService.get('userdata');
        $scope.filter.data = localUserdata.ticker;
        
        $scope.staticfilter = {};
        $scope.staticfilter.region = "";
        $scope.staticfilter.limit = '501'; 		
    
        $scope.staticfilterhist = {};
        $scope.staticfilterhist.region = "";
        $scope.staticfilterhist.limit = '501'; 		
        $scope.staticfilterhist.showPosition = true;
        $scope.staticfilterhist.showValue = false;
        $scope.staticfilterhist.pos_val = 'position';
    
        $scope.limitfilter1 = function(){
    
            $scope.mastercontactstatus=!$scope.mastercontactstatus;
    
            $scope.limitfilter();
        }
    
        $scope.limitfilter = function(){
    
            
            var allpredict =[];
    
            $scope.spinnerActive = true;
            
            $scope.holders = [];
            allpredict = $scope.copyholdersall;
    
    
            var predicts = [];
    
    
    
            if($scope.staticfilter['aum']){
                
                $scope.aum_array = [];
    
                angular.forEach($scope.staticfilter['aum'],function(col,index){
                    $scope.aum_array.push(col.id);
                });
    
                var predicts = [];
                angular.forEach(allpredict,function(col,index){
                    if($scope.aum_array.indexOf(col.aum_filter) != -1){
                        predicts.push(col);
                    }
                });
                allpredict = predicts;
            }
    
            if($scope.staticfilter['region']){
    
                $scope.region_array = [];
    
                angular.forEach($scope.staticfilter['region'],function(col,index){
                    $scope.region_array.push(col);
                });
    
                var predicts = [];
                angular.forEach(allpredict,function(col,index){
                    if($scope.region_array.indexOf(col.region_filter) != -1){
                        predicts.push(col);
                    }
                });
                allpredict = predicts;
            }
    
            if($scope.staticfilter['type']){
    
                $scope.type_array = [];
    
                angular.forEach($scope.staticfilter['type'],function(col,index){
                    $scope.type_array.push(col);
                });
    
                var predicts = [];
                angular.forEach(allpredict,function(col,index){
                    if($scope.type_array.indexOf(col.type) != -1){
                        predicts.push(col);
                    }
                });
                allpredict = predicts;
            }
    
            if($scope.staticfilter['style']){
                $scope.style_array = [];
    
                angular.forEach($scope.staticfilter['style'],function(col,index){
                    $scope.style_array.push(col);
                });
    
                var predicts = [];
                angular.forEach(allpredict,function(col,index){
                    if($scope.style_array.indexOf(col.style) != -1){
                        predicts.push(col);
                    }
                });
                allpredict = predicts;
            }
    
            if($scope.staticfilter['action']){
                $scope.action_array = [];
    
                angular.forEach($scope.staticfilter['action'],function(col,index){
                    $scope.action_array.push(col);
                });
    
                var predicts = [];
                angular.forEach(allpredict,function(col,index){
                    if($scope.action_array.indexOf(col.action_filter) != -1){
                        predicts.push(col);
                    }
                });
                allpredict = predicts;
            }
    
            if($scope.staticfilter['turnover']){
                $scope.turnover_array = [];
    
                angular.forEach($scope.staticfilter['turnover'],function(col,index){
                    $scope.turnover_array.push(col);
                });
    
                var predicts = [];
                angular.forEach(allpredict,function(col,index){
                    if($scope.turnover_array.indexOf(col.turnover) != -1){
                        predicts.push(col);
                    }
                });
                allpredict = predicts;
            }
            
            if($scope.mastercontactstatus){
                var predicts = [];
                angular.forEach(allpredict,function(col,index){
                    if(col.mastercontactstatus){
                        predicts.push(col);
                    }
                });
                allpredict = predicts;
            }
            $scope.holders = allpredict;
    
            $scope.spinnerActive = false;
    
        }
    
        $scope.limitfilter_historic = function(){
            var allpredict =[];
    
            $scope.spinnerActive = true;
            
            $scope.historicholders = [];
            allpredict = $scope.copyholdersall;
    
    
            var predicts = [];
    
            
    
            if($scope.staticfilterhist['aum']){
                
                $scope.aum_array = [];
    
                angular.forEach($scope.staticfilterhist['aum'],function(col,index){
                    $scope.aum_array.push(col.id);
                });
    
                var predicts = [];
                angular.forEach(allpredict,function(col,index){
                    if($scope.aum_array.indexOf(col.aum_filter) != -1){
                        predicts.push(col);
                    }
                });
                allpredict = predicts;
            }
    
            if($scope.staticfilterhist['region']){
    
                $scope.region_array = [];
    
                angular.forEach($scope.staticfilterhist['region'],function(col,index){
                    $scope.region_array.push(col);
                });
    
                var predicts = [];
                angular.forEach(allpredict,function(col,index){
                    if($scope.region_array.indexOf(col.region_filter) != -1){
                        predicts.push(col);
                    }
                });
                allpredict = predicts;
            }
    
            if($scope.staticfilterhist['type']){
    
                $scope.type_array = [];
    
                angular.forEach($scope.staticfilterhist['type'],function(col,index){
                    $scope.type_array.push(col);
                });
    
                var predicts = [];
                angular.forEach(allpredict,function(col,index){
                    if($scope.type_array.indexOf(col.type) != -1){
                        predicts.push(col);
                    }
                });
                allpredict = predicts;
            }
    
            if($scope.staticfilterhist['style']){
                $scope.style_array = [];
    
                angular.forEach($scope.staticfilterhist['style'],function(col,index){
                    $scope.style_array.push(col);
                });
    
                var predicts = [];
                angular.forEach(allpredict,function(col,index){
                    if($scope.style_array.indexOf(col.style) != -1){
                        predicts.push(col);
                    }
                });
                allpredict = predicts;
            }
    
            if($scope.staticfilterhist['action']){
                $scope.action_array = [];
    
                angular.forEach($scope.staticfilterhist['action'],function(col,index){
                    $scope.action_array.push(col);
                });
    
                var predicts = [];
                angular.forEach(allpredict,function(col,index){
                    if($scope.action_array.indexOf(col.action_filter) != -1){
                        predicts.push(col);
                    }
                });
                allpredict = predicts;
            }
    
            if($scope.staticfilterhist['turnover']){
                $scope.turnover_array = [];
    
                angular.forEach($scope.staticfilterhist['turnover'],function(col,index){
                    $scope.turnover_array.push(col);
                });
    
                var predicts = [];
                angular.forEach(allpredict,function(col,index){
                    if($scope.turnover_array.indexOf(col.turnover) != -1){
                        predicts.push(col);
                    }
                });
                allpredict = predicts;
            }
            
            $scope.historicholders = allpredict;
    
            $scope.spinnerActive = false;
    
        }
    
        
    
        ////console.log($scope.availableaums);
        /*$scope.availableaums= [
            {
                id: '1',
                lable: '< $500 M'
            },
            {
                id: '2',
                lable: '< $500 M'
            }
        ];*/
    
        $scope.availableaums = [
            {
                id: '1',
                lable: '< $500 M'
            },{
                id: '2',
                lable: '> $500 M - 2 B'
            },{
                id: '3',
                lable: '> $2 B - 10 B'
            },{
                id: '4',
                lable: '> $10 B'
            }
        ];
    
    
        $scope.availableregions = ['California','Chicago Area','Mid-Atlantic','Mid-West','Mountain','New England','NY/CT/NJ','South','Texas','West','Canada','Europe','Other'];
        
        $scope.availabletypes = ['Bank Investment Division','Broker/ Research Firm','Family Office','Foundation/Endowment Manager','Fund of Funds Managers','Hedge Fund Manager','Insurance Company','Investment Adviser','Mutual Fund Manager','Pension Fund Manager','Private Banking/Wealth Mgmt','Real Estate Manager','Sovereign Wealth Manager'];
    
        $scope.styles = ['Aggressive Growth','Growth','GARP','Passive / Index','Value','Deep Value','Income','Other'];
        
        $scope.action = ['NewBuyers','Increased','Decreased','Hold'];
    
        $scope.turnover = ['Very Low','Low','Medium','High','Very High'];
    
    
        $scope.get_search_details = function (type, searchkey) {
            
        }
    
        // CLEAR CURRENT FILTER
        $scope.clear_filter = function(){
            $scope.staticfilter.limit = '501'; 		
            $scope.staticfilter.aum = [];
            $scope.staticfilter.region = [];
            $scope.staticfilter.type = [];
            $scope.staticfilter.style = [];
            $scope.staticfilter.action = [];
            $scope.staticfilter.turnover = [];
            $scope.holders = [];
            $scope.holders = $scope.copyholdersall;
        }
    
        // CLEAR HISTORIC FILTER
        $scope.clear_filter_history = function(){
            $scope.staticfilterhist.limit = '501'; 		
            $scope.staticfilterhist.aum = [];
            $scope.staticfilterhist.region = [];
            $scope.staticfilterhist.type = [];
            $scope.staticfilterhist.style = [];
            $scope.staticfilterhist.turnover = [];
            $scope.historicholders = [];
            $scope.historicholders = $scope.copyholdersall;
        }
    
        // SHOW POSITION OR VALUE
        $scope.show_pos_val_historic = function(){
            if($scope.staticfilterhist.pos_val=='position'){
                $scope.staticfilterhist.showPosition = true;
                $scope.staticfilterhist.showValue = false;
            }else{
                $scope.staticfilterhist.showPosition = false;
                $scope.staticfilterhist.showValue = true;
            } 		
        }
    
        // DEFINE PREDICTION CALL
        $scope.getHolders = function (qdata,count) {
    
            if($scope.filter.data){
                    $scope.filter.count = count;
            
                    if(count==1){
                        $scope.spinnerActive = true;
                    }
                    
                    var url = 'apiv4/public/dashboard/getHolders';
                    var params = { filter: $scope.filter,count:count,qdata:qdata };
                    $scope.current_request = RequestDetail.getDetail(url, params).then(function (result) {
                        
                        if (angular.isDefined(result.data) && result.data.length > 0) {
                            if(($scope.filter.data).toUpperCase()==(result.data.Ticker).toUpperCase()){
                            
                                // //console.log(result.data.QuarterYears)
        
                                if(!qdata){
                                    $scope.staticfilter.quat= '0';
                                    $scope.staticfilterhist.quat= '0';
                                }
                                
                                if(result.data.count==1){
                                    $scope.holders = [];
                                    $scope.historicholders = [];
                                    $scope.copyholdersall = [];
        
                                    $scope.QuarterYears = result.data.QuarterYears;
                                    $scope.holders = result.data.holders;
                                    $scope.historicholders = result.data.holders;
                                    $scope.copyholdersall = result.data.holders;
        
                                    
                                    
        
                                    $scope.total_holders = +result.data.total_holders+1;
                                    
                                }else{
                                    angular.forEach(result.data.holders,function(col,index){
                                        $scope.holders.push(col);
                                    });
                                    
                                    //RESET MASTER ARRAY
                                    $scope.copyholdersall = $scope.holders;
                                    $scope.historicholders = $scope.holders;
        
                                }
                                
                                if(+result.data.count!=+$scope.total_holders){
                                    $scope.getHolders(qdata,+result.data.count+1);
                                }
        
                            }
                        }
                        
    
                        $scope.spinnerActive = false;
    
    
                    });
            }
    
            
        }
    
        $scope.getHolders(0,1);
    
     
    })

