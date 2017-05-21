angular.module('track-lib').controller('genres',function($scope,genreService,$resource,env,$http,$mdToast){
  $scope.displayMode = "list";
  $scope.getGenre = null;
  $scope.clearResults = false;

  $scope.editGenre = function(a){
    $scope.editBtn = false;
    $scope.b = a;
    console.log($scope.b)
  };

  $scope.Allgenre = function(c){
    $scope.genres = null;
    $scope.getGenre = genreService.get(function(){
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

  $scope.movePage = function (d) {
      $scope.nextLink = $resource(d);
      $scope.getGenre = $scope.nextLink.get(
        function(){
          $scope.genres = $scope.getGenre.results;
          console.log($scope.genres);
          $scope.clearResults = false;
        }
      );
      console.log($scope.genres)
  };


  $scope.postGenre = function (d) {
    console.log('input:', d)
    x  =  new genreService;
    angular.extend(x, d);
    x.$save(function(response) {
    console.log('response:', response)
    $scope.genres = [response];
    $scope.clearResults = true;
    $scope.b = null;
  });
  };

  $scope.searchGenre = function (d) {
      x  =  new genreService;
      angular.extend(x, d);
      x.$get(function(response) {
      console.log('response:', response);
      if(response.detail == "Not found."){
        console.log('nf')
        $mdToast.show(
          $mdToast.simple()
            .textContent("Genre not found.")
            .position('top right')
            .hideDelay(3000)
        );
      }else  if(response.$resolved){
        $scope.genres = [response];
        $scope.clearResults = true;
      }else {
        $mdToast.show(
          $mdToast.simple()
            .textContent("Something went wrong. Plz check and try again.")
            .position('top right')
            .hideDelay(3000)
        );
      };
      });
    };

});
