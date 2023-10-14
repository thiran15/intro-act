'use strict';

var isOnGitHub = window.location.hostname === 'blueimp.github.io',
  url = 'upload/server/php/';
/* Controllers */

angular.module('myApp.meetingCtrl', [])
  .controller('meetingrecommendationctrl', function ($scope, $http, $location, RequestDetail, alertService, localStorageService, $routeParams, configdetails) {

    $scope.configdetails = configdetails;
    $scope.pageHeading = 'Meeting Recommendations';
  })
  .controller('newMeetingCtrl', function ($scope, $http, $location, RequestDetail, alertService, localStorageService, $routeParams, configdetails) {
    $scope.configdetails = configdetails;
    $scope.pageHeading = 'Meetings';
    $scope.dasboardActive = 'active';
    // //console.log(configdetails);
    $scope.required_input = '';
    $scope.meeting = {};
    $scope.meeting.investmentFirm = '';
    $scope.meeting.investorEmail = '';
    $scope.meeting.requestType = '';
    $scope.meeting.investorName = '';
    $scope.meeting.investorPhone = '';
    $scope.meeting.requestSponsor = '';
    $scope.meeting.titleContact = '';
    $scope.meeting.investorTitle = '';
    $scope.meeting.meetingPurpose = '';
    $scope.investorsList = '';
    $scope.investorFinalDetail = '';
    $scope.selectedInvestor = '';
    // Industry Tags Added

    $scope.showModalpageinfo = false;

    $scope.openmodelpagehelp = function () {
      $scope.showModalpageinfo = !$scope.showModalpageinfo;
    }


    $scope.industryTagsAdded = [];

    $scope.meeting.investorLocation = '';



    if (angular.isDefined($routeParams.userId) && $routeParams.userId != '') {
      var url = 'apiv4/public/meeting/get_user';
      var params = {
        user_id: $routeParams.userId
      };

      RequestDetail.getDetail(url, params).then(function (result) {
        if (angular.isDefined(result.data) && result.data != 0) {
          $scope.meeting.company_name = result.data.company_name
          $scope.meeting.email = result.data.email;
          $scope.meeting.user_id = result.data.user_id;

        }
      });


    }

    $scope.get_loc_details = function (val) {
      var locurl = 'apiv4/public/event/get_location';
      var params = {
        val: val
      };
      $scope.availableLocation = [];
      RequestDetail.getDetail(locurl, params).then(function (result) {
        angular.forEach(result.data, function (val, key) {
          $scope.availableLocation.push(val);
        });
      });
    }

    $scope.show_dashboard = function () {
      $location.path('dashboard');
    }

    // timezone list 
    $scope.get_timezone = function () {

      var tagUrl = 'apiv4/public/dashboard/get_timezone';
      var params = {
        key: 'tags'
      };
      RequestDetail.getDetail(tagUrl, params).then(function (result) {
        $scope.timezone = [];
        if (angular.isDefined(result.data) && result.data != '') {
          angular.forEach(result.data, function (data) {
            $scope.timezone.push(data);
          });
        }

      });
    }

    $scope.get_timezone();


    $scope.check_location = function () {
      if ($scope.meeting.requestType == 'Call') {
        $scope.hide_location_validation = true;
        $scope.meeting.investorLocation = 'N/A';

      } else {
        $scope.hide_location_validation = false;
        $scope.meeting.investorLocation = '';
      }
    }


    // Get Industry Tags here

    var tagUrl = 'apiv4/public/meeting/getAllIndustryTags';
    var params = {};

    RequestDetail.getDetail(tagUrl, params).then(function (result) {
      $scope.macroTags = result.data.macro;
      $scope.midTags = result.data.mid;
      $scope.microTags = result.data.micro;
    });

    var user = localStorageService.get('usertype');
    if (user == 'investor') {
      var setUser = 'corporate';
    } else if (user == 'corporate') {
      var setUser = 'investor';
    } else if (user == 'broker') {
      var setUser = 'investor';
    }

    var pickInvestor = 'apiv4/public/user/getUser';
    var params = {
      type: setUser
    };
    RequestDetail.getDetail(pickInvestor, params).then(function (result) {
      $scope.investorsList = result.data;
    });



    var pickCorporate = 'apiv4/public/user/getUser';
    var params = {
      type: 'corporate'
    };
    RequestDetail.getDetail(pickCorporate, params).then(function (result) {
      $scope.corporateList = result.data;
    });


    var pickCorporate = 'apiv4/public/user/getUser';
    var params = {
      type: 'broker'
    };
    RequestDetail.getDetail(pickCorporate, params).then(function (result) {
      $scope.userList = result.data;
    });



    $scope.presentaion_file = [];


    $scope.removeFiles = function (index) {
      $scope.presentaion_file.splice(index, 1);
    }

    $scope.uploadpresentaionFile = function (imgdata) {
      if ($scope.presentaion_file.length == '0') {
        $scope.presentaion_file = [];
      }
      $scope.$apply(function () {
        $scope.presentaion_file.push({
          file_name: imgdata,
          file_location: 'uploads/temp/' + imgdata
        })
      });

    }


    $scope.get_contact = function () {

      if (angular.isDefined($scope.meeting.user_id)) {
        var getContactDetail = 'apiv4/public/user/getProfileContactById';
        var params = {
          type: 'get',
          profile_id: $scope.meeting.user_id
        };
        RequestDetail.getDetail(getContactDetail, params).then(function (result) {
          $scope.contactRespond = result.data;
        });
        $scope.selectedResponder = {};
        $('#contact_value').val('');
      }
    }



    $scope.selectuser = function (data) {
      if (data) {
        $scope.meeting.userEmail = data.originalObject.email;
        $scope.meeting.investmentFirm = data.originalObject.company_name;
        $scope.meeting.userName = data.originalObject.firstname + ' ' + data.originalObject.lastname;
        $scope.meeting.userPhone = data.originalObject.contact;
        $scope.selecteduser = data.originalObject;



        var getContactDetail = 'apiv4/public/user/getProfileContactById';
        var params = {
          type: 'get',
          profile_id: $scope.selecteduser.user_id
        };

        RequestDetail.getDetail(getContactDetail, params).then(function (result) {
          $scope.contactRespond = result.data;
        });

        $scope.selectedResponder = {};
        $('#pickContact_value').val('');
      }
    }



    $scope.selectInvestor = function (data) {
      if (data) {
        $scope.meeting.investorEmail = data.originalObject.email;
        $scope.meeting.investmentFirm = data.originalObject.company_name;
        $scope.meeting.investorName = data.originalObject.firstname + ' ' + data.originalObject.lastname;
        $scope.meeting.investorPhone = data.originalObject.contact;

        $scope.selectedInvestor = data.originalObject;

        var getContactDetail = 'apiv4/public/user/getProfileContactById';
        var params = {
          type: 'get',
          profile_id: $scope.selectedInvestor.user_id
        };

        RequestDetail.getDetail(getContactDetail, params).then(function (result) {
          $scope.contactRespond = result.data;
        });

        $scope.selectedResponder = {};
        $('#pickContact_value').val('');
      }
    }






    $scope.selectCorporate = function (data) {
      if (data) {
        $scope.meeting.corporateEmail = data.originalObject.email;
        $scope.meeting.investmentFirm = data.originalObject.company_name;
        $scope.meeting.corporateName = data.originalObject.firstname + ' ' + data.originalObject.lastname;
        $scope.meeting.corporatePhone = data.originalObject.contact;
        $scope.selectedInvestor = data.originalObject;
      }
    }

    $scope.selectResponder = function (selected) {
      $scope.selectedResponder = selected.originalObject;
    }

    $scope.investorFinal = function () {
      $scope.investorFinalDetail = $scope.selectedInvestor;
      $scope.meeting.investmentFirm = $scope.investorFinalDetail.company_name;
      $scope.meeting.investorEmail = $scope.investorFinalDetail.email;
      $scope.meeting.investorName = $scope.investorFinalDetail.firstname + $scope.investorFinalDetail.lastname;
      $scope.meeting.investorPhone = $scope.investorFinalDetail.contact;
      $scope.meeting.investorTitle = $scope.investorFinalDetail.title;
      $scope.pickInvestorModel = '';
    }


    /*var getInvestor = 'apiv4/public/user/getUser';
    var investorParams = {
        type : 'investor'
    };
    RequestDetail.getDetail(getInvestor,investorParams).then(function(result){
        $scope.investors = result.data;
      });*/

    $scope.tags = {};
    $scope.tags.valMacroTags = '';
    $scope.tags.valMidTags = '';
    $scope.tags.valMicroTags = '';

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

    $scope.removeTag = function (item) {
      var index = $scope.industryTagsAdded.indexOf(item);
      $scope.industryTagsAdded.splice(index, 1);
    }


    // select date and time

    $scope.today = function () {
      $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
      $scope.dt = null;
    };

    $scope.inlineOptions = {
      customClass: getDayClass,
      minDate: new Date(),
      showWeeks: true
    };

    $scope.dateOptions = {
      // dateDisabled: disabled,
      formatYear: 'yy',
      maxDate: new Date(2022, 5, 22),
      minDate: new Date(),
      startingDay: 1,
      showButtonPanel: false
    };

    // Disable weekend selection
    function disabled(data) {
      var date = data.date,
        mode = data.mode;
      return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6); /* Disable weak days */
    }


    $scope.toggleMin = function () {
      $scope.inlineOptions.minDate = new Date();
      var myDate = new Date();
      //add a day to the date
      myDate.setDate(myDate.getDate() + 1);
      $scope.dateOptions.minDate = myDate;
    };



    $scope.toggleMin();

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

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date(tomorrow);
    afterTomorrow.setDate(tomorrow.getDate() + 1);
    $scope.events = [{
        date: tomorrow,
        status: 'full'
      },
      {
        date: afterTomorrow,
        status: 'partially'
      }
    ];

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

    // Models

    $scope.dateTime = [];
    $scope.respond = {};
    $scope.respond.date = '';
    $scope.respond.time = '';
    $scope.removeTag = function (parent, child) {

      var removeId = '';
      angular.forEach($scope.dateTime, function (todo, key) {
        if (todo.date == parent && todo.time == child) {
          removeId = key;
        }
      });
      $scope.dateTime.splice(removeId, 1);
    }
    $scope.fixDateTime = function () {
      var pushok = '0';
      if (!$scope.meeting.timezone || angular.isUndefined($scope.meeting.timezone) || $scope.meeting.timezone == '') {
        alertService.add("warning", "Kindly add first timezone field", 2000);
        return false;
      }
      if ($scope.respond.date == '' || $scope.respond.date == undefined || $scope.respond.time == '' | $scope.respond.time == undefined) {
        alertService.add("warning", "Please select your possible date and time!", 2000);
        //$scope.respond.time = '';
        return false;
      }
      angular.forEach($scope.dateTime, function (todo, key) {
        var date1 = $scope.respond.date;
        var date2 = todo.date;

        var date = new Date(date1);
        var day1 = date.getDate();
        var monthIndex1 = date.getMonth();
        var year1 = date.getFullYear();

        var date = new Date(date2);
        var day2 = date.getDate();
        var monthIndex2 = date.getMonth();
        var year2 = date.getFullYear();

        var dates1 = day1 + '-' + monthIndex1 + '-' + year1;
        var dates2 = day2 + '-' + monthIndex2 + '-' + year2;

        if (dates2 == dates1 && todo.time == $scope.respond.time) {
          alertService.add("warning", "Already this date is entered", 2000);
          pushok = '1';
        }
      });
      if (pushok == '0') {
        alertService.add("success", "Date added in the calendar!", 2000);
        var obj = {
          date: $scope.respond.date,
          time: $scope.respond.time
        }
        $scope.dateTime.push(obj);
        $scope.respond.time = '';
        $scope.respond.date = '';
      }

    }

    $scope.newGrouping = function (group_list, group_by, index) {
      if (index > 0) {
        prev = index - 1;
        if (group_list[prev][group_by] !== group_list[index][group_by]) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    };






    $scope.formcancel = function () {

      $scope.meeting = {};
      $scope.selectedResponder = {};
      $scope.dateTime = {};

    }
    $scope.selectedResponder = [];


    $scope.check_users_popup = function () {


      if (angular.isUndefined($scope.meeting.person_company_name) || $scope.meeting.person_company_name == '' || $scope.meeting.person_company_name == null) {
        $('#person_company_name').focus();
        alertService.add("warning", "Enter Company name!", 2000);
        return false;
      }
      if (angular.isUndefined($scope.meeting.person_name) || $scope.meeting.person_name == '' || $scope.meeting.person_name == null) {
        $('#person_name').focus();
        alertService.add("warning", "Enter User name!", 2000);

        return false;
      }
      if (angular.isUndefined($scope.meeting.person_title) || $scope.meeting.person_title == '' || $scope.meeting.person_title == null) {
        $('#person_title').focus();
        alertService.add("warning", "Enter User title!", 2000);
        return false;
      }

      if (angular.isUndefined($scope.meeting.userEmail) || $scope.meeting.userEmail == '' || $scope.meeting.userEmail == null) {
        $('#person_email').focus();

        alertService.add("warning", "Enter valid email id!", 2000);
        return false;
      }




      if (angular.isUndefined($scope.meeting.person_phone) || $scope.meeting.person_phone == '' || $scope.meeting.person_phone == null) {
        $('#person_phone').focus();
        alertService.add("warning", "Enter Investor phone!", 2000);
        return false;
      }
      $scope.meeting.company_name = $scope.meeting.person_company_name;
      $scope.meeting.email = $scope.meeting.userEmail;
      $('#user').addClass('hidden');
      $scope.showModal = !$scope.showModal;

    }

    $scope.add_unregistered = function () {

      $scope.meeting.email = '';
      $scope.meeting.company_name = '';
      $scope.meeting.person_company_name = '';
      $scope.meeting.person_name = '';
      $scope.meeting.person_title = '';
      $scope.meeting.investorEmail = '';
      $scope.meeting.person_phone = '';
      $scope.meeting.investorEmail = '';
      $scope.showModal = !$scope.showModal;
    }



    $scope.get_matched_contact_name = function () {



      var tagUrl = 'apiv4/public/meeting/get_matched_contact_name';
      var params = {
        contact_name: $('#contact_name').val(),
        user_id: $scope.meeting.user_id
      };
      RequestDetail.getDetail(tagUrl, params).then(function (result) {

        if (angular.isDefined(result.data) && result.data != '' && result.data != 0) {




          $("#contact_name").autocomplete({
            source: result.data,
            select: function (a, b) {
              $scope.selectedResponder.company_name = b.item.label;
              $scope.selectedResponder.company_name = b.item.value;
              $scope.selectedResponder.email = b.item.email;
              $scope.selectedResponder.user_id = b.item.user_id;
              $scope.selectedResponder.job_title = b.item.job_title;
              $scope.selectedResponder.phone = b.item.phone;
            }
          });

        }

      });

    }

    if (angular.isDefined($routeParams.userId) && $routeParams.userId != '') {

    } else {

      var tagUrl = 'apiv4/public/meeting/get_user_company_name';

      var params = {
        company_name: $('#company_name').val()
      };
      RequestDetail.getDetail(tagUrl, params).then(function (result) {

        $scope.selectedResponder.company_name = result.data.firstname + ' ' + result.data.lastname;
        $scope.meeting.investorLocation = result.data.c_location;
        $scope.selectedResponder.job_title = result.data.title;
        $scope.selectedResponder.email = result.data.email;
        $scope.selectedResponder.phone = result.data.contact;

        //temp make empty
        $scope.selectedResponder.company_name = '';
        $scope.selectedResponder.job_title = '';
        $scope.selectedResponder.email = '';
        $scope.selectedResponder.phone = '';
      });
    }


    $scope.get_matched_company_name = function () {

      var tagUrl = 'apiv4/public/meeting/get_matched_company_name';
      var params = {
        company_name: $('#company_name').val()
      };
      RequestDetail.getDetail(tagUrl, params).then(function (result) {

        if (angular.isDefined(result.data) && result.data != '' && result.data != 0) {
          if (result.data == 0) {
            $('#user').removeClass('hidden');
          } else {

            if (result.data.json1.length > 0) {
              // //console.log(result.data.json1);

              $("#company_name").autocomplete({
                source: result.data.json1,
                select: function (a, b) {
                  $scope.meeting.email = b.item.email;
                  $scope.meeting.user_id = b.item.user_id;
                  $scope.meeting.company_name = b.item.value;
                  $scope.meeting.person_company_name = '';
                  $scope.meeting.person_name = '';
                  $scope.meeting.person_title = '';
                  $scope.meeting.person_phone = '';
                  $('#user').addClass('hidden');
                  ////console.log(b.item.mails);
                  $("#respondEmail").autocomplete({
                    source: b.item.mails,
                    select: function (a, b) {
                      $scope.meeting.email = b.item.email;
                      $scope.meeting.user_id = b.item.user_id;
                      $scope.meeting.company_name = b.item.company_name;
                      $scope.meeting.person_company_name = '';
                      $scope.meeting.person_name = '';
                      $scope.meeting.person_title = '';
                      $scope.meeting.person_phone = '';
                    }
                  });


                }
              });
            }
            if (result.data.json2.length > 0) {
              $("#company_name").autocomplete({
                source: result.data.json2,
                select: function (a, b) {

                  $scope.meeting.person_company_name = b.item.value;
                  $scope.meeting.person_name = b.item.first_name + ' ' + b.item.last_name;
                  $scope.meeting.person_title = b.item.title;
                  $scope.meeting.userEmail = b.item.email;
                  $scope.meeting.person_phone = b.item.office_phone;

                  //after popup
                  $scope.meeting.company_name = b.item.company_name;
                  $scope.meeting.email = b.item.email;

                  $('#user').addClass('hidden');
                }
              });
            }
            if (result.data.json3.length > 0) {


              $("#company_name").autocomplete({
                source: result.data.json3,
                select: function (a, b) {

                  $scope.meeting.person_company_name = b.item.person_company_name;
                  $scope.meeting.person_name = b.item.person_name;
                  $scope.meeting.person_title = b.item.person_title;
                  $scope.meeting.userEmail = b.item.unregistered_mail_id;
                  $scope.meeting.person_phone = b.item.person_phone;

                  //after popup
                  $scope.meeting.company_name = b.item.person_company_name;
                  $scope.meeting.email = b.item.unregistered_mail_id;

                  $('#user').addClass('hidden');
                }
              });
            }
          }
        } else {
          $('#user').removeClass('hidden');
          if ($scope.meeting.person_company_name == '') {
            $scope.meeting.email = '';
            $('#user').removeClass('hidden');
          }

        }
      });

    }





    $scope.postMeeting = function () {

      $scope.usertype = localStorageService.get('usertype');

      if (angular.isUndefined($scope.meeting.email) || $scope.meeting.email == '') {
        alertService.add("warning", "Company Name Invalid !", 2000);
        return false;
      }

      if (angular.isUndefined($scope.meeting.requestType) || $scope.meeting.requestType == '') {
        alertService.add("warning", "Select Request type !", 2000);
        return false;
      }

      if (angular.isUndefined($scope.meeting.timezone) || $scope.meeting.timezone == '') {
        $scope.meeting.timezone = '-5';
      }

      if ($scope.meeting.requestType != 'Call') {
        if (angular.isUndefined($scope.meeting.investorLocation) || $scope.meeting.investorLocation == '') {
          alertService.add("warning", "Please enter location !", 2000);
          return false;

        }
      }

      if (angular.isUndefined($scope.dateTime) || $scope.dateTime == '') {
        alertService.add("warning", "Please select date and time !", 2000);
        return false;

      }



      if (angular.isUndefined($scope.selectedResponder.company_name) || $scope.selectedResponder.company_name == '')

      {
        alertService.add("warning", "Please enter contact name !", 2000);
        return false;

      }

      if (angular.isUndefined($scope.selectedResponder.email) || $scope.selectedResponder.email == '')

      {
        alertService.add("warning", "Please enter contact mail !", 2000);
        return false;

      }

      var postMeetingUrl = 'apiv4/public/meeting/postNewMeeting';

      if (angular.isDefined($scope.presentaion_file)) {
        $scope.selectedResponders = [];
        $scope.selectedResponders.push({
          'company_name': $scope.selectedResponder.company_name,
          'email': $scope.selectedResponder.email,
          'job_title': $scope.selectedResponder.job_title,
          'phone': $scope.selectedResponder.phone,
          'user_id': $scope.selectedResponder.user_id
        })
        var params = {
          meetingFields: $scope.meeting,
          contactRespond: $scope.selectedResponders,
          possibleDate: $scope.dateTime,
          presentaion_file: $scope.presentaion_file
        };

      } else {
        var params = {

          meetingFields: $scope.meeting,
          contactRespond: $scope.selectedResponders,
          possibleDate: $scope.dateTime

        };

      }


      $scope.spinnerActive = true;
      RequestDetail.getDetail(postMeetingUrl, params).then(function (result) {
        if (result.data == 'true') {
          alertService.add("success", "Meeting Sent Successfully !", 2000);
          $location.path('meetings');
        }
        $scope.spinnerActive = false;
        $location.path('meetings');
      });


    }




  })
  .controller('DemoFileUploadController', [
    '$scope', '$http', '$filter', '$window',
    function ($scope, $http) {
      $scope.options = {
        url: url
      };
      if (!isOnGitHub) {
        $scope.loadingFiles = true;
        $http.get(url)
          .then(
            function (response) {
              $scope.loadingFiles = false;
              $scope.queue = response.data.files || [];
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
  ]).controller('meetingDetail', function ($scope, $routeParams, $http, $location, localStorageService, RequestDetail, alertService, $timeout, configdetails) {
    $scope.configdetails = configdetails;

    $scope.pageHeading = 'Meetings';
    $scope.dasboardActive = 'active';

    $scope.showModalpageinfo = false;

    $scope.openmodelpagehelp = function () {
      $scope.showModalpageinfo = !$scope.showModalpageinfo;
    }

    $scope.popupMsg = '';
    $scope.popupMsgTitle = '';
    $scope.meetingDetail = {};
    localStorageService.set('url', '');
    var urlParameter = $routeParams.meetingid;
    urlParameter = urlParameter.substring(16, urlParameter.length - 1);
    urlParameter = urlParameter.substring(0, urlParameter.length - 15);
    var meeting_id = urlParameter;

    var getMeetingDetail = 'apiv4/public/meeting/getMeetingById';
    var params = {
      type: 'get',
      meeting_id: meeting_id
    };

    RequestDetail.getDetail(getMeetingDetail, params).then(function (result) {

      $scope.meetingDetail = result.data;

     
      $scope.meetingDetail.availableDatetime = angular.fromJson(result.data.available_datetime);
      angular.forEach($scope.meetingDetail.availableDatetime, function (value, key) {
        value.dateActive = false;
      });
      $scope.meetingDetail.to_contact = angular.fromJson(result.data.to_contact);

    });

    var user_data = localStorageService.get('userdata');
    $scope.user_id = user_data.user_id;

    $scope.search_user = function (data) {
      var user_id = data.user_id;

      if (data.user_type == 1) {
        var type = 'investoruser';
      } else if (data.user_type == 2) {
        var type = 'corporateuser';
      } else if (data.user_type == 3) {
        var type = 'brokeruser';
      }

      $location.path('/' + type + '/' + user_id);

    };

    $scope.back_dashboard = function () {
      $location.path('dashboard');
    };


    $scope.acceptMeeting = function () {
      $scope.popupMsg = "ACCEPT";
      $scope.popupMsgClass = "green";
      $scope.popupMsgTitle = "Accept Meeting";
      $scope.showModal = !$scope.showModal;
    }

    $scope.declineMeeting = function () {
      $scope.popupMsg = "DECLINE";
      $scope.popupMsgClass = "red";
      $scope.popupMsgTitle = "Decline Meeting";
      $scope.showdeclineModal = !$scope.showdeclineModal;
    }

    $scope.cancelMeeting = function () {
      $scope.showModal = '';
    }




    $scope.decline_meeting = function () {

      $scope.spinnerActive = true;

      var updateMeeting_url = 'apiv4/public/meeting/responseMeeting';

      if (Object.keys($scope.fixedNewDate).length == 0) {
        var params = {
          type: 'declined',
          meetingId: meeting_id
        }
      }

      RequestDetail.getDetail(updateMeeting_url, params).then(function (result) {



        if (angular.isDefined(result.data)) {
          $scope.spinnerActive = false;
          alertService.add('success', 'The request has been declined successfully ! ', 2000);
          $scope.showdeclineModal = !$scope.showdeclineModal;
          $timeout(function () {
            $location.path('dashboard');
          }, 1000);
        }
      });

      $scope.showModal = '';
    }



    $scope.closedeclineModal = function () {
      $scope.showdeclineModal = '';
    }

    $scope.fixMeeting = function () {
      var updateMeeting_url = 'apiv4/public/meeting/responseMeeting';


      if (Object.keys($scope.fixedNewDate).length == 0) {
        var params = {
          type: 'accepted',
          selectedDate: $scope.selectedOldDate,
          meetingId: meeting_id
        }
      }
      if (Object.keys($scope.fixedNewDate).length > 0) {
        var params = {
          type: 'proposed',
          proposedDate: $scope.fixedNewDate,
          meetingId: meeting_id
        };
      }

      if (Object.keys($scope.fixedNewDate).length == 0 && $scope.selectedOldDate == '') {
        alertService.add('warning', 'Please select atleast one from given date or propose new date ! ', 2000);
        return false;
      }


      RequestDetail.getDetail(updateMeeting_url, params).then(function (result) {
        if (result.data == 'true' || result.data == '1') {
          alertService.add('success', 'The request has been updated successfully ! ', 2000);
          $scope.showModal = '';
          $timeout(function () {
            $location.path('dashboard');
          }, 1000);
        }
      });

      $scope.showModal = '';
    }
    $scope.selectedOldDate = '';
    $scope.selectTiming = function (dateTime) {
      var index = $scope.meetingDetail.availableDatetime.indexOf(dateTime);
      if (index >= 0) {
        angular.forEach($scope.meetingDetail.availableDatetime, function (value, key) {
          value.dateActive = false;
          if (key == index) {
            value.dateActive = true;
            $scope.selectedOldDate = value;
          }
        });
      }
    }

    $scope.newDatetimePopup = function () {
      $scope.proposeDatetime = !$scope.proposeDatetime;
    }

    $scope.saveNewDate = function () {


      if ($scope.dateTime.length != 0) {


        $scope.fixedNewDate = $scope.dateTime;
        $scope.proposeDatetime = '';



        angular.forEach($scope.meetingDetail.availableDatetime, function (value, key) {
          value.dateActive = false;
        });


        var getMeetingDetail = 'apiv4/public/meeting/updatemeetingavailabletime';
        //var params = {type : 'get',fixedNewDate : $scope.fixedNewDate,meetingId:$scope.meetingDetail.meeting_id};
        var sesuserid = localStorageService.get('userdata').userId;
        if ($scope.meetingDetail.created_by == sesuserid) {
          var params = {
            type: 'get',
            fixedNewDate: $scope.fixedNewDate,
            created_by: $scope.meetingDetail.created_by,
            created_to: $scope.meetingDetail.created_to,
            // fixedNewDate : $scope.fixedNewDate,
            meetingId: $scope.meetingDetail.meeting_id
          };
        } else {
          var params = {
            type: 'get',
            fixedNewDate: $scope.fixedNewDate,
            //fixedNewDate : $scope.fixedNewDate,
            created_by: $scope.meetingDetail.created_to,
            created_to: $scope.meetingDetail.created_by,
            meetingId: $scope.meetingDetail.meeting_id
          };
        }
        RequestDetail.getDetail(getMeetingDetail, params).then(function (result) {
          $location.path('/meetings');
        });
      } else {
        alertService.add("warning", "Please add time slot!", 2000);
        return false;
      }

    }

    $scope.clearNewDate = function () {
      $scope.fixedNewDate = {};
      $scope.dateTime = [];
    }

    // select date and time

    $scope.today = function () {
      $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
      $scope.dt = null;
    };

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
      startingDay: 1
    };

    // Disable weekend selection
    function disabled(data) {
      var date = data.date,
        mode = data.mode;
      return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6); /* Disable weak days */
    }

    $scope.toggleMin = function () {
      $scope.inlineOptions.minDate = new Date();
      var myDate = new Date();
      //add a day to the date
      myDate.setDate(myDate.getDate() + 1);
      $scope.dateOptions.minDate = myDate;
    };

    $scope.toggleMin();

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

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date(tomorrow);
    afterTomorrow.setDate(tomorrow.getDate() + 1);
    $scope.events = [{
        date: tomorrow,
        status: 'full'
      },
      {
        date: afterTomorrow,
        status: 'partially'
      }
    ];

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

    // Date time modals
    $scope.respond = {};
    $scope.fixedNewDate = {};
    $scope.dateTime = [];

    $scope.respond.date = '';
    $scope.respond.time = '';


    $scope.fixDateTime = function () {

      if ($scope.respond.date == '') {
        alertService.add("warning", "Please select your possible date!", 2000);
        $scope.respond.time = '';
        return false;
      }
      if ($scope.respond.time == '') {
        alertService.add("warning", "Please select your possible time!", 2000);
        return false;
      }

      alertService.add("success", "Date added in the calendar!", 2000);
      var obj = {
        date: $scope.respond.date,
        time: $scope.respond.time
      }

      $scope.dateTime.push(obj);
      $scope.respond.date = '';
      $scope.respond.time = '';

    }
    $scope.removetime = function (key) {
      $scope.dateTime.splice(key, 1);
    }


    $scope.newGrouping = function (group_list, group_by, index) {
      if (index > 0) {
        prev = index - 1;
        if (group_list[prev][group_by] !== group_list[index][group_by]) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    };


  })
  .controller('meetingResponse', function ($scope, $routeParams, $http, $location, RequestDetail, alertService, configdetails) {
    $scope.configdetails = configdetails;
    $scope.pageHeading = 'Meetings';
    $scope.dasboardActive = 'active';

    $scope.popupMsg = '';
    $scope.popupMsgTitle = '';
    $scope.meetingDetail = {};

    var urlParameter = $routeParams.meetingid;
    var meeting_id = urlParameter.charAt(35);


    var getMeetingDetail = 'apiv4/public/meeting/getMeetingById';
    var params = {
      type: 'get',
      meeting_id: meeting_id
    };

    RequestDetail.getDetail(getMeetingDetail, params).then(function (result) {
      $scope.meetingDetail = result.data;
    });



    $scope.search_user = function (data) {
      var user_id = data.user_id;

      if (data.user_type == 1) {
        var type = 'investor';
      } else if (data.user_type == 2) {
        var type = 'corporate';
      } else if (data.user_type == 3) {
        var type = 'broker';
      }

      $location.path('/' + type + '/' + user_id);

    };

    $scope.back_dashboard = function () {
      $location.path('dashboard');
    };

    $scope.acceptMeeting = function () {
      $scope.popupMsg = "ACCEPT";
      $scope.popupMsgClass = "green";
      $scope.popupMsgTitle = "Accept Meeting";
      $scope.showModal = !$scope.showModal;
    }

    $scope.declineMeeting = function () {
      $scope.popupMsg = "DECLINE";
      $scope.popupMsgClass = "red";
      $scope.popupMsgTitle = "Decline Meeting";
      $scope.showdeclineModal = !$scope.showdeclineModal;
    }

    // $scope.cancelMeeting = function(){
    //   $scope.showModal = '';
    // }

    $scope.fixMeeting = function () {
      $scope.showModal = '';
      $location.path('acceptMeeting/' + $routeParams.meetingid);
    }

  })
  .controller('meetingProposed', function (localStorageService, $scope, $routeParams, $http, $location, RequestDetail, alertService, $timeout, configdetails) {
    $scope.configdetails = configdetails;
    $scope.pageHeading = 'Meetings';
    $scope.dasboardActive = 'active';

    $scope.popupMsg = '';
    $scope.popupMsgTitle = '';
    $scope.meetingDetail = {};
    $scope.meetingDetail.fixedDatetime = {};

    var urlParameter = $routeParams.meetingid;
    urlParameter = urlParameter.substring(16, urlParameter.length - 1);
    urlParameter = urlParameter.substring(0, urlParameter.length - 15);
    var meeting_id = urlParameter;

    var user_data = localStorageService.get('userdata');
    $scope.user_id = user_data.user_id;

    var getMeetingDetail = 'apiv4/public/meeting/getMeetingById';
    var params = {
      type: 'get',
      meeting_id: meeting_id
    };

    RequestDetail.getDetail(getMeetingDetail, params).then(function (result) {
      $scope.meetingDetail = result.data;
      $scope.meetingDetail.oldDatetime = angular.fromJson(result.data.available_datetime);
      $scope.meetingDetail.fixedDatetime = angular.fromJson(result.data.fixed_datetime);

      $scope.meetingDetail.availableDatetime = angular.fromJson(result.data.proposed_datetime);
      angular.forEach($scope.meetingDetail.availableDatetime, function (value, key) {
        value.dateActive = false;
      });
      $scope.meetingDetail.to_contact = angular.fromJson(result.data.to_contact);
    });






    $scope.search_user = function (data) {
      var user_id = data.user_id;

      if (data.user_type == 1) {
        var type = 'investor';
      } else if (data.user_type == 2) {
        var type = 'corporate';
      } else if (data.user_type == 3) {
        var type = 'broker';
      }

      $location.path('/' + type + '/' + user_id);

    };

    $scope.back_dashboard = function () {
      $location.path('dashboard');
    };

    $scope.reschedule = function (meeting_id) {
      var getMeetingDetail = 'apiv4/public/meeting/reschedule';
      var params = {
        meeting_id: meeting_id
      };
      var enctype = 'e6ec529ba185279a' + meeting_id + 'a0adcf93e645c7cd';

      RequestDetail.getDetail(getMeetingDetail, params).then(function (result) {
        if (result.data == 'true') {
          alertService.add('success', 'The request has been updated successfully ! ', 2000);
          $location.path('meeting/' + enctype);
        }
      });
    }

    $scope.acceptMeeting = function () {
      $scope.popupMsg = "ACCEPT";
      $scope.popupMsgClass = "green";
      $scope.popupMsgTitle = "Accept Meeting";
      $scope.showModal = !$scope.showModal;
    }

    $scope.declineMeeting = function () {

      $scope.popupMsg = "DECLINE";
      $scope.popupMsgClass = "red";
      $scope.popupMsgTitle = "Decline Meeting";
      $scope.showdeclineModal = !$scope.showdeclineModal;
    }



    $scope.cancelMeeting = function () {

      $scope.popupMsg = "CANCEL";
      $scope.popupMsgClass = "red";
      $scope.popupMsgTitle = "Cancel Meeting";
      $scope.cancelModal = !$scope.cancelModal;
    }


    // Cancel meeting 

    $scope.cancel_meeting = function () {



      $scope.spinnerActive = true;
      var updateMeeting_url = 'apiv4/public/meeting/cancel_meeting';

      var params = {
        meetingId: meeting_id
      }


      RequestDetail.getDetail(updateMeeting_url, params).then(function (result) {

        if (angular.isDefined(result.data)) {
          $scope.spinnerActive = false;
          alertService.add('success', 'The Meeting has been cancelled successfully ! ', 2000);
          $scope.cancelModal = false;
          $timeout(function () {
            $location.path('dashboard');
          }, 1000);
        }
      });

    }








    $scope.decline_meeting = function () {


      $scope.spinnerActive = true;
      var updateMeeting_url = 'apiv4/public/meeting/responseMeeting';

      var params = {
        type: 'declined',
        meetingId: meeting_id
      }


      RequestDetail.getDetail(updateMeeting_url, params).then(function (result) {

        if (angular.isDefined(result.data)) {
          $scope.spinnerActive = false;
          alertService.add('success', 'The request has been declined successfully ! ', 2000);
          $scope.showdeclineModal = !$scope.showdeclineModal;
          $timeout(function () {
            $location.path('dashboard');
          }, 1000);
        }
      });

      $scope.showModal = '';
    }



    $scope.closecancelModal = function () {
      $scope.cancelModal = '';
    }

    $scope.closedeclineModal = function () {
      $scope.showdeclineModal = '';
    }



    $scope.fixMeeting = function () {
      var updateMeeting_url = 'apiv4/public/meeting/responseMeeting';


      if (Object.keys($scope.fixedNewDate).length == 0) {
        var params = {
          type: 'accepted',
          selectedDate: $scope.selectedOldDate,
          meetingId: meeting_id
        }
      }
      if (Object.keys($scope.fixedNewDate).length > 0) {
        var params = {
          type: 'proposed',
          proposedDate: $scope.fixedNewDate,
          meetingId: meeting_id
        };
      }

      if (Object.keys($scope.fixedNewDate).length == 0 && $scope.selectedOldDate == '') {
        alertService.add('warning', 'Please select atleast one from given date or propose new date ! ', 2000);
        return false;
      }

      RequestDetail.getDetail(updateMeeting_url, params).then(function (result) {
        if (result.data == 'true' || result.data == '1') {
          alertService.add('success', 'The request has been updated successfully ! ', 2000);
          $scope.showModal = '';
          $timeout(function () {
            $location.path('dashboard');
          }, 1000);
        }
      });

      $scope.showModal = '';
    }
    $scope.selectedOldDate = '';
    $scope.selectTiming = function (dateTime) {
      var index = $scope.meetingDetail.availableDatetime.indexOf(dateTime);
      if (index >= 0) {
        angular.forEach($scope.meetingDetail.availableDatetime, function (value, key) {
          value.dateActive = false;
          if (key == index) {
            value.dateActive = true;
            $scope.selectedOldDate = value;
          }
        });
      }

    }

    $scope.newDatetimePopup = function () {
      $scope.proposeDatetime = !$scope.proposeDatetime;
    }

    $scope.saveNewDate = function () {
      $scope.fixedNewDate = $scope.dateTime;
      $scope.proposeDatetime = '';
      angular.forEach($scope.meetingDetail.availableDatetime, function (value, key) {
        value.dateActive = false;
      });

      var getMeetingDetail = 'apiv4/public/meeting/updatemeetingavailabletime';
      var params = {
        type: 'get',
        fixedNewDate: $scope.fixedNewDate,
        created_by: $scope.meetingDetail.created_to,
        created_to: $scope.meetingDetail.created_by,
        //fixedNewDate : $scope.fixedNewDate,
        meetingId: $scope.meetingDetail.meeting_id
      };
      RequestDetail.getDetail(getMeetingDetail, params).then(function (result) {
        $location.path('/dashboard');
      });


    }

    $scope.clearNewDate = function () {
      $scope.fixedNewDate = {};
      $scope.dateTime = [];
    }

    // select date and time

    $scope.today = function () {
      $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
      $scope.dt = null;
    };

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
      startingDay: 1
    };

    // Disable weekend selection
    function disabled(data) {
      var date = data.date,
        mode = data.mode;
      return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6); /* Disable weak days */
    }

    $scope.toggleMin = function () {
      $scope.inlineOptions.minDate = new Date();
      var myDate = new Date();
      //add a day to the date
      myDate.setDate(myDate.getDate() + 1);
      $scope.dateOptions.minDate = myDate;
    };

    $scope.toggleMin();

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

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date(tomorrow);
    afterTomorrow.setDate(tomorrow.getDate() + 1);
    $scope.events = [{
        date: tomorrow,
        status: 'full'
      },
      {
        date: afterTomorrow,
        status: 'partially'
      }
    ];

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

    // Date time modals
    $scope.respond = {};
    $scope.fixedNewDate = {};
    $scope.dateTime = [];

    $scope.respond.date = '';
    $scope.respond.time = '';


    $scope.fixDateTime = function () {
      if ($scope.respond.date == '') {
        alertService.add("warning", "Please select your possible date!", 2000);
        $scope.respond.time = '';
        return false;
      }

      alertService.add("success", "Date added in the calendar!", 2000);
      var obj = {
        date: $scope.respond.date,
        time: $scope.respond.time
      }

      $scope.dateTime.push(obj);
      $scope.respond.time = '';
      $scope.respond.date = '';

    }

    $scope.newGrouping = function (group_list, group_by, index) {
      if (index > 0) {
        prev = index - 1;
        if (group_list[prev][group_by] !== group_list[index][group_by]) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    };


  })
  .controller('research_commentsCtrl', function ($scope, $http, $location, RequestDetail, alertService, localStorageService, $routeParams, configdetails, $sce) {


    $scope.activetab = 0;

    $scope.changeactive = function (index) {
      $scope.activetab = index;
    };

    $scope.dailyhtml = "";

    $scope.trustAsHtml = function (html) {
      return $sce.trustAsHtml(html);
    }

    $scope.spinnerActive = true;
    $scope.seledailyname = $routeParams.dailyname;


    if (!angular.isUndefined($scope.seledailyname)) {
      if ($scope.seledailyname == 'macro') {
        $scope.activetab = 1;
      }
      if ($scope.seledailyname == 'technical') {
        $scope.activetab = 2;
      }
      if ($scope.seledailyname == 'outlier') {
        $scope.activetab = 3;
      }
      if ($scope.seledailyname == 'thematic') {
        $scope.activetab = 4;
      }
      if ($scope.seledailyname == 'revision') {
        $scope.activetab = 5;
      }
    }


    $scope.showModalpageinfo = false;

    $scope.openmodelpagehelp = function () {
      $scope.showModalpageinfo = !$scope.showModalpageinfo;
    }

    //Enlarge Daily Image
    $scope.showModalImage = false;

    $scope.openmodelImage = function (daily_img_url) {
      $scope.modalImage_url = daily_img_url;
      $scope.showModalImage = true;
    };

    $scope.closemodelImage = function () {
      $scope.showModalImage = false;
    };

    $scope.sidepopupactive = false;

    $scope.sidepopup = function () {
      $scope.sidepopupactive = !$scope.sidepopupactive;
    }

    var user = localStorageService.get('usertype');

    $scope.user_type = user;

    if (user == 'broker') {
      if ($scope.activetab == 0) {
        $scope.activetab = 1;
      }
    }


    $scope.pagetitle = 'Daily Research and Dashboards';
    $scope.breadcrumb = 'Prepare';

    if (user == 'investor') {
      $scope.pagetitle = 'New Ideas';
      $scope.breadcrumb = 'New Ideas';
    } else if (user == 'corporate') {
      $scope.pagetitle = 'Daily Research and Dashboards';
      $scope.breadcrumb = 'Prepare';
    }

    $scope.rpusername = "";
    $scope.rpsearchcompany_name = "";
    $scope.keyword = "";
    $scope.ideas = [];
    $scope.keywords_array = [];
    $scope.ideas_popular_keywords = [];
    $scope.page = 1;
    $scope.start = 1;
    var count;
    $scope.getallideas = function (page) {
      
      var getdailyDetail = 'apiv4/public/researchprovider/getallideas';
      var params = {
        rpusername: $scope.rpusername,
        company_name: $scope.rpsearchcompany_name,
        keyword: $scope.rpkeyword,
        page: page
      };
      RequestDetail.getDetail(getdailyDetail, params).then(function (result) {
        if(page==1){
          $scope.keywords_array = [];
          $scope.ideas_popular_keywords = [];
          $scope.ideas = [];
        }
       

        angular.forEach(result.data.ideas, function (data) {
          $scope.ideas.push(data);
        });

        angular.forEach(result.data.keywords_array, function (data) {
          $scope.keywords_array.push(data);
        });

        angular.forEach(result.data.ideas_popular_keywords, function (data) {
          $scope.ideas_popular_keywords.push(data);
        });

        $scope.page = result.data.page;
        if ($scope.start == 1) {
          $scope.start = 0;
          for (count = 2; count <= $scope.page; count++) {
            $scope.getallideas(count);
          }
        }


      });
    }

    $scope.getallideas($scope.page);

    $scope.getallclearideas = function () {
      $scope.rpusername = "";
      $scope.rpsearchcompany_name = "";
      $scope.keyword = "";
      $scope.rpkeyword = "";
      $scope.getallideas(1);
    }

    $scope.themetuesdaycontentactive = 'first';
    $scope.outlier_wednesdaycontentactive = 'first';
    $scope.fundamentalfridaycontentactive = 'first';

    if ($scope.seledailyname != '') {
      var getdailyDetail = 'apiv4/public/dashboard/getdaily';
      var params = {
        selected_day: $scope.seledailyname
      };
      RequestDetail.getDetail(getdailyDetail, params).then(function (result) {
        $scope.data = result.data;
        $scope.spinnerActive = false;
      });
    }

    $scope.htmlview = "";


    $scope.showdaily = function (index) {
      $scope.spinnerActive = true;
      var getdailyDetail = 'apiv4/public/dashboard/getdailydetail';
      var params = {
        data: index
      };
      RequestDetail.getDetail(getdailyDetail, params).then(function (result) {
        if (index.type == 'Macro Monday') {
          $scope.data.macromonday = result.data;
        }
        if (index.type == 'Theme Tuesday') {
          $scope.data.themetuesday = result.data;
        }
        if (index.type == 'Outlier Wednesday') {
          $scope.data.outlier_wednesday = result.data;
        }
        if (index.type == 'Revision Thursday') {
          $scope.data.revisionthursday = result.data;
        }
        if (index.type == 'Fundamental Friday') {
          $scope.data.fundamentalfriday = result.data;
        }
        $scope.spinnerActive = false;

        $scope.themetuesdaycontentactive = 'first';
        $scope.outlier_wednesdaycontentactive = 'first';
        $scope.fundamentalfridaycontentactive = 'first';

      });



    };

    $scope.showcategry = function (day, index) {
      if (day == 'themetuesday') {
        $scope.themetuesdaycontentactive = index;
      }
      if (day == 'outlier_wednesday') {
        $scope.outlier_wednesdaycontentactive = index;
      }
      if (day == 'fundamentalfriday') {
        $scope.fundamentalfridaycontentactive = index;
      }
    }



  })
  .controller('rpideasview', function ($scope, $http, $location, RequestDetail, alertService, localStorageService, $routeParams, configdetails, $route, $timeout) {
    $scope.activetab = 0;
    $scope.spinnerActive = true;

    $scope.changeactive = function (index) {
      $scope.activetab = index;
    };

    $scope.sidepopup = false;

    $scope.sidepopup = function () {
      $scope.sidepopup = !$scope.sidepopup;
    }

    $scope.showModaltrialPopup = false;
    $scope.requesttrialPopup = function () {
      $scope.showModaltrialPopup = !$scope.showModaltrialPopup;
    }

    $scope.showlistmodel = false;
    $scope.viewdlistmodel = function () {
      $scope.showlistmodel = !$scope.showlistmodel;
    }

    $scope.showloginattr = 1;

    if (localStorageService.get('userdata') != null) {
      var user_data = localStorageService.get('userdata');
      $scope.user_type = user_data.user_type;
    } else {
      $scope.user_type = "corporate";
      $scope.showloginattr = 0;
      $scope.sidemenu = false;
    }


    $scope.ideaadminstatus = 0;

    $scope.getideadetail = function () {
      $scope.ideasid = $routeParams.ideasid;

      var getdailyDetail = 'apiv4/public/researchprovider/getideadetail';
      var params = {
        ideasid: $scope.ideasid
      };
      RequestDetail.getDetail(getdailyDetail, params).then(function (result) {
        $scope.ideadetail = result.data;
        //$scope.ideaadminstatus = result.data.idea.idea_adminuser;
        $scope.spinnerActive = false;
      });
    }
    $scope.getideadetail();


    if (localStorageService.get('userdata') != null) {
      $scope.email_urds = localStorageService.get('userdata').email;
    } else {
      $scope.email_urds = "";
    }


    $scope.showModaltrial = false;

    $scope.requesttrial = function () {
      var getdailyDetail = 'apiv4/public/researchprovider/requestidea';
      var params = {
        ideasid: $scope.ideasid
      };
      $scope.showModaltrialPopup = false;
      RequestDetail.getDetail(getdailyDetail, params).then(function (result) {
        alertService.add("success", "Thank you! Idea free trial requested successfully!", 3000);
        //$scope.showModaltrial=true;
        $route.reload();
          /*$timeout(function() {
          $scope.showModaltrial=false;
          
          $timeout(function() {
              $route.reload();
          }, 1000);
          }, 5000);
        */
      });
    }


    $scope.idealike = function () {
      var getdailyDetail = 'apiv4/public/researchprovider/idea_like';
      var params = {
        ideasid: $scope.ideasid
      };
      RequestDetail.getDetail(getdailyDetail, params).then(function (result) {
        $scope.getideadetail();
      });

    }


  })
  .controller('meetinglist', function ($scope, $http, $location, RequestDetail, alertService, localStorageService, $routeParams, configdetails, $route, $timeout) {


    var user_data = localStorageService.get('userdata');
    $scope.user_id = user_data.user_id;

    $scope.showModalpageinfo = false;

    $scope.openmodelpagehelp = function () {
      $scope.showModalpageinfo = !$scope.showModalpageinfo;
    }

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

          /* if(angular.isDefined(result.data.activity) && result.data.activity.length>0)
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

        ////console.log($scope.invitations.meetingList);
      });
    }

    getInvitations();

    $scope.dismiss_meeting = function (meeting_id) {
      $('.act_' + meeting_id).addClass('hidden');

      var url = 'apiv4/public/dashboard/dismiss_meeting';
      var params = {
        meeting_id: meeting_id
      };
      RequestDetail.getDetail(url, params).then(function (result) {
        alertService.add("success", 'Meeting Dismissed Successfully !', 2000);
      });
    }


    $scope.reschedule = function (index, type) {

      var user_data = localStorageService.get('userdata');
      $scope.user_id = user_data.user_id;
      $rootScope.viewMeeting = $scope.invitations.meetingList[index];
      var enctype = 'e6ec529ba185279a' + index + 'a0adcf93e645c7cd';

      var url = 'apiv4/public/meeting/reschedule';
      var params = {
        meeting_id: index
      };
      RequestDetail.getDetail(url, params).then(function (result) {
        if ($scope.user_id == type) {
          $location.path('meetingProposed/' + enctype);
        } else {
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
            var params = {
              meeting_id: meeting_id
            };
            RequestDetail.getDetail(url, params).then(function (result) {

            });
          }
        }
      }
      $location.path('meeting/' + enctype);
    }

    // Getting Followups
    $scope.followUps = {};

    var getFollowupUrl = 'apiv4/public/meeting/getFollowup';
    var getFollowupParams = {
      type: 'get'
    };

    RequestDetail.getDetail(getFollowupUrl, getFollowupParams).then(function (result) {
      if (result.data != 'false') {
        $scope.followUps = result.data;
      } else {
        $scope.followUps = '';
      }
    });

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




    // Get Own Requests
    $scope.ownRequest = {};
    getOwnRequest();

    function getOwnRequest() {
      var getOwnReqUrl = 'apiv4/public/meeting/getOwnRequest';
      var params = {
        type: 'get'
      };
      RequestDetail.getDetail(getOwnReqUrl, params).then(function (result) {
        $scope.ownRequest = result.data;
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

    ////console.log($scope.invitations);
  }).controller('meetingArchiveCtrl', function ($scope, $http, $location, RequestDetail, localStorageService, alertService, configdetails, $timeout, $routeParams, $route) {
		$scope.configdetails = configdetails;
		$scope.pageHeading = 'Meeting Archive';
		$scope.MeetingArchiveActive = 'active';


		$scope.meetings = {};
		$scope.events = {};
		$scope.events.my_events = [];

		$scope.ratingModal = false;
		$scope.feedbackModal = false;
		$scope.followupModal = false;
		$scope.noteModal = false;


		$scope.feedback = {};
		$scope.note = {};
		$scope.followup = {};



		$scope.date = new Date();

		$scope.update = true;
		$scope.searchbox = "";
		$scope.showMeetingarchive = true;

		$scope.listmeetings = [];

		$scope.meetinghistory = "";
		$scope.meetingSelected = -1;
		$scope.meetingDetailview = {};

		$scope.investor = {};

		//popup 
		$scope.notemodalclose = function () {
			$scope.noteModal = !$scope.noteModal;
		}
		$scope.followupmodalclose = function () {
			$scope.followupModal = !$scope.followupModal;
		}
		$scope.feedbackmodalclose = function () {
			$scope.feedbackModal = !$scope.feedbackModal;
		}



		$scope.showModalpageinfo = false;

		$scope.openmodelpagehelp = function () {
			$scope.showModalpageinfo = !$scope.showModalpageinfo;
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

	   $scope.noteModal = false;
	   $scope.addnotes = function (invs) {
		$scope.investor.email = invs.investor_email;
		$scope.noteModal = true;
	   }

		$scope.investor.distributesAdded = [];
		$scope.investor.newdistributelists = [];
		$scope.investor.tickerssAdded = [];

		$scope.adddistributelist = function () {
            if($scope.investor.distributelist && $scope.investor.distributelist!='0'){
                var selecteddistribute = $scope.investor.distributelist.split('|@|');
                
                var distribute = { 
                    list_name: selecteddistribute[0], 
                    list_id: selecteddistribute[1]
                };

                $scope.addstatus = 1;
                angular.forEach($scope.investor.distributesAdded, function (data,key) {
                    if(data.list_id==selecteddistribute[1]){
                        $scope.addstatus = 0;
                   }
                });

                if($scope.addstatus){
                    $scope.investor.distributesAdded.push(distribute);
                    ////console.log($scope.investor.distributesAdded);
                }
               
            }
            if($scope.investor.distributelist=='0'){
                var distribute = { 
                    list_name: '', 
                    list_id: 0
                };
                $scope.investor.newdistributelists.push(distribute);
            }
        }
		$scope.removenewdistributeTagging = function (index) {
            $scope.investor.newdistributelists.splice(index, 1);
        }

		$scope.addInvestornotes = function () {

           
            var error_flag = 0;
            
            
             if(!$scope.investor.email || $scope.investor.email  == ''){
                 alertService.add("warning", "Please select email !",2000);
                 error_flag++;
                 return false;
             }
            else {
                if (error_flag == 0) {
                    var Url = 'apiv4/public/investornotes/add_investornotes';
                    var params = { data: $scope.investor, tickers: $scope.investor.tickerssAdded, id: $scope.investor.investornoteId };

                    RequestDetail.getDetail(Url, params).then(function (result) {
                        if (result) {
                            alertService.add("success", "Added successfully!", 2000);
							$scope.noteModal = false;
							$location.path('investornotes/'+result.data.investor_contacts_id);
                        }
                    });
                }
            }
        }


		$scope.get_meetings_archive = function () {
			$scope.spinnerActive = true;
			$scope.meetingSelected = -1;
			$scope.meetingDetailview = {};
			$scope.events.my_events = [];
			$scope.meetings.userdata = localStorageService.get('userdata');
			var url = 'apiv4/public/meeting/meetings_archive';
			var params = {
				data: 'meeting_archive'
			};
			if (angular.isDefined($scope.searchbox) && $scope.searchbox != '') {
				params.searchStr = angular.copy($scope.searchbox);
			}
			RequestDetail.getDetail(url, params).then(function (result) {

				var myevent = [];

				if (angular.isDefined(result.data)) {
					if (angular.isDefined(result.data.my_events) && result.data.my_events.length > 0) {
						myevent = result.data.my_events;
					}
					if (angular.isDefined(result.data.meeting) && result.data.meeting.length > 0) {
						if (myevent.length > 0) {
							angular.forEach(result.data.meeting, function (data, index) {
								myevent.push(data);
							});
						} else {
							myevent = result.data.meeting;
						}
					}
				}

				if (angular.isDefined(result.data.feedback) && result.data.feedback.length > 0 && angular.isDefined(myevent) && myevent.length > 0) {
					angular.forEach(result.data.feedback, function (data, index) {
						angular.forEach(myevent, function (mdata, mindex) {
							if (angular.isDefined(mdata.meeting_id) && data.slot_id == mdata.meeting_id && data.event_id == mdata.meeting_id && data.event_type == 'meeting') {
								if (angular.isUndefined(mdata.feedback)) {
									mdata.feedback = [];
								}
								if ($scope.meetings.userdata.user_id == data.user_id) {
									mdata.feedview = 1;
								}
								mdata.feedback.push(angular.copy(data));
							} else if (angular.isDefined(mdata.event_id) && data.slot_id == mdata.slot_id && data.event_id == mdata.event_id && data.event_type == mdata.event_type && angular.isUndefined(mdata.event_from)) {
								if (angular.isUndefined(mdata.feedback)) {
									mdata.feedback = [];
								}
								if ($scope.meetings.userdata.user_id == data.user_id) {
									mdata.feedview = 1;
								}
								mdata.feedback.push(angular.copy(data));
							}

						});
					});
				}

				if (angular.isDefined(result.data.rating) && result.data.rating.length > 0 && angular.isDefined(myevent) && myevent.length > 0) {
					angular.forEach(result.data.rating, function (data, index) {
						angular.forEach(myevent, function (mdata, mindex) {
							if (angular.isDefined(mdata.meeting_id) && data.slot_id == mdata.meeting_id && data.event_id == mdata.meeting_id && data.event_type == 'meeting') {
								mdata.rating = angular.copy(data);
							} else if (angular.isDefined(mdata.event_id) && data.slot_id == mdata.slot_id && data.event_id == mdata.event_id && data.event_type == mdata.event_type && angular.isUndefined(mdata.event_from)) {
								mdata.rating = angular.copy(data);
							}

						});
					});
				}

				if (angular.isDefined(result.data.notes) && result.data.notes.length > 0 && angular.isDefined(myevent) && myevent.length > 0) {
					angular.forEach(result.data.notes, function (data, index) {
						angular.forEach(myevent, function (mdata, mindex) {
							if (angular.isDefined(mdata.meeting_id) && data.slot_id == mdata.meeting_id && data.event_id == mdata.meeting_id && data.event_type == 'meeting') {
								mdata.notes = angular.copy(data);
							} else if (angular.isDefined(mdata.event_id) && (data.slot_id == mdata.slot_id || data.slot_id == mdata.earning_id || data.slot_id == mdata.schedule_id) && data.event_id == mdata.event_id && (data.event_type == mdata.event_type || data.event_type == 'earningtime' || data.event_type == 'earningschedule')) {
								mdata.notes = angular.copy(data);
							}

						});
					});
				}

				if (angular.isDefined(result.data.followup) && result.data.followup.length > 0 && angular.isDefined(myevent) && myevent.length > 0) {
					angular.forEach(result.data.followup, function (data, index) {
						angular.forEach(myevent, function (mdata, mindex) {
							if (angular.isDefined(mdata.meeting_id) && data.slot_id == mdata.meeting_id && data.event_id == mdata.meeting_id && data.event_type == 'meeting') {
								if (angular.isUndefined(mdata.followup)) {
									mdata.followup = [];
								}

								if (data.user_id == $scope.meetings.userdata.user_id) {
									mdata.followexist = 1;
									mdata.followup.push(angular.copy(data));
								} else if (angular.isDefined(data.user_id) && angular.isDefined(data.request_to) && angular.isDefined($scope.meetings.userdata) &&
									angular.isDefined($scope.meetings.userdata.user_type) && ($scope.meetings.userdata.user_type == data.request_to ||
										data.request_to == '4')) {

									mdata.followup.push(angular.copy(data));
								}
							} else if (angular.isDefined(mdata.event_id) && data.slot_id == mdata.slot_id && data.event_id == mdata.event_id && data.event_type == mdata.event_type && angular.isUndefined(mdata.event_from)) {
								if (angular.isUndefined(mdata.followup)) {
									mdata.followup = [];
								}

								if (data.user_id == $scope.meetings.userdata.user_id) {
									mdata.followexist = 1;
									mdata.followup.push(angular.copy(data));
								} else if (angular.isDefined(data.user_id) && angular.isDefined(data.request_to) && angular.isDefined($scope.meetings.userdata) &&
									angular.isDefined($scope.meetings.userdata.user_type) && ($scope.meetings.userdata.user_type == data.request_to ||
										data.request_to == '4')) {

									mdata.followup.push(angular.copy(data));
								}
							}

						});
					});
				}


				angular.forEach(myevent, function (mdata, mindex) {
					if (angular.isDefined(mdata.event_from) && mdata.event_from == "live") {
						mdata.date = new Date(mdata.event_time);
					}
					if (angular.isUndefined(mdata.event_from)) {
						if (angular.isDefined($scope.meetings.userdata.user_type) && ($scope.meetings.userdata.user_type == 1 || $scope.meetings.userdata.user_type == '1')) {
							if (angular.isDefined(mdata.sponsor_id) && angular.isDefined(mdata.sponsor_name) && mdata.sponsor_name != '' && mdata.sponsor_id != '') {
								if (angular.isUndefined(mdata.requestuser)) {
									mdata.requestuser = [];
								}
								var obj = new Object();
								obj.user_type = 3;
								obj.user_name = mdata.sponsor_name;
								obj.user_id = mdata.sponsor_id;
								mdata.requestuser.push(obj);
							}
							if (angular.isDefined(mdata.corp_id) && angular.isDefined(mdata.ticker) && angular.isDefined(mdata.corporate_name) &&
								mdata.corporate_name != '' && mdata.ticker != '') {
								if (angular.isUndefined(mdata.requestuser)) {
									mdata.requestuser = [];
								}
								var obj = new Object();
								obj.user_type = 2;
								obj.user_name = mdata.corporate_name;
								obj.user_id = mdata.corp_id;
								mdata.requestuser.push(obj);
							}
							if (angular.isDefined(mdata.requestuser) && mdata.requestuser.length == 2) {
								var obj = new Object();
								obj.user_type = 4;
								obj.user_name = 'Both';
								mdata.requestuser.push(obj);
							}
							if (angular.isDefined(mdata.created_to_details) && angular.isDefined(mdata.created_to_details.user_id) &&
								angular.isDefined(mdata.created_to_details.firstname) && mdata.created_to_details.firstname != '' &&
								angular.isDefined(mdata.created_to_details.user_type) && mdata.created_to_details.user_type != '') {
								if (angular.isUndefined(mdata.requestuser)) {
									mdata.requestuser = [];
								}
								var obj = new Object();
								obj.user_type = parseInt(mdata.created_to_details.user_type);
								obj.user_name = mdata.created_to_details.firstname;
								obj.user_id = mdata.created_to_details.user_id;
								mdata.requestuser.push(obj);
							}
						} else if (angular.isDefined($scope.meetings.userdata.user_type) && ($scope.meetings.userdata.user_type == 2 || $scope.meetings.userdata.user_type == '2')) {
							if (angular.isDefined(mdata.investor_id) && angular.isDefined(mdata.investor_name) && mdata.investor_name != '' && mdata.investor_id != '') {
								if (angular.isUndefined(mdata.requestuser)) {
									mdata.requestuser = [];
								}
								var obj = new Object();
								obj.user_type = 1;
								if (mdata.investor_id == null) {
									obj.user_name = mdata.i_person_name;
									obj.user_id = mdata.slot_id;
									mdata.requestuser.push(obj);
								} else {
									obj.user_name = mdata.investor_name;
									obj.user_id = mdata.investor_id;
									mdata.requestuser.push(obj);
								}


							}
							if (angular.isDefined(mdata.sponsor_id) && angular.isDefined(mdata.sponsor_name) && mdata.sponsor_name != '' && mdata.sponsor_id != '') {
								if (angular.isUndefined(mdata.requestuser)) {
									mdata.requestuser = [];
								}
								var obj = new Object();
								obj.user_type = 3;
								obj.user_name = mdata.sponsor_name;
								obj.user_id = mdata.sponsor_id;
								mdata.requestuser.push(obj);
							}
							if (angular.isDefined(mdata.requestuser) && mdata.requestuser.length == 2) {
								var obj = new Object();
								obj.user_type = 4;
								obj.user_name = 'Both';
								mdata.requestuser.push(obj);
							}
							if (angular.isDefined(mdata.created_to_details) && angular.isDefined(mdata.created_to_details.user_id) &&
								angular.isDefined(mdata.created_to_details.firstname) && mdata.created_to_details.firstname != '' &&
								angular.isDefined(mdata.created_to_details.user_type) && mdata.created_to_details.user_type != '') {
								if (angular.isUndefined(mdata.requestuser)) {
									mdata.requestuser = [];
								}
								var obj = new Object();
								obj.user_type = parseInt(mdata.created_to_details.user_type);
								obj.user_name = mdata.created_to_details.firstname;
								obj.user_id = mdata.created_to_details.user_id;
								mdata.requestuser.push(obj);
							}
						} else if (angular.isDefined($scope.meetings.userdata.user_type) && ($scope.meetings.userdata.user_type == 3 || $scope.meetings.userdata.user_type == '3')) {
							if (angular.isDefined(mdata.investor_id) && angular.isDefined(mdata.investor_name) && mdata.investor_name != '' && mdata.investor_id != '') {
								if (angular.isUndefined(mdata.requestuser)) {
									mdata.requestuser = [];
								}
								var obj = new Object();
								obj.user_type = 1;
								obj.user_name = mdata.investor_name;
								obj.user_id = mdata.investor_id;
								mdata.requestuser.push(obj);
							}
							if (angular.isDefined(mdata.corp_id) && angular.isDefined(mdata.ticker) && angular.isDefined(mdata.corporate_name) && mdata.corporate_name != '' && mdata.ticker != '') {
								if (angular.isUndefined(mdata.requestuser)) {
									mdata.requestuser = [];
								}
								var obj = new Object();
								obj.user_type = 2;
								obj.user_name = mdata.corporate_name;
								obj.user_id = mdata.corp_id;
								mdata.requestuser.push(obj);
							}
							if (angular.isDefined(mdata.requestuser) && mdata.requestuser.length == 2) {
								var obj = new Object();
								obj.user_type = 4;
								obj.user_name = 'Both';
								mdata.requestuser.push(obj);
							}
							if (angular.isDefined(mdata.created_to_details) && angular.isDefined(mdata.created_to_details.user_id) &&
								angular.isDefined(mdata.created_to_details.firstname) && mdata.created_to_details.firstname != '' &&
								angular.isDefined(mdata.created_to_details.user_type) && mdata.created_to_details.user_type != '') {
								if (angular.isUndefined(mdata.requestuser)) {
									mdata.requestuser = [];
								}
								var obj = new Object();
								obj.user_type = parseInt(mdata.created_to_details.user_type);
								obj.user_name = mdata.created_to_details.firstname;
								obj.user_id = mdata.created_to_details.user_id;
								mdata.requestuser.push(obj);
							}
						}
					}
				});


				$scope.events.my_events = myevent;

				if (angular.isDefined($scope.searchbox) && $scope.searchbox != '') {
					$scope.meetinghistory = angular.copy($scope.searchbox);
				} else {
					$scope.meetinghistory = "";
				}

				$scope.spinnerActive = false;

			});
		}



		//investor histroy 
		$scope.getevents = function (meeting) {

			var Url = 'apiv4/public/meeting/getallinvestereventsid';
			var params = {
				key: 'tags',
				id: meeting.investor_id
			};
			RequestDetail.getDetail(Url, params).then(function (result) {
				$scope.listmeetings = result.data;
			});

		}




		$scope.get_meetings_archive();

		//Meeting archive detail view
		$scope.getArchivedetails = function (archive) {
			//$scope.spinnerActive=true;
			$scope.meetingSelected = -1;
			$scope.meetingDetailview = {};
			if ($scope.events.my_events.indexOf(archive) >= 0) {
				$scope.meetingSelected = $scope.events.my_events.indexOf(archive);
				angular.forEach($scope.events.my_events, function (eve, ind) {
					if (ind == $scope.meetingSelected) {
						$scope.meetingDetailview = eve;
					}
				});
			}
			$scope.spinnerActive = false;
		}



		$scope.currentindex = -1;
		$scope.feedbackdata = [];
		$scope.followupdata = [];

		//feedback and followup popup
		$scope.showmodal = function (showpopup, meeting) {
			$scope.currentindex = -1;
			$scope.feedback = {};
			$scope.note = {};
			$scope.followup = {};
			$scope.feedbackdata = [];
			$scope.followupdata = [];
			$scope.update = true;
			var index = $scope.events.my_events.indexOf(meeting);

			if (angular.isDefined(showpopup) && showpopup != '') {
				if (showpopup == 'rating' && index >= 0) {
					if (angular.isDefined(meeting.rating) && angular.isDefined(meeting.rating.aggregate_id)) {
						$scope.update = false;
						$scope.note = angular.copy(meeting.rating);

					} else {
						$scope.note = angular.copy(meeting);
					}

					$scope.currentindex = index;
					$scope.ratingModal = true;
				} else if (showpopup == 'feedback' && index >= 0) {
					if (angular.isDefined(meeting.feedback) && meeting.feedback.length == 1) {
						$scope.feedback = angular.copy(meeting);
						$scope.feedbackdata = angular.copy(meeting.feedback);
					} else if (angular.isDefined(meeting.feedback) && meeting.feedback.length > 0) {
						$scope.update = false;
						$scope.feedback = angular.copy(meeting.feedback);
						$scope.feedbackdata = angular.copy(meeting.feedback);
					}
					if (angular.isDefined(meeting.feedview)) {
						$scope.update = false;
					}


					$scope.currentindex = index;
					$scope.feedbackModal = true;
				} else if (showpopup == 'followup' && index >= 0) {
					$scope.followup = angular.copy(meeting);


					if (angular.isDefined(meeting.followup) && meeting.followup.length > 0) {
						angular.forEach(meeting.followup, function (mf, mi) {
							var name = ''
							if (angular.isDefined($scope.followup.requestuser) && $scope.followup.requestuser.length > 0) {
								angular.forEach($scope.followup.requestuser, function (fd, fi) {
									if (parseInt(fd.user_type) == parseInt(mf.request_to)) {
										mf.request_user = fd.user_name;
									}
								});
							}
							if (angular.isUndefined(mf.request_user)) {
								if (mf.request_to == 1) {
									mf.request_user = 'Investor';
								} else if (mf.request_to == 2) {
									mf.request_user = 'Corporate';
								} else if (mf.request_to == 3) {
									mf.request_user = 'Broker';
								} else if (mf.request_to == 4) {
									mf.request_user = 'Both';
								}
							}
						});

						$scope.followupdata = angular.copy(meeting.followup);
					}
					if (angular.isDefined(meeting.followexist)) {
						$scope.update = false;
					}

					$scope.currentindex = index;
					$scope.followupModal = true;
				} else if (showpopup == 'notes') {
					if (angular.isDefined(meeting.notes) && meeting.notes != '') {
						$scope.update = false;
						$scope.note = angular.copy(meeting.notes);
					} else {
						$scope.note = angular.copy(meeting);
					}

					$scope.currentindex = index;
					$scope.noteModal = true;
				}
			}
		}


		//edit notes
		$scope.showmodal1 = function (showpopup, meeting) {

			$scope.currentindex = -1;
			$scope.feedback = {};
			$scope.note = {};
			$scope.followup = {};
			$scope.feedbackdata = [];
			$scope.followupdata = [];
			$scope.update = true;
			$scope.note = meeting;
			$scope.note.comments = meeting.notes;
			$scope.noteModal = true;
		}


		//update notes function
		$scope.update_notes = function (data) {
			if (angular.isUndefined($scope.note.comments) || $scope.note.comments == '') {
				alertService.add("warning", "Enter any comments to update!", 2000);
				return false;
			}
			var url = 'apiv4/public/meeting/update_notes';
			var params = {
				data: $scope.note
			};
			RequestDetail.getDetail(url, params).then(function (result) {

				$scope.noteModal = !$scope.noteModal;

				if (angular.isDefined(result.data) && angular.isDefined(result.data.event_id)) {
					alertService.add("success", "Notes updated successfully!", 2000);

					$timeout(function () {
						$route.reload();
					}, 1000);

					//$location.path('/meetingArchive');

					//$scope.events.my_events[$scope.currentindex].notes=angular.copy(result.data);
				} else {
					alertService.add("warning", "Not updated Try again!", 2000);
				}
			});
		}

		//update feedback comment function
		$scope.update_note_comments = function (data) {
			if (angular.isUndefined($scope.note.comments) || $scope.note.comments == '') {
				alertService.add("warning", "Enter any comments to update!", 2000);
				return false;
			}
			var url = 'apiv4/public/meeting/update_note_comments';
			var params = {
				data: $scope.note
			};
			RequestDetail.getDetail(url, params).then(function (result) {
				if (angular.isDefined(result.data) && angular.isDefined(result.data.event_id) && $scope.currentindex >= 0) {
					alertService.add("success", "Feedback updated successfully!", 2000);

					$scope.events.my_events[$scope.currentindex].feedview = 1;
					if (angular.isUndefined($scope.events.my_events[$scope.currentindex].feedback)) {
						$scope.events.my_events[$scope.currentindex].feedback = []
					}
					$scope.events.my_events[$scope.currentindex].feedback.push(angular.copy(result.data));
					$scope.ratingModal = !$scope.ratingModal;
				} else {
					alertService.add("warning", "Not updated Try again!", 2000);
				}
			});
		}

		//notes file upload
		$scope.uploadpresentaionFile = function (imgdata1) {
			if (angular.isUndefined($scope.note.presentaion_file)) {
				$scope.note.presentaion_file = [];
			}
			$scope.$apply(function () {
				var imgdata = JSON.parse(imgdata1);
				if (imgdata.error) {
					alertService.add("warning", "This file type couldn't uploaded!", 2000);
				} else {
					$scope.note.presentaion_file.push({
						name: imgdata.name,
						location: imgdata.location
					})
				}
			});
		}

		$scope.update_feedback = function () {
			if (angular.isUndefined($scope.feedback.comments) || $scope.feedback.comments == '') {
				alertService.add("warning", "Enter any comments to update!", 2000);
				return false;
			}
			var url = 'apiv4/public/meeting/update_feedback';
			var params = {
				data: $scope.feedback
			};
			RequestDetail.getDetail(url, params).then(function (result) {
				if (angular.isDefined(result.data) && angular.isDefined(result.data.event_id) && $scope.currentindex >= 0) {
					alertService.add("success", "Feedback updated successfully!", 2000);
					$scope.feedbackModal = !$scope.feedbackModal;
					if (angular.isUndefined($scope.events.my_events[$scope.currentindex].feedback)) {
						$scope.events.my_events[$scope.currentindex].feedback = []
					}
					$scope.events.my_events[$scope.currentindex].feedback.push(angular.copy(result.data));
				} else {
					alertService.add("warning", "Not updated Try again!", 2000);
				}
			});
		}

		$scope.uploadfeedbackFile = function (imgdata) {
			if (angular.isUndefined($scope.feedback.presentaion_file)) {
				$scope.feedback.presentaion_file = [];
			}
			$scope.$apply(function () {
				$scope.feedback.presentaion_file.push({
					file_name: imgdata[0].name
				})
			});
		}

		//follow up popup function
		$scope.update_followup = function (data) {

			if (angular.isUndefined($scope.followup.user) || angular.isUndefined($scope.followup.user.user_type) || $scope.followup.user.user_type == '') {
				alertService.add("warning", "Select request to!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.followup.request_type) || $scope.followup.request_type == '') {
				alertService.add("warning", "Select request type!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.followup.comments) || $scope.followup.comments == '') {
				alertService.add("warning", "Enter any comments to update!", 2000);
				return false;
			}

			$scope.followup.request_to = $scope.followup.user.user_type;
			$scope.followup.request_name = $scope.followup.user.user_name;
			$scope.followup.request_user_id = [];
			if (angular.isDefined($scope.followup.user.user_id) && $scope.followup.user.user_id) {
				$scope.followup.request_user_id.push($scope.followup.user.user_id);
			} else if (($scope.followup.user.user_type == 4 || $scope.followup.user.user_type == '4') && angular.isDefined($scope.followup.requestuser) &&
				$scope.followup.requestuser.length > 1) {
				angular.forEach($scope.followup.requestuser, function (reuser, reind) {
					if (angular.isDefined(reuser.user_type) && angular.isDefined(reuser.user_id) && reuser.user_type != 4 &&
						reuser.user_id != '') {
						$scope.followup.request_user_id.push(reuser.user_id);
					}
				})
			}
			if (angular.isUndefined($scope.followup.request_user_id) || $scope.followup.request_user_id.length <= 0) {
				alertService.add("warning", "Select request to!", 2000);
				return false;
			}
			var date = new Date();
			var day = date.getDate();
			var monthIndex = date.getMonth();
			var year = date.getFullYear();
			var hour = date.getHours();
			var min = date.getMinutes();
			var sec = date.getSeconds();
			$scope.followup.date = year + '-' + monthIndex + '-' + day + ' ' + hour + ':' + min + ':' + sec;
			var url = 'apiv4/public/meeting/update_followup';
			var params = {
				data: $scope.followup
			};
			//$scope.spinnerActive=true;
			RequestDetail.getDetail(url, params).then(function (result) {
				if (angular.isDefined(result.data) && angular.isDefined(result.data.event_id) && $scope.currentindex >= 0) {
					alertService.add("success", "Follow-up updated successfully!", 2000);
					$scope.followupModal = !$scope.followupModal;
					if (angular.isUndefined($scope.events.my_events[$scope.currentindex].followup)) {
						$scope.events.my_events[$scope.currentindex].followup = [];
					}

					$scope.events.my_events[$scope.currentindex].followup.push(angular.copy(result.data));
					$scope.events.my_events[$scope.currentindex].followexist = 1;
				} else {
					alertService.add("warning", "Not updated Try again!", 2000);
				}
				$scope.spinnerActive = false;
			});
		}

		//follow up file upload
		$scope.uploadfollowupFile = function (imgdata) {
			var result = JSON.parse(imgdata)
			if (result.error) {
				alertService.add("warning", "This file type couldn't uploaded!", 2000);
				alert("This file type couldn't uploaded!")
			} else {
				if (angular.isUndefined($scope.followup.presentaion_file)) {
					$scope.followup.presentaion_file = [];
				}
				$scope.$apply(function () {
					$scope.followup.presentaion_file.push({
						file_name: result.name,
						location: result.location
					})
				});
			}
		}

		//save to archived 
		$scope.save_archive = function (meeting) {
			var index = $scope.events.my_events.indexOf(meeting);
			if (index >= 0) {
				var url = 'apiv4/public/meeting/save_archive';
				var params = {
					data: meeting
				};
				RequestDetail.getDetail(url, params).then(function (result) {
					if (result.data) {
						$scope.events.my_events.splice(index, 1);
						alertService.add("success", "Meeting archieved successfully!", 2000);
					} else {
						alertService.add("warning", "Not updated Try again!", 2000);
					}
				});
			}
		}

	})


	.controller('meetingArchiveCtrl_old', function ($scope, $http, $location, RequestDetail, localStorageService, alertService, configdetails, $timeout, $routeParams, $route) {
		$scope.configdetails = configdetails;
		$scope.pageHeading = 'Meeting Archive';
		$scope.MeetingArchiveActive = 'active';
		$scope.hoverDiv = '<div class="hoverpopup" ng-show="true"><p>Div Popup</p></div>';

		$scope.meetings = {};
		$scope.events = {};
		$scope.events.my_events = [];

		$scope.ratingModal = false;
		$scope.feedbackModal = false;
		$scope.followupModal = false;
		$scope.noteModal = false;


		$scope.feedback = {};
		$scope.note = {};
		$scope.followup = {};
		$scope.search = '';
		$scope.date = new Date();
		$scope.update = true;
		$scope.searchbox = "";
		$scope.showMeetingarchive = true;
		//$scope.spinnerActive=true;
		$scope.meetinghistory = "";
		$scope.meetingSelected = -1;
		$scope.meetingDetailview = {};

		$scope.go_event = function (event_id, event_type) {

		}


		$scope.notemodalclose = function () {
			$scope.noteModal = !$scope.noteModal;
		}
		$scope.followupmodalclose = function () {
			$scope.followupModal = !$scope.followupModal;
		}
		$scope.feedbackmodalclose = function () {
			$scope.feedbackModal = !$scope.feedbackModal;
		}



		$scope.showModalpageinfo = false;

		$scope.openmodelpagehelp = function () {
			$scope.showModalpageinfo = !$scope.showModalpageinfo;
		}

		clickOnUpload();

		function clickOnUpload() {

			//http://stackoverflow.com/questions/22447374/how-to-trigger-ng-click-angularjs-programmatically
			$timeout(function () {
				////console.log($routeParams['meetingid'] )
				var meetingid = $routeParams['meetingid'];
				if (meetingid != 'archieved') {
					angular.element('#I' + meetingid).triggerHandler('click');
				}
				return;
			}, 2000);
		};
		$scope.get_meetings_archive = function () {
			$scope.spinnerActive = true;
			$scope.meetingSelected = -1;
			$scope.meetingDetailview = {};
			$scope.events.my_events = [];
			$scope.meetings.userdata = localStorageService.get('userdata');
			var url = 'apiv4/public/meeting/meetings_archive';
			var params = {
				data: 'meeting_archive'
			};
			if (angular.isDefined($scope.searchbox) && $scope.searchbox != '') {
				params.searchStr = angular.copy($scope.searchbox);
			}
			RequestDetail.getDetail(url, params).then(function (result) {

				var myevent = [];

				if (angular.isDefined(result.data)) {
					if (angular.isDefined(result.data.my_events) && result.data.my_events.length > 0) {
						myevent = result.data.my_events;


					}
					if (angular.isDefined(result.data.meeting) && result.data.meeting.length > 0) {
						if (myevent.length > 0) {
							angular.forEach(result.data.meeting, function (data, index) {

								myevent.push(data);
							});
						} else {
							myevent = result.data.meeting;
						}
					}
					if (angular.isDefined(result.data.feedback) && result.data.feedback.length > 0 && angular.isDefined(myevent) && myevent.length > 0) {
						angular.forEach(result.data.feedback, function (data, index) {
							angular.forEach(myevent, function (mdata, mindex) {
								if (angular.isDefined(mdata.meeting_id) && data.slot_id == mdata.meeting_id && data.event_id == mdata.meeting_id && data.event_type == 'meeting') {
									if (angular.isUndefined(mdata.feedback)) {
										mdata.feedback = [];
									}
									if ($scope.meetings.userdata.user_id == data.user_id) {
										mdata.feedview = 1;
									}
									mdata.feedback.push(angular.copy(data));
								} else if (angular.isDefined(mdata.event_id) && data.slot_id == mdata.slot_id && data.event_id == mdata.event_id && data.event_type == mdata.event_type && angular.isUndefined(mdata.event_from)) {
									if (angular.isUndefined(mdata.feedback)) {
										mdata.feedback = [];
									}
									if ($scope.meetings.userdata.user_id == data.user_id) {
										mdata.feedview = 1;
									}
									mdata.feedback.push(angular.copy(data));
								}

							});
						});
					}

					if (angular.isDefined(result.data.rating) && result.data.rating.length > 0 && angular.isDefined(myevent) && myevent.length > 0) {
						angular.forEach(result.data.rating, function (data, index) {
							angular.forEach(myevent, function (mdata, mindex) {
								if (angular.isDefined(mdata.meeting_id) && data.slot_id == mdata.meeting_id && data.event_id == mdata.meeting_id && data.event_type == 'meeting') {
									mdata.rating = angular.copy(data);
								} else if (angular.isDefined(mdata.event_id) && data.slot_id == mdata.slot_id && data.event_id == mdata.event_id && data.event_type == mdata.event_type && angular.isUndefined(mdata.event_from)) {
									mdata.rating = angular.copy(data);
								}

							});
						});
					}

					if (angular.isDefined(result.data.notes) && result.data.notes.length > 0 && angular.isDefined(myevent) && myevent.length > 0) {
						angular.forEach(result.data.notes, function (data, index) {
							angular.forEach(myevent, function (mdata, mindex) {
								if (angular.isDefined(mdata.meeting_id) && data.slot_id == mdata.meeting_id && data.event_id == mdata.meeting_id && data.event_type == 'meeting') {
									mdata.notes = angular.copy(data);
								} else if (angular.isDefined(mdata.event_id) && (data.slot_id == mdata.slot_id || data.slot_id == mdata.earning_id || data.slot_id == mdata.schedule_id) && data.event_id == mdata.event_id && (data.event_type == mdata.event_type || data.event_type == 'earningtime' || data.event_type == 'earningschedule')) {
									mdata.notes = angular.copy(data);
								}

							});
						});
					}

					if (angular.isDefined(result.data.followup) && result.data.followup.length > 0 && angular.isDefined(myevent) && myevent.length > 0) {
						angular.forEach(result.data.followup, function (data, index) {
							angular.forEach(myevent, function (mdata, mindex) {
								if (angular.isDefined(mdata.meeting_id) && data.slot_id == mdata.meeting_id && data.event_id == mdata.meeting_id && data.event_type == 'meeting') {
									if (angular.isUndefined(mdata.followup)) {
										mdata.followup = [];
									}

									if (data.user_id == $scope.meetings.userdata.user_id) {
										mdata.followexist = 1;
										mdata.followup.push(angular.copy(data));
									} else if (angular.isDefined(data.user_id) && angular.isDefined(data.request_to) && angular.isDefined($scope.meetings.userdata) &&
										angular.isDefined($scope.meetings.userdata.user_type) && ($scope.meetings.userdata.user_type == data.request_to ||
											data.request_to == '4')) {

										mdata.followup.push(angular.copy(data));
									}
								} else if (angular.isDefined(mdata.event_id) && data.slot_id == mdata.slot_id && data.event_id == mdata.event_id && data.event_type == mdata.event_type && angular.isUndefined(mdata.event_from)) {
									if (angular.isUndefined(mdata.followup)) {
										mdata.followup = [];
									}

									if (data.user_id == $scope.meetings.userdata.user_id) {
										mdata.followexist = 1;
										mdata.followup.push(angular.copy(data));
									} else if (angular.isDefined(data.user_id) && angular.isDefined(data.request_to) && angular.isDefined($scope.meetings.userdata) &&
										angular.isDefined($scope.meetings.userdata.user_type) && ($scope.meetings.userdata.user_type == data.request_to ||
											data.request_to == '4')) {

										mdata.followup.push(angular.copy(data));
									}
								}

							});
						});
					}


					angular.forEach(myevent, function (mdata, mindex) {
						if (angular.isDefined(mdata.event_from) && mdata.event_from == "live") {
							mdata.date = new Date(mdata.event_time);
						}
						if (angular.isUndefined(mdata.event_from)) {
							if (angular.isDefined($scope.meetings.userdata.user_type) && ($scope.meetings.userdata.user_type == 1 || $scope.meetings.userdata.user_type == '1')) {
								if (angular.isDefined(mdata.sponsor_id) && angular.isDefined(mdata.sponsor_name) && mdata.sponsor_name != '' && mdata.sponsor_id != '') {
									if (angular.isUndefined(mdata.requestuser)) {
										mdata.requestuser = [];
									}
									var obj = new Object();
									obj.user_type = 3;
									obj.user_name = mdata.sponsor_name;
									obj.user_id = mdata.sponsor_id;
									mdata.requestuser.push(obj);
								}
								if (angular.isDefined(mdata.corp_id) && angular.isDefined(mdata.ticker) && angular.isDefined(mdata.corporate_name) &&
									mdata.corporate_name != '' && mdata.ticker != '') {
									if (angular.isUndefined(mdata.requestuser)) {
										mdata.requestuser = [];
									}
									var obj = new Object();
									obj.user_type = 2;
									obj.user_name = mdata.corporate_name;
									obj.user_id = mdata.corp_id;
									mdata.requestuser.push(obj);
								}
								if (angular.isDefined(mdata.requestuser) && mdata.requestuser.length == 2) {
									var obj = new Object();
									obj.user_type = 4;
									obj.user_name = 'Both';
									mdata.requestuser.push(obj);
								}
								if (angular.isDefined(mdata.created_to_details) && angular.isDefined(mdata.created_to_details.user_id) &&
									angular.isDefined(mdata.created_to_details.firstname) && mdata.created_to_details.firstname != '' &&
									angular.isDefined(mdata.created_to_details.user_type) && mdata.created_to_details.user_type != '') {
									if (angular.isUndefined(mdata.requestuser)) {
										mdata.requestuser = [];
									}
									var obj = new Object();
									obj.user_type = parseInt(mdata.created_to_details.user_type);
									obj.user_name = mdata.created_to_details.firstname;
									obj.user_id = mdata.created_to_details.user_id;
									mdata.requestuser.push(obj);
								}
							} else if (angular.isDefined($scope.meetings.userdata.user_type) && ($scope.meetings.userdata.user_type == 2 || $scope.meetings.userdata.user_type == '2')) {
								if (angular.isDefined(mdata.investor_id) && angular.isDefined(mdata.investor_name) && mdata.investor_name != '' && mdata.investor_id != '') {
									if (angular.isUndefined(mdata.requestuser)) {
										mdata.requestuser = [];
									}
									var obj = new Object();
									obj.user_type = 1;
									if (mdata.investor_id == null) {
										obj.user_name = mdata.i_person_name;
										obj.user_id = mdata.slot_id;
										mdata.requestuser.push(obj);
									} else {
										obj.user_name = mdata.investor_name;
										obj.user_id = mdata.investor_id;
										mdata.requestuser.push(obj);
									}


								}
								if (angular.isDefined(mdata.sponsor_id) && angular.isDefined(mdata.sponsor_name) && mdata.sponsor_name != '' && mdata.sponsor_id != '') {
									if (angular.isUndefined(mdata.requestuser)) {
										mdata.requestuser = [];
									}
									var obj = new Object();
									obj.user_type = 3;
									obj.user_name = mdata.sponsor_name;
									obj.user_id = mdata.sponsor_id;
									mdata.requestuser.push(obj);
								}
								if (angular.isDefined(mdata.requestuser) && mdata.requestuser.length == 2) {
									var obj = new Object();
									obj.user_type = 4;
									obj.user_name = 'Both';
									mdata.requestuser.push(obj);
								}
								if (angular.isDefined(mdata.created_to_details) && angular.isDefined(mdata.created_to_details.user_id) &&
									angular.isDefined(mdata.created_to_details.firstname) && mdata.created_to_details.firstname != '' &&
									angular.isDefined(mdata.created_to_details.user_type) && mdata.created_to_details.user_type != '') {
									if (angular.isUndefined(mdata.requestuser)) {
										mdata.requestuser = [];
									}
									var obj = new Object();
									obj.user_type = parseInt(mdata.created_to_details.user_type);
									obj.user_name = mdata.created_to_details.firstname;
									obj.user_id = mdata.created_to_details.user_id;
									mdata.requestuser.push(obj);
								}
							} else if (angular.isDefined($scope.meetings.userdata.user_type) && ($scope.meetings.userdata.user_type == 3 || $scope.meetings.userdata.user_type == '3')) {
								if (angular.isDefined(mdata.investor_id) && angular.isDefined(mdata.investor_name) && mdata.investor_name != '' && mdata.investor_id != '') {
									if (angular.isUndefined(mdata.requestuser)) {
										mdata.requestuser = [];
									}
									var obj = new Object();
									obj.user_type = 1;
									obj.user_name = mdata.investor_name;
									obj.user_id = mdata.investor_id;
									mdata.requestuser.push(obj);
								}
								if (angular.isDefined(mdata.corp_id) && angular.isDefined(mdata.ticker) && angular.isDefined(mdata.corporate_name) && mdata.corporate_name != '' && mdata.ticker != '') {
									if (angular.isUndefined(mdata.requestuser)) {
										mdata.requestuser = [];
									}
									var obj = new Object();
									obj.user_type = 2;
									obj.user_name = mdata.corporate_name;
									obj.user_id = mdata.corp_id;
									mdata.requestuser.push(obj);
								}
								if (angular.isDefined(mdata.requestuser) && mdata.requestuser.length == 2) {
									var obj = new Object();
									obj.user_type = 4;
									obj.user_name = 'Both';
									mdata.requestuser.push(obj);
								}
								if (angular.isDefined(mdata.created_to_details) && angular.isDefined(mdata.created_to_details.user_id) &&
									angular.isDefined(mdata.created_to_details.firstname) && mdata.created_to_details.firstname != '' &&
									angular.isDefined(mdata.created_to_details.user_type) && mdata.created_to_details.user_type != '') {
									if (angular.isUndefined(mdata.requestuser)) {
										mdata.requestuser = [];
									}
									var obj = new Object();
									obj.user_type = parseInt(mdata.created_to_details.user_type);
									obj.user_name = mdata.created_to_details.firstname;
									obj.user_id = mdata.created_to_details.user_id;
									mdata.requestuser.push(obj);
								}
							}
						}
					});
				}
				$scope.events.my_events = myevent;

				if (angular.isDefined($scope.searchbox) && $scope.searchbox != '') {
					$scope.meetinghistory = angular.copy($scope.searchbox);
				} else {
					$scope.meetinghistory = "";
				}

				$scope.spinnerActive = false;

			});
		}
		/*$scope.getevents=function(meeting){
		if(angular.isDefined(meeting) && angular.isDefined(meeting.meeting_id)){
			var enctype = 'e6ec529ba185279a'+meeting.meeting_id+'a0adcf93e645c7cd';
 			 $location.path('meetingAccepted/'+enctype);			
		}
		else if(angular.isDefined(meeting) && angular.isDefined(meeting.event_type) && meeting.event_type!=''){
			var url = 'apiv4/public/meeting/encode_eventid';
			var params = meeting.event_id;
			RequestDetail.getDetail(url,params).then(function(result){
				$location.path('/event/response/'+result.data);
			});
		}
	}*/

		$scope.listmeetings = [];

		$scope.getevents = function (meeting) {


			var Url = 'apiv4/public/meeting/getallinvestereventsid';
			var params = {
				key: 'tags',
				id: meeting.investor_id
			};
			RequestDetail.getDetail(Url, params).then(function (result) {
				$scope.listmeetings = result.data;
			});

		}



		$scope.searchMeetingarchive = function () {
			$scope.showMeetingarchive = false;
			$scope.get_meetings_archive();
		}

		$scope.get_meetings_archive();

		//Meeting archive detail view
		$scope.getArchivedetails = function (archive) {
			//$scope.spinnerActive=true;
			$scope.meetingSelected = -1;
			$scope.meetingDetailview = {};
			if ($scope.events.my_events.indexOf(archive) >= 0) {
				$scope.meetingSelected = $scope.events.my_events.indexOf(archive);
				angular.forEach($scope.events.my_events, function (eve, ind) {
					if (ind == $scope.meetingSelected) {
						$scope.meetingDetailview = eve;
					}
				});
			}
			$scope.spinnerActive = false;
		}

		// Show Broker Rated Popup
		$scope.broker_rated_show = function (meetings) {
			var indexs = $scope.meetings.completed.indexOf(meetings);
			$scope.show_broker_pop = [];
			$scope.showpop = [];
			$scope.show_broker_rate = [];
			$scope.show_broker_pop[indexs] = true;
			$scope.showpop[indexs] = false;

			if (indexs > -1 && angular.isDefined(meetings.brok_rating) && angular.isDefined(meetings.brok_rating.aggregate_id) && meetings.brok_rating.aggregate_id != '') {
				angular.forEach($scope.meetings.completed, function (mval, mkey) {
					if (mkey == indexs) {
						mval.aggregate = {};
						if (angular.isDefined(meetings.brok_rating.comments) && meetings.brok_rating.comments != '') {
							mval.aggregate.broker_comments = angular.copy(meetings.brok_rating.comments);
						}
						if (angular.isDefined(meetings.brok_rating.investor_prepared) && meetings.brok_rating.investor_prepared != '') {
							mval.aggregate.broker_prepared = angular.copy(meetings.brok_rating.investor_prepared);
						}
						if (angular.isDefined(meetings.brok_rating.investor_engaged) && meetings.brok_rating.investor_engaged != '') {
							mval.aggregate.broker_engaged = angular.copy(meetings.brok_rating.investor_engaged);
						}
						if (angular.isDefined(meetings.brok_rating.investor_likely) && meetings.brok_rating.investor_likely != '') {
							mval.aggregate.broker_likely = angular.copy(meetings.brok_rating.investor_likely);
						}
					}
				});
			}
		}
		$scope.currentindex = -1;
		$scope.feedbackdata = [];
		$scope.followupdata = [];
		$scope.showmodal = function (showpopup, meeting) {
			$scope.currentindex = -1;
			$scope.feedback = {};
			$scope.note = {};
			$scope.followup = {};
			$scope.feedbackdata = [];
			$scope.followupdata = [];
			$scope.update = true;
			var index = $scope.events.my_events.indexOf(meeting);

			if (angular.isDefined(showpopup) && showpopup != '') {
				if (showpopup == 'rating' && index >= 0) {
					if (angular.isDefined(meeting.rating) && angular.isDefined(meeting.rating.aggregate_id)) {
						$scope.update = false;
						$scope.note = angular.copy(meeting.rating);

					} else {
						$scope.note = angular.copy(meeting);
					}

					$scope.currentindex = index;
					$scope.ratingModal = true;
				} else if (showpopup == 'feedback' && index >= 0) {
					if (angular.isDefined(meeting.feedback) && meeting.feedback.length == 1) {
						$scope.feedback = angular.copy(meeting);
						$scope.feedbackdata = angular.copy(meeting.feedback);
					} else if (angular.isDefined(meeting.feedback) && meeting.feedback.length > 0) {
						$scope.update = false;
						$scope.feedback = angular.copy(meeting.feedback);
						$scope.feedbackdata = angular.copy(meeting.feedback);
					}
					if (angular.isDefined(meeting.feedview)) {
						$scope.update = false;
					}


					$scope.currentindex = index;
					$scope.feedbackModal = true;
				} else if (showpopup == 'followup' && index >= 0) {
					$scope.followup = angular.copy(meeting);


					if (angular.isDefined(meeting.followup) && meeting.followup.length > 0) {
						angular.forEach(meeting.followup, function (mf, mi) {
							var name = ''
							if (angular.isDefined($scope.followup.requestuser) && $scope.followup.requestuser.length > 0) {
								angular.forEach($scope.followup.requestuser, function (fd, fi) {
									if (parseInt(fd.user_type) == parseInt(mf.request_to)) {
										mf.request_user = fd.user_name;
									}
								});
							}
							if (angular.isUndefined(mf.request_user)) {
								if (mf.request_to == 1) {
									mf.request_user = 'Investor';
								} else if (mf.request_to == 2) {
									mf.request_user = 'Corporate';
								} else if (mf.request_to == 3) {
									mf.request_user = 'Broker';
								} else if (mf.request_to == 4) {
									mf.request_user = 'Both';
								}
							}
						});

						$scope.followupdata = angular.copy(meeting.followup);
					}
					if (angular.isDefined(meeting.followexist)) {
						$scope.update = false;
					}

					$scope.currentindex = index;
					$scope.followupModal = true;
				} else if (showpopup == 'notes') {
					if (angular.isDefined(meeting.notes) && meeting.notes != '') {
						$scope.update = false;
						$scope.note = angular.copy(meeting.notes);
					} else {
						$scope.note = angular.copy(meeting);
					}

					$scope.currentindex = index;
					$scope.noteModal = true;
				}
			}
		}


		$scope.showmodal1 = function (showpopup, meeting) {

			$scope.currentindex = -1;
			$scope.feedback = {};
			$scope.note = {};
			$scope.followup = {};
			$scope.feedbackdata = [];
			$scope.followupdata = [];
			$scope.update = true;
			$scope.note = meeting;
			$scope.note.comments = meeting.notes;
			$scope.noteModal = true;
		}


		$scope.update_notes = function (data) {
			if (angular.isUndefined($scope.note.comments) || $scope.note.comments == '') {
				alertService.add("warning", "Enter any comments to update!", 2000);
				return false;
			}
			var url = 'apiv4/public/meeting/update_notes';
			var params = {
				data: $scope.note
			};
			RequestDetail.getDetail(url, params).then(function (result) {

				$scope.noteModal = !$scope.noteModal;

				if (angular.isDefined(result.data) && angular.isDefined(result.data.event_id)) {
					alertService.add("success", "Notes updated successfully!", 2000);

					$timeout(function () {
						$route.reload();
					}, 1000);

					//$location.path('/meetingArchive');

					//$scope.events.my_events[$scope.currentindex].notes=angular.copy(result.data);
				} else {
					alertService.add("warning", "Not updated Try again!", 2000);
				}
			});
		}

		$scope.update_note_comments = function (data) {
			if (angular.isUndefined($scope.note.comments) || $scope.note.comments == '') {
				alertService.add("warning", "Enter any comments to update!", 2000);
				return false;
			}
			var url = 'apiv4/public/meeting/update_note_comments';
			var params = {
				data: $scope.note
			};
			RequestDetail.getDetail(url, params).then(function (result) {
				if (angular.isDefined(result.data) && angular.isDefined(result.data.event_id) && $scope.currentindex >= 0) {
					alertService.add("success", "Feedback updated successfully!", 2000);

					$scope.events.my_events[$scope.currentindex].feedview = 1;
					if (angular.isUndefined($scope.events.my_events[$scope.currentindex].feedback)) {
						$scope.events.my_events[$scope.currentindex].feedback = []
					}
					$scope.events.my_events[$scope.currentindex].feedback.push(angular.copy(result.data));
					$scope.ratingModal = !$scope.ratingModal;
				} else {
					alertService.add("warning", "Not updated Try again!", 2000);
				}
			});
		}

		$scope.uploadpresentaionFile = function (imgdata1) {
			if (angular.isUndefined($scope.note.presentaion_file)) {
				$scope.note.presentaion_file = [];
			}
			$scope.$apply(function () {
				var imgdata = JSON.parse(imgdata1);
				if (imgdata.error) {
					alertService.add("warning", "This file type couldn't uploaded!", 2000);
				} else {
					$scope.note.presentaion_file.push({
						name: imgdata.name,
						location: imgdata.location
					})
				}
			});
		}

		$scope.update_feedback = function () {
			if (angular.isUndefined($scope.feedback.comments) || $scope.feedback.comments == '') {
				alertService.add("warning", "Enter any comments to update!", 2000);
				return false;
			}
			var url = 'apiv4/public/meeting/update_feedback';
			var params = {
				data: $scope.feedback
			};
			RequestDetail.getDetail(url, params).then(function (result) {
				if (angular.isDefined(result.data) && angular.isDefined(result.data.event_id) && $scope.currentindex >= 0) {
					alertService.add("success", "Feedback updated successfully!", 2000);
					$scope.feedbackModal = !$scope.feedbackModal;
					if (angular.isUndefined($scope.events.my_events[$scope.currentindex].feedback)) {
						$scope.events.my_events[$scope.currentindex].feedback = []
					}
					$scope.events.my_events[$scope.currentindex].feedback.push(angular.copy(result.data));
				} else {
					alertService.add("warning", "Not updated Try again!", 2000);
				}
			});
		}

		$scope.uploadfeedbackFile = function (imgdata) {
			if (angular.isUndefined($scope.feedback.presentaion_file)) {
				$scope.feedback.presentaion_file = [];
			}
			$scope.$apply(function () {
				$scope.feedback.presentaion_file.push({
					file_name: imgdata[0].name
				})
			});
		}

		$scope.update_followup = function (data) {

			if (angular.isUndefined($scope.followup.user) || angular.isUndefined($scope.followup.user.user_type) || $scope.followup.user.user_type == '') {
				alertService.add("warning", "Select request to!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.followup.request_type) || $scope.followup.request_type == '') {
				alertService.add("warning", "Select request type!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.followup.comments) || $scope.followup.comments == '') {
				alertService.add("warning", "Enter any comments to update!", 2000);
				return false;
			}

			$scope.followup.request_to = $scope.followup.user.user_type;
			$scope.followup.request_name = $scope.followup.user.user_name;
			$scope.followup.request_user_id = [];
			if (angular.isDefined($scope.followup.user.user_id) && $scope.followup.user.user_id) {
				$scope.followup.request_user_id.push($scope.followup.user.user_id);
			} else if (($scope.followup.user.user_type == 4 || $scope.followup.user.user_type == '4') && angular.isDefined($scope.followup.requestuser) &&
				$scope.followup.requestuser.length > 1) {
				angular.forEach($scope.followup.requestuser, function (reuser, reind) {
					if (angular.isDefined(reuser.user_type) && angular.isDefined(reuser.user_id) && reuser.user_type != 4 &&
						reuser.user_id != '') {
						$scope.followup.request_user_id.push(reuser.user_id);
					}
				})
			}
			if (angular.isUndefined($scope.followup.request_user_id) || $scope.followup.request_user_id.length <= 0) {
				alertService.add("warning", "Select request to!", 2000);
				return false;
			}
			var date = new Date();
			var day = date.getDate();
			var monthIndex = date.getMonth();
			var year = date.getFullYear();
			var hour = date.getHours();
			var min = date.getMinutes();
			var sec = date.getSeconds();
			$scope.followup.date = year + '-' + monthIndex + '-' + day + ' ' + hour + ':' + min + ':' + sec;
			var url = 'apiv4/public/meeting/update_followup';
			var params = {
				data: $scope.followup
			};
			//$scope.spinnerActive=true;
			RequestDetail.getDetail(url, params).then(function (result) {
				if (angular.isDefined(result.data) && angular.isDefined(result.data.event_id) && $scope.currentindex >= 0) {
					alertService.add("success", "Follow-up updated successfully!", 2000);
					$scope.followupModal = !$scope.followupModal;
					if (angular.isUndefined($scope.events.my_events[$scope.currentindex].followup)) {
						$scope.events.my_events[$scope.currentindex].followup = [];
					}

					$scope.events.my_events[$scope.currentindex].followup.push(angular.copy(result.data));
					$scope.events.my_events[$scope.currentindex].followexist = 1;
				} else {
					alertService.add("warning", "Not updated Try again!", 2000);
				}
				$scope.spinnerActive = false;
			});
		}

		$scope.uploadfollowupFile = function (imgdata) {
			var result = JSON.parse(imgdata)
			if (result.error) {
				alertService.add("warning", "This file type couldn't uploaded!", 2000);
				alert("This file type couldn't uploaded!")
			} else {
				if (angular.isUndefined($scope.followup.presentaion_file)) {
					$scope.followup.presentaion_file = [];
				}
				$scope.$apply(function () {
					$scope.followup.presentaion_file.push({
						file_name: result.files.name[0],
						location: result.location
					})
				});
			}
		}

		$scope.save_archive = function (meeting) {
			var index = $scope.events.my_events.indexOf(meeting);
			if (index >= 0) {
				var url = 'apiv4/public/meeting/save_archive';
				var params = {
					data: meeting
				};
				RequestDetail.getDetail(url, params).then(function (result) {
					if (result.data) {
						$scope.events.my_events.splice(index, 1);
						alertService.add("success", "Meeting archieved successfully!", 2000);
					} else {
						alertService.add("warning", "Not updated Try again!", 2000);
					}
				});
			}
		}
		$scope.archivedmeeting = function () {
			$location.path('/meetingArchive/archieved');
		}
	}).controller('archivedMeetingCtrl', function ($scope, $http, $location, RequestDetail, localStorageService, alertService, configdetails) {
		$scope.configdetails = configdetails;
		$scope.pageHeading = 'Archieved Meetings';
		$scope.MeetingArchiveActive = 'active';


		$scope.meetings = {};
		$scope.events = {};
		$scope.events.my_events = [];

		$scope.ratingModal = false;
		$scope.feedbackModal = false;
		$scope.followupModal = false;
		$scope.noteModal = false;

		$scope.feedback = {};
		$scope.note = {};
		$scope.followup = {};
		$scope.search = '';
		$scope.date = new Date();
		$scope.update = true;
		$scope.searchbox = "";
		$scope.showMeetingarchive = true;
		$scope.spinnerActive = true;
		$scope.meetinghistory = "";
		$scope.meetingSelected = -1;
		$scope.meetingDetailview = {};

		$scope.showModalpageinfo = false;

		$scope.openmodelpagehelp = function () {
			$scope.showModalpageinfo = !$scope.showModalpageinfo;
		}


		$scope.get_meetings_archive = function () {
			$scope.meetingSelected = -1;
			$scope.meetingDetailview = {};
			$scope.events.my_events = [];
			$scope.meetings.userdata = localStorageService.get('userdata');
			var url = 'apiv4/public/meeting/meetings_archive';
			var params = {
				data: 'meeting_archive',
				key: 'archieved'
			};
			if (angular.isDefined($scope.searchbox) && $scope.searchbox != '') {
				params.searchStr = angular.copy($scope.searchbox);
			}
			$scope.spinnerActive = true;
			RequestDetail.getDetail(url, params).then(function (result) {

				//console.log(result.data.my_events);

				var myevent = [];
				if (angular.isDefined(result.data)) {
					if (angular.isDefined(result.data.my_events) && result.data.my_events.length > 0) {
						myevent = result.data.my_events;
					}
					if (angular.isDefined(result.data.meeting) && result.data.meeting.length > 0) {
						if (myevent.length > 0) {
							angular.forEach(result.data.meeting, function (data, index) {
								myevent.push(data);
							});
						} else {
							myevent = result.data.meeting;
						}
					}


				}
				$scope.events.my_events = myevent;
				$scope.spinnerActive = false;
				if (angular.isDefined($scope.searchbox) && $scope.searchbox != '') {
					$scope.meetinghistory = angular.copy($scope.searchbox);
				} else {
					$scope.meetinghistory = "";
				}

			});
		}
		$scope.clickedit = function () {
			$scope.getpvtnotes = true;
		}
		$scope.savenotes = function () {
			var url = 'apiv4/public/meeting/meetings_archive_noteupdate';
			var params = {
				data: $scope.meetingDetailview
			};
			$scope.popup_spinnerActive = true;
			RequestDetail.getDetail(url, params).then(function (result) {
				if (parseInt(result.data) == '0') {
					$scope.getpvtnotes = false;
					$scope.popup_spinnerActive = false;
				}
			});

		}
		$scope.removetick = function () {
			$scope.$apply(function () {
				$scope.meetingSelected = -1;
			})
		}
		$scope.closenotes = function () {
			$scope.getpvtnotes = false;
		}
		$scope.searchMeetingarchive = function () {
			$scope.showMeetingarchive = false;
			$scope.get_meetings_archive();
		}

		$scope.get_meetings_archive();

		//Meeting archive detail view
		$scope.getArchivedetails = function (archive) {

			$scope.spinnerActive = true;
			$scope.meetingSelected = -1;
			$scope.meetingDetailview = {};
			if ($scope.events.my_events.indexOf(archive) >= 0) {
				$scope.meetingSelected = $scope.events.my_events.indexOf(archive);
				angular.forEach($scope.events.my_events, function (eve, ind) {
					if (ind == $scope.meetingSelected) {
						$scope.meetingDetailview = eve;
					}
				});
			}

			$scope.spinnerActive = false;
		}


		$scope.archivedmeeting = function () {
			$location.path('/meetingArchive');
		}

		$scope.aggregatemeeting = function () {
			$location.path('/meetingArchive/aggregate');
		}


	}).controller('archivedMeetingCtrl_old', function ($scope, $http, $location, RequestDetail, localStorageService, alertService, configdetails) {
		$scope.configdetails = configdetails;
		$scope.pageHeading = 'Archieved Meetings';
		$scope.MeetingArchiveActive = 'active';
		$scope.hoverDiv = '<div class="hoverpopup" ng-show="true"><p>Div Popup</p></div>';

		$scope.meetings = {};
		$scope.events = {};
		$scope.events.my_events = [];

		$scope.ratingModal = false;
		$scope.feedbackModal = false;
		$scope.followupModal = false;
		$scope.noteModal = false;

		$scope.feedback = {};
		$scope.note = {};
		$scope.followup = {};
		$scope.search = '';
		$scope.date = new Date();
		$scope.update = true;
		$scope.searchbox = "";
		$scope.showMeetingarchive = true;
		$scope.spinnerActive = true;
		$scope.meetinghistory = "";
		$scope.meetingSelected = -1;
		$scope.meetingDetailview = {};

		$scope.showModalpageinfo = false;

		$scope.openmodelpagehelp = function () {
			$scope.showModalpageinfo = !$scope.showModalpageinfo;
		}


		$scope.get_meetings_archive = function () {
			$scope.meetingSelected = -1;
			$scope.meetingDetailview = {};
			$scope.events.my_events = [];
			$scope.meetings.userdata = localStorageService.get('userdata');
			var url = 'apiv4/public/meeting/meetings_archive';
			var params = {
				data: 'meeting_archive',
				key: 'archieved'
			};
			if (angular.isDefined($scope.searchbox) && $scope.searchbox != '') {
				params.searchStr = angular.copy($scope.searchbox);
			}
			$scope.spinnerActive = true;
			RequestDetail.getDetail(url, params).then(function (result) {

				//console.log(result.data.my_events);

				var myevent = [];
				if (angular.isDefined(result.data)) {
					if (angular.isDefined(result.data.my_events) && result.data.my_events.length > 0) {
						myevent = result.data.my_events;
					}
					if (angular.isDefined(result.data.meeting) && result.data.meeting.length > 0) {
						if (myevent.length > 0) {
							angular.forEach(result.data.meeting, function (data, index) {
								myevent.push(data);
							});
						} else {
							myevent = result.data.meeting;
						}
					}
					if (angular.isDefined(result.data.feedback) && result.data.feedback.length > 0 && angular.isDefined(myevent) && myevent.length > 0) {
						angular.forEach(result.data.feedback, function (data, index) {
							angular.forEach(myevent, function (mdata, mindex) {
								if (angular.isDefined(mdata.meeting_id) && data.slot_id == mdata.meeting_id && data.event_id == mdata.meeting_id && data.event_type == 'meeting') {
									if (angular.isUndefined(mdata.feedback)) {
										mdata.feedback = [];
									}
									if ($scope.meetings.userdata.user_id == data.user_id) {
										mdata.feedview = 1;
									}
									mdata.feedback.push(angular.copy(data));
								} else if (angular.isDefined(mdata.event_id) && data.slot_id == mdata.slot_id && data.event_id == mdata.event_id && data.event_type == mdata.event_type && angular.isUndefined(mdata.event_from)) {
									if (angular.isUndefined(mdata.feedback)) {
										mdata.feedback = [];
									}
									if ($scope.meetings.userdata.user_id == data.user_id) {
										mdata.feedview = 1;
									}
									mdata.feedback.push(angular.copy(data));
								}

							});
						});
					}

					if (angular.isDefined(result.data.rating) && result.data.rating.length > 0 && angular.isDefined(myevent) && myevent.length > 0) {
						angular.forEach(result.data.rating, function (data, index) {
							angular.forEach(myevent, function (mdata, mindex) {
								if (angular.isDefined(mdata.meeting_id) && data.slot_id == mdata.meeting_id && data.event_id == mdata.meeting_id && data.event_type == 'meeting') {
									mdata.rating = angular.copy(data);
								} else if (angular.isDefined(mdata.event_id) && data.slot_id == mdata.slot_id && data.event_id == mdata.event_id && data.event_type == mdata.event_type && angular.isUndefined(mdata.event_from)) {
									mdata.rating = angular.copy(data);
								}

							});
						});
					}

					if (angular.isDefined(result.data.notes) && result.data.notes.length > 0 && angular.isDefined(myevent) && myevent.length > 0) {
						angular.forEach(result.data.notes, function (data, index) {
							angular.forEach(myevent, function (mdata, mindex) {
								if (angular.isDefined(mdata.meeting_id) && data.slot_id == mdata.meeting_id && data.event_id == mdata.meeting_id && data.event_type == 'meeting') {
									mdata.notes = angular.copy(data);
								} else if (angular.isDefined(mdata.event_id) && data.slot_id == mdata.slot_id && data.event_id == mdata.event_id && data.event_type == mdata.event_type && angular.isUndefined(mdata.event_from)) {
									mdata.notes = angular.copy(data);
								}

							});
						});
					}

					if (angular.isDefined(result.data.followup) && result.data.followup.length > 0 && angular.isDefined(myevent) && myevent.length > 0) {
						angular.forEach(result.data.followup, function (data, index) {
							angular.forEach(myevent, function (mdata, mindex) {
								if (angular.isDefined(mdata.meeting_id) && data.slot_id == mdata.meeting_id && data.event_id == mdata.meeting_id && data.event_type == 'meeting') {
									if (angular.isUndefined(mdata.followup)) {
										mdata.followup = [];
									}

									if (data.user_id == $scope.meetings.userdata.user_id) {
										mdata.followexist = 1;
										mdata.followup.push(angular.copy(data));
									} else if (angular.isDefined(data.user_id) && angular.isDefined(data.request_to) && angular.isDefined($scope.meetings.userdata) &&
										angular.isDefined($scope.meetings.userdata.user_type) && ($scope.meetings.userdata.user_type == data.request_to ||
											data.request_to == '4')) {

										mdata.followup.push(angular.copy(data));
									}
								} else if (angular.isDefined(mdata.event_id) && data.slot_id == mdata.slot_id && data.event_id == mdata.event_id && data.event_type == mdata.event_type && angular.isUndefined(mdata.event_from)) {
									if (angular.isUndefined(mdata.followup)) {
										mdata.followup = [];
									}

									if (data.user_id == $scope.meetings.userdata.user_id) {
										mdata.followexist = 1;
										mdata.followup.push(angular.copy(data));
									} else if (angular.isDefined(data.user_id) && angular.isDefined(data.request_to) && angular.isDefined($scope.meetings.userdata) &&
										angular.isDefined($scope.meetings.userdata.user_type) && ($scope.meetings.userdata.user_type == data.request_to ||
											data.request_to == '4')) {

										mdata.followup.push(angular.copy(data));
									}
								}

							});
						});
					}
					angular.forEach(myevent, function (mdata, mindex) {
						if (angular.isDefined(mdata.event_from) && mdata.event_from == "live") {
							mdata.date = new Date(mdata.event_time);
						}
						if (angular.isUndefined(mdata.event_from)) {
							if (angular.isDefined($scope.meetings.userdata.user_type) && ($scope.meetings.userdata.user_type == 1 || $scope.meetings.userdata.user_type == '1')) {
								if (angular.isDefined(mdata.sponsor_id) && angular.isDefined(mdata.sponsor_name) && mdata.sponsor_name != '' && mdata.sponsor_id != '') {
									if (angular.isUndefined(mdata.requestuser)) {
										mdata.requestuser = [];
									}
									var obj = new Object();
									obj.user_type = 3;
									obj.user_name = mdata.sponsor_name;
									obj.user_id = mdata.sponsor_id;
									mdata.requestuser.push(obj);
								}
								if (angular.isDefined(mdata.corp_id) && angular.isDefined(mdata.ticker) && angular.isDefined(mdata.corporate_name) &&
									mdata.corporate_name != '' && mdata.ticker != '') {
									if (angular.isUndefined(mdata.requestuser)) {
										mdata.requestuser = [];
									}
									var obj = new Object();
									obj.user_type = 2;
									obj.user_name = mdata.corporate_name;
									obj.user_id = mdata.corp_id;
									mdata.requestuser.push(obj);
								}
								if (angular.isDefined(mdata.requestuser) && mdata.requestuser.length == 2) {
									var obj = new Object();
									obj.user_type = 4;
									obj.user_name = 'Both';
									mdata.requestuser.push(obj);
								}
								if (angular.isDefined(mdata.created_to_details) && angular.isDefined(mdata.created_to_details.user_id) &&
									angular.isDefined(mdata.created_to_details.firstname) && mdata.created_to_details.firstname != '' &&
									angular.isDefined(mdata.created_to_details.user_type) && mdata.created_to_details.user_type != '') {
									if (angular.isUndefined(mdata.requestuser)) {
										mdata.requestuser = [];
									}
									var obj = new Object();
									obj.user_type = parseInt(mdata.created_to_details.user_type);
									obj.user_name = mdata.created_to_details.firstname;
									obj.user_id = mdata.created_to_details.user_id;
									mdata.requestuser.push(obj);
								}
							} else if (angular.isDefined($scope.meetings.userdata.user_type) && ($scope.meetings.userdata.user_type == 2 || $scope.meetings.userdata.user_type == '2')) {
								if (angular.isDefined(mdata.investor_id) && angular.isDefined(mdata.investor_name) && mdata.investor_name != '' && mdata.investor_id != '') {
									if (angular.isUndefined(mdata.requestuser)) {
										mdata.requestuser = [];
									}
									var obj = new Object();
									obj.user_type = 1;
									obj.user_name = mdata.investor_name;
									obj.user_id = mdata.investor_id;
									mdata.requestuser.push(obj);
								}
								if (angular.isDefined(mdata.sponsor_id) && angular.isDefined(mdata.sponsor_name) && mdata.sponsor_name != '' && mdata.sponsor_id != '') {
									if (angular.isUndefined(mdata.requestuser)) {
										mdata.requestuser = [];
									}
									var obj = new Object();
									obj.user_type = 3;
									obj.user_name = mdata.sponsor_name;
									obj.user_id = mdata.sponsor_id;
									mdata.requestuser.push(obj);
								}
								if (angular.isDefined(mdata.requestuser) && mdata.requestuser.length == 2) {
									var obj = new Object();
									obj.user_type = 4;
									obj.user_name = 'Both';
									mdata.requestuser.push(obj);
								}
								if (angular.isDefined(mdata.created_to_details) && angular.isDefined(mdata.created_to_details.user_id) &&
									angular.isDefined(mdata.created_to_details.firstname) && mdata.created_to_details.firstname != '' &&
									angular.isDefined(mdata.created_to_details.user_type) && mdata.created_to_details.user_type != '') {
									if (angular.isUndefined(mdata.requestuser)) {
										mdata.requestuser = [];
									}
									var obj = new Object();
									obj.user_type = parseInt(mdata.created_to_details.user_type);
									obj.user_name = mdata.created_to_details.firstname;
									obj.user_id = mdata.created_to_details.user_id;
									mdata.requestuser.push(obj);
								}
							} else if (angular.isDefined($scope.meetings.userdata.user_type) && ($scope.meetings.userdata.user_type == 3 || $scope.meetings.userdata.user_type == '3')) {
								if (angular.isDefined(mdata.investor_id) && angular.isDefined(mdata.investor_name) && mdata.investor_name != '' && mdata.investor_id != '') {
									if (angular.isUndefined(mdata.requestuser)) {
										mdata.requestuser = [];
									}
									var obj = new Object();
									obj.user_type = 1;
									obj.user_name = mdata.investor_name;
									obj.user_id = mdata.investor_id;
									mdata.requestuser.push(obj);
								}
								if (angular.isDefined(mdata.corp_id) && angular.isDefined(mdata.ticker) && angular.isDefined(mdata.corporate_name) && mdata.corporate_name != '' && mdata.ticker != '') {
									if (angular.isUndefined(mdata.requestuser)) {
										mdata.requestuser = [];
									}
									var obj = new Object();
									obj.user_type = 2;
									obj.user_name = mdata.corporate_name;
									obj.user_id = mdata.corp_id;
									mdata.requestuser.push(obj);
								}
								if (angular.isDefined(mdata.requestuser) && mdata.requestuser.length == 2) {
									var obj = new Object();
									obj.user_type = 4;
									obj.user_name = 'Both';
									mdata.requestuser.push(obj);
								}
								if (angular.isDefined(mdata.created_to_details) && angular.isDefined(mdata.created_to_details.user_id) &&
									angular.isDefined(mdata.created_to_details.firstname) && mdata.created_to_details.firstname != '' &&
									angular.isDefined(mdata.created_to_details.user_type) && mdata.created_to_details.user_type != '') {
									if (angular.isUndefined(mdata.requestuser)) {
										mdata.requestuser = [];
									}
									var obj = new Object();
									obj.user_type = parseInt(mdata.created_to_details.user_type);
									obj.user_name = mdata.created_to_details.firstname;
									obj.user_id = mdata.created_to_details.user_id;
									mdata.requestuser.push(obj);
								}
							}
						}
					});
				}
				$scope.events.my_events = myevent;
				$scope.spinnerActive = false;
				if (angular.isDefined($scope.searchbox) && $scope.searchbox != '') {
					$scope.meetinghistory = angular.copy($scope.searchbox);
				} else {
					$scope.meetinghistory = "";
				}

			});
		}
		$scope.clickedit = function () {
			$scope.getpvtnotes = true;
		}
		$scope.savenotes = function () {
			var url = 'apiv4/public/meeting/meetings_archive_noteupdate';
			var params = {
				data: $scope.meetingDetailview
			};
			$scope.popup_spinnerActive = true;
			RequestDetail.getDetail(url, params).then(function (result) {
				if (parseInt(result.data) == '0') {
					$scope.getpvtnotes = false;
					$scope.popup_spinnerActive = false;
				}
			});

		}
		$scope.removetick = function () {
			$scope.$apply(function () {
				$scope.meetingSelected = -1;
			})
		}
		$scope.closenotes = function () {
			$scope.getpvtnotes = false;
		}
		$scope.searchMeetingarchive = function () {
			$scope.showMeetingarchive = false;
			$scope.get_meetings_archive();
		}

		$scope.get_meetings_archive();

		//Meeting archive detail view
		$scope.getArchivedetails = function (archive) {

			$scope.spinnerActive = true;
			$scope.meetingSelected = -1;
			$scope.meetingDetailview = {};
			if ($scope.events.my_events.indexOf(archive) >= 0) {
				$scope.meetingSelected = $scope.events.my_events.indexOf(archive);
				angular.forEach($scope.events.my_events, function (eve, ind) {
					if (ind == $scope.meetingSelected) {
						$scope.meetingDetailview = eve;
					}
				});
			}

			$scope.spinnerActive = false;
		}


		$scope.archivedmeeting = function () {
			$location.path('/meetingArchive');
		}

		$scope.aggregatemeeting = function () {
			$location.path('/meetingArchive/aggregate');
		}


	}).controller('aggregateMeetingCtrl', function ($scope, $http, $location, RequestDetail, localStorageService, alertService, configdetails, $window) {
		$scope.configdetails = configdetails;
		$scope.pageHeading = 'Investor Analytics';

		$scope.spinnerActive = true;

		$scope.result_row = [];

		$scope.non_owners = [];
		$scope.owners_buy = [];
		$scope.owners_sell = [];

		$scope.active_year = 0;

		$scope.filter_target = "";
		$scope.filter_active_passive = "";

		$scope.filter_target_from = "";
		$scope.filter_target_to = "";
		$scope.filter_confidance_from = "";
		$scope.filter_confidance_to = "";

		$scope.filter_region = "";
		$scope.filter_aum = "";
		$scope.filter_institution = "";

		var localUserdata = localStorageService.get('userdata');
		$scope.ticker = localUserdata.ticker;

		$scope.iframeHeight = $window.innerHeight - 380;




		$scope.openmodelleads1 = function () {
			$scope.showModalleads1 = !$scope.showModalleads1;
		}

		$scope.openmodelleads2 = function () {
			$scope.showModalleads2 = !$scope.showModalleads2;
		}

		$scope.openmodelleads3 = function () {
			$scope.showModalleads3 = !$scope.showModalleads3;
		}

		$scope.showModalpageinfo = false;

		$scope.openmodelpagehelp = function () {
			$scope.showModalpageinfo = !$scope.showModalpageinfo;
		}
		$scope.closemodelpagehelp = function () {
			$scope.showModalpageinfo = false;
		}


		$scope.nodatatext = '-- Loading --';
		$scope.recommend = [];

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
				$scope.reverse2 = true;
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


		// COLUMN TO SORT
		$scope.column3 = 'sno';

		// SORT ORDERING (ASCENDING OR DESCENDING). SET TRUE FOR DESENDING
		$scope.reverse3 = false;

		// CALLED ON HEADER CLICK
		$scope.sortColumn3 = function (col) {
			$scope.column3 = col;
			if ($scope.reverse3) {
				$scope.reverse3 = false;
				$scope.reverseclass3 = 'arrow-up';
			} else {
				$scope.reverse3 = true;
				$scope.reverseclass3 = 'arrow-down';
			}
		};

		$scope.sortClass3 = function (col) {
			if ($scope.column3 == col) {
				if ($scope.reverse3) {
					return 'arrow-down';
				} else {
					return 'arrow-up';
				}
			} else {
				return '';
			}
		};

		$scope.predicted_recommed = function (count) {

			$scope.spinnerActive = true;
			//filter_region filter_aum filter_target filter_institution filter_confidance
			$scope.active_year = 0; // default for filter

			var url = 'apiv4/public/meeting/predicted_recommed';
			var params = {
				count: count,
				ticker:$scope.ticker
			};

			RequestDetail.getDetail(url, params).then(function (result) {

				$scope.result_row = result.data.result_row;
				$scope.recommend = $scope.result_row[0]; // default for filter

				if (count == 0) {
					$scope.non_owners = result.data.non_owners;
					$scope.owners_buy = result.data.owners_buy;
					$scope.owners_sell = result.data.owners_sell;
					$scope.predicted_recommed(1);
				} else {

					angular.forEach(result.data.non_owners, function (col, index) {
						$scope.non_owners.push(col);
					});
					angular.forEach(result.data.owners_buy, function (col, index) {
						$scope.owners_buy.push(col);
					});
					angular.forEach(result.data.owners_sell, function (col, index) {
						$scope.owners_sell.push(col);
					});

				}



				$scope.nodatatext = '-- No Data --';

				$(".vertical-scroll").mCustomScrollbar({
					scrollButtons: {
						enable: true
					},
					theme: "dark-3"
				});
				$scope.spinnerActive = false;
			});
		}

		// $scope.regions = [];

		// var url = 'apiv4/public/meeting/getfilter_region';
		// var params = {};
		// RequestDetail.getDetail(url,params).then(function(result){
		// $scope.regions = result.data;

		// });

		$scope.sidepopupactive = false;

		$scope.sidepopup = function () {
			$scope.sidepopupactive = !$scope.sidepopupactive;
		}

		$scope.title_row = ['Investor Name, City & State - Region'];




		$scope.showthisq = function (recommend, index) {

			localStorageService.set('Predictedleadsrecommend', recommend);
			localStorageService.set('Predictedleadsindex', index);


			$scope.spinnerActive = true;


			$scope.non_owners = [];
			$scope.owners_buy = [];
			$scope.owners_sell = [];

			$scope.nodatatext = '-- Loading --';

			if (index != 'filter') {
				$scope.active_year = index;
			}
			if (recommend != 'filter') {
				$scope.recommend = recommend;
			}
			if ($scope.active_year == 0) {
				$scope.title_row = ['Investor Name, City & State - Region'];
			} else {
				// $scope.title_row = ['Investor Name','Accuracy','Change in Ownership','Shares Owned']; 
				$scope.title_row = ['Investor Name, City & State - Region'];
			}

			if ($scope.filter_target == 1) {
				$scope.filter_target_from = 1000000000;
				$scope.filter_target_to = 99999999999;
			} else if ($scope.filter_target == 2) {
				$scope.filter_target_from = 10000000;
				$scope.filter_target_to = 999999999;

			} else if ($scope.filter_target == 3) {
				$scope.filter_target_from = 100000;
				$scope.filter_target_to = 9999999;
			} else {
				$scope.filter_target_from = "";
				$scope.filter_target_to = "";
			}



			if ($scope.filter_aum == 1) {
				$scope.filter_aum_from = 0;
				$scope.filter_aum_to = 50000000;
			} else if ($scope.filter_aum == 2) {
				$scope.filter_aum_from = 50000000;
				$scope.filter_aum_to = 500000000;
			} else if ($scope.filter_aum == 3) {
				$scope.filter_aum_from = 500000000;
				$scope.filter_aum_to = 2000000000;
			} else if ($scope.filter_aum == 4) {
				$scope.filter_aum_from = 2000000000;
				$scope.filter_aum_to = 10000000000;
			} else if ($scope.filter_aum == 5) {
				$scope.filter_aum_from = 10000000000;
				$scope.filter_aum_to = 50000000000;
			} else if ($scope.filter_aum == 6) {
				$scope.filter_aum_from = 50000000000;
				$scope.filter_aum_to = 99999999999999999999;
			} else {
				$scope.filter_aum_from = "";
				$scope.filter_aum_to = "";
			}





			if ($scope.filter_confidance == 2) {
				$scope.filter_confidance_from = 85;
				$scope.filter_confidance_to = "";
			} else if ($scope.filter_confidance == 3) {
				$scope.filter_confidance_from = 70;
				$scope.filter_confidance_to = "";
			} else if ($scope.filter_confidance == 4) {
				$scope.filter_confidance_from = 55;
				$scope.filter_confidance_to = "";
			} else if ($scope.filter_confidance == 5) {
				$scope.filter_confidance_from = 40;
				$scope.filter_confidance_to = "";
			} else if ($scope.filter_confidance == 6) {
				$scope.filter_confidance_from = "";
				$scope.filter_confidance_to = 40;
			} else {
				$scope.filter_confidance_from = "";
				$scope.filter_confidance_to = "";
			}


			var url = 'apiv4/public/meeting/predicted_recommed_this';
			var params = {
				filter_target_from: $scope.filter_target_from,
				filter_target_to: $scope.filter_target_to,
				filter_confidance_from: $scope.filter_confidance_from,
				filter_confidance_to: $scope.filter_confidance_to,
				date: $scope.recommend,
				filter_region: $scope.filter_region,
				filter_aum: $scope.filter_aum,
				filter_institution: $scope.filter_institution,
				filter_aum_from: $scope.filter_aum_from,
				filter_aum_to: $scope.filter_aum_to,
				filter_active_passive: $scope.filter_active_passive,
				ticker:$scope.ticker
			};


			RequestDetail.getDetail(url, params).then(function (result) {
				$scope.result_row = result.data.result_row;


				$scope.non_owners = result.data.non_owners;
				$scope.owners_buy = result.data.owners_buy;
				$scope.owners_sell = result.data.owners_sell;
				$scope.nodatatext = '-- No Data --';
				$scope.spinnerActive = false;


				if (index == 0) {
					$scope.predicted_recommed(1)
				}

				$(".vertical-scroll").mCustomScrollbar({
					scrollButtons: {
						enable: true
					},
					theme: "dark-3"
				});
			});

		}

		$scope.clearshowthisq = function () {
			$scope.filter_region = "";
			$scope.filter_aum = "";
			$scope.filter_target = "";
			$scope.filter_institution = "";
			$scope.filter_confidance = "";
			$scope.filter_active_passive = "";

			$scope.predicted_recommed(0);
		}



		if (angular.isDefined(localStorageService.get('Predictedleadsrecommend')) && angular.isDefined(localStorageService.get('Predictedleadsindex')) && localStorageService.get('Predictedleadsrecommend') != null && localStorageService.get('Predictedleadsindex') != null && localStorageService.get('Predictedleadsrecommend') != 'filter' && localStorageService.get('Predictedleadsindex') != 'filter') {
			$scope.showthisq(localStorageService.get('Predictedleadsrecommend'), localStorageService.get('Predictedleadsindex'));
		} else {
			$scope.predicted_recommed(0);

		}

		$scope.downloadexcel = function (recommend, index) {
			var url = 'apiv4/public/meeting/downloadexcelrecommend';
			var params = {};
			RequestDetail.getDetail(url, params).then(function (result) {

			});
		}


		$scope.investerpage = function (val) {
			localStorageService.set('Predictedleadsinvestor_name', val.investor_name);
			localStorageService.set('Predictedleadsscores', val.scores);
			localStorageService.set('Predictedleadstarget', val.target);
			$location.path('Predictedleads/' + val.fund_id + '/' + $scope.ticker);
		}



		//	$scope.showRecommendationModal = true;

		/*$scope.showmodal_stock=function(meeting){
		$scope.recommendation = [];
		var url = 'apiv4/public/meeting/meetings_aggregate_details';
		var params = {data:meeting};
		RequestDetail.getDetail(url,params).then(function(result){
			
			$scope.recommendation.recommend_name = result.data.recommend.investor_name;
			$scope.recommendation.recommend =result.data.recommend.recommend;
			$scope.recommendation.ticker =result.data.recommend.ticker;
			
			$scope.recommendation.factors = result.data.recommend.factors;
			
			$scope.recommendation.other_buys = result.data.recommend.other_buys;
			$scope.recommendation.other_increments = result.data.recommend.other_increments;
			$scope.recommendation.other_decrements = result.data.recommend.other_decrements;
			
			
		
			
			$scope.showRecommendationModal = true;
			
			
		});
	}
	
	
	$scope.corporates_row = [];
	$scope.other_buys = [];
	$scope.other_increments = [];
	$scope.other_decrements = [];
	
	$scope.nodatatext = '-- Loading --';
	
	
	var url = 'apiv4/public/meeting/meetings_aggregate';
	var params = {};
    RequestDetail.getDetail(url,params).then(function(result){
		$scope.corporates_row = result.data.corporates_row;
		$scope.other_buys = result.data.other_buys;
		$scope.other_increments = result.data.other_increments;
		$scope.other_decrements = result.data.other_decrements;
		$scope.nodatatext = '-- No Data --';		
	});*/





		/*$scope.search_recommend=function(index){
			if(index==1){
				var search_text= $scope.search_non_owners;
			}else if(index==2){
				var search_text= $scope.search_owners_buy;
			}else{
				var search_text= $scope.search_owners_sell;
			}
			var url = 'apiv4/public/meeting/predicted_recommed_search';
			var params = {search_text:search_text,index:index};
			RequestDetail.getDetail(url,params).then(function(result){
				 if(index==1){
					$scope.non_owners = result.data.non_owners;
				}else if(index==2){
					$scope.owners_buy = result.data.owners_buy;
				}else{
					$scope.owners_sell = result.data.owners_sell;
				}	
				
			});
		}*/



	}).controller('aggregateMeetinganalyticsCtrl', function ($scope, $http, $location, RequestDetail, localStorageService, alertService, configdetails, $routeParams, $sce, $timeout) {

		$scope.pageHeading = 'Investor Analytics';
		$scope.pagetitle = 'Factors of Influence';
		$scope.breadcrumb = 'Target';
		$scope.ticker = 'AMZN';
		$scope.fund_id = 0;

		if (!angular.isUndefined($routeParams.fund_id)) {
			$scope.fund_id = $routeParams.fund_id;
			$scope.fundid = $routeParams.fund_id;
		}

		 
		$scope.Predictedleadsinvestor_name = "";
		$scope.Predictedleadsscores = "";
		$scope.Predictedleadstarget = "";

		if (localStorageService.get('Predictedleadsinvestor_name') != "" && !angular.isUndefined(localStorageService.get('Predictedleadsinvestor_name'))) {
			$scope.Predictedleadsinvestor_name = localStorageService.get('Predictedleadsinvestor_name');

			//console.log($scope.Predictedleadsinvestor_name);
		}
		if (localStorageService.get('Predictedleadsscores') != "" && !angular.isUndefined(localStorageService.get('Predictedleadsscores'))) {
			$scope.Predictedleadsscores = localStorageService.get('Predictedleadsscores') + '%';
		}
		if (localStorageService.get('Predictedleadstarget') != "" && !angular.isUndefined(localStorageService.get('Predictedleadstarget'))) {
			$scope.Predictedleadstarget = localStorageService.get('Predictedleadstarget');
		}

		$scope.showModalpageinfo = false;

		$scope.openmodelpagehelp = function () {
			$scope.showModalpageinfo = !$scope.showModalpageinfo;
		}  


		
		var localUserdata = localStorageService.get('userdata');
		$scope.ticker = localUserdata.ticker;

		if (!angular.isUndefined($routeParams.ticker)) {
			$scope.ticker = $routeParams.ticker;
		}

		$scope.spinnerActive = true;
		
		$timeout(function () {
			$scope.spinnerActive = false;
		}, 5000);	

		

	})
	.controller('meeting_recommendanalyticsCtrl', function ($scope, $http, $location, RequestDetail, localStorageService, alertService, configdetails, $routeParams, $sce) {

		$scope.fund_id = 0;
		$scope.other_buys = [];
		$scope.other_increments = [];
		$scope.other_decrements = [];
		$scope.listmeetings = [];

		$scope.dashboardurl = 'http://40.71.102.38:8000/';
		//CHECK THE APPLICATION IS PRODUCTION OR OTHER
		if (window.location.host == 'www.intro-act.com') {
			$scope.dashboardurl = 'https://reports.intro-act.com/';
		}

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
		var dashboardId = 'c4571e56-e150-4434-a729-77bf695a6c75';

		/*var Url = 'apiv4/public/meeting/getfundinvestorid';		
		var params = {id:$scope.ticker};	
		RequestDetail.getDetail(Url,params).then(function(result){
			$scope.fundid=result.data.id;
			var dash_url = 'http://40.71.102.38:8000/dashboard/'+dashboardId+'?e=false&vo=viewonly&fund='+$scope.fundid;
		});*/
		// $scope.currentDashboardUrl = $sce.trustAsResourceUrl(dash_url);

		//LOGIN DISABLED DUE TO CORS ISSUE
		// var res = $http({
		// //url:'http://intro-act.eastus.cloudapp.azure.com:8090/apiv4/public/LogOn/token',
		// url:'http://40.71.102.38:8000/apiv4/public/LogOn/token',
		// method:"POST",
		// data    : $.param(data),
		// headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
		// });

		// res.success(function (data, status, headers, config) {
		// //var dash_url = 'http://intro-act.eastus.cloudapp.azure.com:8090/dashboard/'+dashboardId+'?e=false&vo=viewonly&logonTokenId=' +data.logOnToken;
		// var dash_url = 'http://40.71.102.38:8000/dashboard/'+dashboardId+'?e=false&vo=viewonly&fund='+$scope.fundid;
		// $scope.currentDashboardUrl = $sce.trustAsResourceUrl(dash_url);
		// });

		var Url = 'apiv4/public/meeting/getfactorscorporate';
		var params = {};
		RequestDetail.getDetail(Url, params).then(function (result) {
			$scope.fund_id = result.data.fund_id;
			$scope.other_buys = result.data.other_buys;
			$scope.other_increments = result.data.other_increments;
			$scope.other_decrements = result.data.other_decrements;
			var dash_url = $scope.dashboardurl + 'dashboard/' + dashboardId + '?e=false&vo=viewonly&fund=' + $scope.fund_id;
			$scope.currentDashboardUrl = $sce.trustAsResourceUrl(dash_url);
		});

	})
	.controller('factorsofinfluenceCtrl', function ($scope, $http, $location, RequestDetail, localStorageService, alertService, configdetails, $routeParams, $sce, $timeout) {

		var localUserdata = localStorageService.get('userdata');
		$scope.ticker = localUserdata.ticker;
		// $scope.ticker = 'AMZN';
		$scope.pagetitle = 'Factors of Influence';
		$scope.breadcrumb = 'Target';

		$scope.showModalpageinfo = false;

		$scope.openmodelpagehelp = function () {
			$scope.showModalpageinfo = !$scope.showModalpageinfo;
		}
		$scope.closemodelpagehelp = function () {
			$scope.showModalpageinfo = false;
		}

		$scope.spinnerActive = true;
		
		$timeout(function () {
			$scope.spinnerActive = false;
		}, 5000);

		$scope.fundid = 'F72998';

	})
	.controller('investoranalyticsCtrl', function ($scope, $http, $location, RequestDetail, localStorageService, alertService, configdetails, $routeParams, $sce) {

		$scope.pageHeading = 'Investor Analytics';
		$scope.pagetitle = 'Investor Analytics';
		$scope.breadcrumb = 'Target';
		$scope.ticker = 'AMZN';
		$scope.investor_id = 0;

		if (!angular.isUndefined($routeParams.investorId)) {
			$scope.investor_id = $routeParams.investorId;
		}

		$scope.spinnerActive = true;

		var Url = 'apiv4/public/meeting/getallinvestereventsid';
		var params = {
			key: 'tags',
			id: $scope.investor_id
		};
		RequestDetail.getDetail(Url, params).then(function (result) {
			$scope.listmeetings = result.data;
			$scope.spinnerActive = false;
		});


		function getInvitations() {
			$scope.invitations = {};
			$scope.user_id = '';

			// Here some controls are for Investor dashboard
			var getInvestorsMeeting = 'apiv4/public/meeting/getInvestorsMeeting';
			var params = {
				type: 'get',
				investor_id: $scope.investor_id
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

					if (angular.isDefined(result.data.user_details) && result.data.user_details != null) {
						$scope.investor_name = result.data.user_details.firstname + ' ' + result.data.user_details.lastname;
						// //console.log(result.data.user_details);
					}

					$scope.invitations.meetingList = meeting_data;

					////console.log($scope.invitations.meetingList);
					var user_data = localStorageService.get('userdata');
					$scope.user_id = user_data.user_id;
				}



			});
		}
		getInvitations();

		$scope.showmodal1 = function (showpopup, meeting) {

			$scope.currentindex = -1;
			$scope.feedback = {};
			$scope.note = {};
			$scope.followup = {};
			$scope.feedbackdata = [];
			$scope.followupdata = [];
			$scope.update = true;
			$scope.note = meeting;
			$scope.note.comments = meeting.notes;
			$scope.noteModal = true;
		}

		$scope.update_notes = function (data) {
			if (angular.isUndefined($scope.note.comments) || $scope.note.comments == '') {
				alertService.add("warning", "Enter any comments to update!", 2000);
				return false;
			}
			var url = 'apiv4/public/meeting/update_notes';
			var params = {
				data: $scope.note
			};
			RequestDetail.getDetail(url, params).then(function (result) {



				if (angular.isDefined(result.data) && angular.isDefined(result.data.event_id)) {
					alertService.add("success", "Notes updated successfully!", 2000);
					$scope.noteModal = !$scope.noteModal;
					$route.reload();
					//$scope.events.my_events[$scope.currentindex].notes=angular.copy(result.data);
				} else {
					alertService.add("warning", "Not updated Try again!", 2000);
				}
			});
		}

		$scope.dashboardurl = 'http://40.71.102.38:8000/';
		//CHECK THE APPLICATION IS PRODUCTION OR OTHER
		if (window.location.host == 'www.intro-act.com') {
			$scope.dashboardurl = 'https://reports.intro-act.com/';
		}


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

		var dashboardId = '63ca33a9-63d5-42bf-b44d-4d2bbb50d05d';
		var localUserdata = localStorageService.get('userdata');
		$scope.ticker = localUserdata.ticker;

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
			if ($scope.investor_id) {
				var dash_url = $scope.dashboardurl + 'dashboard/' + dashboardId + '?e=false&vo=viewonly&ticker=' + $scope.ticker + '&fund=' + $scope.investor_id;
			} else {
				var dash_url = $scope.dashboardurl + 'dashboard/' + dashboardId + '?e=false&vo=viewonly&ticker=' + $scope.ticker;
			}
			$scope.currentDashboardUrl = $sce.trustAsResourceUrl(dash_url);
		});

	})

	.controller('industryMeeting', function($scope,$http,$location,localStorageService,$rootScope,usertype,$routeParams,$sce,configdetails,$timeout) {
		$scope.configdetails=configdetails;
		$scope.pageHeading = 'Meeting Preparation';
		$scope.meetingPrepareActive = 'active';
		
		
		
		$scope.dashboardTitle = 'Investor Base Characteristics';
		var localUserdata = localStorageService.get('userdata');
		$scope.ticker = localUserdata.ticker;
		
		
		//$routeParams.fundId
	
		$scope.spinnerActive = true;
			
		$timeout(function () {
			$scope.spinnerActive = false;
		}, 5000);
		
		$scope.activepan = 1;
	
		$scope.activetab = function (count) {
			$scope.activepan = count;
		}
	
	  
	})
	.controller('meetingInvestment', function($scope,$http,$location,localStorageService,$rootScope,usertype,configdetails) {
		$scope.configdetails=configdetails;
		$scope.meetingInvestmentActive = 'active';
	
	})
	.controller('dashboardData', function($scope,$http,$location,localStorageService,$rootScope,usertype,$routeParams,$sce,configdetails,RequestDetail) {
		$scope.configdetails=configdetails;
		$scope.pageHeading = 'Meeting Preparation';
		$scope.meetingPrepareActive = 'active';
		
		var dashboardId = $routeParams.dashboardId;
		//var data = {accountName: 'anon_user', password: 'anon_P@ss', isWindowsLogOn: false};
		//var Tokenurl = 'http://intro-act.eastus.cloudapp.azure.com:8090/apiv4/public/LogOn/token';
		
		$scope.dashboardurl = 'http://40.71.102.38:8000/';
		//CHECK THE APPLICATION IS PRODUCTION OR OTHER
		if(window.location.host=='www.intro-act.com'){
			$scope.dashboardurl = 'https://reports.intro-act.com/';
		}
		
		var data = {accountName: 'anon_user', password: 'anon_P@ss', isWindowsLogOn: false};
		var Tokenurl = $scope.dashboardurl+'apiv4/public/LogOn/token';
		
		var dashboardId = '';
		var dashboardTitle = '';
		var localUserdata = localStorageService.get('userdata');
		
		$scope.dashboardTitle = "";
		
		$scope.backlink = "";
		
		var url = 'apiv4/public/researchprovider/get_dashboard';
		var params = {dashboard_id:$routeParams.dashboardId};
		RequestDetail.getDetail(url,params).then(function(result){
			
			var dash_url = result.data.dashboard_url;
			//console.log(result.data.type);
			//Check the type of dashboard is iframe or custom
			if(result.data.type=='custom'){
				$location.path(dash_url);
			}
			
			if(result.data.title=='Macro Dashboard'){
				$scope.backlink = "#/research_comments/macro";
			}
			if(result.data.title=='Revisions Dashboard'){
				$scope.backlink = "#/research_comments/revision";
			}
			if(result.data.title=='Outliers Dashboard'){
				$scope.backlink = "#/research_comments/outlier";
			}
			if(result.data.title=='Themes Dashboard'){
				$scope.backlink = "#/research_comments/thematic";
			}
	
			$scope.dash_url = result.data.dashboard_url;
			
			dashboardTitle = result.data.title;
			$scope.dashboardTitle = result.data.title;
			$scope.benchmarkActive = 'inner-active';
			
			//LOGIN DISABLED DUE TO CORS ISSUE
			var res = $http({
				url:$scope.dashboardurl+'apiv4/public/LogOn/token',
				method:"POST",
				data    : $.param(data),
				headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
			});
		
			res.success(function (data, status, headers, config) {
				$scope.currentDashboardUrl = $sce.trustAsResourceUrl($scope.dash_url);
				$scope.currentDashboardTitle = dashboardTitle;
				
			});
			
		});
	  
	})