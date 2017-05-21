angular.module('track-lib').factory('trackService', ['$resource','env', function ($resource,env) {

    return $resource(env + 'tracks/:id', {id: '@id'});
}]);

angular.module('track-lib').factory('trackParamsService', ['$resource','env', function ($resource,env) {

    return $resource(env + 'tracks?:id', {id: '@id'});
}]);
