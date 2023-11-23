myApp.controller("loginController", function ($scope, $http, $window, $location) {
  // Tạo một biến mới để lưu tên người dùng
  $scope.loggedInUsername = "";

  var token = $window.localStorage.getItem("token");
  if (token) {
    $scope.isLoggedIn = true;
  } else {
    $scope.isLoggedIn = false;
  }

  // Lấy thông tin tên người dùng từ API hoặc từ localStorage (tùy thuộc vào cách bạn lưu trữ)
  var username = $window.localStorage.getItem("username");
  if (username) {
    $scope.loggedInUsername = username;
  }

  $scope.login = function () {
    var data = {
      username: $scope.username,
      password: $scope.password,
    };

    $http
      .post("http://localhost:8080/api/v1/auth/login", data)
      .then(function (response) {
        $window.localStorage.setItem("token", response.data.accessToken);
        $window.localStorage.setItem("role", response.data.role);
        $window.localStorage.setItem("username", response.data.username); // Lưu tên người dùng

        // ... (phần còn lại của hàm login)
        $location.path("/dashboard")
        // Cập nhật biến loggedInUsername khi đăng nhập thành công
        $scope.loggedInUsername = response.data.username;
        $window.location.reload();
      })
      .catch(function (error) {
        $scope.errorUsername = error.data.username;
        $scope.errorPassword = error.data.password;
      });
  };

  $scope.logout = function () {
    // Xóa token khỏi localStorage
    $window.localStorage.removeItem("token");
    $window.localStorage.removeItem("role");
    $window.localStorage.removeItem("username"); // Xóa tên người dùng khi đăng xuất
    $scope.isLoggedIn = false;
    $scope.loggedInUsername = ""; // Đặt giá trị về rỗng khi đăng xuất
  };
});