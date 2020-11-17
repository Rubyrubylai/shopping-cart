window.onload = function(){ //這裡是加減按鈕都啟用的情況
  var num = document.getElementById('num')
  var add = document.getElementById('add')
  var min = document.getElementById('min')
  add.onclick = function() {
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
}

