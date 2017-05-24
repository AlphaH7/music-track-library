
angular.module('track-lib').directive('effect', function($window) {


  return {

    restrict: 'AE',
    link: function(s, e, a) {

      $window.onresize = function(event) {
        var clientWidth = document.documentElement.clientWidth;


        if (clientWidth < 960)

        {
          e.removeClass('box-one')
        } else {
          e.removeClass('stuff-to-show')
        }
      }


    }


  }

})
