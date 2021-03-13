# console-ban

禁止F12 / 审查开启控制台，保护站点资源、减少爬虫和攻击的轻量方案，支持重定向、重写、自定义多种策略。

*version: 2.1*

### Usage

直接引入：

```html
<head>
  <!-- ... -->
  <script src="https://cdn.jsdelivr.net/gh/fz6m/console-ban@2.1/dist/console-ban.min.js"></script>
  <script>
    // default options
    ConsoleBan.init()
    // custom options
    ConsoleBan.init({
      redirect: '/404'
    })
  </script>
</head>
```

在项目中使用：

```bash
  yarn add console-ban
```

```js
  import { init as ConsoleBan } from 'console-ban'

  ConsoleBan()
```

### Strategy

#### 重定向

```js
  ConsoleBan.init({
    // 重定向至 /404 相对地址
    redirect: '/404',
    // 重定向至绝对地址
    redirect: 'http://domain.com/path'
  })
```

使用重定向策略可以将用户指引到友好的相关信息地址（如网站介绍），亦或是纯静态 404 页面，高防的边缘计算或验证码等页面。

注：若重定向后的地址可以通过 SPA 路由切换或 pjax 局部加载技术等进行非真正意义上的页面切换，则切换后的控制台监测将不会再次生效，对于 SPA 你可以在路由卫士处重新注册本实例，其他情况请引导至真正的其他页面。

#### 重写

```js
  var div = document.createElement('div')
  div.innerHTML = '不要偷看啦~'

  ConsoleBan.init({
    // 重写 body 为字符串
    write: '<h1> 不要偷看啦~ </h1>',
    // 可传入节点对象
    write: div
  })
```

重写策略可以完全阻断对网站内容的审查，但较不友好，不推荐使用。

#### 回调函数

```js
  ConsoleBan.init({
    callback: () => {
      // ...
    }
  })
```

回调函数支持自定义打开控制台后的策略。


### Options

name|required|type|default|description
:-:|:-:|:-:|:-:|:-
`clear`|no|boolean|`true`|禁用 `console.clear` 函数，防止脚本清屏阻断监测
`debug`|no|boolean|`true`|是否开启定时 `debugger` 反爬虫审查
`debugTime`|no|number|`3000`|定时 `debugger` 时间间隔（毫秒）
`redirect`|no|string|`-`|开启控制台后重定向地址
`write`|no|string \| Element|`-`|开启控制台后重写 `document.body` 内容，支持传入节点或字符串
`callback`|no|Function|`-`|开启控制台后的回调函数

注：`redirect`、`write`、`callback` 三种策略只能取其一，优先使用回调函数。

### How

[Find out whether Chrome console is open](https://stackoverflow.com/questions/7798748/find-out-whether-chrome-console-is-open/30638226)