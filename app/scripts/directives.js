'use strict';

/* Directives */

var fadeToggleDirective = function() {
  return {
    link: function(scope, element, attrs) {
      console.log('fadeToggleDirective');
      scope.$watch(attrs.uiFadeToggle, function(val, oldVal) {
        if (val === oldVal) return; // Skip inital call
        // console.log('change');
        element[val ? 'fadeIn' : 'fadeOut'](1000);
      });
    }
  }
}


angular.module('app.directives', []).
directive('appVersion', ['version',
  function(version) {
    console.log("app.directives appVersion");
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }
]).
directive('ngDsFade', function() {
  return function(scope, element, attrs) {
    console.log("ngDsFade");
    element.css('display', 'none');
    scope.$watch(attrs.ngDsFade, function(value) {
      if (value) {
        element.fadeIn(200);
      } else {
        element.fadeOut(100);
      }
    });
  };
}).
directive('cellHighlight', function() {
  return {
    restrict: 'C',
    link: function postLink(scope, iElement, iAttrs) {
      iElement.find('td')
        .mouseover(function() {
          $(this).parent('tr').css('opacity', '0.7');
        }).mouseout(function() {
          $(this).parent('tr').css('opacity', '1.0');
        });
    }
  };
}).
directive('context', [
  function() {
    return {
      restrict: 'A',
      scope: '@&',
      compile: function compile(tElement, tAttrs, transclude) {
        return {
          post: function postLink(scope, iElement, iAttrs, controller) {
            var ul = $('#' + iAttrs.context),
              last = null;

            ul.css({
              'display': 'none'
            });

            $(iElement).click(function(event) {
              ul.css({
                position: "fixed",
                display: "block",
                left: event.clientX + 'px',
                top: event.clientY + 'px'
              });
              last = event.timeStamp;
            });

            $(document).click(function(event) {
              var target = $(event.target);
              if (!target.is(".popover") && !target.parents().is(".popover")) {
                if (last === event.timeStamp) {
                  return;
                }
                ul.css({
                  'display': 'none'
                });
              }
            });
          }
        };
      }
    };
  }
]).
directive('chartcalls', ['$filter', 'localize',
  function($filter, localize) {
    return {
      restrict: 'E',
      scope: {
        myDate: '=myDate',
        myTitle: '=myTitle',
        myFormat: '=myFormat',
        setFn: '&',
      },
      controller: function($scope, $element, $attrs) {
        var seriesDataAnswered = {
          name: localize.getLocalizedString("_chart.common.answered_"), //"Answered",
          data: [],
          type: "column"
        };
        var seriesDataNonAnswered = {
          name: localize.getLocalizedString("_chart.common.non_answered_"), //"Non Answered",
          data: [],
          type: "column"
        };

        $scope.seriesDatas = [];
        $scope.categories = [];

        $scope.seriesDatas.push(seriesDataAnswered);
        $scope.seriesDatas.push(seriesDataNonAnswered);
        //
        //

        function processData(calls) {
          seriesDataAnswered.data.length = 0;
          seriesDataNonAnswered.data.length = 0;
          //
          $scope.categories.length = 0;
          $scope.seriesDatas.length = 0;
          //
          for (var i = 0; i < calls.length; i++) {
            var endPoint = calls[i];
            $scope.categories.push(endPoint._id);
            var dispositions = endPoint.dispositions;
            var answered = 0
            var nonAnswered = 0;
            for (var j = 0; j < dispositions.length; j++) {
              var disposition = dispositions[j]
              if (disposition.status == 16) {
                answered += disposition.callsCount;
              } else {
                nonAnswered += disposition.callsCount;
              }
            }
            seriesDataAnswered.data.push(answered);
            seriesDataNonAnswered.data.push(nonAnswered);
          }
          //
          $scope.seriesDatas.push(seriesDataAnswered);
          $scope.seriesDatas.push(seriesDataNonAnswered);
          $scope.chartConfig.series = $scope.seriesDatas;
        };

        function updateTitle() {
          var format = $scope.myFormat == undefined ? "dd-MM-yyyy": $scope.myFormat
          var text = $scope.myTitle + " " + $filter('date')($scope.myDate, format);
          $scope.chartConfig.title.text = text
        };

        $scope.updateData = function(didCalls) {
          processData(didCalls);
          updateTitle();
        }
        //
        $scope.chartConfig = {
          options: {
            chart: {
              marginRight: 10,
              events: {
                load: function() {

                }
              }
            },
            plotOptions: {
              series: {
                cursor: 'ns-resize'
              },
              stickyTracking: false,
              column: {
                stacking: 'column',
                dataLabels: {
                  enabled: false,
                  color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                  style: {
                    textShadow: '0 0 3px black, 0 0 3px black'
                  }
                }
              },
              tooltip: {
                yDecimals: 2
              }

            },
            tooltip: {
              formatter: function() {
                return '<b>' + this.series.name + '</b><br/>' + $scope.myTitle +
                  ' ' + this.y + ' <br/> Total : ' + this.point.stackTotal;
              }
            }
          },
          series: $scope.seriesDatas,
          title: {
            text: $scope.myTitle
          },
          credits: {
            enabled: true
          },
          loading: false,
          xAxis: {
            categories: $scope.categories,
            type: 'category',
            labels: {
              rotation: -45,
              align: 'right',
              style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif'
              }
            }
          },
          yAxis: {
            min: 0,
            title: {
              text: localize.getLocalizedString("_chart.common.y_")
            },
            stackLabels: {
              enabled: true,
              style: {
                fontWeight: 'bold',
                color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
              }
            }
          },
          legend: {
            align: 'right',
            x: -70,
            verticalAlign: 'top',
            y: 20,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false,
            enabled: true
          },
          exporting: {
            enabled: false
          }

        };
        //set callback into the parent controller
        $scope.setFn({
          theDirFn: $scope.updateData
        });
      },
      template: '<highchart config="chartConfig"></highchart>',
      link: function(scope, element, attrs, controller) {
        //
        /*if(scope.myFormat == undefined){
          scope.myFormat = "dd-MM-yyyy"
        }*/
      }
    };
  }
]).
directive('selendpoints', ['$rootScope', 'localize','appDataService',
  function($rootScope, localize, appDataService) {
    return {
      template: '<select ng-model="selectedValue" ng-options="c.id for c in values"></select>',
      restrict: 'E',
      scope: {
        selectedValue: '=',
        givenType: '='
      },
      controller: function($scope, $element, $attrs) {
        $scope.values = []

        $scope.fetchServerDatas = function(endpoints){
          $scope.endpoints = appDataService.fetchEndPoints(endpoints);
                $scope.datas = $scope.endpoints.then(function(response) {
                  $scope.values = angular.copy(response)
                  //console.log(" response : " + JSON.stringify($scope.values));
                  var title = localize.getLocalizedString("_search.common.cbx_all_");
                  $scope.values.unshift({"comment": "", "id":title, "value": ""})
                  $scope.selectedValue = $scope.values[0];
                  return response;
                });
        }
      },
      link: function(scope, elem, attrs) {
        console.log(" givenType : " + scope.givenType);
        scope.fetchServerDatas(scope.givenType);

        
      }
    };
  }
])
.directive("repeatPassword", function() {
    return {
        require: "ngModel",
        link: function(scope, elem, attrs, ctrl) {
            var otherInput = elem.inheritedData("$formController")[attrs.repeatPassword];

            ctrl.$parsers.push(function(value) {
                if(value === otherInput.$viewValue) {
                    ctrl.$setValidity("repeat", true);
                    return value;
                }
                ctrl.$setValidity("repeat", false);
            });

            otherInput.$parsers.push(function(value) {
                ctrl.$setValidity("repeat", value === ctrl.$viewValue);
                return value;
            });
        }
    };
});