angular.module('peers', ['ui.bootstrap'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/peers', {
    templateUrl: 'scripts/peers/peersList.tpl.html',
    controller: 'PeersCtrl'

  });
}])

.controller('PeersCtrl', ['$rootScope', '$scope', '$http', '$templateCache', '$dialog', 'peersCrudService',
  function($rootScope, $scope, $http, $templateCache, $dialog, peersCrudService) {
  $scope.peers = [];

  var editPeerDlgOpts = {
    controller: 'EditPeerCtrl',
    templateUrl: 'scripts/peers/peerEdit.tpl.html'
  };

  var removePeerDlgOpts = {
    controller: 'RemovePeerCtrl',
    templateUrl: 'scripts/peers/peerRemove.tpl.html'
  };

  var addPeerDlgOpts = {
    controller: 'AddPeerCtrl',
    templateUrl: 'scripts/peers/peerAdd.tpl.html'
  };


  $scope.listPeers = function() {
    peersCrudService.getPeers(function(status, peers){
      //angular.copy($scope.peers, users); todo why not 
      $scope.peers = peers
    });
   
  }

  $scope.editPeer = function(peer) {
    var peerToEdit = peer;

    $dialog.dialog(angular.extend(editPeerDlgOpts, {
      resolve: {
        peerToEdit: function() {
          return angular.copy(peerToEdit);
        }
      }
    })).open().then(function(result) {
      if(result) {
        angular.copy(result, peerToEdit);
        peersCrudService.updatePeer(peerToEdit, function(status){
          peerToEdit = undefined;
          $scope.listPeers();
        });
        
      }else{
        peerToEdit = undefined;
      }
    });
  };


$scope.removePeer = function(peer) {
  var peerToRemove = peer;

    $dialog.dialog(angular.extend(removePeerDlgOpts, {
      resolve: {
        peerToRemove: function() {
          return angular.copy(peerToRemove);
        }
      }
    })).open().then(function(result) {
      if(result == 'ok') {
        peersCrudService.deletePeer(peerToRemove, function(status){
          peerToRemove = undefined;
          $scope.listPeers();
        });
      }else{
        peerToRemove = undefined;
      }

    });
}

$scope.addNewPeer = function() {
  var peerToAdd = {id: "", value: "", comment: ""};
  //
  $dialog.dialog(angular.extend(addPeerDlgOpts, {
    resolve: {
      peerToAdd: function() {
        return angular.copy(peerToAdd);
      }
    }
  })).open().then(function(result) {
    if(result) {
      angular.copy(result, peerToAdd);
      peersCrudService.addPeer(peerToAdd, function(status){
          peerToAdd = undefined;
          $scope.listPeers();
        });
    }else{
      peerToAdd = undefined;
    }
    
  });   
    
}

$scope.listPeers();

}])
//
.controller('EditPeerCtrl', ['$rootScope', '$scope', 'dialog', 'peerToEdit' , function($rootScope, $scope, dialog, peerToEdit ) {

  $scope.peerToEdit = peerToEdit;
  console.log("EditPeerCtrl peer to edit : " + JSON.stringify($scope.peerToEdit))

  $scope.savePeer = function(peer) {
    dialog.close($scope.peerToEdit);
  }

  $scope.closeEditPeer=function(){
    dialog.close(undefined);
  }


}])
//
.controller('RemovePeerCtrl', ['$rootScope', '$scope', 'dialog', 'peerToRemove' , function($rootScope, $scope, dialog, peerToRemove ) {
  $scope.peerToRemove = peerToRemove;
  $scope.close = function(result){
    dialog.close(result);
  };

}])

//dialog and peerToAdd injected by PeersCtrl
.controller('AddPeerCtrl', ['$rootScope', '$scope', 'dialog', 'peerToAdd' , function($rootScope, $scope, dialog, peerToAdd ) {
  $scope.peerToAdd = peerToAdd;

  $scope.addPeer=function(){
    dialog.close($scope.peerToAdd);
  }

  $scope.close = function(result){
    dialog.close(undefined);
  };

}]);
