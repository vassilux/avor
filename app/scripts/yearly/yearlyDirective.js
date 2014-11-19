'use strict';

angular.module('app')
    .directive('yearlydatepicker', ['$filter',
        function($filter) {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function(scope, element, attrs, ngModel) {
                    ngModel.$parsers.push(function(data) {
                        return data;
                    });

                    ngModel.$formatters.push(function(data) {
                        var dt = $filter('date')(data, 'yyyy');
                        console.log(" ngModel formatters " + dt);
                        return dt
                    });



                    var monthpicker = $(element).datepicker({
                        changeYear: true,
                        dateFormat: 'yy',
                        showButtonPanel: true,
                        yearRange: '2010:-0',
                        onChangeMonthYear: function(year, month, inst) {
                            var date = new Date(year, month - 1, 1);
                            $(this).val($.datepicker.formatDate('yy', date))
                            var ngModelName = this.attributes['ng-model'].value;
                            scope[ngModelName] = date;
                            scope.$apply();

                        },
                        onSelect: function(date) {
                            $(".ui-datepicker-calendar").hide();
                            $(".ui-datepicker-month").hide();
                            var month = $(".ui-datepicker-month :selected").val()
                            var year = $(".ui-datepicker-year :selected").val()
                            $(this).datepicker('setDate', new Date(year, month, 1))
                            var ngModelName = this.attributes['ng-model'].value;
                            scope[ngModelName] = new Date(year, month, 1);
                            scope.$apply();
                        }

                    });

                    monthpicker.focus(function() {
                        $(".ui-datepicker-calendar").hide();
                        $(".ui-datepicker-month").hide();
                    })
                }
            };
        }
    ])
   .directive('chartdidcallsbyear', ['$filter', 'localize', 'configurationService', 
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
                        var year = $filter('date')($scope.myDate, 'yyyy');

                        for (var i = 0; i < 12; i++) {
                            seriesDataAnswered.data[i] = ([Date.UTC(year, i, 1),0]);
                            seriesDataNonAnswered.data[i] = ([Date.UTC(year, i, 1),0]);
                        };

                        var callsLength = calls.length
                        for (var i = 0; i < callsLength; i++) {
                            var monthData = calls[i];
                            seriesDataAnswered.data[monthData.month - 1][1] += monthData.calls - monthData.missing;
                            seriesDataNonAnswered.data[monthData.month - 1][1] += monthData.missing;
                        }
                        //
                        $scope.seriesDatas.push(seriesDataAnswered);
                        $scope.seriesDatas.push(seriesDataNonAnswered);
                        $scope.chartConfig.series = $scope.seriesDatas;
                    };

                    function updateTitle() {
                        var format = $scope.myFormat == undefined ? "yyyy" : $scope.myFormat
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
                                },
                                stickyTracking: false,
                                
                                tooltip: {
                                    yDecimals: 2
                                }

                            },
                            tooltip: {
                                formatter: function() {
                                    var format = $scope.myFormat == undefined ? "MM-yyyy" : $scope.myFormat
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
                            dateTimeLabelFormats: {
                                second: '%H:%M:%S',
                                minute: '%H:%M',
                                hour: '%H:%M',
                                day: '%e. %b',
                                week: '%e. %b',
                                month: '%b', //month formatted as month only
                                year: '%Y'
                            },
                            labels: {
                                formatter: function() {
                                    return Highcharts.dateFormat('%b', this.value);
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
    .directive('chartpeercallsbyear', ['$filter', 'localize', 'configurationService',
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
                        var year = $filter('date')($scope.myDate, 'yyyy');

                        for (var i = 0; i < 12; i++) {
                            seriesDataAnswered.data[i] = ([Date.UTC(year, i, 1),0]);
                            seriesDataNonAnswered.data[i] = ([Date.UTC(year, i, 1),0]);
                        };

                        var callsLength = calls.length
                       
                        for (var i = 0; i < callsLength; i++) {
                            var monthData = calls[i];
                            seriesDataAnswered.data[monthData.month - 1][1] += monthData.calls - monthData.missing;
                            seriesDataNonAnswered.data[monthData.month - 1][1] += monthData.missing;
                        }
                        //
                        $scope.seriesDatas.push(seriesDataAnswered);
                        $scope.seriesDatas.push(seriesDataNonAnswered);
                        $scope.chartConfig.series = $scope.seriesDatas;
                    };

                    function updateTitle() {
                        var format = $scope.myFormat == undefined ? "yyyy" : $scope.myFormat
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
                                },
                                stickyTracking: false,
                                
                                tooltip: {
                                    yDecimals: 2
                                }

                            },
                            tooltip: {
                                formatter: function() {
                                    var format = $scope.myFormat == undefined ? "MM-yyyy" : $scope.myFormat
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
                            dateTimeLabelFormats: {
                                second: '%H:%M:%S',
                                minute: '%H:%M',
                                hour: '%H:%M',
                                day: '%e. %b',
                                week: '%e. %b',
                                month: '%b', //month formatted as month only
                                year: '%Y'
                            },
                            labels: {
                                formatter: function() {
                                    return Highcharts.dateFormat('%b', this.value);
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
    