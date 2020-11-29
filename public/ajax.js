// $("#wishlist").on('submit', (e) => {
//   var that = $(this)
//   url = that.attr('action')
//   type = that.attr('method')
//   console.log(that)

//   console.log(url)
//   var productId = $(".product-id").val()
  
//   var userId = $(".user-id").val()

//   $.ajax({
//     method: 'POST',
//     url: '/favorite',
//     dataType: 'text',
//     data: { productId, userId },
//     success: function(response) {
//       console.log(response)
//       var product = $(".product-id")
//       window.location.href="{:url('index/index')
//       product.innerHTML = '<button class="btn btn-secondary"><i class="fas fa-heart fa-lg"></i> Already At Wishlist</button>'
//       console.log(product)
//     },
//     error: function(err) {
//       console.error(err)
//     }
//   })
//   console.log(product.innerHTML)
//   console.log(userId)
//   return false
// })

function min(obj){
  var cartId = $("#cartId").val()
  var totalPrice = $("#totalPrice")

  if ($(obj).val() === 'minus') {
    var productId = parseInt($(obj).prev().val())
    var num = parseInt($(obj).next().val())
    var price = parseInt($(obj).parent().prev().text())
    if (num > 1) {
      num = parseInt(num) - 1
      $.ajax({
        method: 'POST',
        url: '/cart',
        data: { cartId, productId, num },
        dataType: 'text',
        
        success: function(response) {
          var showNum = $(obj).next()
          showNum.val(num)
          const minAmount = parseInt(totalPrice.text()) - price
          totalPrice.text(minAmount)
          alert('減少成功')
        },
        error: function(err) {
          console.error(err)
        }
      })
    }
    else {
      alert('至少購買一件喔!')
    }
  }
  else if ($(obj).val() === 'plus') {
    var productId = parseInt($(obj).prev().prev().prev().val())
    var num = parseInt($(obj).prev().val())
    var price = parseInt($(obj).parent().prev().text())
   
    num = parseInt(num) + 1

    $.ajax({
      method: 'POST',
      url: '/cart',
      data: { cartId, productId, num },
      dataType: 'text',
      
      success: function(response) {
        var showNum = $(obj).prev()
        showNum.val(num)
        const plusAmount = parseInt(totalPrice.text()) + price
        totalPrice.text(plusAmount)
        alert('增加成功')
      },
      error: function(err) {
        console.error(err)
      }
    })
    
  }
  
  

  return false
}




$('#cart').unbind('click').click(() => {
  console.log('---------------------cart')
  var cartId = $("#cartId").val()
  var productId = $("#productId").val()
  var num = $("#num").val()
  if (num > 1) {
    num = parseInt(num) - 1
  }


  $.ajax({
    method: 'POST',
    url: '/cart',
    dataType: 'text',
    data: { cartId, productId, num },
    success: function(response) {
      var showNum = $("#right-num")
      //alert('已成功加入')
      showNum.val(num) 
      console.log(response)
    },
    error: function(err) {
      console.error(err)
    }
  })
})
