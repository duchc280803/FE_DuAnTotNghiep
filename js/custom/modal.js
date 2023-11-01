function increment() {
  var input = document.getElementById("quantityInput");
  input.value = parseInt(input.value) + 1;
}

function decrement() {
  var input = document.getElementById("quantityInput");
  if (parseInt(input.value) > 1) {
    input.value = parseInt(input.value) - 1;
  }
}