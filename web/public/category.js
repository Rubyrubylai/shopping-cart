$.ajax({
  method: 'GET',
  url: '/category',
  dataType: 'text',
  success: function(data) {
    data = JSON.parse(data)

    for (let category of data.categories) {
      $('#categoryNavbar').append(`
      <form action="/products" method="GET">
        <button type="submit" class="dropdown-item" name="CategoryId" value="${category.id}">${category.name}</button>
      </form>
      `)
    } 
  },
  error: function(err) {
    console.error(err)
  }
})