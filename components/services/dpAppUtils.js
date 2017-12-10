angular
    .module('dpAppUtils', [])
    .factory('dpAppUtils', dpAppUtils);

dpAppUtils.$inject = ["$mdMedia"];

function dpAppUtils($mdMedia) {

    var service = {
        isMobile: isMobile,
        isDesktop: isDesktop
    };
    return service;

    //////////

    function isMobile() {
        return !isDesktop();
    }

    function isDesktop() {
        return $mdMedia('min-width: 1024px') && window.innerWidth > window.innerHeight;
    }


}

