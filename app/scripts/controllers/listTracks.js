angular.module('track-lib').controller('listTracks',function($scope , $resource , env , $http){
  $scope.displayMode = "list";
  $scope.tracks = null;
  $scope.page = 1;

  $scope.allTracks = $resource(env + "tracks?page=:page", { page: "@page" });

  $scope.listTracks = function () {
      $scope.tracks = $scope.allTracks.get({page : $scope.page });
      $scope.page = $scope.page + 1;
      console.log($scope.tracks)
  };

  $scope.listTracks(); 


});
