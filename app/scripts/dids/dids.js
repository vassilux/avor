angular.module('dids', ['ui.bootstrap'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/dids', {
    templateUrl: 'scripts/dids/didsList.tpl.html',
    controller: 'DidsCtrl'

  });
}])

.controller('DidsCtrl', ['$rootScope', '$scope', '$http', '$templateCache', '$dialog', 'didsCrudService',
  function($rootScope, $scope, $http, $templateCache, $dialog, didsCrudService) {
  $scope.dids = [];

  var editDidDlgOpts = {
    controller: 'EditDidCtrl', 
    templateUrl: 'scripts/dids/didEdit.tpl.html'
  };

  var removeDidDlgOpts = {
    controller: 'RemoveDidCtrl',
    templateUrl: 'scripts/dids/didRemove.tpl.html'
  };

  var addDidDlgOpts = {
    controller: 'AddDidCtrl',
    templateUrl: 'scripts/dids/didAdd.tpl.html'
  };


  $scope.listDids = function() {
    didsCrudService.getDids(function(status, dids){
      //angular.copy($scope.dids, users); todo why not 
      $scope.dids = dids
    });
   
  }

  $scope.editDid = function(did) {
    var didToEdit = did;

    $dialog.dialog(angular.extend(editDidDlgOpts, {
      resolve: {
        didToEdit: function() {
          return angular.copy(didToEdit);
        }
      }
    })).open().then(function(result) {
      if(result) {
        angular.copy(result, didToEdit);
        didsCrudService.updateDid(didToEdit, function(status){
          didToEdit = undefined;
          $scope.listDids();
        });
        
      }else{
        didToEdit = undefined;
      }
    });
  };


$scope.removeDid = function(did) {
  var didToRemove = did;

    $dialog.dialog(angular.extend(removeDidDlgOpts, {
      resolve: {
        didToRemove: function() {
          return angular.copy(didToRemove);
        }
      }
    })).open().then(function(result) {
      if(result == 'ok') {
        didsCrudService.deleteDid(didToRemove, function(status){
          didToRemove = undefined;
          $scope.listDids();
        });
      }else{
        didToRemove = undefined;
      }

    });
}

$scope.addNewDid = function() {
  var didToAdd = {id: "", value: "", comment: ""};
  //
  $dialog.dialog(angular.extend(addDidDlgOpts, {
    resolve: {
      didToAdd: function() {
        return angular.copy(didToAdd);
      }
    }
  })).open().then(function(result) {
    if(result) {
      angular.copy(result, didToAdd);
      didsCrudService.addDid(didToAdd, function(status){
          didToAdd = undefined;
          $scope.listDids();
        });
    }else{
      didToAdd = undefined;
    }
    
  });   
    
}

$scope.listDids();

}])
//dialog and userToEdit injected by UsersCtrl
.controller('EditDidCtrl', ['$rootScope', '$scope', 'dialog', 'didToEdit' , function($rootScope, $scope, dialog, didToEdit ) {

  $scope.didToEdit = didToEdit;
  console.log("EditDidCtrl did to edit : " + JSON.stringify($scope.didToEdit))

  $scope.saveDid = function(did) {
    dialog.close($scope.didToEdit);
  }

  $scope.closeEditDid=function(){
    dialog.close(undefined);
  }


}])

//dialog and didToRemove injected by DidsCtrl
.controller('RemoveDidCtrl', ['$rootScope', '$scope', 'dialog', 'didToRemove' , function($rootScope, $scope, dialog, didToRemove ) {
  $scope.didToRemove = didToRemove;
  $scope.close = function(result){
    dialog.close(result);
  };

}])

//dialog and didToAdd injected by DidsCtrl
.controller('AddDidCtrl', ['$rootScope', '$scope', 'dialog', 'didToAdd' , function($rootScope, $scope, dialog, didToAdd ) {
  $scope.didToAdd = didToAdd;

  $scope.addDid=function(){
    dialog.close($scope.didToAdd);
  }

  $scope.close = function(result){
    dialog.close(undefined);
  };

}]);
