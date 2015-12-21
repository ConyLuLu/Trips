/**
 * Created by Sandeep on 11/09/14.
 */
angular.module('todoApp.controllers',['ng-mfb','ngCordova']).controller('TodoListController',function($ionicPopover,$scope,Todo){
    
      
    var currentUser = Parse.User.current().id;
    Todo.getTrips(currentUser).success(function(data){
      //$scope.getTrips();
      for (var i = 0; i < data.results.length; i++) {
          if (data.results[i].Img_File !== undefined) {
            data.results[i].imgURL = data.results[i].Img_File.name;
          }
          else {
            data.results[i].imgURL = undefined;
            console.log("in else");
          }

      };

      $scope.items = data.results;
    });

    $ionicPopover.fromTemplateUrl('setTrip.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.popover = popover;
    });

    $scope.openPopover = function($event, item) {
      $scope.item = item;
      $scope.popover.show($event);
    };
    $scope.onItemDelete=function(item){

        Todo.delete(item.objectId);
        $scope.items.splice($scope.items.indexOf(item),1);
        $scope.popover.hide();

    }

}).controller('LocationListController',['$scope','Todo','$stateParams',function($scope,Todo,$stateParams){

    $scope.tripId = $stateParams.id;
    Todo.getLocations($scope.tripId).success(function(data){
        for (var i = 0; i < data.results.length; i++) {
          if (data.results[i].Img_File !== undefined) {
            data.results[i].imgURL = data.results[i].Img_File.name;
          }
          else {
            data.results[i].imgURL = undefined;
            console.log("in else");
          }

      };
        $scope.items=data.results;
    });

    $scope.onItemDelete=function(item){
        Todo.deleteLocation(item.objectId);
        $scope.items.splice($scope.items.indexOf(item),1);

    }

}]).controller('TodoCreationController',function($scope,Todo,$state,$cordovaCamera,$stateParams){

    $scope.trip={};
    var currentUser = Parse.User.current().id;

    $scope.takePicture = function () {
        var options = {
          quality: 100,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 300,
          targetHeight: 300,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false
        };
   
        $cordovaCamera.getPicture(options).then(function (imageData) {
           $scope.imgURI = "data:image/jpeg;base64," + imageData;
           $scope.imageData = imageData;
            }, function (err) {
           // An error occured. Show a message to the user
        });
    }
    $scope.uploadPhoto = function(){

        var trip = Parse.Object.extend("Todo");
        var newTrip = new trip();
          // Creates parse file object you'll notice that you have to convert 
          // $scope.imageData to a base 64 object. 
        var parseFile = new Parse.File('mypic.jpeg',{base64:$scope.imageData});
        newTrip.set("Img_File",parseFile);
        newTrip.set("content",$scope.trip.content);
        newTrip.set("tripName",$scope.trip.tripName);
        newTrip.set("startAt",$scope.trip.startAt);
        newTrip.set("endAt",$scope.trip.endAt);
        newTrip.set("createdBy", currentUser);
        newTrip.save(null,{success:function(){$state.go('locations');},
          error: function(error){
            alert("error");
          // do whatever 
          }
        });
        console.log(parseFile);
    }
     $scope.create=function(){
        $scope.uploadPhoto();
    }    
}).controller('LocationCreationController',function($scope,Locations,$state,$cordovaCamera,$stateParams,$http){

    var currentTrip = $stateParams.tripId;
    var currentUser = Parse.User.current();
    $scope.loc={};

    $scope.create=function(){
        $scope.uploadPhoto();
    }
    
    $scope.takePicture = function () {
        var options = {
          quality: 100,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 300,
          targetHeight: 300,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false
        };
   
        $cordovaCamera.getPicture(options).then(function (imageData) {
           $scope.imgURI = "data:image/jpeg;base64," + imageData;
           $scope.imageData = imageData;
            }, function (err) {
           // An error occured. Show a message to the user
        });
    }

    $scope.uploadPhoto = function(){

      var trip = Parse.Object.extend("Locations");
      var newTrip = new trip();
      var parseFile = new Parse.File('mypic.jpeg',{base64:$scope.imageData});
      newTrip.set("Img_File",parseFile);
      newTrip.set("place",$scope.loc.place);
      newTrip.set("date",$scope.loc.date);
      newTrip.set("time",$scope.loc.time);
      newTrip.set("createdBy", currentUser);
      newTrip.set("TripId", currentTrip);
      newTrip.save(null,{success:function(){ $state.go('locations'); },
        error: function(error){
          alert("error");
        // do whatever 
        }

      });

    } 
    //Get Location
    var url = "http://163.21.235.61/~koi/getLocation.php?lat=25.03925&lng=121.525&radius=500";
    $http.get(url).then(function(response) {$scope.names = response.data.results;});
}).controller('TodoEditController',['$scope','Todo','$state','$stateParams',function($scope,Todo,$state,$stateParams){
    
    $scope.trip={
        id:$stateParams.id,
        tripName:$stateParams.tripName,
        startAt:$stateParams.startAt,
        endAt:$stateParams.endAt,
        content:$stateParams.content
      };

          console.log($scope.trip.startAt);
    $scope.edit=function(){
        Todo.edit($scope.trip.id,{
            tripName:$scope.trip.tripName,
            startAt:$scope.trip.startAt,
            endAt:$scope.trip.endAt,
            content:$scope.trip.content
          }).success(function(data){
            $state.go('todos');
        });
    };

    $scope.takePicture = function () {
        var options = {
          quality: 100,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 300,
          targetHeight: 300,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false
        };
   
        $cordovaCamera.getPicture(options).then(function (imageData) {
           $scope.imgURI = "data:image/jpeg;base64," + imageData;
           $scope.imageData = imageData;
            }, function (err) {
           // An error occured. Show a message to the user
        });
    }

}]).controller('LocationEditController',function($scope,Todo,$state,$stateParams,$http,$cordovaCamera){
    
    $scope.location={
        imgURL: "http://files.parsetfss.com/c2409cf6-d996-44ce-9d74-930211741549/" + $stateParams.imgURL,
        id:$stateParams.id,
        place:$stateParams.place,
        date:$stateParams.date,
        time:$stateParams.time
      };
      console.log($scope.location.imgURL);
    var lat = "25.03925";
    var lng = "121.525";
    var url = "http://163.21.235.61/~koi/getLocation.php?lat=25.03925&lng=121.525&radius=500";
    $http.get(url).then(function(response) {$scope.names = response.data.results;});

    $scope.editLocation=function(){
        Todo.editLocation($scope.location.id,{
            place:$scope.location.place,
            date:$scope.location.date,
            time:$scope.location.time
          }).success(function(data){
            $state.go('locations');
        });
    };

    $scope.takePicture = function () {
        var options = {
          quality: 100,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 300,
          targetHeight: 300,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false
        };
   
        $cordovaCamera.getPicture(options).then(function (imageData) {
           $scope.location.imgURL = "data:image/jpeg;base64," + imageData;
           $scope.imageData = imageData;
            }, function (err) {
           // An error occured. Show a message to the user
        });
    }
    $scope.uploadPhoto = function(){

      var trip = Parse.Object.extend("Locations");
      var newTrip = new trip();
      var parseFile = new Parse.File('mypic.jpeg',{base64:$scope.imageData});
      newTrip.set("Img_File",parseFile);
      newTrip.save(null,{success:function(){ $state.go('locations'); },
        error: function(error){
          alert("error");
        // do whatever 
        }

      });

    }

}).controller('LoginCtrl', function($scope, $state) {
 
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
          //alert("success!");
          $state.go('todos');
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
          //alert("success!");
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
      scope: $scope
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
  }).controller('MapCtrl', function($scope, $state, $cordovaGeolocation) {
        
        var options = {timeout: 10000, enableHighAccuracy: true};
 
        $cordovaGeolocation.getCurrentPosition(options).then(function(position){
 
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
        var mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
 
        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
           
        google.maps.event.addListenerOnce($scope.map, 'idle', function(){
 
        var marker = new google.maps.Marker({
            map: $scope.map,
            animation: google.maps.Animation.DROP,
            position: latLng
        });      
 
      });
    }, function(error){
      console.log("Could not get location");
  });
});