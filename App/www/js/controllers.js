angular.module('starter.controllers', ['ngAnimate'])

.factory('User', function(){
  return {id: [], status: []};
})

.controller('LoginCtrl', function($scope, $state, $ionicModal, $http, User) {

  $ionicModal.fromTemplateUrl('signUp-modal.html', {
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
        User.status="1";
        console.log("User.id: " + User.id);
        console.log("User.status: " + User.status);
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
      console.log(response.data);
      $scope.loginSuccess = response.data.success;
      console.log("Success: " + $scope.loginSuccess);
      if($scope.loginSuccess == "true") {
        User.id = response.data.user_id;
        User.status="1";
        console.log("User.id: " + User.id);
        console.log("User.status: " + User.status);
        $scope.closeModal();
        $state.go("app.feed");
      } else {
        $scope.messageDB = response.data.messageDB;
        alert("Login Failed: " + $scope.messageDB);
      }
    });
  }
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state, $http, User) {
  if(User.status=="0") {
    $state.go("login");
  }

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

    $scope.logout = function() {
      console.log("logout() called");
      console.log("DATA: ");
      console.log("user_id: " + User.id);
      $http({
        method: 'PUT',
        url: 'http://52.37.14.110/logout',
        contentType: "application/json",
        data: {
          user_id: User.id
        }
      })
      .then(function(response) {
        console.log(response.data);
        $scope.loginSuccess = response.data.success;
        console.log("Success: " + $scope.loginSuccess);

        if($scope.loginSuccess == "true") {
          console.log("Logged out");
          User.status="0";
          console.log("User.status: " + User.status);
          User.id="";
          console.log("User.id: " + User.id);
          $state.go("login");
        } else {
          $scope.messageDB = response.data.messageDB;
          alert("Logout Failed: " + $scope.messageDB);
        }
      })
    }

})

.controller('PostCtrl', function($scope, $http, User) {
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
    $http({
      method: 'POST',
      url: "http://52.37.14.110/entry",
      data: {
        title: $scope.newTitle,
        comment: $scope.newComment,
        dh_id: $scope.newDh_id,
        station_id: $scope.newStation_id,
        attribute_id: $scope.attribute_id,
        image: $scope.image,
        user_id: User.id
      }
    }).then(function(response){
      console.log(response);
    });
  }
})

.factory('FeedData', function(){
  return {data: []};
})

.controller('FeedCtrl', function($scope, $http, $state, FeedData, $stateParams, $window, $location, User) {
  console.log("Reached Feed.");
  console.log("User.id: " + User.id);

  $http.get("http://52.37.14.110/index")
  .then(function(response) {
      FeedData.data = response.data;
      $scope.feedData = FeedData.data;

      //DEBUGGING//
      console.log("Status = " + response.statusText);
      console.log($scope.feedData);
  });

  $scope.upvote = $scope.votes+1;
  $scope.downvote = $scope.votes-1;
  console.log($scope.upvote);
  console.log($scope.downvotevote);

  $scope.upVote = function() {
    console.log("upVote() called!");
    $http({
      method: 'PUT',
      url: "http://52.37.14.110/index",
      data: {
        votes: $scope.upvote,
        entry_id: $scope.entry_id
      }
    })
    .then(function(response) {
      console.log("<-- DATA -->");
      console.log(response.data);
    });
    //put request changing ranking in database to one more
  }

  $scope.downVote = function() {
    console.log("downVote() called!");
    $http({
      method: 'PUT',
      url: "http://52.37.14.110/index",
      data: {
        votes: $scope.downvote,
        entry_id: $scope.entry_id
      }
    })
    .then(function(response) {
      console.log("<-- DATA -->");
      console.log(response.data);
    });
    //Put request changing ranking in database to one less
  }
})


.controller('DetailsCtrl', function($http, $scope, FeedData, $stateParams, $state, $location, User) {
  $scope.feedData = FeedData.data;
  $scope.selectedID = $stateParams.entry_id;
  $scope.commentURL = "http://52.37.14.110/comment/" + $scope.selectedID;

  $http({
    method: 'GET',
    url: $scope.commentURL
  }).then(function(response){
    $scope.comments = response.data.comment;
    $scope.entryData = [];
    $scope.entryData = response.data.entry[0];
    console.log("entryData: " + $scope.entryData);
    $scope.votes = $scope.entryData.votes;
    $scope.upvote = parseFloat($scope.votes) + 1;
    console.log($scope.upvote);
    $scope.downvote = $scope.votes - 1;
    console.log(response.data);
  });


  $scope.submitComment = function() {
    console.log("submitComment() called");
    console.log("with text: ");
    console.log($scope.newComment);
    if($scope.newComment != ''){
      $http({
        method: 'POST',
        url: "http://52.37.14.110/comment",
        data: {
          entry_id: $scope.selectedID,
          comment: $scope.newComment
        }
      }).then(function(response){
        console.log("<-- post success -->");
        console.log(response.data);
        $http({
          method: 'GET',
          url: $scope.commentURL
        }).then(function(response){
          console.log(response);
          $scope.$parent.comments = response.data.comment;
          $scope.entryData = [];
          $scope.entryData = response.data.entry[0];
          console.log("entryData: " + $scope.entryData);
          $scope.votes = $scope.entryData.votes;
          $scope.upvote = parseFloat($scope.votes) + 1;
          console.log($scope.upvote);
          $scope.downvote = $scope.votes - 1;
          console.log(response.data);
        });
      });
      $scope.newComment = '';
      console.log($scope.comments);
    }
  }



  $scope.upVote = function() {
    console.log("upVote() called!");
    $http({
      method: 'PUT',
      url: "http://52.37.14.110/index",
      data: {
        votes: $scope.upvote,
        entry_id: $scope.selectedID
      }
    })
    .then(function(response) {
      console.log("<-- DATA -->");
      console.log(response.data);
      $http({
        method: 'GET',
        url: $scope.commentURL
      }).then(function(response){
        $scope.comments = response.data.comment;
        $scope.entryData = [];
        $scope.entryData = response.data.entry[0];
        console.log("entryData: " + $scope.entryData);
        $scope.votes = $scope.entryData.votes;
        $scope.upvote = parseFloat($scope.votes) + 1;
        console.log($scope.upvote);
        $scope.downvote = $scope.votes - 1;
        console.log(response.data);
      });
    });
    //put request changing ranking in database to one more
  }


  $scope.downVote = function() {
    console.log("downVote() called!");
    $http({
      method: 'PUT',
      url: "http://52.37.14.110/index",
      data: {
        votes: $scope.downvote,
        entry_id: $scope.selectedID
      }
    })
    .then(function(response) {
      console.log("<-- DATA -->");
      console.log(response.data);
      $http({
        method: 'GET',
        url: $scope.commentURL
      }).then(function(response){
        $scope.comments = response.data.comment;
        $scope.entryData = [];
        $scope.entryData = response.data.entry[0];
        console.log("entryData: " + $scope.entryData);
        $scope.votes = $scope.entryData.votes;
        $scope.upvote = parseFloat($scope.votes) + 1;
        console.log($scope.upvote);
        $scope.downvote = $scope.votes - 1;
        console.log(response.data);
      });
    });
    //Put request changing ranking in database to one less
  }
  console.log("Reached DetailsCtrl");
})
