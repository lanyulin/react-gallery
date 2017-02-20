# react-gallery
One photo gallery based on react.</br>
node -v //6.9.5</br>
npm -v //3.10.10</br>

#yo react-webpack生成项目
<h4>phantomjs找不到，报错信息：</h4>
<i>
...</br>
npm ERR! phantomjs-prebuilt@2.1.14 install: `node install.js`</br>
npm ERR! Exit status 1</br>
npm ERR! Failed at the phantomjs-prebuilt@2.1.14 install script 'node install.js</br>
...
</i>

PhantomJS是一个基于webkit的JavaScript API。它使用QtWebKit作为它核心浏览器的功能，使用webkit来编译解释执行JavaScript代码。任何你可以在基于webkit浏览器做的事情，它都能做到。它不仅是个隐形的浏览器，提供了诸如CSS选择器、支持Web标准、DOM操作、JSON、HTML5、Canvas、SVG等，同时也提供了处理文件I/O的操作，从而使你可以向操作系统读写文件等。PhantomJS的用处可谓非常广泛，诸如前端无界面自动化测试（需要结合Jasmin）、网络监测、网页截屏等。</br>
个人觉得暂时没用,解决办法：</br>
打开package.json，<b>删除依赖"phantomjs-prebuilt": "^2.0.0"</b></br>
方法二：npm切换镜像站点，我切换的是淘宝镜像。可以使用淘宝定制的 cnpm 命令行工具代替默认的npm：npm install -g cnpm --registry=https://registry.npm.taobao.org
