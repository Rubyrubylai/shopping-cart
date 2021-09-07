const reset = document.getElementById('reset-btn')
const password = document.getElementById('password-label')
const confirm = document.getElementById('confirm-password')

reset.addEventListener('click', function(e) {
  reset.style = 'display: none'
  password.style = 'display: none'
  confirm.innerHTML += `
  <div class="form-group">
    <label for="oldPassword">Old Password</label>
    <input type="password" id="oldPassword" name="oldPassword" class="form-control" placeholder="Old Password">
  </div>
  <div class="form-group">
    <label for="newPassword">New Password</label>
    <input type="password" id="newPassword" name="newPassword" class="form-control" placeholder="New Password">
  </div>
  <div class="form-group">
    <label for="confirmPassword">Confirm Password</label>
    <input type="password" id="confirmPassword" name="confirmPassword" class="form-control" placeholder="Confirm Password">
  </div>
  `
  e.preventDefault()
})


