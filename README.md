# SHOP
使用者可以新增、刪除、過濾及查看支出和收入的紀錄資訊，並且透過圓餅圖分析各支出或收入所佔的百分比，是管理財務的好幫手

![image](https://github.com/Rubyrubylai/expense-tracker-sequelize/blob/master/picture/expense.PNG)

## 環境
+ Node.js v10.15.0

## 測試帳號

|name|email|password|
|----|---|----|
|Amy|amy@example.com|a123456|
|Nick|nick@example.com|a123456|

## 安裝
1. 開啟終端機，cd到存放專案位置並執行:
```
git clone https://github.com/Rubyrubylai/expense-tracker-sequelize.git
```

2. 安裝套件
```
npm install
```

3. 在 https://developers.facebook.com/ 上創建一個專案

4. 在專案的根目錄新增.env檔，以存放第三方登入設定
```
FACEBOOK_ID = "YOUR FACEBOOK ID"
FACEBOOK_SECRET = "YOUR SECRET KEY"
FACEBOOK_CALLBACK = http://localhost:3000/auth/facebook/callback
```

5. 在workbrench中新增database
```
create database record_sequelize
```

6. 新增migrate
```
npx sequelize db:migrate
```

7. 新增種子資料
```
npx sequelize db:seed:all
```

8. 執行專案
```
npm run dev
```

9. 在本機端 http://localhost:3000 開啟網址

## 功能列表
+ 網站功能

|功能|URL|描述|
|----|---|----|
|首頁|/|查看當月的收入及支出，並篩選月份及類別|
|新增|records/newDeduct|點選右下角的新增符號，新增支出|
|新增|records/newDeposit|進入新增支出頁面後，可以切換為新增收入|
|編輯|/records/:id/editDeduct|點選編輯按鈕，編輯支出的名稱、日期、類別及金額|
|編輯|/records/:id/editDeposit|進入編輯支出頁面後，可以切換為編輯收入|

+ 統計圖表

|功能|URL|描述|
|----|---|----|
|首頁|/pieChart/deduct|查看該月的支出分析，並可切換月份|
|首頁|/pieChart/deposit|查看該月的收入分析，並可切換月份|

+ 使用者功能

|功能|URL|描述|
|----|---|----|
|登入|/users/login|使用者登入|
|登入|/auth/facebook|FB使用者登入|
|登出|/users/logout|登入後即可藉由右上角的登出按鈕登出|
|註冊|/users/register|填寫姓名、帳號及密碼以註冊帳戶|