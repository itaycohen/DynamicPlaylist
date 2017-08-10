angular
    .module('dpAppUtils', [])
    .factory('dpAppUtils', dpAppUtils);

dpAppUtils.$inject = ["$mdMedia"];

function dpAppUtils($mdMedia) {

    var service = {
        isMobile: isMobile,
        isSmartphone: isSmartphone,
        isDesktop: isDesktop
    };
    return service;

    //////////

    function isSmartphone() {
        return $mdMedia('max-width: 375px');
    }

    function isMobile() {
        return $mdMedia('max-width: 1024px');
    }

    function isDesktop() {
        return $mdMedia('min-width: 960px');
    }


}

