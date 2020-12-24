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
        method: 'PUT',
        url: '/cart',
        data: { cartItemId, num },
        dataType: 'text',
        
        success: function() {
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
      method: 'PUT',
      url: '/cart',
      data: { cartItemId, num },
      dataType: 'text',
      
      success: function() {
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
    method: 'DELETE',
    url: '/cart',
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
      console.error(err)
    }
  })
  return false
}