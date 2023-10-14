'use strict';

/* Filters */

angular.module('myApp.constants', ['BotDetectCaptcha']).
  constant('configdetails', {
        //base_url: 'http://localhost/introact_new/',
        //base_url: 'http://demo.creativebees.in/introact/',
        base_url: 'https://www.intro-act.com/',
    })
    .config(function(captchaSettingsProvider) {
      captchaSettingsProvider.setSettings({
        captchaEndpoint: 
          'https://www.intro-act.com/captcha/botdetect-captcha-lib/simple-botdetect.php'
      });
    });