'use strict';

angular.module('app')
    .directive('yearlydatepicker', [ '$filter', function($filter) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {
                ngModel.$parsers.push(function(data){
                    return data;
                });

                ngModel.$formatters.push(function(data){
                    var dt = $filter('date')(data, 'yyyy');
                    console.log(" ngModel formatters "  + dt);
                    return dt
                });



                var monthpicker = $(element).datepicker({
                    changeYear: true,
                    dateFormat: 'yy',
                    showButtonPanel: true,
                    yearRange: '2010:-0',
                    onChangeMonthYear: function(year, month, inst){
                        var date = new Date(year, month - 1, 1);
                        $(this).val($.datepicker.formatDate('yy',date))
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
                     $(".ui-datepicker-month").hide();
                })
            }
        };
    }
    ]);