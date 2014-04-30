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

                scope.printClick = function() {
                    liveChart.print();
                }

                scope.exportPdf = function() {
                    liveChart.exportChart({
                        type: 'application/pdf',
                        filename: 'my-pdf'
                    }, {
                        subtitle: {
                            text: ''
                        }
                    });
                }
            }
        };
    })
//
.directive('hcDidcalls', function() {
    return {
        restrict: 'C',
        replace: true,
        scope: {
            items: '=',
            categories: '=',
        },

        controller: function($scope, $element, $attrs) {

        },
        template: '<div><div id="callsDidChart" style="margin: 0 auto">not working</div>\
                <button ng-click="printClick()">Print</button><button ng-click="exportPdf()">PDF</button></div>',
        link: function(scope, element, attrs, controller) {
            var didCallsChart = new Highcharts.Chart({
                chart: {
                    type: 'column',
                    renderTo: 'callsDidChart',
                    marginRight: 10,
                    events: {
                        load: function() {}
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                            style: {
                                textShadow: '0 0 3px black, 0 0 3px black'
                            }
                        }
                    }
                },
                series: [{
                    name: ' ',
                    colorByPoint: false,
                    data: scope.chartDidCategories
                }],
                title: {
                    text: 'Calls by DID'
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
                    enabled: false
                },
                exporting: {
                    enabled: false
                },
                tooltip: {
                    formatter: function() {
                        return '<b> DID : ' + scope.categories[this.x] + '</b><br/>' +
                            'Calls : ' + this.y + ' <br/>';
                    }
                }

            });

            scope.$watch("items", function(newValue) {
                console.log("scope watch newValue " + JSON.stringify(newValue))
                didCallsChart.series[0].setData(newValue, true);
               
                
            }, true); 

            scope.printClick = function() {
                didCallsChart.print();
            }

            scope.exportPdf = function() {
                didCallsChart.exportChart({
                    type: 'application/pdf',
                    filename: 'my-pdf'
                }, {
                    subtitle: {
                        text: ''
                    }
                });
            }
        }
    };
})
//
.directive('hcPeerincalls', function() {
    return {
        restrict: 'C',
        replace: true,
        scope: {
            items: '=',
            categories: '=',
        },

        controller: function($scope, $element, $attrs) {

        },
        template: '<div><div id="incallsPeerChart" style="margin: 0 auto">not working</div>\
                <button ng-click="printClick()">Print</button><button ng-click="exportPdf()">PDF</button></div>',
        link: function(scope, element, attrs, controller) {
            var peerInCallsChart = new Highcharts.Chart({
                chart: {
                    type: 'column',
                    renderTo: 'incallsPeerChart',
                    marginRight: 10,
                    events: {
                        load: function() {}
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                            style: {
                                textShadow: '0 0 3px black, 0 0 3px black'
                            }
                        }
                    }
                },
                series: [{
                    name: ' ',
                    colorByPoint: true,
                    data: scope.categories
                }],
                title: {
                    text: 'Incomming Calls by Peer'
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
                    enabled: false
                },
                exporting: {
                    enabled: false
                },
                tooltip: {
                    formatter: function() {
                        return '<b> Peer : ' + scope.categories[this.x] + '</b><br/>' +
                            'Calls : ' + this.y + ' <br/>';
                    }
                }

            });

            scope.$watch("items", function(newValue) {
                peerInCallsChart.series[0].setData(newValue, true);
            }, true);

            scope.printClick = function() {
                peerInCallsChart.print();
            }

            scope.exportPdf = function() {
                peerInCallsChart.exportChart({
                    type: 'application/pdf',
                    filename: 'my-pdf'
                }, {
                    subtitle: {
                        text: ''
                    }
                });
            }
        }
    };
})
.directive('hcPeeroutcalls', function() {
    return {
        restrict: 'C',
        replace: true,
        scope: {
            items: '=',
            categories: '=',
        },

        controller: function($scope, $element, $attrs) {

        },
        template: '<div><div id="outcallsPeerChart" style="margin: 0 auto">not working</div>\
                <button ng-click="printClick()">Print</button><button ng-click="exportPdf()">PDF</button></div>',
        link: function(scope, element, attrs, controller) {
            var peerOutCallsChart = new Highcharts.Chart({
                chart: {
                    type: 'column',
                    renderTo: 'outcallsPeerChart',
                    marginRight: 10,
                    events: {
                        load: function() {}
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                            style: {
                                textShadow: '0 0 3px black, 0 0 3px black'
                            }
                        }
                    }
                },
                series: [{
                    name: ' ',
                    colorByPoint: true,
                    data: scope.categories
                }],
                title: {
                    text: 'Outgoing Calls by Peer'
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
                    enabled: false
                },
                exporting: {
                    enabled: false
                },
                tooltip: {
                    formatter: function() {
                        return '<b> Peer : ' + scope.categories[this.x] + '</b><br/>' +
                            'Calls : ' + this.y + ' <br/>';
                    }
                }

            });

            scope.$watch("items", function(newValue) {
                peerOutCallsChart.series[0].setData(newValue, true);
            }, true);

            scope.printClick = function() {
                peerOutCallsChart.print();
            }

            scope.exportPdf = function() {
                peerOutCallsChart.exportChart({
                    type: 'application/pdf',
                    filename: 'my-pdf'
                }, {
                    subtitle: {
                        text: ''
                    }
                });
            }
        }
    };
})

//
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
                "iCookieDuration": 2419200,
                /* 1 month */
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