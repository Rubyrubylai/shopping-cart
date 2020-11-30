# SHOP
仿效一般電商平台，使用Nodemailer發送訂單確認信，並串接藍新金流進行付款。
區分visitor、customer、admin三種角色，visitor可以瀏覽商店中的商品並加進購物車，但若要購買，則須登入為customer，而admin為店家的帳號，可以進行上架商品等後台動作。

![image](https://github.com/Rubyrubylai/shopping-cart/blob/feature/order/picture/SHOP.PNG)

## 環境
+ Node.js v10.15.0

## 測試帳號

|role||name|email|password|
|----||----|----|----|
|admin|Admin|admin@example.com|a123456|
|customer|Tony|tony@example.com|a123456|
|customer|Emily|emily@example.com|a123456|

## 安裝
1. 開啟終端機，cd到存放專案位置並執行:
```
git clone https://github.com/Rubyrubylai/shopping-cart.git
```

2. 安裝套件
```
npm install
```

3. 在 https://cwww.newebpay.com/ 上創建商店

4. 在 Imgur 上創建專案

5. 在專案的根目錄新增.env檔

6. 在workbrench中新增database
```
create database cart_sequelize
```

7. 新增migrate
```
npx sequelize db:migrate
```

8. 新增種子資料
```
npx sequelize db:seed:all
```

9. 執行專案
```
npm run dev
```

10. 在本機端 http://localhost:3000 開啟網址

## 功能列表
+ 前台功能

|功能|URL|描述|
|----|---|----|
|首頁|/product|商店的商品總覽，並可透過導覽列上的分類去做篩選|
|瀏覽|/product/:id|查看特定商品，並可將其加入購物車及喜愛列表|
|瀏覽|/favorite|喜愛列表，可進行移除及將商品加入購物車|
|瀏覽|/cart|瀏覽購物車內的商品，並可將增減其數量|
|新增|/cart/check|成立訂單，系統會寄訂單確認信|
|瀏覽|/order/:id|瀏覽特定訂單，並可進行付款或取消訂單|
|瀏覽|/orders|瀏覽所有訂單|

+ 後台功能

|功能|URL|描述|
|----|---|----|
|瀏覽|/admin/products|瀏覽所有上架的商品|
|新增|/admin/products/new|新增商品|
|修改|/admin/products/:id|修改已上架商品的資訊|
|瀏覽|/admin/orders|瀏覽所有訂單|
|瀏覽|/admin/orders/:id|修改訂單的寄送及付款資訊|
|瀏覽|/admin/categories|瀏覽所有商品分類|
|瀏覽|/admin/categories/:id|修改特定分類的名字|

+ 使用者功能

|功能|URL|描述|
|----|---|----|
|登入|/user/login|使用者登入|
|登出|/user/logout|登入後即可藉由右上角的登出按鈕登出|
|註冊|/user/register|填寫姓名、帳號及密碼以註冊帳戶|
|修改|/user/account|修改基本資料|