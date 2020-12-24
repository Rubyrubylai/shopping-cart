# SHOP
仿效一般電商平台，使用 Nodemailer 發送訂單確認信，並串接藍新金流進行付款。  
區分 visitor、customer、admin 三種角色，visitor 可以瀏覽商店中的商品並加進購物車，但若要購買，則須登入為 customer，而 admin 為店家，可以進行上架商品等後台動作。

[點此進入網站](https://morning-brushlands-96269.herokuapp.com/)

![image](https://github.com/Rubyrubylai/shopping-cart/blob/feature/order/picture/SHOP.PNG)

## 環境
+ Node.js v10.15.0

## 測試帳號

|role|name|email|password|
|----|----|-----|--------|
|admin|Root|root@example.com|a123456|
|customer|User1|user1@example.com|a123456|
|customer|User2|user2@example.com|a123456|

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

4. 在Imgur上創建專案

5. 在專案的根目錄新增.env檔

6. 在workbrench中新增database
```
create database shopping_cart
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
|首頁|/products|商店的商品總覽，並可透過導覽列上的分類去做篩選|
|瀏覽|/product/:id|查看特定商品，並可將其加入購物車及喜愛列表|
|瀏覽|/favorites|查看喜愛列表|
|新增、移除|/favorite/:id|將商品加入購物車或從喜愛列表移除||
|瀏覽、修改|/cart|瀏覽購物車內的商品，並可新增或減少其數量|
|新增|/cart/:id|將商品加入購物車內|
|移除|/cart/remove|移除購物車內的商品|
|新增|/cart/check|成立訂單，系統會寄訂單確認信|
|瀏覽|/orders|瀏覽所有訂單|
|瀏覽|/order/:id|瀏覽特定訂單，並可進行付款或取消訂單|
|新增|/order|新增一筆訂單|
|取消|/order/:id/cancel|取消一筆訂單|

+ 後台功能

|功能|URL|描述|
|----|---|----|
|瀏覽|/admin/products|瀏覽所有上架的商品|
|新增|/newProduct|新增商品|
|修改、移除|/admin/product/:id|修改已上架商品的資訊，或移除商品|
|瀏覽|/admin/orders|瀏覽所有訂單|
|瀏覽|/admin/order/:id|修改訂單的寄送及付款資訊|
|瀏覽|/admin/categories|瀏覽所有商品分類，並可進行新增|
|瀏覽、移除|/admin/category/:id|修改特定分類的名字，並可進行移除|

+ 使用者功能

|功能|URL|描述|
|----|---|----|
|登入|/user/login|使用者登入|
|登出|/user/logout|登入後即可藉由右上角的登出按鈕登出|
|註冊|/user/register|填寫姓名、帳號及密碼以註冊帳戶|
|修改|/user/account|修改基本資料|