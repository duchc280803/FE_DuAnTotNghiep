myApp.controller("hoaDonChiTietController", function ($http, $scope) {
    const breadcrumbSteps = document.querySelectorAll('.breadcrumb__step');
    for (let i = 0; i < breadcrumbSteps.length; i++) {
      const item = breadcrumbSteps[i];
      item.onclick = () => {
        // Loại bỏ lớp 'breadcrumb__step--active' khỏi tất cả các breadcrumb
        breadcrumbSteps.forEach((step) => {
          step.classList.remove('breadcrumb__step--active');
        });
        
        // Đánh dấu breadcrumb hiện tại và tất cả các breadcrumb trước nó
        for (let j = 0; j <= i; j++) {
          breadcrumbSteps[j].classList.add('breadcrumb__step--active');
        }
      };
    }
});