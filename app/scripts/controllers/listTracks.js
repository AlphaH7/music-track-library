angular.module('track-lib').controller('tracks', function($scope, trackService, trackParamsService, $resource, env, $http, $mdToast) {
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


});
