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

//右側購物車的增減
function rightCart(obj){
  var cartId = $("#cartId").val()
  var totalPrice = $("#totalPrice")

  if ($(obj).val() === 'minus') {
    var productId = parseInt($(obj).prev().val())
    //數量
    var showNum = $(obj).next()
    var num = parseInt($(obj).next().val())
    //某商品的價格
    var price = parseInt($(obj).parent().prev().text())
    if (num > 1) {
      num -= 1
      $.ajax({
        method: 'POST',
        url: '/cart',
        data: { cartId, productId, num },
        dataType: 'text',
        
        success: function(response) {
          showNum.val(num)
          //購物車商品的總價
          const minAmount = parseInt(totalPrice.text()) - price
          totalPrice.text(minAmount)
          alert('Reduced!')
        },
        error: function(err) {
          console.error(err)
        }
      })
    }
    else {
      alert('Please at least buy one!')
    }
  }
  else if ($(obj).val() === 'plus') {
    var productId = parseInt($(obj).prev().prev().prev().val())
    var showNum = $(obj).prev()
    var num = parseInt($(obj).prev().val())
    var price = parseInt($(obj).parent().prev().text())
   
    num += 1

    $.ajax({
      method: 'POST',
      url: '/cart',
      data: { cartId, productId, num },
      dataType: 'text',
      
      success: function(response) {
        showNum.val(num)
        const plusAmount = parseInt(totalPrice.text()) + price
        totalPrice.text(plusAmount)
        alert('Added!')
      },
      error: function(err) {
        console.error(err)
      }
    })    
  }
  return false
}

//購物車的增減
function cart(obj){
  var cartId = $("#cartId").val()
  var totalPrice = $("#totalPrice").children()
  var totalQty = $("#totalQty")

  if ($(obj).val() === 'minus') {
    var productId = parseInt($(obj).prev().val())
    //數量
    var showNum = $(obj).next()
    var num = parseInt($(obj).next().val())
    //某商品的價格
    var price = parseInt($(obj).parent().prev().children().text())
    //某商品的總價
    var subTotalPrice = $(obj).parent().next().children()
    
    if (num > 1) {
      num -= 1
      $.ajax({
        method: 'POST',
        url: '/cart',
        data: { cartId, productId, num },
        dataType: 'text',
        
        success: function(response) {
          showNum.val(num)
          const minSubAmount = parseInt(subTotalPrice.text()) - price
          subTotalPrice.text(minSubAmount)
          //購物車商品的總價
          const minTotalAmount = parseInt(totalPrice.text()) - price
          totalPrice.text(minTotalAmount)
          //購物車商品的總數量
          const minTotal = parseInt(totalQty.text()) - 1
          totalQty.text(minTotal)
          alert('Reduced!')
        },
        error: function(err) {
          console.error(err)
        }
      })
    }
    else {
      alert('Please at least buy one!')
    }
  }
  else if ($(obj).val() === 'plus') {
    var productId = parseInt($(obj).prev().prev().prev().val())
    var showNum = $(obj).prev()
    var num = parseInt($(obj).prev().val())
    var price = parseInt($(obj).parent().prev().children().text())
    var subTotalPrice = $(obj).parent().next().children()
   
    num += 1

    $.ajax({
      method: 'POST',
      url: '/cart',
      data: { cartId, productId, num },
      dataType: 'text',
      
      success: function(response) {
        showNum.val(num)
        const plusSubAmount = parseInt(subTotalPrice.text()) + price
        subTotalPrice.text(plusSubAmount)
        const plusTotalAmount = parseInt(totalPrice.text()) + price
        totalPrice.text(plusTotalAmount)
        const plusTotal = parseInt(totalQty.text()) + 1
        totalQty.text(plusTotal)
        alert('Added!')
      },
      error: function(err) {
        console.error(err)
      }
    })    
  }
  return false
}


// $('#cart').unbind('click').click(() => {
//   console.log('---------------------cart')
//   var cartId = $("#cartId").val()
//   var productId = $("#productId").val()
//   var num = $("#num").val()
//   if (num > 1) {
//     num = parseInt(num) - 1
//   }


//   $.ajax({
//     method: 'POST',
//     url: '/cart',
//     dataType: 'text',
//     data: { cartId, productId, num },
//     success: function(response) {
//       var showNum = $("#right-num")
//       //alert('已成功加入')
//       showNum.val(num) 
//       console.log(response)
//     },
//     error: function(err) {
//       console.error(err)
//     }
//   })
// })
