'use strict';

angular.module('app')
    .directive('peerincalls', ['$filter',
        function($filter) {
            return {
                restrict: 'E',
                scope: {
                    peerDate: '=myDate',
                    setFn: '&',
                },
                controller: function($scope, $element, $attrs) {
                    $scope.seriesDataInCallsAnswered = {
                        name: "Answered",
                        data: [],
                        type: "column"
                    };
                    $scope.seriesDataInCallsNonAnswered = {
                        name: "Non Answered",
                        data: [],
                        type: "column"
                    };

                    $scope.chartPeerInCallSeriesDatas = []
                    $scope.chartPeerInCallCategories = [];

                    $scope.chartPeerInCallSeriesDatas.push($scope.seriesDataInCallsAnswered);
                    $scope.chartPeerInCallSeriesDatas.push($scope.seriesDataInCallsNonAnswered);
                    //

                    function processPeerIncommingData(peerInCalls) {
                        $scope.seriesDataInCallsAnswered.data.length = 0;
                        $scope.seriesDataInCallsNonAnswered.data.length = 0;
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

                            $scope.seriesDataInCallsAnswered.data.push(answered);
                            $scope.seriesDataInCallsNonAnswered.data.push(nonAnswered);
                        }
                        $scope.chartPeerInCallSeriesDatas.push($scope.seriesDataInCallsAnswered);
                        $scope.chartPeerInCallSeriesDatas.push($scope.seriesDataInCallsNonAnswered);
                        $scope.chartPeersInCallsConfig.series = $scope.chartPeerInCallSeriesDatas;

                    };

                    function udpateTitle() {
                        $scope.chartPeersInCallsConfig.title.text = 'Calls by Peer ' + $filter('date')($scope.peerDate, 'dd-MM-yyyy');
                    }

                    $scope.updateData = function(peerInCalls) {
                        processPeerIncommingData(peerInCalls);
                        udpateTitle();
                    }
                    //set callback into the parent controller
                    $scope.setFn({
                        theDirFn: $scope.updateData
                    });
                },
                template: '<highchart id="dailyinCallChart" config="chartPeersInCallsConfig"></highchart>',
                link: function(scope, element, attrs, controller) {

                    scope.chartPeersInCallsConfig = {
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
                        series: scope.chartPeerInCallSeriesDatas,
                        title: {
                            text: 'Calls by Peer'
                        },
                        credits: {
                            enabled: true
                        },
                        loading: false,
                        xAxis: {
                            categories: scope.chartPeerInCallCategories,
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
        }
    ])
    .directive('peeroutcalls', ['$filter',
        function($filter) {
            return {
                restrict: 'E',
                scope: {
                    peerDate: '=myDate',
                    setFn: '&',
                },
                controller: function($scope, $element, $attrs) {
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
                    //
                    //

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

                    function updateTitle() {
                        var text = 'Outgoing calls ' + $filter('date')($scope.peerDate, 'dd-MM-yyyy');
                        $scope.chartPeersOutCallsConfig.title.text = text
                    };

                    $scope.updateData = function(peerOutCalls) {
                        processPeerOutgoingData(peerOutCalls);
                        updateTitle();
                    }
                    //set callback into the parent controller
                    $scope.setFn({
                        theDirFn: $scope.updateData
                    });
                },
                template: '<highchart id="dailyoutCallChart" config="chartPeersOutCallsConfig"></highchart>',
                link: function(scope, element, attrs, controller) {

                    scope.chartPeersOutCallsConfig = {
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
                        series: scope.chartPeerOutCallSeriesDatas,
                        title: {
                            text: 'Outgoing calls'
                        },
                        credits: {
                            enabled: true
                        },
                        loading: false,
                        xAxis: {
                            categories: scope.chartPeerOutCallCategories,
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
        }
    ])
    .directive('didcalls', ['$filter',
        function($filter) {
            return {
                restrict: 'E',
                scope: {
                    didDate: '=myDate',
                    setFn: '&',
                },
                controller: function($scope, $element, $attrs) {
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

                    function updateTitle() {
                        var text = 'DID calls ' + $filter('date')($scope.didDate, 'dd-MM-yyyy');
                        $scope.chartDIDConfig.title.text = text
                    };

                    $scope.updateData = function(didCalls) {
                        processDidData(didCalls);
                        updateTitle();
                    }
                    //set callback into the parent controller
                    $scope.setFn({
                        theDirFn: $scope.updateData
                    });
                },
                template: '<highchart id="dailydidCallChart" config="chartDIDConfig"></highchart>',
                link: function(scope, element, attrs, controller) {

                    scope.chartDIDConfig = {
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
                        series: scope.chartDidSeriesDatas,
                        title: {
                            text: 'DID calls'
                        },
                        credits: {
                            enabled: true
                        },
                        loading: false,
                        xAxis: {
                            categories: scope.chartDidCategories,
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
                    //end of didconf

                }
            };
        }
    ])
    .directive('chartdidcallsbyhour', ['$filter', 'localize',
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
                        name: localize.getLocalizedString("_chart.common.answered_"),
                        data: [],
                        type: "spline"
                    };
                    var seriesDataNonAnswered = {
                        name: localize.getLocalizedString("_chart.common.non_answered_"),
                        data: [],
                        type: "spline"
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
                        for (var i = 0; i < 24; i++) {
                            seriesDataAnswered.data.push(i%2);
                            seriesDataNonAnswered.data.push(i%3);
                        };
                        /*for (var i = 0; i < calls.length; i++) {
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
                        }*/
                        //
                        $scope.seriesDatas.push(seriesDataAnswered);
                        $scope.seriesDatas.push(seriesDataNonAnswered);
                        $scope.chartConfig.series = $scope.seriesDatas;
                    };

                    function updateTitle() {
                        var format = $scope.myFormat == undefined ? "dd-MM-yyyy" : $scope.myFormat
                        var text = $scope.myTitle + " " + $filter('date')($scope.myDate, format);
                        $scope.chartConfig.title.text = text
                    };

                    $scope.updateData = function(didCalls) {
                        processData(didCalls);
                        updateTitle();
                    }
                    //
                    var d = new Date();
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
                                    cursor: 'ns-resize',
                                    pointStart:Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
                                    pointInterval: 3600 * 1000,
                                },
                                stickyTracking: false,
                                /*column: {
                                    stacking: 'column',
                                    dataLabels: {
                                        enabled: false,
                                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                                        style: {
                                            textShadow: '0 0 3px black, 0 0 3px black'
                                        }
                                    }
                                },*/
                                tooltip: {
                                    yDecimals: 2
                                }

                            },
                            tooltip: {
                                formatter: function() {
                                    return '<b>' + this.series.name + '</b><br/>' + $scope.myTitle +
                                        ' ' + this.y + ' <br/> Total : ' + this.point.stackTotal;
                                }
                            },
                            exporting: {
                                enabled: false,
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
                            type: 'datetime',
                            tickInterval: 3600 * 1000,
                            categories: $scope.categories,
                            labels: {
                                formatter: function() {
                                    return Highcharts.dateFormat('%H', this.value);

                                },
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
                }
            };
        }
    ]);