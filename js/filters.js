'use strict';

/* Filters */

angular.module('myApp.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  }])
  .filter('addhttp', function () {
    return function (addhttp) {
      if (!addhttp) { 
           return ''; 
      }
      var value = addhttp.toString().trim()
      if(!value.match(/^http/) && !value.match(/^https/)){
        value = "http://"+value;
      }
        // if (!preg_match("~^(?:f|ht)tps?://~i", addhttp)) {
        //     addhttp = "http://" . addhttp;
        // }
        return value;
    }
})
.filter('unsafe', ['$sce', function ($sce) {
  return function (val) {
      return $sce.trustAsHtml(val);
  };
}])
.filter('locate',function(){
  return function(input,start){
    if(input && input != null){
      var sp = input.split('|');
      input = sp[0]+'|'+sp[1]+'</br>'+sp[2]+'|'+sp[3];
      return input;
    }
  }
})
.filter('startFrom', function () {
    return function (input, start) {
        if (!input || !input.length) { return; }
        start = +start; //parse to int
        return input.slice(start);
    }
}).filter('endcommaremove', function () {
    return function (input, start) {
      if(input){
        var finchar = input[input.length-1];
        if(finchar != ','){
          return input+',';
        }        
        else{
          return input;
        }
      }
    }
})
.filter('filterbydate',function(){
  return function(input,start){
    var retArray = [];
    angular.forEach(input, function(obj){
      if(obj.event_type == 'ndr' || obj.event_type == 'dealRoadshow')
      {
        var sr = obj.date123+' 23:59:59';
        if(sr.indexOf('-') == 4 && new Date(sr) >= new Date()){
            retArray.push(obj); 
        }
        else if(sr.indexOf('-') == 16){
          sr = sr.split(' - ');sr[0] = sr[0]+' 23:59:59';sr[1] = sr[1]+' 23:59:59';
          if(new Date(sr[0]) > new Date() || new Date(sr[1]) >= new Date()){
            retArray.push(obj);   
          }
        }
      }
      else
      {
        var sr = obj.date+' 23:59:59';
        if(new Date(sr) >= new Date()){;
          retArray.push(obj); 
        }
      }
    });
    return retArray;
  }
})
.filter('currentdate',function() {
    return function(input, start) {
      // //console.log(start);//console.log(input);
    };
})
.filter('phoneformat', function () {
    return function (phoneformat) {
        if (!phoneformat) { 
            return ''; 
        }
        phoneformat=phoneformat+'';
        var value = phoneformat.trim().replace(/^\+/, '');
        if (value.match(/[^0-9]/)) {
            return phoneformat;
        }
        var country, city, number;
        switch (value.length) {
            case 10: 
              country = value.slice(0, 3);
              city = value.slice(3, 6);
              number = value.slice(6);
              break;

            case 11: 
              country = value[0];
              city = value.slice(1, 4);
              number = value.slice(4);
              break;

            case 12: 
              country = value.slice(0, 2);
              city = value.slice(2, 5);
              number = value.slice(5);
              break;

            default:
                return phoneformat;
        }
        if (country == 1) {
            //country = "";
        }
        
        //number = number.slice(0, 3) + '-' + number.slice(3);
        return country +'-'+ city+"-"+number;
    };
})
.filter('extension', function() {
    return function(input) {
      return input.split('.').pop()
    };
})
.filter('titleCase', function() {
    return function(input) {
      input = input || '';
      return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };
}).filter('FilterDisplayRecommendation', function() {
    return function(input) {
      input = input || '';
   if(input == 'decrement')
    return 'selling';
   if(input == 'increment')
    return 'buyin';
      return input;
    };
}).filter('dateRange', function() {
  return function( items, fromDate, toDate ) {
      var filtered = [];
      //here you will have your desired input
      //console.log(fromDate, toDate);
      var from_date = Date.parse(fromDate);
      var to_date = Date.parse(toDate);
      angular.forEach(items, function(item) {
          if(item.completed_date > from_date && item.completed_date < to_date) {
              filtered.push(item);
          }
      });
      return filtered;
  };
}).filter('sectorindustry', function() {
  return function( induestries,sectors ) {

    var newarray = [];
   
     angular.forEach(sectors.sectors, function(item) {
        angular.forEach(induestries, function(cat) {
          if(item==cat.sectore){
            newarray.push(cat.name);
          }  
        });
     });

     return newarray;
      
  };
});