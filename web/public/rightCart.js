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
  var cartItemId = parseInt($("#cart-item-id").val())
  var totalPrice = $("#totalPrice").children()
  var totalQty = $("#totalQty")
  var subTotalPrice = parseInt($(obj).closest("td").siblings(".subtotalPrice").children().text())
  var subTotalQty = parseInt($(obj).closest("td").siblings(".subTotalQty").children("#num").val())
  //右側購物車
  var rightQty = parseInt($(obj).parent().siblings(".right-add-min-button").children("#num").val())
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

//右側購物車
$.ajax({
  method: 'GET',
  url: '/rightCart',
  dataType: 'text',
  success: function(data) {
    let source = $('#template').html()
    let templateMissions = Handlebars.compile(source)
    data = JSON.parse(data)

    if (!data.items) {
      $('#cartFooter').html(`
        <a type="button" class="btn btn-secondary" href="/" style="text-decoration: none;">Keep Shopping</a>
      `)

      $('#cartBody').append(`
      <div>
        <p>The cart is empty.</p>
      </div>
      `)
    }
    else {
      for (let cartItem of data.items) {
        let dataStamp = {
          image: cartItem.image,
          name: cartItem.name,
          price: cartItem.price,
          id: cartItem.id,
          quantity: cartItem.quantity,
          cartItemId: cartItem.cartItemId
        }
      
        let template = templateMissions(dataStamp)
        $('#cartBody').append(template)

        $('#cartFooter').html(`
        <div class="div-subtotal">
          <h6 class="total">Total: </h6>
          <p class="total" id="totalPrice" style="display: inline;">$<span>${data.totalPrice}</span></p>
        </div>
        <form action="/cart" method="GET">
          <input type="hidden" name="redirect" value="check">
          <button type="submit" class="btn btn-secondary">check out</button>
        </form>
        `)
      } 
    }
  },
  error: function(err) {
    console.error(err)
  }
})