 'use strict';

 angular.module('app')

     .directive('integer', function() {
         return {
             restrict: 'A',
             require: '?ngModel',
             link: function(scope, elem, attr, ngModel) {
                 if (!ngModel)
                     return;

                 function isValid(val) {
                     if (val === "")
                         return true;

                     var asInt = parseInt(val, 10);
                     if (asInt === NaN || asInt.toString() !== val) {
                         return false;
                     }

                     var min = parseInt(attr.min);
                     if (min !== NaN && asInt < min) {
                         return false;
                     }

                     var max = parseInt(attr.max);
                     if (max !== NaN && max < asInt) {
                         return false;
                     }

                     return true;
                 }

                 var prev = scope.$eval(attr.ngModel);
                 ngModel.$parsers.push(function(val) {
                     // short-circuit infinite loop
                     if (val === prev)
                         return val;

                     if (!isValid(val)) {
                         ngModel.$setViewValue(prev);
                         ngModel.$render();
                         return prev;
                     }

                     prev = val;
                     return val;
                 });
             }
         };
     });