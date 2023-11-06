'use strict';

angular.module('myApp.profileCtrl', ['ui.bootstrap'])
    .controller('profileCtrl', function ($scope, $http, $location, usertype, localStorageService, RequestDetail, configdetails, $route, $sce) {
        $scope.configdetails = configdetails;
        var localUserdata = localStorageService.get('userdata');
        $scope.spinnerActive = true;
        $scope.profileData = {};
        $scope.profileData.IndustryTags = {};
        $scope.profileData.IndustryTagsLength = 0;
        $scope.profileMessages = {};
        $scope.postmsg = {};
        $scope.searchcontact = '';

        $scope.showvideopopupModal = false;
        $scope.togglevideopopupModal = function () {
            //  ******************** To avoid the api calling second time in same page Store in the variable and fetched the data ising $index value
            //$scope.values = $scope.FetchedData.items[index];
            // Assign the values to the variables

            $scope.showvideopopupModal = !$scope.showvideopopupModal;

        };


        if (localStorageService.get('usertype') == 'investor') {
            $scope.pageHeading = 'Profile';
            $scope.profileActive = 'inner-active';
        } else if (localStorageService.get('usertype') == 'corporate') {
            $scope.pageHeading = 'Profile';
            $scope.profileActive = 'inner-active';
        }
        else {
            $scope.pageHeading = 'Broker Profile';
            $scope.profileActive = 'inner-active';
        }
        // Getting profile details from LocalStorage
        // Column Left data




        $scope.profileData.videourl = undefined;

        $scope.profileData.profilename = localUserdata.firstname + ' ' + localUserdata.lastname;
        $scope.profileData.address = localUserdata.r_address_1;


        $scope.profileData.videourl = localUserdata.videourl;
        $scope.profileData.p_description = localUserdata.p_description;
        $scope.profileData.c_description = localUserdata.c_description;
        $scope.user_details = {};
        $scope.presentaion_file = {};


        if ($scope.profileData.videourl != "" && $scope.profileData.videourl != null) {
            $scope.showvideo = true;
        }
        else {
            $scope.showvideo = false;
        }


        $scope.trustSrc = function () {
            return $sce.trustAsResourceUrl($scope.profileData.videourl);
        }


        $scope.get_prof = function () {

           
            var params = [];
            var url = "apiv4/public/user/get_user_profile";
            RequestDetail.getDetail(url, params).then(function (result) {

                $scope.spinnerActive = false;

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
                        if (angular.isDefined(result.data.presentation_research) && angular.isDefined(result.data.presentation_research.file_location) && result.data.presentation_research.file_location != '') {
                            $scope.presentaion_file = result.data.presentation_research;
                        }
                    }
                    if (angular.isDefined(result.data.user_contacts)) {
                        $scope.profileData.contacts = result.data.user_contacts;
                    }
                    if (angular.isDefined(result.data.user_colleagues)) {
                        $scope.profileData.colleagues = result.data.user_colleagues;
                    }

                    $scope.profileData.presentation_filings = [];
                    if (angular.isDefined(result.data) && angular.isDefined(result.data.research_detail) && result.data.research_detail.length > 0) {
                        angular.forEach(result.data.research_detail, function (data, ind) {
                            $scope.profileData.presentation_filings.push(data);
                        });
                    }

                }

                
            });

        }



        $scope.get_prof();


        $scope.coveragelist = [];
        var url = "apiv4/public/user/listtocoveragelist";
        var params = {};
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.coveragelist = result.data;
        });

        var url = "apiv4/public/user/get_user_providerprofile";
        var params = {};
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.old_samples = result.data.old_samples;

        });

        var url = "apiv4/public/user/listtocoveragelistmarketfile";
        var params = {};
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.old_marketingFile = result.data;
        });


        $scope.getMessageslist = function () {
            // Fetching Messages
            var getMessages = 'apiv4/public/user/getMessages';
            var params = {
                key: ''
            }
            RequestDetail.getDetail(getMessages, params).then(function (result) {
                $scope.profileData.profileMessages = result.data;
            });
        }
        $scope.getMessageslist();
        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };
        $scope.peer_review = function () {
            $location.path('/peer_review/')
        }
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
        $scope.newMeeting = function () {
            $location.path('meeting/new/');
        }
        $scope.newEvent = function () {
            $location.path('event/new');
        }
        $scope.postMeeting = function () {
            var profile_contacts = 'apiv4/public/user/postmeetingadd';
            var params = {
                data: $scope.postmsg
            }
            RequestDetail.getDetail(profile_contacts, params).then(function (result) {
                if (result.data == '0') {
                    $scope.getMessageslist();
                    $scope.formpostcancel();
                }
            });
        }
        $scope.openpostmsg = function () {
            $scope.addpostmessageModel = !$scope.addpostmessageModel;
        }
        $scope.formpostcancel = function () {
            $scope.addpostmessageModel = !$scope.addpostmessageModel;
        }
        $scope.peerView = function () {
            $location.path('meetingPreparation/company');
        }
        

        $scope.requestMail = function (subject) {
            if (angular.isDefined($scope.profileData.user_id) && $scope.profileData.user_id != '' && angular.isDefined($scope.profileData.email)
                && $scope.profileData.email != '') {
                var name = '';
                if (angular.isDefined($scope.profileData.firstname) && $scope.profileData.firstname != '' && $scope.profileData.firstname != null) {
                    name = name + $scope.profileData.firstname;
                } else {
                    return false;
                }
                if (angular.isDefined($scope.profileData.lastname && $scope.profileData.lastname != '' && $scope.profileData.lastname != null)) {
                    name = name + ' ' + $scope.profileData.lastname;
                }
                $scope.spinnerActive = true;
                var profile_contacts = 'apiv4/public/email/sendrequest';
                var ob = new Object();
                ob.frombroker = name;
                ob.sub = subject;
                ob.type = 'Event Request';
                ob.from = $scope.profileData.email;
                var params = {
                    frombroker: name,
                    sub: subject,
                    type: 'Event Request',
                    user_detail: $scope.user_details
                }
                RequestDetail.getDetail(profile_contacts, params).then(function (result) {
                    if (angular.isDefined(result.data) && result.data == 'success') {

                    };
                    $scope.spinnerActive = false;
                });
            }
        }

        $scope.fairList = [];

        var userdata = localStorageService.get('userdata');

        $scope.profile_id = userdata.userId;

        // Fetching FAIR
        var getFair = 'apiv4/public/fair/getCorporatefair';
        var params = { user_id: $scope.profile_id }
        RequestDetail.getDetail(getFair, params).then(function (result) {
            $scope.fairList = result.data;
        });

        $scope.askquestionstate = 1;

        if (usertype.getService() == 'corporate') {
            $scope.askquestionstate = 0;
        }

        $scope.showModal = false;
        $scope.toggleModal = function (contact) {

            $scope.contactEdit = contact;
            $scope.showModal = !$scope.showModal;

        };
    })


    .controller('cmyprofileCtrl', function ($scope, $http, $location, usertype, localStorageService, RequestDetail, configdetails, $route, $sce, $rootScope, alertService) {
        $scope.configdetails = configdetails;
        var localUserdata = localStorageService.get('userdata');
        $scope.spinnerActive = true;


        $scope.adminuser = true;
        if (localStorageService.get('admincontroluser') == 0) {
            $scope.adminuser = false;
        }
        $scope.profile = {};
        $scope.profileData = {};
        $scope.profileData.IndustryTags = {};
        $scope.profileData.IndustryTagsLength = 0;
        $scope.profileMessages = {};
        $scope.postmsg = {};
        $scope.searchcontact = '';

        $scope.research_provider_status = localStorageService.get('research_provider_status');

        $scope.showvideopopupModal = false;
        $scope.togglevideopopupModal = function () {
            //  ******************** To avoid the api calling second time in same page Store in the variable and fetched the data ising $index value
           
            // Assign the values to the variables

            $scope.showvideopopupModal = !$scope.showvideopopupModal;

        };
		
		$scope.closevideos = function () {
            $scope.showvideopopupModal = !$scope.showvideopopupModal;
        };
        $scope.checkemailval = function (email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }

        $scope.showModalpageinfo = false;

        $scope.openmodelpagehelp = function () {
            $scope.showModalpageinfo = !$scope.showModalpageinfo;
        }

        if (localStorageService.get('usertype') == 'investor') {
            $scope.pageHeading = 'Investor Profile';
            $scope.cmyprofileActive = 'inner-active';
        } else if (localStorageService.get('usertype') == 'corporate') {
            $scope.pageHeading = 'Corporate Profile';
            $scope.cmyprofileActive = 'inner-active';
        }
        else {
            $scope.pageHeading = 'Broker Profile';
            $scope.cmyprofileActive = 'inner-active';
        }
        // Getting profile details from LocalStorage
        // Column Left data

        $scope.profileData.profilename = localUserdata.firstname + ' ' + localUserdata.lastname;
        $scope.profileData.address = localUserdata.r_address_1;


        $scope.profileData.p_description = localUserdata.p_description;
        $scope.profileData.c_description = localUserdata.c_description;
        $scope.user_details = {};
        $scope.presentaion_file = {};
        $scope.research_file = {};
        $scope.fact_sheet_file = {};
        $scope.showvideo = false;


        $scope.tab = 1;
        
        $scope.tabchange = function (act) {
            $scope.tab = act;
        }

        var localUserdata = localStorageService.get('userdata');
        $scope.user_id = localUserdata.user_id;
        $scope.ticker = localUserdata.ticker;
        
        $scope.tab_news = 1;
        
        $scope.tabnewschange = function (act) {
            $scope.tab_news = act;
        }

        $scope.profiletabde = 2;
        $scope.profiletabdes = function (act) {
            $scope.profiletabde = act;
        }

        var profile_model = 'apiv4/public/user/getcorporate_model';
        var params = {}
        RequestDetail.getDetail(profile_model, params).then(function (result) {
            if (angular.isDefined(result.data.file_location) && result.data.file_location != ''
                && angular.isDefined(result.data.file_name) && result.data.file_name != '') {
                $scope.modelpresentaion_file = result.data;
            }
        });
        
        $scope.getresearchs = function () {
            var url = 'apiv4/public/dashboard/getprofileresearch';
            var params = {}
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.researchs = result.data;
            });
        }
        $scope.researchs = [];
        $scope.getresearchs();

        $scope.filings = [];
        var url = 'apiv4/public/dashboard/getprofilefilings';
        var params = {}
        RequestDetail.getDetail(url, params).then(function (result) {
           $scope.filings = result.data;
        });

        $scope.newss = [];
        var url = 'apiv4/public/dashboard/getprofilenewss';
        var params = {}
        RequestDetail.getDetail(url, params).then(function (result) {
           $scope.newss = result.data;
        });

        $scope.tradingdata = [];
        var url = 'apiv4/public/dashboard/gettradingdata';
        var params = {}
        RequestDetail.getDetail(url, params).then(function (result) {
           $scope.tradingdata = result.data;
        });

        $scope.getmarketfiles = function () {
            var url = "apiv4/public/user/listtocoveragelistmarketfile";
            var params = {};
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.old_marketingFile = result.data;
            });
        }
        $scope.getmarketfiles();

        $scope.getsamplefiles = function () {
            var url = "apiv4/public/user/get_user_providerprofile";
            var params = {};
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.rpprofile = result.data;
                $scope.old_samples = result.data.old_samples;
            });
        }
        $scope.getsamplefiles();
       

        //Broker Marketing Deck
        $scope.marketingFile = [];
        $scope.removeFiles = function (index) {
            $scope.marketingFile.splice(index, 1);
        }
        $scope.removeMarketingFiles = function (index,id) {
            if (confirm("Are you sure to delete marketing deck file?")) {
                var url = "apiv4/public/user/deletemarketingdesk";
                var params = {
                    id: id
                };
                RequestDetail.getDetail(url, params).then(function (result) {
                    alertService.add("success", "Deleted Successfully !", 2000);
                
                    $scope.old_marketingFile.splice(index, 1);
                    $scope.getmarketfiles();
                });
            }
        }
        // Upload Files
        $scope.uploadmarketingFile = function (imgdata) {
            imgdata = JSON.parse(imgdata);

            $scope.$apply(function () {
                $scope.marketingFile.push({
                    file_name: imgdata.name,
                    file_location: 'uploads/analystfile/' + imgdata.uploadedname
                })
            });
        }
        //Broker Marketing Deck

        
        $scope.openmarketingpop = function () {
            $scope.showModalmarketdesk = true;
        }
        $scope.closemarketdesk_popup = function () {
            $scope.showModalmarketdesk = false;
        }

        
        $scope.submitmarketingdesk = function () {
            if (angular.isUndefined($scope.marketingFile) || $scope.marketingFile.length == '0') {
                alertService.add("warning", "Please upload at least one file!", 2000);
                return false;
            }
            var url = "apiv4/public/user/submitmarketingdesk";
            var params = {
                marketingFile: $scope.marketingFile
            };
            RequestDetail.getDetail(url, params).then(function (result) {
                alertService.add("success", "Updated Successfully !", 2000);
                $scope.marketingFile = [];
                $scope.showModalmarketdesk = false;
                $scope.getmarketfiles();
            });
        }
        

        $scope.opensamplepop = function () {
            $scope.showModalresearchsam = true;
        }
        $scope.closesamplepop = function () {
            $scope.showModalresearchsam = false;
        }

        $scope.rpsampleFile = [];
        $scope.removeRpsampleFiles = function (index) {
            $scope.rpsampleFile.splice(index, 1);
        }
        $scope.removesampleFiles = function (index,id) { 
            if (confirm("Are you sure to delete sample file?")) {
                var url = "apiv4/public/user/deletesamplefile";
                var params = {
                    id: id
                };
                RequestDetail.getDetail(url, params).then(function (result) {
                    alertService.add("success", "Deleted Successfully !", 2000);
                
                    $scope.old_samples.splice(index, 1);
                    $scope.getsamplefiles();
                });
            }
        }
        $scope.uploadRpsamplefile = function (imgdata) {
            imgdata = JSON.parse(imgdata);

            $scope.$apply(function () {
                $scope.rpsampleFile.push({
                    file_name: imgdata.name,
                    file_location: 'uploads/analystfile/' + imgdata.uploadedname
                })
            });
        }
        $scope.submitrpsamplefile = function () {
            if (angular.isUndefined($scope.rpsampleFile) || $scope.rpsampleFile.length == '0') {
                alertService.add("warning", "Please upload at least one file!", 2000);
                return false;
            }
            var url = "apiv4/public/user/submitsamplefile";
            var params = {
                rpsampleFile: $scope.rpsampleFile
            };
            RequestDetail.getDetail(url, params).then(function (result) {
                alertService.add("success", "Updated Successfully !", 2000);
                $scope.rpsampleFile = [];
                $scope.showModalresearchsam = false;
                $scope.getsamplefiles();
            });
        }
        $scope.removeRpsamplefile = function (index,id) {
            if (confirm("Are you sure to delete sample file?")) {
                var url = "apiv4/public/user/deletesamplefile";
                var params = {
                    id: id
                };
                RequestDetail.getDetail(url, params).then(function (result) {
                    alertService.add("success", "Deleted Successfully !", 2000);
                
                    $scope.old_samples.splice(index, 1);
                    $scope.getsamplefiles();
                });
            }
        }

        
        
        
        $scope.delectedistribute = function (distribute_content_id) {
            if (confirm("Are you sure?")) {
                var url = 'apiv4/public/researchprovider/delectedistribute';
                var params = {distribute_content_id:distribute_content_id}
                RequestDetail.getDetail(url, params).then(function (result) {
                    alertService.add("success", "Delected Successfully !", 2000);
                    $scope.getresearchs();
                });
            }
        }


        $scope.getpresentationmodel = function () {
            $scope.spinnerActive = true;
            var profile_model = 'apiv4/public/user/getpresentationfiles';
            var params = {}
            RequestDetail.getDetail(profile_model, params).then(function (result) {
                $scope.presentationfiles = result.data;
                $scope.spinnerActive = false;
            });
        }

        $scope.getpresentationmodel();

        $scope.presentaion_file_new = 1;

        $scope.researchpresentation = {};

        $scope.addpresentationmodel = function () {
            $scope.showModalpresentation = true;
        }

        $scope.editpresentationfile = function (presentationfile) {
            $scope.showModalpresentation = true;
            $scope.presentaion_file_new = 0;
            $scope.researchpresentation = presentationfile;
            

            //$scope.researchpresentation.send_date = presentationfile.date;

            $scope.researchpresentation.realsend_date = presentationfile.date;

            $scope.researchpresentation.old_file_location = presentationfile.filepath;
            $scope.researchpresentation.old_file_name = presentationfile.filename;
        }

        

        $scope.closepresentation_popup = function () {
            $scope.showModalpresentation = false;
        }

        $scope.presentation_file_upload = function (data) {
            $scope.$apply(function () {
                $scope.researchpresentation.file_location = data.file_location;
                $scope.researchpresentation.file_name = data.file_name;
            });
        }
        

        $scope.removeResearchpresentfile= function () {
            $scope.researchpresentation.file_location = '';
            $scope.researchpresentation.file_name = '';

            $scope.researchpresentation.old_file_location = '';
            $scope.researchpresentation.old_file_name = '';
        }

        $scope.addProfilepresentation= function () {
            if (angular.isUndefined($scope.researchpresentation.title) || $scope.researchpresentation.title == '') {
                alertService.add("warning", "Please enter title !", 2000);
                return false;
            }
            if (angular.isUndefined($scope.researchpresentation.realsend_date) || $scope.researchpresentation.realsend_date == '') {
                alertService.add("warning", "Please enter Date !", 2000);
                return false;
            }
            if (angular.isUndefined($scope.researchpresentation.file_location) || $scope.researchpresentation.file_location == '') {
                alertService.add("warning", "Please add file !", 2000);
                return false;
            }
            
            var profile_file = 'apiv4/public/user/addProfilepresentation';
            var params = {
                data: $scope.researchpresentation
            }
            RequestDetail.getDetail(profile_file, params).then(function (result) {
                $scope.researchpresentation = {};
                $scope.showModalpresentation = false;
                alertService.add("success", "Added Successfully !", 2000);
                $scope.getpresentationmodel();
            });
        }
        

        $scope.updateProfilepresentation= function () {
            if (angular.isUndefined($scope.researchpresentation.title) || $scope.researchpresentation.title == '') {
                alertService.add("warning", "Please enter title !", 2000);
                return false;
            }
            if (angular.isUndefined($scope.researchpresentation.realsend_date) || $scope.researchpresentation.realsend_date == '') {
                alertService.add("warning", "Please enter Date !", 2000);
                return false;
            }


            if ($scope.researchpresentation.old_file_location == '') {

                if (angular.isUndefined($scope.researchpresentation.file_location) || $scope.researchpresentation.file_location == '') {
                    alertService.add("warning", "Please add file !", 2000);
                    return false;
                }
            }
            
            var profile_file = 'apiv4/public/user/editProfilepresentation';
            var params = {
                data: $scope.researchpresentation
            }
            RequestDetail.getDetail(profile_file, params).then(function (result) {
                $scope.researchpresentation = {};
                $scope.showModalpresentation = false;
                alertService.add("success", "Updated Successfully !", 2000);
                $scope.getpresentationmodel();
            });
        }


        $scope.deletepresentationfile= function (researchpresentation) {
            
            var profile_file = 'apiv4/public/user/deleteProfilepresentation';
            var params = {
                data: researchpresentation
            }
            RequestDetail.getDetail(profile_file, params).then(function (result) {
                $scope.researchpresentation = {};
                alertService.add("success", "Updated Successfully !", 2000);
                $scope.getpresentationmodel();
            });
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

        $scope.stamptimes = [];

        $scope.researchpresentation.realsend_date = '';
        $scope.selectdistributedat = function (dat) {
            if(dat){
                var monthNames = [
                    "January", "February", "March",
                    "April", "May", "June", "July",
                    "August", "September", "October",
                    "November", "December"
                ];
                
                var day = dat.getDate();
                var monthIndex = dat.getMonth();
                var year = dat.getFullYear();
    
                $scope.researchpresentation.realsend_date = day + ' ' + monthNames[monthIndex] + ' ' + year;
            }
        }
        

        $scope.get_prof = function () {

            // Fetching Event lists
           
            var params = [];
            var url = "apiv4/public/user/get_user_profile";
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
                        if (angular.isDefined(result.data.research_file)) {
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
                        $scope.profileData.colleagues = result.data.user_colleagues;
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

                }

                $scope.spinnerActive = false;
            });

        }

        $scope.trustAsHtml = function(html) {
            return $sce.trustAsHtml(html);
        }


        $scope.removePresenterdetails = function (data) {
            if (angular.isDefined(data)) {
                var index = $scope.presentationResearchfiles.presenter_details.indexOf(data);
                if (index >= 0) {
                    $scope.presentationResearchfiles.presenter_details.splice(index, 1);
                }
            }
        }

        $scope.uploadFile = function (imgdata) {
            $scope.contactEdit.image = 'uploads/profile/thumbnail/'+imgdata;
        }

        $scope.get_prof();

        $scope.coveragelist = [];
        var url = "apiv4/public/user/listtocoveragelist";
        var params = {};
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.coveragelist = result.data;
        });

        /*var url = "apiv4/public/user/get_user_providerprofile";
        var params = {};
        RequestDetail.getDetail(url, params).then(function (result) {
            ////console.log(result.data);
            $scope.rpprofile = result.data;
            $scope.old_samples = result.data.old_samples;

        });

        var url = "apiv4/public/user/listtocoveragelistmarketfile";
        var params = {};
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.old_marketingFile = result.data;
        });*/
        $scope.peer_review = function () {
            $location.path('/peer_review/')
        }

        $scope.newMeeting = function () {
            $location.path('meeting/new/');
        }
        $scope.newEvent = function () {
            $location.path('event/new');
        }
        $scope.postMeeting = function () {
            var profile_contacts = 'apiv4/public/user/postmeetingadd';
            var params = {
                data: $scope.postmsg
            }
            RequestDetail.getDetail(profile_contacts, params).then(function (result) {
                if (result.data == '0') {
                    $scope.getMessageslist();
                    $scope.formpostcancel();
                }
            });
        }
        $scope.openpostmsg = function () {
            $scope.addpostmessageModel = !$scope.addpostmessageModel;
        }
        $scope.formpostcancel = function () {
            $scope.addpostmessageModel = !$scope.addpostmessageModel;
        }
        $scope.peerView = function () {
            $location.path('meetingPreparation/company');
        }



        $scope.requestMail = function (subject) {
            if (angular.isDefined($scope.profileData.user_id) && $scope.profileData.user_id != '' && angular.isDefined($scope.profileData.email)
                && $scope.profileData.email != '') {
                var name = '';
                if (angular.isDefined($scope.profileData.firstname) && $scope.profileData.firstname != '' && $scope.profileData.firstname != null) {
                    name = name + $scope.profileData.firstname;
                } else {
                    return false;
                }
                if (angular.isDefined($scope.profileData.lastname && $scope.profileData.lastname != '' && $scope.profileData.lastname != null)) {
                    name = name + ' ' + $scope.profileData.lastname;
                }
                $scope.spinnerActive = true;
                var profile_contacts = 'apiv4/public/email/sendrequest';
                var ob = new Object();
                ob.frombroker = name;
                ob.sub = subject;
                ob.type = 'Event Request';
                ob.from = $scope.profileData.email;
                var params = {
                    frombroker: name,
                    sub: subject,
                    type: 'Event Request',
                    user_detail: $scope.user_details
                }
                RequestDetail.getDetail(profile_contacts, params).then(function (result) {
                    if (angular.isDefined(result.data) && result.data == 'success') {

                    };
                    $scope.spinnerActive = false;
                });
            }
        }

        $scope.showfilesharing = function () {
            $scope.presentationResearchfiles = {};
            $scope.presentationResearchfiles.presentation_files = [];
            $scope.presentationResearchfiles.presenter_details = [];
            $scope.fileSharing = !$scope.fileSharing;
        }

        $scope.saveResearchfillings = function () {
            if (angular.isUndefined($scope.presentationResearchfiles.presentation_title) || $scope.presentationResearchfiles.presentation_title == '') {
                $('#presentation_title').attr('required', true);
                $('#presentation_title').focus();
                alertService.add("warning", "Please enter presentation title !", 2000);
                return false;
            }
            if (angular.isUndefined($scope.presentationResearchfiles) || angular.isUndefined($scope.presentationResearchfiles.user_id)) {
                alertService.add("warning", "Please choose file !", 2000);
                return false;
            }
            var update_url = "apiv4/public/user/updateResearchfilings";
            var params = {
                type: 'edit',
                data: $scope.presentationResearchfiles
            };

            RequestDetail.getDetail(update_url, params).then(function (result) {
                if (angular.isDefined(result.data) && angular.isDefined(result.data.id) && result.data != 'failure') {
                    if (angular.isUndefined($scope.profileData.presentation_filings)) {
                        $scope.profileData.presentation_filings = [];
                    }
                    $scope.profileData.presentation_filings.push(angular.copy(result.data));
                    $scope.fileSharing = false;
                    alertService.add("success", "Profile Updated Successfully !", 2000);

                } else {
                    alertService.add("warning", "Contact cannot edit at this time", 2000);
                }
            });
        }

        $scope.removeResearchfiles = function () {
            
            if (angular.isDefined($scope.presentationResearchfiles.file_location) && angular.isDefined($scope.presentationResearchfiles.file_name) &&
                $scope.presentationResearchfiles.file_location != '' && $scope.presentationResearchfiles.file_name != '') {
                var data = new Object();
                data.file_location = $scope.presentationResearchfiles.file_location;
                data.file_name = $scope.presentationResearchfiles.file_name;
                var url = 'apiv4/public/user/deleteresearchfile';
                // RequestDetail.getDetail(url,data).then(function(result) {
                $scope.presentationResearchfiles.file_location = ''
                $scope.presentationResearchfiles.file_name = ''
                if (angular.isDefined($scope.presentationResearchfiles.filing_id)) {
                    $scope.presentationResearchfiles.filing_id = '';
                }
                
            }

           
        }

        $scope.dtpopup = {};
        $scope.dtpopup.opened = false;
        $scope.opendt = function () {
            $scope.dtpopup.opened = true;
        }

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

        $scope.fairList = [];

        var userdata = localStorageService.get('userdata');

        $scope.profile_id = userdata.userId;

        // Fetching FAIR
        var getFair = 'apiv4/public/fair/getCorporatefair';
        var params = { user_id: $scope.profile_id }
        RequestDetail.getDetail(getFair, params).then(function (result) {
            $scope.fairList = result.data;
        });

        $scope.askquestionstate = 1;

        if (usertype.getService() == 'corporate') {
            $scope.askquestionstate = 0;
        }

        $scope.updateProfile = function () {


            if (angular.isUndefined($scope.contactEdit.firstname) || $scope.contactEdit.firstname == '') {
                $('#c_firstname').attr('required', true);
                $('#c_firstname').focus();
                alertService.add("warning", "Please enter First Name !", 2000);
                return false;
            }
            else if (angular.isUndefined($scope.contactEdit.lastname) || $scope.contactEdit.lastname == '') {
                $('#c_lastname').attr('required', true);
                $('#c_lastname').focus();
                alertService.add("warning", "Please enter Last Name !", 2000);
                return false;
            } else if (angular.isUndefined($scope.contactEdit.job_title) || $scope.contactEdit.job_title == '') {
                $('#c_title').attr('required', true);
                $('#c_title').focus();
                alertService.add("warning", "Please enter Job Title !", 2000);
                return false;
                
            } 
            /*else if (angular.isUndefined($scope.contactEdit.address1) || $scope.contactEdit.address1 == '') {
                $('#c_address1').attr('required', true);
                $('#c_address1').focus();
                alertService.add("warning", "Please enter Address#1 !", 2000);
                return false;
            } else if (angular.isUndefined($scope.contactEdit.city) || $scope.contactEdit.city == '') {
                $('#c_city').attr('required', true);
                $('#c_city').focus();
                alertService.add("warning", "Please enter City !", 2000);
                return false;
            } else if (angular.isUndefined($scope.contactEdit.state) || $scope.contactEdit.state == '') {
                $('#c_state').attr('required', true);
                $('#c_state').focus();
                alertService.add("warning", "Please enter State !", 2000);
                return false;
            } else if (angular.isUndefined($scope.contactEdit.country) || $scope.contactEdit.country == '') {
                $('#c_country').attr('required', true);
                $('#c_country').focus();
                alertService.add("warning", "Please enter Country !", 2000);
                return false;
            } else if (angular.isUndefined($scope.contactEdit.zip) || $scope.contactEdit.zip == '') {
                $('#c_zip').attr('required', true);
                $('#c_zip').focus();
                alertService.add("warning", "Please enter Zip !", 2000);
                return false;
            }*/
            if (angular.isDefined($scope.contactEdit.email) && $scope.contactEdit.assistant_email != null && $scope.contactEdit.email != '') {
                var re = /\S+@\S+\.\S+/;
                if (!re.test($scope.contactEdit.email)) {
                    $('#c_email').attr('required', true);
                    $('#c_email').focus();
                    alertService.add("warning", "Please enter a valid Email Address !", 2000);
                    return false;
                }
            }
            if (angular.isDefined($scope.contactEdit.assistant_email) && $scope.contactEdit.assistant_email != null && $scope.contactEdit.assistant_email != '') {
                var re = /\S+@\S+\.\S+/;
                if (!re.test($scope.contactEdit.assistant_email)) {
                    $('#c_assist_email').attr('required', true);
                    $('#c_assist_email').focus();
                    alertService.add("warning", "Please enter a valid Assistant Email Address !", 2000);
                    return false;
                }

            }

            var contactEditUrl = "apiv4/public/user/contactEdit";
            var params = {
                type: 'edit',
                params: $scope.contactEdit,
                industryTags: $scope.contactindustryTagsAdded,
                coverageList: $scope.contactcorporatelistAdded
            };
            RequestDetail.getDetail(contactEditUrl, params).then(function (result) {

                if (result.data) {
                    alertService.add("success", "Contact Edited Successfully !", 2000);
                    $scope.showModal = false;
                    $scope.loadContact();

                } else {
                    alertService.add("warning", "Contact cannot edit at this time", 2000);
                }
            });
        }

        $scope.insertProfile = function () {

            if (angular.isUndefined($scope.contactEdit.firstname) || $scope.contactEdit.firstname == '') {
                $('#c_firstname').attr('required', true);
                $('#c_firstname').focus();
                $('.contact_fname').show();
                alertService.add("warning", "Please enter First Name !", 2000);
                return false;
            }
            else if (angular.isUndefined($scope.contactEdit.lastname) || $scope.contactEdit.lastname == '') {
                $('#c_lastname').attr('required', true);
                $('#c_lastname').focus();
                $('.contact_lname').show();
                alertService.add("warning", "Please enter Last Name !", 2000);
                return false;
            } else if (angular.isUndefined($scope.contactEdit.job_title) || $scope.contactEdit.job_title == '') {
                $('#c_title').attr('required', true);
                $('#c_title').focus();
                $('.contact_Title').show();
                alertService.add("warning", "Please enter Job title !", 2000);
                return false;
                
            } 
            else if (angular.isUndefined($scope.contactEdit.job_title) || $scope.contactEdit.job_title == '') {
                $('#c_title').attr('required', true);
                $('#c_title').focus();
                $('.contact_Title').show();
                alertService.add("warning", "Please enter Job title !", 2000);
                return false;
                
            } 
            else if (angular.isUndefined($scope.contactEdit.contact_type) || $scope.contactEdit.contact_type == '') {
                
                alertService.add("warning", "Please choose Contact Type !", 2000);
                return false;
                
            } 
            /*else if (angular.isUndefined($scope.contactEdit.address1) || $scope.contactEdit.address1 == '') {
                $('#c_address1').attr('required', true);
                $('#c_address1').focus();
                $('.contact_address').show();
                alertService.add("warning", "Please enter Address#1 !", 2000);
                return false;
            } else if (angular.isUndefined($scope.contactEdit.city) || $scope.contactEdit.city == '') {
                $('#c_city').attr('required', true);
                $('#c_city').focus();
                $('.contact_city').show();
                alertService.add("warning", "Please enter City !", 2000);
                return false;
            } else if (angular.isUndefined($scope.contactEdit.state) || $scope.contactEdit.state == '') {
                $('#c_state').attr('required', true);
                $('#c_state').focus();
                $('.contact_state').show();
                alertService.add("warning", "Please enter State !", 2000);
                return false;
            } else if (angular.isUndefined($scope.contactEdit.country) || $scope.contactEdit.country == '') {
                $('#c_country').attr('required', true);
                $('#c_country').focus();
                $('.contact_country').show();
                alertService.add("warning", "Please enter Country !", 2000);
                return false;
            } else if (angular.isUndefined($scope.contactEdit.zip) || $scope.contactEdit.zip == '') {
                $('#c_zip').attr('required', true);
                $('#c_zip').focus();
                $('.contact_zip').show();
                alertService.add("warning", "Please enter Zip !", 2000);
                return false;
            }
           
            */
            else if (angular.isUndefined($scope.contactEdit.email) || $scope.contactEdit.email == '' || !$scope.checkemailval($scope.contactEdit.email)) {
                alertService.add("warning", "Please enter a valid Email Address !", 2000);
                return false;
            }
           
            if (angular.isDefined($scope.contactEdit.assistant_email) && $scope.contactEdit.assistant_email != '') {
               
                if (!$scope.checkemailval($scope.contactEdit.assistant_email)) {
                    $('#c_assist_email').attr('required', true);
                    $('#c_assist_email').focus();
                    $('.contact_Title').show();
                    alertService.add("warning", "Please enter a valid Assistant Email Address !", 2000);
                    return false;
                }
            }

           
            

            var contactEditUrl = "apiv4/public/user/contactInsert";
            var params = {
                type: 'insert',
                params: $scope.contactEdit,
                industryTags: $scope.contactindustryTagsAdded,
                coverageList: $scope.contactcorporatelistAdded
            };
            RequestDetail.getDetail(contactEditUrl, params).then(function (result) {
                if (parseInt(result.data) == 0) {
                    alertService.add("success", "Contact Added Successfully !", 2000);
                    $scope.showModal = false;
                    $scope.loadContact();

                } else if (result.data == 'duplicate') {
                    alertService.add("warning", "Email Id already added in your contacts", 2000);
                } else {
                    alertService.add("warning", "Contact cannot edit at this time", 2000);
                }
            });
        }



        $scope.editfilesharing = function (index) {
            $scope.presentationResearchfiles = {};
            
            var ind = $scope.profileData.presentation_filings.indexOf(index);

            if (ind >= 0) {
                $scope.presentationResearchfiles = $scope.profileData.presentation_filings[ind];

                $scope.presentationResearchfiles.presentation_date = '';

                if (angular.isDefined($scope.profileData.presentation_filings[ind].presentation_date) && $scope.profileData.presentation_filings[ind].presentation_date != '') {
                    $scope.presentationResearchfiles.presentation_date = new Date($scope.profileData.presentation_filings[ind].presentation_date);
                }
                $scope.fileSharing = !$scope.fileSharing;
            }
        }
        $scope.addpresenter = function () {
            if (angular.isUndefined($scope.presentationResearchfiles.corporate_presenter_name) || $scope.presentationResearchfiles.corporate_presenter_name == '') {
                $('#corporate_presenter_name').attr('required', true);
                $('#corporate_presenter_name').focus();
                return false;
            }
            else {
                var ob = new Object();
                ob.name = $scope.presentationResearchfiles.corporate_presenter_name;
                if (angular.isDefined($scope.presentationResearchfiles.corporate_presenter_title) && $scope.presentationResearchfiles.corporate_presenter_title != '') {
                    ob.title = $scope.presentationResearchfiles.corporate_presenter_title;
                } else {
                    ob.title = '';
                }
                $scope.presentationResearchfiles.presenter_details.push(ob);
                $scope.presentationResearchfiles.corporate_presenter_name = '';
                $scope.presentationResearchfiles.corporate_presenter_title = '';
            }
        }
        $scope.removePresenterdetails = function (data) {
            if (angular.isDefined(data)) {
                var index = $scope.presentationResearchfiles.presenter_details.indexOf(data);
                if (index >= 0) {
                    $scope.presentationResearchfiles.presenter_details.splice(index, 1);
                }
            }
        }

        $scope.updateResearchfillings = function () {
            if (angular.isDefined($scope.presentationResearchfiles.id) && $scope.presentationResearchfiles.id != '') {

                if (angular.isUndefined($scope.presentationResearchfiles.presentation_title) || $scope.presentationResearchfiles.presentation_title == '') {
                    $('#presentation_title').attr('required', true);
                    $('#presentation_title').focus();
                    alertService.add("warning", "Please enter presentation title !", 2000);
                    return false;
                }
                if (angular.isUndefined($scope.presentationResearchfiles) || angular.isUndefined($scope.presentationResearchfiles.user_id)) {
                    alertService.add("warning", "Please choose file !", 2000);
                    return false;
                }
                var update_url = "apiv4/public/user/updateResearchfilings";
                var params = {
                    type: 'edit',
                    data: $scope.presentationResearchfiles
                };

                RequestDetail.getDetail(update_url, params).then(function (result) {
                    if (angular.isDefined(result.data) && angular.isDefined(result.data.id) && result.data != 'failure') {
                        angular.forEach($scope.profileData.presentation_filings, function (dt, ind) {
                            if (angular.isDefined(dt.id) && dt.id != '' && dt.id == result.data.id) {
                                dt = angular.copy(result.data);
                            }
                        });
                        $scope.fileSharing = false;
                        alertService.add("success", "Profile Updated Successfully !", 2000);

                    } else {
                        alertService.add("warning", "Contact cannot edit at this time", 2000);
                    }
                });
            }
        }

        $scope.uploadpresentaionFilings = function (imgdata) {
            if (imgdata.error) {
                alertService.add("warning", "This file type couldn't uploaded!", 2000);
                alert("This file type couldn't uploaded!");
            } else {
                if (angular.isDefined(imgdata.file_name) && angular.isDefined(imgdata.file_location)
                    && imgdata.file_name != '' && imgdata.file_location != '') {
                   
                    $scope.$apply(function () {
                        $scope.presentationResearchfiles.file_name = imgdata.file_name;
                        $scope.presentationResearchfiles.file_location = imgdata.file_location;
                        if (angular.isDefined(imgdata.date)) {
                            $scope.presentationResearchfiles.date = imgdata.date;
                        }
                        if (angular.isDefined(imgdata.user_id)) {
                            $scope.presentationResearchfiles.user_id = imgdata.user_id;
                        }
                    });
                }
            }
        }


        $scope.loadContact = function () {

            var url = "apiv4/public/user/get_user_profile";
            var params = {}
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.profile.colleagues = result.data.user_colleagues;
                $scope.profile.contacts = result.data.user_contacts;
                $scope.profileData.contacts = result.data.user_contacts;
            })

        }


        // add contacts
        $scope.addContact = function () {
            $scope.contactEdit = {};
            $scope.contactEdit.contact_type = 'Management';
            $scope.contactcorp = {};
            $scope.contactEdit.image = '';
            $scope.update = false;
            $scope.insert = true;
            $scope.contactcorporatelistAdded = [];
            $scope.contactindustryTagsAdded = [];
            $('#imgsrcdefault').show();
            $('#theDiv').html('');
            $rootScope.$broadcast('angucomplete-alt:clearSearch');
            $scope.showModal = !$scope.showModal;
        };


        $scope.showModal = false;
        $scope.toggleModal = function (contact_id) {
            $scope.contactindustryTagsAdded = [];
            $scope.contactcorporatelistAdded = [];


            $.each($scope.profileData.contacts, function (index, contact) {
                if(contact.contact_id==contact_id){
                    $scope.contactEdit = contact;
                }
            });


            
            if (angular.isDefined($scope.contactEdit.coveragelist) && $scope.contactEdit.coveragelist.length > 0) {
                $scope.contactcorporatelistAdded = $scope.contactEdit.coveragelist;
            }
            if (angular.isDefined($scope.contactEdit.industrytag) && $scope.contactEdit.industrytag.length > 0) {
                $scope.contactindustryTagsAdded = $scope.contactEdit.industrytag;
            }
            // Assign the values to the variables
            $scope.update = true;
            $scope.insert = false;
            $scope.showModal = !$scope.showModal;
            $('#imgsrcdefault').show();
            $('#theDiv').html('');
            
        };

        $scope.closecontact_edit = function () {
            $scope.showModal = !$scope.showModal;
            $scope.loadContact();
        }
        

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
        $scope.deleteContact = function (item) {

            if (!angular.isUndefined(item)) {
                var index = $scope.profileData.contacts.indexOf(item);
                var contactId = $scope.profileData.contacts[index].contact_id;
                var url = 'apiv4/public/user/deleteContact';
                RequestDetail.getDetail(url, contactId).then(function (result) {
                    $scope.profileData.contacts.splice(index, 1);
                });
            }
        }

        $scope.deletePresentation = function (presentation) {
            if (!angular.isUndefined(presentation)) {
                var index = $scope.profileData.presentation_filings.indexOf(presentation);
                if (index >= 0 && angular.isDefined($scope.profileData.presentation_filings[index]) && angular.isDefined($scope.profileData.presentation_filings[index].id)
                    && $scope.profileData.presentation_filings[index].id != '') {
                    var datas = $scope.profileData.presentation_filings[index];
                    var url = 'apiv4/public/user/deletePresentation';
                    RequestDetail.getDetail(url, $scope.profileData.presentation_filings[index]).then(function (result) {
                        $scope.profileData.presentation_filings.splice(index, 1);
                    });
                }
            }
        }



    })
    // EDIT Profile Controller 
    .controller('peer_reviewCtrl', function ($scope, $http, $location, usertype, localStorageService, RequestDetail, alertService, $timeout, $window, $rootScope, configdetails) {
        $scope.configdetails = configdetails;
        var localUserdata = localStorageService.get('userdata');
        $scope.spinnerActive = false;
        $scope.pageHeading = 'Peer Review';
        $scope.profileActive = 'active';
    })

    .controller('profileEditCtrl', function ($scope, $http, $location, usertype, localStorageService, RequestDetail, alertService, $timeout, $window, $rootScope, configdetails, $sce) {

        $scope.configdetails = configdetails;
        $scope.pageHeading = 'Edit Profile';
        $scope.profileActive = 'inner-active';

        var local = localStorageService.get('userdata');
        $scope.research_provider_status = localStorageService.get('research_provider_status');

        $scope.profile = {};
        $scope.edit = {};
        $scope.contactEdit = {};
        $scope.profile = [];
        $scope.profile.videourl = '';
        $scope.profile.contacts = [];
        $scope.profile.industry1 = [];
        $scope.presentaion_file = {};
        $scope.corporate_list = [];
        $scope.corporatelistAdded = [];
        $scope.presentationResearch = [];
        $scope.presentationResearchfiles = {};
        $scope.fileSharing = false;
        var tagUrl = 'apiv4/public/user/getAllIndustryTags';
        var corpUrl = 'apiv4/public/user/getCorporateLists';
        var params = {};
        $scope.industryTagsAdded = [];
        $scope.contactindustryTagsAdded = [];

        $scope.dtpopup = {};
        $scope.dtpopup.opened = false;
        $scope.opendt = function () {
            $scope.dtpopup.opened = true;
        }

        $scope.upload_profile_img = function (imgdata) {
            $scope.profile.image = 'uploads/profile/thumbnail/'+imgdata;
        }

        //active tabs
        $scope.activetab = 0;

        $scope.changeactive = function (index) {
            $scope.activetab = index;
        };

        $scope.profile_id = local.userId;

        var url = "apiv4/public/user/get_user_profile";
        var params = {}
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.profile.colleagues = result.data.user_colleagues;
            $scope.profile.contacts = result.data.user_contacts;
        });

        $scope.rpprofile = {};
        $scope.rpprofile.geography = [];
        $scope.rpprofile.industry = [];

        if (localStorageService.get('usertype') == 'broker') {
            var url = "apiv4/public/user/get_user_providerprofile";
            var params = {};
            RequestDetail.getDetail(url, params).then(function (result) {

                $scope.rpprofile = result.data;

                if(result.data.profile_broker_geography){
                    $scope.rpprofile.geography = result.data.profile_broker_geography.split(',');
                }
                if(result.data.profile_broker_industry){
                    $scope.rpprofile.industry = result.data.profile_broker_industry.split(',');
                }
                
                //$scope.rpprofile.industry = result.data.broker_industry.split(',');
                

                $scope.old_samples = result.data.old_samples;

                $scope.rpprofile.analyststatus = result.data.analyststatus;

                $.each($scope.rpprofile.industry, function (index, industry) {
                    $scope.profile.industry1[industry] = true;
                });

                $.each(result.data.analystfiles, function (index, file) {

                    if (file.sample_status == '1') {
                        $scope.rpprofile.sample_file_location = file.file_location;
                        $scope.rpprofile.sample_file_name = file.file_name;
                    } else {
                        $scope.rpprofile.file_location = file.file_location;
                        $scope.rpprofile.file_name = file.file_name;
                    }
                });



            });
        }
        $scope.peer_review = function () {
            $location.path('/peer_review/')
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

        $scope.uploadlogoFile = function (imgdata) {
            $scope.$apply(function () {
                $scope.logo_file = [];
                $scope.logo_file.push({
                    file_name: imgdata,
                    file_location: 'uploads/temp/' + imgdata
                });
                var update_cmyimgurl = "apiv4/public/user/updateadminimgProf";
                var params = {
                    logo_file: $scope.logo_file
                };
                RequestDetail.getDetail(update_cmyimgurl, params).then(function (result) {
                    $scope.profile.logo = 'uploads/temp/' + imgdata;
                })
            });
        }

        $scope.uploadsamplefileuploadFile = function (imgdata) {
            $scope.$apply(function () {
                $scope.rpprofile.newsample_file_location = 'uploads/analystfile/' + imgdata
                $scope.rpprofile.newsample_file_name = imgdata;
            });
        }


        $scope.uploadfileuploadFile = function (imgdata) {
            $scope.$apply(function () {
                $scope.rpprofile.newfile_location = 'uploads/analystfile/' + imgdata
                $scope.rpprofile.newfile_name = imgdata;

            });

        }

        //  Update Profile Details  
        $scope.updateProf = function (updatetype) {

            if (angular.isUndefined($scope.profile.firstname) || $scope.profile.firstname == '') {
                $('#firstname').attr('required', true);
                $('#firstname').focus();
                alertService.add("warning", "Please enter First Name !", 2000);
                return false;
            }
            else if (angular.isUndefined($scope.profile.lastname) || $scope.profile.lastname == '') {
                $('#lastname').attr('required', true);
                $('#lastname').focus();
                alertService.add("warning", "Please enter Last Name !", 2000);
                return false;
            } else if (angular.isUndefined($scope.profile.r_address_1) || $scope.profile.r_address_1 == '') {
                $('#address1').attr('required', true);
                $('#address1').focus();
                alertService.add("warning", "Please enter Address #1 !", 2000);
                return false;
            }
            else if (angular.isUndefined($scope.profile.state) || $scope.profile.state == '') {
                $('#state').attr('required', true);
                $('#state').focus();
                alertService.add("warning", "Please enter State !", 2000);
                return false;
            } else if (angular.isUndefined($scope.profile.country) || $scope.profile.country == '') {
                $('#country').attr('required', true);
                $('#country').focus();
                alertService.add("warning", "Please enter Country !", 2000);
                return false;
            } else if (angular.isUndefined($scope.profile.title) || $scope.profile.title == '') {
                $('#title').attr('required', true);
                $('#title').focus();
                alertService.add("warning", "Please enter Title !", 2000);
                return false;
            } else if (angular.isUndefined($scope.profile.contact) || $scope.profile.contact == '') {
                $('#contact').attr('required', true);
                $('#contact').focus();
                alertService.add("warning", "Please enter Phone Number !", 2000);
                return false;
            } else if (angular.isUndefined($scope.profile.city) || $scope.profile.city == '') {
                $('#city').attr('required', true);
                $('#city').focus();
                alertService.add("warning", "Please enter City !", 2000);
                return false;
            } else if (angular.isUndefined($scope.profile.zip) || $scope.profile.zip == '') {
                $('#zip').attr('required', true);
                $('#zip').focus();
                alertService.add("warning", "Please enter Zip Code !", 2000);
                return false;
                
            }

            var url = 'apiv4/public/user/addIndustryTag';
            var params = {
                type: 'put',
                industryTags: $scope.industryTagsAdded
            };
            RequestDetail.getDetail(url, params).then(function (result) {

            });

            $scope.spinnerActive = true;
            var update_url = "apiv4/public/user/updateProf";

            var params = {
                type: 'edit',
                data: $scope.profile,
                rpprofile: $scope.rpprofile,
                samplefile: $scope.sample_file,
                old_samples: $scope.old_samples,
                industryTags: $scope.industryTagsAdded
            };

            RequestDetail.getDetail(update_url, params).then(function (result) {

                $scope.spinnerActive = false;
                if (result.data) {
                    var userType = result.data.user_type; // USER TYPE 

                    if (userType == 1) {
                        localStorageService.set('usertype', 'investor');
                        localStorageService.set('userdata', result.data);
                        usertype.doService('investor');
                    } else if (userType == 2) {
                        localStorageService.set('usertype', 'corporate');
                        localStorageService.set('userdata', result.data);
                        usertype.doService('corporate');
                    } else if (userType == 3) {
                        localStorageService.set('usertype', 'broker');
                        localStorageService.set('userdata', result.data);
                        usertype.doService('broker');
                    }

                    localStorageService.set('userimage', result.data.image);
                    localStorageService.set('email', result.data.email);

                    $scope.userimage = localStorageService.get('userimage');

                    alertService.add("success", "Profile Updated Successfully !", 2000);

                    // $timeout(countUp, 2000);
                    $location.path('profile');
                } else {
                    alertService.add("warning", "Contact cannot edit at this time", 2000);
                }
            });

        }

        var countUp = function () {
            $window.location.href = '#/profile/edit';
            $window.location.reload();
        }


        //Cancel edit profile view
        $scope.cancelProf = function () {
            $location.path('profile');
        }



        // get and set session data after update 
        $scope.get_prof = function () {
            var params = [];
            var url = "apiv4/public/user/get_session_data";
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.profile = result.data; // setting  profile datas 
                //  localStorageService.set('userimage',result.data.image);
                $scope.userimage = localStorageService.get('userimage')
            });
        }



        $scope.get_prof();



        //broker 

        $scope.availableGeography = ['Global', 'US', 'Canada', 'Latin America', 'Europe', 'Russia', 'Japan', 'China', 'India', 'Asia', 'Australia', 'Middle East/Africa (MENA)', 'Emerging Markets', 'Frontier Markets'];

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
                                $scope.availableIndustry.push('All');
                            } else {
                                $scope.availableIndustry = [];
                            }
                        });
                    }
                    if (type == 'geography') {
                        $scope.availableGeography = ['Global', 'US', 'Canada', 'Latin America', 'Europe', 'Russia', 'Japan', 'China', 'India', 'Asia', 'Australia', 'Middle East/Africa (MENA)', 'Emerging Markets', 'Frontier Markets'];
                    }

                }
            }
        }


        $scope.saveindustry = function () {
            ////console.log($scope.step2.industry1);
            $scope.rpprofile.industry = [];
            $.each($scope.profile.industry1, function (index, industry) {
                if (industry == true) {
                    $scope.rpprofile.industry.push(index);
                }
            });
        }

        $scope.savegeography = function () {
            ////console.log($scope.step2.industry1);
            $scope.rpprofile.geography = [];
            $.each($scope.profile.geography1, function (index, geography) {

                $scope.rpprofile.geography.push(index);
            });
        }

        function chunk(arr, size) {
            var newArr = [];
            for (var i = 0; i < arr.length; i += size) {
                newArr.push(arr.slice(i, i + size));
            }
            return newArr;
        }

        var tagUrl = 'apiv4/public/user/get_search_details1';

        var params = {
            term: '',
            key: 'allindustry'
        };
        RequestDetail.getDetail(tagUrl, params).then(function (result) {
            if (angular.isDefined(result.data) && result.data.length > 0) {
                $scope.availableallIndustry = chunk(result.data, 29);
            } else {
                $scope.availableallIndustry = [];
            }
        });


        $scope.coveragelist = [];
        var url = "apiv4/public/user/listtocoveragelist";
        var params = {};
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.coveragelist = result.data;
        });

        var url = "apiv4/public/user/get_user_providerprofile";
        var params = {};
        RequestDetail.getDetail(url, params).then(function (result) {
            ////console.log(result.data);
            //	 $scope.rpprofile=result.data;    
            $scope.old_samples = result.data.old_samples;

        });

        var url = "apiv4/public/user/listtocoveragelistmarketfile";
        var params = {};
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.old_marketingFile = result.data;


        });

        $scope.removeoldFiles = function (index) {
            $scope.old_samples.splice(index, 1);
        }


        $scope.videourl_local = local.videourl;
        $scope.trustSrc = function () {
            return $sce.trustAsResourceUrl($scope.videourl_local);
        }

        // Remove Tagging 
        $scope.removeTagging = function (index) {
            $scope.industryTagsAdded.splice(index, 1);
        }

        //remove coverage
        $scope.removeCorporate = function (index) {
            $scope.corporatelistAdded.splice(index, 1);
        }

        //remove coverage in popup
        $scope.removecontactCorporate = function (index) {
            $scope.contactcorporatelistAdded.splice(index, 1);
        }

        // Remove Contact Tagging 
        $scope.removecontactTagging = function (index) {
            $scope.contactindustryTagsAdded.splice(index, 1);
        }

        // add contacts
        $scope.addContact = function () {
            $scope.contactEdit = {};
            $scope.contactcorp = {};
            $scope.contactEdit.image = '';
            $scope.update = false;
            $scope.insert = true;
            $scope.contactcorporatelistAdded = [];
            $scope.contactindustryTagsAdded = [];
            $('#imgsrcdefault').show();
            $('#theDiv').html('');
            $rootScope.$broadcast('angucomplete-alt:clearSearch');
            $scope.showModal = !$scope.showModal;
        };

        $scope.uploadFile = function (imgdata) {
            $scope.contactEdit.image = imgdata;
        }



        $scope.uploadpresentaionFile = function (imgdata) {
            if (imgdata.error) {
                alertService.add("warning", "This file type couldn't uploaded!", 2000);
                alert("This file type couldn't uploaded!");
            } else {
                var valpush = {};
                valpush = {
                    file_name: imgdata.file_name,
                    file_location: imgdata.file_location,
                    date: imgdata.date,
                    user_documents_id: imgdata.user_documents_id
                }
                $scope.$apply(function () {
                    $scope.presentaion_file = valpush;
                });
            }
        }
        $scope.uploadpresentaionFilings = function (imgdata) {
            if (imgdata.error) {
                alertService.add("warning", "This file type couldn't uploaded!", 2000);
                alert("This file type couldn't uploaded!");
            } else {
                if (angular.isDefined(imgdata.file_name) && angular.isDefined(imgdata.file_location)
                    && imgdata.file_name != '' && imgdata.file_location != '') {
                   
                    $scope.$apply(function () {
                        $scope.presentationResearchfiles.file_name = imgdata.file_name;
                        $scope.presentationResearchfiles.file_location = imgdata.file_location;
                        if (angular.isDefined(imgdata.date)) {
                            $scope.presentationResearchfiles.date = imgdata.date;
                        }
                        if (angular.isDefined(imgdata.user_id)) {
                            $scope.presentationResearchfiles.user_id = imgdata.user_id;
                        }
                    });
                }
            }
        }

        $scope.removeFiles = function () {
            if (angular.isDefined($scope.presentaion_file.user_documents_id)) {
                var user_documents_id = $scope.presentaion_file.user_documents_id;
                var url = 'apiv4/public/user/deleterepresentaionfile';
                RequestDetail.getDetail(url, user_documents_id).then(function (result) {
                    $scope.presentaion_file = {};
                });
            }
        }
        $scope.removeResearchfiles = function () {
           
            if (angular.isDefined($scope.presentationResearchfiles.file_location) && angular.isDefined($scope.presentationResearchfiles.file_name) &&
                $scope.presentationResearchfiles.file_location != '' && $scope.presentationResearchfiles.file_name != '') {
                var data = new Object();
                data.file_location = $scope.presentationResearchfiles.file_location;
                data.file_name = $scope.presentationResearchfiles.file_name;
                var url = 'apiv4/public/user/deleteresearchfile';
                // RequestDetail.getDetail(url,data).then(function(result) {
                $scope.presentationResearchfiles.file_location = ''
                $scope.presentationResearchfiles.file_name = ''
                if (angular.isDefined($scope.presentationResearchfiles.filing_id)) {
                    $scope.presentationResearchfiles.filing_id = '';
                }
               
            }

           
        }
        $scope.deleteContact = function (item) {

            if (!angular.isUndefined(item)) {
                var index = $scope.profile.contacts.indexOf(item);
                var contactId = $scope.profile.contacts[index].contact_id;
                var url = 'apiv4/public/user/deleteContact';
                RequestDetail.getDetail(url, contactId).then(function (result) {
                    $scope.profile.contacts.splice(index, 1);
                });
            }
        }
        $scope.deletePresentation = function (presentation) {
            if (!angular.isUndefined(presentation)) {
                var index = $scope.profile.presentation_filings.indexOf(presentation);
                if (index >= 0 && angular.isDefined($scope.profile.presentation_filings[index]) && angular.isDefined($scope.profile.presentation_filings[index].id)
                    && $scope.profile.presentation_filings[index].id != '') {
                    var datas = $scope.profile.presentation_filings[index];
                    var url = 'apiv4/public/user/deletePresentation';
                    RequestDetail.getDetail(url, $scope.profile.presentation_filings[index]).then(function (result) {
                        $scope.profile.presentation_filings.splice(index, 1);
                    });
                }
            }
        }

        $scope.valCorpList = {};
        $scope.contactcorp = {};
        $scope.contactcorporatelistAdded = [];

        $scope.tags = {};
        $scope.tags.valMacroTags = '';
        $scope.tags.valMidTags = '';
        $scope.tags.valMicroTags = '';
        $scope.contacttags = {};
        $scope.contacttags.valMacroTags = '';
        $scope.contacttags.valMidTags = '';
        $scope.contacttags.valMicroTags = '';

        $scope.selectMacroTag = function (selected) {
            if (selected != undefined) {
                $scope.tags.valMacroTags = selected.title;
            }
        }
        $scope.selectMidTag = function (selected) {
            if (selected != undefined) {
                $scope.tags.valMidTags = selected.title;
            }
        }
        $scope.selectMicroTag = function (selected) {
            if (selected != undefined) {
                $scope.tags.valMicroTags = selected.title;
            }
        }

        $scope.selectcontactMacroTag = function (selected) {
            if (selected != undefined) {
                $scope.contacttags.valMacroTags = selected.title;
            }
        }
        $scope.selectcontactMidTag = function (selected) {
            if (selected != undefined) {
                $scope.contacttags.valMidTags = selected.title;
            }
        }
        $scope.selectcontactMicroTag = function (selected) {
            if (selected != undefined) {
                $scope.contacttags.valMicroTags = selected.title;
            }
        }

        $scope.selectCorporatelist = function (selected) {
            if (angular.isDefined(selected) && angular.isDefined(selected.originalObject) && angular.isDefined(selected.originalObject.id)
                && angular.isDefined(selected.originalObject.name)) {
                $scope.valCorpList = selected.originalObject;
            }
        }
        $scope.get_matched = function () {
            var tagUrl = 'apiv4/public/dashboard/get_auto_ticker';
            var params = $("#corporate_ticker").val();
            RequestDetail.getDetail(tagUrl, params).then(function (result) {
                $("#corporate_ticker").autocomplete({
                    source: result.data,
                    select: function (a, b) {
                        if (angular.isDefined(b.item.ticker_id) && b.item.ticker_id != '') {
                            var ob = new Object();
                            ob.id = b.item.ticker_id;
                            if (angular.isDefined(b.item.company_name) && b.item.company_name != '') {
                                ob.name = b.item.company_name;
                                if (angular.isDefined(b.item.value) && b.item.value != '') {
                                    ob.name += '(' + b.item.value + ')';
                                }
                            }
                            if (angular.isDefined(ob.name) && ob.name != '') {
                                var exist = 0
                                angular.forEach($scope.contactcorporatelistAdded, function (data, ind) {
                                    if (angular.isDefined(data.id) && data.id == b.item.ticker_id) {
                                        exist = 1;
                                    }
                                });
                                if (exist == 1) {
                                    alert("Already added in the list");
                                    return false;
                                } else {
                                    $scope.contactcorporatelistAdded.push(ob);
                                    $scope.contactcorp.valCorpList = '';
                                }
                            }
                        }
                    }
                });
            });
        }

        $scope.addMacroTag = function () {
            if ($scope.tags.valMacroTags != '') {
                if ($scope.industryTagsAdded.indexOf($scope.tags.valMacroTags) == -1) {
                    $scope.industryTagsAdded.push($scope.tags.valMacroTags);
                    $scope.tags.valMacroTags = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
                    
                } else {
                    alert("Already Added in the List");
                    $scope.tags.valMacroTags = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
                }
            }
        }
        $scope.addMidTag = function () {
            if ($scope.tags.valMidTags != '') {
                if ($scope.industryTagsAdded.indexOf($scope.tags.valMidTags) == -1) {
                    $scope.industryTagsAdded.push($scope.tags.valMidTags);
                    $scope.tags.valMidTags = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagMid');


                } else {
                    alert("Already Added in the List");
                    $scope.tags.valMidTags = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
                }
            }
        }
        $scope.addMicroTag = function () {
            if ($scope.tags.valMicroTags != '') {
                if ($scope.industryTagsAdded.indexOf($scope.tags.valMicroTags) == -1) {
                    $scope.industryTagsAdded.push($scope.tags.valMicroTags);
                    $scope.tags.valMicroTags = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagMicro');
                    
                } else {
                    alert("Already Added in the List");
                    $scope.tags.valMicroTags = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
                }
            }
        }

       
        

        $scope.addcontactMacroTag = function () {
            if ($scope.contacttags.valMacroTags != '') {
                if ($scope.contactindustryTagsAdded.indexOf($scope.contacttags.valMacroTags) == -1) {
                    $scope.contactindustryTagsAdded.push($scope.contacttags.valMacroTags);
                    $scope.contacttags.valMacroTags = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
                    var url = 'apiv4/public/user/addcontactIndustryTag';
                    var params = {
                        type: 'put',
                        industryTags: $scope.contactindustryTagsAdded
                    };
                    RequestDetail.getDetail(url, params).then(function (result) {

                    });
                } else {
                    alert("Already Added in the List");
                    $scope.contacttags.valMacroTags = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
                }
            }
        }
        $scope.addcontactMidTag = function () {
            if ($scope.contacttags.valMidTags != '') {
                if ($scope.contactindustryTagsAdded.indexOf($scope.contacttags.valMidTags) == -1) {
                    $scope.contactindustryTagsAdded.push($scope.contacttags.valMidTags);
                    $scope.contacttags.valMidTags = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagMid');
                    var url = 'apiv4/public/user/addcontactIndustryTag';
                    var params = {
                        type: 'put',
                        industryTags: $scope.contactindustryTagsAdded
                    };
                    RequestDetail.getDetail(url, params).then(function (result) {

                    });
                } else {
                    alert("Already Added in the List");
                    $scope.contacttags.valMidTags = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
                }
            }
        }
        $scope.addcontactMicroTag = function () {
            if ($scope.contacttags.valMicroTags != '') {
                if ($scope.contactindustryTagsAdded.indexOf($scope.contacttags.valMicroTags) == -1) {
                    $scope.contactindustryTagsAdded.push($scope.contacttags.valMicroTags);
                    $scope.tags.valMicroTags = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagMicro');
                    var url = 'apiv4/public/user/addcontactIndustryTag';
                    var params = {
                        type: 'put',
                        industryTags: $scope.contactindustryTagsAdded
                    };
                    RequestDetail.getDetail(url, params).then(function (result) {

                    });
                } else {
                    alert("Already Added in the List");
                    $scope.contacttags.valMicroTags = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
                }
            }
        }

        $scope.addCorpList = function () {
            if (angular.isDefined($scope.valCorpList) && angular.isDefined($scope.valCorpList.id) && $scope.valCorpList.id != '') {
                if ($scope.corporatelistAdded.indexOf($scope.valCorpList) == -1) {
                    $scope.corporatelistAdded.push($scope.valCorpList);
                    $scope.valCorpList = {};
                    $scope.$broadcast('angucomplete-alt:clearInput', 'corpList');
                    var url = 'apiv4/public/user/addCorporateList';
                    var params = {
                        type: 'put',
                        corporateList: $scope.corporatelistAdded
                    };
                    RequestDetail.getDetail(url, params).then(function (result) {

                    });
                } else {
                    alert("Already Added in the List");
                    $scope.corp.valCorpList = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'corpList');
                }
            }
        }

        $scope.removeTag = function (item) {
            var index = $scope.industryTagsAdded.indexOf(item);
            $scope.industryTagsAdded.splice(index, 1);
           
        }

        $scope.showfilesharing = function () {
            $scope.presentationResearchfiles = {};
            $scope.presentationResearchfiles.presentation_files = [];
            $scope.presentationResearchfiles.presenter_details = [];
            $scope.fileSharing = !$scope.fileSharing;
        }
        $scope.editfilesharing = function (index) {
            $scope.presentationResearchfiles = {};
            var ind = $scope.profile.presentation_filings.indexOf(index);
            if (ind >= 0) {

                $scope.presentationResearchfiles = $scope.profile.presentation_filings[ind];
                if (angular.isDefined($scope.profile.presentation_filings[ind].presentation_date) && $scope.profile.presentation_filings[ind].presentation_date != '') {
                    $scope.presentationResearchfiles.presentation_date = new Date($scope.profile.presentation_filings[ind].presentation_date);
                }
                $scope.fileSharing = !$scope.fileSharing;
            }
        }

        $scope.addpresenter = function () {
            if (angular.isUndefined($scope.presentationResearchfiles.corporate_presenter_name) || $scope.presentationResearchfiles.corporate_presenter_name == '') {
                $('#corporate_presenter_name').attr('required', true);
                $('#corporate_presenter_name').focus();
                return false;
            }
            else {
                var ob = new Object();
                ob.name = $scope.presentationResearchfiles.corporate_presenter_name;
                if (angular.isDefined($scope.presentationResearchfiles.corporate_presenter_title) && $scope.presentationResearchfiles.corporate_presenter_title != '') {
                    ob.title = $scope.presentationResearchfiles.corporate_presenter_title;
                } else {
                    ob.title = '';
                }
                $scope.presentationResearchfiles.presenter_details.push(ob);
                $scope.presentationResearchfiles.corporate_presenter_name = '';
                $scope.presentationResearchfiles.corporate_presenter_title = '';
            }
        }

        $scope.removePresenterdetails = function (data) {
            if (angular.isDefined(data)) {
                var index = $scope.presentationResearchfiles.presenter_details.indexOf(data);
                if (index >= 0) {
                    $scope.presentationResearchfiles.presenter_details.splice(index, 1);
                }
            }
        }
       

        if (usertype.getService() == 'corporate') {
            $scope.pageHeading = 'Corporate Profile';
        }

        $scope.saveResearchfillings = function () {
            if (angular.isUndefined($scope.presentationResearchfiles.presentation_title) || $scope.presentationResearchfiles.presentation_title == '') {
                $('#presentation_title').attr('required', true);
                $('#presentation_title').focus();
                alertService.add("warning", "Please enter presentation title !", 2000);
                return false;
            }
            if (angular.isUndefined($scope.presentationResearchfiles) || angular.isUndefined($scope.presentationResearchfiles.user_id)) {
                alertService.add("warning", "Please choose file !", 2000);
                return false;
            }
            var update_url = "apiv4/public/user/updateResearchfilings";
            var params = {
                type: 'edit',
                data: $scope.presentationResearchfiles
            };

            RequestDetail.getDetail(update_url, params).then(function (result) {
                if (angular.isDefined(result.data) && angular.isDefined(result.data.id) && result.data != 'failure') {
                    if (angular.isUndefined($scope.profile.presentation_filings)) {
                        $scope.profile.presentation_filings = [];
                    }
                    $scope.profile.presentation_filings.push(angular.copy(result.data));
                    $scope.fileSharing = false;
                    alertService.add("success", "Profile Updated Successfully !", 2000);

                } else {
                    alertService.add("warning", "Contact cannot edit at this time", 2000);
                }
            });
        }
        $scope.updateResearchfillings = function () {
            if (angular.isDefined($scope.presentationResearchfiles.id) && $scope.presentationResearchfiles.id != '') {

                if (angular.isUndefined($scope.presentationResearchfiles.presentation_title) || $scope.presentationResearchfiles.presentation_title == '') {
                    $('#presentation_title').attr('required', true);
                    $('#presentation_title').focus();
                    alertService.add("warning", "Please enter presentation title !", 2000);
                    return false;
                }
                if (angular.isUndefined($scope.presentationResearchfiles) || angular.isUndefined($scope.presentationResearchfiles.user_id)) {
                    alertService.add("warning", "Please choose file !", 2000);
                    return false;
                }
                var update_url = "apiv4/public/user/updateResearchfilings";
                var params = {
                    type: 'edit',
                    data: $scope.presentationResearchfiles
                };

                RequestDetail.getDetail(update_url, params).then(function (result) {
                    if (angular.isDefined(result.data) && angular.isDefined(result.data.id) && result.data != 'failure') {
                        angular.forEach($scope.profile.presentation_filings, function (dt, ind) {
                            if (angular.isDefined(dt.id) && dt.id != '' && dt.id == result.data.id) {
                                dt = angular.copy(result.data);
                            }
                        });
                        $scope.fileSharing = false;
                        alertService.add("success", "Profile Updated Successfully !", 2000);

                    } else {
                        alertService.add("warning", "Contact cannot edit at this time", 2000);
                    }
                });
            }
        }


        $scope.showModal = false;
        $scope.toggleModal = function (index) {
            $scope.contactindustryTagsAdded = [];
            $scope.contactcorporatelistAdded = [];
            $scope.contactEdit = $scope.profile.contacts[index];
            if (angular.isDefined($scope.profile.contacts[index].coveragelist) && $scope.profile.contacts[index].coveragelist.length > 0) {
                $scope.contactcorporatelistAdded = $scope.profile.contacts[index].coveragelist;
            }
            if (angular.isDefined($scope.profile.contacts[index].industrytag) && $scope.profile.contacts[index].industrytag.length > 0) {
                $scope.contactindustryTagsAdded = $scope.profile.contacts[index].industrytag;
            }
            // Assign the values to the variables
            $scope.update = true;
            $scope.insert = false;
            $scope.showModal = !$scope.showModal;
            $('#imgsrcdefault').show();
            $('#theDiv').html('');
        };

    })
    .controller('companyprofileEditCtrl', function ($scope, $http, $location, usertype, localStorageService, RequestDetail, alertService, $timeout, $window, $rootScope, configdetails) {

        $scope.configdetails = configdetails;
        $scope.pageHeading = 'Edit Profile';
        $scope.cmyprofileActive = 'inner-active';

        var local = localStorageService.get('userdata');

        if (localStorageService.get('admincontroluser') == 0) {
            $location.path('profile/edit');
        }

        $scope.showModalpageinfo = false;

        $scope.openmodelpagehelp = function () {
            $scope.showModalpageinfo = !$scope.showModalpageinfo;
        }


        $scope.profile = {};
        $scope.edit = {};
        $scope.contactEdit = {};
        $scope.profile = [];
        $scope.profile.videourl = '';
        $scope.profile.contacts = [];
        $scope.presentaion_file = {};
        $scope.research_file = {};
        $scope.fact_sheet_file = {};
        $scope.modelpresentaion_file = [];
        $scope.corporate_list = [];
        $scope.corporatelistAdded = [];
        $scope.presentationResearch = [];
        $scope.presentationResearchfiles = {};
        $scope.fileSharing = false;
        var tagUrl = 'apiv4/public/user/getAllIndustryTags';
        var corpUrl = 'apiv4/public/user/getCorporateLists';
        var params = {};
        $scope.industryTagsAdded = [];
        $scope.contactindustryTagsAdded = [];

        $scope.dtpopup = {};
        $scope.dtpopup.opened = false;
        $scope.opendt = function () {
            $scope.dtpopup.opened = true;
        }


        $scope.isUrlValid = function (userInput) {
            var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
            return (res !== null)
        }

        $scope.getResearchpresentation = function () {
            var research_url = 'apiv4/public/user/getresearchfiles';

            RequestDetail.getDetail(research_url).then(function (result) {
                $scope.profile.presentation_filings = [];
                if (angular.isDefined(result.data) && angular.isDefined(result.data.research_detail) && result.data.research_detail.length > 0) {

                    angular.forEach(result.data.research_detail, function (data, ind) {
                        $scope.profile.presentation_filings.push(data);
                    });


                }
            });
        }



        var industry_tag_url = 'apiv4/public/user/getIndustryTags';
        var params = {
            key: 'tags'
        }
        RequestDetail.getDetail(industry_tag_url, params).then(function (result) {
            var result = result.data;
            if (result != 0) {
                $scope.dataa = [];
                angular.forEach(result, function (value, key) {
                    $scope.dataa.push(value.name);
                });
                $scope.industryTagsAdded = $scope.dataa;
            }
        });
        RequestDetail.getDetail(corpUrl, params).then(function (result) {
            var result = result.data;
            if (result.length > 0) {
                var corpData = [];
                angular.forEach(result, function (value, key) {
                    if (angular.isDefined(value.id) && angular.isDefined(value.name)) {
                        corpData.push(value);
                    }
                });
                $scope.corporatelistAdded = corpData;
            }
        });




        $scope.getContacts = function () {
            var profile_contacts = 'apiv4/public/user/getProfileContact';
            var params = {
                key: 'contacts',
                profile_id: local.user_id
            }
            RequestDetail.getDetail(profile_contacts, params).then(function (result) {
                if (parseInt(result.data) != 0) {
                    $scope.profile.contacts = result.data;
                }
            });
        }

        $scope.upload_prf_img = function (imgdata) {
            $scope.profile.logo = 'uploads/profile/thumbnail/'+imgdata;
        }

        $scope.upload_prfhomebanner_img = function (imgdata) {
            $scope.profile.homebanner = 'uploads/profile/thumbnail/'+imgdata;
        }

        var profile_model = 'apiv4/public/user/getcorporate_model';
        var params = {}
        RequestDetail.getDetail(profile_model, params).then(function (result) {

            if (angular.isDefined(result.data.file_location) && result.data.file_location != ''
                && angular.isDefined(result.data.file_name) && result.data.file_name != '') {
                $scope.modelpresentaion_file = result.data;

            }

        });




        //INVESTOR PRESENTATION FILES
        var profile_contacts = 'apiv4/public/user/getpresentationandresearchfiles';
        var params = {
            key: 'contacts',
            profile_id: local.user_id
        }
        RequestDetail.getDetail(profile_contacts, params).then(function (result) {
            if (angular.isDefined(result.data.file_location) && result.data.file_location != ''
                && angular.isDefined(result.data.file_name) && result.data.file_name != '') {
                $scope.presentaion_file = result.data;
            }
        });

        //RESEARCH FILES
        var profile_reasech_file = 'apiv4/public/user/getprofileresearchfiles';
        var params = {
            profile_id: local.user_id
        }
        RequestDetail.getDetail(profile_reasech_file, params).then(function (result) {
            if (angular.isDefined(result.data.file_location) && result.data.file_location != ''
                && angular.isDefined(result.data.file_name) && result.data.file_name != '') {
                $scope.research_file = result.data;
            }
        });

        //Fact Sheet FILES
        var profile_fact_file = 'apiv4/public/user/getprofileFactSheetfiles';
        var params = {
            profile_id: local.user_id
        }
        RequestDetail.getDetail(profile_fact_file, params).then(function (result) {
            if (angular.isDefined(result.data.file_location) && result.data.file_location != ''
                && angular.isDefined(result.data.file_name) && result.data.file_name != '') {
                $scope.fact_sheet_file = result.data;
            }
        });
        RequestDetail.getDetail(tagUrl, params).then(function (result) {
            $scope.macroTags = result.data.macro;
            $scope.midTags = result.data.mid;
            $scope.microTags = result.data.micro;
        });

       /* var coverage_url = 'apiv4/public/user/getcorporatedetails';

        RequestDetail.getDetail(coverage_url).then(function (result) {
            if (angular.isDefined(result.data) && angular.isDefined(result.data.corporate_data) && result.data.corporate_data.length > 0) {
                $scope.corporate_list = result.data.corporate_data;
            }
        });*/


        $scope.sample_file = [];



        $scope.removeFiles = function (index) {
            $scope.sample_file.splice(index, 1);
        }
        $scope.removeoldFiles = function (index) {
            $scope.old_samples.splice(index, 1);
        }

        $scope.uploadsampleFile = function (imgdata) {
            $scope.$apply(function () {
                $scope.sample_file.push({
                    file_name: imgdata,
                    file_location: 'uploads/temp/' + imgdata
                })
            });
        }


        $scope.old_samples = [];
        $scope.rpprofile = [];


        //  Update Profile Details  
        $scope.updateProf = function () {


            var update_url = "apiv4/public/user/updateadminProf";

            

            if (angular.isUndefined($scope.profile.company_name) || $scope.profile.company_name == '') {
                $('#company_name').attr('required', true);
                $('#company_name').focus();
                alertService.add("warning", "Please enter company name !", 2000);
                return false;
            }
            
            if (angular.isUndefined($scope.profile.c_address_1) || $scope.profile.c_address_1 == '') {
                $('#c_address_1').attr('required', true);
                $('#c_address_1').focus();
                alertService.add("warning", "Please enter Address !", 2000);
                return false;
            }
            if (angular.isUndefined($scope.profile.c_city) || $scope.profile.c_city == '') {
                $('#city').attr('required', true);
                $('#city').focus();
                alertService.add("warning", "Please enter City !", 2000);
                return false;
            }
            if (angular.isUndefined($scope.profile.c_state) || $scope.profile.c_state == '') {
                $('#state').attr('required', true);
                $('#state').focus();
                alertService.add("warning", "Please enter State !", 2000);
                return false;
            }
            if (angular.isUndefined($scope.profile.c_country) || $scope.profile.c_country == '') {
                $('#country').attr('required', true);
                $('#country').focus();
                alertService.add("warning", "Please enter Country !", 2000);
                return false;
            }
            if (angular.isUndefined($scope.profile.c_zip) || $scope.profile.c_zip == '') {
                $('#zip').attr('required', true);
                $('#zip').focus();
                alertService.add("warning", "Please enter Zip !", 2000);
                return false;
            }
            if ($scope.profile.website != '') {
                if(!$scope.isUrlValid($scope.profile.website)){
                    alertService.add("warning", "Please enter valid website URL !", 2000);
                    return false;
                }
            }

            var url = 'apiv4/public/user/addIndustryTag';
            var params = {
                type: 'put',
                industryTags: $scope.industryTagsAdded
            };
            RequestDetail.getDetail(url, params).then(function (result) {

            });

           
            
            var params = {
                'company_name': $scope.profile.company_name,
                'ticker': $scope.profile.ticker,
                'website': $scope.profile.website,
                'main_phone': $scope.profile.main_phone,
                'c_address_1': $scope.profile.c_address_1,
                'c_address_2': $scope.profile.c_address_2,
                'city': $scope.profile.c_city,
                'state': $scope.profile.c_state,
                'country': $scope.profile.c_country,
                'zip': $scope.profile.c_zip,
                'utube': $scope.profile.utube,
                'c_description': $scope.profile.c_description,
                'logo': $scope.profile.logo,
                'homebanner': $scope.profile.homebanner,
                'industryTagsAdded': $scope.industryTagsAdded,
                'rpprofile': $scope.rpprofile,
                'sample_file': $scope.sample_file,
                'old_samples': $scope.old_samples
            };

         

            RequestDetail.getDetail(update_url, params).then(function (result) {
                ////console.log(result.data);
                if (result.data.count == 1) {
                    alertService.add("success", "Profile Updated Successfully !", 2000);

                    // $timeout(countUp, 2000);
                    $location.path('companyprofile');
                } else {
                    alertService.add("warning", "Permission denied", 2000);
                }
            });

        }
        var countUp = function () {
            $window.location.href = '#/companyprofile';
            $window.location.reload();
        }


        //Cancel edit profile view
        $scope.cancelProf = function () {
            $location.path('companyprofile');
        }

        // get and set session data after update 
        $scope.get_prof = function () {
            var params = [];
            var url = "apiv4/public/user/get_session_data";
            RequestDetail.getDetail(url, params).then(function (result) {

                // //console.log(result.data);

                $scope.profile = result.data; // setting  profile datas 

                $scope.getContacts();  // settings contact datas 
                $scope.getResearchpresentation();
                //  localStorageService.set('userimage',result.data.image);
                $scope.userimage = localStorageService.get('userimage')
            });
        }

        $scope.get_prof();

        if (localStorageService.get('usertype') == 'broker') {
            var url = "apiv4/public/user/get_user_providerprofile";
            var params = {};
            RequestDetail.getDetail(url, params).then(function (result) {
                ////console.log(result.data);
                $scope.rpprofile = result.data;

                $scope.old_samples = result.data.old_samples;


            });
        }


        var url = "apiv4/public/user/get_subusers";
        var params = [];
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.subprofiles = result.data;
        });



        $scope.purchasepowchange = function (user_id, status) {
            var params = { 'purchasing_power': status, 'user_id': user_id };
            var url = "apiv4/public/user/update_subusers";
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.subprofiles = result.data;
                alertService.add("success", "Purchasing Power Updated Successfully !", 2000);
            });

        }


        // Remove Tagging 
        $scope.removeTagging = function (index) {
            $scope.industryTagsAdded.splice(index, 1);
        }

        //remove coverage
        $scope.removeCorporate = function (index) {
            $scope.corporatelistAdded.splice(index, 1);
        }

        //remove coverage in popup
        $scope.removecontactCorporate = function (index) {
            $scope.contactcorporatelistAdded.splice(index, 1);
        }

        // Remove Contact Tagging 
        $scope.removecontactTagging = function (index) {
            $scope.contactindustryTagsAdded.splice(index, 1);
        }

        // add contacts
        $scope.addContact = function () {
            $scope.contactEdit = {};
            $scope.contactcorp = {};
            $scope.contactEdit.image = '';
            $scope.update = false;
            $scope.insert = true;
            $scope.contactcorporatelistAdded = [];
            $scope.contactindustryTagsAdded = [];
            $('#imgsrcdefault').show();
            $('#theDiv').html('');
            $rootScope.$broadcast('angucomplete-alt:clearSearch');
            $scope.showModal = !$scope.showModal;
        };

        $scope.uploadFile = function (imgdata) {
            $scope.contactEdit.image = imgdata;
        }



        $scope.uploadpresentaionFile = function (imgdata) {
            if (imgdata.error) {
                alertService.add("warning", "This file type couldn't uploaded!", 2000);
                alert("This file type couldn't uploaded!");
            } else {
                var valpush = {};
                valpush = {
                    file_name: imgdata.file_name,
                    file_location: imgdata.file_location,
                    date: imgdata.date,
                    user_documents_id: imgdata.user_documents_id
                }
                $scope.$apply(function () {
                    $scope.presentaion_file = valpush;
                });
            }
        }
        $scope.uploadResearchFile = function (imgdata) {
            if (imgdata.error) {
                alertService.add("warning", "This file type couldn't uploaded!", 2000);
                alert("This file type couldn't uploaded!");
            } else {
                var valpush = {};
                valpush = {
                    file_name: imgdata.file_name,
                    file_location: imgdata.file_location,
                    date: imgdata.date,
                    research_id: imgdata.research_id
                }
                $scope.$apply(function () {
                    $scope.research_file = valpush;
                });
            }
        }
        $scope.uploadFactSheetFile = function (imgdata) {
            if (imgdata.error) {
                alertService.add("warning", "This file type couldn't uploaded!", 2000);
                alert("This file type couldn't uploaded!");
            } else {
                var valpush = {};
                valpush = {
                    file_name: imgdata.file_name,
                    file_location: imgdata.file_location,
                    date: imgdata.date,
                    fact_sheet_id: imgdata.fact_sheet_id
                }
                $scope.$apply(function () {
                    $scope.fact_sheet_file = valpush;
                });
            }
        }
        $scope.modelpresentaion_file1 = function (imgdata) {
            if (imgdata.error) {
                alertService.add("warning", "This file type couldn't uploaded!", 2000);
                alert("This file type couldn't uploaded!");
            } else {
                var valpush = {};
                valpush = {
                    file_name: imgdata.modelfile_name,
                    file_location: imgdata.modelfile_location,
                    company_id: imgdata.company_id
                }
                $scope.$apply(function () {
                    $scope.modelpresentaion_file = valpush;
                });
            }
        }
        $scope.uploadpresentaionFilings = function (imgdata) {
            if (imgdata.error) {
                alertService.add("warning", "This file type couldn't uploaded!", 2000);
                alert("This file type couldn't uploaded!");
            } else {
                if (angular.isDefined(imgdata.file_name) && angular.isDefined(imgdata.file_location)
                    && imgdata.file_name != '' && imgdata.file_location != '') {
                    
                    $scope.$apply(function () {
                        $scope.presentationResearchfiles.file_name = imgdata.file_name;
                        $scope.presentationResearchfiles.file_location = imgdata.file_location;
                        if (angular.isDefined(imgdata.date)) {
                            $scope.presentationResearchfiles.date = imgdata.date;
                        }
                        if (angular.isDefined(imgdata.user_id)) {
                            $scope.presentationResearchfiles.user_id = imgdata.user_id;
                        }
                    });
                }
            }
        }

        $scope.removeFiles = function () {
            if (angular.isDefined($scope.presentaion_file.user_documents_id)) {
                var user_documents_id = $scope.presentaion_file.user_documents_id;
                var url = 'apiv4/public/user/deleterepresentaionfile';
                RequestDetail.getDetail(url, user_documents_id).then(function (result) {
                    $scope.presentaion_file = {};
                });
            }
        }
        $scope.removeResearchfiles = function () {
          
            if (angular.isDefined($scope.presentationResearchfiles.file_location) && angular.isDefined($scope.presentationResearchfiles.file_name) &&
                $scope.presentationResearchfiles.file_location != '' && $scope.presentationResearchfiles.file_name != '') {
                var data = new Object();
                data.file_location = $scope.presentationResearchfiles.file_location;
                data.file_name = $scope.presentationResearchfiles.file_name;
                var url = 'apiv4/public/user/deleteresearchfile';
               
                $scope.presentationResearchfiles.file_location = ''
                $scope.presentationResearchfiles.file_name = ''
                if (angular.isDefined($scope.presentationResearchfiles.filing_id)) {
                    $scope.presentationResearchfiles.filing_id = '';
                }
                
            }

            
        }
        $scope.deleteContact = function (item) {

            if (!angular.isUndefined(item)) {
                var index = $scope.profile.contacts.indexOf(item);
                var contactId = $scope.profile.contacts[index].contact_id;
                var url = 'apiv4/public/user/deleteContact';
                RequestDetail.getDetail(url, contactId).then(function (result) {
                    $scope.profile.contacts.splice(index, 1);
                });
            }
        }
        $scope.deletePresentation = function (presentation) {
            if (!angular.isUndefined(presentation)) {
                var index = $scope.profile.presentation_filings.indexOf(presentation);
                if (index >= 0 && angular.isDefined($scope.profile.presentation_filings[index]) && angular.isDefined($scope.profile.presentation_filings[index].id)
                    && $scope.profile.presentation_filings[index].id != '') {
                    var datas = $scope.profile.presentation_filings[index];
                    var url = 'apiv4/public/user/deletePresentation';
                    RequestDetail.getDetail(url, $scope.profile.presentation_filings[index]).then(function (result) {
                        $scope.profile.presentation_filings.splice(index, 1);
                    });
                }
            }
        }

        $scope.valCorpList = {};
        $scope.contactcorp = {};
        $scope.contactcorporatelistAdded = [];

        $scope.tags = {};
        $scope.tags.valMacroTags = '';
        $scope.tags.valMidTags = '';
        $scope.tags.valMicroTags = '';
        $scope.contacttags = {};
        $scope.contacttags.valMacroTags = '';
        $scope.contacttags.valMidTags = '';
        $scope.contacttags.valMicroTags = '';

        $scope.selectMacroTag = function (selected) {
            if (selected != undefined) {
                $scope.tags.valMacroTags = selected.title;
            }
        }
        $scope.selectMidTag = function (selected) {
            if (selected != undefined) {
                $scope.tags.valMidTags = selected.title;
            }
        }
        $scope.selectMicroTag = function (selected) {
            if (selected != undefined) {
                $scope.tags.valMicroTags = selected.title;
            }
        }

        $scope.selectcontactMacroTag = function (selected) {
            if (selected != undefined) {
                $scope.contacttags.valMacroTags = selected.title;
            }
        }
        $scope.selectcontactMidTag = function (selected) {
            if (selected != undefined) {
                $scope.contacttags.valMidTags = selected.title;
            }
        }
        $scope.selectcontactMicroTag = function (selected) {
            if (selected != undefined) {
                $scope.contacttags.valMicroTags = selected.title;
            }
        }

        $scope.selectCorporatelist = function (selected) {
            if (angular.isDefined(selected) && angular.isDefined(selected.originalObject) && angular.isDefined(selected.originalObject.id)
                && angular.isDefined(selected.originalObject.name)) {
                $scope.valCorpList = selected.originalObject;
            }
        }
        $scope.get_matched = function () {
            var tagUrl = 'apiv4/public/dashboard/get_auto_ticker';
            var params = $("#corporate_ticker").val();
            RequestDetail.getDetail(tagUrl, params).then(function (result) {
                $("#corporate_ticker").autocomplete({
                    source: result.data,
                    select: function (a, b) {
                        if (angular.isDefined(b.item.ticker_id) && b.item.ticker_id != '') {
                            var ob = new Object();
                            ob.id = b.item.ticker_id;
                            if (angular.isDefined(b.item.company_name) && b.item.company_name != '') {
                                ob.name = b.item.company_name;
                                if (angular.isDefined(b.item.value) && b.item.value != '') {
                                    ob.name += '(' + b.item.value + ')';
                                }
                            }
                            if (angular.isDefined(ob.name) && ob.name != '') {
                                var exist = 0
                                angular.forEach($scope.contactcorporatelistAdded, function (data, ind) {
                                    if (angular.isDefined(data.id) && data.id == b.item.ticker_id) {
                                        exist = 1;
                                    }
                                });
                                if (exist == 1) {
                                    alert("Already added in the list");
                                    return false;
                                } else {
                                    $scope.contactcorporatelistAdded.push(ob);
                                    $scope.contactcorp.valCorpList = '';
                                }
                            }
                        }
                    }
                });
            });
        }

        $scope.addMacroTag = function () {
            if ($scope.tags.valMacroTags != '') {
                if ($scope.industryTagsAdded.indexOf($scope.tags.valMacroTags) == -1) {
                    $scope.industryTagsAdded.push($scope.tags.valMacroTags);
                    $scope.tags.valMacroTags = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
                    //cmy profile edit
                } else {
                    alert("Already Added in the List");
                    $scope.tags.valMacroTags = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
                }
            }
        }
        $scope.addMidTag = function () {
            if ($scope.tags.valMidTags != '') {
                if ($scope.industryTagsAdded.indexOf($scope.tags.valMidTags) == -1) {
                    $scope.industryTagsAdded.push($scope.tags.valMidTags);
                    $scope.tags.valMidTags = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagMid');
                    
                } else {
                    alert("Already Added in the List");
                    $scope.tags.valMidTags = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
                }
            }
        }
        $scope.addMicroTag = function () {
            if ($scope.tags.valMicroTags != '') {
                if ($scope.industryTagsAdded.indexOf($scope.tags.valMicroTags) == -1) {
                    $scope.industryTagsAdded.push($scope.tags.valMicroTags);
                    $scope.tags.valMicroTags = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagMicro');
                    
                } else {
                    alert("Already Added in the List");
                    $scope.tags.valMicroTags = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
                }
            }
        }
        $scope.addcontactMacroTag = function () {
            if ($scope.contacttags.valMacroTags != '') {
                if ($scope.contactindustryTagsAdded.indexOf($scope.contacttags.valMacroTags) == -1) {
                    $scope.contactindustryTagsAdded.push($scope.contacttags.valMacroTags);
                    $scope.contacttags.valMacroTags = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
                    var url = 'apiv4/public/user/addcontactIndustryTag';
                    var params = {
                        type: 'put',
                        industryTags: $scope.contactindustryTagsAdded
                    };
                    RequestDetail.getDetail(url, params).then(function (result) {

                    });
                } else {
                    alert("Already Added in the List");
                    $scope.contacttags.valMacroTags = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
                }
            }
        }
        $scope.addcontactMidTag = function () {
            if ($scope.contacttags.valMidTags != '') {
                if ($scope.contactindustryTagsAdded.indexOf($scope.contacttags.valMidTags) == -1) {
                    $scope.contactindustryTagsAdded.push($scope.contacttags.valMidTags);
                    $scope.contacttags.valMidTags = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagMid');
                    var url = 'apiv4/public/user/addcontactIndustryTag';
                    var params = {
                        type: 'put',
                        industryTags: $scope.contactindustryTagsAdded
                    };
                    RequestDetail.getDetail(url, params).then(function (result) {

                    });
                } else {
                    alert("Already Added in the List");
                    $scope.contacttags.valMidTags = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
                }
            }
        }
        $scope.addcontactMicroTag = function () {
            if ($scope.contacttags.valMicroTags != '') {
                if ($scope.contactindustryTagsAdded.indexOf($scope.contacttags.valMicroTags) == -1) {
                    $scope.contactindustryTagsAdded.push($scope.contacttags.valMicroTags);
                    $scope.tags.valMicroTags = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagMicro');
                    var url = 'apiv4/public/user/addcontactIndustryTag';
                    var params = {
                        type: 'put',
                        industryTags: $scope.contactindustryTagsAdded
                    };
                    RequestDetail.getDetail(url, params).then(function (result) {

                    });
                } else {
                    alert("Already Added in the List");
                    $scope.contacttags.valMicroTags = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
                }
            }
        }

        $scope.addCorpList = function () {
            if (angular.isDefined($scope.valCorpList) && angular.isDefined($scope.valCorpList.id) && $scope.valCorpList.id != '') {
                if ($scope.corporatelistAdded.indexOf($scope.valCorpList) == -1) {
                    $scope.corporatelistAdded.push($scope.valCorpList);
                    $scope.valCorpList = {};
                    $scope.$broadcast('angucomplete-alt:clearInput', 'corpList');
                    var url = 'apiv4/public/user/addCorporateList';
                    var params = {
                        type: 'put',
                        corporateList: $scope.corporatelistAdded
                    };
                    RequestDetail.getDetail(url, params).then(function (result) {

                    });
                } else {
                    alert("Already Added in the List");
                    $scope.corp.valCorpList = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'corpList');
                }
            }
        }

        $scope.removeTag = function (item) {
            var index = $scope.industryTagsAdded.indexOf(item);
            $scope.industryTagsAdded.splice(index, 1);
            
        }

        $scope.showfilesharing = function () {
            $scope.presentationResearchfiles = {};
            $scope.presentationResearchfiles.presentation_files = [];
            $scope.presentationResearchfiles.presenter_details = [];
            $scope.fileSharing = !$scope.fileSharing;
        }
        $scope.editfilesharing = function (index) {
            $scope.presentationResearchfiles = {};
            var ind = $scope.profile.presentation_filings.indexOf(index);
            if (ind >= 0) {

                $scope.presentationResearchfiles = $scope.profile.presentation_filings[ind];
                if (angular.isDefined($scope.profile.presentation_filings[ind].presentation_date) && $scope.profile.presentation_filings[ind].presentation_date != '') {
                    $scope.presentationResearchfiles.presentation_date = new Date($scope.profile.presentation_filings[ind].presentation_date);
                }
                $scope.fileSharing = !$scope.fileSharing;
            }
        }

        $scope.addpresenter = function () {
            if (angular.isUndefined($scope.presentationResearchfiles.corporate_presenter_name) || $scope.presentationResearchfiles.corporate_presenter_name == '') {
                $('#corporate_presenter_name').attr('required', true);
                $('#corporate_presenter_name').focus();
                return false;
            }
            else {
                var ob = new Object();
                ob.name = $scope.presentationResearchfiles.corporate_presenter_name;
                if (angular.isDefined($scope.presentationResearchfiles.corporate_presenter_title) && $scope.presentationResearchfiles.corporate_presenter_title != '') {
                    ob.title = $scope.presentationResearchfiles.corporate_presenter_title;
                } else {
                    ob.title = '';
                }
                $scope.presentationResearchfiles.presenter_details.push(ob);
                $scope.presentationResearchfiles.corporate_presenter_name = '';
                $scope.presentationResearchfiles.corporate_presenter_title = '';
            }
        }

        $scope.removePresenterdetails = function (data) {
            if (angular.isDefined(data)) {
                var index = $scope.presentationResearchfiles.presenter_details.indexOf(data);
                if (index >= 0) {
                    $scope.presentationResearchfiles.presenter_details.splice(index, 1);
                }
            }
        }
        /*$scope.$watch("profile", function(){
        var url = "apiv4/public/user/editProfile";
        var params = {
            type : 'edit',
            params : $scope.profile
        };
          RequestDetail.getDetail(url,params).then(function(result){
    
          });
        }, true);*/

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

        if (usertype.getService() == 'corporate') {
            $scope.pageHeading = 'Corporate Profile';
        }

        $scope.saveResearchfillings = function () {
            if (angular.isUndefined($scope.presentationResearchfiles.presentation_title) || $scope.presentationResearchfiles.presentation_title == '') {
                $('#presentation_title').attr('required', true);
                $('#presentation_title').focus();
                alertService.add("warning", "Please enter presentation title !", 2000);
                return false;
            }
            if (angular.isUndefined($scope.presentationResearchfiles) || angular.isUndefined($scope.presentationResearchfiles.user_id)) {
                alertService.add("warning", "Please choose file !", 2000);
                return false;
            }
            var update_url = "apiv4/public/user/updateResearchfilings";
            var params = {
                type: 'edit',
                data: $scope.presentationResearchfiles
            };

            RequestDetail.getDetail(update_url, params).then(function (result) {
                if (angular.isDefined(result.data) && angular.isDefined(result.data.id) && result.data != 'failure') {
                    if (angular.isUndefined($scope.profile.presentation_filings)) {
                        $scope.profile.presentation_filings = [];
                    }
                    $scope.profile.presentation_filings.push(angular.copy(result.data));
                    $scope.fileSharing = false;
                    alertService.add("success", "Profile Updated Successfully !", 2000);

                } else {
                    alertService.add("warning", "Contact cannot edit at this time", 2000);
                }
            });
        }
        $scope.updateResearchfillings = function () {
            if (angular.isDefined($scope.presentationResearchfiles.id) && $scope.presentationResearchfiles.id != '') {

                if (angular.isUndefined($scope.presentationResearchfiles.presentation_title) || $scope.presentationResearchfiles.presentation_title == '') {
                    $('#presentation_title').attr('required', true);
                    $('#presentation_title').focus();
                    alertService.add("warning", "Please enter presentation title !", 2000);
                    return false;
                }
                if (angular.isUndefined($scope.presentationResearchfiles) || angular.isUndefined($scope.presentationResearchfiles.user_id)) {
                    alertService.add("warning", "Please choose file !", 2000);
                    return false;
                }
                var update_url = "apiv4/public/user/updateResearchfilings";
                var params = {
                    type: 'edit',
                    data: $scope.presentationResearchfiles
                };

                RequestDetail.getDetail(update_url, params).then(function (result) {
                    if (angular.isDefined(result.data) && angular.isDefined(result.data.id) && result.data != 'failure') {
                        angular.forEach($scope.profile.presentation_filings, function (dt, ind) {
                            if (angular.isDefined(dt.id) && dt.id != '' && dt.id == result.data.id) {
                                dt = angular.copy(result.data);
                            }
                        });
                        $scope.fileSharing = false;
                        alertService.add("success", "Profile Updated Successfully !", 2000);

                    } else {
                        alertService.add("warning", "Contact cannot edit at this time", 2000);
                    }
                });
            }
        }


        $scope.showModal = false;
        $scope.toggleModal = function (index) {
            $scope.contactindustryTagsAdded = [];
            $scope.contactcorporatelistAdded = [];
            $scope.contactEdit = $scope.profile.contacts[index];
            if (angular.isDefined($scope.profile.contacts[index].coveragelist) && $scope.profile.contacts[index].coveragelist.length > 0) {
                $scope.contactcorporatelistAdded = $scope.profile.contacts[index].coveragelist;
            }
            if (angular.isDefined($scope.profile.contacts[index].industrytag) && $scope.profile.contacts[index].industrytag.length > 0) {
                $scope.contactindustryTagsAdded = $scope.profile.contacts[index].industrytag;
            }
            // Assign the values to the variables
            $scope.update = true;
            $scope.insert = false;
            $scope.showModal = !$scope.showModal;
            $('#imgsrcdefault').show();
            $('#theDiv').html('');
        };

   

    })
    .controller('DemoFileUploadController', [
        '$scope', '$http', '$filter', '$window',
        function ($scope, $http) {
            $scope.options = {
                url: url,
                acceptFileTypes: /(\.|\/)(xls|xlsx|doc|docx)$/i
            };
            if (!isOnGitHub) {
                $scope.loadingFiles = true;
                $http.get(url)
                    .then(
                        function (response) {
                            $scope.loadingFiles = false;
                            // $scope.queue = response.data.files || [];
                        },
                        function () {
                            $scope.loadingFiles = false;
                        }
                    );
            }
        }
    ])
    .controller('FileDestroyController', [
        '$scope', '$http',
        function ($scope, $http) {
            var file = $scope.file,
                state;
            if (file.url) {
                file.$state = function () {
                    return state;
                };
                file.$destroy = function () {
                    state = 'pending';
                    return $http({
                        url: file.deleteUrl,
                        method: file.deleteType
                    }).then(
                        function () {
                            state = 'resolved';
                            $scope.clear(file);
                        },
                        function () {
                            state = 'rejected';
                        }
                    );
                };
            } else if (!file.$cancel && !file._index) {
                file.$cancel = function () {
                    $scope.clear(file);
                };
            }
        }
    ])

    .controller('rpprofilecoverageCtrl', function ($scope, $http, $location, localStorageService, $rootScope, usertype, validation, RequestDetail, $timeout, configdetails, alertService) {

        $scope.coveragelist = [];
        var url = "apiv4/public/user/getcoveragelist";
        var params = {};
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.coveragelist = result.data;
        });

        $scope.removeUser = function (index) {
            $scope.coveragelist.splice(index, 1);
        }

        $scope.addnewcoverage = function () {
            $scope.coveragelist.push({
                first_name: '',
                last_name: '',
                title: '',
                phone: '',
                email: '',
                industry_tag: [],
                coverage_list: [],
                biography: '',
                photo: 'images/no-imageman.jpg'
            });
        }
        // Get coverage list (table)
        $scope.import_coverage_excel = function (file) {
            $scope.filepath = [];
            $scope.$apply(function () {
                $scope.filepath.push({
                    file_name: file,
                    file_location: 'uploads/dashboarddata/' + file
                });

                var url = "apiv4/public/user/getexcelcoverage";
                var params = {
                    filedata: $scope.filepath
                };
                RequestDetail.getDetail(url, params).then(function (result) {
                    
                    if (result.data) {
                        $.each(result.data, function (index, coverage) {
                            coverage.photo = 'images/no-imageman.jpg';
                            $scope.coveragelist.push(coverage);

                        });
                    } else {
                        alertService.add("warning", "File Invalid !", 2000);
                    }


                });

            });

        }

        function chunk(arr, size) {
            var newArr = [];
            for (var i = 0; i < arr.length; i += size) {
                newArr.push(arr.slice(i, i + size));
            }
            return newArr;
        }
        // Get all Industry 
        var tagUrl = 'apiv4/public/user/get_search_details1';
        var params = {
            term: '',
            key: 'allindustry'
        };
        RequestDetail.getDetail(tagUrl, params).then(function (result) {
            if (angular.isDefined(result.data) && result.data.length > 0) {
                $scope.availableallIndustrydisplay = chunk(result.data, 29);
            } else {
                $scope.availableallIndustrydisplay = [];
            }
        });

        // Upload File
        $scope.uploadphotoFile = function (imgdata, index) {
            $scope.$apply(function () {
                $scope.coveragelist[index].photo = 'uploads/coveragephoto/' + imgdata;
            });
        }

        // Update Function
        $scope.updateCoverageList = function () {
            $scope.sendstatus = 1;
            if ($scope.coveragelist.length == 0) {
                alertService.add("warning", "Analyst List Invalid !", 2000);
                return false;
            }


            $.each($scope.coveragelist, function (index, val) {
                if (val.first_name == "") {
                    alertService.add("warning", "First name cannot be empty!", 2000);
                    $scope.sendstatus = 0;
                    return false;
                }
            });

            if ($scope.sendstatus) {
                var url = "apiv4/public/user/updatecoveragelist";
                var params = {
                    coveragelist: $scope.coveragelist
                };
                RequestDetail.getDetail(url, params).then(function (result) {
                    if (result.data.status == 'duplicate') {
                        alertService.add("warning", "Analyst email must be unique !", 2000);
                        return false;
                    } else {
                        alertService.add("success", "Updated Successfully !", 2000);
                        $location.path('companyprofile');
                    }

                });
            }

        }

        // Get Industry , Ticker data while Typing 
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
    })

    .controller('rpanalystprofileCtrl', function ($scope, $http, $location, localStorageService, $rootScope, usertype, validation, RequestDetail, $timeout, configdetails, alertService) {
        // Get previous datas 
        $scope.coveragelist = [];
        var url = "apiv4/public/user/listtocoveragelist";
        var params = {};
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.coveragelist = result.data;
        });


        var url = "apiv4/public/user/listtocoveragelistmarketfile";
        var params = {};
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.old_marketingFile = result.data;
        });

        var url = "apiv4/public/researchprovider/listrpevents";
        var params = {};
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.rpevents = result.data;
        });

        // Remove Files
        $scope.marketingFile = [];
        $scope.removeFiles = function (index) {
            $scope.marketingFile.splice(index, 1);
        }
        $scope.removeoldFiles = function (index) {
            $scope.old_marketingFile.splice(index, 1);
        }
        // Upload Files
        $scope.uploadmarketingFile = function (imgdata) {
            imgdata = JSON.parse(imgdata);

            $scope.$apply(function () {
                $scope.marketingFile.push({
                    file_name: imgdata.name,
                    file_location: 'uploads/analystfile/' + imgdata.uploadedname
                })
            });

        }

        $scope.uploadsamplefileuploadFile = function (imgdata, index) {
            $scope.$apply(function () {
                $scope.coveragelist[index].sample_file_location = 'uploads/analystfile/' + imgdata
                $scope.coveragelist[index].sample_file_name = imgdata;
            });
        }


        $scope.uploadfileuploadFile = function (imgdata, index) {
            $scope.$apply(function () {

                $scope.coveragelist[index].file_location = 'uploads/analystfile/' + imgdata
                $scope.coveragelist[index].file_name = imgdata;

            });

        }
        // Get previous file datas
        $scope.rpstep2 = function () {
            var url = "apiv4/public/user/updatecoveragepage";
            var params = {
                marketingFile: $scope.marketingFile,
                old_marketingFile: $scope.old_marketingFile,
                coveragelist: $scope.coveragelist
            };
            RequestDetail.getDetail(url, params).then(function (result) {
                alertService.add("success", "Updated Successfully !", 2000);
                $location.path('companyprofile');
            });
        }

        $scope.activate_analyst = function (id, index) {
            var url = "apiv4/public/user/activateanalyst";
            var params = {
                coveragelist_id: id
            };
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.coveragelist[index].random_id = result.data.random_id;
            });
        }
    })


    .controller('profilemarketingdeckCtrl', function ($scope, $http, $location, localStorageService, $rootScope, usertype, validation, RequestDetail, $timeout, configdetails, alertService) {
        // Get previous datas 
        


        var url = "apiv4/public/user/listtocoveragelistmarketfile";
        var params = {};
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.old_marketingFile = result.data;
        });

        
        // Remove Files
        $scope.marketingFile = [];
        $scope.removeFiles = function (index) {
            $scope.marketingFile.splice(index, 1);
        }
        $scope.removeoldFiles = function (index) {
            $scope.old_marketingFile.splice(index, 1);
        }
        // Upload Files
        $scope.uploadmarketingFile = function (imgdata) {
            imgdata = JSON.parse(imgdata);

            $scope.$apply(function () {
                $scope.marketingFile.push({
                    file_name: imgdata.name,
                    file_location: 'uploads/analystfile/' + imgdata.uploadedname
                })
            });

        }

        
        
        // Get previous file datas
        $scope.submitmarketingdesk = function () {
            var url = "apiv4/public/user/submitmarketingdesk";
            var params = {
                marketingFile: $scope.marketingFile,
                old_marketingFile: $scope.old_marketingFile,
            };
            RequestDetail.getDetail(url, params).then(function (result) {
                alertService.add("success", "Updated Successfully !", 2000);
                $location.path('companyprofile');
            });
        }

    })

    .controller('rphomeCtrl', function ($scope, $http, $location, localStorageService, $rootScope, usertype, validation, RequestDetail, $timeout, configdetails, alertService) {

        // For Industry Tags
        $scope.tags = {};
        $scope.tags.industry_tagsData = '';
        $scope.tags.valMacroTags = '';
        $scope.tags.valMidTags = '';
        $scope.tags.valMicroTags = '';
        $scope.industryTagsAdded = [];

        $scope.rpmenu = localStorageService.get('research_provider_status');
        // Remove and Upload Profile Logo
        $scope.logo_file = [];
        $scope.removeFileslogo = function (index) {
            $scope.logo_file.splice(index, 1);
        }
        $scope.removeFilesoldlogo = function (index) {
            $scope.logo_old_file.splice(index, 1);
        }

        $scope.uploadlogoFile = function (imgdata) {
            $scope.$apply(function () {
                $scope.logo_file = [];
                $scope.logo_old_file = [];

                $scope.logo_file.push({
                    file_name: imgdata,
                    file_location: 'uploads/temp/' + imgdata
                })
            });
        }

        $scope.upload_prf_img = function (imgdata) {
            $scope.$apply(function () {
                $scope.rpprofile.logo = 'uploads/profile/thumbnail/' + imgdata;
                $scope.rpprofile.image = 'uploads/profile/thumbnail/' + imgdata;
            });
        }

        // Industry Tags Added  By Jayapriya	18-08-2018
        $scope.selectMacroTag = function (selected) {
            if (selected != undefined) {
                $scope.tags.valMacroTags = selected.title;
            }
        }

        $scope.selectMidTag = function (selected) {
            if (selected != undefined) {
                $scope.tags.valMidTags = selected.title;
            }
        }

        $scope.selectMicroTag = function (selected) {
            if (selected != undefined) {
                $scope.tags.valMicroTags = selected.title;
            }
        }

        var tagUrl = 'apiv4/public/meeting/getAllIndustryTags';
        var params = {
            key: 'tags'
        };
        RequestDetail.getDetail(tagUrl, params).then(function (result) {
            $scope.macroTags = result.data.macro;
            $scope.midTags = result.data.mid;
            $scope.microTags = result.data.micro;
        });

        // Industry Tags Add Function
        $scope.addMacroTag = function () {
            if ($scope.tags.valMacroTags != '') {
                if ($scope.industryTagsAdded.indexOf($scope.tags.valMacroTags) == -1) {
                    $scope.industryTagsAdded.push($scope.tags.valMacroTags);
                    $scope.tags.valMacroTags = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
                } else {
                    alertService.add("warning", "Already entered this item!", 2000);
                    $scope.tags.valMacroTags = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
                }
            }
        }

        $scope.addMidTag = function () {
            if ($scope.tags.valMidTags != '') {
                if ($scope.industryTagsAdded.indexOf($scope.tags.valMidTags) == -1) {
                    $scope.industryTagsAdded.push($scope.tags.valMidTags);
                    $scope.tags.valMidTags = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagMid');
                } else {
                    alertService.add("warning", "Already entered this item!", 2000);
                    $scope.tags.valMidTags = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
                }
            }
        }

        $scope.addMicroTag = function () {
            if ($scope.tags.valMicroTags != '') {
                if ($scope.industryTagsAdded.indexOf($scope.tags.valMicroTags) == -1) {
                    $scope.industryTagsAdded.push($scope.tags.valMicroTags);
                    $scope.tags.valMicroTags = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagMicro');
                } else {
                    alertService.add("warning", "Already entered this item!", 2000);
                    $scope.tags.valMicroTags = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
                }
            }
        }

        

        //$scope.rpprofile.tags['Information Technology'] = true;

        $scope.savetags = function () {
           // //console.log($scope.rpprofile.tags);
            //$scope.rpprofile.tags = JSON.parse($scope.rpprofile.tags);
            angular.forEach($scope.rpprofile.tags, function (value, key) {
                
                if(value){
                    
                    if ($scope.industryTagsAdded.indexOf(key) == -1) {
                       // //console.log(key);
                        $scope.industryTagsAdded.push(key);
                    }
                }else{
                    var index = $scope.industryTagsAdded.indexOf(key);
                    if (index >= 0) {
                        $scope.industryTagsAdded.splice(index, 1);
                    }
                }
            });
           // //console.log($scope.industryTagsAdded);
        }

        $scope.industrypopup = function () {
            $scope.rpprofile.tags = {};
            angular.forEach($scope.industryTagsAdded, function (value, key) {
               
                $scope.rpprofile.tags[value]=true;
            });
        }
        

        //Removing Added Mutilple Datas - Remove Industry Tag
        $scope.removeTag = function (item) {
            $scope.industryTagsAdded.splice(item, 1);
        }
        // Sample File Upload and Remove
        $scope.sample_file = [];
        $scope.removeFiles = function (index) {
            $scope.sample_file.splice(index, 1);
        }
        $scope.removeoldFiles = function (index) {
            $scope.old_samples.splice(index, 1);
        }

        $scope.uploadsampleFile = function (imgdata) {
            var imgdata = JSON.parse(imgdata);
            $scope.$apply(function () {
                $scope.sample_file.push({
                    file_name: imgdata.name,
                    file_location: 'uploads/temp/' + imgdata.uploadedname
                })
            });
        }


        var industry_tag_url = 'apiv4/public/user/getIndustryTags';
        var params = {
            key: 'tags'
        }
        RequestDetail.getDetail(industry_tag_url, params).then(function (result) {
            var result = result.data;
            if (result != 0) {
                $scope.dataa = [];
                angular.forEach(result, function (value, key) {
                    $scope.dataa.push(value.name);
                });
                $scope.industryTagsAdded = $scope.dataa;
               
                
            }
        });
        // Get previous Datas
        $scope.logo_old_file = [];
        var url = "apiv4/public/user/get_user_providerprofile";
        var params = {};
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.rpprofile = result.data;

           // $scope.rpprofile.tags = [];

            $scope.rpprofile.assetclass = result.data.asset_classes.split(',');
            $scope.rpprofile.broker_geography = result.data.broker_geography.split(',');
            $scope.rpprofile.broker_industry = result.data.broker_industry.split(',');
            $scope.rpprofile.industry1 = {};
            $.each($scope.rpprofile.broker_industry, function (index, industry) {
                $scope.rpprofile.industry1[industry] = true;
            });

            if (result.data.capitalization) {
                $scope.rpprofile.capitalization = result.data.capitalization.split(',');
            }
            if (result.data.department) {
                $scope.rpprofile.department = result.data.department.split(',');
            }


            $scope.rpprofile.logo = result.data.image;
            $scope.old_samples = result.data.old_samples;

            if (result.data.image != "" && result.data.image != null) {
                var res = result.data.image.split("/");


                $scope.logo_old_file.push({
                    file_name: res[2],
                    file_location: result.data.image
                });
            }

        });

        //broker 
        $scope.availableDepartment = ['Research', 'Consulting', 'Software', 'Data', 'News', 'Other'];
        $scope.availableAssetclass = ['Equities & ETFs', 'Fixed Income', 'Commodities', 'FX & Currency', 'Alternative Assets and Derivatives', 'Real Estate','Debt'];
        $scope.availableCapitalization = ['Private/Pre-IPO', 'Small Cap (>$2Bn)', 'Medium Cap ($2-10Bn)', 'Large Cap ($10-100B)', 'Mega Cap (>$100B)','Distressed'];
        $scope.availableGeography = ['Global', 'US', 'Canada', 'Latin America', 'Europe', 'Russia', 'Japan', 'China', 'India', 'Asia', 'Australia', 'Middle East/Africa (MENA)', 'Emerging Markets', 'Frontier Markets'];

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
                                $scope.availableIndustry.push('All');
                            } else {
                                $scope.availableIndustry = [];
                            }
                        });
                    }
                    if (type == 'geography') {
                        $scope.availableGeography = ['Global', 'US', 'Canada', 'Latin America', 'Europe', 'Russia', 'Japan', 'China', 'India', 'Asia', 'Australia', 'Middle East/Africa (MENA)', 'Emerging Markets', 'Frontier Markets'];
                    }
                    if (type == 'department') {
                        $scope.availableDepartment = ['Research', 'Consulting', 'Software', 'Data', 'News', 'Other'];
                    }

                    if (type == 'assetclass') {
                        $scope.availableAssetclass = ['Equities & ETFs', 'Fixed Income', 'Commodities', 'FX & Currency', 'Alternative Assets and Derivatives', 'Real Estate'];
                    }
                    if (type == 'capitalization') {
                        $scope.availableCapitalization = ['Private/Pre-IPO', 'Small Cap (>$2Bn)', 'Medium Cap ($2-10Bn)', 'Large Cap ($10-100B)', 'Mega Cap (>$100B)'];
                    }

                }
            }
        }

        function chunk(arr, size) {
            var newArr = [];
            for (var i = 0; i < arr.length; i += size) {
                newArr.push(arr.slice(i, i + size));
            }
            return newArr;
        }
        // Get Industry department details
        var tagUrl = 'apiv4/public/user/get_search_details1';

        var params = {
            term: '',
            key: 'allindustry'
        };

        RequestDetail.getDetail(tagUrl, params).then(function (result) {
            if (angular.isDefined(result.data) && result.data.length > 0) {
                $scope.availableallIndustry = chunk(result.data, 29);
            } else {
                $scope.availableallIndustry = [];
            }
        });

        $scope.saveindustry = function () {
            $scope.rpprofile.broker_industry = [];
            $.each($scope.rpprofile.industry1, function (index, industry) {
                if (industry == true) {
                    $scope.rpprofile.broker_industry.push(index);
                }
            });
        }

        $scope.savedepartment = function () {
            $scope.rpprofile.department = [];


            $.each($scope.rpprofile.department1, function (index, department) {

                if (department == true) {
                    $scope.rpprofile.department.push(index);
                }

            });
        }
        $scope.saveassetclass = function () {

            $scope.rpprofile.assetclass = [];
            $.each($scope.rpprofile.assetclass1, function (index, assetclass) {
                
                if (assetclass == true) {
                    $scope.rpprofile.assetclass.push(index);
                }
            });
        }

        $scope.savecapitalization = function () {
            $scope.rpprofile.capitalization = [];
            $.each($scope.rpprofile.capitalization1, function (index, capitalization) {
                if (capitalization == true) {
                    $scope.rpprofile.capitalization.push(index);
                }
            });
        }

        $scope.savegeography = function () {
            $scope.rpprofile.broker_geography = [];
            $.each($scope.rpprofile.geography1, function (index, geography) {
                if (geography == true) {
                    $scope.rpprofile.broker_geography.push(index);
                }
            });
        }
        // Update Function
        $scope.update_rpdata = function () {

            if (angular.isUndefined($scope.rpprofile.company_name) || $scope.rpprofile.company_name == '') {
                alertService.add("warning", "Please Enter Company  !", 2000);
                return false;
            }
            if (angular.isUndefined($scope.rpprofile.c_address_1) || $scope.rpprofile.c_address_1 == '') {
                alertService.add("warning", "Please Enter Address #1  !", 2000);
                return false;
            }
            if (angular.isUndefined($scope.rpprofile.c_city) || $scope.rpprofile.c_city == '') {
                alertService.add("warning", "Please Enter City  !", 2000);
                return false;
            }
            if (angular.isUndefined($scope.rpprofile.c_state) || $scope.rpprofile.c_state == '') {
                alertService.add("warning", "Please Enter State  !", 2000);
                return false;
            }
            if (angular.isUndefined($scope.rpprofile.c_country) || $scope.rpprofile.c_country == '') {
                alertService.add("warning", " Please Enter Country  !", 2000);
                return false;
            }
            if (angular.isUndefined($scope.rpprofile.c_zip) || $scope.rpprofile.c_zip == '') {
                alertService.add("warning", "Please Enter Zip  !", 2000);
                return false;
            }
            if (angular.isUndefined($scope.rpprofile.year_founded) || $scope.rpprofile.year_founded == '') {
                alertService.add("warning", "Please Enter Year Founded  !", 2000);
                return false;
            }
            if (angular.isUndefined($scope.rpprofile.no_employees) || $scope.rpprofile.no_employees == '') {
                alertService.add("warning", "Please Enter No of Employees  !", 2000);
                return false;
            }
            if (angular.isUndefined($scope.rpprofile.no_analysts) || $scope.rpprofile.no_analysts == '') {
                alertService.add("warning", "Please Enter No of Analysts  !", 2000);
                return false;
            }

            if (angular.isUndefined($scope.rpprofile.department) || $scope.rpprofile.department == '') {
                alertService.add("warning", "Please Enter Type of Research  !", 2000);
                return false;
            }
            if (angular.isUndefined($scope.rpprofile.business_model) || $scope.rpprofile.business_model == '') {
                alertService.add("warning", "Please Enter Business Model  !", 2000);
                return false;
            }
            if (angular.isUndefined($scope.rpprofile.assetclass) || $scope.rpprofile.assetclass == '') {
                alertService.add("warning", "Please Enter Asset Classes Covered !", 2000);
                return false;
            }
            if (angular.isUndefined($scope.rpprofile.capitalization) || $scope.rpprofile.capitalization == '') {
                alertService.add("warning", "Please Enter Market Capitalization !", 2000);
                return false;
            }
            if (angular.isUndefined($scope.rpprofile.broker_industry) || $scope.rpprofile.broker_industry == '') {
                alertService.add("warning", "Please Enter Industry !", 2000);
                return false;
            }
            if (angular.isUndefined($scope.rpprofile.broker_geography) || $scope.rpprofile.broker_geography == '') {
                alertService.add("warning", "Please Enter Geographic Areas of Expertise !", 2000);
                return false;
            }

            var url = 'apiv4/public/user/addIndustryTag';
            var params = {
                type: 'put',
                industryTags: $scope.industryTagsAdded
            };
            RequestDetail.getDetail(url, params).then(function (result) {

            });

            var url = "apiv4/public/user/updateadminProf";
            var params = {
                'company_name': $scope.rpprofile.company_name,
                'website': $scope.rpprofile.website,
                'main_phone': $scope.rpprofile.phone,
                'c_address_1': $scope.rpprofile.c_address_1,
                'c_address_2': $scope.rpprofile.c_address_2,
                'city': $scope.rpprofile.c_city,
                'state': $scope.rpprofile.c_state,
                'country': $scope.rpprofile.c_country,
                'zip': $scope.rpprofile.c_zip,
                'utube': $scope.rpprofile.videourl,
                'c_description': $scope.rpprofile.c_description,
                'logo': $scope.rpprofile.logo,
                'industryTagsAdded': $scope.industryTagsAdded,
                'rpprofile': $scope.rpprofile,
                'sample_file': $scope.sample_file,
                'old_samples': $scope.old_samples,

            };
            RequestDetail.getDetail(url, params).then(function (result) {
                alertService.add("success", "Profile Updated Successfully !", 2000);
                $location.path('companyprofile');
            });


        }
    })

    .controller('accessCtrl', function ($scope, $http, $location, $routeParams, localStorageService, $rootScope, usertype, validation, RequestDetail, $timeout, configdetails, alertService, $window){

		 
		$scope.login = {};
		$scope.configdetails = configdetails;
		$scope.login.email = '';
		$scope.login.password = '';

		$scope.demorequest = {};
		$scope.demorequest.email = '';
		$scope.demorequest.name = '';
		$scope.demorequest.company_request_demo = '';

		$scope.contactrequest = {};
		$scope.contactrequest.email = '';
		$scope.contactrequest.name = '';
		$scope.contactrequest.company = '';
		$scope.contactrequest.msg = '';

		$scope.popupid = '';
		$scope.popupid = $routeParams.popupID;

		$scope.popupemail = $routeParams.email;

		$scope.forgot = {};
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

		
	
		$scope.showVideoModalonopen = false;
		if ($scope.popupid == 'video') {
			$scope.showVideoModalonopen = true;
		}
		$scope.showScorecardVideoModalonopen = false;
		if ($scope.popupid == 'scorecard_video') {
			$scope.showScorecardVideoModalonopen = true;
			
		}

		
		$scope.video_modal = function () {
			$scope.showVideoModalonopen = true;
		}

		
		$scope.video_modal_scorecard = function () {
			$scope.showScorecardVideoModalonopen = true;
		}

		if($scope.popupemail){
			var url = "apiv4/public/user/addvideowatchhistory";
			var params = {popupemail:$scope.popupemail};
			RequestDetail.getDetail(url, params).then(function (result) { // Result return
			})
		}

		$scope.Loginpopupo = function () {
			$scope.demo_modal = false;
			$location.path('login/auto');
		}
		
		$scope.sectors = [];

		var url = "apiv4/public/corporate/gethomesectors";
		var params = {};
		RequestDetail.getDetail(url, params).then(function (result) { // Result return
			////console.log(result.data);
			$scope.sectors = result.data;
			////console.log($scope.sectors);
		});

		$scope.types=['Research Spotlight','IR Fundamental','Stash','SPAC Fundamental'];

		$scope.spinnerResearchevent = true;

		var url = "apiv4/public/corporate/researchevent";
		var params = {};
		RequestDetail.getDetail(url, params).then(function (result) { // Result return
			$scope.researchevent = result.data;
			$scope.spinnerActive = false;
			$scope.spinnerResearchevent = false;
		});

		$scope.newsletterpopup = 'hidden';
		$scope.opennewsletterpopup = function () {
			$scope.newsletterpopup = '';
		}

		$scope.closenewsletterpopup = function () {
			$scope.newsletterpopup = 'hidden';
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
		
		$scope.checkemailval = function (email) {
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(String(email).toLowerCase());
		}

		$scope.innerdwidh = $window.innerWidth;

		if($scope.innerdwidh>760){
			$scope.banner1 = 'bring-foriegn-customer.webp';
			$scope.banner2 = 'proactivelly.webp';
			$scope.banner3 = 'access-analyse.webp';
			$scope.banner4 = 'indentify-investors.webp';
			$scope.banner5 = 'actionable-intro.webp';
		}else{
			$scope.banner1 = 'mobile-banner-introact-4.webp';
			$scope.banner2 = 'mobile-banner-introact-3.webp';
			$scope.banner3 = 'mobile-banner-introact-2.webp';
			$scope.banner4 = 'mobile-banner-introact-5.webp';
			$scope.banner5 = 'mobile-banner-introact.webp';
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
		
		
		

		/* Close Modal   11-09-2018  By Jayapriya */
		$scope.closeModalLogin = function () {
			$scope.login = {};
			$scope.login_modal = false;
			$scope.login_modal_class = 'hidden';
		}
		$scope.closeModalDemo = function () {
			$scope.demo_modal = false;
		}
		$scope.closeModalForget = function () {
			$scope.forget_modal = false;
		}
		$scope.closeModalvideo = function () {
			$scope.showVideoModalonopen = false;
		}
		$scope.closeModalScorecardvideo = function () {
			$scope.showScorecardVideoModalonopen = false;
		}
		
		/* Close Modal   11-09-2018  By Jayapriya */

		if (localStorageService.get('usertype') != null) {
			usertype.doService(localStorageService.get('usertype'));
		} else {
			//localStorageService.set('usertype','investor');
		}

		$scope.startAjax = function () {
			$http.get('your-server-endpoint')
		};
		$scope.startAjax1 = function () {
			$http.get('your-server-endpoint')
		};
		$scope.startAjax2 = function () {
			$http.get('your-server-endpoint')
		};

		// On click Demo Request Button
		$scope.RequestDemo = function () {
			if (!$scope.valid) {
				alertService.add("warning", "Please enter correct captcha!", 2000);
				return false;
			}
			var valid12 = validation.getEmpty($scope.demorequest);
			if (valid12 != 0) {
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

		// On click Contact Us Button
		$scope.SendContactMessage = function () {
			var valid = validation.getEmpty($scope.contactrequest);
			if (valid != 0) {
				alertService.add("warning", 'Name, Email, Company or Message Cannot be Empty !', 2000);
			} else {
				var url = "apiv4/public/user/contactformrequest";
				var params = $scope.contactrequest;
				RequestDetail.getDetail(url, params).then(function (result) { // Result return
					if (!angular.isUndefined(result.data) && result.data.status == "success") {
						alertService.add("success", 'Thanks! Your request submitted scuccessfully.', 2000);
						$scope.contactrequest.email = '';
						$scope.contactrequest.name = '';
						$scope.contactrequest.company = '';
						$scope.contactrequest.msg = '';
					} else {
						alertService.add("warning", 'Sorry! Please try again later.', 2000);
					}
				});
			}
		}

		$scope.post = [];
		$scope.page = '0';

		/*$http({
			url: 'getnews.php',
			data: 'page=' + $scope.page,
			method: 'post',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			} // set the headers so angular passing info as form data (not request payload)
		}).success(function (data) {
			if (data.length > '0') {
				$scope.post = data;
			}
		});*/

		$scope.gotodetails = function (id) {
			var base_url = '';
			if (window.location.host == 'demo.creativebees.in') {
				base_url = 'http://demo.creativebees.in/introact/';
			} else if (window.location.host == 'localhost') {
				base_url = 'http://localhost/introact/';
			} else if (window.location.host == 'intro-act.com' || window.location.host == 'www.intro-act.com') {
				base_url = 'https://www.intro-act.com/';
			} else {
				base_url = 'https://www.intro-act.com/';
			}
			window.location = base_url + 'blog.html#/blog/' + id;
		};




		$scope.resetPassword = function () {
			//$scope.email = 'thiran15@gmail.com';
			////console.log($scope.forgot.email);
			if (angular.isDefined($scope.forgot.email) && $scope.forgot.email != '') {
				var url = "apiv4/public/user/reset";
				var params = $scope.forgot.email;
				$scope.spinnerActive = true;
				RequestDetail.getDetail(url, params).then(function (result) {
					if (result.data == 'true') {
						alertService.add("success", 'Kindly check your inbox!', 2000);
						$location.path('/login');
					} else {
						alertService.add("warning", 'Email id is not exists!', 2000);
					}
					$scope.spinnerActive = false;
				});
			} else {
				alertService.add("warning", 'Email id is not valid!', 2000);
			}
		}



		

		$scope.loginpopup = function () {
			//  ******************** To avoid the api calling second time in same page Store in the variable and fetched the data ising $index value
			//$scope.values = $scope.FetchedData.items[index];
			// Assign the values to the variables
			$scope.login_modal = !$scope.login_modal;
			$scope.login_modal_class = '';
		};




		$scope.forget_modal = false;
		$scope.forgotPasswordopen = function () {
			//  ******************** To avoid the api calling second time in same page Store in the variable and fetched the data ising $index value
			//$scope.values = $scope.FetchedData.items[index];
			// Assign the values to the variables
			$scope.login_modal = !$scope.login_modal;
			$scope.forget_modal = !$scope.forget_modal;
		};


		$scope.demo_modalopen = function () {
			// closeModalLogin(); called for the link request demo added in sign in popup box  --Added By Jayapriya on 11-01-2019
			$scope.closeModalLogin();
			$scope.demo_modal = !$scope.demo_modal;
		};


		$scope.showVideoModal = false;
		$scope.toggleVideoModal = function () {
			//  ******************** To avoid the api calling second time in same page Store in the variable and fetched the data ising $index value
			//$scope.values = $scope.FetchedData.items[index];
			// Assign the values to the variables
			$scope.showVideoModal = !$scope.showVideoModal;
		};


	})
	.controller('logout', function ($scope, $http, $location, $routeParams, localStorageService, $rootScope, usertype, validation, RequestDetail, $timeout, configdetails, alertService) {
		var url = "apiv4/public/user/logout";
		var params = {
			params: 'logout'
		}
		RequestDetail.getDetail(url, params).then(function (result) {
			localStorageService.clearAll();
			window.location.href = "";
		});
	})
	.controller('autologinCtrl', function ($scope, $http, $location, $routeParams, localStorageService, $rootScope, usertype, validation, RequestDetail, $timeout, configdetails, alertService,$window) {
		$scope.userid = $routeParams.userid;

		$scope.spinnerActive = true;

		var url = "apiv4/public/user/autologin";
		var params = {
			userid: $scope.userid
		};
		//  var getType = RequestDetail.getDetail(url,params);
		RequestDetail.getDetail(url, params).then(function (result) { // Result return

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

			
				$location.path('login');
	
				if (isurl && isurl != '' && isurl != '/login/auto' && isurl != '/login' && isurl != '/login/demo') {
				//	localStorageService.set('url', '');
				} else {
					
				}

				
			}

			/*if (!angular.isUndefined(result.data) && result.data.status == "success") {
				localStorageService.clearAll();

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

				if (userType == 4) {
					$location.path('scorecard');
				}else{
					$location.path('dashboard');
				}
				


			}*/
		});

	})
	.controller('registerCtrl', function ($scope, $http, $location, localStorageService, $rootScope, usertype, validation, RequestDetail, $timeout, configdetails, alertService) {

		$scope.box_choosetype = true;
		$scope.box_brokercode = false;
		$scope.box_personaldata = false;
		$scope.box_priceplandata = false;

		$scope.data = {};
		$scope.datacorporate = {};
		$scope.datainvestor = {};
		$scope.databroker = {};

		$scope.company_logo = {};
		$scope.profile_logo = {};

		$scope.data.email = "";

		//test data
		// $scope.data.firstname = "dhamu";
		// $scope.data.lastname ="thiran";
		// $scope.data.title = "Developer";
		// $scope.data.phonenumber = "9944432822";
		// $scope.data.email = "thiran52@gmail.com";
		// $scope.data.password = "123456";
		// $scope.data.confirm_password = "123456";
		// $scope.data.address1 = "my test addess";
		// $scope.data.city = "Tirupur";
		// $scope.data.state = "Tirupur";
		// $scope.data.country = "INDIA";
		// $scope.data.zip = "645678";
		// $scope.datacorporate.company_ticker = "AAPLAS"
		// $scope.data.company_name = "Creativebees";
		// $scope.data.website="creativebees.in	";
		// $scope.data.description = "test descriptino";
		// $scope.data.cmy_address1="test company address";
		// $scope.data.cmy_city = "testcmycity";
		// $scope.data.cmy_state="testcmystate";
		// $scope.data.cmy_country="testcmycountry";
		// $scope.data.cmy_zip="123121";
		// $scope.data.company_ticker="test cmy ticker";
		// $scope.datainvestor.aum = 1;
		// $scope.datainvestor.holding_period = 1;
		// $scope.datainvestor.institution_type =1;
		// $scope.datainvestor.style = 1;



		$scope.steptwotext = "User and Company info";
		$scope.stepthreetext = "Select Price Plan";



		//set all input 
		$scope.selectedusertype = ""; // corporate or investor or broker

		//first select usertype
		$scope.choosetype = function (selectedusertype) {
			$scope.selectedusertype = selectedusertype;

			if ($scope.selectedusertype == 'broker') {
				$scope.steptwotext = "Enter Broker Code";
				$scope.stepthreetext = "Registration of individual";
			} else {
				$scope.steptwotext = "User and Company info";
				$scope.stepthreetext = "Select Price Plan";
			}
		}



		$scope.backtoselect = function () {
			$scope.box_choosetype = true;
			$scope.box_personaldata = false;
			$scope.box_priceplandata = false;
			$scope.box_brokercode = false;
		}


		$scope.showlaststep = function () {


			/*	if($scope.selectedusertype=='broker'){
					if($scope.databroker.broker_code!=""){
						$scope.box_personaldata = true;
						$scope.box_brokercode = false;
						$scope.box_priceplandata = false;
					}else{
						alertService.add("warning", "Please enter broker code!",2000);
					   return false;
					}
					
				}else{
					$scope.box_personaldata = false;
					$scope.box_priceplandata = true;
				}*/

		}


		//first select usertype
		$scope.selecttype = function (selectedusertype) { // step 1 to step 2
			$scope.box_priceplandata = false;
			if ($scope.selectedusertype != "") {
				$scope.box_choosetype = false;

				if ($scope.selectedusertype == 'broker') {
					$location.path('RPregistration');
					//$scope.box_brokercode = true;
					//$scope.box_personaldata = false;
				} else {
					$scope.box_personaldata = true;
					$scope.box_brokercode = false;
				}
			} else {
				alertService.add("warning", "Please select usertype!", 2000);
				return false;
			}
		}

		$scope.error_email_already_exists = false;
		$scope.error_email_empty = false;
		$scope.error_email_invalid = false;
		$scope.error_password_notmatched = false;
		$scope.error_email_already_exists_set = 0;

		$scope.checkmail = function () {

			$scope.error_email_already_exists = false;
			$scope.error_email_empty = false;
			$scope.error_email_invalid = false;
			$scope.error_password_notmatched = false;

			if ($scope.data.email != "") {
				if (!$scope.checkemailval($scope.data.email)) {
					$scope.error_email_invalid = true;
					return false;
				} else {
					var CheckmailURL = 'apiv4/public/user/checkEmail';

					var params = {
						email: $scope.data.email
					};
					RequestDetail.getDetail(CheckmailURL, params).then(function (result) {

						if (result.data.user == 0) {
							$scope.error_email_already_exists = false;
							$scope.error_email_already_exists_set = 0;
						} else {
							$scope.error_email_already_exists = true;
							$scope.error_email_already_exists_set = 1;
							return false;
						}
					});
				}
			} else {
				$scope.error_email_empty = true;
				return false;
			}


		}


		$scope.checkemailval = function (email) {
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(String(email).toLowerCase());
		}
		$scope.checkpassword = function () {

			if ($scope.data.password == $scope.data.confirm_password) {
				$scope.error_password_notmatched = false;
			} else {
				$scope.error_password_notmatched = true;
			}

		}




		$scope.uploadFile = function (files) {
			$scope.data.image = 'uploads/profile/thumbnail/'+files;
		};

		$scope.company_logo = [];
		$scope.data.cmylogo = "";
		$scope.fileuploadcmylogo = function (imgdata) {
			$scope.$apply(function () {
				$scope.company_logo = [];
				$scope.company_logo.push({
					file_name: imgdata,
					file_location: 'uploads/Profile_Image/' + imgdata
				})

				$scope.data.cmylogo = 'uploads/Profile_Image/' + imgdata;
			});
		}



		// Autocomplete Company name 
		$scope.get_auto_company = function () {
			if ($scope.selectedusertype == 'investor') {
				var tagUrl = 'apiv4/public/dashboard/get_company_names';
				var params = $('#company_name').val();
				RequestDetail.getDetail(tagUrl, params).then(function (result) {
					$("#company_name").autocomplete({
						source: result.data,
						select: function (a, b) {

							$timeout(function () {
								$("#company_name").trigger('input');
							}, 0);

							var getcmy_val = 'apiv4/public/dashboard/get_auto_ticker_invcompany_profile';
							var ticker = b.item.value;

							RequestDetail.getDetail(getcmy_val, ticker).then(function (result) {
								if (result.data.count != '0') {
									//$scope.button_disable=[];
									$scope.data.company_name = result.data.value;
									$scope.datainvestor.company_id = result.data.company_id;
									$scope.data.website = result.data.website;
									$scope.data.cmy_city = result.data.city;
									$scope.data.cmy_state = result.data.state;
									$scope.data.cmy_country = result.data.country;
									$scope.data.cmy_zip = result.data.zip;
									$scope.data.description = result.data.description;
									$scope.data.cmy_address1 = result.data.address;
									$scope.data.cmy_address1 = result.data.address2;
									//$scope.button_disable=true;
									//$scope.same_address=false;
								} else {
									// $scope.button_disable=[];
									$scope.data.company_name = b.item.value;
									$scope.datainvestor.company_id = b.item.company_id;
									$scope.data.website = b.item.website;
									$scope.data.city = b.item.city;
									$scope.data.cmy_state = b.item.state;
									$scope.data.cmy_country = b.item.country;
									$scope.data.cmy_zip = b.item.zip;
									$scope.data.description = b.item.description;
									$scope.data.cmy_address1 = b.item.address;
									$scope.data.cmy_address2 = b.item.address2;
									// $scope.button_disable=true;
									//$scope.same_address=false;
								}
							});
						}
					});
				});
			}
		}





		$scope.get_auto_ticker = function () {

			var tagUrl = 'apiv4/public/dashboard/get_auto_ticker_stock_cmy';
			var params = $("#ticker_list").val();
			RequestDetail.getDetail(tagUrl, params).then(function (result) {


				$("#ticker_list").autocomplete({
					source: result.data,
					select: function (a, b) {

						$timeout(function () {
							$("#ticker_list").trigger('input');
						}, 0);


						var getcmy_val = 'apiv4/public/dashboard/get_auto_ticker_company_profile';
						var ticker = b.item.value;
						RequestDetail.getDetail(getcmy_val, ticker).then(function (result) {

							if (result.data.count != '0') {

								//  $scope.button_disable=[];
								$scope.datacorporate.company_ticker = result.data.value;
								$scope.datacorporate.ticker_id = result.data.ticker_id;
								$scope.data.company_name = result.data.company_name;
								$scope.data.website = result.data.website;
								$scope.data.cmy_city = result.data.city;
								$scope.data.cmy_state = result.data.state;
								$scope.data.cmy_country = result.data.country;
								$scope.data.cmy_zip = result.data.zip;
								$scope.data.description = result.data.description;
								$scope.data.cmy_address1 = result.data.address;
								$scope.data.cmy_address2 = result.data.address2;
								//$scope.button_disable=true;
								//$scope.same_address=false;

								$scope.data.cmylogo = result.data.logo;


							} else {
								// $scope.button_disable=[];
								$scope.datacorporate.company_ticker = b.item.value;
								$scope.datacorporate.ticker_id = b.item.ticker_id;
								$scope.data.company_name = b.item.company_name;
								$scope.data.website = b.item.website;
								$scope.data.cmy_city = b.item.city;
								$scope.data.cmy_state = b.item.state;
								$scope.data.cmy_country = b.item.country;
								$scope.data.cmy_zip = b.item.zip;
								$scope.data.description = b.item.description;
								$scope.data.cmy_address1 = b.item.address;
								$scope.data.cmy_address2 = b.item.address2;

								$scope.data.cmylogo = "";
								//$scope.button_disable=true;
								// $scope.same_address=false;
							}
						});
					}
				});
			});
		}



		$scope.check_broker_code = function () {
			$scope.errorbrokercode = false;

			var url = "apiv4/public/user/check_broker_code";
			var params = $scope.databroker.broker_code;

			if (!params) {
				$scope.errorMsg = 'Enter Broker Code ! ';
				$scope.errorbrokercode = true;

				return false;
			}


			RequestDetail.getDetail(url, params).then(function (result) {

				if (angular.isDefined(result.data) && result.data != '') {

					angular.forEach(result.data, function (broker) {
						//$scope.broker_codes='';
						//$scope.button_disable=[];
						//$scope.broker_code = false;
						//$scope.data.broker_code = broker.broker_code;
						$scope.data.company_name = broker.company_name;
						$scope.data.website = broker.website;
						$scope.data.cmy_city = broker.city;
						$scope.data.cmy_state = broker.state;
						$scope.data.cmy_country = broker.country;
						$scope.data.cmy_zip = broker.zip;
						$scope.data.cmy_address1 = broker.address;
						$scope.data.cmy_address2 = broker.address2;
						//$scope.button_disable=true;


					});
					$scope.box_brokercode = false;
					$scope.box_personaldata = true;
				} else {
					$scope.errorMsg = 'Broker Code Not Matched ! ';
					$scope.errorbrokercode = true;
				}
			});
		};


		//broker 
		$scope.availableDepartment = ['Research', 'Consulting', 'Software', 'Data', 'News', 'Other'];
		$scope.availableAssetclass = ['Equities & ETFs', 'Fixed Income', 'Commodities', 'FX & Currency', 'Alternative Assets and Derivatives', 'Real Estate'];
		$scope.availableCapitalization = ['Private/Pre-IPO', 'Small Cap (>$2Bn)', 'Medium Cap ($2-10Bn)', 'Large Cap ($10-100B)', 'Mega Cap (>$100B)'];
		$scope.availableGeography = ['Global', 'US', 'Canada', 'Latin America', 'Europe', 'Russia', 'Japan', 'China', 'India', 'Asia', 'Australia', 'Middle East/Africa (MENA)', 'Emerging Markets', 'Frontier Markets'];

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
								$scope.availableIndustry.push('All');
							} else {
								$scope.availableIndustry = [];
							}
						});
					}
					if (type == 'geography') {
						$scope.availableGeography = ['Global', 'US', 'Canada', 'Latin America', 'Europe', 'Russia', 'Japan', 'China', 'India', 'Asia', 'Australia', 'Middle East/Africa (MENA)', 'Emerging Markets', 'Frontier Markets'];
					}
					if (type == 'department') {
						$scope.availableDepartment = ['Research', 'Consulting', 'Software', 'Data', 'News', 'Other'];
					}

					if (type == 'assetclass') {
						$scope.availableAssetclass = ['Equities & ETFs', 'Fixed Income', 'Commodities', 'FX & Currency', 'Alternative Assets and Derivatives', 'Real Estate'];
					}
					if (type == 'capitalization') {
						$scope.availableCapitalization = ['Private/Pre-IPO', 'Small Cap (>$2Bn)', 'Medium Cap ($2-10Bn)', 'Large Cap ($10-100B)', 'Mega Cap (>$100B)'];
					}

				}
			}
		}

		function chunk(arr, size) {
			var newArr = [];
			for (var i = 0; i < arr.length; i += size) {
				newArr.push(arr.slice(i, i + size));
			}
			return newArr;
		}

		var tagUrl = 'apiv4/public/user/get_search_details1';

		var params = {
			term: '',
			key: 'allindustry'
		};
		RequestDetail.getDetail(tagUrl, params).then(function (result) {
			if (angular.isDefined(result.data) && result.data.length > 0) {
				$scope.availableallIndustry = chunk(result.data, 29);
				
			} else {
				$scope.availableallIndustry = [];
			}
		});

		$scope.saveindustry = function () {
			////console.log($scope.step2.industry1);
			$scope.databroker.industry = [];
			$.each($scope.databroker.industry1, function (index, industry) {
				if (industry == true) {
					$scope.databroker.industry.push(index);
				}
			});
		}

		$scope.savedepartment = function () {
			////console.log($scope.step2.industry1);
			$scope.databroker.department = [];
			$.each($scope.databroker.department1, function (index, department) {
				$scope.databroker.department.push(index);
			});
		}
		$scope.saveassetclass = function () {
			////console.log($scope.step2.industry1);
			$scope.databroker.assetclass = [];
			$.each($scope.databroker.assetclass1, function (index, assetclass) {

				$scope.databroker.assetclass.push(index);
			});
		}

		$scope.savecapitalization = function () {
			////console.log($scope.step2.industry1);
			$scope.databroker.capitalization = [];
			$.each($scope.databroker.capitalization1, function (index, capitalization) {

				$scope.databroker.capitalization.push(index);
			});
		}

		$scope.savegeography = function () {
			////console.log($scope.step2.industry1);
			$scope.databroker.geography = [];
			$.each($scope.databroker.geography1, function (index, geography) {

				$scope.databroker.geography.push(index);
			});
		}



		$scope.register_datacheck = function () {

			// NEED TO IMPLEMENT ASYNC CALL, BOTH BELOW VALIDATIONS FOR EMAIL AND PASSWORDS ARE NOT WORKING - VARUN 30 AUGUST 2018
			$scope.checkmail();
			$scope.checkpassword();

			$scope.error_firstname = false;

			

			if ($scope.error_email_already_exists_set==1) {
				alertService.add("warning", "Email ID already exists!", 2000);
				return false;
			}
			if ($scope.error_password_notmatched == true) {
				alertService.add("warning", "password does't match!", 2000);
				return false;
			}
			if ($scope.errorbrokercode == true) {
				alertService.add("warning", "Enter Broker Code!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.data.firstname) || $scope.data.firstname == '') {
				alertService.add("warning", "Please enter First Name!", 2000);
				//$scope.error_firstname = true;
				angular.element('#firstname').focus()
				return false;
			}
			if (angular.isUndefined($scope.data.lastname) || $scope.data.lastname == '') {
				alertService.add("warning", "Please enter Last Name!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.data.title) || $scope.data.title == '') {
				alertService.add("warning", "Please enter Title!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.data.phonenumber) || $scope.data.phonenumber == '') {
				alertService.add("warning", "Please enter valid Phone Number!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.data.email) || $scope.data.email == '') {
				alertService.add("warning", "Please enter Email!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.data.password) || $scope.data.password == '') {
				alertService.add("warning", "Please enter Password!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.data.confirm_password) || $scope.data.confirm_password == '') {
				alertService.add("warning", "Please enter Confirm Password!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.data.address1) || $scope.data.address1 == '') {
				alertService.add("warning", "Please enter Street Address!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.data.city) || $scope.data.city == '') {
				alertService.add("warning", "Please enter City!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.data.state) || $scope.data.state == '') {
				alertService.add("warning", "Please enter State!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.data.country) || $scope.data.country == '') {
				alertService.add("warning", "Please select Country!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.data.zip) || $scope.data.zip == '') {
				alertService.add("warning", "Please enter Zip!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.data.company_name) || $scope.data.company_name == '') {
				alertService.add("warning", "Please enter Company Name!", 2000);
				return false;
			}

			if (angular.isUndefined($scope.data.website) || $scope.data.website == '') {
				alertService.add("warning", "Please enter Website!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.data.description) || $scope.data.description == '') {
				alertService.add("warning", "Please enter Description!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.data.cmy_address1) || $scope.data.cmy_address1 == '') {
				alertService.add("warning", "Please enter Company Address!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.data.cmy_city) || $scope.data.cmy_city == '') {
				alertService.add("warning", "Please enter Company City!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.data.cmy_state) || $scope.data.cmy_state == '') {
				alertService.add("warning", "Please enter Company State!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.data.cmy_country) || $scope.data.cmy_country == '') {
				alertService.add("warning", "Please enter Company Country!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.data.cmy_zip) || $scope.data.cmy_zip == '') {
				alertService.add("warning", "Please enter Company Zip!", 2000);
				return false;
			}
			if ($scope.selectedusertype == 'corporate') {
				if (angular.isUndefined($scope.datacorporate.company_ticker) || $scope.datacorporate.company_ticker == '') {
					alertService.add("warning", "Please enter Company Ticker!", 2000);
					return false;
				}
			}

			if ($scope.selectedusertype == 'investor') {

				if (angular.isUndefined($scope.datainvestor.aum) || $scope.datainvestor.aum == '') {
					alertService.add("warning", "Please select AUM!", 2000);
					return false;
				}
				if (angular.isUndefined($scope.datainvestor.holding_period) || $scope.datainvestor.holding_period == '') {
					alertService.add("warning", "Please select Holding Period!", 2000);
					return false;
				}
				if (angular.isUndefined($scope.datainvestor.institution_type) || $scope.datainvestor.institution_type == '') {
					alertService.add("warning", "Please select Institution Type!", 2000);
					return false;
				}
				if (angular.isUndefined($scope.datainvestor.style) || $scope.datainvestor.style == '') {
					alertService.add("warning", "Please select Style!", 2000);
					return false;
				}

			}

			if ($scope.selectedusertype == 'broker') {
				if (angular.isUndefined($scope.databroker.department) || $scope.databroker.department == '') {
					alertService.add("warning", "Type of Research Invalid !", 2000);
					return false;
				}
				if (angular.isUndefined($scope.databroker.business) || $scope.databroker.business == '') {
					alertService.add("warning", "Business Model Invalid !", 2000);
					return false;
				}
				if (angular.isUndefined($scope.databroker.assetclass) || $scope.databroker.assetclass == '') {
					alertService.add("warning", "Asset Classes Covered Invalid !", 2000);
					return false;
				}
				if (angular.isUndefined($scope.databroker.capitalization) || $scope.databroker.capitalization == '') {
					alertService.add("warning", "Market Capitalization Invalid !", 2000);
					return false;
				}
				if (angular.isUndefined($scope.databroker.industry) || $scope.databroker.industry == '') {
					alertService.add("warning", "Industry Invalid !", 2000);
					return false;
				}
				if (angular.isUndefined($scope.databroker.geography) || $scope.databroker.geography == '') {
					alertService.add("warning", "Geographic Areas of Expertise Invalid !", 2000);
					return false;
				}



			} else {
				$scope.box_personaldata = false;
				$scope.box_priceplandata = true;
				window.scrollTo(0, 100);
			}



		}


		

		$scope.registerring = true;

		$scope.addregister = function (payment_option) {
			if (angular.isUndefined($scope.data.agreed) || !$scope.data.agreed) {
				alertService.add("warning", "You must agree terms and conditions!", 2000);
				return false;
			}
			$scope.spinnerActive = true;
			if ($scope.registerring) {
				$scope.registerring = false;
				var registerurl = 'apiv4/public/user/register';
				var params = {
					selectedusertype: $scope.selectedusertype,
					input: $scope.data,
					datacorporate: $scope.datacorporate,
					datainvestor: $scope.datainvestor,
					databroker: $scope.databroker,
					payment_option: payment_option
				};
				RequestDetail.getDetail(registerurl, params).then(function (result) {
					if (angular.isDefined(result.data) && result.data != '') {
						localStorageService.set('usertype', $scope.selectedusertype);
						localStorageService.set('userdata', result.data);
						localStorageService.set('userimage', result.data.image);
						localStorageService.set('password', result.data.password);
						localStorageService.set('email', result.data.email);
						localStorageService.set('admincontroluser', result.data.admincontroluser);

						if (localStorageService.get('url') != '') {
							$location.path(localStorageService.get('url'));
						} else {
							$timeout(function () {
								$scope.spinnerActive = false;
								$location.path('dashboard');
							}, 2000);
						}
					}

				});
			}

		}

	})


	.controller('registerCtrl_old', function ($scope, $http, $location, localStorageService, $rootScope, usertype, validation, RequestDetail, $timeout, configdetails) {
		$scope.configdetails = configdetails;
		$scope.box_step1 = true;
		$scope.box_step2 = false;
		$scope.box_step3 = false;
		$scope.box_step4 = false;
		$scope.box_step30 = false;
		$scope.stepStatus = '1';
		$scope.reached = 1;
		$scope.stepActive1 = 'step-active pointer';
		$scope.dashActive1 = '';
		$scope.textActive1 = 'no-border';
		$scope.textCompleted1 = '';
		$scope.errorMsg = '';

		$scope.step2 = {};
		$scope.step2.country = '';
		$scope.step2.firstname = '';
		$scope.step2.lastname = '';
		$scope.step2.title = '';

		//research provider
		$scope.step2.website = '';
		//research provider

		$scope.step2.email = '';
		$scope.step2.password = '';
		$scope.step2.phone = '';
		$scope.step2.address1 = '';
		$scope.address2 = '';
		$scope.step2.city = '';
		$scope.step2.state = '';
		$scope.step2.zip = '';
		$scope.step2.department = '';

		$scope.step2.business = '';
		$scope.step2.assetclass = '';
		$scope.step2.capitalization = '';

		$scope.step2.industry = [];
		$scope.step2.geography = [];

		$scope.step2.industry1 = [];

		$scope.name = '';





		$scope.step3 = {};
		$scope.step3.companyName = '';
		$scope.step3.ticker = '';
		$scope.website = '';
		$scope.step3.streetAddress1 = '';
		$scope.step3.city = '';
		$scope.step3.state = '';
		$scope.step3.country = '';
		$scope.step3.zip = '';
		$scope.streetAddress2 = '';
		$scope.spinnerActive = false;
		$scope.corporate_id = '';
		$scope.usertypeSelect = '';
		$scope.corporateSelect = '';
		$scope.investorSelect = '';
		$scope.brokerSelect = '';
		$scope.paymentActive1 = '';
		$scope.paymentActive2 = '';
		$scope.paymentActive3 = '';
		var pa = 'paymentActive';
		$scope.corporate_list = [];
		$scope.corporatelistAdded = [];
		$scope.valCorpList = {};
		$scope.same_address = '';
		$scope.emailprocess = false;

		$scope.updateEmailprocess = function (val) {
			$scope.emailprocess = val;
		}

		$scope.copy_address = function () {
			if ($scope.same_address == true) {
				$scope.step3.streetAddress1 = $scope.step2.address1;
				$scope.streetAddress2 = $scope.step2.address2;
				$scope.step3.city = $scope.step2.city
				$scope.step3.state = $scope.step2.state;
				$scope.step3.zip = $scope.step2.zip;
				$scope.step3.country = $scope.step2.country;

			} else {
				$scope.step3.streetAddress1 = '';
				$scope.streetAddress2 = '';
				$scope.step3.city = '';
				$scope.step3.state = '';
				$scope.step3.zip = '';
				$scope.step3.country = '';
			}
		}


		var coverage_url = 'apiv4/public/user/getcorporatedetails';

		/*RequestDetail.getDetail(coverage_url).then(function(result){
		    if(angular.isDefined(result.data) && angular.isDefined(result.data.corporate_data) && result.data.corporate_data.length>0){
		        $scope.corporate_list = result.data.corporate_data;
		    }
		});*/

		/*var coverage_url = 'apiv4/public/user/primary_interests';

		RequestDetail.getDetail(coverage_url).then(function(result){
		    if(angular.isDefined(result.data) && result.data.length>0){
		        $scope.primary_interests = result.data;
		    }
		});*/





		$scope.coveragefile = [];
		$scope.removeFilescoverage = function (index) {
			$scope.coveragefile.splice(index, 1);
		}

		$scope.uploadFilecov = function (imgdata) {

			$scope.$apply(function () {
				$scope.coveragefile = [];
				$scope.coveragefile.push({
					file_name: imgdata,
					file_location: 'uploads/temp/' + imgdata
				})


			});
		}
		$scope.step3.image1 = '';
		$scope.company_logo = [];
		$scope.fileuploadcmylogo = function (imgdata) {
			$scope.$apply(function () {
				$scope.company_logo = [];
				$scope.company_logo.push({
					file_name: imgdata,
					file_location: 'uploads/Profile_Image/' + imgdata
				})

				$scope.step3.image1 = 'uploads/Profile_Image/' + imgdata;

			});
		}

		$scope.saveindustry = function () {
			////console.log($scope.step2.industry1);
			$scope.step2.industry = [];
			$.each($scope.step2.industry1, function (index, industry) {
				if (industry == true) {
					$scope.step2.industry.push(index);
				}
			});
		}

		$scope.savedepartment = function () {
			////console.log($scope.step2.industry1);
			$scope.step2.department = [];
			$.each($scope.step2.department1, function (index, department) {
				$scope.step2.department.push(index);
			});
		}


		$scope.localSearch = function (str, corporate_list) {
			var coverage_url = 'apiv4/public/user/getcorporatedetails';
			var params = str.toString().toLowerCase();
			RequestDetail.getDetail(coverage_url, params).then(function (result) {
				if (angular.isDefined(result.data) && angular.isDefined(result.data.corporate_data) && result.data.corporate_data.length > 0) {
					$scope.corporate_list = result.data.corporate_data;
					$scope.$broadcast('angucomplete-alt:changeInput', 'corpList', 'Hello!');
				}
			});

		}

		$scope.searchAPI = function (userInputString, timeoutPromise) {
			var coverage_url = 'apiv4/public/user/getcorporatedetails';
			var params = str.toString().toLowerCase();

			// return $http.post('/yourownapiv4/public/', {q: userInputString}, {timeout: timeoutPromise});
		}


		$scope.selectCorporatelist = function (selected) {
			if (angular.isDefined(selected) && angular.isDefined(selected.originalObject) && angular.isDefined(selected.originalObject.id) &&
				angular.isDefined(selected.originalObject.name)) {
				$scope.valCorpList = selected.originalObject;
			}
		}

		$scope.addCorpList = function () {
			if (angular.isDefined($scope.valCorpList) && angular.isDefined($scope.valCorpList.id) && $scope.valCorpList.id != '') {
				if ($scope.corporatelistAdded.indexOf($scope.valCorpList) == -1) {
					$scope.corporatelistAdded.push($scope.valCorpList);
					// $scope.valCorpList = {};
					$scope.$broadcast('angucomplete-alt:clearInput', 'corpList');

					// var url = 'apiv4/public/user/addCorporateList';
					//  var params = {
					//      type : 'put',
					//      corporateList : $scope.corporatelistAdded
					//  };
					//  RequestDetail.getDetail(url,params).then(function(result) {

					//  });
				} else {
					alert("Already Added in the List");
					//$scope.corp.valCorpList = '';
					$scope.$broadcast('angucomplete-alt:clearInput', 'corpList');
				}
			}
		}

		//remove coverage
		$scope.removeCorporate = function (index) {
			$scope.corporatelistAdded.splice(index, 1);
		}


		$scope.step2Country = function (selected) {
			$scope.step2.country = selected.title;
		}

		$scope.checkTerms = function () {
			return false;
		}
		$scope.uploadFile = function (files) {
			$scope.step3.image = files;
		};

		$scope.logoupload = function () {
			$(function () {
				$('#fileupload').fileupload({
					dataType: 'json',
					done: function (e, data) {
						$.each(data.result.files, function (index, file) {
							var thumb_url = file.thumbnailUrl;
							$("#theDiv").html("<img id='span' src='" + thumb_url + "'/>");
							document.getElementById('theDiv').value = file.name;
						});
					}
				});
			});
		}


		// Country Matched for state 2 
		$scope.get_master_country2 = function (id) {
			var tagUrl = 'apiv4/public/dashboard/get_master_country';
			var params = $("#" + id).val();
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				if (angular.isDefined(result.data)) {
					$scope.step3.country = result.data.name;
				}
			});
		}

		// Country Matched for state
		$scope.get_master_country = function (id) {
			var tagUrl = 'apiv4/public/dashboard/get_master_country';
			var params = $("#" + id).val();
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				if (angular.isDefined(result.data)) {
					$scope.step2.country = result.data.name;
				}
			});
		}

		// City Autocomplete for register page 
		$scope.get_auto_city = function (id) {
			var tagUrl = 'apiv4/public/dashboard/get_auto_city';
			var params = $("#" + id).val();
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				$("#" + id).autocomplete({
					source: result.data,
					select: function (a, b) {
						$scope.$apply(function () {
							$scope.step2.city = b.item.value;
							$scope.step2.state = b.item.state;
							$scope.step2.country = b.item.country;
						});
						$("#" + id).trigger('input');
						$('#textZip').focus();
					}
				});
			});
		}

		// City Autocomplete for register page 

		$scope.get_auto_city2 = function (id) {
			var tagUrl = 'apiv4/public/dashboard/get_auto_city';
			var params = $("#" + id).val();
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				$("#" + id).autocomplete({
					source: result.data,
					select: function (a, b) {

						$scope.step3.city = b.item.value;
						$scope.step3.state = b.item.state;
						$scope.step3.country = b.item.country;
						$("#" + id).trigger('input');
						$('#textZip').focus();

					}
				});
			});
		}

		// State Autocomplete for register page 

		$scope.get_auto_state = function (id) {
			var tagUrl = 'apiv4/public/dashboard/get_auto_state';
			var params = $("#" + id).val();
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				$("#" + id).autocomplete({
					source: result.data,
					select: function (a, b) {

						$scope.step2.state = b.item.value;
						$scope.step2.country = b.item.country;
						$("#" + id).trigger('input');
						$('#textZip').focus();

					}
				});
			});
		}
		// State Autocomplete for register page 2

		$scope.get_auto_state2 = function (id) {
			var tagUrl = 'apiv4/public/dashboard/get_auto_state';
			var params = $("#" + id).val();
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				$("#" + id).autocomplete({
					source: result.data,
					select: function (a, b) {

						$scope.step3.state = b.item.value;
						$scope.step3.country = b.item.country;
						$("#" + id).trigger('input');
						$('#textZip2').focus();

					}
				});
			});
		}




		//Global, US, Canada, Latin America, Europe, Russia, Japan, China, India, Asia, Australia, Middle East/Africa (MENA), Emerging Markets, Frontier Markets

		function chunk(arr, size) {
			var newArr = [];
			for (var i = 0; i < arr.length; i += size) {
				newArr.push(arr.slice(i, i + size));
			}
			return newArr;
		}

		var tagUrl = 'apiv4/public/user/get_search_details1';

		var params = {
			term: '',
			key: 'allindustry'
		};
		RequestDetail.getDetail(tagUrl, params).then(function (result) {
			if (angular.isDefined(result.data) && result.data.length > 0) {
				$scope.availableallIndustry = chunk(result.data, 29);
			} else {
				$scope.availableallIndustry = [];
			}
		});

		$scope.industrychange = function (index, name) {

			var industryarray1 = ['Auto Components', 'Automobiles', 'Distributors', 'Diversified Consumer Services', 'Hotels, Restaurants & Leisure', 'Household Durables', 'Internet & Direct Marketing Retail', 'Leisure Products', 'Media', 'Multiline Retail', 'Specialty Retail', 'Textiles, Apparel & Luxury Goods'];

			var industryarray2 = ['Beverages', 'Food & Staples Retailing', 'Household Products', 'Food Products', 'Personal Products', 'Tobacco'];

			var industryarray3 = ['Energy Equipment & Services'];

			var industryarray4 = ['Electric Utilities', 'Gas Utilities', 'Independent Power and Renewable Electricity P', 'Multi-Utilities', 'Water Utilities'];

			var industryarray5 = ['Banks', 'Capital Markets', 'Consumer Finance', 'Diversified Financial Services', 'Mortgage Real Estate Investment Trusts (REITs', 'Insurance', 'Thrifts & Mortgage Finance'];

			var industryarray6 = ['Equity Real Estate Investment Trusts (REITs)', 'Real Estate Management & Development'];

			var industryarray7 = ['Biotechnology', 'Health Care Equipment & Supplies', 'Health Care Providers & Services', 'Health Care Technology', 'Life Sciences Tools & Services', 'Pharmaceuticals'];


			var industryarray8 = ['Communications Equipment', 'Electronic Equipment, Instruments & Component', 'IT Services', 'Internet Software & Services', 'Semiconductors & Semiconductor Equipment', 'Software', 'Technology Hardware, Storage & Peripherals'];

			var industryarray9 = ['Aerospace & Defense', 'Air Freight & Logistics', 'Airlines', 'Building Products', 'Commercial Services & Supplies', 'Construction Materials', 'Electrical Equipment', 'Industrial Conglomerates', 'Machinery', 'Marine', 'Professional Services', 'Road & Rail', 'Trading Companies & Distributors', 'Transportation Infrastructure'];

			var industryarray10 = ['Chemicals', 'Construction & Engineering', 'Containers & Packaging', 'Metals & Mining', 'Paper & Forest Products'];

			var industryarray11 = ['Wireless Telecommunication Services'];




			if (name == 'Consumer Discretionary') {
				if (index) {

					$.each(industryarray1, function (index, name) {
						$scope.step2.industry1[name] = true;
					});
				} else {
					$.each(industryarray1, function (index, name) {
						$scope.step2.industry1[name] = false;
					});
				}
			}
			if (name == 'Consumer Staples') {
				if (index) {
					$.each(industryarray2, function (index, name) {
						$scope.step2.industry1[name] = true;
					});
				} else {
					$.each(industryarray2, function (index, name) {
						$scope.step2.industry1[name] = false;
					});
				}
			}
			if (name == 'Energy') {
				if (index) {
					$.each(industryarray3, function (index, name) {
						$scope.step2.industry1[name] = true;
					});
				} else {
					$.each(industryarray3, function (index, name) {
						$scope.step2.industry1[name] = false;
					});
				}
			}
			if (name == 'Utilities') {
				if (index) {
					$.each(industryarray4, function (index, name) {
						$scope.step2.industry1[name] = true;
					});
				} else {
					$.each(industryarray4, function (index, name) {
						$scope.step2.industry1[name] = false;
					});
				}
			}

			if (name == 'Financials') {
				if (index) {
					$.each(industryarray5, function (index, name) {
						$scope.step2.industry1[name] = true;
					});
				} else {
					$.each(industryarray5, function (index, name) {
						$scope.step2.industry1[name] = false;
					});
				}
			}

			if (name == 'Real Estate') {
				if (index) {
					$.each(industryarray6, function (index, name) {
						$scope.step2.industry1[name] = true;
					});
				} else {
					$.each(industryarray6, function (index, name) {
						$scope.step2.industry1[name] = false;
					});
				}


			}

			if (name == 'Health Care') {
				if (index) {
					$.each(industryarray7, function (index, name) {
						$scope.step2.industry1[name] = true;
					});
				} else {
					$.each(industryarray7, function (index, name) {
						$scope.step2.industry1[name] = false;
					});
				}
			}

			if (name == 'Information Technology') {
				if (index) {
					$.each(industryarray8, function (index, name) {
						$scope.step2.industry1[name] = true;
					});
				} else {
					$.each(industryarray8, function (index, name) {
						$scope.step2.industry1[name] = false;
					});
				}
			}
			if (name == 'Industrials') {
				if (index) {
					$.each(industryarray9, function (index, name) {
						$scope.step2.industry1[name] = true;
					});
				} else {
					$.each(industryarray9, function (index, name) {
						$scope.step2.industry1[name] = false;
					});
				}
			}

			if (name == 'Materials') {
				if (index) {
					$.each(industryarray10, function (index, name) {
						$scope.step2.industry1[name] = true;
					});
				} else {
					$.each(industryarray10, function (index, name) {
						$scope.step2.industry1[name] = false;
					});
				}
			}
			if (name == 'Telecommunication Services') {
				if (index) {

					$.each(industryarray11, function (index, name) {
						$scope.step2.industry1[name] = true;
					});
				} else {
					$.each(industryarray11, function (index, name) {
						$scope.step2.industry1[name] = false;
					});
				}
			}
			// //console.log(name);


		}

		$scope.availableDepartment = ['Research', 'Consulting', 'Software', 'Data', 'News', 'Other'];
		$scope.availableAssetclass = ['Equities & ETFs', 'Fixed Income', 'Commodities', 'FX & Currency', 'Alternative Assets and Derivatives', 'Real Estate'];
		$scope.availableCapitalization = ['Private/Pre-IPO', 'Small Cap (>$2Bn)', 'Medium Cap ($2-10Bn)', 'Large Cap ($10-100B)', 'Mega Cap (>$100B)'];
		$scope.availableGeography = ['Global', 'US', 'Canada', 'Latin America', 'Europe', 'Russia', 'Japan', 'China', 'India', 'Asia', 'Australia', 'Middle East/Africa (MENA)', 'Emerging Markets', 'Frontier Markets'];


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
								$scope.availableIndustry.push('All');
							} else {
								$scope.availableIndustry = [];
							}
						});
					}
					if (type == 'geography') {
						$scope.availableGeography = ['Global', 'US', 'Canada', 'Latin America', 'Europe', 'Russia', 'Japan', 'China', 'India', 'Asia', 'Australia', 'Middle East/Africa (MENA)', 'Emerging Markets', 'Frontier Markets'];
					}
					if (type == 'department') {
						$scope.availableDepartment = ['Research', 'Consulting', 'Software', 'Data', 'News', 'Other'];
					}

					if (type == 'assetclass') {
						$scope.availableAssetclass = ['Equities & ETFs', 'Fixed Income', 'Commodities', 'FX & Currency', 'Alternative Assets and Derivatives', 'Real Estate'];
					}
					if (type == 'capitalization') {
						$scope.availableCapitalization = ['Private/Pre-IPO', 'Small Cap (>$2Bn)', 'Medium Cap ($2-10Bn)', 'Large Cap ($10-100B)', 'Mega Cap (>$100B)'];
					}




				}
			}
		}

		$scope.savedepartment = function () {
			////console.log($scope.step2.industry1);
			$scope.step2.department = [];
			$.each($scope.step2.department1, function (index, department) {

				$scope.step2.department.push(index);
			});
		}
		$scope.saveassetclass = function () {
			////console.log($scope.step2.industry1);
			$scope.step2.assetclass = [];
			$.each($scope.step2.assetclass1, function (index, assetclass) {

				$scope.step2.assetclass.push(index);
			});
		}

		$scope.savecapitalization = function () {
			////console.log($scope.step2.industry1);
			$scope.step2.capitalization = [];
			$.each($scope.step2.capitalization1, function (index, capitalization) {

				$scope.step2.capitalization.push(index);
			});
		}

		$scope.savegeography = function () {
			////console.log($scope.step2.industry1);
			$scope.step2.geography = [];
			$.each($scope.step2.geography1, function (index, geography) {

				$scope.step2.geography.push(index);
			});
		}


		// Country Autocomplete for register page 

		$scope.get_auto_country = function (id) {
			var tagUrl = 'apiv4/public/dashboard/get_auto_country';
			var params = $("#" + id).val();
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				$("#" + id).autocomplete({
					source: result.data,
					select: function (a, b) {
						$("#" + id).trigger('input');
						$scope.step2.country = b.item.value;
						$('#textZip2').focus();

					}
				});
			});
		}

		// Country Autocomplete for register page 

		$scope.get_auto_country2 = function (id) {
			var tagUrl = 'apiv4/public/dashboard/get_auto_country';
			var params = $("#" + id).val();
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				$("#" + id).autocomplete({
					source: result.data,
					select: function (a, b) {
						$timeout(function () {
							$("#" + id).trigger('input');
						}, 0);
						$scope.step3.country = b.item.value;
						$('#textZip2').focus();

					}
				});
			});
		}







		// Ticker Autocomplete for register page 

		$scope.get_auto_ticker = function () {

			var tagUrl = 'apiv4/public/dashboard/get_auto_ticker_stock_cmy';
			var params = $("#ticker_list").val();
			RequestDetail.getDetail(tagUrl, params).then(function (result) {

				////console.log(result.data);

				$("#ticker_list").autocomplete({
					source: result.data,
					select: function (a, b) {

						$timeout(function () {
							$("#ticker_list").trigger('input');
						}, 0);


						var getcmy_val = 'apiv4/public/dashboard/get_auto_ticker_company_profile';
						var ticker = b.item.value;
						RequestDetail.getDetail(getcmy_val, ticker).then(function (result) {

							if (result.data.count != '0') {

								$scope.button_disable = [];
								$scope.step3.ticker = result.data.value;
								$scope.step3.ticker_id = result.data.ticker_id;
								$scope.step3.companyName = result.data.company_name;
								$scope.step3.website = result.data.website;
								$scope.step3.city = result.data.city;
								$scope.step3.state = result.data.state;
								$scope.step3.country = result.data.country;
								$scope.step3.zip = result.data.zip;
								$scope.step3.description = result.data.description;
								$scope.step3.streetAddress1 = result.data.address;
								$scope.streetAddress2 = result.data.address2;
								$scope.button_disable = true;
								$scope.same_address = false;

								$scope.step3.image1 = result.data.logo;

								$("#theDiv1").html("<img id='span' src='" + result.data.logo + "'/>");
								document.getElementById('theDiv1').value = result.data.logo;




							} else {

								$scope.button_disable = [];
								$scope.step3.ticker = b.item.value;
								$scope.step3.ticker_id = b.item.ticker_id;
								$scope.step3.companyName = b.item.company_name;
								$scope.step3.website = b.item.website;
								$scope.step3.city = b.item.city;
								$scope.step3.state = b.item.state;
								$scope.step3.country = b.item.country;
								$scope.step3.zip = b.item.zip;
								$scope.step3.description = b.item.description;
								$scope.step3.streetAddress1 = b.item.address;
								$scope.streetAddress2 = b.item.address2;
								$scope.button_disable = true;
								$scope.same_address = false;

							}



						});





					}
				});
			});
		}


		// Ticker Autocomplete for register page 

		/*   $scope.get_auto_ticker_stock_cmy = function (){
		   	var tagUrl = 'apiv4/public/dashboard/get_auto_ticker_stock_cmy';
		   	var params = $( "#ticker_list" ).val();
		   	RequestDetail.getDetail(tagUrl,params).then(function(result){
		   		$( "#ticker_list" ).autocomplete({      			
		   			source : result.data,
		   			select : function(a,b){
		           $timeout(function() {
		             $( "#ticker_list" ).trigger('input');
		           }, 0);
		           $scope.button_disable=[];
		           $scope.step3.ticker = b.item.value;
		           $scope.step3.ticker_id = b.item.ticker_id;
		           $scope.step3.companyName = b.item.company_name;
		           $scope.step3.website =  b.item.website;
		           $scope.step3.city = b.item.city;
		           $scope.step3.state = b.item.state;
		           $scope.step3.country = b.item.country;
		           $scope.step3.zip = b.item.zip;
		           $scope.step3.description = b.item.description;
		           $scope.step3.streetAddress1 = b.item.address;
		           $scope.streetAddress2 = b.item.address2;
		           $scope.button_disable=true;
		           $scope.same_address=false;

		         }
		       });
		   	});
		   }*/


		// Autocomplete Company name 
		$scope.get_auto_company = function () {
			var tagUrl = 'apiv4/public/dashboard/get_company_names';
			var params = $('#company_name').val();
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				$("#company_name").autocomplete({
					source: result.data,
					select: function (a, b) {

						$timeout(function () {
							$("#company_name").trigger('input');
						}, 0);

						var getcmy_val = 'apiv4/public/dashboard/get_auto_ticker_invcompany_profile';
						var ticker = b.item.value;

						RequestDetail.getDetail(getcmy_val, ticker).then(function (result) {


							if (result.data.count != '0') {
								$scope.button_disable = [];
								$scope.step3.companyName = result.data.value;
								$scope.step3.company_id = result.data.company_id;
								$scope.step3.website = result.data.website;
								$scope.step3.city = result.data.city;
								$scope.step3.state = result.data.state;
								$scope.step3.country = result.data.country;
								$scope.step3.zip = result.data.zip;
								$scope.step3.description = result.data.description;
								$scope.step3.streetAddress1 = result.data.address;
								$scope.streetAddress2 = result.data.address2;
								$scope.button_disable = true;
								$scope.same_address = false;
							} else {
								$scope.button_disable = [];
								$scope.step3.companyName = b.item.value;
								$scope.step3.company_id = b.item.company_id;
								$scope.step3.website = b.item.website;
								$scope.step3.city = b.item.city;
								$scope.step3.state = b.item.state;
								$scope.step3.country = b.item.country;
								$scope.step3.zip = b.item.zip;
								$scope.step3.description = b.item.description;
								$scope.step3.streetAddress1 = b.item.address;
								$scope.streetAddress2 = b.item.address2;
								$scope.button_disable = true;
								$scope.same_address = false;
							}
						});

					}
				});
			});
		}


		//get Ticker On select autocomplete ticker 

		$scope.select_broker_code = function (selected) {



			if (selected != undefined) {
				$scope.button_disable = [];
				$scope.step2.broker_code = selected.originalObject.broker_code;
				$scope.step2.companyname = selected.originalObject.company_name;
				$scope.website = selected.originalObject.website;
				$scope.step2.city = selected.originalObject.city;
				$scope.step2.state = selected.originalObject.state;
				$scope.step2.country = selected.originalObject.country;
				$scope.step2.zip = selected.originalObject.zip;
				$scope.step2.address1 = selected.originalObject.address;
				$scope.step2.address2 = selected.originalObject.address2;


				$scope.button_disable = true;

			} else {
				$scope.button_disable = [];
				$scope.step2.broker_code = '';
				$scope.step2.companyName = '';
				$scope.website = '';
				$scope.step2.city = '';
				$scope.step2.state = '';
				$scope.step2.country = '';
				$scope.step2.zip = '';
				$scope.step2.address1 = '';
				$scope.step2.address2 = '';

				$scope.button_disable = false;
			}
		}








		$scope.register_investor = function (id) {

			// localStorageService.clearAll();  

			$scope.spinnerActive = true;
			var userTypeId = '1';

			var url = 'apiv4/public/user/register';
			var params = {};
			params = {
				step1var: userTypeId,
				step2var: $scope.step2,
				step2address: $scope.address2,
				step3var: $scope.step3,
				step30var: $scope.step30,
				step3address: $scope.streetAddress2,
				subsType: id
			}
			RequestDetail.getDetail(url, params).then(function (result) {

				if (angular.isDefined(result.data) && result.data != '') {
					localStorageService.set('usertype', 'investor');
					localStorageService.set('userdata', result.data);
					localStorageService.set('userimage', result.data.image);
					localStorageService.set('password', result.data.password);
					localStorageService.set('email', result.data.email);
					localStorageService.set('email', result.data.email);
					localStorageService.set('admincontroluser', result.data.admincontroluser);


					if (localStorageService.get('url') != '') {
						$location.path(localStorageService.get('url'));
					} else {
						$timeout(function () {
							$scope.spinnerActive = false;
							$location.path('dashboard');
						}, 2000);
					}



				}
			});

		}

		$scope.step3.agree = true;

		/* Get payment function */
		$scope.getPay = function (id) {
			// $scope.corporate_id =121;         

			if (angular.isUndefined($scope.step3.agree) || $scope.step3.agree == '') {
				$scope.showtermserror = true;
				return false;
			} else {
				$scope.spinnerActive = true;
				var params = {};

				$scope.showtermserror = false;
				var x = pa + id;

				$(".payment-single").removeClass('payment-active');
				$scope[x] = 'payment-active';


				if ($scope.usertypeSelect == 'investor') {
					var userTypeId = '1';
					localStorageService.set('usertype', 'investor');
					var url = 'apiv4/public/user/register';
					params = {
						step1var: userTypeId,
						step2var: $scope.step2,
						step2address: $scope.address2,
						step3var: $scope.step3,
						step30var: $scope.step30,
						step3address: $scope.streetAddress2,
						subsType: id
					}
				} else if ($scope.usertypeSelect == 'corporate') {
					var userTypeId = '2';
					localStorageService.set('usertype', 'corporate');
					var url = 'apiv4/public/user/register';
					params = {
						step1var: userTypeId,
						step2var: $scope.step2,
						step2address: $scope.address2,
						step3var: $scope.step3,
						step30var: $scope.step30,
						step3address: $scope.streetAddress2,
						subsType: id
					}
				} else if ($scope.usertypeSelect == 'broker') {
					var userTypeId = '3';
					localStorageService.set('usertype', 'broker');
					var url = 'apiv4/public/user/register_broker';
					if (angular.isDefined($scope.corporatelistAdded)) {
						params = {
							data: $scope.step2,
							corporate_list: $scope.corporatelistAdded,
							subsType: id,
							coveragefile: $scope.coveragefile
						};
					} else {
						params = {
							data: $scope.step2,
							corporate_list: '',
							subsType: id
						};
					}
				}




				if (id == 1) // FREE PLAN 
				{
					RequestDetail.getDetail(url, params).then(function (result) {
						if (angular.isDefined(result.data) && result.data != '') {

							localStorageService.set('userdata', result.data);
							localStorageService.set('userimage', result.data.image);
							localStorageService.set('password', result.data.password);
							localStorageService.set('email', result.data.email);
							localStorageService.set('admincontroluser', result.data.admincontroluser);



							$timeout(function () {
								$scope.spinnerActive = false;
								$location.path('dashboard');
							}, 2000);
							// return false;

							// if(localStorageService.get('url') !='')
							// {	
							// //	$location.path(localStorageService.get('url')); 
							// }
							// else
							// {	
							// 	$timeout(function(){
							// 		$scope.spinnerActive = false;
							// 		$location.path('dashboard'); 
							// 	}, 2000); 

							// }
						}
					});
				} else // Paid Plan
				{



					$scope.corporate_id = [];
					RequestDetail.getDetail(url, params).then(function (result) {
						if (angular.isDefined(result.data) && result.data != '') {
							$scope.corporate_id = result.data.user_id;
							localStorageService.set('userdata', result.data);
							localStorageService.set('userimage', result.data.image);
							localStorageService.set('password', result.data.password);
							localStorageService.set('email', result.data.email);
							$timeout(function () {

								if (id == 2) {
									$('#form1').submit();
								} else if (id == 3) {
									$('#form2').submit();
								}

							}, 2000);

						}
						return false;
					});
				}
			}
		}




		$scope.step2 = {};

		// AUM 

		$scope.aum = [

			{
				value: '1',
				text: '< $200M'
			},
			{
				value: '2',
				text: '$200M - $1Bn'
			},
			{
				value: '3',
				text: '$1Bn - $5Bn'
			},
			{
				value: '4',
				text: '>$5Bn'
			}
		];
		$scope.aum_array = angular.copy($scope.aum);



		//  Holding Period (Turnover) 

		$scope.holding_period = [

			{
				value: '1',
				text: '< 4 Months'
			},
			{
				value: '2',
				text: '4 - 12 Months'
			},
			{
				value: '3',
				text: '12 - 24 Months'
			},
			{
				value: '4',
				text: '> 24 Months'
			}
		];
		$scope.holding_period_array = angular.copy($scope.holding_period);



		//  Institutional Type 

		$scope.institution_type = [

			{
				value: '1',
				text: 'Bank'
			},
			{
				value: '2',
				text: 'Hedge Fund'
			},
			{
				value: '3',
				text: 'Investment Adviser'
			},
			{
				value: '4',
				text: 'Mutual Fund'
			},
			{
				value: '5',
				text: 'Pension Fund'
			},
			{
				value: '6',
				text: 'Family Office'
			},
			{
				value: '7',
				text: 'Other      '
			}
		];
		$scope.institution_type_array = angular.copy($scope.institution_type);


		//  Style / Strategy

		$scope.style = [

			{
				value: '1',
				text: 'Equity Long'
			},
			{
				value: '2',
				text: 'Equity Hedge (Long / Short)'
			},
			{
				value: '3',
				text: 'Market Neutral'
			},
			{
				value: '4',
				text: 'Event Driven'
			},
			{
				value: '5',
				text: 'Global Macro'
			},
			{
				value: '6',
				text: 'Arbitrage'
			},
			{
				value: '7',
				text: 'Multi Strategy'
			}
		];
		$scope.style_array = angular.copy($scope.style);



		//  Follow-up

		$scope.follow_up = [

			{
				value: '1',
				text: 'Follow-up Explanation'
			},
			{
				value: '2',
				text: 'Request Data'
			},
			{
				value: '3',
				text: 'Request a Model'
			},
			{
				value: '4',
				text: 'Request Report/study'
			},
			{
				value: '5',
				text: 'Request Presentation'
			},
			{
				value: '6',
				text: 'Request an Introduction'
			},
			{
				value: '7',
				text: 'Other Follow-up'
			},
		];
		$scope.follow_up_array = angular.copy($scope.follow_up);


		/* Functions for steps to conduct */

		$scope.nextStep = function () {

			//console.log($scope.stepStatus);


			if ($scope.stepStatus == 4) {
				return false;
			}

			$scope.$watch('step2.email', function (e, n, v) {
				$scope.step2.email = angular.element('#textEmail').val();
			});

			hideAll();

			// STEP 1 STARTS 

			if ($scope.stepStatus == 1) {

				if ($scope.usertypeSelect == '') {
					$scope.errorMsg = 'Please select user type before proceed !';
					$scope.box_step1 = true;
					return false;
				} else {
					$scope.errorMsg = '';
				}

				// STEP 2 STARTS HERE 

				$scope.step2title = [];
				if ($scope.usertypeSelect == 'corporate') {
					$scope.step2title = 'User Information'; // Step 2 title 
					$scope.button_disable = false;
				} else if ($scope.usertypeSelect == 'investor') {
					$scope.step2title = 'User Information';
				} else {
					$scope.step2title = 'Registration of Individual';
				}
				$scope.box_step2 = true;
				$scope.stepStatus = '2';


				// Changing Menu Color
				$scope.stepActive2 = 'step-active pointer';
				$scope.dashActive1 = 'dash-active';
				$scope.textActive2 = 'no-border';
				$scope.textCompleted1 = 'Completed';

				jQuery(".fa-pencil").addClass('fa-check');
				jQuery(".fa-check").removeClass('fa-pencil');

				if ($scope.reached >= 2) {
					$scope.reached = $scope.reached;
				} else {
					$scope.reached = 2;
				}

			} else if ($scope.stepStatus == 2) {

				if (Object.keys($scope.step2form.$error).length > 0) {
					$scope.box_step2 = true;
					return;
				}
				if (angular.isUndefined($scope.step2.country) || $scope.step2.country == '') { // Country Validation 
					return false;
				}

				// STEP 3  STARTS HERE 
				$scope.step3title = [];
				if ($scope.usertypeSelect == 'corporate') {
					$scope.step3title = 'Company Information'; // Step 3 title 
				} else if ($scope.usertypeSelect == 'investor') {
					$scope.step3title = 'Company Information'; // Step 3 title 

				} else {
					$scope.step3title = 'Registration of Company';
				}



				if ($scope.usertypeSelect == 'broker') { // if broker 
					// Broker Step 3   
					$scope.getPay('1');
					return false;

					// STEP 4  STARTS HERE 
					$scope.step4title = [];
					$scope.step4title = 'Select Plan';
					$scope.box_step4 = true;
					$scope.stepStatus = '4';

					// Changing Menu Color
					$scope.stepActive4 = 'step-active pointer';
					$scope.dashActive3 = 'dash-active';
					$scope.textActive4 = 'no-border';
					$scope.textCompleted3 = 'Completed';

					jQuery(".fa-user").addClass('fa-check');
					jQuery(".fa-check").removeClass('fa-user');

					if ($scope.reached >= 4) {
						$scope.reached = $scope.reached;
					} else {
						$scope.reached = 4;
					}

				} else {

					$scope.box_step3 = true;
					$scope.stepStatus = '3';

					// Changing Menu Color
					$scope.stepActive3 = 'step-active pointer';
					$scope.dashActive2 = 'dash-active';
					$scope.textActive3 = 'no-border';
					$scope.textCompleted2 = 'Completed';
					jQuery(".fa-briefcase").addClass('fa-check');
					jQuery(".fa-check").removeClass('fa-briefcase');
				}


				if ($scope.reached >= 3) {
					$scope.reached = $scope.reached;
				} else {
					$scope.reached = 3;
				}

			} else if ($scope.stepStatus == 3) {
				$scope.submission3 = true;
				if (Object.keys($scope.step3form.$error).length > 0) {
					$scope.box_step3 = true;
					return;
				}



				if (Object.keys($scope.step2form.$error).length > 0) {
					$scope.box_step2 = true;
					return;
				}


				var step3_error_count = '';
				step3_error_count = validation.getEmpty($scope.step3);



				if (step3_error_count > 0) {

					$scope.box_step3 = true;
					return false;
				}



				// STEP 4  STARTS HERE 
				$scope.step4title = [];
				$scope.step4title = 'Select Plan';
				$scope.box_step4 = true;
				$scope.stepStatus = '4';

				// Changing Menu Color
				$scope.stepActive4 = 'step-active pointer';
				$scope.dashActive3 = 'dash-active';
				$scope.textActive4 = 'no-border';
				$scope.textCompleted3 = 'Completed';

				jQuery(".fa-user").addClass('fa-check');
				jQuery(".fa-check").removeClass('fa-user');

				if ($scope.reached >= 4) {
					$scope.reached = $scope.reached;
				} else {
					$scope.reached = 4;
				}

			} else if ($scope.stepStatus == 0) {
				$scope.box_step1 = true;
				$scope.stepStatus = '1';
			}






		}


		$scope.check_broker_code = function () {

			var url = "apiv4/public/user/check_broker_code";
			var params = $scope.step2.broker_codes;

			if (!params) {
				$scope.errorMsg = 'Enter Broker Code ! ';

				$timeout(function () {
					$scope.errorMsg = false;
				}, 1000);
				return false;
			}


			RequestDetail.getDetail(url, params).then(function (result) {

				if (angular.isDefined(result.data) && result.data != '') {

					angular.forEach(result.data, function (broker) {

						//$scope.broker_codes='';
						$scope.button_disable = [];
						$scope.broker_code = false;
						$scope.step3.broker_code = broker.broker_code;
						$scope.step2.companyname = broker.company_name;
						$scope.website = broker.website;
						$scope.step2.city = broker.city;
						$scope.step2.state = broker.state;
						$scope.step2.country = broker.country;
						$scope.step2.zip = broker.zip;
						$scope.step2.address1 = broker.address;
						$scope.step2.address2 = broker.address2;
						$scope.button_disable = true;
						$scope.nextStep();


					});
				} else {
					$scope.errorMsg = 'Broker Code Not Matched ! ';

					$timeout(function () {
						$scope.errorMsg = false;
					}, 2000);
				}
			});




		};

		$scope.selectType = function (type) {

			$scope.corporateSelect = '';
			$scope.investorSelect = '';
			$scope.brokerSelect = '';
			$scope.usertypeSelect = type;
			$scope.step3.ticker = '';
			$scope.is_broker = false;

			if (type == 'corporate') {

				$scope.is_broker = false;
				$scope.corporateSelect = 'active';
			} else if (type == 'investor') {
				$scope.is_broker = false;
				delete $scope.step3.ticker;
				$scope.investorSelect = 'active';
			} else if (type == 'broker') {
				$scope.is_broker = true;
				$scope.brokerSelect = 'active';
			}
		}

		$scope.viewStep = function (args) {

			if (args == '1') {
				$scope.submission2 = false;

				if ($scope.reached >= 1) {
					$scope.stepStatus = '0';
				} else {
					return false;
				}
			}

			if (args == '2') {
				if ($scope.reached >= 2) {
					$scope.stepStatus = '1';
				} else {
					return false;
				}
			}

			if (args == '3') {


				if ($scope.reached >= 3) {
					$scope.stepStatus = '2';
				} else {
					return false;
				}

			}



			if (args == '4') {
				if ($scope.reached >= 4) {
					$scope.stepStatus = '3';
				} else {
					return false;
				}
			}
			if (args == '30') {
				if ($scope.reached >= 4) {
					$scope.stepStatus = '2';
				} else {
					return false;
				}
			}




			$scope.nextStep();
		}

		function hideAll() {
			$scope.box_step1 = false;
			$scope.box_step2 = false;
			$scope.box_step3 = false;
			$scope.box_step30 = false;
			$scope.box_step4 = false;

		}

		$scope.countries = [{
				name: 'Afghanistan',
				code: 'AF'
			},
			{
				name: 'Aland Islands',
				code: 'AX'
			},
			{
				name: 'Albania',
				code: 'AL'
			},
			{
				name: 'Algeria',
				code: 'DZ'
			},
			{
				name: 'American Samoa',
				code: 'AS'
			},
			{
				name: 'AndorrA',
				code: 'AD'
			},
			{
				name: 'Angola',
				code: 'AO'
			},
			{
				name: 'Anguilla',
				code: 'AI'
			},
			{
				name: 'Antarctica',
				code: 'AQ'
			},
			{
				name: 'Antigua and Barbuda',
				code: 'AG'
			},
			{
				name: 'Argentina',
				code: 'AR'
			},
			{
				name: 'Armenia',
				code: 'AM'
			},
			{
				name: 'Aruba',
				code: 'AW'
			},
			{
				name: 'Australia',
				code: 'AU'
			},
			{
				name: 'Austria',
				code: 'AT'
			},
			{
				name: 'Azerbaijan',
				code: 'AZ'
			},
			{
				name: 'Bahamas',
				code: 'BS'
			},
			{
				name: 'Bahrain',
				code: 'BH'
			},
			{
				name: 'Bangladesh',
				code: 'BD'
			},
			{
				name: 'Barbados',
				code: 'BB'
			},
			{
				name: 'Belarus',
				code: 'BY'
			},
			{
				name: 'Belgium',
				code: 'BE'
			},
			{
				name: 'Belize',
				code: 'BZ'
			},
			{
				name: 'Benin',
				code: 'BJ'
			},
			{
				name: 'Bermuda',
				code: 'BM'
			},
			{
				name: 'Bhutan',
				code: 'BT'
			},
			{
				name: 'Bolivia',
				code: 'BO'
			},
			{
				name: 'Bosnia and Herzegovina',
				code: 'BA'
			},
			{
				name: 'Botswana',
				code: 'BW'
			},
			{
				name: 'Bouvet Island',
				code: 'BV'
			},
			{
				name: 'Brazil',
				code: 'BR'
			},
			{
				name: 'British Indian Ocean Territory',
				code: 'IO'
			},
			{
				name: 'Brunei Darussalam',
				code: 'BN'
			},
			{
				name: 'Bulgaria',
				code: 'BG'
			},
			{
				name: 'Burkina Faso',
				code: 'BF'
			},
			{
				name: 'Burundi',
				code: 'BI'
			},
			{
				name: 'Cambodia',
				code: 'KH'
			},
			{
				name: 'Cameroon',
				code: 'CM'
			},
			{
				name: 'Canada',
				code: 'CA'
			},
			{
				name: 'Cape Verde',
				code: 'CV'
			},
			{
				name: 'Cayman Islands',
				code: 'KY'
			},
			{
				name: 'Central African Republic',
				code: 'CF'
			},
			{
				name: 'Chad',
				code: 'TD'
			},
			{
				name: 'Chile',
				code: 'CL'
			},
			{
				name: 'China',
				code: 'CN'
			},
			{
				name: 'Christmas Island',
				code: 'CX'
			},
			{
				name: 'Cocos (Keeling) Islands',
				code: 'CC'
			},
			{
				name: 'Colombia',
				code: 'CO'
			},
			{
				name: 'Comoros',
				code: 'KM'
			},
			{
				name: 'Congo',
				code: 'CG'
			},
			{
				name: 'Congo, The Democratic Republic of the',
				code: 'CD'
			},
			{
				name: 'Cook Islands',
				code: 'CK'
			},
			{
				name: 'Costa Rica',
				code: 'CR'
			},
			{
				name: 'Cote D\'Ivoire',
				code: 'CI'
			},
			{
				name: 'Croatia',
				code: 'HR'
			},
			{
				name: 'Cuba',
				code: 'CU'
			},
			{
				name: 'Cyprus',
				code: 'CY'
			},
			{
				name: 'Czech Republic',
				code: 'CZ'
			},
			{
				name: 'Denmark',
				code: 'DK'
			},
			{
				name: 'Djibouti',
				code: 'DJ'
			},
			{
				name: 'Dominica',
				code: 'DM'
			},
			{
				name: 'Dominican Republic',
				code: 'DO'
			},
			{
				name: 'Ecuador',
				code: 'EC'
			},
			{
				name: 'Egypt',
				code: 'EG'
			},
			{
				name: 'El Salvador',
				code: 'SV'
			},
			{
				name: 'Equatorial Guinea',
				code: 'GQ'
			},
			{
				name: 'Eritrea',
				code: 'ER'
			},
			{
				name: 'Estonia',
				code: 'EE'
			},
			{
				name: 'Ethiopia',
				code: 'ET'
			},
			{
				name: 'Falkland Islands (Malvinas)',
				code: 'FK'
			},
			{
				name: 'Faroe Islands',
				code: 'FO'
			},
			{
				name: 'Fiji',
				code: 'FJ'
			},
			{
				name: 'Finland',
				code: 'FI'
			},
			{
				name: 'France',
				code: 'FR'
			},
			{
				name: 'French Guiana',
				code: 'GF'
			},
			{
				name: 'French Polynesia',
				code: 'PF'
			},
			{
				name: 'French Southern Territories',
				code: 'TF'
			},
			{
				name: 'Gabon',
				code: 'GA'
			},
			{
				name: 'Gambia',
				code: 'GM'
			},
			{
				name: 'Georgia',
				code: 'GE'
			},
			{
				name: 'Germany',
				code: 'DE'
			},
			{
				name: 'Ghana',
				code: 'GH'
			},
			{
				name: 'Gibraltar',
				code: 'GI'
			},
			{
				name: 'Greece',
				code: 'GR'
			},
			{
				name: 'Greenland',
				code: 'GL'
			},
			{
				name: 'Grenada',
				code: 'GD'
			},
			{
				name: 'Guadeloupe',
				code: 'GP'
			},
			{
				name: 'Guam',
				code: 'GU'
			},
			{
				name: 'Guatemala',
				code: 'GT'
			},
			{
				name: 'Guernsey',
				code: 'GG'
			},
			{
				name: 'Guinea',
				code: 'GN'
			},
			{
				name: 'Guinea-Bissau',
				code: 'GW'
			},
			{
				name: 'Guyana',
				code: 'GY'
			},
			{
				name: 'Haiti',
				code: 'HT'
			},
			{
				name: 'Heard Island and Mcdonald Islands',
				code: 'HM'
			},
			{
				name: 'Holy See (Vatican City State)',
				code: 'VA'
			},
			{
				name: 'Honduras',
				code: 'HN'
			},
			{
				name: 'Hong Kong',
				code: 'HK'
			},
			{
				name: 'Hungary',
				code: 'HU'
			},
			{
				name: 'Iceland',
				code: 'IS'
			},
			{
				name: 'India',
				code: 'IN'
			},
			{
				name: 'Indonesia',
				code: 'ID'
			},
			{
				name: 'Iran, Islamic Republic Of',
				code: 'IR'
			},
			{
				name: 'Iraq',
				code: 'IQ'
			},
			{
				name: 'Ireland',
				code: 'IE'
			},
			{
				name: 'Isle of Man',
				code: 'IM'
			},
			{
				name: 'Israel',
				code: 'IL'
			},
			{
				name: 'Italy',
				code: 'IT'
			},
			{
				name: 'Jamaica',
				code: 'JM'
			},
			{
				name: 'Japan',
				code: 'JP'
			},
			{
				name: 'Jersey',
				code: 'JE'
			},
			{
				name: 'Jordan',
				code: 'JO'
			},
			{
				name: 'Kazakhstan',
				code: 'KZ'
			},
			{
				name: 'Kenya',
				code: 'KE'
			},
			{
				name: 'Kiribati',
				code: 'KI'
			},
			{
				name: 'Korea, Democratic People\'S Republic of',
				code: 'KP'
			},
			{
				name: 'Korea, Republic of',
				code: 'KR'
			},
			{
				name: 'Kuwait',
				code: 'KW'
			},
			{
				name: 'Kyrgyzstan',
				code: 'KG'
			},
			{
				name: 'Lao People\'S Democratic Republic',
				code: 'LA'
			},
			{
				name: 'Latvia',
				code: 'LV'
			},
			{
				name: 'Lebanon',
				code: 'LB'
			},
			{
				name: 'Lesotho',
				code: 'LS'
			},
			{
				name: 'Liberia',
				code: 'LR'
			},
			{
				name: 'Libyan Arab Jamahiriya',
				code: 'LY'
			},
			{
				name: 'Liechtenstein',
				code: 'LI'
			},
			{
				name: 'Lithuania',
				code: 'LT'
			},
			{
				name: 'Luxembourg',
				code: 'LU'
			},
			{
				name: 'Macao',
				code: 'MO'
			},
			{
				name: 'Macedonia, The Former Yugoslav Republic of',
				code: 'MK'
			},
			{
				name: 'Madagascar',
				code: 'MG'
			},
			{
				name: 'Malawi',
				code: 'MW'
			},
			{
				name: 'Malaysia',
				code: 'MY'
			},
			{
				name: 'Maldives',
				code: 'MV'
			},
			{
				name: 'Mali',
				code: 'ML'
			},
			{
				name: 'Malta',
				code: 'MT'
			},
			{
				name: 'Marshall Islands',
				code: 'MH'
			},
			{
				name: 'Martinique',
				code: 'MQ'
			},
			{
				name: 'Mauritania',
				code: 'MR'
			},
			{
				name: 'Mauritius',
				code: 'MU'
			},
			{
				name: 'Mayotte',
				code: 'YT'
			},
			{
				name: 'Mexico',
				code: 'MX'
			},
			{
				name: 'Micronesia, Federated States of',
				code: 'FM'
			},
			{
				name: 'Moldova, Republic of',
				code: 'MD'
			},
			{
				name: 'Monaco',
				code: 'MC'
			},
			{
				name: 'Mongolia',
				code: 'MN'
			},
			{
				name: 'Montserrat',
				code: 'MS'
			},
			{
				name: 'Morocco',
				code: 'MA'
			},
			{
				name: 'Mozambique',
				code: 'MZ'
			},
			{
				name: 'Myanmar',
				code: 'MM'
			},
			{
				name: 'Namibia',
				code: 'NA'
			},
			{
				name: 'Nauru',
				code: 'NR'
			},
			{
				name: 'Nepal',
				code: 'NP'
			},
			{
				name: 'Netherlands',
				code: 'NL'
			},
			{
				name: 'Netherlands Antilles',
				code: 'AN'
			},
			{
				name: 'New Caledonia',
				code: 'NC'
			},
			{
				name: 'New Zealand',
				code: 'NZ'
			},
			{
				name: 'Nicaragua',
				code: 'NI'
			},
			{
				name: 'Niger',
				code: 'NE'
			},
			{
				name: 'Nigeria',
				code: 'NG'
			},
			{
				name: 'Niue',
				code: 'NU'
			},
			{
				name: 'Norfolk Island',
				code: 'NF'
			},
			{
				name: 'Northern Mariana Islands',
				code: 'MP'
			},
			{
				name: 'Norway',
				code: 'NO'
			},
			{
				name: 'Oman',
				code: 'OM'
			},
			{
				name: 'Pakistan',
				code: 'PK'
			},
			{
				name: 'Palau',
				code: 'PW'
			},
			{
				name: 'Palestinian Territory, Occupied',
				code: 'PS'
			},
			{
				name: 'Panama',
				code: 'PA'
			},
			{
				name: 'Papua New Guinea',
				code: 'PG'
			},
			{
				name: 'Paraguay',
				code: 'PY'
			},
			{
				name: 'Peru',
				code: 'PE'
			},
			{
				name: 'Philippines',
				code: 'PH'
			},
			{
				name: 'Pitcairn',
				code: 'PN'
			},
			{
				name: 'Poland',
				code: 'PL'
			},
			{
				name: 'Portugal',
				code: 'PT'
			},
			{
				name: 'Puerto Rico',
				code: 'PR'
			},
			{
				name: 'Qatar',
				code: 'QA'
			},
			{
				name: 'Reunion',
				code: 'RE'
			},
			{
				name: 'Romania',
				code: 'RO'
			},
			{
				name: 'Russian Federation',
				code: 'RU'
			},
			{
				name: 'RWANDA',
				code: 'RW'
			},
			{
				name: 'Saint Helena',
				code: 'SH'
			},
			{
				name: 'Saint Kitts and Nevis',
				code: 'KN'
			},
			{
				name: 'Saint Lucia',
				code: 'LC'
			},
			{
				name: 'Saint Pierre and Miquelon',
				code: 'PM'
			},
			{
				name: 'Saint Vincent and the Grenadines',
				code: 'VC'
			},
			{
				name: 'Samoa',
				code: 'WS'
			},
			{
				name: 'San Marino',
				code: 'SM'
			},
			{
				name: 'Sao Tome and Principe',
				code: 'ST'
			},
			{
				name: 'Saudi Arabia',
				code: 'SA'
			},
			{
				name: 'Senegal',
				code: 'SN'
			},
			{
				name: 'Serbia and Montenegro',
				code: 'CS'
			},
			{
				name: 'Seychelles',
				code: 'SC'
			},
			{
				name: 'Sierra Leone',
				code: 'SL'
			},
			{
				name: 'Singapore',
				code: 'SG'
			},
			{
				name: 'Slovakia',
				code: 'SK'
			},
			{
				name: 'Slovenia',
				code: 'SI'
			},
			{
				name: 'Solomon Islands',
				code: 'SB'
			},
			{
				name: 'Somalia',
				code: 'SO'
			},
			{
				name: 'South Africa',
				code: 'ZA'
			},
			{
				name: 'South Georgia and the South Sandwich Islands',
				code: 'GS'
			},
			{
				name: 'Spain',
				code: 'ES'
			},
			{
				name: 'Sri Lanka',
				code: 'LK'
			},
			{
				name: 'Sudan',
				code: 'SD'
			},
			{
				name: 'Suriname',
				code: 'SR'
			},
			{
				name: 'Svalbard and Jan Mayen',
				code: 'SJ'
			},
			{
				name: 'Swaziland',
				code: 'SZ'
			},
			{
				name: 'Sweden',
				code: 'SE'
			},
			{
				name: 'Switzerland',
				code: 'CH'
			},
			{
				name: 'Syrian Arab Republic',
				code: 'SY'
			},
			{
				name: 'Taiwan, Province of China',
				code: 'TW'
			},
			{
				name: 'Tajikistan',
				code: 'TJ'
			},
			{
				name: 'Tanzania, United Republic of',
				code: 'TZ'
			},
			{
				name: 'Thailand',
				code: 'TH'
			},
			{
				name: 'Timor-Leste',
				code: 'TL'
			},
			{
				name: 'Togo',
				code: 'TG'
			},
			{
				name: 'Tokelau',
				code: 'TK'
			},
			{
				name: 'Tonga',
				code: 'TO'
			},
			{
				name: 'Trinidad and Tobago',
				code: 'TT'
			},
			{
				name: 'Tunisia',
				code: 'TN'
			},
			{
				name: 'Turkey',
				code: 'TR'
			},
			{
				name: 'Turkmenistan',
				code: 'TM'
			},
			{
				name: 'Turks and Caicos Islands',
				code: 'TC'
			},
			{
				name: 'Tuvalu',
				code: 'TV'
			},
			{
				name: 'Uganda',
				code: 'UG'
			},
			{
				name: 'Ukraine',
				code: 'UA'
			},
			{
				name: 'United Arab Emirates',
				code: 'AE'
			},
			{
				name: 'United Kingdom',
				code: 'GB'
			},
			{
				name: 'United States',
				code: 'US'
			},
			{
				name: 'United States Minor Outlying Islands',
				code: 'UM'
			},
			{
				name: 'Uruguay',
				code: 'UY'
			},
			{
				name: 'Uzbekistan',
				code: 'UZ'
			},
			{
				name: 'Vanuatu',
				code: 'VU'
			},
			{
				name: 'Venezuela',
				code: 'VE'
			},
			{
				name: 'Vietnam',
				code: 'VN'
			},
			{
				name: 'Virgin Islands, British',
				code: 'VG'
			},
			{
				name: 'Virgin Islands, U.S.',
				code: 'VI'
			},
			{
				name: 'Wallis and Futuna',
				code: 'WF'
			},
			{
				name: 'Western Sahara',
				code: 'EH'
			},
			{
				name: 'Yemen',
				code: 'YE'
			},
			{
				name: 'Zambia',
				code: 'ZM'
			},
			{
				name: 'Zimbabwe',
				code: 'ZW'
			}
		];

	})
	.controller('researchprovidersregisterCtrl', function ($scope, $http, $location, localStorageService, $rootScope, usertype, validation, RequestDetail, $timeout, configdetails, alertService) {
		$scope.configdetails = configdetails;
		$scope.box_step1 = true;
		$scope.box_step2 = false;
		$scope.box_step3 = false;
		$scope.box_step4 = false;
		$scope.box_step30 = false;
		$scope.stepStatus = '1';
		$scope.reached = 1;
		$scope.stepActive1 = 'step-active pointer';
		$scope.dashActive1 = '';
		$scope.textActive1 = 'no-border';
		$scope.textCompleted1 = '';
		$scope.errorMsg = '';

		$scope.step2 = {};
		$scope.step2.country = '';
		$scope.step2.firstname = '';
		$scope.step2.lastname = '';
		$scope.step2.title = '';

		//research provider
		$scope.step2.website = '';
		//research provider

		$scope.step2.email = '';
		$scope.step2.password = '';
		$scope.step2.phone = '';
		$scope.step2.address1 = '';
		$scope.address2 = '';
		$scope.step2.city = '';
		$scope.step2.state = '';
		$scope.step2.zip = '';
		$scope.step2.department = [];

		$scope.step2.business = '';
		$scope.step2.assetclass = [];
		$scope.step2.capitalization = [];

		$scope.step2.industry = [];
		$scope.step2.geography = [];

		$scope.step2.industry1 = [];

		$scope.name = '';





		$scope.step3 = {};
		$scope.step3.companyName = '';
		$scope.step3.ticker = '';
		$scope.website = '';
		$scope.step3.streetAddress1 = '';
		$scope.step3.city = '';
		$scope.step3.state = '';
		$scope.step3.country = '';
		$scope.step3.zip = '';
		$scope.streetAddress2 = '';
		$scope.spinnerActive = false;
		$scope.corporate_id = '';
		$scope.usertypeSelect = '';
		$scope.corporateSelect = '';
		$scope.investorSelect = '';
		$scope.brokerSelect = '';
		$scope.paymentActive1 = '';
		$scope.paymentActive2 = '';
		$scope.paymentActive3 = '';
		var pa = 'paymentActive';
		$scope.corporate_list = [];
		$scope.corporatelistAdded = [];
		$scope.valCorpList = {};
		$scope.same_address = '';
		$scope.emailprocess = false;

		$scope.usertypeSelect == 'broker'

		$scope.updateEmailprocess = function (val) {
			$scope.emailprocess = val;
		}

		$scope.copy_address = function () {
			if ($scope.same_address == true) {
				$scope.step3.streetAddress1 = $scope.step2.address1;
				$scope.streetAddress2 = $scope.step2.address2;
				$scope.step3.city = $scope.step2.city
				$scope.step3.state = $scope.step2.state;
				$scope.step3.zip = $scope.step2.zip;
				$scope.step3.country = $scope.step2.country;

			} else {
				$scope.step3.streetAddress1 = '';
				$scope.streetAddress2 = '';
				$scope.step3.city = '';
				$scope.step3.state = '';
				$scope.step3.zip = '';
				$scope.step3.country = '';
			}
		}


		var coverage_url = 'apiv4/public/user/getcorporatedetails';

		/*RequestDetail.getDetail(coverage_url).then(function(result){
		    if(angular.isDefined(result.data) && angular.isDefined(result.data.corporate_data) && result.data.corporate_data.length>0){
		        $scope.corporate_list = result.data.corporate_data;
		    }
		});*/

		/*var coverage_url = 'apiv4/public/user/primary_interests';

		RequestDetail.getDetail(coverage_url).then(function(result){
		    if(angular.isDefined(result.data) && result.data.length>0){
		        $scope.primary_interests = result.data;
		    }
		});*/


		$scope.company_logo = [];

		$scope.fileuploadcmylogo = function (imgdata) {
			$scope.$apply(function () {
				$scope.company_logo = [];
				$scope.company_logo.push({
					file_name: imgdata,
					file_location: 'uploads/Profile_Image/' + imgdata
				})

				$scope.step2.cmylogo = 'uploads/Profile_Image/' + imgdata;
			});
		}

		$scope.profilepic = [];

		$scope.fileuploadprofilelogo = function (imgdata) {
			$scope.$apply(function () {
				$scope.profilepic = [];
				$scope.profilepic.push({
					file_name: imgdata,
					file_location: 'uploads/Profile_Image/' + imgdata
				})

				$scope.step2.profilepic = 'uploads/Profile_Image/' + imgdata;
			});
		}



		$scope.coveragefile = [];
		$scope.removeFilescoverage = function (index) {
			$scope.coveragefile.splice(index, 1);
		}

		$scope.uploadFilecov = function (imgdata) {
			$scope.$apply(function () {
				$scope.coveragefile = [];
				$scope.coveragefile.push({
					file_name: imgdata,
					file_location: 'uploads/temp/' + imgdata
				});
			});
		}

		$scope.saveindustry = function () {
			$scope.step2.industry = [];
			$.each($scope.step2.industry1, function (index, industry) {
				if (industry == true) {
					$scope.step2.industry.push(index);
				}
			});
		}

		$scope.savedepartment = function () {
			$scope.step2.department = [];
			$.each($scope.step2.department1, function (index, department) {

				$scope.step2.department.push(index);
			});
		}
		$scope.saveassetclass = function () {
			$scope.step2.assetclass = [];
			$.each($scope.step2.assetclass1, function (index, assetclass) {

				$scope.step2.assetclass.push(index);
			});
		}

		$scope.savecapitalization = function () {
			$scope.step2.capitalization = [];
			$.each($scope.step2.capitalization1, function (index, capitalization) {

				$scope.step2.capitalization.push(index);
			});
		}

		$scope.savegeography = function () {
			$scope.step2.geography = [];
			$.each($scope.step2.geography1, function (index, geography) {

				$scope.step2.geography.push(index);
			});
		}



		$scope.localSearch = function (str, corporate_list) {
			var coverage_url = 'apiv4/public/user/getcorporatedetails';
			var params = str.toString().toLowerCase();
			RequestDetail.getDetail(coverage_url, params).then(function (result) {
				if (angular.isDefined(result.data) && angular.isDefined(result.data.corporate_data) && result.data.corporate_data.length > 0) {
					$scope.corporate_list = result.data.corporate_data;
					$scope.$broadcast('angucomplete-alt:changeInput', 'corpList', 'Hello!');
				}
			});

		}

		$scope.searchAPI = function (userInputString, timeoutPromise) {
			var coverage_url = 'apiv4/public/user/getcorporatedetails';
			var params = str.toString().toLowerCase();

			// return $http.post('/yourownapiv4/public/', {q: userInputString}, {timeout: timeoutPromise});
		}


		$scope.selectCorporatelist = function (selected) {
			if (angular.isDefined(selected) && angular.isDefined(selected.originalObject) && angular.isDefined(selected.originalObject.id) &&
				angular.isDefined(selected.originalObject.name)) {
				$scope.valCorpList = selected.originalObject;
			}
		}

		$scope.addCorpList = function () {
			if (angular.isDefined($scope.valCorpList) && angular.isDefined($scope.valCorpList.id) && $scope.valCorpList.id != '') {
				if ($scope.corporatelistAdded.indexOf($scope.valCorpList) == -1) {
					$scope.corporatelistAdded.push($scope.valCorpList);
					// $scope.valCorpList = {};
					$scope.$broadcast('angucomplete-alt:clearInput', 'corpList');

					// var url = 'apiv4/public/user/addCorporateList';
					//  var params = {
					//      type : 'put',
					//      corporateList : $scope.corporatelistAdded
					//  };
					//  RequestDetail.getDetail(url,params).then(function(result) {

					//  });
				} else {
					alert("Already Added in the List");
					//$scope.corp.valCorpList = '';
					$scope.$broadcast('angucomplete-alt:clearInput', 'corpList');
				}
			}
		}

		//remove coverage
		$scope.removeCorporate = function (index) {
			$scope.corporatelistAdded.splice(index, 1);
		}


		$scope.step2Country = function (selected) {
			$scope.step2.country = selected.title;
		}

		$scope.checkTerms = function () {
			return false;
		}
		$scope.uploadFile = function (files) {
			$scope.step3.image = files;
		};


		$scope.logoupload = function () {
			$(function () {
				$('#fileupload').fileupload({
					dataType: 'json',
					done: function (e, data) {
						$.each(data.result.files, function (index, file) {
							var thumb_url = file.thumbnailUrl;
							$("#theDiv").html("<img id='span' src='" + thumb_url + "'/>");
							document.getElementById('theDiv').value = file.name;
						});
					}
				});
			});
		}


		// Country Matched for state 2 
		$scope.get_master_country2 = function (id) {
			var tagUrl = 'apiv4/public/dashboard/get_master_country';
			var params = $("#" + id).val();
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				if (angular.isDefined(result.data)) {
					$scope.step3.country = result.data.name;
				}
			});
		}

		// Country Matched for state
		$scope.get_master_country = function (id) {
			var tagUrl = 'apiv4/public/dashboard/get_master_country';
			var params = $("#" + id).val();
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				if (angular.isDefined(result.data)) {
					$scope.step2.country = result.data.name;
				}
			});
		}

		// City Autocomplete for register page 
		$scope.get_auto_city = function (id) {
			var tagUrl = 'apiv4/public/dashboard/get_auto_city';
			var params = $("#" + id).val();
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				$("#" + id).autocomplete({
					source: result.data,
					select: function (a, b) {
						$scope.$apply(function () {
							$scope.step2.city = b.item.value;
							$scope.step2.state = b.item.state;
							$scope.step2.country = b.item.country;
						});
						$("#" + id).trigger('input');
						$('#textZip').focus();
					}
				});
			});
		}

		// City Autocomplete for register page 

		$scope.get_auto_city2 = function (id) {
			var tagUrl = 'apiv4/public/dashboard/get_auto_city';
			var params = $("#" + id).val();
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				$("#" + id).autocomplete({
					source: result.data,
					select: function (a, b) {

						$scope.step3.city = b.item.value;
						$scope.step3.state = b.item.state;
						$scope.step3.country = b.item.country;
						$("#" + id).trigger('input');
						$('#textZip').focus();

					}
				});
			});
		}

		// State Autocomplete for register page 

		$scope.get_auto_state = function (id) {
			var tagUrl = 'apiv4/public/dashboard/get_auto_state';
			var params = $("#" + id).val();
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				$("#" + id).autocomplete({
					source: result.data,
					select: function (a, b) {

						$scope.step2.state = b.item.value;
						$scope.step2.country = b.item.country;
						$("#" + id).trigger('input');
						$('#textZip').focus();

					}
				});
			});
		}
		// State Autocomplete for register page 2

		$scope.get_auto_state2 = function (id) {
			var tagUrl = 'apiv4/public/dashboard/get_auto_state';
			var params = $("#" + id).val();
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				$("#" + id).autocomplete({
					source: result.data,
					select: function (a, b) {

						$scope.step3.state = b.item.value;
						$scope.step3.country = b.item.country;
						$("#" + id).trigger('input');
						$('#textZip2').focus();

					}
				});
			});
		}


		//Global, US, Canada, Latin America, Europe, Russia, Japan, China, India, Asia, Australia, Middle East/Africa (MENA), Emerging Markets, Frontier Markets

		function chunk(arr, size) {
			var newArr = [];
			for (var i = 0; i < arr.length; i += size) {
				newArr.push(arr.slice(i, i + size));
			}
			return newArr;
		}

		var tagUrl = 'apiv4/public/user/get_search_details1';

		var params = {
			term: '',
			key: 'allindustry'
		};
		RequestDetail.getDetail(tagUrl, params).then(function (result) {
			if (angular.isDefined(result.data) && result.data.length > 0) {
				$scope.availableallIndustry = chunk(result.data, 28);
				
			} else {
				$scope.availableallIndustry = [];
			}
		});


		$scope.availableDepartment = ['Research', 'Consulting', 'Software', 'Data', 'News', 'Other'];
		$scope.availableAssetclass = ['Equities & ETFs', 'Fixed Income', 'Commodities', 'FX & Currency', 'Alternative Assets and Derivatives', 'Real Estate'];
		$scope.availableCapitalization = ['Private/Pre-IPO', 'Small Cap (>$2Bn)', 'Medium Cap ($2-10Bn)', 'Large Cap ($10-100B)', 'Mega Cap (>$100B)'];
		$scope.availableGeography = ['Global', 'US', 'Canada', 'Latin America', 'Europe', 'Russia', 'Japan', 'China', 'India', 'Asia', 'Australia', 'Middle East/Africa (MENA)', 'Emerging Markets', 'Frontier Markets'];

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
								$scope.availableIndustry.push('All');
							} else {
								$scope.availableIndustry = [];
							}
						});
					}
					if (type == 'geography') {
						$scope.availableGeography = ['Global', 'US', 'Canada', 'Latin America', 'Europe', 'Russia', 'Japan', 'China', 'India', 'Asia', 'Australia', 'Middle East/Africa (MENA)', 'Emerging Markets', 'Frontier Markets'];
					}
					if (type == 'department') {
						$scope.availableDepartment = ['Research', 'Consulting', 'Software', 'Data', 'News', 'Other'];
					}

					if (type == 'assetclass') {
						$scope.availableAssetclass = ['Equities & ETFs', 'Fixed Income', 'Commodities', 'FX & Currency', 'Alternative Assets and Derivatives', 'Real Estate'];
					}
					if (type == 'capitalization') {
						$scope.availableCapitalization = ['Private/Pre-IPO', 'Small Cap (>$2Bn)', 'Medium Cap ($2-10Bn)', 'Large Cap ($10-100B)', 'Mega Cap (>$100B)'];
					}


				}
			}
		}


		// Country Autocomplete for register page 

		$scope.get_auto_country = function (id) {
			var tagUrl = 'apiv4/public/dashboard/get_auto_country';
			var params = $("#" + id).val();
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				$("#" + id).autocomplete({
					source: result.data,
					select: function (a, b) {
						$("#" + id).trigger('input');
						$scope.step2.country = b.item.value;
						$('#textZip2').focus();

					}
				});
			});
		}

		// Country Autocomplete for register page 

		$scope.get_auto_country2 = function (id) {
			var tagUrl = 'apiv4/public/dashboard/get_auto_country';
			var params = $("#" + id).val();
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				$("#" + id).autocomplete({
					source: result.data,
					select: function (a, b) {
						$timeout(function () {
							$("#" + id).trigger('input');
						}, 0);
						$scope.step3.country = b.item.value;
						$('#textZip2').focus();

					}
				});
			});
		}



		// Ticker Autocomplete for register page 

		$scope.get_auto_ticker = function () {
			var tagUrl = 'apiv4/public/dashboard/get_auto_ticker';
			var params = $("#ticker_list").val();
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				$("#ticker_list").autocomplete({
					source: result.data,
					select: function (a, b) {
						$timeout(function () {
							$("#ticker_list").trigger('input');
						}, 0);
						$scope.button_disable = [];
						$scope.step3.ticker = b.item.value;
						$scope.step3.ticker_id = b.item.ticker_id;
						$scope.step3.companyName = b.item.company_name;
						$scope.step3.website = b.item.website;
						$scope.step3.city = b.item.city;
						$scope.step3.state = b.item.state;
						$scope.step3.country = b.item.country;
						$scope.step3.zip = b.item.zip;
						$scope.step3.description = b.item.description;
						$scope.step3.streetAddress1 = b.item.address;
						$scope.streetAddress2 = b.item.address2;
						$scope.button_disable = true;
						$scope.same_address = false;

					}
				});
			});
		}



		// Autocomplete Company name 
		$scope.get_auto_company = function () {
			var tagUrl = 'apiv4/public/dashboard/get_company_names';
			var params = $('#company_name').val();
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				$("#company_name").autocomplete({
					source: result.data,
					select: function (a, b) {

						$timeout(function () {
							$("#company_name").trigger('input');
						}, 0);

						$scope.button_disable = [];
						$scope.step3.companyName = b.item.value;
						$scope.step3.company_id = b.item.company_id;
						$scope.step3.website = b.item.website;
						$scope.step3.city = b.item.city;
						$scope.step3.state = b.item.state;
						$scope.step3.country = b.item.country;
						$scope.step3.zip = b.item.zip;
						$scope.step3.description = b.item.description;
						$scope.step3.streetAddress1 = b.item.address;
						$scope.streetAddress2 = b.item.address2;
						$scope.button_disable = true;
						$scope.same_address = false;

					}
				});
			});
		}


		//get Ticker On select autocomplete ticker 

		$scope.select_broker_code = function (selected) {

			if (selected != undefined) {
				$scope.button_disable = [];
				$scope.step2.broker_code = selected.originalObject.broker_code;
				$scope.step2.companyname = selected.originalObject.company_name;
				$scope.website = selected.originalObject.website;
				$scope.step2.city = selected.originalObject.city;
				$scope.step2.state = selected.originalObject.state;
				$scope.step2.country = selected.originalObject.country;
				$scope.step2.zip = selected.originalObject.zip;
				$scope.step2.address1 = selected.originalObject.address;
				$scope.step2.address2 = selected.originalObject.address2;
				$scope.button_disable = true;

			} else {
				$scope.button_disable = [];
				$scope.step2.broker_code = '';
				$scope.step2.companyName = '';
				$scope.website = '';
				$scope.step2.city = '';
				$scope.step2.state = '';
				$scope.step2.country = '';
				$scope.step2.zip = '';
				$scope.step2.address1 = '';
				$scope.step2.address2 = '';

				$scope.button_disable = false;
			}
		}

		$scope.step3.agree = true;
		

		

		$scope.closeexitsmodal = function () {
			$scope.showModalexitscompany = false;
		}

		$scope.getcompanyinfo = function () {
			$scope.exits_companies = [];
			var tagUrl = 'apiv4/public/user/getcompanybroker';
			var params = { companyname:$scope.step2.companyname} ;
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				$scope.step2.lockcompany = false;
				$scope.exits_companies = result.data;
				
				if($scope.exits_companies.length>0){
					$scope.showModalexitscompany = true;
				}
				if(result.data){
					$scope.step2.website = result.data.website;
					$scope.step2.address1 = result.data.address;
					$scope.step2.address2 = result.data.address2;
					$scope.step2.city = result.data.city;
					$scope.step2.state = result.data.state;
					$scope.step2.country = result.data.country;
					$scope.step2.zip = result.data.zip;

					if(result.data.business_model){
						$scope.step2.business = result.data.business_model;
					}
					if(result.data.asset_classes){
						$scope.step2.assetclass =  result.data.asset_classes.split(',');
					}
					if(result.data.department){
						$scope.step2.department = result.data.department.split(',');
					}
					if(result.data.capitalization){
						$scope.step2.capitalization = result.data.capitalization.split(',');
					}
					if(result.data.broker_geography){
						//$scope.step2.geography = result.data.broker_geography.split(',');
					}
					if(result.data.broker_industry){
						//$scope.step2.industry =result.data.broker_industry.split(',');
					}
					
				}
			});
		}


		$scope.step2.existsoldcompany_id = 0;// new company
		$scope.step2.lockcompany = false;
		$scope.registerbycmy = '0';
		$scope.selectexistcompany = function (result) {

			if(result=='0'){
				$scope.step2.existsoldcompany_id = 0; // new company
				$scope.step2.lockcompany = false;

				$scope.company_logo = [];
				$scope.step2.cmylogo = "";

				$scope.step2.website = "";
				$scope.step2.address1 = "";
				$scope.step2.address2 = "";
				$scope.step2.city = "";
				$scope.step2.state = "";
				$scope.step2.country = "";
				$scope.step2.zip = "";

				$scope.step2.business = "";
				$scope.step2.assetclass = "";
				$scope.step2.department = "";
				$scope.step2.capitalization = "";

			}else{

				result = JSON.parse(result);
				
				$scope.company_logo = [];

				$scope.company_logo.push({
					file_name: result.logo,
					file_location: result.logo
				});

				$scope.step2.cmylogo = result.logo; 
				$scope.step2.existsoldcompany_id = result.id; // new company

				$scope.step2.lockcompany = true;
				$scope.step2.website = result.website;
				$scope.step2.address1 = result.address;
				$scope.step2.address2 = result.address2;
				$scope.step2.city = result.city;
				$scope.step2.state = result.state;
				$scope.step2.country = result.country;
				$scope.step2.zip = result.zip;

				if(result.business_model){
					$scope.step2.business = result.business_model;
				}
				if(result.asset_classes){
					$scope.step2.assetclass =  result.asset_classes.split(',');
				}
				if(result.department){
					$scope.step2.department = result.department.split(',');
				}
				if(result.capitalization){
					$scope.step2.capitalization = result.capitalization.split(',');
				}
				if(result.broker_geography){
					//$scope.step2.geography = result.broker_geography.split(',');
				}
				if(result.broker_industry){
					//$scope.step2.industry =result.broker_industry.split(',');
				}
			}

			$scope.showModalexitscompany = false;
		}


		/* Get payment function */
		$scope.getPay = function (id) {

			$scope.corporate_id = 121;

			if (angular.isUndefined($scope.step3.agree) || $scope.step3.agree == '') {
				$scope.showtermserror = true;
				return false;
			} else {
				$scope.spinnerActive = true;
				var params = {};

				$scope.showtermserror = false;
				var x = pa + id;

				$(".payment-single").removeClass('payment-active');
				$scope[x] = 'payment-active';


				var userTypeId = '3';

				localStorageService.set('usertype', 'broker');

				var url = 'apiv4/public/user/register_provider';
				if (angular.isDefined($scope.corporatelistAdded)) {
					params = {
						data: $scope.step2,
						corporate_list: $scope.corporatelistAdded,
						subsType: id,
						coveragefile: $scope.coveragefile
					};
				} else {
					params = {
						data: $scope.step2,
						corporate_list: '',
						subsType: id
					};
				}


				RequestDetail.getDetail(url, params).then(function (result) {
					if (angular.isDefined(result.data) && result.data != '') {

						//localStorageService.set('userdata', result.data);
						//localStorageService.set('userimage', result.data.image);
						//localStorageService.set('password', result.data.password);
						//localStorageService.set('email', result.data.email);


						localStorageService.set('research_provider_status', 1);

						$timeout(function () {
							$scope.spinnerActive = false;

							alertService.add("success", 'Registered Successfully!', 2000);

							$location.path('login');
						}, 2000);
						// return false;

						// if(localStorageService.get('url') !='')
						// {	
						// //	$location.path(localStorageService.get('url')); 
						// }
						// else
						// {	
						// 	$timeout(function(){
						// 		$scope.spinnerActive = false;
						// 		$location.path('dashboard'); 
						// 	}, 2000); 

						// }
					}
				});

			}
		}




		$scope.step2 = {};

		// AUM 

		$scope.aum = [

			{
				value: '1',
				text: '< $200M'
			},
			{
				value: '2',
				text: '$200M - $1Bn'
			},
			{
				value: '3',
				text: '$1Bn - $5Bn'
			},
			{
				value: '4',
				text: '>$5Bn'
			}
		];
		$scope.aum_array = angular.copy($scope.aum);



		//  Holding Period (Turnover) 

		$scope.holding_period = [

			{
				value: '1',
				text: '< 4 Months'
			},
			{
				value: '2',
				text: '4 - 12 Months'
			},
			{
				value: '3',
				text: '12 - 24 Months'
			},
			{
				value: '4',
				text: '> 24 Months'
			}
		];
		$scope.holding_period_array = angular.copy($scope.holding_period);



		//  Institutional Type 

		$scope.institution_type = [

			{
				value: '1',
				text: 'Bank'
			},
			{
				value: '2',
				text: 'Hedge Fund'
			},
			{
				value: '3',
				text: 'Investment Adviser'
			},
			{
				value: '4',
				text: 'Mutual Fund'
			},
			{
				value: '5',
				text: 'Pension Fund'
			},
			{
				value: '6',
				text: 'Family Office'
			},
			{
				value: '7',
				text: 'Other      '
			}
		];
		$scope.institution_type_array = angular.copy($scope.institution_type);


		//  Style / Strategy

		$scope.style = [

			{
				value: '1',
				text: 'Equity Long'
			},
			{
				value: '2',
				text: 'Equity Hedge (Long / Short)'
			},
			{
				value: '3',
				text: 'Market Neutral'
			},
			{
				value: '4',
				text: 'Event Driven'
			},
			{
				value: '5',
				text: 'Global Macro'
			},
			{
				value: '6',
				text: 'Arbitrage'
			},
			{
				value: '7',
				text: 'Multi Strategy'
			}
		];
		$scope.style_array = angular.copy($scope.style);



		//  Follow-up

		$scope.follow_up = [

			{
				value: '1',
				text: 'Follow-up Explanation'
			},
			{
				value: '2',
				text: 'Request Data'
			},
			{
				value: '3',
				text: 'Request a Model'
			},
			{
				value: '4',
				text: 'Request Report/study'
			},
			{
				value: '5',
				text: 'Request Presentation'
			},
			{
				value: '6',
				text: 'Request an Introduction'
			},
			{
				value: '7',
				text: 'Other Follow-up'
			},
		];
		$scope.follow_up_array = angular.copy($scope.follow_up);


		/* Functions for steps to conduct */

		$scope.emailunique = 1;

		$scope.emailuniquecheck = function () {
			var tagUrl = 'apiv4/public/user/checkEmail';
			var params = { email:$scope.step2.email } ;
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				if(result.data.user){
					alertService.add("warning", "Email already registered !", 2000);
					$scope.emailunique = 0;
				}else{
					$scope.emailunique = 1;
				}
			});
		}


		$scope.nextStep = function () {

			

			//rp error check

			/*if (angular.isUndefined($scope.step2.department) || $scope.step2.department == '') {
				alertService.add("warning", "Type of Research Invalid !", 2000);
				return false;
			}
			if (angular.isUndefined($scope.step2.business) || $scope.step2.business == '') {
				alertService.add("warning", "Business Model Invalid !", 2000);
				return false;
			}
			if (angular.isUndefined($scope.step2.assetclass) || $scope.step2.assetclass == '') {
				alertService.add("warning", "Asset Classes Covered Invalid !", 2000);
				return false;
			}
			if (angular.isUndefined($scope.step2.capitalization) || $scope.step2.capitalization == '') {
				alertService.add("warning", "Market Capitalization Invalid !", 2000);
				return false;
			}
			if (angular.isUndefined($scope.step2.industry) || $scope.step2.industry == '') {
				alertService.add("warning", "Industry Invalid !", 2000);
				return false;
			}
			if (angular.isUndefined($scope.step2.geography) || $scope.step2.geography == '') {
				alertService.add("warning", "Geographic Areas of Expertise Invalid !", 2000);
				return false;
			}*/

			

			$scope.$watch('step2.email', function (e, n, v) {
				$scope.step2.email = angular.element('#textEmail').val();
			});

			hideAll();

			// STEP 1 STARTS 


			if (Object.keys($scope.step2form.$error).length > 0) {
				$scope.box_step2 = true;
				return;
			}
			if (angular.isUndefined($scope.step2.country) || $scope.step2.country == '') { // Country Validation 
				return false;
			}

			// STEP 3  STARTS HERE 
			$scope.step3title = [];
			if ($scope.usertypeSelect == 'corporate') {
				$scope.step3title = 'Company Information'; // Step 3 title 
			} else if ($scope.usertypeSelect == 'investor') {
				$scope.step3title = 'Company Information'; // Step 3 title 

			} else {
				$scope.step3title = 'Registration of Company';
			}

			if($scope.emailunique){
				$scope.getPay('1');
			}else{
				alertService.add("warning", "Email already registered !", 2000);
			}
			

			return false;

		}


		$scope.check_broker_code = function () {

			var url = "apiv4/public/user/check_broker_code";
			var params = $scope.step2.broker_codes;

			if (!params) {
				$scope.errorMsg = 'Enter Broker Code ! ';

				$timeout(function () {
					$scope.errorMsg = false;
				}, 1000);
				return false;
			}


			RequestDetail.getDetail(url, params).then(function (result) {

				if (angular.isDefined(result.data) && result.data != '') {

					angular.forEach(result.data, function (broker) {

						//$scope.broker_codes='';
						$scope.button_disable = [];
						$scope.broker_code = false;
						$scope.step3.broker_code = broker.broker_code;
						$scope.step2.companyname = broker.company_name;
						$scope.website = broker.website;
						$scope.step2.city = broker.city;
						$scope.step2.state = broker.state;
						$scope.step2.country = broker.country;
						$scope.step2.zip = broker.zip;
						$scope.step2.address1 = broker.address;
						$scope.step2.address2 = broker.address2;
						$scope.button_disable = true;
						$scope.nextStep();


					});
				} else {
					$scope.errorMsg = 'Broker Code Not Matched ! ';

					$timeout(function () {
						$scope.errorMsg = false;
					}, 2000);
				}
			});


		};

		$scope.selectType = function (type) {

			$scope.corporateSelect = '';
			$scope.investorSelect = '';
			$scope.brokerSelect = '';
			$scope.usertypeSelect = type;
			$scope.step3.ticker = '';
			$scope.is_broker = false;

			if (type == 'corporate') {

				$scope.is_broker = false;
				$scope.corporateSelect = 'active';
			} else if (type == 'investor') {
				$scope.is_broker = false;
				delete $scope.step3.ticker;
				$scope.investorSelect = 'active';
			} else if (type == 'broker') {
				$scope.is_broker = true;
				$scope.brokerSelect = 'active';
			}
		}

		$scope.viewStep = function (args) {

			if (args == '1') {
				$scope.submission2 = false;

				if ($scope.reached >= 1) {
					$scope.stepStatus = '0';
				} else {
					return false;
				}
			}

			if (args == '2') {
				if ($scope.reached >= 2) {
					$scope.stepStatus = '1';
				} else {
					return false;
				}
			}

			if (args == '3') {


				if ($scope.reached >= 3) {
					$scope.stepStatus = '2';
				} else {
					return false;
				}

			}



			if (args == '4') {
				if ($scope.reached >= 4) {
					$scope.stepStatus = '3';
				} else {
					return false;
				}
			}
			if (args == '30') {
				if ($scope.reached >= 4) {
					$scope.stepStatus = '2';
				} else {
					return false;
				}
			}




			$scope.nextStep();
		}

		function hideAll() {
			$scope.box_step1 = false;
			$scope.box_step2 = false;
			$scope.box_step3 = false;
			$scope.box_step30 = false;
			$scope.box_step4 = false;

		}

		$scope.countries = [{
				name: 'Afghanistan',
				code: 'AF'
			},
			{
				name: 'Aland Islands',
				code: 'AX'
			},
			{
				name: 'Albania',
				code: 'AL'
			},
			{
				name: 'Algeria',
				code: 'DZ'
			},
			{
				name: 'American Samoa',
				code: 'AS'
			},
			{
				name: 'AndorrA',
				code: 'AD'
			},
			{
				name: 'Angola',
				code: 'AO'
			},
			{
				name: 'Anguilla',
				code: 'AI'
			},
			{
				name: 'Antarctica',
				code: 'AQ'
			},
			{
				name: 'Antigua and Barbuda',
				code: 'AG'
			},
			{
				name: 'Argentina',
				code: 'AR'
			},
			{
				name: 'Armenia',
				code: 'AM'
			},
			{
				name: 'Aruba',
				code: 'AW'
			},
			{
				name: 'Australia',
				code: 'AU'
			},
			{
				name: 'Austria',
				code: 'AT'
			},
			{
				name: 'Azerbaijan',
				code: 'AZ'
			},
			{
				name: 'Bahamas',
				code: 'BS'
			},
			{
				name: 'Bahrain',
				code: 'BH'
			},
			{
				name: 'Bangladesh',
				code: 'BD'
			},
			{
				name: 'Barbados',
				code: 'BB'
			},
			{
				name: 'Belarus',
				code: 'BY'
			},
			{
				name: 'Belgium',
				code: 'BE'
			},
			{
				name: 'Belize',
				code: 'BZ'
			},
			{
				name: 'Benin',
				code: 'BJ'
			},
			{
				name: 'Bermuda',
				code: 'BM'
			},
			{
				name: 'Bhutan',
				code: 'BT'
			},
			{
				name: 'Bolivia',
				code: 'BO'
			},
			{
				name: 'Bosnia and Herzegovina',
				code: 'BA'
			},
			{
				name: 'Botswana',
				code: 'BW'
			},
			{
				name: 'Bouvet Island',
				code: 'BV'
			},
			{
				name: 'Brazil',
				code: 'BR'
			},
			{
				name: 'British Indian Ocean Territory',
				code: 'IO'
			},
			{
				name: 'Brunei Darussalam',
				code: 'BN'
			},
			{
				name: 'Bulgaria',
				code: 'BG'
			},
			{
				name: 'Burkina Faso',
				code: 'BF'
			},
			{
				name: 'Burundi',
				code: 'BI'
			},
			{
				name: 'Cambodia',
				code: 'KH'
			},
			{
				name: 'Cameroon',
				code: 'CM'
			},
			{
				name: 'Canada',
				code: 'CA'
			},
			{
				name: 'Cape Verde',
				code: 'CV'
			},
			{
				name: 'Cayman Islands',
				code: 'KY'
			},
			{
				name: 'Central African Republic',
				code: 'CF'
			},
			{
				name: 'Chad',
				code: 'TD'
			},
			{
				name: 'Chile',
				code: 'CL'
			},
			{
				name: 'China',
				code: 'CN'
			},
			{
				name: 'Christmas Island',
				code: 'CX'
			},
			{
				name: 'Cocos (Keeling) Islands',
				code: 'CC'
			},
			{
				name: 'Colombia',
				code: 'CO'
			},
			{
				name: 'Comoros',
				code: 'KM'
			},
			{
				name: 'Congo',
				code: 'CG'
			},
			{
				name: 'Congo, The Democratic Republic of the',
				code: 'CD'
			},
			{
				name: 'Cook Islands',
				code: 'CK'
			},
			{
				name: 'Costa Rica',
				code: 'CR'
			},
			{
				name: 'Cote D\'Ivoire',
				code: 'CI'
			},
			{
				name: 'Croatia',
				code: 'HR'
			},
			{
				name: 'Cuba',
				code: 'CU'
			},
			{
				name: 'Cyprus',
				code: 'CY'
			},
			{
				name: 'Czech Republic',
				code: 'CZ'
			},
			{
				name: 'Denmark',
				code: 'DK'
			},
			{
				name: 'Djibouti',
				code: 'DJ'
			},
			{
				name: 'Dominica',
				code: 'DM'
			},
			{
				name: 'Dominican Republic',
				code: 'DO'
			},
			{
				name: 'Ecuador',
				code: 'EC'
			},
			{
				name: 'Egypt',
				code: 'EG'
			},
			{
				name: 'El Salvador',
				code: 'SV'
			},
			{
				name: 'Equatorial Guinea',
				code: 'GQ'
			},
			{
				name: 'Eritrea',
				code: 'ER'
			},
			{
				name: 'Estonia',
				code: 'EE'
			},
			{
				name: 'Ethiopia',
				code: 'ET'
			},
			{
				name: 'Falkland Islands (Malvinas)',
				code: 'FK'
			},
			{
				name: 'Faroe Islands',
				code: 'FO'
			},
			{
				name: 'Fiji',
				code: 'FJ'
			},
			{
				name: 'Finland',
				code: 'FI'
			},
			{
				name: 'France',
				code: 'FR'
			},
			{
				name: 'French Guiana',
				code: 'GF'
			},
			{
				name: 'French Polynesia',
				code: 'PF'
			},
			{
				name: 'French Southern Territories',
				code: 'TF'
			},
			{
				name: 'Gabon',
				code: 'GA'
			},
			{
				name: 'Gambia',
				code: 'GM'
			},
			{
				name: 'Georgia',
				code: 'GE'
			},
			{
				name: 'Germany',
				code: 'DE'
			},
			{
				name: 'Ghana',
				code: 'GH'
			},
			{
				name: 'Gibraltar',
				code: 'GI'
			},
			{
				name: 'Greece',
				code: 'GR'
			},
			{
				name: 'Greenland',
				code: 'GL'
			},
			{
				name: 'Grenada',
				code: 'GD'
			},
			{
				name: 'Guadeloupe',
				code: 'GP'
			},
			{
				name: 'Guam',
				code: 'GU'
			},
			{
				name: 'Guatemala',
				code: 'GT'
			},
			{
				name: 'Guernsey',
				code: 'GG'
			},
			{
				name: 'Guinea',
				code: 'GN'
			},
			{
				name: 'Guinea-Bissau',
				code: 'GW'
			},
			{
				name: 'Guyana',
				code: 'GY'
			},
			{
				name: 'Haiti',
				code: 'HT'
			},
			{
				name: 'Heard Island and Mcdonald Islands',
				code: 'HM'
			},
			{
				name: 'Holy See (Vatican City State)',
				code: 'VA'
			},
			{
				name: 'Honduras',
				code: 'HN'
			},
			{
				name: 'Hong Kong',
				code: 'HK'
			},
			{
				name: 'Hungary',
				code: 'HU'
			},
			{
				name: 'Iceland',
				code: 'IS'
			},
			{
				name: 'India',
				code: 'IN'
			},
			{
				name: 'Indonesia',
				code: 'ID'
			},
			{
				name: 'Iran, Islamic Republic Of',
				code: 'IR'
			},
			{
				name: 'Iraq',
				code: 'IQ'
			},
			{
				name: 'Ireland',
				code: 'IE'
			},
			{
				name: 'Isle of Man',
				code: 'IM'
			},
			{
				name: 'Israel',
				code: 'IL'
			},
			{
				name: 'Italy',
				code: 'IT'
			},
			{
				name: 'Jamaica',
				code: 'JM'
			},
			{
				name: 'Japan',
				code: 'JP'
			},
			{
				name: 'Jersey',
				code: 'JE'
			},
			{
				name: 'Jordan',
				code: 'JO'
			},
			{
				name: 'Kazakhstan',
				code: 'KZ'
			},
			{
				name: 'Kenya',
				code: 'KE'
			},
			{
				name: 'Kiribati',
				code: 'KI'
			},
			{
				name: 'Korea, Democratic People\'S Republic of',
				code: 'KP'
			},
			{
				name: 'Korea, Republic of',
				code: 'KR'
			},
			{
				name: 'Kuwait',
				code: 'KW'
			},
			{
				name: 'Kyrgyzstan',
				code: 'KG'
			},
			{
				name: 'Lao People\'S Democratic Republic',
				code: 'LA'
			},
			{
				name: 'Latvia',
				code: 'LV'
			},
			{
				name: 'Lebanon',
				code: 'LB'
			},
			{
				name: 'Lesotho',
				code: 'LS'
			},
			{
				name: 'Liberia',
				code: 'LR'
			},
			{
				name: 'Libyan Arab Jamahiriya',
				code: 'LY'
			},
			{
				name: 'Liechtenstein',
				code: 'LI'
			},
			{
				name: 'Lithuania',
				code: 'LT'
			},
			{
				name: 'Luxembourg',
				code: 'LU'
			},
			{
				name: 'Macao',
				code: 'MO'
			},
			{
				name: 'Macedonia, The Former Yugoslav Republic of',
				code: 'MK'
			},
			{
				name: 'Madagascar',
				code: 'MG'
			},
			{
				name: 'Malawi',
				code: 'MW'
			},
			{
				name: 'Malaysia',
				code: 'MY'
			},
			{
				name: 'Maldives',
				code: 'MV'
			},
			{
				name: 'Mali',
				code: 'ML'
			},
			{
				name: 'Malta',
				code: 'MT'
			},
			{
				name: 'Marshall Islands',
				code: 'MH'
			},
			{
				name: 'Martinique',
				code: 'MQ'
			},
			{
				name: 'Mauritania',
				code: 'MR'
			},
			{
				name: 'Mauritius',
				code: 'MU'
			},
			{
				name: 'Mayotte',
				code: 'YT'
			},
			{
				name: 'Mexico',
				code: 'MX'
			},
			{
				name: 'Micronesia, Federated States of',
				code: 'FM'
			},
			{
				name: 'Moldova, Republic of',
				code: 'MD'
			},
			{
				name: 'Monaco',
				code: 'MC'
			},
			{
				name: 'Mongolia',
				code: 'MN'
			},
			{
				name: 'Montserrat',
				code: 'MS'
			},
			{
				name: 'Morocco',
				code: 'MA'
			},
			{
				name: 'Mozambique',
				code: 'MZ'
			},
			{
				name: 'Myanmar',
				code: 'MM'
			},
			{
				name: 'Namibia',
				code: 'NA'
			},
			{
				name: 'Nauru',
				code: 'NR'
			},
			{
				name: 'Nepal',
				code: 'NP'
			},
			{
				name: 'Netherlands',
				code: 'NL'
			},
			{
				name: 'Netherlands Antilles',
				code: 'AN'
			},
			{
				name: 'New Caledonia',
				code: 'NC'
			},
			{
				name: 'New Zealand',
				code: 'NZ'
			},
			{
				name: 'Nicaragua',
				code: 'NI'
			},
			{
				name: 'Niger',
				code: 'NE'
			},
			{
				name: 'Nigeria',
				code: 'NG'
			},
			{
				name: 'Niue',
				code: 'NU'
			},
			{
				name: 'Norfolk Island',
				code: 'NF'
			},
			{
				name: 'Northern Mariana Islands',
				code: 'MP'
			},
			{
				name: 'Norway',
				code: 'NO'
			},
			{
				name: 'Oman',
				code: 'OM'
			},
			{
				name: 'Pakistan',
				code: 'PK'
			},
			{
				name: 'Palau',
				code: 'PW'
			},
			{
				name: 'Palestinian Territory, Occupied',
				code: 'PS'
			},
			{
				name: 'Panama',
				code: 'PA'
			},
			{
				name: 'Papua New Guinea',
				code: 'PG'
			},
			{
				name: 'Paraguay',
				code: 'PY'
			},
			{
				name: 'Peru',
				code: 'PE'
			},
			{
				name: 'Philippines',
				code: 'PH'
			},
			{
				name: 'Pitcairn',
				code: 'PN'
			},
			{
				name: 'Poland',
				code: 'PL'
			},
			{
				name: 'Portugal',
				code: 'PT'
			},
			{
				name: 'Puerto Rico',
				code: 'PR'
			},
			{
				name: 'Qatar',
				code: 'QA'
			},
			{
				name: 'Reunion',
				code: 'RE'
			},
			{
				name: 'Romania',
				code: 'RO'
			},
			{
				name: 'Russian Federation',
				code: 'RU'
			},
			{
				name: 'RWANDA',
				code: 'RW'
			},
			{
				name: 'Saint Helena',
				code: 'SH'
			},
			{
				name: 'Saint Kitts and Nevis',
				code: 'KN'
			},
			{
				name: 'Saint Lucia',
				code: 'LC'
			},
			{
				name: 'Saint Pierre and Miquelon',
				code: 'PM'
			},
			{
				name: 'Saint Vincent and the Grenadines',
				code: 'VC'
			},
			{
				name: 'Samoa',
				code: 'WS'
			},
			{
				name: 'San Marino',
				code: 'SM'
			},
			{
				name: 'Sao Tome and Principe',
				code: 'ST'
			},
			{
				name: 'Saudi Arabia',
				code: 'SA'
			},
			{
				name: 'Senegal',
				code: 'SN'
			},
			{
				name: 'Serbia and Montenegro',
				code: 'CS'
			},
			{
				name: 'Seychelles',
				code: 'SC'
			},
			{
				name: 'Sierra Leone',
				code: 'SL'
			},
			{
				name: 'Singapore',
				code: 'SG'
			},
			{
				name: 'Slovakia',
				code: 'SK'
			},
			{
				name: 'Slovenia',
				code: 'SI'
			},
			{
				name: 'Solomon Islands',
				code: 'SB'
			},
			{
				name: 'Somalia',
				code: 'SO'
			},
			{
				name: 'South Africa',
				code: 'ZA'
			},
			{
				name: 'South Georgia and the South Sandwich Islands',
				code: 'GS'
			},
			{
				name: 'Spain',
				code: 'ES'
			},
			{
				name: 'Sri Lanka',
				code: 'LK'
			},
			{
				name: 'Sudan',
				code: 'SD'
			},
			{
				name: 'Suriname',
				code: 'SR'
			},
			{
				name: 'Svalbard and Jan Mayen',
				code: 'SJ'
			},
			{
				name: 'Swaziland',
				code: 'SZ'
			},
			{
				name: 'Sweden',
				code: 'SE'
			},
			{
				name: 'Switzerland',
				code: 'CH'
			},
			{
				name: 'Syrian Arab Republic',
				code: 'SY'
			},
			{
				name: 'Taiwan, Province of China',
				code: 'TW'
			},
			{
				name: 'Tajikistan',
				code: 'TJ'
			},
			{
				name: 'Tanzania, United Republic of',
				code: 'TZ'
			},
			{
				name: 'Thailand',
				code: 'TH'
			},
			{
				name: 'Timor-Leste',
				code: 'TL'
			},
			{
				name: 'Togo',
				code: 'TG'
			},
			{
				name: 'Tokelau',
				code: 'TK'
			},
			{
				name: 'Tonga',
				code: 'TO'
			},
			{
				name: 'Trinidad and Tobago',
				code: 'TT'
			},
			{
				name: 'Tunisia',
				code: 'TN'
			},
			{
				name: 'Turkey',
				code: 'TR'
			},
			{
				name: 'Turkmenistan',
				code: 'TM'
			},
			{
				name: 'Turks and Caicos Islands',
				code: 'TC'
			},
			{
				name: 'Tuvalu',
				code: 'TV'
			},
			{
				name: 'Uganda',
				code: 'UG'
			},
			{
				name: 'Ukraine',
				code: 'UA'
			},
			{
				name: 'United Arab Emirates',
				code: 'AE'
			},
			{
				name: 'United Kingdom',
				code: 'GB'
			},
			{
				name: 'United States',
				code: 'US'
			},
			{
				name: 'United States Minor Outlying Islands',
				code: 'UM'
			},
			{
				name: 'Uruguay',
				code: 'UY'
			},
			{
				name: 'Uzbekistan',
				code: 'UZ'
			},
			{
				name: 'Vanuatu',
				code: 'VU'
			},
			{
				name: 'Venezuela',
				code: 'VE'
			},
			{
				name: 'Vietnam',
				code: 'VN'
			},
			{
				name: 'Virgin Islands, British',
				code: 'VG'
			},
			{
				name: 'Virgin Islands, U.S.',
				code: 'VI'
			},
			{
				name: 'Wallis and Futuna',
				code: 'WF'
			},
			{
				name: 'Western Sahara',
				code: 'EH'
			},
			{
				name: 'Yemen',
				code: 'YE'
			},
			{
				name: 'Zambia',
				code: 'ZM'
			},
			{
				name: 'Zimbabwe',
				code: 'ZW'
			}
		];

	})
	.controller('passwordReset', function ($scope, $http, $location, localStorageService, $rootScope, usertype, RequestDetail, configdetails, alertService) {
		$scope.configdetails = configdetails;
		$scope.spinnerActive = false;
		$scope.resetPassword = function () {
			if (angular.isDefined($scope.email) && $scope.email != '' && $scope.email != null) {
				var url = "apiv4/public/user/reset";
				var params = $scope.email;
				$scope.spinnerActive = true;
				RequestDetail.getDetail(url, params).then(function (result) {
					if (angular.isDefined(result.data) && result.data == 1) {
						alertService.add("success", 'Kindly check your inbox!', 2000);
						$location.path('/login');
					} else {
						alertService.add("warning", 'Email id is not valid Kindly try again!', 2000);
					}
					$scope.spinnerActive = false;
				});
			} else {
				alertService.add("warning", 'Email id is not valid!', 2000);
			}
		}
	})
	.controller('passwordSet', function ($scope, $http, $location, localStorageService, $rootScope, usertype, RequestDetail, configdetails, alertService, $route, $routeParams) {
		$scope.configdetails = configdetails;
		$scope.spinnerActive = false;
		$scope.email = $routeParams.emailId;

		$scope.setpassword_modal = true;


		$scope.setPassword = function () {

			//console.log($scope.password);

			if ($scope.password == '' || angular.isUndefined($scope.password)) {
				alertService.add("warning", "Enter Password Minimum 6 characters length!", 2000);
				return false;
			}

			if ($scope.confirm_password == '' || angular.isUndefined($scope.confirm_password)) {
				alertService.add("warning", "Enter Confirm Password Minimum 6 characters length!", 2000);
				return false;
			}

			if ($scope.password != $scope.confirm_password) {
				alertService.add("warning", "Password & Confirm Password Mismatch!", 2000);
				return false;
			}

			if (angular.isDefined($scope.password) && $scope.password != '' && $scope.password != null) {
				var url = "apiv4/public/user/set";
				var params = {
					email: $scope.email,
					password: $scope.password
				};
				$scope.spinnerActive = true;
				RequestDetail.getDetail(url, params).then(function (result) {
					if (angular.isDefined(result.data) && result.data == 1) {
						$scope.spinnerActive = false;
						alertService.add("success", 'Password Updated Successfully. Please Login!', 2000);
						$location.path('/login/auto');
					} else {
						alertService.add("warning", 'Email id is not valid or the password is already set!', 2000);
					}

				});
			}
		}
	})

	.controller('passwordrpSet', function ($scope, $http, $location, localStorageService, $rootScope, usertype, RequestDetail, configdetails, alertService, $route, $routeParams, $timeout) {
		$scope.configdetails = configdetails;
		$scope.spinnerActive = false;
		$scope.email = $routeParams.emailId;

		$scope.setpassword_modal = true;

		$scope.reset1 = [];

		$scope.rpsetPassword = function () {

			if ($scope.reset1.password == '' || angular.isUndefined($scope.reset1.password)) {
				alertService.add("warning", "Enter Password Minimum 6 characters length!", 2000);
				return false;
			}

			if ($scope.reset1.confirm_password == '' || angular.isUndefined($scope.reset1.confirm_password)) {
				alertService.add("warning", "Enter Confirm Password Minimum 6 characters length!", 2000);
				return false;
			}

			if ($scope.reset1.password != $scope.reset1.confirm_password) {
				alertService.add("warning", "Password & Confirm Password Mismatch!", 2000);
				return false;
			}

			if (angular.isDefined($scope.reset1.password) && $scope.reset1.password != '' && $scope.reset1.password != null) {
				var url = "apiv4/public/user/rpset";
				var params = {
					email: $scope.email,
					password: $scope.reset1.password
				};
				$scope.spinnerActive = true;
				RequestDetail.getDetail(url, params).then(function (result) {
					if (angular.isDefined(result.data) && result.data == 1) {
						$scope.spinnerActive = false;
						$scope.reset1 = [];
						alertService.add("success", 'Password Updated Successfully. Please Login!', 2000);
						$timeout(function () {
							window.location = "brokerportal/#/login";
						}, 2000);

					} else {
						alertService.add("warning", 'Email id is not valid or the password is already set!', 2000);
					}

				});
			}
		}
	})
	.controller('rplogin', function ($scope, $http, $location, $routeParams, localStorageService, $rootScope, usertype, validation, RequestDetail, $timeout, configdetails) {


		$scope.email = '';
		$scope.password = '';

		$scope.rpmenu = localStorageService.get('research_provider_status');

		// On click redirection
		$scope.checkLogins = function () {

			////console.log($scope.login)

			//var valid =  validation.getEmpty($scope.login);

			////console.log(valid)

			if ($scope.email == "" && $scope.password == "") {

				$scope.errorMsg = 'Username or Password Cannot be Empty !';
				$timeout(function () {
					$scope.errorMsg = false;
				}, 3000);
				return false;
			} else {
				$scope.errorMsg = '';
				var url = "apiv4/public/user/login";


				//$scope.sample = [];
				//$scope.sample = $scope.login;


				//var params = $scope.login;
				var params = {
					email: $scope.email,
					password: $scope.password,
				};


				RequestDetail.getDetail(url, params).then(function (result) { // Result return



					if (!angular.isUndefined(result.data) && result.data.status == "success") {

						var userType = result.data.items.user_type; // USER TYPE 

						localStorageService.set('research_provider_status', result.data.items.research_provider_status);

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
							localStorageService.set('usertype', 'researchprovider');
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




						$location.path('dashboard');


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

	})
	.controller('rpcoverageCtrl', function ($scope, $http, $location, localStorageService, $rootScope, usertype, validation, RequestDetail, $timeout, configdetails, alertService) {

		$scope.rpmenu = localStorageService.get('research_provider_status');

		$scope.coveragelist = [];


		$scope.removeUser = function (index) {
			$scope.coveragelist.splice(index, 1);
		}

		var url = "apiv4/public/user/getcoveragelist";
		var params = {};
		RequestDetail.getDetail(url, params).then(function (result) {
			// //console.log(result.data);
			$scope.coveragelist = result.data;


		});


		$scope.import_coverage_excel = function (file) {
			$scope.filepath = [];
			$scope.$apply(function () {
				$scope.filepath.push({
					file_name: file,
					file_location: 'uploads/dashboarddata/' + file
				});

				var url = "apiv4/public/user/getexcelcoverage";
				var params = {
					filedata: $scope.filepath
				};
				RequestDetail.getDetail(url, params).then(function (result) {
					//console.log(result.data);

					$.each(result.data, function (index, coverage) {
						coverage.photo = 'images/no-imageman.jpg';

						//coverage.coverage_list = coverage.coverage_list.split(',');
						//coverage.industry_tag = coverage.industry.split(',');

						$scope.coveragelist.push(coverage);

					});

					//console.log($scope.coveragelist);

				});

			});

		}



		function chunk(arr, size) {
			var newArr = [];
			for (var i = 0; i < arr.length; i += size) {
				newArr.push(arr.slice(i, i + size));
			}
			return newArr;
		}

		var tagUrl = 'apiv4/public/user/get_search_details1';

		var params = {
			term: '',
			key: 'allindustry'
		};
		RequestDetail.getDetail(tagUrl, params).then(function (result) {
			if (angular.isDefined(result.data) && result.data.length > 0) {
				$scope.availableallIndustrydisplay = chunk(result.data, 29);
			} else {
				$scope.availableallIndustrydisplay = [];
			}
		});



		$scope.uploadphotoFile = function (imgdata, index) {
			$scope.$apply(function () {
				////console.log(index);
				// //console.log( $scope.coveragelist[index]);
				$scope.coveragelist[index].photo = 'uploads/coveragephoto/' + imgdata;
			});
		}


		$scope.updateCoverageList = function () {


			if ($scope.coveragelist.length == 0) {
				alertService.add("warning", "Analyst List Invalid !", 2000);
				return false;
			}

			var url = "apiv4/public/user/updatecoveragelist";
			var params = {
				coveragelist: $scope.coveragelist
			};
			RequestDetail.getDetail(url, params).then(function (result) {
				alertService.add("success", "Updated Successfully !", 2000);
				// $location.path('Rpdashboard_analyst');  	
			});
		}

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


	})
	.controller('rpanalystCtrl', function ($scope, $http, $location, localStorageService, $rootScope, usertype, validation, RequestDetail, $timeout, configdetails, alertService) {

		$scope.rpmenu = localStorageService.get('research_provider_status');

		$scope.coveragelist = [];
		var url = "apiv4/public/user/listtocoveragelist";
		var params = {};
		RequestDetail.getDetail(url, params).then(function (result) {
			$scope.coveragelist = result.data;
		});


		var url = "apiv4/public/user/listtocoveragelistmarketfile";
		var params = {};
		RequestDetail.getDetail(url, params).then(function (result) {
			$scope.old_marketingFile = result.data;
		});

		var url = "apiv4/public/researchprovider/listrpevents";
		var params = {};
		RequestDetail.getDetail(url, params).then(function (result) {
			$scope.rpevents = result.data;
		});


		$scope.marketingFile = [];
		$scope.removeFiles = function (index) {
			$scope.marketingFile.splice(index, 1);
		}
		$scope.removeoldFiles = function (index) {
			$scope.old_marketingFile.splice(index, 1);
		}

		$scope.uploadmarketingFile = function (imgdata) {
			$scope.$apply(function () {
				$scope.marketingFile.push({
					file_name: imgdata.name,
					file_location: 'uploads/analystfile/' + imgdata.uploadedname
				})
			});
		}


		$scope.uploadfileuploadFile = function (imgdata, index) {
			$scope.$apply(function () {

				$scope.coveragelist[index].file_location = 'uploads/analystfile/' + imgdata
				$scope.coveragelist[index].file_name = imgdata;

			});

		}

		


		$scope.rpstep2 = function () {
			var url = "apiv4/public/user/updatecoveragepage";
			var params = {
				marketingFile: $scope.marketingFile,
				old_marketingFile: $scope.old_marketingFile,
				coveragelist: $scope.coveragelist
			};
			RequestDetail.getDetail(url, params).then(function (result) {
				alertService.add("success", "Updated Successfully !", 2000);
				$location.path('Rpanalyst_activate');
			});
		}






	})
	.controller('rpanalystactCtrl', function ($scope, $http, $location, localStorageService, $rootScope, usertype, validation, RequestDetail, $timeout, configdetails, alertService) {

		$scope.rpmenu = localStorageService.get('research_provider_status');

		$scope.coveragelist = [];
		var url = "apiv4/public/user/listtocoveragelist";
		var params = {};
		RequestDetail.getDetail(url, params).then(function (result) {
			$scope.coveragelist = result.data;
		});

		var url = "apiv4/public/user/checkactivate";
		var params = {};
		RequestDetail.getDetail(url, params).then(function (result) {
			$scope.count = result.data.count;
		});

		$scope.activate_analyst = function (id, index) {
			// //console.log(index);
			var url = "apiv4/public/user/activateanalyst";
			var params = {
				coveragelist_id: id
			};
			RequestDetail.getDetail(url, params).then(function (result) {
				$scope.coveragelist[index].random_id = result.data.random_id;
			});
		}

	})
	.controller('rpsuccessCtrl', function ($scope, $http, $location, localStorageService, $rootScope, usertype, validation, RequestDetail, $timeout, configdetails, alertService) {
		$scope.rpmenu = localStorageService.get('research_provider_status');
	})
	.controller('rpsubscribersCtrl', function ($scope, $http, $location, localStorageService, $rootScope, usertype, validation, RequestDetail, $timeout, configdetails, alertService, $routeParams) {


		$scope.rpmenu = localStorageService.get('research_provider_status');


		$scope.subscriberslist = [];


		$scope.removeUser = function (index) {
			$scope.subscriberslist.splice(index, 1);
		}



		var url = "apiv4/public/user/getsubscriberslist";
		var params = {};
		RequestDetail.getDetail(url, params).then(function (result) {
			$scope.subscriberslist = result.data;
		});


		$scope.import_subscribers_excel = function (file) {
			$scope.filepath = [];
			$scope.$apply(function () {
				$scope.filepath.push({
					file_name: file,
					file_location: 'uploads/rpsubscribers/' + file
				});

				var url = "apiv4/public/user/getexcelsubscribers";
				var params = {
					filedata: $scope.filepath
				};
				RequestDetail.getDetail(url, params).then(function (result) {
					//		//console.log(result.data);

					$.each(result.data, function (index, subscribers) {
						$scope.subscriberslist.push(subscribers);
					});

				});

			});

		}


		$scope.updatesubscriberList = function () {
			var url = "apiv4/public/user/updatesubscriberslist";
			var params = {
				subscriberslist: $scope.subscriberslist
			};
			RequestDetail.getDetail(url, params).then(function (result) {
				alertService.add("success", "Updated Successfully !", 2000);
				$location.path('Rpanalyst_activate');
			});

		}


	})
	.controller('rpprofilesubscribersCtrl', function ($scope, $http, $location, localStorageService, $rootScope, usertype, validation, RequestDetail, $timeout, configdetails, alertService, $routeParams) {


		//$scope.rpmenu = localStorageService.get('research_provider_status');


		$scope.subscriberslist = [];


		$scope.removeUser = function (index) {
			$scope.subscriberslist.splice(index, 1);
		}



		var url = "apiv4/public/user/getsubscriberslist";
		var params = {};
		RequestDetail.getDetail(url, params).then(function (result) {
			$scope.subscriberslist = result.data;
		});


		$scope.import_subscribers_excel = function (file) {
			$scope.filepath = [];
			$scope.$apply(function () {
				$scope.filepath.push({
					file_name: file,
					file_location: 'uploads/rpsubscribers/' + file
				});

				var url = "apiv4/public/user/getexcelsubscribers";
				var params = {
					filedata: $scope.filepath
				};
				RequestDetail.getDetail(url, params).then(function (result) {
					//		//console.log(result.data);

					$.each(result.data, function (index, subscribers) {
						$scope.subscriberslist.push(subscribers);
					});

				});

			});

		}


		$scope.uploadmarketingFile = function (imgdata) {

			var imgdata = JSON.parse(imgdata);
			$scope.$apply(function () {
				$scope.marketingFile.push({
					file_name: imgdata.name,
					file_location: 'uploads/analystfile/' + imgdata.uploadedname
				})
			});



		}

		$scope.marketingFile = [];
		$scope.removeFiles = function (index) {
			$scope.marketingFile.splice(index, 1);
		}
		$scope.removeoldFiles = function (index) {
			$scope.old_marketingFile.splice(index, 1);
		}

		$scope.updatesubscriberList = function () {
			var url = "apiv4/public/user/updatesubscriberslist";
			var params = {
				subscriberslist: $scope.subscriberslist,
				marketingFile: $scope.marketingFile,
				old_marketingFile: $scope.old_marketingFile,
			};
			RequestDetail.getDetail(url, params).then(function (result) {
				alertService.add("success", "Updated Successfully !", 2000);
				//$location.path('Rpanalyst_activate');   
			});



		}

		var url = "apiv4/public/user/listtocoveragelistmarketfile";
		var params = {};
		RequestDetail.getDetail(url, params).then(function (result) {
			$scope.old_marketingFile = result.data;
		});




	})
	.controller('requestscorecardCtrl', function ($scope, $http, $location, localStorageService, $rootScope, usertype, validation, RequestDetail, $timeout, configdetails, alertService, $routeParams) {
		
		$scope.spinnerActive = true;

		setTimeout(function myGreeting() {
			$scope.spinnerActive = false;
		}, 100);
	
		$scope.report = {};
		$scope.report.firstname = '';
		$scope.report.lastname = '';
		$scope.report.email = '';
		$scope.report.company = '';
		$scope.report.contact = '';
		$scope.report.newticker = '';
		$scope.report.ticker = [];
		$scope.report.agree = false;

		$scope.report.newtickerrequest = 0;

		$scope.termspopupmodel = false;
		
		$scope.newtickeropen = function (val) {
			$scope.report.newtickerrequest = val;
		}

		$scope.get_search_details = function (type, searchkey, industype) {
            if (angular.isDefined(searchkey) && searchkey != '') {
                if (type != '') {
                    var tagUrl = 'apiv4/public/user/get_search_details1';
                    var searchterm = searchkey;
                    if (type == 'tickerlive') {
                        var params = searchterm;
                        var tagUrl = 'apiv4/public/dashboard/get_auto_ticker_stocklive';
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

		
		
		$scope.terms_modal_class = 'hidden';

        $scope.termopen = function () {
          $scope.terms_modal_class = '';
        }
    
        $scope.closeModalterm = function () {
          $scope.terms_modal_class = 'hidden';
        }
		

		$scope.submitrequest = function () {
 
			if (angular.isUndefined($scope.report.newticker) && $scope.report.ticker.length == 0) {
				alertService.add("warning", "Please Enter Ticker!", 2000);
                return false;
			}
			if ($scope.report.newticker=='' && $scope.report.ticker.length == 0) {
				alertService.add("warning", "Please Enter Ticker!", 2000);
                return false;
			}
			if($scope.report.company==""){
                alertService.add("warning", "Please Enter Company Name!", 2000);
                return false;
			}
			if($scope.report.firstname==""){
                alertService.add("warning", "Please Enter First Name!", 2000);
                return false;
            }
            if($scope.report.lastname==""){
                alertService.add("warning", "Please Enter Last Name!", 2000);
                return false;
            }
            if($scope.report.email==""){
                alertService.add("warning", "Please Enter Email!", 2000);
                return false;
			}

			if (!$scope.checkemailval($scope.report.email)) {
				alertService.add("warning", "Please Enter Valid Email!", 2000);
                return false;
			}
			if($scope.report.contact==""){
                alertService.add("warning", "Please Enter Phone Number!", 2000);
                return false;
			}
			 
			if (!$scope.valid) {
				alertService.add("warning", "Please enter correct captcha!", 2000);
				return false;
			}

			if($scope.report.newtickerrequest){
				$scope.report.newticker = $scope.report.ticker[0];
			}

			var tagUrl = 'apiv4/public/user/submitscorecard2';
			var params = $scope.report;
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				$scope.report = {};
				$scope.report.firstname = '';
				$scope.report.lastname = '';
				$scope.report.email = '';
				$scope.report.company = '';
				$scope.report.contact = '';
				$scope.report.newticker = '';
				$scope.report.ticker = [];
				$scope.report.agree = false;

				$scope.report.newtickerrequest = 0;
				alertService.add("success", "Requested Successfully !", 2000);
			});
		}

		$scope.checkemailval = function (email) {
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(String(email).toLowerCase());
		}
		
		
	})
	.controller('tickerreportCtrl', function ($scope, $http, $location, localStorageService, $rootScope, usertype, validation, RequestDetail, $timeout, configdetails, alertService, $routeParams) {
		
		$scope.spinnerActive = true;

		setTimeout(function myGreeting() {
			$scope.spinnerActive = false;
		}, 500);
	
		$scope.report = {};
		$scope.report.firstname = '';
		$scope.report.lastname = '';
		$scope.report.email = '';
		$scope.report.company = '';
		$scope.report.contact = '';

		$scope.report.newtickerrequest = 0;

		$scope.termspopupmodel = false;
		
		$scope.newtickeropen = function (val) {
			$scope.report.newtickerrequest = val;
		}

		$scope.get_search_details = function (type, searchkey, industype) {
            if (angular.isDefined(searchkey) && searchkey != '') {
                if (type != '') {
                    var tagUrl = 'apiv4/public/user/get_search_details1';
                    var searchterm = searchkey;
                    if (type == 'tickerlive') {
                        var params = searchterm;
                        var tagUrl = 'apiv4/public/dashboard/get_auto_ticker_stocklive';
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

		
		
		$scope.terms_modal_class = 'hidden';

        $scope.termopen = function () {
          $scope.terms_modal_class = '';
        }
    
        $scope.closeModalterm = function () {
          $scope.terms_modal_class = 'hidden';
        }
		

		$scope.submitrequest = function () {
			if (angular.isUndefined($scope.report.newticker)) {
				alertService.add("warning", "Please Enter Ticker!", 2000);
                return false;
			}
			if($scope.report.company==""){
                alertService.add("warning", "Please Enter Company Name!", 2000);
                return false;
			}
			if($scope.report.firstname==""){
                alertService.add("warning", "Please Enter First Name!", 2000);
                return false;
            }
            if($scope.report.lastname==""){
                alertService.add("warning", "Please Enter Last Name!", 2000);
                return false;
            }
            if($scope.report.email==""){
                alertService.add("warning", "Please Enter Email!", 2000);
                return false;
			}

			if (!$scope.checkemailval($scope.report.email)) {
				alertService.add("warning", "Please Enter Valid Email!", 2000);
                return false;
			}

			if($scope.report.contact==""){
                alertService.add("warning", "Please Enter Phone Number!", 2000);
                return false;
			}
			var tagUrl = 'apiv4/public/user/submitnewticker';
			var params = $scope.report;
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				$scope.report = {};
				$scope.report.newtickerrequest = 0;
				alertService.add("success", "Requested Successfully !", 2000);
			});
		}

		$scope.checkemailval = function (email) {
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(String(email).toLowerCase());
		}
		
		
	}).controller('samplereportCtrl', function ($scope, $http, $location, localStorageService, $rootScope, usertype, validation, RequestDetail, $timeout, configdetails, alertService, $routeParams) {
		
	
		$scope.spinnerActive = true;

		setTimeout(function myGreeting() {
			$scope.spinnerActive = false;
		}, 500);

		$scope.report = {};
		$scope.report.firstname = '';
		$scope.report.lastname = '';
		$scope.report.email = '';
		$scope.report.company = '';
		$scope.report.contact = '';

		$scope.get_search_details = function (type, searchkey, industype) {
            if (angular.isDefined(searchkey) && searchkey != '') {
                if (type != '') {
                    var tagUrl = 'apiv4/public/user/get_search_details1';
                    var searchterm = searchkey;
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

		$scope.checkemailval = function (email) {
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(String(email).toLowerCase());
		}

		$scope.requestsample = function () {
			if (!$scope.valid) {
				alertService.add("warning", "Please enter correct captcha!", 2000);
				return false;
			}
			if ($scope.report.ticker=="") {
				alertService.add("warning", "Please Enter Company Ticker!", 2000);
                return false;
			}
			if($scope.report.company==""){
                alertService.add("warning", "Please Enter Company Name!", 2000);
                return false;
			}
			if($scope.report.firstname==""){
                alertService.add("warning", "Please Enter First Name!", 2000);
                return false;
            }
            if($scope.report.lastname==""){
                alertService.add("warning", "Please Enter Last Name!", 2000);
                return false;
            }
            if($scope.report.email==""){
                alertService.add("warning", "Please Enter Email!", 2000);
                return false;
			}
			if(!$scope.checkemailval($scope.report.email)){
				alertService.add("warning", "Please Enter Valid Email!", 2000);
                return false;
			}
			if($scope.report.contact==""){
                alertService.add("warning", "Please Enter Phone Number!", 2000);
                return false;
			}
			var Url = 'apiv4/public/user/sendsamplerequest';
			var params = $scope.report;
			RequestDetail.getDetail(Url, params).then(function (result) {
				$scope.report = {};
				alertService.add("success", "Requested Successfully !", 2000);
			});
			

		}
		
		
	}).controller('subscriptiondailyCtrl', function ($scope, $http, $location, localStorageService, $rootScope, usertype, validation, RequestDetail, $timeout, configdetails, alertService, $routeParams) {
		
		$scope.report = {};
		$scope.report.firstname = '';
		$scope.report.lastname = '';
		$scope.report.email = '';
		$scope.report.company = '';
		$scope.report.contact = '';
		$scope.report.register_type = 'Corporate Executive';
		$scope.report.newtickerrequest = 0;

		$scope.termspopupmodel = false;
		
		$scope.newtickeropen = function (val) {
			$scope.report.newtickerrequest = val;
		}

		$scope.get_search_details = function (type, searchkey, industype) {
            if (angular.isDefined(searchkey) && searchkey != '') {
                if (type != '') {
                    var tagUrl = 'apiv4/public/user/get_search_details1';
                    var searchterm = searchkey;
                    if (type == 'tickerlive') {
                        var params = searchterm;
                        var tagUrl = 'apiv4/public/dashboard/get_auto_ticker_stocklive';
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

		
		$scope.termopen = function () {
			$scope.termspopupmodel = true;
		}

		$scope.closetermmodel = function () {
			$scope.termspopupmodel = false;
		}
		
		
		
	

		$scope.termspopup_modal_class = 'hidden';

        $scope.termopen = function () {
          $scope.termspopup_modal_class = '';
        }
    
        $scope.closeModaltermspopup = function () {
          $scope.termspopup_modal_class = 'hidden';
        }


		$scope.submitrequest = function () {
			
			if($scope.report.company==""){
                alertService.add("warning", "Please Enter Company Name!", 2000);
                return false;
			}
			if($scope.report.firstname==""){
                alertService.add("warning", "Please Enter First Name!", 2000);
                return false;
            }
            if($scope.report.lastname==""){
                alertService.add("warning", "Please Enter Last Name!", 2000);
                return false;
            }
            if($scope.report.email==""){
                alertService.add("warning", "Please Enter Email!", 2000);
                return false;
			}
			if (!$scope.checkemailval($scope.report.email)) {
				alertService.add("warning", "Please Enter Valid Email!", 2000);
                return false;
			}

			if($scope.report.contact==""){
                alertService.add("warning", "Please Enter Phone Number!", 2000);
                return false;
			}
			if(!$scope.agree){
				alertService.add("warning", "You Must Accept Terms and Conditions!", 2000);
                return false;
			}
			if($scope.report.register_type=="Other"){
				if($scope.report.other==""){
					alertService.add("warning", "Please Enter Subscriber Type!", 2000);
					return false;
				}  
			}

			var tagUrl = 'apiv4/public/user/addsubscriptioninvestor';
			var params = $scope.report;
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				$scope.report = {};
				$scope.report.register_type = 'Corporate Executive';
				alertService.add("success", "You have successfully subscribed. Thank you for joining our capital markets community.", 2000);
			}); 
		}

		$scope.checkemailval = function (email) {
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(String(email).toLowerCase());
		}

		
		
	}).controller('subscriptionstashCtrl', function ($scope, $http, $location, localStorageService, $rootScope, usertype, validation, RequestDetail, $timeout, configdetails, alertService, $routeParams) {
		
	
		$scope.report = {};
		$scope.report.firstname = '';
		$scope.report.lastname = '';
		$scope.report.email = '';
		$scope.report.company = '';
		$scope.report.contact = '';
		$scope.report.register_type = 'Corporate Executive';
		$scope.report.newtickerrequest = 0;

		$scope.termspopupmodel = false;
		
		$scope.newtickeropen = function (val) {
			$scope.report.newtickerrequest = val;
		}

		$scope.get_search_details = function (type, searchkey, industype) {
            if (angular.isDefined(searchkey) && searchkey != '') {
                if (type != '') {
                    var tagUrl = 'apiv4/public/user/get_search_details1';
                    var searchterm = searchkey;
                    if (type == 'tickerlive') {
                        var params = searchterm;
                        var tagUrl = 'apiv4/public/dashboard/get_auto_ticker_stocklive';
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

		
		$scope.termopen = function () {
			$scope.termspopupmodel = true;
		}

		$scope.closetermmodel = function () {
			$scope.termspopupmodel = false;
		}
		
		$scope.termspopup_modal_class = 'hidden';

        $scope.termopen = function () {
          $scope.termspopup_modal_class = '';
        }
    
        $scope.closeModaltermspopup = function () {
          $scope.termspopup_modal_class = 'hidden';
        }

		$scope.submitrequest = function () {
			
			if($scope.report.company==""){
                alertService.add("warning", "Please Enter Company Name!", 2000);
                return false;
			}
			if($scope.report.firstname==""){
                alertService.add("warning", "Please Enter First Name!", 2000);
                return false;
            }
            if($scope.report.lastname==""){
                alertService.add("warning", "Please Enter Last Name!", 2000);
                return false;
            }
            if($scope.report.email==""){
                alertService.add("warning", "Please Enter Email!", 2000);
                return false;
			}
			if (!$scope.checkemailval($scope.report.email)) {
				alertService.add("warning", "Please Enter Valid Email!", 2000);
                return false;
			}

			if($scope.report.contact==""){
                alertService.add("warning", "Please Enter Phone Number!", 2000);
                return false;
			}
			if(!$scope.agree){
				alertService.add("warning", "You Must Accept Terms and Conditions!", 2000);
                return false;
			}
			
			var tagUrl = 'apiv4/public/user/addsubscriptionstash';
			var params = $scope.report;
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				$scope.report = {};
				$scope.report.register_type = 'Corporate Executive';
				alertService.add("success", "You have successfully subscribed.", 2000);
			}); 
		}

		$scope.checkemailval = function (email) {
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(String(email).toLowerCase());
		}

		
		
	})
	.controller('subscriptionspaceCtrl', function ($scope, $http, $location, localStorageService, $rootScope, usertype, validation, RequestDetail, $timeout, configdetails, alertService, $routeParams) {
		
	
		$scope.report = {};
		$scope.report.firstname = '';
		$scope.report.lastname = '';
		$scope.report.email = '';
		$scope.report.company = '';
		$scope.report.contact = '';
		$scope.report.register_type = 'Corporate Executive';
		$scope.report.newtickerrequest = 0;

		$scope.termspopupmodel = false;
		
		$scope.newtickeropen = function (val) {
			$scope.report.newtickerrequest = val;
		}

		$scope.get_search_details = function (type, searchkey, industype) {
            if (angular.isDefined(searchkey) && searchkey != '') {
                if (type != '') {
                    var tagUrl = 'apiv4/public/user/get_search_details1';
                    var searchterm = searchkey;
                    if (type == 'tickerlive') {
                        var params = searchterm;
                        var tagUrl = 'apiv4/public/dashboard/get_auto_ticker_stocklive';
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

		
		$scope.termopen = function () {
			$scope.termspopupmodel = true;
		}

		$scope.closetermmodel = function () {
			$scope.termspopupmodel = false;
		}
		
		$scope.termspopup_modal_class = 'hidden';

        $scope.termopen = function () {
          $scope.termspopup_modal_class = '';
        }
    
        $scope.closeModaltermspopup = function () {
          $scope.termspopup_modal_class = 'hidden';
        }

		$scope.submitrequest = function () {
			
			if($scope.report.company==""){
                alertService.add("warning", "Please Enter Company Name!", 2000);
                return false;
			}
			if($scope.report.firstname==""){
                alertService.add("warning", "Please Enter First Name!", 2000);
                return false;
            }
            if($scope.report.lastname==""){
                alertService.add("warning", "Please Enter Last Name!", 2000);
                return false;
            }
            if($scope.report.email==""){
                alertService.add("warning", "Please Enter Email!", 2000);
                return false;
			}
			if (!$scope.checkemailval($scope.report.email)) {
				alertService.add("warning", "Please Enter Valid Email!", 2000);
                return false;
			}

			if($scope.report.contact==""){
                alertService.add("warning", "Please Enter Phone Number!", 2000);
                return false;
			}
			if(!$scope.agree){
				alertService.add("warning", "You Must Accept Terms and Conditions!", 2000);
                return false;
			}
			
			var tagUrl = 'apiv4/public/user/addsubscriptionspace';
			var params = $scope.report;
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				$scope.report = {};
				$scope.report.register_type = 'Corporate Executive';
				alertService.add("success", "You have successfully subscribed.", 2000);
			}); 
		}

		$scope.checkemailval = function (email) {
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(String(email).toLowerCase());
		}

		
		
	})
	.controller('subscriptionnewcapitalCtrl', function ($scope, $http, $location, localStorageService, $rootScope, usertype, validation, RequestDetail, $timeout, configdetails, alertService, $routeParams) {
		
	
		$scope.report = {};
		$scope.report.firstname = '';
		$scope.report.lastname = '';
		$scope.report.email = '';
		$scope.report.company = '';
		$scope.report.contact = '';
		$scope.report.register_type = 'Corporate Executive';
		$scope.report.newtickerrequest = 0;

		$scope.termspopupmodel = false;
		
		$scope.newtickeropen = function (val) {
			$scope.report.newtickerrequest = val;
		}

		$scope.get_search_details = function (type, searchkey, industype) {
            if (angular.isDefined(searchkey) && searchkey != '') {
                if (type != '') {
                    var tagUrl = 'apiv4/public/user/get_search_details1';
                    var searchterm = searchkey;
                    if (type == 'tickerlive') {
                        var params = searchterm;
                        var tagUrl = 'apiv4/public/dashboard/get_auto_ticker_stocklive';
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

		
		$scope.termopen = function () {
			$scope.termspopupmodel = true;
		}

		$scope.closetermmodel = function () {
			$scope.termspopupmodel = false;
		}
		
		$scope.termspopup_modal_class = 'hidden';

        $scope.termopen = function () {
          $scope.termspopup_modal_class = '';
        }
    
        $scope.closeModaltermspopup = function () {
          $scope.termspopup_modal_class = 'hidden';
        }

		$scope.submitrequest = function () {
			
			if($scope.report.company==""){
                alertService.add("warning", "Please Enter Company Name!", 2000);
                return false;
			}
			if($scope.report.firstname==""){
                alertService.add("warning", "Please Enter First Name!", 2000);
                return false;
            }
            if($scope.report.lastname==""){
                alertService.add("warning", "Please Enter Last Name!", 2000);
                return false;
            }
            if($scope.report.email==""){
                alertService.add("warning", "Please Enter Email!", 2000);
                return false;
			}
			if (!$scope.checkemailval($scope.report.email)) {
				alertService.add("warning", "Please Enter Valid Email!", 2000);
                return false;
			}

			if($scope.report.contact==""){
                alertService.add("warning", "Please Enter Phone Number!", 2000);
                return false;
			}
			if(!$scope.agree){
				alertService.add("warning", "You Must Accept Terms and Conditions!", 2000);
                return false;
			}
			
			var tagUrl = 'apiv4/public/user/addsubscriptionnewcapital';
			var params = $scope.report;
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				$scope.report = {};
				$scope.report.register_type = 'Corporate Executive';
				alertService.add("success", "You have successfully subscribed.", 2000);
			}); 
		}

		$scope.checkemailval = function (email) {
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(String(email).toLowerCase());
		}

		
		
	})
	.controller('subscriptionresearchCtrl', function ($scope, $http, $location, localStorageService, $rootScope, usertype, validation, RequestDetail, $timeout, configdetails, alertService, $routeParams) {
		
		$scope.report = {};
		$scope.report.firstname = '';
		$scope.report.lastname = '';
		$scope.report.email = '';
		$scope.report.company = '';
		$scope.report.contact = '';
		$scope.report.newtickerrequest = 0;

		

		$scope.get_search_details = function (type, searchkey, industype) {
            if (angular.isDefined(searchkey) && searchkey != '') {
                if (type != '') {
                    var tagUrl = 'apiv4/public/user/get_search_details1';
                    var searchterm = searchkey;
                    if (type == 'tickerlive') {
                        var params = searchterm;
                        var tagUrl = 'apiv4/public/dashboard/get_auto_ticker_stocklive';
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

		
		$scope.sectors = ['Communication Services','Consumer Discretionary','Consumer Staples','Digital Banking','Energy','Financials','Health Care','Industrials','Information Technology','Macro','Materials','Real Estate','Utilities'];

		$scope.get_search_details = function (type, searchkey) {
			if (angular.isDefined(searchkey) && searchkey != '') {
				if (type != '') {
					if (type == 'sectors') {
						$scope.sectors = ['Communication Services','Consumer Discretionary','Consumer Staples','Digital Banking','Energy','Financials','Health Care','Industrials','Information Technology','Macro','Materials','Real Estate','Utilities'];
					}
				}
			}
		}

		$scope.submitrequest = function () {

			
			if($scope.report.company=="" || angular.isUndefined($scope.report.company)){
                alertService.add("warning", "Please Enter Company Name!", 2000);
                return false;
			}
			if($scope.report.firstname=="" || angular.isUndefined($scope.report.firstname)){
                alertService.add("warning", "Please Enter First Name!", 2000);
                return false;
            }
            if($scope.report.lastname=="" || angular.isUndefined($scope.report.lastname)){
                alertService.add("warning", "Please Enter Last Name!", 2000);
                return false;
            }
            if($scope.report.email=="" || angular.isUndefined($scope.report.email)){
                alertService.add("warning", "Please Enter Email!", 2000);
                return false;
			}
			if (!$scope.checkemailval($scope.report.email)) {
				alertService.add("warning", "Please Enter Valid Email!", 2000);
                return false;
			}
			if($scope.report.corporate_access=="" || angular.isUndefined($scope.report.corporate_access)){
                alertService.add("warning", "Please choose interest in corporate access?", 2000);
                return false;
			}
			if($scope.report.purchase_research=="" || angular.isUndefined($scope.report.purchase_research)){
                alertService.add("warning", "Please choose ability to purchase research!", 2000);
                return false;
			}
			if($scope.report.valuable=="" || angular.isUndefined($scope.report.valuable)){
                alertService.add("warning", "Please choose valuable!", 2000);
                return false;
			}
			if($scope.report.sector=="" || angular.isUndefined($scope.report.sector)){
				if ($scope.report.sector.length == 0) {
                    alertService.add("warning", "Please choose sector!", 2000);
                    return false;
                }
			}

			/*if($scope.report.contact==""){
                alertService.add("warning", "Please Enter Phone Number!", 2000);
                return false;
			}
			if(!$scope.agree){
				alertService.add("warning", "You Must Accept Terms and Conditions!", 2000);
                return false;
			}
			if($scope.report.register_type=="Other"){
				if($scope.report.other==""){
					alertService.add("warning", "Please Enter Subscriber Type!", 2000);
					return false;
				}  
			}*/

			var tagUrl = 'apiv4/public/user/addresearchsubscription';
			var params = $scope.report;
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				$scope.report = {};
				alertService.add("success", "Thank you for joining the Intro-act Independent Research Provider Network. You will be receiving the newsletter in your inbox shortly.", 5000);
			}); 
		}

		$scope.checkemailval = function (email) {
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(String(email).toLowerCase());
		}

		
		
	}) 

    .controller('homeCtrl', function ($scope, $rootScope, $http, $location, local, localStorageService, usertype, alertService, RequestDetail, configdetails, permissions) {

        $scope.rpmenu = localStorageService.get('research_provider_status');

        $location.path('companyprofile');
        
        if ($scope.rpmenu == 1) {
            $location.path('companyprofile');
        }

        $scope.configdetails = configdetails;
        var localUserdata = localStorageService;

        $scope.pageHeading = 'Home';
        $scope.dasboardActive = 'active';
        $scope.message = {};
        $scope.message.title = '';
        $scope.message.content = '';
        $scope.investorsList = {};

        $scope.events = [];

        
        $scope.events.my_events = [];

        $scope.data = {};
        var filter_data = localStorageService.get('filter_data');
        if (filter_data != '' && filter_data != null && filter_data != 'null') {
            $scope.data = filter_data;
        }
       
        $scope.fromdt = {
            opened: false
        };
        $scope.todt = {
            opened: false
        };

       
        var user_data = localStorageService.get('userdata');

        
        if(user_data.user_type==4){
            $location.path('researchanalytics');
            return false;
        }
       
        $scope.user_id = user_data.user_id;
        $scope.spinnerActive = true;


        $scope.agencystatus = 0;
        if (user_data.agencystatus) {
            $scope.agencystatus = user_data.agencystatus;
        }
        
        $scope.user_id = user_data.user_id;

        $scope.search_user = function (user_id) {

            var url = 'apiv4/public/dashboard/getusertype';
            var params = { user_id: user_id };
            RequestDetail.getDetail(url, params).then(function (result) {

                if (result.data.user_type == 1) {
                    var type = 'investor';
                }
                else if (result.data.user_type == 2) {
                    var type = 'corporate';
                } else if (result.data.user_type == 3) {
                    var type = 'broker';
                }
                else if (result.data.user_type == 4) {
                    var type = 'researchprovider';
                }

                $location.path('/' + type + '/' + user_id);
            });

        };

        $scope.prospects_trials_experied = 0;
        $scope.unread_meetings = 0;
        $scope.unread_events = 0;
        $scope.unread_activity_notifications = 0;

        var url = 'apiv4/public/dashboard/getnotifications';
        var params = {};
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.prospects_trials_experied = result.data.prospects_trials_experied;
            $scope.unread_meetings = result.data.unread_meetings;
            $scope.unread_events = result.data.unread_events;
            $scope.feedbackcount = parseInt(result.data.unread_events)+parseInt(result.data.unread_meetings);
            $scope.unread_activity_notifications = result.data.unread_activity_notifications;
        });


        var url = 'apiv4/public/researchprovider/getdashboardgraph';
        var params = {};
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.graphopens = [];
            $scope.graphclicks = [];
            $scope.labels_graph1 = [];
            angular.forEach(result.data, function (val) {
                $scope.graphopens.push(val.open_total);
                $scope.graphclicks.push(val.click_total);
                $scope.labels_graph1.push(val.date);
            });
            $scope.data_graph1 = [
                $scope.graphopens,
                $scope.graphclicks,
            ]; 
        });


        $scope.colors_graph2 = ['#0F74BA', '#B0C3CC', '#3396C2', '#4A8FAD', '#29A8E0'];

            $scope.data_graph2 = [];
            $scope.data_graph2 = ['0', '0', '0', '0', '0']; 
    
            $scope.datasetOverride2 = [{ yAxisID: 'y-axis-1' }];
    
            $scope.labels_graph2 = [];
            $scope.labels_graph2 = ['Propects', 'Step 1' , 'Step 2', 'Step 3', 'Step 4'];
    
            $scope.options_graph2 = {
                legend: {
                    display: false
                },
                scales: {
                    xAxes: [{
                        stacked: false,gridLines: {display: true,drawBorder: true,drawOnChartArea: false}
                    }],
                    yAxes: [{
                        stacked: false,id: 'y-axis-1', position: 'left',gridLines: {display: true,drawBorder: true,drawOnChartArea: false},scaleLabel: { display: true, labelString: 'Contacts'},  ticks: {min: 0,callback: function (value) { if (Number.isInteger(value)) { return value; } }}
                    }]
                },
    
                title: {
                    display: true,
                    text: '',
                    fontSize: 15,
                },
            };

        var url = 'apiv4/public/researchprovider/getinvestorpipeline';
        var params = {};
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.data_graph2 = [];
            $scope.labels_graph2 = [];

            angular.forEach(result.data, function (val) {
                $scope.data_graph2.push(val.count);
                $scope.labels_graph2.push(val.name);
            });
        });

        $scope.colors_graph1 = ['#0F74BA', '#29A8E0', '#e0ea49', '#e0ea93', '#29A8E0'];

        $scope.data_graph1 = [];
        $scope.data_graph1 = [
            ['0','0','0','0','0','0'],
            ['0','0','0','0','0','0'],
        ]; 

        $scope.datasetOverride1 = [{ yAxisID: 'y-axis-1' }];

        $scope.labels_graph1 = [];

        $scope.options_graph1 = {
			legend: {
				display: true
			},
			scales: {
				xAxes: [{
					stacked: false,gridLines: {display: true,drawBorder: true,drawOnChartArea: false}
				}],
				yAxes: [{
					stacked: false,id: 'y-axis-1', position: 'left',gridLines: {display: true,drawBorder: true,drawOnChartArea: false},scaleLabel: { display: true, labelString: 'Open & Click'},  ticks: {min: 0,callback: function (value) { if (Number.isInteger(value)) { return value; } }}
				}]
			},

			title: {
				display: true,
				text: '',
				fontSize: 15,
			},
        };
        
        $scope.series_graph1 = ['Open', 'Click'];

        $scope.goto_meeting_recommendation = function () {
            $location.path('/meetingArchive/aggregate/');
        }

        // On click redirection
        $scope.postMessage = function () {
            if ($scope.message.title == '' || $scope.message.content == '') {
                alertService.add("warning", 'Please enter the title and the content !', 2000);
            } else {
                var url = 'apiv4/public/dashboard/postmessage';
                var params = { type: 'post', values: $scope.message };
                RequestDetail.getDetail(url, params).then(function (result) {
                    $scope.postMsg = false;
                    alertService.add("success", 'Message Posted Successfully !', 2000);
                });
            }
        }



        if(user_data.user_type==3){
            var getdailyDetail = 'apiv4/public/researchprovider/getallideas';
            var params = { limit: 3 };
            RequestDetail.getDetail(getdailyDetail, params).then(function (result) {
                $scope.ideas = result.data.ideas;
            });
        }
        

        $scope.getideas = function () {
			var url = 'apiv4/public/researchprovider/getideasdashboard';
			var params = {filter:$scope.filter};
			RequestDetail.getDetail(url, params).then(function (result) {
				$scope.rpideas = result.data;
			});
		};

        $scope.getideas();
        

        $scope.getideas = function () {
			var url = 'apiv4/public/researchprovider/getresearchideasdashboard';
			var params = {};
			RequestDetail.getDetail(url, params).then(function (result) {
				$scope.rideas = result.data;
			});
		};

		$scope.getideas();

      
        $scope.showfrom = function () {
            $scope.fromdt.opened = true;
        }

        $scope.showto = function () {
            $scope.todt.opened = true;
        }

        
        $scope.checkarray = function (arr, value) {
            var newItemOrder = value;
            var ext = 0;
            angular.forEach(arr, function (item) {
                if (newItemOrder == item.val) {
                    ext = 1;
                }
            });
            if (ext == 1) {
                return false;
            }
            else if (ext == 0) {
                return true;
            }
        }


        

      

        var profile_events = 'apiv4/public/event/eventlist';
        var params = {key: 'contacts',userid: $scope.user_id, limit:1 }

        $scope.event_page = 0;
        RequestDetail.getDetail(profile_events, params).then(function (result) {

            if (angular.isDefined(result.data)) {
                var events = result.data;
                if (angular.isUndefined(events) || events == null || events == 'null') {
                    events = {};
                }
                if (angular.isUndefined(events.my_events) || events.my_events == null || events.my_events == 'null') {
                    events.my_events = [];
                }
                $scope.eventlist = events;
                var user_data = localStorageService.get('userdata');
                $scope.user_id = user_data.user_id;

            }
            $scope.spinnerActive = false;
        });


        $scope.get_search_details = function (type, searchkey) {
            if (angular.isDefined(searchkey) && searchkey != '') {
                if (type != '') {
                    var tagUrl = 'apiv4/public/user/get_search_details';
                    var searchterm = searchkey;

                    if (type == 'industry') {
                        var params = { term: searchterm, key: type };
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
                        var tagUrl = 'apiv4/public/dashboard/get_auto_ticker';
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

        $scope.createnewevents = function (events) {

            if (angular.isDefined(events.event_id)) {

                if (usertype.getService() == 'corporate' && angular.isDefined(events.event_type) && events.event_type != ''
                    && (events.event_type == 'ndr' || events.event_type == 'earningsCallfollowup' || events.event_type == 'analystDay')) {
                    localStorageService.set('live_events', events);
                    $location.path('event/new');
                    return false;
                } else if (usertype.getService() == 'broker' && angular.isDefined(events.event_type) && events.event_type != ''
                    && (events.event_type == 'dealRoadshow' || events.event_type == 'conference')) {
                    localStorageService.set('live_events', events);
                    $location.path('event/new');
                    return false;
                }
                $location.path('event/responseEvents/' + events.event_id);
                return false;
            }
        }

        if (usertype.getService() == 'corporate') {
            $scope.newEvent = function () {
                $location.path('event/new');
            }
        }

        if (usertype.getService() == 'broker') {
            $scope.newEvent = function () {
                $location.path('event/new');
            }
        }

        // $scope.getList = function () {
            // // Get Investors List
            // var GetInvestorsListUrl = 'apiv4/public/dashboard/getInvestorsList';
            // var params = {
                // type: 'get'
            // };
            // RequestDetail.getDetail(GetInvestorsListUrl, params).then(function (result) {
                // $scope.investorsList = result.data;
            // });
        // }

        $scope.eventLists = [];

        var GeteventsListUrl = 'apiv4/public/dashboard/getEventsList';
        var params = {};
        RequestDetail.getDetail(GeteventsListUrl, params).then(function (result) {
            $scope.eventLists = result.data;
        });


        var getdailyDetail = 'apiv4/public/dashboard/getdailies_thisweek';
        var params = {this_week_only:'true'};
        RequestDetail.getDetail(getdailyDetail, params).then(function (result) {
            $scope.dailydata = result.data;
        });

        $scope.dailydashboard = 0;

        $scope.dashboarddaily = function (index) {
            $scope.dailydashboard = index;
        }



        $scope.removeGroup = function (id, index) {
            if (angular.isDefined(id) && id != '') {
                $('#confirmation').modal('show');
                $('#hidden_id').val(id);
            }
            else {
                var id = $('#hidden_id').val();
                var url = 'apiv4/public/dashboard/removeContactGroup';
                var params = { type: 'post', values: id };
                RequestDetail.getDetail(url, params).then(function (result) {
                    if (result.data == 0) {
                        $scope.getList();
                        $('#confirmation').modal('hide');
                        alertService.add("success", 'Removed group Successfully !', 2000);
                    }
                });
            }
        }

        $scope.newMeeting = function (user_id) {
            if (angular.isDefined(user_id) && user_id != '') {
                var url = 'apiv4/public/dashboard/encrypt_id';
                var params = { user_id: user_id };
                RequestDetail.getDetail(url, params).then(function (result) {
                    $location.path('meeting/new/' + result.data);
                });
            }
            else {
                $location.path('meeting/new/');
            }
        }

        $scope.InvestorNew = function (listId) {
            $location.path('investors/new/' + listId);
        }
        $scope.InvestorEdit = function (listId) {
            $location.path('investors/edit/' + listId);
        }
        $scope.InvestorView = function (listId) {
            $location.path('investors/view/' + listId);
        }

        $scope.showModal = false;
        $scope.toggleModal = function () {
            //  ******************** To avoid the api calling second time in same page Store in the variable and fetched the data ising $index value
            //$scope.values = $scope.FetchedData.items[index];
            // Assign the values to the variables
            $scope.showModal = !$scope.showModal;
        };



        $scope.showModalintrolayers = false;
        $scope.openintroactlayesr = function () {
            //  ******************** To avoid the api calling second time in same page Store in the variable and fetched the data ising $index value
            //$scope.values = $scope.FetchedData.items[index];
            // Assign the values to the variables
            $scope.showModalintrolayers = !$scope.showModalintrolayers;
        };



        $scope.showRecommendationModal = false;
        $scope.toggleRecommendationModal = function () {
            //  ******************** To avoid the api calling second time in same page Store in the variable and fetched the data ising $index value
            //$scope.values = $scope.FetchedData.items[index];
            // Assign the values to the variables
            $scope.showRecommendationModal = !$scope.showRecommendationModal;
        };

        $scope.postMsg = false;
        $scope.postMsgModal = function () {
            //   ******************** To avoid the api calling second time in same page Store in the variable and fetched the data ising $index value
            //$scope.values = $scope.FetchedData.items[index];
            // Assign the values to the variables
            $scope.postMsg = !$scope.postMsg;
        };

        //  getInvitations();

        function getInvitations() {
            $scope.invitations = {};
            $scope.user_id = '';

            // Here some controls are for Investor dashboard
            var getInvestorsMeeting = 'apiv4/public/meeting/getInvestorsMeeting';
            var params = {
                type: 'get'
            };

            RequestDetail.getDetail(getInvestorsMeeting, params).then(function (result) {
                $scope.invitations.meetingList = [];

                if (result.data != "false") {
                    $scope.invitations.total = result.data.length;
                    var meeting_data = [];

                    if (angular.isDefined(result.data.meeting) && result.data.meeting.length > 0) {
                        angular.forEach(result.data.meeting, function (data) {
                            var dd = new Date(data.date_created);
                            data.order_date = dd.getTime();
                            data.desc_order_date = dd.getTime();
                            ////console.log(data.date_created+'=>'+data.desc_order_date);
                            meeting_data.push(data);
                        });
                    }

                    /*if(angular.isDefined(result.data.activity) && result.data.activity.length>0)
                    {               
                        angular.forEach(result.data.activity,function(datas){
                            $scope.activity = datas;
                            var d= new Date (datas.viewed_on);
                            $scope.activity.order_date=d.getTime();
                            $scope.activity.desc_order_date=d.getTime();
                            ////console.log(datas.viewed_on+'=>'+$scope.activity.desc_order_date);
                            meeting_data.push($scope.activity);  
                        });                    
                    } */

                    if (angular.isDefined(result.data.recommend) && result.data.recommend.length > 0 && result.data.recommend != null) {
                        angular.forEach(result.data.recommend, function (get) {
                            $scope.recommend = get;
                            var d = new Date(get.date_created);
                            $scope.recommend.order_date = d.getTime();
                            $scope.recommend.desc_order_date = d.getTime();
                            ////console.log(get.date_created+'=>'+$scope.recommend.desc_order_date);
                            meeting_data.push($scope.recommend);
                        });
                    }

                    if (angular.isDefined(result.data.followup) && result.data.followup.length > 0 && result.data.followup != null) {
                        angular.forEach(result.data.followup, function (get) {
                            $scope.followup = get;
                            var d = new Date(get.created_date);
                            $scope.followup.order_date = d.getTime();
                            $scope.followup.desc_order_date = d.getTime();
                            ////console.log(get.created_date+'=>'+$scope.followup.desc_order_date);
                            meeting_data.push($scope.followup);
                        });
                    }

                    $scope.invitations.meetingList = meeting_data;

                    var user_data = localStorageService.get('userdata');
                    $scope.user_id = user_data.user_id;
                }
            });
        }

        getInvitations();
        $scope.reschedule = function (index, type) {

            var user_data = localStorageService.get('userdata');
            $scope.user_id = user_data.user_id;
            $rootScope.viewMeeting = $scope.invitations.meetingList[index];
            var enctype = 'e6ec529ba185279a' + index + 'a0adcf93e645c7cd';

            var url = 'apiv4/public/meeting/reschedule';
            var params = { meeting_id: index };
            RequestDetail.getDetail(url, params).then(function (result) {
                if ($scope.user_id == type) {
                    $location.path('meetingProposed/' + enctype);
                }
                else {
                    $location.path('meeting/' + enctype);
                }
            });
        }


        $scope.viewInvitation = function (meeting_id, created_to) {
            var user_data = localStorageService.get('userdata');
            $scope.user_id = user_data.user_id;
            var enctype = 'e6ec529ba185279a' + meeting_id + 'a0adcf93e645c7cd';

            if (angular.isDefined($scope.invitations.meetingList) && $scope.invitations.meetingList.length > 0) {
                if (created_to != null) {
                    if ($scope.user_id == created_to) {
                        var url = 'apiv4/public/meeting/update_meeting_view';
                        var params = { meeting_id: meeting_id };
                        RequestDetail.getDetail(url, params).then(function (result) {

                        });
                    }
                }
            }
            $location.path('meeting/' + enctype);
        }



        $scope.replyResponse = function (id) {
            var encrypt = randomString(35) + id;
            $location.path('respond/' + encrypt);
        }

        function randomString(length) {
            return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
        }

        $scope.brokerNewEvent = function () {
            $location.path('event/new');
        }

        $scope.hideInvitaion = function (meeting_id) {
            var hideUrl = 'apiv4/public/meeting/hideMeeting';
            var params = {
                type: 'get',
                meeting_id: meeting_id
            };
            RequestDetail.getDetail(hideUrl, params).then(function (result) {
                if (result.data == 'true') {
                    alertService.add('success', 'Meeting invitation has been archived !', 2000);
                    getInvitations();
                }
            });
        }


        $scope.viewProposed = function (meeting_id) {
            var enctype = 'e6ec529ba185279a' + meeting_id + 'a0adcf93e645c7cd';
            $location.path('meetingProposed/' + enctype);
        }

        $scope.viewAccepted = function (meeting_id) {
            var enctype = 'e6ec529ba185279a' + meeting_id + 'a0adcf93e645c7cd';
            $location.path('meetingAccepted/' + enctype);
        }
    })

    .controller('searchCtrl', function ($scope, $http, $location, localStorageService, RequestDetail, $rootScope, configdetails) {
        $scope.configdetails = configdetails;
        $scope.spinnerActive = false;
        var usertype = localStorageService.get('usertype');
        $scope.srch = {};
        $scope.searchinput = [];
        $scope.filter = [];


        if (usertype == 'investor') {
            $scope.pageHeading = 'Search Result';
            $scope.dasboardActive = 'active';
        } else if (usertype == 'corporate') {
            $scope.pageHeading = 'Search Result';
            $scope.dasboardActive = 'active';
        } else if (usertype == 'broker') {
            $scope.pageHeading = 'Search Result';
            $scope.dasboardActive = 'active';
        }

        if ($rootScope.searchResult == undefined) {
            $scope.srch.items = 0;
        } else {
            $scope.srch.items = [];
            if (angular.isDefined($rootScope.searchResult.items) && $rootScope.searchResult.items.length > 0) {
                $rootScope.pageno = $rootScope.pageno + 1;
                angular.forEach($rootScope.searchResult.items, function (data, index) {
                    data.contactid = "";
                    $scope.srch.items.push(angular.copy(data));
                    var contactDetails = angular.copy(data);
                    if (angular.isDefined(contactDetails) && contactDetails.contacts.length > 0) {
                        angular.forEach(contactDetails.contacts, function (con, ind) {
                            var userdetails = angular.copy(data);
                            if (angular.isDefined(con.contact_id) && con.contact_id != '') {
                                userdetails.firstname = con.firstname;
                                userdetails.lastname = con.lastname;
                                userdetails.email = con.email;
                                userdetails.title = con.job_title;
                                userdetails.contact = con.phone;
                                userdetails.contact_id = con.contact_id;
                                $scope.srch.items.push(angular.copy(userdetails));
                            }
                        })
                    }
                });
            }
        }

        $scope.sidepopupactive = false;

        $scope.sidepopup = function () {
            $scope.sidepopupactive = !$scope.sidepopupactive;
        }

        $scope.searchinput.searchkey = $rootScope.searchkey;

        $scope.searchinput.corporate = false;
        $scope.searchinput.investor = false;
        $scope.searchinput.researchprovider = false;


        $scope.getUsersbySearchkey = function () {

            var corporate = 0;
            var investor = 0;
            var researchprovider = 0;

            if ($scope.searchinput.corporate) {
                var corporate = 1;
            }
            if ($scope.searchinput.investor) {
                var investor = 1;
            }
            if ($scope.searchinput.researchprovider) {
                var researchprovider = 1;
            }

            $rootScope.searchkey = $scope.searchinput.searchkey;


            // Getting Investors and Corporates List
            var url = 'apiv4/public/dashboard/getSearchList';

            var searchdata = {
                searchkey: $scope.searchinput.searchkey,
                corporate: corporate,
                investor: investor,
                researchprovider: researchprovider,
                region: $scope.searchinput.region,
                country: $scope.searchinput.country
            }

            var params = {
                searchdata: searchdata,
                page: $rootScope.pageno
            }


            $scope.spinnerActive = true;
            RequestDetail.getDetail(url, params).then(function (result) {

                if (angular.isDefined(result.data) && angular.isDefined(result.data.items) && result.data.items.length > 0) {
                    $rootScope.pageno = $rootScope.pageno + 1;
                    $scope.srch.items = [];

                    angular.forEach(result.data.items, function (data, index) {
                        data.contactid = "";
                        $scope.srch.items.push(angular.copy(data));
                        var contactDetails = angular.copy(data);
                        if (angular.isDefined(contactDetails) && contactDetails.contacts.length > 0) {
                            angular.forEach(contactDetails.contacts, function (con, ind) {
                                var userdetails = angular.copy(data);
                                if (angular.isDefined(con.contact_id) && con.contact_id != '') {
                                    userdetails.firstname = con.firstname;
                                    userdetails.lastname = con.lastname;
                                    userdetails.email = con.email;
                                    userdetails.title = con.job_title;
                                    userdetails.contact = con.phone;
                                    userdetails.contact_id = con.contact_id;
                                    $scope.srch.items.push(angular.copy(userdetails));
                                }
                            })
                        }
                    });
                }
                $scope.spinnerActive = false;
            });
        }

        $scope.getUsersbySearchkey1 = function () {

            var corporate = 0;
            var investor = 0;
            var researchprovider = 0;

            if ($scope.searchinput.corporate) {
                var corporate = 1;
            }
            if ($scope.searchinput.investor) {
                var investor = 1;
            }
            if ($scope.searchinput.researchprovider) {
                var researchprovider = 1;
            }

            var searchbyticker = 0;
            var searchbycompany = 0;
           
            if ($scope.searchinput.searchbycompany) {
                var searchbycompany = 1;
            }
            if ($scope.searchinput.searchbyticker) {
                var searchbyticker = 1;
            }

            $rootScope.searchkey = $scope.searchinput.searchkey;



            // Getting Investors and Corporates List
            var url = 'apiv4/public/dashboard/getSearchList';

            var searchdata = {
                searchkey: $scope.searchinput.searchkey,
                corporate: corporate,
                investor: investor,
                researchprovider: researchprovider,
                searchbycompany: searchbycompany,
                searchbyticker: searchbyticker,
                region: $scope.searchinput.region,
                country: $scope.searchinput.country,

            }

            var params = {
                searchdata: searchdata,
                page: 0
            }


            $scope.spinnerActive = true;
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.srch.items = [];
                if (angular.isDefined(result.data) && angular.isDefined(result.data.items) && result.data.items.length > 0) {
                    $rootScope.pageno = $rootScope.pageno + 1;
                    $scope.srch.items = [];

                    angular.forEach(result.data.items, function (data, index) {
                        data.contactid = "";
                        $scope.srch.items.push(angular.copy(data));
                        var contactDetails = angular.copy(data);
                        if (angular.isDefined(contactDetails) && contactDetails.contacts.length > 0) {
                            angular.forEach(contactDetails.contacts, function (con, ind) {
                                var userdetails = angular.copy(data);
                                if (angular.isDefined(con.contact_id) && con.contact_id != '') {
                                    userdetails.firstname = con.firstname;
                                    userdetails.lastname = con.lastname;
                                    userdetails.email = con.email;
                                    userdetails.title = con.job_title;
                                    userdetails.contact = con.phone;
                                    userdetails.contact_id = con.contact_id;
                                    $scope.srch.items.push(angular.copy(userdetails));
                                }
                            })
                        }
                    });
                }
                $scope.spinnerActive = false;
            });
        }

        $scope.getUser = function (items,type) {
            if (angular.isDefined(items) && angular.isDefined(items.user_id) && angular.isDefined(items.user_type)) {
                if (items.user_type == '1') {

                    $rootScope.searchUserId = items.user_id;
                    localStorageService.set('contact_user', '');
                    localStorageService.set('contact_user_type', '');
                    if (angular.isDefined(items.contact_id) && items.contact_id != '') {
                        localStorageService.set('contact_user', items.contact_id);
                    }
                    if (angular.isDefined(items.user_detail) && items.user_detail == 'masters') {
                        localStorageService.set('contact_user_type', 'mi');
                    }
                    if (type=='0') {
                        $location.path('investoruser/' + items.user_id);
                    } else {
                        $location.path('investorcompany/' + items.user_id);
                    }
                } else if (items.user_type == '2') {

                    $rootScope.searchUserId = items.user_id;
                    localStorageService.set('contact_user', '');
                    localStorageService.set('contact_user_type', '');
                    if (angular.isDefined(items.contact_id) && items.contact_id != '') {
                        localStorageService.set('contact_user', items.contact_id);
                    }
                    if (angular.isDefined(items.user_detail) && items.user_detail == 'masters') {
                        localStorageService.set('contact_user_type', 'mc');
                    }


                    if (type=='0') {
                        $location.path('corporateuser/' + items.user_id);
                    } else {
                        $location.path('company/' + items.user_id);
                    }
                }
                else if (items.user_type == '3') {

                    $rootScope.searchUserId = items.user_id;
                    localStorageService.set('contact_user', '');
                    localStorageService.set('contact_user_type', '');
                    if (angular.isDefined(items.contact_id) && items.contact_id != '') {
                        localStorageService.set('contact_user', items.contact_id);
                    }
                    if (angular.isDefined(items.user_detail) && items.user_detail == 'masters') {
                        localStorageService.set('contact_user_type', 'mb');
                    }
                    $location.path('brokeruser/' + items.user_id);
                }
            }
        }


    }).controller('actionsLeadsCtrl', function ($scope, $rootScope, $http, $location, local, localStorageService, usertype, alertService, RequestDetail, configdetails, permissions) {

        localStorageService.set('contact_user_type', '');

        $scope.filter = {};

        $scope.showModalpageinfo = false;

        $scope.openmodelpagehelp = function () {
            $scope.showModalpageinfo = !$scope.showModalpageinfo;
        }

        $scope.closemodelpagehelp = function () {
            $scope.showModalpageinfo = false;
        }

        $scope.sidepopupactive=false;
  
	    $scope.sidepopup = function() {
		    $scope.sidepopupactive=!$scope.sidepopupactive;
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

        $scope.getInvitations = function() {
            
            $scope.invitations = {};
            $scope.user_id = '';

            // Here some controls are for Investor dashboard
            var getInvestorsMeeting = 'apiv4/public/meeting/getInvestorsMeeting';
            var params = {
                rdfilter:$scope.filter
            };

            RequestDetail.getDetail(getInvestorsMeeting, params).then(function (result) {
                $scope.invitations.meetingList = [];


                if (result.data != "false") {
                    $scope.invitations.total = result.data.length;
                    var meeting_data = [];

                    if (angular.isDefined(result.data.meeting) && result.data.meeting.length > 0) {
                        angular.forEach(result.data.meeting, function (data) {
                            var dd = new Date(data.date_created);
                            data.order_date = dd.getTime();
                            data.desc_order_date = dd.getTime();
                            ////console.log(data.date_created+'=>'+data.desc_order_date);
                            //meeting_data.push(data);  
                        });
                    }

                    if (angular.isDefined(result.data.activity) && result.data.activity.length > 0) {
                        angular.forEach(result.data.activity, function (datas) {
                            $scope.activity = datas;
                            var d = new Date(datas.viewed_on);
                            $scope.activity.order_date = d.getTime();
                            $scope.activity.desc_order_date = d.getTime();
                            ////console.log(datas.viewed_on+'=>'+$scope.activity.desc_order_date);
                            meeting_data.push($scope.activity);
                        });
                    }

                    if (angular.isDefined(result.data.recommend) && result.data.recommend.length > 0 && result.data.recommend != null) {
                        angular.forEach(result.data.recommend, function (get) {
                            $scope.recommend = get;
                            var d = new Date(get.date_created);
                            $scope.recommend.order_date = d.getTime();
                            $scope.recommend.desc_order_date = d.getTime();
                            ////console.log(get.date_created+'=>'+$scope.recommend.desc_order_date);
                            // meeting_data.push($scope.recommend);  
                        });
                    }

                    if (angular.isDefined(result.data.followup) && result.data.followup.length > 0 && result.data.followup != null) {
                        angular.forEach(result.data.followup, function (get) {
                            $scope.followup = get;
                            var d = new Date(get.created_date);
                            $scope.followup.order_date = d.getTime();
                            $scope.followup.desc_order_date = d.getTime();
                            ////console.log(get.created_date+'=>'+$scope.followup.desc_order_date);
                            // meeting_data.push($scope.followup);  
                        });
                    }



                    $scope.invitations.meetingList = meeting_data;

                    ////console.log($scope.invitations.meetingList);
                    var user_data = localStorageService.get('userdata');
                    $scope.user_id = user_data.user_id;
                }

            });
        }
        $scope.getInvitations();

        
        $scope.clearinvitationsfilter = function () {
            $scope.filter = {};
            $scope.getInvitations();
        }

        $scope.viewInvitation = function (meeting_id, created_to) {
            var user_data = localStorageService.get('userdata');
            $scope.user_id = user_data.user_id;
            var enctype = 'e6ec529ba185279a' + meeting_id + 'a0adcf93e645c7cd';

            if (angular.isDefined($scope.invitations.meetingList) && $scope.invitations.meetingList.length > 0) {
                if (created_to != null) {
                    if ($scope.user_id == created_to) {
                        var url = 'apiv4/public/meeting/update_meeting_view';
                        var params = { meeting_id: meeting_id };
                        RequestDetail.getDetail(url, params).then(function (result) {

                        });
                    }
                }
            }
            $location.path('meeting/' + enctype);
        }

        $scope.openmodelActivity = function () {
            $scope.showModalActivity = !$scope.showModalActivity;
        }

        $scope.act = {};
        $scope.act.user_id = 0;
        $scope.getuserdata = function () {
            if($scope.act.viewed_email!=""){
                var url = 'apiv4/public/researchprovider/getuserdata';
                var params = { email: $scope.act.viewed_email };
                RequestDetail.getDetail(url, params).then(function (result) {
                    if(result.data.length!=0){
                        $scope.act.viewed_name = result.data.firstname+' '+result.data.lastname;
                        $scope.act.viewed_title = result.data.title;
                        $scope.act.viewed_company_name = result.data.company_name;
                        $scope.act.viewed_contact = result.data.contact;
                        $scope.act.user_id = result.data.user_id;
                    }
                });
            }
        }

        $scope.addactivity = function () {
            if($scope.act.viewed_email==""){
                alertService.add("warning", "Please Enter Email!", 2000);
                return false;
            }
            if($scope.act.viewed_company_name==""){
                alertService.add("warning", "Please Enter Company Name!", 2000);
                return false;
            }
            if($scope.act.activity==""){
                alertService.add("warning", "Please Enter Activity!", 2000);
                return false;
            }
			var addactivityUrl = 'apiv4/public/researchprovider/addactivity';
			var params = {
				item_type: $scope.act.item_type,
				activity: $scope.act.activity,
				user_detail : $scope.act
			};

			RequestDetail.getDetail(addactivityUrl, params).then(function (result) {
				$scope.results = result.data;
				$scope.showModalActivity = !$scope.showModalActivity;
				$scope.getInvitations();
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
          startingDay: 1,showButtonPanel: false
        };
          
      $scope.open1 = function() {
        $scope.popup1.opened = true;
      };	
      
      // Disable weekend selection
    function disabled(data) {
      var date = data.date,
      mode = data.mode;
      return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6); /* Disable weak days */
    }
  
  
      $scope.open1 = function() {
        $scope.popup1.opened = true;
      };
  
      $scope.open2 = function() {
        $scope.popup2.opened = true;
      };
  
      $scope.setDate = function(year, month, day) {
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
          var dayToCheck = new Date(date).setHours(0,0,0,0);
  
          for (var i = 0; i < $scope.events.length; i++) {
            var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);
  
            if (dayToCheck === currentDay) {
              return $scope.events[i].status;
            }
          }
        }
  
        return '';
      }
      
      $scope.clickToOpen = function(index){
          $scope.view_showModal= $scope.classes[index];
          ngDialog.open({template: 'ext.html'});
      };


    }).controller('meetingviewResponse', function ($scope, $routeParams, $http, $location, RequestDetail, alertService, configdetails, localStorageService) {
        var urlParameter = $routeParams.meetingid;
        localStorageService.set('keyonly', urlParameter);
        $location.path('login/auto');
    })
    .controller('stasharchiveCtrl', function ($scope, $routeParams, $http, $location, RequestDetail, alertService, configdetails, localStorageService) {
        $scope.sidepopupactive=false;
        $scope.spinnerActive = true;
	    $scope.sidepopup = function() {
		    $scope.sidepopupactive=!$scope.sidepopupactive;
        }

        var url = 'apiv4/public/dashboard/getstasharchive';
        var params = { };
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.archives = result.data;
            $scope.spinnerActive = false;
        });
    })
    .controller('spacearchiveCtrl', function ($scope, $routeParams, $http, $location, RequestDetail, alertService, configdetails, localStorageService) {
        $scope.sidepopupactive=false;
        $scope.spinnerActive = true;
	    $scope.sidepopup = function() {
		    $scope.sidepopupactive=!$scope.sidepopupactive;
        }

        var url = 'apiv4/public/dashboard/getspacearchive';
        var params = { };
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.archives = result.data;
            $scope.spinnerActive = false;
        });
    })
    .controller('spacarchiveCtrl', function ($scope, $routeParams, $http, $location, RequestDetail, alertService, configdetails, localStorageService) {
        $scope.sidepopupactive=false;
        $scope.spinnerActive = true;
	    $scope.sidepopup = function() {
		    $scope.sidepopupactive=!$scope.sidepopupactive;
        }

        var url = 'apiv4/public/dashboard/getspacarchive';
        var params = { };
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.archives = result.data;
            $scope.spinnerActive = false;
        });
    })
    .controller('researcharchive', function ($scope, $routeParams, $http, $location, RequestDetail, alertService, configdetails, localStorageService) {
        $scope.sidepopupactive=false;
        $scope.spinnerActive = true;
	    $scope.sidepopup = function() {
		    $scope.sidepopupactive=!$scope.sidepopupactive;
        }

        var url = 'apiv4/public/dashboard/getresearcharchive';
        var params = { };
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.archives = result.data;
            $scope.spinnerActive = false;
        });
    })
    .controller('irarchive', function ($scope, $routeParams, $http, $location, RequestDetail, alertService, configdetails, localStorageService) {
        $scope.sidepopupactive=false;
        $scope.spinnerActive = true;
	    $scope.sidepopup = function() {
		    $scope.sidepopupactive=!$scope.sidepopupactive;
        }

        var url = 'apiv4/public/dashboard/getirarchive';
        var params = { };
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.archives = result.data;
            $scope.spinnerActive = false;
        });
    })
    .controller('engagementDashboard', function ($scope, $http, $location, $routeParams, localStorageService, RequestDetail, configdetails, $sce, usertype,alertService) {

        //First graph 

       

        $scope.colors_graph2 = ['#0F74BA', '#29A8E0', '#559cb0', '#93ead5', '#a7cde8','#62dda3'];

            $scope.data_graph2 = [];
            $scope.data_graph2 = ['0', '0', '0', '0', '0']; 
    
            $scope.datasetOverride2 = [{ yAxisID: 'y-axis-1' }];
    
            $scope.labels_graph2 = [];
            $scope.labels_graph2 = ['Propects', 'Step 1' , 'Step 2', 'Step 3', 'Step 4'];
    
            $scope.options_graph2 = {
                legend: {
                    display: false
                },
                scales: {
                    xAxes: [{
                        stacked: false,gridLines: {display: true,drawBorder: true,drawOnChartArea: false}
                    }],
                    yAxes: [{
                        stacked: false,id: 'y-axis-1', position: 'left',gridLines: {display: true,drawBorder: true,drawOnChartArea: false},scaleLabel: { display: true, labelString: 'Contacts'},  ticks: {min: 0,callback: function (value) { if (Number.isInteger(value)) { return value; } }}
                    }]
                },
    
                title: {
                    display: true,
                    text: 'Pipeline',
                    fontSize: 15,
                },
            };

        var url = 'apiv4/public/researchprovider/getinvestorpipeline';
        var params = {};
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.data_graph2 = [];
            $scope.labels_graph2 = [];

            angular.forEach(result.data, function (val) {
                $scope.data_graph2.push(val.count);
                $scope.labels_graph2.push(val.name);
            });
        });

        $scope.colors_graph1 = ['#0F74BA', '#29A8E0', '#559cb0', '#93ead5', '#29A8E0'];

        $scope.data_graph1 = [];
        $scope.data_graph1 = [
            ['0','0','0','0','0','0'],
            ['0','0','0','0','0','0'],
        ]; 

        $scope.datasetOverride1 = [{ yAxisID: 'y-axis-1' }];

        $scope.labels_graph1 = [];

        $scope.options_graph1 = {
			legend: {
				display: true
			},
			scales: {
				xAxes: [{
					stacked: false,gridLines: {display: true,drawBorder: true,drawOnChartArea: false}
				}],
				yAxes: [{
					stacked: false,id: 'y-axis-1', position: 'left',gridLines: {display: true,drawBorder: true,drawOnChartArea: false},scaleLabel: { display: true, labelString: 'Open & Click'},  ticks: {min: 0,callback: function (value) { if (Number.isInteger(value)) { return value; } }}
				}]
			},

			title: {
				display: true,
				text: 'Pipeline',
				fontSize: 15,
			},
        };
        
        $scope.series_graph1 = ['Open', 'Click'];

        //First Graph


        //Second Graph
        $scope.totals = [];
        $scope.filter = {};

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

        var tagUrl = 'apiv4/public/researchprovider/getCustomcategory';
        var params = {};
        RequestDetail.getDetail(tagUrl, params).then(function (result) {
            $scope.customcategories = result.data;
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
            $scope.filterreadership();
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
            $scope.filterreadership();
        }

        $scope.filterreadership = function () {
           
            $scope.totals.click_total = 0;
            $scope.totals.click_total_percentage = 0;
            $scope.totals.open_total = 0;
            $scope.totals.open_total_percentage = 0;
            $scope.totals.total = 0;

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
                $scope.spinnerActive = true;
                var url = 'apiv4/public/researchprovider/filterreadership';
                var params = { search_user: $scope.search_user,search_startdate:$scope.realsearch_startdate,search_enddate:$scope.realsearch_enddate,custom_category:$scope.filter.custom_category,userreader_filter:$scope.filter.userreader_filter };
                RequestDetail.getDetail(url, params).then(function (result) {
                   
                    if(result.data.totals.click_total){
                        $scope.totals = result.data.totals;
                    }
                    $scope.data_graph = [
                        ['0', '0', '0', '0', '0','0'],
                        ['0', '0', '0', '0', '0','0'],
                        ['0', '0', '0', '0', '0','0'],
                    ]; 
                    $scope.labels_graph = ['No Data', 'No Data', 'No Data', 'No Data', 'No Data'];
                    if(result.data.report.emails_total){
                        $scope.data_graph = [];
                        $scope.labels_graph = [];
                        $scope.data_graph.push(result.data.report.opens);
                        $scope.data_graph.push(result.data.report.clicks);
                        $scope.data_graph.push(result.data.report.emails_total);
                        $scope.labels_graph = result.data.report.timelines;
                    }
                    
                    $scope.spinnerActive = false;
                });
            }
            

        }
        $scope.resetsearch = function () {
            $scope.realsearch_startdate = '';
            $scope.realsearch_enddate = '';
            $scope.filter.custom_category = '';
            $scope.filter.userreader_filter = '';
            $scope.search_user = '';
            $scope.search_startdate = '';
            $scope.filterreadership();
        }
        $scope.filterreadership();
        $scope.colors_graph = ['#0F74BA', '#29A8E0', '#559cb0', '#93ead5', '#29A8E0'];

       

        $scope.data_graph = [];
        $scope.data_graph = [
			['10', '20', '30', '40', '50','60'],
            ['90', '20', '30', '80', '50','60'],
            ['190', '120', '130', '180', '150','160'],
        ]; 
       // $scope.data_graph = [
		//	['10', '20', '30', '40', '50','60']
       // ]; 

       $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];

        $scope.labels_graph = [];
        $scope.labels_graph = ['Oct2018', 'Sep2018', 'Aug2018', 'July2018', 'June2018'];

        $scope.options_graph = {
			legend: {
				display: true
			},
			scales: {
				xAxes: [{
					stacked: false,gridLines: {display: true,drawBorder: true,drawOnChartArea: false}
				}],
				yAxes: [{
					stacked: false,id: 'y-axis-1', position: 'left',gridLines: {display: true,drawBorder: true,drawOnChartArea: false},scaleLabel: { display: true, labelString: 'Open & Click'},  ticks: {min: 0,callback: function (value) { if (Number.isInteger(value)) { return value; } }}
				},{
					stacked: false,id: 'y-axis-1', position: 'left',gridLines: {display: true,drawBorder: true,drawOnChartArea: false},scaleLabel: { display: true, labelString: 'Open & Click'},  ticks: {min: 0,callback: function (value) { if (Number.isInteger(value)) { return value; } }}
				},{
					stacked: false,id: 'y-axis-2', position: 'right',gridLines: {display: true,drawBorder: true,drawOnChartArea: false},scaleLabel: { display: true, labelString: 'Total'},  ticks: {min: 0,callback: function (value) { if (Number.isInteger(value)) { return value; } }}
				}]
			},
            title: {
				display: true,
				text: 'Monthly Engagement ',
				fontSize: 15,
			},
			title: {
				display: true,
				text: '',
				fontSize: 15,
			},
        };
        
        $scope.series_graph = ['Open', 'Click','Total'];

        //Second Graph

        $scope.engagement_type = 'Virtual';
        
        //,
        //Three Graph

        // CHART JS STACKED BAR - STARTS
		$scope.labels = [];
		$scope.labels = ['Current', 'Prior Month', '-2 Month','-3 Month','-4 Month','-5 Month'];
		$scope.type = "StackedBar";
		$scope.series = ['Left Msg', 'Email','Call'];
		$scope.options = {
			scales: {
				xAxes: [{
					stacked: true,
				}],
				yAxes: [{
					stacked: true,
				}]
			},
            title: {
				display: true,
				text: 'Monthly Engagement ',
				fontSize: 15,
			},
		};
		$scope.data = [
			[5, 5, 5, 10, 15],
            [10, 50, 10, 20, 25],
            [65, 50, 90, 30, 35],
            
		];
		$scope.colors = [];
		$scope.colors = ['#0F74BA', '#29A8E0', '#559cb0', '#93ead5', '#29A8E0'];
        // CHART JS STACKED BAR - ENDS

       
        //Physical
        // CHART JS STACKED BAR - STARTS
		$scope.labels_physical = [];
		$scope.labels_physical = ['Current', 'Prior Month', '-2 Month','-3 Month','-4 Month','-5 Month'];
		$scope.type_physical = "StackedBar";
		$scope.series_physical = ['Conference','In-Person (Group)','In-Person (1x1)'];
		$scope.options_physical = {
			scales: {
				xAxes: [{
					stacked: true,
				}],
				yAxes: [{
					stacked: true,
				}]
            },
            title: {
				display: true,
				text: 'Monthly Engagement ',
				fontSize: 15,
			},
		};
		$scope.data_physical = [
			[5, 5, 5, 10, 15],
            [10, 50, 10, 20, 25],
            [65, 50, 90, 30, 35],
		];
		$scope.colors_physical = [];
		$scope.colors_physical = ['#0F74BA', '#29A8E0', '#559cb0', '#93ead5', '#29A8E0'];
        // CHART JS STACKED BAR - ENDS

        //Three Graph

        //Four Graph
        $scope.series_graph6 = ['Current', '8Q Avg'];

		$scope.colors_graph6 = ['#0F74BA', '#29A8E0', '#559cb0', '#93ead5', '#29A8E0'];

		$scope.labels_graph6 = ['CON', 'DIR', 'BRE', 'IMPACT', 'DEPTH', 'DURATION'];
        
		$scope.datasetOverride_graph6 = [{
				label: "Actual",
				borderWidth: 1,
				type: 'bar'
			},

		];
		$scope.options_graph6 = {
			legend: {
				display: true
			},
			scales: {
				xAxes: [{
					stacked: false
				}],
				yAxes: [{
					stacked: false
				}]
			},

			title: {
				display: true,
				text: 'Scorecard vs Target',
				fontSize: 15,
			},
		};
        //Four Graph

        var url = 'apiv4/public/dashboard/getengagement';
        var params = {};
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.data = result.data.data_virtual;
            $scope.data_physical = result.data.data_physial;
            $scope.data_graph6 = result.data.data_scorecard;
        });

    })
    .controller('watchlistCtrl', function($scope,$http,$location,local,RequestDetail,alertService,configdetails) {
        $scope.configdetails=configdetails;
        $scope.pageHeading = 'Watchlists';
        $scope.watchlistActive = 'inner-active';
        
        $scope.showModalpageinfo=false;
      
        $scope.openmodelpagehelp = function() {
               $scope.showModalpageinfo=!$scope.showModalpageinfo;
        }
        
        $scope.wlform = {};
        $scope.watchlists = {};
    
        $scope.editId = '';
    
        $scope.saveWatchlist = function(){
    
            if($scope.wlform.name=='')
            {
    
                $('#watchlist_name').focus();
                alertService.add("warning", "Enter watchlist name!",2000);
                return false;
            }
    
            if($scope.industryTagsAdded.length == 0)
            {
    
                $('#tagMacro1').focus();
                alertService.add("warning", "You should add tags!",2000);
                return false;
            }
    
    
    
            var saveWatchlistUrl = 'apiv4/public/watchlist/saveWatchlist';
    
            if($scope.edit == true)
            {
                var type = 'edit';
            } 
            else
            {
                var type = 'add';
            }
    
            var params = {
                type : type,
                wlId : $scope.editId,
                title : $scope.wlform.name,
                tickers : $scope.wlform.tickers, 
                keywords: $scope.wlform.keywords,
                industrytags : $scope.industryTagsAdded
    
            };
        
        RequestDetail.getDetail(saveWatchlistUrl,params).then(function(result){
            $scope.edit = false;
            if(angular.isDefined(result.data) && result.data== 'true')
            {
               
                $scope.editId = '';
                $scope.wlform.formTitle = 'Add Watchlist';
                $scope.wlform.name = '';
                $scope.industryTagsAdded = [];
                $scope.wlform.tickers = '';
                $scope.wlform.keywords = '';
                $scope.filevisible = '';
                $scope.btnName = 'Save Watchlist';
                alertService.add("success", "Your watchlist has been successfully added !",2000);
                $scope.getWatchlist();
            }
            else if(angular.isDefined(result.data) && result.data!=true && result.data!='false')
            {
               $scope.editId = '';
                $scope.wlform.formTitle = 'Add Watchlist';
                $scope.wlform.name = '';
                $scope.industryTagsAdded = [];
                $scope.wlform.tickers = '';
                $scope.wlform.keywords = '';
                $scope.filevisible = '';
                $scope.btnName = 'Save Watchlist';
                alertService.add("success", "Your watchlist has been successfully added ! "+result.data+" not added",5000);
                $scope.getWatchlist(); 
            }
            else if(angular.isDefined(result.data) && result.data=='false')
            {
                alertService.add("warning", "Tickers not matched please try again!",2000);
            }
        });
        }
        $scope.uploadFile = function(data)
        {
         var dat =  JSON.parse(data);  
         if(dat.error){
            alertService.add("warning", "File format is wrong kindly check the file !",2000);
            alert('File Format is wrong kindly check Your file !')
         }
         else{
            if(angular.isDefined(data))
            {
                var getWatchlisturl = 'apiv4/public/watchlist/getWatchlist';
                var params = {
                    type : 'get'
                };
                RequestDetail.getDetail(getWatchlisturl,params).then(function(result){
                    $scope.watchlists = result.data;
                });
                alertService.add("success", "Your watchlist has been successfully uploaded !",2000);
            }
        }
       }
       $scope.confirmRemove = function(id){ $scope.edit = false;
        if(confirm('Are you sure to delete !'))
        var removeWatchlisturl = 'apiv4/public/watchlist/removeWatchList';
        var params = {
            type : 'delete',
            wlId : id
        };
        RequestDetail.getDetail(removeWatchlisturl,params).then(function(result){
            $scope.editId = '';
            $scope.wlform.formTitle = 'Add Watchlist';
            $scope.wlform.name = '';
            $scope.industryTagsAdded = [];
            $scope.wlform.tickers = '';
            $scope.wlform.keywords = '';
            $scope.filevisible = '';
            $scope.btnName = 'Save Watchlist';
            $scope.edit = false;
            if(result.data != ''){
                $scope.watchlists = result.data;
                alertService.add("success", "Watchlist deleted successfully !",2000);
            } else{
                     $scope.watchlists =[];
                     alertService.add("success", "Watchlist deleted successfully !",2000);
            }
        });
    }
    
    // Get all watchlists
    $scope.getWatchlist = function(){
        var getWatchlisturl = 'apiv4/public/watchlist/getWatchlist';
    var params = {
        type : 'get'
    };
    RequestDetail.getDetail(getWatchlisturl,params).then(function(result){
        $scope.watchlists = result.data;
    });
    }
    
    $scope.getWatchlist();
    
    $scope.cancel = function(){
        $scope.editId = '';
        $scope.wlform.formTitle = 'Add Watchlist';
        $scope.wlform.name = '';
        $scope.industryTagsAdded = [];
        $scope.wlform.tickers = '';
        $scope.wlform.keywords = '';
        $scope.filevisible = '';
         $scope.btnName = 'Save Watchlist';
         $scope.edit = false;
    }
    
    $scope.industryTagsAdded = [];
    
    // Get Industry Tags here
    
    var tagUrl = 'apiv4/public/meeting/getAllIndustryTags';
    var params = {};
    
    RequestDetail.getDetail(tagUrl,params).then(function(result){
        $scope.macroTags = result.data.macro;
        $scope.midTags = result.data.mid;
        $scope.microTags = result.data.micro;
    });
    
    $scope.tags = {};
    $scope.tags.valMacroTags = '';
    $scope.tags.valMidTags = '';
    $scope.tags.valMicroTags = '';
    
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
    
    $scope.addMacroTag = function(){
        if($scope.tags.valMacroTags != ''){
            if($scope.industryTagsAdded.indexOf($scope.tags.valMacroTags) == -1){
                $scope.industryTagsAdded.push($scope.tags.valMacroTags);
                $scope.tags.valMacroTags = '';
                $scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro1');
            } else {
                alert("Already Added in the List");
                $scope.tags.valMacroTags = '';
                $scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro1');
            }
        }
    }
    $scope.addMidTag = function(){
        if($scope.tags.valMidTags != ''){
            if($scope.industryTagsAdded.indexOf($scope.tags.valMidTags) == -1){
                $scope.industryTagsAdded.push($scope.tags.valMidTags);
                $scope.tags.valMidTags = '';
                $scope.$broadcast('angucomplete-alt:clearInput', 'tagMid1');
            } else {
                alert("Already Added in the List");
                $scope.tags.valMidTags = '';
                $scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro1');
            }
        }
    }
    $scope.addMicroTag = function(){
        if($scope.tags.valMicroTags != ''){
            if($scope.industryTagsAdded.indexOf($scope.tags.valMicroTags) == -1){
                $scope.industryTagsAdded.push($scope.tags.valMicroTags);
                $scope.tags.valMicroTags = '';
                $scope.$broadcast('angucomplete-alt:clearInput', 'tagMicro1');
            } else {
                alert("Already Added in the List");
                $scope.tags.valMicroTags = '';
                $scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro1');
            }
        }
    }
    
    $scope.removeTag = function(item){
        var index = $scope.industryTagsAdded.indexOf(item);
        $scope.industryTagsAdded.splice(index, 1);
    }
    
    $scope.wlform.formTitle = 'Add Watchlist';
    $scope.wlform.name = '';
    $scope.wlform.macro = '';
    $scope.wlform.mid = '';
    $scope.wlform.micro = '';
    $scope.wlform.tickers = '';
    $scope.wlform.keywords = '';
    $scope.industrytags = '';
    $scope.filevisible = '';
    $scope.btnName = 'Save Watchlist';
    
    $scope.editWatchlist = function(index){
        $scope.industryTagsAdded=[];
        $scope.edit = true;
        $scope.editId = $scope.watchlists[index].watch_list_id;
        angular.forEach($scope.watchlists[index].watchlist_industry_tags, function(value, key) {
                $scope.industryTagsAdded.push(value.name)
        });
        
        $scope.wlform.formTitle = 'Edit Watchlist';
        $scope.wlform.name = $scope.watchlists[index].name;
        $scope.wlform.tickers = $scope.watchlists[index].tickers;
        $scope.wlform.keywords = $scope.watchlists[index].keywords;
        $scope.filevisible = 'hide';
        $scope.btnName = 'Update Watchlist';
    }
    
    $scope.removeWatchlist = function(id){
        $scope.deleteId = id;
        $scope.showModal = !$scope.showModal;
    }
    
    $scope.confirmDelete = function(){
        $scope.showModal = '';
        $scope.confirmRemove($scope.deleteId);
    }
    
    $scope.cancelDelete = function(){
        $scope.showModal = '';
    }
    // On click redirection
    
    }).controller('fairMylist', function($scope,$http,$location,$route,$routeParams,localStorageService,RequestDetail,$window,usertype,alertService,$timeout) {
	
	
        $scope.pageHeading = 'Manage FAIR';
        $scope.myfairActive = 'active';
        
        $scope.fairmanage = 'inner-active';
        
        
        $scope.fairpagetype = $routeParams.type;
        
        $scope.categorymodelshow=function(){
            $scope.viewcategoryModal = !$scope.viewcategoryModal;
        }
        
        $scope.fairlistaccordion = 1;
        
        $scope.showModalpageinfo=false;
    
    
        
    
        $scope.closefair_sear = function() {
            $scope.sidepopupactive=false;
         }
    
        
        $scope.changefairblock = function(count) {
            $scope.fairlistaccordion = count;
         }
      
        $scope.openmodelpagehelp = function() {
               $scope.showModalpageinfo=!$scope.showModalpageinfo;
        }
        
        $scope.getallcategory=function(){
            $scope.fairallcategoryList = [];
            var url = 'apiv4/public/fair/getallfaircategorydata';
            var params = {};
            RequestDetail.getDetail(url,params).then(function(result){
                $scope.fairallcategoryList = result.data.list;
            });
            
        }
    
        $scope.fairallcategoryList = [];
        var url = 'apiv4/public/fair/getfairnotification';
        var params = {};
        RequestDetail.getDetail(url,params).then(function(result){
            $scope.fairnotificationList = result.data;
        });
        
        $scope.getallcategory();
        $scope.faircategoryList= [];
        $scope.fairsubecategoryList= [];
        
        $scope.parent_fair_category_id = "0";
        
        $scope.getparentcategory=function(){
        
            var url = 'apiv4/public/fair/getfaircategorydata';
            var params = {parent_fair_category_id:0,type:usertype.getService()};
            RequestDetail.getDetail(url,params).then(function(result)
              {
                $scope.faircategoryList = result.data;
            });
        
        };
        
        $scope.getparentcategory();
    
    
        $scope.getsubecategory=function(){
        
            var url = 'apiv4/public/fair/getfairsubecategorydata';
            var params = {};
            RequestDetail.getDetail(url,params).then(function(result)
              {
                    $scope.fairsubecategoryList = result.data;
            });
        
        };
        
        $scope.getsubecategory();
        
        $scope.showfaircategory_sucess = false;
        
        
         $scope.savenewCategory=function(parent_fair_category_id,newcategory){
            
            if(newcategory){
                var params = {parent_fair_category_id:parent_fair_category_id,categoryitem:newcategory};
            
                var url = 'apiv4/public/fair/faircategorysave';
                RequestDetail.getDetail(url,params).then(function(result){
    
                    if(result.data.addedcategory_id){
                        $scope.showfaircategory_sucess = true;
                        $scope.newcategory = "";
                        newcategory = "";
        
                        $scope.getallcategory();
                        $scope.getparentcategory();
                        $scope.getsubecategory();
                        $scope.viewcategoryModal = false;
                        $timeout(function() {
                            $route.reload();
                        }, 100);
                    }else{
                        alertService.add("warning", "Category already exists!", 2000);
                    }
    
                    
                });
            
            }
            
         }
         
         $scope.deletefair = function(fair_id){		
             
            if (confirm("Are you sure?")) {
                var url = 'apiv4/public/fair/deletefair';
                var params = {fair_id:fair_id};
                RequestDetail.getDetail(url,params).then(function(result)
                  {
                     alertService.add("warning", "Fair Deleted !",2000);
                     $scope.getfaircorporatelist();
                     
                });
                
            }
        }
         
        $scope.faircategoryupdateorder = function(){
            
            var url = 'apiv4/public/fair/faircategoryupdateorder';
            var params = {faircategoryList:$scope.fairallcategoryList};
            RequestDetail.getDetail(url,params).then(function(result)
              {
                    alertService.add("success", "Sort Order Updated Successfully!",2000);
                    //$scope.viewcategoryModal = !$scope.viewcategoryModal;
                    //$location.reload();
            });
        }
        
        
        $scope.CategoryRemove = function(fair_category_id){
            if (confirm("Are you sure to delete category?")) {
                var url = 'apiv4/public/fair/deleteCategory';
                var params = {fair_category_id:fair_category_id};
                RequestDetail.getDetail(url,params).then(function(result)
                {
                        $scope.getallcategory();
                        $scope.getparentcategory();
                        $scope.getsubecategory();
                });
            }
        }
    
    
        
        $scope.getalltickers = function(){
        
            var url = 'apiv4/public/fair/getalltickers';
            var params = {type:usertype.getService()};
            RequestDetail.getDetail(url,params).then(function(result)
              {
                $scope.alltickers = result.data
            });
        }
        $scope.getalltickers();
        
        $scope.TickerRemove = function(watch_list_id){
            var url = 'apiv4/public/fair/deleteTicker';
            var params = {watch_list_id:watch_list_id};
            RequestDetail.getDetail(url,params).then(function(result)
              {
                    $scope.getalltickers();
            });
        }
        
        $scope.savenewTicker = function(ticker){
            
            
            var url = 'apiv4/public/fair/fairtickersave';
            var params = {ticker:ticker};
            RequestDetail.getDetail(url,params).then(function(result)
              {
                $scope.getalltickers();
                $scope.ticker = "";
                
            });
        }	
         
        
        $scope.activetab=0;
     
        $scope.changeactive = function(index) {
            $scope.activetab=index;
        }; 
        
        if($scope.fairpagetype !="" && !angular.isUndefined($scope.fairpagetype)){
            if($scope.fairpagetype=='company'){
                $scope.activetab=1;
            }else{
                $scope.activetab=2;
            }
            
        }
    
    
        
        //side filter popup
        $scope.sidepopupactive=false;
      
        $scope.sidepopup = function() {
            $scope.sidepopupactive=true
        }
        
        $scope.fair_category_id = '';
        $scope.status = '';
        $scope.fairList= [];
        
            
        $scope.fair_search_term = '';
        
        $scope.viewtype = 'list';
        
        
        
        
        $scope.viewchange = function(view){
            if(view=='grid'){
                
                $scope.viewtype = 'grid';
                $scope.viewmySty = {
                    "width" : "31%"
                   }
                
                $scope.full_screen_textstyle = {
                    "display" : "none"
                }
                $scope.mobile_screen_textstyle = {
                    "display" : "block"
                }
                $scope.read_morestyle = {
                    "display" : "block"
                }
            }
            
            if(view=='list'){
                $scope.viewtype = 'list';
                $scope.viewmySty = {
                    "width" : "98%"
                }
                $scope.full_screen_textstyle = {
                    "display" : "inline-block"
                }
                $scope.mobile_screen_textstyle = {
                    "display" : "none"
                }
                $scope.read_morestyle = {
                    "display" : "inline-block"
                }
                
            }
        }
        
        $scope.viewchange('list');
        
        
    $scope.getfaircorporatelist = function(){	
        
        var url = 'apiv4/public/fair/getfaircorporatelist_count';
        var params = {fair_category_id:$scope.fair_category_id,status:$scope.status,fair_search_term:$scope.fair_search_term,type:usertype.getService(),listtype:'all'};
        $scope.limit = 10;
        $scope.largelimit = 10;
        $scope.page = 1;
        $scope.paginations = [];
        $scope.balance = 0;
        
        
        RequestDetail.getDetail(url,params).then(function(result){
            if(angular.isDefined(result.data) && result.data !=0)
            {
                
              $scope.total_data_row = result.data;
        
              $scope.pagination_count =  Math.floor($scope.total_data_row /$scope.limit);
              
              ////console.log($scope.pagination_count);
              
              // $scope.balance = $scope.total_data_row % $scope.limit;	  
              ////console.log($scope.total_data_row /$scope.limit);
              
              if($scope.pagination_count<$scope.total_data_row /$scope.limit){
                  $scope.pagination_count =  $scope.pagination_count+1;
              }
              
              
              
              $scope.largelimit =  Math.floor($scope.pagination_count /4);
              
              for(var p_count=1;p_count<=$scope.pagination_count;p_count++) {
                 $scope.paginations.push(p_count);
              }
            }
        });
        
        
        var userdata = localStorageService.get('userdata');
        
        $scope.profileid = userdata.userId;
        $scope.page = 0;
        $scope.pagination('next');
        
        $scope.sidepopupactive=false;
        
    }
    
    $scope.getfairsearchclear = function(){	
        $scope.fair_category_id=""; 
        $scope.status="";
        $scope.fair_search_term="";
        $scope.getfaircorporatelist();
        $scope.sidepopupactive=false;
    }
    
    
    
    $scope.pagination = function(page){	
        
        if(page!="undefined" && page!="" && page!=0){
          
          if(page=='prev'){
              if($scope.page!=1){
               $scope.page = $scope.page-1;
              }
          }
          else if(page=='prev1'){
              $scope.page = $scope.page - $scope.largelimit;
              if($scope.page < 1){
                   $scope.page = 1;
              }
          }
          else if(page=='next'){
              $scope.page = $scope.page + 1;
              if($scope.page > $scope.pagination_count){
                   $scope.page = $scope.pagination_count;
              }
          }
          else if(page=='next1'){
              $scope.page = $scope.page + $scope.largelimit;
              if($scope.page > $scope.pagination_count){
                   $scope.page = $scope.pagination_count;
              }
          }
        }
        
        var url = 'apiv4/public/fair/getfaircorporatelist';
        var params = {fair_category_id:$scope.fair_category_id,status:$scope.status,fair_search_term:$scope.fair_search_term,type:usertype.getService(),listtype:'all',limit: $scope.limit,page: $scope.page};
        RequestDetail.getDetail(url,params).then(function(result){
            $scope.fairList = result.data;
        });
            
        $scope.startindex = ($scope.page-1)*$scope.limit;
        
    }
            
    
    
            $scope.readcount = 0;
            if($scope.fairpagetype !="" && !angular.isUndefined($scope.fairpagetype)){
                if($scope.fairpagetype=='company'){
                    var url = 'apiv4/public/fair/getfairrequestlist';
                    var params = {fair_category_id:$scope.fair_category_id,status:$scope.status,fair_search_term:$scope.fair_search_term,type:usertype.getService(),listtype:'all',limit: $scope.limit,page: $scope.page};
                    RequestDetail.getDetail(url,params).then(function(result){
                        $scope.fairList = result.data;
                        angular.forEach($scope.fairList.list, function (data,key) {
                            
                            if(data.status==1){
                                $scope.readcount = $scope.readcount+1;
                            }
                        });
                    });
                }else{
                     
                }
                
            }else{
                $scope.getfaircorporatelist();
            }
                
    
    
            $scope.paginationClass = function(page){
                
                if(page==$scope.page){
                    return 'active_pagination';
                }else{
                    return '';
                }
            }
        
    
    
    }).controller('fairMynew', function($scope,$http,$location,$route,$routeParams,localStorageService,RequestDetail,$window,alertService,usertype,$sce,$interpolate) {
        
        $scope.pageHeading = 'Manage FAIR';
        $scope.myfairActive = 'active';
        
        $scope.question = "";
        $scope.answer = "";
        $scope.tags = "";
        $scope.parent_fair_category_id = "";
        $scope.fair_category_id = "0";
        $scope.status = "";
        $scope.year = "";
        
        
        
        
        $scope.actionbuttion = 'Post Question';
        $scope.boheading= 'Post Question';
        
        $scope.faircategoryList= [];
        
        
        
        $scope.getparentcategory=function(){
        
            var url = 'apiv4/public/fair/getfaircategorydata';
            var params = {parent_fair_category_id:0,type:usertype.getService()};
            RequestDetail.getDetail(url,params).then(function(result)
              {
                $scope.faircategoryList = result.data;
            });
        
        };
        
        $scope.fairsubcategoryList = [];
        
        $scope.getfairsubcategorylist=function(){
            
            if($scope.parent_fair_category_id!=0){
                var url = 'apiv4/public/fair/getfaircategorydata';
                var params = {parent_fair_category_id:$scope.parent_fair_category_id,type:usertype.getService()};
                RequestDetail.getDetail(url,params).then(function(result)
                  {	
                      if(result.data){
                        $scope.fairsubcategoryList = result.data;
                    }else{
                        $scope.fairsubcategoryList = [];
                    }
                });
            }
        }
        
        
        $scope.showModalpageinfo=false;
      
        $scope.openmodelpagehelp = function() {
               $scope.showModalpageinfo=!$scope.showModalpageinfo;
        }
        
        $scope.view_showModal = false;
        
        $scope.addcategorypopupModal = function(){	
            $scope.view_showModal = !$scope.view_showModal;
        }
        
        $scope.getparentcategory();
        
         $scope.data = [];
    
         $scope.data.corporate = [];
        
        
            // Editor options.
          $scope.options = {
            language: 'en',
            allowedContent: true,
            entities: false
          };
        
        if(angular.isDefined($routeParams.userId) && $routeParams.userId !='')
        {
            var params = {user_id:$routeParams.userId};
            
            var url = 'apiv4/public/fair/getusercorporate';
            RequestDetail.getDetail(url,params).then(function(result){
                    
                    var newColumn = {
                      label: result.data,
                      value: $routeParams.userId,
                    };
               
                    $scope.data.corporate.push(newColumn);
            });
        
            
        
        }
        
         $scope.parent_fair_category_id = "0";
        
         $scope.savenewCategory=function(parent_fair_category_id,newcategory){
             
             var params = {parent_fair_category_id:parent_fair_category_id,categoryitem:newcategory};
            
            var url = 'apiv4/public/fair/faircategorysave';
            RequestDetail.getDetail(url,params).then(function(result){
                
                
                $scope.getparentcategory();
                $scope.newcategory = "";
                $scope.getfairsubcategorylist();
                if(parent_fair_category_id!="0"){
                    $scope.fair_category_id = result.data.addedcategory_id;
                }
                
                $scope.view_showModal = false;
                
            });
             
         }
        
        
        $scope.addfair = function(){	
            
             if(usertype.getService() == 'corporate'){
            
                if(angular.isUndefined($scope.question) || $scope.question== ''){         
                    alertService.add("warning", "Question Invalid !",2000);
                    return false;
                } 
                
                if(angular.isUndefined($scope.answer) || $scope.answer== ''){         
                    alertService.add("warning", "Answer Invalid !",2000);
                    return false;
                } 
                
                if(angular.isUndefined($scope.parent_fair_category_id) || $scope.parent_fair_category_id== '0'){         
                    alertService.add("warning", "Category Invalid !",2000);
                    return false;
                } 
                
                if(angular.isUndefined($scope.status) || $scope.status== ''){         
                    alertService.add("warning", "Status Invalid !",2000);
                    return false;
                } 
                
                if(angular.isUndefined($scope.year) || $scope.year== ''){         
                    alertService.add("warning", "Year Invalid !",2000);
                    return false;
                } 
                
                var params = {question:$scope.question,answer:$scope.answer,tags:$scope.tags,parent_fair_category_id:$scope.parent_fair_category_id,fair_category_id:$scope.fair_category_id,status:$scope.status,year:$scope.year,type:usertype.getService()};
                
            }else{
                
                if($scope.data.corporate.length==0){         
                    alertService.add("warning", "Corporate Invalid !",2000);
                    return false;
                } 
                
                var params = {question:$scope.question,tags:$scope.tags,corporate:$scope.data.corporate[0]['value'],type:usertype.getService()};
            
            }
            
            /* LETS MAKE THE TAGS NOT MANDATORY
            if(angular.isUndefined($scope.tags) || $scope.tags== ''){         
                    alertService.add("warning", "Tags Invalid !",2000);
                    return false;
            } 
            */
    
            var url = 'apiv4/public/fair/addfair';
            RequestDetail.getDetail(url,params).then(function(result){
                alertService.add("success", "Fair added Successfully !",2000);
                $location.path('fair');
            });
    
        }
        
        
        
         $scope.get_search_details=function(type,searchkey){
            if(angular.isDefined(searchkey) && searchkey!=''){
                if(type!=''){
                    var tagUrl = 'apiv4/public/researchprovider/get_search_details';
                    var searchterm=searchkey;
    
                   
                    if(type=='corporate'){
                       var params = {term : searchterm, key : type };
                      RequestDetail.getDetail(tagUrl,params).then(function(result){
                          if(angular.isDefined(result.data) && result.data.length>0)
                          {
                              $scope.availableTickers=result.data;
                          }else{
                              $scope.availableTickers=[];
                          }
                      });
                    }
                    
                }
            }
        }
    
    
    }).controller('faircategory', function($scope,$http,$location,$route,$routeParams,localStorageService,RequestDetail,$window,usertype,alertService) {
        $scope.pageHeading = 'Manage FAIR';
        $scope.myfairActive = 'active';
        
        
        $scope.getallcategory=function(){
            $scope.fairallcategoryList = [];
            var url = 'apiv4/public/fair/getallfaircategorydata';
            var params = {};
            RequestDetail.getDetail(url,params).then(function(result){
                $scope.fairallcategoryList = result.data.list;
            });
            
        }
        
        $scope.getallcategory();
        $scope.faircategoryList= [];
        
        
        $scope.parent_fair_category_id = "0";
        
        $scope.getparentcategory=function(){
        
            var url = 'apiv4/public/fair/getfaircategorydata';
            var params = {parent_fair_category_id:0,type:usertype.getService()};
            RequestDetail.getDetail(url,params).then(function(result)
              {
    
                  
                $scope.faircategoryList = result.data;
            });
        
        };
        
        $scope.getparentcategory();
        
        $scope.showfaircategory_sucess = false;
        
         $scope.savenewCategory=function(parent_fair_category_id,newcategory){
             
             var params = {parent_fair_category_id:parent_fair_category_id,categoryitem:newcategory};
            
            var url = 'apiv4/public/fair/faircategorysave';
            RequestDetail.getDetail(url,params).then(function(result){
                $scope.showfaircategory_sucess = true;
                $scope.newcategory = "";
                $scope.getallcategory();
                $scope.getparentcategory();
            });
            
            
         }
         
        $scope.faircategoryupdateorder = function(){
            
            var url = 'apiv4/public/fair/faircategoryupdateorder';
            var params = {faircategoryList:$scope.fairallcategoryList};
            RequestDetail.getDetail(url,params).then(function(result)
              {
                    alertService.add("success", "Sort Order Updated Successfully!",2000);
                    //$location.path('fair/faircategory');
            });
        }
        
        
        $scope.CategoryRemove = function(fair_category_id){
            if (confirm("Are you sure to delete category?")) {
                var url = 'apiv4/public/fair/deleteCategory';
                var params = {fair_category_id:fair_category_id};
                RequestDetail.getDetail(url,params).then(function(result)
                  {
                        $scope.getallcategory();
                });
            }
            
        }
        
        
        
    
    }).controller('fairMyview', function($scope,$http,$location,$route,$routeParams,localStorageService,RequestDetail,$window,usertype,alertService) {
        
        $scope.pageHeading = 'Manage FAIR';
        $scope.myfairActive = 'active';
        
        $scope.fair_id= $routeParams.fair_id;
        
        $scope.userId= $routeParams.userId;
        
        $scope.showModalpageinfo=false;
      
        $scope.openmodelpagehelp = function() {
               $scope.showModalpageinfo=!$scope.showModalpageinfo;
        }
        
        $scope.fairList= [];
    
        $scope.spinnerActive = true;
        
        
        var url = 'apiv4/public/fair/getfaircategorydata';
        var params = {};
        RequestDetail.getDetail(url,params).then(function(result){
            $scope.faircategoryList = result.data
        });
        
        
        var url = 'apiv4/public/fair/getfaircorporateview';
        var params = {fair_id:$scope.fair_id};
        RequestDetail.getDetail(url,params).then(function(result){
                $scope.fairview = result.data;
                $scope.spinnerActive = false;
        });
        
        $scope.deletefair = function(fair_id){		
            if (confirm("Are you sure?")) {
                var url = 'apiv4/public/fair/deletefair';
                var params = {fair_id:fair_id};
                RequestDetail.getDetail(url,params).then(function(result)
                  {
                     alertService.add("warning", "Answer Invalid !",2000);
                });
                $location.path('fair');
            }
        }
        
        
            
    
    
    }).controller('fairedit', function($scope,$http,$location,$route,$routeParams,localStorageService,RequestDetail,$window,usertype,alertService) {
        $scope.pageHeading = 'Manage FAIR';
        $scope.myfairActive = 'active';
        
        $scope.fair_id= $routeParams.fair_id;
        
        
        $scope.getfaircategorylist=function(){
            
            var url = 'apiv4/public/fair/getfaircategorydata';
            var params = {parent_fair_category_id:0,type:usertype.getService()};
            RequestDetail.getDetail(url,params).then(function(result){
                $scope.faircategoryList = result.data
                
            });
        
        }
        
        $scope.getfaircategorylist();
        
        $scope.fairsubcategoryList = [];
        
        $scope.getfairsubcategorylist=function(){
            
            if($scope.parent_fair_category_id!=0){
                var url = 'apiv4/public/fair/getfaircategorydata';
                var params = {parent_fair_category_id:$scope.parent_fair_category_id,type:usertype.getService()};
                RequestDetail.getDetail(url,params).then(function(result)
                  {	
                      if(result.data){
                        $scope.fairsubcategoryList = result.data;
                    }else{
                        $scope.fairsubcategoryList = [];
                    }
                });
            }
        }
        
        
        
        
        $scope.view_showModal = false;
        
        $scope.addcategorypopupModal = function(){	
            $scope.view_showModal = !$scope.view_showModal;
        }
        
        
        
        
        $scope.actionbuttion = 'Edit Question';
        $scope.boheading= 'Edit Question';
        
        
        var url = 'apiv4/public/fair/getfaircorporateview';
        var params = {fair_id:$scope.fair_id};
        RequestDetail.getDetail(url,params).then(function(result)
          {
              
                $scope.question = result.data.question;
                $scope.answer = result.data.answer;
                $scope.tags = result.data.tags.toString();
                $scope.parent_fair_category_id = result.data.parent_fair_category_id;
                $scope.fair_category_id = result.data.subfair_category_id;
                
                $scope.status = result.data.status;
                $scope.year = result.data.year;
                
                $scope.date_added = result.data.date_added;
                $scope.answer_this = result.data.answer_this;
                $scope.asked_name = result.data.asked_name;
                
                $scope.user_id = result.data.user_id;
                $scope.edit_link = result.data.edit_link;
                $scope.fair_real_id = result.data.fair_real_id;
                
                $scope.getfairsubcategorylist($scope.parent_fair_category_id);
                
                if($scope.answer_this==1){
                    $scope.boheading = 'Answer Question <span class="question_by">Asked By <b>'+$scope.asked_name+'</b> '+$scope.date_added+'</span>';
                    $scope.actionbuttion = 'Answer Question';
                }
                
        });
        
        
        
        
        
        $scope.addfair = function(){	
        
            
            if(usertype.getService() == 'corporate'){
            
                if(angular.isUndefined($scope.question) ||$scope.question== ''){         
                    alertService.add("warning", "Question Invalid!",2000);
                    return false;
                } 
            
                if(angular.isUndefined($scope.answer) || $scope.answer== ''){         
                    alertService.add("warning", "Answer Invalid!",2000);
                    return false;
                } 
                
                /* LETS MAKE THE TAGS NOT MANDATORY
                if(angular.isUndefined($scope.tags) || $scope.tags== ''){         
                    alertService.add("warning", "Tags Invalid !",2000);
                    return false;
                } 
                */
                
                if(angular.isUndefined($scope.parent_fair_category_id) || $scope.parent_fair_category_id== '' || $scope.parent_fair_category_id== '0'){         
                    alertService.add("warning", "Category Invalid!",2000);
                    return false;
                } 
                
                if(angular.isUndefined($scope.status) || $scope.status== ''){         
                    alertService.add("warning", "Status Invalid!",2000);
                    return false;
                } 
                
                if(angular.isUndefined($scope.year) || $scope.year== ''){         
                    alertService.add("warning", "Year Invalid!",2000);
                    return false;
                } 
            
                
                var url = 'apiv4/public/fair/editcorporatefair';
                var params = {question:$scope.question,answer:$scope.answer,tags:$scope.tags,fair_category_id:$scope.parent_fair_category_id,subfair_category_id:$scope.fair_category_id,status:$scope.status,year:$scope.year,fair_id:$scope.fair_real_id};
            
                RequestDetail.getDetail(url,params).then(function(result){
                    alertService.add("success", "FAIR updated Successfully !",2000);
                    $location.path('fair');
                });
            }
    
        }
        
        
        
        
        
         $scope.savenewCategory=function(parent_fair_category_id,newcategory){
             
             var params = {parent_fair_category_id:parent_fair_category_id,categoryitem:newcategory};
            
            var url = 'apiv4/public/fair/faircategorysave';
            RequestDetail.getDetail(url,params).then(function(result){
                alertService.add("success", "Category added successfully !",2000);
                $scope.view_showModal = false;
                $scope.newcategory = "";
                $scope.getfaircategorylist();
                $scope.getfairsubcategorylist();
                $scope.fair_category_id = result.data.addedcategory_id;
            });
            
            
         }
        
    
    
    }).controller('fairexist', function($scope,$http,$location,$route,$routeParams,localStorageService,RequestDetail,$window,usertype) {
        $scope.pageHeading = 'Manage FAIR';
        $scope.myfairActive = 'active';
        
        $scope.fair_id= $routeParams.fair_id;
        
        var url = 'apiv4/public/fair/getfaircategorydata';
        var params = {};
        RequestDetail.getDetail(url,params).then(function(result){
            $scope.faircategoryList = result.data
        });
        
        
        
        $scope.actionbuttion = 'Edit Question';
        $scope.boheading= 'Edit Question';
        
        
        var url = 'apiv4/public/fair/getfaircorporateview';
        var params = {fair_id:$scope.fair_id};
        RequestDetail.getDetail(url,params).then(function(result)
          {
                $scope.question = result.data.question;
                $scope.answer = result.data.answer;
                $scope.tags = result.data.tags;
                $scope.fair_category_id = result.data.fair_category_id;
                $scope.status = result.data.status;
                $scope.year = result.data.year;
                
                $scope.date_added = result.data.date_added;
                $scope.answer_this = result.data.answer_this;
                
                $scope.fair_id_answer = result.data.fair_id_answer;
                
                $scope.asked_name = result.data.asked_name;
                
                $scope.fair_real_id = result.data.fair_real_id;
                
                if($scope.answer_this==1){
                    $scope.boheading = 'Answer Question <span class="question_by">Asked By <b>'+$scope.asked_name+'</b> '+$scope.date_added+'</span>';
                }
                
        });
        
        
        $scope.fair_category_id = '';
        $scope.status = '';
        $scope.fairList= [];
        $scope.fair_search_term = '';
        
        $scope.getfaircorporatelist = function(){
        
            var url = 'apiv4/public/fair/getfaircorporatelist';
            var params = {fair_category_id:$scope.fair_category_id,status:$scope.status,fair_search_term:$scope.fair_search_term,type:usertype.getService(),listtype:'exists'};
            RequestDetail.getDetail(url,params).then(function(result)
              {
                    $scope.fairList = result.data;
            });
        
        }
    
    
    
        $scope.addexistfair = function(fair_id_answer){
            
            var url = 'apiv4/public/fair/addexistfair';
            var params = {fair_id:$scope.fair_real_id,fair_id_answer:fair_id_answer,addtofair:0};
            RequestDetail.getDetail(url,params).then(function(result)
              {
                    $route.reload();
            });
            
        }
        
        $scope.addexisttofair = function(fair_id_answer){
            
            var url = 'apiv4/public/fair/addexistfair';
            var params = {fair_id:$scope.fair_real_id,fair_id_answer:fair_id_answer,addtofair:1};
            RequestDetail.getDetail(url,params).then(function(result)
              {
                    $route.reload();
            });
            
        }
    
        
        
        $scope.getfaircorporatelist();
        
        
        
        $scope.addfair = function(){	
            
            if(usertype.getService() == 'corporate'){
            
                if(angular.isUndefined($scope.question) ||$scope.question== ''){         
                    alertService.add("warning", "Question Invalid !",2000);
                    return false;
                } 
            
                if(angular.isUndefined($scope.answer) || $scope.answer== ''){         
                    alertService.add("warning", "Answer Invalid !",2000);
                    return false;
                } 
                
                /* LETS MAKE THE TAGS NOT MANDATORY
                if(angular.isUndefined($scope.tags) || $scope.tags== ''){         
                    alertService.add("warning", "Tags Invalid !",2000);
                    return false;
                }
                */
                
                if(angular.isUndefined($scope.fair_category_id) || $scope.fair_category_id== ''){         
                    alertService.add("warning", "Category Invalid !",2000);
                    return false;
                } 
                
                if(angular.isUndefined($scope.status) || $scope.status== ''){         
                    alertService.add("warning", "Status Invalid !",2000);
                    return false;
                } 
                
                if(angular.isUndefined($scope.year) || $scope.year== ''){         
                    alertService.add("warning", "Year Invalid !",2000);
                    return false;
                } 
              
            
            
                
                var url = 'apiv4/public/fair/editcorporatefair';
                var params = {question:$scope.question,answer:$scope.answer,tags:$scope.tags,fair_category_id:$scope.fair_category_id,status:$scope.status,year:$scope.year,fair_id:$scope.fair_real_id};
            
                RequestDetail.getDetail(url,params).then(function(result){
                    alertService.add("success", "FAIR added Successfully !",2000);
                    $location.path('fair');
                });
            }
    
        }
        
    
    
    }).controller('fairupload', function($scope,$http,$location,$route,$routeParams,localStorageService,RequestDetail,$window,usertype,alertService) {
        
        $scope.pageHeading = 'Manage FAIR';
        $scope.myfairActive = 'active';
        
        
        
        $scope.faircategoryList= [];
        
        
        var url = 'apiv4/public/fair/getfaircategorydata';
        var params = {type:usertype.getService()};
        RequestDetail.getDetail(url,params).then(function(result)
          {
            $scope.faircategoryList = result.data
        });
        
        $scope.fair_category_id = '';
        $scope.status = '';
        $scope.fairList= [];
        
        $scope.fair_search_term = '';
        
        /*$scope.getfaircorporatelist = function(){
        
            var url = 'apiv4/public/fair/getfaircorporatelist';
            var params = {fair_category_id:$scope.fair_category_id,status:$scope.status,fair_search_term:$scope.fair_search_term,type:usertype.getService(),listtype:'all'};
            RequestDetail.getDetail(url,params).then(function(result)
              {
                    
                    
                    $scope.fairList = [];
                    $scope.tags = '';
                    angular.forEach(result.data.list,function(itm,index){
                        
                        $scope.tags = itm.tags.toString();
                        
                           var newArray = {
                              fair_id: itm.fair_id,
                              question: itm.question,
                              answer: itm.answer,
                              tags : $scope.tags,
                              fair_category_id: itm.fair_category_id,
                              status: itm.status,
                              year: itm.year,
                            };
                            $scope.fairList.push(newArray);
                    });
            });
        
        }
        
        $scope.getfaircorporatelist();
        */
        
        
        
        
        
        $scope.fairList = [];
        
        $scope.replacefair = 0;
        
        $scope.addfair = function(){
            
            angular.forEach($scope.fairList,function(fitem,index){
                if(angular.isUndefined(fitem.question) || fitem.question== ''){         
                    alertService.add("warning", "Question Invalid !",2000);
                    return false;
                } 
                if(angular.isUndefined(fitem.answer) || fitem.answer== ''){         
                    alertService.add("warning", "Answer Invalid !",2000);
                    return false;
                } 
                
                /* LETS MAKE THE TAGS NOT MANDATORY
                if(angular.isUndefined(fitem.tags) || fitem.tags== ''){         
                    alertService.add("warning", "Tags Invalid !",2000);
                    return false;
                }
                */
                
                if(angular.isUndefined(fitem.fair_category_id) || fitem.fair_category_id== ''){         
                    alertService.add("warning", "Category Invalid !",2000);
                    return false;
                } 
                
            });
            
            
                var url = 'apiv4/public/fair/addfairupload';
                var params = {data:$scope.fairList,replacefair:$scope.replacefair};
            
                RequestDetail.getDetail(url,params).then(function(result){
                    alertService.add("success", "FAIR added Successfully !",2000);
                    $scope.fairList = [];
                    $location.path('fair');
                });
        
        }
        
        
        $scope.fileuploadmodeldataadd = function(excelfile){
             if (confirm("Uploading FAIR! Are you sure to continue?")) {
                $scope.loadingshow =1;
                $scope.spinnerActive = true;
                var params = {
                    filepath : excelfile,
                  };
                var uploadDataUrl = 'apiv4/public/fair/uploadfairDataadd';
                RequestDetail.getDetail(uploadDataUrl,params).then(function(result){
                    
                      $scope.fairList = result.data;
                });
                
             }
        }
        
        $scope.fileuploadmodeldatareplace = function(excelfile){
             if (confirm("This Operation will replace everything! Are you sure to continue?")) {
                $scope.loadingshow =1;
                $scope.spinnerActive = true;
                var params = {
                    filepath : excelfile,
                  };
                var uploadDataUrl = 'apiv4/public/fair/uploadfairDataadd';
                RequestDetail.getDetail(uploadDataUrl,params).then(function(result){
                    
                      $scope.fairList = result.data;
                    $scope.replacefair = 1;
                });
                
             }
        }
        
    
    
    }).controller('fairapisetting', function($scope,$http,$location,$route,$routeParams,localStorageService,RequestDetail,$window,usertype,alertService) {
        
        $scope.pageHeading = 'Manage FAIR';
        $scope.myfairActive = 'active';
        $scope.fairapisetting = 'inner-active';
    
    
        $scope.getapikey = function(){	
            var Url = 'apiv4/public/fair/getapikey';
            var params = {};
            RequestDetail.getDetail(Url,params).then(function(result){
                
                $scope.apisetting = result.data;
                
            });
        }
    
        $scope.getapikey();
            
        $scope.regeneratekey = function(){
            var Url = 'apiv4/public/fair/generateapikey';
            var params = {};
            RequestDetail.getDetail(Url,params).then(function(result){
                
                $scope.apisetting.fair_api_key = result.data.fair_api_key;
            });
        }
            
        $scope.apisubmit = function(){
            var Url = 'apiv4/public/fair/addtofairapi';
            var params = {settings:$scope.apisetting};
            RequestDetail.getDetail(Url,params).then(function(result){
                if(result.data.res=='success'){
                    $scope.getapikey();
                    alertService.add("success", "Updated Successfully !",2000);
                    return false;
                }else{
                    alertService.add("warning", "Invalid domain name!",2000);
                    return false;
                }
            });
            
        }
        
    
    }).controller('SummernoteController', ['$scope', '$attrs', '$timeout', function($scope, $attrs, $timeout) {
        'use strict';
    
        var currentElement,
            summernoteConfig = angular.copy($scope.summernoteConfig) || {};
    
        if (angular.isDefined($attrs.height)) { summernoteConfig.height = +$attrs.height; }
        if (angular.isDefined($attrs.minHeight)) { summernoteConfig.minHeight = +$attrs.minHeight; }
        if (angular.isDefined($attrs.maxHeight)) { summernoteConfig.maxHeight = +$attrs.maxHeight; }
        if (angular.isDefined($attrs.placeholder)) { summernoteConfig.placeholder = $attrs.placeholder; }
        if (angular.isDefined($attrs.focus)) { summernoteConfig.focus = true; }
        if (angular.isDefined($attrs.airmode)) { summernoteConfig.airMode = true; }
        if (angular.isDefined($attrs.dialogsinbody)) { summernoteConfig.dialogsInBody = true; }
        if (angular.isDefined($attrs.lang)) {
          if (!angular.isDefined($.summernote.lang[$attrs.lang])) {
            throw new Error('"' + $attrs.lang + '" lang file must be exist.');
          }
          summernoteConfig.lang = $attrs.lang;
        }
    
        summernoteConfig.callbacks = summernoteConfig.callbacks || {};
    
        if (angular.isDefined($attrs.onInit)) {
          summernoteConfig.callbacks.onInit = function(evt) {
            $scope.init({evt:evt});
          };
        }
        if (angular.isDefined($attrs.onEnter)) {
          summernoteConfig.callbacks.onEnter = function(evt) {
            $scope.enter({evt:evt});
          };
        }
        if (angular.isDefined($attrs.onFocus)) {
          summernoteConfig.callbacks.onFocus = function(evt) {
            $scope.focus({evt:evt});
          };
        }
        if (angular.isDefined($attrs.onPaste)) {
          summernoteConfig.callbacks.onPaste = function(evt) {
            $scope.paste({evt:evt});
          };
        }
        if (angular.isDefined($attrs.onKeyup)) {
          summernoteConfig.callbacks.onKeyup = function(evt) {
            $scope.keyup({evt:evt});
          };
        }
        if (angular.isDefined($attrs.onKeydown)) {
          summernoteConfig.callbacks.onKeydown = function(evt) {
            $scope.keydown({evt:evt});
          };
        }
        if (angular.isDefined($attrs.onImageUpload)) {
          summernoteConfig.callbacks.onImageUpload = function(files) {
            $scope.imageUpload({files:files, editable: $scope.editable});
          };
        }
        if (angular.isDefined($attrs.onMediaDelete)) {
          summernoteConfig.callbacks.onMediaDelete = function(target) {
            // make new object that has information of target to avoid error:isecdom
            var removedMedia = {attrs: {}};
            removedMedia.tagName = target[0].tagName;
            angular.forEach(target[0].attributes, function(attr) {
              removedMedia.attrs[attr.name] = attr.value;
            });
            $scope.mediaDelete({target: removedMedia});
          };
        }
    
        this.activate = function(scope, element, ngModel) {
          var updateNgModel = function() {
            var newValue = element.summernote('code');
            if (element.summernote('isEmpty')) { newValue = ''; }
            if (ngModel && ngModel.$viewValue !== newValue) {
              $timeout(function() {
                ngModel.$setViewValue(newValue);
              }, 0);
            }
          };
    
          var originalOnChange = summernoteConfig.callbacks.onChange;
          summernoteConfig.callbacks.onChange = function (contents) {
            $timeout(function () {
              if (element.summernote('isEmpty')) {
                contents = '';
              }
              updateNgModel();
            }, 0);
            if (angular.isDefined($attrs.onChange)) {
              $scope.change({contents: contents, editable: $scope.editable});
            } else if (angular.isFunction(originalOnChange)) {
              originalOnChange.apply(this, arguments);
            }
          };
          if (angular.isDefined($attrs.onBlur)) {
            summernoteConfig.callbacks.onBlur = function (evt) {
              (!summernoteConfig.airMode) && element.blur();
              $scope.blur({evt: evt});
            };
          }
          element.summernote(summernoteConfig);
    
          var editor$ = element.next('.note-editor'),
              unwatchNgModel;
          editor$.find('.note-toolbar').click(function() {
            updateNgModel();
    
            // sync ngModel in codeview mode
            if (editor$.hasClass('codeview')) {
              editor$.on('keyup', updateNgModel);
              if (ngModel) {
                unwatchNgModel = scope.$watch(function () {
                  return ngModel.$modelValue;
                }, function(newValue) {
                  editor$.find('.note-codable').val(newValue);
                });
              }
            } else {
              editor$.off('keyup', updateNgModel);
              if (angular.isFunction(unwatchNgModel)) {
                unwatchNgModel();
              }
            }
          });
    
          if (ngModel) {
            ngModel.$render = function() {
              if (ngModel.$viewValue) {
                element.summernote('code', ngModel.$viewValue);
              } else {
                element.summernote('empty');
              }
            };
          }
    
          // set editable to avoid error:isecdom since Angular v1.3
          if (angular.isDefined($attrs.editable)) {
            $scope.editable = editor$.find('.note-editable');
          }
          if (angular.isDefined($attrs.editor)) {
            $scope.editor = element;
          }
    
          currentElement = element;
          // use jquery Event binding instead $on('$destroy') to preserve options data of DOM
          element.on('$destroy', function() {
            element.summernote('destroy');
            $scope.summernoteDestroyed = true;
          });
        };
    
        $scope.$on('$destroy', function () {
          // when destroying scope directly
          if (!$scope.summernoteDestroyed) {
            currentElement.summernote('destroy');
          }
        });
    }])
    .controller('fairanalytics', function($scope,$http,$location,$route,$routeParams,localStorageService,RequestDetail,$window,usertype,alertService,$timeout) {
        $scope.pageHeading = 'Manage FAIR';
        $scope.myfairActive = 'active';
        $scope.fairanalyticsActive = 'inner-active';
        
        
        
        $scope.showModalpageinfo=false;
      
    $scope.openmodelpagehelp = function() {
       $scope.showModalpageinfo=!$scope.showModalpageinfo;
    }
        
        
    if(usertype.getService() == 'corporate'){	
    
        
        $scope.review_viewer = "";
        $scope.review_relativity = "";
        $scope.review_venue = "";
        
    
        $scope.labels_review = [];
        $scope.data_review = [];
        
        $scope.getanalyticsreview = function () {
        
            var Url = 'apiv4/public/fair/getanalyticsreview';
            var params = {review_viewer:$scope.review_viewer,review_relativity:$scope.review_relativity,review_venue:$scope.review_venue};
            RequestDetail.getDetail(Url,params).then(function(result){
                $scope.labels_review = result.data.typelist;
                $scope.data_review = result.data.typecount;
            });
        
        }
        
        $scope.getanalyticsreview();
    
        
        $scope.colors_review = [
          {
            fill: false,
            pointBackgroundColor: 'rgba(13,114,184, 1)',
            pointHoverBackgroundColor: 'rgba(13,114,184, 1)',
            borderColor: 'rgba(13,114,184, 1)',
            pointBorderColor: 'rgba(13,114,184, 1)',
            pointHoverBorderColor: 'rgba(13,114,184, 1)'
          },
          
        ];
        
        $scope.options_review = { 
            legend: { display: false },
            scales: {
                  xAxes: [{
                      stacked: true
                  }],
                  yAxes: [{
                      stacked: true
                  }]
              },
              
             title: {
                  display: true,
                  text: 'Review Frequency',
                  fontSize: 15,
              },
        };
    
        
          
          
        $scope.labels_transparency = ['Answered', 'Pending', 'Unanswered', 'Removed'];
        $scope.data_transparency = [];
        
        var Url = 'apiv4/public/fair/getanalyticstransparency';
        var params = {};
        RequestDetail.getDetail(Url,params).then(function(result){
            $scope.data_transparency = result.data;
        });
        
        $scope.colors_transparency = [
          {
            backgroundColor: 'rgba(13,114,184, 1)',
            pointBackgroundColor: 'rgba(13,114,184, 1)',
            pointHoverBackgroundColor: 'rgba(13,114,184, 1)',
            borderColor: 'rgba(13,114,184, 1)',
            pointBorderColor: 'rgba(13,114,184, 1)',
            pointHoverBorderColor: 'rgba(13,114,184, 1)'
          },
          
        ];
        $scope.options_transparency = { 
            legend: { display: false },
            scales: {
                  xAxes: [{
                      stacked: true
                  }],
                  yAxes: [{
                      stacked: true
                  }]
              },
              
             title: {
                  display: true,
                  text: 'Transparency',
                  fontSize: 15,
              },
        };
    
        
        
        
        $scope.labels_postage = ['<30 Days', '30-90 Days', '3-12 Months', '> 1 Year'];
        $scope.data_postage = [];
        
        var Url = 'apiv4/public/fair/getanalyticspostage';
        var params = {};
        RequestDetail.getDetail(Url,params).then(function(result){
            $scope.data_postage = result.data;
        });
        
        $scope.colors_postage = [
          {
            backgroundColor: 'rgba(13,114,184, 1)',
            pointBackgroundColor: 'rgba(13,114,184, 1)',
            pointHoverBackgroundColor: 'rgba(13,114,184, 1)',
            borderColor: 'rgba(13,114,184, 1)',
            pointBorderColor: 'rgba(13,114,184, 1)',
            pointHoverBorderColor: 'rgba(13,114,184, 1)'
          },
          
        ];
        $scope.options_postage = { 
            legend: { display: false },
            scales: {
                  xAxes: [{
                      stacked: true
                  }],
                  yAxes: [{
                      stacked: true
                  }]
              },
              
             title: {
                  display: true,
                  text: 'Age of FAIR Post',
                  fontSize: 15,
              },
        };
        
        $scope.onClick_postage = function (points, evt) {
            localStorageService.set('postage',points[0]._model.label);
            $timeout(function() {
                  $location.path('/fair/analyticsdetail');
                }, 10); 
            
        };
        
        
          
        $scope.labels_postlong = ['Event Specific', 'Quarterly', 'Annual', 'Long-term'];
        $scope.data_postlong = [
          [65, 59, 80, 81],
        ];
        $scope.colors_postlong = [
          {
            backgroundColor: 'rgba(13,114,184, 1)',
            pointBackgroundColor: 'rgba(13,114,184, 1)',
            pointHoverBackgroundColor: 'rgba(13,114,184, 1)',
            borderColor: 'rgba(13,114,184, 1)',
            pointBorderColor: 'rgba(13,114,184, 1)',
            pointHoverBorderColor: 'rgba(13,114,184, 1)'
          },
          
        ];
        $scope.options_postlong = { 
            legend: { display: false },
            scales: {
                  xAxes: [{
                      stacked: true
                  }],
                  yAxes: [{
                      stacked: true
                  }]
              },
              
             title: {
                  display: true,
                  text: 'Post Longevity',
                  fontSize: 15,
              },
        };
        
        
        
    
        
        $scope.labels_questiontype = [];
        $scope.data_questiontype = [];
        
        var Url = 'apiv4/public/fair/getanalyticsdata';
        var params = {};
        RequestDetail.getDetail(Url,params).then(function(result){
            $scope.labels_questiontype = result.data.question_type.typelist;
            $scope.data_questiontype = result.data.question_type.typecount;
            
            $scope.labels_question_sentiment = result.data.question_sentiment.typelist;
            $scope.data_question_sentiment = result.data.question_sentiment.typecount;
            
            $scope.labels_question_source = result.data.question_source.typelist;
            $scope.data_question_source = result.data.question_source.typecount;
            
    
        });
        
        $scope.colors_questiontype = [
          {
            backgroundColor: 'rgba(13,114,184, 1)',
            pointBackgroundColor: 'rgba(13,114,184, 1)',
            pointHoverBackgroundColor: 'rgba(13,114,184, 1)',
            borderColor: 'rgba(13,114,184, 1)',
            pointBorderColor: 'rgba(13,114,184, 1)',
            pointHoverBorderColor: 'rgba(13,114,184, 1)'
          },
          
        ];
        $scope.options_questiontype = { 
            legend: { display: false },
            scales: {
                  xAxes: [{
                      stacked: true
                  }],
                  yAxes: [{
                      stacked: true
                  }]
              },
              
             title: {
                  display: true,
                  text: 'Question Type',
                  fontSize: 15,
              },
        };
        
        $scope.onClickquestiontype = function (points, evt) {
            
            var Url = 'apiv4/public/fair/getcatid';
            var params = {name:points[0]._model.label};
            RequestDetail.getDetail(Url,params).then(function(result){
                localStorageService.set('questiontype',result.data.fair_category_id);
                 $timeout(function() {
                  $location.path('/fair/analyticsdetail');
                }, 10); 
        
            });
    
        };
        
        
         $scope.options_question_sentiment = { 
            legend: { display: false },
            scales: {
                  xAxes: [{
                      stacked: true
                  }],
                  yAxes: [{
                      stacked: true
                  }]
              },
              
             title: {
                  display: true,
                  text: 'Question Sentiment',
                  fontSize: 15,
              },
        };
        
        
        
        
        
        $scope.onClickquestion_sentiment = function (points, evt) {
            localStorageService.set('sentiment',points[0]._model.label);
            $timeout(function() {
              $location.path('/fair/analyticsdetail');
            }, 10);
        };
        
        
        
    
        
        
         $scope.options_question_source = { 
            legend: { display: false },
            scales: {
                  xAxes: [{
                      stacked: true
                  }],
                  yAxes: [{
                      stacked: true
                  }]
              },
              
             title: {
                  display: true,
                  text: 'Question Source',
                  fontSize: 15,
              },
        };
        
        $scope.onClickquestionsourcechange = function () {
            $scope.labels_question_source = ['Owners', 'Non Owners'];
            $scope.data_question_source = [
                      [65, 59],
            ];
                        
                
    
                
                $scope.options_question_source = { 
                    legend: { display: false },
                    scales: {
                          xAxes: [{
                              stacked: true
                          }],
                          yAxes: [{
                              stacked: true
                          }]
                      },
                      
                     title: {
                          display: true,
                          text: 'Investor Type',
                          fontSize: 20,
                      },
                };
        }
        
        $scope.onClickquestionsource = function (points, evt) {
    
            
            if(points[0]._model.label=='Owners' || points[0]._model.label=='Non Owners'){
                $timeout(function() {
                  $location.path('/fair/analyticsdetail');
                }, 10);
            }
            else{
                localStorageService.set('questionsource',points[0]._model.label);
              }
        
        };
        
        
    }
        
        if(usertype.getService() == 'investor'){
        
        
        $scope.labels_investorquestion = [];
        $scope.data_investorquestion = [];
        
        var Url = 'apiv4/public/fair/getinvestoranalyticsdata';
        var params = {};
        RequestDetail.getDetail(Url,params).then(function(result){
            
            $scope.labels_investorquestion = result.data.typelist;
            $scope.data_investorquestion = result.data.typecount;
    
        });
        
        $scope.colors_investorquestion = [
          {
            
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointHoverBackgroundColor: 'rgba(148,159,177,1)',
            borderColor: 'rgba(13,114,184, 1)',
            fill: false,
            pointBorderColor: 'rgba(13,114,184, 1)',
            pointHoverBorderColor: 'rgba(13,114,184, 1)'
          },
          
        ];
        $scope.options_investorquestion = { 
            legend: { display: false },
            scales: {
                  xAxes: [{
                      stacked: true
                  }],
                  yAxes: [{
                      stacked: true
                  }]
              },
              
             title: {
                  display: false,
                  text: 'Question Type',
                  fontSize: 15,
              },
        };
        
        
        
        $scope.labels_investorquestionasked = [];
        $scope.data_investorquestionasked = [];
        
        var Url = 'apiv4/public/fair/getinvestoranalyticsdata';
        var params = {};
        RequestDetail.getDetail(Url,params).then(function(result){
            
            $scope.labels_investorquestionasked = result.data.question.typelist;
            $scope.data_investorquestionasked = result.data.question.typecount;
    
        });
        
        $scope.colors_investorquestionasked = [
          {
            backgroundColor: 'rgba(13,114,184, 1)',
            borderColor: 'rgba(13,114,184,1)',
          },
          {
            backgroundColor: 'rgba(41,168,224, 1)',
            borderColor: 'rgba(41,168,224,1)',
          },
          
        ];
        $scope.options_investorquestionasked = { 
            legend: { display: false },
            scales: {
                  xAxes: [{
                      stacked: true
                  }],
                  yAxes: [{
                      stacked: true
                  }]
              },
              
             title: {
                  display: false,
                  text: 'Question Type',
                  fontSize: 15,
              },
        };
          
        }
         
    }).controller('analyticsdetail', function($scope,$http,$location,$route,$routeParams,localStorageService,RequestDetail,$window,usertype,alertService) {
        $scope.pageHeading = 'Manage FAIR';
        $scope.myfairActive = 'active';
        
        $scope.faircategoryList= [];
        
        var url = 'apiv4/public/fair/getfaircategorydata';
        var params = {type:usertype.getService()};
        RequestDetail.getDetail(url,params).then(function(result)
          {
            $scope.faircategoryList = result.data
        });
        
        $scope.fairsubcategoryList= [];
        
        var url = 'apiv4/public/fair/getfairsubcategorydata';
        var params = {type:usertype.getService()};
        RequestDetail.getDetail(url,params).then(function(result)
          {
            $scope.fairsubcategoryList = result.data
        });
        
        
        $scope.sentiment = "";
        $scope.venue = "";
        $scope.dateFrom = "";
        $scope.dateTo = "";
        $scope.fair_category_id = "";
        $scope.sub_category = "";
        $scope.ownership = "";
        $scope.usertype = "";
        
        var filter_sentiment=localStorageService.get('sentiment');
    
        
        if(filter_sentiment!='' && filter_sentiment!=null && filter_sentiment!='null'){
            
            $scope.sentiment = "1";
            
            if(filter_sentiment=='Negative'){
                $scope.sentiment = "0";
            }
    
        }
        
        
        var filter_questiontype=localStorageService.get('questiontype');
        
        if(filter_questiontype!='' && filter_questiontype!=null && filter_questiontype!='null'){
            
            $scope.fair_category_id = filter_questiontype;
        }
        
        var filter_questionsource=localStorageService.get('questionsource');
        if(filter_questionsource!='' && filter_questionsource!=null && filter_questionsource!='null'){
            
            $scope.sub_category = filter_questionsource;
        }
        
        
        $scope.today = moment().format('DD-MMMM-YYYY');
        $scope.onemonth = moment($scope.today).subtract(1, 'M').format('DD-MMMM-YYYY');
        $scope.threemonth = moment($scope.today).subtract(3, 'M').format('DD-MMMM-YYYY');
        $scope.oneyear = moment($scope.today).subtract(12, 'M').format('DD-MMMM-YYYY');
        
        var filter_postage=localStorageService.get('postage');
        
    
        
        if(filter_postage!='' && filter_postage!=null && filter_postage!='null'){
            
            if(filter_postage=='<30 Days'){
                $scope.dateFrom =  $scope.onemonth;
                $scope.dateTo = $scope.today;
            }
            else if(filter_postage=='30-90 Days'){
                $scope.dateFrom = $scope.threemonth;
                $scope.dateTo = $scope.onemonth;
    
                
            }
            else if(filter_postage=='3-12 Months'){
                $scope.dateFrom = $scope.oneyearh;
                $scope.dateTo = $scope.threemont;
            }
            else{
                $scope.dateFrom = "";
                $scope.dateTo =$scope.oneyear;
            }
            
        }
        
        
        
        
        
        $scope.analyticsdetail = [];
        
        $scope.getanalyticsdetail = function(index){
            
            var Url = 'apiv4/public/fair/getanalyticsdetail';
            var params = {sentiment:$scope.sentiment,venue:$scope.venue,dateFrom:$scope.dateFrom,dateTo:$scope.dateTo,fair_category_id:$scope.fair_category_id,sub_category:$scope.sub_category,ownership:$scope.ownership,usertype:$scope.usertype};
            RequestDetail.getDetail(Url,params).then(function(result){
                $scope.analyticsdetail = result.data;
            });
        }
        
        $scope.getanalyticsdetail();
        
    
        localStorageService.remove('sentiment');
        localStorageService.remove('questiontype');
        localStorageService.remove('questionsource');
        localStorageService.remove('postage');
        
        
        
        
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
            startingDay: 1,showButtonPanel: false
          };
            
        $scope.open1 = function() {
          $scope.popup1.opened = true;
        };	
        
        // Disable weekend selection
      function disabled(data) {
        var date = data.date,
        mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6); /* Disable weak days */
      }
    
    
        $scope.open1 = function() {
          $scope.popup1.opened = true;
        };
    
        $scope.open2 = function() {
          $scope.popup2.opened = true;
        };
    
        $scope.setDate = function(year, month, day) {
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
            var dayToCheck = new Date(date).setHours(0,0,0,0);
    
            for (var i = 0; i < $scope.events.length; i++) {
              var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);
    
              if (dayToCheck === currentDay) {
                return $scope.events[i].status;
              }
            }
          }
    
          return '';
        }
        
        $scope.clickToOpen = function(index){
            $scope.view_showModal= $scope.classes[index];
            ngDialog.open({template: 'ext.html'});
        };
        
        
    })
    .controller('fairlist', function($scope,$http,$location,$route,$routeParams,localStorageService,RequestDetail,$window,usertype,alertService) {
    
        $scope.activetab = 0;
        $scope.tab = 1;
    
        $scope.changetab = function(index){
            $scope.activetab = index;
        }
        
        if($routeParams.type=='notification'){
            $scope.showModal = true;
        }
    
        if($routeParams.type=='askquestion'){
            $scope.showModalquestion = true;
        }
    
        $scope.question = {};
    
        $scope.useremail = '';
        $scope.usercomapny = '';
    
        if($routeParams.email){
            if($routeParams.email!='youremail'){
                $scope.email = $routeParams.email;
                $scope.question.email = $routeParams.email;
            }
        }
    
        if($routeParams.company){
            if($routeParams.company!='yourcompany'){
                $scope.company = $routeParams.company;
                $scope.question.company = $routeParams.company;
            }
        }
    
        $scope.userId = $routeParams.userId;
        
    
        $scope.company_detail = [];
    
        // Fetching Profile
        var getCorporate = 'apiv4/public/fair/getCorporateprofile';
        var params = { user_id: $routeParams.userId,static:1 }
        RequestDetail.getDetail(getCorporate, params).then(function (result) {
            $scope.company_detail = result.data;
        });
    
    
        $scope.tabchange = function(index){
            $scope.tab = index;
        }
    
        $scope.faircategoryList= [];
        
        var url = 'apiv4/public/fair/getfaircategorydata';
        var params = {type:'corporate',user_id: $routeParams.userId,static:1};
        RequestDetail.getDetail(url,params).then(function(result)
          {
            $scope.faircategoryList = result.data
        });
    
        //fair_category_id:$scope.fair_category_id,status:$scope.status,fair_search_term:$scope.fair_search_term,type:usertype.getService(),listtype:'exists'
    
        $scope.fairList = [];
    
    
        $scope.changecategory = function(){
            var url = 'apiv4/public/fair/getfaircorporatelist';
            var params = {fair_category_id:$scope.fair_category_id,user_id: $routeParams.userId,static:1,type:'corporate',fair_search_term:'',status:1};
            RequestDetail.getDetail(url,params).then(function(result){
                $scope.fairs = result.data;
            });
        }
        
        $scope.changecategory();
    
        // Fetching FAIR
        var getFair = 'apiv4/public/fair/getCorporatefair';
        var params = { user_id: $routeParams.userId,static:1 }
        RequestDetail.getDetail(getFair, params).then(function (result) {
            $scope.fairList = result.data;
        });
    
        $scope.addnotification = function(){
    
            if(!$scope.checkemailval($scope.email)){
                alertService.add("warning", "Please Enter Valid Email !", 2000);
                return false;
           }
            var url = 'apiv4/public/fair/addfairnotification';
            var params = {user_id: $routeParams.userId,static:1,email:$scope.email};
            RequestDetail.getDetail(url,params).then(function(result){
                $scope.showModal = false;
                alertService.add("success", "Added Successfully !", 2000);
            });
        }
    
        
    
        $scope.addfair = function(){
    
            if(!$scope.checkemailval($scope.question.email)){
                alertService.add("warning", "Please Enter Valid Email !", 2000);
                return false;
            }
            if($scope.question.company==''){
                alertService.add("warning", "Please Enter Company Name !", 2000);
                return false;
            }
            if (angular.isUndefined($scope.question.question) || $scope.question.question == '') {
                alertService.add("warning", "Please Enter Question!", 2000);
                return false;
            }
            var url = 'apiv4/public/fair/addfairstatic';
            var params = {user_id: $routeParams.userId,static:1,email:$scope.email,company:$scope.company,data:$scope.question};
            RequestDetail.getDetail(url,params).then(function(result){
                $scope.question.question = '';
                alertService.add("success", "Added Successfully !", 2000);
                $scope.showModalquestion = false;
            });
        }
    
        $scope.checkemailval = function (email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }
    
    })
    .controller('crmModule', function($scope,$http,$location,$route,$routeParams,localStorageService,RequestDetail,$window,usertype) {
	
	
        var moduleName= $routeParams.module_name;
        var crm_module = '';
        var CRM_sessId = '';
        $scope.spinnerActive = true;
        
        switch (moduleName) {
          case 'meetings':
            crm_module = 'Meetings';
            break;
            
          case 'manage_events':
            crm_module = 'FP_events';
            break;
    
          case 'create_event':
            crm_module = 'FP_events&action=EditView';
            break;
    
          case 'notes_followup':
            crm_module = 'Notes';
            break;
    
          case 'investor_notes':
            crm_module = 'prepare';
            break;
    
          case 'distribution_list':
            crm_module = 'ProspectLists';
            break;
    
          case 'campaign':
            crm_module = 'Campaigns';
            break;
    
          default:
            crm_module = '';
            break;
        }	
        
        var url = 'apiv4/public/user/getCRMSessionID';
        var params = {};
        RequestDetail.getDetail(url,params).then(function(result){
            var CRM_sessId = result.data.CRM_sessId;
            ////console.log("CRM_sessId = " + CRM_sessId);
            if(crm_module && CRM_sessId){
                
                $scope.crm_url = 'http://democrm.intro-act.com:8093/crm/';
                
                if(window.location.host == 'www.intro-act.com'){
                $scope.crm_url = 'http://crm.intro-act.com/';
                }
            
                $window.location.href = $scope.crm_url+'index.php?MSID=' + CRM_sessId + '&module=' + crm_module;
            }
            else{
                $window.location.href= "#/dashboard";
            }
        });
        
    })

    .controller('upderConstructionCtrl', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails) {
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

		if ($scope.fairpagetype != "" && !angular.isUndefined($scope.fairpagetype)) {
			$scope.activetab = 1;
		}


		var GetInvestorsListUrl = 'apiv4/public/researchprovider/getCustomers';
		var params = {};

		RequestDetail.getDetail(GetInvestorsListUrl, params).then(function (result) {
			$scope.results = result.data;
		});

	})

	.controller('contentPerformanceCtrl', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails) {
		$scope.configdetails = configdetails;
		$scope.openmodelpagehelp = function () {
			$scope.showModalpageinfo = !$scope.showModalpageinfo;
		}
		$scope.sidepopupactive = false;

		$scope.sidepopup = function () {
			$scope.sidepopupactive = !$scope.sidepopupactive;
		}

		
		$scope.update_report = function () {

			var GetInvestorsListUrl = 'apiv4/public/researchprovider/getcontentreports';
			var params = {
				analysts: $scope.analysts,viewed_user_id:$scope.viewed_user_id
			};

			

			RequestDetail.getDetail(GetInvestorsListUrl, params).then(function (result) {

				

				$scope.data_graph8 = [];
			    $scope.labels_graph8 = [];
				$scope.labels_graph5 = [];
				
				$scope.data_graph5 = [];
				$scope.data_graph6 = [];
				$scope.data_graph7 = [];


				$scope.check_admin = result.data.check_admin;
				$scope.cmyusers = result.data.cmyusers;

				

				//year
				angular.forEach(result.data.result_activity_bid_views, function (con, ind) {
					$scope.labels_graph8.push(con.period);
					$scope.labels_graph5.push(con.period);
				});
				//year


				var total = [];
					angular.forEach(result.data.result_activity_events, function (con, ind) {
						total.push(con.count)
					});
					
					$scope.data_graph8.push(total);
				
					var total = [];
					angular.forEach(result.data.result_activity_profile_views, function (con, ind) {
						total.push(con.count)
					});
					$scope.data_graph8.push(total);
				
					
					var total = [];
					angular.forEach(result.data.result_activity_dashboards_views, function (con, ind) {
						total.push(con.count)
					});
					$scope.data_graph8.push(total);

				
					
					var total = [];
					angular.forEach(result.data.result_activity_idea_views, function (con, ind) {
						total.push(con.count)
					});
					$scope.data_graph8.push(total);

				
					
					var total = [];
					angular.forEach(result.data.result_activity_proposal_views, function (con, ind) {
						total.push(con.count)
					});
					$scope.data_graph8.push(total);

				
					var total = [];
					angular.forEach(result.data.result_activity_bid_views, function (con, ind) {
						total.push(con.count)
					});
					$scope.data_graph8.push(total);

					var created_array_event = [];
					var created_array_idea = [];
					var created_array_proposal = [];
					var created_array_bids = [];
					var created_array_distributecontent = [];
					angular.forEach(result.data.result_created, function (con, ind) {
						created_array_event.push(con.event_count);
						created_array_idea.push(con.idea_count);
						created_array_proposal.push(con.proposal_count);
						created_array_bids.push(con.bids);
						created_array_distributecontent.push(con.distribute_content);
					});

					$scope.data_graph5.push(created_array_event);
					$scope.data_graph5.push(created_array_idea);
					$scope.data_graph5.push(created_array_proposal);
					$scope.data_graph5.push(created_array_bids);
					$scope.data_graph5.push(created_array_distributecontent);

				/*	$scope.data_graph5 = [
			['10', '20', '30', '40', '50','60'],
			['90', '20', '30', '80', '50','60'],
			['10', '40', '30', '40', '50','60'],
			['10', '20', '40', '40', '50','60'],
			['80', '20', '30', '40', '50','60'],
		];*/

				$scope.data_graph6 = result.data.result_platform_compare;
				
				$scope.data_graph7 = result.data.result_view_customers;

				$scope.customers = result.data.customers;
				
			});

			
		
		}


		$scope.update_report();



		$scope.colors_graph8 = ['#0F74BA', '#29A8E0', '#0f14ba', '#4bea49', '#e0ea49', '#e0ea93'];
		//series graph 8
		$scope.series_graph8 = ['Events', 'Profile Views', 'Subscription Requests', 'Ideas', 'Proposals', 'Bids'];
		
		//series graph 8
		//$scope.labels_graph8 = ['Oct2018', 'Sep2018', 'Aug2018', 'July2018', 'June2018'];
		
		/*$scope.data_graph8 = [
			['10', '20', '30', '40', '50'],
			['30', '60', '60', '20', '10'],
			['30', '60', '45', '20', '10'],
			['30', '60', '90', '20', '10'],
			['30', '56', '30', '20', '10'],
			['30', '60', '80', '20', '10'],

		];*/

		$scope.options_graph8 = {
			legend: {
				display: true
			},
			scales: {
				xAxes: [{
					stacked: false
				}],
				yAxes: [{
					stacked: false, ticks: {min: 0,callback: function (value) { if (Number.isInteger(value)) { return value; } }}
				}]
			},

			title: {
				display: true,
				text: 'Views Frequency',
				fontSize: 15,
			},
		};



		$scope.colors_graph5 = ['#0F74BA', '#4bea49', '#e0ea49', '#e0ea93', '#29A8E0'];
		$scope.series_graph5 = ['Events', 'Ideas', 'Proposals', 'Bids', 'Distributed Content'];
		$scope.labels_graph5 = ['Oct2018', 'Sep2018', 'Aug2018', 'July2018', 'June2018'];
		
	/*	$scope.data_graph5 = [
			['10', '20', '30', '40', '50','60'],
			['90', '20', '30', '80', '50','60'],
			['10', '40', '30', '40', '50','60'],
			['10', '20', '40', '40', '50','60'],
			['80', '20', '30', '40', '50','60'],
		];*/

		$scope.options_graph5 = {
			legend: {
				display: true
			},
			scales: {
				xAxes: [{
					stacked: false
				}],
				yAxes: [{
					stacked: false, ticks: {min: 0,callback: function (value) { if (Number.isInteger(value)) { return value; } }}
				}]
			},

			title: {
				display: true,
				text: 'Impact Frequency',
				fontSize: 15,
			},
		};
		

		//$scope.data_graph6 = [];

		$scope.series_graph6 = ['Actual', 'Platform Average'];

		$scope.colors_graph6 = ['#0F74BA', '#29A8E0', '#0F74BA', '#0F74BA', '#0F74BA'];
		$scope.labels_graph6 = ['Events', 'Dashboards', 'Ideas', 'Proposals', 'Distributed Content'];
		
		
		/*$scope.data_graph6 =[
			['500', '450', '100', '45','50'],
			['500', '450', '100', '45','50'],
			['0', '0', '0', '0','0']
		];*/
			
		
		
		$scope.options_graph6 = {
			legend: {
				display: false
			},
			scales: {
				xAxes: [{
					stacked: false
				}],
				yAxes: [{
					stacked: false, ticks: {min: 0,callback: function (value) { 
						if (Number.isInteger(value)) { return value; } 
					}}
				}]
			},
			
			title: {
				display: true,
				text: 'Actual and Platform Average',
				fontSize: 15,
			},
		};





		$scope.colors_graph7 = ['#0F74BA', '#0F74BA', '#0F74BA', '#0F74BA', '#0F74BA', '#0F74BA'];
		$scope.labels_graph7 = ['Events', 'Profile Views', 'Subscription Requests', 'Ideas', 'Proposals', 'Bids'];
		
		//$scope.data_graph7 = ['300', '466', '655', '444', '470', '90'];
		$scope.datasetOverride_graph7 = [{
				label: "Count",
				borderWidth: 1,
				type: 'bar'
			},

		];

		$scope.options_graph7 = {
			legend: {
				display: false
			},
			scales: {
				xAxes: [{
					stacked: false
				}],
				yAxes: [{
					stacked: false, ticks: {min: 0,callback: function (value) { if (Number.isInteger(value)) { return value; } }}
				}]
			},
			
			title: {
				display: true,
				text: 'Category',
				fontSize: 15,
			},
		};



	})

	.controller('customersUsageCtrl', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails) {
		$scope.configdetails = configdetails;
		$scope.openmodelpagehelp = function () {
			$scope.showModalpageinfo = !$scope.showModalpageinfo;
		}
		$scope.sidepopupactive = false;

		$scope.sidepopup = function () {
			$scope.sidepopupactive = !$scope.sidepopupactive;
		}



		$scope.update_report = function () {

			var GetInvestorsListUrl = 'apiv4/public/researchprovider/getreports';
			var params = {
				analysts: $scope.analysts,geography:$scope.geography
			};

			RequestDetail.getDetail(GetInvestorsListUrl, params).then(function (result) {

				$scope.check_admin = result.data.check_admin;
				$scope.cmyusers = result.data.cmyusers;

				$scope.data_report = [];
				$scope.labels_report = [];
				$scope.labels_graph2 = [];
				$scope.data_graph2 = [];

				$scope.labels_graph4 = [];
				$scope.data_graph4 = [];
			

				var report_dat = [];
				angular.forEach(result.data.result_created, function (con, ind) {
					$scope.labels_report.push(con.period);
					var total = parseInt(con.dashboard_count) + parseInt(con.idea_count) + parseInt(con.proposal_count) + parseInt(con.proposal_count) + parseInt(con.distribute_content);
					report_dat.push(total);
				});

				$scope.data_report.push(report_dat);

				$scope.labels_graph2 = $scope.labels_report;
				
				

				var array_graph2 = [];
				angular.forEach(result.data.result_activity, function (con, ind) {
					array_graph2.push(con.count);
				});

				//graph 2
				$scope.data_graph2.push(array_graph2); //view
				
				//graph2 

				//graph 3
				//$scope.data_graph3.push(result.data.activity_separete.views);
				//$scope.data_graph3.push(result.data.activity_separete.click);
				//graph 3

				
				$scope.labels_graph3 = [];
				$scope.data_graph3 = [];
				$scope.data_graph3.push(result.data.activity_dashboards.dashboard_views_count);

				angular.forEach(result.data.activity_dashboards.dashboards, function (con, ind) {
					$scope.labels_graph3.push(con.title);
				});


				var array_graph4 = [];
				angular.forEach(result.data.activity_customers, function (con, ind) {
					$scope.labels_graph4.push(con.firstname +' '+ con.lastname);
					array_graph4.push(con.count);
				});


				$scope.data_graph4.push(array_graph4);
				
				$scope.regions = result.data.regions;

			});

		}
		$scope.update_report();

		$scope.colors_report = ['#29A8E0', '#0F74BA', '#b3d4fc', '#162f40', '#d0d4d8'];

	
	//	$scope.labels_report = ['Oct2018','Sep2018','Aug2018','July2018','June2018'];
		//$scope.data_report =   [
	//		  ['30','60','70','20','10'],
			
//];
		$scope.datasetOverride_report = [{
				label: "Count",
				borderWidth: 1,
				type: 'bar'
			},

		];
		$scope.options_report = {
			legend: {
				display: true
			},
			scales: {
				xAxes: [{
					stacked: false
				}],
				yAxes: [{
					stacked: false, ticks: {min: 0,callback: function (value) { if (Number.isInteger(value)) { return value; } }}
				}]
			},

			title: {
				display: true,
				text: 'VIEWS',
				fontSize: 15,
			},
		};






		$scope.colors_graph2 = ['#29A8E0', '#0F74BA', '#b3d4fc', '#162f40', '#d0d4d8'];

		//$scope.labels_graph2 = $scope.labels_report;
		// $scope.data_graph2 = [
		//	  ['30','60','70','20','10'],
		//	  ['10','10','10','10','5'],
		//  ];
		$scope.datasetOverride_graph2 = [{
				label: "View",
				borderWidth: 1,
				type: 'bar'
			}
		];
		$scope.options_graph2 = {
			legend: {
				display: true
			},
			scales: {
				xAxes: [{
					stacked: false
				}],
				yAxes: [{
					stacked: false, ticks: {min: 0,callback: function (value) { if (Number.isInteger(value)) { return value; } }}
				}]
			},

			title: {
				display: true,
				text: 'VIEWS',
				fontSize: 15,
			},
		};



		$scope.colors_graph3 = ['#29A8E0', '#29A8E0', '#29A8E0', '#29A8E0', '#29A8E0'];
		//$scope.labels_graph3 = ['test1','test2','70','20','10']
		
		//$scope.data_graph3 =  ['30','60','70','20','10'];
		 
		$scope.datasetOverride_graph3= [{
			label: "View",
			borderWidth: 1,
			type: 'bar'
		},];

		
		$scope.options_graph3 = {
			legend: {
				display: true
			},
			scales: {
				xAxes: [{
					stacked: false
				}],
				yAxes: [{
					stacked: false, ticks: {min: 0,callback: function (value) { if (Number.isInteger(value)) { return value; } }}
				}]
			},

			title: {
				display: true,
				text: 'VIEWS (Bar)',
				fontSize: 15,
			},
		};

		




		$scope.colors_graph4 = ['#29A8E0', '#0F74BA', '#b3d4fc', '#162f40', '#d0d4d8'];

		// $scope.labels_graph4= ['John','Varun','Dhamu','Karthik','Sathish'];
		//$scope.data_graph4 = [
		//  ['500','450','350','250','100'],
		//	  ['10','10','10','10','5'],
		//  ];
		$scope.datasetOverride_graph4 = [{
				label: "View",
				borderWidth: 1,
				type: 'bar'
			},
			
		];
		$scope.options_graph4 = {
			legend: {
				display: true
			},
			scales: {
				xAxes: [{
					stacked: false
				}],
				yAxes: [{
					stacked: false, ticks: {min: 0,callback: function (value) { if (Number.isInteger(value)) { return value; } }}
				}]
			},

			title: {
				display: true,
				text: 'VIEWS (Bar) ',
				fontSize: 15,
			},
		};



	})

    
/*Corporate Settings */

.controller('corporateSettings', function($scope,$http,$location,RequestDetail,localStorageService,configdetails,alertService) {
	$scope.configdetails=configdetails;
	$scope.pageHeading = 'Settings';
	$scope.settingsActive = 'inner-active';


	  $scope.password = localStorageService.get('password');
	  $scope.cpassword = localStorageService.get('password');
	  $scope.tpassword = localStorageService.get('password');
	  $scope.email = localStorageService.get('email');
  	//For Subscription
  	$scope.subscription = {};
	//  For Notifications

	$scope.notifications = {};
	$scope.notifications.accept_decline_meeting = false;
	$scope.notifications.request_reschedule = false;
	$scope.notifications.invite_event = true;
	$scope.notifications.view_profile = false;
	$scope.notifications.request_meeting = false;
	
	$scope.notifications1 = {};
	// For reminders

	$scope.reminder = {};
	$scope.reminder.reminderCheck1 = false;
	$scope.reminder.reminderCheck2 = false;
	$scope.reminder.reminderCheck3 = false;
	$scope.reminder.reminderCheck4 = false;

	$scope.reminder.reminderSelect1 = '24 Hours in Advance';
	$scope.reminder.reminderSelect2 = '24 Hours in Advance';
	$scope.reminder.reminderSelect3 = '24 Hours in Advance';
	$scope.reminder.reminderSelect4 = '24 Hours in Advance';
	

	
	// Getting details for notifications
	var getSettingsUrl = 'apiv4/public/settings/getSettings';
	var params = {
		type : 'get_settings',
	};

	$scope.updateNotification = function(){
		
		
		if($scope.notifications.invite_event){
			$scope.notifications1.invite_event1 = 1;
		}
		if($scope.notifications.request_meeting){
			$scope.notifications1.request_meeting1 = 1;
		}
		if($scope.notifications.accept_decline_meeting){
			$scope.notifications1.accept_decline_meeting1 = 1;
		}
		if($scope.notifications.request_reschedule){
			$scope.notifications1.request_reschedule1 = 1;
		}
		if($scope.notifications.view_profile){
			$scope.notifications1.view_profile1 = 1;
		}
		
		var insertSettingsUrl = 'apiv4/public/settings/corporateSettings';
		var params = {
			type : 'insert_settings',
			notify : $scope.notifications,
			notify1 : $scope.notifications1,
			reminder : $scope.reminder
		};
		RequestDetail.getDetail(insertSettingsUrl,params).then(function(result){
			if(result.data.notifications){
				$scope.notifications = JSON.parse(result.data.notifications);
			}
			if(result.data.reminders){
				$scope.reminder = JSON.parse(result.data.reminders);
			}
		});
	}
	$scope.save_password = function(){
		 if(angular.isUndefined($scope.password) || $scope.password=='' || $scope.password==null)
        {
        	$('#passwd').attr('required',true);
            $('#passwd').focus();
            alertService.add("warning", "Password field cannot empty !",2000);
            return false;
        }
        else if(angular.isUndefined($scope.cpassword) || $scope.cpassword=='' || $scope.cpassword==null){
            $('#passwd').attr('required',true);
            $('#passwd').focus();
            alertService.add("warning", "Confirm Password field cannot empty  !",2000);
            return false;
        }else if(angular.isDefined($scope.password) && $scope.password.length<6){
           	$('#passwd').attr('required',true);
            $('#passwd').focus();
            alertService.add("warning", "Please enter atleast 6 characters !",2000);
            return false;
        }


		$scope.pas = {};
		$scope.pas = [{
			password : $scope.password,
			cpassword : $scope.cpassword,
			tpassword : $scope.tpassword,
		}];
		
		var insertSettingsUrl = 'apiv4/public/settings/savepassword';
		var params = {type:$scope.pas};

		RequestDetail.getDetail(insertSettingsUrl,params).then(function(result){
			//localStorageService.set('password',$scope.password);
			if(result.data==0 || result.data=='0'){
				$scope.savefinish =true;
				alertService.add("success", "Password updated successfully !",2000);
				$scope.password='';
				$scope.cpassword='';
				$scope.tpassword='';
			}
		});
	}
	$scope.reset = function(){
		$scope.password = $scope.tpassword;
		$scope.cpassword = $scope.tpassword;
	}
	RequestDetail.getDetail(getSettingsUrl,params).then(function(result){
		if(angular.isDefined(result.data) && angular.isDefined(result.data.notify)){
			if(angular.isDefined(result.data.notify.settings_id)){
				$scope.notifications = result.data.notify;
			}
			if(angular.isDefined(result.data.notify.reminders)){
				$scope.reminder = JSON.parse(result.data.notify.reminders);
			}
		}
		if(angular.isDefined(result.data.subscription)){
				$scope.subscription = result.data.subscription;
		}
	});
	
	$scope.getapikey = function(){	
		var Url = 'apiv4/public/fair/getapikey';
		var params = {};
		RequestDetail.getDetail(Url,params).then(function(result){
			
			$scope.apisetting = result.data;
			
		});
	}
	
	$scope.getapikey();
		
	$scope.regeneratekey = function(){
		var Url = 'apiv4/public/fair/generateapikey';
		var params = {};
		RequestDetail.getDetail(Url,params).then(function(result){
			
			$scope.apisetting.fair_api_key = result.data.fair_api_key;
		});
	}
		
	$scope.apisubmit = function(){
		var Url = 'apiv4/public/fair/addtofairapi';
		var params = {settings:$scope.apisetting};
		RequestDetail.getDetail(Url,params).then(function(result){
			if(result.data.res=='success'){
				$scope.getapikey();
				alertService.add("success", "Updated Successfully !",2000);
				return false;
			}else{
				alertService.add("warning", "Invalid domain name!",2000);
				return false;
			}
		});
		
	}
		
	$scope.showModalpageinfo=false;
  
	$scope.openmodelpagehelp = function() {
	   $scope.showModalpageinfo=!$scope.showModalpageinfo;
	}

})
/*Investor  Settings */
.controller('investorSettings', function($scope,$http,$location,localStorageService,RequestDetail,configdetails,alertService) {
	$scope.configdetails=configdetails;
	$scope.pageHeading = 'Settings';
	$scope.settingsActive = 'inner-active';
	
	  $scope.password = localStorageService.get('password');
	  $scope.cpassword = localStorageService.get('password');
	  $scope.email = localStorageService.get('email');
	  
	  
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

		
	//  For Notifications
	$scope.notifications = {};
	$scope.notifications.accept_decline_meeting = false;
	$scope.notifications.request_reschedule = false;
	$scope.notifications.invite_event = false;
	$scope.notifications.view_profile = false;
	$scope.notifications.request_meeting = false;

	// For reminders

	$scope.reminder = {};
	$scope.reminder.reminderCheck1 = false;
	$scope.reminder.reminderCheck2 = false;
	$scope.reminder.reminderCheck3 = false;
	$scope.reminder.reminderCheck4 = false;

	$scope.reminder.reminderSelect1 = '24 Hours in Advance';
	$scope.reminder.reminderSelect2 = '24 Hours in Advance';
	$scope.reminder.reminderSelect3 = '24 Hours in Advance';
	$scope.reminder.reminderSelect4 = '24 Hours in Advance';

	
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
	
	// Getting details for notifications
	var getSettingsUrl = 'apiv4/public/settings/getSettings';
	var params = {
		type : 'get_settings',
	};

	$scope.updateNotification = function(){
		var insertSettingsUrl = 'apiv4/public/settings/corporateSettings';
		var params = {
			type : 'insert_settings',
			notify : $scope.notifications,
			reminder : $scope.reminder
		};
		RequestDetail.getDetail(insertSettingsUrl,params).then(function(result){
		if(result.data.notifications){
			$scope.notifications = JSON.parse(result.data.notifications);
		}
		if(result.data.reminders){
			$scope.reminder = JSON.parse(result.data.reminders);
		}
		});
	}
	/* $scope.save_password = function(){
		 if(angular.isUndefined($scope.password) || $scope.password=='' || $scope.password==null)
		{
			$('#passwd').attr('required',true);
			$('#passwd').focus();
			alertService.add("warning", "Password field cannot empty !",2000);
			return false;
		}
		else if(angular.isUndefined($scope.cpassword) || $scope.cpassword=='' || $scope.cpassword==null){
			$('#passwd').attr('required',true);
			$('#passwd').focus();
			alertService.add("warning", "Confirm Password field cannot empty  !",2000);
			return false;
		}else if(angular.isDefined($scope.password) && $scope.password.length<6){
			$('#passwd').attr('required',true);
			$('#passwd').focus();
			alertService.add("warning", "Please enter atleast 6 characters !",2000);
			return false;
		}
		$scope.pas = {};
		$scope.pas = [{
			password : $scope.password,
			cpassword : $scope.cpassword,
			tpassword : $scope.tpassword,
		}];
		
		var insertSettingsUrl = 'apiv4/public/settings/savepassword';
		var params = {type:$scope.pas};

		RequestDetail.getDetail(insertSettingsUrl,params).then(function(result){
			//localStorageService.set('password',$scope.password);
			if(result.data==0 || result.data=='0'){
				$scope.savefinish =true;
				alertService.add("success", "Password updated successfully !",2000);
				$scope.password='';
				$scope.cpassword='';
				$scope.tpassword='';
			}
		});
	} */
	
	//UPDATE Investor SETTINGS
	$scope.save_investor_settings = function(){
		if($scope.password!='' && $scope.password!=null){
			if(angular.isDefined($scope.password) && $scope.password!='' && $scope.password!=null && $scope.password.length < 6){
				$('#passwd').attr('required',true);
				$('#passwd').focus();
				alertService.add("warning", "Please enter atleast 6 characters !",2000);
				return false;
			}
			if(angular.isUndefined($scope.cpassword) || $scope.cpassword=='' || $scope.cpassword==null){
				$('#passwd').attr('required',true);
				$('#passwd').focus();
				alertService.add("warning", "Confirm Password field cannot empty  !",2000);
				return false;
			}
			if($scope.password != $scope.cpassword){
				$('#passwd').attr('required',true);
				$('#passwd').focus();
				alertService.add("warning", "Confirm Password mismatch!",2000);
				return false;
			}
		}
		
		$scope.formData = {};
		$scope.formData = [{
			password 			: $scope.password,
			cpassword 			: $scope.cpassword,
			tpassword 			: $scope.tpassword,
			industryTagsAdded	: $scope.industryTagsAdded,
			tickerTagsAdded		: $scope.tickerTagsAdded,
			keywordTagsAdded	: $scope.keywordTagsAdded,
		}];
		
		var insert_SettingsUrl = 'apiv4/public/settings/save_investor_settings';
		var params = {type:$scope.formData};

		RequestDetail.getDetail(insert_SettingsUrl,params).then(function(result){
			//localStorageService.set('password',$scope.password);
			if(result.data){
				$scope.savefinish =true;
				alertService.add("success", "Settings updated successfully !",2000);
				$scope.password='';
				$scope.cpassword='';
				$scope.tpassword='';
			}
		});
	}

	$scope.reset = function(){
		$scope.password = $scope.tpassword;
		$scope.cpassword = $scope.tpassword;
	}
	RequestDetail.getDetail(getSettingsUrl,params).then(function(result){
		if(angular.isDefined(result.data) && angular.isDefined(result.data.notify)){
			if(angular.isDefined(result.data.notify.settings_id)){
				$scope.notifications = result.data.notify;
			}
			if(angular.isDefined(result.data.notify.reminders)){
				$scope.reminder = JSON.parse(result.data.notify.reminders);
			}
		}
		if(angular.isDefined(result.data.subscription)){
				$scope.subscription = result.data.subscription;
		}
		if(angular.isDefined(result.data)){
			$scope.industryTagsAdded	= result.data.industry_tags; 
			if(result.data.keywords != ''){
				$scope.keywordTagsAdded		= result.data.keywords; 
			}
			if(result.data.tickers != ''){
				$scope.tickerTagsAdded		= result.data.tickers; 
			}
		} 
	});
	

})


/*Research Provider Settings     Added By Jayapriya on 14-08-2018 */
.controller('rpSettings', function($scope,$http,$location,RequestDetail,localStorageService,configdetails,alertService) {
	$scope.configdetails=configdetails;
	$scope.pageHeading 		= 'Settings';
	$scope.settingsActive 	= 'inner-active';
	$scope.password 		= localStorageService.get('password');
	$scope.cpassword 		= localStorageService.get('password');
	$scope.tpassword 		= localStorageService.get('password');
	$scope.email 			= localStorageService.get('email');

  	//For Subscription
  	$scope.subscription = {};
	//  For Notifications
	$scope.notifications = {};
	$scope.notifications.invite_event = 0;
	$scope.notifications.request_meeting = 0;
	$scope.notifications.accept_decline_meeting = 0;
	$scope.notifications.request_reschedule = 0;
	$scope.notifications.view_profile = 0;
	$scope.notifications.request_proposal = 0;

	$scope.notifications1 = {};
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
	//For Trial Rules
	$scope.number_of_reports = 0;
	$scope.number_of_days = 0;
	$scope.rp_subscription_cost = 0;
	
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
	$scope.new = [];
	$scope.new.new_content_type ="";

	$scope.editcontenttypestatus = 0;
	$scope.distributecontent_type_id = 0;

	$scope.adddistribute_contenttype = function(){

		if (angular.isUndefined($scope.new.new_content_type) || $scope.new.new_content_type == '') {
			alertService.add("warning", "Please enter content type!", 2000);
			return false;
		}

		if($scope.editcontenttypestatus){
			var tagUrl = 'apiv4/public/settings/editdistributetype';
		}else{
			var tagUrl = 'apiv4/public/settings/adddistributetype';
		}
		
		var params = {new_content_type : $scope.new.new_content_type, distributecontent_type_id : $scope.distributecontent_type_id};
		RequestDetail.getDetail(tagUrl,params).then(function(result){
			$scope.getdistribute_contenttype();
			$scope.new.new_content_type = "";
			$scope.editcontenttypestatus = 0;
			$scope.distributecontent_type_id = 0;
		});
	}

	$scope.getdistribute_contenttype = function(){
		var tagUrl = 'apiv4/public/settings/getdistribute_contenttype';
		var params = {};
		RequestDetail.getDetail(tagUrl,params).then(function(result){
			$scope.distribute_contenttypes = result.data.distributecontent_types;
		});
	}
	$scope.getdistribute_contenttype();

	$scope.editdistribute_contenttype = function(contenttype){
		$scope.new.new_content_type = contenttype.name;
		$scope.distributecontent_type_id = contenttype.distributecontent_type_id;
		$scope.editcontenttypestatus = 1;
	}

	$scope.new = [];
	$scope.new.new_category_type = "";

	$scope.editinvestornotescategorystatus = 0;
	$scope.investor_notes_category_id = 0;

	

	$scope.addinvestornotescategory = function(){
		if($scope.editinvestornotescategorystatus){
			var tagUrl = 'apiv4/public/settings/editinvestornotes_category';
		}else{
			var tagUrl = 'apiv4/public/settings/addinvestornotes_category';
		}
		
		var params = {new_category_type : $scope.new.new_category_type, investor_notes_category_id : $scope.investor_notes_category_id};
		RequestDetail.getDetail(tagUrl,params).then(function(result){
			$scope.getinvestornotes_category();
			$scope.new.new_category_type ="";
			$scope.editinvestornotescategorystatus = 0;
			$scope.investor_notes_category_id = 0;
		});
	}

	$scope.getinvestornotes_category = function(){
		var tagUrl = 'apiv4/public/settings/getinvestornotes_category';
		var params = {};
		RequestDetail.getDetail(tagUrl,params).then(function(result){
			$scope.investornotes_categories = result.data.investornotes_categories;
		});
	}
	$scope.getinvestornotes_category();

	$scope.getideas_trials = function(){
		var tagUrl = 'apiv4/public/settings/getideas_trials';
		var params = {};
		RequestDetail.getDetail(tagUrl,params).then(function(result){
			$scope.ideas_trials = result.data.rptrials;
			//console.log($scope.ideas_trials);
		});
	}
	$scope.getideas_trials();

	$scope.open1 = function () {
		$scope.popup1.opened = true;
	};
	$scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[1];
	$scope.altInputFormats = ['M!/d!/yyyy'];


	$scope.dateOptions = {
		// dateDisabled: disabled,
		formatYear: 'yy',
		//maxDate: new Date().setDate(new Date().getDate() + 7),
		minDate: new Date(),
		startingDay: 1
	  };


	$scope.toggleMin = function () {
		//$scope.inlineOptions.minDate = new Date();
		var myDate = new Date();
		//add a day to the date
		//myDate.setDate(myDate.getDate());
		$scope.dateOptions.minDate = myDate;
	};
  
	$scope.toggleMin();

	$scope.popup1 = {
	  opened: false
	};

	$scope.stamptimes = [];

	$scope.trial ={};
	$scope.trial.period_type = 1;

	$scope.addideas_trial_popup = function() {
		
		$scope.showModaltrialrules = !$scope.showModaltrialrules;
		$scope.trial ={};
		$scope.trial.period_type = 1;
		//console.log($scope.trial);
	}
	$scope.editideas_trial_popup = function(trial) {
		$scope.trial = trial;

		$scope.trial.reportcount = trial.reports;
		$scope.trial.selecteddate = trial.date;
		$scope.trial.date = '';
		$scope.showModaltrialrules = !$scope.showModaltrialrules;
	}
	

	$scope.selectdistributedat  = function(dat) {

		var monthNames = [
			"January", "February", "March",
			"April", "May", "June", "July",
			"August", "September", "October",
			"November", "December"
		];
		
		var day = dat.getDate();
		var monthIndex = dat.getMonth();
		var year = dat.getFullYear();

		$scope.trial.selecteddate = day + ' ' + monthNames[monthIndex] + ' ' + year;
		$scope.trial.ddate = '';
	}
	
	$scope.addideas_trial = function(){
		//console.log($scope.trial);
		var tagUrl = 'apiv4/public/settings/addideas_trial';
		var params = {trial:$scope.trial};
		RequestDetail.getDetail(tagUrl,params).then(function(result){
			$scope.getideas_trials();
			$scope.showModaltrialrules = false;
		});
	}
	$scope.hidetrialrules = function() {
		$scope.showModaltrialrules = false;
	}	
	

	$scope.editinvestornotescategory = function(contenttype){
		$scope.new.new_category_type = contenttype.name;
		$scope.investor_notes_category_id = contenttype.investor_notes_category_id;
		$scope.editinvestornotescategorystatus = 1;
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
	
	// Getting details for notifications
	var getSettingsUrl = 'apiv4/public/settings/getSettings';
	var params = {
		type : 'get_settings',
	};
	
	// UPDATE NOTIIFCATIONS ON CHANGE ON HANDLER
	$scope.updateNotification = function(){
		if($scope.notifications.invite_event){
			$scope.notifications1.invite_event1 = 1;
		}
		if($scope.notifications.request_meeting){
			$scope.notifications1.request_meeting1 = 1;
		}
		if($scope.notifications.accept_decline_meeting){
			$scope.notifications1.accept_decline_meeting1 = 1;
		}
		if($scope.notifications.request_reschedule){
			$scope.notifications1.request_reschedule1 = 1;
		}
		if($scope.notifications.view_profile){
			$scope.notifications1.view_profile1 = 1;
		}
		if($scope.notifications.request_proposal){
			$scope.notifications1.request_proposal1 = 1;
		}

		
		
		var insertSettingsUrl = 'apiv4/public/settings/corporateSettings';
		var params = {
			type : 'insert_settings',
			notify : $scope.notifications,
			notify1 : $scope.notifications1,
			reminder : $scope.reminder
		};
		RequestDetail.getDetail(insertSettingsUrl,params).then(function(result){
			if(result.data.notifications){
				$scope.notifications = JSON.parse(result.data.notifications);
				
			}
			if(result.data.reminders){
				$scope.reminder = JSON.parse(result.data.reminders);
			}
		});
	}

	$scope.times =  ['12:00 am',
                            '12:30 am',
                            '1:00 am',
                            '1:30 am',
                            '2:00 am',
                            '2:30 am',
                            '3:00 am',
                            '3:30 am',
                            '4:00 am',
                            '4:30 am',
                            '5:00 am',
                            '5:30 am',
                            '6:00 am',
                            '6:30 am',
                            '7:00 am',
                            '7:30 am',
                            '8:00 am',
                            '8:30 am',
                            '9:00 am',
                            '9:30 am',
                            '10:00 am',
                            '10:30 am',
                            '11:00 am',
                            '11:30 am',
                            '12:00 pm',
                            '12:30 pm',
                            '1:00 pm',
                            '1:30 pm',
                            '2:00 pm',
                            '2:30 pm',
                            '3:00 pm',
                            '3:30 pm',
                            '4:00 pm',
                            '4:30 pm',
                            '5:00 pm',
                            '5:30 pm',
                            '6:00 pm',
                            '6:30 pm',
                            '7:00 pm',
                            '7:30 pm',
                            '8:00 pm',
                            '8:30 pm',
                            '9:00 pm',
                            '9:30 pm',
                            '10:00 pm',
                            '10:30 pm',
                            '11:00 pm',
                            '11:30 pm'
];
	

$scope.getforeigndata = function(){
	var tagUrl = 'apiv4/public/settings/getforeigndata';
	var params = {};
	RequestDetail.getDetail(tagUrl,params).then(function(result){
		$scope.disclaimer = result.data.disclaimer;
		$scope.titlecolor = result.data.titlecolor;
		$scope.tabcolor = result.data.tabcolor;
		$scope.timezone = result.data.timezone;
		$scope.distributiontime = result.data.distributiontime;

		$scope.tabtextcolor = result.data.tabtextcolor;
		$scope.heading = result.data.heading;
		$scope.company_name = result.data.company_name;

	});
}
$scope.getforeigndata();

	//UPDATE RP SETTINGS
	$scope.save_rp_settings = function(){


		//console.log($scope.titlecolor);
		//console.log($scope.tabcolor);

		if($scope.password!='' && $scope.password!=null){
			if(angular.isDefined($scope.password) && $scope.password!='' && $scope.password!=null && $scope.password.length < 6){
				$('#passwd').attr('required',true);
				$('#passwd').focus();
				alertService.add("warning", "Please enter atleast 6 characters !",2000);
				return false;
			}
			if(angular.isUndefined($scope.cpassword) || $scope.cpassword=='' || $scope.cpassword==null){
				$('#passwd').attr('required',true);
				$('#passwd').focus();
				alertService.add("warning", "Confirm Password field cannot empty  !",2000);
				return false;
			}
			if($scope.password != $scope.cpassword){
				$('#passwd').attr('required',true);
				$('#passwd').focus();
				alertService.add("warning", "Confirm Password mismatch!",2000);
				return false;
			}
		}
		
		$scope.formData = {};
		$scope.formData = [{
			password 			: $scope.password,
			cpassword 			: $scope.cpassword,
			tpassword 			: $scope.tpassword,
			number_of_reports 	: $scope.number_of_reports,
			number_of_days 		: $scope.number_of_days,
			rp_subscription_cost : $scope.rp_subscription_cost,
			industryTagsAdded	: $scope.industryTagsAdded,
			tickerTagsAdded		: $scope.tickerTagsAdded,
			keywordTagsAdded	: $scope.keywordTagsAdded,
			ruleofdistribution : $scope.ruleofdistribution,
			titlecolor 			: $scope.titlecolor,
			tabcolor 			: $scope.tabcolor,
			timezone : $scope.timezone,
			distributiontime : $scope.distributiontime,
			disclaimer : $scope.disclaimer,
			company_name : $scope.company_name,
			tabtextcolor : $scope.tabtextcolor,
			heading : $scope.heading
		}];
		
		var insertSettingsUrl = 'apiv4/public/settings/save_rp_settings';
		var params = {type:$scope.formData};

		RequestDetail.getDetail(insertSettingsUrl,params).then(function(result){
			//localStorageService.set('password',$scope.password);
			if(result.data){
				$scope.savefinish =true;
				alertService.add("success", "Settings updated successfully !",2000);
				$scope.password='';
				$scope.cpassword='';
				$scope.tpassword='';
			}
		});
	}
	
	$scope.reset = function(){
		$scope.password = $scope.tpassword;
		$scope.cpassword = $scope.tpassword;
	}
	// Getting RP Settings Datas
	RequestDetail.getDetail(getSettingsUrl,params).then(function(result){

	
		if(angular.isDefined(result.data) && angular.isDefined(result.data.notify)){
			if(angular.isDefined(result.data.notify.settings_id)){
				$scope.notifications = result.data.notify;

			
			}
			if(angular.isDefined(result.data.notify.reminders)){
				$scope.reminder = JSON.parse(result.data.notify.reminders);
			}
		}
		if(angular.isDefined(result.data.subscription)){
				$scope.subscription = result.data.subscription;
		}

		if(angular.isDefined(result.data)){
			$scope.industryTagsAdded	= result.data.industry_tags; 
			$scope.keywordTagsAdded		= result.data.keywords; 
			$scope.tickerTagsAdded		= result.data.tickers; 
			$scope.number_of_reports	= +result.data.number_of_reports; 
			$scope.number_of_days		= +result.data.number_of_days; 
			$scope.rp_subscription_cost	= +result.data.rp_subscription_cost; 
			
		} 
	});

	
	$scope.showModalpageinfo=false;
	$scope.openmodelpagehelp = function() {
	   $scope.showModalpageinfo=!$scope.showModalpageinfo;
	}

	

})

.controller('analysisCtrl', function($scope,$http,$location,configdetails) {
    $scope.configdetails=configdetails;
    $scope.pageHeading = 'Investor Analysis';
    $scope.analysisActive = 'active';
    
    $scope.myInterval = 5000;
    $scope.noWrapSlides = false;
    $scope.active = 0;
    var slides = $scope.slides = [];
    var slidess = $scope.slidess = [];
    var currIndex = 0;
    var currIndexs = 0;
    
    $scope.addSlide = function(i) {
    var newWidth = 700 + slides.length + 1;
    if(i == 1){
        i = '';
        var type = 'line';
    }
    if(i == 2){
        i = i;
        type = 'line';
    }
    if(i == 3){
        var type = 'mscombi2d';
    }
    slides.push({
      /*image: 'http://lorempixel.com/' + newWidth + '/400',
      text: ['Nice image','Awesome photograph','That is so cool','I love that'][slides.length % 4],*/
      type: type,
      id: currIndex++,
      chart: 'admin/api/data'+i+'.js'
    });
    }
    
    $scope.addSlides = function(j) {
    var newWidth = 700 + slidess.length + 1;
    if(i == 2){
        var type = 'line';
    }
    
    slidess.push({
      /*image: 'http://lorempixel.com/' + newWidth + '/400',
      text: ['Nice image','Awesome photograph','That is so cool','I love that'][slides.length % 4],*/
      type: type,
      id: currIndexs++,
      chart: 'admin/api/data'+j+'.js'
    });
    }
    
    for (var i = 1; i < 2; i++) {
    $scope.addSlide(i);
    }
    
    for (var j = 2; j < 3; j++) {
    $scope.addSlides(i);
    }
    
    
    })

    .controller('activitiesLeadsList', function($scope,$http,$location,local,$filter,alertService,localStorageService,RequestDetail,$routeParams,$timeout,configdetails) {
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
           
      })

	  .controller('prospects_customersList', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails) {
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

		if ($scope.fairpagetype != "" && !angular.isUndefined($scope.fairpagetype)) {
			$scope.activetab = 1;
		}

		$scope.analyticsList = [];

		$scope.get_analytics_archive = function () {
			var url = 'apiv4/public/researchprovider/getsubscriptioncustomersdata';
			var params = {
				dashboard_id: $scope.dashboard_id,
				name: $scope.name,
				user_type: $scope.user_type,
				subscription_id: $scope.subscription_id,
				dateFrom: $scope.dateFrom,
				dateTo: $scope.dateTo
			};
			RequestDetail.getDetail(url, params).then(function (result) {
				$scope.analyticsList = result.data;
			});
		}

		$scope.get_analytics_archive();

		var GetInvestorsListUrl = 'apiv4/public/researchprovider/getCustomers';
		var params = {};

		RequestDetail.getDetail(GetInvestorsListUrl, params).then(function (result) {
			$scope.results = result.data;
		});

	})
	.controller('activityLog', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails, $route) {
		$scope.configdetails = configdetails;
		$scope.openmodelpagehelp = function () {
			$scope.showModalpageinfo = !$scope.showModalpageinfo;
		}
		$scope.sidepopupactive = false;

		$scope.sidepopup = function () {
			$scope.sidepopupactive = !$scope.sidepopupactive;
		}
		/* $scope.$showModalActivity =false; */
		$scope.openmodelActivity = function () {
			$scope.showModalActivity = !$scope.showModalActivity;
		}

		$scope.act = {};

		$scope.getactivity = function () {
			var GetInvestorsListUrl = 'apiv4/public/researchprovider/getactivitylog';
			var params = { activity_id: $routeParams.activityId };

			RequestDetail.getDetail(GetInvestorsListUrl, params).then(function (result) {
				$scope.results = result.data;
			});
		}



		$scope.getactivity();



		$scope.addactivity = function () {



			var addactivityUrl = 'apiv4/public/researchprovider/addactivity';
			var params = {
				item_type: $scope.act.item_type,
				activity: $scope.act.activity,
				activity_id: $routeParams.activityId
			};

			RequestDetail.getDetail(addactivityUrl, params).then(function (result) {
				$scope.results = result.data;
				$scope.showModalActivity = !$scope.showModalActivity;
				$scope.getactivity();
			});
		}
	})
