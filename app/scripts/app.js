var app = angular.module('track-lib',['ngMaterial','jkAngularRatingStars','ui.router','ngResource']);

app.config(function($stateProvider, $mdThemingProvider, $httpProvider, $urlRouterProvider){
    $httpProvider.interceptors.push(function(){
      var stack = 0, loader = jQuery('.loader');
      return{
        request: function(r){
          stack++;
          loader.show(0);
          return r;
        },
        response: function(r){ stack--; if(stack===0){ loader.hide(0); } return r;},
        requestError: function(r){ stack--; if(stack===0){ loader.hide(0); } return r;},
        responseError: function(r){ stack--; if(stack===0){ loader.hide(0); } return r;}/**/
      }
    });

    $stateProvider
    .state('app',{
      url:'/app',
      templateUrl: 'modules/app.html',
      controller: 'appCtrl'
      //abstract: 'true'
    })
    .state('app.dashboard',{
      url:'/dashboard',
      templateUrl: 'modules/home/home.html',
    })
    .state('app.tracks',{
      url:'/tracks',
      templateUrl: 'modules/list/list.html',
      controller: 'tracks',
    })
    .state('app.genres',{
      url:'/genres',
      templateUrl: 'modules/genres/genres.html',
      controller: 'genres',
    });
    $urlRouterProvider.when('','app/dashboard');

  $mdThemingProvider.definePalette('track-lib', {
    '50': '#31658b',
    '100': '#38739e',
    '200': '#3f81b1',
    '300': '#4b8dbf',
    '400': '#5d99c6',
    '500': '#70a5cc',
    '600': '#96bdda',
    '700': '#a9c9e0',
    '800': '#31648b',
    '900': '#cee0ee',
    'A100': '#96bdda',
    'A200': '#83b1d3',
    'A400': '#70a5cc',
    'A700': '#e1ecf4',
    'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                        // on this palette should be dark or light

    'contrastDarkColors': ['50', '100', '200', '600', '400', 'A100'],
    'contrastLightColors': undefined    // could also specify this if default was 'dark'
  });
  $mdThemingProvider.theme('default')
    .primaryPalette('track-lib');

});
app.constant('env','http://104.197.128.152:8000/v1/');
app.controller('appCtrl',['$scope','$http','env','$state',function(s,http,env,state){
  s.isOpen = false;

    s.demo = {
      isOpen: false,
      count: 0,
      selectedDirection: 'right'
    };
}]);
