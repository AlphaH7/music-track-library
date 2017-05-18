var app = angular.module('track-lib',['ngMaterial','ui.router','ngResource']);

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
      //abstract: 'true'
    })
    .state('app.dashboard',{
      url:'/dashboard',
      templateUrl: 'modules/home/home.html',
    })
    .state('app.listTracks',{
      url:'/tracks',
      templateUrl: 'modules/tracks/tracks.html',
      controller: 'listTracks',
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
    '800': '#bbd4e7',
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
app.controller('appCtrl',['$scope','$http','$mdDialog','env','$state',function(s,http,dialog,env,state,){

}]);
