const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SITE = { name: '脱毛ナビ', url: 'https://datsu-select.com' };

const AFFILIATE_TOP = `
<div style="background:#fff0f6;border:2px solid #e879a0;border-radius:8px;padding:16px;margin:24px 0;">
  <p style="font-weight:bold;color:#be185d;margin:0 0 8px;">【PR】人気脱毛サロン 無料体験・予約受付中</p>
  <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:8px;">
    <li><a href="https://px.a8.net/svt/ejp?a8mat=DATSU_PLACEHOLDER_1" rel="nofollow" style="display:inline-block;background:#e879a0;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:bold;">▶ ミュゼプラチナム（全身脱毛）無料体験</a></li>
    <li><a href="https://px.a8.net/svt/ejp?a8mat=DATSU_PLACEHOLDER_2" rel="nofollow" style="display:inline-block;background:#db2777;color:#fff;padding:8px 16px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:14px;">▶ キレイモ（顔・VIO含む全身）初回体験</a></li>
    <li><a href="//ck.jp.ap.valuecommerce.com/servlet/referral?sid=3775263&pid=892655307" rel="nofollow" style="display:inline-block;background:#9d174d;color:#fff;padding:8px 16px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:14px;">▶ 美容外科医も注目！ムダ毛ケア</a><img src="//ad.jp.ap.valuecommerce.com/servlet/gifbanner?sid=3775263&pid=892655307" height="1" width="1" border="0" alt=""></li>
  </ul>
</div>`;

const AFFILIATE_BOTTOM = `
<div style="background:#fffbeb;border:2px solid #d97706;border-radius:8px;padding:16px;margin:24px 0;">
  <p style="font-weight:bold;color:#92400e;margin:0 0 12px;">📚 脱毛・美容の参考書</p>
  <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:8px;">
    <li><a href="https://www.amazon.co.jp/dp/B09C3TLNWP?linkCode=ll2&tag=mirainikibouw-22" rel="nofollow" target="_blank" style="color:#1d4ed8;text-decoration:underline;">▶ 美肌の教科書【Amazon】</a></li>
    <li><a href="https://www.amazon.co.jp/s?k=%E8%84%B1%E6%AF%9B&linkCode=ll2&tag=mirainikibouw-22" rel="nofollow" target="_blank" style="color:#1d4ed8;text-decoration:underline;">▶ 脱毛関連書籍一覧【Amazon】</a></li>
    <li><a href="//ck.jp.ap.valuecommerce.com/servlet/referral?sid=3774934&pid=892653514" rel="nofollow" style="color:#ff0033;text-decoration:underline;">▶ 家庭用脱毛器・美容機器【Yahoo!ショッピング】</a><img src="//ad.jp.ap.valuecommerce.com/servlet/gifbanner?sid=3774934&pid=892653514" height="1" width="1" border="0" alt=""></li>
  </ul>
</div>`;

async function generateArticle() {
  const topicsPath = path.join(__dirname, '..', 'unused-topics.json');
  const contentDir = path.join(__dirname, '..', 'content');

  fs.mkdirSync(contentDir, { recursive: true });
  const topics = JSON.parse(fs.readFileSync(topicsPath, 'utf-8'));
  const existingFiles = new Set(fs.readdirSync(contentDir));

  const topic = topics.find(t => !existingFiles.has(t.filename));
  if (!topic) { console.log('全トピック生成完了'); process.exit(0); }

  console.log(`生成中: ${topic.title}`);
  const today = new Date().toISOString().split('T')[0];

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 6000,
    messages: [{
      role: 'user',
      content: `あなたは脱毛比較メディア「${SITE.name}」の専門ライターです。
SEOに最適化された脱毛情報記事を生成してください。

トピック: ${topic.title}
カテゴリ: ${topic.category}

以下のJSON形式のみで出力してください（前後に余分なテキスト不要）:
{
  "title": "タイトル（SEO最適化、40〜60文字、年や具体的な数字を含める）",
  "description": "メタディスクリプション（120文字以内）",
  "category": "${topic.category}",
  "date": "${today}",
  "content": "HTMLコンテンツ"
}

contentの要件:
- 1500文字程度のHTML本文（簡潔にまとめること）
- h2見出しを3〜5個
- ul/liリスト、tableを活用
- 具体的な料金・回数・効果・比較表などを含める
- 読者の疑問に答える実践的な内容
- JSON文字列として正しくエスケープ（"は\\"、改行は\\n）
- 必ずJSON全体を完結させること（途中で切れないこと）`
    }],
  });

  const text = message.content[0].text.trim();
  console.log('レスポンス先頭200文字:', text.slice(0, 200));
  const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('レスポンスにJSONが見つかりません');

  const article = JSON.parse(jsonMatch[0]);
  if (article.content.includes('<h2')) {
    article.content = article.content.replace('<h2', AFFILIATE_TOP + '<h2');
  } else {
    article.content = AFFILIATE_TOP + article.content;
  }
  article.content = article.content + AFFILIATE_BOTTOM;

  fs.writeFileSync(path.join(contentDir, topic.filename), JSON.stringify(article, null, 2));
  const remaining = topics.filter(t => t.filename !== topic.filename);
  fs.writeFileSync(topicsPath, JSON.stringify(remaining, null, 2));
  console.log(`完了: ${topic.filename}`);
}

async function run() {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await generateArticle();
      break;
    } catch (err) {
      console.error(`試行${attempt}回目失敗: ${err.message}`);
      if (attempt === 3) {
        console.error('3回失敗。このトピックをスキップします。');
        process.exit(0);
      }
      await new Promise(r => setTimeout(r, 3000));
    }
  }
}
run();
