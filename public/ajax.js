//購物車的增減
function cart(obj){
  var cartItemId = parseInt($(obj).parent().siblings("#cart-item-id").val())
  var totalPrice = $("#totalPrice").children()
  var totalQty = $("#totalQty")
  //數量
  var num = parseInt($(obj).siblings("#num").val())
  var showNum = $(obj).siblings("#num")
  //某商品的價格
  var price = parseInt($(obj).parent().prev().children().text())
  //某商品的總價
  var subTotalPrice = $(obj).parent().next().children()

  if ($(obj).val() === 'minus') {
    if (num > 1) {
      num -= 1
      $.ajax({
        method: 'POST',
        url: '/cart',
        data: { cartItemId, num },
        dataType: 'text',
        
        success: function(response) {
          //總量
          showNum.val(num)
          //某商品的總價
          const minSubAmount = parseInt(subTotalPrice.text()) - price
          subTotalPrice.text(minSubAmount)
          //購物車商品的總價
          const minTotalAmount = parseInt(totalPrice.text()) - price
          totalPrice.text(minTotalAmount)
          //購物車商品的總數量
          const minTotal = parseInt(totalQty.text()) - 1
          totalQty.text(minTotal)
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
    num += 1

    $.ajax({
      method: 'POST',
      url: '/cart',
      data: { cartItemId, num },
      dataType: 'text',
      
      success: function(response) {
        showNum.val(num)
        const plusSubAmount = parseInt(subTotalPrice.text()) + price
        subTotalPrice.text(plusSubAmount)
        const plusTotalAmount = parseInt(totalPrice.text()) + price
        totalPrice.text(plusTotalAmount)
        const plusTotal = parseInt(totalQty.text()) + 1
        totalQty.text(plusTotal)
      },
      error: function(err) {
        console.error(err)
      }
    })    
  }
  return false
}

function remove(obj) {
  var cartItemId = parseInt($(obj).parent().siblings("#cart-item-id").val())
  var totalPrice = $("#totalPrice").children()
  var totalQty = $("#totalQty")
  var subTotalPrice = parseInt($(obj).parents("td .subtotalPrice").children().text())
  var subTotalQty = parseInt($(obj).parents("td").find(".cart").val())
  //右側購物車
  var rightQty = parseInt($(obj).parent().siblings(".right-add-min-button").find(".cart").val())
  var rightPrice = parseInt($(obj).parent().siblings("p").children().text())
  var rightTotalPrice = rightQty * rightPrice
  $.ajax({
    method: 'POST',
    url: '/cart/remove',
    data: { cartItemId },
    dataType: 'text',
    success: function(response) {
      $(obj).parent().parent().parent().remove()
      let minusAmount
      if(isNaN(rightTotalPrice)){
        minusAmount = parseInt(totalPrice.text()) - subTotalPrice
      }
      else {
        //右側購物車
        minusAmount = parseInt(totalPrice.text()) - rightTotalPrice
      }
      totalPrice.text(minusAmount)
      const minusQty = parseInt(totalQty.text()) - subTotalQty
      totalQty.text(minusQty)

      alert('The item has been removed form the cart!')
    },
    error: function(err) {
      console.log(err)
    }
  })
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