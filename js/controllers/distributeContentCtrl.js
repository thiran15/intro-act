'use strict';

/* Controllers */

angular.module('myApp.distributeContentCtrl', ['ui.bootstrap'])
    .controller('distributePath', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails,$route,$window) {

        
        $scope.configdetails = configdetails;
        $scope.openmodelpagehelp = function () {
            $scope.showModalpageinfo = !$scope.showModalpageinfo;
        }
        $scope.sidepopupactive = false;

        $scope.sidepopup = function () {
            $scope.sidepopupactive = !$scope.sidepopupactive;
        }
 


        

        var tagUrl = 'apiv4/public/researchprovider/getCustomcategory';
        var params = {};
        RequestDetail.getDetail(tagUrl, params).then(function (result) {
            $scope.customcategories = result.data;
        }); 
 
    })
    .controller('createDContent', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails,$route,$window) {
        $scope.configdetails = configdetails;
        $scope.openmodelpagehelp = function () {
            $scope.showModalpageinfo = !$scope.showModalpageinfo;
        }
        $scope.sidepopupactive = false;

        $scope.sidepopup = function () {
            $scope.sidepopupactive = !$scope.sidepopupactive;
        }

        $scope.senderfromemail = '';
        $scope.senderfromcompany = '';

        var tagUrl = 'apiv4/public/researchprovider/getsenderemail';
        var params = {};
        RequestDetail.getDetail(tagUrl, params).then(function (result) {
            $scope.senderfromemail = result.data.fromuseremail;
            $scope.senderfromcompany = result.data.fromcompanyname;
        });

        $scope.confirmBeforesend = false;
        $scope.sideconfirmBeforesend = function () {

            res =1;
            if($scope.dcdata.mailer_type==1){
                if (angular.isUndefined($scope.dcdata.title) || $scope.dcdata.title == '') {
                    alertService.add("warning", "Please enter title !", 2000);
                    return false;
                }
                if (angular.isUndefined($scope.dcdata.description) || $scope.dcdata.description == '') {
                    alertService.add("warning", "Please enter description !", 2000);
                    return false;
                }
            }
            
            if($scope.user_type==3){
              /*  if ($scope.dcdata.distribute.length == 0) {
                    alertService.add("warning", "Please select distribute !", 2000);
                    return false;
                }*/
            }

            if($scope.dcdata.list_type!=6 && $scope.dcdata.list_type!=8){
                if (angular.isUndefined($scope.dcdata.email) || $scope.dcdata.email == '') {
                    if ($scope.dcdata.addinvesterslists.length == 0) {
                        alertService.add("warning", "Please enter email or select distribution list !", 2000);
                        return false;
                    }
                    
                }
            }

           // //console.log($scope.send_type);
            if($scope.dcdata.send_type==2){
               // //console.log($scope.send_type);
                if (angular.isUndefined($scope.dcdata.send_date) || $scope.dcdata.send_date == '') {
                    alertService.add("warning", "Please select date !", 2000);
                    return false;
                }
               
                if (angular.isUndefined($scope.dcdata.send_time) || $scope.dcdata.send_time == '') {
                    alertService.add("warning", "Please select time !", 2000);
                    return false;
                }
            }
            var res = 1;

           
            if ($scope.dcdata.email != '' && !angular.isUndefined($scope.dcdata.email)) {
                
                var emails = $scope.dcdata.email.split(',');
                angular.forEach(emails, function (email) {
                    if (!$scope.checkemailval(email.trim())) {
                        alertService.add("warning", "Please enter valid emails separated by comma!", 2000);
                        res = 0;
                        return false;
                    }
                });
                
            }

            

            if($scope.dcdata.list_type!=6 && $scope.dcdata.list_type!=8 && $scope.dcdata.list_type!=11 && $scope.dcdata.list_type!=9 && $scope.dcdata.list_type!=10){
                if ($scope.dcdata.addinvesterslists.length == 0) {
                    if (angular.isUndefined($scope.dcdata.email) || $scope.dcdata.email == '') {
                        alertService.add("warning", "Please enter email or select distribution list  !", 2000);
                        return false;
                    }
                    /*else{
                        
                       if(!$scope.checkemailval($scope.dcdata.email)){
                            alertService.add("warning", "Please Enter Valid Email !", 2000);
                            return false;
                       }
                    }*/
                }
            }
           
            

            if($scope.dcdata.mailer_type==2){
				if ($scope.dcdata.distribute.length == 0) {
                    alertService.add("warning", "Please select distribute !", 2000);
                    return false;
                }
                if ($scope.ideas.length == 0) {
                    alertService.add("warning", "Please select idea !", 2000);
                    return false;
                }									   
                $scope.idea_count = 1;
                angular.forEach($scope.ideas, function (data,key) {
                   if($scope.ideas[key].selected){
                     $scope.idea_count = 0;
                   }
                });

                if($scope.idea_count){
                    alertService.add("warning", "Please select idea !", 2000);
                    return false;
                }

            }
          
            if(!$scope.dcdata.includecompanylogo){
                $scope.dcdata.addlogostate = 0;
            }

            if($scope.dcdata.includeunsubscribelink){
                $scope.dcdata.addunsubscribelinkstate = 1;
            }

            if(res){
                $scope.confirmBeforesend = true;
            }
        }

         

        $scope.closeconfirmBeforesend = function () {
            $scope.confirmBeforesend = false;
        }
        

        $scope.dcdata = {};
        $scope.dcdata.distribute = [];

        $scope.dcdata.removedids = [];

        $scope.dcdata.mailer_type = '2';
        $scope.dcdata.custom_category = '';

        $scope.dcdata.list_type = '7';
        $scope.dcdata.list_distribute_status = 1;

        $scope.list_typechange = function () {
           if($scope.dcdata.list_type==7){
                $scope.dcdata.list_distribute_status = 1;
           }else{
                $scope.dcdata.list_distribute_status = 0;
                $scope.dcdata.filtertickers = '';
                $scope.dcdata.addinvesterslists = [];
                $scope.dcdata.sectors = [];
                $scope.dcdata.industry_tag = [];
                $scope.dcdata.tickers = [];
           }
        }


        $scope.clearstyle = function () {
            
            if($scope.dcdata.description){
                var div = document.createElement('div');
                div.innerHTML = $scope.dcdata.description;
    
                var textContent = div.innerText;
    
                $scope.dcdata.description = '<p style="font-family:arial;font-size:15px;">'+textContent+'</p>';
            }
            
         }

        

        $scope.dcdata.includecompanylogo = false;
        $scope.dcdata.includeunsubscribelink = false;

        $scope.eventlist = [];
        $scope.eventlist.my_events = [];

        $scope.dcdata.trigger = '';
        $scope.dcdata.addlogostate = 1;
        $scope.dcdata.addunsubscribelinkstate = 0;

        $scope.availableDistribute = ['Ideas','Events','Dashboards'];
        $scope.availableDistribute = ['Ideas'];

        $scope.user_data = localStorageService.get('userdata');

        $scope.user_type = $scope.user_data.user_type;
        $scope.agencystatus = 0;
        if ($scope.user_data.agencystatus) {
            $scope.agencystatus = $scope.user_data.agencystatus;
        }

		$scope.dcdata.distribute.push('Ideas');									   
        $scope.dcdata.addinvesterslists = [];
        
       
        
        $scope.mailer_typechange = function () {
            if($scope.dcdata.mailer_type==2){
                $scope.availableDistribute = ['Ideas'];
                $scope.dcdata.distribute = [];
                $scope.dcdata.distribute.push('Ideas');
                angular.forEach($scope.ideas, function (data,key) {
                    $scope.ideas[key].selected = 0;
                });
            }else{
                $scope.availableDistribute = ['Ideas','Events','Dashboards'];
                $scope.availableDistribute = ['Ideas'];
            }
           
        }


        $scope.investers = '';

        var tagUrl = 'apiv4/public/dashboard/getInvestorsList';
        var params = { key: 'tags' };
        RequestDetail.getDetail(tagUrl, params).then(function (result) {
            $scope.investerslist = {};
            $scope.investerslist = result.data;
        });
        $scope.selectinvestors = function (selected) {
            if (selected != undefined) {
                $scope.investers = selected.title;
            }
        }

        $scope.popupinvesterslist = [];

        $scope.showAllModallist = false;
        $scope.showalllist = function () {
            
            $scope.popupinvesterslist = [];
            $scope.search_lst ='';

            angular.forEach($scope.investerslist, function (data,key) {
               
                if ($scope.dcdata.addinvesterslists.indexOf(data.investor_list_name) == -1) {
                    $scope.popupinvesterslist.push(data.investor_list_name);
                }
            });
 
            
            $scope.showAllModallist = true;
        }

        $scope.addlisttoselected = function (listname) {
            if ($scope.dcdata.addinvesterslists.indexOf(listname) == -1) {
                $scope.dcdata.addinvesterslists.push(listname);

                var index =  $scope.popupinvesterslist.indexOf(listname);
                if (index > -1) {
                    $scope.popupinvesterslist.splice(index, 1);
                }
            }
        }


        var tagUrl = 'apiv4/public/researchprovider/getCustomcategory';
        var params = {};
        RequestDetail.getDetail(tagUrl, params).then(function (result) {
            $scope.customcategories = result.data;
        });

        $scope.addinvesterlist = function () {
            if ($scope.investers != '') {
                if ($scope.dcdata.addinvesterslists.indexOf($scope.investers) == -1) {
                    $scope.dcdata.addinvesterslists.push($scope.investers);
                    $scope.investers = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagInvestor');
                } else {
                    alertService.add("warning", "Already entered this item!", 2000);
                    $scope.investersgrp = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagInvestor');
                }
            }
            

        }

        $scope.selectalllist = function () {
            $scope.dcdata.addinvesterslists = [];
            angular.forEach($scope.investerslist, function (data,key) {
                    $scope.dcdata.addinvesterslists.push(data.investor_list_name);
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagInvestor');
            });
        }


        $scope.dcdata.send_type = '1';
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
            minDate: new Date().toLocaleString("en-US", {timeZone: "America/New_York"}),
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
  
            var tagUrl = 'apiv4/public/researchprovider/getdistributetimes';
            var params = { date: dat};
            RequestDetail.getDetail(tagUrl, params).then(function (result) {
                $scope.stamptimes = result.data;
            });
        }

        $scope.removeInvester = function (index) {
            $scope.dcdata.addinvesterslists.splice(index, 1);
        }

        $scope.totalcontscount = 0;
        $scope.totalcontsaddedcount = 0;

        $scope.showcontactsedit = function (editinvester,index) {
            $scope.spinnerActive = true;

            var tagUrl = 'apiv4/public/researchprovider/getinvestorslist';

            var params = { investor: editinvester};

            RequestDetail.getDetail(tagUrl, params).then(function (result) {

                $scope.investorscontactlists = result.data;
                $scope.totalcontscount = $scope.investorscontactlists.length;

                angular.forEach($scope.investorscontactlists, function (data,key) {
                    if($scope.dcdata.removedids.indexOf(data.investor_contacts_id)>=0){
                        $scope.investorscontactlists[key].addedstatus = 0;
                    }else{
                        $scope.investorscontactlists[key].addedstatus = 1;
                        $scope.totalcontsaddedcount = $scope.totalcontsaddedcount + 1;
                    }
                   
                });

                $scope.showModalcontactsedit = true;

                $scope.spinnerActive = false;
            });
        }

        $scope.previewReceipts = function () {
            var tagUrl = 'apiv4/public/researchprovider/getinvestorsreceipts';
            var params = { dcdata: $scope.dcdata};

            RequestDetail.getDetail(tagUrl, params).then(function (result) {
                $scope.investorscontacts = result.data;
                $scope.showModalcontacts = true;
            });
        }


        $scope.removethisemail = function (id) {
            $scope.dcdata.removedids.push(id);
            angular.forEach($scope.investorscontactlists, function (data,key) {
                if($scope.dcdata.removedids.indexOf(data.investor_contacts_id)>=0){
                    $scope.investorscontactlists[key].addedstatus = 0;
                }
            });
            $scope.totalcontsaddedcount = $scope.totalcontsaddedcount - 1;
        }

        $scope.Addthisemail = function (id) {
            var index =  $scope.dcdata.removedids.indexOf(id);
            if (index > -1) {
                $scope.dcdata.removedids.splice(index, 1);
            }
            angular.forEach($scope.investorscontactlists, function (data,key) {
                if($scope.investorscontactlists[key].investor_contacts_id==id){
                    $scope.investorscontactlists[key].addedstatus = 1;
               }
            });
            $scope.totalcontsaddedcount = $scope.totalcontsaddedcount + 1;
        }
        

        $scope.selectallemail = function () {
            angular.forEach($scope.investorscontactlists, function (data,key) {
                    $scope.investorscontactlists[key].addedstatus = 1;
            });
            $scope.dcdata.removedids = [];
            $scope.totalcontsaddedcount = $scope.totalcontscount;
        }
 
        $scope.unselectallemail = function () {
            $scope.dcdata.removedids = [];
            angular.forEach($scope.investorscontactlists, function (data,key) {
                $scope.investorscontactlists[key].addedstatus = 0;
                $scope.dcdata.removedids.push($scope.investorscontactlists[key].investor_contacts_id);
            });
            $scope.totalcontsaddedcount = 0;
        }


        $scope.closepopup = function () {
            $scope.showModalcontactsedit = false;
            $scope.showModalcontacts = false;
            $scope.showAllModallist = false;
        }
        
        
        if($scope.user_type==2){
            $scope.availableDistribute = ['Ideas','Events'];
        }

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


        $scope.availableIndustry = [];
        $scope.availableIndustry_sector = [];
        var tagUrl = 'apiv4/public/user/get_industries_Mid_macro';
        RequestDetail.getDetail(tagUrl, params).then(function (result) {
            if (angular.isDefined(result.data)) {
                $scope.availableIndustry = result.data.industries_macro;
                $scope.availableIndustry_sector = result.data.industries_sectors;
            } else {
                $scope.availableIndustry = [];
                $scope.availableIndustry_sector = [];
            }
        });
        
        $scope.onSelecteddistribute = function () {
            if($scope.dcdata.mailer_type==2){
                $scope.dcdata.distribute = [];
                $scope.dcdata.distribute.push('Ideas');
                angular.forEach($scope.ideas, function (data,key) {
                    $scope.ideas[key].selected = 0;
                });
            }
        }

        $scope.dcdata.distributefiles = [];

        $scope.uploaddistributeFile = function (imgdata) {
            var obj = JSON.parse(imgdata);

            $scope.$apply(function () {
                $scope.dcdata.distributefiles.push({
                    file_name: obj.name,
                    file_location: 'uploads/distributecontent/' + obj.uploadedname
                });
            });

        }
        $scope.removeFiles = function (index) {
            $scope.dcdata.distributefiles.splice(index, 1);
        }


        $scope.dcdata.distributedisclaimers = [];

        $scope.uploaddistributeDisclaimers = function (imgdata) {
            $scope.dcdata.distributedisclaimers = [];

            var obj = JSON.parse(imgdata);
            $scope.$apply(function () {
                $scope.dcdata.distributedisclaimers.push({
                    file_name: obj.name,
                    file_location: 'uploads/distributecontent/' + obj.uploadedname
                })
            });

        }
        $scope.removeFilesdisclimers = function (index) {
            $scope.dcdata.distributedisclaimers.splice(index, 1);
        }

        $scope.showModalpagepreview = false;

        $scope.ideas = [];
        $scope.total_page = 1;
        $scope.page = 1;
        $scope.getideas = function (page) {
            $scope.spinnerActive = true;
            if($scope.search_txt){
                page = 1;
            }

            var getdailyDetail = 'apiv4/public/researchprovider/getideas';
            var params = {page:page,search_txt:$scope.search_txt};
            RequestDetail.getDetail(getdailyDetail, params).then(function (result) {
                //$scope.ideas = result.data;
               
                if(page==1){
                    $scope.ideas = [];
                    $scope.total_page =  result.data.total_page;
                }
                angular.forEach(result.data.ideas,function(col,index){
                    $scope.ideas.push(col);
                    if (angular.isDefined($routeParams.distributeId) && $routeParams.distributeId != '') {
                        if($scope.dcdata.editideas_ids){
                            if($scope.dcdata.editideas_ids.split(',')){
                                angular.forEach($scope.dcdata.editideas_ids.split(','), function (selecteddata,key2) {
                                    if(col.ideas_id==selecteddata){
                                        $scope.ideas[index].selected = 1;
                                    }
                                });
                            }
                        }
                    }
                });
                if($scope.total_page>=result.data.page){
                    $scope.page = result.data.page;
                }

					 $scope.spinnerActive = false;						 
            });
        }
        $scope.getideas(1);
		$scope.clearsearchideas = function () {
            $scope.search_txt = '';
            $scope.getideas(1);
        }									   
        
        $scope.templates = [];

        var gettemplateDetail = 'apiv4/public/researchprovider/gettemplate';
        var params = {};
        RequestDetail.getDetail(gettemplateDetail, params).then(function (result) {
            angular.forEach(result.data.ideas,function(col,index){
                $scope.templates.push(col);
                    
            });
        });

        
        $scope.searchtxtchag = function () {
            if($scope.search_txt==''){
                $scope.getideas(1);
            }
        }

        $scope.checkemailval = function (email) {
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(String(email).toLowerCase());
		}

        $scope.adddistribtecontent = function () {


            if($scope.dcdata.mailer_type==1){
                if (angular.isUndefined($scope.dcdata.title) || $scope.dcdata.title == '') {
                    alertService.add("warning", "Please enter title !", 2000);
                    return false;
                }
                if (angular.isUndefined($scope.dcdata.description) || $scope.dcdata.description == '') {
                    alertService.add("warning", "Please enter description !", 2000);
                    return false;
                }
            }
            if($scope.user_type==3){
              /*  if ($scope.dcdata.distribute.length == 0) {
                    alertService.add("warning", "Please select distribute !", 2000);
                    return false;
                }*/
            }
            if (angular.isUndefined($scope.dcdata.email) || $scope.dcdata.email == '') {
                if ($scope.dcdata.addinvesterslists.length == 0) {
                    alertService.add("warning", "Please enter email or select distribution list !", 2000);
                    return false;
                }
                
            }

           // //console.log($scope.send_type);
            if($scope.dcdata.send_type==2){
               // //console.log($scope.send_type);
                if (angular.isUndefined($scope.dcdata.send_date) || $scope.dcdata.send_date == '') {
                    alertService.add("warning", "Please select date !", 2000);
                    return false;
                }
               
                if (angular.isUndefined($scope.dcdata.send_time) || $scope.dcdata.send_time == '') {
                    alertService.add("warning", "Please select time !", 2000);
                    return false;
                }
            }
            var res = 1;

           
            if ($scope.dcdata.email != '' && !angular.isUndefined($scope.dcdata.email)) {
                
                var emails = $scope.dcdata.email.split(',');
                angular.forEach(emails, function (email) {
                    if (!$scope.checkemailval(email)) {
                        alertService.add("warning", "Please enter valid emails separated by comma!", 2000);
                        res = 0;
                        return false;
                    }
                });
                
            }

           
            if ($scope.dcdata.addinvesterslists.length == 0) {
                if (angular.isUndefined($scope.dcdata.email) || $scope.dcdata.email == '') {
                    alertService.add("warning", "Please enter email or select distribution list  !", 2000);
                    return false;
                }
                /*else{
                    
                   if(!$scope.checkemailval($scope.dcdata.email)){
                        alertService.add("warning", "Please Enter Valid Email !", 2000);
                        return false;
                   }
                }*/
            }

            angular.forEach($scope.ideas, function (idea,key) {
                
                if(idea.selected==1){
                   
                    var url = 'apiv4/public/researchprovider/getidedescription';
                    var params = {ideas_id:idea.ideas_id};
                    RequestDetail.getDetail(url, params).then(function (result) {
                        $scope.ideas[key].description = result.data.description;
                    });
                }
            });
            if(res){
                $scope.showModalpagepreview = !$scope.showModalpagepreview;
            }
            
        }


       
       

        $scope.dashboardList = [];

       /* $scope.getlist = function () {
            var url = 'apiv4/public/researchprovider/dashboardlist';
            var params = {};
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.dashboardList = result.data;
                if(result.data.length>0){
                    $scope.domain_url = result.data[0]['domain_url'];
                }
                $scope.dcdata.distribute = [];
                $scope.dcdata.distribute.push('Ideas');
            });
        }


        $scope.getlist();*/

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

        var user_data = localStorageService.get('userdata');
        $scope.user_id = user_data.user_id;


        /*var profile_contacts = 'apiv4/public/event/eventlist';
        var params = { key: 'contacts', profile_id: $scope.user_id }

        $scope.event_page = 0;
        if (angular.isUndefined($scope.data)) { $scope.data = {}; }

        if (angular.isDefined($scope.data) && angular.isDefined($scope.data.todate) && ($scope.data.todate == null || $scope.data.todate == 'null')) { $scope.data.todate = ''; }
        if (angular.isDefined($scope.data.fromdate) && ($scope.data.fromdate == null || $scope.data.fromdate == 'null')) { $scope.data.fromdate = ''; }

        var frm = new Date($scope.data.fromdate);
        var to = new Date($scope.data.todate);

        if (angular.isUndefined($scope.data.eventtype)) {
            $scope.data.eventtype = [];
        }
        if (angular.isUndefined($scope.data.location)) {
            $scope.data.location = [];
        }
        if (angular.isUndefined($scope.data.industry)) {
            $scope.data.industry = [];
        }
        if (angular.isUndefined($scope.data.ticker)) {
            $scope.data.ticker = [];
        }
        if (angular.isUndefined($scope.data.fromdate) || frm == 'Invalid Date') {
            $scope.data.fromdate = "";
        }
        if (angular.isUndefined($scope.data.todate) || to == 'Invalid Date') {
            $scope.data.todate = "";
        }

        params.eventtype = $scope.data.eventtype;
        if (angular.isUndefined(params.location)) {
            params.location = [];
        };
        angular.forEach($scope.data.location, function (pu) {
            params.location.push(pu.val);
        });
        params.industry = $scope.data.industry;
        params.ticker = $scope.data.ticker;
        params.fromdate = $scope.data.fromdate;
        params.todate = $scope.data.todate;

        RequestDetail.getDetail(profile_contacts, params).then(function (result) {

            if (angular.isDefined(result.data)) {
                var events = result.data;
                if (angular.isUndefined(events) || events == null || events == 'null') {
                    events = {};
                }
                if (angular.isUndefined(events.my_events) || events.my_events == null || events.my_events == 'null') {
                    events.my_events = [];
                }
                if (angular.isUndefined(events.all) || events.all == null || events.all == 'null') {
                    events.all = [];
                }
                if (angular.isUndefined(events.all_events) || events.all_events == null || events.all_events == 'null') {
                    events.all_events = [];
                }
                if (angular.isUndefined(events.live_events) || events.live_events == null || events.live_events == 'null') {
                    events.live_events = [];
                }

                if (angular.isDefined(events.meeting) && events.meeting.length > 0) {
                    angular.forEach(events.meeting, function (data) {
                        var d = new Date(data.date);
                        data.order_date = d.getTime();
                        if (data.accepted == '1') {
                            if (angular.isDefined(events.my_events) && events.my_events != null) {
                                
                                events.my_events.push(data);
                            }
                        }
                    });
                }
                if (angular.isDefined(events.all)) {
                    angular.forEach(events.all, function (datas) {
                        var d = new Date(datas.date);
                        datas.order_date = d.getTime();
                        if (angular.isDefined(datas.todatetime) && datas.todatetime != null) {
                            var f = new Date(datas.todatetime);
                            datas.totime = f.getTime();
                        } if (angular.isDefined(datas.fromdatetime) && datas.fromdatetime != null) {
                            var f = new Date(datas.fromdatetime);
                            datas.fromtime = f.getTime();
                        }
                    })
                }


                if (angular.isDefined(events.my_events)) {
                    angular.forEach(events.my_events, function (datas,key) {
                        events.my_events[key].selected = 1;
                        var d = new Date(datas.date);
                        datas.order_date = d.getTime();
                        if (angular.isDefined(datas.todatetime) && datas.todatetime != null) {
                            var f = new Date(datas.todatetime);
                            datas.totime = f.getTime();
                        } if (angular.isDefined(datas.fromdatetime) && datas.fromdatetime != null) {
                            var f = new Date(datas.fromdatetime);
                            datas.fromtime = f.getTime();
                        }
                    })
                }
                $scope.eventlist = events;
                var user_data = localStorageService.get('userdata');
                $scope.user_id = user_data.user_id;
                $scope.event_page = 1;
            }

            if (!angular.isDefined($routeParams.filterStatus)) {
                $scope.spinnerActive = false;
            }
            

        });
        */

        if($routeParams.email){
            $scope.dcdata.email = $routeParams.email;
        }

        

        if (angular.isDefined($routeParams.distributeId) && $routeParams.distributeId != '') {

			var url = 'apiv4/public/researchprovider/getdistribute';
			var params = {
				distribute_id: $routeParams.distributeId
			};

			RequestDetail.getDetail(url, params).then(function (result) {
				if (angular.isDefined(result.data) && result.data != 0) {

                    $scope.spinnerActive = true;

                    $scope.dcdata.title = result.data.title;
                    if($routeParams.email){
                      $scope.dcdata.title = 'Re: '+$scope.dcdata.title;
                    }
                    $scope.dcdata.description = result.data.description;
                    $scope.dcdata.mailer_type = result.data.mailer_type;
                    $scope.dcdata.email = result.data.email;
                    $scope.dcdata.removedids = result.data.removedids.split(',');

                    $scope.dcdata.list_type = result.data.list_type;

                    if(result.data.includecompanylogo){ 
                        $scope.dcdata.includecompanylogo = true;
                    }
                    if(result.data.includeunsubscribelink){ 
                        $scope.dcdata.includeunsubscribelink = true;
                    }

                    if($routeParams.email){
                        $scope.dcdata.email = $routeParams.email;
                    }else{
                        if(result.data.investerslists){
                            $scope.dcdata.addinvesterslists = result.data.investerslists.split(',');
                        }
                    } 
                   
                    if(result.data.distribute){
                        $scope.dcdata.distribute = result.data.distribute.split(',');
                    }

                    $scope.dcdata.distributefiles = result.data.distributefiles;


                    $scope.stamptimes = [];

                     
                    var tagUrl = 'apiv4/public/researchprovider/getdistributetimes';
                    var params = { date: result.data.send_date};
                    RequestDetail.getDetail(tagUrl, params).then(function (result) {
                        $scope.stamptimes = result.data;
                    });
                    
                    if(result.data.tickers){
                        $scope.dcdata.tickers = result.data.tickers.split(',');
                    }
                    if(result.data.industry_tag){
                        $scope.dcdata.industry_tag = result.data.industry_tag.split(',');
                    }
                    if(result.data.keywords){
                        $scope.dcdata.sectors = result.data.keywords.split(',');
                    }

                    if(result.data.disclaimers_file && result.data.disclaimers_location){
                        $scope.dcdata.distributedisclaimers.push({
                            file_name: result.data.disclaimers_file,
                            file_location: result.data.disclaimers_location
                        });
                    }
                    
                    $scope.dcdata.editideas_ids =  result.data.ideas_ids;

                    angular.forEach($scope.ideas, function (data,key1) {
                        if(result.data.ideas_ids){
                            if(result.data.ideas_ids.split(',')){
                                angular.forEach(result.data.ideas_ids.split(','), function (selecteddata,key2) {
                                    if(data.ideas_id==selecteddata){
                                        $scope.ideas[key1].selected = 1;
                                    }
                                });
                            }
                        }
                        
                    }); 
                    
                    $scope.spinnerActive = false;

				}
			});
        }
        
        if (angular.isDefined($routeParams.filterStatus) && $routeParams.filterStatus != '') {
            
			var url = 'apiv4/public/researchprovider/getdistributeusersstatus';
			var params = {
                filterStatus: $routeParams.filterStatus,
                distribute_id: $routeParams.distributeId
            };
            RequestDetail.getDetail(url, params).then(function (result) {
                    $scope.spinnerActive = true;

                    angular.forEach($scope.dcdata.addinvesterslists, function (data,key) { 
                        
                        var tagUrl = 'apiv4/public/researchprovider/getinvestorslist';

                        var params = { investor: data};
            
                        RequestDetail.getDetail(tagUrl, params).then(function (list) {
                           
                            angular.forEach(list.data, function (datalist,keylist) {
                                var remove = 1;
                                angular.forEach(result.data, function (dataadd,keyadd) { 
                                   if(dataadd.email==datalist.email){
                                        remove = 0;
                                   }
                                });
                                if(remove){
                                    $scope.dcdata.removedids.push(datalist.investor_contacts_id);
                                }
                            });
                           
                        });

                        

                    });

                    $scope.spinnerActive = false;

                    
            });
        }

        if (angular.isDefined($routeParams.email) && $routeParams.email != '') {
            $scope.dcdata.email = $routeParams.email;
        }
        


        $scope.selectdistributeall = function () {
            if($scope.dcdata.mailer_type==2){
                alertService.add("warning", "Mailer type single idea!", 2000);
                return false;
            }
            angular.forEach($scope.dashboardList, function (data,key) {
                $scope.dashboardList[key].selected = 1;
            });
            angular.forEach($scope.ideas, function (data,key) {
                $scope.ideas[key].selected = 1;
            });
            angular.forEach($scope.eventlist.my_events, function (data,key) {
                $scope.eventlist.my_events[key].selected = 1;
            });
        }
        $scope.unselectdistributeall = function () {
            angular.forEach($scope.dashboardList, function (data,key) {
                $scope.dashboardList[key].selected = 0;
            });
            angular.forEach($scope.ideas, function (data,key) {
                $scope.ideas[key].selected = 0;
            });
            angular.forEach($scope.eventlist.my_events, function (data,key) {
                $scope.eventlist.my_events[key].selected = 0;
            });
        }


        $scope.adddashboards = function (index) {
            $scope.dashboardList[index].selected = 1;
        }
        $scope.removeddashboards = function (index) {
            $scope.dashboardList[index].selected = 0;
        }
        
        $scope.addideas = function (index) {
            if($scope.dcdata.mailer_type==2){
                angular.forEach($scope.ideas, function (data,key) {
                    $scope.ideas[key].selected = 0;
                });
            }
            $scope.ideas[index].selected = 1;
        }
        $scope.removedideas = function (index) {
            if($scope.dcdata.mailer_type==2){
                angular.forEach($scope.ideas, function (data,key) {
                    $scope.ideas[key].selected = 0;
                });
            }
            $scope.ideas[index].selected = 0;
        }

        $scope.removeevents = function (index) {
            $scope.eventlist.my_events[index].selected = 0;
        }
        $scope.addevents = function (index) {
            $scope.eventlist.my_events[index].selected = 1;
        }
        

       
        $scope.confirmmail = function (type_send) {

            $scope.confirmBeforesend = false;

            res =1;
            if($scope.dcdata.mailer_type==1){
                if (angular.isUndefined($scope.dcdata.title) || $scope.dcdata.title == '') {
                    alertService.add("warning", "Please enter title !", 2000);
                    return false;
                }
                if (angular.isUndefined($scope.dcdata.description) || $scope.dcdata.description == '') {
                    alertService.add("warning", "Please enter description !", 2000);
                    return false;
                }
            }
            
            if($scope.user_type==3){
              /*  if ($scope.dcdata.distribute.length == 0) {
                    alertService.add("warning", "Please select distribute !", 2000);
                    return false;
                }*/
            }

            if($scope.dcdata.list_type==7){
                if (angular.isUndefined($scope.dcdata.email) || $scope.dcdata.email == '') {
                    if ($scope.dcdata.addinvesterslists.length == 0) {
                        alertService.add("warning", "Please enter email or select distribution list !", 2000);
                        return false;
                    }
                    
                }
            }

           // //console.log($scope.send_type);
            if($scope.dcdata.send_type==2){
               // //console.log($scope.send_type);
                if (angular.isUndefined($scope.dcdata.send_date) || $scope.dcdata.send_date == '') {
                    alertService.add("warning", "Please select date !", 2000);
                    return false;
                }
               
                if (angular.isUndefined($scope.dcdata.send_time) || $scope.dcdata.send_time == '') {
                    alertService.add("warning", "Please select time !", 2000);
                    return false;
                }
            }
            var res = 1;

           
            if ($scope.dcdata.email != '' && !angular.isUndefined($scope.dcdata.email)) {
                
                var emails = $scope.dcdata.email.split(',');
                angular.forEach(emails, function (email) {
                    if (!$scope.checkemailval(email.trim())) {
                        alertService.add("warning", "Please enter valid emails separated by comma!", 2000);
                        res = 0;
                        return false;
                    }
                });
                
            }

            if($scope.dcdata.list_type==7){
                if ($scope.dcdata.addinvesterslists.length == 0) {
                    if (angular.isUndefined($scope.dcdata.email) || $scope.dcdata.email == '') {
                        alertService.add("warning", "Please enter email or select distribution list  !", 2000);
                        return false;
                    }
                    /*else{
                        
                       if(!$scope.checkemailval($scope.dcdata.email)){
                            alertService.add("warning", "Please Enter Valid Email !", 2000);
                            return false;
                       }
                    }*/
                }
            }
           
            

            if($scope.dcdata.mailer_type==2){
				if ($scope.dcdata.distribute.length == 0) {
                    alertService.add("warning", "Please select distribute !", 2000);
                    return false;
                }
                if ($scope.ideas.length == 0) {
                    alertService.add("warning", "Please select idea !", 2000);
                    return false;
                }									   
                $scope.idea_count = 1;
                angular.forEach($scope.ideas, function (data,key) {
                   if($scope.ideas[key].selected){
                     $scope.idea_count = 0;
                   }
                });

                if($scope.idea_count){
                    alertService.add("warning", "Please select idea !", 2000);
                    return false;
                }

            }
          
            if(!$scope.dcdata.includecompanylogo){
                $scope.dcdata.addlogostate = 0;
            }

            if($scope.dcdata.includeunsubscribelink){
                $scope.dcdata.addunsubscribelinkstate = 1;
            }

            if(res){
                $scope.spinnerActive = true;

                if(type_send==2){
                    var url = 'apiv4/public/researchprovider/adddistribute';
                }else if(type_send==1 || type_send==4){
                    var url = 'apiv4/public/researchprovider/savedistribute';
                }
               
                var params = { dcdata: $scope.dcdata, ideas: $scope.ideas, dashboardList: $scope.dashboardList, my_events: $scope.eventlist.my_events };
                RequestDetail.getDetail(url, params).then(function (result) {
                    alertService.add("success", "Saved Successfully !", 2000);
                    $scope.dcdata = {};
                    $scope.dcdata.distribute = [];
                    $scope.dcdata.distribute.push('Ideas');
                    $scope.showModalpagepreview = false;
                    $scope.spinnerActive = false;

                    if(type_send==2){
                        alertService.add("success", "Sent Successfully !", 2000);
                        $location.path('distributeanalytics/history');
                    }else if(type_send==1){
                        alertService.add("success", "Saved Successfully !", 2000);
                        $location.path('distributeContent/edit/'+result.data.distribute_content_id_url);
                    }else if(type_send==4){
                        alertService.add("success", "Saved Successfully !", 2000);
                        $window.open('#/distributeContent/preview/'+result.data.distribute_content_id_url, '_blank');
                        $location.path('distributeContent/edit/'+result.data.distribute_content_id_url);
                    }
                    
                

                // $timeout(function(){
                    //    $route.reload();
                // }, 1000);
                });
            }
            
        }

        //console.log($scope.dcdata.mailer_type);

        $scope.dcdata.distribute = [];
        $scope.dcdata.distribute.push('Ideas');

    })
    .controller('corporatecreateDContent', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails,$route,$window) {
        $scope.configdetails = configdetails;
        $scope.openmodelpagehelp = function () {
            $scope.showModalpageinfo = !$scope.showModalpageinfo;
        }
        $scope.sidepopupactive = false;

        $scope.sidepopup = function () {
            $scope.sidepopupactive = !$scope.sidepopupactive;
        }
        $scope.dcdata = {};
        $scope.dcdata.template_type = 'initiation_report';

        $scope.template = {};
        var rootFolder = 'partials/common/';

        $scope.changeTemplate = function () {
			$scope.template.include = rootFolder + $scope.dcdata.template_type + '.html';

            if($scope.dcdata.template_type=='webinar_template'){
                $scope.dcdata.bgcolor = '#ff0000';
                $scope.dcdata.textcolor= '#ffffff';
            }
            
            if($scope.dcdata.template_type=='webinar_template2'){
                $scope.dcdata.bgcolor = '#ff0000';
                $scope.dcdata.textcolor = '#ffffff';
                $scope.dcdata.headingtextcolor = '#000000';
            }

            $scope.loadtemplate($scope.dcdata.template_type);
            
		}


        $scope.loadtemplate = function (template_type) {
            $scope.spinnerActive = true;

            var url = 'apiv4/public/researchprovider/getcorporatetemplatedata';
			var params = {
				template_type: template_type
			};

			RequestDetail.getDetail(url, params).then(function (result) {
				
                 
				if (angular.isDefined(result.data) && result.data != 0 && result.data.length!=0 && result.data) {

                    

                    $scope.dcdata.title = result.data.title;
                    
                    //$scope.dcdata.template_type = result.data.template_type;
                    //$scope.changeTemplate();

                    if($scope.dcdata.template_type=='initiation_report'){
                        $scope.dcdata.management1 = result.data.management1;
                        $scope.dcdata.management2 = result.data.management2;
                        $scope.dcdata.management3 = result.data.management3;
                        $scope.dcdata.investment_thesis = result.data.investment_thesis;

                        $scope.dcdata.researchprovider = result.data.researchprovider;
                        $scope.dcdata.contactname = result.data.contactname;
                        $scope.dcdata.templateemail = result.data.templateemail;
                        //$scope.dcdata.corporateticker = result.data.corporateticker;
                        $scope.dcdata.report_file = result.data.report_file;
                    }
                    else if($scope.dcdata.template_type=='webinar_template'){
                        $scope.dcdata.bgcolor = result.data.bgcolor;
                        $scope.dcdata.textcolor  = result.data.textcolor;
                        //$scope.dcdata.company_name  = result.data.company_name;
                        $scope.dcdata.webinartitle = result.data.webinartitle;
                        $scope.dcdata.datedetail = result.data.datedetail;
                        $scope.dcdata.link = result.data.link;
                        $scope.dcdata.content = result.data.content;
                        $scope.dcdata.speakers = result.data.speakers;
                         
                    }
                    else if($scope.dcdata.template_type=='webinar_template2'){
                        $scope.dcdata.bgcolor  = result.data.bgcolor;
                        $scope.dcdata.textcolor  = result.data.textcolor;
                        $scope.dcdata.headingtextcolor  = result.data.headingtextcolor;
                        $scope.dcdata.webinartitle  = result.data.webinartitle;
                        $scope.dcdata.what  = result.data.what;
                        $scope.dcdata.when  = result.data.when;
                        $scope.dcdata.registerlink  = result.data.registerlink;
                        $scope.dcdata.speakers = result.data.speakers;
                    }
                   
                    //console.log($scope.dcdata.speakers);
                    
                   // $scope.dcdata.distributefiles = [];
                    $scope.dcdata.distributedisclaimers = [];
                    
                    if(result.data.logo){
                       // $scope.dcdata.distributefiles.push({
                        //    file_name: 'Logo',
                      //      file_location: result.data.logo
                       // });
                    }
                    
                    if(result.data.report_file){
                        $scope.dcdata.distributedisclaimers.push({
                            file_name: 'Report',
                            file_location: result.data.report_file
                        });
                    }
                    
                    $scope.dcdata.description = result.data.description;
                   // $scope.dcdata.mailer_type = result.data.mailer_type;
                    //$scope.dcdata.email = result.data.email;
                   // $scope.dcdata.removedids = result.data.removedids.split(',');

                    //$scope.dcdata.list_type = result.data.list_type;

                    if(result.data.includecompanylogo){ 
                      //  $scope.dcdata.includecompanylogo = true;
                    }
                    if(result.data.includeunsubscribelink){ 
                      //  $scope.dcdata.includeunsubscribelink = true;
                    }

                    if($routeParams.email){
                      //  $scope.dcdata.email = $routeParams.email;
                    }else{
                        if(result.data.investerslists){
                       //     $scope.dcdata.addinvesterslists = result.data.investerslists.split(',');
                        }
                    } 

                   
                    //$scope.stamptimes = [];

                     
                    //var tagUrl = 'apiv4/public/researchprovider/getdistributetimes';
                   // var params = { date: result.data.send_date};
                   // RequestDetail.getDetail(tagUrl, params).then(function (result) {
                   //     $scope.stamptimes = result.data;
                   // });
                    
                   
                  
                    
                    $scope.spinnerActive = false;

				}
			});
        }

        $scope.changeTemplate();
        
        $scope.dcdata.distribute = [];

        $scope.dcdata.removedids = [];

       

        $scope.dcdata.list_type = '7';
        $scope.dcdata.list_distribute_status = 1;

        $scope.list_typechange = function () {
           if($scope.dcdata.list_type==7){
                $scope.dcdata.list_distribute_status = 1;
           }else{
                $scope.dcdata.list_distribute_status = 0;
                $scope.dcdata.filtertickers = '';
                $scope.dcdata.addinvesterslists = [];
                $scope.dcdata.sectors = [];
                $scope.dcdata.industry_tag = [];
                $scope.dcdata.tickers = [];
           }
        }

        $scope.user_data = localStorageService.get('userdata');

        $scope.user_type = $scope.user_data.user_type;
        $scope.agencystatus = 0;
        if ($scope.user_data.agencystatus) {
            $scope.agencystatus = $scope.user_data.agencystatus;
        }

        ////console.log($scope.user_data.ticker);

        //ticker
        //companylogo
        //companyname

        $scope.dcdata.corporateticker = $scope.user_data.ticker;
        $scope.dcdata.company_name = $scope.user_data.company_name;
       
        
		 								   
        $scope.dcdata.addinvesterslists = [];
         
       
        $scope.investers = '';

        var tagUrl = 'apiv4/public/dashboard/getInvestorsList';
        var params = { key: 'tags' };
        RequestDetail.getDetail(tagUrl, params).then(function (result) {
            $scope.investerslist = {};
            $scope.investerslist = result.data;
        });
        $scope.selectinvestors = function (selected) {
            if (selected != undefined) {
                $scope.investers = selected.title;
            }
        }

       

        $scope.addinvesterlist = function () {
            if ($scope.investers != '') {
                if ($scope.dcdata.addinvesterslists.indexOf($scope.investers) == -1) {
                    $scope.dcdata.addinvesterslists.push($scope.investers);
                    $scope.investers = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagInvestor');
                } else {
                    alertService.add("warning", "Already entered this item!", 2000);
                    $scope.investersgrp = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagInvestor');
                }
            }
            

        }

        $scope.selectalllist = function () {
            $scope.dcdata.addinvesterslists = [];
            angular.forEach($scope.investerslist, function (data,key) {
                    $scope.dcdata.addinvesterslists.push(data.investor_list_name);
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagInvestor');
            });
        }


        $scope.dcdata.send_type = '1';
        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];


        $scope.dateOptions = {
            // dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date().setDate(new Date().getDate() + 90),
            minDate: new Date().toLocaleString("en-US", {timeZone: "America/New_York"}),
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
  
            var tagUrl = 'apiv4/public/researchprovider/getdistributetimes';
            var params = { date: dat};
            RequestDetail.getDetail(tagUrl, params).then(function (result) {
                $scope.stamptimes = result.data;
            });
        }

        $scope.open2 = function () {
            $scope.popup2.opened = true;
        };
        $scope.popup2 = {
            opened: false
        };

        $scope.dcdata.real_date = '';
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

            $scope.dcdata.real_date = day + ' ' + monthNames[monthIndex] + ' ' + year;
  
        }

        $scope.removeInvester = function (index) {
            $scope.dcdata.addinvesterslists.splice(index, 1);
        }

        $scope.totalcontscount = 0;
        $scope.totalcontsaddedcount = 0;

        $scope.showcontactsedit = function (editinvester,index) {
            $scope.spinnerActive = true;

            var tagUrl = 'apiv4/public/researchprovider/getinvestorslist';

            var params = { investor: editinvester};

            RequestDetail.getDetail(tagUrl, params).then(function (result) {

                $scope.investorscontactlists = result.data;
                $scope.totalcontscount = $scope.investorscontactlists.length;

                angular.forEach($scope.investorscontactlists, function (data,key) {
                    if($scope.dcdata.removedids.indexOf(data.investor_contacts_id)>=0){
                        $scope.investorscontactlists[key].addedstatus = 0;
                    }else{
                        $scope.investorscontactlists[key].addedstatus = 1;
                        $scope.totalcontsaddedcount = $scope.totalcontsaddedcount + 1;
                    }
                   
                });

                $scope.showModalcontactsedit = true;

                $scope.spinnerActive = false;
            });
        }

        $scope.previewReceipts = function () {
            var tagUrl = 'apiv4/public/researchprovider/getinvestorsreceipts';
            var params = { dcdata: $scope.dcdata};

            RequestDetail.getDetail(tagUrl, params).then(function (result) {
                $scope.investorscontacts = result.data;
                $scope.showModalcontacts = true;
            });
        }


        $scope.removethisemail = function (id) {
            $scope.dcdata.removedids.push(id);
            angular.forEach($scope.investorscontactlists, function (data,key) {
                if($scope.dcdata.removedids.indexOf(data.investor_contacts_id)>=0){
                    $scope.investorscontactlists[key].addedstatus = 0;
                }
            });
            $scope.totalcontsaddedcount = $scope.totalcontsaddedcount - 1;
        }

        $scope.Addthisemail = function (id) {
            var index =  $scope.dcdata.removedids.indexOf(id);
            if (index > -1) {
                $scope.dcdata.removedids.splice(index, 1);
            }
            angular.forEach($scope.investorscontactlists, function (data,key) {
                if($scope.investorscontactlists[key].investor_contacts_id==id){
                    $scope.investorscontactlists[key].addedstatus = 1;
               }
            });
            $scope.totalcontsaddedcount = $scope.totalcontsaddedcount + 1;
        }
        

        $scope.selectallemail = function () {
            angular.forEach($scope.investorscontactlists, function (data,key) {
                    $scope.investorscontactlists[key].addedstatus = 1;
            });
            $scope.dcdata.removedids = [];
            $scope.totalcontsaddedcount = $scope.totalcontscount;
        }
 
        $scope.unselectallemail = function () {
            $scope.dcdata.removedids = [];
            angular.forEach($scope.investorscontactlists, function (data,key) {
                $scope.investorscontactlists[key].addedstatus = 0;
                $scope.dcdata.removedids.push($scope.investorscontactlists[key].investor_contacts_id);
            });
            $scope.totalcontsaddedcount = 0;
        }


        $scope.closepopup = function () {
            $scope.showModalcontactsedit = false;
            $scope.showModalcontacts = false;
        }
        
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


        $scope.availableIndustry = [];
        $scope.availableIndustry_sector = [];
        var tagUrl = 'apiv4/public/user/get_industries_Mid_macro';
        RequestDetail.getDetail(tagUrl, params).then(function (result) {
            if (angular.isDefined(result.data)) {
                $scope.availableIndustry = result.data.industries_macro;
                $scope.availableIndustry_sector = result.data.industries_sectors;
            } else {
                $scope.availableIndustry = [];
                $scope.availableIndustry_sector = [];
            }
        });
        
        $scope.dcdata.distributefiles = [];

        $scope.uploaddistributeFile = function (imgdata) {
            $scope.dcdata.distributefiles = [];

            var obj = JSON.parse(imgdata);

            $scope.$apply(function () {
                $scope.dcdata.distributefiles.push({
                    file_name: obj.name,
                    file_location: 'uploads/corporate/image/' + obj.uploadedname
                });
            });

        }

        $scope.dcdata.logofiles = [];

        $scope.uploaddistributelogoFile = function (imgdata) {
            $scope.dcdata.logofiles = [];

            var obj = JSON.parse(imgdata);

            $scope.$apply(function () {
                $scope.dcdata.logofiles.push({
                    file_name: obj.name,
                    file_location: 'uploads/corporate/image/' + obj.uploadedname
                });
            });

        }
 

        $scope.dcdata.logofiles.push({
            file_name: 'Logo',
            file_location:  $scope.user_data.logo
        });

        $scope.dcdata.distributefiles.push({
            file_name: 'Logo',
            file_location:  $scope.user_data.logo
        });
        

        $scope.removeFiles = function (index) {
            $scope.dcdata.distributefiles.splice(index, 1);
        }

        $scope.dcdata.distributedisclaimers = [];

        $scope.uploaddistributeDisclaimers = function (imgdata) {
            $scope.dcdata.distributedisclaimers = [];

            var obj = JSON.parse(imgdata);
            $scope.$apply(function () {
                $scope.dcdata.distributedisclaimers.push({
                    file_name: obj.name,
                    file_location: 'uploads/corporate/report/' + obj.uploadedname
                })
            });

        }
        $scope.removeFilesdisclimers = function (index) {
            $scope.dcdata.distributedisclaimers.splice(index, 1);
        }


        //code for webinar

        $scope.openspeakerpopup = function () {
            $scope.dcdata.speakerphotofiles = [];
            $scope.showModalnewspeaker = true;
            $scope.dcdata.speaker = [];
        }

        

        $scope.closespeakerpopup = function () {
            $scope.showModalnewspeaker = false;
        }

        $scope.viewspeakercontent = function (speaker) {

            //console.log(speaker);
            $scope.dcdata.speaker = [];
            $scope.dcdata.speaker.viewcontent = speaker.content;
            $scope.dcdata.speaker.viewimage = speaker.image[0].file_location;
            $scope.showModalnewspeakercontentview = true;
        }
        
        $scope.closespeakerviewpopup = function () {
            $scope.showModalnewspeakercontentview = false;
        }
        

        $scope.dcdata.speakerphotofiles = [];

        $scope.uploadspeakerphotoFile = function (imgdata) {
            $scope.dcdata.speakerphotofiles = [];

            var obj = JSON.parse(imgdata);

            $scope.$apply(function () {
                $scope.dcdata.speakerphotofiles.push({
                    file_name: obj.name,
                    file_location: 'uploads/corporate/image/' + obj.uploadedname
                });
            });

        }
        $scope.removespeakerFiles = function (index) {
            $scope.dcdata.speakerphotofiles.splice(index, 1);
        }

        
        $scope.dcdata.speakers = [];

        $scope.addspeakercontent = function () {

            if (angular.isUndefined($scope.dcdata.speaker.speakercontent) || $scope.dcdata.speaker.speakercontent == '') {
                alertService.add("warning", "Please enter speaker content!", 2000);
                return false;
            } 
            if ($scope.dcdata.speakerphotofiles.length == 0) {
                alertService.add("warning", "Please upload photo !", 2000);
                return false;
            }

            var newspeaker = {
				image: $scope.dcdata.speakerphotofiles,
				content: $scope.dcdata.speaker.speakercontent,
			};
           
            if (angular.isUndefined($scope.dcdata.speakers)) {
                $scope.dcdata.speakers = [];
            }
			
            $scope.dcdata.speakers.push(newspeaker); 
            $scope.showModalnewspeaker = false;
        }

        $scope.removeSpeaker = function (index) {
            $scope.dcdata.speakers.splice(index, 1);
        }

        //code for webinar

        $scope.checkemailval = function (email) {
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(String(email).toLowerCase());
		}

       

        var user_data = localStorageService.get('userdata');
        $scope.user_id = user_data.user_id;

 
        if($routeParams.email){
            $scope.dcdata.email = $routeParams.email;
        }

        
        

        if (angular.isDefined($routeParams.distributeId) && $routeParams.distributeId != '') {

			var url = 'apiv4/public/researchprovider/getcorporatedistribute';
			var params = {
				distribute_id: $routeParams.distributeId
			};

			RequestDetail.getDetail(url, params).then(function (result) {
				if (angular.isDefined(result.data) && result.data != 0) {

                    $scope.spinnerActive = true;

                    $scope.dcdata.title = result.data.title;
                    if($routeParams.email){
                      $scope.dcdata.title = 'Re: '+$scope.dcdata.title;
                    }
                    $scope.dcdata.template_type = result.data.template_type;
                    $scope.changeTemplate();

                    if($scope.dcdata.template_type=='initiation_report'){
                        $scope.dcdata.management1 = result.data.management1;
                        $scope.dcdata.management2 = result.data.management2;
                        $scope.dcdata.management3 = result.data.management3;
                        $scope.dcdata.investment_thesis = result.data.investment_thesis;
                        $scope.dcdata.corporateticker = result.data.corporateticker;
                        $scope.dcdata.report_file = result.data.report_file;
                        $scope.dcdata.researchprovider = result.data.researchprovider;
                        $scope.dcdata.contactname = result.data.contactname;
                        $scope.dcdata.templateemail = result.data.templateemail;
                    }
                    else if($scope.dcdata.template_type=='webinar_template'){
                        $scope.dcdata.bgcolor = result.data.bgcolor;
                        $scope.dcdata.textcolor  = result.data.textcolor;
                        $scope.dcdata.company_name  = result.data.company_name;
                        $scope.dcdata.webinartitle = result.data.webinartitle;
                        $scope.dcdata.datedetail = result.data.datedetail;
                        $scope.dcdata.link = result.data.link;
                        $scope.dcdata.content = result.data.content;
                        $scope.dcdata.speakers = result.data.speakers;
                    }
                    else if($scope.dcdata.template_type=='webinar_template2'){
                        $scope.dcdata.bgcolor  = result.data.bgcolor;
                        $scope.dcdata.textcolor  = result.data.textcolor;
                        $scope.dcdata.headingtextcolor  = result.data.headingtextcolor;
                        $scope.dcdata.webinartitle  = result.data.webinartitle;
                        $scope.dcdata.what  = result.data.what;
                        $scope.dcdata.when  = result.data.when;
                        $scope.dcdata.registerlink  = result.data.registerlink;
                        $scope.dcdata.speakers = result.data.speakers;
                    }
                   
                    
                    $scope.dcdata.distributefiles = [];
                    $scope.dcdata.distributedisclaimers = [];
                    $scope.dcdata.logofiles = [];
                    
                    $scope.dcdata.distributefiles.push({
                        file_name: 'Logo',
                        file_location: result.data.logo
                    });
                    $scope.dcdata.distributedisclaimers.push({
                        file_name: 'Report',
                        file_location: result.data.report_file
                    });
                    $scope.dcdata.logofiles.push({
                        file_name: 'Report',
                        file_location: result.data.mainlogo
                    });

                    $scope.dcdata.description = result.data.description;
                    $scope.dcdata.mailer_type = result.data.mailer_type;
                    $scope.dcdata.email = result.data.email;
                    $scope.dcdata.removedids = result.data.removedids.split(',');

                    $scope.dcdata.list_type = result.data.list_type;

                    if(result.data.includecompanylogo){ 
                        $scope.dcdata.includecompanylogo = true;
                    }
                    if(result.data.includeunsubscribelink){ 
                        $scope.dcdata.includeunsubscribelink = true;
                    }

                    if($routeParams.email){
                        $scope.dcdata.email = $routeParams.email;
                    }else{
                        if(result.data.investerslists){
                            $scope.dcdata.addinvesterslists = result.data.investerslists.split(',');
                        }
                    } 

                   
                    $scope.stamptimes = [];

                     
                    var tagUrl = 'apiv4/public/researchprovider/getdistributetimes';
                    var params = { date: result.data.send_date};
                    RequestDetail.getDetail(tagUrl, params).then(function (result) {
                        $scope.stamptimes = result.data;
                    });
                    
                   
                  
                    
                    $scope.spinnerActive = false;

				}
			});
        }
        
        
        if (angular.isDefined($routeParams.filterStatus) && $routeParams.filterStatus != '') {
            
			var url = 'apiv4/public/researchprovider/getdistributeusersstatus';
			var params = {
                filterStatus: $routeParams.filterStatus,
                distribute_id: $routeParams.distributeId
            };
            RequestDetail.getDetail(url, params).then(function (result) {
                    $scope.spinnerActive = true;

                    angular.forEach($scope.dcdata.addinvesterslists, function (data,key) { 
                        
                        var tagUrl = 'apiv4/public/researchprovider/getinvestorslist';

                        var params = { investor: data};
            
                        RequestDetail.getDetail(tagUrl, params).then(function (list) {
                           
                            angular.forEach(list.data, function (datalist,keylist) {
                                var remove = 1;
                                angular.forEach(result.data, function (dataadd,keyadd) { 
                                   if(dataadd.email==datalist.email){
                                        remove = 0;
                                   }
                                });
                                if(remove){
                                    $scope.dcdata.removedids.push(datalist.investor_contacts_id);
                                }
                            });
                           
                        });

                        

                    });

                    $scope.spinnerActive = false;

                    
            });
        }

        if (angular.isDefined($routeParams.email) && $routeParams.email != '') {
            $scope.dcdata.email = $routeParams.email;
        }
        
        $scope.confirmmail = function (type_send) {
            res =1;

            
            if (angular.isUndefined($scope.dcdata.title) || $scope.dcdata.title == '') {
                alertService.add("warning", "Please enter title !", 2000);
                return false;
            } 

            if($scope.dcdata.template_type=='initiation_report'){
                if (angular.isUndefined($scope.dcdata.management1) || $scope.dcdata.management1 == '') {
                    alertService.add("warning", "Please enter management !", 2000);
                    return false;
                } 
                if ($scope.dcdata.distributefiles.length == 0) {
                    alertService.add("warning", "Please upload logo !", 2000);
                    return false;
                }
                if (angular.isUndefined($scope.dcdata.investment_thesis) || $scope.dcdata.investment_thesis == '') {
                    alertService.add("warning", "Please enter investment thesis !", 2000);
                    return false;
                } 
                if (angular.isUndefined($scope.dcdata.corporateticker) || $scope.dcdata.corporateticker == '') {
                    alertService.add("warning", "Please enter ticker !", 2000);
                    return false;
                } 
                if (angular.isUndefined($scope.dcdata.description) || $scope.dcdata.description == '') {
                    alertService.add("warning", "Please enter executive summary !", 2000);
                    return false;
                } 
                if ($scope.dcdata.distributedisclaimers.length == 0) {
                    alertService.add("warning", "Please upload report !", 2000);
                    return false;
                }
            }
            if($scope.dcdata.template_type=='webinar_template'){
                if (angular.isUndefined($scope.dcdata.date) || $scope.dcdata.date == '') {
                    alertService.add("warning", "Please enter date !", 2000);
                    return false;
                } 
                if (angular.isUndefined($scope.dcdata.bgcolor) || $scope.dcdata.bgcolor == '') {
                    alertService.add("warning", "Please enter bgcolor !", 2000);
                    return false;
                } 
                if (angular.isUndefined($scope.dcdata.textcolor) || $scope.dcdata.textcolor == '') {
                    alertService.add("warning", "Please enter text color !", 2000);
                    return false;
                } 
                if ($scope.dcdata.distributefiles.length == 0) {
                    alertService.add("warning", "Please upload logo !", 2000);
                    return false;
                }
                if (angular.isUndefined($scope.dcdata.company_name) || $scope.dcdata.company_name == '') {
                    alertService.add("warning", "Please enter company name !", 2000);
                    return false;
                } 
                if (angular.isUndefined($scope.dcdata.webinartitle) || $scope.dcdata.webinartitle == '') {
                    alertService.add("warning", "Please enter webinar title !", 2000);
                    return false;
                } 
                if (angular.isUndefined($scope.dcdata.datedetail) || $scope.dcdata.datedetail == '') {
                    alertService.add("warning", "Please enter date detail !", 2000);
                    return false;
                } 
                if (angular.isUndefined($scope.dcdata.description) || $scope.dcdata.description == '') {
                    alertService.add("warning", "Please enter content !", 2000);
                    return false;
                } 
                if ($scope.dcdata.speakers.length == 0) {
                    alertService.add("warning", "Please add speaker !", 2000);
                    return false;
                }
                
            }
            if($scope.dcdata.template_type=='webinar_template2'){
                if (angular.isUndefined($scope.dcdata.date) || $scope.dcdata.date == '') {
                    alertService.add("warning", "Please enter date !", 2000);
                    return false;
                } 
                if (angular.isUndefined($scope.dcdata.bgcolor) || $scope.dcdata.bgcolor == '') {
                    alertService.add("warning", "Please enter bgcolor !", 2000);
                    return false;
                } 
                if (angular.isUndefined($scope.dcdata.textcolor) || $scope.dcdata.textcolor == '') {
                    alertService.add("warning", "Please enter text color !", 2000);
                    return false;
                } 
                if (angular.isUndefined($scope.dcdata.headingtextcolor) || $scope.dcdata.headingtextcolor == '') {
                    alertService.add("warning", "Please enter heading text color !", 2000);
                    return false;
                } 
                if ($scope.dcdata.distributefiles.length == 0) {
                    alertService.add("warning", "Please upload logo !", 2000);
                    return false;
                }
                if (angular.isUndefined($scope.dcdata.webinartitle) || $scope.dcdata.webinartitle == '') {
                    alertService.add("warning", "Please enter webinar title !", 2000);
                    return false;
                } 
                if (angular.isUndefined($scope.dcdata.what) || $scope.dcdata.what == '') {
                    alertService.add("warning", "Please enter webinar what !", 2000);
                    return false;
                } 
                if (angular.isUndefined($scope.dcdata.when) || $scope.dcdata.when == '') {
                    alertService.add("warning", "Please enter webinar when !", 2000);
                    return false;
                } 
                if (angular.isUndefined($scope.dcdata.description) || $scope.dcdata.description == '') {
                    alertService.add("warning", "Please enter content !", 2000);
                    return false;
                } 
                if ($scope.dcdata.speakers.length == 0) {
                    alertService.add("warning", "Please add speaker !", 2000);
                    return false;
                }
            }
            
            
           

            if($scope.dcdata.list_type==7){
                if (angular.isUndefined($scope.dcdata.email) || $scope.dcdata.email == '') {
                    if ($scope.dcdata.addinvesterslists.length == 0) {
                        alertService.add("warning", "Please enter email or select distribution list !", 2000);
                        return false;
                    }
                    
                }
            }

           
            if($scope.dcdata.send_type==2){
                
                if (angular.isUndefined($scope.dcdata.send_date) || $scope.dcdata.send_date == '') {
                    alertService.add("warning", "Please select date !", 2000);
                    return false;
                }
               
                if (angular.isUndefined($scope.dcdata.send_time) || $scope.dcdata.send_time == '') {
                    alertService.add("warning", "Please select time !", 2000);
                    return false;
                }
            }
            var res = 1;
            
           
            if ($scope.dcdata.email != '' && !angular.isUndefined($scope.dcdata.email)) {
                
                var emails = $scope.dcdata.email.split(',');
                angular.forEach(emails, function (email) {
                    if (!$scope.checkemailval(email.trim())) {
                        alertService.add("warning", "Please enter valid emails separated by comma!", 2000);
                        res = 0;
                        return false;
                    }
                });
                
            }

            if($scope.dcdata.list_type!=6  && $scope.dcdata.list_type!=8){
                if ($scope.dcdata.addinvesterslists.length == 0) {
                    if (angular.isUndefined($scope.dcdata.email) || $scope.dcdata.email == '') {
                        alertService.add("warning", "Please enter email or select distribution list  !", 2000);
                        return false;
                    }
                    
                }
            }
           
             
            if(!$scope.dcdata.includecompanylogo){
                $scope.dcdata.addlogostate = 0;
            }

            if($scope.dcdata.includeunsubscribelink){
                $scope.dcdata.addunsubscribelinkstate = 1;
            }

            if(res){
                $scope.spinnerActive = true;

                if(type_send==2){
                    var url = 'apiv4/public/researchprovider/adddistribute';
                }else if(type_send==1 || type_send==4){
                    var url = 'apiv4/public/researchprovider/savedistribute';
                }
               
                var params = { dcdata: $scope.dcdata };
                RequestDetail.getDetail(url, params).then(function (result) {
                    alertService.add("success", "Saved Successfully !", 2000);
                    $scope.dcdata = {};
                    $scope.dcdata.distribute = [];
                    $scope.dcdata.distribute.push('Ideas');
                    $scope.showModalpagepreview = false;
                    $scope.spinnerActive = false;

                    if(type_send==2){
                        alertService.add("success", "Sent Successfully !", 2000);
                        $location.path('distributeanalytics/history');
                    }else if(type_send==1){
                        alertService.add("success", "Saved Successfully !", 2000);
                        $location.path('corporatedistributeContent/edit/'+result.data.distribute_content_id_url);
                    }else if(type_send==4){
                        alertService.add("success", "Saved Successfully !", 2000);
                        $window.open('#/corporatedistributeContent/preview/'+result.data.distribute_content_id_url, '_blank');
                        $location.path('corporatedistributeContent/edit/'+result.data.distribute_content_id_url);
                    }
 
                });
            }
            
        }

       

    })
    .controller('distributeEmail', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails,$route,$window) {
        $scope.configdetails = configdetails;
        $scope.openmodelpagehelp = function () {
            $scope.showModalpageinfo = !$scope.showModalpageinfo;
        }
        $scope.sidepopupactive = false;

        $scope.sidepopup = function () {
            $scope.sidepopupactive = !$scope.sidepopupactive;
        }

        $scope.dcdata = {};
        $scope.dcdata.distribute = [];

        $scope.dcdata.removedids = [];

        $scope.dcdata.mailer_type = '1';
        $scope.dcdata.custom_category = '';

        $scope.dcdata.list_type = '7';
        $scope.dcdata.list_distribute_status = 1;

        $scope.list_typechange = function () {
           if($scope.dcdata.list_type==7){
                $scope.dcdata.list_distribute_status = 1;
           }else{
                $scope.dcdata.list_distribute_status = 0;
                $scope.dcdata.filtertickers = '';
                $scope.dcdata.addinvesterslists = [];
                $scope.dcdata.sectors = [];
                $scope.dcdata.industry_tag = [];
                $scope.dcdata.tickers = [];
           }
        }
        

        $scope.dcdata.includecompanylogo = true;
        $scope.dcdata.includeunsubscribelink = false;

        $scope.eventlist = [];
        $scope.eventlist.my_events = [];

        $scope.dcdata.trigger = '';
        $scope.dcdata.addlogostate = 1;
        $scope.dcdata.addunsubscribelinkstate = 0;

        $scope.availableDistribute = ['Ideas','Events','Dashboards'];
        $scope.availableDistribute = ['Ideas'];

        $scope.user_data = localStorageService.get('userdata');

        $scope.user_type = $scope.user_data.user_type;

        $scope.dcdata.addinvesterslists = [];
        
        $scope.mailer_typechange = function () {
            if($scope.dcdata.mailer_type==2){
                $scope.availableDistribute = ['Ideas'];
                $scope.dcdata.distribute = [];
                $scope.dcdata.distribute.push('Ideas');
                angular.forEach($scope.ideas, function (data,key) {
                    $scope.ideas[key].selected = 0;
                });
            }else{
                $scope.availableDistribute = ['Ideas','Events','Dashboards'];
                $scope.availableDistribute = ['Ideas'];
            }
           
        }


        $scope.investers = '';

        var tagUrl = 'apiv4/public/dashboard/getInvestorsList';
        var params = { key: 'tags' };
        RequestDetail.getDetail(tagUrl, params).then(function (result) {
            $scope.investerslist = {};
            $scope.investerslist = result.data;
        });
        $scope.selectinvestors = function (selected) {
            if (selected != undefined) {
                $scope.investers = selected.title;
            }
        }

        var tagUrl = 'apiv4/public/researchprovider/getCustomcategory';
        var params = {};
        RequestDetail.getDetail(tagUrl, params).then(function (result) {
            $scope.customcategories = result.data;
        });

        $scope.addinvesterlist = function () {
            if ($scope.investers != '') {
                if ($scope.dcdata.addinvesterslists.indexOf($scope.investers) == -1) {
                    $scope.dcdata.addinvesterslists.push($scope.investers);
                    $scope.investers = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagInvestor');
                } else {
                    alertService.add("warning", "Already entered this item!", 2000);
                    $scope.investersgrp = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagInvestor');
                }
            }
        }

        $scope.dcdata.send_type = '1';
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
  
            var tagUrl = 'apiv4/public/researchprovider/getdistributetimes';
            var params = { date: dat};
            RequestDetail.getDetail(tagUrl, params).then(function (result) {
                $scope.stamptimes = result.data;
            });
        }

        $scope.removeInvester = function (index) {
            $scope.dcdata.addinvesterslists.splice(index, 1);
        }

        $scope.totalcontscount = 0;
        $scope.totalcontsaddedcount = 0;

        $scope.showcontactsedit = function (editinvester,index) {
            $scope.spinnerActive = true;

            var tagUrl = 'apiv4/public/researchprovider/getinvestorslist';

            var params = { investor: editinvester};

            RequestDetail.getDetail(tagUrl, params).then(function (result) {

                $scope.investorscontactlists = result.data;
                $scope.totalcontscount = $scope.investorscontactlists.length;

                angular.forEach($scope.investorscontactlists, function (data,key) {
                    if($scope.dcdata.removedids.indexOf(data.investor_contacts_id)>=0){
                        $scope.investorscontactlists[key].addedstatus = 0;
                    }else{
                        $scope.investorscontactlists[key].addedstatus = 1;
                        $scope.totalcontsaddedcount = $scope.totalcontsaddedcount + 1;
                    }
                   
                });

                $scope.showModalcontactsedit = true;

                $scope.spinnerActive = false;
            });
        }

        $scope.previewReceipts = function () {
            var tagUrl = 'apiv4/public/researchprovider/getinvestorsreceipts';
            var params = { dcdata: $scope.dcdata};

            RequestDetail.getDetail(tagUrl, params).then(function (result) {
                $scope.investorscontacts = result.data;
                $scope.showModalcontacts = true;
            });
        }


        $scope.removethisemail = function (id) {
            $scope.dcdata.removedids.push(id);
            angular.forEach($scope.investorscontactlists, function (data,key) {
                if($scope.dcdata.removedids.indexOf(data.investor_contacts_id)>=0){
                    $scope.investorscontactlists[key].addedstatus = 0;
                }
            });
            $scope.totalcontsaddedcount = $scope.totalcontsaddedcount - 1;
        }

        $scope.Addthisemail = function (id) {
            var index =  $scope.dcdata.removedids.indexOf(id);
            if (index > -1) {
                $scope.dcdata.removedids.splice(index, 1);
            }
            angular.forEach($scope.investorscontactlists, function (data,key) {
                if($scope.investorscontactlists[key].investor_contacts_id==id){
                    $scope.investorscontactlists[key].addedstatus = 1;
               }
            });
            $scope.totalcontsaddedcount = $scope.totalcontsaddedcount + 1;
        }
        

        $scope.selectallemail = function () {
            angular.forEach($scope.investorscontactlists, function (data,key) {
                    $scope.investorscontactlists[key].addedstatus = 1;
            });
            $scope.dcdata.removedids = [];
            $scope.totalcontsaddedcount = $scope.totalcontscount;
        }
 
        $scope.unselectallemail = function () {
            $scope.dcdata.removedids = [];
            angular.forEach($scope.investorscontactlists, function (data,key) {
                $scope.investorscontactlists[key].addedstatus = 0;
                $scope.dcdata.removedids.push($scope.investorscontactlists[key].investor_contacts_id);
            });
            $scope.totalcontsaddedcount = 0;
        }


        $scope.closepopup = function () {
            $scope.showModalcontactsedit = false;
            $scope.showModalcontacts = false;
        }
        
        
        if($scope.user_type==2){
            $scope.availableDistribute = ['Ideas','Events'];
        }

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


        $scope.availableIndustry = [];
        $scope.availableIndustry_sector = [];
        var tagUrl = 'apiv4/public/user/get_industries_Mid_macro';
        RequestDetail.getDetail(tagUrl, params).then(function (result) {
            if (angular.isDefined(result.data)) {
                $scope.availableIndustry = result.data.industries_macro;
                $scope.availableIndustry_sector = result.data.industries_sectors;
            } else {
                $scope.availableIndustry = [];
                $scope.availableIndustry_sector = [];
            }
        });
        
        $scope.onSelecteddistribute = function () {
            if($scope.dcdata.mailer_type==2){
                $scope.dcdata.distribute = [];
                $scope.dcdata.distribute.push('Ideas');
                angular.forEach($scope.ideas, function (data,key) {
                    $scope.ideas[key].selected = 0;
                });
            }
        }

        $scope.dcdata.distributefiles = [];

        $scope.uploaddistributeFile = function (imgdata) {
            var obj = JSON.parse(imgdata);

            $scope.$apply(function () {
                $scope.dcdata.distributefiles.push({
                    file_name: obj.name,
                    file_location: 'uploads/distributecontent/' + obj.uploadedname
                });
            });

        }
        $scope.removeFiles = function (index) {
            $scope.dcdata.distributefiles.splice(index, 1);
        }


        $scope.dcdata.distributedisclaimers = [];

        $scope.uploaddistributeDisclaimers = function (imgdata) {
            $scope.dcdata.distributedisclaimers = [];

            var obj = JSON.parse(imgdata);
            $scope.$apply(function () {
                $scope.dcdata.distributedisclaimers.push({
                    file_name: obj.name,
                    file_location: 'uploads/distributecontent/' + obj.uploadedname
                })
            });

        }
        $scope.removeFilesdisclimers = function (index) {
            $scope.dcdata.distributedisclaimers.splice(index, 1);
        }

        $scope.showModalpagepreview = false;

        $scope.ideas = [];
        $scope.total_page = 1;
        $scope.page = 1;
        $scope.getideas = function (page) {

            if($scope.search_txt){
                page = 1;
            }

            var getdailyDetail = 'apiv4/public/researchprovider/getideas';
            var params = {page:page,search_txt:$scope.search_txt};
            RequestDetail.getDetail(getdailyDetail, params).then(function (result) {
                //$scope.ideas = result.data;
               
                if(page==1){
                    $scope.ideas = [];
                    $scope.total_page =  result.data.total_page;
                }
                angular.forEach(result.data.ideas,function(col,index){
                    $scope.ideas.push(col);
                    if (angular.isDefined($routeParams.distributeId) && $routeParams.distributeId != '') {
                        if($scope.dcdata.editideas_ids){
                            if($scope.dcdata.editideas_ids.split(',')){
                                angular.forEach($scope.dcdata.editideas_ids.split(','), function (selecteddata,key2) {
                                    if(col.ideas_id==selecteddata){
                                        $scope.ideas[index].selected = 1;
                                    }
                                });
                            }
                        }
                    }
                });
                if($scope.total_page>=result.data.page){
                    $scope.page = result.data.page;
                }

            });
        }
        $scope.getideas(1);

        
        $scope.searchtxtchag = function () {
            if($scope.search_txt==''){
                $scope.getideas(1);
            }
        }

        $scope.checkemailval = function (email) {
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(String(email).toLowerCase());
		}

        

       
       

        $scope.dashboardList = [];

        $scope.getlist = function () {
            var url = 'apiv4/public/researchprovider/dashboardlist';
            var params = {};
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.dashboardList = result.data;
                if(result.data.length>0){
                    $scope.domain_url = result.data[0]['domain_url'];
                }
                $scope.dcdata.distribute = [];
            });
        }


        $scope.getlist();

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

        var user_data = localStorageService.get('userdata');
        $scope.user_id = user_data.user_id;


        if($routeParams.email){
            $scope.dcdata.email = $routeParams.email;
        }

        

        if (angular.isDefined($routeParams.distributeId) && $routeParams.distributeId != '') {

			var url = 'apiv4/public/researchprovider/getdistribute';
			var params = {
				distribute_id: $routeParams.distributeId
			};

			RequestDetail.getDetail(url, params).then(function (result) {
				if (angular.isDefined(result.data) && result.data != 0) {

                    $scope.spinnerActive = true;

                    $scope.dcdata.title = result.data.title;
                    if($routeParams.email){
                      $scope.dcdata.title = 'Re: '+$scope.dcdata.title;
                    }
                    $scope.dcdata.description = result.data.description;
                    $scope.dcdata.mailer_type = result.data.mailer_type;
                    $scope.dcdata.email = result.data.email;
                    $scope.dcdata.removedids = result.data.removedids.split(',');

                    $scope.dcdata.list_type = result.data.list_type;

                    if(result.data.includecompanylogo){ 
                        $scope.dcdata.includecompanylogo = true;
                    }
                    if(result.data.includeunsubscribelink){ 
                        $scope.dcdata.includeunsubscribelink = true;
                    }

                    if($routeParams.email){
                        $scope.dcdata.email = $routeParams.email;
                    }else{
                        if(result.data.investerslists){
                            $scope.dcdata.addinvesterslists = result.data.investerslists.split(',');
                        }
                    } 
                   
                    if(result.data.distribute){
                        $scope.dcdata.distribute = result.data.distribute.split(',');
                    }

                    $scope.dcdata.distributefiles = result.data.distributefiles;


                    $scope.stamptimes = [];

                     
                    var tagUrl = 'apiv4/public/researchprovider/getdistributetimes';
                    var params = { date: result.data.send_date};
                    RequestDetail.getDetail(tagUrl, params).then(function (result) {
                        $scope.stamptimes = result.data;
                    });
                    
                    if(result.data.tickers){
                        $scope.dcdata.tickers = result.data.tickers.split(',');
                    }
                    if(result.data.industry_tag){
                        $scope.dcdata.industry_tag = result.data.industry_tag.split(',');
                    }
                    if(result.data.keywords){
                        $scope.dcdata.sectors = result.data.keywords.split(',');
                    }

                    if(result.data.disclaimers_file && result.data.disclaimers_location){
                        $scope.dcdata.distributedisclaimers.push({
                            file_name: result.data.disclaimers_file,
                            file_location: result.data.disclaimers_location
                        });
                    }
                    
                    $scope.dcdata.editideas_ids =  result.data.ideas_ids;

                    angular.forEach($scope.ideas, function (data,key1) {
                        if(result.data.ideas_ids){
                            if(result.data.ideas_ids.split(',')){
                                angular.forEach(result.data.ideas_ids.split(','), function (selecteddata,key2) {
                                    if(data.ideas_id==selecteddata){
                                        $scope.ideas[key1].selected = 1;
                                    }
                                });
                            }
                        }
                        
                    }); 
                    
                    $scope.spinnerActive = false;

				}
			});
        }
        
        if (angular.isDefined($routeParams.filterStatus) && $routeParams.filterStatus != '') {
            
			var url = 'apiv4/public/researchprovider/getdistributeusersstatus';
			var params = {
                filterStatus: $routeParams.filterStatus,
                distribute_id: $routeParams.distributeId
            };
            RequestDetail.getDetail(url, params).then(function (result) {
                    $scope.spinnerActive = true;

                    angular.forEach($scope.dcdata.addinvesterslists, function (data,key) { 
                        
                        var tagUrl = 'apiv4/public/researchprovider/getinvestorslist';

                        var params = { investor: data};
            
                        RequestDetail.getDetail(tagUrl, params).then(function (list) {
                           
                            angular.forEach(list.data, function (datalist,keylist) {
                                var remove = 1;
                                angular.forEach(result.data, function (dataadd,keyadd) { 
                                   if(dataadd.email==datalist.email){
                                        remove = 0;
                                   }
                                });
                                if(remove){
                                    $scope.dcdata.removedids.push(datalist.investor_contacts_id);
                                }
                            });
                           
                        });

                        

                    });

                    $scope.spinnerActive = false;

                    
            });
        }

        if (angular.isDefined($routeParams.email) && $routeParams.email != '') {
            $scope.dcdata.email = $routeParams.email;
        }
        


        $scope.selectdistributeall = function () {
            if($scope.dcdata.mailer_type==2){
                alertService.add("warning", "Mailer type single idea!", 2000);
                return false;
            }
            angular.forEach($scope.dashboardList, function (data,key) {
                $scope.dashboardList[key].selected = 1;
            });
            angular.forEach($scope.ideas, function (data,key) {
                $scope.ideas[key].selected = 1;
            });
            angular.forEach($scope.eventlist.my_events, function (data,key) {
                $scope.eventlist.my_events[key].selected = 1;
            });
        }
        $scope.unselectdistributeall = function () {
            angular.forEach($scope.dashboardList, function (data,key) {
                $scope.dashboardList[key].selected = 0;
            });
            angular.forEach($scope.ideas, function (data,key) {
                $scope.ideas[key].selected = 0;
            });
            angular.forEach($scope.eventlist.my_events, function (data,key) {
                $scope.eventlist.my_events[key].selected = 0;
            });
        }


        $scope.adddashboards = function (index) {
            $scope.dashboardList[index].selected = 1;
        }
        $scope.removeddashboards = function (index) {
            $scope.dashboardList[index].selected = 0;
        }
        
        $scope.addideas = function (index) {
            if($scope.dcdata.mailer_type==2){
                angular.forEach($scope.ideas, function (data,key) {
                    $scope.ideas[key].selected = 0;
                });
            }
            $scope.ideas[index].selected = 1;
        }
        $scope.removedideas = function (index) {
            if($scope.dcdata.mailer_type==2){
                angular.forEach($scope.ideas, function (data,key) {
                    $scope.ideas[key].selected = 0;
                });
            }
            $scope.ideas[index].selected = 0;
        }

        $scope.removeevents = function (index) {
            $scope.eventlist.my_events[index].selected = 0;
        }
        $scope.addevents = function (index) {
            $scope.eventlist.my_events[index].selected = 1;
        }
        

       
        $scope.confirmmail = function (type_send) {
            res =1;
            if($scope.dcdata.mailer_type==1){
                if (angular.isUndefined($scope.dcdata.title) || $scope.dcdata.title == '') {
                    alertService.add("warning", "Please enter title !", 2000);
                    return false;
                }
                if (angular.isUndefined($scope.dcdata.description) || $scope.dcdata.description == '') {
                    alertService.add("warning", "Please enter description !", 2000);
                    return false;
                }
            }
            
            if($scope.user_type==3){
              /*  if ($scope.dcdata.distribute.length == 0) {
                    alertService.add("warning", "Please select distribute !", 2000);
                    return false;
                }*/
            }

            if($scope.dcdata.list_type!=6){
                if (angular.isUndefined($scope.dcdata.email) || $scope.dcdata.email == '') {
                    if ($scope.dcdata.addinvesterslists.length == 0) {
                        alertService.add("warning", "Please enter email or select distribution list !", 2000);
                        return false;
                    }
                    
                }
            }

           // //console.log($scope.send_type);
            if($scope.dcdata.send_type==2){
               // //console.log($scope.send_type);
                if (angular.isUndefined($scope.dcdata.send_date) || $scope.dcdata.send_date == '') {
                    alertService.add("warning", "Please select date !", 2000);
                    return false;
                }
               
                if (angular.isUndefined($scope.dcdata.send_time) || $scope.dcdata.send_time == '') {
                    alertService.add("warning", "Please select time !", 2000);
                    return false;
                }
            }
            var res = 1;

           
            if ($scope.dcdata.email != '' && !angular.isUndefined($scope.dcdata.email)) {
                
                var emails = $scope.dcdata.email.split(',');
                angular.forEach(emails, function (email) {
                    if (!$scope.checkemailval(email.trim())) {
                        alertService.add("warning", "Please enter valid emails separated by comma!", 2000);
                        res = 0;
                        return false;
                    }
                });
                
            }

            if($scope.dcdata.list_type==7){
                if ($scope.dcdata.addinvesterslists.length == 0) {
                    if (angular.isUndefined($scope.dcdata.email) || $scope.dcdata.email == '') {
                        alertService.add("warning", "Please enter email or select distribution list  !", 2000);
                        return false;
                    }
                    /*else{
                        
                       if(!$scope.checkemailval($scope.dcdata.email)){
                            alertService.add("warning", "Please Enter Valid Email !", 2000);
                            return false;
                       }
                    }*/
                }
            }
           
            

            if($scope.dcdata.mailer_type==2){
                $scope.idea_count = 1;
                angular.forEach($scope.ideas, function (data,key) {
                   if($scope.ideas[key].selected){
                     $scope.idea_count = 0;
                   }
                });

                if($scope.idea_count){
                    alertService.add("warning", "Please select idea !", 2000);
                    return false;
                }

            }
          
            if(!$scope.dcdata.includecompanylogo){
                $scope.dcdata.addlogostate = 0;
            }

            if($scope.dcdata.includeunsubscribelink){
                $scope.dcdata.addunsubscribelinkstate = 1;
            }

            if(res){
                $scope.spinnerActive = true;

                if(type_send==2){
                    var url = 'apiv4/public/researchprovider/adddistribute';
                }else if(type_send==1 || type_send==4){
                    var url = 'apiv4/public/researchprovider/savedistribute';
                }
               
                var params = { dcdata: $scope.dcdata, ideas: $scope.ideas, dashboardList: $scope.dashboardList, my_events: $scope.eventlist.my_events };
                RequestDetail.getDetail(url, params).then(function (result) {
                    alertService.add("success", "Saved Successfully !", 2000);
                    $scope.dcdata = {};
                    $scope.dcdata.distribute = [];
                    $scope.dcdata.distribute.push('Ideas');
                    $scope.showModalpagepreview = false;
                    $scope.spinnerActive = false;

                    if(type_send==2){
                        alertService.add("success", "Sent Successfully !", 2000);
                        $location.path('distributeanalytics/history');
                    }else if(type_send==1){
                        alertService.add("success", "Saved Successfully !", 2000);
                        $location.path('distributeContent/edit/'+result.data.distribute_content_id_url);
                    }else if(type_send==4){
                        alertService.add("success", "Saved Successfully !", 2000);
                        $window.open('#/distributeContent/preview/'+result.data.distribute_content_id_url, '_blank');
                        $location.path('distributeContent/edit/'+result.data.distribute_content_id_url);
                    }
                    
                

                // $timeout(function(){
                    //    $route.reload();
                // }, 1000);
                });
            }
            
        }

        $scope.dcdata.distribute = [];
        $scope.dcdata.distribute.push('Ideas');

        //console.log($scope.dcdata);

    })
    .controller('editDContent', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails,$route) {
        $scope.configdetails = configdetails;
        $scope.openmodelpagehelp = function () {
            $scope.showModalpageinfo = !$scope.showModalpageinfo;
        }
        $scope.sidepopupactive = false;

        $scope.sidepopup = function () {
            $scope.sidepopupactive = !$scope.sidepopupactive;
        }

        $scope.distributeId = $routeParams.distributeId;



        $scope.dcdata = {};
        $scope.dcdata.distribute = [];

        $scope.senderfromemail = '';
        $scope.senderfromcompany = '';

        var tagUrl = 'apiv4/public/researchprovider/getsenderemail';
        var params = {};
        RequestDetail.getDetail(tagUrl, params).then(function (result) {
            $scope.senderfromemail = result.data.fromuseremail;
            $scope.senderfromcompany = result.data.fromcompanyname;
        });

        $scope.confirmBeforesend = false;
        $scope.sideconfirmBeforesend = function () {

            res =1;
            if($scope.dcdata.mailer_type==1){
                if (angular.isUndefined($scope.dcdata.title) || $scope.dcdata.title == '') {
                    alertService.add("warning", "Please enter title !", 2000);
                    return false;
                }
                if (angular.isUndefined($scope.dcdata.description) || $scope.dcdata.description == '') {
                    alertService.add("warning", "Please enter description !", 2000);
                    return false;
                }
            }
            
            if($scope.user_type==3){
              /*  if ($scope.dcdata.distribute.length == 0) {
                    alertService.add("warning", "Please select distribute !", 2000);
                    return false;
                }*/
            }

            if($scope.dcdata.list_type!=6 && $scope.dcdata.list_type!=8){
                if (angular.isUndefined($scope.dcdata.email) || $scope.dcdata.email == '') {
                    if ($scope.dcdata.addinvesterslists.length == 0) {
                        alertService.add("warning", "Please enter email or select distribution list !", 2000);
                        return false;
                    }
                    
                }
            }

           // //console.log($scope.send_type);
            if($scope.dcdata.send_type==2){
               // //console.log($scope.send_type);
                if (angular.isUndefined($scope.dcdata.send_date) || $scope.dcdata.send_date == '') {
                    alertService.add("warning", "Please select date !", 2000);
                    return false;
                }
               
                if (angular.isUndefined($scope.dcdata.send_time) || $scope.dcdata.send_time == '') {
                    alertService.add("warning", "Please select time !", 2000);
                    return false;
                }
            }
            var res = 1;

           
            if ($scope.dcdata.email != '' && !angular.isUndefined($scope.dcdata.email)) {
                
                var emails = $scope.dcdata.email.split(',');
                angular.forEach(emails, function (email) {
                    if (!$scope.checkemailval(email.trim())) {
                        alertService.add("warning", "Please enter valid emails separated by comma!", 2000);
                        res = 0;
                        return false;
                    }
                });
                
            }

            if($scope.dcdata.list_type!=6){
                if ($scope.dcdata.addinvesterslists.length == 0) {
                    if (angular.isUndefined($scope.dcdata.email) || $scope.dcdata.email == '') {
                        alertService.add("warning", "Please enter email or select distribution list  !", 2000);
                        return false;
                    }
                    /*else{
                        
                       if(!$scope.checkemailval($scope.dcdata.email)){
                            alertService.add("warning", "Please Enter Valid Email !", 2000);
                            return false;
                       }
                    }*/
                }
            }
           
            

            if($scope.dcdata.mailer_type==2){
				if ($scope.dcdata.distribute.length == 0) {
                    alertService.add("warning", "Please select distribute !", 2000);
                    return false;
                }
                if ($scope.ideas.length == 0) {
                    alertService.add("warning", "Please select idea !", 2000);
                    return false;
                }									   
                $scope.idea_count = 1;
                angular.forEach($scope.ideas, function (data,key) {
                   if($scope.ideas[key].selected){
                     $scope.idea_count = 0;
                   }
                });

                if($scope.idea_count){
                    alertService.add("warning", "Please select idea !", 2000);
                    return false;
                }

            }
          
            if(!$scope.dcdata.includecompanylogo){
                $scope.dcdata.addlogostate = 0;
            }

            if($scope.dcdata.includeunsubscribelink){
                $scope.dcdata.addunsubscribelinkstate = 1;
            }

            if(res){
                $scope.confirmBeforesend = true;
            }
        }

         

        $scope.closeconfirmBeforesend = function () {
            $scope.confirmBeforesend = false;
        }

        $scope.dcdata.ideas_ids = '';

       // $scope.dcdata.list_type = '7';
        //$scope.dcdata.list_distribute_status = 1;

        $scope.list_typechange = function () {
           if($scope.dcdata.list_type==7){
                $scope.dcdata.list_distribute_status = 1;
           }else{
                $scope.dcdata.list_distribute_status = 0;
                $scope.dcdata.filtertickers = '';
                $scope.dcdata.addinvesterslists = [];
                $scope.dcdata.sectors = [];
                $scope.dcdata.industry_tag = [];
                $scope.dcdata.tickers = [];
           }
        }

        $scope.dcdata.removedids = [];

        $scope.dcdata.mailer_type = '1';

        $scope.dcdata.includecompanylogo = true;
        $scope.dcdata.includeunsubscribelink = false;

        $scope.dcdata.trigger = '';
        $scope.dcdata.addlogostate = 1;
        $scope.dcdata.addunsubscribelinkstate = 0;

        $scope.availableDistribute = ['Ideas','Events','Dashboards'];
        
        $scope.user_data = localStorageService.get('userdata');

        $scope.user_type = $scope.user_data.user_type;
        $scope.dcdata.addinvesterslists = [];
        
        $scope.mailer_typechange = function () {
            if($scope.dcdata.mailer_type==2){
                $scope.availableDistribute = ['Ideas'];
                $scope.dcdata.distribute = [];
                $scope.dcdata.distribute.push('Ideas');
                angular.forEach($scope.ideas, function (data,key) {
                    $scope.ideas[key].selected = 0;
                });
            }else{
                $scope.availableDistribute = ['Ideas','Events','Dashboards'];
            }
           
        }

        $scope.investers = '';

        var tagUrl = 'apiv4/public/dashboard/getInvestorsList';
        var params = { key: 'tags' };
        RequestDetail.getDetail(tagUrl, params).then(function (result) {
            $scope.investerslist = {};
            $scope.investerslist = result.data;
        });
        $scope.selectinvestors = function (selected) {
            if (selected != undefined) {
                $scope.investers = selected.title;
            }
        }


        $scope.clearsearchideas = function () {
            $scope.search_txt = '';
            $scope.getideas(1);
        }	
        $scope.addinvesterlist = function () {
            if ($scope.investers != '') {
                if ($scope.dcdata.addinvesterslists.indexOf($scope.investers) == -1) {
                    
                    $scope.dcdata.addinvesterslists.push($scope.investers);
                    $scope.investers = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagInvestor');
                } else {
                    alertService.add("warning", "Already entered this item!", 2000);
                    $scope.investersgrp = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagInvestor');
                }
            }
        }

        $scope.dcdata.send_type = '1';
        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.dateOptions = {
            // dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
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

        $scope.removeInvester = function (index) {
            $scope.dcdata.addinvesterslists.splice(index, 1);
        }

        $scope.showcontactsedit = function (editinvester,index) {
            $scope.spinnerActive = true;
            var tagUrl = 'apiv4/public/researchprovider/getinvestorslist';

            var params = { investor: editinvester};

            RequestDetail.getDetail(tagUrl, params).then(function (result) {

                $scope.investorscontactlists = result.data;
                angular.forEach($scope.investorscontactlists, function (data,key) {
                    if($scope.dcdata.removedids.indexOf(data.investor_contacts_id)>=0){
                        $scope.investorscontactlists[key].addedstatus = 0;
                    }else{
                        $scope.investorscontactlists[key].addedstatus = 1;
                    }
                   
                });

                $scope.showModalcontactsedit = true;

                $scope.spinnerActive = false;
            });
        }

        $scope.previewReceipts = function () {
            var tagUrl = 'apiv4/public/researchprovider/getinvestorsreceipts';
            var params = { dcdata: $scope.dcdata};

            RequestDetail.getDetail(tagUrl, params).then(function (result) {
                $scope.investorscontacts = result.data;
                $scope.showModalcontacts = true;
            });
        }


        $scope.removethisemail = function (id) {
            
            $scope.dcdata.removedids.push(id);
            angular.forEach($scope.investorscontactlists, function (data,key) {
                if($scope.dcdata.removedids.indexOf(data.investor_contacts_id)>=0){
                    $scope.investorscontactlists[key].addedstatus = 0;
                }
            });
        }

        $scope.Addthisemail = function (id) {
           
            var index =  $scope.dcdata.removedids.indexOf(id);
            if (index > -1) {
                $scope.dcdata.removedids.splice(index, 1);
            }
           
            angular.forEach($scope.investorscontactlists, function (data,key) {
                if($scope.investorscontactlists[key].investor_contacts_id==id){
                    $scope.investorscontactlists[key].addedstatus = 1;
               }
            });
        }
        

        $scope.selectallemail = function () {
            angular.forEach($scope.investorscontactlists, function (data,key) {
                    $scope.investorscontactlists[key].addedstatus = 1;
            });
            $scope.dcdata.removedids = [];
        }
 
        $scope.unselectallemail = function () {
            $scope.dcdata.removedids = [];
            angular.forEach($scope.investorscontactlists, function (data,key) {
                $scope.investorscontactlists[key].addedstatus = 0;
                $scope.dcdata.removedids.push($scope.investorscontactlists[key].investor_contacts_id);
            });
        }


        $scope.closepopup = function () {
            $scope.showModalcontactsedit = false;
            $scope.showModalcontacts = false;
        }
        
        
        if($scope.user_type==2){
            $scope.availableDistribute = ['Ideas','Events'];
        }

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


        $scope.availableIndustry = [];
        $scope.availableIndustry_sector = [];
        var tagUrl = 'apiv4/public/user/get_industries_Mid_macro';
        RequestDetail.getDetail(tagUrl, params).then(function (result) {
            if (angular.isDefined(result.data)) {
                $scope.availableIndustry = result.data.industries_macro;
                $scope.availableIndustry_sector = result.data.industries_sectors;
            } else {
                $scope.availableIndustry = [];
                $scope.availableIndustry_sector = [];
            }
        });
        
        $scope.onSelecteddistribute = function () {
            if($scope.dcdata.mailer_type==2){
                $scope.dcdata.distribute = [];
                $scope.dcdata.distribute.push('Ideas');
                angular.forEach($scope.ideas, function (data,key) {
                    $scope.ideas[key].selected = 0;
                });
            }
        }

        $scope.dcdata.distributefiles = [];

        $scope.uploaddistributeFile = function (imgdata) {
            var obj = JSON.parse(imgdata);

            $scope.$apply(function () {
                $scope.dcdata.distributefiles.push({
                    file_name: obj.name,
                    file_location: 'uploads/distributecontent/' + obj.uploadedname
                });
            });

        }
        $scope.removeFiles = function (index) {
            $scope.dcdata.distributefiles.splice(index, 1);
        }


        $scope.dcdata.distributedisclaimers = [];

        $scope.uploaddistributeDisclaimers = function (imgdata) {
            $scope.dcdata.distributedisclaimers = [];

            var obj = JSON.parse(imgdata);
            $scope.$apply(function () {
                $scope.dcdata.distributedisclaimers.push({
                    file_name: obj.name,
                    file_location: 'uploads/distributecontent/' + obj.uploadedname
                })
            });

        }
        $scope.removeFilesdisclimers = function (index) {
            $scope.dcdata.distributedisclaimers.splice(index, 1);
        }

        $scope.showModalpagepreview = false;

        $scope.ideas = [];
        $scope.total_page = 1;
        $scope.page = 1;
        $scope.getideas = function (page) {
            if($scope.search_txt){
                page = 1;
            }
            
            var getdailyDetail = 'apiv4/public/researchprovider/getideas';
            var params = {page:page};
            RequestDetail.getDetail(getdailyDetail, params).then(function (result) {
                //$scope.ideas = result.data;

                if(page==1){
                    $scope.total_page =  result.data.total_page;
                    $scope.ideas = [];
                }
                angular.forEach(result.data.ideas,function(col,index){
                    $scope.ideas.push(col);
                });
                

                if($scope.total_page>=result.data.page){
                   // $scope.getideas(page+1);
                    $scope.page = result.data.page;
                }

                angular.forEach($scope.ideas, function (data,key1) {
                    if($scope.dcdata.ideas_ids){
                        if($scope.dcdata.ideas_ids.split(',')){
                            angular.forEach($scope.dcdata.ideas_ids.split(','), function (selecteddata,key2) {
                                if(data.ideas_id==selecteddata){
                                    $scope.ideas[key1].selected = 1;
                                }
                            });
                        }
                    }
                });  

            });
        }
        

        $scope.checkemailval = function (email) {
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(String(email).toLowerCase());
		}

        $scope.adddistribtecontent = function () {


            if($scope.dcdata.mailer_type==1){
                if (angular.isUndefined($scope.dcdata.title) || $scope.dcdata.title == '') {
                    alertService.add("warning", "Please enter title !", 2000);
                    return false;
                }
                if (angular.isUndefined($scope.dcdata.description) || $scope.dcdata.description == '') {
                    alertService.add("warning", "Please enter description !", 2000);
                    return false;
                }
            }
            if($scope.user_type==3){
               /* if ($scope.dcdata.distribute.length == 0) {
                    alertService.add("warning", "Please select distribute !", 2000);
                    return false;
                }*/
            }
            if (angular.isUndefined($scope.dcdata.email) || $scope.dcdata.email == '') {
                if ($scope.dcdata.addinvesterslists.length == 0) {
                    alertService.add("warning", "Please enter email or select distribution list !", 2000);
                    return false;
                }
                
            }

           // //console.log($scope.send_type);
            if($scope.dcdata.send_type==2){
               // //console.log($scope.send_type);
                if (angular.isUndefined($scope.dcdata.send_date) || $scope.dcdata.send_date == '') {
                    alertService.add("warning", "Please select date !", 2000);
                    return false;
                }
               
                if (angular.isUndefined($scope.dcdata.send_time) || $scope.dcdata.send_time == '') {
                    alertService.add("warning", "Please select time !", 2000);
                    return false;
                }
            }
            var res = 1;

           
            if ($scope.dcdata.email != '' && !angular.isUndefined($scope.dcdata.email)) {
                
                var emails = $scope.dcdata.email.split(',');
                angular.forEach(emails, function (email) {
                    if (!$scope.checkemailval(email)) {
                        alertService.add("warning", "Please enter valid emails separated by comma!", 2000);
                        res = 0;
                        return false;
                    }
                });
                
            }

           
            if ($scope.dcdata.addinvesterslists.length == 0) {
                if (angular.isUndefined($scope.dcdata.email) || $scope.dcdata.email == '') {
                    alertService.add("warning", "Please enter email or select distribution list  !", 2000);
                    return false;
                }
                /*else{
                    
                   if(!$scope.checkemailval($scope.dcdata.email)){
                        alertService.add("warning", "Please Enter Valid Email !", 2000);
                        return false;
                   }
                }*/
            }

            angular.forEach($scope.ideas, function (idea,key) {
                
                if(idea.selected==1){
                   
                    var url = 'apiv4/public/researchprovider/getidedescription';
                    var params = {ideas_id:idea.ideas_id};
                    RequestDetail.getDetail(url, params).then(function (result) {
                        $scope.ideas[key].description = result.data.description;
                    });
                }
            });
            if(res){
                $scope.showModalpagepreview = !$scope.showModalpagepreview;
                
            }
            
        }


       
       

        /*$scope.dashboardList = [];

        $scope.getlist = function () {
            var url = 'apiv4/public/researchprovider/dashboardlist';
            var params = {};
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.dashboardList = result.data;
                if(result.data.length>0){
                    $scope.domain_url = result.data[0]['domain_url'];
                }
                $scope.dcdata.distribute = [];
            });
        }


        $scope.getlist();*/

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

        var user_data = localStorageService.get('userdata');
        $scope.user_id = user_data.user_id;


        /*var profile_contacts = 'apiv4/public/event/eventlist';
        var params = { key: 'contacts', profile_id: $scope.user_id }

        $scope.event_page = 0;
        if (angular.isUndefined($scope.data)) { $scope.data = {}; }

        if (angular.isDefined($scope.data) && angular.isDefined($scope.data.todate) && ($scope.data.todate == null || $scope.data.todate == 'null')) { $scope.data.todate = ''; }
        if (angular.isDefined($scope.data.fromdate) && ($scope.data.fromdate == null || $scope.data.fromdate == 'null')) { $scope.data.fromdate = ''; }

        var frm = new Date($scope.data.fromdate);
        var to = new Date($scope.data.todate);

        if (angular.isUndefined($scope.data.eventtype)) {
            $scope.data.eventtype = [];
        }
        if (angular.isUndefined($scope.data.location)) {
            $scope.data.location = [];
        }
        if (angular.isUndefined($scope.data.industry)) {
            $scope.data.industry = [];
        }
        if (angular.isUndefined($scope.data.ticker)) {
            $scope.data.ticker = [];
        }
        if (angular.isUndefined($scope.data.fromdate) || frm == 'Invalid Date') {
            $scope.data.fromdate = "";
        }
        if (angular.isUndefined($scope.data.todate) || to == 'Invalid Date') {
            $scope.data.todate = "";
        }

        params.eventtype = $scope.data.eventtype;
        if (angular.isUndefined(params.location)) {
            params.location = [];
        };
        angular.forEach($scope.data.location, function (pu) {
            params.location.push(pu.val);
        });
        params.industry = $scope.data.industry;
        params.ticker = $scope.data.ticker;
        params.fromdate = $scope.data.fromdate;
        params.todate = $scope.data.todate;

        RequestDetail.getDetail(profile_contacts, params).then(function (result) {

            if (angular.isDefined(result.data)) {
                var events = result.data;
                if (angular.isUndefined(events) || events == null || events == 'null') {
                    events = {};
                }
                if (angular.isUndefined(events.my_events) || events.my_events == null || events.my_events == 'null') {
                    events.my_events = [];
                }
                if (angular.isUndefined(events.all) || events.all == null || events.all == 'null') {
                    events.all = [];
                }
                if (angular.isUndefined(events.all_events) || events.all_events == null || events.all_events == 'null') {
                    events.all_events = [];
                }
                if (angular.isUndefined(events.live_events) || events.live_events == null || events.live_events == 'null') {
                    events.live_events = [];
                }

                if (angular.isDefined(events.meeting) && events.meeting.length > 0) {
                    angular.forEach(events.meeting, function (data) {
                        var d = new Date(data.date);
                        data.order_date = d.getTime();
                        if (data.accepted == '1') {
                            if (angular.isDefined(events.my_events) && events.my_events != null) {
                                
                                events.my_events.push(data);
                            }
                        }
                    });
                }
                if (angular.isDefined(events.all)) {
                    angular.forEach(events.all, function (datas) {
                        var d = new Date(datas.date);
                        datas.order_date = d.getTime();
                        if (angular.isDefined(datas.todatetime) && datas.todatetime != null) {
                            var f = new Date(datas.todatetime);
                            datas.totime = f.getTime();
                        } if (angular.isDefined(datas.fromdatetime) && datas.fromdatetime != null) {
                            var f = new Date(datas.fromdatetime);
                            datas.fromtime = f.getTime();
                        }
                    })
                }
                

                if (angular.isDefined(events.my_events)) {
                    angular.forEach(events.my_events, function (datas,key) {
                        events.my_events[key].selected = 1;
                        var d = new Date(datas.date);
                        datas.order_date = d.getTime();
                        if (angular.isDefined(datas.todatetime) && datas.todatetime != null) {
                            var f = new Date(datas.todatetime);
                            datas.totime = f.getTime();
                        } if (angular.isDefined(datas.fromdatetime) && datas.fromdatetime != null) {
                            var f = new Date(datas.fromdatetime);
                            datas.fromtime = f.getTime();
                        }
                    })
                }
                $scope.eventlist = events;
                var user_data = localStorageService.get('userdata');
                $scope.user_id = user_data.user_id;
                $scope.event_page = 1;
            }
            $scope.spinnerActive = false;

        });*/


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

            var tagUrl = 'apiv4/public/researchprovider/getdistributetimes';
            var params = { date: dat};
            RequestDetail.getDetail(tagUrl, params).then(function (result) {
                $scope.stamptimes = result.data;
            });
        }

        if (angular.isDefined($routeParams.distributeId) && $routeParams.distributeId != '') {

			var url = 'apiv4/public/researchprovider/getdistribute';
			var params = {
				distribute_id: $routeParams.distributeId
			};

			RequestDetail.getDetail(url, params).then(function (result) {
				if (angular.isDefined(result.data) && result.data != 0) {
                   
                    $scope.dcdata.title = result.data.title;
                    $scope.dcdata.description = result.data.description;
                    $scope.dcdata.mailer_type = result.data.mailer_type;
                    $scope.dcdata.email = result.data.email;
                    ////console.log(result.data.send_date);
                    $scope.dcdata.send_type = result.data.send_type;
                    $scope.dcdata.send_date_selected = result.data.send_date;
                    $scope.dcdata.send_time = result.data.send_time;

                    $scope.dcdata.realsend_date = result.data.send_date;
                    
                    $scope.dcdata.includecompanylogo = false;
                    $scope.dcdata.includeunsubscribelink = false;
                    if(result.data.addlogostate==1){ 
                        $scope.dcdata.includecompanylogo = true;
                    }
                    if(result.data.addunsubscribelinkstate==1){ 
                        $scope.dcdata.includeunsubscribelink = true;
                    }
                   
                    $scope.dcdata.list_type = result.data.list_type;

                    if(result.data.list_type==7){
                        $scope.dcdata.list_distribute_status = 1;
                   }else{
                        $scope.dcdata.list_distribute_status = 0;
                        $scope.dcdata.filtertickers = '';
                        $scope.dcdata.addinvesterslists = [];
                        $scope.dcdata.sectors = [];
                        $scope.dcdata.industry_tag = [];
                        $scope.dcdata.tickers = [];
                   }

                    $scope.dcdata.distributefiles = result.data.distributefiles;

                    if(result.data.investerslists){
                        $scope.dcdata.addinvesterslists = result.data.investerslists.split(',');
                    }
                    if(result.data.removedids){
                        $scope.dcdata.removedids = result.data.removedids.split(',');
                    }
                   
                    $timeout(function () {
                        if(result.data.distribute){
                            $scope.dcdata.distribute = result.data.distribute.split(',');
                        }
                    }, 1000);

                    var tagUrl = 'apiv4/public/researchprovider/getdistributetimes';
                    var params = { date: result.data.send_date};
                    RequestDetail.getDetail(tagUrl, params).then(function (result) {
                        $scope.stamptimes = result.data;
                    });
                    
                    if(result.data.tickers){
                        $scope.dcdata.tickers = result.data.tickers.split(',');
                    }
                    if(result.data.industry_tag){
                        $scope.dcdata.industry_tag = result.data.industry_tag.split(',');
                    }
                    if(result.data.keywords){
                        $scope.dcdata.sectors = result.data.keywords.split(',');
                    }

                    $scope.dcdata.ideas_ids = result.data.ideas_ids;

                    if(result.data.disclaimers_file && result.data.disclaimers_location){
                        $scope.dcdata.distributedisclaimers.push({
                            file_name: result.data.disclaimers_file,
                            file_location: result.data.disclaimers_location
                        });
                    }
                    $scope.getideas(1);
                    $timeout(function () {
                        angular.forEach($scope.ideas, function (data,key1) {
                            if(result.data.ideas_ids){
                                if(result.data.ideas_ids.split(',')){
                                    angular.forEach(result.data.ideas_ids.split(','), function (selecteddata,key2) {
                                        if(data.ideas_id==selecteddata){
                                            $scope.ideas[key1].selected = 1;
                                        }
                                    });
                                }
                            }
                        });  
                    }, 1000);

				}
			});
        }
        


        $scope.selectdistributeall = function () {
            if($scope.dcdata.mailer_type==2){
                alertService.add("warning", "Mailer type single idea!", 2000);
                return false;
            }
            angular.forEach($scope.dashboardList, function (data,key) {
                $scope.dashboardList[key].selected = 1;
            });
            angular.forEach($scope.ideas, function (data,key) {
                $scope.ideas[key].selected = 1;
            });
            angular.forEach($scope.eventlist.my_events, function (data,key) {
                $scope.eventlist.my_events[key].selected = 1;
            });
        }
        $scope.unselectdistributeall = function () {
            angular.forEach($scope.dashboardList, function (data,key) {
                $scope.dashboardList[key].selected = 0;
            });
            angular.forEach($scope.ideas, function (data,key) {
                $scope.ideas[key].selected = 0;
            });
            angular.forEach($scope.eventlist.my_events, function (data,key) {
                $scope.eventlist.my_events[key].selected = 0;
            });
        }


        $scope.adddashboards = function (index) {
            $scope.dashboardList[index].selected = 1;
        }
        $scope.removeddashboards = function (index) {
            $scope.dashboardList[index].selected = 0;
        }
        
        $scope.addideas = function (index) {
            if($scope.dcdata.mailer_type==2){
                angular.forEach($scope.ideas, function (data,key) {
                    $scope.ideas[key].selected = 0;
                });
            }
            $scope.ideas[index].selected = 1;
        }
        $scope.removedideas = function (index) {
            if($scope.dcdata.mailer_type==2){
                angular.forEach($scope.ideas, function (data,key) {
                    $scope.ideas[key].selected = 0;
                });
            }
            $scope.ideas[index].selected = 0;
        }

        $scope.removeevents = function (index) {
            $scope.eventlist.my_events[index].selected = 0;
        }
        $scope.addevents = function (index) {
            $scope.eventlist.my_events[index].selected = 1;
        }
        

       
        $scope.confirmmail = function (type_send) {
          
            $scope.confirmBeforesend = false;
            
            if(!$scope.dcdata.includecompanylogo){
                $scope.dcdata.addlogostate = 0;
            }

            if($scope.dcdata.includeunsubscribelink){
                $scope.dcdata.addunsubscribelinkstate = 1;
            }

            if($scope.dcdata.send_type==2){
                if (angular.isUndefined($scope.dcdata.send_date) || $scope.dcdata.send_date == '') {
                    alertService.add("warning", "Please select date !", 2000);
                    return false;
                }
               
                if (angular.isUndefined($scope.dcdata.send_time) || $scope.dcdata.send_time == '') {
                    alertService.add("warning", "Please select time !", 2000);
                    return false;
                }
                
            }

            if($scope.dcdata.mailer_type==2){
                $scope.idea_count = 1;
                angular.forEach($scope.ideas, function (data,key) {
                   if($scope.ideas[key].selected){
                     $scope.idea_count = 0;
                   }
                });

                if($scope.idea_count){
                    alertService.add("warning", "Please select idea !", 2000);
                    return false;
                }

            }

                /* start*/
            if($scope.dcdata.mailer_type==1){
                if (angular.isUndefined($scope.dcdata.title) || $scope.dcdata.title == '') {
                    alertService.add("warning", "Please enter title !", 2000);
                    return false;
                }
                if (angular.isUndefined($scope.dcdata.description) || $scope.dcdata.description == '') {
                    alertService.add("warning", "Please enter description !", 2000);
                    return false;
                }
            }
            
            if (angular.isUndefined($scope.dcdata.email) || $scope.dcdata.email == '') {
                if ($scope.dcdata.addinvesterslists.length == 0) {
                    alertService.add("warning", "Please enter email or select distribution list !", 2000);
                    return false;
                }
                
            }

           // //console.log($scope.send_type);
            if($scope.dcdata.send_type==2){
               // //console.log($scope.send_type);
                if (angular.isUndefined($scope.dcdata.send_date) || $scope.dcdata.send_date == '') {
                    alertService.add("warning", "Please select date !", 2000);
                    return false;
                }
               
                if (angular.isUndefined($scope.dcdata.send_time) || $scope.dcdata.send_time == '') {
                    alertService.add("warning", "Please select time !", 2000);
                    return false;
                }
            }
            var res = 1;


            //console.log($scope.dcdata.email);

           
            if ($scope.dcdata.email != '' && !angular.isUndefined($scope.dcdata.email)) {
                
                var emails = $scope.dcdata.email.split(',');
                angular.forEach(emails, function (email) {
                    if (!$scope.checkemailval(email)) {
                        alertService.add("warning", "Please enter valid emails separated by comma!", 2000);
                        res = 0;
                        return false;
                    }
                });
                
            }

           
            if ($scope.dcdata.addinvesterslists.length == 0) {
                if (angular.isUndefined($scope.dcdata.email) || $scope.dcdata.email == '') {
                    alertService.add("warning", "Please enter email or select distribution list  !", 2000);
                    return false;
                }
                /*else{
                    
                   if(!$scope.checkemailval($scope.dcdata.email)){
                        alertService.add("warning", "Please Enter Valid Email !", 2000);
                        return false;
                   }
                }*/
            }

             /* end*/


            $scope.spinnerActive = true;
            if(type_send==2){
                var url = 'apiv4/public/researchprovider/adddistribute';
            }else if(type_send==3){
                var url = 'apiv4/public/researchprovider/updatedistribute';
            }
           
            var params = { dcdata: $scope.dcdata, ideas: $scope.ideas, distribute_id: $routeParams.distributeId };
            RequestDetail.getDetail(url, params).then(function (result) {
                
                 
                $scope.dcdata = {};
				$scope.dcdata.distribute = [];
                $scope.showModalpagepreview = false;
                $scope.spinnerActive = false;

               
                if(type_send==2){
                    alertService.add("success", "Sent Successfully !", 2000);
                    $location.path('distributeanalytics/history');
                }else if(type_send==3){
                    alertService.add("success", "Updated Successfully !", 2000);
                    $route.reload();
                }

               //$timeout(function(){
                //    $location.path('distributeanalytics');
                // }, 1000);
            }); 
        }

        


    })
    .controller('corporateeditDContent', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails,$route) {
        $scope.configdetails = configdetails;
        $scope.openmodelpagehelp = function () {
            $scope.showModalpageinfo = !$scope.showModalpageinfo;
        }
        $scope.sidepopupactive = false;

        $scope.sidepopup = function () {
            $scope.sidepopupactive = !$scope.sidepopupactive;
        }

        $scope.distributeId = $routeParams.distributeId;

        $scope.dcdata = {};

        $scope.template = {};
        var rootFolder = 'partials/common/';

        $scope.changeTemplate = function () {
            $scope.template.include = rootFolder + $scope.dcdata.template_type + '.html';

            if($scope.dcdata.template_type=='webinar_template'){
                $scope.dcdata.bgcolor = '#ff0000';
                $scope.dcdata.textcolor= '#ffffff';
            }
            
            if($scope.dcdata.template_type=='webinar_template2'){
                $scope.dcdata.bgcolor = '#ff0000';
                $scope.dcdata.textcolor = '#ffffff';
                $scope.dcdata.headingtextcolor = '#000000';
            }
            
        }
       
        

        $scope.list_typechange = function () {
           if($scope.dcdata.list_type==7){
                $scope.dcdata.list_distribute_status = 1;
           }else{
                $scope.dcdata.list_distribute_status = 0;
                $scope.dcdata.filtertickers = '';
                $scope.dcdata.addinvesterslists = [];
                $scope.dcdata.sectors = [];
                $scope.dcdata.industry_tag = [];
                $scope.dcdata.tickers = [];
           }
        }

        $scope.dcdata.removedids = [];
 
        $scope.dcdata.includecompanylogo = true;
        $scope.dcdata.includeunsubscribelink = false;

        $scope.dcdata.trigger = '';
        $scope.dcdata.addlogostate = 1;
        $scope.dcdata.addunsubscribelinkstate = 0;

        
        $scope.user_data = localStorageService.get('userdata');

        $scope.user_type = $scope.user_data.user_type;
        $scope.dcdata.addinvesterslists = [];
        
        
        $scope.investers = '';

        var tagUrl = 'apiv4/public/dashboard/getInvestorsList';
        var params = { key: 'tags' };
        RequestDetail.getDetail(tagUrl, params).then(function (result) {
            $scope.investerslist = {};
            $scope.investerslist = result.data;
        });
        $scope.selectinvestors = function (selected) {
            if (selected != undefined) {
                $scope.investers = selected.title;
            }
        }
	
        $scope.addinvesterlist = function () {
            if ($scope.investers != '') {
                if ($scope.dcdata.addinvesterslists.indexOf($scope.investers) == -1) {
                    
                    $scope.dcdata.addinvesterslists.push($scope.investers);
                    $scope.investers = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagInvestor');
                } else {
                    alertService.add("warning", "Already entered this item!", 2000);
                    $scope.investersgrp = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagInvestor');
                }
            }
        }

        $scope.dcdata.send_type = '1';
        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.dateOptions = {
            // dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
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

        $scope.removeInvester = function (index) {
            $scope.dcdata.addinvesterslists.splice(index, 1);
        }

        $scope.dcdata.send_type = '1';
        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];


        $scope.dateOptions = {
            // dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date().setDate(new Date().getDate() + 90),
            minDate: new Date().toLocaleString("en-US", {timeZone: "America/New_York"}),
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

            var tagUrl = 'apiv4/public/researchprovider/getdistributetimes';
            var params = { date: dat};
            RequestDetail.getDetail(tagUrl, params).then(function (result) {
                $scope.stamptimes = result.data;
            });
        }

        $scope.open2 = function () {
            $scope.popup2.opened = true;
        };
        $scope.popup2 = {
            opened: false
        };

        $scope.dcdata.real_date = '';
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

            $scope.dcdata.real_date = day + ' ' + monthNames[monthIndex] + ' ' + year;

        }

        $scope.showcontactsedit = function (editinvester,index) {
            $scope.spinnerActive = true;
            var tagUrl = 'apiv4/public/researchprovider/getinvestorslist';

            var params = { investor: editinvester};

            RequestDetail.getDetail(tagUrl, params).then(function (result) {

                $scope.investorscontactlists = result.data;
                angular.forEach($scope.investorscontactlists, function (data,key) {
                    if($scope.dcdata.removedids.indexOf(data.investor_contacts_id)>=0){
                        $scope.investorscontactlists[key].addedstatus = 0;
                    }else{
                        $scope.investorscontactlists[key].addedstatus = 1;
                    }
                   
                });

                $scope.showModalcontactsedit = true;

                $scope.spinnerActive = false;
            });
        }

        $scope.previewReceipts = function () {
            var tagUrl = 'apiv4/public/researchprovider/getinvestorsreceipts';
            var params = { dcdata: $scope.dcdata};

            RequestDetail.getDetail(tagUrl, params).then(function (result) {
                $scope.investorscontacts = result.data;
                $scope.showModalcontacts = true;
            });
        }


        $scope.removethisemail = function (id) {
            
            $scope.dcdata.removedids.push(id);
            angular.forEach($scope.investorscontactlists, function (data,key) {
                if($scope.dcdata.removedids.indexOf(data.investor_contacts_id)>=0){
                    $scope.investorscontactlists[key].addedstatus = 0;
                }
            });
        }

        $scope.Addthisemail = function (id) {
           
            var index =  $scope.dcdata.removedids.indexOf(id);
            if (index > -1) {
                $scope.dcdata.removedids.splice(index, 1);
            }
           
            angular.forEach($scope.investorscontactlists, function (data,key) {
                if($scope.investorscontactlists[key].investor_contacts_id==id){
                    $scope.investorscontactlists[key].addedstatus = 1;
               }
            });
        }
        

        $scope.selectallemail = function () {
            angular.forEach($scope.investorscontactlists, function (data,key) {
                    $scope.investorscontactlists[key].addedstatus = 1;
            });
            $scope.dcdata.removedids = [];
        }
 
        $scope.unselectallemail = function () {
            $scope.dcdata.removedids = [];
            angular.forEach($scope.investorscontactlists, function (data,key) {
                $scope.investorscontactlists[key].addedstatus = 0;
                $scope.dcdata.removedids.push($scope.investorscontactlists[key].investor_contacts_id);
            });
        }


        $scope.closepopup = function () {
            $scope.showModalcontactsedit = false;
            $scope.showModalcontacts = false;
        }


        
        $scope.dcdata.distributefiles = [];

        $scope.uploaddistributeFile = function (imgdata) {
            $scope.dcdata.distributefiles = [];
            var obj = JSON.parse(imgdata);

            $scope.$apply(function () {
                $scope.dcdata.distributefiles.push({
                    file_name: obj.name,
                    file_location: 'uploads/corporate/image/' + obj.uploadedname
                });
            });

        }
        $scope.removeFiles = function (index) {
            $scope.dcdata.distributefiles.splice(index, 1);
        }

        $scope.dcdata.logofiles = [];

        $scope.uploaddistributelogoFile = function (imgdata) {
            $scope.dcdata.logofiles = [];

            var obj = JSON.parse(imgdata);

            $scope.$apply(function () {
                $scope.dcdata.logofiles.push({
                    file_name: obj.name,
                    file_location: 'uploads/corporate/image/' + obj.uploadedname
                });
            });

        }


        $scope.dcdata.distributedisclaimers = [];

        $scope.uploaddistributeDisclaimers = function (imgdata) {
            $scope.dcdata.distributedisclaimers = [];

            var obj = JSON.parse(imgdata);
            $scope.$apply(function () {
                $scope.dcdata.distributedisclaimers.push({
                    file_name: obj.name,
                    file_location: 'uploads/corporate/report/' + obj.uploadedname
                });
            });

        }
       
        $scope.removeFilesdisclimers = function (index) {
            $scope.dcdata.distributedisclaimers.splice(index, 1);
        }

        $scope.showModalpagepreview = false;

         
        $scope.checkemailval = function (email) {
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(String(email).toLowerCase());
		}

        $scope.adddistribtecontent = function () {


            if (angular.isUndefined($scope.dcdata.title) || $scope.dcdata.title == '') {
                alertService.add("warning", "Please enter title !", 2000);
                return false;
            }
             
            if (angular.isUndefined($scope.dcdata.email) || $scope.dcdata.email == '') {
                if ($scope.dcdata.addinvesterslists.length == 0) {
                    alertService.add("warning", "Please enter email or select distribution list !", 2000);
                    return false;
                }
                
            } 
            if($scope.dcdata.send_type==2){ 
                if (angular.isUndefined($scope.dcdata.send_date) || $scope.dcdata.send_date == '') {
                    alertService.add("warning", "Please select date !", 2000);
                    return false;
                }
               
                if (angular.isUndefined($scope.dcdata.send_time) || $scope.dcdata.send_time == '') {
                    alertService.add("warning", "Please select time !", 2000);
                    return false;
                }
            }
            var res = 1;

           
            if ($scope.dcdata.email != '' && !angular.isUndefined($scope.dcdata.email)) {
                
                var emails = $scope.dcdata.email.split(',');
                angular.forEach(emails, function (email) {
                    if (!$scope.checkemailval(email)) {
                        alertService.add("warning", "Please enter valid emails separated by comma!", 2000);
                        res = 0;
                        return false;
                    }
                });
                
            }

           
            if ($scope.dcdata.addinvesterslists.length == 0) {
                if (angular.isUndefined($scope.dcdata.email) || $scope.dcdata.email == '') {
                    alertService.add("warning", "Please enter email or select distribution list  !", 2000);
                    return false;
                }
                 
            } 
            if(res){
                $scope.showModalpagepreview = !$scope.showModalpagepreview;
                
            }
            
        }


      
        var user_data = localStorageService.get('userdata');
        $scope.user_id = user_data.user_id;
 

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

            var tagUrl = 'apiv4/public/researchprovider/getdistributetimes';
            var params = { date: dat};
            RequestDetail.getDetail(tagUrl, params).then(function (result) {
                $scope.stamptimes = result.data;
            });
        }

        if (angular.isDefined($routeParams.distributeId) && $routeParams.distributeId != '') {

			var url = 'apiv4/public/researchprovider/getcorporatedistribute';
			var params = {
				distribute_id: $routeParams.distributeId
			};

			RequestDetail.getDetail(url, params).then(function (result) {
				if (angular.isDefined(result.data) && result.data != 0) {
                   
                    $scope.dcdata.title = result.data.title;
                    $scope.dcdata.template_type = result.data.template_type;

                    $scope.changeTemplate();

                    if($scope.dcdata.template_type=='initiation_report'){
                        $scope.dcdata.management1 = result.data.management1;
                        $scope.dcdata.management2 = result.data.management2;
                        $scope.dcdata.management3 = result.data.management3;
                        $scope.dcdata.investment_thesis = result.data.investment_thesis;
                        $scope.dcdata.corporateticker = result.data.corporateticker;
                        $scope.dcdata.report_file = result.data.report_file;

                        $scope.dcdata.researchprovider = result.data.researchprovider;
                        $scope.dcdata.contactname = result.data.contactname;
                        $scope.dcdata.templateemail = result.data.templateemail;
                    }
                    else if($scope.dcdata.template_type=='webinar_template'){
                        $scope.dcdata.bgcolor = result.data.bgcolor;
                        $scope.dcdata.textcolor  = result.data.textcolor;
                        $scope.dcdata.company_name  = result.data.company_name;
                        $scope.dcdata.webinartitle = result.data.webinartitle;
                        $scope.dcdata.datedetail = result.data.datedetail;
                        $scope.dcdata.link = result.data.link;
                        $scope.dcdata.content = result.data.content;
                    }
                    else if($scope.dcdata.template_type=='webinar_template2'){
                        $scope.dcdata.bgcolor  = result.data.bgcolor;
                        $scope.dcdata.textcolor  = result.data.textcolor;
                        $scope.dcdata.headingtextcolor  = result.data.headingtextcolor;
                        $scope.dcdata.webinartitle  = result.data.webinartitle;
                        $scope.dcdata.what  = result.data.what;
                        $scope.dcdata.when  = result.data.when;
                        $scope.dcdata.registerlink  = result.data.registerlink;
                    }
                   
                    
                    $scope.dcdata.distributefiles = [];
                    $scope.dcdata.distributedisclaimers = [];
                    $scope.dcdata.logofiles = [];
                    
                    $scope.dcdata.distributefiles.push({
                        file_name: 'Logo',
                        file_location: result.data.logo
                    });
                    $scope.dcdata.distributedisclaimers.push({
                        file_name: 'Report',
                        file_location: result.data.report_file
                    });
                    $scope.dcdata.logofiles.push({
                        file_name: 'Report',
                        file_location: result.data.mainlogo
                    });
                    
                    $scope.dcdata.description = result.data.description;
                    

                    $scope.dcdata.email = result.data.email;
                    
                    $scope.dcdata.send_type = result.data.send_type;
                    $scope.dcdata.send_date_selected = result.data.send_date;
                    $scope.dcdata.send_time = result.data.send_time;

                    $scope.dcdata.realsend_date = result.data.send_date;
                    
                    $scope.dcdata.includecompanylogo = false;
                    $scope.dcdata.includeunsubscribelink = false;

                    if(result.data.addlogostate==1){ 
                        $scope.dcdata.includecompanylogo = true;
                    }
                    if(result.data.addunsubscribelinkstate==1){ 
                        $scope.dcdata.includeunsubscribelink = true;
                    }
                   
                    $scope.dcdata.list_type = result.data.list_type;

                    if(result.data.list_type==7){
                        $scope.dcdata.list_distribute_status = 1;
                   }else{
                        $scope.dcdata.list_distribute_status = 0;
                        $scope.dcdata.filtertickers = '';
                        $scope.dcdata.addinvesterslists = [];
                        $scope.dcdata.sectors = [];
                        $scope.dcdata.industry_tag = [];
                        $scope.dcdata.tickers = [];
                   }

                    

                    if(result.data.investerslists){
                        $scope.dcdata.addinvesterslists = result.data.investerslists.split(',');
                    }
                    if(result.data.removedids){
                        $scope.dcdata.removedids = result.data.removedids.split(',');
                    }
                   
                   

                    var tagUrl = 'apiv4/public/researchprovider/getdistributetimes';
                    var params = { date: result.data.send_date};
                    RequestDetail.getDetail(tagUrl, params).then(function (result) {
                        $scope.stamptimes = result.data;
                    });
                    
                     

                   

				}
			});
        }
        


        
       
        $scope.confirmmail = function (type_send) {
          
           
            if(!$scope.dcdata.includecompanylogo){
                $scope.dcdata.addlogostate = 0;
            }

            if($scope.dcdata.includeunsubscribelink){
                $scope.dcdata.addunsubscribelinkstate = 1;
            }

            if($scope.dcdata.send_type==2){
                if (angular.isUndefined($scope.dcdata.send_date) || $scope.dcdata.send_date == '') {
                    alertService.add("warning", "Please select date !", 2000);
                    return false;
                }
               
                if (angular.isUndefined($scope.dcdata.send_time) || $scope.dcdata.send_time == '') {
                    alertService.add("warning", "Please select time !", 2000);
                    return false;
                }
                
            }

           
            if (angular.isUndefined($scope.dcdata.title) || $scope.dcdata.title == '') {
                alertService.add("warning", "Please enter title !", 2000);
                return false;
            }
            
            if($scope.dcdata.template_type=='initiation_report'){
                if (angular.isUndefined($scope.dcdata.management1) || $scope.dcdata.management1 == '') {
                    alertService.add("warning", "Please enter management !", 2000);
                    return false;
                } 
                if ($scope.dcdata.distributefiles.length == 0) {
                    alertService.add("warning", "Please upload logo !", 2000);
                    return false;
                }
                if (angular.isUndefined($scope.dcdata.investment_thesis) || $scope.dcdata.investment_thesis == '') {
                    alertService.add("warning", "Please enter investment thesis !", 2000);
                    return false;
                } 
                if (angular.isUndefined($scope.dcdata.researchprovider) || $scope.dcdata.researchprovider == '') {
                    alertService.add("warning", "Please enter Researchprovider !", 2000);
                    return false;
                }
                if (angular.isUndefined($scope.dcdata.contactname) || $scope.dcdata.contactname == '') {
                    alertService.add("warning", "Please enter Contact name !", 2000);
                    return false;
                }
                if (angular.isUndefined($scope.dcdata.templateemail) || $scope.dcdata.templateemail == '') {
                    alertService.add("warning", "Please enter Email !", 2000);
                    return false;
                }
                if (angular.isUndefined($scope.dcdata.corporateticker) || $scope.dcdata.corporateticker == '') {
                    alertService.add("warning", "Please enter ticker !", 2000);
                    return false;
                } 
                if (angular.isUndefined($scope.dcdata.description) || $scope.dcdata.description == '') {
                    alertService.add("warning", "Please enter executive summary !", 2000);
                    return false;
                } 
                if ($scope.dcdata.distributedisclaimers.length == 0) {
                    alertService.add("warning", "Please upload report !", 2000);
                    return false;
                }
            }
            if($scope.dcdata.template_type=='webinar_template'){
                if (angular.isUndefined($scope.dcdata.date) || $scope.dcdata.date == '') {
                    alertService.add("warning", "Please enter date !", 2000);
                    return false;
                } 
                if (angular.isUndefined($scope.dcdata.bgcolor) || $scope.dcdata.bgcolor == '') {
                    alertService.add("warning", "Please enter bgcolor !", 2000);
                    return false;
                } 
                if (angular.isUndefined($scope.dcdata.textcolor) || $scope.dcdata.textcolor == '') {
                    alertService.add("warning", "Please enter text color !", 2000);
                    return false;
                } 
                if ($scope.dcdata.distributefiles.length == 0) {
                    alertService.add("warning", "Please upload logo !", 2000);
                    return false;
                }
                if (angular.isUndefined($scope.dcdata.company_name) || $scope.dcdata.company_name == '') {
                    alertService.add("warning", "Please enter company name !", 2000);
                    return false;
                } 
                if (angular.isUndefined($scope.dcdata.webinartitle) || $scope.dcdata.webinartitle == '') {
                    alertService.add("warning", "Please enter webinar title !", 2000);
                    return false;
                } 
                if (angular.isUndefined($scope.dcdata.datedetail) || $scope.dcdata.datedetail == '') {
                    alertService.add("warning", "Please enter date detail !", 2000);
                    return false;
                } 
                if (angular.isUndefined($scope.dcdata.description) || $scope.dcdata.description == '') {
                    alertService.add("warning", "Please enter content !", 2000);
                    return false;
                } 
                if ($scope.dcdata.speakers.length == 0) {
                    alertService.add("warning", "Please add speaker !", 2000);
                    return false;
                }
                
            }
            if($scope.dcdata.template_type=='webinar_template2'){
                if (angular.isUndefined($scope.dcdata.date) || $scope.dcdata.date == '') {
                    alertService.add("warning", "Please enter date !", 2000);
                    return false;
                } 
                if (angular.isUndefined($scope.dcdata.bgcolor) || $scope.dcdata.bgcolor == '') {
                    alertService.add("warning", "Please enter bgcolor !", 2000);
                    return false;
                } 
                if (angular.isUndefined($scope.dcdata.textcolor) || $scope.dcdata.textcolor == '') {
                    alertService.add("warning", "Please enter text color !", 2000);
                    return false;
                } 
                if (angular.isUndefined($scope.dcdata.headingtextcolor) || $scope.dcdata.headingtextcolor == '') {
                    alertService.add("warning", "Please enter heading text color !", 2000);
                    return false;
                } 
                if ($scope.dcdata.distributefiles.length == 0) {
                    alertService.add("warning", "Please upload logo !", 2000);
                    return false;
                }
                if (angular.isUndefined($scope.dcdata.webinartitle) || $scope.dcdata.webinartitle == '') {
                    alertService.add("warning", "Please enter webinar title !", 2000);
                    return false;
                } 
                if (angular.isUndefined($scope.dcdata.what) || $scope.dcdata.what == '') {
                    alertService.add("warning", "Please enter webinar what !", 2000);
                    return false;
                } 
                if (angular.isUndefined($scope.dcdata.when) || $scope.dcdata.when == '') {
                    alertService.add("warning", "Please enter webinar when !", 2000);
                    return false;
                } 
                if (angular.isUndefined($scope.dcdata.description) || $scope.dcdata.description == '') {
                    alertService.add("warning", "Please enter content !", 2000);
                    return false;
                } 
                if ($scope.dcdata.speakers.length == 0) {
                    alertService.add("warning", "Please add speaker !", 2000);
                    return false;
                }
            }

            if (angular.isUndefined($scope.dcdata.email) || $scope.dcdata.email == '') {
                if ($scope.dcdata.addinvesterslists.length == 0) {
                    alertService.add("warning", "Please enter email or select distribution list !", 2000);
                    return false;
                }
                
            }
 
            if($scope.dcdata.send_type==2){ 
                if (angular.isUndefined($scope.dcdata.send_date) || $scope.dcdata.send_date == '') {
                    alertService.add("warning", "Please select date !", 2000);
                    return false;
                }
               
                if (angular.isUndefined($scope.dcdata.send_time) || $scope.dcdata.send_time == '') {
                    alertService.add("warning", "Please select time !", 2000);
                    return false;
                }
            }
            var res = 1;
 

           
            if ($scope.dcdata.email != '' && !angular.isUndefined($scope.dcdata.email)) {
                
                var emails = $scope.dcdata.email.split(',');
                angular.forEach(emails, function (email) {
                    if (!$scope.checkemailval(email)) {
                        alertService.add("warning", "Please enter valid emails separated by comma!", 2000);
                        res = 0;
                        return false;
                    }
                });
                
            }

           
            if ($scope.dcdata.addinvesterslists.length == 0) {
                if (angular.isUndefined($scope.dcdata.email) || $scope.dcdata.email == '') {
                    alertService.add("warning", "Please enter email or select distribution list  !", 2000);
                    return false;
                }
                
            }

            $scope.spinnerActive = true;
            if(type_send==2){
                var url = 'apiv4/public/researchprovider/adddistribute';
            }else if(type_send==3){
                var url = 'apiv4/public/researchprovider/updatedistribute';
            }
           
            var params = { dcdata: $scope.dcdata, distribute_id: $routeParams.distributeId };
            RequestDetail.getDetail(url, params).then(function (result) {
                
                 
                $scope.dcdata = {};
				$scope.dcdata.distribute = [];
                $scope.showModalpagepreview = false;
                $scope.spinnerActive = false;

               
                if(type_send==2){
                    alertService.add("success", "Sent Successfully !", 2000);
                    $location.path('distributeanalytics/history');
                }else if(type_send==3){
                    alertService.add("success", "Updated Successfully !", 2000);
                    $route.reload();
                }

               //$timeout(function(){
                //    $location.path('distributeanalytics');
                // }, 1000);
            }); 

            
        }

        


    }).controller('previewDContent', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails,$route,$sce) {
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

        var tagUrl = 'apiv4/public/researchprovider/getdistributepreview';
        var params = { distributeId: $scope.distributeId };
        RequestDetail.getDetail(tagUrl, params).then(function (result) {
            $scope.distributehtml = result.data.html;
        });

        $scope.checkemailval = function (email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }
       
        $scope.senddistributemail = function(){

            if (angular.isUndefined($scope.mailid) || $scope.mailid == '') {
                alertService.add("warning", "Please enter email !", 2000);
                return false;
            }
            else if (!$scope.checkemailval($scope.mailid)) {
                alertService.add("warning", "Please enter valid email!", 2000);
                return false;
            }

            var senddailymail = 'apiv4/public/researchprovider/senddistributemail';
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


    }).controller('previewinvestorDContent', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails,$route,$sce) {
        $scope.configdetails = configdetails;
        $scope.openmodelpagehelp = function () {
            $scope.showModalpageinfo = !$scope.showModalpageinfo;
        }
        $scope.sidepopupactive = false;

        $scope.sidepopup = function () {
            $scope.sidepopupactive = !$scope.sidepopupactive;
        }

        var tagUrl = 'apiv4/public/researchprovider/getCustomlinks';
        var params = {};
        RequestDetail.getDetail(tagUrl, params).then(function (result) {
            $scope.customlinks = result.data;
        });

        $scope.distributeId = $routeParams.distributeId;

        
        $scope.trustAsHtml = function(html) {
            return $sce.trustAsHtml(html);
        }

        var tagUrl = 'apiv4/public/researchprovider/getdistributepreview';
        var params = { distributeId: $scope.distributeId };
        RequestDetail.getDetail(tagUrl, params).then(function (result) {
            $scope.distributehtml = result.data.html;
        });
        $scope.checkemailval = function (email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }
       
        $scope.senddistributemail = function(){
            
            
            if (angular.isUndefined($scope.mailid) || $scope.mailid == '') {
                alertService.add("warning", "Please enter email !", 2000);
                return false;
            }
            else if (!$scope.checkemailval($scope.mailid)) {
                alertService.add("warning", "Please enter valid email!", 2000);
                return false;
            }

            var senddailymail = 'apiv4/public/researchprovider/sendinvestordistributemail';
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
    .controller('previewinvestortemplate', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails,$route,$sce) {
        $scope.configdetails = configdetails;
        $scope.openmodelpagehelp = function () {
            $scope.showModalpageinfo = !$scope.showModalpageinfo;
        }
        $scope.sidepopupactive = false;

        $scope.sidepopup = function () {
            $scope.sidepopupactive = !$scope.sidepopupactive;
        }

        

        $scope.Id = $routeParams.Id;

        
        $scope.trustAsHtml = function(html) {
            return $sce.trustAsHtml(html);
        }

        $scope.subject = '';

        var tagUrl = 'apiv4/public/researchprovider/getnvestortemplatepreview';
        var params = { Id: $scope.Id };
        RequestDetail.getDetail(tagUrl, params).then(function (result) {
            $scope.subject = result.data.subject;
            $scope.distributehtml = result.data.html;
        });

        $scope.checkemailval = function (email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }
       
        $scope.senddistributemail = function(){
            $scope.error_message= '';
            
            if (angular.isUndefined($scope.mailid) || $scope.mailid == '') {
                alertService.add("warning", "Please enter email!", 2000);
                $scope.error_message= 'Please enter email!';
                $timeout(function() {
                    $scope.error_message ='';
                }, 3000);
                return false;
            }
            else if (!$scope.checkemailval($scope.mailid)) {
                alertService.add("warning", "Please enter valid email!", 2000);
                $scope.error_message= 'Please enter valid email!';
                $timeout(function() {
                    $scope.error_message ='';
                }, 3000);
                return false;
            }

            var senddailymail = 'apiv4/public/researchprovider/sendinvestortemplateemail';
            var params = {
                Id: $scope.Id,mailid:$scope.mailid,subject:$scope.subject
            };
            RequestDetail.getDetail(senddailymail,params).then(function(result){ // The fasctory RequestDetail reused in Investors and corporates
               // alertService.add("success", "Email sent sucessfully !",2000);
               
               $scope.success_message = 'Email sent sucessfully!';
               
               $timeout(function() {
                   $scope.success_message ='';
               }, 3000);
               
            });
       }


    })
    .controller('distributeanalyticsview', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails,$route,$sce) {
        $scope.distributeId = '';

        $scope.trustAsHtml = function(html) {
            return $sce.trustAsHtml(html);
        }

        var url = 'apiv4/public/researchprovider/getdistributeanalyticslinks';
        var params = {distribute_content_id:$routeParams.distributeId};
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.links = result.data;
        });

        if($routeParams.distributeId){
            $scope.distributeId = $routeParams.distributeId;
            $scope.spinnerActive = true;

            var url = 'apiv4/public/researchprovider/getdistributeanalyticsview';
            var params = {distribute_content_id:$scope.distributeId};

            RequestDetail.getDetail(url, params).then(function (result) {
               // $scope.distributehtml = $scope.trustAsHtml(result.data.description);
                $scope.distributehtml = result.data.description;

                setTimeout(function(){ 
                    $scope.array =[];
                    $scope.name = [];
                    $scope.eles= angular.element($scope.distributehtml).find('a');
                    [].forEach.call($scope.eles, function (ctl) {
                        //$scope.name.push(angular.element(ctl).attr('href'));
                        // angular.element(ctl).attr('href');
                        angular.element(ctl).after('<b>10</b>');
                        angular.element(ctl).addClass('red');
                        angular.element(ctl).insertAfter('<b>30</b>');
                    });
                }, 3000);

                

                $scope.spinnerActive = false;
            });
        }
    
    })

    .controller('distributeeventanalytics', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails,$route) {

        $scope.investors = [];

        var url = 'apiv4/public/researchprovider/getdistributeeventanalytics';
        var params = {webinar_template_id:$routeParams.webinar_template_id};
        RequestDetail.getDetail(url, params).then(function (result) {
            //console.log(result.data);
            $scope.investors = result.data;
        });


    })

    
    .controller('distributeanalytics', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails,$route) {

       
        $scope.distributeId = '';

        $scope.tab =1;
        
       
        $scope.distributes = [];
        $scope.analytics = [];

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

        $scope.realsearch_startdate = '';
        $scope.realsearch_enddate = '';

       

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
            //$scope.filterreadership();
            if($scope.realsearch_enddate!='' && $scope.realsearch_startdate!=''){
                $scope.getalldistribute(1);
                $scope.getallarchives(1);
            }
           
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
            //$scope.filterreadership();
            if($scope.realsearch_enddate!='' && $scope.realsearch_startdate!=''){
                $scope.getalldistribute(1);
                $scope.getallarchives(1);
            }
        }

        var tagUrl = 'apiv4/public/researchprovider/getCustomcategory';
        var params = {};
        RequestDetail.getDetail(tagUrl, params).then(function (result) {
            $scope.customcategories = result.data;
        });

        $scope.filter = {};

        $scope.getCustomanalytics = function () {
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
                $scope.Customanalyticsloaderstatus = 1;
            
                var tagUrl = 'apiv4/public/researchprovider/getCustomanalytics';
                var params = {search_startdate:$scope.realsearch_startdate,search_enddate:$scope.realsearch_enddate,userreader_filter:$scope.filter.userreader_filter,custom_category:$scope.filter.custom_category};
                RequestDetail.getDetail(tagUrl, params).then(function (result) {
                    $scope.customanalytics = result.data;
                    $scope.Customanalyticsloaderstatus = 0;
                    //console.log($scope.customanalytics);
                });
            }
            
        }
        $scope.getCustomanalytics();

        
        

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
        $scope.filterreadership();
        

        var url = 'apiv4/public/researchprovider/getreadershippercentage';
        var params = {};
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.readershippercentage = result.data;
        });
        

        $scope.spinnerActive = true;
        $scope.colors_graph = ['#0F74BA', '#29A8E0', '#e0ea49', '#e0ea93', '#29A8E0'];

       

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
				text: '',
				fontSize: 15,
			},
        };
        
        $scope.series_graph = ['Open', 'Click','Total'];

        

        $scope.admin_status = 0;
        $scope.distribute_total_count = 1;
        $scope.user_filter = "";

        $scope.afilters = {};

        $scope.Math=window.Math;

        $scope.searchtext = '';

        $scope.resetsearch = function () {
            $scope.realsearch_startdate = '';
            $scope.realsearch_enddate = '';
            $scope.filter.custom_category = '';
            $scope.filter.userreader_filter = '';
            $scope.search_user = '';
            $scope.search_startdate = '';
            $scope.filterreadership();
        }

        $scope.total_history_count = 0;

        $scope.loadmorestatus = 1;
        $scope.loadmorecount = 2;

        $scope.getalldistribute = function (page) {
            
            $scope.spinnerActive = true;

            var url = 'apiv4/public/researchprovider/getalldistribute';
            var params = { page:page,user_filter:$scope.afilters.user_filter,searchtext:$scope.searchtext,search_startdate:$scope.realsearch_startdate, search_enddate:$scope.realsearch_enddate};
            RequestDetail.getDetail(url, params).then(function (result) {

                //console.log($scope.afilters.user_filter);
                
                //if(result.data.user_filter==$scope.afilters.user_filter){
                    if(page==1){
                        $scope.distributes = [];
                        
                        $scope.histories = [];
                        $scope.drafts = [];
                        $scope.scheduleds = [];
    
                        $scope.users = result.data.users;
                        $scope.admin_status = result.data.admin_status;
    
                        $scope.distribute_total_count = result.data.page_count;
                        $scope.total_history_count = result.data.total_history_count;
                    }
                    $scope.loadmorecount = result.data.page;

                   
                    if($scope.distribute_total_count>=result.data.page){
                        if(result.data.page<=20){
                            //console.log('ok');
                            $scope.getalldistribute(result.data.page);
                        }
                    }else{
                        $scope.loadmorestatus = 0;
                    }
    
              
                    angular.forEach(result.data.histories, function (history) {
                        history.total_emails = parseInt(history.total_emails);
                        history.unique_open = parseInt(history.unique_open);

                        $scope.histories.push(history);
                    });
    
                    angular.forEach(result.data.drafts, function (draft) {
                        $scope.drafts.push(draft);
                    });
    
                    angular.forEach(result.data.scheduleds, function (scheduled) {
                        $scope.scheduleds.push(scheduled);
                    });
    
                    $scope.admin_status = result.data.admin_status;
                //}
                
             
                $scope.spinnerActive = false;
            });
        }


        $scope.archivestabvalue = 1;

        
        $scope.archivestab = function (tab) {
            $scope.archivestabvalue = tab;
        }

        $scope.archivedistribute_total_count = 1;
        $scope.archivetotal_history_count = 0;
        $scope.archiveloadmorecount = 2;
        $scope.archiveloadmorestatus = 1;

        

        $scope.getallarchives = function (page) {
            
           

            var url = 'apiv4/public/researchprovider/getallarchivesdistribute';
            var params = { page:page,user_filter:$scope.afilters.user_filter,searchtext:$scope.searchtext, search_startdate:$scope.realsearch_startdate, search_enddate:$scope.realsearch_enddate};
            RequestDetail.getDetail(url, params).then(function (result) {

                 
                    if(page==1){ 
                        $scope.archives = []; 
                        $scope.archivedistribute_total_count = result.data.page_count;
                        $scope.archivetotal_history_count = result.data.total_history_count;
                    }
                    $scope.archiveloadmorecount = result.data.page;

                     
                    if($scope.distribute_total_count>=result.data.page){
                        if(result.data.page<=20){ 
                            $scope.getallarchives(result.data.page);
                        }
                    }else{
                        $scope.archiveloadmorestatus = 0;
                    }
     
                    angular.forEach(result.data.histories, function (history) {
                        history.total_emails = parseInt(history.total_emails);
                        history.unique_open = parseInt(history.unique_open);

                        $scope.archives.push(history);
                    });
      
                $scope.spinnerActive = false;
            });
        }

        $scope.recountdistribute = function (distribute_content_id) {
            $scope.spinnerActive = true;
            var url = 'apiv4/public/researchprovider/recountdistribute';
            var params = { distribute_content_id:distribute_content_id};
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.getalldistribute(1);
               
            });
        }

        $scope.searchdistributes = function () {
            $scope.getalldistribute(1);
            $scope.getallarchives(1)
        }

        $scope.approvedistribute = function (distribute_content_id) {
            $scope.spinnerActive = true;
            var url = 'apiv4/public/researchprovider/approvedistribute';
            var params = { distribute_content_id:distribute_content_id};
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.getalldistribute(1);
                $scope.getallarchives(1)
            });
        }


        $scope.titleresults = "";

        $scope.count = 1;
        $scope.total_count = 0;

        $scope.processed_total = 0;
        $scope.delivered_total = 0;
        $scope.open_total = 0;
        $scope.click_total = 0;
        $scope.bounce_total = 0;
        $scope.analyticsresults = {};
        $scope.analyticsresults.analytics = [];
        $scope.bounces = [];

        $scope.loaderstatus = 0;

        var user_data = localStorageService.get('userdata');


        $scope.agencystatus = 0;
        if (user_data.agencystatus) {
            $scope.agencystatus = user_data.agencystatus;
        }

        if($routeParams.distributePath){
            $scope.tab =2;
        }

        $scope.openbounceemailchange = function (bounce) {
            bounce.editstatus = 1;
        }
        $scope.closebounceemailchange = function (bounce) {
            bounce.editstatus = 0;
        }

        
        $scope.updatebounceemail = function (bounce) {
            var url = 'apiv4/public/researchprovider/updatebounceemail';
            var params = {bounce: bounce};
            RequestDetail.getDetail(url, params).then(function (result) {
                angular.forEach($scope.bounces, function (data,key) {
                    if(data.email==bounce.email){
                        $scope.bounces.splice(key, 1);
                    }
               });
                alertService.add("success", 'Updated Successfully !', 2000);
            });
        }
        

        $scope.bouncetounsubscribed = function () {
            $scope.confirmation = true;
        }
        $scope.bouncetounsubscribedact = function () {
            var url = 'apiv4/public/researchprovider/bouncetounsubscribed';
            var params = {bounces: $scope.bounces};
            RequestDetail.getDetail(url, params).then(function (result) {
                $('#confirmation').modal('hide');
                $scope.confirmation = false;
                alertService.add("success", 'Added Unsubscribed list Successfully !', 2000);
            });
        }

        $scope.deletebounce = function (email) {
           angular.forEach($scope.bounces, function (data,key) {
                if(data.email==email.email){
                    $scope.bounces.splice(key, 1);
                }
           });
        }
      
        $scope.closemodel = function () {
            $scope.confirmation = false;
        }


       
        $scope.inves = [];
        $scope.inves.investorlistid = '';
        $scope.leadscontacts = [];

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

        $scope.copyinvesterlist = function () {
            $scope.distributionconfirmation = true;
        }

        $scope.addleadcontact = function (analytic,status) {
            if(status){
                $scope.leadscontacts.push(analytic);
            }else{
                angular.forEach($scope.leadscontacts, function (data,key) {
                    if(data.id==analytic.id){
                        $scope.leadscontacts.splice(key, 1);
                    }
               });
            }
        }

        $scope.deleteleadscontact = function (lead) {
            angular.forEach($scope.leadscontacts, function (data,key) {
                 if(data.id==lead.id){
                     $scope.leadscontacts.splice(key, 1);
                 }
            });
         }
        
        $scope.closeleadsmodel = function () {
            $scope.distributionconfirmation = false;
        }

        $scope.leadscontactstodislilst = function () {
            if (!$scope.inves.investorlistid || $scope.inves.investorlistid == '') {
                alertService.add("warning", "Please select distribution list!", 2000);
                return false;
            }else{
                var url = 'apiv4/public/researchprovider/leadstodistributionlist';
                var params = {investor_list_id:$scope.inves.investorlistid,leadscontacts:$scope.leadscontacts};
                RequestDetail.getDetail(url, params).then(function (result) {
                    alertService.add("success", "Selected contacts added successfully!", 2000);
                    $scope.inves.investorlistid = '';
                    $scope.distributionconfirmation = false;
                });
            } 
        }
        
        

        $scope.getlist = function (count) {
            if($routeParams.distributeId){
                $scope.distributeId = $routeParams.distributeId;
                $scope.spinnerActive = true;
    
                var url = 'apiv4/public/researchprovider/getanalytics';
                var params = {distribute_content_id:$scope.distributeId, page: count};
    
                $scope.loaderstatus = 1;

                RequestDetail.getDetail(url, params).then(function (result) {
                    
                    $scope.titleresults = result.data.title;

                    $scope.descriptionresults = result.data.description;

                    $scope.distribute_content_id = result.data.distribute_content_id;
                  
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
                    
                    $scope.spinnerActive = false;
                });
            }
            else{
                $scope.getalldistribute(1);
                $scope.getallarchives(1)
            }
        }
        

        $scope.getlist(1);

        $scope.shomsg = 0;
        $scope.shomsgtext = 'Show Summary';
        $scope.showmessage = function () {
            $scope.shomsg = !$scope.shomsg;
            if($scope.shomsg){
                $scope.shomsgtext = 'Hide Summary';
            }else{
                $scope.shomsgtext = 'Show Summary';
            }
        }
        

        $scope.deactivedistribute = function (distribute_content_id) {
			if (confirm("Are you sure?")) {
                $scope.spinnerActive = true;
				var url = 'apiv4/public/researchprovider/deactivedistribute';
				var params = {
					distribute_content_id: distribute_content_id
				};
				RequestDetail.getDetail(url, params).then(function (result) {
                    $scope.spinnerActive = false;
                    $scope.getalldistribute(1);
                    $scope.getallarchives(1)
				});

			}
		};

        $scope.poptimes = {};
        $scope.titletimes = '';
        $scope.timesopen = function (index) {
            angular.forEach($scope.analyticsresults.analytics, function (anlytics) {
                if(anlytics.distribute_contacts_id==index){
                    $scope.poptimes = anlytics.open_times;
                }
            });
            $scope.titletimes = 'Open Detail';
            $scope.showModalpagetimes = true;
        }
        
        $scope.timesclick = function (index) {
            
            
            angular.forEach($scope.analyticsresults.analytics, function (anlytics) {
                if(anlytics.distribute_contacts_id==index){
								
			 
                    $scope.poptimes = anlytics.click_times;
                }
            });
           
            $scope.titletimes = 'Click Detail';
            $scope.showModalpagetimes = true;
        }

        $scope.closetimes = function () {
            $scope.showModalpagetimes = false;
        }


        $scope.feedtimes = function (dat) {
            $scope.poptimes = dat;
            $scope.showModalpagetimes = true;
        }

        $scope.readertimes = function (dat) {
            $scope.readerpoptimes = dat;
            $scope.showModalpagereadertimes = true;
        }
        $scope.closereadertimes = function () {
            $scope.showModalpagereadertimes = false;
        }

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

        
      

    })

    .controller('distributearchives', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails,$route) {

       
        $scope.distributeId = '';

        $scope.tab =2;
        
       
        $scope.distributes = [];
        $scope.analytics = [];

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
            maxDate: new Date().setDate(new Date().getDate() - 365),
            //minDate: new Date().setDate(new Date().getDate() - 30),
            startingDay: 1
        };

        $scope.dateOptions.initDate = new Date();
        $scope.dateOptions.initDate.setDate($scope.dateOptions.initDate.getDate() - 395);


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

        $scope.realsearch_startdate = '';
        $scope.realsearch_enddate = '';

       

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
            
            if($scope.realsearch_enddate!='' && $scope.realsearch_startdate!=''){
                $scope.getalldistribute(1);
            }
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
            
            if($scope.realsearch_enddate!='' && $scope.realsearch_startdate!=''){
                $scope.getalldistribute(1);
            }
            
        }

       

        var tagUrl = 'apiv4/public/researchprovider/getCustomcategory';
        var params = {};
        RequestDetail.getDetail(tagUrl, params).then(function (result) {
            $scope.customcategories = result.data;
        });

        $scope.filter = {};

        $scope.getCustomanalytics = function () {
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
                $scope.Customanalyticsloaderstatus = 1;
            
                var tagUrl = 'apiv4/public/researchprovider/getCustomanalytics';
                var params = {search_startdate:$scope.realsearch_startdate,search_enddate:$scope.realsearch_enddate,userreader_filter:$scope.filter.userreader_filter,custom_category:$scope.filter.custom_category};
                RequestDetail.getDetail(tagUrl, params).then(function (result) {
                    $scope.customanalytics = result.data;
                    $scope.Customanalyticsloaderstatus = 0;
                    //console.log($scope.customanalytics);
                });
            }
            
        }
        $scope.getCustomanalytics();

        
        

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
        $scope.filterreadership();
        

        var url = 'apiv4/public/researchprovider/getreadershippercentage';
        var params = {};
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.readershippercentage = result.data;
        });
        

        $scope.spinnerActive = true;
        $scope.colors_graph = ['#0F74BA', '#29A8E0', '#e0ea49', '#e0ea93', '#29A8E0'];

       

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
				text: '',
				fontSize: 15,
			},
        };
        
        $scope.series_graph = ['Open', 'Click','Total'];

        

        $scope.admin_status = 0;
        $scope.distribute_total_count = 1;
        $scope.user_filter = "";

        $scope.afilters = {};

        $scope.Math=window.Math;

        $scope.searchtext = '';

        $scope.resetsearch = function () {
            $scope.realsearch_startdate = '';
            $scope.realsearch_enddate = '';
            $scope.filter.custom_category = '';
            $scope.filter.userreader_filter = '';
            $scope.search_user = '';
            $scope.search_startdate = '';
            $scope.filterreadership();
        }

        $scope.total_history_count = 0;

        $scope.loadmorestatus = 1;
        $scope.loadmorecount = 2;

        $scope.getalldistribute = function (page) {
            
            $scope.spinnerActive = true;

            var url = 'apiv4/public/researchprovider/getallarchivesdistribute';
            var params = { page:page,user_filter:$scope.afilters.user_filter,searchtext:$scope.searchtext, search_startdate:$scope.realsearch_startdate, search_enddate:$scope.realsearch_enddate};
            RequestDetail.getDetail(url, params).then(function (result) {

                //console.log($scope.afilters.user_filter);
                
                //if(result.data.user_filter==$scope.afilters.user_filter){
                    if(page==1){
                        $scope.distributes = [];
                        
                        $scope.histories = [];
                        $scope.drafts = [];
                        $scope.scheduleds = [];
    
                        $scope.users = result.data.users;
                        $scope.admin_status = result.data.admin_status;
    
                        $scope.distribute_total_count = result.data.page_count;
                        $scope.total_history_count = result.data.total_history_count;
                    }
                    $scope.loadmorecount = result.data.page;

                    //console.log($scope.distribute_total_count);
                    //console.log(result.data.page);

                    if($scope.distribute_total_count>=result.data.page){
                        if(result.data.page<=20){
                            //console.log('ok');
                            $scope.getalldistribute(result.data.page);
                        }
                    }else{
                        $scope.loadmorestatus = 0;
                    }
    
                   // angular.forEach(result.data.distributes, function (distribut) {
                     //   $scope.distributes.push(distribut);
                   // });
    
                    angular.forEach(result.data.histories, function (history) {
                        history.total_emails = parseInt(history.total_emails);
                        history.unique_open = parseInt(history.unique_open);

                        $scope.histories.push(history);
                    });
    
                    angular.forEach(result.data.drafts, function (draft) {
                        $scope.drafts.push(draft);
                    });
    
                    angular.forEach(result.data.scheduleds, function (scheduled) {
                        $scope.scheduleds.push(scheduled);
                    });
    
                    $scope.admin_status = result.data.admin_status;
                //}
                
             
                $scope.spinnerActive = false;
            });
        }

        $scope.recountdistribute = function (distribute_content_id) {
            $scope.spinnerActive = true;
            var url = 'apiv4/public/researchprovider/recountdistribute';
            var params = { distribute_content_id:distribute_content_id};
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.getalldistribute(1);
            });
        }

        $scope.searchdistributes = function () {
            $scope.getalldistribute(1);
        }

        $scope.approvedistribute = function (distribute_content_id) {
            $scope.spinnerActive = true;
            var url = 'apiv4/public/researchprovider/approvedistribute';
            var params = { distribute_content_id:distribute_content_id};
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.getalldistribute(1);
            });
        }


        $scope.titleresults = "";

        $scope.count = 1;
        $scope.total_count = 0;

        $scope.processed_total = 0;
        $scope.delivered_total = 0;
        $scope.open_total = 0;
        $scope.click_total = 0;
        $scope.bounce_total = 0;
        $scope.analyticsresults = {};
        $scope.analyticsresults.analytics = [];
        $scope.bounces = [];

        $scope.loaderstatus = 0;

        var user_data = localStorageService.get('userdata');


        $scope.agencystatus = 0;
        if (user_data.agencystatus) {
            $scope.agencystatus = user_data.agencystatus;
        }

        if($routeParams.distributePath){
            $scope.tab =2;
        }

        $scope.openbounceemailchange = function (bounce) {
            bounce.editstatus = 1;
        }
        $scope.closebounceemailchange = function (bounce) {
            bounce.editstatus = 0;
        }

        
        $scope.updatebounceemail = function (bounce) {
            var url = 'apiv4/public/researchprovider/updatebounceemail';
            var params = {bounce: bounce};
            RequestDetail.getDetail(url, params).then(function (result) {
                angular.forEach($scope.bounces, function (data,key) {
                    if(data.email==bounce.email){
                        $scope.bounces.splice(key, 1);
                    }
               });
                alertService.add("success", 'Updated Successfully !', 2000);
            });
        }
        

        $scope.bouncetounsubscribed = function () {
            $scope.confirmation = true;
        }
        $scope.bouncetounsubscribedact = function () {
            var url = 'apiv4/public/researchprovider/bouncetounsubscribed';
            var params = {bounces: $scope.bounces};
            RequestDetail.getDetail(url, params).then(function (result) {
                $('#confirmation').modal('hide');
                $scope.confirmation = false;
                alertService.add("success", 'Added Unsubscribed list Successfully !', 2000);
            });
        }

        $scope.deletebounce = function (email) {
           angular.forEach($scope.bounces, function (data,key) {
                if(data.email==email.email){
                    $scope.bounces.splice(key, 1);
                }
           });
        }
      
        $scope.closemodel = function () {
            $scope.confirmation = false;
        }


       
        $scope.inves = [];
        $scope.inves.investorlistid = '';
        $scope.leadscontacts = [];

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

        $scope.copyinvesterlist = function () {
            $scope.distributionconfirmation = true;
        }

        $scope.addleadcontact = function (analytic,status) {
            if(status){
                $scope.leadscontacts.push(analytic);
            }else{
                angular.forEach($scope.leadscontacts, function (data,key) {
                    if(data.id==analytic.id){
                        $scope.leadscontacts.splice(key, 1);
                    }
               });
            }
        }

        $scope.deleteleadscontact = function (lead) {
            angular.forEach($scope.leadscontacts, function (data,key) {
                 if(data.id==lead.id){
                     $scope.leadscontacts.splice(key, 1);
                 }
            });
         }
        
        $scope.closeleadsmodel = function () {
            $scope.distributionconfirmation = false;
        }

        $scope.leadscontactstodislilst = function () {
            if (!$scope.inves.investorlistid || $scope.inves.investorlistid == '') {
                alertService.add("warning", "Please select distribution list!", 2000);
                return false;
            }else{
                var url = 'apiv4/public/researchprovider/leadstodistributionlist';
                var params = {investor_list_id:$scope.inves.investorlistid,leadscontacts:$scope.leadscontacts};
                RequestDetail.getDetail(url, params).then(function (result) {
                    alertService.add("success", "Selected contacts added successfully!", 2000);
                    $scope.inves.investorlistid = '';
                    $scope.distributionconfirmation = false;
                });
            } 
        }
        
        

        $scope.getlist = function (count) {
            if($routeParams.distributeId){
                $scope.distributeId = $routeParams.distributeId;
                $scope.spinnerActive = true;
    
                var url = 'apiv4/public/researchprovider/getanalytics';
                var params = {distribute_content_id:$scope.distributeId, page: count};
    
                $scope.loaderstatus = 1;

                RequestDetail.getDetail(url, params).then(function (result) {
                    
                    $scope.titleresults = result.data.title;

                    $scope.descriptionresults = result.data.description;

                    $scope.distribute_content_id = result.data.distribute_content_id;
                  
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
                    
                    $scope.spinnerActive = false;
                });
            }
            else{
                $scope.getalldistribute(1);
            }
        }
        

        $scope.getlist(1);

        $scope.shomsg = 0;
        $scope.shomsgtext = 'Show Summary';
        $scope.showmessage = function () {
            $scope.shomsg = !$scope.shomsg;
            if($scope.shomsg){
                $scope.shomsgtext = 'Hide Summary';
            }else{
                $scope.shomsgtext = 'Show Summary';
            }
        }
        

        $scope.deactivedistribute = function (distribute_content_id) {
			if (confirm("Are you sure?")) {
                $scope.spinnerActive = true;
				var url = 'apiv4/public/researchprovider/deactivedistribute';
				var params = {
					distribute_content_id: distribute_content_id
				};
				RequestDetail.getDetail(url, params).then(function (result) {
                    $scope.spinnerActive = false;
                    $scope.getalldistribute(1);
				});

			}
		};

        $scope.poptimes = {};
        $scope.titletimes = '';
        $scope.timesopen = function (index) {
            angular.forEach($scope.analyticsresults.analytics, function (anlytics) {
                if(anlytics.distribute_contacts_id==index){
                    $scope.poptimes = anlytics.open_times;
                }
            });
            $scope.titletimes = 'Open Detail';
            $scope.showModalpagetimes = true;
        }
        
        $scope.timesclick = function (index) {
            
            
            angular.forEach($scope.analyticsresults.analytics, function (anlytics) {
                if(anlytics.distribute_contacts_id==index){
								
			 
                    $scope.poptimes = anlytics.click_times;
                }
            });
           
            $scope.titletimes = 'Click Detail';
            $scope.showModalpagetimes = true;
        }

        $scope.closetimes = function () {
            $scope.showModalpagetimes = false;
        }


        $scope.feedtimes = function (dat) {
            $scope.poptimes = dat;
            $scope.showModalpagetimes = true;
        }

        $scope.readertimes = function (dat) {
            $scope.readerpoptimes = dat;
            $scope.showModalpagereadertimes = true;
        }
        $scope.closereadertimes = function () {
            $scope.showModalpagereadertimes = false;
        }

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

        
      

    })

    .controller('campaignanalytics', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails,$route) {

        $scope.afilters = {};
        $scope.afilters.user_filter = '';

        $scope.selected_ids = [];
        $scope.archiveselected_ids = [];

        $scope.count = 1;
        $scope.archivecount = 1;

        $scope.custom_filter = {};
        $scope.custom_filter.customcategory = '';

        $scope.filterarchive = '1';

        var tagUrl = 'apiv4/public/researchprovider/getCustomcategory';
        var params = {};
        RequestDetail.getDetail(tagUrl, params).then(function (result) {
            $scope.customcategories = result.data;
        });

        $scope.showModalpagereportrequest = false;

        $scope.hidepopup = function () {
            $scope.showModalpagereportrequest = false; 
        }
        
         
        $scope.exportcampaignanalytics = function (selected_ids_text,archiveselected_ids_text,archivestabvalue,emails,dailyselected_ids_text,dailytype) {
            $scope.spinnerActive = true;
            var url = 'apiv4/public/researchprovider/saveanalyticsreport';
            
            var params = { selected_ids_text:selected_ids_text,archiveselected_ids_text:archiveselected_ids_text,archivestabvalue:archivestabvalue,emails:emails,dailyselected_ids_text:dailyselected_ids_text,dailytype:dailytype};

            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.showModalpagereportrequest = true;
                $scope.spinnerActive = false;
            });
        }
            

        $scope.dailies = ['Stash','New Capital','SpaceTech','Fintech'];

        $scope.getalldistribute = function (page) {
            $scope.spinnerActive = true;
            
            var url = 'apiv4/public/researchprovider/getalldistribute';
            
            var params = { page:page,user_filter:$scope.afilters.user_filter,custom_filter:$scope.custom_filter};
            RequestDetail.getDetail(url, params).then(function (result) {
    
                if(result.data.user_filter==$scope.afilters.user_filter  && result.data.customcategory==$scope.custom_filter.customcategory){
                    if(page==1){
                        $scope.histories = [];
                        
                        $scope.count = 1;
                        $scope.selected_ids = [];

                        $scope.users = result.data.users;
                        $scope.admin_status = result.data.admin_status; 
                        $scope.distribute_total_count = result.data.page_count;
                    }

                    if($scope.distribute_total_count>=result.data.page){
                        //temp limit
                        if(result.data.page<=20 || $scope.custom_filter.customcategory){
                            $scope.getalldistribute(result.data.page);
                        }
                        //temp limit
                    }
    
                    angular.forEach(result.data.histories, function (history) {
                        if($scope.count<=10){
                            history.selected = true;
                            $scope.selected_ids.push(history.distribute_content_id);
                        }
                        $scope.histories.push(history);
                        
                        $scope.count = $scope.count+1;
                    });
                    $scope.admin_status = result.data.admin_status;
                }
                
                $scope.selected_ids_text = $scope.selected_ids.toString();
             
                $scope.spinnerActive = false;
            });

 
        }

        $scope.getallarchivedistribute = function (page) {

            var url = 'apiv4/public/researchprovider/getallarchivesdistribute';
            var params = { page:page,user_filter:$scope.afilters.user_filter,custom_filter:$scope.custom_filter};
            RequestDetail.getDetail(url, params).then(function (result) {
    
                if(result.data.user_filter==$scope.afilters.user_filter  && result.data.customcategory==$scope.custom_filter.customcategory){
                    if(page==1){
                        $scope.archivehistories = [];
                         
                        $scope.archivecount = 1;
                        $scope.archiveselected_ids = [];

                        
                        $scope.archivedistribute_total_count = result.data.page_count;
                    }

                    if($scope.archivedistribute_total_count>=result.data.page){
                        //temp limit
                        if(result.data.page<=20 || $scope.custom_filter.customcategory){
                            $scope.getallarchivedistribute(result.data.page);
                        }
                        //temp limit
                    }
    
                    angular.forEach(result.data.histories, function (history) {
                        if($scope.archivecount<=10){
                            history.selected = true;
                            $scope.archiveselected_ids.push(history.distribute_content_id);
                        }
                        $scope.archivehistories.push(history);
                        
                        $scope.archivecount = $scope.count+1;
                    });
                    
                }
                
                $scope.archiveselected_ids_text = $scope.archiveselected_ids.toString();
             
                $scope.spinnerActive = false;
            });
        }
    
        $scope.getlist = function () {
            $scope.getalldistribute(1);
            $scope.getallarchivedistribute(1);
        }
        $scope.getlist(1);

        $scope.daily_articles = [];



        $scope.archivestabvalue = 1;
        
        $scope.archivestab = function (tab) {
            $scope.archivestabvalue = tab;
        }
    
        $scope.getdailylist = function () {
            
            $scope.spinnerActive = true;

            $scope.dailyselected_ids =[];
            $scope.dailyselected_ids_text = '';

            var url = 'apiv4/public/researchprovider/getdailylist';
            var params = { dailytype:$scope.custom_filter.dailytype};
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.daily_articles =  result.data;

                $scope.spinnerActive = false;
            });
        }
        

        var user_data = localStorageService.get('userdata');
    
        $scope.user_type = user_data.user_type;

        $scope.agencystatus = 0;
        if (user_data.agencystatus) {
            $scope.agencystatus = user_data.agencystatus;
        }
    
        $scope.changeselect = function (distribute) {
            if(distribute.selected){
                if($scope.selected_ids.length>=10){
                    distribute.selected = false;
                    alertService.add("warning", "You can't add more then 10 distribute!", 2000);
                }else{
                    $scope.selected_ids.push(distribute.distribute_content_id);
                    $scope.selected_ids_text = $scope.selected_ids.toString();
                }
            }else{
                const index = $scope.selected_ids.indexOf(distribute.distribute_content_id);
                if (index > -1) {
                    $scope.selected_ids.splice(index, 1);
                    $scope.selected_ids_text = $scope.selected_ids.toString();
                }
                
            }
        }

        $scope.dailyselected_ids =[];
        $scope.dailyselected_ids_text = '';

        $scope.changeselectdaily = function (daily) {
            if(daily.selected){
                if($scope.dailyselected_ids.length>=4){
                    daily.selected = false;
                    alertService.add("warning", "You can't add more then 10 daily!", 2000);
                }else{
                    $scope.dailyselected_ids.push(daily.id);
                    $scope.dailyselected_ids_text = $scope.dailyselected_ids.toString();
                }
            }else{
                const index = $scope.dailyselected_ids.indexOf(daily.id);
                if (index > -1) {
                    $scope.dailyselected_ids.splice(index, 1);
                    $scope.dailyselected_ids_text = $scope.dailyselected_ids.toString();
                }
                
            }
        }

        $scope.archiveselected_ids =[];
        $scope.archiveselected_ids_text = '';

        $scope.changeselectarchive = function (distribute) {
            if(distribute.selected){
                if($scope.archiveselected_ids.length>=10){
                    distribute.selected = false;
                    alertService.add("warning", "You can't add more then 10 distribute!", 2000);
                }else{
                    $scope.archiveselected_ids.push(distribute.distribute_content_id);
                    $scope.archiveselected_ids_text = $scope.archiveselected_ids.toString();
                }
            }else{
                const index = $scope.archiveselected_ids.indexOf(distribute.distribute_content_id);
                if (index > -1) {
                    $scope.archiveselected_ids.splice(index, 1);
                    $scope.archiveselected_ids_text = $scope.archiveselected_ids.toString();
                }
                
            }
        }


        
      
    
    })

    .controller('contentstrategy', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails,$route) {

        $scope.contentstrategy = {};
        

        $scope.showModalcontent_strategy = false;
        $scope.showModaldescription = false;

        $scope.editdesc = function () {
            $scope.showModaldescription = true;
        }

        $scope.editcontentstrategy = function () {
            $scope.showModalcontent_strategy = true;
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
           // maxDate: new Date(),
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
       
        $scope.profiletabde = 1;
        $scope.profiletabdes = function (act) {
            $scope.profiletabde = act;
        }
        
        $scope.totals = [];

        $scope.contentstrategy.real_date = '';
        $scope.selecttargetdatedat = function (dat) {
            
            var monthNames = [
                "January", "February", "March",
                "April", "May", "June", "July",
                "August", "September", "October",
                "November", "December"
            ];
            
            var day = dat.getDate();
            var monthIndex = dat.getMonth();
            var year = dat.getFullYear();

            $scope.contentstrategy.real_date = day + ' ' + monthNames[monthIndex] + ' ' + year;

        }
        

        

        $scope.getcontentstrategy = function () {
            $scope.spinnerActive = true;

            var url = 'apiv4/public/researchprovider/getcontentstrategy';
            var params = { };
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.contentstrategy = result.data;

                $scope.spinnerActive = false;
            });
        }

        
        $scope.getcontentstrategy();

        $scope.getyearscontentstrategy = function () {
            $scope.spinnerActive = true;

            var url = 'apiv4/public/researchprovider/getyearscontentstrategy';
            var params = { };
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.contentstrategyyears = result.data;

                /*if($scope.contentstrategyyears[0].id){
                    $scope.contentstrategy.contentstrategy_selected = $scope.contentstrategyyears[0].id;
                    $scope.contentstrategy.targetcontent = $scope.contentstrategyyears[0].content;
                }*/
                

                $scope.spinnerActive = false;
            });
        }
        $scope.getyearscontentstrategy();

        

        $scope.updatecontentstrategy = function () {
            $scope.spinnerActive = true;

            var url = 'apiv4/public/researchprovider/updatecontentstrategy';
            var params = { data: $scope.contentstrategy };
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.getcontentstrategy();
                $scope.showModaldescription = false;
                $scope.showModalcontent_strategy = false;
                $scope.spinnerActive = false;
            });
        }

        $scope.showModalyears = false;

        $scope.openyearsadd = function () {
            $scope.showModalyears = true;
        }

       /* $scope.changecontentstrategytarget = function () {
            angular.forEach($scope.contentstrategyyears,function(col,index){
                if(col.id==$scope.contentstrategy.contentstrategy_selected){
                    $scope.contentstrategy.targetcontent = col.content;
                }
            });
        }*/

        
        

        $scope.updatecontenttargetstrategy = function () {

            if (angular.isUndefined($scope.contentstrategy.targetcontent) || $scope.contentstrategy.targetcontent == '') {
                alertService.add("warning", "Please enter content !", 2000);
                return false;
            }
            if (angular.isUndefined($scope.contentstrategy.real_date) || $scope.contentstrategy.real_date == '') {
                alertService.add("warning", "Please enter target date !", 2000);
                return false;
            }
            
            $scope.spinnerActive = true;

            var url = 'apiv4/public/researchprovider/updatecontenttargetstrategy';
            var params = { id: $scope.contentstrategy.contentstrategy_selected,content:$scope.contentstrategy.targetcontent,date:$scope.contentstrategy.real_date };
            RequestDetail.getDetail(url, params).then(function (result) {
                
                $scope.getyearscontentstrategy();

                $scope.contentstrategy.target_date_user = "";
                $scope.contentstrategy.targetcontent = "";
                $scope.contentstrategy.real_date = "";

                if(result.data.response==1){
                    alertService.add("success", "Added Successfully !", 2000);
                }else{
                    alertService.add("success", "Target Date exists! Updated Successfully!", 2000);
                }

                $scope.showModalyears = false;

                $scope.spinnerActive = false;
            });
        }

        $scope.closemodel = function () {
            $scope.showModalyears = false;
            $scope.showModalcontent_strategy = false;
            $scope.showModaldescription  = false;
        }
        

    })
    .controller('investorengaging', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails,$route) {


        $scope.distributes = [];
        $scope.archivedistributes = [];


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
        $scope.search_filterarchives = '1';

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
		
        $scope.admin_status = 0;
		$scope.large_list_status = 0;		
        
        $scope.archivelarge_list_status  = 0;	

		var url = 'apiv4/public/researchprovider/getCompanyUsers';
		var params = { };
		RequestDetail.getDetail(url, params).then(function (result) {
			$scope.admin_status = result.data.admin_status;
			$scope.users = result.data.users;
		});

        $scope.archivestabvalue = 1;

        
        $scope.archivestab = function (tab) {
            $scope.archivestabvalue = tab;
        }

        $scope.showModalpagereportrequest = false;

        $scope.hidepopup = function () {
            $scope.showModalpagereportrequest = false;
        }

        $scope.distributes_placeholder = 'No Data';

        $scope.exportinvestorengaging = function (search_text,distribute_title,search_region,search_user,realsearch_startdate,realsearch_enddate,search_filterby,archivestatus) {
            $scope.spinnerActive = true;
            
            var url = 'apiv4/public/researchprovider/addexportinvestorengagingRequest';
            var params = { search_text:search_text,distribute_title:distribute_title,search_region:search_region,search_user:search_user,realsearch_startdate:realsearch_startdate,realsearch_enddate:realsearch_enddate,search_filterby:search_filterby,archivestatus:archivestatus};
            RequestDetail.getDetail(url, params).then(function (result) {
                alertService.add("success", 'Requested Successfully !', 2000); 
                $scope.spinnerActive = false;
                $scope.showModalpagereportrequest = true;
            });
        }

        $scope.getInvestorsEngaging = function () {
            $scope.distributes_placeholder = 'Loading';


            $scope.spinnerActive = true;

            var url = 'apiv4/public/researchprovider/getInvestorsEngaging';
            var params = { search_text: $scope.search_text,distribute_title: $scope.distribute_title, search_region: $scope.search_region, search_user: $scope.search_user,search_startdate:$scope.realsearch_startdate,search_enddate:$scope.realsearch_enddate,search_filterby:$scope.search_filterby, search_filterarchives: $scope.search_filterarchives };
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.distributes = result.data.analytics;
                //console.log($scope.distributes);
				$scope.large_list_status = result.data.limit_exceeded;									  
                
                // $scope.regions = result.data.regions;
                // $scope.admin_status = result.data.admin_status;
                // $scope.users = result.data.users;
                $scope.spinnerActive = false;
            });


            var url = 'apiv4/public/researchprovider/archivegetInvestorsEngaging';
            var params = { search_text: $scope.search_text,distribute_title: $scope.distribute_title, search_region: $scope.search_region, search_user: $scope.search_user,search_startdate:$scope.realsearch_startdate,search_enddate:$scope.realsearch_enddate,search_filterby:$scope.search_filterby, search_filterarchives: $scope.search_filterarchives };
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.archivedistributes = result.data.analytics;
                //console.log($scope.distributes);
				$scope.archivelarge_list_status = result.data.limit_exceeded;									  
            });

            
        }

        $scope.poptimes = {};
        $scope.titletimes = '';
        $scope.timesopen = function (id) {
            $.each($scope.distributes, function (index, distri) {
                if(distri.id==id){
                    $scope.poptimes = distri.open_times;
                }
            });
            
            $scope.titletimes = 'Open Detail';
            $scope.showModalpagetimes = true;
        }
        
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
            $scope.distribute_title= "";
            $scope.search_user = "";
            $scope.realsearch_startdate = '';
            $scope.search_filterby = '1';

            $scope.search_startdate = '';
            $scope.search_enddate = '';

            $scope.realsearch_enddate = '';
            $scope.distributes = [];
            $scope.regions = [];
            $scope.users = [];
           // $scope.getalldistribute();
        }
        
        
       
       

    }).controller('unsubscribedlist', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails,$route) {


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

        $scope.spinnerActive = true;

        $scope.distribute_total_count = 1;

        $scope.search_region = "";
        $scope.search_user = "";

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

        }

        $scope.getallunsubscribed = function () {
            $scope.spinnerActive = true;

            var url = 'apiv4/public/researchprovider/getallunsubscribed';
            var params = { email: $scope.email,search_startdate:$scope.realsearch_startdate,search_enddate:$scope.realsearch_enddate };
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.distributes = result.data;
                $scope.spinnerActive = false;
            });
   
        }

			$scope.Openpopupcustomlist = function () {
            $scope.showModaladdcontacts = true;
        }
      
        $scope.closeaddcontacts = function () {
            $scope.showModaladdcontacts = false;
        }

        $scope.addcontact = {};

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
            $scope.spinnerActive = false; 
            
        }

        $scope.addnewContacts = function (emails_array) {
            var params = {
              emails_array: emails_array
            };
            var tagUrl = 'apiv4/public/researchprovider/addunsubscribecontactsemails';
            RequestDetail.getDetail(tagUrl, params).then(function (result) {
               
              $scope.importeddata = result.data;
              $scope.invalid_list_emails = [];
      
              angular.forEach(result.data.invalid_list_emails, function (value,key) {
                $scope.invalid_list_emails.push({
                  email: value,
                  status: 0
                })
              });
      
              $scope.getallunsubscribed();
              $scope.showModaladdcontacts = false;
              alertService.add("success", 'Added Successfully !', 2000);
              $scope.spinnerActive = false;
            });
        }								   
        $scope.getallunsubscribed();

        $scope.cleardistribute = function () {
            $scope.email = "";
            $scope.realsearch_startdate = '';
            $scope.realsearch_enddate = '';
            $scope.search_startdate = '';
            $scope.search_enddate = '';
            $scope.getallunsubscribed();
        }

        $scope.import_investorunsubscribe_excel = function (data) {
            $scope.$apply(function () {
                $scope.spinnerActive = true;
                alertService.add("success", "Added Successfully !", 2000);
                $scope.getallunsubscribed();
                $scope.spinnerActive = false;
            });
        }
        
        $scope.resubscribe = function (distribute) {
            $scope.spinnerActive = true;

            var url = 'apiv4/public/researchprovider/distributeresubscribe';
            var params = { distribute: distribute };
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.getallunsubscribed();
            });
   
        }

        $scope.unsubscribe = function (distribute) {
            $scope.spinnerActive = true;

            var url = 'apiv4/public/researchprovider/distributeunsubscribe';
            var params = { distribute: distribute };
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.getallunsubscribed();
            });
   
        }
      
      

    })
    .controller('investorcreateDContent', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails,$route,$window) {
        $scope.configdetails = configdetails;
        $scope.openmodelpagehelp = function () {
            $scope.showModalpageinfo = !$scope.showModalpageinfo;
        }
        $scope.sidepopupactive = false;

        $scope.sidepopup = function () {
            $scope.sidepopupactive = !$scope.sidepopupactive;
        }

        $scope.dcdata = {};
        $scope.dcdata.distribute = [];

        $scope.dcdata.removedids = [];

        $scope.dcdata.custom_category = '';

        $scope.dcdata.includecompanylogo = true;
        $scope.dcdata.includeunsubscribelink = false;


        $scope.dcdata.trigger = '';
        $scope.dcdata.addlogostate = 1;
        $scope.dcdata.addunsubscribelinkstate = 0;

        $scope.dcdata.investordistribute = 1;


        $scope.user_data = localStorageService.get('userdata');


        $scope.user_type = $scope.user_data.user_type;


        $scope.dcdata.addinvesterslists = [];


        $scope.dcdata.newtemplateid = '';

        $scope.templates = [];

        $scope.dcdata.usertemplatestatus = 0;

        $scope.getemailtemplate = function () {
            var url = 'apiv4/public/researchprovider/gettemplates';
            var params = {};
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.templates = result.data;
                $scope.dcdata.usertemplatestatus = result.data.length;
            });
        }
        $scope.getemailtemplate();

        
        $scope.getdistrbutecustom = function () {
            var url = 'apiv4/public/researchprovider/getdistrbutecustom';
            var params = {};
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.dcdata.dcid = parseInt(result.data.distribute_content_id)+1;
            });
        }
        $scope.getdistrbutecustom();


        $scope.dcdata.temp_content_json = '';

        $scope.changenewtemplateid = function (newtemplateid) {
            if(newtemplateid!=''){
                $scope.spinnerActive = true;
                var url = 'apiv4/public/researchprovider/gettemplate';
                var params = {id:newtemplateid};
                RequestDetail.getDetail(url, params).then(function (result) {
                    //$scope.template = result.data;
                    $scope.dcdata.temp_content_json = JSON.stringify(result.data.content_json);
                    $timeout(function () {
                        $scope.spinnerActive = false;
                    }, 3000);
                });
            }
        }

        
        $scope.saveemailtemplate = function (json, html) {
            $scope.$apply(function () {
                $scope.dcdata.description = html;

               // var question_html= $("<div>" + $scope.dcdata.description + "</div>");

                ////console.log($scope.dcdata.description);
               // $(question_html).find('a').each(function() {
                   // //console.log($(this).attr('href'));
                  //  //console.log($.trim($(this).text()));
                    //if($.trim($(this).text())=='Read the Blog'){
                      //  $(this).attr('href') 
                       // $(this).attr('href',$scope.customlinks['profile_blog']);
                    //}
                //});

                //$($scope.dcdata.description).find('a').each(function() {
                  //   //console.log($(this).attr('href'));
                //     //console.log($.trim($(this).text()));
                     //if($.trim($(this).text())=='Read the Blog'){
                       //  $(this).attr('href') 
                     //    $('#amount').attr('href',$scope.customlinks['profile_blog']);
                    // }
                // });

                $scope.dcdata.description_json = json;
            });
        }




        $scope.investers = '';

        var tagUrl = 'apiv4/public/dashboard/getInvestorsList';
        var params = { key: 'tags' };
        RequestDetail.getDetail(tagUrl, params).then(function (result) {
            $scope.investerslist = {};
            $scope.investerslist = result.data;
        });
        $scope.selectinvestors = function (selected) {
            if (selected != undefined) {
                $scope.investers = selected.title;
            }
        }

        var tagUrl = 'apiv4/public/researchprovider/getCustomcategory';
        var params = {};
        RequestDetail.getDetail(tagUrl, params).then(function (result) {
            $scope.customcategories = result.data;
        });


        var tagUrl = 'apiv4/public/researchprovider/getCustomlinks';
        var params = {};
        RequestDetail.getDetail(tagUrl, params).then(function (result) {
            $scope.customlinks = result.data;
        });

        $scope.addinvesterlist = function () {
            if ($scope.investers != '') {
                if ($scope.dcdata.addinvesterslists.indexOf($scope.investers) == -1) {
                    
                    $scope.dcdata.addinvesterslists.push($scope.investers);
                    $scope.investers = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagInvestor');
                } else {
                    alertService.add("warning", "Already entered this item!", 2000);
                    $scope.investersgrp = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagInvestor');
                }
            }
        }

        $scope.dcdata.send_type = '1';
        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.dateOptions = {
            // dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
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
  
            var tagUrl = 'apiv4/public/researchprovider/getdistributetimes';
            var params = { date: dat};
            RequestDetail.getDetail(tagUrl, params).then(function (result) {
                $scope.stamptimes = result.data;
            });
        }

        $scope.removeInvester = function (index) {
            $scope.dcdata.addinvesterslists.splice(index, 1);
        }

        $scope.showcontactsedit = function (editinvester,index) {
            $scope.spinnerActive = true;

            var tagUrl = 'apiv4/public/researchprovider/getinvestorslist';

            var params = { investor: editinvester};

            RequestDetail.getDetail(tagUrl, params).then(function (result) {

                $scope.investorscontactlists = result.data;
                angular.forEach($scope.investorscontactlists, function (data,key) {
                    if($scope.dcdata.removedids.indexOf(data.investor_contacts_id)>=0){
                        $scope.investorscontactlists[key].addedstatus = 0;
                    }else{
                        $scope.investorscontactlists[key].addedstatus = 1;
                    }
                   
                });

                $scope.showModalcontactsedit = true;

                $scope.spinnerActive = false;
            });
        }

        $scope.previewReceipts = function () {
            var tagUrl = 'apiv4/public/researchprovider/getinvestorsreceipts';
            var params = { dcdata: $scope.dcdata};

            RequestDetail.getDetail(tagUrl, params).then(function (result) {
                $scope.investorscontacts = result.data;
                $scope.showModalcontacts = true;
            });
        }


        $scope.removethisemail = function (id) {
            $scope.dcdata.removedids.push(id);
            angular.forEach($scope.investorscontactlists, function (data,key) {
                if($scope.dcdata.removedids.indexOf(data.investor_contacts_id)>=0){
                    $scope.investorscontactlists[key].addedstatus = 0;
                }
            });
        }

        $scope.Addthisemail = function (id) {
            var index =  $scope.dcdata.removedids.indexOf(id);
            if (index > -1) {
                $scope.dcdata.removedids.splice(index, 1);
            }
           
            angular.forEach($scope.investorscontactlists, function (data,key) {
                if($scope.investorscontactlists[key].investor_contacts_id==id){
                    $scope.investorscontactlists[key].addedstatus = 1;
               }
            });
        }
        

        $scope.selectallemail = function () {
            angular.forEach($scope.investorscontactlists, function (data,key) {
                    $scope.investorscontactlists[key].addedstatus = 1;
            });
            $scope.dcdata.removedids = [];
        }
 
        $scope.unselectallemail = function () {
            $scope.dcdata.removedids = [];
            angular.forEach($scope.investorscontactlists, function (data,key) {
                $scope.investorscontactlists[key].addedstatus = 0;
                $scope.dcdata.removedids.push($scope.investorscontactlists[key].investor_contacts_id);
            });
        }


        $scope.closepopup = function () {
            $scope.showModalcontactsedit = false;
            $scope.showModalcontacts = false;
        }


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


        $scope.availableIndustry = [];
        $scope.availableIndustry_sector = [];
        var tagUrl = 'apiv4/public/user/get_industries_Mid_macro';
        RequestDetail.getDetail(tagUrl, params).then(function (result) {
            if (angular.isDefined(result.data)) {
                $scope.availableIndustry = result.data.industries_macro;
                $scope.availableIndustry_sector = result.data.industries_sectors;
            } else {
                $scope.availableIndustry = [];
                $scope.availableIndustry_sector = [];
            }
        });
        
       
        $scope.dcdata.distributefiles = [];

        $scope.uploaddistributeFile = function (imgdata) {
            var obj = JSON.parse(imgdata);

            $scope.$apply(function () {
                $scope.dcdata.distributefiles.push({
                    file_name: obj.name,
                    file_location: 'uploads/distributecontent/' + obj.uploadedname
                });
            });

        }
        $scope.removeFiles = function (index) {
            $scope.dcdata.distributefiles.splice(index, 1);
        }


        $scope.dcdata.distributedisclaimers = [];

        $scope.uploaddistributeDisclaimers = function (imgdata) {
            $scope.dcdata.distributedisclaimers = [];

            var obj = JSON.parse(imgdata);
            $scope.$apply(function () {
                $scope.dcdata.distributedisclaimers.push({
                    file_name: obj.name,
                    file_location: 'uploads/distributecontent/' + obj.uploadedname
                })
            });

        }
        $scope.removeFilesdisclimers = function (index) {
            $scope.dcdata.distributedisclaimers.splice(index, 1);
        }

        $scope.showModalpagepreview = false;

       

        
        $scope.searchtxtchag = function () {
            if($scope.search_txt==''){
                $scope.getideas(1);
            }
        }

        $scope.checkemailval = function (email) {
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(String(email).toLowerCase());
		}

        $scope.adddistribtecontent = function () {


            if (angular.isUndefined($scope.dcdata.title) || $scope.dcdata.title == '') {
                alertService.add("warning", "Please enter title !", 2000);
                return false;
            }
            if (angular.isUndefined($scope.dcdata.description) || $scope.dcdata.description == '') {
                alertService.add("warning", "Please enter description !", 2000);
                return false;
            }
            
            if (angular.isUndefined($scope.dcdata.email) || $scope.dcdata.email == '') {
                if ($scope.dcdata.addinvesterslists.length == 0) {
                    alertService.add("warning", "Please enter email or select distribution list !", 2000);
                    return false;
                }
                
            }

            if($scope.dcdata.send_type==2){
                if (angular.isUndefined($scope.dcdata.send_date) || $scope.dcdata.send_date == '') {
                    alertService.add("warning", "Please select date !", 2000);
                    return false;
                }
               
                if (angular.isUndefined($scope.dcdata.send_time) || $scope.dcdata.send_time == '') {
                    alertService.add("warning", "Please select time !", 2000);
                    return false;
                }
            }
            var res = 1;

           
            if ($scope.dcdata.email != '' && !angular.isUndefined($scope.dcdata.email)) {
                
                var emails = $scope.dcdata.email.split(',');
                angular.forEach(emails, function (email) {
                    if (!$scope.checkemailval(email)) {
                        alertService.add("warning", "Please enter valid emails separated by comma!", 2000);
                        res = 0;
                        return false;
                    }
                });
                
            }

           
            if ($scope.dcdata.addinvesterslists.length == 0) {
                if (angular.isUndefined($scope.dcdata.email) || $scope.dcdata.email == '') {
                    alertService.add("warning", "Please enter email or select distribution list  !", 2000);
                    return false;
                }
                
            }

            if(res){
                $scope.showModalpagepreview = !$scope.showModalpagepreview;
                
            }
            
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

        var user_data = localStorageService.get('userdata');
        $scope.user_id = user_data.user_id;


        


        if($routeParams.email){
            $scope.dcdata.email = $routeParams.email;
        }

        if (angular.isDefined($routeParams.distributeId) && $routeParams.distributeId != '') {

			var url = 'apiv4/public/researchprovider/getdistribute';
			var params = {
				distribute_id: $routeParams.distributeId
			};

			RequestDetail.getDetail(url, params).then(function (result) {
				if (angular.isDefined(result.data) && result.data != 0) {
                    
                    $scope.dcdata.dcid = result.data.investordistribute_id;

                    $scope.dcdata.title = result.data.title;
                    if($routeParams.email){
                      $scope.dcdata.title = 'Re: '+$scope.dcdata.title;
                    }
                    $scope.dcdata.description = result.data.description;
                    $scope.dcdata.mailer_type = result.data.mailer_type;
                    $scope.dcdata.email = result.data.email;
                    if(result.data.includecompanylogo){ 
                        $scope.dcdata.includecompanylogo = true;
                    }
                    if(result.data.includeunsubscribelink){ 
                        $scope.dcdata.includeunsubscribelink = true;
                    }
                   
                    $scope.dcdata.content_json = result.data.content_json;

                    if($routeParams.email){
                        $scope.dcdata.email = $routeParams.email;
                    }else{
                        if(result.data.investerslists){
                            $scope.dcdata.addinvesterslists = result.data.investerslists.split(',');
                        }
                    }
                    
                   
                    if(result.data.distribute){
                        $scope.dcdata.distribute = result.data.distribute.split(',');
                    }

                    $scope.dcdata.distributefiles = result.data.distributefiles;


                    $scope.stamptimes = [];

                     
                    var tagUrl = 'apiv4/public/researchprovider/getdistributetimes';
                    var params = { date: result.data.send_date};
                    RequestDetail.getDetail(tagUrl, params).then(function (result) {
                        $scope.stamptimes = result.data;
                    });
                     
                    
                    if(result.data.tickers){
                        $scope.dcdata.tickers = result.data.tickers.split(',');
                    }
                    if(result.data.industry_tag){
                        $scope.dcdata.industry_tag = result.data.industry_tag.split(',');
                    }
                    if(result.data.keywords){
                        $scope.dcdata.sectors = result.data.keywords.split(',');
                    }

                    if(result.data.disclaimers_file && result.data.disclaimers_location){
                        $scope.dcdata.distributedisclaimers.push({
                            file_name: result.data.disclaimers_file,
                            file_location: result.data.disclaimers_location
                        });
                    }
                    
 

				}
			});
        }
        
        if (angular.isDefined($routeParams.filterStatus) && $routeParams.filterStatus != '') {
            $scope.spinnerActive = true;

			var url = 'apiv4/public/researchprovider/getdistributeusersstatus';
			var params = {
                filterStatus: $routeParams.filterStatus,
                distribute_id: $routeParams.distributeId
            };
            RequestDetail.getDetail(url, params).then(function (result) {
                    
                    angular.forEach($scope.dcdata.addinvesterslists, function (data,key) { 
                        
                        var tagUrl = 'apiv4/public/researchprovider/getinvestorslist';

                        var params = { investor: data};
            
                        RequestDetail.getDetail(tagUrl, params).then(function (list) {
                           
                            angular.forEach(list.data, function (datalist,keylist) {
                                var remove = 1;
                                angular.forEach(result.data, function (dataadd,keyadd) { 
                                   if(dataadd.email==datalist.email){
                                        remove = 0;
                                   }
                                });
                                if(remove){
                                    $scope.dcdata.removedids.push(datalist.investor_contacts_id);
                                }
                            });
                           
                        });

                    });

                    $scope.spinnerActive = false;
            });
        }

        if (angular.isDefined($routeParams.email) && $routeParams.email != '') {
            $scope.dcdata.email = $routeParams.email;
        }


       
        $scope.confirmmail = function (type_send) {

            setTimeout(function(){ 
                $scope.$apply(function () {
                    res =1;
                    if (angular.isUndefined($scope.dcdata.title) || $scope.dcdata.title == '') {
                        alertService.add("warning", "Please enter title !", 2000);
                        return false;
                    }
                    if (angular.isUndefined($scope.dcdata.description) || $scope.dcdata.description == '') {
                        alertService.add("warning", "Please enter description !", 2000);
                        return false;
                    }
                
                    if (angular.isUndefined($scope.dcdata.email) || $scope.dcdata.email == '') {
                        if ($scope.dcdata.addinvesterslists.length == 0) {
                            alertService.add("warning", "Please enter email or select distribution list !", 2000);
                            return false;
                        }
                        
                    }
    
                    if($scope.dcdata.send_type==2){
                        if (angular.isUndefined($scope.dcdata.send_date) || $scope.dcdata.send_date == '') {
                            alertService.add("warning", "Please select date !", 2000);
                            return false;
                        }
                    
                        if (angular.isUndefined($scope.dcdata.send_time) || $scope.dcdata.send_time == '') {
                            alertService.add("warning", "Please select time !", 2000);
                            return false;
                        }
                    }
                    var res = 1;
    
                
                    if ($scope.dcdata.email != '' && !angular.isUndefined($scope.dcdata.email)) {
                        
                        var emails = $scope.dcdata.email.split(',');
                        angular.forEach(emails, function (email) {
                            if (!$scope.checkemailval(email.trim())) {
                                alertService.add("warning", "Please enter valid emails separated by comma!", 2000);
                                res = 0;
                                return false;
                            }
                        });
                        
                    }
    
                
                    if ($scope.dcdata.addinvesterslists.length == 0) {
                        if (angular.isUndefined($scope.dcdata.email) || $scope.dcdata.email == '') {
                            alertService.add("warning", "Please enter email or select distribution list  !", 2000);
                            return false;
                        }
                    
                    }
    
                
                    if(!$scope.dcdata.includecompanylogo){
                        $scope.dcdata.addlogostate = 0;
                    }
    
                    if($scope.dcdata.includeunsubscribelink){
                        $scope.dcdata.addunsubscribelinkstate = 1;
                    }
    
                    if(res){
                        $scope.spinnerActive = true;
    
                        if(type_send==2){
                            var url = 'apiv4/public/researchprovider/adddistribute';
                        }else if(type_send==1 || type_send==4){
                            var url = 'apiv4/public/researchprovider/savedistribute';
                        }
                    
                        var params = { dcdata: $scope.dcdata};
                        RequestDetail.getDetail(url, params).then(function (result) {
                            alertService.add("success", "Saved Successfully !", 2000);
                            $scope.dcdata = {};
                            $scope.dcdata.distribute = [];
                            $scope.dcdata.distribute.push('Ideas');
                            $scope.showModalpagepreview = false;
                            $scope.spinnerActive = false;
    
                            if(type_send==2){
                                alertService.add("success", "Sent Successfully !", 2000);
                                if($scope.user_type==4){
                                    $location.path('researchanalytics');
                                }else{
                                    $location.path('distributeanalytics');
                                }
                            }else if(type_send==1){
                                alertService.add("success", "Saved Successfully !", 2000);
                                $location.path('investordistributeContent/edit/'+result.data.distribute_content_id_url);
                            }else if(type_send==4){
                                alertService.add("success", "Saved Successfully !", 2000);
                                $window.open('#/investordistributeContent/preview/'+result.data.distribute_content_id_url, '_blank');
                                $location.path('investordistributeContent/edit/'+result.data.distribute_content_id_url);
                            }
    
                        });
                    }
                });
            }, 5000);
            
        }

        $scope.dcdata.distribute = [];
        $scope.dcdata.distribute.push('Ideas');

    })
    .controller('investoreditDContent', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails,$route) {
        $scope.configdetails = configdetails;
        $scope.openmodelpagehelp = function () {
            $scope.showModalpageinfo = !$scope.showModalpageinfo;
        }
        $scope.sidepopupactive = false;

        $scope.sidepopup = function () {
            $scope.sidepopupactive = !$scope.sidepopupactive;
        }

        $scope.distributeId = $routeParams.distributeId;

        

        $scope.dcdata = {};
        $scope.dcdata.distribute = [];

        $scope.dcdata.removedids = [];

        $scope.dcdata.mailer_type = '1';

        $scope.dcdata.includecompanylogo = true;
        $scope.dcdata.includeunsubscribelink = false;

        $scope.dcdata.trigger = '';
        $scope.dcdata.addlogostate = 1;
        $scope.dcdata.addunsubscribelinkstate = 0;
        $scope.dcdata.investordistribute = 1;
        
        $scope.user_data = localStorageService.get('userdata');

        $scope.user_type = $scope.user_data.user_type;
        $scope.dcdata.addinvesterslists = [];
        
        $scope.saveemailtemplate = function (json, html) {
            $scope.$apply(function () {
                $scope.dcdata.description = html;

               // var question_html= $("<div>" + $scope.dcdata.description + "</div>");

                ////console.log($scope.dcdata.description);
               // $(question_html).find('a').each(function() {
                   // //console.log($(this).attr('href'));
                  //  //console.log($.trim($(this).text()));
                    //if($.trim($(this).text())=='Read the Blog'){
                      //  $(this).attr('href') 
                       // $(this).attr('href',$scope.customlinks['profile_blog']);
                    //}
                //});

                //$($scope.dcdata.description).find('a').each(function() {
                  //   //console.log($(this).attr('href'));
                //     //console.log($.trim($(this).text()));
                     //if($.trim($(this).text())=='Read the Blog'){
                       //  $(this).attr('href') 
                     //    $('#amount').attr('href',$scope.customlinks['profile_blog']);
                    // }
                // });

                $scope.dcdata.description_json = json;
            });
        }

        $scope.investers = '';

        var tagUrl = 'apiv4/public/dashboard/getInvestorsList';
        var params = { key: 'tags' };
        RequestDetail.getDetail(tagUrl, params).then(function (result) {
            $scope.investerslist = {};
            $scope.investerslist = result.data;
        });
        $scope.selectinvestors = function (selected) {
            if (selected != undefined) {
                $scope.investers = selected.title;
            }
        }

        $scope.templates = [];

        $scope.dcdata.usertemplatestatus = 0;

        $scope.getemailtemplate = function () {
            var url = 'apiv4/public/researchprovider/gettemplates';
            var params = {};
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.templates = result.data;
                $scope.dcdata.usertemplatestatus = result.data.length;
            });
        }
        $scope.getemailtemplate();


        $scope.addinvesterlist = function () {
            if ($scope.investers != '') {
                if ($scope.dcdata.addinvesterslists.indexOf($scope.investers) == -1) {
                    
                    $scope.dcdata.addinvesterslists.push($scope.investers);
                    $scope.investers = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagInvestor');
                } else {
                    alertService.add("warning", "Already entered this item!", 2000);
                    $scope.investersgrp = '';
                    $scope.$broadcast('angucomplete-alt:clearInput', 'tagInvestor');
                }
            }
        }

        $scope.dcdata.send_type = '1';
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

        $scope.removeInvester = function (index) {
            $scope.dcdata.addinvesterslists.splice(index, 1);
        }

        $scope.showcontactsedit = function (editinvester,index) {
            $scope.spinnerActive = true;
            var tagUrl = 'apiv4/public/researchprovider/getinvestorslist';

            var params = { investor: editinvester};

            RequestDetail.getDetail(tagUrl, params).then(function (result) {

                $scope.investorscontactlists = result.data;
                angular.forEach($scope.investorscontactlists, function (data,key) {
                    if($scope.dcdata.removedids.indexOf(data.investor_contacts_id)>=0){
                        $scope.investorscontactlists[key].addedstatus = 0;
                    }else{
                        $scope.investorscontactlists[key].addedstatus = 1;
                    }
                   
                });

                $scope.showModalcontactsedit = true;

                $scope.spinnerActive = false;
            });
        }

        $scope.previewReceipts = function () {
            var tagUrl = 'apiv4/public/researchprovider/getinvestorsreceipts';
            var params = { dcdata: $scope.dcdata};

            RequestDetail.getDetail(tagUrl, params).then(function (result) {
                $scope.investorscontacts = result.data;
                $scope.showModalcontacts = true;
            });
        }


        $scope.removethisemail = function (id) {
            
            $scope.dcdata.removedids.push(id);
            angular.forEach($scope.investorscontactlists, function (data,key) {
                if($scope.dcdata.removedids.indexOf(data.investor_contacts_id)>=0){
                    $scope.investorscontactlists[key].addedstatus = 0;
                }
            });
        }

        $scope.Addthisemail = function (id) {
           
            var index =  $scope.dcdata.removedids.indexOf(id);
            if (index > -1) {
                $scope.dcdata.removedids.splice(index, 1);
            }
           
            angular.forEach($scope.investorscontactlists, function (data,key) {
                if($scope.investorscontactlists[key].investor_contacts_id==id){
                    $scope.investorscontactlists[key].addedstatus = 1;
               }
            });
        }
        

        $scope.selectallemail = function () {
            angular.forEach($scope.investorscontactlists, function (data,key) {
                    $scope.investorscontactlists[key].addedstatus = 1;
            });
            $scope.dcdata.removedids = [];
        }
 
        $scope.unselectallemail = function () {
            $scope.dcdata.removedids = [];
            angular.forEach($scope.investorscontactlists, function (data,key) {
                $scope.investorscontactlists[key].addedstatus = 0;
                $scope.dcdata.removedids.push($scope.investorscontactlists[key].investor_contacts_id);
            });
        }


        $scope.closepopup = function () {
            $scope.showModalcontactsedit = false;
            $scope.showModalcontacts = false;
        }


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


        $scope.availableIndustry = [];
        $scope.availableIndustry_sector = [];
        var tagUrl = 'apiv4/public/user/get_industries_Mid_macro';
        RequestDetail.getDetail(tagUrl, params).then(function (result) {
            if (angular.isDefined(result.data)) {
                $scope.availableIndustry = result.data.industries_macro;
                $scope.availableIndustry_sector = result.data.industries_sectors;
            } else {
                $scope.availableIndustry = [];
                $scope.availableIndustry_sector = [];
            }
        });
        
        $scope.onSelecteddistribute = function () {
            if($scope.dcdata.mailer_type==2){
                $scope.dcdata.distribute = [];
                $scope.dcdata.distribute.push('Ideas');
                angular.forEach($scope.ideas, function (data,key) {
                    $scope.ideas[key].selected = 0;
                });
            }
        }

        $scope.dcdata.distributefiles = [];

        $scope.uploaddistributeFile = function (imgdata) {
            var obj = JSON.parse(imgdata);

            $scope.$apply(function () {
                $scope.dcdata.distributefiles.push({
                    file_name: obj.name,
                    file_location: 'uploads/distributecontent/' + obj.uploadedname
                });
            });

        }
        $scope.removeFiles = function (index) {
            $scope.dcdata.distributefiles.splice(index, 1);
        }


        $scope.dcdata.distributedisclaimers = [];

        $scope.uploaddistributeDisclaimers = function (imgdata) {
            $scope.dcdata.distributedisclaimers = [];

            var obj = JSON.parse(imgdata);
            $scope.$apply(function () {
                $scope.dcdata.distributedisclaimers.push({
                    file_name: obj.name,
                    file_location: 'uploads/distributecontent/' + obj.uploadedname
                })
            });

        }
        $scope.removeFilesdisclimers = function (index) {
            $scope.dcdata.distributedisclaimers.splice(index, 1);
        }

        $scope.showModalpagepreview = false;


        $scope.checkemailval = function (email) {
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(String(email).toLowerCase());
		}

        $scope.adddistribtecontent = function () {


            if (angular.isUndefined($scope.dcdata.title) || $scope.dcdata.title == '') {
                alertService.add("warning", "Please enter title !", 2000);
                return false;
            }
            if (angular.isUndefined($scope.dcdata.description) || $scope.dcdata.description == '') {
                alertService.add("warning", "Please enter description !", 2000);
                return false;
            }
            
            if (angular.isUndefined($scope.dcdata.email) || $scope.dcdata.email == '') {
                if ($scope.dcdata.addinvesterslists.length == 0) {
                    alertService.add("warning", "Please enter email or select distribution list !", 2000);
                    return false;
                }
                
            }

            
            if($scope.dcdata.send_type==2){
                
                if (angular.isUndefined($scope.dcdata.send_date) || $scope.dcdata.send_date == '') {
                    alertService.add("warning", "Please select date !", 2000);
                    return false;
                }
               
                if (angular.isUndefined($scope.dcdata.send_time) || $scope.dcdata.send_time == '') {
                    alertService.add("warning", "Please select time !", 2000);
                    return false;
                }
            }
            var res = 1;

           
            if ($scope.dcdata.email != '' && !angular.isUndefined($scope.dcdata.email)) {
                
                var emails = $scope.dcdata.email.split(',');
                angular.forEach(emails, function (email) {
                    if (!$scope.checkemailval(email)) {
                        alertService.add("warning", "Please enter valid emails separated by comma!", 2000);
                        res = 0;
                        return false;
                    }
                });
                
            }

           
            if ($scope.dcdata.addinvesterslists.length == 0) {
                if (angular.isUndefined($scope.dcdata.email) || $scope.dcdata.email == '') {
                    alertService.add("warning", "Please enter email or select distribution list  !", 2000);
                    return false;
                }
                
            }

            if(res){
                $scope.showModalpagepreview = !$scope.showModalpagepreview;
                
            }
            
        }


       
       

        $scope.dashboardList = [];

        $scope.getlist = function () {
            var url = 'apiv4/public/researchprovider/dashboardlist';
            var params = {};
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.dashboardList = result.data;
                if(result.data.length>0){
                    $scope.domain_url = result.data[0]['domain_url'];
                }
                $scope.dcdata.distribute = [];
            });
        }


        $scope.getlist();

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

        var user_data = localStorageService.get('userdata');
        $scope.user_id = user_data.user_id;



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

            var tagUrl = 'apiv4/public/researchprovider/getdistributetimes';
            var params = { date: dat};
            RequestDetail.getDetail(tagUrl, params).then(function (result) {
                $scope.stamptimes = result.data;
            });
        }

        if (angular.isDefined($routeParams.distributeId) && $routeParams.distributeId != '') {

			var url = 'apiv4/public/researchprovider/getdistribute';
			var params = {
				distribute_id: $routeParams.distributeId
			};

			RequestDetail.getDetail(url, params).then(function (result) {
				if (angular.isDefined(result.data) && result.data != 0) {
                   
                    $scope.dcdata.dcid = result.data.investordistribute_id;

                    $scope.dcdata.title = result.data.title;
                    $scope.dcdata.description = result.data.description;
                    $scope.dcdata.mailer_type = result.data.mailer_type;
                    $scope.dcdata.email = result.data.email;
                    ////console.log(result.data.send_date);
                    $scope.dcdata.send_type = result.data.send_type;
                    $scope.dcdata.send_date_selected = result.data.send_date;
                    $scope.dcdata.send_time = result.data.send_time;

                    $scope.dcdata.realsend_date = result.data.send_date;
                    
                    $scope.dcdata.includecompanylogo = false;
                    $scope.dcdata.includeunsubscribelink = false;
                    if(result.data.addlogostate==1){ 
                        $scope.dcdata.includecompanylogo = true;
                    }
                    if(result.data.addunsubscribelinkstate==1){ 
                        $scope.dcdata.includeunsubscribelink = true;
                    }
                   

                    $scope.dcdata.distributefiles = result.data.distributefiles;

                    if(result.data.investerslists){
                        $scope.dcdata.addinvesterslists = result.data.investerslists.split(',');
                    }
                    if(result.data.removedids){
                        $scope.dcdata.removedids = result.data.removedids.split(',');
                    }
                   
                    $timeout(function () {
                        if(result.data.distribute){
                            $scope.dcdata.distribute = result.data.distribute.split(',');
                        }
                    }, 1000);

                    var tagUrl = 'apiv4/public/researchprovider/getdistributetimes';
                    var params = { date: result.data.send_date};
                    RequestDetail.getDetail(tagUrl, params).then(function (result) {
                        $scope.stamptimes = result.data;
                    });
                    
                    if(result.data.tickers){
                        $scope.dcdata.tickers = result.data.tickers.split(',');
                    }
                    if(result.data.industry_tag){
                        $scope.dcdata.industry_tag = result.data.industry_tag.split(',');
                    }
                    if(result.data.keywords){
                        $scope.dcdata.sectors = result.data.keywords.split(',');
                    }

                    if(result.data.disclaimers_file && result.data.disclaimers_location){
                        $scope.dcdata.distributedisclaimers.push({
                            file_name: result.data.disclaimers_file,
                            file_location: result.data.disclaimers_location
                        });
                    }
                    
                    $timeout(function () {
                        angular.forEach($scope.ideas, function (data,key1) {
                            if(result.data.ideas_ids){
                                if(result.data.ideas_ids.split(',')){
                                    angular.forEach(result.data.ideas_ids.split(','), function (selecteddata,key2) {
                                        if(data.ideas_id==selecteddata){
                                            $scope.ideas[key1].selected = 1;
                                        }
                                    });
                                }
                            }
                        });  
                    }, 1000);

				}
			});
        }
        


        $scope.selectdistributeall = function () {
            if($scope.dcdata.mailer_type==2){
                alertService.add("warning", "Mailer type single idea!", 2000);
                return false;
            }
            angular.forEach($scope.dashboardList, function (data,key) {
                $scope.dashboardList[key].selected = 1;
            });
            angular.forEach($scope.ideas, function (data,key) {
                $scope.ideas[key].selected = 1;
            });
            angular.forEach($scope.eventlist.my_events, function (data,key) {
                $scope.eventlist.my_events[key].selected = 1;
            });
        }
        $scope.unselectdistributeall = function () {
            angular.forEach($scope.dashboardList, function (data,key) {
                $scope.dashboardList[key].selected = 0;
            });
            angular.forEach($scope.ideas, function (data,key) {
                $scope.ideas[key].selected = 0;
            });
            angular.forEach($scope.eventlist.my_events, function (data,key) {
                $scope.eventlist.my_events[key].selected = 0;
            });
        }


        $scope.adddashboards = function (index) {
            $scope.dashboardList[index].selected = 1;
        }
        $scope.removeddashboards = function (index) {
            $scope.dashboardList[index].selected = 0;
        }
        
        
      
       
        $scope.confirmmail = function (type_send) {
          
           
            if(!$scope.dcdata.includecompanylogo){
                $scope.dcdata.addlogostate = 0;
            }

            if($scope.dcdata.includeunsubscribelink){
                $scope.dcdata.addunsubscribelinkstate = 1;
            }

            if($scope.dcdata.send_type==2){
                 if (angular.isUndefined($scope.dcdata.send_time) || $scope.dcdata.send_time == '') {
                     alertService.add("warning", "Please select time !", 2000);
                     return false;
                 }
            }


            $scope.spinnerActive = true;
            if(type_send==2){
                var url = 'apiv4/public/researchprovider/adddistribute';
            }else if(type_send==3){
                var url = 'apiv4/public/researchprovider/updatedistribute';
            }
           
            var params = { dcdata: $scope.dcdata, distribute_id: $routeParams.distributeId };
            RequestDetail.getDetail(url, params).then(function (result) {
                
                if(type_send==2){
                    alertService.add("success", "Sent Successfully !", 2000);
                }else if(type_send==3){
                    alertService.add("success", "Updated Successfully !", 2000);
                }
                $scope.dcdata = {};
				$scope.dcdata.distribute = [];
                $scope.showModalpagepreview = false;
                $scope.spinnerActive = false;

               
                if(type_send==2){
                    alertService.add("success", "Sent Successfully !", 2000);
                    $location.path('distributeanalytics');
                }else if(type_send==3){
                    alertService.add("success", "Updated Successfully !", 2000);
                    $route.reload();
                }

            });
        }

        


    })
    .controller('managetemplates', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails,$route) {
    
        $scope.pagetitle = 'Create Email Template';

        $scope.templates = [];

       

        $scope.getemailtemplate = function () {
            var url = 'apiv4/public/researchprovider/gettemplates';
            var params = {};
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.templates = result.data;
            });
        }
        $scope.getemailtemplate();
        $scope.deletetemplate = function (id) {
            if (confirm("Are you sure?")) {
                var url = 'apiv4/public/researchprovider/delecteTemplate';
                var params = {id:id}
                RequestDetail.getDetail(url, params).then(function (result) {
                    alertService.add("success", "Delected Successfully !", 2000);
                    $scope.getemailtemplate();
                });
            }
        }

		// COLUMN TO SORT
		$scope.column = 'name';

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

        
    })
    .controller('newinvestortemplate', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails,$route) {
    
        $scope.pagetitle = 'Create Email Template';

        $scope.user_data = localStorageService.get('userdata');

        $scope.template = {};
        $scope.saveemailtemplate = function (json, html) {
            $scope.$apply(function () {
                $scope.template.description = html;
                $scope.template.content_json = json;
            });
        }

        $scope.template = {};
        $scope.template.content_json = '';

       
        $scope.editstatus = 0;

        $scope.template.template_id = 1;

        $scope.getlastemailtemplate = function () {
            var url = 'apiv4/public/researchprovider/getlastemailtemplate';
            var params = {};
            RequestDetail.getDetail(url, params).then(function (result) {
                if(result.data){
                    $scope.template.template_id = parseInt(result.data.id) + parseInt(1);
                }else{
                    $scope.template.template_id = 1;
                }
               
            });
        }

        if (angular.isDefined($routeParams.id) && $routeParams.id != '') {
            
            $scope.spinnerActive = true;
            $scope.editstatus = 1;

            var url = 'apiv4/public/researchprovider/gettemplatebse';
            var params = {id:$routeParams.id};
            RequestDetail.getDetail(url, params).then(function (result) {
                $scope.template = result.data;
                $scope.template.content_json = JSON.stringify(result.data.content_json);

                $scope.template.template_id  = parseInt(result.data.count_id) + parseInt(1);

            });
            setTimeout(function(){ 
                $scope.$apply(function () {
                    $scope.spinnerActive = false;
                });
            }, 10000);
        }else{
            $scope.getlastemailtemplate();
        }

        $scope.templates = [];
        

        var url = 'apiv4/public/researchprovider/defaultgettemplates';
        var params = {};
        RequestDetail.getDetail(url, params).then(function (result) {
            $scope.templates = result.data;
        });

        $scope.template.temp_content_json = '';

        $scope.changenewtemplateid = function (newtemplateid) {
            if(newtemplateid!=''){
                $scope.spinnerActive = true;
                var url = 'apiv4/public/researchprovider/gettemplate';
                var params = {id:newtemplateid};
                RequestDetail.getDetail(url, params).then(function (result) {
                    //$scope.template = result.data;
                    $scope.template.temp_content_json = JSON.stringify(result.data.content_json);
                    $timeout(function () {
                        $scope.spinnerActive = false;
                    }, 3000);
                });
            }
        }

        $scope.confirmmail = function (type) {

            setTimeout(function(){ 
                $scope.$apply(function () {
                    var res =1;
                    if (angular.isUndefined($scope.template.name) || $scope.template.name == '') {
                        alertService.add("warning", "Please enter name !", 2000);
                        res =0;
                        return false;
                    }
                    if (angular.isUndefined($scope.template.content_json) || $scope.template.content_json == '') {
                        alertService.add("warning", "Template cannot be empty!!", 2000);
                        res =0;
                        return false;
                    }
                
                    
    
                    if(res){
                        $scope.spinnerActive = true;
                        if(type==1){
                            var url = 'apiv4/public/researchprovider/savetemplate';
                        }
                        else{
                            var url = 'apiv4/public/researchprovider/updatetemplate';
                        }
                    
                        var params = { template: $scope.template};
                        RequestDetail.getDetail(url, params).then(function (result) {
                            alertService.add("success", "Saved Successfully !", 2000);
                            $scope.template = {}; 
                            $scope.spinnerActive = false;
                            $location.path('managetemplates');
                            
                            
    
                        });
                    }
                });
            }, 5000);
            
        }

        
    })

    .controller('topolCtrl', function ($scope, $http, $location, local, $filter, alertService, localStorageService, RequestDetail, $routeParams, $timeout, configdetails,$route) {
    
        $scope.pagetitle = 'Create Email Template';

        $scope.saveemailtemplate = function (json, html) {
            $scope.$apply(function () {
                //console.log(html);
                //console.log(json);
            });
        }
        
    })

    .controller('dashboardResearch', function ($scope, $http, $location, $route, $routeParams, localStorageService, RequestDetail, $window) {

		$scope.pageHeading = 'Manage Dashboards';
		$scope.dashboardResearchActive = 'active';



		$scope.dashboardList = [];

		$scope.getlist = function () {
			var url = 'apiv4/public/researchprovider/dashboardlist';
			var params = {};
			RequestDetail.getDetail(url, params).then(function (result) {
				$scope.dashboardList = result.data
			});
		}

		$scope.showModalpageinfo = false;

		$scope.openmodelpagehelp = function () {
			$scope.showModalpageinfo = !$scope.showModalpageinfo;
		}

		$scope.getlist();
		$scope.deleteDashboard = function (dashboard_id) {
			if (confirm("Are you sure?")) {
				var url = 'apiv4/public/researchprovider/deleteDashboard';
				var params = {
					dashboard_id: dashboard_id
				};
				RequestDetail.getDetail(url, params).then(function (result) {

				});
				$scope.getlist();
				$route.reload();
			}
		};

		$scope.deactivateDashboard = function (dashboard_id) {
			if (confirm("Are you sure?")) {
				var url = 'apiv4/public/researchprovider/deactivateDashboard';
				var params = {
					dashboard_id: dashboard_id
				};
				RequestDetail.getDetail(url, params).then(function (result) {

				});
				$scope.getlist();
				$route.reload();
			}
		};
		$scope.activateDashboard = function (dashboard_id) {
			if (confirm("Are you sure?")) {
				var url = 'apiv4/public/researchprovider/activateDashboard';
				var params = {
					dashboard_id: dashboard_id
				};
				RequestDetail.getDetail(url, params).then(function (result) {

				});
				$scope.getlist();
				$route.reload();
			}
		};

	})
	.controller('dashboardAnalytics', function ($scope, $http, $location, localStorageService, RequestDetail) {


		$scope.pageHeading = 'Research Provider';
		$scope.dashboardAnalyticsActive = 'active';
		$scope.dashboard_id = '';
		$scope.name = '';
		$scope.user_type = '';
		$scope.subscription_id = '';
		$scope.dateFrom = '';
		$scope.dateTo = '';


		$scope.user_typeList = [];

		var url = 'apiv4/public/researchprovider/getuser_type';
		var params = {};
		RequestDetail.getDetail(url, params).then(function (result) {
			$scope.user_typeList = result.data
		});


		$scope.subscriptionList = [];

		var url = 'apiv4/public/researchprovider/getsubscription_list';

		var params = {};
		RequestDetail.getDetail(url, params).then(function (result) {
			$scope.subscriptionList = result.data;
		});


		$scope.analyticsList = [];

		$scope.get_analytics_archive = function () {
			var url = 'apiv4/public/researchprovider/getanalyticsdata';
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

		$scope.sidepopupactive = false;

		$scope.sidepopup = function () {
			$scope.sidepopupactive = !$scope.sidepopupactive;
		}

		$scope.showModalpageinfo = false;

		$scope.openmodelpagehelp = function () {
			$scope.showModalpageinfo = !$scope.showModalpageinfo;
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


	}).controller('dashboardResearchnew', function ($scope, $http, $routeParams, $location, localStorageService, RequestDetail, alertService) {

		$scope.pageHeading = 'Dashboard';
		$scope.pagesubHeading = 'Create Dashboard';
		$scope.dashboardResearchActive = 'active';

		$scope.dashboard = {};
		$scope.dashboard.title = '';
		$scope.dashboard.subscription_term = '';
		$scope.dashboard.industry_tag = '';
		$scope.dashboard.price = '';
		$scope.dashboard.executivedescription = '';
		$scope.dashboard.description = '';
		$scope.dashboard.tags = '';
		$scope.dashboard.status = '';
		$scope.dashboard.permission = '';
		$scope.dashboard.dashboard_url = '';
		$scope.screenshot_file_old = [];
		$scope.columns = [];

		$scope.addcolumn = function () {
			var newColumn = {
				name: '',
				type: '',
			};
			$scope.columns.push(newColumn);
		};


		$scope.fileuploadmodeldataaddcolumn = function (excelfile) {

			$scope.spinnerActive = true;
			var params = {
				filepath: excelfile,
				dashboard_id: $routeParams.dashboardId
			};
			var uploadDataUrl = 'apiv4/public/researchprovider/uploaddashboardDataaddcolumn';
			RequestDetail.getDetail(uploadDataUrl, params).then(function (result) {
				$scope.columns = [];

				angular.forEach(result.data, function (col, index) {
					if (angular.isDefined(col) && col != '') {
						var newColumn = {
							name: col,
							type: '',
						};
						$scope.columns.push(newColumn);
					}
					$scope.spinnerActive = false;
				});



			});


		}



		$scope.get_search_details = function (type, searchkey) {
			if (angular.isDefined(searchkey) && searchkey != '') {
				if (type != '') {
					var tagUrl = 'apiv4/public/researchprovider/get_search_details';
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

				}
			}
		}

		$scope.onSelectedindustry = function (selectedItem) {
			if (selectedItem == 'All') {
				$scope.dashboard.industry_tag = [];
				$scope.dashboard.industry_tag.push('All');
			}
		}



		$scope.data = {};
		var filter_data = localStorageService.get('filter_data');
		if (filter_data != '' && filter_data != null && filter_data != 'null') {
			$scope.data = filter_data;
		}

		$scope.availableIndustry = [];
		if (angular.isDefined(filter_data) && filter_data != null && filter_data != 'null' && angular.isDefined(filter_data.industry) && filter_data.industry.length > 0) {
			$scope.availableIndustry.push('All');
			angular.forEach(filter_data.industry, function (industry, index) {
				if (angular.isDefined(industry) && industry != '') {
					var obj = new Object();
					obj = industry;
					$scope.availableIndustry.push(obj);
				}
			});

		}

		if (angular.isDefined($routeParams.dashboardId) && $routeParams.dashboardId != '') {

			$scope.pagesubHeading = 'Edit Dashboard';

			var url = 'apiv4/public/researchprovider/get_dashboard';
			var params = {
				dashboard_id: $routeParams.dashboardId
			};

			RequestDetail.getDetail(url, params).then(function (result) {

				if (angular.isDefined(result.data) && result.data != 0) {
					$scope.dashboard.title = result.data.title;
					$scope.dashboard.subscription_term = result.data.subscription_term
					$scope.dashboard.industry_tag = result.data.industry_tag;
					$scope.dashboard.price = result.data.price;

					$scope.dashboard.executivedescription = result.data.executivedescription;
					$scope.dashboard.description = result.data.description;
					$scope.dashboard.tags = result.data.tags;
					$scope.screenshot_file_old = result.data.screenshots;
					$scope.dashboard.status = result.data.status;
					$scope.dashboard.permission = result.data.permission;
					$scope.dashboard.dashboard_url = result.data.dashboard_url;

					////console.log(result.data.columns);


					for (var i = 0; i < result.data.columns.length; i++) {
						$scope.columns.push(result.data.columns[i]);
					}


					$scope.logo_file.push({
						file_name: result.data.logoname,
						file_location: result.data.logo,
					})


				}
			});

		} else {
			$scope.addcolumn();
		}



		$scope.showModalpageinfo = false;

		$scope.openmodelpagehelp = function () {
			$scope.showModalpageinfo = !$scope.showModalpageinfo;
		}


		$scope.removeoldFiles = function (index) {
			$scope.screenshot_file_old.splice(index, 1);
			$scope.screenshot_file_old_change = 1;
		}


		$scope.industryList = [];

		var url = 'apiv4/public/researchprovider/industryList';
		var params = {};
		RequestDetail.getDetail(url, params).then(function (result) {
			$scope.industryList = result.data
		});



		$scope.screenshot_file = [];


		$scope.removeFiles = function (index) {
			$scope.screenshot_file.splice(index, 1);
		}

		$scope.removeCol = function (index) {
			$scope.columns.splice(index, 1);
		}

		$scope.uploadscreenshotFile = function (imgdata) {
			if ($scope.screenshot_file.length == '0') {
				$scope.screenshot_file = [];
			}
			$scope.$apply(function () {
				$scope.screenshot_file.push({
					file_name: imgdata,
					file_location: 'uploads/temp/' + imgdata
				})
			});

		}

		$scope.logo_file = [];

		$scope.logo_file_change = 0;
		$scope.screenshot_file_old_change = 0;

		$scope.removeFileslogo = function (index) {
			$scope.logo_file.splice(index, 1);
		}

		$scope.uploadlogoFile = function (imgdata) {
			if ($scope.logo_file.length == '0') {
				$scope.logo_file = [];
			}
			$scope.$apply(function () {
				$scope.logo_file_change = 1;
				$scope.logo_file = [];
				$scope.logo_file.push({
					file_name: imgdata,
					file_location: 'uploads/temp/' + imgdata
				})


			});

		}



		$scope.postDashboard = function () {

			if (angular.isUndefined($scope.dashboard.title) || $scope.dashboard.title == '') {
				alertService.add("warning", "Title Invalid !", 2000);
				return false;
			}

			if (angular.isUndefined($scope.dashboard.subscription_term) || $scope.dashboard.subscription_term == '') {
				alertService.add("warning", "Subscription Term Invalid !", 2000);
				return false;
			}

			if (angular.isUndefined($scope.dashboard.industry_tag) || $scope.dashboard.industry_tag == '') {
				alertService.add("warning", "Industry Invalid !", 2000);
				return false;
			}

			if (angular.isUndefined($scope.dashboard.price) || $scope.dashboard.price == '') {
				alertService.add("warning", "Price Invalid !", 2000);
				return false;
			}


			if (angular.isUndefined($scope.dashboard.executivedescription) || $scope.dashboard.executivedescription == '') {
				alertService.add("warning", "Description Invalid !", 2000);
				return false;
			}

			if (angular.isUndefined($scope.dashboard.description) || $scope.dashboard.description == '') {
				alertService.add("warning", "Description Invalid !", 2000);
				return false;
			}

			if (angular.isUndefined($scope.logo_file) || $scope.logo_file == '' || $scope.logo_file == []) {
				alertService.add("warning", "Logo Invalid !", 2000);
				return false;
			}



			var postDashboardUrl = 'apiv4/public/researchprovider/newdashboard';

			$scope.selectedResponders = [];
			$scope.selectedResponders.push({
				'title': $scope.dashboard.title,
				'subscription_term': $scope.dashboard.subscription_term,
				'industry_tag': $scope.dashboard.industry_tag,
				'price': $scope.dashboard.price,
				'executivedescription': $scope.dashboard.executivedescription,
				'description': $scope.dashboard.description,
				'tags': $scope.dashboard.tags,
				'logo': $scope.logo,
				'status': $scope.dashboard.status,
				'permission': $scope.dashboard.permission,
				'dashboard_url': $scope.dashboard.dashboard_url

			})



			if (angular.isDefined($routeParams.dashboardId) && $routeParams.dashboardId != '') {
				var params = {
					dashboard: $scope.selectedResponders,
					screenshot_file: $scope.screenshot_file,
					logo_file: $scope.logo_file,
					dashboard_id: $routeParams.dashboardId,
					screenshot_file_old: $scope.screenshot_file_old,
					logo_file_change: $scope.logo_file_change,
					screenshot_file_old_change: $scope.screenshot_file_old_change,
					columns: $scope.columns
				};

			} else {
				var params = {
					dashboard: $scope.selectedResponders,
					screenshot_file: $scope.screenshot_file,
					logo_file: $scope.logo_file,
					logo_file_change: $scope.logo_file_change,
					columns: $scope.columns
				};
			}


			$scope.spinnerActive = true;
			RequestDetail.getDetail(postDashboardUrl, params).then(function (result) {
				if (result.data == 'true') {
					alertService.add("success", "Dashboard added Successfully !", 2000);
					$location.path('dashboardResearch');
				}
			});


		}



	}).controller('dashboardAccess', function ($scope, $http, $route, $routeParams, $location, localStorageService, RequestDetail) {

		$scope.pageHeading = 'Create Dashboard';
		$scope.dashboardResearchActive = 'active';

		$scope.showsearchpopupModal = false;
		$scope.togglerearchpopupThemeModal = function () {
			//  ******************** To avoid the api calling second time in same page Store in the variable and fetched the data ising $index value
			//$scope.values = $scope.FetchedData.items[index];
			// Assign the values to the variables
			$scope.showsearchpopupModal = !$scope.showsearchpopupModal;
			$scope.getuseraccess();

		};

		$scope.addbutton = 'Add Access';


		var url = 'apiv4/public/researchprovider/get_dashboard';
		var params = {
			dashboard_id: $routeParams.dashboardId
		};

		RequestDetail.getDetail(url, params).then(function (result) {
			if (result.data.permission == 1) {
				$scope.addbutton = 'Add Exclusion';
			}
		});





		$scope.dashboard_id = $routeParams.dashboardId;
		$scope.username = "";
		$scope.usertype = "";




		$scope.useraccessList = [];

		$scope.getuseraccess = function () {
			var url = 'apiv4/public/researchprovider/getuseraccess';
			var params = {
				dashboard_id: $scope.dashboard_id
			};
			RequestDetail.getDetail(url, params).then(function (result) {
				$scope.useraccessList = result.data;


			});
		}

		$scope.getuseraccess();

		$scope.showModalpageinfo = false;

		$scope.openmodelpagehelp = function () {
			$scope.showModalpageinfo = !$scope.showModalpageinfo;
		}

		$scope.userList = [];

		$scope.get_users_search = function () {
			$scope.userList = [];

			var url = 'apiv4/public/researchprovider/getusersdata';
			var params = {
				dashboard_id: $scope.dashboard_id,
				username: $scope.username,
				user_type: $scope.usertype
			};
			RequestDetail.getDetail(url, params).then(function (result) {
				$scope.userList = result.data;
			});
		}

		$scope.adduseraccess = function (user_id) {
			var url = 'apiv4/public/researchprovider/adduseraccess';
			var params = {
				dashboard_id: $scope.dashboard_id,
				username: $scope.username,
				user_type: $scope.usertype,
				user_id: user_id
			};
			RequestDetail.getDetail(url, params).then(function (result) {
				$scope.showsearchpopupModal = !$scope.showsearchpopupModal;
				$scope.getuseraccess();
				$scope.get_users_search();
			});
			
		}

		$scope.useraccessRevoke = function (dashboard_access_id) {
			var url = 'apiv4/public/researchprovider/useraccessRevoke';
			var params = {
				dashboard_access_id: dashboard_access_id
			};
			RequestDetail.getDetail(url, params).then(function (result) {
				$scope.getuseraccess();
				$scope.get_users_search();

			});
		}

		//$scope.get_users_search();


	}).controller('shareDashboard', function ($scope, $http, $routeParams, $location, localStorageService, RequestDetail, alertService) {

		$scope.pageHeading = 'Share';
		$scope.dashboardResearchActive = 'active';

		$scope.title = "";
		$scope.description = "";
		$scope.tags = "";
		$scope.url = "";
		$scope.emailto = "";


		if (angular.isDefined($routeParams.dashboardId) && $routeParams.dashboardId != '') {


			var url = 'apiv4/public/researchprovider/get_dashboard';
			var params = {
				dashboard_id: $routeParams.dashboardId
			};

			RequestDetail.getDetail(url, params).then(function (result) {
				if (angular.isDefined(result.data) && result.data != 0) {
					$scope.title = result.data.title;
					/*$scope.dashboard.subscription_term = result.data.subscription_term
					$scope.dashboard.industry_tag = result.data.industry_tag;
					$scope.dashboard.price = result.data.price;*/
					$scope.description = result.data.description;
					$scope.tags = result.data.tags;
					$scope.emailto = "";
					/*$scope.dashboard.tags = result.data.tags;
					$scope.screenshot_file_old = result.data.screenshots;
					$scope.dashboard.status = result.data.status;
					$scope.dashboard.permission =result.data.permission;*/



				}
			});

		}


		$scope.screenshot_file = [];


		$scope.removeFiles = function (index) {
			$scope.screenshot_file.splice(index, 1);
		}

		$scope.uploadscreenshotFile = function (imgdata) {
			if ($scope.screenshot_file.length == '0') {
				$scope.screenshot_file = [];
			}
			$scope.$apply(function () {
				$scope.screenshot_file.push({
					file_name: imgdata,
					file_location: 'uploads/temp/' + imgdata
				})
			});

		}


		$scope.showModalpageinfo = false;

		$scope.openmodelpagehelp = function () {
			$scope.showModalpageinfo = !$scope.showModalpageinfo;
		}



		$scope.postShare = function () {

			
			if (angular.isUndefined($scope.title) || $scope.title == '') {
				alertService.add("warning", "Title Invalid !", 2000);
				return false;
			}



			if (angular.isUndefined($scope.emailto) || $scope.emailto == '') {
				alertService.add("warning", "Email address Invalid !", 2000);
				return false;
			}


			if (angular.isUndefined($scope.description) || $scope.description == '') {
				alertService.add("warning", "Subscription Term Invalid !", 2000);
				return false;
			}



			var postDashboardUrl = 'apiv4/public/researchprovider/dashboardShare';

			$scope.selectedResponders = [];
			$scope.selectedResponders.push({
				'title': $scope.title,
				'description': $scope.description,
				'emails': $scope.emailto,
			})


			var params = {
				dashboard: $scope.selectedResponders,
				screenshot_file: $scope.screenshot_file,
			};




			$scope.spinnerActive = true;
			RequestDetail.getDetail(postDashboardUrl, params).then(function (result) {
				//console.log(result.data);
				$scope.spinnerActive = false;
				if (result.data.data == 'true') {
					alertService.add("success", "Dashboard shared Successfully !", 2000);
					$location.path('dashboardResearch');
				}
			});

		}


		//$scope.get_users_search();


	}).controller('dataDashboard', function ($scope, $http, $window, $route, $routeParams, $location, localStorageService, RequestDetail, alertService) {

		$scope.pageHeading = 'Upload Data';
		$scope.dashboardResearchActive = 'active';

		$scope.title = "";
		$scope.description = "";
		$scope.tags = "";
		$scope.url = "";
		$scope.emailto = "";
		$scope.dashboard_id = $routeParams.dashboardId;
		$scope.loadingshow = 0;
		$scope.replacedatashow = 1;
		$scope.adddatashow = 1;

		if (angular.isDefined($routeParams.dashboardId) && $routeParams.dashboardId != '') {



			$scope.spinnerActive = true;

			var url = 'apiv4/public/researchprovider/get_dashboard_count';
			var params = {
				dashboard_id: $routeParams.dashboardId
			};
			$scope.limit = 100;
			$scope.largelimit = 10;
			$scope.page = 1;
			$scope.paginations = [];
			$scope.balance = 0;


			RequestDetail.getDetail(url, params).then(function (result) {
				if (angular.isDefined(result.data) && result.data != 0) {
					$scope.spinnerActive = false;
					$scope.total_data_row = result.data;

					$scope.pagination_count = Math.floor($scope.total_data_row / $scope.limit);



					// $scope.balance = $scope.total_data_row % $scope.limit;	  
					////console.log($scope.total_data_row /$scope.limit);

					if ($scope.pagination_count < $scope.total_data_row / $scope.limit) {
						$scope.pagination_count = $scope.pagination_count + 1;
					}



					$scope.largelimit = Math.floor($scope.pagination_count / 4);

					for (var p_count = 1; p_count <= $scope.pagination_count; p_count++) {
						$scope.paginations.push(p_count);
					}
				} else {
					$scope.spinnerActive = false;
				}
			});


		}


		$scope.page = 0;

		$scope.pagination = function (page) {

			if (page != "undefined" && page != "" && page != 0) {

				if (page == 'prev') {
					if ($scope.page != 1) {
						$scope.page = $scope.page - 1;
					}
				} else if (page == 'prev1') {
					$scope.page = $scope.page - $scope.largelimit;
					if ($scope.page < 1) {
						$scope.page = 1;
					}
				} else if (page == 'next') {
					$scope.page = $scope.page + 1;
					if ($scope.page > $scope.pagination_count) {
						$scope.page = $scope.pagination_count;
					}
				} else if (page == 'next1') {
					$scope.page = $scope.page + $scope.largelimit;
					if ($scope.page > $scope.pagination_count) {
						$scope.page = $scope.pagination_count;
					}
				}



			}

			var url = 'apiv4/public/researchprovider/get_dashboard';
			var params = {
				dashboard_id: $routeParams.dashboardId,
				limit: $scope.limit,
				page: $scope.page
			};

			RequestDetail.getDetail(url, params).then(function (result) {
				if (angular.isDefined(result.data) && result.data != 0) {
					$scope.title = result.data.title;
					$scope.description = result.data.description;
					$scope.tags = result.data.tags;
					$scope.columns = result.data.columns;
					$scope.datas = result.data.datas;
					$scope.dashboard_id_real = result.data.dashboard_id;

				}
			});


			$scope.startindex = ($scope.page - 1) * $scope.limit;

		}


		$scope.pagination('next');

		$scope.paginationClass = function (page) {

			if (page == $scope.page) {
				return 'active_pagination';
			} else {
				return '';
			}
		}


		$scope.fileuploadmodeldata = function (excelfile) {
			if (confirm("This Operation will replace everything! Are you sure to continue?")) {

				$scope.loadingshow = 1;
				$scope.replacedatashow = 0;
				$scope.spinnerActive = true;

				var params = {
					filepath: excelfile,
					dashboard_id: $routeParams.dashboardId
				};
				var uploadDataUrl = 'apiv4/public/researchprovider/uploaddashboardData';
				RequestDetail.getDetail(uploadDataUrl, params).then(function (result) {
					if (result.data == 'true') {
						alertService.add("success", "Dashboard data added Successfully !", 2000);
						$scope.spinnerActive = false;
						$route.reload();
					} else {
						alertService.add("warning", "Invalid date format found in file!", 2000);
						$scope.loadingshow = 0;
						$scope.replacedatashow = 1;
						$scope.spinnerActive = false;
					}
				});






			}
		}



		$scope.showModalpageinfo = false;

		$scope.openmodelpagehelp = function () {
			$scope.showModalpageinfo = !$scope.showModalpageinfo;
		}

		$scope.fileuploadmodeldataadd = function (excelfile) {
			if (confirm("This Operation will add data! Are you sure to continue?")) {
				$scope.loadingshow = 1;
				$scope.adddatashow = 0;
				$scope.spinnerActive = true;
				var params = {
					filepath: excelfile,
					dashboard_id: $routeParams.dashboardId
				};
				var uploadDataUrl = 'apiv4/public/researchprovider/uploaddashboardDataadd';
				RequestDetail.getDetail(uploadDataUrl, params).then(function (result) {
					if (result.data == 'true') {
						alertService.add("success", "Dashboard data added Successfully !", 2000);
						$scope.spinnerActive = false;
						$route.reload();

					} else {
						alertService.add("warning", "Invalid date format found in file!", 2000);
						$scope.spinnerActive = false;
						$scope.loadingshow = 0;
						$scope.adddatashow = 1;
					}
				});




			}
		}


		$scope.postShare = function () {

			var postDashboardUrl = 'apiv4/public/researchprovider/dashboardShare';

			$scope.selectedResponders = [];
			$scope.selectedResponders.push({
				'title': $scope.title,
				'description': $scope.description,
				'emails': $scope.emailto,
			})


			var params = {
				dashboard: $scope.selectedResponders,
				screenshot_file: $scope.screenshot_file,
			};




			$scope.spinnerActive = true;
			RequestDetail.getDetail(postDashboardUrl, params).then(function (result) {
				$scope.spinnerActive = false;

				if (result.data.data == 'true') {
					alertService.add("success", "Dashboard added Successfully !", 2000);
					$location.path('dashboardResearch');
				}
			});


		}

	})
	.controller('researchDashboard', function ($scope, $http, $location, $route, $routeParams, localStorageService, RequestDetail, $window, alertService, configdetails,$timeout) {

		$scope.pageHeading = 'Market Place';
		$scope.dashboardActive = 'active';
		$scope.showsearchtext = false;


		$scope.showRequestNewThemeModal = false;
		$scope.toggleRequestNewThemeModal = function () {
			//  ******************** To avoid the api calling second time in same page Store in the variable and fetched the data ising $index value
			//$scope.values = $scope.FetchedData.items[index];
			// Assign the values to the variables
			$scope.showRequestNewThemeModal = !$scope.showRequestNewThemeModal;
		};


		$scope.dashboardList = [];
		$scope.searchdashboardlists = [];

		$scope.spinnerActive = true;
		$scope.getlist = function () {
			var dashboardUrl = 'apiv4/public/researchprovider/dashboardlist';
			var params = {};
			RequestDetail.getDetail(dashboardUrl, params).then(function (result) {
				$scope.dashboardList = result.data
				//$scope.spinnerActive = false;
				$timeout(function () {
					$scope.spinnerActive = false;
				}, 1000);
			});
		}

		$scope.reference_file = [];


		$scope.removeFilesreference = function (index) {
			$scope.reference_file.splice(index, 1);
		}

		$scope.uploadReference_file = function (imgdata) {
			if ($scope.reference_file.length == '0') {
				$scope.reference_file = [];
			}
			$scope.$apply(function () {
				$scope.reference_file = [];
				$scope.reference_file.push({
					file_name: imgdata,
					file_location: 'uploads/temp/' + imgdata
				})


			});

		}
		$scope.activetab = 0;

		$scope.changeactive = function (index) {
			$scope.activetab = index;
		};

		$scope.sidepopupactive = false;

		$scope.sidepopup = function () {
			$scope.sidepopupactive = !$scope.sidepopupactive;
		}

		$scope.sidepopupactiveProposal = false;

		$scope.sidepopupProposal = function () {
			$scope.sidepopupactiveProposal = !$scope.sidepopupactiveProposal;
		}
		$scope.showModalpageinfo = false;

		$scope.openmodelpagehelp = function () {
			$scope.showModalpageinfo = !$scope.showModalpageinfo;
		}

		/*$scope.availableProviders = [];
		
		var dashboardUrl = 'apiv4/public/researchprovider/get_auto_providers';
		var params = {};
		RequestDetail.getDetail(dashboardUrl,params).then(function(result)
			{
			$scope.availableProviders = result.data;
		});*/



		$scope.get_search_details = function (type, searchkey) {
			if (angular.isDefined(searchkey) && searchkey != '') {
				if (type != '') {
					var tagUrl = 'apiv4/public/researchprovider/get_search_details';
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
					if (type == 'provider') {
						var params = {
							term: searchterm,
							key: type
						};
						RequestDetail.getDetail(tagUrl, params).then(function (result) {
							if (angular.isDefined(result.data) && result.data.length > 0) {
								$scope.availableProviders = result.data;
							} else {
								$scope.availableProviders = [];
							}
						});
					}
					if (type == 'provider_all') {
						var params = {
							term: searchterm,
							key: type
						};
						RequestDetail.getDetail(tagUrl, params).then(function (result) {
							if (angular.isDefined(result.data) && result.data.length > 0) {
								$scope.availableProviders = result.data;
							} else {
								$scope.availableProviders = [];
							}
						});
					}

				}
			}
		}





		$scope.getlist();
		$scope.data = {};

		$scope.data.industry = [];
		$scope.data.ticker = [];
		$scope.data.keyword = '';

		$scope.data.type = '';

		$scope.searchDashboard = function (initial) {
			if (angular.isUndefined($scope.data.industry)) {
				$scope.data.industry = [];
			}
			if (angular.isUndefined($scope.data.ticker)) {
				$scope.data.ticker = [];
			}
			if (angular.isUndefined($scope.data.keyword)) {
				$scope.data.keyword = '';
			}
			if (angular.isUndefined($scope.data.provider)) {
				$scope.data.provider = [];
			}
			if (angular.isUndefined($scope.data.type)) {
				$scope.data.type = '';
			}

			var industry = $scope.data.industry;
			var company = $scope.data.ticker;
			var keyword = $scope.data.keyword;
			var provider = $scope.data.provider;
			var type = $scope.data.type;





			if (!initial) {
				$scope.dashboardList = [];

				// Getting Search Themes
				$scope.searchdashboardlists = [];

				var dashboardUrl = 'apiv4/public/researchprovider/dashboardsearchlist';
				var getThemesParams = {
					industry: industry,
					// company : company[0],
					keyword: keyword,
					provider: provider,
					type: type
				};

				RequestDetail.getDetail(dashboardUrl, getThemesParams).then(function (result) {
					if (result.data != 'false') {
						$scope.searchdashboardlists = result.data;
					} else {
						$scope.searchdashboardlists = [];
						$scope.showsearchtext = true;
					}
				});
			}

		};
		$scope.searchDashboard(true);




		$scope.clearDashboardSearch = function () {
			$scope.data.industry = [];
			$scope.data.ticker = [];
			$scope.data.keyword = '';
			$scope.data.provider = '';
			$scope.data.type = '';
			$scope.showsearchtext = false;
			$scope.searchdashboardlists = [];
			$scope.getlist();

		}

		$scope.newrequest = [];
		$scope.RequestNewDashboard = function () {

			if (angular.isUndefined($scope.newrequest.topic) || $scope.newrequest.topic == '') {
				alertService.add("warning", "Topic Invalid !", 2000);
				return false;
			}

			if (angular.isUndefined($scope.newrequest.description) || $scope.newrequest.description == '') {
				alertService.add("warning", "Description Invalid !", 2000);
				return false;
			}

			if (angular.isUndefined($scope.reference_file) || $scope.reference_file == '' || $scope.reference_file == []) {
				alertService.add("warning", "Reference file Invalid !", 2000);
				return false;
			}


			var postnewDashboardUrl = 'apiv4/public/researchprovider/newdashboardreq';

			$scope.selectedResponders = [];
			$scope.selectedResponders.push({
				'topic': $scope.newrequest.topic,
				'description': $scope.newrequest.description,
				'providers': $scope.newrequest.provider,
				'reference_file': $scope.reference_file,

			})



			var params = {
				dashboard: $scope.selectedResponders,
				logo_file: $scope.reference_file,
				dashboard_id: $routeParams.dashboardId,

			};



			RequestDetail.getDetail(postnewDashboardUrl, params).then(function (result) {
				$scope.spinnerActive = true;
				alertService.add("success", "Dashboard Requested Successfully !", 2000);

				$scope.newrequest.topic = "";
				$scope.newrequest.description = "";
				$scope.reference_file = [];
				$scope.newrequest.provider = [];

				$scope.spinnerActive = false;
			});

			$scope.showRequestNewThemeModal = !$scope.showRequestNewThemeModal;





		}

		/* Start - Manage Proposal Page  01-09-2018  Added By Jayapriya  */
		$scope.dataProposal = {};

		/* Get Proposal Details  */
		$scope.proposalDetails = [];
		$scope.searchProposalLists = [];
		var proposalUrl = 'apiv4/public/proposal/getMarketProposals';
		var params = {
			type: 'proposals',
		};
		RequestDetail.getDetail(proposalUrl, params).then(function (result) {
			if (angular.isDefined(result)) {
				$scope.proposalDetails = result.data;
			}
		});

		//Clear Search Data
		$scope.clearProposalSearch = function () {
			$scope.dataProposal.industry = [];
			$scope.dataProposal.keyword = '';
			$scope.searchProposalLists = [];
			$scope.searchProposal();
		}
		// Search Function
		$scope.searchProposal = function (initial) {
			if (angular.isUndefined($scope.dataProposal.industry)) {
				$scope.dataProposal.industry = [];
			}
			if (angular.isUndefined($scope.dataProposal.keyword)) {
				$scope.dataProposal.keyword = '';
			}

			var industry = $scope.dataProposal.industry;
			var keyword = $scope.dataProposal.keyword;

			if (!initial) {
				$scope.proposalDetails = [];
				$scope.searchProposalLists = [];

				var searchProposalUrl = 'apiv4/public/proposal/getSearchMarketProposals';
				var getProposalParams = {
					industry: industry,
					keyword: keyword
				};

				RequestDetail.getDetail(searchProposalUrl, getProposalParams).then(function (result) {
					if (result.data) {
						$scope.searchProposalLists = result.data;
					} else {
						$scope.searchProposalLists = [];
					}
				});
			}

		};
		/* End - Manage Proposal Page  01-09-2018  Added By Jayapriya  */
		/* Start  - Custome Research  Proposal Page  15-09-2018  Added By Jayapriya  */
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
		/* End  - Custome Research  Proposal Page  15-09-2018  Added By Jayapriya  */

	}).controller('researchDashboardview', function ($scope, $http, $location, $route, $routeParams, localStorageService, RequestDetail, $window, configdetails, alertService) {
		$scope.pageHeading = 'Dashboards';
		$scope.dashboardActive = 'active';
		$scope.showsearchtext = false;

		//$scope.showratebutton = false;

		$scope.dashboard = [];
		$scope.logo_file = [];

		$scope.dashboard_id = $routeParams.dashboardId;


		$scope.activetab = 0;

		$scope.changeactive = function (index) {
			$scope.activetab = index;
		};

		$scope.showModalpageinfo = false;

		$scope.openmodelpagehelp = function () {
			$scope.showModalpageinfo = !$scope.showModalpageinfo;
		}

		$scope.showloginattr = 1;

  
  
  		if (localStorageService.get('userdata')== null) {
			$scope.showloginattr = 0;
			$scope.sidemenu = false;
		  }
		  
		


		if (angular.isDefined($routeParams.dashboardId) && $routeParams.dashboardId != '') {


			var url = 'apiv4/public/researchprovider/get_dashboard';
			var params = {
				dashboard_id: $routeParams.dashboardId,
				dashboard_track_view: 1
			};



			RequestDetail.getDetail(url, params).then(function (result) {

				if (angular.isDefined(result.data) && result.data != 0) {
					$scope.dashboard.title = result.data.title;
					$scope.pageHeading = result.data.title;
					$scope.dashboard.subscription_term = result.data.subscription_term
					$scope.dashboard.industry_tag = result.data.industry_tag;
					$scope.dashboard.price = result.data.price;
					$scope.dashboard.executivedescription = result.data.executivedescription;
					$scope.dashboard.description = result.data.description;
					$scope.dashboard.tags = result.data.tags;
					$scope.screenshot_file_old = result.data.screenshots;
					$scope.dashboard.status = result.data.status;
					$scope.dashboard.permission = result.data.permission;
					$scope.dashboard.dashboard_url = result.data.dashboard_url;
					$scope.dashboard.comments = result.data.comments;
					$scope.dashboard.userrated = result.data.userrated;
					$scope.dashboard.ratingper = result.data.ratingper;


					$scope.dashboard.show_sub_button = result.data.show_sub_button;



					$scope.dashboard.c_description = result.data.c_description;
					$scope.dashboard.company_name = result.data.company_name;

					$scope.importancedashboard = result.data.importancedashboard;
					$scope.analyticsrate = result.data.analyticsrate;
					$scope.robustnessofdatasets = result.data.robustnessofdatasets;
					$scope.timelinessmaintenance = result.data.timelinessmaintenance;
					$scope.uniquenessdata = result.data.uniquenessdata;

					$scope.uniquenessanalytics = result.data.uniquenessanalytics;
					$scope.design = result.data.design;
					$scope.valueofdashboard = result.data.valueofdashboard;
					$scope.frequencyofuse = result.data.frequencyofuse;
					$scope.anticipatetorenew = result.data.anticipatetorenew;


					$scope.similardashbaords = result.data.similardashbaords;



				

					//$scope.comment = result.data.comment;




					if ($scope.dashboard.subscription_term == 1) {
						$scope.dashboard.term = 'M';

						$scope.dashboard.term_text = 'Monthly';
					} else {
						$scope.dashboard.term = 'Y';
						$scope.dashboard.term_text = 'Annual';
					}


					var str1 = $scope.dashboard.industry_tag.toString();

					$scope.dashboard.industry_tag_string = str1;

					/*for(var i=0;i<result.data.columns.length;i++) {
					 $scope.columns.push(result.data.columns[i]);
					}
			*/

					$scope.logo_file.push({
						file_name: result.data.logoname,
						file_location: result.data.logo,
					})


					$scope.logo_file_path = result.data.logo;

					$scope.shoturl = $scope.screenshot_file_old[0].location;


				}
			});

		}



		$scope.shoturl = "";


		$scope.screenshotchange = function (location) {
			$scope.shoturl = location;
		}



		$scope.dashboardList = [];

		$scope.getlist = function () {
			var dashboardUrl = 'apiv4/public/researchprovider/dashboardlist';
			var params = {};
			RequestDetail.getDetail(dashboardUrl, params).then(function (result) {
				$scope.dashboardList = result.data
			});
		}

		$scope.getlist();





		////console.log($scope.dashboardList);


		$scope.showSendtoprovider = false;
		$scope.toggleSendtoprovider = function () {
			//  ******************** To avoid the api calling second time in same page Store in the variable and fetched the data ising $index value
			//$scope.values = $scope.FetchedData.items[index];
			// Assign the values to the variables
			$scope.showSendtoprovider = !$scope.showSendtoprovider;
			$scope.messageProvider_sucess = false;
		};

		$scope.provider = {};
		$scope.messageProvider_sucess = false;

		$scope.SendmessageProvider = function () {

			if (angular.isUndefined($scope.provider.subject) || $scope.provider.subject == '') {
				alertService.add("warning", "Please enter subject !", 2000);
				return false;
			}
			if (angular.isUndefined($scope.provider.message) || $scope.provider.message == '') {
				alertService.add("warning", "Please enter message !", 2000);
				return false;
			}
		

			var url = 'apiv4/public/researchprovider/SendmessageProvider';
			var params = {
				subject: $scope.provider.subject,
				message: $scope.provider.message,
				dashboard_id: $scope.dashboard_id
			};
			RequestDetail.getDetail(url, params).then(function (result) {
				$scope.provider.subject = "";
				$scope.provider.message = "";
				$scope.messageProvider_sucess = true;
			});

		}

		//recomment to friends  

		$scope.showSendtofriends = false;
		$scope.toggleSendtofriends = function () {
			//  ******************** To avoid the api calling second time in same page Store in the variable and fetched the data ising $index value
			//$scope.values = $scope.FetchedData.items[index];
			// Assign the values to the variables
			$scope.messagefriends_success = false;
			$scope.showSendtofriends = !$scope.showSendtofriends;

		};

		$scope.friends = {};


		$scope.messagefriends_success = false;
		$scope.SendmessageFriends = function () {

			if (angular.isUndefined($scope.friends.subject) || $scope.friends.subject == '') {
				alertService.add("warning", "Please enter subject !", 2000);
				return false;
			}
			if (angular.isUndefined($scope.friends.message) || $scope.friends.message == '') {
				alertService.add("warning", "Please enter message !", 2000);
				return false;
			}
			if (angular.isUndefined($scope.friends.email) || $scope.friends.email == '') {
				alertService.add("warning", "Please enter email !", 2000);
				return false;
			}

			var url = 'apiv4/public/researchprovider/SendmessageFriends';
			var params = {
				subject: $scope.friends.subject,
				message: $scope.friends.message,
				email: $scope.friends.email,
				dashboard_id: $scope.dashboard_id
			};
			RequestDetail.getDetail(url, params).then(function (result) {
				$scope.friends.email = "";
				$scope.friends.subject = "";
				$scope.friends.message = "";
				$scope.messagefriends_success = true;
			});

		}


		//rate dashboard

		$scope.max = 5;

		$scope.max_limit = 4;

		if ($scope.dashboard.userrated == 1) {

			$scope.importancedashboard.isReadonly = true;
			$scope.analyticsrate.isReadonly = true;
			$scope.robustnessofdatasets.isReadonly = true;
			$scope.timelinessmaintenance.isReadonly = true;
			$scope.uniquenessdata.isReadonly = true;
			$scope.uniquenessanalytics.isReadonly = true;
			$scope.design.isReadonly = true;
			$scope.valueofdashboard.isReadonly = true;
			$scope.frequencyofuse.isReadonly = true;
			$scope.anticipatetorenew.isReadonly = true;
		} else {
			$scope.importancedashboard = 0;
			$scope.analyticsrate = 0;
			$scope.robustnessofdatasets = 0;
			$scope.timelinessmaintenance = 0;
			$scope.uniquenessdata = 0;
			$scope.uniquenessanalytics = 0;
			$scope.design = 0;
			$scope.valueofdashboard = 0;
			$scope.frequencyofuse = "";
			$scope.anticipatetorenew = 0;


		}






		$scope.showrateDashboard = false;
		$scope.toggleRateDashoboard = function () {
			//  ******************** To avoid the api calling second time in same page Store in the variable and fetched the data ising $index value
			//$scope.values = $scope.FetchedData.items[index];
			// Assign the values to the variables
			$scope.messagefriends_success = false;
			$scope.showrateDashboard = !$scope.showrateDashboard;

			$scope.importancedashboard = 0;
			$scope.analyticsrate = 0;
			$scope.robustnessofdatasets = 0;
			$scope.timelinessmaintenance = 0;
			$scope.uniquenessdata = 0;
			$scope.uniquenessanalytics = 0;
			$scope.design = 0;
			$scope.valueofdashboard = 0;
			$scope.frequencyofuse = "";
			$scope.anticipatetorenew = 0;

		};


		$scope.rateDashboard_success = false;
		$scope.rateDashboard_already = false;

		$scope.SendrateDashboard = function () {

			if ($scope.importancedashboard == '0' || angular.isUndefined($scope.importancedashboard) || $scope.analyticsrate == '0' || angular.isUndefined($scope.analyticsrate) || $scope.robustnessofdatasets == '0' || angular.isUndefined($scope.robustnessofdatasets) || $scope.timelinessmaintenance == '0' || angular.isUndefined($scope.timelinessmaintenance) || $scope.uniquenessdata == '0' || angular.isUndefined($scope.uniquenessdata) || $scope.uniquenessanalytics == '0' || angular.isUndefined($scope.uniquenessanalytics) || $scope.design == '0' || angular.isUndefined($scope.design) || $scope.valueofdashboard == '0' || angular.isUndefined($scope.valueofdashboard) || $scope.frequencyofuse == '' || angular.isUndefined($scope.frequencyofuse) || $scope.anticipatetorenew == '0' || angular.isUndefined($scope.anticipatetorenew)) {
				alertService.add("warning", "Please rate in all fields!!", 2000);
				return false;
			}


			var url = 'apiv4/public/researchprovider/SendrateDashboard';
			var params = {
				importancedashboard: $scope.importancedashboard,
				analyticsrate: $scope.analyticsrate,
				robustnessofdatasets: $scope.robustnessofdatasets,
				timelinessmaintenance: $scope.timelinessmaintenance,
				uniquenessdata: $scope.uniquenessdata,
				uniquenessanalytics: $scope.uniquenessanalytics,
				design: $scope.design,
				valueofdashboard: $scope.valueofdashboard,
				frequencyofuse: $scope.frequencyofuse,
				anticipatetorenew: $scope.anticipatetorenew,
				dashboard_id: $scope.dashboard_id,
				comment: $scope.comment
			};
			RequestDetail.getDetail(url, params).then(function (result) {
				if (result.data != false) {
					$scope.rateDashboard_already = false;
					$scope.rateDashboard_success = true;
				} else {
					$scope.rateDashboard_already = true;
					$scope.rateDashboard_success = false;
				}


			});

		}



		$scope.newcomment = [];
		$scope.comment_error = false;
		$scope.comment_sucess = false;

		$scope.Submitcomment = function () {
			
			
			if ($scope.newcomment.comment) {

				var url = 'apiv4/public/researchprovider/Submitcomment';
				var params = {
					comment: $scope.newcomment.comment,
					dashboard_id: $scope.dashboard_id
				};
				RequestDetail.getDetail(url, params).then(function (result) {
					$scope.comment = "";
					$scope.comment_sucess = true;
					$route.reload();
				});

			} else {
				$scope.comment_error = true;
			}

		}


		//console.log($scope.showloginattr);


		$scope.back_to_dashboard = function () {
			$location.path('researchdashboard');
		}


	}).controller('researchdashboardsubscripe', function ($scope, $http, $location, $route, $routeParams, localStorageService, RequestDetail, $window, configdetails) {
		$scope.pageHeading = 'Checkout';
		$scope.dashboardActive = 'active';
		$scope.showsearchtext = false;
		$scope.showratebutton = true;

		//$scope.showratebutton = false;

		$scope.dashboard = [];
		$scope.logo_file = [];

		$scope.dashboard_id = $routeParams.dashboardId;

		if (angular.isDefined($routeParams.dashboardId) && $routeParams.dashboardId != '') {


			var url = 'apiv4/public/researchprovider/get_dashboard';
			var params = {
				dashboard_id: $routeParams.dashboardId
			};

			RequestDetail.getDetail(url, params).then(function (result) {

				if (angular.isDefined(result.data) && result.data != 0) {
					$scope.dashboard.title = result.data.title;
					$scope.dashboard.dashboard_id_real = result.data.dashboard_id_real;
					$scope.dashboard.user_id = result.data.user_id;
					$scope.dashboard.subscription_term = result.data.subscription_term
					$scope.dashboard.industry_tag = result.data.industry_tag;

					$scope.dashboard.price = result.data.price;


					$scope.dashboard.executivedescription = result.data.executivedescription;
					$scope.dashboard.description = result.data.description;
					$scope.dashboard.tags = result.data.tags;
					$scope.screenshot_file_old = result.data.screenshots;
					$scope.dashboard.status = result.data.status;
					$scope.dashboard.permission = result.data.permission;
					$scope.dashboard.dashboard_url = result.data.dashboard_url;
					$scope.dashboard.comments = result.data.comments;
					$scope.dashboard.userrated = result.data.userrated;



					$scope.dashboard.c_description = result.data.c_description;
					$scope.dashboard.company_name = result.data.company_name;

					$scope.qualityrate = result.data.qualityrate;
					$scope.researchrate = result.data.researchrate;
					$scope.expertiserate = result.data.expertiserate;
					$scope.valuerate = result.data.valuerate;
					$scope.comment = result.data.comment;

					$scope.free = 0;

					if ($scope.dashboard.price == 0) {
						$scope.free = 1;
					}


					if ($scope.dashboard.subscription_term == 1) {
						$scope.dashboard.term = 'M';

						$scope.dashboard.term_text = 'Monthly';
					} else {
						$scope.dashboard.term = 'Y';
						$scope.dashboard.term_text = 'Annually';
					}


					var str1 = $scope.dashboard.industry_tag.toString();

					$scope.dashboard.industry_tag_string = str1;

					/*for(var i=0;i<result.data.columns.length;i++) {
					 $scope.columns.push(result.data.columns[i]);
					}
			*/

					$scope.logo_file.push({
						file_name: result.data.logoname,
						file_location: result.data.logo,
					})


					$scope.logo_file_path = result.data.logo;


				}
			});

		}


		$scope.addfreesubscriptions = function () {
			if (angular.isDefined($scope.agree_terms) && $scope.agree_terms == true) {
				var url = 'apiv4/public/researchprovider/addfreesubscriptions';
				var params = {
					dashboard_id: $scope.dashboard_id
				};

				RequestDetail.getDetail(url, params).then(function (result) {
					$location.path('manageresearchdashboard');
				});

			} else {
				$("#agreeerror").show();
			}

		}

		$scope.showModalpageinfo = false;

		$scope.openmodelpagehelp = function () {
			$scope.showModalpageinfo = !$scope.showModalpageinfo;
		}



		$scope.back_to_dashboard = function () {
			$location.path('researchdashboard');
		}


	}).controller('manageresearchdashboard', function ($scope, $http, $location, $route, $routeParams, localStorageService, RequestDetail, $window, configdetails, alertService) {
		$scope.dashboardmanageActive = 'inner-active';

		$scope.success_id = false;
		if (angular.isDefined($routeParams.Id) && $routeParams.Id != '') {
			$scope.success_id = true;
		}

		$scope.showRequestNewThemeModal = false;
		$scope.toggleRequestNewThemeModal = function () {
			//  ******************** To avoid the api calling second time in same page Store in the variable and fetched the data ising $index value
			//$scope.values = $scope.FetchedData.items[index];
			// Assign the values to the variables
			$scope.showRequestNewThemeModal = !$scope.showRequestNewThemeModal;
		};

		var user = localStorageService.get('usertype');
		$scope.breadcrumb = 'Prepare';

		if (user == 'investor') {
			$scope.breadcrumb = 'Dashboards';
		} else if (user == 'corporate') {
			$scope.breadcrumb = 'Prepare';
		}


		var url = 'apiv4/public/researchprovider/manageresearchdashboard';
		var params = {};
		RequestDetail.getDetail(url, params).then(function (result) {

			$scope.active_dashboards = result.data.active_dashboards;
			$scope.expired_dashboards = result.data.expired_dashboards;
			$scope.payments = result.data.payments;
			$scope.results_requesteds = result.data.results_requesteds;

			$scope.active_ideas = result.data.active_ideas;
			$scope.expired_ideas = result.data.expired_ideas;
			$scope.results_ideasrequested = result.data.results_ideasrequested;

			$scope.results_ideapayments = result.data.results_ideapayments;

		});

		$scope.activetab = 0;

		$scope.changeactive = function (index) {
			$scope.activetab = index;
		};

		$scope.showModalpageinfo = false;

		$scope.openmodelpagehelp = function () {
			$scope.showModalpageinfo = !$scope.showModalpageinfo;
		}

		$scope.reference_file = [];
		$scope.uploadReference_file = function (imgdata) {
			if ($scope.reference_file.length == '0') {
				$scope.reference_file = [];
			}
			$scope.$apply(function () {
				$scope.reference_file = [];
				$scope.reference_file.push({
					file_name: imgdata,
					file_location: 'uploads/temp/' + imgdata
				})
			});
		}

		$scope.newrequest = [];
		$scope.newrequest.topic = "";
		$scope.newrequest.description = "";
		$scope.newrequest.provider = [];

		$scope.get_search_details = function (type, searchkey) {
			if (angular.isDefined(searchkey) && searchkey != '') {
				if (type != '') {
					var tagUrl = 'apiv4/public/researchprovider/get_search_details';
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
					if (type == 'provider') {
						var params = {
							term: searchterm,
							key: type
						};
						RequestDetail.getDetail(tagUrl, params).then(function (result) {
							//console.log(result.data);
							if (angular.isDefined(result.data) && result.data.length > 0) {
								$scope.availableProviders = result.data;
							} else {
								$scope.availableProviders = [];
							}
						});
					}
					if (type == 'provider_all') {
						var params = {
							term: searchterm,
							key: type
						};
						RequestDetail.getDetail(tagUrl, params).then(function (result) {
							if (angular.isDefined(result.data) && result.data.length > 0) {
								$scope.availableProviders = result.data;
							} else {
								$scope.availableProviders = [];
							}
						});
					}

				}
			}
		}

		$scope.RequestNewDashboard = function () {


			if (angular.isUndefined($scope.newrequest.topic) || $scope.newrequest.topic == '') {
				alertService.add("warning", "Topic Invalid !", 2000);
				return false;
			}

			if (angular.isUndefined($scope.newrequest.description) || $scope.newrequest.description == '') {
				alertService.add("warning", "Description Invalid !", 2000);
				return false;
			}

			if (angular.isUndefined($scope.reference_file) || $scope.reference_file == '' || $scope.reference_file == []) {
				alertService.add("warning", "Reference file Invalid !", 2000);
				return false;
			}


			var postnewDashboardUrl = 'apiv4/public/researchprovider/newdashboardreq';

			$scope.selectedResponders = [];
			$scope.selectedResponders.push({
				'topic': $scope.newrequest.topic,
				'description': $scope.newrequest.description,
				'providers': $scope.newrequest.provider,
				'reference_file': $scope.reference_file,

			})

			var params = {
				dashboard: $scope.selectedResponders,
				logo_file: $scope.reference_file,
				dashboard_id: $routeParams.dashboardId,
			};


			$scope.spinnerActive = true;
			RequestDetail.getDetail(postnewDashboardUrl, params).then(function (result) {
				$scope.showRequestNewThemeModal = !$scope.showRequestNewThemeModal;
				alertService.add("success", "Dashboard Requested Successfully !", 2000);
				$route.reload();
			});


		}

	}).controller('rpresearchdashboard', function ($scope, $http, $location, $route, $routeParams, localStorageService, RequestDetail, $window, configdetails) {

		$scope.results_requesteds = [];

		var url = 'apiv4/public/researchprovider/getrequestedresearchdashboard';
		var params = {};
		RequestDetail.getDetail(url, params).then(function (result) {
			$scope.results_requesteds = result.data;


		});

		$scope.Replydashboardopen = function (dashboard_id) {
			$scope.dashboard_id = dashboard_id;
			$scope.showReplyDashboardModal = !$scope.showReplyDashboardModal;
			$scope.dashboardrequestmsg = false;
		}
		$scope.dashboardrequestmsg = false;

		$scope.Replydashboard = function () {
			var url = 'apiv4/public/researchprovider/replyfordashboard';
			$scope.dashboardrequestmsg = true;
		}

		$scope.showModalpageinfo = false;

		$scope.openmodelpagehelp = function () {
			$scope.showModalpageinfo = !$scope.showModalpageinfo;
		}

	}).controller('dashboardPayments', function ($scope, $http, $location, $route, $routeParams, localStorageService, RequestDetail, $window, configdetails) {
		$scope.pageHeading = 'Manage Dashboards';
		$scope.dashboardResearchActive = 'active';

	}).controller('dashboardSubscription', function ($scope, $http, $location, $route, $routeParams, localStorageService, RequestDetail, $window, configdetails) {
		$scope.pageHeading = 'Manage Dashboards';
		$scope.dashboardResearchActive = 'active';

		$scope.user_id = '';
		if (angular.isDefined($routeParams.userId) && $routeParams.userId != '') {
			$scope.user_id = $routeParams.userId;
		}

		////console.log($scope.user_id);

		$scope.dashboard_id = '';
		$scope.name = '';
		$scope.user_type = '';
		$scope.subscription_id = '';
		$scope.dateFrom = '';
		$scope.dateTo = '';


		$scope.activetab = 0;

        $scope.changeactive = function (index) {
            $scope.activetab = index;
		};
		

		$scope.dashboardList = [];

		var url = 'apiv4/public/researchprovider/dashboardlistoption';
		var params = {};
		RequestDetail.getDetail(url, params).then(function (result) {
			$scope.dashboardList = result.data
		});


		$scope.subscription_amount = '0';

		var url = 'apiv4/public/researchprovider/subscription_amount';
		var params = {};
		RequestDetail.getDetail(url, params).then(function (result) {
			$scope.subscription_amount = result.data
		});


		$scope.showModalpageinfo = false;

		$scope.openmodelpagehelp = function () {
			$scope.showModalpageinfo = !$scope.showModalpageinfo;
		}


		$scope.user_typeList = [];

		var url = 'apiv4/public/researchprovider/getuser_type';
		var params = {};
		RequestDetail.getDetail(url, params).then(function (result) {
			$scope.user_typeList = result.data
		});


		$scope.subscriptionList = [];

		var url = 'apiv4/public/researchprovider/getsubscription_list';

		var params = {};
		RequestDetail.getDetail(url, params).then(function (result) {
			$scope.subscriptionList = result.data;
		});


		$scope.analyticsList = [];

		$scope.get_analytics_archive = function () {
			var url = 'apiv4/public/researchprovider/getallsubscriptiondata';
			var params = {
				dashboard_id: $scope.dashboard_id,
				name: $scope.name,
				user_type: $scope.user_type,
				subscription_id: $scope.subscription_id,
				dateFrom: $scope.dateFrom,
				dateTo: $scope.dateTo,
				user_id: $scope.user_id
			};
			RequestDetail.getDetail(url, params).then(function (result) {
				$scope.analyticsList = result.data.list;
				$scope.subscription_amount = result.data.total;
			});
		}

		$scope.get_analytics_archive();


		$scope.get_ideaarchive = function () {
			var url = 'apiv4/public/researchprovider/getallideasubscriptiondata';
			var params = {
				name: $scope.name,
				user_type: $scope.user_type,
				dateFrom: $scope.dateFrom,
				dateTo: $scope.dateTo,
				user_id: $scope.user_id
			};
			RequestDetail.getDetail(url, params).then(function (result) {
				$scope.ideasubscriptionList = result.data.list;
			});
		}

		$scope.get_ideaarchive();

		$scope.sidepopupactive = false;

		$scope.sidepopup = function () {
			$scope.sidepopupactive = !$scope.sidepopupactive;
		}


		$scope.download_subscription = function () {

			//dashboard_id:$scope.dashboard_id,name:$scope.name,user_type:$scope.user_type,subscription_id:$scope.subscription_id,dateFrom:$scope.dateFrom,dateTo:$scope.dateTo

			url = 'apiv4/public/researchprovider/downloadsubscriptiondata/';



			$window.open('apiv4/public/researchprovider/downloadsubscriptiondata/' + $scope.dashboard_id + '/' + $scope.name + '/' + $scope.user_type + '/' + $scope.subscription_id + '/' + $scope.dateFrom + '/' + $scope.dateTo, '_blank');

			/*var url = 'apiv4/public/researchprovider/downloadsubscriptiondata';
			var params = {dowloaddata:$scope.analyticsList};
			RequestDetail.getDetail(url,params).then(function(result)
		 {
				var blob = new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
								 saveAs(blob, file_name_to_be+'.xlsx');
		 });*/

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


	}).controller('paymentsuccess', function ($scope, $http, $location, $route, $routeParams, localStorageService, RequestDetail, $window, configdetails) {
		$scope.pageHeading = 'Payment Success';
		$scope.dashboardResearchActive = 'active';
	}).controller('paymentfailed', function ($scope, $http, $location, $route, $routeParams, localStorageService, RequestDetail, $window, configdetails) {
		$scope.pageHeading = 'Payment Failed';
		$scope.dashboardResearchActive = 'active';
	}).controller('dashboardComment', function ($scope, $http, $location, $route, $routeParams, localStorageService, RequestDetail, $window, configdetails) {
		$scope.pageHeading = 'Comment';
		$scope.dashboardResearchActive = 'active';

		$scope.comments = [];
		$scope.comment_reply = [];


		var url = 'apiv4/public/researchprovider/getmycomment';

		var params = {};
		RequestDetail.getDetail(url, params).then(function (result) {
			$scope.comments = result.data;
		});

		$scope.showModalpageinfo = false;

		$scope.openmodelpagehelp = function () {
			$scope.showModalpageinfo = !$scope.showModalpageinfo;
		}


		$scope.submitReply = function (comment, index) {
			var url = 'apiv4/public/researchprovider/update_reply';
			var params = {
				comment: comment,
				comment_reply: $scope.comment_reply[index]
			};
			RequestDetail.getDetail(url, params).then(function (result) {
				$route.reload();
			});


		};
	}).controller('rpideas', function ($scope, $http, $location, $route, $routeParams, localStorageService, RequestDetail, $window, configdetails,alertService) {

		$scope.sidepopupactive = false;

		$scope.sidepopup = function () {
			$scope.sidepopupactive = !$scope.sidepopupactive;
		}

		$scope.filter = {};

		$scope.clearideasfilter = function () {
			$scope.filter = {};
			$scope.getideas();
		}

		$scope.spinnerActive = true;

		$scope.showModalagency = false;

		

		$scope.copymoveidea = function (idea) {
			//console.log(idea);
			$scope.movingidea = idea;
			$scope.showModalagency = true;
		
		};


		$scope.getideas = function (agencystatus) {
					$scope.spinnerActive = true;		   
			var url = 'apiv4/public/researchprovider/getideaslist';
			var params = {
				filter: $scope.filter,agencystatus:agencystatus
			};
			RequestDetail.getDetail(url, params).then(function (result) {
				$scope.ideas = result.data;
				$scope.spinnerActive = false;
			});
		}

		$scope.getideas(0);

		$scope.agencyideastatuschange = function (state) {
			if(state){
				$scope.getideas(1);
			}else{
				$scope.getideas(0);
			}
		};

		$scope.user_data = localStorageService.get('userdata');

        $scope.user_type = $scope.user_data.user_type;

		$scope.changetoticker = $scope.user_data.ticker;
 

		$scope.agencyideastatus = false;

        $scope.agencystatus = 0;
        if ($scope.user_data.agencystatus) {
            $scope.agencystatus = $scope.user_data.agencystatus;
        }
		$scope.loadintext = 'Loading';
		$scope.ideahistory = [];
		$scope.showlistmodel = false;
		$scope.viewedhistory = function (idea_id) {
			$scope.showlistmodel = !$scope.showlistmodel;
			var url = 'apiv4/public/researchprovider/getideahistory';
			var params = {
				idea_id: idea_id
			};
			RequestDetail.getDetail(url, params).then(function (result) {
				$scope.ideahistory = result.data;
				$scope.loadintext = 'No Data';

			});
		};

		$scope.closemodel = function () {
			$scope.showlistmodel = false;
			$scope.showModalagency = false;				  
		}


		$scope.movecopyidea = function (type,cticker) {
			$scope.spinnerActive = true;

			var url = 'apiv4/public/researchprovider/movecopyidea';
			var params = {
				movingidea: $scope.movingidea,type:type,ticker:cticker
			};
			RequestDetail.getDetail(url, params).then(function (result) {
				$scope.spinnerActive = false;
				$scope.showModalagency = false;
				$scope.getideas(1);
			});
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




		$scope.deleteidea = function (ideas_id) {
			if (confirm("Are you sure?")) {
				var url = 'apiv4/public/researchprovider/deleteidea';
				var params = {
					ideas_id: ideas_id
				};
				RequestDetail.getDetail(url, params).then(function (result) {
					alertService.add("success", "Idea deleted Successfully !", 2000);
					$scope.getideas();
				});

			}
		};

		$scope.showModalpageinfo = false;

		$scope.openmodelpagehelp = function () {
			$scope.showModalpageinfo = !$scope.showModalpageinfo;
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

	}).controller('rpideasedit', function ($scope, $http, $location, $route, $routeParams, localStorageService, RequestDetail, $window, configdetails,alertService) {

		$scope.title = "Edit Idea"

		$scope.ideaid = true;

		$scope.rpdata = {};
		$scope.rpdata.ideaid = $routeParams.ideaid;



		$scope.rpdata.status = '0';
		$scope.rpdata.keywords = '';
		$scope.rpdata.title = '';
		$scope.rpdata.summary = '';
		$scope.rpdata.description = '';

		$scope.rpdata.sample_file = [];

		$scope.rpdata.sample_file_old = [];

		$scope.removeFiles = function (index) {
			$scope.rpdata.sample_file.splice(index, 1);
		}
		$scope.removeFiles_old = function (index) {
			$scope.rpdata.sample_file_old.splice(index, 1);
		}


		

		$scope.uploadFile = function (imgdata) {
			
			$scope.$apply(function () {
				var obj = JSON.parse(imgdata);
				$scope.rpdata.sample_file.push({
					file_name: obj.name,
					file_location: 'uploads/temp/' + obj.uploadedname
				});
			});

			// //console.log($scope.rpdata.sample_file);
		}


		$scope.availableIndustry = [];
		$scope.availableTicker = [];
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
						var params = {
							term: searchterm,
							key: type
						};
						RequestDetail.getDetail(tagUrl, params).then(function (result) {
							if (angular.isDefined(result.data) && result.data.length > 0) {
								$scope.availableTicker = result.data;
							} else {
								$scope.availableTicker = [];
							}
						});
					}

				}
			}
		}


		var url = 'apiv4/public/researchprovider/getidea';
		var params = {
			data: $scope.rpdata.ideaid
		};
		RequestDetail.getDetail(url, params).then(function (result) {
			$scope.rpdata = result.data;

			$scope.rpdata.industry_tag = result.data.industry;
			$scope.rpdata.tickers = result.data.tickers;
			
			$scope.rpdata.sample_file = [];

		});




		$scope.updateidea = function () {
			if (angular.isUndefined($scope.rpdata.title) || $scope.rpdata.title == '') {
				alertService.add("warning", "Title Invalid !", 2000);
				return false;
			}
			var url = 'apiv4/public/researchprovider/updateidea';
			var params = {
				rpdata: $scope.rpdata
			};
			RequestDetail.getDetail(url, params).then(function (result) {
				alertService.add("success", "Idea updated Successfully !", 2000);
				$location.path('ideas');
			});
		};

		$scope.showModalpageinfo = false;

		$scope.openmodelpagehelp = function () {
			$scope.showModalpageinfo = !$scope.showModalpageinfo;
		}

	}).controller('rpideasnew', function ($scope, $http, $location, $route, $routeParams, localStorageService, RequestDetail, $window, configdetails,alertService) {

		$scope.title = "New Idea"


		$scope.ideaid = false;

		$scope.rpdata = {};

		$scope.rpdata.status = '0';
		$scope.rpdata.keywords = '';
		$scope.rpdata.title = '';
		$scope.rpdata.summary = '';
		$scope.rpdata.description = '';

		$scope.rpdata.sample_file = [];

		$scope.removeFiles = function (index) {
			$scope.rpdata.sample_file.splice(index, 1);
		}

		$scope.uploadFile = function (imgdata) {
			$scope.$apply(function () {
				var obj = JSON.parse(imgdata);
				$scope.rpdata.sample_file.push({
					file_name: obj.name,
					file_location: 'uploads/temp/' + obj.uploadedname
				});
			});
		}

		$scope.showModalpageinfo = false;

		$scope.openmodelpagehelp = function () {
			$scope.showModalpageinfo = !$scope.showModalpageinfo;
		}

		$scope.addidea = function () {
			if (angular.isUndefined($scope.rpdata.title) || $scope.rpdata.title == '') {
				alertService.add("warning", "Title Invalid !", 2000);
				return false;
			}
			var url = 'apiv4/public/researchprovider/addidea';
			var params = {
				rpdata: $scope.rpdata
			};
			RequestDetail.getDetail(url, params).then(function (result) {
				alertService.add("success", "Idea added Successfully !", 2000);
					$location.path('dashboardResearch');
				$location.path('ideas');
			});
		};

		$scope.availableIndustry = [];
		$scope.availableTicker = [];
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
						var params = {
							term: searchterm,
							key: type
						};
						RequestDetail.getDetail(tagUrl, params).then(function (result) {
							if (angular.isDefined(result.data) && result.data.length > 0) {
								$scope.availableTicker = result.data;
							} else {
								$scope.availableTicker = [];
							}
						});
					}

				}
			}
		}




	}).controller('rpideasrequest', function ($scope, $http, $location, $route, $routeParams, localStorageService, RequestDetail, $window, configdetails) {

		$scope.getideasrequest = function () {
			var url = 'apiv4/public/researchprovider/getideasrequest';
			var params = {};
			RequestDetail.getDetail(url, params).then(function (result) {
				$scope.dashboards = result.data;
			});
		};

		$scope.getideasrequest();

	}).controller('researchideasubscripe', function ($scope, $http, $location, $route, $routeParams, localStorageService, RequestDetail, $window, configdetails) {
		$scope.pageHeading = 'Checkout';
		$scope.showsearchtext = false;
		$scope.showratebutton = true;

		//$scope.showratebutton = false;



		$scope.researchproviderId = $routeParams.researchproviderId;

		if (angular.isDefined($routeParams.researchproviderId) && $routeParams.researchproviderId != '') {


			var url = 'apiv4/public/researchprovider/get_idearesearchprovider';
			var params = {
				researchproviderId: $routeParams.researchproviderId
			};

			RequestDetail.getDetail(url, params).then(function (result) {

				if (angular.isDefined(result.data) && result.data != 0) {

					$scope.ideaprovider = result.data;

				}
			});

		}


		$scope.addfreesubscriptions = function () {


			var url = 'apiv4/public/researchprovider/addfreesubscriptions';
			var params = {
				dashboard_id: $scope.dashboard_id
			};

			RequestDetail.getDetail(url, params).then(function (result) {
				$location.path('manageresearchdashboard');
			});

		}





		$scope.back_to_dashboard = function () {
			$location.path('researchdashboard');
		}


	})
	.controller('brokercontracts', function ($scope, $http, $location, $route, $routeParams, localStorageService, RequestDetail, $window, configdetails, alertService) {


		$scope.showModalpageinfo = false;

		$scope.openmodelpagehelp = function () {
			$scope.showModalpageinfo = !$scope.showModalpageinfo;
		}


		$scope.uploadcontractfiles = function (filetype, filepath) {
			$scope.$apply(function () {

				$scope.contractfile = {
					file_name: filepath,
					file_location: 'uploads/temp/' + filepath,
					filetype: filetype
				};

				var update_contractfile = "apiv4/public/researchprovider/uploadcontractfiles";
				var params = {
					contractfile: $scope.contractfile
				};
				RequestDetail.getDetail(update_contractfile, params).then(function (result) {
					alertService.add("success", "File added Successfully !", 2000);
					$route.reload();
				})
			});
		}


		var url = 'apiv4/public/researchprovider/getbrokerfiles';
		var params = {};


		RequestDetail.getDetail(url, params).then(function (result) {
			$scope.fileoutput = result.data;


		});

	})
	.controller('customers', function ($scope, $http, $location, $route, $routeParams, localStorageService, RequestDetail, $window, configdetails, alertService) {

	})
	.controller('prospects', function ($scope, $http, $location, $route, $routeParams, localStorageService, RequestDetail, $window, configdetails, alertService) {

	})
	.controller('analyticsCtrl', function ($scope, $http, $location, $route, $routeParams, localStorageService, RequestDetail, $window, configdetails, alertService) {

		$scope.showModalpageinfo = false;

		$scope.openmodelpagehelp = function () {
			$scope.showModalpageinfo = !$scope.showModalpageinfo;
		}


		$scope.colors_report = ['#246201', '#bcd514', '#028690', '#59c1ca', '#c042be'];
		$scope.labels_report = ['Oct2018', 'Sep2018', 'Aug2018', 'July2018', 'June2018'];
		$scope.data_report = [];
		$scope.data_report = [
			['30', '60', '70', '20', '10'],
			['30', '60', '70', '20', '10'],
			['30', '60', '45', '20', '10'],
			['30', '60', '70', '20', '10'],
			['30', '56', '70', '20', '10'],
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
					stacked: false
				}]
			},

			title: {
				display: true,
				text: 'REPORT FREQUENCY',
				fontSize: 15,
			},
		};






		$scope.colors_graph2 = ['#246201', '#bcd514', '#028690', '#59c1ca', '#c042be'];

		$scope.labels_graph2 = ['Oct2018', 'Sep2018', 'Aug2018', 'July2018', 'June2018'];
		$scope.data_graph2 = [
			['30', '60', '70', '20', '10'],
			['10', '10', '10', '10', '5'],
		];
		$scope.datasetOverride_graph2 = [{
				label: "View",
				borderWidth: 1,
				type: 'bar'
			},
			{
				label: "Click",
				borderWidth: 3,
				hoverBackgroundColor: "rgba(255,99,132,0.4)",
				hoverBorderColor: "rgba(255,99,132,1)",
				type: 'line'
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
					stacked: false
				}]
			},

			title: {
				display: true,
				text: 'VIEWS (Bar) & CLICKS (Line)',
				fontSize: 15,
			},
		};



		$scope.colors_graph3 = ['#246201', '#bcd514', '#028690', '#59c1ca', '#c042be'];

		$scope.labels_graph3 = ['Dashboard', 'ideas', 'Idea proposal', 'Event', 'Distribute Content'];
		$scope.data_graph3 = [
			['30', '60', '70', '20', '10'],
			['30', '60', '70', '20', '10'],

		];
		$scope.datasetOverride_graph3 = [{
				label: "View",
				borderWidth: 1,
				type: 'bar'
			},
			{
				label: "Click",
				borderWidth: 3,
				hoverBackgroundColor: "rgba(255,99,132,0.4)",
				hoverBorderColor: "rgba(255,99,132,1)",
				type: 'line'
			}
		];
		$scope.options_graph3 = {
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
				text: 'VIEWS (Bar) & CLICKS (Line) - Separate',
				fontSize: 15,
			},
		};





		$scope.colors_graph4 = ['#246201', '#bcd514', '#028690', '#59c1ca', '#c042be'];

		$scope.labels_graph4 = ['John', 'Varun', 'Dhamu', 'Karthik', 'Sathish'];
		$scope.data_graph4 = [
			['500', '450', '350', '250', '100'],
			['10', '10', '10', '10', '5'],
		];
		$scope.datasetOverride_graph4 = [{
				label: "View",
				borderWidth: 1,
				type: 'bar'
			},
			{
				label: "Click",
				borderWidth: 3,
				hoverBackgroundColor: "rgba(255,99,132,0.4)",
				hoverBorderColor: "rgba(255,99,132,1)",
				type: 'line'
			}
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
					stacked: false
				}]
			},

			title: {
				display: true,
				text: 'VIEWS (Bar) & CLICKS (Line) RANKING CUSTOMERS',
				fontSize: 15,
			},
		};




		$scope.series_service = ['Events', 'Profile Views', 'Subscription Requests', 'Ideas', 'Proposals', 'Bids'];


		$scope.colors_service = ['#246201', '#bcd514', '#028690', '#59c1ca', '#c042be'];
		$scope.labels_service = ['Oct2018', 'Sep2018', 'Aug2018', 'July2018', 'June2018'];
		$scope.data_service = [];
		$scope.data_service = [
			['30', '60', '70', '20', '10'],
			['30', '60', '70', '20', '10'],
			['30', '60', '45', '20', '10'],
			['30', '60', '70', '20', '10'],
			['30', '56', '70', '20', '10'],
			['30', '60', '80', '20', '10'],
		];
		$scope.options_service = {
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
				text: 'Impact Frequency',
				fontSize: 15,
			},
		};



		$scope.colors_graph5 = ['#246201', '#bcd514', '#028690', '#59c1ca', '#c042be'];

		$scope.labels_graph5 = ['Oct2018', 'Sep2018', 'Aug2018', 'July2018', 'June2018'];
		$scope.data_graph5 = [
			['500', '450', '350', '250', '100'],

		];
		$scope.datasetOverride_graph5 = [{
				label: "View",
				borderWidth: 1,
				type: 'bar'
			},

		];

		$scope.options_graph5 = {
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
				text: 'Impact View',
				fontSize: 15,
			},
		};



		$scope.series_graph6 = ['Actual', 'Platform Average', 'Target'];

		$scope.colors_graph6 = ['#246201', '#bcd514', '#028690', '#59c1ca', '#c042be', '#bcf452'];

		$scope.labels_graph6 = ['Events', 'Profile Views', 'Subscription Requests', 'Ideas', 'Proposals', 'Bids'];
		$scope.data_graph6 = [
			['500', '450', '350', '200', '67', '90'],
			['500', '450', '350', '45', '95', '95'],
			['500', '450', '350', '60', '56', '55'],

		];
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
				text: 'BAR FOR EACH CATEGORY',
				fontSize: 15,
			},
		};





		$scope.colors_graph7 = ['#246201', '#bcd514', '#028690', '#59c1ca', '#c042be', '#bcf452'];

		$scope.labels_graph7 = ['Events', 'Profile Views', 'Subscription Requests', 'Ideas', 'Proposals', 'Bids'];
		$scope.data_graph7 = [
			['300', '466', '655', '444', '470', '90'],

		];
		$scope.datasetOverride_graph7 = [{
				label: "Count",
				borderWidth: 1,
				type: 'bar'
			},

		];

		$scope.options_graph7 = {
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
				text: 'BAR FOR EACH CATEGORY',
				fontSize: 15,
			},
		};

		/*
		  var url = 'apiv4/public/researchprovider/getmaileranalytics';
		var params = {};

		RequestDetail.getDetail(url, params).then(function (result) {
			//$scope.fileoutput = result.data;

			$scope.labels_review = result.data.date_range;
			$scope.data_review = [
				result.data.total_sent,
				result.data.total_delivered,
				result.data.total_open,
				result.data.total_bounce,
				result.data.total_click,
				result.data.total_spam,
			  ];


		});*/



	}).controller('daily_viewCtrl', function ($scope, $http, $location, $route, $routeParams, localStorageService, RequestDetail, $window, configdetails, alertService,$sce) {
		$scope.dailyhtml = "";
	
		$scope.trustAsHtml = function(html) {
		  return $sce.trustAsHtml(html);
		}

		var senddailymail = 'apiv4/public/dashboard/senddailymailcontent';
		var params = {
			 dailyId:$routeParams.dailyId
		}
		RequestDetail.getDetail(senddailymail,params).then(function(result){ // The fasctory RequestDetail reused in Investors and corporates
			$scope.dailyhtml  = result.data.htmlview;
		});
		

	})
	.controller('dailyidea_viewCtrl', function ($scope, $http, $location, $route, $routeParams, localStorageService, RequestDetail, $window, configdetails, alertService,$sce) {
		$scope.dailyhtml = "";
	
		$scope.trustAsHtml = function(html) {
		  return $sce.trustAsHtml(html);
		}

		var senddailymail = 'apiv4/public/dashboard/senddailyideamailcontent';
		var params = {
			 dailyId:$routeParams.dailyId
		}
		RequestDetail.getDetail(senddailymail,params).then(function(result){ // The fasctory RequestDetail reused in Investors and corporates
			$scope.dailyhtml  = result.data.htmlview;
		});
		

	})
	.controller('dailyfundamentals_viewCtrl', function ($scope, $http, $location, $route, $routeParams, localStorageService, RequestDetail, $window, configdetails, alertService,$sce) {
		$scope.dailyhtml = "";
	
		$scope.trustAsHtml = function(html) {
		  return $sce.trustAsHtml(html);
		}

		var senddailymail = 'apiv4/public/dashboard/senddailyfundamentalsmailcontent';
		var params = {
			 dailyId:$routeParams.dailyId
		}
		RequestDetail.getDetail(senddailymail,params).then(function(result){ // The fasctory RequestDetail reused in Investors and corporates
			$scope.dailyhtml  = result.data.htmlview;
		});
		

	})
	.controller('stash_viewCtrl', function ($scope, $http, $location, $route, $routeParams, localStorageService, RequestDetail, $window, configdetails, alertService,$sce) {
		$scope.stashhtml = "";
	
		$scope.trustAsHtml = function(html) {
		  return $sce.trustAsHtml(html);
		}

		var sendstashmail = 'apiv4/public/dashboard/sendstashmailcontent';
		var params = {
			stashId:$routeParams.stashId
		}
		RequestDetail.getDetail(sendstashmail,params).then(function(result){ // The fasctory RequestDetail reused in Investors and corporates
			$scope.stashhtml  = result.data.htmlview;
		});
		

	}).controller('CustomresearchList_dashboard', function ($scope, $http, $location, $route, $routeParams, localStorageService, RequestDetail, $window, configdetails, alertService,$sce) {
		$scope.pageHeading = 'Investor Analytics';
		$scope.pagetitle = 'Factors of Influence';
		$scope.breadcrumb = 'Target';
		$scope.ticker = 'AMZN';
		$scope.fund_id = 0;

		
		$scope.dashboardurl = 'http://40.71.102.38:8000/';
		//CHECK THE APPLICATION IS PRODUCTION OR OTHER
		if (window.location.host == 'www.intro-act.com') {
			$scope.dashboardurl = 'https://reports.intro-act.com/';
		}

		// http://intro-act.eastus.cloudapp.azure.com:8090/Dashboard/9b7636cf-2fae-4fbd-ab45-7b0cc641450f?e=false&vo=viewonly


		$scope.showModalpageinfo = false;

		$scope.openmodelpagehelp = function () {
			$scope.showModalpageinfo = !$scope.showModalpageinfo;
		}


		var data = {
			accountName: 'anon_user',
			password: 'anon_P@ss',
			isWindowsLogOn: false
		};
		var Tokenurl = $scope.dashboardurl + 'apiv4/public/LogOn/token';

		var dashboardId = '9b7636cf-2fae-4fbd-ab45-7b0cc641450f';
		

		//LOGIN DISABLED DUE TO CORS ISSUE
		var res = $http({
			//url:'http://intro-act.eastus.cloudapp.azure.com:8090/apiv4/public/LogOn/token',
			url: $scope.dashboardurl + 'apiv4/public/LogOn/token',
			method: "POST",
			data: $.param(data),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			}
		});

		res.success(function (data, status, headers, config) {
			//var dash_url = 'http://intro-act.eastus.cloudapp.azure.com:8090/dashboard/'+dashboardId+'?e=false&vo=viewonly&logonTokenId=' +data.logOnToken;
			var dash_url = $scope.dashboardurl + 'dashboard/' + dashboardId + '?e=false&vo=viewonly';
			$scope.currentDashboardUrl = $sce.trustAsResourceUrl(dash_url);
		});
	})
	.controller('reportsCtrl', function ($scope, $http, $location, $route, $routeParams, localStorageService, RequestDetail, $window, configdetails, alertService,$sce) {

		$scope.pageHeading = 'Reports';
		$scope.dashboardResearchActive = 'active';

		$scope.colors_graph1 = ['#0F74BA', '#29A8E0', '#e0ea49', '#e0ea93', '#29A8E0'];

        $scope.data_graph1 = [];
        $scope.data_graph1 = [
			['10','25','30','70']
        ]; 

        $scope.datasetOverride1 = [{ yAxisID: 'y-axis-1' }];

        $scope.labels_graph1 = [];
        $scope.labels_graph1 = ['01 Dec 2019', '08 Dec 2019' , '15 Dec 2019' , '22 Dec 2019'];

        $scope.options_graph1 = {
			legend: {
				display: true
			},
			scales: {
				xAxes: [{
					stacked: false,gridLines: {display: true,drawBorder: true,drawOnChartArea: false}
				}],
				yAxes: [{
					stacked: false,id: 'y-axis-1', position: 'left',gridLines: {display: true,drawBorder: true,drawOnChartArea: false},scaleLabel: { display: true, labelString: 'Unique Email'},  ticks: {min: 0,callback: function (value) { if (Number.isInteger(value)) { return value; } }}
				}]
			},

			title: {
				display: true,
				text: '',
				fontSize: 15,
			},
        };
        
		$scope.series_graph1 = ['Unique Emails'];
		


		$scope.colors_graph2 = ['#0F74BA', '#29A8E0', '#e0ea49', '#e0ea93', '#29A8E0'];

        $scope.data_graph2 = [];
        $scope.data_graph2 = [
            ['10', '20', '30', '40', '50','60'],
            ['5', '10', '20', '30', '40','50'],
        ]; 

        $scope.datasetOverride2 = [{ yAxisID: 'y-axis-1' }];

        $scope.labels_graph2 = [];
        $scope.labels_graph2 = ['01 Dec 2019', '08 Dec 2019' , '15 Dec 2019' , '22 Dec 2019'];

        $scope.options_graph2 = {
			legend: {
				display: false
			},
			scales: {
				xAxes: [{
					stacked: false,gridLines: {display: true,drawBorder: true,drawOnChartArea: false}
				}],
				yAxes: [{
					stacked: false,id: 'y-axis-1', position: 'left',gridLines: {display: true,drawBorder: true,drawOnChartArea: false},scaleLabel: { display: true, labelString: 'Emails'},  ticks: {min: 0,callback: function (value) { if (Number.isInteger(value)) { return value; } }}
				}]
			},

			title: {
				display: true,
				text: '',
				fontSize: 15,
			},
		};
		
		$scope.series_graph2 = ['System', 'User'];





		$scope.colors_graph3 = ['#0F74BA', '#29A8E0', '#e0ea49', '#e0ea93', '#29A8E0'];

        $scope.data_graph3 = [];
        $scope.data_graph3 = [
            ['10', '20', '30', '40', '50','60'],
			['5', '10', '20', '30', '40','50'],
			['10', '20', '30', '40', '50','60'],
			['5', '10', '20', '30', '40','50'],
        ]; 

        $scope.datasetOverride3 = [
			{ yAxisID: 'y-axis-1' },
			{ yAxisID: 'y-axis-1' },
			{
					label: "Open Rate",
					borderWidth: 3,
					hoverBackgroundColor: "rgba(255,56,100,0.4)",
					hoverBorderColor: "rgba(255,56,100,0.4)",
					type: 'line'
			},{
				label: "Click Rate",
				borderWidth: 3,
				hoverBackgroundColor: "rgba(212,238,249,0.4)",
				hoverBorderColor: "rgba(255,56,100,0.4)",
				type: 'line'
		}];

        $scope.labels_graph3 = [];
        $scope.labels_graph3 = ['01 Dec 2019', '08 Dec 2019' , '15 Dec 2019' , '22 Dec 2019'];

        $scope.options_graph3 = {
			legend: {
				display: false
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
		
		$scope.series_graph3 = ['Opens', 'Clicks'];



		$scope.colors_graph4 = ['#0F74BA', '#29A8E0', '#e0ea49', '#e0ea93', '#29A8E0'];

        $scope.data_graph4 = [];
        $scope.data_graph4 = [
            ['10', '20', '30', '40', '50','60'],
			['5', '10', '20', '30', '40','50'],
			['10', '20', '30', '40', '50','60'],
			['5', '10', '20', '30', '40','50'],
        ]; 

        $scope.datasetOverride4 = [
			{ yAxisID: 'y-axis-1' },
			{ yAxisID: 'y-axis-1' },
			{
					label: "Open Rate",
					borderWidth: 3,
					hoverBackgroundColor: "rgba(255,56,100,0.4)",
					hoverBorderColor: "rgba(255,56,100,0.4)",
					type: 'line'
			},{
				label: "Click Rate",
				borderWidth: 3,
				hoverBackgroundColor: "rgba(212,238,249,0.4)",
				hoverBorderColor: "rgba(255,56,100,0.4)",
				type: 'line'
		}];

        $scope.labels_graph4 = [];
        $scope.labels_graph4= ['AAPL', 'AMZN' , 'MSQL' , 'HTLP'];

        $scope.options_graph4 = {
			legend: {
				display: false
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
		
		$scope.series_graph4 = ['Opens', 'Clicks'];
		




		$scope.colors_graph5 = ['#0F74BA', '#29A8E0', '#e0ea49', '#e0ea93', '#29A8E0'];

        $scope.data_graph5 = [];
        $scope.data_graph5 = [
            ['10', '20', '30', '40', '50','60'],
			['5', '10', '20', '30', '40','50'],
			
        ]; 

        $scope.datasetOverride5 = [
			{ yAxisID: 'y-axis-1' }];

        $scope.labels_graph5 = [];
        $scope.labels_graph5 = ['01 Dec 2019', '08 Dec 2019' , '15 Dec 2019' , '22 Dec 2019'];

        $scope.options_graph5 = {
			legend: {
				display: false
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
		
		$scope.series_graph5 = ['Opens', 'Clicks'];



		$scope.colors_graph6 = ['#0F74BA', '#29A8E0', '#e0ea49', '#e0ea93', '#29A8E0'];

        $scope.data_graph6 = [];
        $scope.data_graph6 = [
            ['10', '20', '30', '40', '50','60'],
			['5', '10', '20', '30', '40','50'],
			
        ]; 

        $scope.datasetOverride6 = [
			{ yAxisID: 'y-axis-1' }
		];

        $scope.labels_graph6 = [];
        $scope.labels_graph6= ['AAPL', 'AMZN' , 'MSQL' , 'HTLP'];

        $scope.options_graph6 = {
			legend: {
				display: false
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
		
		$scope.series_graph6 = ['Opens', 'Clicks'];
	})
	.controller('researchideas', function ($scope, $http, $location, $route, $routeParams, localStorageService, RequestDetail, $window, configdetails, alertService,$sce) {
		$scope.pageHeading = 'Research';
		$scope.dashboardResearchActive = 'active';
		
		$scope.showModalpageinfo = false;

		$scope.openmodelpagehelp = function () {
			$scope.showModalpageinfo = !$scope.showModalpageinfo;
		}

		$scope.spinnerActive = true;
		var sendstashmail = 'apiv4/public/researchprovider/getresearchideas';
		var params = {
		}
		RequestDetail.getDetail(sendstashmail,params).then(function(result){ // The fasctory RequestDetail reused in Investors and corporates
		
			$scope.results  = result.data;
			$scope.spinnerActive = false;
		});
	})
	.controller('readershipreport', function ($scope, $http, $location, $route, $routeParams, localStorageService, RequestDetail, $window, configdetails, alertService,$sce) {
		$scope.pageHeading = 'Research';
		$scope.dashboardResearchActive = 'active';

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
		
		$scope.showModalpageinfo = false;

		$scope.openmodelpagehelp = function () {
			$scope.showModalpageinfo = !$scope.showModalpageinfo;
		}

		$scope.minwidth = 600;

		$scope.users = [];

		$scope.spinnerActive = true;
		var readershipreport = 'apiv4/public/researchprovider/getreadershipreport';

		if (angular.isDefined($routeParams.userId) && $routeParams.userId != '') {
			var params = {userId:$routeParams.userId};
		}else{
			var params = {};
		}

		
		RequestDetail.getDetail(readershipreport,params).then(function(result){ // The factory RequestDetail reused in Investors and corporates
			
			$scope.users = result.data.results;
			$scope.reports  = result.data.reports;


			angular.forEach($scope.reports, function (col, index) {
				$scope.minwidth = $scope.minwidth + 30;
			});

			$scope.totals  = result.data.totals;
			$scope.spinnerActive = false;
			$scope.sortColumn('Total');
		});
	})
	.controller('rpinfluencers', function ($scope, $http, $location, $route, $routeParams, localStorageService, RequestDetail, $window, configdetails, alertService,$sce) {
		$scope.pageHeading = 'Research';
		$scope.dashboardResearchActive = 'active';
		$scope.ideas = [];
		$scope.currators = [];

		$scope.filter_text = $routeParams.filter_text;

		var url = 'apiv4/public/researchprovider/getsectors';
		var params = {}
		RequestDetail.getDetail(url,params).then(function(result){ 
			$scope.sectors  = result.data;
		});
		
		$scope.getsectorsresult = function () {
			var url = 'apiv4/public/researchprovider/getsectorsresult';
			var params = {sector:$scope.filter_text}
			RequestDetail.getDetail(url,params).then(function(result){ 
				$scope.ideas  = result.data;
			});

			var url = 'apiv4/public/researchprovider/getcurratorresult';
			var params = {sector:$scope.filter_text}
			RequestDetail.getDetail(url,params).then(function(result){ 
				$scope.currators  = result.data;
			});
			
		};
		if($scope.filter_text){
			$scope.getsectorsresult();
		}
		
	}).controller('rpdatabase', function ($scope, $http, $location, $route, $routeParams, localStorageService, RequestDetail, $window, configdetails, alertService,$sce) {
		$scope.pageHeading = 'Research';
		$scope.dashboardResearchActive = 'active';
		
		$scope.filter_text = $routeParams.filter_text;

		var url = 'apiv4/public/researchprovider/getsectors';
		var params = {}
		RequestDetail.getDetail(url,params).then(function(result){ 
			$scope.sectors  = result.data;
		});

		$scope.getrpdatabase = function () {
			$scope.spinnerActive = true;
			var url = 'apiv4/public/researchprovider/getrpdatabase';
			var params = {searchtext:$scope.searchtext,filter_text:$scope.filter_text}
			RequestDetail.getDetail(url,params).then(function(result){ 
				$scope.rpcontacts  = result.data;
				$scope.spinnerActive = false;
			});
		}
		$scope.getrpdatabase();
	})
	.controller('resource', function ($scope, $http, $location, $route, $routeParams, localStorageService, RequestDetail, $window, configdetails, alertService,$sce) {
		$scope.pageHeading = 'Research';
		$scope.dashboardResearchActive = 'active';

		$scope.filter_text = $routeParams.filter_text;
		
		var url = 'apiv4/public/researchprovider/getsectors';
		var params = {}
		RequestDetail.getDetail(url,params).then(function(result){ 
			$scope.sectors  = result.data;
		});
		
		$scope.getrpdatabase = function () {
			$scope.spinnerActive = true;
			var url = 'apiv4/public/researchprovider/getresource';
			var params = {searchtext:$scope.searchtext,filter_text:$scope.filter_text}
			RequestDetail.getDetail(url,params).then(function(result){ 
				$scope.rpcontacts  = result.data;
				$scope.spinnerActive = false;
			});
		}
		$scope.getrpdatabase();
	})
	.controller('reportsubscriptionCtrl', function ($scope, $http, $location, localStorageService, $rootScope, usertype, validation, RequestDetail, $timeout, configdetails, alertService, $routeParams, $route) {
		
		
		$scope.irpuser = $routeParams.irpuser;
	
		
		$scope.spinnerActive = true;
		$scope.report = {};
		$scope.report.firstname = '';
		$scope.report.lastname = '';
		$scope.report.email = '';
		$scope.report.company = '';
		$scope.report.contact = '';

		$scope.report.email = $routeParams.email;
		$scope.report.rpid = $scope.irpuser;

		var tagUrl = 'apiv4/public/dashboard/getcompanylogoreport';
		var params = $scope.report;
		RequestDetail.getDetail(tagUrl, params).then(function (result) {
			$scope.company = result.data;
			$scope.spinnerActive = false;
		}); 

		$scope.submitrequest = function () {
			if($scope.report.email==""){
                alertService.add("warning", "Please Enter Email!", 2000);
                return false;
			}
			if (!$scope.checkemailval($scope.report.email)) {
				alertService.add("warning", "Please Enter Valid Email!", 2000);
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

			
			

			var tagUrl = 'apiv4/public/dashboard/addreportsubscription';
			var params = $scope.report;
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				$scope.report = {};
				alertService.add("success", "You have successfully subscribed.", 2000);
				$route.reload();
			}); 
		}

		$scope.checkemailval = function (email) {
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(String(email).toLowerCase());
		}

		
		
	})

    .controller('listThemes', function($scope,$http,$location,localStorageService,$rootScope,usertype,$routeParams,$sce,configdetails,RequestDetail,alertService) {
        $scope.sidepopupactive=false;
     
        $scope.sidepopup = function() {
            $scope.sidepopupactive=!$scope.sidepopupactive;
        }
       
       $scope.configdetails=configdetails;
       $scope.pageHeading = 'Themes Researched by Blueshift Research';
       $scope.meetingPrepareActive = 'active';
       $scope.themesActive = 'inner-active';
       $scope.data={};
       $scope.newrequest={};
       $scope.data.industry = [];
       $scope.data.ticker = [];
       $scope.data.keyword = [];
       $scope.searchthemelists = {};
       
       $scope.newrequest.ticker = [];
       $scope.newrequest.industry = [];
       
       $scope.dashboardurl = 'http://40.71.102.38:8000/';
       //CHECK THE APPLICATION IS PRODUCTION OR OTHER
       if(window.location.host=='www.intro-act.com'){
           $scope.dashboardurl = 'https://reports.intro-act.com/';
       }
       
       $scope.SearchThemesTrends = function(initial){
           if(angular.isUndefined($scope.data.industry)){
               $scope.data.industry=[];
           }
           if(angular.isUndefined($scope.data.ticker)){
               $scope.data.ticker=[];
           }
           if(angular.isUndefined($scope.data.keyword)){
               $scope.data.keyword='';
           }
           
           var industry = $scope.data.industry;
           var company = $scope.data.ticker;
           var keyword = $scope.data.keyword;
           
           
           
           
           //var data = {accountName: 'anon_user', password: 'anon_P@ss', isWindowsLogOn: false};
           //var Tokenurl = 'https://reports.intro-act.com/apiv4/public/LogOn/token';
           //var Tokenurl = 'http://intro-act.eastus.cloudapp.azure.com:8090/apiv4/public/LogOn/token';
           var data = {accountName: 'anand@codebaordtech.com', password: 'Login1234', isWindowsLogOn: false};
           var Tokenurl = $scope.dashboardurl+'apiv4/public/LogOn/token';
           var dashboardId = '773c71fc-bf61-4505-829b-f2139d3abe79';
           
           var dash_url = $scope.dashboardurl+"dashboard/"+dashboardId+"?e=false&vo=viewonly&industry=" + industry + "&company=" + company;
           $scope.currentDashboardUrl = $sce.trustAsResourceUrl(dash_url);
           
           //LOGIN DISABLED DUE TO CORS ISSUE
           // var res = $http({
               // //url:'http://intro-act.eastus.cloudapp.azure.com:8090/apiv4/public/LogOn/token',
               // url:'http://40.71.102.38:8000/apiv4/public/LogOn/token',
               // method:"POST",
               // data    : $.param(data),
               // headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
           // });
   
           // res.success(function (data, status, headers, config) {
               // //var dash_url = "http://intro-act.eastus.cloudapp.azure.com:8090/dashboard/"+dashboardId+"?e=false&vo=viewonly&logonTokenId=" +data.logOnToken + "&industry=" + industry + "&company=" + company;
               // var dash_url = "http://40.71.102.38:8000/dashboard/"+dashboardId+"?e=false&vo=viewonly&logonTokenId=" +data.logOnToken + "&industry=" + industry + "&company=" + company;
               // $scope.currentDashboardUrl = $sce.trustAsResourceUrl(dash_url);
           // });
           
           
           if(!initial){
               $scope.recentthemelists = {};
               $scope.topratedthemelists = {};
               $scope.themelists = {};
               
               // Getting Search Themes
               $scope.searchthemelists = {};
   
               var getThemesUrl = 'apiv4/public/themes/searchThemes';
               var getThemesParams = {
                 industry : industry[0],
                 company : company[0],
                 keyword : keyword
               };
               
               
               
               if(!angular.isUndefined(industry[0]) && !angular.isUndefined(company[0]) && keyword!=''){
                   RequestDetail.getDetail(getThemesUrl,getThemesParams).then(function(result){
                       if(result.data != 'false'){
                         $scope.searchthemelists = result.data;
                       } else {
                         $scope.searchthemelists = '';
                       }
                   });
               
               }
   
               
           }
   
       };
       $scope.SearchThemesTrends(true);	
       
       $scope.data={};
       var filter_data=localStorageService.get('filter_data');
       if(filter_data!='' && filter_data!=null && filter_data!='null'){
           $scope.data=filter_data;
       }
       
       $scope.availableTickers=[];
       $scope.availableIndustry=[];
       if(angular.isDefined(filter_data) && filter_data!=null && filter_data!='null' && angular.isDefined(filter_data.industry) && filter_data.industry.length>0){
           angular.forEach(filter_data.industry,function(industry,index){
               if(angular.isDefined(industry) && industry!=''){
                   var obj=new Object();
                   obj.label=industry;
                   obj.value=industry;
                   $scope.availableIndustry.push(obj);
               }
           });
       }
       if(angular.isDefined(filter_data) && filter_data!=null && filter_data!='null' && angular.isDefined(filter_data.ticker) && filter_data.ticker.length>0){
           angular.forEach(filter_data.ticker,function(tickers,index){
               if(angular.isDefined(tickers) && tickers!=''){
                   var obj=new Object();
                   obj.label=tickers;
                   obj.value=tickers;
                   $scope.availableTickers.push(obj);
               }
           });
       }
       
       $scope.get_search_details=function(type,searchkey){
           if(angular.isDefined(searchkey) && searchkey!=''){
               if(type!=''){
                   var tagUrl = 'apiv4/public/themes/get_search_details';
                   var searchterm=searchkey;
   
                   if(type=='industry'){
                       var params = {term : searchterm, key : type };
                       RequestDetail.getDetail(tagUrl,params).then(function(result){
                           if(angular.isDefined(result.data) && result.data.length>0)
                           {
                               $scope.availableIndustry=result.data;
                           }else{
                               $scope.availableIndustry=[];
                           }
                       });
                   }
                   
                   if(type=='ticker'){
                       var params = {term : searchterm, key : type };
                     var tagUrl = 'apiv4/public/themes/get_search_details';
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
   
       $scope.clearThemeSearch = function(){
           $location.path('/themesDashboard/');  
       }
       
       $scope.showRequestNewThemeModal = false;
       $scope.toggleRequestNewThemeModal = function(){
           //  ******************** To avoid the api calling second time in same page Store in the variable and fetched the data ising $index value
           //$scope.values = $scope.FetchedData.items[index];
           // Assign the values to the variables
           $scope.showRequestNewThemeModal = !$scope.showRequestNewThemeModal;
           $scope.RequestNewThememsg = false;
         
       };
       
       $scope.resetnewthemepopup = function() {
           $scope.newrequest.theme_description = "";
           $scope.newrequest.ticker = [];
           $scope.newrequest.industry = [];
           $scope.showRequestNewThemeModal = false;
           
       }
   
   
       if($location.path()=='/themesDashboard/auto'){
            $scope.toggleRequestNewThemeModal();
       }
       
       
       
       $scope.RequestNewTheme = function() {
           
           if( $scope.newrequest.theme_description==""){
               alertService.add("warning", "Please add all details!",2000);
               return false;
           }
           
           if( $scope.newrequest.ticker.length==0){
               alertService.add("warning", "Please add all details!",2000);
               return false;
           }
           
           if( $scope.newrequest.industry.length==0){
               alertService.add("warning", "Please add all details!",2000);
               return false;
           }
           
           var data_requestnewtheme = {theme_description: $scope.newrequest.theme_description, ticker: $scope.newrequest.ticker, industry: $scope.newrequest.industry};
           
           var set = $http({
               method : 'POST',
               url : 'apiv4/public/themes/RequestNewTheme',
               data : $.param(data_requestnewtheme),
               headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
           }).then(function successCallback(response) {
               $scope.RequestNewThememsg = true;
   
               
               setTimeout(function(){ 
                   $scope.RequestNewThememsg = false;
               }, 500);
               //console.log('test');
               $scope.newrequest.theme_description = "";
               $scope.newrequest.ticker = [];
               $scope.newrequest.industry = [];
           }, function errorCallback(response) {
               
           });
           
       }
       
       
       
   
       
       
       // Getting Recent Themes
       $scope.recentthemelists = {};
   
       var getThemesUrl = 'apiv4/public/themes/getRecentThemes';
       var getThemesParams = {	};
   
       RequestDetail.getDetail(getThemesUrl,getThemesParams).then(function(result){
           if(result.data != 'false'){
             $scope.recentthemelists = result.data;
           } else {
             $scope.recentthemelists = '';
           }
       });
       
       // Getting Top Rated Themes
       $scope.topratedthemelists = {};
   
       var getThemesUrl = 'apiv4/public/themes/getTopRatedThemes';
       var getThemesParams = {	};
   
       RequestDetail.getDetail(getThemesUrl,getThemesParams).then(function(result){
           if(result.data != 'false'){
             $scope.topratedthemelists = result.data;
           } else {
             $scope.topratedthemelists = '';
           }
       });
       
       // Getting All Themes
       $scope.themelists = {};
   
       var getThemesUrl = 'apiv4/public/themes/getThemes';
       var getThemesParams = {	};
   
       RequestDetail.getDetail(getThemesUrl,getThemesParams).then(function(result){
           if(result.data != 'false'){
             $scope.themelists = result.data;
           } else {
             $scope.themelists = '';
           }
       });
       
       // Getting Idea Proposals
       $scope.idealists = {};
   
       var getThemesUrl = 'apiv4/public/themes/getIdeas';
       var getThemesParams = {	};
   
       RequestDetail.getDetail(getThemesUrl,getThemesParams).then(function(result){
           if(result.data != 'false'){
             $scope.idealists = result.data;
           } else {
             $scope.idealists = '';
           }
       });
       
       
   }).controller('viewTheme', function($scope,$http,$location,$route,$routeParams,$sce,localStorageService,$rootScope,usertype,configdetails,RequestDetail) {
       $scope.configdetails=configdetails;
       $scope.pageHeading = 'Themes Detail';
       $scope.meetingPrepareActive = 'active';
       $scope.themesActive = 'inner-active';
       $scope.themeid = $routeParams.themeID;
       $scope.data={};
       
       
       $scope.auto = $routeParams.auto; // auto popup
   
       $scope.dashboardurl = 'http://40.71.102.38:8000/';
       //CHECK THE APPLICATION IS PRODUCTION OR OTHER
       if(window.location.host=='www.intro-act.com'){
           $scope.dashboardurl = 'https://reports.intro-act.com/';
       }
       
       // Getting Theme Details
       $scope.themedetails = {};
       $scope.themeRelateddetails = {};
       $scope.selected_ticker = '';
   
       $scope.SearchTickers = function(initial){
           
           if(initial){
               var selticker = {};
               var getThemeDetailParams = {themeid:$scope.themeid};
           }else{
               var selticker = $scope.data.ticker;
               var getThemeDetailParams = {new_ticker:selticker[0]};
           }
           
           //var data = {accountName: 'anon_user', password: 'anon_P@ss', isWindowsLogOn: false};
           //var Tokenurl = 'http://intro-act.eastus.cloudapp.azure.com:8090/apiv4/public/LogOn/token';
           var data = {accountName: 'anand@codebaordtech.com', password: 'Login1234', isWindowsLogOn: false};
           var Tokenurl = $scope.dashboardurl+'apiv4/public/LogOn/token';
           var dashboardId = '04f0b0ca-e887-4eb5-8823-ffdc27e9bf6b';
           var getThemeDetailUrl = 'apiv4/public/themes/getThemeDetails';
   
           RequestDetail.getDetail(getThemeDetailUrl,getThemeDetailParams).then(function(result){
               if(result.data != 'false'){
                 $scope.themedetails = result.data.detail;
                 $scope.themeRelateddetails = result.data.relatedThemes;
                 $scope.selected_ticker = result.data.selected_ticker;
                 //SET THE MULTI SELECT VALUE
                // $scope.data.ticker = [{"value": $scope.selected_ticker, "label": $scope.selected_ticker}];
                 //var dash_url = 'http://intro-act.eastus.cloudapp.azure.com:8090/dashboard/'+dashboardId+'?e=false&vo=viewonly&ticker=' + $scope.selected_ticker;
                 var dash_url = $scope.dashboardurl+'dashboard/'+dashboardId+'?e=false&vo=viewonly&ticker=' + $scope.selected_ticker;
                 $scope.currentDashboardUrl = $sce.trustAsResourceUrl(dash_url);
               }
           });
           
           
           /*
           var res = $http({
               url:'http://intro-act.eastus.cloudapp.azure.com:8090/apiv4/public/LogOn/token',
               method:"POST",
               data    : $.param(data),
               headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
           });
   
           res.success(function (data, status, headers, config) {
               var dash_url = 'http://intro-act.eastus.cloudapp.azure.com:8090/dashboard/'+dashboardId+'?e=false&vo=viewonly&logonTokenId=' +data.logOnToken + '&ticker=' + $scope.selected_ticker;
               $scope.currentDashboardUrl = $sce.trustAsResourceUrl(dash_url);
           });
           */
       };
       $scope.SearchTickers(true);	
       
       $scope.showRequestStudyModal = false;
       $scope.toggleRequestStudyModal = function(){
           //  ******************** To avoid the api calling second time in same page Store in the variable and fetched the data ising $index value
           //$scope.values = $scope.FetchedData.items[index];
           // Assign the values to the variables
   
           
           var data = {themeid: $scope.themeid};
           
           var set = $http({
               method : 'POST',
               url : 'apiv4/public/themes/RequestStudyModal',
               data : $.param(data),
               headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
           }).then(function successCallback(response) {
               
           }, function errorCallback(response) {
               
           });
           
           
           
           $scope.showRequestStudyModal = !$scope.showRequestStudyModal;
         
       };
       
       if($scope.auto=='auto'){
            $scope.toggleRequestStudyModal();
       }
       
       
       $scope.data={};
       var filter_data=localStorageService.get('filter_data');
       if(filter_data!='' && filter_data!=null && filter_data!='null'){
           $scope.data=filter_data;
       }
       
       $scope.availableTickers=[];
       if(angular.isDefined(filter_data) && filter_data!=null && filter_data!='null' && angular.isDefined(filter_data.ticker) && filter_data.ticker.length>0){
           angular.forEach(filter_data.ticker,function(tickers,index){
               if(angular.isDefined(tickers) && tickers!=''){
                   var obj=new Object();
                   obj.label=tickers;
                   obj.value=tickers;
                   $scope.availableTickers.push(obj);
               }
           });
       }
       
       $scope.get_search_details=function(type,searchkey){
           if(angular.isDefined(searchkey) && searchkey!=''){
               if(type!=''){
                   var tagUrl = 'apiv4/public/themes/get_search_details';
                   var searchterm=searchkey;
   
                   if(type=='ticker'){
                       var params = {term : searchterm, key : type };
                     var tagUrl = 'apiv4/public/themes/get_search_details';
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
       
       $scope.back_to_dashboard = function(){
           $location.path('themesDashboard');
       }
   }).controller('viewthemesDashboard', function($scope,$http,$location,$route,$routeParams,$sce,localStorageService,$rootScope,usertype,configdetails,RequestDetail) {
           
       $scope.configdetails=configdetails;
       $scope.pageHeading = 'Themes Detail';
       $scope.meetingPrepareActive = 'active';
       $scope.themesActive = 'inner-active';
       $scope.data={};
       
       $scope.dashboardurl = 'http://40.71.102.38:8000/';
       //CHECK THE APPLICATION IS PRODUCTION OR OTHER
       if(window.location.host=='www.intro-act.com'){
           $scope.dashboardurl = 'https://reports.intro-act.com/';
       }
       
       localStorageService.set('usertype','corporate');
                      
       // Getting Theme Details
       $scope.themedetails = {};
       $scope.themeRelateddetails = {};
       
       $scope.selected_ticker = $routeParams.ticker;
   
       $scope.SearchTickers = function(){
           //var data = {accountName: 'anon_user', password: 'anon_P@ss', isWindowsLogOn: false};
           //var Tokenurl = 'http://intro-act.eastus.cloudapp.azure.com:8090/apiv4/public/LogOn/token';
           
           // var data = {accountName: 'anand@codebaordtech.com', password: 'Login1234', isWindowsLogOn: false};
           // var Tokenurl = $scope.dashboardurl+'apiv4/public/LogOn/token';
           
           var dashboardId = '04f0b0ca-e887-4eb5-8823-ffdc27e9bf6b';
           //var dash_url = 'http://intro-act.eastus.cloudapp.azure.com:8090/dashboard/'+dashboardId+'?e=false&vo=viewonly&ticker=' + $scope.selected_ticker;
           var dash_url = $scope.dashboardurl+'dashboard/'+dashboardId+'?e=false&vo=viewonly&ticker=' + $scope.selected_ticker;
           $scope.currentDashboardUrl = $sce.trustAsResourceUrl(dash_url);
       };
       $scope.SearchTickers();
      
       $scope.back_to_dashboard = function(){
           $location.path('themesDashboard');
       }
        
   })