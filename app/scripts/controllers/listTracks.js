angular.module('track-lib').controller('list',function($scope , $resource , env , $http){
  $scope.displayMode = "list";
  $scope.tracks = null;

  $scope.list = function (arg) {
      $scope.arg = arg;
      $scope.allTracks = $resource(env + arg);
      $scope.tracks = $scope.allTracks.get();
      console.log($scope.tracks)
  };

  $scope.nextPage = function (d) {
      $scope.nextLink = $resource(d);
      $scope.tracks = $scope.nextLink.get();
      console.log($scope.tracks)
  };


});
