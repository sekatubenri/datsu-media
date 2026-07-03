const crypto = require('crypto');
const https = require('https');
const fs = require('fs');
const path = require('path');

function buildOAuthHeader(method, url, credentials) {
  const { apiKey, apiSecret, accessToken, accessTokenSecret } = credentials;
  const oauthParams = {
    oauth_consumer_key: apiKey,
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: accessToken,
    oauth_version: '1.0',
  };
  const paramString = Object.keys(oauthParams).sort()
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(oauthParams[k])}`).join('&');
  const baseString = [method.toUpperCase(), encodeURIComponent(url), encodeURIComponent(paramString)].join('&');
  const signingKey = `${encodeURIComponent(apiSecret)}&${encodeURIComponent(accessTokenSecret)}`;
  const signature = crypto.createHmac('sha1', signingKey).update(baseString).digest('base64');
  oauthParams.oauth_signature = signature;
  return 'OAuth ' + Object.keys(oauthParams).sort()
    .map(k => `${encodeURIComponent(k)}="${encodeURIComponent(oauthParams[k])}"`).join(', ');
}

function httpPost(url, body, authHeader) {
  return new Promise((resolve, reject) => {
    const bodyStr = JSON.stringify(body);
    const urlObj = new URL(url);
    const req = https.request({
      hostname: urlObj.hostname, path: urlObj.pathname, method: 'POST',
      headers: { 'Authorization': authHeader, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(bodyStr) },
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`HTTPステータス: ${res.statusCode}`);
        if (res.statusCode >= 200 && res.statusCode < 300) resolve(JSON.parse(data));
        else reject(new Error(`HTTP ${res.statusCode}: ${data}`));
      });
    });
    req.on('error', reject);
    req.write(bodyStr);
    req.end();
  });
}

async function postTweet() {
  const tweetsPath = path.join(__dirname, '..', 'tweets.md');
  const progressPath = path.join(__dirname, '..', 'tweet-index.json');
  const content = fs.readFileSync(tweetsPath, 'utf-8');
  const tweets = content.split(/\n## Day \d+\n/).slice(1).map(t => t.trim());
  let index = 0;
  if (fs.existsSync(progressPath)) index = JSON.parse(fs.readFileSync(progressPath, 'utf-8')).next || 0;
  if (index >= tweets.length) { console.log('全ツイート投稿完了'); process.exit(0); }
  const text = tweets[index];
  console.log(`Day ${index + 1} を投稿します`);
  const credentials = {
    apiKey: process.env.TWITTER_API_KEY, apiSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN, accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  };
  const url = 'https://api.twitter.com/2/tweets';
  await httpPost(url, { text }, buildOAuthHeader('POST', url, credentials));
  console.log('投稿完了');
  fs.writeFileSync(progressPath, JSON.stringify({ next: index + 1, lastPosted: new Date().toISOString() }, null, 2));
}

postTweet().catch(err => { console.error('エラー:', err.message); process.exit(1); });
