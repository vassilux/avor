'use strict';

angular.module('app')
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/daily', {
                templateUrl: 'scripts/daily/daily.tpl.html',
                controller: 'DailyCtrl'

            });
        }
    ])
    .controller('DailyCtrl', ['$rootScope', '$scope', '$filter', 'dailyService' , function($rootScope, $scope, $filter, dailyService) {
        //
        $scope.choiseDid = "";
        $scope.choisePeer = "";
        //
        $scope.dailyDidDate = new Date();
        $scope.dailyPeerDate = new Date();
        $scope.searchShow = true;
        $scope.searchShowError = false;
        //
          var seriesDataAnswered = {
            name: "Answered",
            data: [],
            type: "column"
        };
        var seriesDataNonAnswered = {
            name: "Non Answered",
            data: [],
            type: "column"
        };

        $scope.chartDidSeriesDatas = [];
        $scope.chartDidCategories = [];

        $scope.chartDidSeriesDatas.push(seriesDataAnswered);
        $scope.chartDidSeriesDatas.push(seriesDataNonAnswered);
        //
        $scope.chartDIDConfig = {
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
            series: $scope.chartDidSeriesDatas,
            title: {
                text: 'Calls by DID'
            },
            credits: {
                enabled: true
            },
            loading: false,
            xAxis: {
                categories: $scope.chartDidCategories,
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
        //
         function processDidData(didCalls) {
            seriesDataAnswered.data.length = 0;
            seriesDataNonAnswered.data.length = 0;
            //
            $scope.chartDidCategories.length = 0;
            $scope.chartDidSeriesDatas.length = 0;
            //
            for (var i = 0; i < didCalls.length; i++) {
                var did = didCalls[i];
                $scope.chartDidCategories.push(did._id);
                var dispositions = did.dispositions;
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
            $scope.chartDidSeriesDatas.push(seriesDataAnswered);
            $scope.chartDidSeriesDatas.push(seriesDataNonAnswered);
            $scope.chartDIDConfig.series = $scope.chartDidSeriesDatas;
        };

        $scope.fetchDidDatas = function(){
        	var url = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + '/daily/didincomming/';
        	var didDate = $filter('date')($scope.dailyDidDate, 'yyyy-MM-dd');
            url += didDate + 'T23:59:59Z';
            if($scope.choiseDid != ""){
            	url += "/" + $scope.choiseDid
            }
        	$scope.myts = dailyService.fetchDidDatas(url);
            $scope.didDatas = $scope.myts.then(function(response) {
            	console.log("response : " + JSON.stringify(response));
                processDidData(response);
                return response;
            });
        }

        $scope.fetchPeerDatas = function(){
        	
        }

        

    }
    ]);