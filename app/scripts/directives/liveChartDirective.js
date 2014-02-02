'use strict';

angular.module('app')
   .directive('hcLive', function() {
        return {
            restrict: 'C',
            replace: true,
            scope: {
                items: '='
            },

            controller: function($scope, $element, $attrs) {
                
            },
            template: '<div><div id="liveChart" style="margin: 0 auto">not working</div>\
                <button ng-click="printClick()">Print</button><button ng-click="exportPdf()">PDF</button></div>',
            link: function(scope, element, attrs, controller) {
              
                var liveChart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'liveChart',
                        type: 'spline',
                        animation: Highcharts.svg, // don't animate in old IE
                        marginRight: 10,
                        events: {
                            load: function() {}
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
                        type: 'spline',
                        name: 'Random data',
                        data: scope.items
                    }]

                });

                scope.$watch("items", function(newValue) {
                    liveChart.series[0].setData(newValue, true);
                }, true);

                scope.printClick = function(){
                    liveChart.print();
                }

                scope.exportPdf = function(){
                    liveChart.exportChart({type: 'application/pdf', filename: 'my-pdf'}, {subtitle: {text:''}});
                }
            }
        };
    })
    .directive('hcPie', function() {
        return {
            restrict: 'C',
            replace: true,
            scope: {
                items: '='
            },
            controller: function($scope, $element, $attrs) {


            },
            template: '<div id="container" style="margin: 0 auto">not working</div>',
            link: function(scope, element, attrs) {
                console.log("hcPie link called")
                console.log(3);
                var chart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'container',
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false
                    },
                    title: {
                        // must change to dynamic
                        text: 'Work Comps by '
                        //scope.title
                    },
                    exporting: {
                        enabled: true
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage}% - {point.y}/{point.total}  </b>',
                        percentageDecimals: 1
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                color: '#000000',
                                connectorColor: '#000000',
                                percentageDecimals: 1,
                                formatter: function() {
                                    //return '<b>' + this.point.name + '</b>: ' + this.percentage + ' %';
                                    //return '<b>' + this.point.name + '</b>: '  +Math.round(this.percentage)+ ' %';
                                    return '<b>' + this.point.name + '</b>: ' + this.percentage.toFixed(1) + ' %';

                                }
                            }
                        }
                    },
                    series: [{
                        type: 'pie',
                        name: 'WorkerComp',
                        data: scope.items
                    }]
                });
                scope.$watch("items", function(newValue) {
                    chart.series[0].setData(newValue, true);
                    chart.setTitle({
                        text: 'Worker\'s comp rrrrrr by ' + scope.$root.highchartTitle
                    });
                }, true);

            }
        }
    })
    
    .directive('myTable', function() {
        return function(scope, element, attrs) {

            // apply DataTable options, use defaults if none specified by user
            var options = {};
            if (attrs.myTable.length > 0) {
                options = scope.$eval(attrs.myTable);
            } else {
                options = {
                    "bStateSave": true,
                    "iCookieDuration": 2419200, /* 1 month */
                    "bJQueryUI": true,
                    "bPaginate": false,
                    "bLengthChange": false,
                    "bFilter": false,
                    "bInfo": false,
                    "bDestroy": true
                };
            }

            // Tell the dataTables plugin what columns to use
            // We can either derive them from the dom, or use setup from the controller           
            var explicitColumns = [];
            element.find('th').each(function(index, elem) {
                explicitColumns.push($(elem).text());
            });
            if (explicitColumns.length > 0) {
                options["aoColumns"] = explicitColumns;
            } else if (attrs.aoColumns) {
                options["aoColumns"] = scope.$eval(attrs.aoColumns);
            }

            // aoColumnDefs is dataTables way of providing fine control over column config
            if (attrs.aoColumnDefs) {
                options["aoColumnDefs"] = scope.$eval(attrs.aoColumnDefs);
            }
            
            if (attrs.fnRowCallback) {
                options["fnRowCallback"] = scope.$eval(attrs.fnRowCallback);
            }

            // apply the plugin
            var dataTable = element.dataTable(options);

            
            
            // watch for any changes to our data, rebuild the DataTable
            scope.$watch(attrs.aaData, function(value) {
                var val = value || null;
                if (val) {
                    dataTable.fnClearTable();
                    dataTable.fnAddData(scope.$eval(attrs.aaData));
                }
            });
        };
    });