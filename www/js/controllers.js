/**
 * Created by Sandeep on 11/09/14.
 */
angular.module('todoApp.controllers',['ng-mfb']).controller('TodoListController',['$scope','Todo',function($scope,Todo){

    Todo.getAll().success(function(data){
        $scope.items=data.results;
    });

    $scope.onItemDelete=function(item){
        Todo.delete(item.objectId);
        $scope.items.splice($scope.items.indexOf(item),1);
    }

}]).controller('TodoCreationController',['$scope','Todo','$state',function($scope,Todo,$state){

    $scope.trip={};

    $scope.create=function(){
        Todo.create({
          content:$scope.trip.content,
          tripName:$scope.trip.title,
          startAt:$scope.trip.startAt,
          endAt:$scope.trip.endAt
        }).success(function(data){
            $state.go('todos');
        });
    }


}]).controller('TodoEditController',['$scope','Todo','$state','$stateParams',function($scope,Todo,$state,$stateParams){

    $scope.todo={id:$stateParams.id,content:$stateParams.content};

    $scope.edit=function(){
        Todo.edit($scope.todo.id,{content:$scope.todo.content}).success(function(data){
            $state.go('todos');
        });
    }

}]).controller('LoginCtrl', function($scope, $state) {
 
  $scope.data = {};
 
  $scope.signupEmail = function(){
 
  //Create a new user on Parse
  var user = new Parse.User();
  user.set("username", $scope.data.username);
  user.set("password", $scope.data.password);
  user.set("email", $scope.data.email);
 
  // other fields can be set just like with Parse.Object
  user.set("somethingelse", "like this!");
 
  user.signUp(null, {
    success: function(user) {
      // Hooray! Let them use the app now.
      alert("success!");
    },
    error: function(user, error) {
      // Show the error message somewhere and let the user try again.
      alert("Error: " + error.code + " " + error.message);
    }
  });
 
};
 
  $scope.loginEmail = function(){
    Parse.User.logIn($scope.data.username, $scope.data.password, {
      success: function(user) {
        // Do stuff after successful login.
        console.log(user);
        alert("success!");
        $state.go('todos');
      },
      error: function(user, error) {
        // The login failed. Check error to see why.
        alert("error!");
      }
    });
  };
 
}).controller('MyTripCtrl', function($scope, $ionicModal, $state, $ionicHistory) {
  // No need for testing data anymore
  $scope.tasks = [];
  // Create and load the Modal
  $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  // Called when the form is submitted
  $scope.createTask = function(task) {
    $scope.tasks.push({
      title: task.title,
      startDate: task.startDate,
      endDate: task.endDate,
      image: "travel.jpg",
      comment: task.comment,
      like: false
    });
    $scope.taskModal.hide();
    task.title = "";
    task.startDate = "";
    task.endDate = "";
    task.comment = "";
  }

  // Open our new task modal
  $scope.newTask = function() {
    $scope.taskModal.show();
  }

  // Close the new task modal
  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  }

  $scope.like = function(task) {
    if (task.like == true)
      task.like = false;
    else 
      task.like = true;

  }
});