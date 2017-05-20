angular.module('track-lib').controller('list',function($scope ,trackService , $resource , env , $http, $mdToast){
  $scope.displayMode = "list";
  $scope.getTracks = null;
  $scope.readOnly = true;
  $scope.clearResults = false;

  $scope.Alltracks = function(c){
    $scope.getTracks = trackService.get(function(){
      $scope.tracks = $scope.getTracks.results;
      console.log($scope.tracks);
      $scope.clearResults = false;
    });
  };

  $scope.Alltracks();

  $scope.nextPage = function (d) {
      $scope.nextLink = $resource(d);
      $scope.tracks = $scope.nextLink.get();
      console.log($scope.tracks)
  };

  $scope.postTrack = function (d) {
    x  =  new trackService;
    angular.extend(x, d);
    x.$save(function(response) {
    console.log('response:', response)
    $scope.tracks = [response];
  });
  };

  $scope.searchTrack = function (d) {
    if($scope.query == true){
      x  =  new trackService;
      angular.extend(x, d);
      x.$get(function(response) {
      console.log('response:', response);
      if(response.$resolved){
        $scope.tracks = [response];
        $scope.clearResults = true;
      }else if(!response.$resolved){
        $mdToast.show(
          $mdToast.simple()
            .textContent('Something went wrong. Plz try again.')
            .position('top right')
            .hideDelay(3000)
        );
      }
      });
    }
  };

});
