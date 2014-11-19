'use strict';
angular.module('app')   
    .directive('chartdidcallsbyhour', ['$filter', 'localize', 'configurationService',
        function($filter, localize, configurationService) {
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
                            seriesDataAnswered.data.push(0);
                            seriesDataNonAnswered.data.push(0);
                        };
                        //
                        for(var i= 0; i < calls.length; i++){
                            var did = calls[i];
                            //
                            for(var j=0; j < did.dispositions.length; j++){
                                var disposition = did.dispositions[j];
                                //
                                if(disposition.status == 16){
                                    for(var k=0; k < 24;k++){
                                        seriesDataAnswered.data[k] += disposition.callHourly[k];                                           
                                    }                                    
                                }else{
                                   for(var k=0; k < 24;k++){
                                        seriesDataNonAnswered.data[k] += disposition.callHourly[k];   
                                    }   
                                }
                            }
                                                       
                        }
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
                                
                                tooltip: {
                                    yDecimals: 2
                                }

                            },
                            tooltip: {
                                formatter: function() {
                                    var format = $scope.myFormat == undefined ? "dd-MM-yyyy HH:mm" : $scope.myFormat
                                    //must be checked cause UTC used
                                    //var mydate = $filter('date')(this.x - 3600 * 1000, format);
                                    return '<b>' + this.series.name + '</b><br/>' + $scope.myTitle +
                                        ' ' + this.y + ' </br> ';
                                }
                            },
                            exporting: {
                                enabled: configurationService.isChartExportEnabled(),
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
    ])
    .directive('chartpeerincallsbyhour', ['$filter', 'localize', 'configurationService',
        function($filter, localize, configurationService) {
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
                            seriesDataAnswered.data.push(0);
                            seriesDataNonAnswered.data.push(0);
                        };
                        //
                        for(var i= 0; i < calls.length; i++){
                            var did = calls[i];
                            //
                            for(var j=0; j < did.dispositions.length; j++){
                                var disposition = did.dispositions[j];
                                //
                                if(disposition.status == 16){
                                    for(var k=0; k < 24;k++){
                                        seriesDataAnswered.data[k] += disposition.callHourly[k];                                           
                                    }                                    
                                }else{
                                   for(var k=0; k < 24;k++){
                                        seriesDataNonAnswered.data[k] += disposition.callHourly[k];   
                                    }   
                                }
                            }
                                                       
                        }
                        //
                        $scope.seriesDatas.push(seriesDataAnswered);
                        $scope.seriesDatas.push(seriesDataNonAnswered);
                        //
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
                                
                                tooltip: {
                                    yDecimals: 2
                                }

                            },
                            tooltip: {
                                formatter: function() {
                                    var format = $scope.myFormat == undefined ? "dd-MM-yyyy HH:mm" : $scope.myFormat
                                    //must be checked cause UTC used
                                    //var mydate = $filter('date')(this.x - 3600 * 1000, format);
                                    return '<b>' + this.series.name + '</b><br/>' + $scope.myTitle +
                                        ' ' + this.y + ' </br> ';
                                }
                            },
                            exporting: {
                                enabled: configurationService.isChartExportEnabled(),
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
    ])
     .directive('chartpeeroutcallsbyhour', ['$filter', 'localize', 'configurationService',
        function($filter, localize, configurationService) {
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
                            seriesDataAnswered.data.push(0);
                            seriesDataNonAnswered.data.push(0);
                        };
                        //
                        for(var i= 0; i < calls.length; i++){
                            var did = calls[i];
                            //
                            for(var j=0; j < did.dispositions.length; j++){
                                var disposition = did.dispositions[j];
                                //
                                if(disposition.status == 16){
                                    for(var k=0; k < 24;k++){
                                        seriesDataAnswered.data[k] += disposition.callHourly[k];                                           
                                    }                                    
                                }else{
                                   for(var k=0; k < 24;k++){
                                        seriesDataNonAnswered.data[k] += disposition.callHourly[k];   
                                    }   
                                }
                            }
                                                       
                        }
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
                                
                                tooltip: {
                                    yDecimals: 2
                                }

                            },
                            tooltip: {
                                formatter: function() {
                                    var format = $scope.myFormat == undefined ? "dd-MM-yyyy HH:mm" : $scope.myFormat
                                    //must be checked cause UTC used
                                    //var mydate = $filter('date')(this.x - 3600 * 1000, format);
                                    return '<b>' + this.series.name + '</b><br/>' + $scope.myTitle +
                                        ' ' + this.y + ' </br> ';
                                }
                            },
                            exporting: {
                                enabled: configurationService.isChartExportEnabled(),
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