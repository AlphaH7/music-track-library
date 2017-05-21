var app = angular.module('track-lib',['ngMaterial','jkAngularRatingStars','ui.router','ngResource']);

app.config(["$stateProvider", "$mdThemingProvider", "$httpProvider", "$urlRouterProvider", function($stateProvider, $mdThemingProvider, $httpProvider, $urlRouterProvider){
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

}]);
app.constant('env','http://104.197.128.152:8000/v1/');
app.controller('appCtrl',['$scope','$http','env','$state',function(s,http,env,state){

}]);

angular.module('track-lib').controller('tracks', ["$scope", "trackService", "trackParamsService", "$resource", "env", "$http", "$mdToast", function($scope, trackService, trackParamsService, $resource, env, $http, $mdToast) {
    $scope.isOpen = false;
    $scope.getTracks = null;
    $scope.readOnly = true;
    $scope.clearResults = false;

    $scope.addrating = function(rating) {
        $scope.s.rating = rating;
    };
    $scope.addTrackrating = function(rating) {
        $scope.b.rating = rating;
    };

    $scope.editTrack = function(a) {
        $scope.editBtn = false;
        $scope.b = a;
        $scope.b.rating = null;
        console.log($scope.b)
    };

    $scope.Alltracks = function(c) {
        $scope.tracks = null;
        $scope.getTracks = trackService.get(function() {
            $scope.tracks = $scope.getTracks.results;
            console.log($scope.tracks);
            $scope.clearResults = false;
            $scope.addBtn = true;
            $scope.editBtn = true;
            $scope.search = true;
        });
        console.log($scope.getTracks);
    };

    $scope.Alltracks();

    $scope.movePage = function(d) {
        $scope.nextLink = $resource(d);
        $scope.getTracks = $scope.nextLink.get(
            function() {
                $scope.tracks = $scope.getTracks.results;
                console.log($scope.tracks);
                $scope.clearResults = false;
            }
        );
        console.log($scope.tracks)
    };


    $scope.postTrack = function(d) {
        console.log('input:', d)
        x = new trackService;
        angular.extend(x, d);
        x.$save(function(response) {
            console.log('response:', response)
            $scope.tracks = [response];
            $scope.clearResults = true;
        });
    };

    $scope.searchTrack = function(d) {
        if ($scope.query == true) {
            x = new trackService;
            angular.extend(x, d);
            x.$get(function(response) {
                console.log('response:', response);
                if (response.detail == "Not found.") {
                    console.log('nf')
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent("Track not found.")
                        .position('top right')
                        .hideDelay(3000)
                    );
                } else if (response.$resolved) {
                    $scope.tracks = [response];
                    $scope.clearResults = true;
                } else {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent("Something went wrong. Plz check and try again.")
                        .position('top right')
                        .hideDelay(3000)
                    );
                };
            });
        } else if ($scope.query == false) {
            x = new trackParamsService;
            angular.extend(x, d);
            x.id = "title=" + d.id;
            x.$get(function(response) {
                console.log('response:', response);
                if (response.results.length == 0) {
                    console.log('nf')
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent("Track not found.")
                        .position('top right')
                        .hideDelay(3000)
                    );
                } else if (response.$resolved) {
                    $scope.tracks = response.results;
                    $scope.clearResults = true;
                };
            });
        }

    };


}]);

angular.module('track-lib').controller('genres', ["$scope", "genreService", "$resource", "env", "$http", "$mdToast", function($scope, genreService, $resource, env, $http, $mdToast) {
    $scope.displayMode = "list";
    $scope.getGenre = null;
    $scope.clearResults = false;

    $scope.editGenre = function(a) {
        $scope.editBtn = false;
        $scope.b = a;
        console.log($scope.b)
    };

    $scope.Allgenre = function(c) {
        $scope.genres = null;
        $scope.getGenre = genreService.get(function() {
            $scope.genres = $scope.getGenre.results;
            console.log($scope.genres);
            $scope.clearResults = false;
            $scope.addBtn = true;
            $scope.editBtn = true;
            $scope.search = true;
        });
        console.log($scope.getGenre);
    };

    $scope.Allgenre();

    $scope.movePage = function(d) {
        $scope.nextLink = $resource(d);
        $scope.getGenre = $scope.nextLink.get(
            function() {
                $scope.genres = $scope.getGenre.results;
                console.log($scope.genres);
                $scope.clearResults = false;
            }
        );
        console.log($scope.genres)
    };


    $scope.postGenre = function(d) {
        console.log('input:', d)
        x = new genreService;
        angular.extend(x, d);
        x.$save(function(response) {
            console.log('response:', response)
            $scope.genres = [response];
            $scope.clearResults = true;
            $scope.b = null;
        });
    };

    $scope.searchGenre = function(d) {
        x = new genreService;
        angular.extend(x, d);
        x.$get(function(response) {
            console.log('response:', response);
            if (response.detail == "Not found.") {
                console.log('nf')
                $mdToast.show(
                    $mdToast.simple()
                    .textContent("Genre not found.")
                    .position('top right')
                    .hideDelay(3000)
                );
            } else if (response.$resolved) {
                $scope.genres = [response];
                $scope.clearResults = true;
            } else {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent("Something went wrong. Plz check and try again.")
                    .position('top right')
                    .hideDelay(3000)
                );
            };
        });
    };

}]);

angular.module('track-lib').factory('trackService', ['$resource','env', function ($resource,env) {

    return $resource(env + 'tracks/:id', {id: '@id'});
}]);

angular.module('track-lib').factory('trackParamsService', ['$resource','env', function ($resource,env) {

    return $resource(env + 'tracks?:id', {id: '@id'});
}]);

angular.module('track-lib').factory('genreService', ['$resource','env', function ($resource,env) {

    return $resource(env + 'genres/:id', {id: '@id'});
}]);

!function(){"use strict";angular.module("jkAngularRatingStars",["jkAngularRatingStars.templates"])}(),function(){"use strict";function RatingStarsController($scope,$attrs,$timeout){var that=this;void 0===that.readOnly&&(that.readOnly=!1),that.initStarsArray=function(){that.starsArray=that.getStarsArray(),that.validateStars()},that.getStarsArray=function(){for(var starsArray=[],index=0;index<that.maxRating;index++){var starItem={index:index,"class":"star-off"};starsArray.push(starItem)}return starsArray},that.setRating=function(rating){that.readOnly||(that.rating=rating,that.validateStars(that.rating),$timeout(function(){that.onRating({rating:that.rating}),$scope.$apply()}))},that.setMouseOverRating=function(rating){that.readOnly||that.validateStars(rating)},that.validateStars=function(rating){if(that.starsArray&&0!==that.starsArray.length)for(var index=0;index<that.starsArray.length;index++){var starItem=that.starsArray[index];rating-1>=index?starItem["class"]="star-on":starItem["class"]="star-off"}}}angular.module("jkAngularRatingStars").controller("RatingStarsController",["$scope","$attrs","$timeout",RatingStarsController])}(),function(){"use strict";function RatingStarsDirective(){function link(scope,element,attrs,ctrl){(!attrs.maxRating||parseInt(attrs.maxRating)<=0)&&(attrs.maxRating="5"),scope.$watch("ctrl.maxRating",function(oldVal,newVal){ctrl.initStarsArray()}),scope.$watch("ctrl.rating",function(oldVal,newVal){ctrl.validateStars(ctrl.rating)})}return{restrict:"E",replace:!0,templateUrl:"rating-stars-directive.html",scope:{},controller:"RatingStarsController",controllerAs:"ctrl",bindToController:{maxRating:"@?",rating:"=?",readOnly:"=?",onRating:"&"},link:link}}angular.module("jkAngularRatingStars").directive("jkRatingStars",[RatingStarsDirective])}(),function(){angular.module("jkAngularRatingStars.templates",[]).run(["$templateCache",function($templateCache){$templateCache.put("rating-stars-directive.html",'<div\n  class="jk-rating-stars-container"\n  layout="row" >\n\n  <a\n    class="button"\n    ng-click="ctrl.setRating(0)"\n    ng-if="!ctrl.readOnly" >\n \n  </a>\n\n  <a\n    class="button star-button"\n    ng-class="item.class"\n    ng-mouseover="ctrl.setMouseOverRating($index + 1)"\n    ng-mouseleave="ctrl.setMouseOverRating(ctrl.rating)"\n    ng-click="ctrl.setRating($index + 1)"\n    ng-repeat="item in ctrl.starsArray" >\n    <i class="material-icons">star</i>\n  </a>\n\n</div>\n')}])}();

angular.module('track-lib').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/app.html',
    "<section ng-controller=\"appCtrl\" layout=\"row\" layout-align=\"start stretch\" class=\"full-height\"> <md-sidenav class=\"md-sidenav-left\" md-component-id=\"left\" md-is-locked-open=\"$mdMedia('gt-md')\" md-whiteframe=\"4\"> <md-toolbar layout=\"column\" layout-align=\"center center\" class=\"md-hue-1\"> <div layout=\"row\" layout-align=\"center center\"><img class=\"logo\" src=\"../images/logo.png\"><h1 class=\"md-toolbar-tools\">A-List</h1></div> </md-toolbar> <md-card class=\"profile-image-bg\"> <md-card-title layout=\"column\" layout-align=\"center center\"> <div><img class=\"profile-circle\" ng-src=\"{{profile.profile_pic}}\"></div> <md-card-title-text> <span class=\"white-text md-headline\">{{profile.username}}</span> </md-card-title-text> </md-card-title> </md-card> <md-content layout-padding> <md-menu-item> <md-button ng-click=\"toggleMenu()\" href=\"/#/app/dashboard\"> <md-icon md-font-icon=\"mdi mdi-account-circle mdi-24px\"></md-icon><span md-menu-align-target>My Profile</span></md-button> </md-menu-item> <md-menu-item> <md-button ng-click=\"toggleMenu()\" href=\"/#/app/payments\"> <md-icon md-font-icon=\"mdi mdi-cash-usd mdi-24px\"></md-icon><span md-menu-align-target>Payments</span></md-button> </md-menu-item> <md-menu-item> <md-button ng-click=\"toggleMenu()\" href=\"/#/app/change_password\"> <md-icon md-font-icon=\"mdi mdi-key-variant mdi-24px\"></md-icon><span md-menu-align-target>Change Password</span></md-button> </md-menu-item> <md-menu-item> <md-button ng-click=\"toggleMenu()\" href=\"/#/app/faq\"> <md-icon md-font-icon=\"mdi mdi-comment-question-outline mdi-24px\"></md-icon><span md-menu-align-target>FAQ</span></md-button> </md-menu-item> </md-content> <footer> <p>© 2017 A-List Chat. <br> All rights reserved.</p> </footer> </md-sidenav> <md-content layout=\"column\" layout-align=\"start stretch\" flex> <md-toolbar class=\"md-hue-1\"> <div class=\"md-toolbar-tools\"> <md-button hide-gt-md class=\"md-icon-button\" aria-label=\"side-nav\" ng-click=\"toggleMenu()\"> <md-icon md-font-icon=\"mdi mdi-menu mdi-24px\"></md-icon> </md-button> <h2 hide-gt-md flex md-truncate>A-List</h2> <span flex></span> <md-button href=\"/#\" ng-click=\"logout()\" aria-label=\"More\"> <md-icon md-font-icon=\"mdi mdi-logout mdi-24px\"></md-icon>logout </md-button> </div> </md-toolbar> <div ui-view flex class=\"view\"></div> </md-content> </section>"
  );

}]);
