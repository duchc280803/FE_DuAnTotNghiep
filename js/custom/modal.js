var isModalShown = false;
    
    $('#exampleModal').on('shown.bs.modal', function () {
      isModalShown = true;
    });
    
    $('#exampleModal').on('hidden.bs.modal', function () {
      isModalShown = false;
    });
    
    function changeModalTarget() {
      if (isModalShown) {
        $('#exampleModal1').modal('show');
      }
    }