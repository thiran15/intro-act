'use strict';

/* Filters */

angular.module('myApp.constants', ['BotDetectCaptcha']).
  constant('configdetails', {
        base_url: 'http://localhost/introact_new/',
        //base_url: 'http://demo.creativebees.in/introact/',
    })
    .config(function(captchaSettingsProvider) {
      captchaSettingsProvider.setSettings({
        captchaEndpoint: 
          'http://localhost/introact_v3/captcha/botdetect-captcha-lib/simple-botdetect.php'
      });
    });