'use strict';

angular.module('app')
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/dashboard', {
                templateUrl: 'scripts/dashboard/dashboard.tpl.html',
                controller: 'DashboardCtrl'

            });
        }
    ])
    .controller('DashboardCtrl', function($rootScope, $scope, $timeout, Poller) {
        console.debug("DashboardCtrl created");
        //
        $scope.chartSeriesDatas = []
        $scope.chartCategories = []; 

        $scope.addPoints = function() {
            var seriesArray = $scope.chartConfig.series;
            var rndIdx = Math.floor(Math.random() * seriesArray.length);
            seriesArray[rndIdx].data = seriesArray[rndIdx].data.concat([1, 10, 20])
        };

        $scope.addSeries = function() {
            var rnd = []
            for (var i = 0; i < 10; i++) {
                rnd.push(Math.floor(Math.random() * 20) + 1)
            }
            $scope.chartConfig.series.push({
                data: rnd
            })
        }

        $scope.removeRandomSeries = function() {
            var seriesArray = $scope.chartConfig.series;
            var rndIdx = Math.floor(Math.random() * seriesArray.length);
            seriesArray.splice(rndIdx, 1)
        }

        $scope.removeSeries = function(id) {
            var seriesArray = $scope.chartConfig.series;
            seriesArray.splice(id, 1)
        }

        $scope.toggleHighCharts = function() {
            this.chartConfig.useHighStocks = !this.chartConfig.useHighStocks
        }

        //
        $scope.limitedIdeas = [10, 20, 20, 50]
        $scope.liveDatas = [];
        var time = (new Date()).getTime(),
            i;
        for (i = -19; i <= 0; i++) {
            $scope.liveDatas.push({
                x: time + i * 1000,
                y: Math.random()
            });
        }
        //
        var refreshLiveData = function() {
            var x = (new Date()).getTime(),
                y = Math.random();
            $scope.liveDatas.push({
                x: x,
                y: y
            })
            $scope.liveDatas.splice(0, 1);
            $timeout(refreshLiveData, 2000);
        }
        //
        $timeout(refreshLiveData, 2000);
        //live part
        $scope.liveSeries = [{
            name: 'Random data',
            data: (function() {
                // generate an array of random data
                var data = [],
                    time = (new Date()).getTime(),
                    i;

                for (i = -19; i <= 0; i++) {
                    data.push({
                        x: time + i * 1000,
                        y: Math.random()
                    });
                }
                return data;
            })()
        }];

        $scope.liveChartConfig = {
            options: {
                chart: {
                    type: 'spline',
                    animation: Highcharts.svg, // don't animate in old IE
                    marginRight: 10,
                    events: {
                        load: function() {
                            var countUp = function() {

                                var x = (new Date()).getTime(), // current time
                                    y = Math.random();
                                var series = $scope.liveChartConfig.series[0];
                                var temp = []
                                temp.push({
                                    x: x,
                                    y: y
                                })
                                series.data = series.data.concat(temp)
                                series.data.splice(0, 1);
                                $timeout(countUp, 2000);
                            }

                            $timeout(countUp, 2000);
                            // set up the updating of the chart each second
                            console.log("type " + $scope.liveChartConfig.options.chart.type);
                            /*$timeout(function() { 
                           var x = (new Date()).getTime(), // current time
                               y = Math.random();
                               var series = $scope.liveChartConfig.series[0];
                                var temp = []
                                temp.push({x: x, y: y})
                                series.data = series.data.concat(temp)
                                series.data.splice(0, 1); 
                        }, 2000)*/
                            /*setInterval(function() {
                            $scope.$apply(function () {
                               var x = (new Date()).getTime(), // current time
                               y = Math.random();
                               var series = $scope.liveChartConfig.series[0];
                                var temp = []
                                temp.push({x: x, y: y})
                                series.data = series.data.concat(temp)
                                series.data.splice(0, 1);
                            });
                           
                            //console.log("series.data : " + JSON.stringify(series.data))
                            
                            //series.data.push({x: x, y: y});
                            //series.addPoint([x, y], true, true);
                        }, 2000);*/
                        }
                    }
                }
            },
            title: {
                text: 'Live random data'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                title: {
                    text: 'Value'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function() {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: 'Random data',
                data: (function() {
                    // generate an array of random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;

                    for (i = -19; i <= 0; i++) {
                        data.push({
                            x: time + i * 1000,
                            y: Math.random()
                        });
                    }
                    return data;
                })()
            }]
        }



        $scope.message = '';

        $scope.myCallback = function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $('td:eq(2)', nRow).bind('click', function() {
                $scope.$apply(function() {
                    $scope.someClickHandler(aData);
                });
            });
            return nRow;
        };

        $scope.someClickHandler = function(info) {
            $scope.message = 'clicked: ' + info.price;
        };

        $scope.columnDefs = [{
            "mDataProp": "category",
            "aTargets": [0]
        }, {
            "mDataProp": "name",
            "aTargets": [1]
        }, {
            "mDataProp": "price",
            "aTargets": [2]
        }];

        $scope.overrideOptions = {
            "bStateSave": true,
            "iCookieDuration": 2419200,
            /* 1 month */
            "bJQueryUI": true,
            "bPaginate": true,
            "bLengthChange": false,
            "bFilter": true,
            "bInfo": true,
            "bDestroy": true
        };


        $scope.sampleProductCategories = [

            {
                "name": "1948 Porsche 356-A Roadster",
                "price": 53.9,
                "category": "Classic Cars",
                "action": "x"
            }, {
                "name": "1948 Porsche Type 356 Roadster",
                "price": 62.16,
                "category": "Classic Cars",
                "action": "x"
            }, {
                "name": "1949 Jaguar XK 120",
                "price": 47.25,
                "category": "Classic Cars",
                "action": "x"
            }, {
                "name": "1936 Harley Davidson El Knucklehead",
                "price": 24.23,
                "category": "Motorcycles",
                "action": "x"
            }, {
                "name": "1957 Vespa GS150",
                "price": 32.95,
                "category": "Motorcycles",
                "action": "x"
            }, {
                "name": "1960 BSA Gold Star DBD34",
                "price": 37.32,
                "category": "Motorcycles",
                "action": "x"
            }, {
                "name": "1900s Vintage Bi-Plane",
                "price": 34.25,
                "category": "Planes",
                "action": "x"
            }, {
                "name": "1900s Vintage Tri-Plane",
                "price": 36.23,
                "category": "Planes",
                "action": "x"
            }, {
                "name": "1928 British Royal Navy Airplane",
                "price": 66.74,
                "category": "Planes",
                "action": "x"
            }, {
                "name": "1980s Black Hawk Helicopter",
                "price": 77.27,
                "category": "Planes",
                "action": "x"
            }, {
                "name": "ATA: B757-300",
                "price": 59.33,
                "category": "Planes",
                "action": "x"
            }

        ];
        //
        //Just to start
        var url = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + '/poll';
        $scope.myts = Poller.poll(url);
        $scope.pollData = $scope.myts.then(function(response) {
            console.log("first pass")
            var jsonData = JSON.parse(response.data)
            for (var i = 0; i < jsonData.didCalls.length; i++) {
                var did = jsonData.didCalls[i]
                $scope.chartCategories.push(did._id);
                $scope.chartSeriesDatas.push({
                    name: did._id,
                    y: did.callsCount
                });
            }
            return response.data;
        });
        var Repeater = function() {
            $scope.$apply(function() {
                $scope.myts = Poller.poll(url);
                $scope.pollData = $scope.myts.then(function(response) {
                    console.log("Poll response data : " + response.data);
                    var tempCategories = []
                    var tempDatas = []
                    var jsonData = JSON.parse(response.data)
                    for (var i = 0; i < jsonData.didCalls.length; i++) {
                        var did = jsonData.didCalls[i]
                        tempCategories.push(did._id);
                        tempDatas.push({
                            name: did._id,
                            y: did.callsCount
                        });
                    }

                    $scope.chartCategories.length = 0;
                    $scope.chartSeriesDatas.length = 0;
                    $scope.chartCategories = tempCategories;
                    $scope.chartSeriesDatas = tempDatas;
                    return response.data;
                });
            });
        };
        var timer = setInterval(Repeater, 5000);

    });