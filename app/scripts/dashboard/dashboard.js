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
        var seriesDataAnswered = {
            name : "Answered",
            data : [],
            type: "column"
        };
        var seriesDataNonAnswered = {
            name : "Non Answered",
            data : [],
            type: "column"
        };

        $scope.chartDidSeriesDatas = [];

        $scope.chartDidSeriesDatas.push(seriesDataAnswered);
        $scope.chartDidSeriesDatas.push(seriesDataNonAnswered);
        $scope.chartDidCategories = []; //"1157", "1158", "1151"];
        //
        var datas = [
            {
                name : "1157",
                data : [5],
                type: "column"
            },
            {
                name : "1158",
                data : [4],
                type: "column"
            },
            {
                name : "1151",
                data : [4],
                type: "column"
            },

        ]

        $scope.chartConfig = {
            options: {
                  chart: {
                   // type: 'column',
                    marginRight: 10,
                    events: {
                        load: function() {}
                    }
            },
              
                },
                plotOptions: {
                    column: {
                        stacking: 'column',
                        dataLabels: {
                            enabled: true,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                            style: {
                                textShadow: '0 0 3px black, 0 0 3px black'
                            }
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
                    enabled: false
                },
                exporting: {
                    enabled: false
                },
                tooltip: {
                    formatter: function() {
                        return '<b> DID : ' +$scope.chartDidCategories[this.x] + '</b><br/>' +
                            'Calls : ' + this.y + ' <br/> Total : ' + this.point.stackTotal;
                    }
                }

            };

        //$scope.chartConfig.series.push($scope.chartDidSeriesDatas)
        //

        //$scope.chartDidCategories.push("1157");
        //$scope.chartDidCategories.push("1158");
        /*$scope.chartDidSeriesDatas.push({
            name: 'Answered',
            data: [5,2],
            stack: 'male',
        });
        $scope.chartDidSeriesDatas.push({
            name: 'Failed',
            data: [4,3],
            stack: 'male',
        });*/
        //
        $scope.chartPeerInCallSeriesDatas = []
        $scope.chartPeerInCallCategories = [];
        //
        $scope.chartPeerOutCallSeriesDatas = []
        $scope.chartPeerOutCallCategories = [];


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
            var jsonData = JSON.parse(response.data);
            processDidData(jsonData.didCalls);
            processPeerIncommingData(jsonData.peerInCalls);
            processPeerOutgoingData(jsonData.peerOutCalls);
            //
            return response.data;
        });

        function processDidData(didCalls) {
            seriesDataAnswered.data.length = 0;
            seriesDataNonAnswered.data.length = 0;
            //
            $scope.chartDidCategories.length = 0;
            $scope.chartDidSeriesDatas.length = 0;
            for (var i = 0; i < didCalls.length; i++) {
                var did = didCalls[i];
                $scope.chartDidCategories.push(did._id);
                var status = did.status;
                console.log(" status " + JSON.stringify(status));
                var answered = 0
                var nonAnswered = 0;
                var callsCount = did.callsCount;
                console.log(" callsCount " + JSON.stringify(callsCount));
                for (var j = 0; j < status.length; j++) {
                    var count = callsCount[j]
                    if (status[j] == 16) {
                        answered += count;
                    }else{
                        nonAnswered += count;
                    }
                }
                seriesDataAnswered.data.push(answered);
                seriesDataNonAnswered.data.push(nonAnswered);              
            }
            //
            $scope.chartDidSeriesDatas.push(seriesDataAnswered);
            $scope.chartDidSeriesDatas.push(seriesDataNonAnswered);
            console.log(" categories " + JSON.stringify($scope.chartDidCategories));
            console.log(" data " + JSON.stringify($scope.chartDidSeriesDatas))
            $scope.chartConfig.series = $scope.chartDidSeriesDatas;
        };

        function processPeerIncommingData(peerInCalls) {
            $scope.chartPeerInCallCategories.length = 0;
            $scope.chartPeerInCallSeriesDatas.length = 0;
            for (var i = 0; i < peerInCalls.length; i++) {
                var peer = peerInCalls[i]
                $scope.chartPeerInCallCategories.push(peer._id);
                $scope.chartPeerInCallSeriesDatas.push({
                    name: peer._id,
                    y: peer.callsCount
                });
            }
        };

        function processPeerOutgoingData(peerOutCalls) {
            $scope.chartPeerOutCallCategories.length = 0;
            $scope.chartPeerOutCallSeriesDatas.length = 0;
            for (var i = 0; i < peerOutCalls.length; i++) {
                var peer = peerOutCalls[i]
                $scope.chartPeerOutCallCategories.push(peer._id);
                $scope.chartPeerOutCallSeriesDatas.push({
                    name: peer._id,
                    y: peer.callsCount
                });
            }
        };

        var Repeater = function() {
            $scope.$apply(function() {
                $scope.myts = Poller.poll(url);
                $scope.pollData = $scope.myts.then(function(response) {
                    console.log("Poll response data : " + response.data);
                    var jsonData = JSON.parse(response.data)
                    processDidData(jsonData.didCalls);
                    processPeerIncommingData(jsonData.peerInCalls);
                    processPeerOutgoingData(jsonData.peerOutCalls);
                    return response.data;
                });
            });
        };
        var timer = setInterval(Repeater, 5000);

    });