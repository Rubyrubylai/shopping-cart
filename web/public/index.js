var num = document.getElementById('num')
var plus = document.getElementById('plus')
var min = document.getElementById('min')
plus.onclick = function() {
  num.value = parseInt(num.value) + 1
}
min.onclick = function() {
  if (num.value > 1) {
    num.value = parseInt(num.value) - 1
  }
  else {
    alert('至少購買一件喔!')
  }
}

