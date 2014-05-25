angular.module('authentication.currentUser', [])

// The current user.  You can watch this for changes due to logging in and out
.factory('currentUser', function() {
  var currentUser = {
    userInfo: null,
    update: function(info) { currentUser.userInfo = info; },
    clear: function() { currentUser.userInfo = null; },
    info: function() { return currentUser.userInfo; },
    isAuthenticated: function(){ 
    	if(currentUser.userInfo != undefined && currentUser.userInfo.token != undefined && currentUser.userInfo.token != ""){
    		return true;
    	}
    	return false;
    },
    isAdmin: function() { return !!(currentUser.userInfo && currentUser.userInfo.isAdmin ); },
    
    hasRigthsFeature: function(feature){
      if(currentUser.isAdmin()){
        return true
      }
      return false
    }
  };
  return currentUser;
});

