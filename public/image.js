const image = document.getElementById('image')
const file = document.getElementById('file')

// function showImg(this) {
//   var file = this.files[0]
//   console.log(file)
//   var reader = new FileReader()
//   reader.onloadend = function(e) {
//     onloadend = e.target.result
//   }
//   reader.readAsDataURL(file)

// }
// file.on('change', function() {
//   var upload_img = file[0].files[0]
//   var reader = new FileReader
//   reader.onload = function(e) {
//     image.attr('src', e.target.result)
//   }
//   reader.readAsDataURL(upload_img)
// })

file.addEventListener('change', function(e){
  const file = this.files[0];
  const fr = new FileReader();
  fr.onload = function (e) {
    image.src = e.target.result
    image.classList = "card-custom"
  };
  fr.readAsDataURL(file);
});

