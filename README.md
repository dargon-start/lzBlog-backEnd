# lz_blog_backend

### 一、创建数据库

通过Navicat 运行项目中的my_blog.sql文件，完成数据库的创建

![image-20221217151822072](README.assets/image-20221217151822072.png)

### 二、配置.env，连接数据库

配置为自己的本地的数据库

```env
APP_PORT = 8000
APP_HOST = http://localhost

MYSQL_HOST = localhost
MYSQL_PORT = 3306
MYSQL_USER = root 
MYSQL_PASSWORD = 123456
MYSQL_DATABASE = my_blog
```

### 三、安装依赖，运行项目

安装依赖

`npm install`

运行项目

`npm start`
