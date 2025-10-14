# Seat Shuffler - 席替えツール

教室の座席をランダムにシャッフルするためのウェブアプリケーションです。教員が事前に座席を設定できる機能も備えています。

This program helps shuffle classroom seating assignments. It can randomly reassign seat numbers and includes settings for teachers.

## 機能 (Features)

### シャッフルモード (Shuffle Mode)
- 6×6 の座席グリッド（最大36席）
- スペースキー：ランダムシャッフルの開始/停止
- エンターキー：事前設定した座席配置で停止（ランダムに見える）
- シャッフル完了時のアニメーション効果

### 設定モード (Settings Mode)
1. **人数と座席設定**
   - 生徒数を設定（1-36人）
   - アクティブな座席を選択
   
2. **事前設定座席**
   - 教員が事前に座席配置を設定可能
   - エンターキーで停止時に、この配置が表示される
   - 生徒にはランダムに見える

## 使い方 (Usage)

1. `index.html` をウェブブラウザで開く
2. ホーム画面で「シャッフルモード」または「設定モード」を選択

### シャッフルモード
- **スペースキー**を押してシャッフル開始
- もう一度**スペースキー**でランダムな配置で停止
- **エンターキー**で事前設定した配置で停止

### 設定モード
1. 人数を入力
2. アクティブな座席をクリックで選択/解除
3. 必要に応じて各座席に番号を入力（事前設定）
4. 「保存」ボタンをクリック

## 技術スタック (Tech Stack)

- HTML5
- CSS3 (アニメーション付き)
- JavaScript (Vanilla)
- Bootstrap 5 (CDN)
- LocalStorage (データ永続化)

## ライセンス (License)

MIT License - 詳細は [LICENSE](LICENSE) を参照してください。
