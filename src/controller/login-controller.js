myApp.controller(
  "loginController",
  function ($scope, $http, $window, $location) {
    var token = $window.localStorage.getItem("token");

    if (token) {
      $scope.isLoggedIn = true;
    } else {
      $scope.isLoggedIn = false;
    }

    $scope.login = function () {
      var data = {
        username: $scope.username,
        password: $scope.password,
      };

      $http.post("http://localhost:8080/api/v1/auth/login", data).then(
        function (response) {
          $window.localStorage.setItem("token", response.data.accessToken);
          $window.localStorage.setItem("role", response.data.role);
          if (response.data.role === "ADMIN") {
            $location.path('/dashboard');
          }
          if (response.data.role === "USER") {
            $location.path("/home");
          }
        }.catch(function (error) {
          $scope.errorUsername = error.data.username;
          $scope.errorPassword = error.data.password;
        })
      );
    };

    $scope.logout = function () {
      // Xóa token khỏi localStorage
      $window.localStorage.removeItem("token");
      $scope.isLoggedIn = false;
      // Chuyển hướng người dùng về trang đăng nhập
      window.location.href = "/src/pages/authentication-login.html";
    };
  }
);
