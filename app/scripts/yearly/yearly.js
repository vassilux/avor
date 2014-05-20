'use strict';

angular.module('app')
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/yearly', {
                templateUrl: 'scripts/yearly/yearly.tpl.html',
                controller: 'YearlyCtrl'

            });
        }
    ])
    .controller('YearlyCtrl', ['$rootScope', '$scope', '$filter', 'yearlyService' , function($rootScope, $scope, $filter, yearlyService) {
        //
        $scope.didsTarget = "dids"
        $scope.peersTarget = "peers"
        $scope.choiseDid = {};
        $scope.choisePeer = {};
        //
        $scope.didDate = new Date();
        $scope.peerDate = new Date();
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
        //in calls
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
        //out calls
        var seriesDataOutCallsAnswered = {
            name: "Answered",
            data: [],
            type: "column"
        };
        var seriesDataOutCallsNonAnswered = {
            name: "Non Answered",
            data: [],
            type: "column"
        };

        $scope.chartPeerOutCallSeriesDatas = []
        $scope.chartPeerOutCallCategories = [];

        $scope.chartPeerOutCallSeriesDatas.push(seriesDataOutCallsAnswered);
        $scope.chartPeerOutCallSeriesDatas.push(seriesDataOutCallsNonAnswered);

        $scope.chartPeersOutCallsConfig = {
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
            series: $scope.chartPeerOutCallSeriesDatas,
            title: {
                text: 'Outgoing calls by peer'
            },
            credits: {
                enabled: true
            },
            loading: false,
            xAxis: {
                categories: $scope.chartPeerOutCallCategories,
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
        //end of out calls

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
        //

        function processPeerIncommingData(peerInCalls) {
            seriesDataInCallsAnswered.data.length = 0;
            seriesDataInCallsNonAnswered.data.length = 0;
            $scope.chartPeerInCallCategories.length = 0;
            $scope.chartPeerInCallSeriesDatas.length = 0;
            for (var i = 0; i < peerInCalls.length; i++) {
                var peer = peerInCalls[i]
                $scope.chartPeerInCallCategories.push(peer._id);
                var dispositions = peer.dispositions;
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

                seriesDataInCallsAnswered.data.push(answered);
                seriesDataInCallsNonAnswered.data.push(nonAnswered);
            }
            $scope.chartPeerInCallSeriesDatas.push(seriesDataInCallsAnswered);
            $scope.chartPeerInCallSeriesDatas.push(seriesDataInCallsNonAnswered);
            $scope.chartPeersInCallsConfig.series = $scope.chartPeerInCallSeriesDatas;
        };

        function processPeerOutgoingData(peerOutCalls) {
            seriesDataOutCallsAnswered.data.length = 0;
            seriesDataOutCallsNonAnswered.data.length = 0;
            $scope.chartPeerOutCallCategories.length = 0;
            $scope.chartPeerOutCallSeriesDatas.length = 0;
            for (var i = 0; i < peerOutCalls.length; i++) {
                var peer = peerOutCalls[i]
                $scope.chartPeerOutCallCategories.push(peer._id);
                var dispositions = peer.dispositions;
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

                seriesDataOutCallsAnswered.data.push(answered);
                seriesDataOutCallsNonAnswered.data.push(nonAnswered);
            }
            $scope.chartPeerOutCallSeriesDatas.push(seriesDataOutCallsAnswered);
            $scope.chartPeerOutCallSeriesDatas.push(seriesDataOutCallsNonAnswered);
            $scope.chartPeersOutCallsConfig.series = $scope.chartPeerOutCallSeriesDatas;
        };
        //

        $scope.fetchDidDatas = function(){
        	var url = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + '/daily/didincomming/';
        	var didDate = $filter('date')($scope.didDate, 'yyyy-MM-dd');
            url += didDate + 'T23:59:59Z';
            if($scope.choiseDid.value != ""){
            	url += "/" + $scope.choiseDid.value
            }
        	$scope.myts = yearlyService.fetchDidDatas(url);
            $scope.didDatas = $scope.myts.then(function(response) {
            	console.log("response : " + JSON.stringify(response));
                processDidData(response);
                return response;
            });
        }

        $scope.fetchPeerDatas = function(){
        	var url = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + '/daily/peerdatas/';
            var peerDate = $filter('date')($scope.peerDate, 'yyyy-MM-dd');
            url += peerDate + 'T23:59:59Z';
            if($scope.choisePeer.value != ""){
                url += "/" + $scope.choisePeer.value
            }
            $scope.myts = yearlyService.fetchPeerDatas(url);
            $scope.didDatas = $scope.myts.then(function(response) {
                console.log("response : " + JSON.stringify(response));
                processPeerIncommingData(response.inCalls);
                processPeerOutgoingData(response.outCalls);
                //processDidData(response);
                return response;
            });
        }

        

    }
    ]);