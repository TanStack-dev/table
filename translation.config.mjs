export default {
  langs: {
    'zh-Hans': {
      code: 'zh-Hans',
      name: 'Simplified Chinese',
      // 翻译规则和指南
      guide: `
    - For technical terms that should not be fully translated, use the format: "中文翻译 (English term)"
      Example: "服务端渲染 (SSR)" instead of just "SSR" or just "服务端渲染"
    - Add a space between Chinese characters and English words/symbols to improve readability
    - Maintain consistent translations for common terms across the entire document
`,
      // 常见技术术语翻译词典
      // 格式: 'English term': '中文翻译'
      terms: {},
    },
    'zh-Hant': {
      code: 'zh-Hant',
      name: 'Traditional Chinese',
      // 翻譯規則和指南
      guide: `
    - For technical terms that should not be fully translated, use the format: "繁體中文翻譯 (English term)"
      Example: "伺服器渲染 (SSR)" instead of just "SSR" or just "伺服器渲染"
    - Add a space between Chinese characters and English words/symbols to improve readability
    - Maintain consistent translations for common terms across the entire document
`,
      // 常見技術術語翻譯詞典
      // 格式: 'English term': '繁體中文翻譯'
      terms: {},
    },
    ja: {
      code: 'ja',
      name: 'Japanese',
      guide: `
    - For technical terms that should not be fully translated, use the format: "日本語訳 (English term)"
      Example: "サーバーサイドレンダリング (SSR)" instead of just "SSR" or just "サーバーサイドレンダリング"
    - Maintain consistent translations for common terms across the entire document
    - Use katakana for foreign technical terms where appropriate
`,
      terms: {},
    },
    es: {
      code: 'es',
      name: 'Spanish',
      guide: `
    - For technical terms that should not be fully translated, use the format: "Traducción en español (English term)"
      Example: "Renderizado del lado del servidor (SSR)" instead of just "SSR" or just "Renderizado del lado del servidor"
    - Maintain consistent translations for common terms across the entire document
    - Use formal "usted" form instead of informal "tú" for instructions
`,
      terms: {},
    },
    de: {
      code: 'de',
      name: 'German',
      guide: `
    - For technical terms that should not be fully translated, use the format: "Deutsche Übersetzung (English term)"
      Example: "Server-seitiges Rendering (SSR)" instead of just "SSR" or just "Server-seitiges Rendering"
    - Maintain consistent translations for common terms across the entire document
    - Follow German capitalization rules for nouns
`,
      terms: {},
    },
    fr: {
      code: 'fr',
      name: 'French',
      guide: `
    - For technical terms that should not be fully translated, use the format: "Traduction française (English term)"
      Example: "Rendu côté serveur (SSR)" instead of just "SSR" or just "Rendu côté serveur"
    - Maintain consistent translations for common terms across the entire document
    - Use proper French punctuation with spaces before certain punctuation marks
`,
      terms: {},
    },
    ru: {
      code: 'ru',
      name: 'Russian',
      guide: `
    - For technical terms that should not be fully translated, use the format: "Русский перевод (English term)"
      Example: "Рендеринг на стороне сервера (SSR)" instead of just "SSR" or just "Рендеринг на стороне сервера"
    - Maintain consistent translations for common terms across the entire document
    - Use proper Russian cases for technical terms where appropriate
`,
      terms: {},
    },
    ar: {
      code: 'ar',
      name: 'Arabic',
      guide: `
    - For technical terms that should not be fully translated, use the format: "الترجمة العربية (English term)"
      Example: "العرض من جانب الخادم (SSR)" instead of just "SSR" or just "العرض من جانب الخادم"
    - Maintain consistent translations for common terms across the entire document
    - Arabic text should flow right-to-left, but keep code examples and technical terms left-to-right
`,
      terms: {},
    },
  },
  docsRoot: 'docs',
  docsContext: `
TanStack Table's core is **framework agnostic**, which means its API is the same regardless of the framework you're using. Adapters are provided to make working with the table core easier depending on your framework. See the Adapters menu for available adapters.`,
  copyPath: 'reference/**,framework/*/reference/**',
}
