angular.module('starter.controllers', ['ngAnimate'])

.factory('User', function(){                                          // This factory stores information as a singleton so multiple controllers can access it
  return {id: []};
})

.controller('LoginCtrl', function($scope, $state, $ionicModal, $http, User) {

  $ionicModal.fromTemplateUrl('signUp-modal.html', {
    scope: $scope,
    animation: 'slide-in-left'
    }).then(function(modal) {
    $scope.modal = modal
    })

    $scope.openModal = function() {
      console.log("openModal called!");
      $scope.modal.show();
    }

    $scope.closeModal = function() {
      console.log("closeModal() called");
      $scope.modal.hide();
    };

    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });

  $scope.form = {};

  $scope.login = function() {
    console.log("login() called");
    console.log("DATA: ");
    console.log("email: " + $scope.form.email + " & password: " + $scope.form.password);
    $http({
      method: 'PUT',
      url: 'http://52.37.14.110/login',
      contentType: "application/json",
      data: {
        email: $scope.form.email,
        password: $scope.form.password
      }
    })
    .then(function(response) {
      console.log(response.data);
      $scope.loginSuccess = response.data.success;
      console.log("Success: " + $scope.loginSuccess);

      if($scope.loginSuccess == "true") {
        User.id = response.data.user_id;
        console.log("User.id: " + User.id);
        $state.go("app.feed");
      } else {
        $scope.messageDB = response.data.messageDB;
        alert("Login Failed: " + $scope.messageDB);
      }
    })

  }

  $scope.signUp = function() {
    console.log("signUp() called");
    console.log("DATA: ");
    console.log("email: " + $scope.form.newEmail + " & password: " + $scope.form.newPassword + " & phone: " + $scope.form.newPhone);
    $http({
      method: 'POST',
      url: "http://52.37.14.110/registration",
      data: {
        phone: $scope.form.newPhone,
        email: $scope.form.newEmail,
        password: $scope.form.newPassword
      }
    })
    .then(function(response) {
      console.log("<-- DATA -->");
      console.log(response.data);
    });
  }
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state) {
  $ionicModal.fromTemplateUrl('contact-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
    }).then(function(modal) {
    $scope.modal = modal
    })

    $scope.openModal = function() {
      console.log("openModal called!");
      $scope.modal.show();
    }

    $scope.closeModal = function() {
      console.log("closeModal() called");
      $scope.modal.hide();
    };

    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });

    $scope.diningHalls = [
      {text:"Arnold", checked:true},
      {text:"Umph", checked:true}
    ];

    $scope.displayHalls = true;
    $scope.toggleHalls = function() {
      console.log("toggleHalls() called");
      $scope.displayHalls = $scope.displayHalls === false ? true: false;
    };

    $scope.stations = [
      {text:"Bakery", checked:true},
      {text:"Grill", checked:true},
      {text:"Pizza", checked:true},
      {text:"Deli", checked:true},
      {text:"Home_zone", checked:true},
      {text:"Mongolian_grill", checked:true},
      {text:"Produce", checked:true},
      {text:"Soup", checked:true},
      {text:"Tex_Mex", checked:true},
      {text:"Healthy_on_the_Hilltop", checked:true},
      {text:"International", checked:true}
    ];

    $scope.displayStations = false;
    $scope.toggleStations = function() {
      console.log("toggleStations() called");
      $scope.displayStations = $scope.displayStations === false ? true: false;
    };

    $scope.filters = [
      {text:"Hot", checked:true},
      {text:"Cold", checked:true},
      {text:"Vegetarian", checked:true},
      {text:"Vegan", checked:true}
    ];
    $scope.displayTags = false;
    $scope.toggleTags = function() {
      console.log("toggleTags() called");
      $scope.displayTags = $scope.displayTags === false ? true: false;
    };

    $scope.newPost = function() {
      console.log("newPost() called");
      $state.go('app.post');
    }

})

.controller('PostCtrl', function($scope, $http) {
  $scope.takeImage = function() {
    console.log("takeImage() called");
    var options = {
        quality: 80,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 250,
        targetHeight: 250,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
        $scope.srcImage = "data:image/jpeg;base64," + imageData;
    }, function(err) {
        // error
    });
  }

  $scope.tags = [
    {text:"Hot", checked:false},
    {text:"Cold", checked:false},
    {text:"Vegetarian", checked:false},
    {text:"Vegan", checked:false}
  ];
  $scope.displayTags = false;
  $scope.showTags = function() {
    console.log("toggleTags() called");
    $scope.displayTags = $scope.displayTags === false ? true: false;
  };

  $scope.submitData = function() {
    console.log("Submit Data called (1)")
    var data = {
      title: $scope.newTitle,
      comment: $scope.newComment,
      dh_id: $scope.newDh_id,
      station_id: $scope.newStation_id,
      attribute_id: $scope.attribute_id,
      image: $scope.image
    };
    console.log("Submit Data called (2)")
    $http.post('http://52.37.14.110/entry', data)
      .success(function (response) {
          $scope.postResponse = response;
          console.log("Submit Data called (final)");
          console.log(response);
      })
      .error(function (response) {
          $scope.postResponse = response;
          console.log(response);
      });
  }
})

.factory('FeedData', function(){                                          // This factory stores information as a singleton so multiple controllers can access it
  return {data: []};
})

.controller('FeedCtrl', function($scope, $http, $state, FeedData, $stateParams, User) {
  console.log("Reached Feed.");
  console.log("User.id: " + User.id);

  $http.get("http://52.37.14.110/index")
  .then(function(response) {
      FeedData.data = response.data;
      $scope.feedData = FeedData.data;
      /*$scope.votes = $scope.feedData[0].votes;*/

      //DEBUGGING//
      console.log("Status = " + response.statusText);
      console.log($scope.feedData);
      /*console.log($scope.votes);*/
  });

  $scope.upvote = $scope.votes+1;
  $scope.downvote = $scope.votes-1;

  $scope.upVote = function() {
    console.log("upVote() called!");
    // var data = params({
    //         json: JSON.stringify({
    //             votes: $scope.upvote
    //         })
    // });
    $http.put("http://52.37.14.110/index", {
      votes: $scope.upvote
    }).success(function(data,status){
      $scope.votes = data;
      console.log($scope.votes);
    }).error(function(data, status){
      $scope.status = status;
      console.log($scope.status);
    });
    //put request changing ranking in database to one more
  }

  $scope.downVote = function() {
    console.log("downVote() called!");
    // var data = params({
    //         json: JSON.stringify({
    //             votes: $scope.downvote
    //         })
    // });
    $http.put("http://52.37.14.110/index", {
      votes: $scope.downvote
    }).success(function(data,status){
      $scope.votes = data;
      console.log($scope.votes);
    }).error(function(data, status){
      $scope.status = status;
      console.log($scope.status);
    });
    //Put request changing ranking in database to one less
  }
})


.controller('DetailsCtrl', function($scope, FeedData, $stateParams, $state, $location) {
  $scope.feedData = FeedData.data;
  $scope.selectedID = $stateParams.entry_id;
  if(!$scope.comments){
    $scope.comments = [];
  }
  $scope.comments = [];
  $scope.submitComment = function() {
    console.log("submitComment() called");
    console.log("with text: ");
    console.log($scope.newComment);
    if($scope.newComment != ''){
      $scope.comments.push(
        {id: $scope.selectedID, text: $scope.newComment}
      );
      $scope.newComment = '';
      console.log($scope.comments);
    }
    //reload page
  }
  console.log("Reached DetailsCtrl");
  //TEST INFORMATION//
})
