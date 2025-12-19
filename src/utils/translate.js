// 翻訳結果をキャッシュ（メモリ内）
const translationCache = new Map();

// テキストを日本語に翻訳
export async function translateToJapanese(text) {
  if (!text || text.trim().length === 0) {
    return text;
  }

  // キャッシュをチェック
  if (translationCache.has(text)) {
    return translationCache.get(text);
  }

  try {
    // MyMemory Translation APIを使用（無料）
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|ja`
    );

    if (!response.ok) {
      throw new Error('Translation API error');
    }

    const data = await response.json();
    
    if (data.responseStatus === 200 && data.responseData) {
      const translatedText = data.responseData.translatedText;
      
      // キャッシュに保存
      translationCache.set(text, translatedText);
      
      return translatedText;
    } else {
      // 翻訳に失敗した場合は元のテキストを返す
      console.warn('Translation failed, returning original text');
      return text;
    }
  } catch (error) {
    console.error('Translation error:', error);
    // エラー時は元のテキストを返す
    return text;
  }
}

// 複数のテキストを並列で翻訳
export async function translateMultiple(texts) {
  const translations = await Promise.all(
    texts.map(text => translateToJapanese(text))
  );
  return translations;
}

// キャッシュをクリア
export function clearTranslationCache() {
  translationCache.clear();
}

