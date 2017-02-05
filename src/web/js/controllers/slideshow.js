app.controller('slideshowCtrl', function($scope, $rootScope, $http, $translate, $location, screen, ipcRenderer, app) {
  $scope.processing = false;
  var jobTimeout = null;
  var screensCount = screen.getAllDisplays().length;
  //if no item defined start to 0
  if(!$scope.settings.values.local.slideshow.currentItem){
    $scope.settings.values.local.slideshow.currentItem = 0;
  }

  //if change on startup is set // generate a first wallpaper
  if($scope.settings.values.local.slideshow.changeOnStartup === true){
    setTimeout(function(){
      setWallpaper();
    }, 3000);
  }

  ipcRenderer.on("wallpaperSet", function(event, wallpaper){
    $scope.processing = false;
    console.log("Wallpaper set");
    jobTimeout = setTimeout(function(){
      setWallpaper();
    }, 10000);
    if(!$scope.$$phase) {
      $scope.$apply();
    }

  });

  //generate an array of wallpapers based on the screens count
  //and send a query to the main process
  function setWallpaper(){

    var wallpapers = retreiveWallpapers();
    //stop if not wallpaper returned (error)
    if(!wallpapers || wallpapers.length === 0){
      return false;
    }

    $scope.processing = true;
    console.log("Processing wallpaper...");
    ipcRenderer.send("setWallpaper", wallpapers);
    if(!$scope.$$phase) {
      $scope.$apply();
    }
  }

  //retreive the array of wallpapers
  function retreiveWallpapers(){
    var r = [];
    var item = $scope.settings.values.local.slideshow.items[$scope.settings.values.local.slideshow.currentItem];
    if(!item){
      return false;
    }
    //retreive one image from the item for each screen
    if(item.type === "gallery"){
      var indexList = retreiveIndexForItem($scope.settings.values.gallery.wallpapers, "random", screensCount);
      for (var i = 0; i < indexList.length; i++) {
        var image = $scope.settings.values.gallery.wallpapers[indexList[i]];
        r.push(image);
      }
    }

    return r;

  }

  //send a list of indexs based on
  function retreiveIndexForItem(source, order, count){
    var repeat = false;
    var indexList = [];
    //repeat if the source can't afford the number of items asked
    if(source.length < count){
      repeat = true;
    }

    while (indexList.length < count) {
      //random
      var index = Math.floor(Math.random() * source.length);
      //continue if we can't have to same items and item is already in result
      if(!repeat && indexList.indexOf(index) !== -1){
        continue;
      }
      indexList.push(index);
    }

    return indexList;

  }

});