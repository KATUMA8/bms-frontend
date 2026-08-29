# BMS Systemフロントエンド
業務データ共有を効率化、透明化。
データ管理機能を１つに集約『共有負担』をゼロにする業者間データ管理プラットフォーム

## フォルダ構成（共有時動作確認用）
```
bms-frontend/
├── node_modules/
├── docs/　　　　　　　　          　　// ※動作確認用:`bms-systemDB.sql`を含む公開用データを格納
├── public/　　　　　　          　　　
├── src/
│  ├── api/　　　　　　　          　　
│  ├── atoms/　　　　　　          　　
│  ├── components/   　　          　
│  ├── hooks/　　　　　　　          　
│  ├── pages/　　　　　　          　　
│  ├── utils/　　　　　　　
│  ├── App.jsx　　　 　
│  ├── main.jsx
│  └── router.js 　　　　　
├── uploads 　　　  　　　　　　　 　　// アップロードファイルの保存先
├── index.html　 　　　
├── application.properties　　　　　　// ※動作確認用:データベース接続設定用ファイル
├── BMS-Backend-0.0.1-SNAPSHOT.jar　 // ※動作確認用:バックエンド起動用ファイル
└── vite.config.js　　　　　　　　
```

## 動作確認セットアップ手順

### 1. 前提環境

- Git
- Node.js（LTS版）
- JDK 21（Pleiades等でインストール済みであること）
- MySQL Workbench / MySQL Server（ローカルにインストール済みであること）

### 2. リポジトリのクローン

VSコード内でターミナルを開き(control＋@)、以下を1行ずつ実行する。

**① デスクトップへ移動**
※<ユーザー名>はお使いの環境に合わせて、書き換える。
```bash
cd C:/Users/<ユーザー名>/Desktop
```

**② リポジトリをクローン**
```bash
git clone https://github.com/KATUMA8/bms-frontend.git
```

**③ クローンしたフォルダに移動**
```bash
cd bms-frontend
```
ご自分のPC内のC:/Users/<ユーザー名>/Desktopに`bms-frontend`フォルダが作成されます。

### 3. データベースのセットアップ

1. MySQL Workbenchを開く
2. プロジェクトルート（`bms-frontend/`）内の `docs/bms-systemDB.sql` を開く（File → Open SQL Script）
3. スクリプトを実行する（稲妻アイコンをクリック）
   → `project_system_db` データベースとテーブル、初期データが自動で作成されます。

### 4. データベース接続設定
VSコードへ戻り、プロジェクトルート（`bms-frontend/`）直下にある `application.properties` の以下の値を、お使いのMySQL Workbench環境に合わせて書き換える。

```
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/project_system_db?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Tokyo
spring.datasource.username=root
spring.datasource.password=（各自のMySQLパスワード）
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

### 5. Node.jsのインストール確認

ターミナルで以下を実行。
```bash
node -v
```

インストールされていない場合は、公式サイト(https://nodejs.org/)からLTS版をインストールする。

### 6. 依存関係のインストール

ターミナルで以下を実行する。

```bash
npm install
```

初回は`node_modules`フォルダが作られ、必要なツール（axios, jotai, react, react-dom, react-router）が自動でインストールされます。


### 7. 開発サーバーの起動

#### バックエンド

ターミナルで以下を実行する。

```bash
java -jar BMS-Backend-0.0.1-SNAPSHOT.jar
```

起動後、`http://localhost:8080`（ポート番号は実際の設定に合わせて変更）でAPIが待ち受けます。

<details>
<summary>実行時Javaが見つからないエラーが出る場合（Windows）</summary>

1. Windowsキーを押して「システム環境変数の編集」と検索して開く
2. [環境変数] ボタンをクリック
3. `Path` を探してダブルクリック（または「編集」）
4. 既存のJava21があれば「上へ」で一番上に移動する
5. なければ、Pleiadesのjavaフォルダ内の`21`（jdk-21等）フォルダの`bin`フォルダのパスを新規追加する
   （例: `C:\Users\あなたのユーザー名\pleiades\2024-03\java\21\bin`）
</details>

#### フロントエンド

ターミナルで以下を実行する。
```bash
npm run dev
```

起動後、表示されたURL（例: `http://localhost:3000`）にブラウザでアクセスしてください。


## 動作確認の手順

1. `BMS-Backend-0.0.1-SNAPSHOT.jar`でバックエンドを起動する
2. `npm run dev`でフロントエンドを起動する
3. ブラウザで`http://localhost:3000`を開く
4. ログイン画面で「管理者ID:admin PASS:aaaまたは発注業者ID:ks_narita PASS:bbb」でログイン
5. 各フォームを操作し実際の動きを確認する

### 補足: ログイン情報のカスタマイズ

DBの`users`テーブルから、ログインIDやパスワードを任意のものに変更できます。パスワードを変更する場合は、平文のまま保存せず、[BCryptツール](https://toolbase.cc/crypto/bcrypt)でハッシュ化した文字列に置き換えてください。


## ドキュメント・設計資料

###   データベース設計（ER図）
![ER図](./docs/ER-diagram.png)

### API設計（API一覧）
[API設計(一覧)](./docs/API-list.jpg)

### プレゼン資料
[BMS System v2.0(PDF)](./docs/プレゼン資料v2.0.pdf)


<p align="right">(<a href="#top">トップへ</a>)</p>