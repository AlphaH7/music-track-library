angular.module('track-lib').factory('trackService', ['$resource','env', function ($resource,env) {

    return $resource(env + 'tracks/:id', {id: '@id'});
}]);
