angular.module('users', ['ui.bootstrap'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/users', {
    templateUrl: 'scripts/users/usersList.tpl.html',
    controller: 'UsersCtrl'

  });
}])

.controller('UsersCtrl', ['$rootScope', '$scope', '$http', '$templateCache', '$dialog', 'usersCrudService',
  function($rootScope, $scope, $http, $templateCache, $dialog, usersCrudService) {
  $scope.users = [];

  var editUserDlgOpts = {
    controller: 'EditUserCtrl',
    templateUrl: 'scripts/users/userEdit.tpl.html'
  };

  var removeUserDlgOpts = {
    controller: 'RemoveUserCtrl',
    templateUrl: 'scripts/users/userRemove.tpl.html'
  };

  var addUserDlgOpts = {
    controller: 'AddUserCtrl',
    templateUrl: 'scripts/users/userAdd.tpl.html'
  };


  $scope.listUsers = function() {
    usersCrudService.getUsers(function(status, users){
      //angular.copy($scope.users, users); todo why not 
      $scope.users = users
    });
   
  }

  $scope.editUser = function(user) {
    var userToEdit = user;
    userToEdit.repeatPassword = "";
    $dialog.dialog(angular.extend(editUserDlgOpts, {
      resolve: {
        userToEdit: function() {
          return angular.copy(userToEdit);
        }
      }
    })).open().then(function(result) {
      if(result) {
        angular.copy(result, userToEdit);
        usersCrudService.updateUser(userToEdit, function(status){
          userToEdit = undefined;
          $scope.listUsers();
        });
        
      }else{
        userToEdit = undefined;
      }
    });
  };


$scope.removeUser = function(user) {
    var userToRemove = user;
    console.log("[removeuser]" + JSON.stringify(user));

    $dialog.dialog(angular.extend(removeUserDlgOpts, {
      resolve: {
        userToRemove: function() {
          return angular.copy(userToRemove);
        }
      }
    })).open().then(function(result) {
      console.log("[removeuser]" + result);
      if(result == 'ok') {
        usersCrudService.deleteUser(userToRemove, function(status){
          userToRemove = undefined;
          $scope.listUsers();
        });
      }else{
        userToRemove = undefined;
      }

    });
}

$scope.addNewUser = function() {
  var userToAdd = {userName: "", lastName: "", firstName: "", password: "", repeatPassword: "", admin: false};
  
  //
  $dialog.dialog(angular.extend(addUserDlgOpts, {
    resolve: {
      userToAdd: function() {
        return angular.copy(userToAdd);
      }
    }
  })).open().then(function(result) {
    if(result) {
      angular.copy(result, userToAdd);
      
      usersCrudService.addUser(userToAdd, function(status){
          userToAdd = undefined;
          $scope.listUsers();
        });
    }else{
      userToAdd = undefined;
    }
    
  });   
    
}

$scope.listUsers();

}])
//dialog and userToEdit injected by UsersCtrl
.controller('EditUserCtrl', ['$rootScope', '$scope', 'dialog', 'userToEdit' , function($rootScope, $scope, dialog, userToEdit ) {

  $scope.userToEdit = userToEdit;
  console.log("EditUserCtrl user to edit : " + JSON.stringify($scope.userToEdit))

  $scope.saveUser = function(user) {
    if(userToEdit.userName == "" || userToEdit.lastName == "" || userToEdit.firstName == "" ||
        userToEdit.password == "" || 
        userToEdit.repeatPassword != userToEdit.password ){
        return;
      }
    dialog.close($scope.userToEdit);
  }

  $scope.closeEditUser=function(){
    dialog.close(undefined);
  }


}])

//dialog and userToRemove injected by UsersCtrl
.controller('RemoveUserCtrl', ['$rootScope', '$scope', 'dialog', 'userToRemove' , function($rootScope, $scope, dialog, userToRemove ) {
  $scope.userToRemove = userToRemove;
  $scope.close = function(result){
    dialog.close(result);
  };

}])

//dialog and userToAdd injected by UsersCtrl
.controller('AddUserCtrl', ['$rootScope', '$scope', 'dialog', 'userToAdd' , 
  function($rootScope, $scope, dialog, userToAdd ) {
  $scope.userToAdd = userToAdd;

  $scope.addUser=function(){
    if(userToAdd.userName == "" || userToAdd.lastName == "" || userToAdd.firstName == "" ||
        userToAdd.password == "" || 
        userToAdd.repeatPassword != userToAdd.password ){
        return;
      }
    dialog.close($scope.userToAdd);
  }

  $scope.close = function(result){
    dialog.close(undefined);
  };

}]);
