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
                    return '<b> DID : ' + $scope.chartDidCategories[this.x] + '</b><br/>' +
                        'Calls : ' + this.y + ' <br/> Total : ' + this.point.stackTotal;
                }
            }

        };
        //
        $scope.chartPeerInCallSeriesDatas = []
        $scope.chartPeerInCallCategories = [];
        //
        $scope.chartPeerOutCallSeriesDatas = []
        $scope.chartPeerOutCallCategories = [];
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
                var answered = 0
                var nonAnswered = 0;
                var callsCount = did.callsCount;
                for (var j = 0; j < status.length; j++) {
                    var count = callsCount[j]
                    if (status[j] == 16) {
                        answered += count;
                    } else {
                        nonAnswered += count;
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