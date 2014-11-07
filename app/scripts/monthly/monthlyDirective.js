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
    .directive('monthlydatepicker', [ '$filter', function($filter) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {
                ngModel.$parsers.push(function(data){
                    /*console.log(" ngModel parsers "  + data);
                    var date = Date.parse('01-' + data);*/
                    console.log(" ngModel parsers "  + data);
                    return data;
                });

                ngModel.$formatters.push(function(data){
                    var dt = $filter('date')(data, 'MM-yyyy');
                    return dt
                });

                var monthpicker = $(element).datepicker({
                    changeYear: true,
                    changeMonth: true,
                    changeDay: false,
                    dateFormat: 'mm-yy',
                    showButtonPanel: true,
                    yearRange: '2010:-0',
                    onChangeMonthYear: function(year, month, inst){
                        var date = new Date(year, month - 1, 1);
                        $(this).val($.datepicker.formatDate('mm-yy',date))
                        var ngModelName = this.attributes['ng-model'].value;
                        scope[ngModelName] = date;
                        scope.$apply();
                    },
                    onSelect: function(date) {                        
                        var month = $(".ui-datepicker-month :selected").val()
                        var year = $(".ui-datepicker-year :selected").val()
                        $(this).datepicker('setDate', new Date(year, month, 1))
                        var ngModelName = this.attributes['ng-model'].value;
                        scope[ngModelName] = new Date(year, month, 1);
                        scope.$apply();
                    }
                });

                monthpicker.focus(function(){
                     $(".ui-datepicker-calendar").hide();
                })
            }
        };
    }
    ])
    .directive('chartmonthcallsbydays', ['$filter', 'localize',
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
                        var year = $filter('date')($scope.myDate, 'yyyy');
                        var month = $filter('date')($scope.myDate, 'MM') ;
                        //javascript month  == month -1 
                        //get the days number for the given month
                        var daysInMonth = 32 - new Date(year, month-1, 32).getDate();
                        
                        for (var i = 0; i <= daysInMonth; i++) {
                            var initDate = Date.UTC(year, month-1, i+1)
                            seriesDataAnswered.data[i] = ([initDate,0]);
                            seriesDataNonAnswered.data[i] = ([initDate,0]);
                        };

                        var callsLength = calls.length
                        for (var i = 0; i < callsLength; i++) {
                            var monthData = calls[i];
                            for(var j = 0; j < monthData.datas.length; j++){
                                //monthData._id define the disposition , means answered, unanswered etc by code
                                if(monthData._id == 16){                                    
                                    for (var k = 1; k <= daysInMonth; k++) {
                                        if(monthData.datas[j].callsDaily[k]){
                                            seriesDataAnswered.data[k][1] += monthData.datas[j].callsDaily[k];
                                        }                                        
                                    };                                    
                                }else{
                                    for (var k = 0; k <= daysInMonth; k++) {
                                        if(monthData.datas[j].callsDaily[k]){
                                            seriesDataNonAnswered.data[k][1] += monthData.datas[j].callsDaily[k];
                                        } 
                                    };                                    
                                }
                            }//for datas length
                        }
                        //
                        $scope.seriesDatas.push(seriesDataAnswered);
                        $scope.seriesDatas.push(seriesDataNonAnswered);
                        $scope.chartConfig.series = $scope.seriesDatas;
                    };

                    function updateTitle() {
                        var month = $filter('date')($scope.myDate, "MM")
                        var year = $filter('date')($scope.myDate, "yyyy")
                        var key = "_year_month_" + month +"_"
                        $scope.chartConfig.title.text = $scope.myTitle + " " + localize.getLocalizedString(key) + " " + year
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
                                    return Highcharts.dateFormat('%e. %b', this.value);
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