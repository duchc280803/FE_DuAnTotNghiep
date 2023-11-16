myApp.controller("homeController", function ($http, $scope) {
    $scope.listNewProduct = [];

    function listTop8NewProduct() {
        var url = `http://localhost:8080/api/public/home`;

        $http.get(url).then(function (response) {
            $scope.listNewProduct = response.data;
            console.log("Dữ liệu trả về: ", response.data);
            // Update currentPageNumber based on the response
        })
    }
    listTop8NewProduct();
});