'use strict';

angular.module('app')
   
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

.directive('cdrTable1', function() {
    return{
        restrict: 'E, A, C',
        link : function(scope, element, attrs, controller){
            var dataTable = element.dataTable(scope.options);

            scope.$watch('options.aaData', handleModelUpdates, true);

            function handleModelUpdates(newData){
                var data = newData || null;
                if(data){
                    dataTable.fnClearTable();
                    dataTable.fnAddData(data);
                }
            }
        },
        scope: {
            options: "="
        }

    };
});
