angular.module('track-lib').factory('genreService', ['$resource','env', function ($resource,env) {

    return $resource(env + 'genres/:id', {id: '@id'});
}]);
