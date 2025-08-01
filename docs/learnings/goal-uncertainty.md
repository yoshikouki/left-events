# 目的不確実性の学習記録

## 2025-01-21 - 個人向け100点のアプリから一般化への道筋

### 状況
- ユーザーから「一旦私だけが望む100点を目指しましょうか」というリクエスト
- 汎用的なアプリから個人特化へのピボット
- その後の一般化を見据えた設計の必要性

### 学習内容
- **段階的なアプローチの有効性**：
  - まず特定個人の理想を完全に実現
  - その過程で本質的なニーズを抽出
  - 後から一般化することで無駄な機能を避ける
  
- **個人向け最適化で見えた本質**：
  - 設定画面への遷移は不要（トップページで完結）
  - デフォルト値の重要性（35歳設定）
  - データの永続化は必須
  - 複雑な機能（経験記録、可視化）は不要
  
- **シンプル化の判断基準**：
  - 1画面で完結できることは1画面で
  - 追加の画面遷移は極力避ける
  - 削除可能な機能は積極的に削除

### 今後の適用
- MVP開発では特定ユーザーの100点を目指す
- 機能追加より機能削除を優先
- 一般化は成功体験の後に実施

## 2025-07-21 - 人生の有限性を感じる適切な指標の選択

### 状況
- 単純な余命だけでは現実的でない
- 健康寿命や家族のライフステージも重要
- どの指標を見せることが行動変容につながるか

### 学習内容
- **多角的な有限性の表現**：
  - 平均寿命（85歳）：全体の残り時間
  - 健康寿命（72歳）：活動的に過ごせる時間
  - 家族の節目（22歳卒業）：関係性の変化点
  - 親の寿命：世代を超えた時間の有限性
  
- **警告表示の基準**：
  - 100回未満を赤字表示（心理的インパクト）
  - 10回未満は特に強調（緊急性）
  - 家族との時間は頻度別に計算
  
- **行動変容を促す仕組み**：
  - 具体的な回数表示で現実感を持たせる
  - 家族との時間を可視化して優先順位を考えさせる
  - デフォルト値で即座に体験可能

### 今後の適用
- ユーザーの年齢層別に異なる指標を強調
- 文化的背景を考慮した節目の設定
- ポジティブな行動提案との組み合わせ

## 2025-07-21 - UIテキストの最適な文字数削減

### 状況
- ユーザーから「文字数を大幅に減らして」という要求
- どこまで削減すべきか、何を残すべきかが不明確
- シンプルさと理解しやすさのバランスが課題

### 学習内容
- 説明文よりも動作を表す動詞を優先（「記録する」→「記録」）
- 長い説明文は完全に削除しても問題ない場合が多い
- ナビゲーション項目は機能を端的に表す単語で十分
- フォームのプレースホルダーは具体例より簡潔な指示が効果的
- 「〜を〜する」という冗長な表現は避ける

### 今後の適用
- UIテキストは可能な限り短く、動詞の名詞形を使用
- 説明が必要な場合はツールチップやヘルプアイコンで補完
- ユーザーの行動を促す最小限の情報だけを表示
- 文脈から理解できる情報は省略

## 2025-07-25 - 「残り回数」の本質的な価値の発見

### 状況
- 単純な「残り回数」の可視化を超えた、より深い価値の探求
- ユーザーが本当に求めているものは何かの再定義
- 機能の取捨選択における判断基準の明確化

### 学習内容
- **ファイナイト性の実感が真の価値**：
  - 「5歳の子供が18歳になるまでの誕生日は13回」という具体的な数字の衝撃
  - 漠然とした時間ではなく、カウントダウン可能な有限性の提示
  - 大切な人との「限られた機会」を数値化することで行動変容を促す
  
- **複数の視点からの残り回数表示**：
  - 自分の節目（健康寿命、定年など）までの回数
  - 相手の節目（子供の成人、親の平均寿命など）までの回数
  - 両方の視点を並列表示することで包括的な理解を促進
  
- **イベントと人物の関係性の再定義**：
  - イベントを人ごとに作るのではなく、既存イベントを複数人と共有
  - 「家族旅行」を家族全員と関連付ける自然なUX
  - 人物ごとに異なる節目年齢（untilAge）を設定可能に

### 今後の適用
- ファイナイト性を実感させる他の指標の探索
- 行動変容を促す心理的トリガーの研究
- 家族やコミュニティ単位での時間管理への拡張