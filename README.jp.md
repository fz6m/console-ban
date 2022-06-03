# console-ban

F12 ブラウザのコンソールを見破る、Web サイトのスタティックなリソースを保護し、リダイレクト、リライト、コールバック三つのストラテジーを通用が可能。

Language: [English](./README.md)|[中文](./README.zh.md)|日本語

### 使い方

HTML に直接に挿入：

```html
<head>
  <!-- ... -->
  <script src="https://cdn.jsdelivr.net/npm/console-ban@4.1.0/dist/console-ban.min.js"></script>
  <script>
    // デフォルトオプション
    ConsoleBan.init()
    // カスタムオプション
    ConsoleBan.init({
      redirect: '/404'
    })
  </script>
</head>
```

現代なウェブのプロジェクトにインストール：

```bash
  yarn add console-ban
```

```js
import { init } from 'console-ban'

init(options)
```

### ストラテジー

#### リダイレクト

```js
ConsoleBan.init({
  // 相対的な /404 目的にリダイレクト
  redirect: '/404',
  // 絶対的な目的地にリダイレクト
  redirect: 'http://domain.com/path'
})
```

リダイレクトを使ってユーザーをサイトの紹介ページまたは純粋にスタティックな 404 ページに誘導

注意：SPA プロジェクトにルートが変化の場合、再び効果を取らない

#### リライト

```js
var div = document.createElement('div')
div.innerHTML = '見るな'

ConsoleBan.init({
  // 単純なストリングをページの body にリライト
  write: '<h1> 見るな </h1>',
  // あるいは、実在なエレメントを使うのが可能
  write: div
})
```

リライトは完全にウェブサイトの検査をブロックするのが可能、一方でユーザーに不気分な意味を混じる、推薦するの方がいいと言うことが言わない

#### コールバック

```js
ConsoleBan.init({
  callback: () => {
    // ...
  }
})
```

コールバックのオプションは自分でコンソールを開けて起きることを決めることができる

### オプション

|    name     | required |       type        | default | description                                                 |
| :---------: | :------: | :---------------: | :-----: | :---------------------------------------------------------- |
|   `clear`   |    no    |      boolean      | `true`  | `console.clear` を禁止                                   |
|   `debug`   |    no    |      boolean      | `true`  | `debugger` を無限に実行するかどうか                          |
| `debugTime` |    no    |      number       | `3000`  | 定時に `debugger` を循環の間隔                            |
| `redirect`  |    no    |      string       |   `-`   | コンソールを開けてリダイレクトの目的地                                    |
|   `write`   |    no    | string \| Element |   `-`   | コンソールを開けて `document.body` をリライトの内容 |
| `callback`  |    no    |     Function      |   `-`   | コンソールを開けて自分で定義出来るコールバック                                      |

注意：`redirect`、`write`、`callback` 三つのストラテジーは唯一つが使うことが出来る，コールバックの優先位が一番高い

### ブラウザの支持

| browser core | support |
| :----------: | :-----: |
|    chrome    |    ✓    |
|   firefox    |    ✓    |
|    safari    |    ✓    |
