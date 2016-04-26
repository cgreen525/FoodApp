angular.module('starter.controllers', ['ngAnimate'])

.factory('User', function(){
  return {id: [], status: []};
})

.factory('FeedData', function(){

  return {data: []};
})

.factory('Filters', function() {
  return {data: []};
})

.controller('LoginCtrl', function($scope, $state, $ionicModal, $http, User) {

  $ionicModal.fromTemplateUrl('signUp-modal.html', {
    scope: $scope,
    animation: 'slide-in-right'
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


.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state, $http, User, Filters) {
  if(User.status=="0") {
    $state.go("login");
  }

  $ionicModal.fromTemplateUrl('filtersModal.html', {
    scope: $scope,
    animation: 'slide-in-up'
    }).then(function(modal) {
    $scope.modal = modal
    })

    $scope.openModal = function() {
      console.log("openModal called!");
      $scope.modal.show();
    };

    $scope.closeModal = function() {
      console.log("closeModal() called");
      $scope.modal.hide();
    };

    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });

    $scope.filterData = {
      "attribute_id":[],
      "station_id":[],
      "dh_id":[]
    };


    $scope.diningHalls = [
      {text:"Arnold", checked:true, value:1},
      {text:"Umph", checked:true, value:2}
    ];

    $scope.displayHalls = true;
    $scope.toggleHalls = function() {
      console.log("toggleHalls() called");
      $scope.displayHalls = $scope.displayHalls === false ? true: false;
    };

    $scope.stations = [
      {text:"Bakery", checked:true, value:"1"},
      {text:"Grill", checked:true, value:"2"},
      {text:"Pizza", checked:true, value:"3"},
      {text:"Deli", checked:true, value:"4"},
      {text:"Home Zone", checked:true, value:"5"},
      {text:"Mongolian Grill", checked:true, value:"6"},
      {text:"Produce", checked:true, value:"7"},
      {text:"Soup", checked:true, value:"8"},
      {text:"Tex Mex", checked:true, value:"9"},
      {text:"Healthy on the Hilltop", checked:true, value:"10"},
      {text:"International", checked:true, value:"11"},
      {text:"Salad Bar", checked:true, value:"12"}
    ];

    $scope.displayStations = true;
    $scope.toggleStations = function() {
      console.log("toggleStations() called");
      $scope.displayStations = $scope.displayStations === false ? true: false;
    };

    $scope.filters = [
      {text:"Hot", checked:true, value:1},
      {text:"Cold", checked:true, value:2},
      {text:"Vegetarian", checked:true, value:3},
      {text:"Vegan", checked:true, value:4}
    ];
    $scope.displayTags = true;
    $scope.toggleTags = function() {
      console.log("toggleTags() called");
      $scope.displayTags = $scope.displayTags === false ? true: false;
    };


    $scope.applyFilters = function(original) {
      /* pass data into filters factory */
      console.log("APPLY FILTERS CALLED");
      console.log("USERID: " + User.id);
      Filters.data = {};
      $scope.filterData = {
        "attribute_id":[],
        "station_id":[],
        "dh_id":[],
        "user_id": User.id
      };

      console.log(Filters.data);

      var i;
      for(i=0; i<4; i++){
        if($scope.filters[i].checked==true){
          $scope.filterData.attribute_id.push({"attribute":$scope.filters[i].value});
        }
      }
      for(i=0; i<12; i++){
        if($scope.stations[i].checked==true){
          $scope.filterData.station_id.push({"station":$scope.stations[i].value});
        }
      }
      for(i=0; i<2; i++){
        if($scope.diningHalls[i].checked==true){
          $scope.filterData.dh_id.push({"dh":$scope.diningHalls[i].value});
        }
      }

      $scope.filterData
      console.log("<--Filters.data AFTER-->");
      Filters.data = $scope.filterData;
      console.log(Filters.data);
      $state.go("app.post");
      $state.go("app.feed");
      if(!original){
        $scope.closeModal();
      }
    }

    $scope.openAccount = function() {
      $state.go("app.account");
    }
})


.controller('PostCtrl', function($scope, $http, User, $cordovaCamera, $state) {
  $scope.takeImage = function () {
    var options = {
      quality: 90,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 325,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function (imageData) {
        $scope.imgURI = "data:image/jpeg;base64," + imageData;
    }, function (err) {
        // An error occured. Show a message to the user
    });
  }

  $scope.diningHalls = [
    {text:"Arnold", checked:false, value:1},
    {text:"Umph", checked:false, value:2}
  ];

  $scope.stations = [
    {text:"Bakery", checked:false, value:1},
    {text:"Grill", checked:false, value:2},
    {text:"Pizza", checked:false, value:3},
    {text:"Deli", checked:false, value:4},
    {text:"Home Zone", checked:false, value:5},
    {text:"Mongolian Grill", checked:false, value:6},
    {text:"Produce", checked:false, value:7},
    {text:"Soup", checked:false, value:8},
    {text:"Tex Mex", checked:false, value:9},
    {text:"Healthy on the Hilltop", checked:false, value:10},
    {text:"International", checked:false, value:11},
    {text:"Salad Bar", checked:false, value:12}
  ];

  $scope.temps = [
    {text:"Hot", checked:false, value:1},
    {text:"Cold", checked:false, value:2}
  ];

  $scope.tags = [
    {text:"Vegetarian", checked:false, value:3},
    {text:"Vegan", checked:false, value:4}
  ];

  $scope.displayTags = false;

  $scope.showTags = function() {
    console.log("toggleTags() called");
    $scope.displayTags = $scope.displayTags === false ? true: false;
  };

  $scope.newPostForm = {};

  $scope.submitPicture = function() {
    cloudinary.v2.uploader.unsigned_upload("sample.jpg", "unsigned_1",
    { cloud_name: "demo" },
    function(error, result) {console.log(result) });
  }

  $scope.submitData = function() {
    console.log("submitData() called...");
    console.log("user_id: " + User.id);
    console.log("-- DATA --");
    console.log("title: " + $scope.newPostForm.title);
    console.log("newComment: " + $scope.newPostForm.comment);
    console.log("selectedDiningHall: " + $scope.newPostForm.selectedDiningHall);
    console.log("selectedStation: " + $scope.newPostForm.selectedStation);
    console.log("selectedTemp: " + $scope.newPostForm.selectedTemp);
    $scope.selectedTags = [];
    $scope.selectedTags.push({"attribute":$scope.newPostForm.selectedTemp})
    var i;
    for (i=0; i<2; i++) {
      if($scope.tags[i].checked==true){
        $scope.selectedTags.push({"attribute":$scope.tags[i].value})
      }
    }
    console.log("selectedTags: " + $scope.selectedTags);

    /* Post information to API */
    $http({
      method: 'POST',
      url: "http://52.37.14.110/entry",
      data: {
        title: $scope.newPostForm.title,
        comment: $scope.newPostForm.comment,
        dh_id: $scope.newPostForm.selectedDiningHall,
        station_id: $scope.newPostForm.selectedStation,
        attribute_id: $scope.selectedTags,
        image: $scope.image,
        user_id: User.id
      }
    }).then(function(response){
      console.log("<--Response from New Post call -->");
      console.log(response);
      $state.go("app.feed");
    });
  } /* end submitData() function */

})


.controller('FeedCtrl', function($scope, $http, $state, FeedData, $stateParams, $window, $location, User, $rootScope, Filters) {
  console.log("Reached Feed.");
  console.log("User.id: " + User.id);
  $scope.applyFilters(1);

  $rootScope.$on('$viewContentLoading', function(event, viewConfig){
    // Access to all the view config properties.
    // and one special property 'targetView'
    // viewConfig.targetView
    $http({
      method: 'POST',
      url: "http://52.37.14.110/filters",
      data: Filters.data
    })
    .then(function(response) {
          console.log(response);
          $scope.responseData=response.data;
          angular.forEach($scope.responseData,function(value,index){
                    value.votes = parseInt(value.votes);
                })
          FeedData.data = $scope.responseData;
          $scope.feedData = FeedData.data;

          //DEBUGGING//
          console.log("Status = " + response.statusText);
          console.log($scope.feedData);
      });
  });

  $scope.newPost = function() {
    console.log("newPost() called");
    $state.go('app.post');
  }

  $http({
    method: 'POST',
    url: "http://52.37.14.110/filters",
    data: Filters.data
  })
  .then(function(response) {
      console.log(response.data);
      $scope.responseData=response.data;
      angular.forEach($scope.responseData,function(value,index){
                value.votes = parseInt(value.votes);
            })
      console.log($scope.responseData);
      FeedData.data = $scope.responseData;
      $scope.feedData = FeedData.data;
      //DEBUGGING//
      console.log("Status = " + response.statusText);
      console.log($scope.feedData);
  });

  $scope.upVote = function(entryID, invotes) {
    console.log("upVote() called!");
    console.log(entryID);
    console.log(invotes);
    $scope.upvote = parseInt(invotes-0+1);

    console.log($scope.upvote);

    $http({
      method: 'PUT',
      url: "http://52.37.14.110/index",
      data: {
        votes: $scope.upvote,
        entry_id: entryID,
        user_id: User.id
      }
    })
    .then(function(response) {
      console.log("<-- DATA -->");
      console.log(response.data.success);
      if(response.data.success=="false"){
        alert("Sorry, you already voted up on this!");
      }
      console.log(response.data.votes);
      $http({
        method: 'POST',
        url: "http://52.37.14.110/filters",
        data: Filters.data
      })
      .then(function(response) {
          console.log(response.data);
          $scope.responseData=response.data;
          angular.forEach($scope.responseData,function(value,index){
                    value.votes = parseInt(value.votes);
                })
          console.log($scope.responseData);
          FeedData.data = $scope.responseData;
          $scope.feedData = FeedData.data;
          //DEBUGGING//
          console.log("Status = " + response.statusText);
          console.log($scope.feedData);
      });
    });
    $scope.upIsDisabled = true;
    $scope.downIsDisabled = false;
  }

  $scope.downVote = function(entryID, invotes) {
    console.log("downVote() called!");
    console.log(entryID);
    console.log(invotes);
    $scope.downvote = parseFloat(invotes-1);
    console.log($scope.downvote);
    $http({
      method: 'PUT',
      url: "http://52.37.14.110/index",
      data: {
        votes: $scope.downvote,
        entry_id: entryID,
        user_id: User.id
      }
    })
    .then(function(response) {
      console.log("<-- DATA -->");
      console.log(response.data.success);
      if(response.data.success=="false"){
        alert("Sorry, you already voted down on this!");
      }
      console.log(response.data.votes);
      $http({
        method: 'POST',
        url: "http://52.37.14.110/filters",
        data: Filters.data
      })
      .then(function(response) {
          console.log(response.data);
          $scope.responseData=response.data;
          angular.forEach($scope.responseData,function(value,index){
                    value.votes = parseInt(value.votes);
                })
          console.log($scope.responseData);
          FeedData.data = $scope.responseData;
          $scope.feedData = FeedData.data;
          //DEBUGGING//
          console.log("Status = " + response.statusText);
          console.log($scope.feedData);
      });
    });
    $scope.downIsDisabled = true;
    $scope.upIsDisabled = false;
  }
})


.controller('DetailsCtrl', function($http, $scope, FeedData, $stateParams, $state, $location, User, $rootScope) {
  $scope.feedData = FeedData.data;
  $scope.selectedID = $stateParams.entry_id;
  $scope.commentURL = "http://52.37.14.110/comment/" + $scope.selectedID;

  $http({
    method: 'GET',
    url: $scope.commentURL
  }).then(function(response){
    console.log("response.data: \n" + response.data);
    $scope.comments = response.data.comment;
    $scope.entryData = [];
    console.log("response.data.entry: \n" + response.data.entry);
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
          comment: $scope.newComment,
          user_id: User.id
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
        entry_id: $scope.selectedID,
        user_id: User.id
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
    $scope.upIsDisabled = true;
    $scope.downIsDisabled = false;
  }


  $scope.downVote = function() {
    console.log("downVote() called!");
    $http({
      method: 'PUT',
      url: "http://52.37.14.110/index",
      data: {
        votes: $scope.downvote,
        entry_id: $scope.selectedID,
        user_id: User.id
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
    $scope.downIsDisabled = true;
    $scope.upIsDisabled = false;
  }

  // var oldSoftBack = $rootScope.$ionicGoBack;
  //
  //   // override default behaviour
  // $rootScope.$ionicGoBack = function() {
  //   $http.get("http://52.37.14.110/index")
  //   .then(function(response) {
  //       FeedData.data = response.data;
  //       $scope.feedData = FeedData.data;
  //   });
  //   // uncomment below line to call old function when finished
  //   oldSoftBack();
  // };

  console.log("Reached DetailsCtrl");
})


.controller('AccountCtrl', function($http, $scope, User, $state) {
  $scope.userID = User.id;

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
