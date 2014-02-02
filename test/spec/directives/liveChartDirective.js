'use strict';

describe('Directive: liveChartDirective', function () {
  beforeEach(module('appApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<live-chart-directive></live-chart-directive>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the liveChartDirective directive');
  }));
});
