const image = document.getElementById('image')
const file = document.getElementById('file')

file.addEventListener('change', function(e){
  const file = this.files[0];
  const fr = new FileReader();
  fr.onload = function (e) {
    image.src = e.target.result
    image.classList = "card-custom"
  };
  fr.readAsDataURL(file);
});

