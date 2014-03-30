'use strict';

describe('LiveSearch unit tests', function() {
    var scope, liveSearch, _window, q, element, timeout;

    beforeEach(module('LiveSearch'));

    beforeEach(inject(function($rootScope, $compile, $q, $timeout) {
        scope = $rootScope;
        q = $q;
        timeout = $timeout;
        _window = {
            alert: function(msg) {}
        };

        scope.mySearchCallback = function () {
            var defer = $q.defer();
            defer.resolve([
                { city: "nailuva", state: "ce", country: "fiji"},
                { city: "suva", state: "ce", country: "fiji"}
            ]);
            return defer.promise;
        };

        element = angular.element('<div><live-search id="search1" type="text" live-search-callback="mySearchCallback" live-search-display-property="city" live-search-item-template="{{result.city}}<strong>{{result.state}}</strong><b>{{result.country}}</b>" live-search-select="fullName" ng-model="search1" ></live-search></div>');
        $compile(element)(scope);
        scope.$digest();
    }));

    afterEach(function() {
        angular.element(document.body).empty();
    });

    it('should replace live-search tag by input', function() {
        expect(element.find("input").length).toBe(1);
    });

    it('should add key handlers to the input element', function() {
        var input = element.find("input")[0];
        //debugger;
        expect(input.onkeydown).toBeDefined();
        expect(input.onkeyup).toBeDefined();
    });

    it('should add <ul> tag for results', function() {
        expect(angular.element(document).find("ul").length).toBe(1);
    });

    it('should call calback with search entry', function() {

        var input = angular.element(element.find("input")[0]);
        var defer = q.defer();
        spyOn(scope, "mySearchCallback").andReturn(defer.promise);
        defer.resolve([]);
        //debugger;
        input.val("fiji");
        scope.$apply(function() {
            input[0].onkeyup({keyCode : "any"});
        });

        timeout.flush();

        expect(scope.mySearchCallback).toHaveBeenCalledWith({ query: input.val() });
    });

    it('should have as many results as items in the search result', function() {
        var input = angular.element(element.find("input")[0]);
        //debugger;
        input.val("fiji");
        scope.$apply(function() {
            input[0].onkeyup({keyCode : "any"});
        });

        timeout.flush();

        expect(angular.element(document).find("ul").children().length).toBe(2);
    });

    it('should select first element when keydown', function() {
        var input = angular.element(element.find("input")[0]);
        var ul = angular.element(document.body).find("ul")[0];
        ul = angular.element(ul);
        //debugger;
        input.val("fiji");
        input[0].onkeyup({keyCode : "any"});
        timeout.flush();
        input[0].onkeydown({keyCode : 40});
        expect(angular.element(ul.find("li")[0]).hasClass("selected")).toBe(true);
    });

    it('should select last element when keyup', function() {
        var input = angular.element(element.find("input")[0]);
        //debugger;
        input.val("fiji");
        input[0].onkeyup({keyCode : "any"});
        timeout.flush();
        var li = angular.element(document.body).find("li");
        input[0].onkeydown({keyCode : 38});
        console.log(li[1].outerHTML);
        expect(angular.element(li[0]).hasClass("selected")).toBe(true);
    });
});