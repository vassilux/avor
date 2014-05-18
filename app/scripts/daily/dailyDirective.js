'use strict';

angular.module('app')

.directive('hcPeerincalls', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            items: '=',
            categories: '=',
        },

        controller: function($scope, $element, $attrs) {
            $scope.fetchPeerData = function() {

            }

        },
        template: '<highchart id="dailyChart2" config="chartPeersInCallsConfig"></highchart>',
        link: function(scope, element, attrs, controller) {
            var seriesDataInCallsAnswered = {
                name: "Answered",
                data: [],
                type: "column"
            };
            var seriesDataInCallsNonAnswered = {
                name: "Non Answered",
                data: [],
                type: "column"
            };


            $scope.chartPeerInCallSeriesDatas = []
            $scope.chartPeerInCallCategories = [];

            $scope.chartPeerInCallSeriesDatas.push(seriesDataInCallsAnswered);
            $scope.chartPeerInCallSeriesDatas.push(seriesDataInCallsNonAnswered);

            $scope.chartPeersInCallsConfig = {
                options: {
                    chart: {
                        marginRight: 10,
                        events: {
                            load: function() {

                            }
                        }
                    },
                    plotOptions: {
                        stickyTracking: false,
                        column: {
                            stacking: 'column',
                            dataLabels: {
                                enabled: true,
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
                            return '<b>' + this.series.name + '</b><br/>' +
                                'Calls : ' + this.y + ' <br/> Total : ' + this.point.stackTotal;
                        }
                    }
                },
                series: $scope.chartPeerInCallSeriesDatas,
                title: {
                    text: 'Calls by Peer'
                },
                credits: {
                    enabled: true
                },
                loading: false,
                xAxis: {
                    categories: $scope.chartPeerInCallCategories,
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
                        text: 'Calls'
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
            //end of incall
        }
    };
})