'use strict';

angular.module('myApp.eventCtrl', [])
	.controller('eventCtrl', function ($scope, $http, $location, RequestDetail, localStorageService, configdetails) {
		$scope.configdetails = configdetails;

		$scope.pageHeading = 'Events';
		$scope.dasboardActive = 'active';

		$scope.popupMsg = '';
		$scope.popupMsgTitle = '';
		$scope.investorsList = '';
		$scope.excelFile = '';
		$scope.corporate = {};


		$scope.show_dashboard = function () {
			$location.path('dashboard');
		}
		$scope.file_changed = function (element, $scope) {
			var tmppath = URL.createObjectURL(event.target.files[0]);
			$("#fileSubmit").submit();
		}

		$scope.formDataFun = function () {
			var datastring = $("#formData").serialize();
		}

		$scope.acceptInvitaion = function () {
			$scope.popupMsg = "ACCEPT";
			$scope.popupMsgClass = "green";
			$scope.popupMsgTitle = "Accept Invitation";
			$scope.showModal = !$scope.showModal;
		}

		$scope.declineInvitaion = function () {
			$scope.popupMsg = "DECLINE";
			$scope.popupMsgClass = "red";
			$scope.popupMsgTitle = "Decline Invitation";
			$scope.showModal = !$scope.showModal;
		}

		$scope.cancelInvitaion = function () {
			$scope.showModal = '';
		}
	})

	.controller('newEventCtrl', function ($scope, $http, $location, localStorageService, RequestDetail, alertService, $filter, $timeout, configdetails) {
		$scope.configdetails = configdetails;
		var local = localStorageService;

		//load template
		// The New event type templates are defined here
		$scope.template = {};
		
		if (localStorageService.get('usertype') == 'broker') {
			// $location.path('newevent');
		}
		if (localStorageService.get('usertype') == 'broker') {
			var rootFolder = 'partials/broker/';
			$scope.template.include = rootFolder + 'dealRoadshow.html';
		} else {
			var rootFolder = 'partials/corporate/';
			$scope.template.include = rootFolder + 'ndr.html';
		}
		$scope.changeTemplate = function () {
			$scope.template.include = rootFolder + $scope.cdata.event_type + '.html';
		}
		//load template

		$scope.show_dashboard = function () {
			$location.path('dashboard');
		}

		$scope.showModalpageinfo = false;

		$scope.openmodelpagehelp = function () {
			$scope.showModalpageinfo = !$scope.showModalpageinfo;
		}

		//NDR inputs initialize
		$scope.cdata = {};
		$scope.cdata.event_type = 'collaborated_ndr';
		$scope.changeTemplate();
		$scope.presentaion_file = [];
		$scope.cdata.possibletime = [];
		$scope.cdata.corporatenameslist = [];
		$scope.investerslist = {};
		$scope.cdata.removedids = [];

		$scope.cdata.location_type = 'Physical';
		$scope.cdata.video_url = '';
		$scope.cdata.location_type = 'Physical';

		$scope.tags = {};
		$scope.tags.investers = '';

		$scope.cdata.addinvesterslist = [];
		$scope.industryTagsAdded = [];

		$scope.cdata.earningcallfollow = [];
		$scope.cdata.check = 'no'; //earningsCallfollowup

		//get broker for ndr
		$scope.get_matched_brokers = function () {

			var tagUrl = 'apiv4/public/event/get_matched_brokers';
			var params = {
				company_name: $('#broker_name').val()
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {

				if (angular.isDefined(result.data) && result.data != '') {
					if (result.data == 0) {
						//$('#user').removeClass('hidden');
					} else {
						$("#broker_name").autocomplete({
							source: result.data,
							select: function (a, b) {

								$scope.cdata.broker_name = b.item.value;
								$scope.cdata.broker = b.item.user_id;
								$scope.cdata.broker_mail = b.item.email;
								$scope.cdata.broker_phone = b.item.contact;
							}
						});
						//$('#user').addClass('hidden');
					}
				}
			});
		}

		$scope.cdata.researchproviderslists = [];

		//get broker for ndr
		$scope.get_matched_rps = function () {

			var tagUrl = 'apiv4/public/event/get_matched_rps';
			var params = {
				company_name: $('#rp_name').val()
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {

				if (angular.isDefined(result.data) && result.data != '') {
					//console.log(result.data);
					if (result.data == 0) {
						//$('#user').removeClass('hidden');
					} else {
						$("#rp_name").autocomplete({
							source: result.data,
							select: function (a, b) {

								$scope.cdata.rp_name = b.item.value;

								$scope.rp_user = {
									company: b.item.company_name,
									user_id: b.item.user_id,
									email: b.item.email,
									firstname: b.item.firstname,
									lastname: b.item.lastname,
								};

							}
						});
						//$('#user').addClass('hidden');
					}
				}
			});
		}


		$scope.add_rpuser = function () {
			var email_check = 1;
			angular.forEach($scope.cdata.researchproviderslists, function (con, ind) {
				if(con.email==$scope.rp_user.email){
					email_check = 0;
				}
			});

			
			if (angular.isUndefined($scope.rp_user.email)) {
				alertService.add("warning", "Add Researchprovider!", 2000);
			}else{
				if(email_check){
					$scope.cdata.researchproviderslists.push($scope.rp_user);
				}
			}

			
			$scope.cdata.rp_name = '';
		}

		$scope.removeResearchproviders = function (index) {
			$scope.cdata.researchproviderslists.splice(index, 1);
		}

		//Guest broker open start
		$scope.add_unregistered = function () {
			$scope.cdata.person_company_name = '';
			$scope.cdata.person_name = '';
			$scope.cdata.person_title = '';
			$scope.cdata.broker_mail = '';
			$scope.cdata.broker = '';
			$scope.cdata.person_phone = '';
			$scope.cdata.investorEmail = '';
			$('#broke_value').val('');
			$('#broker_name').val('');
			//$('#user').addClass('hidden');
			//$('#showInvestorModal').modal('show');
			$scope.showInvestorModal = true;
		}
		$scope.closeinvestorModel = function () {
			$scope.showInvestorModal = false;
		}
		//Guest broker open end


		$scope.remove_row = function (index) {
			$scope.corporates.splice(index, 1);
			$scope.enable_disable();
		};
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

		$scope.cdata.videoscreeenshot = [];
		$scope.uploadmodelvideoscreeenshot = function (imgdata) {
			imgdata = JSON.parse(imgdata);
			$scope.cdata.videoscreeenshot = [];
			$scope.$apply(function () {
				$scope.cdata.videoscreeenshot.push({
					file_name: imgdata.filename,
					file_location: imgdata.location
				})
			});
		}

		$scope.removescreenshotFiles = function () {
			$scope.videoscreeenshot = [];
		}


		$scope.removeInvester = function (index) {
			$scope.cdata.addinvesterslist.splice(index, 1);
		}

		//Date Picker
		$scope.inlineOptions = {
			customClass: getDayClass,
			minDate: new Date(),
			showWeeks: true
		};


		$scope.dateOptions = {
			// dateDisabled: disabled,
			formatYear: 'yy',
			maxDate: new Date(2023, 5, 22),
			minDate: new Date(),
			startingDay: 1
		};
		$scope.deaddateOptions = {
			dateDisabled: disabled,
			formatYear: 'yy',
			maxDate: new Date(2023, 5, 22),
			minDate: new Date(),
			startingDay: 1
		};

		// Disable weekend selection
		function disabled(data) {
			// var date = data.date,
			// mode = data.mode;
			// return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6); /* Disable weak days */
		}

		$scope.toggleMin = function () {
			$scope.inlineOptions.minDate = new Date();
			var myDate = new Date();
			//add a day to the date
			myDate.setDate(myDate.getDate() + 1);
			$scope.dateOptions.minDate = myDate;
		};

		//Date popup
		$scope.open1 = function () {
			if ((!$scope.cdata.timezone_id || $scope.cdata.timezone_id == '') && ($scope.cdata.event_type == 'analystDay' || $scope.cdata.event_type == 'earningsCallfollowup' || $scope.cdata.event_type == 'conference' || $scope.cdata.event_type == 'fieldTrip')) {
				alertService.add("warning", "Kindly choose timezone!", 2000);
				return false;
			}
			$scope.minDate = new Date();
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

		$scope.deadline = {
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

		//Timezone setting end


		$scope.check_investors_popup = function () {


			if (angular.isUndefined($scope.cdata.person_company_name) || $scope.cdata.person_company_name == '' || $scope.cdata.person_company_name == null) {
				$('#person_company_name').focus();
				alertService.add("warning", "Enter Company name!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.cdata.person_name) || $scope.cdata.person_name == '' || $scope.cdata.person_name == null) {
				$('#person_name').focus();
				alertService.add("warning", "Enter Broker name!", 2000);

				return false;
			}
			if (angular.isUndefined($scope.cdata.person_title) || $scope.cdata.person_title == '' || $scope.cdata.person_title == null) {
				$('#person_title').focus();
				alertService.add("warning", "Enter Broker title!", 2000);
				return false;
			}

			$scope.usertype = localStorageService.get('usertype');

			if (angular.isUndefined($scope.cdata.broker_mail) || $scope.cdata.broker_mail == '' || $scope.cdata.broker_mail == null) {
				$('#person_email').focus();

				alertService.add("warning", "Enter valid email id!", 2000);
				return false;
			}



			if (angular.isUndefined($scope.cdata.person_phone) || $scope.cdata.person_phone == '' || $scope.cdata.person_phone == null) {
				$('#person_phone').focus();
				alertService.add("warning", "Enter valid phone no!", 2000);
				return false;
			}
			// return false;

			$scope.cdata.broker_name = $scope.cdata.person_company_name;
			$scope.cdata.corporate_name = $scope.cdata.person_company_name;
			$scope.cdata.corporate_id = '';
			$scope.cdata.broker = '';
			$scope.cdata.broker_phone = '';

			// $('#broke_value').val($scope.cdata.person_company_name);
			// $('#broker_name').val($scope.cdata.person_company_name);



			alertService.add("success", "Added successfully!", 2000);
			$('#showInvestorModal').modal('hide');
			$scope.showInvestorModal = false;
			//alertService.add("warning", "Enter Broker phone!",2000);

		}

		//Add NDR Event time table start
		var monthNames = [
			"January", "February", "March",
			"April", "May", "June", "July",
			"August", "September", "October",
			"November", "December"
		];

		$scope.addtime = function () {
			if (!$scope.cdata.timezone_id || angular.isUndefined($scope.cdata.timezone_id) || $scope.cdata.timezone_id == '') {
				alertService.add("warning", "Kindly add first timezone field", 2000);
				$scope.cdata.date = '';
				return false;
			}
			if (!$scope.cdata.city) {
				$('#city').attr('required', true);
				$('#city').focus();
				return false;
			} else if (!$scope.cdata.date) {
				$('#date').attr('required', true);
				$('#date').focus();
				return false;
			} else if (!$scope.cdata.location_type) {
				$('#location_type').attr('required', true);
				$('#location_type').focus();
				return false;
			} else {
				if ($scope.cdata.possibletime.length == 0) {
					$scope.cdata.possibletime = [];
				}
				$scope.content = [];
				$scope.content = [{
						time: '8.00 AM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '09:00 AM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '10:00 AM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '11:00 AM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '12:15 PM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '01:45 PM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '03:00 PM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '04:15 PM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '05:30 PM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					}
				];
				var push = 0;
				var dates = $scope.cdata.date;

				var date = new Date(dates);
				var day = date.getDate();
				var monthIndex = date.getMonth();
				var year = date.getFullYear();
				$scope.cdata.date = day + '-' + monthNames[monthIndex] + '-' + year;
				angular.forEach($scope.cdata.possibletime, function (todo, key) {
					if (todo.date == $scope.cdata.date) {
						push = 1;
					}
					//Change now can add multiplt city with same date
					//if (todo.city == $scope.cdata.city) {
					//	push = 2;
					//}

				});

				if (push == 0) {
					$scope.cdata.possibletime.push({
						city: $scope.cdata.city,
						date: $scope.cdata.date,
						content: $scope.content
					});
					if ($scope.cdata.location_type == 'Physical') {
						$scope.cdata.city = ''
					}
					$scope.cdata.date = ''
				} else if (push == 1) {
					alertService.add("warning", "This Date Already Entered!", 2000);
					$scope.cdata.date = '';
				} else if (push == 2) {
					alertService.add("warning", "This city already entered!", 2000);
					$scope.cdata.city = '';
				}
			}
		}
		//Add NDR Event table end

		$scope.removepossibletime = function (index) {
			$scope.cdata.possibletime.splice(index, 1);
		}

		//Add corporate presenter name start
		$scope.addcorporatenames = function () {
			if (!$scope.cdata.corporate_presenter_name) {
				$('#corporate_presenter_name').attr('required', true);
				$('#corporate_presenter_name').focus();
				return false;
			} else if (!$scope.cdata.corporate_presenter_title) {
				$('#corporate_presenter_title').attr('required', true);
				$('#corporate_presenter_title').focus();
				return false;
			} else {
				if ($scope.cdata.corporatenameslist.length == 0) {
					$scope.cdata.corporatenameslist = [];
				}
				$scope.cdata.corporatenameslist.push({
					name: $scope.cdata.corporate_presenter_name,
					title: $scope.cdata.corporate_presenter_title
				});
				$scope.cdata.corporate_presenter_name = '';
				$scope.cdata.corporate_presenter_title = '';
			}
		}
		//Add corporate presenter name end

		$scope.remove_row = function (data, tab) {
			var index = $scope.cdata.possibletime.indexOf(tab);
			if (index >= 0) {
				var ind = $scope.cdata.possibletime[index].content.indexOf(data);
				if (ind >= 0) {
					$scope.cdata.possibletime[index].content.splice(ind, 1);
				}
			}
		}


		//get all investor contacts list and add to data start

		$scope.selectinvestors = function (selected) {
			if (selected != undefined) {
				$scope.tags.investers = selected.title;
			}
		}

		var tagUrl = 'apiv4/public/dashboard/getInvestorsList';
		var params = {
			key: 'tags'
		};
		RequestDetail.getDetail(tagUrl, params).then(function (result) {

			$scope.investerslist = {};
			$scope.investerslist = result.data;
		});

		$scope.addinvesterlist = function () {


			if ($scope.tags.investers != '') {
				if ($scope.cdata.addinvesterslist.indexOf($scope.tags.investers) == -1) {
					$scope.cdata.addinvesterslist.push($scope.tags.investers);
					$scope.tags.investers = '';
					$scope.$broadcast('angucomplete-alt:clearInput', 'tagInvestor');
				} else {
					alertService.add("warning", "Already entered this item!", 2000);
					$scope.cdata.investersgrp = '';
					$scope.$broadcast('angucomplete-alt:clearInput', 'tagInvestor');
				}
			}
		}
		//get all investor contacts list and add to data end

		$scope.showcontactsedit = function (editinvester,index) {
            var tagUrl = 'apiv4/public/researchprovider/getinvestorslist';

            var params = { investor: editinvester};

            RequestDetail.getDetail(tagUrl, params).then(function (result) {

                $scope.investorscontactlists = result.data;
                angular.forEach($scope.investorscontactlists, function (data,key) {
					if($scope.cdata.removedids.indexOf(data.investor_contacts_id)>=0){
                        $scope.investorscontactlists[key].addedstatus = 0;
                    }else{
                        $scope.investorscontactlists[key].addedstatus = 1;
                    }
                });

                $scope.showModalcontactsedit = true;
            });
		}
		
		$scope.removethisemail = function (id) {
            $scope.cdata.removedids.push(id);
            angular.forEach($scope.investorscontactlists, function (data,key) {
                if($scope.cdata.removedids.indexOf(data.investor_contacts_id)>=0){
					$scope.investorscontactlists[key].addedstatus = 0;
                }
            });
		}
		
		$scope.closepopup = function () {
            $scope.showModalcontactsedit = false;
            $scope.showModalcontacts = false;
        }

        $scope.Addthisemail = function (id) {
            var index =  $scope.cdata.removedids.indexOf(id);
            if (index > -1) {
                $scope.cdata.removedids.splice(index, 1);
            }
            angular.forEach($scope.investorscontactlists, function (data,key) {
                if($scope.cdata.removedids.indexOf(data.investor_contacts_id)){
                    $scope.investorscontactlists[key].addedstatus = 1;
                }
            });
        }

		//get all industries
		var tagUrl = 'apiv4/public/meeting/getAllIndustryTags';
		var params = {
			key: 'tags'
		};
		RequestDetail.getDetail(tagUrl, params).then(function (result) {
			$scope.macroTags = result.data.macro;
			$scope.midTags = result.data.mid;
			$scope.microTags = result.data.micro;
		});

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

		$scope.removeTag = function (item) {
			var index = $scope.industryTagsAdded.indexOf(item);
			$scope.industryTagsAdded.splice(index, 1);
		}
		//get all industries


		//all earningcallfollow start
		$scope.earningcallfollow = function () {
			$scope.cdata.earningcallfollow.push({
				'time': '12:15 PM',
				'meettype': '1',
				'notes': ''
			})
			$scope.cdata.earningcallfollow.push({
				'time': '1:45 PM',
				'meettype': '1',
				'notes': ''
			})
			$scope.cdata.earningcallfollow.push({
				'time': '5:00 PM',
				'meettype': '1',
				'notes': ''
			})
			$scope.cdata.earningcallfollow.push({
				'time': '5:20 PM',
				'meettype': '1',
				'notes': ''
			})
			$scope.cdata.earningcallfollow.push({
				'time': '5:40 PM',
				'meettype': '1',
				'notes': ''
			})
		}
		$scope.earningcallfollow();
		//all earningcallfollow end

		$scope.unregistered_rpuser = function() {
			$scope.showUnregistredrpModal = true;
		}
		$scope.closeUnregistredrpModel = function() {
			$scope.showUnregistredrpModal = false;
		}

		$scope.addcndr_rp = function () {
			var email_check = 1;
			angular.forEach($scope.cdata.researchproviderslists, function (con, ind) {
				if(con.email==$scope.cdata.cndr_rp.email){
					email_check = 0;
				}
			});
	
			if(email_check){
				$scope.cdata.cndr_rp.user_id = 0;
				$scope.cdata.researchproviderslists.push($scope.cdata.cndr_rp);
			} 
			$scope.cdata.cndr_rp  = [];
			$scope.showUnregistredrpModal = false;
			
		}

		



		$scope.addevent = function () {

			if ($scope.cdata.event_type == 'ndr') {
				if ($scope.cdata.video_url != '') {
					if ($scope.cdata.videoscreeenshot.length == 0) {
						alertService.add("warning", "Please upload screenshot image!", 2000);
						return false;
					}
				}

				if (!$scope.cdata.organizer_description) {
					$('#organizer_description').attr('required', true);
					$('#organizer_description').focus();
					alertService.add("warning", "Please enter event description !", 2000);
					return false;
				}
				if (!$scope.cdata.timezone_id) {
					$('#timezone_id').attr('required', true);
					$('#timezone_id').focus();
					alertService.add("warning", "Please select timezone !", 2000);
					return false;
				} else if (!$scope.cdata.organizer_name) {
					$('#organizer_name').attr('required', true);
					$('#organizer_name').focus();
					alertService.add("warning", "Please enter event organizer name !", 2000);
					return false;
				} else if (!$scope.cdata.organizer_email) {
					$('#organizer_email').attr('required', true);
					$('#organizer_email').focus();
					alertService.add("warning", "Please enter valid  event organizer mail id !", 2000);
					return false;
				} else if (!$scope.cdata.organizer_phone) {
					$('#organizer_phone').attr('required', true);
					$('#organizer_phone').focus();
					alertService.add("warning", "Please enter valid phone no !", 2000);
					return false;
				} else if ($scope.cdata.corporatenameslist.length == 0) {
					alertService.add("warning", "Please choose atleast one Corporate Name and title!", 2000);
					return false;
				} else if ($scope.cdata.possibletime.length == '0') {
					alertService.add("warning", "Please choose atleast one Schedule Date and location!", 2000);
					return false;
				} else {
					$scope.spinnerActive = true;
					$scope.cdata.industryTagsAdded = $scope.industryTagsAdded;

					$scope.cdata.presentaion_file = {};
					$scope.cdata.presentaion_file = $scope.presentaion_file;
					var url = 'apiv4/public/event/addevent';
					var params = {
						type: 'put',
						cdata: $scope.cdata
					};
					RequestDetail.getDetail(url, params).then(function (result) {
						$scope.spinnerActive = false;
						if (result.data == 0) {
							alertService.add("success", "New Event Created successfully!", 2000);
							$location.path('eventslist');
						} else {
							alertService.add("warning", "Something error try agin later!", 2000);
						}

					});
				}
			} else if ($scope.cdata.event_type == 'collaborated_ndr') {


				if ($scope.cdata.video_url != '') {
					if ($scope.cdata.videoscreeenshot.length == 0) {
						alertService.add("warning", "Please upload screenshot image!", 2000);
						return false;
					}
				} else if (!$scope.cdata.organizer_description) {
					$('#organizer_description').attr('required', true);
					$('#organizer_description').focus();
					alertService.add("warning", "Please enter event description!", 2000);
					return false;
				} else if (!$scope.cdata.timezone_id) {
					$('#timezone_id').attr('required', true);
					$('#timezone_id').focus();
					alertService.add("warning", "Please select timezone!", 2000);
					return false;
				} else if ($scope.cdata.possibletime.length == '0') {
					alertService.add("warning", "Please choose atleast one schedule date and location!", 2000);
					return false;
				} else if (!$scope.cdata.organizer_name) {
					$('#organizer_name').attr('required', true);
					$('#organizer_name').focus();
					alertService.add("warning", "Please enter event organizer name!", 2000);
					return false;
				} else if (!$scope.cdata.organizer_email) {
					$('#organizer_email').attr('required', true);
					$('#organizer_email').focus();
					alertService.add("warning", "Please enter valid event organizer email address!", 2000);
					return false;
				} else if (!$scope.cdata.organizer_phone) {
					$('#organizer_phone').attr('required', true);
					$('#organizer_phone').focus();
					alertService.add("warning", "Please enter valid event organizer phone number!", 2000);
					return false;
				} else if ($scope.cdata.corporatenameslist.length == 0) {
					alertService.add("warning", "Please choose atleast one corporate presenters name and title!", 2000);
					return false;
				} else if ($scope.cdata.researchproviderslists.length == 0) {
					alertService.add("warning", "Please choose atleast one research provider to colloborate!", 2000);
					return false;
				} else {
					
					$scope.spinnerActive = true;
					$scope.cdata.industryTagsAdded = $scope.industryTagsAdded;
					$scope.cdata.presentaion_file = {};
					$scope.cdata.presentaion_file = $scope.presentaion_file;
					var url = 'apiv4/public/event/addcollaboratedevent';
					var params = {
						type: 'put',
						cdata: $scope.cdata
					};
					RequestDetail.getDetail(url, params).then(function (result) {
						$scope.spinnerActive = false;
						if (result.data == 0) {
							alertService.add("success", "New Event Created successfully!", 2000);
							$location.path('eventslist');
						} else {
							alertService.add("warning", "Something error try agin later!", 2000);
						}

					});
				}
			} else if ($scope.cdata.event_type == 'analystDay') {

				if (!$scope.cdata.event_title) {
					$('#event_title').attr('required', true);
					$('#event_title').focus();
					alertService.add("warning", "Please enter event title !", 2000);
					return false;
				} else if (!$scope.cdata.webcast) {
					$('#webcast').attr('required', true);
					$('#webcast').focus();
					alertService.add("warning", "Please enter webcast  !", 2000);
					return false;
				} else if (!$scope.cdata.organizer_name) {
					$('#organizer_name').attr('required', true);
					$('#organizer_name').focus();
					alertService.add("warning", "Please enter event organizer name !", 2000);
					return false;
				} else if (!$scope.cdata.organizer_email) {
					$('#organizer_email').attr('required', true);
					$('#organizer_email').focus();
					alertService.add("warning", "Please enter valid organizer email !", 2000);
					return false;
				} else if (!$scope.cdata.organizer_phone) {
					$('#organizer_phone').attr('required', true);
					$('#organizer_phone').focus();
					alertService.add("warning", "Please enter valid phone no !", 2000);
					return false;
				} else if (!$scope.cdata.organizer_description) {
					$('#organizer_description').attr('required', true);
					$('#organizer_description').focus();
					alertService.add("warning", "Please enter event description !", 2000);
					return false;
				} else if ($scope.cdata.corporatenameslist.length == 0) {
					alertService.add("warning", "Please choose atleast one Corporate Name and title!", 2000);
					return false;
				} else if (!$scope.cdata.city) {
					$('#city').attr('required', true);
					$('#city').focus();
					alertService.add("warning", "Please enter location!", 2000);
					return false;
				}
				if (!$scope.cdata.timezone_id) {
					$('#timezone_id').attr('required', true);
					$('#timezone_id').focus();
					alertService.add("warning", "Please select timezone !", 2000);
					return false;
				} else if (!$scope.cdata.date) {
					$('#date').attr('required', true);
					$('#date').focus();
					alertService.add("warning", "Please choose date!", 2000);
					return false;
				} else if (!$scope.cdata.fromtime) {
					$('#fromtime').attr('required', true);
					$('#fromtime').focus();
					alertService.add("warning", "Please choose from time !", 2000);
					return false;
				} else if (!$scope.cdata.totime) {
					$('#totime').attr('required', true);
					$('#totime').focus();
					alertService.add("warning", "Please choose to time!", 2000);
					return false;
				} else {
					if ($scope.cdata.fromtime != "any" && $scope.cdata.totime != "any") {
						var jdt1 = Date.parse('20 Aug 2000 ' + $scope.cdata.fromtime);
						var jdt2 = Date.parse('20 Aug 2000 ' + $scope.cdata.totime);
						if (jdt2 <= jdt1) {
							alertService.add("warning", "Please select valid from time and to time!", 2000);
							return false;
						}
					}

					$scope.spinnerActive = true;
					$scope.cdata.industryTagsAdded = $scope.industryTagsAdded;
					var url = 'apiv4/public/event/addeventanalystday';
					$scope.cdata.presentaion_file = {};
					$scope.cdata.presentaion_file = $scope.presentaion_file;
					var params = {
						type: 'put',
						cdata: $scope.cdata
					};
					RequestDetail.getDetail(url, params).then(function (result) {
						if (result.data == 0) {
							$scope.spinnerActive = false;
							alertService.add("success", "New Event Created successfully!", 2000);
							$location.path('eventslist');
						}
					});
				}
			} else if ($scope.cdata.event_type == 'earningsCallfollowup') {

				if (!$scope.cdata.event_title) {
					$('#event_title').attr('required', true);
					$('#event_title').focus();
					alertService.add("warning", "Please enter event title !", 2000);
					return false;
				} else if (!$scope.cdata.organizer_name) {
					$('#organizer_name').attr('required', true);
					$('#organizer_name').focus();
					alertService.add("warning", "Please enter event organizer name !", 2000);
					return false;
				} else if (!$scope.cdata.organizer_email) {
					$('#organizer_email').attr('required', true);
					$('#organizer_email').focus();
					alertService.add("warning", "Please enter valid organizer email !", 2000);
					return false;
				} else if (!$scope.cdata.organizer_phone) {
					$('#organizer_phone').attr('required', true);
					$('#organizer_phone').focus();
					alertService.add("warning", "Please enter valid phone no !", 2000);
					return false;
				} else if (!$scope.cdata.organizer_description) {
					$('#organizer_description').attr('required', true);
					$('#organizer_description').focus();
					alertService.add("warning", "Please enter event description !", 2000);
					return false;
				}
				if (!$scope.cdata.timezone_id) {
					$('#timezone_id').attr('required', true);
					$('#timezone_id').focus();
					alertService.add("warning", "Please select timezone !", 2000);
					return false;
				} else if (!$scope.cdata.date) {
					$('#date').attr('required', true);
					$('#date').focus();
					alertService.add("warning", "Please choose date!", 2000);
					return false;
				} else if (!$scope.cdata.fromtime) {
					$('#afromtime').attr('required', true);
					$('#afromtime').focus();
					alertService.add("warning", "Please choose start time !", 2000);
					return false;
				} else if (!$scope.cdata.totime) {
					$('#atotime').attr('required', true);
					$('#atotime').focus();
					alertService.add("warning", "Please choose end time!", 2000);
					return false;
				}
				if (angular.isDefined($scope.cdata.fromtime) && $scope.cdata.fromtime != "any" && angular.isDefined($scope.cdata.totime) && $scope.cdata.totime != "any") {

					var jdt1 = Date.parse('20 Aug 2000 ' + $scope.cdata.fromtime);
					var jdt2 = Date.parse('20 Aug 2000 ' + $scope.cdata.totime);
					if (jdt2 <= jdt1) {
						alertService.add("warning", "Please select valid start time and end time!", 2000);
						return false;
					}
				}

				$scope.spinnerActive = true;
				$scope.cdata.industryTagsAdded = $scope.industryTagsAdded;

				$scope.cdata.presentaion_file = {};
				$scope.cdata.presentaion_file = $scope.presentaion_file;
				var url = 'apiv4/public/event/addearningcallevent';
				var params = {
					type: 'put',
					cdata: $scope.cdata
				};
				RequestDetail.getDetail(url, params).then(function (result) {
					if (result.data == 0) {
						$scope.spinnerActive = false;
						alertService.add("success", "New Event Created successfully!", 2000);
						$location.path('eventslist');
					} else {
						$scope.spinnerActive = false;
						alertService.add("warning", "Something error try agin later!", 2000);
					}
				});
			}

		}





	})

	.controller('brokernewEventCtrl', function ($scope, $http, $location, localStorageService, RequestDetail, alertService, $filter, $timeout, configdetails) {


		//get user type
		$scope.usertype = localStorageService.get('usertype');
		var user_data = localStorageService.get('userdata');
		$scope.user_id = user_data.user_id;
		//get user type

		// The New event type templates are defined here
		$scope.template = {};

		var rootFolder = 'partials/broker/';
		$scope.template.include = rootFolder + 'dealRoadshow.html';

		$scope.changeTemplate = function () {
			$scope.template.include = rootFolder + $scope.cdata.event_type + '.html';
		}

		$scope.show_dashboard = function () {

			$location.path('dashboard');
		}
		//Events data
		$scope.cdata = {};
		$scope.cdata.possibletime = [];
		$scope.cdata.corporatenameslist = [];
		$scope.presentaion_file = [];

		$scope.tags = {};
		$scope.tags.investers = '';
		$scope.tags.valMacroTags = '';
		$scope.tags.valMidTags = '';
		$scope.tags.valMicroTags = '';
		$scope.industryTagsAdded = [];
		$scope.cdata.addinvesterslist = [];

		$scope.cdata.person_company_name = '';
		$scope.cdata.person_name = '';
		$scope.cdata.person_title = '';
		$scope.cdata.broker_mail = '';
		$scope.cdata.person_phone = '';


		//info popup
		$scope.showModalpageinfo = false;
		$scope.openmodelpagehelp = function () {
			$scope.showModalpageinfo = !$scope.showModalpageinfo;
		}
		//info popup



		if ($scope.usertype == 'broker') {
			$scope.cdata.broker = $scope.user_id;
		}

		//get corporate 
		$scope.get_corp_datas = function () {
			var params = $('#broke_value').val();
			var tagUrl = 'apiv4/public/dashboard/get_corp_datas';
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				if (angular.isDefined(result.data) && result.data != 0) {
					$scope.cdata.person_company_name = '';
					$scope.cdata.person_name = '';
					$scope.cdata.person_title = '';
					$scope.cdata.person_phone = '';
				} else if ($scope.cdata.person_company_name != $scope.cdata.corporate_name && $scope.cdata.person_name == '') {
					$scope.cdata.corporate_id = '';
					$scope.cdata.ticker = '';
				}
			});
		}
		$scope.get_matched = function () {

			var tagUrl = 'apiv4/public/event/get_corporate_names';
			var params = {
				company_name: $('#broke_value').val()
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {

				if (angular.isDefined(result.data) && result.data != '') {
					if (result.data == 0) {
						$('#user').removeClass('hidden');
					} else {
						$("#broke_value").autocomplete({
							source: result.data,
							select: function (a, b) {
								$scope.cdata.corporate_name = b.item.value;
								$scope.cdata.corporate_id = b.item.user_id;
								$scope.cdata.ticker = b.item.ticker;
							}
						});
						$('#user').addClass('hidden');
					}
				}
			});
		}

		$scope.get_matched_tickers = function () {

			var tagUrl = 'apiv4/public/event/get_matched_tickers';
			var params = {
				company_ticker: $('#company_ticker').val()
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {

				if (angular.isDefined(result.data) && result.data != '') {
					if (result.data != 0) {
						$("#company_ticker").autocomplete({
							source: result.data
						});
					}
				}
			});
		}
		//get corporate 


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
		// timezone list 

		//timeslots start
		var monthNames = [
			"January", "February", "March",
			"April", "May", "June", "July",
			"August", "September", "October",
			"November", "December"
		];

		//date select
		$scope.inlineOptions = {
			customClass: getDayClass,
			minDate: new Date(),
			showWeeks: true
		};
		$scope.dateOptions = {
			// dateDisabled: disabled,
			formatYear: 'yy',
			maxDate: new Date(2023, 5, 22),
			minDate: new Date(),
			startingDay: 1
		};

		//trip event
		$scope.disabled = {};
		$scope.disabled_array = [];

		// Disable weekend selection
		function disabled(data) {
			// var date = data.date,
			// mode = data.mode;
			// return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6); /* Disable weak days */
		}

		$scope.deaddateOptions = {
			dateDisabled: disabled,
			formatYear: 'yy',
			maxDate: new Date(2023, 5, 22),
			minDate: new Date(),
			startingDay: 1
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


		$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		$scope.format = $scope.formats[0];
		$scope.altInputFormats = ['M!/d!/yyyy'];


		$scope.open1 = function () {
			if ((!$scope.cdata.timezone_id || $scope.cdata.timezone_id == '') && ($scope.cdata.event_type == 'conference' || $scope.cdata.event_type == 'fieldTrip')) {
				alertService.add("warning", "Kindly choose timezone!", 2000);
				return false;
			}
			$scope.minDate = new Date();
			$scope.popup1.opened = true;
		};

		$scope.popup1 = {
			opened: false
		};

		$scope.deadline = {
			opened: false
		};

		$scope.opendeadline = function () {
			$scope.deadline.opened = true;
		};

		$scope.removepossibletime = function (index) {
			$scope.cdata.possibletime.splice(index, 1);
		}

		//disable past date



		$scope.toggleMin = function () {
			$scope.inlineOptions.minDate = new Date();
			var myDate = new Date();

			//add a day to the date
			myDate.setDate(myDate.getDate() + 1);
			$scope.dateOptions.minDate = myDate;
		};

		$scope.toggleMin();

		//date select

		$scope.addtime = function () {
			if (!$scope.cdata.timezone_id || angular.isUndefined($scope.cdata.timezone_id) || $scope.cdata.timezone_id == '') {
				alertService.add("warning", "Kindly add first timezone field", 2000);
				$scope.cdata.date = '';
				return false;
			}
			if (!$scope.cdata.city) {
				$('#city').attr('required', true);
				alertService.add("warning", "Kindly add City field", 2000);
				$('#city').focus();
				return false;
			} else if (!$scope.cdata.date) {
				$('#date').attr('required', true);
				alertService.add("warning", "Kindly add Date field", 2000);
				$('#date').focus();
				return false;
			} else {
				if ($scope.cdata.possibletime.length == 0) {
					$scope.cdata.possibletime = [];
				}
				$scope.content = [];
				$scope.content = [{
						time: '8.00 AM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '09:00 AM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '10:00 AM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '11:00 AM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '12:15 PM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '01:45 PM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '03:00 PM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '04:15 PM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '05:30 PM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					}
				];
				var push = 0;
				var dates = $scope.cdata.date;

				var date = new Date(dates);
				var day = date.getDate();
				var monthIndex = date.getMonth();
				var year = date.getFullYear();
				$scope.cdata.date = day + '-' + monthNames[monthIndex] + '-' + year;
				angular.forEach($scope.cdata.possibletime, function (todo, key) {
					if (todo.date == $scope.cdata.date) {
						push = 1;
					}
					if (todo.city == $scope.cdata.city) {
						push = 2;
					}
				});

				if (push == 0) {
					$scope.cdata.possibletime.push({
						city: $scope.cdata.city,
						date: $scope.cdata.date,
						content: $scope.content
					});
					$scope.cdata.city = ''
					$scope.cdata.date = ''
				} else if (push == 1) {
					alertService.add("warning", "This Date Already Entered!", 2000);
					$scope.cdata.date = '';
				} else if (push == 2) {
					alertService.add("warning", "This city already entered!", 2000);
					$scope.cdata.city = '';
				}
			}
		}
		//timeslots end


		$scope.remove_row = function (data, tab) {
			var index = $scope.cdata.possibletime.indexOf(tab);
			if (index >= 0) {
				var ind = $scope.cdata.possibletime[index].content.indexOf(data);
				if (ind >= 0) {
					$scope.cdata.possibletime[index].content.splice(ind, 1);
				}
			}
		}

		$scope.removeInvester = function (index) {
			$scope.cdata.addinvesterslist.splice(index, 1);
		}

		$scope.removeTagging = function (index) {
			$scope.industryTagsAdded.splice(index, 1);
		}
		//add corporate name start
		$scope.addcorporatenames = function () {
			if (!$scope.cdata.corporate_presenter_name) {
				$('#corporate_presenter_name').attr('required', true);
				$('#corporate_presenter_name').focus();
				return false;
			} else if (!$scope.cdata.corporate_presenter_title) {
				$('#corporate_presenter_title').attr('required', true);
				$('#corporate_presenter_title').focus();
				return false;
			} else {
				if ($scope.cdata.corporatenameslist.length == 0) {
					$scope.cdata.corporatenameslist = [];
				}
				$scope.cdata.corporatenameslist.push({
					name: $scope.cdata.corporate_presenter_name,
					title: $scope.cdata.corporate_presenter_title
				});
				$scope.cdata.corporate_presenter_name = '';
				$scope.cdata.corporate_presenter_title = '';
			}
		}
		//add corporate name end


		//upload presentaion name start
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
		//upload presentaion name end

		$scope.remove_rows = function (index) {
			$scope.corporates.splice(index, 1);
			$scope.enable_disable();
		};

		//investor list start
		var tagUrl = 'apiv4/public/dashboard/getInvestorsList';
		var params = {
			key: 'tags'
		};
		RequestDetail.getDetail(tagUrl, params).then(function (result) {

			$scope.investerslist = {};
			$scope.investerslist = result.data;

		});

		$scope.selectinvestors = function (selected) {
			if (selected != undefined) {
				$scope.tags.investers = selected.title;
			}
		}

		$scope.addinvesterlist = function () {

			if ($scope.tags.investers != '') {
				if ($scope.cdata.addinvesterslist.indexOf($scope.tags.investers) == -1) {
					$scope.cdata.addinvesterslist.push($scope.tags.investers);
					$scope.tags.investers = '';
					$scope.$broadcast('angucomplete-alt:clearInput', 'tagInvestor');
				} else {
					alertService.add("warning", "Allready entered this item!", 2000);
					$scope.cdata.investersgrp = '';
					$scope.$broadcast('angucomplete-alt:clearInput', 'tagInvestor');
				}
			}
		}
		//investor list end

		//industry tags start

		var tagUrl = 'apiv4/public/meeting/getAllIndustryTags';
		var params = {
			key: 'tags'
		};
		RequestDetail.getDetail(tagUrl, params).then(function (result) {
			$scope.macroTags = result.data.macro;
			$scope.midTags = result.data.mid;
			$scope.microTags = result.data.micro;
		});

		$scope.addMacroTag = function () {
			if ($scope.tags.valMacroTags != '') {
				if ($scope.industryTagsAdded.indexOf($scope.tags.valMacroTags) == -1) {
					$scope.industryTagsAdded.push($scope.tags.valMacroTags);
					$scope.tags.valMacroTags = '';
					$scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
				} else {
					alertService.add("warning", "Allready entered this item!", 2000);
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
					alertService.add("warning", "Allready entered this item!", 2000);
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
					alertService.add("warning", "Allready entered this item!", 2000);
					$scope.tags.valMicroTags = '';
					$scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
				}
			}
		}

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
		//industry tags end

		//add row in timeslot start
		$scope.corporates = [];
		$scope.add_row = function () {

			$scope.time = {};
			var length = $scope.corporates.length - 1;
			if ($scope.corporates.length >= 1) {
				if ($scope.corporates == undefined) {
					alertService.add("warning", "Please enter Corporate name !", 2000);
					return false;
				}
			}
			$scope.inserted = {
				meeting_time: ''
			};
			$scope.corporates.push($scope.inserted);
		}



		$scope.remove_rows = function (index) {
			$scope.corporates.splice(index, 1);
			$scope.enable_disable();
		};
		//add row in timeslot end

		//get corporate name list fieldTrip
		$scope.getconrporate = function () {
			// Corporate list 
			var tagUrl = 'apiv4/public/dashboard/get_corporate_list';
			var params = {
				key: 'tags'
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				$scope.corporate_list = {};
				$scope.corporate_list = result.data;
			});
		}

		$scope.select_corporate_field = function (selected) {
			$scope.corporates[this.$parent.$index].corporate_id = '';
			$scope.corporates[this.$parent.$index].corporate_name = '';
			$scope.corporates[this.$parent.$index].ticker = '';
			if (selected != undefined) {
				if (selected.originalObject.user_id && selected.originalObject.company_name && selected.originalObject.ticker) {
					$scope.corporates[this.$parent.$index].corporate_id = selected.originalObject.user_id;
					$scope.corporates[this.$parent.$index].corporate_name = selected.originalObject.company_name;
					$scope.corporates[this.$parent.$index].ticker = selected.originalObject.ticker;
				}
			}
		}
		//get corporate name list fieldTrip

		//meeting time fieldTrip
		$scope.meeting_times = [{
				value: '',
				text: 'Select'
			},
			{
				value: '12:00 AM',
				text: '12:00 AM'
			},
			{
				value: '01:00 AM',
				text: '1:00 AM'
			},
			{
				value: '02:00 AM',
				text: '2:00 AM'
			},
			{
				value: '03:00 AM',
				text: '3:00 AM'
			},
			{
				value: '04:00 AM',
				text: '4:00 AM'
			},
			{
				value: '05:00 AM',
				text: '5:00 AM'
			},
			{
				value: '06:00 AM',
				text: '6:00 AM'
			},
			{
				value: '07:00 AM',
				text: '7:00 AM'
			},
			{
				value: '08:00 AM',
				text: '8:00 AM'
			},
			{
				value: '09:00 AM',
				text: '9:00 AM'
			},
			{
				value: '10:00 AM',
				text: '10:00 AM'
			},
			{
				value: '11:00 AM',
				text: '11:00 AM'
			},
			{
				value: '12:00 PM',
				text: '12:00 PM'
			},
			{
				value: '01:00 PM',
				text: '1:00 PM'
			},
			{
				value: '02:00 PM',
				text: '2:00 PM'
			},
			{
				value: '03:00 PM',
				text: '3:00 PM'
			},
			{
				value: '04:00 PM',
				text: '4:00 PM'
			},
			{
				value: '05:00 PM',
				text: '5:00 PM'
			},
			{
				value: '06:00 PM',
				text: '6:00 PM'
			},
			{
				value: '07:00 PM',
				text: '7:00 PM'
			},
			{
				value: '08:00 PM',
				text: '8:00 PM'
			},
			{
				value: '09:00 PM',
				text: '9:00 PM'
			},
			{
				value: '10:00 PM',
				text: '10:00 PM'
			},
			{
				value: '11:00 PM',
				text: '11:00 PM'
			}
		];

		$scope.meeting_times_array = angular.copy($scope.meeting_times);

		//remove fieldTrip time row
		$scope.removeCorporate = function (index) {
			$scope.cdata.corporatenameslist.splice(index, 1);
		}


		// import from excel

		//upload fieldtrip excel 
		$scope.upload_fieldtrip_excel = function (data) {
			$scope.corporates = [];
			var corporates = [];
			//console.log(data);
			if (angular.isDefined(data.valid_datas)) {
				angular.forEach(data.valid_datas, function (details) {
					corporates.push(details);

				});

				$scope.corporates = corporates;
				$scope.$apply();
				$timeout(function () {
					angular.forEach(data.valid_datas, function (dat, key) {
						if (angular.isDefined(dat.corporate_name) && dat.corporate_name != '') {
							$scope.$broadcast('angucomplete-alt:changeInput', 'corporate' + key, dat.corporate_name);
						}
					});
				}, 1000);
			}
			if (angular.isDefined(data.invalid_datas)) {
				$scope.invalid_datas = true;
			} else {
				$scope.invalid_datas = false;
			}
		}
		// import from excel

		// new corporate popup
		$scope.newUser = {};
		$scope.add_unregistered_corp = function (corporate, index) {
			$scope.newUser = {};
			$('#popup').modal('show');
			corporate.person_company_names = '';
			corporate.person_names = '';
			corporate.person_titles = '';
			corporate.person_phones = '';
			corporate.corporate_mails = '';
			$scope.newUser = corporate;
			$('#hidden_id').val(index);
		}
		$scope.fieldtrip_popup = function () {

			if (angular.isUndefined($scope.newUser.person_company_names) || $scope.newUser.person_company_names == '' || $scope.newUser.person_company_names == null) {
				$('#person_company_name').focus();
				alertService.add("warning", "Enter Company name!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.newUser.person_names) || $scope.newUser.person_names == '' || $scope.newUser.person_names == null) {
				$('#person_name').focus();
				alertService.add("warning", "Enter Corporate name!", 2000);

				return false;
			}
			if (angular.isUndefined($scope.newUser.person_titles) || $scope.newUser.person_titles == '' || $scope.newUser.person_titles == null) {
				$('#person_title').focus();
				alertService.add("warning", "Enter Corporate title!", 2000);
				return false;
			}

			$scope.usertype = localStorageService.get('usertype');

			if (angular.isUndefined($scope.newUser.corporate_mails) || $scope.newUser.corporate_mails == '' || $scope.newUser.corporate_mails == null) {
				$('#person_email').focus();
				alertService.add("warning", "Enter valid email id!", 2000);
				return false;
			}

			if (angular.isUndefined($scope.newUser.person_phones) || $scope.newUser.person_phones == '' || $scope.newUser.person_phones == null) {
				$('#person_phone').focus();
				alertService.add("warning", "Enter valid corporate phone no!", 2000);
				return false;
			}

			var id = $('#hidden_id').val();

			//$('#corporate'+id).val($scope.newUser.person_company_names);
			$scope.$broadcast('angucomplete-alt:changeInput', 'corporate' + id, $scope.newUser.person_company_names);

			$('#popup').modal('hide');

		}
		// new corporate popup end

		//meeting temp array
		$scope.enable_disable = function () {
			var temp = [];
			angular.forEach($scope.corporates, function (corp, index) {
				if (angular.isDefined(corp.meeting_time) && corp.meeting_time != '') {
					temp.push(corp.meeting_time);
				}
			});
			$scope.disabled_array = temp;
		}

		// fieldTrip 
		$scope.download_invalid_datas = function () {
			window.location.href = "apiv4/public/event/download_invalid_datas";
		}

		//meeting time  fieldTrip end


		//conferance start

		// Add rooms to conference table
		$scope.addRooms = function () {
			
			if ($scope.subheaderLength.length > 0) {
				if ($scope.subheaderLength[$scope.subheaderLength.length - 1].length == 0) {
					alertService.add("warning", "Add time to add more room!", 2000);
					return false;
				}
			}
			$scope.mainheaderLength = $scope.mainheaderLength + 1;
			var mobj = new Object();
			mobj.spanlength = 1;
			mobj.heading = 'DATE (DAY ' + $scope.mainheaderLength + ')';
			$scope.conference_main_header.push(mobj);
			var sublen = 1;
			if ($scope.subheaderLength.length > 0) {
				sublen = $scope.subheaderLength.length + 1;
			}
			var objs = new Object();
			objs.heading = "1x1 Room";
			objs["room" + sublen] = "1x1 Room";
			$scope.conference_sub_header.push(objs);
			$scope.sub_header = angular.copy($scope.conference_sub_header);
			var obj = new Object();
			obj.heading = sublen;
			obj.length = 0;
			$scope.subheaderLength.push(obj);
			var day = "day" + $scope.mainheaderLength;
			$scope.total_no_days.push(day);
			if ($scope.conference_data.length > 0) {
				angular.forEach($scope.conference_data, function (data, index) {
					var keyss = "day" + $scope.mainheaderLength;
					data["day" + $scope.mainheaderLength] = [];
					angular.forEach(data, function (dt, di) {
						if (keyss == di) {
							dt.push('');
						}
					});
				});
			}

		}

		// Show modal to add date and time to conference table
		$scope.addRoomtime = function () {
			$scope.dateOptions = {
				// dateDisabled: disabled,
				formatYear: 'yy',
				maxDate: new Date(2023, 5, 22),
				minDate: new Date(),
				startingDay: 1
			};
			if ($scope.subheaderLength.length > 0) {
				$scope.showDatetime = true;
			} else {
				alertService.add("warning", "Add room to add date and time!", 2000);
				return false;
			}

		}
		// CLose modal
		$scope.closeroomtime = function () {
			$scope.showDatetime = false;
		}

		$scope.formatDatetime = function (date) {
			var d = new Date(date);
			var hh = d.getUTCHours();
			var m = d.getUTCMinutes();
			var s = d.getUTCSeconds();
			var dd = "am";
			var h = hh;
			if (h >= 12) {
				h = hh - 12;
				dd = "PM";
			}
			if (h == 0) {
				h = 12;
			}
			m = m < 10 ? "0" + m : m;

			s = s < 10 ? "0" + s : s;
			/* if you want 2 digit hours:
			h = h<10?"0"+h:h; */

			var pattern = new RegExp("0?" + hh + ":" + m + ":" + s);

			var replacement = h + ":" + m;
			/* if you want to add seconds
			replacement += ":"+s;  */
			replacement += " " + dd;
			return replacement;
			//return date.replace(pattern,replacement);
		}
		$scope.insertroomtime = function () {
			if (angular.isUndefined($scope.roomData.roomdate) || $scope.roomData.roomdate == null || $scope.roomData.roomdate == 'null') {
				alertService.add("warning", "Select date!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.roomData.roomtime) || $scope.roomData.roomtime == null || $scope.roomData.roomtime == 'null') {
				alertService.add("warning", "Select time!", 2000);
				return false;
			}
			var d = new Date($scope.roomData.roomdate);
			var mnt = ((parseInt(d.getMonth()) + 1) < 10 ? '0' : '') + (parseInt(d.getMonth()) + 1);
			var dd = (parseInt(d.getDate()) < 10 ? '0' : '') + parseInt(d.getDate());

			var dt = d.getFullYear() + "-" + mnt + "-" + dd;

			var d1 = $scope.formatDatetime($scope.roomData.roomtime);
			var selecteddate = dt + " " + d1;
			if (selecteddate != '') {
				var exist = 0;
				angular.forEach($scope.conference_sub_header, function (data, ind) {
					if (angular.isDefined(data.heading) && data.heading == selecteddate) {
						exist = 1;
					}
				});
				if (exist == 1) {
					alertService.add("warning", "Date and Time already exist!", 2000);
					return false;
				}
				$scope.conference_main_header[$scope.conference_main_header.length - 1].spanlength = $scope.conference_main_header[$scope.conference_main_header.length - 1].spanlength + 1;
				$scope.subheaderLength
				var sublen = $scope.subheaderLength.length;
				$scope.subheaderLength[sublen - 1].length = $scope.subheaderLength[sublen - 1].length + 1;

				var objs = new Object();
				objs["day" + $scope.subheaderLength[sublen - 1].length] = selecteddate;
				objs.heading = selecteddate;
				objs.required = true;
				objs["rooms" + sublen] = "1x1 Room";
				$scope.conference_sub_header.push(objs);
				$scope.sub_header.push(objs);
				if ($scope.conference_data.length > 0) {
					angular.forEach($scope.conference_data, function (data, index) {
						var keyss = "day" + $scope.mainheaderLength;
						angular.forEach(data, function (dt, di) {
							if (keyss == di) {
								dt.push('');
							}
						});
					});
				}
			}
			$scope.showDatetime = false;
		};
		$scope.showto = function () {
			$scope.todt.opened = !$scope.todt.opened;
		}

		$scope.updateStatus = function (condata, ind, dat) {
			if (angular.isDefined(condata)) {
				angular.forEach(condata, function (cdat, cdkey) {
					if (cdkey == ind) {
						cdat = dat;
					}
				});
			}
		}

		$scope.con_init = function () {
			$scope.datepickersOptions = {
				minDate: new Date('2010-05-01'),
				initDate: new Date()
			};
		}
		$scope.remove_conf_row = function (index) {
			$scope.conference_data.splice(index, 1);

		};
		$scope.conf_open = function (index) {
			$timeout(function () {
				$scope.conf_opened[index] = true;
			});
		};
		$scope.breakout_open = function (index) {
			$timeout(function () {
				$scope.breakout_opened[index] = true;
			});
		}
		$scope.add_conference_row = function () {
			var objs = new Object();
			objs.corporate_name = '';
			objs.ticker = '';
			objs.presenter_name = '';
			objs.presenter_title = '';
			objs.presentation_day = '';
			objs.presentation_time = '';
			objs.presentation_room = '';
			objs.breakout_day = '';
			objs.breakout_time = '';
			objs.breakout_room = '';
			//if($scope.conference_data.length>0){
			var keyss = '';
			var rooms = 1;
			angular.forEach($scope.sub_header, function (datas, dkey) {
				if (dkey > 10) {
					var str = '';
					if (angular.isDefined(datas.heading)) {
						str = datas.heading;
					}
					var res = str.toString().toLowerCase();
					var ind = res.indexOf('r');

					if (ind >= 0) {

						objs["day" + rooms] = [];
						keyss = "day" + rooms;
						rooms = rooms + 1;
						$scope.totaldays.push(keyss);
					}
					if (rooms > 1) {

						angular.forEach(objs, function (obval, obk) {
							if (obk == keyss) {
								obval.push('');
							}
						});
					}
				}
			});
			//	}

			$scope.conference_data.push(objs);
			$timeout(function () {
				var lengthofrows = $scope.conference_data.length - 1;
				var textboxid = "#confdata_" + lengthofrows + "_value";
				$(textboxid).focus();
				//console.log(textboxid);
			}, 100);

		}

		$scope.clear_conference = function () {
			$scope.conference_main_header = [{
					heading: ''
				}, {
					heading: ''
				}, {
					heading: ''
				}, {
					heading: ''
				}, {
					heading: ''
				},
				{
					heading: 'Presentation',
					spanlength: 3
				}, {
					heading: 'Break-out',
					spanlength: 3
				}
			];

			$scope.conference_sub_header = [{
					heading: '#'
				},
				{
					heading: 'Corporate Name'
				},
				{
					heading: 'Ticker'
				},
				{
					heading: 'Presenter Name'
				},
				{
					heading: 'Presenter Title'
				},
				{
					heading: 'Day'
				},
				{
					heading: 'Time'
				},
				{
					heading: 'Room #'
				},
				{
					heading: 'Day'
				},
				{
					heading: 'Time'
				},
				{
					heading: 'Room #'
				}
			];


			$scope.conference_data = [];
			$scope.breakout_opened = [];
			$scope.total_no_days = [];


			$scope.main_header = [];
			$scope.sub_header = [];
			$scope.conferencedata = [];
			$scope.totaldays = [];
			$scope.conf_opened = [];
			$scope.subheaderLength = [];
			$scope.mainheaderLength = 0;
		}

		$scope.select_corporate_event = function (selected) {

			$scope.conference_data[this.$parent.$index].corporate_id = '';
			$scope.conference_data[this.$parent.$index].corporate_name = '';
			$scope.conference_data[this.$parent.$index].ticker = '';
			if (selected != undefined) {
				if (selected.originalObject.user_id && selected.originalObject.company_name && selected.originalObject.ticker) {
					$scope.conference_data[this.$parent.$index].corporate_id = selected.originalObject.user_id;
					$scope.conference_data[this.$parent.$index].corporate_name = selected.originalObject.company_name;
					$scope.conference_data[this.$parent.$index].ticker = selected.originalObject.ticker;
				}
			}
		}


		$scope.select_corporate_field = function (selected) {

			$scope.corporates[this.$parent.$index].corporate_id = '';
			$scope.corporates[this.$parent.$index].corporate_name = '';
			$scope.corporates[this.$parent.$index].ticker = '';
			if (selected != undefined) {
				if (selected.originalObject.user_id && selected.originalObject.company_name && selected.originalObject.ticker) {
					$scope.corporates[this.$parent.$index].corporate_id = selected.originalObject.user_id;
					$scope.corporates[this.$parent.$index].corporate_name = selected.originalObject.company_name;
					$scope.corporates[this.$parent.$index].ticker = selected.originalObject.ticker;
				}
			}
		}




		$scope.remove_row = function (data, tab) {
			var index = $scope.cdata.possibletime.indexOf(tab);
			if (index >= 0) {
				var ind = $scope.cdata.possibletime[index].content.indexOf(data);
				if (ind >= 0) {
					$scope.cdata.possibletime[index].content.splice(ind, 1);
				}
			}
		}

		$scope.open3 = function () {
			$scope.minDate = new Date();
			$scope.deadline.opened = true;
		};

		//conferance end


		$scope.addevent = function () {

			

			if ($scope.cdata.event_type == 'dealRoadshow') {

				if ($scope.cdata.corporate_name == '' || angular.isUndefined($scope.cdata.corporate_name)) {
					$('#broke_value').attr('required', true);
					$('#broke_value').focus();
					alertService.add("warning", "Enter corporate name!", 2000);
					return false;
				}
				if (!$scope.cdata.timezone_id) {
					$('#timezone_id').attr('required', true);
					$('#timezone_id').focus();
					alertService.add("warning", "Please select timezone !", 2000);
					return false;
				} else if (!$scope.cdata.organizer_name) {
					$('#organizer_name').attr('required', true);
					$('#organizer_name').focus();
					alertService.add("warning", "Please enter event organizer name !", 2000);
					return false;
				} else if (!$scope.cdata.organizer_email) {
					$('#organizer_email').attr('required', true);
					$('#organizer_email').focus();
					alertService.add("warning", "Please enter valid  event organizer mail id !", 2000);
					return false;
				} else if (!$scope.cdata.organizer_phone) {
					$('#organizer_phone').attr('required', true);
					$('#organizer_phone').focus();
					alertService.add("warning", "Please enter valid phone no !", 2000);
					return false;
				} else if ($scope.cdata.corporatenameslist.length == 0) {
					alertService.add("warning", "Please choose atleast one Corporate Name and title!", 2000);
					return false;
				} else if ($scope.cdata.possibletime.length == '0') {
					alertService.add("warning", "Please choose atleast one Schedule Date and location!", 2000);
					return false;
				} else {
					$scope.spinnerActive = true;
					$scope.cdata.industryTagsAdded = $scope.industryTagsAdded;

					$scope.cdata.presentaion_file = {};
					$scope.cdata.presentaion_file = $scope.presentaion_file;
					var url = 'apiv4/public/event/addeventbroker';
					var params = {
						type: 'put',
						cdata: $scope.cdata
					};
					RequestDetail.getDetail(url, params).then(function (result) {
						if (result.data == 0) {
							$scope.spinnerActive = false;
							alertService.add("success", "New Event Created successfully!", 2000);
							$location.path('eventslist');
						} else {
							$scope.spinnerActive = false;
							alertService.add("warning", "Something error try agin later!", 2000);
						}
					});
				}
			} else if ($scope.cdata.event_type == 'fieldTrip') {
				if (!$scope.cdata.event_title) {
					$('#event_title').css('border-color', 'red');
					$('#event_title').attr('required', true);
					$('#event_title').focus();
					alertService.add("warning", "Please enter Event title!", 2000);
					return false;
				}
				if (!$scope.cdata.dead_line) {

					$('#dead_line').attr('required', true);
					$('#dead_line').focus();
					alertService.add("warning", "Please select Deadline!", 2000);
					return false;
				}
				if (!$scope.cdata.organizer_name) {
					$('#organizer_name').css('border-color', 'red');
					$('#organizer_name').attr('required', true);
					$('#organizer_name').focus();
					alertService.add("warning", "Please enter Organizer name!", 2000);
					return false;
				}
				if (!$scope.cdata.organizer_email) {
					$('#organizer_email').css('border-color', 'red');
					$('#organizer_email').attr('required', true);
					$('#organizer_email').focus();
					alertService.add("warning", "Please enter organizer email id !", 2000);
					return false;
				}
				if (!$scope.cdata.organizer_phone) {
					$('#organizer_phone').css('border-color', 'red');
					$('#organizer_phone').attr('required', true);
					$('#organizer_phone').focus();
					alertService.add("warning", "Please enter valid phone!", 2000);
					return false;
				}
				if (!$scope.cdata.organizer_description) {
					$('#organizer_description').css('border-color', 'red');
					$('#organizer_description').attr('required', true);
					$('#organizer_description').focus();
					alertService.add("warning", "Please enter event description!", 2000);
					return false;
				}
				if (!$scope.cdata.city_of_point) {
					$('#city_of_point').attr('required', true);
					$('#city_of_point').focus();
					alertService.add("warning", "Please enter city !", 2000);
					return false;
				}
				if (!$scope.cdata.timezone_id) {
					$('#timezone_id').attr('required', true);
					$('#timezone_id').focus();
					alertService.add("warning", "Please select timezone !", 2000);
					return false;
				}
				if (!$scope.cdata.date) {
					$('#date').css('border-color', 'red');
					$('#date').attr('required', true);
					$('#date').focus();
					alertService.add("warning", "Please enter event date!", 2000);
					return false;
				}

				$scope.length = $scope.corporates.length - 1;

				// return false;

				if ($scope.corporates.length == 0) {
					alertService.add("warning", "Please add corporate !", 2000);
					return false;
				}
				if ($scope.corporates[$scope.length].meeting_time == undefined) {

					alertService.add("warning", "Please select time!", 2000);
					return false;
				} else {
					// alert('works');
					// return false;
					$scope.spinnerActive = true;
					$scope.cdata.industryTagsAdded = $scope.industryTagsAdded;
					var url = 'apiv4/public/event/add_fieldtrip';
					$scope.cdata.presentaion_file = {};
					$scope.cdata.presentaion_file = $scope.presentaion_file;
					var params = {
						cdata: $scope.cdata,
						corporates: $scope.corporates
					};
					RequestDetail.getDetail(url, params).then(function (result) {
						if (result.data == '1') {
							$scope.spinnerActive = false;
							alertService.add("success", "New Event Created successfully!", 2000);
							$location.path('eventslist');
						}
					});
				}
			} else if ($scope.cdata.event_type == 'conference') {

				if (!$scope.cdata.event_title) {
					$('#event_title').attr('required', true);
					$('#event_title').focus();
					alertService.add("warning", "Please enter event title !", 2000);
					return false;
				} else if (!$scope.cdata.webcast) {
					$('#webcast').attr('required', true);
					$('#webcast').focus();
					alertService.add("warning", "Please enter webcast!", 2000);
					return false;
				} else if (!$scope.cdata.dead_line) {
					$('#deadline_date').attr('required', true);
					$('#deadline_date').focus();
					alertService.add("warning", "Please select deadline date!", 2000);
					return false;
				} else if (!$scope.cdata.organizer_name) {
					$('#organizer_name').attr('required', true);
					$('#organizer_name').focus();
					alertService.add("warning", "Please enter event organizer name!", 2000);
					return false;
				} else if (!$scope.cdata.organizer_email) {
					$('#organizer_email').attr('required', true);
					$('#organizer_email').focus();
					alertService.add("warning", "Please enter valid mail id!", 2000);
					return false;
				} else if (!$scope.cdata.organizer_phone) {
					$('#organizer_phone').attr('required', true);
					$('#organizer_phone').focus();
					alertService.add("warning", "Please enter valid phone no !", 2000);
					return false;
				} else if (!$scope.cdata.organizer_description) {
					$('#organizer_description').attr('required', true);
					$('#organizer_description').focus();
					alertService.add("warning", "Please enter description!", 2000);
					return false;
				}
				if (!$scope.cdata.timezone_id) {
					$('#timezone_id').attr('required', true);
					$('#timezone_id').focus();
					alertService.add("warning", "Please select timezone !", 2000);
					return false;
				} else if (!$scope.cdata.city) {
					$('#city').attr('required', true);
					$('#city').focus();
					alertService.add("warning", "Please enter location!", 2000);
					return false;
				} else if (!$scope.cdata.date) {
					$('#date').attr('required', true);
					$('#date').focus();
					alertService.add("warning", "Please select date!", 2000);
					return false;
				} else if (!$scope.conference_data || $scope.conference_data.length == 0) {
					alertService.add("warning", "Please enter atleast one row!", 2000);
					return false;
				} else {
					var notvalidcorp = 0;
					var notvalidpn = 0;
					var notvalidpt = 0;
					var notvalidvalue = 0;
					var notvalidday = 0;
					var dayadd = 0;
					angular.forEach($scope.conference_data, function (confdata, confindex) {
						if (notvalidpn == 0 && (!angular.isDefined(confdata.presenter_name) || confdata.presenter_name == '')) {
							notvalidpn = notvalidpn + 1;
						}
						if (notvalidpt == 0 && (!angular.isDefined(confdata.presenter_title) || confdata.presenter_title == '')) {
							notvalidpt = notvalidpt + 1;
						}

					});
					if (notvalidcorp == 0 || notvalidpn == 0 || notvalidpt == 0) {
						var inkey = 1;
						angular.forEach($scope.conference_main_header, function (mainhead, mainkey) {
							if (angular.isDefined(mainhead.heading) && mainhead.heading == "DATE (DAY " + inkey + ")") {
								dayadd = dayadd + 1;
								angular.forEach($scope.conference_data, function (condata, conindex) {
									if (condata.hasOwnProperty("day" + inkey)) {
										if (condata["day" + inkey].length == 1) {
											notvalidday = notvalidday + 1;
										}
										angular.forEach(condata["day" + inkey], function (days, dkey) {
											if (dkey > 0 && (!angular.isDefined(days) || days == '')) {
												notvalidvalue = notvalidvalue + 1;
											}
										});
									}
								});
								inkey = inkey + 1;
							}
						});
					}
					if (notvalidcorp > 0) {
						alertService.add("warning", "Please enter values corporate details!", 2000);
						return false;
					}
					if (notvalidpn > 0) { /*, Please enter values Presenter Name*/
						alertService.add("warning", "Did you must select the tick box!", 2000);
						return false;
					}
					if (notvalidpt > 0) {
						alertService.add("warning", "Please enter values Presenter Title!", 2000);
						return false;
					}
					if (dayadd == 0) {
						alertService.add("warning", "Please add atleast one of the room in header!", 2000);
						return false;
					}
					if (notvalidday > 0) {
						alertService.add("warning", "Please enter the time of day's coloumn!", 2000);
						return false;
					}
					if (notvalidvalue > 0) {
						alertService.add("warning", "Please select the values in day coloumn!", 2000);
						return false;
					}



					$scope.spinnerActive = true;
					$scope.cdata.industryTagsAdded = $scope.industryTagsAdded;
					var url = 'apiv4/public/event/add_conference';
					$scope.cdata.presentaion_file = {};
					$scope.cdata.presentaion_file = $scope.presentaion_file;
					var obj = new Object();
					obj.conference_data = angular.copy($scope.cdata);
					obj.conference_details = angular.copy($scope.conference_data);
					obj.conference_headers = angular.copy($scope.conference_sub_header);
					var params = {
						type: 'put',
						cdata: obj
					};

					RequestDetail.getDetail(url, params).then(function (result) {

						if (result.data == 0) {
							$scope.spinnerActive = false;
							alertService.add("success", "New Event Created successfully!", 2000);
							$location.path('eventslist');

						}
					});
				}
			} else if ($scope.cdata.event_type == 'investorServiceMeeting') {

				if (!$scope.cdata.event_title) {
					$('#event_title').css('border-color', 'red');
					$('#event_title').attr('required', true);
					$('#event_title').focus();
					alertService.add("warning", "Please enter Event title!", 2000);
					return false;
				} else if (!$scope.cdata.event_organizer) {
					$('#event_organizer').css('border-color', 'red');
					$('#event_organizer').attr('required', true);
					$('#event_organizer').focus();
					alertService.add("warning", "Please enter Event Organizer name !", 2000);
					return false;
				} else if (!$scope.cdata.event_mail) {
					$('#event_mail').css('border-color', 'red');
					$('#event_mail').attr('required', true);
					$('#event_mail').focus();
					alertService.add("warning", "Please enter valid Organizer email !", 2000);
					return false;
				} else if (!$scope.cdata.event_phone) {
					$('#event_phone').css('border-color', 'red');
					$('#event_phone').attr('required', true);
					$('#event_phone').focus();
					alertService.add("warning", "Please enter valid phone no !", 2000);
					return false;
				} else if (!$scope.cdata.organizer_description) {
					$('#organizer_description').css('border-color', 'red');
					$('#organizer_description').attr('required', true);
					$('#organizer_description').focus();
					alertService.add("warning", "Please enter Event description!", 2000);
					return false;
				}

				if (!$scope.cdata.timezone_id) {
					$('#timezone_id').attr('required', true);
					$('#timezone_id').focus();
					alertService.add("warning", "Please select timezone !", 2000);
					return false;
				} else if ($scope.cdata.possibletime.length == '0') {
					$('#date').attr('required', true);
					$('#city').focus();
					alertService.add("warning", "Please choose atleast one Schedule Date and location!", 2000);
					return true;
				} else {
					$scope.spinnerActive = true;
					$scope.cdata.industryTagsAdded = $scope.industryTagsAdded;

					$scope.cdata.presentaion_file = {};
					$scope.cdata.presentaion_file = $scope.presentaion_file;
					var url = 'apiv4/public/event/addinvestorServiceMeeting';
					var params = {
						type: 'put',
						cdata: $scope.cdata
					};
					RequestDetail.getDetail(url, params).then(function (result) {
						if (result.data == 0) {
							$scope.spinnerActive = false;
							alertService.add("success", "New Event Created successfully!", 2000);
							$location.path('dashboard');
						} else {
							$scope.spinnerActive = false;
							alertService.add("warning", "Something error try agin later!", 2000);
						}
					});
				}
			}
		}


	})
	.controller('newEventCtrl_old', function ($scope, $http, $location, localStorageService, RequestDetail, alertService, $filter, $timeout, configdetails) {
		$scope.configdetails = configdetails;
		var local = localStorageService;
		$scope.availableLocation = [];
		$scope.pageHeading = 'Dashboard';
		$scope.dasboardActive = 'active';
		$scope.tags = {};
		$scope.cdata = {};
		$scope.cdata.possibletime = [];
		$scope.spinnerActive = false;
		$scope.cdata.corporatenameslist = [];
		$scope.cdata.event_type = 'ndr';
		$scope.cdata.meetingfillmethod = '1';
		$scope.cdata.invitationtype = 'Private';
		$scope.presentaion_file = [];
		$scope.tags.investers = '';
		$scope.tags.valMacroTags = '';
		$scope.tags.valMidTags = '';
		$scope.tags.valMicroTags = '';
		$scope.industryTagsAdded = [];
		$scope.cdata.addinvesterslist = [];
		$scope.cdata.earningcallfollow = [];
		$scope.cdata.check = 'no';
		$scope.cdata.person_company_name = '';
		$scope.cdata.person_name = '';
		$scope.cdata.person_title = '';
		$scope.cdata.broker_mail = 'test';
		$scope.cdata.person_phone = '';
		$scope.cdata.investorEmail = '';

		$scope.cdata.person_company_names = '';
		$scope.cdata.person_names = '';
		$scope.cdata.person_titles = '';
		$scope.cdata.person_phones = '';
		$scope.cdata.corporate_mails = '';
		$scope.corporate = [];
		$scope.corporate.person_company_name = '';
		$scope.corporate.person_name = '';
		$scope.corporate.person_title = '';
		$scope.corporate.person_phone = '';
		$scope.corporate.corporate_mail = '';
		$scope.todt = {};
		$scope.todt.opened = false;
		$scope.cdata.corporate_mail = '';

		$scope.showModalpageinfo = false;

		$scope.openmodelpagehelp = function () {
			$scope.showModalpageinfo = !$scope.showModalpageinfo;
		}

		$scope.corporates = [];

		$scope.rpmenu = localStorageService.get('research_provider_status'); // for rp logged menu

		var live_eve = localStorageService.get('live_events');

		$scope.usertype = localStorageService.get('usertype');
		var user_data = localStorageService.get('userdata');
		$scope.user_id = user_data.user_id;
		$scope.showDatetime = false;

		if ($scope.usertype == 'broker') {
			$scope.cdata.broker = $scope.user_id;
		}


		$scope.today = new Date();
		$scope.roomData = {};
		$scope.roomData.roomdate = new Date();
		$scope.roomData.roomtime = new Date();
		$scope.time = {
			now: '12:00 am'
		};

		$scope.conf_req = true;
		$scope.meeting_times = [{
				value: '',
				text: 'Select'
			},
			{
				value: '12:00 AM',
				text: '12:00 AM'
			},
			{
				value: '01:00 AM',
				text: '1:00 AM'
			},
			{
				value: '02:00 AM',
				text: '2:00 AM'
			},
			{
				value: '03:00 AM',
				text: '3:00 AM'
			},
			{
				value: '04:00 AM',
				text: '4:00 AM'
			},
			{
				value: '05:00 AM',
				text: '5:00 AM'
			},
			{
				value: '06:00 AM',
				text: '6:00 AM'
			},
			{
				value: '07:00 AM',
				text: '7:00 AM'
			},
			{
				value: '08:00 AM',
				text: '8:00 AM'
			},
			{
				value: '09:00 AM',
				text: '9:00 AM'
			},
			{
				value: '10:00 AM',
				text: '10:00 AM'
			},
			{
				value: '11:00 AM',
				text: '11:00 AM'
			},
			{
				value: '12:00 PM',
				text: '12:00 PM'
			},
			{
				value: '01:00 PM',
				text: '1:00 PM'
			},
			{
				value: '02:00 PM',
				text: '2:00 PM'
			},
			{
				value: '03:00 PM',
				text: '3:00 PM'
			},
			{
				value: '04:00 PM',
				text: '4:00 PM'
			},
			{
				value: '05:00 PM',
				text: '5:00 PM'
			},
			{
				value: '06:00 PM',
				text: '6:00 PM'
			},
			{
				value: '07:00 PM',
				text: '7:00 PM'
			},
			{
				value: '08:00 PM',
				text: '8:00 PM'
			},
			{
				value: '09:00 PM',
				text: '9:00 PM'
			},
			{
				value: '10:00 PM',
				text: '10:00 PM'
			},
			{
				value: '11:00 PM',
				text: '11:00 PM'
			}
		];

		$scope.meeting_times_array = angular.copy($scope.meeting_times);
		$scope.disabled = {};
		$scope.disabled_array = [];

		$scope.showInvestorModal = false;
		$scope.get_matched_brokers = function () {

			var tagUrl = 'apiv4/public/event/get_matched_brokers';
			var params = {
				company_name: $('#broker_name').val()
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {

				if (angular.isDefined(result.data) && result.data != '') {
					if (result.data == 0) {
						//$('#user').removeClass('hidden');
					} else {
						$("#broker_name").autocomplete({
							source: result.data,
							select: function (a, b) {

								$scope.cdata.broker_name = b.item.value;
								$scope.cdata.broker = b.item.user_id;
								$scope.cdata.broker_mail = b.item.email;
								$scope.cdata.broker_phone = b.item.contact;
							}
						});
						//$('#user').addClass('hidden');
					}
				}
			});
		}
		$scope.timecheck = function () {
			if ($scope.cdata.fromtime != "any" && $scope.cdata.totime != "any") {
				var jdt1 = Date.parse('20 Aug 2000 ' + $scope.cdata.fromtime);
				var jdt2 = Date.parse('20 Aug 2000 ' + $scope.cdata.totime);
				if (jdt2 <= jdt1) {
					alertService.add("warning", "Please select valid from time and to time!", 2000);
					return false;
				}
			}
		}
		$scope.get_loc_details = function (val) {
			var locurl = 'apiv4/public/event/get_location';
			var params = {
				val: val
			};
			$scope.availableLocation = [];
			RequestDetail.getDetail(locurl, params).then(function (result) {
				angular.forEach(result.data, function (val, key) {
					if ($scope.containsstring($scope.availableLocation, val)) {
						$scope.availableLocation.push(val);
					}
				});
			});
		}
		$scope.containsstring = function (a, obj) {
			for (var i = 0; i < a.length; i++) {
				if (a[i] === obj) {
					return false;
				}
			}
			return true;
		}
		// Get Broker Details 
		$scope.get_rpdetails = function () {

			var tagUrl = 'apiv4/public/event/get_details';
			var params = {
				company_name: $('#broker_name').val()
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {

				if (angular.isDefined(result.data) && result.data != 0) {
					$scope.cdata.person_company_name = '';
					$scope.cdata.person_name = '';
					$scope.cdata.person_title = '';
					$scope.cdata.person_phone = '';
				} else if ($scope.cdata.person_company_name != $scope.cdata.broker_name && $scope.cdata.person_name == '') {
					$scope.cdata.broker = '';
					$scope.cdata.broker_mail = '';
					$scope.cdata.broker_phone = '';
				}


			});
		}

		$scope.get_matched = function () {

			var tagUrl = 'apiv4/public/event/get_corporate_names';
			var params = {
				company_name: $('#broke_value').val()
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {

				if (angular.isDefined(result.data) && result.data != '') {
					if (result.data == 0) {
						$('#user').removeClass('hidden');
					} else {
						$("#broke_value").autocomplete({
							source: result.data,
							select: function (a, b) {
								$scope.cdata.corporate_name = b.item.value;
								$scope.cdata.corporate_id = b.item.user_id;
								$scope.cdata.ticker = b.item.ticker;
							}
						});
						$('#user').addClass('hidden');
					}
				}
			});
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

		$scope.show_dashboard = function () {

			$location.path('dashboard');
		}

		// Autocomplete Company Name 

		var tagUrl = 'apiv4/public/dashboard/get_corporate_company_name';
		var params = {
			key: 'tags'
		};

		RequestDetail.getDetail(tagUrl, params).then(function (result) {

			if (angular.isDefined(result.data) && result.data != '') {
				$scope.corporate_company = {};
				$scope.corporate_company = result.data;

			}
		});


		//get datas  On select autocomplete ticker 

		$scope.get_corp_datas = function () {

			var params = $('#broke_value').val();
			var tagUrl = 'apiv4/public/dashboard/get_corp_datas';
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				if (angular.isDefined(result.data) && result.data != 0) {
					$scope.cdata.person_company_name = '';
					$scope.cdata.person_name = '';
					$scope.cdata.person_title = '';
					$scope.cdata.person_phone = '';
				} else if ($scope.cdata.person_company_name != $scope.cdata.corporate_name && $scope.cdata.person_name == '') {
					$scope.cdata.corporate_id = '';
					$scope.cdata.ticker = '';
				}
			});
		}

		$scope.get_matched_tickers = function () {

			var tagUrl = 'apiv4/public/event/get_matched_tickers';
			var params = {
				company_ticker: $('#company_ticker').val()
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {

				if (angular.isDefined(result.data) && result.data != '') {
					if (result.data != 0) {
						$("#company_ticker").autocomplete({
							source: result.data
						});
					}
				}
			});
		}


		// Autocomplete Company Ticker 

		var tagUrl = 'apiv4/public/dashboard/get_tickers';
		var params = {
			key: 'tags'
		};

		RequestDetail.getDetail(tagUrl, params).then(function (result) {

			if (angular.isDefined(result.data) && result.data != '') {
				$scope.ticker_list = {};
				$scope.ticker_list = result.data;

			}
		});

		//get datas  On select autocomplete ticker 

		$scope.get_ticker_datas = function () {

			// var params = $scope.cdata.ticker;
			// var tagUrl = 'apiv4/public/dashboard/get_ticker_datas';	
			// RequestDetail.getDetail(tagUrl,params).then(function(result){
			// 	if(angular.isDefined(result.data) &&  result.data !='')
			// 	{
			// 		angular.forEach(result.data,function(datas){

			// 		});	
			// 	}
			//});
		}


		$scope.enable_disable = function () {
			var temp = [];
			angular.forEach($scope.corporates, function (corp, index) {
				if (angular.isDefined(corp.meeting_time) && corp.meeting_time != '') {
					temp.push(corp.meeting_time);
				}
			});
			$scope.disabled_array = temp;
		}


		$scope.corporates = [];
		// $scope.meeting_time = 'test';


		$scope.add_row = function () {

			$scope.time = {};
			var length = $scope.corporates.length - 1;
			if ($scope.corporates.length >= 1) {
				if ($scope.corporates == undefined) {
					alertService.add("warning", "Please enter Corporate name !", 2000);
					return false;
				}
			}
			$scope.inserted = {
				meeting_time: ''
			};
			$scope.corporates.push($scope.inserted);
		}


		$scope.remove_rows = function (index) {
			$scope.corporates.splice(index, 1);
			$scope.enable_disable();
		};

		$scope.show_time = function () {
			var selected = $filter('filter')($scope.meeting_time, {
				value: $scope.meeting_time
			});
			return ($scope.time.meeting_time && selected.length) ? selected[0].text : 'Not set';
		};

		$scope.test = function (value) {
			if (!angular.Undefined(value)) {
				return $scope.show = true;
			}
		};

		$scope.today = function () {
			$scope.dt = new Date();
		};
		$scope.today();

		$scope.clear = function () {
			$scope.dt = null;
		};
		var monthNames = [
			"January", "February", "March",
			"April", "May", "June", "July",
			"August", "September", "October",
			"November", "December"
		];

		var tagUrl = 'apiv4/public/dashboard/getInvestorsList';
		var params = {
			key: 'tags'
		};
		RequestDetail.getDetail(tagUrl, params).then(function (result) {

			$scope.investerslist = {};
			$scope.investerslist = result.data;
		});


		// Broker List 
		var tagUrl = 'apiv4/public/dashboard/getbrokerlist';
		var params = {
			key: 'tags'
		};
		RequestDetail.getDetail(tagUrl, params).then(function (result) {
			$scope.brokerlist = {};
			$scope.brokerlist = result.data;
		});

		// Investor List 
		var tagUrl = 'apiv4/public/dashboard/get_investor_list';
		var params = {
			key: 'tags'
		};
		RequestDetail.getDetail(tagUrl, params).then(function (result) {
			$scope.investor_list = {};
			$scope.investor_list = result.data;
		});

		$scope.getconrporate = function () {
			// Corporate list 
			var tagUrl = 'apiv4/public/dashboard/get_corporate_list';
			var params = {
				key: 'tags'
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				$scope.corporate_list = {};
				$scope.corporate_list = result.data;
			});
		}
		$scope.selected = undefined;
		$scope.formatLabel = function (model) {

			for (var i = 0; i < $scope.coporate_list.length; i++) {
				if (model === $scope.coporate_list[i].user_id) {
					return $scope.coporate_list[i].company_name;
				}
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


		$scope.download_invalid_datas = function () {
			window.location.href = "apiv4/public/event/download_invalid_datas";
		}


		//upload fieldtrip excel 
		$scope.upload_fieldtrip_excel = function (data) {
			$scope.corporates = [];
			var corporates = [];

			if (angular.isDefined(data.valid_datas)) {
				angular.forEach(data.valid_datas, function (details) {
					corporates.push(details);

				});

				$scope.corporates = corporates;
				$scope.$apply();
				$timeout(function () {
					angular.forEach(data.valid_datas, function (dat, key) {
						if (angular.isDefined(dat.corporate_name) && dat.corporate_name != '') {
							$scope.$broadcast('angucomplete-alt:changeInput', 'corporate' + key, dat.corporate_name);
						}
					});
				}, 1000);
			}
			if (angular.isDefined(data.invalid_datas)) {
				$scope.invalid_datas = true;
			} else {
				$scope.invalid_datas = false;
			}
		}


		$scope.conference_main_header = [{
				heading: ''
			},
			{
				heading: ''
			},
			{
				heading: ''
			},
			{
				heading: ''
			},
			{
				heading: ''
			},
			{
				heading: 'Presentation',
				spanlength: 3
			},
			{
				heading: 'Break-out',
				spanlength: 3
			}
		];

		$scope.conference_sub_header = [{
				heading: '#'
			},
			{
				heading: 'Corporate Name',
				required: true
			},
			{
				heading: 'Ticker',
				required: true
			},
			{
				heading: 'Presenter Name',
				required: true
			},
			{
				heading: 'Presenter Title',
				required: true
			},
			{
				heading: 'Day'
			}, {
				heading: 'Time'
			}, {
				heading: 'Room #'
			},
			{
				heading: 'Day'
			}, {
				heading: 'Time'
			}, {
				heading: 'Room #'
			}
		];


		$scope.conference_data = [];
		$scope.breakout_opened = [];
		$scope.total_no_days = [];


		$scope.main_header = [];
		$scope.sub_header = [];
		$scope.conferencedata = [];
		$scope.totaldays = [];
		$scope.conf_opened = [];
		$scope.selectedopinion = [{
			"val": 'Y'
		}, {
			"val": 'N'
		}, {
			"val": 'M'
		}];
		$scope.mainheaderLength = 0;
		$scope.subheaderLength = [];

		//Conference Excel upload  
		$scope.upload_conference_excel = function (data) {
			if ($scope.conferencedata.length == 0) {
				$scope.main_header = [];
				$scope.sub_header = [];
				$scope.conferencedata = [];
				$scope.totaldays = [];
				$scope.conf_opened = [];
				$scope.breakout_opened = [];
			}
			$scope.result = angular.copy(data.result);

			angular.forEach($scope.result, function (todo, key) {
				if (key == 0) {
					$scope.main_header = [{
							heading: ''
						},
						{
							heading: ''
						},
						{
							heading: ''
						},
						{
							heading: ''
						},
						{
							heading: ''
						}
					];
					var mlen = 0;
					angular.forEach(todo, function (mainheader, mkey) {
						if (angular.isDefined(mainheader) && mainheader != '' && mainheader != null) {
							var obj = new Object();

							if (mainheader.trim() == 'Presentation' || mainheader.trim() == 'Break-out') {
								obj.spanlength = 3;
								obj.heading = mainheader.trim();
							} else {
								mlen = mlen + 1;
								$scope.mainheaderLength = mlen;
							}

							$scope.main_header.push(obj);
						}
					});

				} else if (key == 1) {
					var totalcount = 0;
					var exist = 0;
					var keys = 0;
					var todolen = 0;
					var day = 1;
					var dtinc = 0;
					var dateinc = 0;
					var dayinc = 1;
					var timeinc = 1;
					var roomname = '';
					/*
					angular.forEach(todo,function(subheader,skey){
						todolen=todo.length;
						if(angular.isDefined(subheader) && subheader!='' && subheader!=null){
							subheader=subheader.toString().trim();
							var already=0;
							var objs=new Object();
							if(skey>=11){

								var valid=true;
								if(new Date(subheader) != "Invalid Date"){
									valid=false;
								}
								if(valid || skey==todo.length-1){
									exist=1;
									if(skey==todo.length-1){
										totalcount=totalcount+1; 	
										objs["rooms" + dtinc] = roomname;
										objs["day" + dayinc] = subheader.toString().trim();;
										dayinc=dayinc+1;
										$scope.subheaderLength[dtinc-1].length=$scope.subheaderLength[dtinc-1].length+1;
									}else{
										already=1;
										roomname=subheader.toString().trim();
										dtinc=dtinc+1;
										dayinc=1;
										objs["room" + dtinc] = roomname;
										var obj=new Object();
										obj.heading=dtinc;
										obj.length=0;
										$scope.subheaderLength.push(obj);
									}
								}else{
									exist=0
									objs["day" + dayinc] = subheader.toString().trim();;
									objs["rooms" + dtinc] = roomname;
									totalcount=totalcount+1;
									dayinc=dayinc+1;
									$scope.subheaderLength[dtinc-1].length=$scope.subheaderLength[dtinc-1].length+1;
								}
								if(exist==1){
									var assigned=0;
									angular.forEach($scope.main_header,function(mhead,mhkey){
										if(mhkey>6 && !angular.isDefined(mhead.spanlength) && totalcount>1 && assigned==0){
											mhead.spanlength=totalcount;
											mhead.heading='DATE (DAY '+day+')';
											day=day+1;
											assigned=assigned+1;
										}
									});
									totalcount=1;
								}

							}
							if(skey>=5 && skey<=10){
								already=1;
							}
							if(already==0 && skey>0){
								objs.required=true;
							}
							objs.heading=subheader.toString().trim();
							$scope.sub_header.push(objs);
						}
					});
					*/
					angular.forEach(todo, function (subheader, skey) {
						todolen = todo.length;
						if (angular.isDefined(subheader) && subheader != '' && subheader != null) {
							var subheaderString = subheader.toString().trim();
							var req_check = 0;
							var objs = new Object();

							if (skey >= 11) {
								req_check = 1;
								//check it is a room or time
								if (subheaderString == '1x1 Room') {
									dateinc = dateinc + 1;
									objs["room" + dateinc] = subheaderString;
									timeinc = 0;
									angular.forEach($scope.main_header, function (mhead, mhkey) {
										if (mhkey > 6 && !angular.isDefined(mhead.spanlength)) {
											mhead.heading = 'DATE (DAY ' + dateinc + ')';
										}
									});
								} else {
									timeinc = timeinc + 1;
									objs["times" + timeinc] = subheaderString;
									objs["day" + dateinc] = subheaderString;
									var pos = 6 + dateinc;
									$scope.main_header[pos].spanlength = timeinc + 1;
								}
							}
							if (skey >= 5 && skey <= 10) {
								req_check = 1;
							}
							if (req_check == 0 && skey > 0) {
								objs.required = true;
							}
							objs.heading = subheader.toString().trim();
							$scope.sub_header.push(objs);
						}
					});

				} else if (key > 1) {

					var objs = new Object();

					var rooms = 1;
					var keyss = '';
					$scope.totaldays = [];
					angular.forEach(todo, function (cdat, ckey) {
						if (cdat == null) {
							cdat = '';
						}
						if (ckey == 0) {
							objs.corporate_name = cdat.toString().trim();
						} else if (ckey == 1) {
							objs.ticker = cdat.toString().trim();
						} else if (ckey == 2) {
							objs.presenter_name = cdat.toString().trim();
						} else if (ckey == 3) {
							objs.presenter_title = cdat.toString().trim();
						} else if (ckey == 4) {
							objs.presentation_day = cdat.toString().trim();
							if (cdat != '') {
								objs.presentation_day = new Date(objs.presentation_day);
							}
						} else if (ckey == 5) {
							objs.presentation_time = cdat.toString().trim();
						} else if (ckey == 6) {
							if (cdat == null) {
								cdat = '';
							}
							objs.presentation_room = cdat;
						} else if (ckey == 7) {
							objs.breakout_day = cdat.toString().trim();
							if (cdat != '') {
								objs.breakout_day = new Date(objs.breakout_day);
							}
						} else if (ckey == 8) {
							objs.breakout_time = cdat.toString().trim();
						} else if (ckey == 9) {
							if (cdat == null) {
								cdat = '';
							}
							objs.breakout_room = cdat;
						}
						if (angular.isDefined(objs.ticker) && objs.ticker != '' && angular.isDefined($scope.corporate_list) && $scope.corporate_list.length > 0) {
							angular.forEach($scope.corporate_list, function (corp, copind) {
								if (angular.isDefined(corp.ticker) && corp.ticker != null && corp.ticker != 'null' && corp.ticker != '' && corp.ticker.toString().toLowerCase() == objs.ticker.toLowerCase()) {
									objs.corporate_id = corp.user_id;
								}
							});
						}
						angular.forEach($scope.sub_header, function (datas, dkey) {
							if (ckey >= 10 && (ckey + 1) == dkey) {
								var str = '';
								if (angular.isDefined(datas.heading)) {
									str = datas.heading;
								}
								var res = str.toString().toLowerCase();
								if (res == '1x1 room') {
									if (cdat == null) {
										cdat = ''
									}
									objs["day" + rooms] = [];
									keyss = "day" + rooms;
									rooms = rooms + 1;
									$scope.totaldays.push(keyss);
								}
								if (rooms > 1) {
									angular.forEach(objs, function (obval, obk) {

										if (obk == keyss) {
											obval.push(cdat);
										}
									});
								}
							}
						});
					});
					objs.incid = 0;
					// //console.log(objs);
					// //console.log($scope.totaldays);
					$scope.conferencedata.push(objs);

				}

			});
			$scope.$apply(function () {
				$scope.conference_main_header = angular.copy($scope.main_header);
				$scope.conference_sub_header = angular.copy($scope.sub_header);
				$scope.conference_data = angular.copy($scope.conferencedata);
				$scope.total_no_days = angular.copy($scope.totaldays);
			});
			$timeout(function () {
				angular.forEach($scope.conference_data, function (confdat, confkey) {
					if (angular.isDefined(confdat.corporate_name) && confdat.corporate_name != '') {
						$scope.$broadcast('angucomplete-alt:changeInput', 'confdata_' + confkey, confdat.corporate_name);
					}
				});
			}, 1000);

		}

		// Add rooms to conference table
		$scope.addRooms = function () {

			if ($scope.subheaderLength.length > 0) {
				if ($scope.subheaderLength[$scope.subheaderLength.length - 1].length == 0) {
					alertService.add("warning", "Add time to add more room!", 2000);
					return false;
				}
			}
			$scope.mainheaderLength = $scope.mainheaderLength + 1;
			var mobj = new Object();
			mobj.spanlength = 1;
			mobj.heading = 'DATE (DAY ' + $scope.mainheaderLength + ')';
			$scope.conference_main_header.push(mobj);
			var sublen = 1;
			if ($scope.subheaderLength.length > 0) {
				sublen = $scope.subheaderLength.length + 1;
			}
			var objs = new Object();
			objs.heading = "1x1 Room";
			objs["room" + sublen] = "1x1 Room";
			$scope.conference_sub_header.push(objs);
			$scope.sub_header = angular.copy($scope.conference_sub_header);
			var obj = new Object();
			obj.heading = sublen;
			obj.length = 0;
			$scope.subheaderLength.push(obj);
			var day = "day" + $scope.mainheaderLength;
			$scope.total_no_days.push(day);
			if ($scope.conference_data.length > 0) {
				angular.forEach($scope.conference_data, function (data, index) {
					var keyss = "day" + $scope.mainheaderLength;
					data["day" + $scope.mainheaderLength] = [];
					angular.forEach(data, function (dt, di) {
						if (keyss == di) {
							dt.push('');
						}
					});
				});
			}

		}

		// Show modal to add date and time to conference table
		$scope.addRoomtime = function () {
			$scope.dateOptions = {
				// dateDisabled: disabled,
				formatYear: 'yy',
				maxDate: new Date(2023, 5, 22),
				minDate: new Date(),
				startingDay: 1
			};
			if ($scope.subheaderLength.length > 0) {
				$scope.showDatetime = true;
			} else {
				alertService.add("warning", "Add room to add date and time!", 2000);
				return false;
			}

		}
		// CLose modal
		$scope.closeroomtime = function () {
			$scope.showDatetime = false;
		}

		$scope.formatDatetime = function (date) {
			var d = new Date(date);
			var hh = d.getUTCHours();
			var m = d.getUTCMinutes();
			var s = d.getUTCSeconds();
			var dd = "am";
			var h = hh;
			if (h >= 12) {
				h = hh - 12;
				dd = "PM";
			}
			if (h == 0) {
				h = 12;
			}
			m = m < 10 ? "0" + m : m;

			s = s < 10 ? "0" + s : s;
			/* if you want 2 digit hours:
			h = h<10?"0"+h:h; */

			var pattern = new RegExp("0?" + hh + ":" + m + ":" + s);

			var replacement = h + ":" + m;
			/* if you want to add seconds
			replacement += ":"+s;  */
			replacement += " " + dd;
			return replacement;
			//return date.replace(pattern,replacement);
		}
		$scope.insertroomtime = function () {
			if (angular.isUndefined($scope.roomData.roomdate) || $scope.roomData.roomdate == null || $scope.roomData.roomdate == 'null') {
				alertService.add("warning", "Select date!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.roomData.roomtime) || $scope.roomData.roomtime == null || $scope.roomData.roomtime == 'null') {
				alertService.add("warning", "Select time!", 2000);
				return false;
			}
			var d = new Date($scope.roomData.roomdate);
			var mnt = ((parseInt(d.getMonth()) + 1) < 10 ? '0' : '') + (parseInt(d.getMonth()) + 1);
			var dd = (parseInt(d.getDate()) < 10 ? '0' : '') + parseInt(d.getDate());

			var dt = d.getFullYear() + "-" + mnt + "-" + dd;

			var d1 = $scope.formatDatetime($scope.roomData.roomtime);
			var selecteddate = dt + " " + d1;
			if (selecteddate != '') {
				var exist = 0;
				angular.forEach($scope.conference_sub_header, function (data, ind) {
					if (angular.isDefined(data.heading) && data.heading == selecteddate) {
						exist = 1;
					}
				});
				if (exist == 1) {
					alertService.add("warning", "Date and Time already exist!", 2000);
					return false;
				}
				$scope.conference_main_header[$scope.conference_main_header.length - 1].spanlength = $scope.conference_main_header[$scope.conference_main_header.length - 1].spanlength + 1;
				$scope.subheaderLength
				var sublen = $scope.subheaderLength.length;
				$scope.subheaderLength[sublen - 1].length = $scope.subheaderLength[sublen - 1].length + 1;

				var objs = new Object();
				objs["day" + $scope.subheaderLength[sublen - 1].length] = selecteddate;
				objs.heading = selecteddate;
				objs.required = true;
				objs["rooms" + sublen] = "1x1 Room";
				$scope.conference_sub_header.push(objs);
				$scope.sub_header.push(objs);
				if ($scope.conference_data.length > 0) {
					angular.forEach($scope.conference_data, function (data, index) {
						var keyss = "day" + $scope.mainheaderLength;
						angular.forEach(data, function (dt, di) {
							if (keyss == di) {
								dt.push('');
							}
						});
					});
				}
			}
			$scope.showDatetime = false;
		};
		$scope.showto = function () {
			$scope.todt.opened = !$scope.todt.opened;
		}

		$scope.updateStatus = function (condata, ind, dat) {
			if (angular.isDefined(condata)) {
				angular.forEach(condata, function (cdat, cdkey) {
					if (cdkey == ind) {
						cdat = dat;
					}
				});
			}
		}

		$scope.con_init = function () {
			$scope.datepickersOptions = {
				minDate: new Date('2010-05-01'),
				initDate: new Date()
			};
		}
		$scope.remove_conf_row = function (index) {
			$scope.conference_data.splice(index, 1);

		};
		$scope.conf_open = function (index) {
			$timeout(function () {
				$scope.conf_opened[index] = true;
			});
		};
		$scope.breakout_open = function (index) {
			$timeout(function () {
				$scope.breakout_opened[index] = true;
			});
		}
		$scope.add_conference_row = function () {
			var objs = new Object();
			objs.corporate_name = '';
			objs.ticker = '';
			objs.presenter_name = '';
			objs.presenter_title = '';
			objs.presentation_day = '';
			objs.presentation_time = '';
			objs.presentation_room = '';
			objs.breakout_day = '';
			objs.breakout_time = '';
			objs.breakout_room = '';
			//if($scope.conference_data.length>0){
			var keyss = '';
			var rooms = 1;
			angular.forEach($scope.sub_header, function (datas, dkey) {
				if (dkey > 10) {
					var str = '';
					if (angular.isDefined(datas.heading)) {
						str = datas.heading;
					}
					var res = str.toString().toLowerCase();
					var ind = res.indexOf('r');

					if (ind >= 0) {

						objs["day" + rooms] = [];
						keyss = "day" + rooms;
						rooms = rooms + 1;
						$scope.totaldays.push(keyss);
					}
					if (rooms > 1) {

						angular.forEach(objs, function (obval, obk) {
							if (obk == keyss) {
								obval.push('');
							}
						});
					}
				}
			});
			//	}

			$scope.conference_data.push(objs);
			$timeout(function () {
				var lengthofrows = $scope.conference_data.length - 1;
				var textboxid = "#confdata_" + lengthofrows + "_value";
				$(textboxid).focus();
				//console.log(textboxid);
			}, 100);

		}

		$scope.clear_conference = function () {
			$scope.conference_main_header = [{
					heading: ''
				}, {
					heading: ''
				}, {
					heading: ''
				}, {
					heading: ''
				}, {
					heading: ''
				},
				{
					heading: 'Presentation',
					spanlength: 3
				}, {
					heading: 'Break-out',
					spanlength: 3
				}
			];

			$scope.conference_sub_header = [{
					heading: '#'
				},
				{
					heading: 'Corporate Name'
				},
				{
					heading: 'Ticker'
				},
				{
					heading: 'Presenter Name'
				},
				{
					heading: 'Presenter Title'
				},
				{
					heading: 'Day'
				},
				{
					heading: 'Time'
				},
				{
					heading: 'Room #'
				},
				{
					heading: 'Day'
				},
				{
					heading: 'Time'
				},
				{
					heading: 'Room #'
				}
			];


			$scope.conference_data = [];
			$scope.breakout_opened = [];
			$scope.total_no_days = [];


			$scope.main_header = [];
			$scope.sub_header = [];
			$scope.conferencedata = [];
			$scope.totaldays = [];
			$scope.conf_opened = [];
			$scope.subheaderLength = [];
			$scope.mainheaderLength = 0;
		}

		$scope.select_corporate_event = function (selected) {

			$scope.conference_data[this.$parent.$index].corporate_id = '';
			$scope.conference_data[this.$parent.$index].corporate_name = '';
			$scope.conference_data[this.$parent.$index].ticker = '';
			if (selected != undefined) {
				if (selected.originalObject.user_id && selected.originalObject.company_name && selected.originalObject.ticker) {
					$scope.conference_data[this.$parent.$index].corporate_id = selected.originalObject.user_id;
					$scope.conference_data[this.$parent.$index].corporate_name = selected.originalObject.company_name;
					$scope.conference_data[this.$parent.$index].ticker = selected.originalObject.ticker;
				}
			}
		}


		$scope.select_corporate_field = function (selected) {

			$scope.corporates[this.$parent.$index].corporate_id = '';
			$scope.corporates[this.$parent.$index].corporate_name = '';
			$scope.corporates[this.$parent.$index].ticker = '';
			if (selected != undefined) {
				if (selected.originalObject.user_id && selected.originalObject.company_name && selected.originalObject.ticker) {
					$scope.corporates[this.$parent.$index].corporate_id = selected.originalObject.user_id;
					$scope.corporates[this.$parent.$index].corporate_name = selected.originalObject.company_name;
					$scope.corporates[this.$parent.$index].ticker = selected.originalObject.ticker;
				}
			}
		}




		$scope.remove_row = function (data, tab) {
			var index = $scope.cdata.possibletime.indexOf(tab);
			if (index >= 0) {
				var ind = $scope.cdata.possibletime[index].content.indexOf(data);
				if (ind >= 0) {
					$scope.cdata.possibletime[index].content.splice(ind, 1);
				}
			}
		}



		$scope.add_unregistered = function () {
			$scope.cdata.person_company_name = '';
			$scope.cdata.person_name = '';
			$scope.cdata.person_title = '';
			$scope.cdata.broker_mail = '';
			$scope.cdata.broker = '';
			$scope.cdata.person_phone = '';
			$scope.cdata.investorEmail = '';
			$('#broke_value').val('');
			$('#broker_name').val('');
			//$('#user').addClass('hidden');
			//$('#showInvestorModal').modal('show');
			$scope.showInvestorModal = true;
		}
		$scope.closeinvestorModel = function () {
			$scope.showInvestorModal = false;
		}

		$scope.newUser = {};
		$scope.add_unregistered_corp = function (corporate, index) {

			$scope.newUser = {};
			$('#popup').modal('show');
			corporate.person_company_names = '';
			corporate.person_names = '';
			corporate.person_titles = '';
			corporate.person_phones = '';
			corporate.corporate_mails = '';
			$scope.newUser = corporate;
			$('#hidden_id').val(index);


		}

		$scope.fieldtrip_popup = function () {



			if (angular.isUndefined($scope.newUser.person_company_names) || $scope.newUser.person_company_names == '' || $scope.newUser.person_company_names == null) {
				$('#person_company_name').focus();
				alertService.add("warning", "Enter Company name!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.newUser.person_names) || $scope.newUser.person_names == '' || $scope.newUser.person_names == null) {
				$('#person_name').focus();
				alertService.add("warning", "Enter Corporate name!", 2000);

				return false;
			}
			if (angular.isUndefined($scope.newUser.person_titles) || $scope.newUser.person_titles == '' || $scope.newUser.person_titles == null) {
				$('#person_title').focus();
				alertService.add("warning", "Enter Corporate title!", 2000);
				return false;
			}

			$scope.usertype = localStorageService.get('usertype');

			if (angular.isUndefined($scope.newUser.corporate_mails) || $scope.newUser.corporate_mails == '' || $scope.newUser.corporate_mails == null) {
				$('#person_email').focus();
				alertService.add("warning", "Enter valid email id!", 2000);
				return false;
			}



			if (angular.isUndefined($scope.newUser.person_phones) || $scope.newUser.person_phones == '' || $scope.newUser.person_phones == null) {
				$('#person_phone').focus();
				alertService.add("warning", "Enter valid corporate phone no!", 2000);
				return false;
			}

			var id = $('#hidden_id').val();

			//$('#corporate'+id).val($scope.newUser.person_company_names);
			$scope.$broadcast('angucomplete-alt:changeInput', 'corporate' + id, $scope.newUser.person_company_names);

			$('#popup').modal('hide');

		}

		$scope.check_investors_popup = function () {


			if (angular.isUndefined($scope.cdata.person_company_name) || $scope.cdata.person_company_name == '' || $scope.cdata.person_company_name == null) {
				$('#person_company_name').focus();
				alertService.add("warning", "Enter Company name!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.cdata.person_name) || $scope.cdata.person_name == '' || $scope.cdata.person_name == null) {
				$('#person_name').focus();
				alertService.add("warning", "Enter Broker name!", 2000);

				return false;
			}
			if (angular.isUndefined($scope.cdata.person_title) || $scope.cdata.person_title == '' || $scope.cdata.person_title == null) {
				$('#person_title').focus();
				alertService.add("warning", "Enter Broker title!", 2000);
				return false;
			}

			$scope.usertype = localStorageService.get('usertype');

			if (angular.isUndefined($scope.cdata.broker_mail) || $scope.cdata.broker_mail == '' || $scope.cdata.broker_mail == null) {
				$('#person_email').focus();

				alertService.add("warning", "Enter valid email id!", 2000);
				return false;
			}



			if (angular.isUndefined($scope.cdata.person_phone) || $scope.cdata.person_phone == '' || $scope.cdata.person_phone == null) {
				$('#person_phone').focus();
				alertService.add("warning", "Enter valid phone no!", 2000);
				return false;
			}
			// return false;

			$scope.cdata.broker_name = $scope.cdata.person_company_name;
			$scope.cdata.corporate_name = $scope.cdata.person_company_name;
			$scope.cdata.corporate_id = '';
			$scope.cdata.broker = '';
			$scope.cdata.broker_phone = '';

			// $('#broke_value').val($scope.cdata.person_company_name);
			// $('#broker_name').val($scope.cdata.person_company_name);


			alertService.add("success", "Added successfully!", 2000);

			$('#showInvestorModal').modal('hide');
			$scope.showInvestorModal = false;
			//alertService.add("warning", "Enter Broker phone!",2000);

		}
		$scope.tickerName = function (data, form, id) {
			var text = 'confdata_' + id + '_value';
			var searchInput = document.getElementById(text);
			if (angular.isUndefined(searchInput) || searchInput.value == '') {
				searchInput.focus();
				//return false;
			}
			if (data) {
				form.$setError('ticker', '');
			} else {
				var msg = "Required Ticker";
				form.$setError('ticker', msg);
				return msg;
			}

		};
		$scope.p_Name = function (data, form, id) {
			var text = 'confdata_' + id + '_value';
			var searchInput = document.getElementById(text);
			if (angular.isUndefined(searchInput) || searchInput.value == '') {
				searchInput.focus();
				//return false;
			}
			if (data) {
				form.$setError('presenter_name', '');
			} else {
				var msg = "Required Presenter Name";
				form.$setError('presenter_name', msg);
				return msg;
			}
		};
		$scope.p_Title = function (data, form, id) {
			var text = 'confdata_' + id + '_value';
			var searchInput = document.getElementById(text);
			if (angular.isUndefined(searchInput) || searchInput.value == '') {
				searchInput.focus();
				//return false;
			}

			if (data) {
				form.$setError('presenter_title', '');
			} else {
				var msg = "Required Presenter Title";
				form.$setError('presenter_title', msg);
				return msg;
			}
		};

		$scope.addndr = function () {
			if (!$scope.cdata.organizer_description && $scope.cdata.event_type == 'ndr') {
				$('#organizer_description').attr('required', true);
				$('#organizer_description').focus();
				alertService.add("warning", "Please enter event description !", 2000);
				return false;
			}
			if (!$scope.cdata.timezone_id) {
				$('#timezone_id').attr('required', true);
				$('#timezone_id').focus();
				alertService.add("warning", "Please select timezone !", 2000);
				return false;
			} else if (!$scope.cdata.organizer_name) {
				$('#organizer_name').attr('required', true);
				$('#organizer_name').focus();
				alertService.add("warning", "Please enter event organizer name !", 2000);
				return false;
			} else if (!$scope.cdata.organizer_email) {
				$('#organizer_email').attr('required', true);
				$('#organizer_email').focus();
				alertService.add("warning", "Please enter valid  event organizer mail id !", 2000);
				return false;
			} else if (!$scope.cdata.organizer_phone) {
				$('#organizer_phone').attr('required', true);
				$('#organizer_phone').focus();
				alertService.add("warning", "Please enter valid phone no !", 2000);
				return false;
			} else if ($scope.cdata.corporatenameslist.length == 0) {
				alertService.add("warning", "Please choose atleast one Corporate Name and title!", 2000);
				return false;
			} else if ($scope.cdata.possibletime.length == '0') {
				alertService.add("warning", "Please choose atleast one Schedule Date and location!", 2000);
				return false;
			} else {
				$scope.spinnerActive = true;
				$scope.cdata.industryTagsAdded = $scope.industryTagsAdded;

				$scope.cdata.presentaion_file = {};
				$scope.cdata.presentaion_file = $scope.presentaion_file;
				var url = 'apiv4/public/event/addevent';
				var params = {
					type: 'put',
					cdata: $scope.cdata
				};
				RequestDetail.getDetail(url, params).then(function (result) {

					if (angular.isDefined($scope.cdata.live_events)) {
						var obj = new Object();
						localStorageService.set('live_events', obj);
					}
					if (result.data == 0) {
						$scope.spinnerActive = false;
						alertService.add("success", "New Event Created successfully!", 2000);
						$location.path('eventslist');
					} else {
						$scope.spinnerActive = false;
						alertService.add("warning", "Something error try agin later!", 2000);
					}
				});
			}
		}


		$scope.addevent = function () {

			if ($scope.cdata.event_type == 'ndr' || $scope.cdata.event_type == 'dealRoadshow') {


				if ($scope.cdata.event_type == 'ndr') {
					/*if ($scope.cdata.broker_name == '' || angular.isUndefined($scope.cdata.broker_name)) {
						$('#broker_name').attr('required', true);
						$('#broker_name').focus();
						alertService.add("warning", "Enter broker name!", 2000);
						return false;
					}*/
					/*else if($scope.cdata.broker == ''){
						$scope.cdata.broker_name = '';
						$('#broker_name').attr('required',true);
						$('#broker_name').focus();
						alertService.add("warning", "Enter broker name!",2000);
						return false;	
					}*/
					/*else if($scope.cdata.broker_name && !$scope.cdata.broker || $scope.cdata.broker_name && $scope.cdata.broker == ''){
						//$scope.cdata.broker_name = '';
						alertService.add("warning", "Please choose sponsoring broker!",2000);
						return false;	
					}
					else if ($scope.cdata.broker && !$scope.cdata.broker_name || $scope.cdata.broker && $scope.cdata.broker_name == '') {
						$scope.cdata.broker_name = '';
						alertService.add("warning", "Please choose sponsoring broker name!", 2000);
						return false;
					}*/
				}
				if ($scope.cdata.event_type == 'dealRoadshow') {
					if ($scope.cdata.corporate_name == '' || angular.isUndefined($scope.cdata.corporate_name)) {
						$('#broke_value').attr('required', true);
						$('#broke_value').focus();
						alertService.add("warning", "Enter corporate name!", 2000);
						return false;
					}
				}

				/*if (!$scope.cdata.broker_mail && $scope.cdata.event_type == 'ndr') {
					$('#broker_name').attr('required', true);
					$('#broker_name').focus();
					alertService.add("warning", "Broker name Not Registered!", 2000);
					return false;
				}*/



				if (!$scope.cdata.organizer_description && $scope.cdata.event_type == 'ndr') {
					$('#organizer_description').attr('required', true);
					$('#organizer_description').focus();
					alertService.add("warning", "Please enter event description !", 2000);
					return false;
				}
				if (!$scope.cdata.timezone_id) {
					$('#timezone_id').attr('required', true);
					$('#timezone_id').focus();
					alertService.add("warning", "Please select timezone !", 2000);
					return false;
				} else if (!$scope.cdata.organizer_name) {
					$('#organizer_name').attr('required', true);
					$('#organizer_name').focus();
					alertService.add("warning", "Please enter event organizer name !", 2000);
					return false;
				} else if (!$scope.cdata.organizer_email) {
					$('#organizer_email').attr('required', true);
					$('#organizer_email').focus();
					alertService.add("warning", "Please enter valid  event organizer mail id !", 2000);
					return false;
				} else if (!$scope.cdata.organizer_phone) {
					$('#organizer_phone').attr('required', true);
					$('#organizer_phone').focus();
					alertService.add("warning", "Please enter valid phone no !", 2000);
					return false;
				} else if ($scope.cdata.corporatenameslist.length == 0) {
					alertService.add("warning", "Please choose atleast one Corporate Name and title!", 2000);
					return false;
				} else if ($scope.cdata.possibletime.length == '0') {
					alertService.add("warning", "Please choose atleast one Schedule Date and location!", 2000);
					return false;
				} else {
					$scope.spinnerActive = true;
					$scope.cdata.industryTagsAdded = $scope.industryTagsAdded;

					$scope.cdata.presentaion_file = {};
					$scope.cdata.presentaion_file = $scope.presentaion_file;
					var url = 'apiv4/public/event/addevent';
					var params = {
						type: 'put',
						cdata: $scope.cdata
					};
					RequestDetail.getDetail(url, params).then(function (result) {

						if (angular.isDefined($scope.cdata.live_events)) {
							var obj = new Object();
							localStorageService.set('live_events', obj);
						}
						if (result.data == 0) {
							$scope.spinnerActive = false;
							alertService.add("success", "New Event Created successfully!", 2000);
							$location.path('eventslist');
						} else {
							$scope.spinnerActive = false;
							alertService.add("warning", "Something error try agin later!", 2000);
						}
					});
				}
			} else if ($scope.cdata.event_type == 'analystDay') {

				if (!$scope.cdata.event_title) {
					$('#event_title').attr('required', true);
					$('#event_title').focus();
					alertService.add("warning", "Please enter event title !", 2000);
					return false;
				} else if (!$scope.cdata.webcast) {
					$('#webcast').attr('required', true);
					$('#webcast').focus();
					alertService.add("warning", "Please enter webcast  !", 2000);
					return false;
				} else if (!$scope.cdata.organizer_name) {
					$('#organizer_name').attr('required', true);
					$('#organizer_name').focus();
					alertService.add("warning", "Please enter event organizer name !", 2000);
					return false;
				} else if (!$scope.cdata.organizer_email) {
					$('#organizer_email').attr('required', true);
					$('#organizer_email').focus();
					alertService.add("warning", "Please enter valid organizer email !", 2000);
					return false;
				} else if (!$scope.cdata.organizer_phone) {
					$('#organizer_phone').attr('required', true);
					$('#organizer_phone').focus();
					alertService.add("warning", "Please enter valid phone no !", 2000);
					return false;
				} else if (!$scope.cdata.organizer_description) {
					$('#organizer_description').attr('required', true);
					$('#organizer_description').focus();
					alertService.add("warning", "Please enter event description !", 2000);
					return false;
				} else if ($scope.cdata.corporatenameslist.length == 0) {
					alertService.add("warning", "Please choose atleast one Corporate Name and title!", 2000);
					return false;
				} else if (!$scope.cdata.city) {
					$('#city').attr('required', true);
					$('#city').focus();
					alertService.add("warning", "Please enter location!", 2000);
					return false;
				}
				if (!$scope.cdata.timezone_id) {
					$('#timezone_id').attr('required', true);
					$('#timezone_id').focus();
					alertService.add("warning", "Please select timezone !", 2000);
					return false;
				} else if (!$scope.cdata.date) {
					$('#date').attr('required', true);
					$('#date').focus();
					alertService.add("warning", "Please choose date!", 2000);
					return false;
				} else if (!$scope.cdata.fromtime) {
					$('#fromtime').attr('required', true);
					$('#fromtime').focus();
					alertService.add("warning", "Please choose from time !", 2000);
					return false;
				} else if (!$scope.cdata.totime) {
					$('#totime').attr('required', true);
					$('#totime').focus();
					alertService.add("warning", "Please choose to time!", 2000);
					return false;
				}
				/*else if ($scope.cdata.broker_name && !$scope.cdata.broker || $scope.cdata.broker_name && $scope.cdata.broker == '') {
					$scope.cdata.broker_name = '';
					alertService.add("warning", "Please choose sponsoring broker!", 2000);
					return false;
				} else if ($scope.cdata.broker && !$scope.cdata.broker_name || $scope.cdata.broker && $scope.cdata.broker_name == '') {
					$scope.cdata.broker_name = '';
					alertService.add("warning", "Please choose sponsoring broker name!", 2000);
					return false;
				} */
				else {
					if ($scope.cdata.fromtime != "any" && $scope.cdata.totime != "any") {

						var jdt1 = Date.parse('20 Aug 2000 ' + $scope.cdata.fromtime);
						var jdt2 = Date.parse('20 Aug 2000 ' + $scope.cdata.totime);
						if (jdt2 <= jdt1) {
							alertService.add("warning", "Please select valid from time and to time!", 2000);
							return false;
						}
					}

					$scope.spinnerActive = true;
					$scope.cdata.industryTagsAdded = $scope.industryTagsAdded;
					var url = 'apiv4/public/event/addeventanalystday';
					$scope.cdata.presentaion_file = {};
					$scope.cdata.presentaion_file = $scope.presentaion_file;
					var params = {
						type: 'put',
						cdata: $scope.cdata
					};
					RequestDetail.getDetail(url, params).then(function (result) {
						if (angular.isDefined($scope.cdata.live_events)) {
							var obj = new Object();
							localStorageService.set('live_events', obj);
						}
						if (result.data == 0) {
							$scope.spinnerActive = false;
							alertService.add("success", "New Event Created successfully!", 2000);
							$location.path('eventslist');
						}
					});
				}
			} else if ($scope.cdata.event_type == 'earningsCallfollowup') {

				if (!$scope.cdata.event_title) {
					$('#event_title').attr('required', true);
					$('#event_title').focus();
					alertService.add("warning", "Please enter event title !", 2000);
					return false;
				} else if (!$scope.cdata.organizer_name) {
					$('#organizer_name').attr('required', true);
					$('#organizer_name').focus();
					alertService.add("warning", "Please enter event organizer name !", 2000);
					return false;
				} else if (!$scope.cdata.organizer_email) {
					$('#organizer_email').attr('required', true);
					$('#organizer_email').focus();
					alertService.add("warning", "Please enter valid organizer email !", 2000);
					return false;
				} else if (!$scope.cdata.organizer_phone) {
					$('#organizer_phone').attr('required', true);
					$('#organizer_phone').focus();
					alertService.add("warning", "Please enter valid phone no !", 2000);
					return false;
				} else if (!$scope.cdata.organizer_description) {
					$('#organizer_description').attr('required', true);
					$('#organizer_description').focus();
					alertService.add("warning", "Please enter event description !", 2000);
					return false;
				}
				if (!$scope.cdata.timezone_id) {
					$('#timezone_id').attr('required', true);
					$('#timezone_id').focus();
					alertService.add("warning", "Please select timezone !", 2000);
					return false;
				} else if (!$scope.cdata.date) {
					$('#date').attr('required', true);
					$('#date').focus();
					alertService.add("warning", "Please choose date!", 2000);
					return false;
				} else if (!$scope.cdata.fromtime) {
					$('#afromtime').attr('required', true);
					$('#afromtime').focus();
					alertService.add("warning", "Please choose start time !", 2000);
					return false;
				} else if (!$scope.cdata.totime) {
					$('#atotime').attr('required', true);
					$('#atotime').focus();
					alertService.add("warning", "Please choose end time!", 2000);
					return false;
				}
				if (angular.isDefined($scope.cdata.fromtime) && $scope.cdata.fromtime != "any" && angular.isDefined($scope.cdata.totime) && $scope.cdata.totime != "any") {

					var jdt1 = Date.parse('20 Aug 2000 ' + $scope.cdata.fromtime);
					var jdt2 = Date.parse('20 Aug 2000 ' + $scope.cdata.totime);
					if (jdt2 <= jdt1) {
						alertService.add("warning", "Please select valid start time and end time!", 2000);
						return false;
					}
				}

				$scope.spinnerActive = true;
				$scope.cdata.industryTagsAdded = $scope.industryTagsAdded;

				$scope.cdata.presentaion_file = {};
				$scope.cdata.presentaion_file = $scope.presentaion_file;
				var url = 'apiv4/public/event/addearningcallevent';
				var params = {
					type: 'put',
					cdata: $scope.cdata
				};
				RequestDetail.getDetail(url, params).then(function (result) {
					if (angular.isDefined($scope.cdata.live_events)) {
						var obj = new Object();
						localStorageService.set('live_events', obj);
					}
					if (result.data == 0) {
						$scope.spinnerActive = false;
						alertService.add("success", "New Event Created successfully!", 2000);
						$location.path('eventslist');
					} else {
						$scope.spinnerActive = false;
						alertService.add("warning", "Something error try agin later!", 2000);
					}
				});
			} else if ($scope.cdata.event_type == 'fieldTrip') // FIELD TRIP 
			{
				if (!$scope.cdata.event_title) {
					$('#event_title').css('border-color', 'red');
					$('#event_title').attr('required', true);
					$('#event_title').focus();
					alertService.add("warning", "Please enter Event title!", 2000);
					return false;
				}
				if (!$scope.cdata.dead_line) {

					$('#dead_line').attr('required', true);
					$('#dead_line').focus();
					alertService.add("warning", "Please select Deadline!", 2000);
					return false;
				}
				if (!$scope.cdata.organizer_name) {
					$('#organizer_name').css('border-color', 'red');
					$('#organizer_name').attr('required', true);
					$('#organizer_name').focus();
					alertService.add("warning", "Please enter Organizer name!", 2000);
					return false;
				}
				if (!$scope.cdata.organizer_email) {
					$('#organizer_email').css('border-color', 'red');
					$('#organizer_email').attr('required', true);
					$('#organizer_email').focus();
					alertService.add("warning", "Please enter organizer email id !", 2000);
					return false;
				}
				if (!$scope.cdata.organizer_phone) {
					$('#organizer_phone').css('border-color', 'red');
					$('#organizer_phone').attr('required', true);
					$('#organizer_phone').focus();
					alertService.add("warning", "Please enter valid phone!", 2000);
					return false;
				}
				if (!$scope.cdata.organizer_description) {
					$('#organizer_description').css('border-color', 'red');
					$('#organizer_description').attr('required', true);
					$('#organizer_description').focus();
					alertService.add("warning", "Please enter event description!", 2000);
					return false;
				}
				if (!$scope.cdata.city_of_point) {
					$('#city_of_point').attr('required', true);
					$('#city_of_point').focus();
					alertService.add("warning", "Please enter city !", 2000);
					return false;
				}
				if (!$scope.cdata.timezone_id) {
					$('#timezone_id').attr('required', true);
					$('#timezone_id').focus();
					alertService.add("warning", "Please select timezone !", 2000);
					return false;
				}
				if (!$scope.cdata.date) {
					$('#date').css('border-color', 'red');
					$('#date').attr('required', true);
					$('#date').focus();
					alertService.add("warning", "Please enter event date!", 2000);
					return false;
				}

				$scope.length = $scope.corporates.length - 1;

				// return false;

				if ($scope.corporates.length == 0) {
					alertService.add("warning", "Please add corporate !", 2000);
					return false;
				}

				// if($scope.corporates[$scope.length].corporate_id == undefined && $scope.corporates[$scope.length].corporate_mail == undefined)
				// {

				// 	alertService.add("warning", "Please enter corporate name!",2000);
				// 	return false;
				// }

				if ($scope.corporates[$scope.length].meeting_time == undefined) {

					alertService.add("warning", "Please select time!", 2000);
					return false;
				} else {
					// alert('works');
					// return false;
					$scope.spinnerActive = true;
					$scope.cdata.industryTagsAdded = $scope.industryTagsAdded;
					var url = 'apiv4/public/event/add_fieldtrip';
					$scope.cdata.presentaion_file = {};
					$scope.cdata.presentaion_file = $scope.presentaion_file;
					var params = {
						cdata: $scope.cdata,
						corporates: $scope.corporates
					};
					RequestDetail.getDetail(url, params).then(function (result) {
						if (angular.isDefined($scope.cdata.live_events)) {
							var obj = new Object();
							localStorageService.set('live_events', obj);
						}
						if (result.data == '1') {
							$scope.spinnerActive = false;
							alertService.add("success", "New Event Created successfully!", 2000);
							$location.path('eventslist');
						}
					});
				}
			} else if ($scope.cdata.event_type == 'conference') {

				if (!$scope.cdata.event_title) {
					$('#event_title').attr('required', true);
					$('#event_title').focus();
					alertService.add("warning", "Please enter event title !", 2000);
					return false;
				} else if (!$scope.cdata.webcast) {
					$('#webcast').attr('required', true);
					$('#webcast').focus();
					alertService.add("warning", "Please enter webcast!", 2000);
					return false;
				} else if (!$scope.cdata.dead_line) {
					$('#deadline_date').attr('required', true);
					$('#deadline_date').focus();
					alertService.add("warning", "Please select deadline date!", 2000);
					return false;
				} else if (!$scope.cdata.organizer_name) {
					$('#organizer_name').attr('required', true);
					$('#organizer_name').focus();
					alertService.add("warning", "Please enter event organizer name!", 2000);
					return false;
				} else if (!$scope.cdata.organizer_email) {
					$('#organizer_email').attr('required', true);
					$('#organizer_email').focus();
					alertService.add("warning", "Please enter valid mail id!", 2000);
					return false;
				} else if (!$scope.cdata.organizer_phone) {
					$('#organizer_phone').attr('required', true);
					$('#organizer_phone').focus();
					alertService.add("warning", "Please enter valid phone no !", 2000);
					return false;
				} else if (!$scope.cdata.organizer_description) {
					$('#organizer_description').attr('required', true);
					$('#organizer_description').focus();
					alertService.add("warning", "Please enter description!", 2000);
					return false;
				}
				if (!$scope.cdata.timezone_id) {
					$('#timezone_id').attr('required', true);
					$('#timezone_id').focus();
					alertService.add("warning", "Please select timezone !", 2000);
					return false;
				} else if (!$scope.cdata.city) {
					$('#city').attr('required', true);
					$('#city').focus();
					alertService.add("warning", "Please enter location!", 2000);
					return false;
				} else if (!$scope.cdata.date) {
					$('#date').attr('required', true);
					$('#date').focus();
					alertService.add("warning", "Please select date!", 2000);
					return false;
				} else if (!$scope.conference_data || $scope.conference_data.length == 0) {
					alertService.add("warning", "Please enter atleast one row!", 2000);
					return false;
				} else {
					var notvalidcorp = 0;
					var notvalidpn = 0;
					var notvalidpt = 0;
					var notvalidvalue = 0;
					var notvalidday = 0;
					var dayadd = 0;
					angular.forEach($scope.conference_data, function (confdata, confindex) {
						// if(notvalidcorp==0 && (!angular.isDefined(confdata.corporate_id) || confdata.corporate_id=='')){
						// notvalidcorp=notvalidcorp+1;
						// }
						if (notvalidpn == 0 && (!angular.isDefined(confdata.presenter_name) || confdata.presenter_name == '')) {
							notvalidpn = notvalidpn + 1;
						}
						if (notvalidpt == 0 && (!angular.isDefined(confdata.presenter_title) || confdata.presenter_title == '')) {
							notvalidpt = notvalidpt + 1;
						}

					});
					if (notvalidcorp == 0 || notvalidpn == 0 || notvalidpt == 0) {
						var inkey = 1;
						angular.forEach($scope.conference_main_header, function (mainhead, mainkey) {
							if (angular.isDefined(mainhead.heading) && mainhead.heading == "DATE (DAY " + inkey + ")") {
								dayadd = dayadd + 1;
								angular.forEach($scope.conference_data, function (condata, conindex) {
									if (condata.hasOwnProperty("day" + inkey)) {
										if (condata["day" + inkey].length == 1) {
											notvalidday = notvalidday + 1;
										}
										angular.forEach(condata["day" + inkey], function (days, dkey) {
											if (dkey > 0 && (!angular.isDefined(days) || days == '')) {
												notvalidvalue = notvalidvalue + 1;
											}
										});
									}
								});
								inkey = inkey + 1;
							}
						});
					}
					if (notvalidcorp > 0) {
						alertService.add("warning", "Please enter values corporate details!", 2000);
						return false;
					}
					if (notvalidpn > 0) { /*, Please enter values Presenter Name*/
						alertService.add("warning", "Did you must select the tick box!", 2000);
						return false;
					}
					if (notvalidpt > 0) {
						alertService.add("warning", "Please enter values Presenter Title!", 2000);
						return false;
					}
					if (dayadd == 0) {
						alertService.add("warning", "Please add atleast one of the room in header!", 2000);
						return false;
					}
					if (notvalidday > 0) {
						alertService.add("warning", "Please enter the time of day's coloumn!", 2000);
						return false;
					}
					if (notvalidvalue > 0) {
						alertService.add("warning", "Please select the values in day coloumn!", 2000);
						return false;
					}



					$scope.spinnerActive = true;
					$scope.cdata.industryTagsAdded = $scope.industryTagsAdded;
					var url = 'apiv4/public/event/add_conference';
					$scope.cdata.presentaion_file = {};
					$scope.cdata.presentaion_file = $scope.presentaion_file;
					var obj = new Object();
					obj.conference_data = angular.copy($scope.cdata);
					obj.conference_details = angular.copy($scope.conference_data);
					obj.conference_headers = angular.copy($scope.conference_sub_header);
					var params = {
						type: 'put',
						cdata: obj
					};

					RequestDetail.getDetail(url, params).then(function (result) {
						if (angular.isDefined($scope.cdata.live_events)) {
							var obj = new Object();
							localStorageService.set('live_events', obj);
						}
						if (result.data == 0) {
							$scope.spinnerActive = false;
							alertService.add("success", "New Event Created successfully!", 2000);
							$location.path('eventslist');

						}
					});
				}
			} else if ($scope.cdata.event_type == 'investorServiceMeeting') {

				if (!$scope.cdata.event_title) {
					$('#event_title').css('border-color', 'red');
					$('#event_title').attr('required', true);
					$('#event_title').focus();
					alertService.add("warning", "Please enter Event title!", 2000);
					return false;
				} else if (!$scope.cdata.event_organizer) {
					$('#event_organizer').css('border-color', 'red');
					$('#event_organizer').attr('required', true);
					$('#event_organizer').focus();
					alertService.add("warning", "Please enter Event Organizer name !", 2000);
					return false;
				} else if (!$scope.cdata.event_mail) {
					$('#event_mail').css('border-color', 'red');
					$('#event_mail').attr('required', true);
					$('#event_mail').focus();
					alertService.add("warning", "Please enter valid Organizer email !", 2000);
					return false;
				} else if (!$scope.cdata.event_phone) {
					$('#event_phone').css('border-color', 'red');
					$('#event_phone').attr('required', true);
					$('#event_phone').focus();
					alertService.add("warning", "Please enter valid phone no !", 2000);
					return false;
				} else if (!$scope.cdata.organizer_description) {
					$('#organizer_description').css('border-color', 'red');
					$('#organizer_description').attr('required', true);
					$('#organizer_description').focus();
					alertService.add("warning", "Please enter Event description!", 2000);
					return false;
				}
				// else if(!$scope.cdata.investor_firm_name)
				// {
				// 	$('#broke').css('border-color','red');
				// 	$('#broke').attr('required',true);
				// 	$('#broke').focus();
				// 	alertService.add("warning", "Please enter Investor firm name!",2000);
				// 	return false;
				// }
				// else if(!$scope.cdata.investor_name)
				// {
				// 	$('#investor_name').css('border-color','red');
				// 	$('#investor_name').attr('required',true);
				// 	$('#investor_name').focus();
				// 	alertService.add("warning", "Please enter Investor contact  name!",2000);
				// 	return false;
				// }	
				// else if(!$scope.cdata.investor_email)
				// {
				// 	$('#investor_email').css('border-color','red');
				// 	$('#investor_email').attr('required',true);
				// 	$('#investor_email').focus();
				// 	alertService.add("warning", "Please enter Investor mail id!",2000);
				// 	return false;
				// }	
				// else if(!$scope.cdata.investor_phone)
				// {
				// 	$('#investor_phone').css('border-color','red');
				// 	$('#investor_phone').attr('required',true);
				// 	$('#investor_phone').focus();
				// 	alertService.add("warning", "Please enter Investor phone!",2000);
				// 	return false;
				// }	
				if (!$scope.cdata.timezone_id) {
					$('#timezone_id').attr('required', true);
					$('#timezone_id').focus();
					alertService.add("warning", "Please select timezone !", 2000);
					return false;
				} else if ($scope.cdata.possibletime.length == '0') {
					// $('#city').css('border-color','red');
					// $('#date').css('border-color','red');
					$('#date').attr('required', true);
					$('#city').focus();
					alertService.add("warning", "Please choose atleast one Schedule Date and location!", 2000);
					return true;
				} else {
					$scope.spinnerActive = true;
					$scope.cdata.industryTagsAdded = $scope.industryTagsAdded;

					$scope.cdata.presentaion_file = {};
					$scope.cdata.presentaion_file = $scope.presentaion_file;
					var url = 'apiv4/public/event/addevent';
					var params = {
						type: 'put',
						cdata: $scope.cdata
					};
					RequestDetail.getDetail(url, params).then(function (result) {
						if (angular.isDefined($scope.cdata.live_events)) {
							var obj = new Object();
							localStorageService.set('live_events', obj);
						}
						if (result.data == 0) {
							$scope.spinnerActive = false;
							alertService.add("success", "New Event Created successfully!", 2000);
							$location.path('dashboard');
						} else {
							$scope.spinnerActive = false;
							alertService.add("warning", "Something error try agin later!", 2000);
						}
					});
				}
			}
		}
		$scope.remove_validation = function (id) {
			$('#' + id).css('border', '1px solid #ccc');
		}
		$scope.addtime = function () {
			if (!$scope.cdata.timezone_id || angular.isUndefined($scope.cdata.timezone_id) || $scope.cdata.timezone_id == '') {
				alertService.add("warning", "Kindly add first timezone field", 2000);
				$scope.cdata.date = '';
				return false;
			}
			if (!$scope.cdata.city) {
				$('#city').attr('required', true);
				$('#city').focus();
				return false;
			} else if (!$scope.cdata.date) {
				$('#date').attr('required', true);
				$('#date').focus();
				return false;
			} else {
				if ($scope.cdata.possibletime.length == 0) {
					$scope.cdata.possibletime = [];
				}
				$scope.content = [];
				$scope.content = [{
						time: '8.00 AM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '09:00 AM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '10:00 AM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '11:00 AM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '12:15 PM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '01:45 PM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '03:00 PM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '04:15 PM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '05:30 PM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					}
				];
				var push = 0;
				var dates = $scope.cdata.date;

				var date = new Date(dates);
				var day = date.getDate();
				var monthIndex = date.getMonth();
				var year = date.getFullYear();
				$scope.cdata.date = day + '-' + monthNames[monthIndex] + '-' + year;
				angular.forEach($scope.cdata.possibletime, function (todo, key) {
					if (todo.date == $scope.cdata.date) {
						push = 1;
					}
					//if (todo.city == $scope.cdata.city) {
					//	push = 2;
					//}
				});

				if (push == 0) {
					$scope.cdata.possibletime.push({
						city: $scope.cdata.city,
						date: $scope.cdata.date,
						content: $scope.content
					});
					$scope.cdata.city = ''
					$scope.cdata.date = ''
				} else if (push == 1) {
					alertService.add("warning", "This Date Already Entered!", 2000);
					$scope.cdata.date = '';
				} else if (push == 2) {
					alertService.add("warning", "This city already entered!", 2000);
					$scope.cdata.city = '';
				}
			}
		}
		$scope.removeTagging = function (index) {
			$scope.industryTagsAdded.splice(index, 1);
		}
		$scope.removepossibletime = function (index) {
			$scope.cdata.possibletime.splice(index, 1);
		}
		$scope.removeCorporate = function (index) {
			$scope.cdata.corporatenameslist.splice(index, 1);
		}
		$scope.removeInvester = function (index) {
			$scope.cdata.addinvesterslist.splice(index, 1);
		}
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
		$scope.addcorporatenames = function () {
			if (!$scope.cdata.corporate_presenter_name) {
				$('#corporate_presenter_name').attr('required', true);
				$('#corporate_presenter_name').focus();
				return false;
			} else if (!$scope.cdata.corporate_presenter_title) {
				$('#corporate_presenter_title').attr('required', true);
				$('#corporate_presenter_title').focus();
				return false;
			} else {
				if ($scope.cdata.corporatenameslist.length == 0) {
					$scope.cdata.corporatenameslist = [];
				}
				$scope.cdata.corporatenameslist.push({
					name: $scope.cdata.corporate_presenter_name,
					title: $scope.cdata.corporate_presenter_title
				});
				$scope.cdata.corporate_presenter_name = '';
				$scope.cdata.corporate_presenter_title = '';
			}
		}




		$scope.select_append_corporate = function (selected) {


			if (selected != undefined) {
				if (selected.originalObject.user_id) {
					$scope.corporates[this.$parent.$index].corporate_id = selected.originalObject.user_id;
					$scope.corporates[this.$parent.$index].corporate_name = selected.originalObject.company_name;
					$scope.corporates[this.$parent.$index].ticker = selected.originalObject.ticker;
				} else {
					$scope.corporates[this.$parent.$index].corporate_id = selected.originalObject;

				}
			}
		}

		// Corporate Autoc complete
		$scope.select_corporate = function (selected) {
			if (selected != undefined) {
				$scope.corporate = {};
				$scope.corporate.corporate_id = selected.originalObject.user_id;
				$scope.cdata.corporate_id = selected.originalObject.user_id;
				$scope.cdata.corporate_name = selected.originalObject.firstname + ' ' + selected.originalObject.lastname;
				$scope.cdata.ticker = selected.originalObject.ticker;

			}
		}

		// Investor  Auto complete
		$scope.select_investor = function (selected) {
			if (selected != undefined) {
				$scope.cdata.investor_id = selected.originalObject.user_id;
				$scope.cdata.investor_name = selected.originalObject.firstname + ' ' + selected.originalObject.lastname;
				$scope.cdata.investor_firm_name = selected.originalObject.company_name;
				$scope.cdata.investor_title = selected.originalObject.title;
				$scope.cdata.investor_email = selected.originalObject.email;
				$scope.cdata.investor_phone = selected.originalObject.contact;
			}
		}


		$scope.selectbroker = function (selected) {

			if (selected != undefined) {

				$scope.cdata.broker = selected.originalObject.user_id;
				$scope.cdata.brokername = selected.originalObject.title;
				$scope.cdata.broker_name = selected.originalObject.company_name;
				$scope.cdata.broker_mail = selected.originalObject.email;
				$scope.cdata.broker_phone = selected.originalObject.contact;
			}
		}
		$scope.selectinvestors = function (selected) {
			if (selected != undefined) {
				$scope.tags.investers = selected.title;
			}
		}
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
		$scope.earningcallfollow = function () {
			$scope.cdata.earningcallfollow.push({
				'time': '12:15 PM',
				'meettype': '1',
				'notes': ''
			})
			$scope.cdata.earningcallfollow.push({
				'time': '1:45 PM',
				'meettype': '1',
				'notes': ''
			})
			$scope.cdata.earningcallfollow.push({
				'time': '5:00 PM',
				'meettype': '1',
				'notes': ''
			})
			$scope.cdata.earningcallfollow.push({
				'time': '5:20 PM',
				'meettype': '1',
				'notes': ''
			})
			$scope.cdata.earningcallfollow.push({
				'time': '5:40 PM',
				'meettype': '1',
				'notes': ''
			})
		}
		$scope.earningcallfollow();
		$scope.addinvesterlist = function () {

			if ($scope.tags.investers != '') {
				if ($scope.cdata.addinvesterslist.indexOf($scope.tags.investers) == -1) {
					$scope.cdata.addinvesterslist.push($scope.tags.investers);
					$scope.tags.investers = '';
					$scope.$broadcast('angucomplete-alt:clearInput', 'tagInvestor');
				} else {
					alertService.add("warning", "Allready entered this item!", 2000);
					$scope.cdata.investersgrp = '';
					$scope.$broadcast('angucomplete-alt:clearInput', 'tagInvestor');
				}
			}
		}

		$scope.addMacroTag = function () {
			if ($scope.tags.valMacroTags != '') {
				if ($scope.industryTagsAdded.indexOf($scope.tags.valMacroTags) == -1) {
					$scope.industryTagsAdded.push($scope.tags.valMacroTags);
					$scope.tags.valMacroTags = '';
					$scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
				} else {
					alertService.add("warning", "Allready entered this item!", 2000);
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
					alertService.add("warning", "Allready entered this item!", 2000);
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
					alertService.add("warning", "Allready entered this item!", 2000);
					$scope.tags.valMicroTags = '';
					$scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
				}
			}
		}

		$scope.removeTag = function (item) {
			var index = $scope.industryTagsAdded.indexOf(item);
			$scope.industryTagsAdded.splice(index, 1);
		}
		$scope.inlineOptions = {
			customClass: getDayClass,
			minDate: new Date(),
			showWeeks: true
		};


		$scope.dateOptions = {
			// dateDisabled: disabled,
			formatYear: 'yy',
			maxDate: new Date(2023, 5, 22),
			minDate: new Date(),
			startingDay: 1
		};
		$scope.deaddateOptions = {
			dateDisabled: disabled,
			formatYear: 'yy',
			maxDate: new Date(2023, 5, 22),
			minDate: new Date(),
			startingDay: 1
		};

		// Disable weekend selection
		function disabled(data) {
			// var date = data.date,
			// mode = data.mode;
			// return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6); /* Disable weak days */
		}

		$scope.toggleMin = function () {
			$scope.inlineOptions.minDate = new Date();
			var myDate = new Date();
			//add a day to the date
			myDate.setDate(myDate.getDate() + 1);
			$scope.dateOptions.minDate = myDate;
		};



		$scope.open1 = function () {
			if ((!$scope.cdata.timezone_id || $scope.cdata.timezone_id == '') && ($scope.cdata.event_type == 'analystDay' || $scope.cdata.event_type == 'earningsCallfollowup' || $scope.cdata.event_type == 'conference' || $scope.cdata.event_type == 'fieldTrip')) {
				alertService.add("warning", "Kindly choose timezone!", 2000);
				return false;
			}
			$scope.minDate = new Date();
			$scope.popup1.opened = true;
		};
		$scope.open3 = function () {
			$scope.minDate = new Date();
			$scope.deadline.opened = true;
		};

		$scope.opendeadline = function () {
			$scope.deadline.opened = true;
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

		$scope.deadline = {
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

		// The New event type templates are defined here
		$scope.template = {};

		if (localStorageService.get('usertype') == 'broker') {
			var rootFolder = 'partials/broker/';
			$scope.template.include = rootFolder + 'dealRoadshow.html';
		} else {
			var rootFolder = 'partials/corporate/';
			$scope.template.include = rootFolder + 'ndr.html';
		}
		$scope.changeTemplate = function () {

			$scope.template.include = rootFolder + $scope.cdata.event_type + '.html';
		}
		if (angular.isDefined(live_eve.event_id) && live_eve.event_id != '' && angular.isDefined(live_eve.event_type) && live_eve.event_type != '') {
			$scope.cdata.event_type = live_eve.event_type;
			$scope.changeTemplate();
			if (angular.isDefined(live_eve.title) && live_eve.title != '') {
				$scope.cdata.event_title = live_eve.title;
			}
			if (angular.isDefined(live_eve.desc) && live_eve.desc != '') {
				$scope.cdata.organizer_description = live_eve.desc;
			}
			if (angular.isDefined(live_eve.ticker) && live_eve.ticker != '') {
				$scope.cdata.ticker = live_eve.ticker;
			}
			if (angular.isDefined(live_eve.event_time) && live_eve.event_time != '') {

				var dat_eve = live_eve.event_time;
				var dates = new Date(dat_eve);

				$scope.cdata.date = dates;

			}
			if (angular.isDefined(live_eve.organizer) && live_eve.organizer != '') {
				$scope.cdata.organizer_name = live_eve.organizer;
			}

			if (angular.isDefined(live_eve.city) && live_eve.city != '') {
				$scope.cdata.city = live_eve.city;
			}
			if (angular.isDefined(live_eve.venue) && live_eve.venue != '') {
				$scope.cdata.address = live_eve.venue;
			}
			$scope.cdata.live_events = live_eve.event_id;
		}
		$scope.toggleMin();
	})


	/*--------------------------------------------------------------*/


	.controller('ownEventCtrl', function ($scope, $http, $location, configdetails) {
		$scope.configdetails = configdetails;
		$scope.pageHeading = 'Events';
		$scope.dasboardActive = 'active';

		$scope.viewResponse = function () {
			$location.path('event/response');
		}

	})
	.controller('editeventctrl', function ($scope, $http, $location, $route, $routeParams, RequestDetail, localStorageService, alertService, $timeout, configdetails) {
		$scope.configdetails = configdetails;

		$scope.showModalpageinfo = false;

		$scope.openmodelpagehelp = function () {
			$scope.showModalpageinfo = !$scope.showModalpageinfo;
		}
		$scope.data = {};
		$scope.pageHeading = 'View Events';
		$scope.dasboardActive = 'active';
		$scope.data.messages = '';
		$scope.textentered = true;
		$scope.eventid = $routeParams.eventId;
		var local = localStorageService.get('userdata');
		$scope.disbledallreqbutton = true;
		$scope.tags = {};
		$scope.editevent_data = {};
		$scope.editevent_data.possibletime = [];
		

		$scope.editevent_data.corporatenameslist = [];
		$scope.presentaion_file = [];
		$scope.tags.investers = '';
		$scope.tags.valMacroTags = '';
		$scope.tags.valMidTags = '';
		$scope.tags.valMicroTags = '';

		$scope.industryTagsAdded = [];
		$scope.editevent_data.addinvesterslist = [];
		var monthNames = [
			"January", "February", "March",
			"April", "May", "June", "July",
			"August", "September", "October",
			"November", "December"
		];
		$scope.meeting_times = [{
				value: '',
				text: 'Select'
			},
			{
				value: '12:00 AM',
				text: '12:00 AM'
			},
			{
				value: '01:00 AM',
				text: '1:00 AM'
			},
			{
				value: '02:00 AM',
				text: '2:00 AM'
			},
			{
				value: '03:00 AM',
				text: '3:00 AM'
			},
			{
				value: '04:00 AM',
				text: '4:00 AM'
			},
			{
				value: '05:00 AM',
				text: '5:00 AM'
			},
			{
				value: '06:00 AM',
				text: '6:00 AM'
			},
			{
				value: '07:00 AM',
				text: '7:00 AM'
			},
			{
				value: '08:00 AM',
				text: '8:00 AM'
			},
			{
				value: '09:00 AM',
				text: '9:00 AM'
			},
			{
				value: '10:00 AM',
				text: '10:00 AM'
			},
			{
				value: '11:00 AM',
				text: '11:00 AM'
			},
			{
				value: '12:00 PM',
				text: '12:00 PM'
			},
			{
				value: '01:00 PM',
				text: '1:00 PM'
			},
			{
				value: '02:00 PM',
				text: '2:00 PM'
			},
			{
				value: '03:00 PM',
				text: '3:00 PM'
			},
			{
				value: '04:00 PM',
				text: '4:00 PM'
			},
			{
				value: '05:00 PM',
				text: '5:00 PM'
			},
			{
				value: '06:00 PM',
				text: '6:00 PM'
			},
			{
				value: '07:00 PM',
				text: '7:00 PM'
			},
			{
				value: '08:00 PM',
				text: '8:00 PM'
			},
			{
				value: '09:00 PM',
				text: '9:00 PM'
			},
			{
				value: '10:00 PM',
				text: '10:00 PM'
			},
			{
				value: '11:00 PM',
				text: '11:00 PM'
			}
		];

		$scope.meeting_times_array = angular.copy($scope.meeting_times);

		var user_data = localStorageService.get('userdata');
		$scope.user_id = user_data.user_id;

		$scope.meeting_times_array = angular.copy($scope.meeting_times);
		$scope.disabled = {};
		$scope.disabled_array = [];

		$scope.dateOptions = {
			// dateDisabled: disabled,
			formatYear: 'yy',
			maxDate: new Date(2023, 5, 22),
			minDate: new Date(),
			startingDay: 1
		};
		$scope.get_loc_details = function (val) {
			var locurl = 'apiv4/public/event/get_location';
			var params = {
				val: val
			};
			$scope.availableLocation = [];
			RequestDetail.getDetail(locurl, params).then(function (result) {
				angular.forEach(result.data, function (val, key) {
					if ($scope.containsstring($scope.availableLocation, val)) {
						$scope.availableLocation.push(val);
					}
				});
			});
		};
		$scope.containsstring = function (a, obj) {
			for (var i = 0; i < a.length; i++) {
				if (a[i] === obj) {
					return false;
				}
			}
			return true;
		}
		$scope.get_matched_tickers = function () {

			var tagUrl = 'apiv4/public/event/get_matched_tickers';
			var params = {
				company_ticker: $('#company_ticker').val()
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {

				if (angular.isDefined(result.data) && result.data != '') {
					if (result.data != 0) {
						$("#company_ticker").autocomplete({
							source: result.data,
							select: function (a, b) {
								$scope.editevent_data.ticker = b.item.value;
							}
						});
					}
				}
			});

		}


		$scope.closeinvestorModel = function () {
			$scope.showInvestorModal = false;
		}




		$scope.get_matched_brokers = function () {


			var tagUrl = 'apiv4/public/event/get_matched_brokers';
			var params = {
				company_name: $('#broker_name').val()
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {

				if (angular.isDefined(result.data) && result.data != '') {
					if (result.data == 0) {
						//$('#user').removeClass('hidden');
					} else {
						$("#broker_name").autocomplete({
							source: result.data,
							select: function (a, b) {
								$scope.editevent_data.broker_name = b.item.value;
								$scope.editevent_data.broker = b.item.user_id;
								$scope.editevent_data.broker_mail = b.item.email;
								$scope.editevent_data.broker_phone = b.item.contact;
							}
						});
						//$('#user').addClass('hidden');
					}
				}
			});

		}

		// Get Broker Details 
		$scope.get_details = function () {

			var tagUrl = 'apiv4/public/event/get_details';
			var params = {
				company_name: $('#broker_name').val()
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {

				if (angular.isDefined(result.data) && result.data != 0) {

					$scope.editevent_data.person_company_name = '';
					$scope.editevent_data.person_name = '';
					$scope.editevent_data.person_title = '';
					$scope.editevent_data.person_phone = '';
				} else if ($scope.editevent_data.person_company_name != $scope.editevent_data.broker_name && $scope.editevent_data.person_name == '') {
					$scope.editevent_data.broker = '';
					$scope.editevent_data.broker_mail = '';
					$scope.editevent_data.broker_phone = '';
				}

			});
		}




		$scope.get_matched = function () {

			var tagUrl = 'apiv4/public/event/get_corporate_names';
			var params = {
				company_name: $('#corporate').val()
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {

				if (angular.isDefined(result.data) && result.data != '') {
					if (result.data == 0) {
						$('#user').removeClass('hidden');
					} else {
						$("#corporate").autocomplete({
							source: result.data,
							select: function (a, b) {
								$scope.editevent_data.corporate_name = b.item.value;
								$scope.editevent_data.corporate_id = b.item.user_id;
								$scope.editevent_data.ticker = b.item.ticker;
							}
						});
						$('#user').addClass('hidden');
					}
				}
			});
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





		$scope.download_invalid_datas = function () {
			window.location.href = "apiv4/public/event/download_invalid_datas";
		}

		$scope.enable_disable = function () {
			var temp = [];
			angular.forEach($scope.corporates, function (corp, index) {
				if (angular.isDefined(corp.meeting_time) && corp.meeting_time != '') {
					temp.push(corp.meeting_time);
				}
			});
			$scope.disabled_array = temp;
		}


		$scope.corporates = [];

		$scope.add_row = function () {

			$scope.time = {};


			var length = $scope.corporates.length - 1;


			if ($scope.corporates.length >= 1) {
				if ($scope.corporates == undefined) {
					alertService.add("warning", "Please enter Corporate name !", 2000);
					return false;
				}

			}
			$scope.inserted = {
				meeting_time: ''
			};
			$scope.corporates.push($scope.inserted);

		}

		$scope.remove_row = function (index) {
			$scope.corporates.splice(index, 1);
			$scope.enable_disable();
		};


		$scope.remove_tbl_row = function (data, tab) {

			var index = $scope.editevent_data.timeslots.indexOf(tab);
			if (index >= 0) {
				var ind = $scope.editevent_data.timeslots[index].contents.indexOf(data);
				if (ind >= 0) {
					$scope.editevent_data.timeslots[index].contents.splice(ind, 1);
				}
				if ($scope.editevent_data.timeslots[index].contents.length == 0) {
					$scope.editevent_data.timeslots.splice(index, 1);
				}
			}
		}
		$scope.cdata = [];

		// Corporate Autoc complete
		$scope.select_corporate = function (selected) {

			if (selected != undefined) {

				$scope.corporate = {};
				$scope.corporate.corporate_id = selected.originalObject.user_id;
				$scope.cdata.corporate_id = selected.originalObject.user_id;
				$scope.cdata.corporate_name = selected.originalObject.company_name;

			}
		}

		$scope.select_append_corporate = function (selected) {


			if (selected != undefined) {
				if (selected.originalObject.user_id) {
					$scope.corporates[this.$parent.$index].corporate_id = selected.originalObject.user_id;
					$scope.corporates[this.$parent.$index].corporate_name = selected.originalObject.company_name;
					$scope.corporates[this.$parent.$index].ticker = selected.originalObject.ticker;
				} else {
					$scope.corporates[this.$parent.$index].corporate_id = selected.originalObject;

				}
			}
		}


		$scope.cdata.researchproviderslists = [];



		$scope.cdata.colloboratedresearchcontacts = [];

		var Url = 'apiv4/public/event/getcolloboratedresearch';
		var params = {
			event_id: $scope.eventid
		};
		RequestDetail.getDetail(Url, params).then(function (result) {
			if(result.data.researchs.length>0) {
				$scope.cdata.colloboratedresearchcontacts = result.data.researchs; 
			}
		});

		$scope.cdata.removedresearchproviderslists = [];
		
		$scope.removeResearchproviders1 = function (index) {
			$scope.cdata.removedresearchproviderslists.push($scope.cdata.colloboratedresearchcontacts[index].collaboratedndr_provider_id);
			$scope.editevent_data.removedresearchproviderslists.push($scope.cdata.colloboratedresearchcontacts[index].collaboratedndr_provider_id);
			$scope.cdata.colloboratedresearchcontacts.splice(index, 1);
		}

		//get broker for ndr
		$scope.get_matched_rps = function () {

			var tagUrl = 'apiv4/public/event/get_matched_rps';
			var params = {
				company_name: $('#rp_name').val()
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {

				if (angular.isDefined(result.data) && result.data != '') {
					if (result.data == 0) {
						//$('#user').removeClass('hidden');
					} else {
						$("#rp_name").autocomplete({
							source: result.data,
							select: function (a, b) {

								$scope.cdata.rp_name = b.item.value;

								$scope.rp_user = {
									company: b.item.company_name,
									user_id: b.item.user_id,
									email: b.item.email,
									firstname: b.item.firstname,
									lastname: b.item.lastname,
								};


							}
						});
						//$('#user').addClass('hidden');
					}
				}
			});
		}

		

		$scope.add_rpuser = function () {
			var email_check = 1;
			
			angular.forEach($scope.cdata.colloboratedresearchcontacts, function (con, ind) {
				if(con.email==$scope.rp_user.email){
					email_check = 0;
				}
			});
			angular.forEach($scope.editevent_data.newcolloboratedresearchcontacts, function (con, ind) {
				if(con.email==$scope.rp_user.email){
					email_check = 0;
				}
			});

			if(email_check){
				$scope.editevent_data.newcolloboratedresearchcontacts.push($scope.rp_user);
			}
			$scope.cdata.rp_name = '';
		}


		$scope.removenewResearchproviders1 = function (index) {
			$scope.editevent_data.newcolloboratedresearchcontacts.splice(index, 1);
		}

		// Corporate list 

		var tagUrl = 'apiv4/public/dashboard/get_corporate_list';
		var params = {
			key: 'tags'
		};
		RequestDetail.getDetail(tagUrl, params).then(function (result) {
			$scope.corporate_list = {};
			$scope.corporate_list = result.data;
		});


		var tagUrl = 'apiv4/public/dashboard/get_investor_list';
		var params = {
			key: 'tags'
		};
		RequestDetail.getDetail(tagUrl, params).then(function (result) {
			$scope.investor_list = {};
			$scope.investor_list = result.data;
		});


		var tagUrl = 'apiv4/public/dashboard/getInvestorsList';
		var params = {
			key: 'tags'
		};
		RequestDetail.getDetail(tagUrl, params).then(function (result) {

			$scope.investerslist = {};
			$scope.investerslist = result.data;
		});
		var tagUrl = 'apiv4/public/meeting/getAllIndustryTags';
		var params = {
			key: 'tags'
		};
		RequestDetail.getDetail(tagUrl, params).then(function (result) {
			$scope.macroTags = result.data.macro;
			$scope.midTags = result.data.mid;
			$scope.microTags = result.data.micro;
		});

		var tagUrl = 'apiv4/public/dashboard/getbrokerlist';
		var params = {
			key: 'tags'
		};
		RequestDetail.getDetail(tagUrl, params).then(function (result) {
			$scope.brokerlist = {};
			$scope.brokerlist = result.data;
		});

		$scope.selectedinveslist = [];

		$scope.isalreadyadded = function(investor) {
			return $scope.selectedinveslist.indexOf(investor);
			
		}

		$scope.init = function () {
			$scope.spinnerActive = true;
			var tagUrl = 'apiv4/public/event/geteventsbyid';
			var params = {
				key: 'tags',
				id: $scope.eventid
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {

				$scope.editevent_data = result.data[0];

				$scope.selectedinveslist = $scope.editevent_data.oldaddinvesterslist;

				$scope.editevent_data.removedresearchproviderslists = [];
				$scope.editevent_data.newcolloboratedresearchcontacts = [];
			
				$scope.editevent_data.videoscreeenshot = [];
				if ($scope.editevent_data.video_image_name) {
					$scope.editevent_data.videoscreeenshot.push({
						file_name: $scope.editevent_data.video_image_name,
						file_location: $scope.editevent_data.video_image
					})
				}

				$scope.earningcallfollowuptimeslot = true;

				if (angular.isDefined($scope.editevent_data.earningcall)) {
					angular.forEach($scope.editevent_data.earningcall, function (todo, key) {
						if (todo.invester_id != null) {
							$scope.earningcallfollowuptimeslot = false;
						}
					})

				}

				$scope.industryTagsAdded = $scope.editevent_data.tagging;
				$scope.presentaion_file = $scope.editevent_data.presentaionnamelist;

				$scope.corporates = [];
				if (angular.isDefined($scope.editevent_data.fieltrip)) {
					angular.forEach($scope.editevent_data.fieltrip, function (todo, key) {
						$scope.corporates.push(todo);
						$timeout(function () {
							if (angular.isDefined(todo)) {
								$scope.$broadcast('angucomplete-alt:changeInput', 'corporate' + key, todo.corporate_name);
							}
						}, 1000);
					})
				}


				//broke
				if ($scope.editevent_data.event_type == 'ndr' || $scope.editevent_data.event_type == 'collaborated_ndr' || $scope.editevent_data.event_type == 'dealRoadshow' || $scope.editevent_data.event_type == 'investorServiceMeeting') {
					$scope.editevent_data.date = '';
				} else {
					// safari browser
					$scope.editevent_data.date = new Date($scope.editevent_data.date.replace(/-/g, "/"))
					if ($scope.editevent_data.dead_line) {
						$scope.editevent_data.dead_line = new Date($scope.editevent_data.dead_line.replace(/-/g, "/"))
					}

				}

				angular.forEach($scope.editevent_data.timeslots, function (val, key) {
					$scope.editevent_data.timeslots[key].bookedentry = true;
					angular.forEach(val.contents, function (valS, keyS) {
						if (valS.invester == local.userId) {
							$scope.editevent_data.timeslots[key].contents[keyS].sendrequest = true;
							$scope.disbledallreqbutton = false;
							$scope.booked = [];
							$scope.booked = valS;
						}
						if (valS.status == 0 || valS.status == 1) {
							$scope.editevent_data.timeslots[key].bookedentry = false
						}
					});
				});
				$scope.spinnerActive = false;
				if ($scope.editevent_data.acceptmsg && $scope.editevent_data.acceptmsg.length > 0) {
					$scope.textentered = false;
				}
				$scope.editevent_data.removedids = [];
			});

		}

		$scope.selectbroker = function (selected) {
			$scope.editevent_data.broker = selected.originalObject.user_id;
			$scope.editevent_data.broker_name = selected.originalObject.company_name;
			$scope.editevent_data.broker_mail = selected.originalObject.email;
			$scope.editevent_data.broker_phone = selected.originalObject.contact;
		}
		$scope.selectinvestors = function (selected) {
			$scope.editevent_data.broker = selected.originalObject.user_id;
			$scope.editevent_data.broker_name = selected.originalObject.company_name;
		}
		$scope.selectcorporates = function (selected) {
			$scope.editevent_data.corporate_id = selected.originalObject.user_id;
			$scope.editevent_data.corporate_name = selected.originalObject.company_name;
		}

		$scope.select_investor_details = function (selected) {


			$scope.editevent_data.investor_id = selected.originalObject.user_id;
			$scope.editevent_data.investor_firm_name = selected.originalObject.company_name;
			$scope.editevent_data.investor_name = selected.originalObject.firstname + ' ' + selected.originalObject.lastname;
			$scope.editevent_data.investor_email = selected.originalObject.email;
			$scope.editevent_data.investor_phone = selected.originalObject.contact;


		}




		$scope.addcorporatenames = function () {
			if (!$scope.cdata.corporate_presenter_name) {
				$('#corporate_presenter_name').attr('required', true);
				$('#corporate_presenter_name').focus();
				return false;
			} else if (!$scope.cdata.corporate_presenter_title) {
				$('#corporate_presenter_title').attr('required', true);
				$('#corporate_presenter_title').focus();
				return false;
			} else {
				if ($scope.cdata.corporatenameslist.length == 0) {
					$scope.cdata.corporatenameslist = [];
				}
				$scope.cdata.corporatenameslist.push({
					name: $scope.cdata.corporate_presenter_name,
					title: $scope.cdata.corporate_presenter_title
				});
				$scope.cdata.corporate_presenter_name = '';
				$scope.cdata.corporate_presenter_title = '';
			}
		}

		// Corporate Autoc complete

		$scope.select_corporate = function (selected) {
			if (selected != undefined) {
				$scope.cdata.corporate_id = selected.originalObject.user_id;
				$scope.cdata.corporate_name = selected.originalObject.firstname + ' ' + selected.originalObject.lastname;
				$scope.cdata.corporate_presenter_name = selected.originalObject.company_name;
				$scope.cdata.corporate_presenter_title = selected.originalObject.title;
				$scope.cdata.corporate_presenter_email = selected.originalObject.email;
				$scope.cdata.corporate_presenter_phone = selected.originalObject.contact;
			}
		}





		$scope.cancelmybooking = function () {
			$scope.cancelreason = !$scope.cancelreason;
		}
		$scope.removeTagging = function (index) {
			$scope.industryTagsAdded.splice(index, 1);
		}
		$scope.removepossibletime = function (index) {
			$scope.editevent_data.timeslots.splice(index, 1);
		}
		$scope.removeCorporate = function (index) {
			$scope.editevent_data.corporatenamelist.splice(index, 1);
		}
		$scope.removeInvester = function (index) {
			$scope.editevent_data.addinvesterslist.splice(index, 1);
		}
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
		$scope.addtime = function () {

			if (!$scope.editevent_data.city) {
				$('#city').attr('required', true);
				$('#city').focus();
				return false;
			} else if (!$scope.editevent_data.date) {
				$('#date').attr('required', true);
				$('#date').focus();
				return false;
			} else {
				if ($scope.editevent_data.timeslots.length == 0) {
					$scope.editevent_data.timeslots = [];
				}
				$scope.content = [];
				$scope.content = [{
						time: '8.00 AM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '09:00 AM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '10:00 AM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '11:00 AM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '12:15 PM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '01:45 PM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '03:00 PM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '04:15 PM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '05:30 PM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					}
				];
				var push = 0;

				var dates = $scope.editevent_data.date;

				var date = new Date(dates);
				var day = date.getDate();
				var monthIndex = date.getMonth();
				var year = date.getFullYear();
				$scope.editevent_data.date = day + '-' + monthNames[monthIndex] + '-' + year;
				$scope.editevent_data.dateymd = year + '-' + parseInt(monthIndex + 1) + '-' + day;
				angular.forEach($scope.editevent_data.timeslots, function (todo, key) {
					if (todo.date == $scope.editevent_data.date || todo.date == $scope.editevent_data.dateymd) {
						push = 1;
					}
					//if (todo.city == $scope.editevent_data.city) {
					//	push = 2;
					//}
				});
				if (push == 0) {
					$scope.editevent_data.timeslots.push({
						city: $scope.editevent_data.city,
						date: $scope.editevent_data.date,
						bookedentry: true,
						contents: $scope.content
					});
					$scope.editevent_data.city = ''
					$scope.editevent_data.date = ''
				} else if (push == 1) {
					alertService.add("warning", "This Date Already Entered!", 2000);
				} else if (push == 2) {
					alertService.add("warning", "This city already entered!", 2000);
				}
			}
		}

		$scope.addcorporatenames = function () {

			if (!$scope.editevent_data.corporate_presenter_name) {
				$('#corporate_presenter_name').attr('required', true);
				$('#corporate_presenter_name').focus();
				return false;
			} else if (!$scope.editevent_data.corporate_presenter_title) {
				$('#corporate_presenter_title').attr('required', true);
				$('#corporate_presenter_title').focus();
				return false;
			} else {
				if ($scope.editevent_data.corporatenamelist.length == 0) {
					$scope.editevent_data.corporatenamelist = [];
				}
				$scope.editevent_data.corporatenamelist.push({
					name: $scope.editevent_data.corporate_presenter_name,
					title: $scope.editevent_data.corporate_presenter_title
				});
				$scope.editevent_data.corporate_presenter_name = '';
				$scope.editevent_data.corporate_presenter_title = '';
			}
		}
		$scope.cancelmessage = function () {
			if (!$scope.data.cancel) {
				$('#cancelmessage').attr('required', true);
				$('#cancelmessage').focus();
				return false;

			} else {
				var tagUrl = 'apiv4/public/event/canceleventreason';
				var params = {
					key: 'tags',
					eid: $scope.eventid,
					msg: $scope.data.cancel
				};
				RequestDetail.getDetail(tagUrl, params).then(function (result) {
					if (result.data == 0) {
						$route.reload();
					}
				});
			}

		}
		$scope.submitmessage = function () {


			var tagUrl = 'apiv4/public/event/requestmessage';
			var params = {
				key: 'tags',
				msg: $scope.data.messages,
				eid: $scope.eventid
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				if (result.data == 0) {
					$scope.textentered = false;
				}
			});
		}
		$scope.init();
		$scope.onbooked = function (id) {
			var tagUrl = 'apiv4/public/event/onbooked';
			var params = {
				key: 'tags',
				id: id
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				if (result.data == 0) {
					$scope.init();
				}
			});
		}
		$scope.selectinvestors = function (selected) {
			if (selected != undefined) {
				$scope.tags.investers = selected.title;
			}
		}
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


		$scope.show_dashboard = function () {

			$location.path('dashboard');
		}


		$scope.spinnerActive = true;
		// Autocomplete Company Name 

		$scope.get_corporate_company_name = function () {
			$scope.spinnerActive = true;
			var tagUrl = 'apiv4/public/dashboard/get_corporate_company_name';
			var params = {
				key: 'tags'
			};

			RequestDetail.getDetail(tagUrl, params).then(function (result) {

				if (angular.isDefined(result.data) && result.data != '') {
					$scope.corporate_company = {};
					$scope.corporate_company = result.data;
					$scope.spinnerActive = false;

				}
				
			});
		}
		$scope.get_corporate_company_name();


		//get datas  On select autocomplete ticker 

		$scope.get_corp_datas = function () {

			var params = $scope.editevent_data.corporate_name;
			var tagUrl = 'apiv4/public/dashboard/get_corp_datas';

			RequestDetail.getDetail(tagUrl, params).then(function (result) {

				if (angular.isDefined(result.data) && result.data != '') {

					angular.forEach(result.data, function (datas) {
						$scope.editevent_data.corporate_id = datas.user_id;
						$scope.editevent_data.ticker = datas.ticker;
					});
				}
			});

		}


		// Autocomplete Company Ticker 
		$scope.spinnerActive = true;
		var tagUrl = 'apiv4/public/dashboard/get_tickers';
		var params = {
			key: 'tags'
		};

		RequestDetail.getDetail(tagUrl, params).then(function (result) {

			if (angular.isDefined(result.data) && result.data != '') {
				$scope.ticker_list = {};
				$scope.ticker_list = result.data;

			}
			$scope.spinnerActive = false;
		});


		$scope.newUser = {};
		$scope.add_unregistered_corp = function (corporate, index) {

			$scope.newUser = {};
			$('#popup').modal('show');
			corporate.person_company_name = '';
			corporate.person_name = '';
			corporate.person_title = '';
			corporate.person_phone = '';
			corporate.c_unregistered_mail_id = '';
			$scope.newUser = corporate;
			$('#hidden_id').val(index);


		}



		$scope.add_unregistered = function () {
			$('#showInvestorModal').modal('show');
			$scope.showInvestorModal = true;
			$scope.editevent_data.person_company_name = '';
			$scope.editevent_data.person_name = '';
			$scope.editevent_data.person_title = '';
			$scope.editevent_data.broker_mail = '';
			$scope.editevent_data.broker = '';
			$scope.editevent_data.person_phone = '';
			$scope.editevent_data.investorEmail = '';
			$('#broke_value').val('');
			$('#corporate').val('');
		}


		$scope.check_investors_popup = function () {


			if (angular.isUndefined($scope.editevent_data.person_company_name) || $scope.editevent_data.person_company_name == '' || $scope.editevent_data.person_company_name == null) {
				$('#person_company_name').focus();
				alertService.add("warning", "Enter Company name!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.editevent_data.person_name) || $scope.editevent_data.person_name == '' || $scope.editevent_data.person_name == null) {
				$('#person_name').focus();
				alertService.add("warning", "Enter Broker name!", 2000);

				return false;
			}
			if (angular.isUndefined($scope.editevent_data.person_title) || $scope.editevent_data.person_title == '' || $scope.editevent_data.person_title == null) {
				$('#person_title').focus();
				alertService.add("warning", "Enter Broker title!", 2000);
				return false;
			}

			$scope.usertype = localStorageService.get('usertype');

			if (angular.isUndefined($scope.editevent_data.broker_mail) || $scope.editevent_data.broker_mail == '' || $scope.editevent_data.broker_mail == null) {
				$('#person_email').focus();

				alertService.add("warning", "Enter valid email id!", 2000);
				return false;
			}



			if (angular.isUndefined($scope.editevent_data.person_phone) || $scope.editevent_data.person_phone == '' || $scope.editevent_data.person_phone == null) {
				$('#person_phone').focus();
				alertService.add("warning", "Enter valid broker phone!", 2000);
				return false;
			}
			// return false;
			$('#broke_value').val($scope.editevent_data.person_company_name);
			$('#broke_name').val($scope.editevent_data.person_company_name);
			$('#corporate').val($scope.editevent_data.person_company_name);
			alertService.add("success", "Added successfully!", 2000);
			$('#showInvestorModal').modal('hide');
			$scope.editevent_data.broker_name = $scope.editevent_data.person_company_name;
			$scope.showInvestorModal = false;
			//$('#user').addClass('hidden');

		}
		
		
		$scope.showcontactsedit = function (editinvester,index) {
			//console.log('dhamu');
            var tagUrl = 'apiv4/public/researchprovider/getinvestorslist';
			var params = { investor: editinvester};

            RequestDetail.getDetail(tagUrl, params).then(function (result) { 
				$scope.investorscontactlists = result.data;
				
                angular.forEach($scope.investorscontactlists, function (data,key) {
					if($scope.editevent_data.removedids.indexOf(data.investor_contacts_id)>=0){
                        $scope.investorscontactlists[key].addedstatus = 0;
                    }else{
                        $scope.investorscontactlists[key].addedstatus = 1;
                    }
                });

                $scope.showModalcontactsedit = true;
            });
		}
		
		$scope.removethisemail = function (id) {
            $scope.editevent_data.removedids.push(id);
            angular.forEach($scope.investorscontactlists, function (data,key) {
                if($scope.editevent_data.removedids.indexOf(data.investor_contacts_id)>=0){
					$scope.investorscontactlists[key].addedstatus = 0;
					
                }
            });
		}
		
		$scope.closepopup = function () {
            $scope.showModalcontactsedit = false;
            $scope.showModalcontacts = false;
        }

        $scope.Addthisemail = function (id) {
            var index =  $scope.editevent_data.removedids.indexOf(id);
            if (index > -1) {
                $scope.editevent_data.removedids.splice(index, 1);
            }
            angular.forEach($scope.investorscontactlists, function (data,key) {
                if($scope.editevent_data.removedids.indexOf(data.investor_contacts_id)){
                    $scope.investorscontactlists[key].addedstatus = 1;
                }
            });
        }



		$scope.editevent_data.videoscreeenshot = [];
		$scope.uploadmodelvideoscreeenshot = function (imgdata) {
			imgdata = JSON.parse(imgdata);
			$scope.editevent_data.videoscreeenshot = [];
			$scope.$apply(function () {
				$scope.editevent_data.videoscreeenshot.push({
					file_name: imgdata.filename,
					file_location: imgdata.location
				})
			});
		}

		$scope.removescreenshotFiles = function () {
			$scope.editevent_data.videoscreeenshot = [];
		}




		$scope.updateevent = function (resend_after_update) {

			if ($scope.editevent_data.event_type == 'ndr' || $scope.editevent_data.event_type == 'collaborated_ndr' || $scope.editevent_data.event_type == 'dealRoadshow') {

				if ($scope.editevent_data.event_type == 'dealRoadshow') {
					if ($scope.editevent_data.corporate_name == '' || $scope.editevent_data.corporate_name == null || angular.isUndefined($scope.editevent_data.corporate_name)) {
						$('#broke_value').attr('required', true);
						$('#broke_value').focus();
						alertService.add("warning", "Enter corporate name!", 2000);
						return false;
					}
				}

				if ($scope.editevent_data.event_type == 'collaborated_ndr') {
					/*if ($scope.editevent_data.broker_name == '' || angular.isUndefined($scope.editevent_data.broker_name)) {
						$('#broker_name').attr('required', true);
						$('#broker_name').focus();
						alertService.add("warning", "Enter broker name!", 2000);
						return false;
					}*/
					if ($scope.editevent_data.newcolloboratedresearchcontacts.length == 0 && $scope.cdata.colloboratedresearchcontacts.length == 0) {
						alertService.add("warning", "Please choose atleast one research provider to colloborate!", 2000);
						return false;
					}
				}

				if (!$scope.editevent_data.description && ($scope.editevent_data.event_type == 'ndr' || $scope.editevent_data.event_type == 'collaborated_ndr')) {
					$('#organizer_description').attr('required', true);
					$('#organizer_description').focus();
					alertService.add("warning", "Please enter event description!", 2000);
					return false;
				} else if (!$scope.editevent_data.timezone_id) {
					$('#timezone_id').attr('required', true);
					$('#timezone_id').focus();
					alertService.add("warning", "Please select timezone!", 2000);
					return false;
				} else if ($scope.editevent_data.timeslots.length == 0) {
					alertService.add("warning", "Please choose atleast one schedule date and location!", 2000);
					return false;
				} else if (!$scope.editevent_data.event_organizer) {
					$('#organizer_name').attr('required', true);
					$('#organizer_name').focus();
					alertService.add("warning", "Please enter event organizer name!", 2000);
					return false;
				} else if (!$scope.editevent_data.event_mail) {
					$('#organizer_email').attr('required', true);
					$('#organizer_email').focus();
					alertService.add("warning", "Please enter valid event organizer email address!", 2000);
					return false;
				} else if (!$scope.editevent_data.event_phone) {
					$('#organizer_phone').attr('required', true);
					$('#organizer_phone').focus();
					alertService.add("warning", "Please enter valid event organizer phone number!", 2000);
					return false;
				} else if ($scope.editevent_data.corporatenamelist.length == 0) {
					alertService.add("warning", "Please choose atleast one corporate name and title!", 2000);
					return false;
				} else {
					$scope.spinnerActive = true;
					$scope.editevent_data.presentaion_file = $scope.presentaion_file;
					$scope.editevent_data.industryTagsAdded = $scope.industryTagsAdded;
					var tagUrl = 'apiv4/public/event/updateevent';
					var params = {
						key: 'tags',
						data: $scope.editevent_data
					};
					RequestDetail.getDetail(tagUrl, params).then(function (result) {

						if (result.data == 0) {
							if (resend_after_update) {
								var ResendUrl = 'apiv4/public/event/resendInvite';
								var params = {
									eventid: $scope.eventid
								};
								RequestDetail.getDetail(ResendUrl, params).then(function (result) {
									$scope.spinnerActive = false;
									alertService.add("success", "Event Updated and Invite Resent successfully.", 2000);
									$location.path('eventslist');
								});
							} else {
								$scope.spinnerActive = false;
								alertService.add("success", "Event Updated successfully!", 2000);
								$location.path('eventslist');
							}
						} else {
							$scope.spinnerActive = false;
							alertService.add("warning", "Something error try agin later!", 2000);
						}
					});

				}
			} else if ($scope.editevent_data.event_type == 'analystDay') {

				if (!$scope.editevent_data.event_title) {
					$('#event_title').attr('required', true);
					$('#event_title').focus();
					alertService.add("warning", "Please enter event title !", 2000);
					return false;
				} else if (!$scope.editevent_data.webcast) {
					$('#webcast').attr('required', true);
					$('#webcast').focus();
					alertService.add("warning", "Please enter webcast  !", 2000);
					return false;
				} else if (!$scope.editevent_data.event_organizer) {
					$('#organizer_name').attr('required', true);
					$('#organizer_name').focus();
					alertService.add("warning", "Please enter event organizer name !", 2000);
					return false;
				} else if (!$scope.editevent_data.event_mail) {
					$('#organizer_email').attr('required', true);
					$('#organizer_email').focus();
					alertService.add("warning", "Please enter valid organizer email !", 2000);
					return false;
				} else if (!$scope.editevent_data.event_phone) {
					$('#organizer_phone').attr('required', true);
					$('#organizer_phone').focus();
					alertService.add("warning", "Please enter valid phone no !", 2000);
					return false;
				} else if (!$scope.editevent_data.description) {
					$('#organizer_description').attr('required', true);
					$('#organizer_description').focus();
					alertService.add("warning", "Please enter event description !", 2000);
					return false;
				} else if ($scope.editevent_data.corporatenamelist.length == 0) {
					alertService.add("warning", "Please choose atleast one Corporate Name and title!", 2000);
					return true;
				} else if (!$scope.editevent_data.timezone_id) {
					$('#timezone_id').attr('required', true);
					$('#timezone_id').focus();
					alertService.add("warning", "Please select timezone !", 2000);
					return false;
				} else if (!$scope.editevent_data.location) {
					$('#city').attr('required', true);
					$('#city').focus();
					alertService.add("warning", "Please enter location!", 2000);
					return false;
				} else if (!$scope.editevent_data.date) {
					$('#date').attr('required', true);
					$('#date').focus();
					alertService.add("warning", "Please choose date!", 2000);
					return false;
				} else if (!$scope.editevent_data.fromtime || $scope.editevent_data.fromtime == '' || $scope.editevent_data.fromtime == null) {
					$('#fromtime').attr('required', true);
					$('#fromtime').focus();
					alertService.add("warning", "Please choose from time !", 2000);
					return false;
				} else if (!$scope.editevent_data.totime || $scope.editevent_data.totime == '' || $scope.editevent_data.totime == null) {
					$('#totime').attr('required', true);
					$('#totime').focus();
					alertService.add("warning", "Please choose to time!", 2000);
					return false;
				} else {
					if ($scope.editevent_data.fromtime != "any" && $scope.editevent_data.totime != "any") {

						var jdt1 = Date.parse('20 Aug 2000 ' + $scope.editevent_data.fromtime);
						var jdt2 = Date.parse('20 Aug 2000 ' + $scope.editevent_data.totime);
						if (jdt2 <= jdt1) {
							alertService.add("warning", "Please select valid from time and to time!", 2000);
							return false;
						}
					}
					$scope.spinnerActive = true;

					$scope.editevent_data.presentaion_file = $scope.presentaion_file;
					$scope.editevent_data.industryTagsAdded = $scope.industryTagsAdded;
					var tagUrl = 'apiv4/public/event/updateevent';
					var params = {
						key: 'tags',
						data: $scope.editevent_data
					};
					RequestDetail.getDetail(tagUrl, params).then(function (result) {

						if (result.data == 0) {
							$scope.spinnerActive = false;
							alertService.add("success", "Event Updated successfully!", 2000);
							$location.path('eventslist');
						} else {
							$scope.spinnerActive = false;
							alertService.add("warning", "Something error try agin later!", 2000);
						}
					});

				}
			} else if ($scope.editevent_data.event_type == 'earningsCallfollowup') {

				if (!$scope.editevent_data.event_title) {
					$('#event_title').attr('required', true);
					$('#event_title').focus();
					alertService.add("warning", "Please enter event title !", 2000);
					return false;
				} else if (!$scope.editevent_data.description) {
					$('#organizer_description').attr('required', true);
					$('#organizer_description').focus();
					alertService.add("warning", "Please enter event description !", 2000);
					return false;
				} else if (!$scope.editevent_data.event_organizer) {
					$('#organizer_name').attr('required', true);
					$('#organizer_name').focus();
					alertService.add("warning", "Please enter event organizer name !", 2000);
					return false;
				} else if (!$scope.editevent_data.event_mail) {
					$('#organizer_email').attr('required', true);
					$('#organizer_email').focus();
					alertService.add("warning", "Please enter valid organizer email !", 2000);
					return false;
				} else if (!$scope.editevent_data.event_phone) {
					$('#organizer_phone').attr('required', true);
					$('#organizer_phone').focus();
					alertService.add("warning", "Please enter valid phone no !", 2000);
					return false;
				}
				// else if($scope.editevent_data.corporatenamelist.length == 0){
				// 	alertService.add("warning", "Please choose atleast one Corporate Name and title!",2000);
				// 	return true;
				// }
				else if (!$scope.editevent_data.timezone_id) {
					$('#timezone_id').attr('required', true);
					$('#timezone_id').focus();
					alertService.add("warning", "Please select timezone !", 2000);
					return false;
				} else if (!$scope.editevent_data.date) {
					$('#date').attr('required', true);
					$('#date').focus();
					alertService.add("warning", "Please choose date!", 2000);
					return false;
				} else if (!$scope.editevent_data.fromtime || $scope.editevent_data.fromtime == '' || $scope.editevent_data.fromtime == null) {
					$('#fromtime').attr('required', true);
					$('#fromtime').focus();
					alertService.add("warning", "Please choose from time !", 2000);
					return false;
				} else if (!$scope.editevent_data.totime || $scope.editevent_data.totime == '' || $scope.editevent_data.totime == null) {
					$('#totime').attr('required', true);
					$('#totime').focus();
					alertService.add("warning", "Please choose to time!", 2000);
					return false;
				} else {
					if (angular.isDefined($scope.editevent_data.fromtime) && $scope.editevent_data.fromtime != "any" && angular.isDefined($scope.editevent_data.totime) && $scope.editevent_data.totime != "any") {

						var jdt1 = Date.parse('20 Aug 2000 ' + $scope.editevent_data.fromtime);
						var jdt2 = Date.parse('20 Aug 2000 ' + $scope.editevent_data.totime);
						if (jdt2 <= jdt1) {
							alertService.add("warning", "Please select valid start time and end time!", 2000);
							return false;
						}
					}

					$scope.spinnerActive = true;

					$scope.editevent_data.presentaion_file = $scope.presentaion_file;
					$scope.editevent_data.industryTagsAdded = $scope.industryTagsAdded;
					var tagUrl = 'apiv4/public/event/updateevent';
					var params = {
						key: 'tags',
						data: $scope.editevent_data
					};
					RequestDetail.getDetail(tagUrl, params).then(function (result) {

						if (result.data == 0) {
							$scope.spinnerActive = false;
							alertService.add("success", "Event Updated successfully!", 2000);
							$location.path('eventslist');
						} else {
							$scope.spinnerActive = false;
							alertService.add("warning", "Something error try agin later!", 2000);
						}
					});
				}
			}
		}

		$scope.addinvesterlist = function () {




			if ($scope.tags.investers != '') {
				if (angular.isUndefined($scope.editevent_data.addinvesterslist)) {
					$scope.editevent_data.addinvesterslist = [];
				}
				if ($scope.editevent_data.addinvesterslist.indexOf($scope.tags.investers) == -1) {
					$scope.editevent_data.addinvesterslist.push($scope.tags.investers);
					$scope.tags.investers = '';
					$scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
				} else {
					alertService.add("warning", "Already entered this item!", 2000);
					$scope.editevent_data.investersgrp = '';
					$scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
				}
			}
		}
		$scope.addMacroTag = function () {
			if ($scope.tags.valMacroTags != '') {

				if ($scope.industryTagsAdded.indexOf($scope.tags.valMacroTags) == -1) {
					$scope.industryTagsAdded.push($scope.tags.valMacroTags);

					$scope.tags.valMacroTags = '';
					$scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
				} else {
					alertService.add("warning", "Allready entered this item!", 2000);
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
					alertService.add("warning", "Allready entered this item!", 2000);
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
					alertService.add("warning", "Allready entered this item!", 2000);
					$scope.tags.valMicroTags = '';
					$scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
				}
			}
		}

		$scope.removeTag = function (item) {
			var index = $scope.industryTagsAdded.indexOf(item);
			$scope.industryTagsAdded.splice(index, 1);
		}
		$scope.editevent = function (id) {
			$location.path('event/response/edit/' + id);
		}


		$scope.open1 = function () {
			if ((!$scope.editevent_data.timezone_id || $scope.editevent_data.timezone_id == '') && ($scope.editevent_data.event_type == 'analystDay' || $scope.editevent_data.event_type == 'earningsCallfollowup' || $scope.editevent_data.event_type == 'conference' || $scope.editevent_data.event_type == 'fieldTrip')) {
				alertService.add("warning", "Kindly choose timezone!", 2000);
				return false;
			}
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





	})
	.controller('brokerediteventctrl', function ($scope, $http, $location, $route, $routeParams, RequestDetail, localStorageService, alertService, $timeout, configdetails) {

		$scope.configdetails = configdetails;

		$scope.showModalpageinfo = false;

		$scope.openmodelpagehelp = function () {
			$scope.showModalpageinfo = !$scope.showModalpageinfo;
		}
		$scope.data = {};
		$scope.pageHeading = 'View Events';
		$scope.dasboardActive = 'active';
		$scope.data.messages = '';
		$scope.textentered = true;
		$scope.eventid = $routeParams.eventId;
		var local = localStorageService.get('userdata');
		$scope.disbledallreqbutton = true;
		$scope.tags = {};
		$scope.editevent_data = {};
		$scope.editevent_data.possibletime = [];

		$scope.editevent_data.corporatenameslist = [];
		$scope.presentaion_file = [];
		$scope.tags.investers = '';
		$scope.tags.valMacroTags = '';
		$scope.tags.valMidTags = '';
		$scope.tags.valMicroTags = '';

		$scope.industryTagsAdded = [];
		$scope.editevent_data.addinvesterslist = [];
		var monthNames = [
			"January", "February", "March",
			"April", "May", "June", "July",
			"August", "September", "October",
			"November", "December"
		];
		$scope.meeting_times = [{
				value: '',
				text: 'Select'
			},
			{
				value: '12:00 AM',
				text: '12:00 AM'
			},
			{
				value: '01:00 AM',
				text: '1:00 AM'
			},
			{
				value: '02:00 AM',
				text: '2:00 AM'
			},
			{
				value: '03:00 AM',
				text: '3:00 AM'
			},
			{
				value: '04:00 AM',
				text: '4:00 AM'
			},
			{
				value: '05:00 AM',
				text: '5:00 AM'
			},
			{
				value: '06:00 AM',
				text: '6:00 AM'
			},
			{
				value: '07:00 AM',
				text: '7:00 AM'
			},
			{
				value: '08:00 AM',
				text: '8:00 AM'
			},
			{
				value: '09:00 AM',
				text: '9:00 AM'
			},
			{
				value: '10:00 AM',
				text: '10:00 AM'
			},
			{
				value: '11:00 AM',
				text: '11:00 AM'
			},
			{
				value: '12:00 PM',
				text: '12:00 PM'
			},
			{
				value: '01:00 PM',
				text: '1:00 PM'
			},
			{
				value: '02:00 PM',
				text: '2:00 PM'
			},
			{
				value: '03:00 PM',
				text: '3:00 PM'
			},
			{
				value: '04:00 PM',
				text: '4:00 PM'
			},
			{
				value: '05:00 PM',
				text: '5:00 PM'
			},
			{
				value: '06:00 PM',
				text: '6:00 PM'
			},
			{
				value: '07:00 PM',
				text: '7:00 PM'
			},
			{
				value: '08:00 PM',
				text: '8:00 PM'
			},
			{
				value: '09:00 PM',
				text: '9:00 PM'
			},
			{
				value: '10:00 PM',
				text: '10:00 PM'
			},
			{
				value: '11:00 PM',
				text: '11:00 PM'
			}
		];

		$scope.meeting_times_array = angular.copy($scope.meeting_times);

		var user_data = localStorageService.get('userdata');
		$scope.user_id = user_data.user_id;

		$scope.meeting_times_array = angular.copy($scope.meeting_times);
		$scope.disabled = {};
		$scope.disabled_array = [];

		$scope.dateOptions = {
			// dateDisabled: disabled,
			formatYear: 'yy',
			maxDate: new Date(2023, 5, 22),
			minDate: new Date(),
			startingDay: 1
		};
		$scope.get_loc_details = function (val) {
			var locurl = 'apiv4/public/event/get_location';
			var params = {
				val: val
			};
			$scope.availableLocation = [];
			RequestDetail.getDetail(locurl, params).then(function (result) {
				angular.forEach(result.data, function (val, key) {
					if ($scope.containsstring($scope.availableLocation, val)) {
						$scope.availableLocation.push(val);
					}
				});
			});
		};
		$scope.containsstring = function (a, obj) {
			for (var i = 0; i < a.length; i++) {
				if (a[i] === obj) {
					return false;
				}
			}
			return true;
		}
		$scope.get_matched_tickers = function () {

			var tagUrl = 'apiv4/public/event/get_matched_tickers';
			var params = {
				company_ticker: $('#company_ticker').val()
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {

				if (angular.isDefined(result.data) && result.data != '') {
					if (result.data != 0) {
						$("#company_ticker").autocomplete({
							source: result.data,
							select: function (a, b) {
								$scope.editevent_data.ticker = b.item.value;
							}
						});
					}
				}
			});

		}


		$scope.get_matched = function () {

			var tagUrl = 'apiv4/public/event/get_corporate_names';
			var params = {
				company_name: $('#corporate').val()
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {

				if (angular.isDefined(result.data) && result.data != '') {
					if (result.data == 0) {
						$('#user').removeClass('hidden');
					} else {
						$("#corporate").autocomplete({
							source: result.data,
							select: function (a, b) {
								$scope.editevent_data.corporate_name = b.item.value;
								$scope.editevent_data.corporate_id = b.item.user_id;
								$scope.editevent_data.ticker = b.item.ticker;
							}
						});
						$('#user').addClass('hidden');
					}
				}
			});
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


		$scope.download_invalid_datas = function () {
			window.location.href = "apiv4/public/event/download_invalid_datas";
		}

		//upload fieldtrip excel 


		$scope.upload_fieldtrip_excel = function (data) {
			$scope.corporates = [];
			var corporates = [];

			if (angular.isDefined(data.valid_datas)) {

				angular.forEach(data.valid_datas, function (details) {
					corporates.push(details);

				});

				$scope.corporates = corporates;
				$scope.$apply();
				$timeout(function () {
					angular.forEach(data.valid_datas, function (dat, key) {
						if (angular.isDefined(dat.corporate_name) && dat.corporate_name != '') {
							$scope.$broadcast('angucomplete-alt:changeInput', 'corporate' + key, dat.corporate_name);
						}
					});
				}, 1000);

			}
			if (angular.isDefined(data.invalid_datas)) {
				$scope.invalid_datas = true;
			} else {
				$scope.invalid_datas = false;
			}
		}



		$scope.enable_disable = function () {
			var temp = [];
			angular.forEach($scope.corporates, function (corp, index) {
				if (angular.isDefined(corp.meeting_time) && corp.meeting_time != '') {
					temp.push(corp.meeting_time);
				}
			});
			$scope.disabled_array = temp;
		}


		$scope.corporates = [];

		$scope.add_row = function () {

			$scope.time = {};
			var length = $scope.corporates.length - 1;

			if ($scope.corporates.length >= 1) {
				if ($scope.corporates == undefined) {
					alertService.add("warning", "Please enter Corporate name !", 2000);
					return false;
				}
			}
			$scope.inserted = {
				meeting_time: ''
			};
			$scope.corporates.push($scope.inserted);

		}

		$scope.remove_row = function (index) {
			$scope.corporates.splice(index, 1);
			$scope.enable_disable();
		};



		$scope.remove_tbl_row = function (data, tab) {

			var index = $scope.editevent_data.timeslots.indexOf(tab);
			if (index >= 0) {
				var ind = $scope.editevent_data.timeslots[index].contents.indexOf(data);
				if (ind >= 0) {
					$scope.editevent_data.timeslots[index].contents.splice(ind, 1);
				}
				if ($scope.editevent_data.timeslots[index].contents.length == 0) {
					$scope.editevent_data.timeslots.splice(index, 1);
				}
			}
		}



		$scope.select_append_corporate = function (selected) {
			if (selected != undefined) {
				if (selected.originalObject.user_id) {
					$scope.corporates[this.$parent.$index].corporate_id = selected.originalObject.user_id;
					$scope.corporates[this.$parent.$index].corporate_name = selected.originalObject.company_name;
					$scope.corporates[this.$parent.$index].ticker = selected.originalObject.ticker;
				} else {
					$scope.corporates[this.$parent.$index].corporate_id = selected.originalObject;

				}
			}
		}


		// Corporate list 

		var tagUrl = 'apiv4/public/dashboard/get_investor_list';
		var params = {
			key: 'tags'
		};
		RequestDetail.getDetail(tagUrl, params).then(function (result) {
			$scope.investor_list = {};
			$scope.investor_list = result.data;
		});

		var tagUrl = 'apiv4/public/dashboard/getInvestorsList';
		var params = {
			key: 'tags'
		};
		RequestDetail.getDetail(tagUrl, params).then(function (result) {

			$scope.investerslist = {};
			$scope.investerslist = result.data;
		});


		var tagUrl = 'apiv4/public/meeting/getAllIndustryTags';
		var params = {
			key: 'tags'
		};
		RequestDetail.getDetail(tagUrl, params).then(function (result) {
			$scope.macroTags = result.data.macro;
			$scope.midTags = result.data.mid;
			$scope.microTags = result.data.micro;
		});


		$scope.init = function () {

			var tagUrl = 'apiv4/public/event/geteventsbyid';
			var params = {
				key: 'tags',
				id: $scope.eventid
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {

				$scope.editevent_data = result.data[0];


				$scope.industryTagsAdded = $scope.editevent_data.tagging;
				$scope.presentaion_file = $scope.editevent_data.presentaionnamelist;

				$scope.corporates = [];
				if (angular.isDefined($scope.editevent_data.fieltrip)) {
					angular.forEach($scope.editevent_data.fieltrip, function (todo, key) {
						$scope.corporates.push(todo);
						$timeout(function () {
							if (angular.isDefined(todo)) {
								$scope.$broadcast('angucomplete-alt:changeInput', 'corporate' + key, todo.corporate_name);
							}
						}, 1000);
					})
				}


				//broke
				if ($scope.editevent_data.event_type == 'ndr' || $scope.editevent_data.event_type == 'collaborated_ndr' || $scope.editevent_data.event_type == 'dealRoadshow' || $scope.editevent_data.event_type == 'investorServiceMeeting') {
					$scope.editevent_data.date = '';
				} else {
					// safari browser
					$scope.editevent_data.date = new Date($scope.editevent_data.date.replace(/-/g, "/"))
					if ($scope.editevent_data.dead_line) {
						$scope.editevent_data.dead_line = new Date($scope.editevent_data.dead_line.replace(/-/g, "/"))
					}

				}

				angular.forEach($scope.editevent_data.timeslots, function (val, key) {
					$scope.editevent_data.timeslots[key].bookedentry = true;
					angular.forEach(val.contents, function (valS, keyS) {
						if (valS.invester == local.userId) {
							$scope.editevent_data.timeslots[key].contents[keyS].sendrequest = true;
							$scope.disbledallreqbutton = false;
							$scope.booked = [];
							$scope.booked = valS;
						}
						if (valS.status == 0 || valS.status == 1) {
							$scope.editevent_data.timeslots[key].bookedentry = false
						}
					});
				})
				if ($scope.editevent_data.acceptmsg && $scope.editevent_data.acceptmsg.length > 0) {
					$scope.textentered = false;
				}
			});

		}


		$scope.selectinvestors = function (selected) {
			$scope.editevent_data.broker = selected.originalObject.user_id;
			$scope.editevent_data.broker_name = selected.originalObject.company_name;
		}


		$scope.select_investor_details = function (selected) {

			$scope.editevent_data.investor_id = selected.originalObject.user_id;
			$scope.editevent_data.investor_firm_name = selected.originalObject.company_name;
			$scope.editevent_data.investor_name = selected.originalObject.firstname + ' ' + selected.originalObject.lastname;
			$scope.editevent_data.investor_email = selected.originalObject.email;
			$scope.editevent_data.investor_phone = selected.originalObject.contact;

		}




		$scope.addcorporatenames = function () {
			if (!$scope.cdata.corporate_presenter_name) {
				$('#corporate_presenter_name').attr('required', true);
				$('#corporate_presenter_name').focus();
				return false;
			} else if (!$scope.cdata.corporate_presenter_title) {
				$('#corporate_presenter_title').attr('required', true);
				$('#corporate_presenter_title').focus();
				return false;
			} else {
				if ($scope.cdata.corporatenameslist.length == 0) {
					$scope.cdata.corporatenameslist = [];
				}
				$scope.cdata.corporatenameslist.push({
					name: $scope.cdata.corporate_presenter_name,
					title: $scope.cdata.corporate_presenter_title
				});
				$scope.cdata.corporate_presenter_name = '';
				$scope.cdata.corporate_presenter_title = '';
			}
		}



		$scope.removeTagging = function (index) {
			$scope.industryTagsAdded.splice(index, 1);
		}
		$scope.removepossibletime = function (index) {
			$scope.editevent_data.timeslots.splice(index, 1);
		}
		$scope.removeCorporate = function (index) {
			$scope.editevent_data.corporatenamelist.splice(index, 1);
		}
		$scope.removeInvester = function (index) {
			$scope.editevent_data.addinvesterslist.splice(index, 1);
		}
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
		$scope.addtime = function () {

			if (!$scope.editevent_data.city) {
				$('#city').attr('required', true);
				$('#city').focus();
				return false;
			} else if (!$scope.editevent_data.date) {
				$('#date').attr('required', true);
				$('#date').focus();
				return false;
			} else {
				if ($scope.editevent_data.timeslots.length == 0) {
					$scope.editevent_data.timeslots = [];
				}
				$scope.content = [];
				$scope.content = [{
						time: '8.00 AM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '09:00 AM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '10:00 AM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '11:00 AM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '12:15 PM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '01:45 PM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '03:00 PM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '04:15 PM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '05:30 PM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					}
				];
				var push = 0;

				var dates = $scope.editevent_data.date;

				var date = new Date(dates);
				var day = date.getDate();
				var monthIndex = date.getMonth();
				var year = date.getFullYear();
				$scope.editevent_data.date = day + '-' + monthNames[monthIndex] + '-' + year;
				$scope.editevent_data.dateymd = year + '-' + parseInt(monthIndex + 1) + '-' + day;
				angular.forEach($scope.editevent_data.timeslots, function (todo, key) {
					if (todo.date == $scope.editevent_data.date || todo.date == $scope.editevent_data.dateymd) {
						push = 1;
					}
					if (todo.city == $scope.editevent_data.city) {
						push = 2;
					}
				});
				if (push == 0) {
					$scope.editevent_data.timeslots.push({
						city: $scope.editevent_data.city,
						date: $scope.editevent_data.date,
						bookedentry: true,
						contents: $scope.content
					});
					$scope.editevent_data.city = ''
					$scope.editevent_data.date = ''
				} else if (push == 1) {
					alertService.add("warning", "This Date Already Entered!", 2000);
				} else if (push == 2) {
					alertService.add("warning", "This city already entered!", 2000);
				}
			}
		}

		$scope.addcorporatenames = function () {

			if (!$scope.editevent_data.corporate_presenter_name) {
				$('#corporate_presenter_name').attr('required', true);
				$('#corporate_presenter_name').focus();
				return false;
			} else if (!$scope.editevent_data.corporate_presenter_title) {
				$('#corporate_presenter_title').attr('required', true);
				$('#corporate_presenter_title').focus();
				return false;
			} else {
				if ($scope.editevent_data.corporatenamelist.length == 0) {
					$scope.editevent_data.corporatenamelist = [];
				}
				$scope.editevent_data.corporatenamelist.push({
					name: $scope.editevent_data.corporate_presenter_name,
					title: $scope.editevent_data.corporate_presenter_title
				});
				$scope.editevent_data.corporate_presenter_name = '';
				$scope.editevent_data.corporate_presenter_title = '';
			}
		}


		$scope.init();

		$scope.selectinvestors = function (selected) {
			if (selected != undefined) {
				$scope.tags.investers = selected.title;
			}
		}
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


		$scope.show_dashboard = function () {
			$location.path('dashboard');
		}


		// Autocomplete Company Name 
		var tagUrl = 'apiv4/public/dashboard/get_corporate_company_name';
		var params = {
			key: 'tags'
		};

		RequestDetail.getDetail(tagUrl, params).then(function (result) {

			if (angular.isDefined(result.data) && result.data != '') {
				$scope.corporate_company = {};
				$scope.corporate_company = result.data;

			}
		});


		//get datas  On select autocomplete ticker 

		$scope.get_corp_datas = function () {

			var params = $scope.editevent_data.corporate_name;
			var tagUrl = 'apiv4/public/dashboard/get_corp_datas';

			RequestDetail.getDetail(tagUrl, params).then(function (result) {

				if (angular.isDefined(result.data) && result.data != '') {

					angular.forEach(result.data, function (datas) {

						$scope.editevent_data.corporate_id = datas.user_id;
						$scope.editevent_data.ticker = datas.ticker;

					});
				}
			});

		}

		$scope.newUser = {};
		$scope.add_unregistered_corp = function (corporate, index) {

			$scope.newUser = {};
			$('#popup').modal('show');
			corporate.person_company_name = '';
			corporate.person_name = '';
			corporate.person_title = '';
			corporate.person_phone = '';
			corporate.c_unregistered_mail_id = '';
			$scope.newUser = corporate;
			$('#hidden_id').val(index);
		}

		$scope.fieldtrip_popup = function () {
			if (angular.isUndefined($scope.newUser.c_person_company_name) || $scope.newUser.c_person_company_name == '' || $scope.newUser.c_person_company_name == null) {
				$('#person_company_name').focus();
				alertService.add("warning", "Enter Company name!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.newUser.c_person_name) || $scope.newUser.c_person_name == '' || $scope.newUser.c_person_name == null) {
				$('#person_name').focus();
				alertService.add("warning", "Enter Corporate name!", 2000);

				return false;
			}
			if (angular.isUndefined($scope.newUser.c_person_title) || $scope.newUser.c_person_title == '' || $scope.newUser.c_person_title == null) {
				$('#person_title').focus();
				alertService.add("warning", "Enter Corporate title!", 2000);
				return false;
			}

			$scope.usertype = localStorageService.get('usertype');

			if (angular.isUndefined($scope.newUser.c_unregistered_mail_id) || $scope.newUser.c_unregistered_mail_id == '' || $scope.newUser.c_unregistered_mail_id == null) {
				$('#person_email').focus();
				alertService.add("warning", "Enter valid email id!", 2000);
				return false;
			}



			if (angular.isUndefined($scope.newUser.c_person_phone) || $scope.newUser.c_person_phone == '' || $scope.newUser.c_person_phone == null) {
				$('#person_phone').focus();
				alertService.add("warning", "Enter valid corporate phone!", 2000);
				return false;
			}

			var id = $('#hidden_id').val();

			$('#corp' + id).val('');
			$('#corpn' + id).val('');
			$('#corporate' + id).val('');
			$scope.corporates[id].corporate_name = '';
			$scope.corporates[id].corporate_id = '';
			$scope.$broadcast('angucomplete-alt:changeInput', 'corporate' + id, $scope.newUser.c_person_company_name);

			$('#popup').modal('hide');

		}

		$scope.add_unregistered = function () {
			$('#showInvestorModal').modal('show');
			$scope.showInvestorModal = true;
			$scope.editevent_data.person_company_name = '';
			$scope.editevent_data.person_name = '';
			$scope.editevent_data.person_title = '';
			$scope.editevent_data.broker_mail = '';
			$scope.editevent_data.broker = '';
			$scope.editevent_data.person_phone = '';
			$scope.editevent_data.investorEmail = '';
			$('#broke_value').val('');
			$('#corporate').val('');
		}


		$scope.check_investors_popup = function () {


			if (angular.isUndefined($scope.editevent_data.person_company_name) || $scope.editevent_data.person_company_name == '' || $scope.editevent_data.person_company_name == null) {
				$('#person_company_name').focus();
				alertService.add("warning", "Enter Company name!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.editevent_data.person_name) || $scope.editevent_data.person_name == '' || $scope.editevent_data.person_name == null) {
				$('#person_name').focus();
				alertService.add("warning", "Enter Broker name!", 2000);

				return false;
			}
			if (angular.isUndefined($scope.editevent_data.person_title) || $scope.editevent_data.person_title == '' || $scope.editevent_data.person_title == null) {
				$('#person_title').focus();
				alertService.add("warning", "Enter Broker title!", 2000);
				return false;
			}

			$scope.usertype = localStorageService.get('usertype');

			if (angular.isUndefined($scope.editevent_data.broker_mail) || $scope.editevent_data.broker_mail == '' || $scope.editevent_data.broker_mail == null) {
				$('#person_email').focus();

				alertService.add("warning", "Enter valid email id!", 2000);
				return false;
			}



			if (angular.isUndefined($scope.editevent_data.person_phone) || $scope.editevent_data.person_phone == '' || $scope.editevent_data.person_phone == null) {
				$('#person_phone').focus();
				alertService.add("warning", "Enter valid broker phone!", 2000);
				return false;
			}
			// return false;
			alertService.add("success", "Added successfully!", 2000);
			$('#broke_value').val($scope.editevent_data.person_company_name);
			$('#corporate').val($scope.editevent_data.person_company_name);
			$('#showInvestorModal').modal('hide');
			$scope.showInvestorModal = false;
			$('#user').addClass('hidden');

		}




		$scope.updateevent = function (resend_after_update) {


			if ($scope.editevent_data.event_type == 'dealRoadshow') {

				if ($scope.editevent_data.corporate_name == '' || $scope.editevent_data.corporate_name == null || angular.isUndefined($scope.editevent_data.corporate_name)) {
					$('#broke_value').attr('required', true);
					$('#broke_value').focus();
					alertService.add("warning", "Enter corporate name!", 2000);
					return false;
				}


				if (!$scope.editevent_data.timezone_id) {
					$('#timezone_id').attr('required', true);
					$('#timezone_id').focus();
					alertService.add("warning", "Please select timezone !", 2000);
					return false;
				} else if (!$scope.editevent_data.event_organizer) {
					$('#organizer_name').attr('required', true);
					$('#organizer_name').focus();
					alertService.add("warning", "Please enter event organizer name !", 2000);
					return false;
				} else if (!$scope.editevent_data.event_mail) {
					$('#organizer_email').attr('required', true);
					$('#organizer_email').focus();
					alertService.add("warning", "Please enter valid  event organizer mail id !", 2000);
					return false;
				} else if (!$scope.editevent_data.event_phone) {
					$('#organizer_phone').attr('required', true);
					$('#organizer_phone').focus();
					alertService.add("warning", "Please enter valid phone no !", 2000);
					return false;
				} else if ($scope.editevent_data.corporatenamelist.length == 0) {
					alertService.add("warning", "Please choose atleast one Corporate Name and title!", 2000);
					return true;
				} else if ($scope.editevent_data.timeslots.length == '0') {
					alertService.add("warning", "Please choose atleast one Schedule Date and location!", 2000);
					return true;
				} else {

					$scope.spinnerActive = true;
					$scope.editevent_data.presentaion_file = $scope.presentaion_file;
					$scope.editevent_data.industryTagsAdded = $scope.industryTagsAdded;
					var tagUrl = 'apiv4/public/event/updateevent';
					var params = {
						key: 'tags',
						data: $scope.editevent_data
					};
					RequestDetail.getDetail(tagUrl, params).then(function (result) {

						if (result.data == 0) {
							if (resend_after_update) {
								var ResendUrl = 'apiv4/public/event/resendInvite';
								var params = {
									eventid: $scope.eventid
								};
								RequestDetail.getDetail(ResendUrl, params).then(function (result) {
									$scope.spinnerActive = false;
									alertService.add("success", "Event Updated and Invite Resent successfully.", 2000);
									$location.path('eventslist');
								});
							} else {
								$scope.spinnerActive = false;
								alertService.add("success", "Event Updated successfully!", 2000);
								$location.path('eventslist');
							}
						} else {
							$scope.spinnerActive = false;
							alertService.add("warning", "Something error try agin later!", 2000);
						}
					});

				}
			} else if ($scope.editevent_data.event_type == 'fieldTrip') {

				// return false;
				if (!$scope.editevent_data.event_title) {
					$('#event_title').attr('required', true);
					$('#event_title').focus();
					alertService.add("warning", "Please enter Event title!", 2000);
					return false;
				}
				if (!$scope.editevent_data.dead_line) {

					$('#dead_line').attr('required', true);
					$('#dead_line').focus();
					alertService.add("warning", "Please select Deadline!", 2000);
					return false;
				}
				if (!$scope.editevent_data.event_organizer) {

					$('#organizer_name').attr('required', true);
					$('#organizer_name').focus();
					alertService.add("warning", "Please enter Organizer name!", 2000);
					return false;
				}
				if (!$scope.editevent_data.event_mail) {

					$('#organizer_email').attr('required', true);
					$('#organizer_email').focus();
					alertService.add("warning", "Please enter organizer email id !", 2000);
					return false;
				}
				if (!$scope.editevent_data.event_phone) {

					$('#organizer_phone').attr('required', true);
					$('#organizer_phone').focus();
					alertService.add("warning", "Please enter valid phone no!", 2000);
					return false;
				}

				if (!$scope.editevent_data.description) {

					$('#organizer_description').attr('required', true);
					$('#organizer_description').focus();
					alertService.add("warning", "Please enter event description!", 2000);
					return false;
				} else if (!$scope.editevent_data.timezone_id) {
					$('#timezone_id').attr('required', true);
					$('#timezone_id').focus();
					alertService.add("warning", "Please select timezone !", 2000);
					return false;
				}
				if (!$scope.editevent_data.date) {

					$('#date').attr('required', true);
					$('#date').focus();
					alertService.add("warning", "Please enter event date!", 2000);
					return false;
				}

				$scope.length = $scope.corporates.length - 1;

				// return false;

				if ($scope.corporates.length == 0) {
					alertService.add("warning", "Please add corporate !", 2000);
					return false;
				}


				if ($scope.corporates[$scope.length].meeting_time == undefined) {

					alertService.add("warning", "Please select time!", 2000);
					return false;
				}



				$scope.editevent_data.presentaion_file = $scope.presentaion_file;
				$scope.editevent_data.industryTagsAdded = $scope.industryTagsAdded;
				var tagUrl = 'apiv4/public/event/update_fieldtrip';
				var params = {
					key: 'tags',
					data: $scope.editevent_data,
					corporates: $scope.corporates
				};

				$scope.spinnerActive = true;
				RequestDetail.getDetail(tagUrl, params).then(function (result) {



					if (result.data == 0) {
						$scope.spinnerActive = false;
						alertService.add("success", "Event Updated successfully!", 2000);
						$location.path('eventslist');
					} else {
						$scope.spinnerActive = false;
						alertService.add("warning", "Something error try agin later!", 2000);
					}
				});
			} else if ($scope.editevent_data.event_type == 'investorServiceMeeting') {


				$scope.editevent_data.possibletime = [];

				if (!$scope.editevent_data.event_title) {

					$('#event_title').attr('required', true);
					$('#event_title').focus();
					alertService.add("warning", "Please enter Event title!", 2000);
					return false;
				} else if (!$scope.editevent_data.event_organizer) {


					$('#event_organizer').attr('required', true);
					$('#event_organizer').focus();
					alertService.add("warning", "Please enter Event Organizer name !", 2000);
					return false;
				} else if (!$scope.editevent_data.event_mail) {

					$('#event_mail').attr('required', true);
					$('#event_mail').focus();
					alertService.add("warning", "Please enter valid Organizer email !", 2000);
					return false;
				} else if (!$scope.editevent_data.event_phone) {

					$('#event_phone').attr('required', true);
					$('#event_phone').focus();
					alertService.add("warning", "Please enter valid phone no !", 2000);
					return false;
				} else if (!$scope.editevent_data.description) {

					$('#organizer_description').attr('required', true);
					$('#organizer_description').focus();
					alertService.add("warning", "Please enter Event description!", 2000);
					return false;
				}


				if (!$scope.editevent_data.timezone_id) {
					$('#timezone_id').attr('required', true);
					$('#timezone_id').focus();
					alertService.add("warning", "Please select timezone !", 2000);
					return false;
				} else if ($scope.editevent_data.timeslots.length == '0') {

					$('#date').attr('required', true);
					$('#city').focus();
					alertService.add("warning", "Please choose atleast one Schedule Date and location!", 2000);
					return true;
				} else {
					$scope.editevent_data.presentaion_file = $scope.presentaion_file;
					$scope.editevent_data.industryTagsAdded = $scope.industryTagsAdded;
					var tagUrl = 'apiv4/public/event/update_investorServiceMeeting';
					var params = {
						key: 'tags',
						data: $scope.editevent_data
					};

					$scope.spinnerActive = true;
					RequestDetail.getDetail(tagUrl, params).then(function (result) {
						if (result.data == 0) {
							$scope.spinnerActive = false;
							alertService.add("success", "Event Updated successfully!", 2000);
							$location.path('eventslist');
						} else {
							$scope.spinnerActive = false;
							alertService.add("warning", "Something error try agin later!", 2000);
						}
					});
				}
			} else if ($scope.editevent_data.event_type == 'conference') {
				if (!$scope.editevent_data.event_title) {
					$('#event_title').attr('required', true);
					$('#event_title').focus();
					alertService.add("warning", "Please enter event title !", 2000);
					return false;
				} else if (!$scope.editevent_data.webcast) {
					$('#webcast').attr('required', true);
					$('#webcast').focus();
					alertService.add("warning", "Please enter webcast !", 2000);
					return false;
				} else if (!$scope.editevent_data.event_organizer) {
					$('#organizer_name').attr('required', true);
					$('#organizer_name').focus();
					alertService.add("warning", "Please enter event organizer name !", 2000);
					return false;
				} else if (!$scope.editevent_data.event_mail) {
					$('#organizer_email').attr('required', true);
					$('#organizer_email').focus();
					alertService.add("warning", "Please enter valid organizer email !", 2000);
					return false;
				} else if (!$scope.editevent_data.event_phone) {
					$('#organizer_phone').attr('required', true);
					$('#organizer_phone').focus();
					alertService.add("warning", "Please enter valid phone no !", 2000);
					return false;
				} else if (!$scope.editevent_data.description) {
					$('#organizer_description').attr('required', true);
					$('#organizer_description').focus();
					alertService.add("warning", "Please enter event description !", 2000);
					return false;
				} else if (!$scope.editevent_data.location) {
					$('#location').attr('required', true);
					$('#location').focus();
					alertService.add("warning", "Please enter location !", 2000);
					return false;
				} else if (!$scope.editevent_data.address_of_point) {
					$('#address_of_point').attr('required', true);
					$('#address_of_point').focus();
					alertService.add("warning", "Please enter address !", 2000);
					return false;
				} else if (!$scope.editevent_data.date) {
					$('#date').attr('required', true);
					$('#date').focus();
					alertService.add("warning", "Please enter address !", 2000);
					return false;
				}

				$scope.editevent_data.presentaion_file = $scope.presentaion_file;
				$scope.editevent_data.industryTagsAdded = $scope.industryTagsAdded;

				var tagUrl = 'apiv4/public/event/update_conference';
				var params = {
					data: $scope.editevent_data
				};

				RequestDetail.getDetail(tagUrl, params).then(function (result) {
					if (result.data == 0) {
						$scope.spinnerActive = false;
						alertService.add("success", "Event Updated successfully!", 2000);
						$location.path('eventslist');
					} else {
						$scope.spinnerActive = false;
						alertService.add("warning", "Something error try agin later!", 2000);
					}
				});
			}
		}

		$scope.addinvesterlist = function () {




			if ($scope.tags.investers != '') {
				if (angular.isUndefined($scope.editevent_data.addinvesterslist)) {
					$scope.editevent_data.addinvesterslist = [];
				}
				if ($scope.editevent_data.addinvesterslist.indexOf($scope.tags.investers) == -1) {
					$scope.editevent_data.addinvesterslist.push($scope.tags.investers);
					$scope.tags.investers = '';
					$scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
				} else {
					alertService.add("warning", "Allready entered this item!", 2000);
					$scope.editevent_data.investersgrp = '';
					$scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
				}
			}
		}
		$scope.addMacroTag = function () {
			if ($scope.tags.valMacroTags != '') {

				if ($scope.industryTagsAdded.indexOf($scope.tags.valMacroTags) == -1) {
					$scope.industryTagsAdded.push($scope.tags.valMacroTags);

					$scope.tags.valMacroTags = '';
					$scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
				} else {
					alertService.add("warning", "Allready entered this item!", 2000);
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
					alertService.add("warning", "Allready entered this item!", 2000);
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
					alertService.add("warning", "Allready entered this item!", 2000);
					$scope.tags.valMicroTags = '';
					$scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
				}
			}
		}

		$scope.removeTag = function (item) {
			var index = $scope.industryTagsAdded.indexOf(item);
			$scope.industryTagsAdded.splice(index, 1);
		}
		$scope.editevent = function (id) {
			$location.path('eventresponse/edit/' + id);
		}


		$scope.open1 = function () {
			if ((!$scope.editevent_data.timezone_id || $scope.editevent_data.timezone_id == '') && ($scope.editevent_data.event_type == 'analystDay' || $scope.editevent_data.event_type == 'earningsCallfollowup' || $scope.editevent_data.event_type == 'conference' || $scope.editevent_data.event_type == 'fieldTrip')) {
				alertService.add("warning", "Kindly choose timezone!", 2000);
				return false;
			}
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
	})

/*
	.controller('editeventctrl_old', function ($scope, $http, $location, $route, $routeParams, RequestDetail, localStorageService, alertService, $timeout, configdetails) {
		$scope.configdetails = configdetails;

		$scope.showModalpageinfo = false;

		$scope.openmodelpagehelp = function () {
			$scope.showModalpageinfo = !$scope.showModalpageinfo;
		}
		$scope.data = {};
		$scope.pageHeading = 'View Events';
		$scope.dasboardActive = 'active';
		$scope.data.messages = '';
		$scope.textentered = true;
		$scope.eventid = $routeParams.eventId;
		var local = localStorageService.get('userdata');
		$scope.disbledallreqbutton = true;
		$scope.tags = {};
		$scope.editevent_data = {};
		$scope.editevent_data.possibletime = [];

		$scope.editevent_data.corporatenameslist = [];
		$scope.presentaion_file = [];
		$scope.tags.investers = '';
		$scope.tags.valMacroTags = '';
		$scope.tags.valMidTags = '';
		$scope.tags.valMicroTags = '';

		$scope.industryTagsAdded = [];
		$scope.editevent_data.addinvesterslist = [];
		var monthNames = [
			"January", "February", "March",
			"April", "May", "June", "July",
			"August", "September", "October",
			"November", "December"
		];
		$scope.meeting_times = [{
				value: '',
				text: 'Select'
			},
			{
				value: '12:00 AM',
				text: '12:00 AM'
			},
			{
				value: '01:00 AM',
				text: '1:00 AM'
			},
			{
				value: '02:00 AM',
				text: '2:00 AM'
			},
			{
				value: '03:00 AM',
				text: '3:00 AM'
			},
			{
				value: '04:00 AM',
				text: '4:00 AM'
			},
			{
				value: '05:00 AM',
				text: '5:00 AM'
			},
			{
				value: '06:00 AM',
				text: '6:00 AM'
			},
			{
				value: '07:00 AM',
				text: '7:00 AM'
			},
			{
				value: '08:00 AM',
				text: '8:00 AM'
			},
			{
				value: '09:00 AM',
				text: '9:00 AM'
			},
			{
				value: '10:00 AM',
				text: '10:00 AM'
			},
			{
				value: '11:00 AM',
				text: '11:00 AM'
			},
			{
				value: '12:00 PM',
				text: '12:00 PM'
			},
			{
				value: '01:00 PM',
				text: '1:00 PM'
			},
			{
				value: '02:00 PM',
				text: '2:00 PM'
			},
			{
				value: '03:00 PM',
				text: '3:00 PM'
			},
			{
				value: '04:00 PM',
				text: '4:00 PM'
			},
			{
				value: '05:00 PM',
				text: '5:00 PM'
			},
			{
				value: '06:00 PM',
				text: '6:00 PM'
			},
			{
				value: '07:00 PM',
				text: '7:00 PM'
			},
			{
				value: '08:00 PM',
				text: '8:00 PM'
			},
			{
				value: '09:00 PM',
				text: '9:00 PM'
			},
			{
				value: '10:00 PM',
				text: '10:00 PM'
			},
			{
				value: '11:00 PM',
				text: '11:00 PM'
			}
		];

		$scope.meeting_times_array = angular.copy($scope.meeting_times);

		var user_data = localStorageService.get('userdata');
		$scope.user_id = user_data.user_id;

		$scope.meeting_times_array = angular.copy($scope.meeting_times);
		$scope.disabled = {};
		$scope.disabled_array = [];

		$scope.dateOptions = {
			// dateDisabled: disabled,
			formatYear: 'yy',
			maxDate: new Date(2020, 5, 22),
			minDate: new Date(),
			startingDay: 1
		};
		$scope.get_loc_details = function (val) {
			var locurl = 'apiv4/public/event/get_location';
			var params = {
				val: val
			};
			$scope.availableLocation = [];
			RequestDetail.getDetail(locurl, params).then(function (result) {
				angular.forEach(result.data, function (val, key) {
					if ($scope.containsstring($scope.availableLocation, val)) {
						$scope.availableLocation.push(val);
					}
				});
			});
		};
		$scope.containsstring = function (a, obj) {
			for (var i = 0; i < a.length; i++) {
				if (a[i] === obj) {
					return false;
				}
			}
			return true;
		}
		$scope.get_matched_tickers = function () {

			var tagUrl = 'apiv4/public/event/get_matched_tickers';
			var params = {
				company_ticker: $('#company_ticker').val()
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {

				if (angular.isDefined(result.data) && result.data != '') {
					if (result.data != 0) {
						$("#company_ticker").autocomplete({
							source: result.data,
							select: function (a, b) {
								$scope.editevent_data.ticker = b.item.value;
							}
						});
					}
				}
			});

		}






		$scope.get_matched_brokers = function () {


			var tagUrl = 'apiv4/public/event/get_matched_brokers';
			var params = {
				company_name: $('#broker_name').val()
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {

				if (angular.isDefined(result.data) && result.data != '') {
					if (result.data == 0) {
						//$('#user').removeClass('hidden');
					} else {
						$("#broker_name").autocomplete({
							source: result.data,
							select: function (a, b) {
								$scope.editevent_data.broker_name = b.item.value;
								$scope.editevent_data.broker = b.item.user_id;
								$scope.editevent_data.broker_mail = b.item.email;
								$scope.editevent_data.broker_phone = b.item.contact;
							}
						});
						//$('#user').addClass('hidden');
					}
				}
			});

		}

		// Get Broker Details 
		$scope.get_details = function () {

			var tagUrl = 'apiv4/public/event/get_details';
			var params = {
				company_name: $('#broker_name').val()
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {

				if (angular.isDefined(result.data) && result.data != 0) {

					$scope.editevent_data.person_company_name = '';
					$scope.editevent_data.person_name = '';
					$scope.editevent_data.person_title = '';
					$scope.editevent_data.person_phone = '';
				} else if ($scope.editevent_data.person_company_name != $scope.editevent_data.broker_name && $scope.editevent_data.person_name == '') {
					$scope.editevent_data.broker = '';
					$scope.editevent_data.broker_mail = '';
					$scope.editevent_data.broker_phone = '';
				}




			});
		}




		// $scope.get_matched=function(){

		// 	$scope.editevent_data.corporate_id ='';
		// 	var tagUrl = 'apiv4/public/event/get_matched'; 
		// 	var params = {company_ticker : $('#corporate').val()};
		// 	RequestDetail.getDetail(tagUrl,params).then(function(result){

		// 		if(angular.isDefined(result.data) && result.data != '')
		// 		{
		// 			if(result.data==0)
		// 			{
		// 				$('#user').removeClass('hidden');
		// 			}
		// 			else
		// 			{
		// 				$('#user').addClass('hidden');
		// 			}
		// 		}
		// 	});

		// }

		$scope.get_matched = function () {

			var tagUrl = 'apiv4/public/event/get_corporate_names';
			var params = {
				company_name: $('#corporate').val()
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {

				if (angular.isDefined(result.data) && result.data != '') {
					if (result.data == 0) {
						$('#user').removeClass('hidden');
					} else {
						$("#corporate").autocomplete({
							source: result.data,
							select: function (a, b) {
								$scope.editevent_data.corporate_name = b.item.value;
								$scope.editevent_data.corporate_id = b.item.user_id;
								$scope.editevent_data.ticker = b.item.ticker;
							}
						});
						$('#user').addClass('hidden');
					}
				}
			});
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





		$scope.download_invalid_datas = function () {
			window.location.href = "apiv4/public/event/download_invalid_datas";
		}

		//upload fieldtrip excel 


		$scope.upload_fieldtrip_excel = function (data) {
			$scope.corporates = [];
			var corporates = [];

			if (angular.isDefined(data.valid_datas)) {

				angular.forEach(data.valid_datas, function (details) {
					corporates.push(details);

				});

				$scope.corporates = corporates;
				$scope.$apply();
				$timeout(function () {
					angular.forEach(data.valid_datas, function (dat, key) {
						if (angular.isDefined(dat.corporate_name) && dat.corporate_name != '') {
							$scope.$broadcast('angucomplete-alt:changeInput', 'corporate' + key, dat.corporate_name);
						}
					});
				}, 1000);

			}
			if (angular.isDefined(data.invalid_datas)) {
				$scope.invalid_datas = true;
			} else {
				$scope.invalid_datas = false;
			}
		}







		$scope.enable_disable = function () {
			var temp = [];
			angular.forEach($scope.corporates, function (corp, index) {
				if (angular.isDefined(corp.meeting_time) && corp.meeting_time != '') {
					temp.push(corp.meeting_time);
				}
			});
			$scope.disabled_array = temp;
		}


		$scope.corporates = [];

		$scope.add_row = function () {



			$scope.time = {};


			var length = $scope.corporates.length - 1;



			if ($scope.corporates.length >= 1) {
				if ($scope.corporates == undefined) {
					alertService.add("warning", "Please enter Corporate name !", 2000);
					return false;
				}

			}
			$scope.inserted = {
				meeting_time: ''
			};
			$scope.corporates.push($scope.inserted);

		}

		$scope.remove_row = function (index) {
			$scope.corporates.splice(index, 1);
			$scope.enable_disable();
		};



		$scope.remove_tbl_row = function (data, tab) {



			var index = $scope.editevent_data.timeslots.indexOf(tab);
			if (index >= 0) {
				var ind = $scope.editevent_data.timeslots[index].contents.indexOf(data);
				if (ind >= 0) {
					$scope.editevent_data.timeslots[index].contents.splice(ind, 1);
				}
				if ($scope.editevent_data.timeslots[index].contents.length == 0) {
					$scope.editevent_data.timeslots.splice(index, 1);
				}
			}
		}


		// Corporate Autoc complete
		$scope.select_corporate = function (selected) {

			if (selected != undefined) {

				$scope.corporate = {};
				$scope.corporate.corporate_id = selected.originalObject.user_id;
				$scope.cdata.corporate_id = selected.originalObject.user_id;
				$scope.cdata.corporate_name = selected.originalObject.company_name;

			}
		}

		$scope.select_append_corporate = function (selected) {


			if (selected != undefined) {
				if (selected.originalObject.user_id) {
					$scope.corporates[this.$parent.$index].corporate_id = selected.originalObject.user_id;
					$scope.corporates[this.$parent.$index].corporate_name = selected.originalObject.company_name;
					$scope.corporates[this.$parent.$index].ticker = selected.originalObject.ticker;
				} else {
					$scope.corporates[this.$parent.$index].corporate_id = selected.originalObject;

				}
			}
		}


		// Corporate list 

		var tagUrl = 'apiv4/public/dashboard/get_corporate_list';
		var params = {
			key: 'tags'
		};
		RequestDetail.getDetail(tagUrl, params).then(function (result) {
			$scope.corporate_list = {};
			$scope.corporate_list = result.data;
		});


		var tagUrl = 'apiv4/public/dashboard/get_investor_list';
		var params = {
			key: 'tags'
		};
		RequestDetail.getDetail(tagUrl, params).then(function (result) {
			$scope.investor_list = {};
			$scope.investor_list = result.data;
		});


		var tagUrl = 'apiv4/public/dashboard/getInvestorsList';
		var params = {
			key: 'tags'
		};
		RequestDetail.getDetail(tagUrl, params).then(function (result) {

			$scope.investerslist = {};
			$scope.investerslist = result.data;
		});
		var tagUrl = 'apiv4/public/meeting/getAllIndustryTags';
		var params = {
			key: 'tags'
		};
		RequestDetail.getDetail(tagUrl, params).then(function (result) {
			$scope.macroTags = result.data.macro;
			$scope.midTags = result.data.mid;
			$scope.microTags = result.data.micro;
		});

		var tagUrl = 'apiv4/public/dashboard/getbrokerlist';
		var params = {
			key: 'tags'
		};
		RequestDetail.getDetail(tagUrl, params).then(function (result) {
			$scope.brokerlist = {};
			$scope.brokerlist = result.data;
		});

		$scope.init = function () {

			var tagUrl = 'apiv4/public/event/geteventsbyid';
			var params = {
				key: 'tags',
				id: $scope.eventid
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {

				$scope.editevent_data = result.data[0];
				$scope.earningcallfollowuptimeslot = true;

				if (angular.isDefined($scope.editevent_data.earningcall)) {
					angular.forEach($scope.editevent_data.earningcall, function (todo, key) {
						if (todo.invester_id != null) {
							$scope.earningcallfollowuptimeslot = false;
						}
					})

				}

				$scope.industryTagsAdded = $scope.editevent_data.tagging;
				$scope.presentaion_file = $scope.editevent_data.presentaionnamelist;

				$scope.corporates = [];
				if (angular.isDefined($scope.editevent_data.fieltrip)) {
					angular.forEach($scope.editevent_data.fieltrip, function (todo, key) {
						$scope.corporates.push(todo);
						$timeout(function () {
							if (angular.isDefined(todo)) {
								$scope.$broadcast('angucomplete-alt:changeInput', 'corporate' + key, todo.corporate_name);
							}
						}, 1000);
					})
				}


				//broke
				if ($scope.editevent_data.event_type == 'ndr' || $scope.editevent_data.event_type == 'collaborated_ndr' || $scope.editevent_data.event_type == 'dealRoadshow' || $scope.editevent_data.event_type == 'investorServiceMeeting') {
					$scope.editevent_data.date = '';
				} else {
					// safari browser
					$scope.editevent_data.date = new Date($scope.editevent_data.date.replace(/-/g, "/"))
					if ($scope.editevent_data.dead_line) {
						$scope.editevent_data.dead_line = new Date($scope.editevent_data.dead_line.replace(/-/g, "/"))
					}

				}

				angular.forEach($scope.editevent_data.timeslots, function (val, key) {
					$scope.editevent_data.timeslots[key].bookedentry = true;
					angular.forEach(val.contents, function (valS, keyS) {
						if (valS.invester == local.userId) {
							$scope.editevent_data.timeslots[key].contents[keyS].sendrequest = true;
							$scope.disbledallreqbutton = false;
							$scope.booked = [];
							$scope.booked = valS;
						}
						if (valS.status == 0 || valS.status == 1) {
							$scope.editevent_data.timeslots[key].bookedentry = false
						}
					});
				})
				if ($scope.editevent_data.acceptmsg && $scope.editevent_data.acceptmsg.length > 0) {
					$scope.textentered = false;
				}
			});

		}

		$scope.selectbroker = function (selected) {
			$scope.editevent_data.broker = selected.originalObject.user_id;
			$scope.editevent_data.broker_name = selected.originalObject.company_name;
			$scope.editevent_data.broker_mail = selected.originalObject.email;
			$scope.editevent_data.broker_phone = selected.originalObject.contact;
		}
		$scope.selectinvestors = function (selected) {
			$scope.editevent_data.broker = selected.originalObject.user_id;
			$scope.editevent_data.broker_name = selected.originalObject.company_name;
		}
		$scope.selectcorporates = function (selected) {
			$scope.editevent_data.corporate_id = selected.originalObject.user_id;
			$scope.editevent_data.corporate_name = selected.originalObject.company_name;
		}

		$scope.select_investor_details = function (selected) {


			$scope.editevent_data.investor_id = selected.originalObject.user_id;
			$scope.editevent_data.investor_firm_name = selected.originalObject.company_name;
			$scope.editevent_data.investor_name = selected.originalObject.firstname + ' ' + selected.originalObject.lastname;
			$scope.editevent_data.investor_email = selected.originalObject.email;
			$scope.editevent_data.investor_phone = selected.originalObject.contact;


		}




		$scope.addcorporatenames = function () {
			if (!$scope.cdata.corporate_presenter_name) {
				$('#corporate_presenter_name').attr('required', true);
				$('#corporate_presenter_name').focus();
				return false;
			} else if (!$scope.cdata.corporate_presenter_title) {
				$('#corporate_presenter_title').attr('required', true);
				$('#corporate_presenter_title').focus();
				return false;
			} else {
				if ($scope.cdata.corporatenameslist.length == 0) {
					$scope.cdata.corporatenameslist = [];
				}
				$scope.cdata.corporatenameslist.push({
					name: $scope.cdata.corporate_presenter_name,
					title: $scope.cdata.corporate_presenter_title
				});
				$scope.cdata.corporate_presenter_name = '';
				$scope.cdata.corporate_presenter_title = '';
			}
		}

		// Corporate Autoc complete

		$scope.select_corporate = function (selected) {
			if (selected != undefined) {
				$scope.cdata.corporate_id = selected.originalObject.user_id;
				$scope.cdata.corporate_name = selected.originalObject.firstname + ' ' + selected.originalObject.lastname;
				$scope.cdata.corporate_presenter_name = selected.originalObject.company_name;
				$scope.cdata.corporate_presenter_title = selected.originalObject.title;
				$scope.cdata.corporate_presenter_email = selected.originalObject.email;
				$scope.cdata.corporate_presenter_phone = selected.originalObject.contact;
			}
		}





		$scope.cancelmybooking = function () {
			$scope.cancelreason = !$scope.cancelreason;
		}
		$scope.removeTagging = function (index) {
			$scope.industryTagsAdded.splice(index, 1);
		}
		$scope.removepossibletime = function (index) {
			$scope.editevent_data.timeslots.splice(index, 1);
		}
		$scope.removeCorporate = function (index) {
			$scope.editevent_data.corporatenamelist.splice(index, 1);
		}
		$scope.removeInvester = function (index) {
			$scope.editevent_data.addinvesterslist.splice(index, 1);
		}
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
		$scope.addtime = function () {

			if (!$scope.editevent_data.city) {
				$('#city').attr('required', true);
				$('#city').focus();
				return false;
			} else if (!$scope.editevent_data.date) {
				$('#date').attr('required', true);
				$('#date').focus();
				return false;
			} else {
				if ($scope.editevent_data.timeslots.length == 0) {
					$scope.editevent_data.timeslots = [];
				}
				$scope.content = [];
				$scope.content = [{
						time: '8.00 AM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '09:00 AM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '10:00 AM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '11:00 AM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '12:15 PM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '01:45 PM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '03:00 PM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '04:15 PM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					},
					{
						time: '05:30 PM',
						location: '1x1 @ your Office',
						description: '',
						meettype: '1'
					}
				];
				var push = 0;

				var dates = $scope.editevent_data.date;

				var date = new Date(dates);
				var day = date.getDate();
				var monthIndex = date.getMonth();
				var year = date.getFullYear();
				$scope.editevent_data.date = day + '-' + monthNames[monthIndex] + '-' + year;
				$scope.editevent_data.dateymd = year + '-' + parseInt(monthIndex + 1) + '-' + day;
				angular.forEach($scope.editevent_data.timeslots, function (todo, key) {
					if (todo.date == $scope.editevent_data.date || todo.date == $scope.editevent_data.dateymd) {
						push = 1;
					}
					if (todo.city == $scope.editevent_data.city) {
						push = 2;
					}
				});
				if (push == 0) {
					$scope.editevent_data.timeslots.push({
						city: $scope.editevent_data.city,
						date: $scope.editevent_data.date,
						bookedentry: true,
						contents: $scope.content
					});
					$scope.editevent_data.city = ''
					$scope.editevent_data.date = ''
				} else if (push == 1) {
					alertService.add("warning", "This Date Already Entered!", 2000);
				} else if (push == 2) {
					alertService.add("warning", "This city already entered!", 2000);
				}
			}
		}

		$scope.addcorporatenames = function () {

			if (!$scope.editevent_data.corporate_presenter_name) {
				$('#corporate_presenter_name').attr('required', true);
				$('#corporate_presenter_name').focus();
				return false;
			} else if (!$scope.editevent_data.corporate_presenter_title) {
				$('#corporate_presenter_title').attr('required', true);
				$('#corporate_presenter_title').focus();
				return false;
			} else {
				if ($scope.editevent_data.corporatenamelist.length == 0) {
					$scope.editevent_data.corporatenamelist = [];
				}
				$scope.editevent_data.corporatenamelist.push({
					name: $scope.editevent_data.corporate_presenter_name,
					title: $scope.editevent_data.corporate_presenter_title
				});
				$scope.editevent_data.corporate_presenter_name = '';
				$scope.editevent_data.corporate_presenter_title = '';
			}
		}
		$scope.cancelmessage = function () {
			if (!$scope.data.cancel) {
				$('#cancelmessage').attr('required', true);
				$('#cancelmessage').focus();
				return false;

			} else {
				var tagUrl = 'apiv4/public/event/canceleventreason';
				var params = {
					key: 'tags',
					eid: $scope.eventid,
					msg: $scope.data.cancel
				};
				RequestDetail.getDetail(tagUrl, params).then(function (result) {
					if (result.data == 0) {
						$route.reload();
					}
				});
			}

		}
		$scope.submitmessage = function () {


			var tagUrl = 'apiv4/public/event/requestmessage';
			var params = {
				key: 'tags',
				msg: $scope.data.messages,
				eid: $scope.eventid
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				if (result.data == 0) {
					$scope.textentered = false;
				}
			});
		}
		$scope.init();
		$scope.onbooked = function (id) {
			var tagUrl = 'apiv4/public/event/onbooked';
			var params = {
				key: 'tags',
				id: id
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				if (result.data == 0) {
					$scope.init();
				}
			});
		}
		$scope.selectinvestors = function (selected) {
			if (selected != undefined) {
				$scope.tags.investers = selected.title;
			}
		}
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


		$scope.show_dashboard = function () {

			$location.path('dashboard');
		}



		// Autocomplete Company Name 

		var tagUrl = 'apiv4/public/dashboard/get_corporate_company_name';
		var params = {
			key: 'tags'
		};

		RequestDetail.getDetail(tagUrl, params).then(function (result) {

			if (angular.isDefined(result.data) && result.data != '') {
				$scope.corporate_company = {};
				$scope.corporate_company = result.data;

			}
		});


		//get datas  On select autocomplete ticker 

		$scope.get_corp_datas = function () {

			var params = $scope.editevent_data.corporate_name;
			var tagUrl = 'apiv4/public/dashboard/get_corp_datas';

			RequestDetail.getDetail(tagUrl, params).then(function (result) {

				if (angular.isDefined(result.data) && result.data != '') {

					angular.forEach(result.data, function (datas) {

						$scope.editevent_data.corporate_id = datas.user_id;
						$scope.editevent_data.ticker = datas.ticker;



					});
				}
			});

		}


		// Autocomplete Company Ticker 

		var tagUrl = 'apiv4/public/dashboard/get_tickers';
		var params = {
			key: 'tags'
		};

		RequestDetail.getDetail(tagUrl, params).then(function (result) {

			if (angular.isDefined(result.data) && result.data != '') {
				$scope.ticker_list = {};
				$scope.ticker_list = result.data;

			}
		});



		//get datas  On select autocomplete ticker 

		$scope.get_ticker_datas = function () {

			// var params = $scope.cdata.ticker;
			// var tagUrl = 'apiv4/public/dashboard/get_ticker_datas';	

			// RequestDetail.getDetail(tagUrl,params).then(function(result){

			// 	if(angular.isDefined(result.data) &&  result.data !='')
			// 	{

			// 		angular.forEach(result.data,function(datas){



			// 		});	
			// 	}
			//});

		}

		$scope.newUser = {};
		$scope.add_unregistered_corp = function (corporate, index) {

			$scope.newUser = {};
			$('#popup').modal('show');
			corporate.person_company_name = '';
			corporate.person_name = '';
			corporate.person_title = '';
			corporate.person_phone = '';
			corporate.c_unregistered_mail_id = '';
			$scope.newUser = corporate;
			$('#hidden_id').val(index);


		}

		$scope.fieldtrip_popup = function () {



			if (angular.isUndefined($scope.newUser.c_person_company_name) || $scope.newUser.c_person_company_name == '' || $scope.newUser.c_person_company_name == null) {
				$('#person_company_name').focus();
				alertService.add("warning", "Enter Company name!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.newUser.c_person_name) || $scope.newUser.c_person_name == '' || $scope.newUser.c_person_name == null) {
				$('#person_name').focus();
				alertService.add("warning", "Enter Corporate name!", 2000);

				return false;
			}
			if (angular.isUndefined($scope.newUser.c_person_title) || $scope.newUser.c_person_title == '' || $scope.newUser.c_person_title == null) {
				$('#person_title').focus();
				alertService.add("warning", "Enter Corporate title!", 2000);
				return false;
			}

			$scope.usertype = localStorageService.get('usertype');

			if (angular.isUndefined($scope.newUser.c_unregistered_mail_id) || $scope.newUser.c_unregistered_mail_id == '' || $scope.newUser.c_unregistered_mail_id == null) {
				$('#person_email').focus();
				alertService.add("warning", "Enter valid email id!", 2000);
				return false;
			}



			if (angular.isUndefined($scope.newUser.c_person_phone) || $scope.newUser.c_person_phone == '' || $scope.newUser.c_person_phone == null) {
				$('#person_phone').focus();
				alertService.add("warning", "Enter valid corporate phone!", 2000);
				return false;
			}

			var id = $('#hidden_id').val();

			$('#corp' + id).val('');
			$('#corpn' + id).val('');
			$('#corporate' + id).val('');
			$scope.corporates[id].corporate_name = '';
			$scope.corporates[id].corporate_id = '';
			$scope.$broadcast('angucomplete-alt:changeInput', 'corporate' + id, $scope.newUser.c_person_company_name);

			$('#popup').modal('hide');

		}

		$scope.add_unregistered = function () {
			$('#showInvestorModal').modal('show');
			$scope.showInvestorModal = true;
			$scope.editevent_data.person_company_name = '';
			$scope.editevent_data.person_name = '';
			$scope.editevent_data.person_title = '';
			$scope.editevent_data.broker_mail = '';
			$scope.editevent_data.broker = '';
			$scope.editevent_data.person_phone = '';
			$scope.editevent_data.investorEmail = '';
			$('#broke_value').val('');
			$('#corporate').val('');
		}


		$scope.check_investors_popup = function () {


			if (angular.isUndefined($scope.editevent_data.person_company_name) || $scope.editevent_data.person_company_name == '' || $scope.editevent_data.person_company_name == null) {
				$('#person_company_name').focus();
				alertService.add("warning", "Enter Company name!", 2000);
				return false;
			}
			if (angular.isUndefined($scope.editevent_data.person_name) || $scope.editevent_data.person_name == '' || $scope.editevent_data.person_name == null) {
				$('#person_name').focus();
				alertService.add("warning", "Enter Broker name!", 2000);

				return false;
			}
			if (angular.isUndefined($scope.editevent_data.person_title) || $scope.editevent_data.person_title == '' || $scope.editevent_data.person_title == null) {
				$('#person_title').focus();
				alertService.add("warning", "Enter Broker title!", 2000);
				return false;
			}

			$scope.usertype = localStorageService.get('usertype');

			if (angular.isUndefined($scope.editevent_data.broker_mail) || $scope.editevent_data.broker_mail == '' || $scope.editevent_data.broker_mail == null) {
				$('#person_email').focus();

				alertService.add("warning", "Enter valid email id!", 2000);
				return false;
			}



			if (angular.isUndefined($scope.editevent_data.person_phone) || $scope.editevent_data.person_phone == '' || $scope.editevent_data.person_phone == null) {
				$('#person_phone').focus();
				alertService.add("warning", "Enter valid broker phone!", 2000);
				return false;
			}
			// return false;
			$('#broke_value').val($scope.editevent_data.person_company_name);
			$('#corporate').val($scope.editevent_data.person_company_name);
			$('#showInvestorModal').modal('hide');
			$scope.showInvestorModal = false;
			$('#user').addClass('hidden');

		}











		$scope.updateevent = function (resend_after_update) {


			if ($scope.editevent_data.event_type == 'ndr' || $scope.editevent_data.event_type == 'collaborated_ndr' || $scope.editevent_data.event_type == 'dealRoadshow') {

				if ($scope.editevent_data.event_type == 'dealRoadshow') {
					if ($scope.editevent_data.corporate_name == '' || $scope.editevent_data.corporate_name == null || angular.isUndefined($scope.editevent_data.corporate_name)) {
						$('#broke_value').attr('required', true);
						$('#broke_value').focus();
						alertService.add("warning", "Enter corporate name!", 2000);
						return false;
					}
				}

				if ($scope.editevent_data.event_type == 'ndr' || $scope.editevent_data.event_type == 'collaborated_ndr') {
					if ($scope.editevent_data.broker_name == '' || angular.isUndefined($scope.editevent_data.broker_name)) {
						$('#broker_name').attr('required', true);
						$('#broker_name').focus();
						alertService.add("warning", "Enter broker name!", 2000);
						return false;
					}
				}

				if (!$scope.editevent_data.description && ($scope.editevent_data.event_type == 'ndr' || $scope.editevent_data.event_type == 'collaborated_ndr')) {

					$('#organizer_description').attr('required', true);
					$('#organizer_description').focus();
					alertService.add("warning", "Please enter event description !", 2000);
					return false;
				} else if (!$scope.editevent_data.timezone_id) {
					$('#timezone_id').attr('required', true);
					$('#timezone_id').focus();
					alertService.add("warning", "Please select timezone !", 2000);
					return false;
				} else if (!$scope.editevent_data.event_organizer) {
					$('#organizer_name').attr('required', true);
					$('#organizer_name').focus();
					alertService.add("warning", "Please enter event organizer name !", 2000);
					return false;
				} else if (!$scope.editevent_data.event_mail) {
					$('#organizer_email').attr('required', true);
					$('#organizer_email').focus();
					alertService.add("warning", "Please enter valid  event organizer mail id !", 2000);
					return false;
				} else if (!$scope.editevent_data.event_phone) {
					$('#organizer_phone').attr('required', true);
					$('#organizer_phone').focus();
					alertService.add("warning", "Please enter valid phone no !", 2000);
					return false;
				} else if ($scope.editevent_data.corporatenamelist.length == 0) {
					alertService.add("warning", "Please choose atleast one Corporate Name and title!", 2000);
					return false;
				} else if ($scope.editevent_data.researchproviderslists.length == '0') {
					alertService.add("warning", "Please choose atleast one Research Provider to Colloborate!", 2000);
					return false;
				}
				// else if($scope.editevent_data.invitationtype == 'private' && $scope.cdata.addinvesterslist.length == 0){
				// 	alertService.add("warning", "Please choose atleast one Invester group!",2000);
				// 	return true;
				// }
				else if ($scope.editevent_data.timeslots.length == '0') {
					alertService.add("warning", "Please choose atleast one Schedule Date and location!", 2000);
					return false;
				} else {
					alert("All Good...");
					return false;
					$scope.spinnerActive = true;
					$scope.editevent_data.presentaion_file = $scope.presentaion_file;
					$scope.editevent_data.industryTagsAdded = $scope.industryTagsAdded;
					var tagUrl = 'apiv4/public/event/updateevent';
					var params = {
						key: 'tags',
						data: $scope.editevent_data
					};
					RequestDetail.getDetail(tagUrl, params).then(function (result) {

						if (result.data == 0) {
							if (resend_after_update) {
								var ResendUrl = 'apiv4/public/event/resendInvite';
								var params = {
									eventid: $scope.eventid
								};
								RequestDetail.getDetail(ResendUrl, params).then(function (result) {
									$scope.spinnerActive = false;
									alertService.add("success", "Event Updated and Invite Resent successfully.", 2000);
									$location.path('eventslist');
								});
							} else {
								$scope.spinnerActive = false;
								alertService.add("success", "Event Updated successfully!", 2000);
								$location.path('eventslist');
							}
						} else {
							$scope.spinnerActive = false;
							alertService.add("warning", "Something error try agin later!", 2000);
						}
					});

				}
			} else if ($scope.editevent_data.event_type == 'analystDay') {

				if (!$scope.editevent_data.event_title) {
					$('#event_title').attr('required', true);
					$('#event_title').focus();
					alertService.add("warning", "Please enter event title !", 2000);
					return false;
				} else if (!$scope.editevent_data.webcast) {
					$('#webcast').attr('required', true);
					$('#webcast').focus();
					alertService.add("warning", "Please enter webcast  !", 2000);
					return false;
				} else if (!$scope.editevent_data.event_organizer) {
					$('#organizer_name').attr('required', true);
					$('#organizer_name').focus();
					alertService.add("warning", "Please enter event organizer name !", 2000);
					return false;
				} else if (!$scope.editevent_data.event_mail) {
					$('#organizer_email').attr('required', true);
					$('#organizer_email').focus();
					alertService.add("warning", "Please enter valid organizer email !", 2000);
					return false;
				} else if (!$scope.editevent_data.event_phone) {
					$('#organizer_phone').attr('required', true);
					$('#organizer_phone').focus();
					alertService.add("warning", "Please enter valid phone no !", 2000);
					return false;
				} else if (!$scope.editevent_data.description) {
					$('#organizer_description').attr('required', true);
					$('#organizer_description').focus();
					alertService.add("warning", "Please enter event description !", 2000);
					return false;
				} else if ($scope.editevent_data.corporatenamelist.length == 0) {
					alertService.add("warning", "Please choose atleast one Corporate Name and title!", 2000);
					return true;
				} else if (!$scope.editevent_data.timezone_id) {
					$('#timezone_id').attr('required', true);
					$('#timezone_id').focus();
					alertService.add("warning", "Please select timezone !", 2000);
					return false;
				} else if (!$scope.editevent_data.location) {
					$('#city').attr('required', true);
					$('#city').focus();
					alertService.add("warning", "Please enter location!", 2000);
					return false;
				} else if (!$scope.editevent_data.date) {
					$('#date').attr('required', true);
					$('#date').focus();
					alertService.add("warning", "Please choose date!", 2000);
					return false;
				} else if (!$scope.editevent_data.fromtime || $scope.editevent_data.fromtime == '' || $scope.editevent_data.fromtime == null) {
					$('#fromtime').attr('required', true);
					$('#fromtime').focus();
					alertService.add("warning", "Please choose from time !", 2000);
					return false;
				} else if (!$scope.editevent_data.totime || $scope.editevent_data.totime == '' || $scope.editevent_data.totime == null) {
					$('#totime').attr('required', true);
					$('#totime').focus();
					alertService.add("warning", "Please choose to time!", 2000);
					return false;
				} else {
					if ($scope.editevent_data.fromtime != "any" && $scope.editevent_data.totime != "any") {

						var jdt1 = Date.parse('20 Aug 2000 ' + $scope.editevent_data.fromtime);
						var jdt2 = Date.parse('20 Aug 2000 ' + $scope.editevent_data.totime);
						if (jdt2 <= jdt1) {
							alertService.add("warning", "Please select valid from time and to time!", 2000);
							return false;
						}
					}
					$scope.spinnerActive = true;

					$scope.editevent_data.presentaion_file = $scope.presentaion_file;
					$scope.editevent_data.industryTagsAdded = $scope.industryTagsAdded;
					var tagUrl = 'apiv4/public/event/updateevent';
					var params = {
						key: 'tags',
						data: $scope.editevent_data
					};
					RequestDetail.getDetail(tagUrl, params).then(function (result) {

						if (result.data == 0) {
							$scope.spinnerActive = false;
							alertService.add("success", "Event Updated successfully!", 2000);
							$location.path('eventslist');
						} else {
							$scope.spinnerActive = false;
							alertService.add("warning", "Something error try agin later!", 2000);
						}
					});

				}
			} else if ($scope.editevent_data.event_type == 'earningsCallfollowup') {

				if (!$scope.editevent_data.event_title) {
					$('#event_title').attr('required', true);
					$('#event_title').focus();
					alertService.add("warning", "Please enter event title !", 2000);
					return false;
				} else if (!$scope.editevent_data.description) {
					$('#organizer_description').attr('required', true);
					$('#organizer_description').focus();
					alertService.add("warning", "Please enter event description !", 2000);
					return false;
				} else if (!$scope.editevent_data.event_organizer) {
					$('#organizer_name').attr('required', true);
					$('#organizer_name').focus();
					alertService.add("warning", "Please enter event organizer name !", 2000);
					return false;
				} else if (!$scope.editevent_data.event_mail) {
					$('#organizer_email').attr('required', true);
					$('#organizer_email').focus();
					alertService.add("warning", "Please enter valid organizer email !", 2000);
					return false;
				} else if (!$scope.editevent_data.event_phone) {
					$('#organizer_phone').attr('required', true);
					$('#organizer_phone').focus();
					alertService.add("warning", "Please enter valid phone no !", 2000);
					return false;
				}
				// else if($scope.editevent_data.corporatenamelist.length == 0){
				// 	alertService.add("warning", "Please choose atleast one Corporate Name and title!",2000);
				// 	return true;
				// }
				else if (!$scope.editevent_data.timezone_id) {
					$('#timezone_id').attr('required', true);
					$('#timezone_id').focus();
					alertService.add("warning", "Please select timezone !", 2000);
					return false;
				} else if (!$scope.editevent_data.date) {
					$('#date').attr('required', true);
					$('#date').focus();
					alertService.add("warning", "Please choose date!", 2000);
					return false;
				} else if (!$scope.editevent_data.fromtime || $scope.editevent_data.fromtime == '' || $scope.editevent_data.fromtime == null) {
					$('#fromtime').attr('required', true);
					$('#fromtime').focus();
					alertService.add("warning", "Please choose from time !", 2000);
					return false;
				} else if (!$scope.editevent_data.totime || $scope.editevent_data.totime == '' || $scope.editevent_data.totime == null) {
					$('#totime').attr('required', true);
					$('#totime').focus();
					alertService.add("warning", "Please choose to time!", 2000);
					return false;
				} else {
					if (angular.isDefined($scope.editevent_data.fromtime) && $scope.editevent_data.fromtime != "any" && angular.isDefined($scope.editevent_data.totime) && $scope.editevent_data.totime != "any") {

						var jdt1 = Date.parse('20 Aug 2000 ' + $scope.editevent_data.fromtime);
						var jdt2 = Date.parse('20 Aug 2000 ' + $scope.editevent_data.totime);
						if (jdt2 <= jdt1) {
							alertService.add("warning", "Please select valid start time and end time!", 2000);
							return false;
						}
					}

					$scope.spinnerActive = true;

					$scope.editevent_data.presentaion_file = $scope.presentaion_file;
					$scope.editevent_data.industryTagsAdded = $scope.industryTagsAdded;
					var tagUrl = 'apiv4/public/event/updateevent';
					var params = {
						key: 'tags',
						data: $scope.editevent_data
					};
					RequestDetail.getDetail(tagUrl, params).then(function (result) {

						if (result.data == 0) {
							$scope.spinnerActive = false;
							alertService.add("success", "Event Updated successfully!", 2000);
							$location.path('eventslist');
						} else {
							$scope.spinnerActive = false;
							alertService.add("warning", "Something error try agin later!", 2000);
						}
					});
				}
			} else if ($scope.editevent_data.event_type == 'fieldTrip') {

				// return false;
				if (!$scope.editevent_data.event_title) {
					$('#event_title').attr('required', true);
					$('#event_title').focus();
					alertService.add("warning", "Please enter Event title!", 2000);
					return false;
				}
				if (!$scope.editevent_data.dead_line) {

					$('#dead_line').attr('required', true);
					$('#dead_line').focus();
					alertService.add("warning", "Please select Deadline!", 2000);
					return false;
				}
				if (!$scope.editevent_data.event_organizer) {

					$('#organizer_name').attr('required', true);
					$('#organizer_name').focus();
					alertService.add("warning", "Please enter Organizer name!", 2000);
					return false;
				}
				if (!$scope.editevent_data.event_mail) {

					$('#organizer_email').attr('required', true);
					$('#organizer_email').focus();
					alertService.add("warning", "Please enter organizer email id !", 2000);
					return false;
				}
				if (!$scope.editevent_data.event_phone) {

					$('#organizer_phone').attr('required', true);
					$('#organizer_phone').focus();
					alertService.add("warning", "Please enter valid phone no!", 2000);
					return false;
				}

				if (!$scope.editevent_data.description) {

					$('#organizer_description').attr('required', true);
					$('#organizer_description').focus();
					alertService.add("warning", "Please enter event description!", 2000);
					return false;
				} else if (!$scope.editevent_data.timezone_id) {
					$('#timezone_id').attr('required', true);
					$('#timezone_id').focus();
					alertService.add("warning", "Please select timezone !", 2000);
					return false;
				}
				if (!$scope.editevent_data.date) {

					$('#date').attr('required', true);
					$('#date').focus();
					alertService.add("warning", "Please enter event date!", 2000);
					return false;
				}

				$scope.length = $scope.corporates.length - 1;

				// return false;

				if ($scope.corporates.length == 0) {
					alertService.add("warning", "Please add corporate !", 2000);
					return false;
				}

				// if($scope.corporates[$scope.length].corporate_id == undefined && $scope.corporates[$scope.length].corporate_id)
				// {

				// 	alertService.add("warning", "Please enter corporate name!",2000);
				// 	return false;
				// }

				if ($scope.corporates[$scope.length].meeting_time == undefined) {

					alertService.add("warning", "Please select time!", 2000);
					return false;
				}



				$scope.editevent_data.presentaion_file = $scope.presentaion_file;
				$scope.editevent_data.industryTagsAdded = $scope.industryTagsAdded;
				var tagUrl = 'apiv4/public/event/update_fieldtrip';
				var params = {
					key: 'tags',
					data: $scope.editevent_data,
					corporates: $scope.corporates
				};

				$scope.spinnerActive = true;
				RequestDetail.getDetail(tagUrl, params).then(function (result) {



					if (result.data == 0) {
						$scope.spinnerActive = false;
						alertService.add("success", "Event Updated successfully!", 2000);
						$location.path('eventslist');
					} else {
						$scope.spinnerActive = false;
						alertService.add("warning", "Something error try agin later!", 2000);
					}
				});
			} else if ($scope.editevent_data.event_type == 'investorServiceMeeting') {


				$scope.editevent_data.possibletime = [];

				if (!$scope.editevent_data.event_title) {

					$('#event_title').attr('required', true);
					$('#event_title').focus();
					alertService.add("warning", "Please enter Event title!", 2000);
					return false;
				} else if (!$scope.editevent_data.event_organizer) {


					$('#event_organizer').attr('required', true);
					$('#event_organizer').focus();
					alertService.add("warning", "Please enter Event Organizer name !", 2000);
					return false;
				} else if (!$scope.editevent_data.event_mail) {

					$('#event_mail').attr('required', true);
					$('#event_mail').focus();
					alertService.add("warning", "Please enter valid Organizer email !", 2000);
					return false;
				} else if (!$scope.editevent_data.event_phone) {

					$('#event_phone').attr('required', true);
					$('#event_phone').focus();
					alertService.add("warning", "Please enter valid phone no !", 2000);
					return false;
				} else if (!$scope.editevent_data.description) {

					$('#organizer_description').attr('required', true);
					$('#organizer_description').focus();
					alertService.add("warning", "Please enter Event description!", 2000);
					return false;
				}
				// else if(!$scope.editevent_data.investor_firm_name)
				// {

				// 	$('#broke').attr('required',true);
				// 	$('#broke').focus();
				// 	alertService.add("warning", "Please enter Investor firm name!",2000);
				// 	return false;
				// }

				// else if(!$scope.editevent_data.investor_name)
				// {

				// 	$('#investor_name').attr('required',true);
				// 	$('#investor_name').focus();
				// 	alertService.add("warning", "Please enter Investor contact  name!",2000);
				// 	return false;
				// }	

				// else if(!$scope.editevent_data.investor_email)
				// {

				// 	$('#investor_email').attr('required',true);
				// 	$('#investor_email').focus();
				// 	alertService.add("warning", "Please enter Investor mail id!",2000);
				// 	return false;
				// }	

				// else if(!$scope.editevent_data.investor_phone)
				// {

				// 	$('#investor_phone').attr('required',true);
				// 	$('#investor_phone').focus();
				// 	alertService.add("warning", "Please enter Investor phone!",2000);
				// 	return false;
				// }	

				if (!$scope.editevent_data.timezone_id) {
					$('#timezone_id').attr('required', true);
					$('#timezone_id').focus();
					alertService.add("warning", "Please select timezone !", 2000);
					return false;
				} else if ($scope.editevent_data.timeslots.length == '0') {

					$('#date').attr('required', true);
					$('#city').focus();
					alertService.add("warning", "Please choose atleast one Schedule Date and location!", 2000);
					return true;
				} else {
					$scope.editevent_data.presentaion_file = $scope.presentaion_file;
					$scope.editevent_data.industryTagsAdded = $scope.industryTagsAdded;
					var tagUrl = 'apiv4/public/event/update_investorServiceMeeting';
					var params = {
						key: 'tags',
						data: $scope.editevent_data
					};

					$scope.spinnerActive = true;
					RequestDetail.getDetail(tagUrl, params).then(function (result) {
						if (result.data == 0) {
							$scope.spinnerActive = false;
							alertService.add("success", "Event Updated successfully!", 2000);
							$location.path('eventslist');
						} else {
							$scope.spinnerActive = false;
							alertService.add("warning", "Something error try agin later!", 2000);
						}
					});
				}
			} else if ($scope.editevent_data.event_type == 'conference') {
				if (!$scope.editevent_data.event_title) {
					$('#event_title').attr('required', true);
					$('#event_title').focus();
					alertService.add("warning", "Please enter event title !", 2000);
					return false;
				} else if (!$scope.editevent_data.webcast) {
					$('#webcast').attr('required', true);
					$('#webcast').focus();
					alertService.add("warning", "Please enter webcast !", 2000);
					return false;
				} else if (!$scope.editevent_data.event_organizer) {
					$('#organizer_name').attr('required', true);
					$('#organizer_name').focus();
					alertService.add("warning", "Please enter event organizer name !", 2000);
					return false;
				} else if (!$scope.editevent_data.event_mail) {
					$('#organizer_email').attr('required', true);
					$('#organizer_email').focus();
					alertService.add("warning", "Please enter valid organizer email !", 2000);
					return false;
				} else if (!$scope.editevent_data.event_phone) {
					$('#organizer_phone').attr('required', true);
					$('#organizer_phone').focus();
					alertService.add("warning", "Please enter valid phone no !", 2000);
					return false;
				} else if (!$scope.editevent_data.description) {
					$('#organizer_description').attr('required', true);
					$('#organizer_description').focus();
					alertService.add("warning", "Please enter event description !", 2000);
					return false;
				} else if (!$scope.editevent_data.location) {
					$('#location').attr('required', true);
					$('#location').focus();
					alertService.add("warning", "Please enter location !", 2000);
					return false;
				} else if (!$scope.editevent_data.address_of_point) {
					$('#address_of_point').attr('required', true);
					$('#address_of_point').focus();
					alertService.add("warning", "Please enter address !", 2000);
					return false;
				} else if (!$scope.editevent_data.date) {
					$('#date').attr('required', true);
					$('#date').focus();
					alertService.add("warning", "Please enter address !", 2000);
					return false;
				}

				$scope.editevent_data.presentaion_file = $scope.presentaion_file;
				$scope.editevent_data.industryTagsAdded = $scope.industryTagsAdded;

				var tagUrl = 'apiv4/public/event/update_conference';
				var params = {
					data: $scope.editevent_data
				};

				RequestDetail.getDetail(tagUrl, params).then(function (result) {
					if (result.data == 0) {
						$scope.spinnerActive = false;
						alertService.add("success", "Event Updated successfully!", 2000);
						$location.path('eventslist');
					} else {
						$scope.spinnerActive = false;
						alertService.add("warning", "Something error try agin later!", 2000);
					}
				});
			}
		}

		$scope.addinvesterlist = function () {




			if ($scope.tags.investers != '') {
				if (angular.isUndefined($scope.editevent_data.addinvesterslist)) {
					$scope.editevent_data.addinvesterslist = [];
				}
				if ($scope.editevent_data.addinvesterslist.indexOf($scope.tags.investers) == -1) {
					$scope.editevent_data.addinvesterslist.push($scope.tags.investers);
					$scope.tags.investers = '';
					$scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
				} else {
					alertService.add("warning", "Allready entered this item!", 2000);
					$scope.editevent_data.investersgrp = '';
					$scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
				}
			}
		}
		$scope.addMacroTag = function () {
			if ($scope.tags.valMacroTags != '') {

				if ($scope.industryTagsAdded.indexOf($scope.tags.valMacroTags) == -1) {
					$scope.industryTagsAdded.push($scope.tags.valMacroTags);

					$scope.tags.valMacroTags = '';
					$scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
				} else {
					alertService.add("warning", "Allready entered this item!", 2000);
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
					alertService.add("warning", "Allready entered this item!", 2000);
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
					alertService.add("warning", "Allready entered this item!", 2000);
					$scope.tags.valMicroTags = '';
					$scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
				}
			}
		}

		$scope.removeTag = function (item) {
			var index = $scope.industryTagsAdded.indexOf(item);
			$scope.industryTagsAdded.splice(index, 1);
		}
		$scope.editevent = function (id) {
			$location.path('event/response/edit/' + id);
		}


		$scope.open1 = function () {
			if ((!$scope.cdata.timezone_id || $scope.cdata.timezone_id == '') && ($scope.cdata.event_type == 'analystDay' || $scope.cdata.event_type == 'earningsCallfollowup' || $scope.cdata.event_type == 'conference' || $scope.cdata.event_type == 'fieldTrip')) {
				alertService.add("warning", "Kindly choose timezone!", 2000);
				return false;
			}
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


		// $scope.addinvesterlists = function(){



		// 		if($scope.tags.investers != ''){

		// 			if($scope.editevent_data.addinvesterslist.indexOf($scope.tags.investers) == -1){
		// 				$scope.editevent_data.addinvesterslist.push($scope.tags.investers);
		// 				$scope.tags.investers = '';
		// 				$scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
		// 			} else {
		// 				alertService.add("warning", "Allready entered this item!",2000);
		// 				$scope.editevent_data.investersgrp= '';
		// 				$scope.$broadcast('angucomplete-alt:clearInput', 'tagMacro');
		// 			}
		// 		}
		// 	}


	})
*/
	
	.controller('vieweventctrl', function ($scope, $http, $location, $route, $routeParams, RequestDetail, localStorageService, alertService, configdetails, $timeout) {
		$scope.pageHeading = 'View Events';
		$scope.dasboardActive = 'active';

		$scope.eventid = $routeParams.eventId;
		$scope.data = {};

		$scope.eve_data = {}; //inital output daata to store
		$scope.event_data = {};

		$scope.evedata_filter = [];
		$scope.clientdata = {};
		$scope.clientdata.conf_filter = [];

		$scope.meeting = {};
		$scope.meeting.main_tab = {};
		$scope.meeting.investor_id = '';
		$scope.meeting.user = {};

		//show loader
		$scope.spinnerActive = true;


		//show or hide non login menu
		$scope.showloginattr = 1;

		if (localStorageService.get('userdata') == null) {
			$scope.showloginattr = 0;
			$scope.sidemenu = false;
		}
		//show or hide non login menu

		//tabs
		$scope.activetab = 0;

		$scope.changeactive = function (index) {
			$scope.activetab = index;
		};
		//tabs

		//info popup
		$scope.showModalpageinfo = false;

		$scope.openmodelpagehelp = function () {
			$scope.showModalpageinfo = !$scope.showModalpageinfo;
		}
		//info popup

		$scope.show_dashboard = function () {
			$location.path('dashboard');
		}


		$scope.init = function () {

			if (localStorageService.get('userdata') != null) {
				var user_data = localStorageService.get('userdata');
				$scope.user_id = user_data.user_id;
			} else {
				$scope.user_id = 0;
			}

			var thisuserbooked = true;
			var tagUrl = 'apiv4/public/event/geteventsbyid';
			var params = {
				key: 'tags',
				id: $scope.eventid
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {

				$scope.eve_data = result.data[0];

				$scope.signupfrm = '';
				if($scope.eve_data.signupfrm){
					//$scope.signupfrm = $scope.eve_data.signupfrm;
				}
				

				angular.forEach($scope.eve_data.timeslots, function (val, key) {
					angular.forEach(val.contents, function (valS, keyS) {
						//disable buttons for non-login page
						if (localStorageService.get('userdata') != null) { //static page check
							var local = localStorageService.get('userdata');
							if (valS.invester == local.userId) {
								$scope.eve_data.timeslots[key].contents[keyS].sendrequest = true;
								$scope.disbledallreqbutton = false;
								$scope.booked = [];
								$scope.booked = valS;
								var thisuserbooked = false;
							}
						} else {
							$scope.eve_data.timeslots[key].contents[keyS].sendrequest = true;
							$scope.disbledallreqbutton = false;
							$scope.booked = [];
							$scope.booked = valS;
							var thisuserbooked = false;
						}
						//disable buttons for non-login page
					});
				});

				if ($scope.eve_data.event_type == 'ndr' || $scope.eve_data.event_type == 'collaborated_ndr') { // NDR timeslots 
					angular.forEach($scope.eve_data.timeslots, function (val, key) {
						$scope.eve_data.timeslots[key].contentsc = [];
						$scope.eve_data.timeslots[key].contentsn = [];
						var vvvc = 0;
						angular.forEach(val.contents, function (valS, keyS) {
							//if (valS.invester) { //hideing without investor
								$scope.eve_data.timeslots[key].contentsc[vvvc] = valS;
								vvvc++;
							//}
						});
					});
					$scope.isNDR = true;
				} else if ($scope.eve_data.event_type == 'analystDay') { // AnalystDay timeslots 
					$scope.isAnalyst = true;
					$scope.eve_data.analystdayrec = [];
					$scope.eve_data.analystdayren = [];

					if (localStorageService.get('userdata') != null) { //static page check
						var local = localStorageService.get('userdata');
						$scope.user_type = local.user_type;
						if (angular.isDefined($scope.eve_data.analystday)) {
							angular.forEach($scope.eve_data.analystday, function (val, key) {
								if ($scope.user_type != 1) {
									if (angular.isDefined(val.status) && val.status != null && val.status == '1') {
										$scope.eve_data.analystdayrec.push(val); //  attending 
									}
									if (angular.isDefined(val.status) && val.status != null && val.status == '2') {
										$scope.eve_data.analystdayren.push(val); // not attending 
									}
								}
							});
						}
					} else {
						if (angular.isDefined($scope.eve_data.analystday)) {
							angular.forEach($scope.eve_data.analystday, function (val, key) {
								if (angular.isDefined(val.status) && val.status != null && val.status == '1') {
									$scope.eve_data.analystdayrec.push(val);
								}
								if (angular.isDefined(val.status) && val.status != null && val.status == '2') {
									$scope.eve_data.analystdayren.push(val);
								}
							});
						}

					}


				} else if ($scope.eve_data.event_type == 'earningsCallfollowup') {

					if ($scope.eve_data.check_earning_call == 'no') {

						$scope.eve_data.earncallrec = [];
						$scope.eve_data.earncallren = [];

						if (localStorageService.get('userdata') != null) { //static page check
							var local = localStorageService.get('userdata');
							$scope.user_type = local.user_type;
							angular.forEach($scope.eve_data.earncall, function (val, key) {

								if ($scope.user_type != 1) {
									if (val.status == '1') {
										$scope.eve_data.earncallrec.push(val); //accepted 
									}
									if (val.status == '2') {
										$scope.eve_data.earncallren.push(val); //canceled 
									}
								}
							});
						} else {
							angular.forEach($scope.eve_data.earncall, function (val, key) {
								if (val.status == '1') {
									$scope.eve_data.earncallrec.push(val); //accepted 
								}
								if (val.status == '2') {
									$scope.eve_data.earncallren.push(val); //canceled 
								}
							});
						}

					}

					$scope.isearningcall = true;
					$scope.localstg = '';

					if (localStorageService.get('userdata') != null) { //static page check
						var local = localStorageService.get('userdata');
						$scope.localstg = local.userId;
					}
					angular.forEach($scope.eve_data.earningcall, function (todo, key) {
						if (angular.isDefined(todo.earningcallschedule_id) && todo.earningcallschedule_id != '') {
							angular.forEach($scope.eve_data.available, function (earning, earnkey) {
								if (angular.isDefined(earning.timeslot_id) && earning.timeslot_id != '' && earning.timeslot_id == todo.earningcallschedule_id) {
									todo.available = true;
								}
							})
						}
					});
				}

				$scope.event_data = angular.copy($scope.eve_data);

				$scope.signupfrm = $scope.event_data.signupfrm;
				if ($scope.event_data.acceptmsg && $scope.event_data.acceptmsg.length > 0) {
					$scope.textentered = false;
				}
				$scope.clientdata.conf_filter = angular.copy($scope.evedata_filter);
				$scope.spinnerActive = false;
			});

		}
		$scope.init();

		//delete event
		$scope.deleteevent = function (event_id) {
			if (confirm("Are you sure to delete?")) {
				$scope.spinnerActive = true;
				var DeleteUrl = 'apiv4/public/event/deleteEvent';
				var params = {
					eventid: event_id
				};
				RequestDetail.getDetail(DeleteUrl, params).then(function (result) {
					$scope.spinnerActive = false;
					alertService.add("success", "Event Deleted successfully.", 2000);

					$location.path('eventslist');
				});
			}
		}
		//delete event

		//unregistered investor popup
		$scope.add_unregistered_investor = function () {
			$scope.meeting.user.person_company_name = '';
			$scope.meeting.user.person_name = '';
			$scope.meeting.user.person_title = '';
			$scope.meeting.user.investor_mail = '';
			$scope.meeting.user.person_phone = '';
			$('#showInvestorModal').modal('show');
			$scope.showInvestorModal = true;
		}
		//unregistered investor popup

		$scope.check_investors_popup = function () {

			if (angular.isUndefined($scope.meeting.user.person_company_name) || $scope.meeting.user.person_company_name == '' || $scope.meeting.user.person_company_name == null) {
				$('#person_company_name').focus();
				alertService.add("warning", "Enter Company name!", 2000);
				return false;

			}
			if (angular.isUndefined($scope.meeting.user.person_name) || $scope.meeting.user.person_name == '' || $scope.meeting.user.person_name == null) {
				$('#person_name').focus();
				alertService.add("warning", "Enter Investor name!", 2000);

				return false;
			}
			if (angular.isUndefined($scope.meeting.user.person_title) || $scope.meeting.user.person_title == '' || $scope.meeting.user.person_title == null) {
				$('#person_title').focus();
				alertService.add("warning", "Enter Investor title!", 2000);
				return false;
			}

			$scope.usertype = localStorageService.get('usertype');

			if (angular.isUndefined($scope.meeting.user.investor_mail) || $scope.meeting.user.investor_mail == '' || $scope.meeting.user.investor_mail == null) {
				$('#person_email').focus();

				alertService.add("warning", "Enter valid email id!", 2000);
				return false;
			}



			if (angular.isUndefined($scope.meeting.user.person_phone) || $scope.meeting.user.person_phone == '' || $scope.meeting.user.person_phone == null) {
				$('#person_phone').focus();
				alertService.add("warning", "Enter valid investor phone!", 2000);
				return false;
			}

			alertService.add("success", "Added successfully!", 2000);

			$('#pickInvestor_value').val($scope.meeting.user.person_company_name);
			$('#showInvestorModal').modal('hide');
			$scope.showInvestorModal = false;
		}
		// autocomplete of investor 

		$scope.searchInvestors = function (data) {
			if (angular.isDefined(data) && angular.isDefined(data.description) && angular.isDefined(data.description.user_id)) {
				$scope.meeting.user.user_id = data.description.user_id;
			}
		}

		$scope.colloboratedresearchcontacts = [];
		$scope.consolidated_targets = [];

		var Url = 'apiv4/public/event/getcolloboratedresearch';
		var params = {
			event_id: $scope.eventid
		};
		RequestDetail.getDetail(Url, params).then(function (result) {
			if(result.data.researchs.length>0) {
				$scope.colloboratedresearchcontacts = result.data.researchs; 
			}
			if(result.data.consolidated_targets.length>0) {
				$scope.consolidated_targets = result.data.consolidated_targets; 
			}
			////console.log(result.data);
		});



		// Close the model 

		$scope.cancel_investor_event = function () {
			$scope.init();
			$scope.showModal = !$scope.showModal;
		}

		// update investor event 

		$scope.update_investor_event = function () {


			if (!$scope.meeting.user.main_tab) {
				$('#city').attr('required', true);
				$('#city').focus();
				return false;
			} else if (!$scope.meeting.user.sub_tab) {
				alertService.add("warning", "Select time ", 2000);
				return false;
			} else if (!$scope.meeting.user.user_id && !$scope.meeting.user.investor_mail) {
				alertService.add("warning", "Select Investor ", 2000);
				return false;
			} else {
				$('.city').css('border-color', '#ccc');

				var tagUrl = 'apiv4/public/event/updateinvestor';
				var params = {
					data: $scope.meeting.user
				};
				$scope.spinnerActive = true;
				RequestDetail.getDetail(tagUrl, params).then(function (result) {
					$scope.spinnerActive = false;
					//if(result.data)
					//{
					alertService.add("success", "Metting scheduled successfully.", 2000);
					$scope.init();
					$scope.showModal = !$scope.showModal;
					//}
					//else
					//	{					
					//		alertService.add("warning", "Investor already selected !",2000);
					//	}

				});

			}

		}

		$scope.response = {};
		$scope.response.reason = 'Interested';
		$scope.showAddResponse = false;
		$scope.investerlist_id = 0;
		$scope.togglemodelAddResponse = function (investerlist_id) {
			$scope.showAddResponse = !$scope.showAddResponse;
			$scope.investerlist_id = investerlist_id;
		}

		$scope.add_event_response = function () {
			if ($scope.response.reason == 'Other') {
				if ($scope.response.ownreason == '') {
					alertService.add("warning", "Enter Your Reason!", 2000);
					return false;
				}
			}
			var responseUrl = 'apiv4/public/event/responseevent';
			var params = {
				investerlist_id: $scope.investerlist_id,
				eventid: $scope.eventid,
				response: $scope.response.reason,
				ownreason: $scope.response.ownreason
			};

			RequestDetail.getDetail(responseUrl, params).then(function (result) {
				$scope.showAddResponse = !$scope.showAddResponse;
				alertService.add("success", "Response added successfully.", 2000);
				$timeout(function () {
					$route.reload();
				}, 400);

			});
		}

		$scope.remove_validation = function (id) {
			$('#' + id).css('border', '1px solid #ccc');
		}


		//Resend Invitation
		$scope.resendInvite = function (investerlist_id) {
			if (confirm("Are you sure to resend email?")) {
				$scope.spinnerActive = true;
				var ResendUrl = 'apiv4/public/event/resendInvite';
				var params = {
					investerlist_id: investerlist_id,
					eventid: $scope.eventid
				};
				RequestDetail.getDetail(ResendUrl, params).then(function (result) {
					$scope.spinnerActive = false;
					alertService.add("success", "Invite Sent successfully.", 2000);
				});
			}
		}

		$scope.sendprovidersInvite = function () {
			if (confirm("Are you sure to send email?")) {
				$scope.spinnerActive = true;
				var ResendUrl = 'apiv4/public/event/providerssendInvite';
				var params = {
					eventid: $scope.eventid
				};
				RequestDetail.getDetail(ResendUrl, params).then(function (result) {
					$scope.spinnerActive = false;
					alertService.add("success", "Invite Sent successfully.", 2000);
				});
			}
		}

		//ADDIN NEW INVITEE SECTION STARTS
		$scope.invitee = [];

		$scope.showAddEventInvitee = false;

		$scope.togglemodelAddEventInvitee = function () {
			$scope.showAddEventInvitee = !$scope.showAddEventInvitee;
		}

		$scope.add_event_invitee = function () {

			if (angular.isUndefined($scope.invitee.investor_company_name) || $scope.invitee.investor_company_name == '' || $scope.invitee.investor_company_name == null) {
				$('#investor_company_name').focus();
				alertService.add("warning", "Enter Company name!", 2000);
				return false;
			}

			if (angular.isUndefined($scope.invitee.investor_name) || $scope.invitee.investor_name == '' || $scope.invitee.investor_name == null) {
				$('#investor_name').focus();
				alertService.add("warning", "Enter Firstname!", 2000);
				return false;
			}

			if (angular.isUndefined($scope.invitee.investor_mail) || $scope.invitee.investor_mail == '' || $scope.invitee.investor_mail == null) {
				$('#person_email').focus();
				alertService.add("warning", "Enter valid email id!", 2000);
				return false;
			}

			if (angular.isUndefined($scope.invitee.investor_phone) || $scope.invitee.investor_phone == '' || $scope.invitee.investor_phone == null) {
				$('#investor_phone').focus();
				alertService.add("warning", "Enter valid phone no!", 2000);
				return false;
			}

			$scope.spinnerActive = true;
			var InviteeAddUrl = 'apiv4/public/event/addEventInvitee';
			var params = {
				investor_company_name: $scope.invitee.investor_company_name,
				email_id: $scope.invitee.investor_mail,
				investor_name: $scope.invitee.investor_name,
				investor_phone: $scope.invitee.investor_phone,
				eventid: $scope.eventid
			};
			RequestDetail.getDetail(InviteeAddUrl, params).then(function (result) {

				if (result.data) {
					var newval = new Object();
					newval.view_status = 0;
					newval.accept_status = 0;
					newval.investor_company_name = $scope.invitee.investor_company_name;
					newval.investor_name = $scope.invitee.investor_name;
					newval.email_id = $scope.invitee.investor_mail;
					newval.investor_phone = $scope.invitee.investor_phone;
					newval.investerlist_id = result.data;

					$scope.event_data.event_investerlist.push(newval);

					//$scope.resendInvite1(result.data);
				}

				$scope.spinnerActive = false;
			});

			// $scope.invitee.investor_company_name = ''; 
			// $scope.invitee.investor_name = ''; 
			// $scope.invitee.investor_mail ='';	
			// $scope.invitee.investor_phone ='';

			$scope.showAddEventInvitee = false;
			//alertService.add("warning", "Enter Broker phone!",2000);

		}

		$scope.investernamelistfun = function () {
			var tagUrl = 'apiv4/public/event/investernamelist';
			var params = {
				key: 'tags',
				id: $scope.eventid
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				$scope.investernamelist = {};
				$scope.investernamelist = result.data;

			});
		}

		$scope.reset_request = function () {
			var allowed = true
			if (angular.isDefined($scope.event_data.conference_details) && $scope.event_data.conference_details.length > 0) {
				angular.forEach($scope.event_data.conference_details, function (todo, key) {
					if ((todo.single_meeting && todo.single_meeting == '1') || (todo.multiple_meeting && todo.multiple_meeting == '1')) {
						allowed = false;
					}
				})
				if (!allowed) {
					$scope.spinnerActive = true;
					var url = 'apiv4/public/event/delete_request';
					var params = {
						type: 'put',
						reqdata: angular.copy($scope.event_data.conference_details)
					};
					RequestDetail.getDetail(url, params).then(function (result) {
						if (result.data == 0) {
							$scope.spinnerActive = false;
							$location.path('/dashboard');
							alertService.add("success", "Requset sent successfully!", 2000);
						}
					});
				} else {
					alertService.add("warning", "First you have join the event!", 2000);
					return false;
				}
			}
		}

		$scope.schedulewizard = function () {
			var tagUrl = 'apiv4/public/event/scheduleeventsbyid';
			var params = {
				key: 'tags',
				id: $scope.eventid
			};
			$scope.showwizard = "allocateschedule";
			$scope.schedule_data = {};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				if (angular.isDefined(result.data) && result.data.length > 0) {
					$scope.schedule_data = result.data;
				}
				$scope.spinnerActive = false;
			});
		}

		$scope.save_request = function () {
			var allowed = false;
			if (angular.isDefined($scope.event_data.conference_details) && $scope.event_data.conference_details.length > 0) {
				angular.forEach($scope.event_data.conference_details, function (todo, key) {
					if ((todo.single_meeting && todo.single_meeting == '1') || (todo.multiple_meeting && todo.multiple_meeting == '1')) {
						allowed = true;
					}
				})
				if (allowed && $scope.eventchange) {
					$scope.spinnerActive = true;
					var url = 'apiv4/public/event/save_request';
					var params = {
						type: 'put',
						reqdata: angular.copy($scope.event_data.conference_details)
					};
					RequestDetail.getDetail(url, params).then(function (result) {
						if (result.data == 0) {
							$scope.spinnerActive = false;
							$location.path('/dashboard');
							alertService.add("success", "Request sent successfully!", 2000);
						}
					});
				} else {
					$scope.spinnerActive = false;
					alertService.add("warning", "Kindly select at-least one if the interest!", 2000);
					return false;
				}
			}
		}
		$scope.eventchange = false;
		//$scope.meeting_interest=function(conference,type,sel_option=true){
		// https://stackoverflow.com/questions/37152347/i-am-getting-error-syntaxerror-expected-token-in-safari-5-1-7 - default value not working in Safari	
		$scope.meeting_interest = function (conference, type, sel_option) {
			if (sel_option) {
				if (type == 'single') {
					conference.interest = 'S';
					conference.conf_order = 2;
					conference.single_meeting = 1;
					conference.multiple_meeting = 0;
				} else if (type == 'multiple') {
					conference.interest = 'M';
					conference.conf_order = 2;
					conference.multiple_meeting = 1;
					conference.single_meeting = 0;
				}
			} else {
				if (type == 'single') {
					conference.interest = '';
					conference.conf_order = 0;
					conference.single_meeting = 0;
				} else if (type == 'multiple') {
					conference.interest = '';
					conference.conf_order = 0;
					conference.multiple_meeting = 0;
				}
			}
			$scope.eventchange = true;
			if ($scope.clientdata.conf_filter.length > 0) {
				var exist = false;
				angular.forEach($scope.clientdata.conf_filter, function (confil, conind) {
					if (confil == conference.conf_order) {
						exist = true;
					}
				});
				if (!exist) {
					$scope.clientdata.conf_filter.push(conference.conf_order);
				}
			} else {
				$scope.clientdata.conf_filter.push(conference.conf_order);
			}
		}

		$scope.remove_earning_call_after_confirm = function (id, meettype) {
			if (angular.isDefined(meettype) && meettype != '') {
				var tagUrl = 'apiv4/public/event/remove_earning_call_after_confirm2';
				var params = {
					id: id,
					eid: $scope.eventid
				};
				RequestDetail.getDetail(tagUrl, params).then(function (result) {
					if (result.data) {
						$scope.init();
					}
				});
			} else {
				var tagUrl = 'apiv4/public/event/remove_earning_call_after_confirm';
				var params = {
					id: id,
					eid: $scope.eventid
				};
				RequestDetail.getDetail(tagUrl, params).then(function (result) {
					if (result.data) {
						$scope.init();
					}
				});
			}

		}



		$scope.remove_earning_call_schedule = function (id) {

			var tagUrl = 'apiv4/public/event/remove_earningcall';
			var params = {
				id: id,
				eid: $scope.eventid
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				if (result.data) {
					$scope.init();
				}
			});

		}


		$scope.hide_modal = function () {
			$scope.earn_showModal = false;
		}
		$scope.earncalljoin = function (id) {



			if (id == 2 || id == 4) {

				$scope.spinnerActive = true;
				var tagUrl = 'apiv4/public/event/earncalljoin';
				var params = {
					key: 'tags',
					eid: $scope.eventid,
					meettype: $scope.meettype,
					msg: id
				};
				RequestDetail.getDetail(tagUrl, params).then(function (result) {
					if (result.data == 0) {
						$scope.spinnerActive = false;
						$route.reload();
						alertService.add("success", "Your Request send successfully", 2000);
					}
				});


			} else {



				angular.forEach($scope.event_data.earningcall, function (val, key) {
					if (!val.join) {
						val.join = 'no';
					}
				})

				if (!$scope.event_data.bestnumber && $scope.event_data.check_earning_call == 'yes') {
					alertService.add("warning", "Enter best number to call ", 2000);
					$('#bestnumber').attr('required', true);
					$('#bestnumber').focus();
					return false;
				} else {
					$scope.spinnerActive = true;
					var tagUrl = 'apiv4/public/event/responseearncall';
					var params = {
						key: 'tags',
						id: id,
						data: $scope.event_data
					};
					RequestDetail.getDetail(tagUrl, params).then(function (result) {
						if (result.data == '0') {
							$scope.spinnerActive = false;
							$scope.init();
						}
					});
				}
			}
		}
		$scope.addinv = function () {
			$scope.spinnerActive = true;
			var tagUrl = 'apiv4/public/event/addinv';
			var params = {
				key: 'tags',
				data: $scope.event_data.timeslots
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				if (result.data == 0) {
					$scope.showModal = !$scope.showModal;
					$scope.spinnerActive = false;
					$scope.init();
				}
			});
		}
		$scope.earningcallmodel = function (uid) {
			$scope.event_data.user_type = '';
			var tagUrl = 'apiv4/public/event/getmybookingdates';
			var params = {
				key: 'tags',
				uid: uid,
				eid: $scope.eventid
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {

				$scope.innermodel = {};
				$scope.innermodel = result.data;
				angular.forEach(result.data, function (data) {
					$scope.event_data.user_type = data.user_type;
				});

				$scope.showModalearningcall = !$scope.showModalearningcall;
			});

		}
		$scope.cancelbooking = function (ids) {
			$scope.spinnerActive = true;
			var tagUrl = 'apiv4/public/event/cancelbooking';
			var params = {
				key: 'tags',
				eid: ids
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				if (result.data == 0) {
					$scope.spinnerActive = false;
					$scope.init();
				}
			});
		}

		$scope.cancelbooking2 = function (ids) {
			$scope.spinnerActive = true;
			var tagUrl = 'apiv4/public/event/cancelbooking2';
			var params = {
				key: 'tags',
				eid: ids
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				if (result.data == 0) {
					$scope.spinnerActive = false;
					$scope.init();
				}
			});
		}
		$scope.chooseearntime = function () {

			if (!$scope.event_data.choose) {
				alertService.add("warning", "kindly choose Anyone available time", 2000);
				return true;
			} else {
				var tagUrl = 'apiv4/public/event/bookingearntime';
				var params = {
					key: 'tags',
					tid: $scope.event_data.choose,
					user_type: $scope.event_data.user_type,
					meettype: $scope.event_data.meettype
				};
				RequestDetail.getDetail(tagUrl, params).then(function (result) {
					if (result.data == 0) {
						alertService.add("success", "selected time for Confirmed.", 2000);
						$scope.showModalearningcall = !$scope.showModalearningcall;
						$scope.init();
					}
				});
			}
		}
		$scope.chooseearnmodelclose = function () {
			$scope.showModalearningcall = !$scope.showModalearningcall;
		}

		//Change 

		$scope.choose_time = function () {
			$scope.meeting.sub_data = [];

			angular.forEach($scope.event_data.timeslots, function (todo, key) {
				if ($scope.meeting.user.main_tab == todo.event_timeslot_id) {
					$scope.meeting.sub_data = todo.contents;
				}
			})
		}


		$scope.reset = function () {
			$scope.investernamelist = {};
		};


		$scope.popupchooseinv = function () {

			$scope.investernamelistfun();
			$scope.meeting.user = {};
			$scope.showModal = !$scope.showModal;
			$scope.$broadcast('angucomplete-alt:clearInput');
		}

		$scope.toggleModal_field = function (event_id) {
			$scope.event_id = event_id;

			$scope.show_fieldmodal = !$scope.show_fieldmodal;
			$scope.popupMsgTitle = 'Please fill the reason';
			$scope.reasonshow = true;
			$scope.reason = {};
		}

		$scope.toggleModal = function () {
			/*
				if($scope.showModal){$scope.showModal = false;}
				if(!$scope.showModal){$scope.showModal = true;}

				if($scope.reasonshow){$scope.reasonshow = false;}
				if(!$scope.reasonshow){$scope.reasonshow = true;}
			*/
			$scope.showModal = !$scope.showModal;
			$scope.reasonshow = true;

			$scope.popupMsgTitle = 'Please fill the reason';

			$scope.reason = {};
		}
		$scope.broker_toggleModal = function () {
			$scope.broker_showModal = !$scope.broker_showModal;
			$scope.popupMsgTitle = 'Please fill the reason';
			$scope.reasonshow = !$scope.reasonshow;
			$scope.reason = {};
		}
		$scope.submitnothanku_field = function (id) {

			$scope.spinnerActive = true;
			var tagUrl = 'apiv4/public/event/nothanku_field';
			var params = {
				key: 'tags',
				eid: $scope.eventid,
				msg: id
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				if (result.data == 0) {
					$scope.spinnerActive = false;
					$scope.showModal = false;
					$scope.broker_showModal = false;
					$scope.show_fieldmodal = false;
					$location.path('/dashboard');
					alertService.add("success", "Your Request send successfully", 2000);
				}
			});

		}
		$scope.submitnothanku = function () {
			$scope.spinnerActive = true;
			var tagUrl = 'apiv4/public/event/nothanku';
			var params = {
				key: 'tags',
				eid: $scope.eventid,
				msg: $scope.reason
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				if (result.data == 0) {
					// $scope.analystjoin('2');
					$location.path('/dashboard');
					$scope.showModal = false;
					$scope.broker_showModal = false;
				}
			});

		}
		$scope.toggleModal_earn = function () {
			$scope.earn_showModal = true;
			$scope.popupMsgTitle = 'Please fill the reason';
			$scope.reasonshow = true;
			$scope.reason = {};
		}
		$scope.nothankuopt = function () {
			$scope.showModal = false;
		}
		$scope.nothankuopt1 = function () {
			$scope.broker_showModal = false;
			$scope.reasonshow = false;
		}
		$scope.earn_nothankyou = function () {
			$scope.spinnerActive = true;
			$scope.earncalljoin('2');
			$scope.earn_showModal = false;

		}
		$scope.analystjoin = function (id) {
			$scope.spinnerActive = true;
			var tagUrl = 'apiv4/public/event/analystjoin';
			var params = {
				key: 'tags',
				eid: $scope.eventid,
				msg: id
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				if (result.data == 0) {
					$scope.spinnerActive = false;
					$route.reload();
					alertService.add("success", "Your Request send successfully", 2000);
				}
			});
		}

		$scope.cancelmybooking = function () {
			$scope.cancelreason = !$scope.cancelreason;
		}
		$scope.cancelmessage = function () {
			if (!$scope.data.cancel) {
				alertService.add("warning", "Enter reason for cancel", 2000);
				$('#cancelmessage').attr('required', true);
				$('#cancelmessage').focus();
				return false;

			} else {
				var tagUrl = 'apiv4/public/event/canceleventreason';
				var params = {
					key: 'tags',
					eid: $scope.eventid,
					msg: $scope.data.cancel
				};
				RequestDetail.getDetail(tagUrl, params).then(function (result) {
					if (result.data == 0) {
						// $route.reload();
						$location.path('/dashboard');
					}
				});
			}

		}
		$scope.data.selected_time = '';
		$scope.submitmessage = function () {


			if (angular.isUndefined($scope.data.selected_time) || $scope.data.selected_time == '') {
				alertService.add("warning", "Select any time to request ", 2000);
				return false
			}
			// return false;
			var tagUrl = 'apiv4/public/event/requestmessage';
			var params = {
				key: 'tags',
				msg: $scope.data.messages,
				eid: $scope.eventid,
				time_id: $scope.data.selected_time
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				if (result.data == 0) {
					$scope.textentered = false;
					$scope.init();
				}
			});
		}

		$scope.event_acceptdecline = function (id, eid) {
			var tagUrl = 'apiv4/public/event/event_acceptdecline';
			var params = {
				key: 'tags',
				msg: id,
				eid: eid
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				if (result.data == 0) {
					$scope.init();
				}
			});
		}

		$scope.onbooked = function (id) {

			$('.btn-btn-blue').removeClass('green');
			$('#req' + id).addClass('green');
			$scope.data.selected_time = id;
			return false;
		}
		$scope.editevent = function (id) {
			$location.path('event/response/edit/' + id);
		}


	})
	.controller('brokervieweventctrl', function ($scope, $http, $location, $route, $routeParams, RequestDetail, localStorageService, alertService, configdetails, $timeout) {


		$scope.configdetails = configdetails;
		$scope.data = {};
		$scope.modaldata = {};
		$scope.pageHeading = 'View Events';
		$scope.dasboardActive = 'active';
		$scope.data.messages = '';
		$scope.textentered = true;
		$scope.eventid = $routeParams.eventId;
		var local = localStorageService.get('userdata');
		$scope.disbledallreqbutton = true;
		$scope.signupfrm = true;
		$scope.isNDR = false;
		$scope.isAnalyst = false;
		$scope.isfieldtrip = false;
		$scope.showModal = '';
		$scope.meeting = {};
		$scope.meeting.main_tab = {};
		$scope.meeting.investor_id = '';
		$scope.meeting.user = {};

		$scope.clientdata = {};
		$scope.clientdata.conf_filter = [];
		$scope.clientdata.inc_data = 0;
		$scope.spinnerActive = true;


		$scope.showloginattr = 1;

		if (localStorageService.get('userdata') == null) {
			$scope.showloginattr = 0;
			$scope.sidemenu = false;
		}

		$scope.deleteevent = function (event_id) {
			if (confirm("Are you sure to delete?")) {
				$scope.spinnerActive = true;
				var DeleteUrl = 'apiv4/public/event/deleteEvent';
				var params = {
					eventid: event_id
				};
				RequestDetail.getDetail(DeleteUrl, params).then(function (result) {
					$scope.spinnerActive = false;
					alertService.add("success", "Event Deleted successfully.", 2000);

					$location.path('eventslist');
				});
			}
		}


		$scope.activetab = 0;

		$scope.changeactive = function (index) {
			$scope.activetab = index;
		};

		$scope.showModalpageinfo = false;

		$scope.openmodelpagehelp = function () {
			$scope.showModalpageinfo = !$scope.showModalpageinfo;
		}

		$scope.show_dashboard = function () {
			$location.path('dashboard');
		}


		$scope.add_unregistered_investor = function () {
			$scope.meeting.user.person_company_name = '';
			$scope.meeting.user.person_name = '';
			$scope.meeting.user.person_title = '';
			$scope.meeting.user.investor_mail = '';
			$scope.meeting.user.person_phone = '';
			$('#showInvestorModal').modal('show');
			$scope.showInvestorModal = true;

		}

		$scope.check_investors_popup = function () {

			if (angular.isUndefined($scope.meeting.user.person_company_name) || $scope.meeting.user.person_company_name == '' || $scope.meeting.user.person_company_name == null) {
				$('#person_company_name').focus();
				alertService.add("warning", "Enter Company name!", 2000);
				return false;

			}
			if (angular.isUndefined($scope.meeting.user.person_name) || $scope.meeting.user.person_name == '' || $scope.meeting.user.person_name == null) {
				$('#person_name').focus();
				alertService.add("warning", "Enter Investor name!", 2000);

				return false;
			}
			if (angular.isUndefined($scope.meeting.user.person_title) || $scope.meeting.user.person_title == '' || $scope.meeting.user.person_title == null) {
				$('#person_title').focus();
				alertService.add("warning", "Enter Investor title!", 2000);
				return false;
			}

			$scope.usertype = localStorageService.get('usertype');

			if (angular.isUndefined($scope.meeting.user.investor_mail) || $scope.meeting.user.investor_mail == '' || $scope.meeting.user.investor_mail == null) {
				$('#person_email').focus();

				alertService.add("warning", "Enter valid email id!", 2000);
				return false;
			}



			if (angular.isUndefined($scope.meeting.user.person_phone) || $scope.meeting.user.person_phone == '' || $scope.meeting.user.person_phone == null) {
				$('#person_phone').focus();
				alertService.add("warning", "Enter valid investor phone!", 2000);
				return false;
			}



			alertService.add("success", "Added successfully!", 2000);

			$('#pickInvestor_value').val($scope.meeting.user.person_company_name);
			$('#showInvestorModal').modal('hide');
			$scope.showInvestorModal = false;
		}
		// autocomplete of investor 

		$scope.searchInvestors = function (data) {
			if (angular.isDefined(data) && angular.isDefined(data.description) && angular.isDefined(data.description.user_id)) {
				$scope.meeting.user.user_id = data.description.user_id;
			}
		}

		// Close the model 

		$scope.cancel_investor_event = function () {
			$scope.init();
			$scope.showModal = !$scope.showModal;
		}

		// update investor event 

		$scope.update_investor_event = function () {
			if (!$scope.meeting.user.main_tab) {
				$('#city').attr('required', true);
				$('#city').focus();
				return false;
			} else if (!$scope.meeting.user.sub_tab) {
				alertService.add("warning", "Select time ", 2000);
				return false;
			} else if (!$scope.meeting.user.user_id && !$scope.meeting.user.investor_mail) {
				alertService.add("warning", "Select Investor ", 2000);
				return false;
			} else {
				$('.city').css('border-color', '#ccc');

				var tagUrl = 'apiv4/public/event/updateinvestor';
				var params = {
					data: $scope.meeting.user
				};
				$scope.spinnerActive = true;
				RequestDetail.getDetail(tagUrl, params).then(function (result) {
					$scope.spinnerActive = false;
					alertService.add("success", "Metting scheduled successfully.", 2000);
					$scope.init();
					$scope.showModal = !$scope.showModal;

				});

			}

		}

		// get investor list
		$scope.investernamelistfun = function () {
			var tagUrl = 'apiv4/public/event/investernamelist';
			var params = {
				key: 'tags',
				id: $scope.eventid
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				$scope.investernamelist = {};
				$scope.investernamelist = result.data;

			});
		}

		$scope.investernamelistfun();
		$scope.event_data = {};
		$scope.schedule_data = {};
		$scope.eve_data = {};
		$scope.evedata_filter = [];
		$scope.clientdata.conf_filter = [];
		$scope.showwizard = "viewschedule";
		$scope.init = function () {

			$scope.event_data = {};
			$scope.eve_data = {};
			$scope.evedata_filter = [];
			$scope.clientdata.conf_filter = [];

			if (localStorageService.get('userdata') != null) {
				var user_data = localStorageService.get('userdata');
				$scope.user_id = user_data.user_id;
			} else {
				$scope.user_id = 0;
			}


			var thisuserbooked = true;
			var tagUrl = 'apiv4/public/event/geteventsbyid';
			var params = {
				key: 'tags',
				id: $scope.eventid
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {

				$scope.eve_data = result.data[0];
				
				$scope.signupfrm = '';
				$scope.signupfrm = $scope.eve_data.signupfrm;
				angular.forEach($scope.eve_data.timeslots, function (val, key) {
					angular.forEach(val.contents, function (valS, keyS) {
						if (localStorageService.get('userdata') != null) { //static page check
							var local = localStorageService.get('userdata');
							if (valS.invester == local.userId) {
								$scope.eve_data.timeslots[key].contents[keyS].sendrequest = true;
								$scope.disbledallreqbutton = false;
								$scope.booked = [];
								$scope.booked = valS;
								var thisuserbooked = false;
							}
						} else {
							$scope.eve_data.timeslots[key].contents[keyS].sendrequest = true;
							$scope.disbledallreqbutton = false;
							$scope.booked = [];
							$scope.booked = valS;
							var thisuserbooked = false;
						}
					});
				})

				if ($scope.eve_data.event_type == 'ndr' || $scope.eve_data.event_type == 'collaborated_ndr' || $scope.eve_data.event_type == 'dealRoadshow' || $scope.eve_data.event_type == 'investorServiceMeeting') {
					angular.forEach($scope.eve_data.timeslots, function (val, key) {
						$scope.eve_data.timeslots[key].contentsc = [];
						$scope.eve_data.timeslots[key].contentsn = [];
						var vvvc = 0;
						angular.forEach(val.contents, function (valS, keyS) {
							if (valS.invester) {
								$scope.eve_data.timeslots[key].contentsc[vvvc] = valS;
								vvvc++;
							}
						});
					})
					$scope.isNDR = true;
				} else if ($scope.eve_data.event_type == 'analystDay') {
					$scope.isAnalyst = true;
					$scope.eve_data.analystdayrec = [];
					$scope.eve_data.analystdayren = [];

					if (localStorageService.get('userdata') != null) { //static page check
						var local = localStorageService.get('userdata');
						$scope.user_type = local.user_type;
						if (angular.isDefined($scope.eve_data.analystday)) {
							angular.forEach($scope.eve_data.analystday, function (val, key) {
								if ($scope.user_type != 1) {
									if (angular.isDefined(val.status) && val.status != null && val.status == '1') {
										$scope.eve_data.analystdayrec.push(val);
									}
									if (angular.isDefined(val.status) && val.status != null && val.status == '2') {
										$scope.eve_data.analystdayren.push(val);
									}
								}
							});
						}
					} else {
						if (angular.isDefined($scope.eve_data.analystday)) {
							angular.forEach($scope.eve_data.analystday, function (val, key) {
								if (angular.isDefined(val.status) && val.status != null && val.status == '1') {
									$scope.eve_data.analystdayrec.push(val);
								}
								if (angular.isDefined(val.status) && val.status != null && val.status == '2') {
									$scope.eve_data.analystdayren.push(val);
								}
							});
						}

					}


				} else if ($scope.eve_data.event_type == 'conference' && angular.isDefined($scope.eve_data.conference_details)) {
					angular.forEach($scope.eve_data.conference_details, function (val, key) {
						if (val.room_no && val.room_no != '' || val.room_no != null || val.room_no != 'null') {
							val.avail_status = 'Y';
						} else {
							val.avail_status = 'N';
						}
						if (val.avail_status == 'N') {
							val.conf_order = 0;
						} else if (val.avail_status == 'Y') {
							if (angular.isDefined(val.interest) && val.interest != '') {
								val.conf_order = 2;
							} else {
								val.conf_order = 1;
							}
						}

						if ($scope.evedata_filter.length > 0) {
							var exist = false;
							angular.forEach($scope.evedata_filter, function (confil, conind) {
								if (confil == val.conf_order) {
									exist = true;
								}
							});
							if (!exist) {
								$scope.evedata_filter.push(val.conf_order);
							}
						} else {
							$scope.evedata_filter.push(val.conf_order);
						}
					});

					if (angular.isDefined($scope.eve_data.request_details)) {
						angular.forEach($scope.eve_data.request_details, function (requ, reqind) {
							angular.forEach($scope.eve_data.conference_details, function (val, key) {
								if (requ.conference_room_id == val.id) {
									val.conf_order = 2;

									if (requ.single_meeting && parseInt(requ.single_meeting) == 1) {
										val.interest = 'S';
										val.single_meeting = 1;
									}
									if (requ.group_meeting && parseInt(requ.group_meeting) == 1) {
										val.interest = 'M';
										val.multiple_meeting = 1;
									}
									if ($scope.evedata_filter.length > 0) {
										var exist = false;
										angular.forEach($scope.evedata_filter, function (confil, conind) {
											if (confil == val.conf_order) {
												exist = true;
											}
										});
										if (!exist) {
											$scope.evedata_filter.push(val.conf_order);
										}
									} else {
										$scope.evedata_filter.push(val.conf_order);
									}
								}
							});
						});
					}
				} else if ($scope.eve_data.event_type == 'fieldTrip') {
					$scope.isAnalyst = true;
					$scope.eve_data.analystdayrec = [];
					$scope.eve_data.analystdayren = [];

					if (localStorageService.get('userdata') != null) { //static page check
						var local = localStorageService.get('userdata');
						$scope.user_type = local.user_type;
					}


					angular.forEach($scope.eve_data.analystday, function (val, key) {
						if ($scope.user_type != 1) {
							if (val.status == '1') {
								$scope.eve_data.analystdayrec.push(val);
							}
							if (val.status == '2') {
								$scope.eve_data.analystdayren.push(val);
							}
						}
					});

				} else if ($scope.eve_data.event_type == 'earningsCallfollowup') {


					if ($scope.eve_data.check_earning_call == 'no') {

						$scope.eve_data.earncallrec = [];
						$scope.eve_data.earncallren = [];




						if (localStorageService.get('userdata') != null) { //static page check
							var local = localStorageService.get('userdata');
							$scope.user_type = local.user_type;
							angular.forEach($scope.eve_data.earncall, function (val, key) {

								if ($scope.user_type != 1) {
									if (val.status == '1') {
										$scope.eve_data.earncallrec.push(val);
									}
									if (val.status == '2') {
										$scope.eve_data.earncallren.push(val);
									}
								}
							});
						} else {
							angular.forEach($scope.eve_data.earncall, function (val, key) {
								if (val.status == '1') {
									$scope.eve_data.earncallrec.push(val);
								}
								if (val.status == '2') {
									$scope.eve_data.earncallren.push(val);
								}
							});
						}



					}

					$scope.isearningcall = true;
					$scope.localstg = '';

					if (localStorageService.get('userdata') != null) { //static page check
						var local = localStorageService.get('userdata');
						$scope.localstg = local.userId;
					}
					angular.forEach($scope.eve_data.earningcall, function (todo, key) {

						if (angular.isDefined(todo.earningcallschedule_id) && todo.earningcallschedule_id != '') {
							angular.forEach($scope.eve_data.available, function (earning, earnkey) {
								if (angular.isDefined(earning.timeslot_id) && earning.timeslot_id != '' && earning.timeslot_id == todo.earningcallschedule_id) {
									todo.available = true;
								}
							})
						}
					})
				}

				$scope.event_data = angular.copy($scope.eve_data);

				if (angular.isUndefined($scope.eve_data.request_details)) {
					// NEED TO EMPTY THE request_details VARIABLE
					$scope.event_data.request_details = [];
				}
				angular.forEach($scope.eve_data.request_details, function (evedata, eveval) {
					var j = 0;
					angular.forEach($scope.event_data.request_details, function (redata, raval) {
						if (angular.isDefined(redata.conference_id) && angular.isDefined(redata.corporate_id) && evedata.conference_id == redata.conference_id &&
							evedata.corporate_id == redata.corporate_id) {
							j = 1;
						}
					});
					if (j == 0) {
						$scope.event_data.request_details.push(evedata);
					}
				});
				$scope.signupfrm = $scope.event_data.signupfrm;
				if ($scope.event_data.acceptmsg && $scope.event_data.acceptmsg.length > 0) {
					$scope.textentered = false;
				}
				$scope.clientdata.conf_filter = angular.copy($scope.evedata_filter);
				$scope.spinnerActive = false;

				//console.log($scope.event_data);
			});

		}

		$scope.add_event_invitee = function () {

			if (angular.isUndefined($scope.invitee.investor_company_name) || $scope.invitee.investor_company_name == '' || $scope.invitee.investor_company_name == null) {
				$('#investor_company_name').focus();
				alertService.add("warning", "Enter Company name!", 2000);
				return false;
			}

			if (angular.isUndefined($scope.invitee.investor_name) || $scope.invitee.investor_name == '' || $scope.invitee.investor_name == null) {
				$('#investor_name').focus();
				alertService.add("warning", "Enter Firstname!", 2000);
				return false;
			}

			if (angular.isUndefined($scope.invitee.investor_mail) || $scope.invitee.investor_mail == '' || $scope.invitee.investor_mail == null) {
				$('#person_email').focus();
				alertService.add("warning", "Enter valid email id!", 2000);
				return false;
			}

			if (angular.isUndefined($scope.invitee.investor_phone) || $scope.invitee.investor_phone == '' || $scope.invitee.investor_phone == null) {
				$('#investor_phone').focus();
				alertService.add("warning", "Enter valid phone no!", 2000);
				return false;
			}

			$scope.spinnerActive = true;
			var InviteeAddUrl = 'apiv4/public/event/addEventInvitee';
			var params = {
				investor_company_name: $scope.invitee.investor_company_name,
				email_id: $scope.invitee.investor_mail,
				investor_name: $scope.invitee.investor_name,
				investor_phone: $scope.invitee.investor_phone,
				eventid: $scope.eventid
			};
			RequestDetail.getDetail(InviteeAddUrl, params).then(function (result) {

				if (result.data) {
					var newval = new Object();
					newval.view_status = 0;
					newval.accept_status = 0;
					newval.investor_company_name = $scope.invitee.investor_company_name;
					newval.investor_name = $scope.invitee.investor_name;
					newval.email_id = $scope.invitee.investor_mail;
					newval.investor_phone = $scope.invitee.investor_phone;
					newval.investerlist_id = result.data;

					$scope.event_data.event_investerlist.push(newval);

					//$scope.resendInvite1(result.data);
				}

				$scope.spinnerActive = false;
			});

			// $scope.invitee.investor_company_name = ''; 
			// $scope.invitee.investor_name = ''; 
			// $scope.invitee.investor_mail ='';	
			// $scope.invitee.investor_phone ='';

			$scope.showAddEventInvitee = false;
			//alertService.add("warning", "Enter Broker phone!",2000);

		}


		$scope.eventchange = false;


		$scope.remove_earning_call_after_confirm = function (id, meettype) {
			if (angular.isDefined(meettype) && meettype != '') {
				var tagUrl = 'apiv4/public/event/remove_earning_call_after_confirm2';
				var params = {
					id: id,
					eid: $scope.eventid
				};
				RequestDetail.getDetail(tagUrl, params).then(function (result) {
					if (result.data) {
						$scope.init();
					}
				});
			} else {
				var tagUrl = 'apiv4/public/event/remove_earning_call_after_confirm';
				var params = {
					id: id,
					eid: $scope.eventid
				};
				RequestDetail.getDetail(tagUrl, params).then(function (result) {
					if (result.data) {
						$scope.init();
					}
				});
			}

		}



		$scope.remove_earning_call_schedule = function (id) {

			var tagUrl = 'apiv4/public/event/remove_earningcall';
			var params = {
				id: id,
				eid: $scope.eventid
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				if (result.data) {
					$scope.init();
				}
			});

		}

		$scope.earncalljoin = function (id) {

			if (id == 2 || id == 4) {

				$scope.spinnerActive = true;
				var tagUrl = 'apiv4/public/event/earncalljoin';
				var params = {
					key: 'tags',
					eid: $scope.eventid,
					meettype: $scope.meettype,
					msg: id
				};
				RequestDetail.getDetail(tagUrl, params).then(function (result) {
					if (result.data == 0) {
						$scope.spinnerActive = false;
						$route.reload();
						alertService.add("success", "Your Request send successfully", 2000);
					}
				});


			} else {

				angular.forEach($scope.event_data.earningcall, function (val, key) {
					if (!val.join) {
						val.join = 'no';
					}
				})

				if (!$scope.event_data.bestnumber && $scope.event_data.check_earning_call == 'yes') {
					alertService.add("warning", "Enter best number to call ", 2000);
					$('#bestnumber').attr('required', true);
					$('#bestnumber').focus();
					return false;
				} else {
					$scope.spinnerActive = true;
					var tagUrl = 'apiv4/public/event/responseearncall';
					var params = {
						key: 'tags',
						id: id,
						data: $scope.event_data
					};
					RequestDetail.getDetail(tagUrl, params).then(function (result) {
						if (result.data == '0') {
							$scope.spinnerActive = false;
							$scope.init();
						}
					});
				}
			}
		}

		$scope.cancelbooking = function (ids) {
			$scope.spinnerActive = true;
			var tagUrl = 'apiv4/public/event/cancelbooking';
			var params = {
				key: 'tags',
				eid: ids
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				if (result.data == 0) {
					$scope.spinnerActive = false;
					$scope.init();
				}
			});
		}

		$scope.cancelbooking2 = function (ids) {
			$scope.spinnerActive = true;
			var tagUrl = 'apiv4/public/event/cancelbooking2';
			var params = {
				key: 'tags',
				eid: ids
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				if (result.data == 0) {
					$scope.spinnerActive = false;
					$scope.init();
				}
			});
		}


		//Change 

		$scope.choose_time = function () {
			$scope.meeting.sub_data = [];

			angular.forEach($scope.event_data.timeslots, function (todo, key) {
				if ($scope.meeting.user.main_tab == todo.event_timeslot_id) {
					$scope.meeting.sub_data = todo.contents;
				}
			})
		}


		$scope.popupchooseinv = function () {

			$scope.investernamelistfun();
			$scope.meeting.user = {};
			$scope.showModal = !$scope.showModal;
			$scope.$broadcast('angucomplete-alt:clearInput');
		}


		$scope.submitnothanku_field = function (id) {

			$scope.spinnerActive = true;
			var tagUrl = 'apiv4/public/event/nothanku_field';
			var params = {
				key: 'tags',
				eid: $scope.eventid,
				msg: id
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				if (result.data == 0) {
					$scope.spinnerActive = false;
					$scope.showModal = false;
					$scope.broker_showModal = false;
					$scope.show_fieldmodal = false;
					$location.path('/dashboard');
					alertService.add("success", "Your Request send successfully", 2000);
				}
			});

		}
		$scope.submitnothanku = function () {
			$scope.spinnerActive = true;
			var tagUrl = 'apiv4/public/event/nothanku';
			var params = {
				key: 'tags',
				eid: $scope.eventid,
				msg: $scope.reason
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				if (result.data == 0) {
					// $scope.analystjoin('2');
					$location.path('/dashboard');
					$scope.showModal = false;
					$scope.broker_showModal = false;
				}
			});



		}
		$scope.toggleModal_earn = function () {
			$scope.earn_showModal = true;
			$scope.popupMsgTitle = 'Please fill the reason';
			$scope.reasonshow = true;
			$scope.reason = {};
		}
		$scope.nothankuopt = function () {
			$scope.showModal = false;
		}
		$scope.nothankuopt1 = function () {
			$scope.broker_showModal = false;
			$scope.reasonshow = false;
		}
		$scope.earn_nothankyou = function () {
			$scope.spinnerActive = true;
			$scope.earncalljoin('2');
			$scope.earn_showModal = false;

		}

		$scope.gettargetcontact = function () {
			var tagUrl = 'apiv4/public/event/gettargetcontact';
			var params = {
				event_id: $scope.eventid,
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				$scope.event_reasearchcontactlists = result.data;
			});
		}

		$scope.gettargetcontact();

		$scope.addtargetcontact = function () {
			$scope.showModaladdtargetcontact = true;
		}

		$scope.hidetargetcontact = function () {
			$scope.showModaladdtargetcontact = false;
		}

		$scope.targetcontact = {};
		
		$scope.submittargetcontact = function () {
			if (!$scope.targetcontact.firstname) {
				alertService.add("warning", "Enter First Name!", 2000);
				$('#targetcontact_firstname').attr('required', true);
				$('#targetcontact_firstname').focus();
				return false;
			}
			else if (!$scope.targetcontact.lastname) {
				alertService.add("warning", "Enter Last Name!", 2000);
				$('#targetcontact_lastname').attr('required', true);
				$('#targetcontact_lastname').focus();
				return false;
			} else if (!$scope.targetcontact.company) {
				alertService.add("warning", "Enter firmname!", 2000);
				$('#targetcontact_company').attr('required', true);
				$('#targetcontact_company').focus();
				return false;
			} else if (!$scope.targetcontact.email) {
				alertService.add("warning", "Enter contact email address!", 2000);
				$('#targetcontact_email').attr('required', true);
				$('#targetcontact_email').focus();
				return false;
			} else {
				var tagUrl = 'apiv4/public/event/addtargetcontact';
				var params = {
					targetcontact: $scope.targetcontact,
					event_id: $scope.eventid,
				};
				RequestDetail.getDetail(tagUrl, params).then(function (result) {
					$scope.showModaladdtargetcontact = false;
					$scope.gettargetcontact();
				});
			}
		}

		$scope.removereasearchcontact = function (collaboratedndr_provider_contact_id,index) {
			var tagUrl = 'apiv4/public/event/removetargetcontact';
			var params = {
				collaboratedndr_provider_contact_id: collaboratedndr_provider_contact_id,
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				$scope.gettargetcontact();
			});
		}

		$scope.collaboratedndr_provider_file = {};

		$scope.collaboratedndr_provider_file.ndrlastnotes = [];

        $scope.uploadndrlastnote = function (imgdata) {
            $scope.collaboratedndr_provider_file.ndrlastnotes = [];

            var obj = JSON.parse(imgdata);
            $scope.$apply(function () {
                $scope.collaboratedndr_provider_file.ndrlastnotes.push({
                    file_name: obj.name,
                    file_location: 'uploads/collaboratedndr/' + obj.uploadedname
                })
            });

		}
		$scope.removelastnotes = function (index) {
            $scope.collaboratedndr_provider_file.ndrlastnotes.splice(index, 1);
        }
		
		$scope.collaboratedndr_provider_file.ndrmodels = [];

        $scope.uploadndrmodel = function (imgdata) {
            $scope.collaboratedndr_provider_file.ndrmodels = [];

            var obj = JSON.parse(imgdata);
            $scope.$apply(function () {
                $scope.collaboratedndr_provider_file.ndrmodels.push({
                    file_name: obj.name,
                    file_location: 'uploads/collaboratedndr/' + obj.uploadedname
                })
            });

		}
		$scope.removeFiles = function (index) {
            $scope.collaboratedndr_provider_file.ndrmodels.splice(index, 1);
		}
		
		
		$scope.getcollabarateddata = function () {
			var tagUrl = 'apiv4/public/event/getcollabarateddata';
			var params = {
				event_id: $scope.eventid,
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				$scope.collaboratedndr_provider_file = result.data;
			});
		}

		$scope.getcollabarateddata();

		$scope.savecollabarateddata = function () {
			if (!$scope.collaboratedndr_provider_file.thesis) {
				alertService.add("warning", "Enter thesis details!", 2000);
				$('#thesis').attr('required', true);
				$('#thesis').focus();
				return false;
			} else if (!$scope.collaboratedndr_provider_file.agenda) {
				alertService.add("warning", "Enter agenda details!", 2000);
				$('#agenda').attr('required', true);
				$('#agenda').focus();
				return false;
			} else {
				var tagUrl = 'apiv4/public/event/savecollabarateddata';
				var params = {
					data: $scope.collaboratedndr_provider_file,
					event_id: $scope.eventid,
				};
				RequestDetail.getDetail(tagUrl, params).then(function () {
					alertService.add("success", "Deatails added successfully.", 2000);
				});
			}
		}

		$scope.event_acceptdecline = function (id, eid) {
			var tagUrl = 'apiv4/public/event/event_acceptdecline';
			var params = {
				key: 'tags',
				msg: id,
				eid: eid
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				if (result.data == 0) {
					$scope.init();
				}
			});
		}
		$scope.init();
		$scope.data = [];

		$scope.editevent = function (id) {
			$location.path('eventresponseview/edit/' + id);
		}

	})
	.controller('vieweventctrl_old', function ($scope, $http, $location, $route, $routeParams, RequestDetail, localStorageService, alertService, configdetails, $timeout) {
		$scope.configdetails = configdetails;
		$scope.data = {};
		$scope.modaldata = {};
		$scope.pageHeading = 'View Events';
		$scope.dasboardActive = 'active';
		$scope.data.messages = '';
		$scope.textentered = true;
		$scope.eventid = $routeParams.eventId;
		var local = localStorageService.get('userdata');
		$scope.disbledallreqbutton = true;
		$scope.signupfrm = true;
		$scope.isNDR = false;
		$scope.isAnalyst = false;
		$scope.isfieldtrip = false;
		$scope.showModal = '';
		$scope.meeting = {};
		$scope.meeting.main_tab = {};
		$scope.meeting.investor_id = '';
		$scope.meeting.user = {};

		$scope.clientdata = {};
		$scope.clientdata.conf_filter = [];
		$scope.clientdata.inc_data = 0;
		$scope.spinnerActive = true;


		$scope.showloginattr = 1;

		if (localStorageService.get('userdata') == null) {
			$scope.showloginattr = 0;
			$scope.sidemenu = false;
		}

		$scope.deleteevent = function (event_id) {
			if (confirm("Are you sure to delete?")) {
				$scope.spinnerActive = true;
				var DeleteUrl = 'apiv4/public/event/deleteEvent';
				var params = {
					eventid: event_id
				};
				RequestDetail.getDetail(DeleteUrl, params).then(function (result) {
					$scope.spinnerActive = false;
					alertService.add("success", "Event Deleted successfully.", 2000);

					$location.path('eventslist');
				});
			}
		}


		$scope.activetab = 0;

		$scope.changeactive = function (index) {
			$scope.activetab = index;
		};

		$scope.showModalpageinfo = false;

		$scope.openmodelpagehelp = function () {
			$scope.showModalpageinfo = !$scope.showModalpageinfo;
		}

		$scope.show_dashboard = function () {
			$location.path('dashboard');
		}


		$scope.add_unregistered_investor = function () {
			$scope.meeting.user.person_company_name = '';
			$scope.meeting.user.person_name = '';
			$scope.meeting.user.person_title = '';
			$scope.meeting.user.investor_mail = '';
			$scope.meeting.user.person_phone = '';
			$('#showInvestorModal').modal('show');
			$scope.showInvestorModal = true;

		}

		$scope.check_investors_popup = function () {

			if (angular.isUndefined($scope.meeting.user.person_company_name) || $scope.meeting.user.person_company_name == '' || $scope.meeting.user.person_company_name == null) {
				$('#person_company_name').focus();
				alertService.add("warning", "Enter Company name!", 2000);
				return false;

			}
			if (angular.isUndefined($scope.meeting.user.person_name) || $scope.meeting.user.person_name == '' || $scope.meeting.user.person_name == null) {
				$('#person_name').focus();
				alertService.add("warning", "Enter Investor name!", 2000);

				return false;
			}
			if (angular.isUndefined($scope.meeting.user.person_title) || $scope.meeting.user.person_title == '' || $scope.meeting.user.person_title == null) {
				$('#person_title').focus();
				alertService.add("warning", "Enter Investor title!", 2000);
				return false;
			}

			$scope.usertype = localStorageService.get('usertype');

			if (angular.isUndefined($scope.meeting.user.investor_mail) || $scope.meeting.user.investor_mail == '' || $scope.meeting.user.investor_mail == null) {
				$('#person_email').focus();

				alertService.add("warning", "Enter valid email id!", 2000);
				return false;
			}



			if (angular.isUndefined($scope.meeting.user.person_phone) || $scope.meeting.user.person_phone == '' || $scope.meeting.user.person_phone == null) {
				$('#person_phone').focus();
				alertService.add("warning", "Enter valid investor phone!", 2000);
				return false;
			}


			alertService.add("success", "Added successfully!", 2000);

			$('#pickInvestor_value').val($scope.meeting.user.person_company_name);
			$('#showInvestorModal').modal('hide');
			$scope.showInvestorModal = false;
		}
		// autocomplete of investor 

		$scope.searchInvestors = function (data) {
			if (angular.isDefined(data) && angular.isDefined(data.description) && angular.isDefined(data.description.user_id)) {
				$scope.meeting.user.user_id = data.description.user_id;
			}
		}

		// Close the model 

		$scope.cancel_investor_event = function () {
			$scope.init();
			$scope.showModal = !$scope.showModal;
		}

		// update investor event 

		$scope.update_investor_event = function () {


			if (!$scope.meeting.user.main_tab) {
				$('#city').attr('required', true);
				$('#city').focus();
				return false;
			} else if (!$scope.meeting.user.sub_tab) {
				alertService.add("warning", "Select time ", 2000);
				return false;
			} else if (!$scope.meeting.user.user_id && !$scope.meeting.user.investor_mail) {
				alertService.add("warning", "Select Investor ", 2000);
				return false;
			} else {
				$('.city').css('border-color', '#ccc');

				var tagUrl = 'apiv4/public/event/updateinvestor';
				var params = {
					data: $scope.meeting.user
				};
				$scope.spinnerActive = true;
				RequestDetail.getDetail(tagUrl, params).then(function (result) {
					$scope.spinnerActive = false;
					//if(result.data)
					//{
					alertService.add("success", "Metting scheduled successfully.", 2000);
					$scope.init();
					$scope.showModal = !$scope.showModal;
					//}
					//else
					//	{					
					//		alertService.add("warning", "Investor already selected !",2000);
					//	}

				});



			}





		}

		$scope.response = {};
		$scope.response.reason = 'Interested';
		$scope.showAddResponse = false;
		$scope.investerlist_id = 0;
		$scope.togglemodelAddResponse = function (investerlist_id) {
			$scope.showAddResponse = !$scope.showAddResponse;
			$scope.investerlist_id = investerlist_id;
		}

		$scope.add_event_response = function () {
			if ($scope.response.reason == 'Other') {
				if ($scope.response.ownreason == '') {
					alertService.add("warning", "Enter Your Reason!", 2000);
					return false;
				}
			}
			var responseUrl = 'apiv4/public/event/responseevent';
			var params = {
				investerlist_id: $scope.investerlist_id,
				eventid: $scope.eventid,
				response: $scope.response.reason,
				ownreason: $scope.response.ownreason
			};

			RequestDetail.getDetail(responseUrl, params).then(function (result) {
				$scope.showAddResponse = !$scope.showAddResponse;
				alertService.add("success", "Response added successfully.", 2000);
				$timeout(function () {
					$route.reload();
				}, 400);

			});
		}

		$scope.remove_validation = function (id) {
			$('#' + id).css('border', '1px solid #ccc');
		}


		//Resend Invitation
		$scope.resendInvite = function (investerlist_id) {
			if (confirm("Are you sure to resend email?")) {
				$scope.spinnerActive = true;
				var ResendUrl = 'apiv4/public/event/resendInvite';
				var params = {
					investerlist_id: investerlist_id,
					eventid: $scope.eventid
				};
				RequestDetail.getDetail(ResendUrl, params).then(function (result) {
					$scope.spinnerActive = false;
					alertService.add("success", "Invite Sent successfully.", 2000);
				});
			}
		}

		//ADDIN NEW INVITEE SECTION STARTS
		$scope.invitee = [];

		$scope.showAddEventInvitee = false;

		$scope.togglemodelAddEventInvitee = function () {
			$scope.showAddEventInvitee = !$scope.showAddEventInvitee;
		}

		$scope.add_event_invitee = function () {

			if (angular.isUndefined($scope.invitee.investor_company_name) || $scope.invitee.investor_company_name == '' || $scope.invitee.investor_company_name == null) {
				$('#investor_company_name').focus();
				alertService.add("warning", "Enter Company name!", 2000);
				return false;
			}

			if (angular.isUndefined($scope.invitee.investor_name) || $scope.invitee.investor_name == '' || $scope.invitee.investor_name == null) {
				$('#investor_name').focus();
				alertService.add("warning", "Enter Firstname!", 2000);
				return false;
			}

			if (angular.isUndefined($scope.invitee.investor_mail) || $scope.invitee.investor_mail == '' || $scope.invitee.investor_mail == null) {
				$('#person_email').focus();
				alertService.add("warning", "Enter valid email id!", 2000);
				return false;
			}

			if (angular.isUndefined($scope.invitee.investor_phone) || $scope.invitee.investor_phone == '' || $scope.invitee.investor_phone == null) {
				$('#investor_phone').focus();
				alertService.add("warning", "Enter valid phone no!", 2000);
				return false;
			}

			$scope.spinnerActive = true;
			var InviteeAddUrl = 'apiv4/public/event/addEventInvitee';
			var params = {
				investor_company_name: $scope.invitee.investor_company_name,
				email_id: $scope.invitee.investor_mail,
				investor_name: $scope.invitee.investor_name,
				investor_phone: $scope.invitee.investor_phone,
				eventid: $scope.eventid
			};
			RequestDetail.getDetail(InviteeAddUrl, params).then(function (result) {

				if (result.data) {
					var newval = new Object();
					newval.view_status = 0;
					newval.accept_status = 0;
					newval.investor_company_name = $scope.invitee.investor_company_name;
					newval.investor_name = $scope.invitee.investor_name;
					newval.email_id = $scope.invitee.investor_mail;
					newval.investor_phone = $scope.invitee.investor_phone;
					newval.investerlist_id = result.data;

					$scope.event_data.event_investerlist.push(newval);

					//$scope.resendInvite1(result.data);
				}

				$scope.spinnerActive = false;
			});

			// $scope.invitee.investor_company_name = ''; 
			// $scope.invitee.investor_name = ''; 
			// $scope.invitee.investor_mail ='';	
			// $scope.invitee.investor_phone ='';

			$scope.showAddEventInvitee = false;
			//alertService.add("warning", "Enter Broker phone!",2000);

		}

		$scope.investernamelistfun = function () {
			var tagUrl = 'apiv4/public/event/investernamelist';
			var params = {
				key: 'tags',
				id: $scope.eventid
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				$scope.investernamelist = {};
				$scope.investernamelist = result.data;

			});
		}

		$scope.investernamelistfun();
		$scope.event_data = {};
		$scope.schedule_data = {};
		$scope.eve_data = {};
		$scope.evedata_filter = [];
		$scope.clientdata.conf_filter = [];
		$scope.showwizard = "viewschedule";
		$scope.init = function () {

			$scope.event_data = {};
			$scope.eve_data = {};
			$scope.evedata_filter = [];
			$scope.clientdata.conf_filter = [];

			if (localStorageService.get('userdata') != null) {
				var user_data = localStorageService.get('userdata');
				$scope.user_id = user_data.user_id;
			} else {
				$scope.user_id = 0;
			}


			var thisuserbooked = true;
			var tagUrl = 'apiv4/public/event/geteventsbyid';
			var params = {
				key: 'tags',
				id: $scope.eventid
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {

				$scope.eve_data = result.data[0];
				$scope.signupfrm = '';
				$scope.signupfrm = $scope.eve_data.signupfrm;
				angular.forEach($scope.eve_data.timeslots, function (val, key) {
					angular.forEach(val.contents, function (valS, keyS) {



						if (localStorageService.get('userdata') != null) { //static page check
							var local = localStorageService.get('userdata');
							if (valS.invester == local.userId) {
								$scope.eve_data.timeslots[key].contents[keyS].sendrequest = true;
								$scope.disbledallreqbutton = false;
								$scope.booked = [];
								$scope.booked = valS;
								var thisuserbooked = false;
							}
						} else {
							$scope.eve_data.timeslots[key].contents[keyS].sendrequest = true;
							$scope.disbledallreqbutton = false;
							$scope.booked = [];
							$scope.booked = valS;
							var thisuserbooked = false;
						}



					});
				})

				if ($scope.eve_data.event_type == 'ndr' || $scope.eve_data.event_type == 'collaborated_ndr' || $scope.eve_data.event_type == 'dealRoadshow' || $scope.eve_data.event_type == 'investorServiceMeeting') {
					angular.forEach($scope.eve_data.timeslots, function (val, key) {
						$scope.eve_data.timeslots[key].contentsc = [];
						$scope.eve_data.timeslots[key].contentsn = [];
						var vvvc = 0;
						angular.forEach(val.contents, function (valS, keyS) {
							if (valS.invester) {
								$scope.eve_data.timeslots[key].contentsc[vvvc] = valS;
								vvvc++;
							}
						});
					})
					$scope.isNDR = true;
				} else if ($scope.eve_data.event_type == 'analystDay') {
					$scope.isAnalyst = true;
					$scope.eve_data.analystdayrec = [];
					$scope.eve_data.analystdayren = [];

					if (localStorageService.get('userdata') != null) { //static page check
						var local = localStorageService.get('userdata');
						$scope.user_type = local.user_type;
						if (angular.isDefined($scope.eve_data.analystday)) {
							angular.forEach($scope.eve_data.analystday, function (val, key) {
								if ($scope.user_type != 1) {
									if (angular.isDefined(val.status) && val.status != null && val.status == '1') {
										$scope.eve_data.analystdayrec.push(val);
									}
									if (angular.isDefined(val.status) && val.status != null && val.status == '2') {
										$scope.eve_data.analystdayren.push(val);
									}
								}
							});
						}
					} else {
						if (angular.isDefined($scope.eve_data.analystday)) {
							angular.forEach($scope.eve_data.analystday, function (val, key) {
								if (angular.isDefined(val.status) && val.status != null && val.status == '1') {
									$scope.eve_data.analystdayrec.push(val);
								}
								if (angular.isDefined(val.status) && val.status != null && val.status == '2') {
									$scope.eve_data.analystdayren.push(val);
								}
							});
						}

					}


				} else if ($scope.eve_data.event_type == 'conference' && angular.isDefined($scope.eve_data.conference_details)) {
					angular.forEach($scope.eve_data.conference_details, function (val, key) {
						if (val.room_no && val.room_no != '' || val.room_no != null || val.room_no != 'null') {
							val.avail_status = 'Y';
						} else {
							val.avail_status = 'N';
						}
						if (val.avail_status == 'N') {
							val.conf_order = 0;
						} else if (val.avail_status == 'Y') {
							if (angular.isDefined(val.interest) && val.interest != '') {
								val.conf_order = 2;
							} else {
								val.conf_order = 1;
							}
						}

						if ($scope.evedata_filter.length > 0) {
							var exist = false;
							angular.forEach($scope.evedata_filter, function (confil, conind) {
								if (confil == val.conf_order) {
									exist = true;
								}
							});
							if (!exist) {
								$scope.evedata_filter.push(val.conf_order);
							}
						} else {
							$scope.evedata_filter.push(val.conf_order);
						}
					});

					if (angular.isDefined($scope.eve_data.request_details)) {
						angular.forEach($scope.eve_data.request_details, function (requ, reqind) {
							angular.forEach($scope.eve_data.conference_details, function (val, key) {
								if (requ.conference_room_id == val.id) {
									val.conf_order = 2;

									if (requ.single_meeting && parseInt(requ.single_meeting) == 1) {
										val.interest = 'S';
										val.single_meeting = 1;
									}
									if (requ.group_meeting && parseInt(requ.group_meeting) == 1) {
										val.interest = 'M';
										val.multiple_meeting = 1;
									}
									if ($scope.evedata_filter.length > 0) {
										var exist = false;
										angular.forEach($scope.evedata_filter, function (confil, conind) {
											if (confil == val.conf_order) {
												exist = true;
											}
										});
										if (!exist) {
											$scope.evedata_filter.push(val.conf_order);
										}
									} else {
										$scope.evedata_filter.push(val.conf_order);
									}
								}
							});
						});
					}
				} else if ($scope.eve_data.event_type == 'fieldTrip') {
					$scope.isAnalyst = true;
					$scope.eve_data.analystdayrec = [];
					$scope.eve_data.analystdayren = [];

					if (localStorageService.get('userdata') != null) { //static page check
						var local = localStorageService.get('userdata');
						$scope.user_type = local.user_type;
					}


					angular.forEach($scope.eve_data.analystday, function (val, key) {
						if ($scope.user_type != 1) {
							if (val.status == '1') {
								$scope.eve_data.analystdayrec.push(val);
							}
							if (val.status == '2') {
								$scope.eve_data.analystdayren.push(val);
							}
						}
					});

				} else if ($scope.eve_data.event_type == 'earningsCallfollowup') {



					if ($scope.eve_data.check_earning_call == 'no') {

						$scope.eve_data.earncallrec = [];
						$scope.eve_data.earncallren = [];




						if (localStorageService.get('userdata') != null) { //static page check
							var local = localStorageService.get('userdata');
							$scope.user_type = local.user_type;
							angular.forEach($scope.eve_data.earncall, function (val, key) {

								if ($scope.user_type != 1) {
									if (val.status == '1') {
										$scope.eve_data.earncallrec.push(val);
									}
									if (val.status == '2') {
										$scope.eve_data.earncallren.push(val);
									}
								}
							});
						} else {
							angular.forEach($scope.eve_data.earncall, function (val, key) {
								if (val.status == '1') {
									$scope.eve_data.earncallrec.push(val);
								}
								if (val.status == '2') {
									$scope.eve_data.earncallren.push(val);
								}
							});
						}



					}

					$scope.isearningcall = true;
					$scope.localstg = '';

					if (localStorageService.get('userdata') != null) { //static page check
						var local = localStorageService.get('userdata');
						$scope.localstg = local.userId;
					}
					angular.forEach($scope.eve_data.earningcall, function (todo, key) {

						if (angular.isDefined(todo.earningcallschedule_id) && todo.earningcallschedule_id != '') {
							angular.forEach($scope.eve_data.available, function (earning, earnkey) {
								if (angular.isDefined(earning.timeslot_id) && earning.timeslot_id != '' && earning.timeslot_id == todo.earningcallschedule_id) {
									todo.available = true;
								}
							})
						}
					})
				}

				$scope.event_data = angular.copy($scope.eve_data);

				if (angular.isUndefined($scope.eve_data.request_details)) {
					// NEED TO EMPTY THE request_details VARIABLE
					$scope.event_data.request_details = [];
				}
				angular.forEach($scope.eve_data.request_details, function (evedata, eveval) {
					var j = 0;
					angular.forEach($scope.event_data.request_details, function (redata, raval) {
						if (angular.isDefined(redata.conference_id) && angular.isDefined(redata.corporate_id) && evedata.conference_id == redata.conference_id &&
							evedata.corporate_id == redata.corporate_id) {
							j = 1;
						}
					});
					if (j == 0) {
						$scope.event_data.request_details.push(evedata);
					}
				});
				$scope.signupfrm = $scope.event_data.signupfrm;
				if ($scope.event_data.acceptmsg && $scope.event_data.acceptmsg.length > 0) {
					$scope.textentered = false;
				}
				$scope.clientdata.conf_filter = angular.copy($scope.evedata_filter);
				$scope.spinnerActive = false;
			});

		}

		$scope.reset_request = function () {
			var allowed = true
			if (angular.isDefined($scope.event_data.conference_details) && $scope.event_data.conference_details.length > 0) {
				angular.forEach($scope.event_data.conference_details, function (todo, key) {
					if ((todo.single_meeting && todo.single_meeting == '1') || (todo.multiple_meeting && todo.multiple_meeting == '1')) {
						allowed = false;
					}
				})
				if (!allowed) {
					$scope.spinnerActive = true;
					var url = 'apiv4/public/event/delete_request';
					var params = {
						type: 'put',
						reqdata: angular.copy($scope.event_data.conference_details)
					};
					RequestDetail.getDetail(url, params).then(function (result) {
						if (result.data == 0) {
							$scope.spinnerActive = false;
							$location.path('/dashboard');
							alertService.add("success", "Requset sent successfully!", 2000);
						}
					});
				} else {
					alertService.add("warning", "First you have join the event!", 2000);
					return false;
				}
			}
		}

		$scope.schedulewizard = function () {
			var tagUrl = 'apiv4/public/event/scheduleeventsbyid';
			var params = {
				key: 'tags',
				id: $scope.eventid
			};
			$scope.showwizard = "allocateschedule";
			$scope.schedule_data = {};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				if (angular.isDefined(result.data) && result.data.length > 0) {
					$scope.schedule_data = result.data;
				}
				$scope.spinnerActive = false;
			});
		}

		$scope.save_request = function () {
			var allowed = false;
			if (angular.isDefined($scope.event_data.conference_details) && $scope.event_data.conference_details.length > 0) {
				angular.forEach($scope.event_data.conference_details, function (todo, key) {
					if ((todo.single_meeting && todo.single_meeting == '1') || (todo.multiple_meeting && todo.multiple_meeting == '1')) {
						allowed = true;
					}
				})
				if (allowed && $scope.eventchange) {
					$scope.spinnerActive = true;
					var url = 'apiv4/public/event/save_request';
					var params = {
						type: 'put',
						reqdata: angular.copy($scope.event_data.conference_details)
					};
					RequestDetail.getDetail(url, params).then(function (result) {
						if (result.data == 0) {
							$scope.spinnerActive = false;
							$location.path('/dashboard');
							alertService.add("success", "Request sent successfully!", 2000);
						}
					});
				} else {
					$scope.spinnerActive = false;
					alertService.add("warning", "Kindly select at-least one if the interest!", 2000);
					return false;
				}
			}
		}
		$scope.eventchange = false;
		//$scope.meeting_interest=function(conference,type,sel_option=true){
		// https://stackoverflow.com/questions/37152347/i-am-getting-error-syntaxerror-expected-token-in-safari-5-1-7 - default value not working in Safari	
		$scope.meeting_interest = function (conference, type, sel_option) {
			if (sel_option) {
				if (type == 'single') {
					conference.interest = 'S';
					conference.conf_order = 2;
					conference.single_meeting = 1;
					conference.multiple_meeting = 0;
				} else if (type == 'multiple') {
					conference.interest = 'M';
					conference.conf_order = 2;
					conference.multiple_meeting = 1;
					conference.single_meeting = 0;
				}
			} else {
				if (type == 'single') {
					conference.interest = '';
					conference.conf_order = 0;
					conference.single_meeting = 0;
				} else if (type == 'multiple') {
					conference.interest = '';
					conference.conf_order = 0;
					conference.multiple_meeting = 0;
				}
			}
			$scope.eventchange = true;
			if ($scope.clientdata.conf_filter.length > 0) {
				var exist = false;
				angular.forEach($scope.clientdata.conf_filter, function (confil, conind) {
					if (confil == conference.conf_order) {
						exist = true;
					}
				});
				if (!exist) {
					$scope.clientdata.conf_filter.push(conference.conf_order);
				}
			} else {
				$scope.clientdata.conf_filter.push(conference.conf_order);
			}
		}

		$scope.remove_earning_call_after_confirm = function (id, meettype) {
			if (angular.isDefined(meettype) && meettype != '') {
				var tagUrl = 'apiv4/public/event/remove_earning_call_after_confirm2';
				var params = {
					id: id,
					eid: $scope.eventid
				};
				RequestDetail.getDetail(tagUrl, params).then(function (result) {
					if (result.data) {
						$scope.init();
					}
				});
			} else {
				var tagUrl = 'apiv4/public/event/remove_earning_call_after_confirm';
				var params = {
					id: id,
					eid: $scope.eventid
				};
				RequestDetail.getDetail(tagUrl, params).then(function (result) {
					if (result.data) {
						$scope.init();
					}
				});
			}

		}



		$scope.remove_earning_call_schedule = function (id) {

			var tagUrl = 'apiv4/public/event/remove_earningcall';
			var params = {
				id: id,
				eid: $scope.eventid
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				if (result.data) {
					$scope.init();
				}
			});

		}


		$scope.hide_modal = function () {
			$scope.earn_showModal = false;
		}
		$scope.earncalljoin = function (id) {



			if (id == 2 || id == 4) {

				$scope.spinnerActive = true;
				var tagUrl = 'apiv4/public/event/earncalljoin';
				var params = {
					key: 'tags',
					eid: $scope.eventid,
					meettype: $scope.meettype,
					msg: id
				};
				RequestDetail.getDetail(tagUrl, params).then(function (result) {
					if (result.data == 0) {
						$scope.spinnerActive = false;
						$route.reload();
						alertService.add("success", "Your Request send successfully", 2000);
					}
				});


			} else {



				angular.forEach($scope.event_data.earningcall, function (val, key) {
					if (!val.join) {
						val.join = 'no';
					}
				})

				if (!$scope.event_data.bestnumber && $scope.event_data.check_earning_call == 'yes') {
					alertService.add("warning", "Enter best number to call ", 2000);
					$('#bestnumber').attr('required', true);
					$('#bestnumber').focus();
					return false;
				} else {
					$scope.spinnerActive = true;
					var tagUrl = 'apiv4/public/event/responseearncall';
					var params = {
						key: 'tags',
						id: id,
						data: $scope.event_data
					};
					RequestDetail.getDetail(tagUrl, params).then(function (result) {
						if (result.data == '0') {
							$scope.spinnerActive = false;
							$scope.init();
						}
					});
				}
			}
		}
		$scope.addinv = function () {
			$scope.spinnerActive = true;
			var tagUrl = 'apiv4/public/event/addinv';
			var params = {
				key: 'tags',
				data: $scope.event_data.timeslots
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				if (result.data == 0) {
					$scope.showModal = !$scope.showModal;
					$scope.spinnerActive = false;
					$scope.init();
				}
			});
		}
		$scope.earningcallmodel = function (uid) {
			$scope.event_data.user_type = '';
			var tagUrl = 'apiv4/public/event/getmybookingdates';
			var params = {
				key: 'tags',
				uid: uid,
				eid: $scope.eventid
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {

				$scope.innermodel = {};
				$scope.innermodel = result.data;
				angular.forEach(result.data, function (data) {
					$scope.event_data.user_type = data.user_type;
				});

				$scope.showModalearningcall = !$scope.showModalearningcall;
			});

		}
		$scope.cancelbooking = function (ids) {
			$scope.spinnerActive = true;
			var tagUrl = 'apiv4/public/event/cancelbooking';
			var params = {
				key: 'tags',
				eid: ids
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				if (result.data == 0) {
					$scope.spinnerActive = false;
					$scope.init();
				}
			});
		}

		$scope.cancelbooking2 = function (ids) {
			$scope.spinnerActive = true;
			var tagUrl = 'apiv4/public/event/cancelbooking2';
			var params = {
				key: 'tags',
				eid: ids
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				if (result.data == 0) {
					$scope.spinnerActive = false;
					$scope.init();
				}
			});
		}
		$scope.chooseearntime = function () {

			if (!$scope.event_data.choose) {
				alertService.add("warning", "kindly choose Anyone available time", 2000);
				return true;
			} else {
				var tagUrl = 'apiv4/public/event/bookingearntime';
				var params = {
					key: 'tags',
					tid: $scope.event_data.choose,
					user_type: $scope.event_data.user_type,
					meettype: $scope.event_data.meettype
				};
				RequestDetail.getDetail(tagUrl, params).then(function (result) {
					if (result.data == 0) {
						alertService.add("success", "selected time for Confirmed.", 2000);
						$scope.showModalearningcall = !$scope.showModalearningcall;
						$scope.init();
					}
				});
			}
		}
		$scope.chooseearnmodelclose = function () {
			$scope.showModalearningcall = !$scope.showModalearningcall;
		}

		//Change 

		$scope.choose_time = function () {
			$scope.meeting.sub_data = [];

			angular.forEach($scope.event_data.timeslots, function (todo, key) {
				if ($scope.meeting.user.main_tab == todo.event_timeslot_id) {
					$scope.meeting.sub_data = todo.contents;
				}
			})
		}


		$scope.reset = function () {
			$scope.investernamelist = {};
		};


		$scope.popupchooseinv = function () {

			$scope.investernamelistfun();
			$scope.meeting.user = {};
			$scope.showModal = !$scope.showModal;
			$scope.$broadcast('angucomplete-alt:clearInput');
		}

		$scope.toggleModal_field = function (event_id) {
			$scope.event_id = event_id;

			$scope.show_fieldmodal = !$scope.show_fieldmodal;
			$scope.popupMsgTitle = 'Please fill the reason';
			$scope.reasonshow = true;
			$scope.reason = {};
		}

		$scope.toggleModal = function () {
			/*
	if($scope.showModal){$scope.showModal = false;}
	if(!$scope.showModal){$scope.showModal = true;}

	if($scope.reasonshow){$scope.reasonshow = false;}
	if(!$scope.reasonshow){$scope.reasonshow = true;}
*/
			$scope.showModal = !$scope.showModal;
			$scope.reasonshow = true;

			$scope.popupMsgTitle = 'Please fill the reason';

			$scope.reason = {};
		}
		$scope.broker_toggleModal = function () {
			$scope.broker_showModal = !$scope.broker_showModal;
			$scope.popupMsgTitle = 'Please fill the reason';
			$scope.reasonshow = !$scope.reasonshow;
			$scope.reason = {};
		}
		$scope.submitnothanku_field = function (id) {

			$scope.spinnerActive = true;
			var tagUrl = 'apiv4/public/event/nothanku_field';
			var params = {
				key: 'tags',
				eid: $scope.eventid,
				msg: id
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				if (result.data == 0) {
					$scope.spinnerActive = false;
					$scope.showModal = false;
					$scope.broker_showModal = false;
					$scope.show_fieldmodal = false;
					$location.path('/dashboard');
					alertService.add("success", "Your Request send successfully", 2000);
				}
			});

		}
		$scope.submitnothanku = function () {
			$scope.spinnerActive = true;
			var tagUrl = 'apiv4/public/event/nothanku';
			var params = {
				key: 'tags',
				eid: $scope.eventid,
				msg: $scope.reason
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				if (result.data == 0) {
					// $scope.analystjoin('2');
					$location.path('/dashboard');
					$scope.showModal = false;
					$scope.broker_showModal = false;
				}
			});



		}
		$scope.toggleModal_earn = function () {
			$scope.earn_showModal = true;
			$scope.popupMsgTitle = 'Please fill the reason';
			$scope.reasonshow = true;
			$scope.reason = {};
		}
		$scope.nothankuopt = function () {
			$scope.showModal = false;
		}
		$scope.nothankuopt1 = function () {
			$scope.broker_showModal = false;
			$scope.reasonshow = false;
		}
		$scope.earn_nothankyou = function () {
			$scope.spinnerActive = true;
			$scope.earncalljoin('2');
			$scope.earn_showModal = false;

		}
		$scope.analystjoin = function (id) {
			$scope.spinnerActive = true;
			var tagUrl = 'apiv4/public/event/analystjoin';
			var params = {
				key: 'tags',
				eid: $scope.eventid,
				msg: id
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				if (result.data == 0) {
					$scope.spinnerActive = false;
					$route.reload();
					alertService.add("success", "Your Request send successfully", 2000);
				}
			});
		}

		$scope.fieldtripjoin = function (id) {




			$scope.spinnerActive = true;
			var tagUrl = 'apiv4/public/event/fieldtripjoin';
			var params = {
				key: 'tags',
				eid: $scope.eventid,
				msg: id
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				if (result.data == 0) {
					$scope.spinnerActive = false;
					$route.reload();
					alertService.add("success", "Your Request send successfully", 2000);
				}
			});
		}
		$scope.cancelmybooking = function () {
			$scope.cancelreason = !$scope.cancelreason;
		}
		$scope.cancelmessage = function () {
			if (!$scope.data.cancel) {
				alertService.add("warning", "Enter reason for cancel", 2000);
				$('#cancelmessage').attr('required', true);
				$('#cancelmessage').focus();
				return false;

			} else {
				var tagUrl = 'apiv4/public/event/canceleventreason';
				var params = {
					key: 'tags',
					eid: $scope.eventid,
					msg: $scope.data.cancel
				};
				RequestDetail.getDetail(tagUrl, params).then(function (result) {
					if (result.data == 0) {
						// $route.reload();
						$location.path('/dashboard');
					}
				});
			}

		}
		$scope.data.selected_time = '';
		$scope.submitmessage = function () {


			if (angular.isUndefined($scope.data.selected_time) || $scope.data.selected_time == '') {
				alertService.add("warning", "Select any time to request ", 2000);
				return false
			}
			// return false;
			var tagUrl = 'apiv4/public/event/requestmessage';
			var params = {
				key: 'tags',
				msg: $scope.data.messages,
				eid: $scope.eventid,
				time_id: $scope.data.selected_time
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				if (result.data == 0) {
					$scope.textentered = false;
					$scope.init();
				}
			});
		}

		$scope.event_acceptdecline = function (id, eid) {
			var tagUrl = 'apiv4/public/event/event_acceptdecline';
			var params = {
				key: 'tags',
				msg: id,
				eid: eid
			};
			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				if (result.data == 0) {
					$scope.init();
				}
			});
		}
		$scope.init();
		$scope.data = [];
		$scope.onbooked = function (id) {

			$('.btn-btn-blue').removeClass('green');
			$('#req' + id).addClass('green');
			$scope.data.selected_time = id;
			return false;
		}
		
		$scope.editevent = function (id) {
			$location.path('eventresponseview/edit/' + id);
		}


	})
	.controller('scheduleEventCtrl', function ($scope, $http, $location, $route, $routeParams, RequestDetail, localStorageService, alertService, configdetails) {
		$scope.configdetails = configdetails;
		$scope.pageHeading = 'Events';
		$scope.dasboardActive = 'active';
		$scope.eventData = {};
		$scope.selected = {};
		$scope.selected.invester_id = '';
		$scope.selected.invester_name = '';
		$scope.eventData.investordetails = [];
		$scope.eventData.conferencedetails = [];
		$scope.eventData.corporatedetails = [];
		$scope.eventData.investor_list = [];
		$scope.eventId = $routeParams.eventId;
		$scope.viewpage = 'addinvestor';
		var avail_date = [];
		var avail_corporate = [];
		$scope.remainingusers = {};

		$scope.currentcoporate = '';
		$scope.currentcoporatedate = '';
		$scope.dragindex = '';
		$scope.dropindex = '';
		$scope.pending = '';

		$scope.select_invester = function (selected) {
			$scope.selected.invester_id = '';
			$scope.selected.invester_name = '';
			if (angular.isDefined(selected) && angular.isDefined(selected.originalObject) && angular.isDefined(selected.originalObject.invester_id) &&
				angular.isDefined(selected.originalObject.invester_name) && selected.originalObject.invester_id != '' && selected.originalObject.invester_name != '') {
				$scope.selected.invester_id = selected.originalObject.invester_id;
				$scope.selected.invester_name = selected.originalObject.invester_name;
			}
		}
		$scope.addInvestor = function () {
			if (angular.isDefined($scope.selected.invester_id) && angular.isDefined($scope.selected.invester_name) && $scope.selected.invester_id != '' &&
				$scope.selected.invester_name != '') {
				var i = 0;
				var obj = new Object();
				obj.invester_id = angular.copy($scope.selected.invester_id);
				obj.invester_name = angular.copy($scope.selected.invester_name);
				obj.position = $scope.eventData.investordetails.length + 1;
				angular.forEach($scope.eventData.investordetails, function (invex, index) {
					if (angular.isDefined(invex.invester_id) && invex.invester_id == $scope.selected.invester_id) {
						i = 1;
					}
				});
				if (i == 0) {
					$scope.eventData.investordetails.push(obj);
					var objs = {};
					angular.forEach($scope.eventData.corporatedetails, function (cde, cind) {
						if (angular.isDefined(cde.corporate_id)) {
							angular.forEach($scope.eventData.conference_request, function (data, index) {
								if (angular.isDefined(data.id) && data.id != '' && angular.isDefined(data.corporate_id) && data.corporate_id == cde.corporate_id) {
									objs = angular.copy(data);
									objs.id = '';
									objs.requester_id = angular.copy($scope.selected.invester_id);
									objs.invester_name = angular.copy($scope.selected.invester_name);
								}
							});
						}
						if (angular.isDefined(objs.corporate_id)) {
							$scope.eventData.conference_request.push(objs);
						}
					})

				} else {
					alertService.add("warning", "Investor you seleceted is already exist !", 2000);
					return false;
				}
				$scope.selected.invester_id = '';
				$scope.selected.invester_name = '';
				$scope.$broadcast('angucomplete-alt:clearInput');
			}
		}

		$scope.onDragSuccess = function (data, evt, currentdata, rowdata, pending) {
			$scope.dragindex = '';
			$scope.currentcoporate = '';
			$scope.currentcoporatedate = '';

			if (angular.isUndefined(pending)) {
				pending = '';
			}

			$scope.pending = '';
			if (pending != '') {
				$scope.pending = pending;
				angular.forEach($scope.remainingusers, function (remva, remin) {
					if (remin == pending) {
						$scope.dragindex = remin;

					}
				});

			} else {
				$scope.dragindex = $scope.eventData.conferencedetails.indexOf(rowdata);
			}


			if (angular.isDefined(data) && $scope.dragindex >= 0 && data != null && angular.isDefined(data.invester_id) && angular.isDefined(data.corporate_id)) {
				if (pending != '' && angular.isDefined(data) && angular.isDefined(data.corporate_id) && data.corporate_id != '' &&
					angular.isDefined(data.invester_id) && data.invester_id != '') {
					$scope.currentcoporate = data.corporate_id;
				} else {
					angular.forEach($scope.eventData.conferencedetails[$scope.dragindex], function (dat, ind) {
						if (parseInt(ind) > 0) {
							if (dat.room_id == currentdata.room_id && angular.isDefined(dat.investors) && dat.investors.length > 0) {
								angular.forEach(dat.investors, function (dt, ins) {
									if (dt.invester_id == data.invester_id && dt.corporate_id == data.corporate_id) {
										$scope.currentcoporate = data.corporate_id;
										$scope.currentcoporatedate = $scope.eventData.conferencedetails[$scope.dragindex].conference_date;
									}
								});
							}
						}
					})
				}
			}
		}

		$scope.onDropComplete = function (data, evt, currentdata, rowdata) {

			$scope.dropindex = '';
			$scope.dropindex = $scope.eventData.conferencedetails.indexOf(rowdata);
			if ($scope.currentcoporate != '' && ($scope.pending != '' || $scope.currentcoporatedate != '') && angular.isDefined(data.invester_id) &&
				angular.isDefined(currentdata.investors) &&
				currentdata.investors.length < 3) {
				var allow = false;
				angular.forEach($scope.eventData.conference_request, function (reqval, reqind) {
					if (reqval.requester_id == data.invester_id && reqval.corporate_id == currentdata.corporate_id) {
						allow = true;
					}
				});
				if (!allow) {
					angular.forEach($scope.eventData.investordetails, function (invval, invind) {
						if (invval.invester_id == data.invester_id) {
							allow = true;
						}
					});
				}
				if ($scope.pending != '') {
					if (angular.isDefined(data) && angular.isDefined(currentdata) && angular.isDefined(data.corporate_id) && angular.isDefined(currentdata.corporate_id) &&
						data.corporate_id != currentdata.corporate_id) {
						allow = false;
					}
					if (allow) {
						angular.forEach(rowdata, function (rowval, rowind) {
							if (angular.isDefined(rowval.investors) && rowval.investors.length > 0) {
								angular.forEach(rowval.investors, function (invedetail, invedetval) {
									if (invedetail.invester_id == data.invester_id && allow) {
										allow = false;
									}
								});
							}
						});
					}
				} else {
					angular.forEach(rowdata, function (rowval, rowind) {
						if (angular.isDefined(rowval.investors) && rowval.investors.length > 0 && rowind != data.corporate_id) {
							angular.forEach(rowval.investors, function (invedetail, invedetval) {
								if (invedetail.invester_id == data.invester_id && allow) {
									allow = false;
								}
							});
						}
					});
				}
				if (allow) {
					var corporateid = '';
					var conference_date = '';
					var access = true;

					angular.forEach($scope.eventData.conferencedetails, function (checkconf, chkval) {
						if (chkval != $scope.dropindex && access) {
							angular.forEach(checkconf, function (chkinv, chkinvval) {
								if (angular.isDefined(chkinv.investors) && chkinv.investors.length > 0 && currentdata.corporate_id != data.corporate_id && currentdata.corporate_id == chkinvval && access) {
									angular.forEach(chkinv.investors, function (invdetail, invdetval) {
										if (invdetail.invester_id == data.invester_id) {
											access = false;
										}
									});
								}
							});
						}
					})

					if (access) {

						if (angular.isDefined(currentdata.corporate_id) && angular.isDefined(currentdata.investors) && currentdata.investors.length < 3) {
							data.corporate_id = currentdata.corporate_id;
							currentdata.investors.push(data);
							if ($scope.pending != '') {
								angular.forEach($scope.remainingusers[$scope.pending], function (rmv, rmi) {
									if (angular.isDefined(rmv.corporate_id) && angular.isDefined(rmv.invester_id) && rmv.corporate_id == data.corporate_id &&
										rmv.invester_id == data.invester_id) {
										$scope.remainingusers[$scope.pending].splice(rmi, 1);
									}
								});
							} else {
								angular.forEach($scope.eventData.conferencedetails[$scope.dragindex], function (dragdata, dragind) {
									if (dragind == $scope.currentcoporate && angular.isDefined(dragdata.investors) && dragdata.investors.length > 0) {
										angular.forEach(dragdata.investors, function (drdat, drval) {
											if (angular.isDefined(drdat.corporate_id) && drdat.corporate_id == data.corporate_id && drdat.invester_id == data.invester_id) {
												$scope.eventData.conferencedetails[$scope.dragindex][dragind].investors.splice(drval, 1);
											}
										});
									}
								});
							}
						}
					}
				}
			}
		}


		$scope.init = function () {
			$scope.eventData = {};
			$scope.eventData.investordetails = [];
			$scope.eventData.conferencedetails = [];
			$scope.eventData.corporatedetails = [];
			$scope.eventData.conference_request = [];
			$scope.eventData.investor_list = [];
			avail_date = [];
			avail_corporate = [];
			var tagUrl = 'apiv4/public/event/scheduleeventsbyid';
			var params = {
				key: 'tags',
				id: $scope.eventId
			};
			$scope.spinnerActive = true;

			RequestDetail.getDetail(tagUrl, params).then(function (result) {
				if (angular.isDefined(result.data)) {
					if (angular.isDefined(result.data.investor_list) && result.data.investor_list.length > 0) {
						angular.forEach(result.data.investor_list, function (invlist, listind) {
							if (angular.isDefined(invlist.user_id) && angular.isDefined(invlist.invester_name)) {
								var obj = new Object();
								obj.invester_id = invlist.user_id;
								obj.invester_name = invlist.invester_name;
								$scope.eventData.investor_list.push(obj);
							}
						});
					}
					if (angular.isDefined(result.data.investors) && result.data.investors.length > 0) {
						angular.forEach(result.data.investors, function (inv, ind) {
							if (angular.isDefined(inv.requester_id)) {
								var i = 0;
								var obj = new Object();
								obj.invester_id = inv.requester_id
								obj.invester_name = inv.invester_name;
								obj.position = $scope.eventData.investordetails.length + 1;
								angular.forEach($scope.eventData.investordetails, function (invex, index) {
									if (angular.isDefined(invex.invester_id) && invex.invester_id == inv.requester_id) {
										i = 1;
									}
								});
								if (i == 0) {
									$scope.eventData.investordetails.push(obj);
								}
							}
						});
					}
					if (angular.isDefined(result.data.conference_request) && result.data.conference_request.length > 0) {
						angular.forEach(result.data.conference_request, function (conf, confval) {
							$scope.eventData.conference_request.push(conf);
						});
					}
					if (angular.isDefined(result.data.corporate_details) && result.data.corporate_details.length > 0) {
						angular.forEach(result.data.corporate_details, function (conf, confval) {
							$scope.eventData.corporatedetails.push(conf);
						});
					}
					if (angular.isDefined(result.data.conference_details) && result.data.conference_details.length > 0) {
						var conferencedate = [];
						angular.forEach(result.data.conference_details, function (cdval, cdind) {
							var i = 0;
							angular.forEach(conferencedate, function (val, index) {
								if (val == cdval.conference_date) {
									i = 1;
								}
							})
							if (i == 0) {
								conferencedate.push(cdval.conference_date);
							}
						});
						angular.forEach(conferencedate, function (dt, dtval) {
							var obj = new Object();
							obj.conference_date = dt;
							angular.forEach($scope.eventData.corporatedetails, function (conf, confval) {
								angular.forEach(result.data.conference_details, function (cdval, cdind) {
									if (cdval.conference_date == dt && conf.corporate_id == cdval.corporate_id) {
										obj[cdval.corporate_id] = {};
										obj[cdval.corporate_id].status = cdval.conference_status;
										obj[cdval.corporate_id].room_id = cdval.room_id;
										obj[cdval.corporate_id].time_id = cdval.id;
									}
								})

							});
							if (angular.isDefined(obj.conference_date)) {
								$scope.eventData.conferencedetails.push(obj);
							}
						});
					}

				}
			})
			$scope.spinnerActive = false;
		}
		$scope.init();
		$scope.setCurrentpage = function (page) {
			$scope.viewpage = page;
			if (page == 'investorschedule') {

				if ($scope.eventData.conferencedetails.length > 0) {
					avail_date = [];
					avail_corporate = [];
					var totcount = 0;
					angular.forEach($scope.eventData.corporatedetails, function (corp, corpind) {

						angular.forEach($scope.eventData.conferencedetails, function (confdt, confdtval) {

							if (confdt[corp.corporate_id].status == 'Y' || confdt[corp.corporate_id].status == 'M') {

								if (!angular.isDefined(confdt[corp.corporate_id].investors)) {
									confdt[corp.corporate_id].investors = [];
								}
								angular.forEach($scope.eventData.investordetails, function (invdeta, invind) {
									var req_inv = 0
									angular.forEach($scope.eventData.conference_request, function (reqval, reqind) {
										if (corp.corporate_id == reqval.corporate_id) {
											var i = 0;
											angular.forEach(avail_corporate, function (avcorporate, avind) {
												if (avcorporate.corporate_id == corp.corporate_id && invdeta.invester_id == avcorporate.invester_id) {
													i++;
												}
											});
											angular.forEach(avail_date, function (avdt, avdtind) {
												if (avdt.date == confdt.conference_date && invdeta.invester_id == avdt.invester_id) {
													i++;
												}
											});
											if (reqval.requester_id == invdeta.invester_id) {
												req_inv = 1;
											}
											if (reqval.requester_id == invdeta.invester_id && reqval.corporate_id == corp.corporate_id && i == 0) {
												var j = 0;
												if (confdt[corp.corporate_id].status == 'Y' && confdt[corp.corporate_id].investors.length == 0) {
													j = 1;
													var invob = new Object();
													invob.corporate_id = corp.corporate_id;
													invob.invester_id = invdeta.invester_id;
													invob.invester_name = invdeta.invester_name;
													totcount = totcount + 1;
													confdt[corp.corporate_id].totcount = totcount;

													confdt[corp.corporate_id].investors.push(invob);
													confdt[corp.corporate_id].corporate_id = corp.corporate_id;
												} else if (confdt[corp.corporate_id].status == 'M' && confdt[corp.corporate_id].investors.length < 3) {
													j = 1;
													var invob = new Object();
													invob.corporate_id = corp.corporate_id;
													invob.invester_id = invdeta.invester_id;
													invob.invester_name = invdeta.invester_name;
													confdt[corp.corporate_id].investors.push(invob);
													confdt[corp.corporate_id].corporate_id = corp.corporate_id;
												}
												if (j == 1) {
													var dobj = new Object();
													dobj.date = confdt.conference_date;
													dobj.invester_id = invdeta.invester_id;
													// dobj.conference_details_id=reqval.conference_details_id;
													avail_date.push(dobj);
													var cobj = new Object();
													cobj.corporate_id = corp.corporate_id;
													cobj.invester_id = invdeta.invester_id;
													avail_corporate.push(cobj);
												}

											}
										}
									});
									if (req_inv == 0) {
										if (angular.isDefined(invdeta.invester_id)) {
											var i = 0;
											angular.forEach(avail_corporate, function (avcorporate, avind) {
												if (avcorporate.corporate_id == corp.corporate_id && invdeta.invester_id == avcorporate.invester_id) {
													i++;
												}
											});
											angular.forEach(avail_date, function (avdt, avdtind) {
												if (avdt.date == confdt.conference_date && invdeta.invester_id == avdt.invester_id) {
													i++;
												}
											});
											if (i == 0) {
												var j = 0;
												if (confdt[corp.corporate_id].status == 'Y' && confdt[corp.corporate_id].investors.length == 0) {
													j = 1;
													var invob = new Object();
													invob.corporate_id = corp.corporate_id;
													invob.invester_id = invdeta.invester_id;
													invob.invester_name = invdeta.invester_name;
													totcount = totcount + 1;
													confdt[corp.corporate_id].totcount = totcount;

													confdt[corp.corporate_id].investors.push(invob);
													confdt[corp.corporate_id].corporate_id = corp.corporate_id;
												} else if (confdt[corp.corporate_id].status == 'M' && confdt[corp.corporate_id].investors.length < 3) {
													j = 1;
													var invob = new Object();
													invob.corporate_id = corp.corporate_id;
													invob.invester_id = invdeta.invester_id;
													invob.invester_name = invdeta.invester_name;
													confdt[corp.corporate_id].investors.push(invob);
													confdt[corp.corporate_id].corporate_id = corp.corporate_id;
												}
												if (j == 1) {
													var dobj = new Object();
													dobj.date = confdt.conference_date;
													dobj.invester_id = invdeta.invester_id;
													// dobj.conference_details_id=reqval.conference_details_id;
													avail_date.push(dobj);
													var cobj = new Object();
													cobj.corporate_id = corp.corporate_id;
													cobj.invester_id = invdeta.invester_id;
													cobj.invester_name = invdeta.invester_name;
													avail_corporate.push(cobj);
												}
											}

										}
									}
								});

								if (!angular.isDefined(confdt[corp.corporate_id].corporate_id)) {
									confdt[corp.corporate_id].corporate_id = corp.corporate_id;
								}
							}
						});
					});
					angular.forEach($scope.eventData.conference_request, function (reqval, reqind) {
						var existdat = 0;
						var investorname = '';
						angular.forEach($scope.eventData.conferencedetails, function (conferencedata, conferenceval) {
							angular.forEach(conferencedata, function (codat, coval) {
								if (angular.isDefined(codat.corporate_id) && codat.corporate_id == reqval.corporate_id && angular.isDefined(codat.investors) &&
									codat.investors.length > 0) {

									angular.forEach(codat.investors, function (invest, investval) {
										if (angular.isDefined(invest.invester_id) && invest.invester_id == reqval.requester_id) {
											existdat = 1;

										}

									});
								}
							});

						});
						if (existdat == 0 && angular.isDefined(reqval.invester_name) && reqval.invester_name != '') {
							var checklist = 0;
							angular.forEach($scope.remainingusers, function (remu, remval) {
								if (remval == reqval.corporate_id) {
									checklist = 1;
									angular.forEach(remu, function (remdata, remv) {
										if (remdata.corporate_id == reqval.corporate_id && remdata.invester_id == reqval.requester_id) {
											checklist = 2;
										}
									});
								}
							});
							var obj = new Object();
							obj.corporate_id = reqval.corporate_id;
							obj.invester_id = reqval.requester_id;
							obj.invester_name = reqval.invester_name;
							if (checklist == 0) {
								$scope.remainingusers[reqval.corporate_id] = [];
								$scope.remainingusers[reqval.corporate_id].push(obj);
							} else if (checklist == 1) {
								$scope.remainingusers[reqval.corporate_id].push(obj);
							}

						}

					});

					angular.forEach($scope.eventData.investordetails, function (invdeta, invind) {
						angular.forEach($scope.eventData.corporatedetails, function (corp, corpind) {
							var existdat = 0;
							var investorname = '';
							angular.forEach($scope.eventData.conferencedetails, function (conferencedata, conferenceval) {
								angular.forEach(conferencedata, function (codat, coval) {
									if (angular.isDefined(codat.corporate_id) && codat.corporate_id == corp.corporate_id && angular.isDefined(codat.investors) &&
										codat.investors.length > 0) {

										angular.forEach(codat.investors, function (invest, investval) {
											if (angular.isDefined(invest.invester_id) && invest.invester_id == invdeta.invester_id) {
												existdat = 1;

											}

										});
									}
								});

							});
							if (existdat == 0 && angular.isDefined(invdeta.invester_name) && invdeta.invester_name != '') {
								var checklist = 0;
								angular.forEach($scope.remainingusers, function (remu, remval) {
									if (remval == corp.corporate_id) {
										checklist = 1;
										angular.forEach(remu, function (remdata, remv) {
											if (remdata.corporate_id == corp.corporate_id && remdata.invester_id == invdeta.invester_id) {
												checklist = 2;
											}
										});
									}
								});
								var obj = new Object();
								obj.corporate_id = corp.corporate_id;
								obj.invester_id = invdeta.invester_id;
								obj.invester_name = invdeta.invester_name;
								if (checklist == 0) {
									$scope.remainingusers[corp.corporate_id] = [];
									$scope.remainingusers[corp.corporate_id].push(obj);
								} else if (checklist == 1) {
									$scope.remainingusers[corp.corporate_id].push(obj);
								}

							}
						});

					});

				}
			}

		}
		$scope.saveSchedule = function () {
			var conference = [];
			angular.forEach($scope.eventData.conferencedetails, function (cdval, cdind) {
				angular.forEach($scope.eventData.corporatedetails, function (corp, corpind) {
					if (angular.isDefined(cdval[corp.corporate_id]) && angular.isDefined(cdval[corp.corporate_id].time_id) && cdval[corp.corporate_id].time_id != '' &&
						angular.isDefined(cdval[corp.corporate_id].investors) && cdval[corp.corporate_id].investors.length > 0) {
						var obj = new Object();
						obj.time_id = cdval[corp.corporate_id].time_id;
						obj.investors = cdval[corp.corporate_id].investors;
						conference.push(obj);
					}
				});
			});
			if (conference.length > 0) {
				$scope.spinnerActive = true;
				var tagUrl = 'apiv4/public/event/saveScheduleevent';
				var objs = new Object();
				objs.conferenceDetail = $scope.eventData.corporatedetails;
				objs.conference = conference;
				var params = objs;
				RequestDetail.getDetail(tagUrl, params).then(function (result) {
					$scope.spinnerActive = false;
					$location.path('/dashboard');
					alertService.add("success", "Conference schedule has been successfully created !", 2000);
					return false;
				});
			}
		}

	})

	.controller('liveeventResponseCtrl', function ($scope, $http, $location, $route, $routeParams, RequestDetail, localStorageService, alertService, configdetails) {
		$scope.configdetails = configdetails;
		$scope.pageHeading = 'Events';
		$scope.dasboardActive = 'active';

		$scope.eventId = $routeParams.eventId;
		var tagUrl = 'apiv4/public/event/geteventsbyid';
		var params = {
			key: 'liveevent',
			id: $scope.eventId
		};
		$scope.show_dashboard = function () {
			$location.path('dashboard');
		}
		RequestDetail.getDetail(tagUrl, params).then(function (result) {
			if (angular.isDefined(result.data) && angular.isDefined(result.data.event_id)) {
				$scope.event_data = angular.copy(result.data);
			}
		});

	})
	.controller('eventResponseCtrl', function ($scope, $http, $location, configdetails) {
		$scope.configdetails = configdetails;
		$scope.pageHeading = 'Events';
		$scope.dasboardActive = 'active';
	})
	.controller('eventCollaboratedNDR', function ($scope, $http, $location, configdetails) {
		$scope.configdetails = configdetails;
		$scope.cdata.event_type = 'collaborated_ndr';

	})
	.controller('eventNDR', function ($scope, $http, $location, configdetails) {
		$scope.configdetails = configdetails;
		$scope.cdata.event_type = 'ndr';

	})
	.controller('eventPostEarnings', function ($scope, $http, $location, configdetails) {
		$scope.configdetails = configdetails;
		$scope.cdata.event_type = 'post_earnings';

	})
	.controller('eventAnalystDay', function ($scope, $http, $location, configdetails) {
		$scope.configdetails = configdetails;
		$scope.cdata.event_type = 'analystDay';

	})
	.controller('eventEarningsCall', function ($scope, $http, $location, configdetails) {
		$scope.configdetails = configdetails;
		$scope.cdata.event_type = 'earningsCall';

	})
	.controller('eventsearningcallfollowup', function ($scope, $http, $location, configdetails) {
		$scope.configdetails = configdetails;
		$scope.cdata.event_type = 'earningsCallfollowup';

	})
	.controller('eventDealRoadshow', function ($scope, $http, $location, configdetails) {
		$scope.configdetails = configdetails;
		$scope.cdata.event_type = 'dealRoadshow';

	})
	.controller('eventConference', function ($scope, $http, $location, configdetails) {
		$scope.configdetails = configdetails;
		$scope.cdata.event_type = 'conference';

	})
	.controller('eventFieldTrip', function ($scope, $http, $location, localStorageService, configdetails) {
		$scope.configdetails = configdetails;
		$scope.cdata.event_type = 'fieldTrip';
		var local = localStorageService.get('userdata');
		$scope.cdata.broker = local.user_id; // setting broker id 
		$scope.cdata.broker_name = local.firstname + ' ' + local.lastname; // setting broker name

	})
	.controller('investorServiceMeeting', function ($scope, $http, $location, localStorageService, configdetails) {
		$scope.configdetails = configdetails;
		var local = localStorageService.get('userdata');

		$scope.cdata.event_type = 'investorServiceMeeting'; //seting type 
		$scope.cdata.broker = local.user_id; // setting broker id 
		$scope.cdata.broker_name = local.company_name; // setting broker name

	})
	.controller('eventlistCtrl', function ($scope, $http, $location, localStorageService, configdetails, RequestDetail, $route, alertService) {

		var user_data = localStorageService.get('userdata');
		$scope.user_id = user_data.user_id;
		$scope.spinnerActive = true;

		$scope.showModalpageinfo = false;



		$scope.openmodelpagehelp = function () {
			$scope.showModalpageinfo = !$scope.showModalpageinfo;
		}

		var profile_contacts = 'apiv4/public/event/eventlist';
		var params = {
			key: 'contacts',
			user_id: $scope.user_id
		}

		//get events
		RequestDetail.getDetail(profile_contacts, params).then(function (result) {

			if (angular.isDefined(result.data)) {
				var events = result.data;

				$scope.eventlist = events;
				var user_data = localStorageService.get('userdata');
				$scope.user_id = user_data.user_id;

			}
			$scope.spinnerActive = false;
		});

		//delete events
		$scope.deleteevent = function (event_id) {
			if (confirm("Are you sure to delete?")) {
				$scope.spinnerActive = true;
				var DeleteUrl = 'apiv4/public/event/deleteEvent';
				var params = {
					eventid: event_id
				};
				RequestDetail.getDetail(DeleteUrl, params).then(function (result) {
					$scope.spinnerActive = false;
					alertService.add("success", "Event Deleted successfully.", 2000);

					$route.reload();
				});
			}
		}

	})