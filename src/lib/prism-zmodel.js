Prism.languages.zmodel = Prism.languages.extend('clike', {
    function: /@@*[A-Za-z_]\w*/,
    keyword: /\b(?:datasource|enum|generator|model|type|abstract|import|extends|attribute|view|plugin|proc|with)\b/,
    entity: /\b(?:Int|String|Boolean|DateTime|Float|Decimal|BigInt|Bytes|Json|Unsupported)\b/,
    'type-class-name': /(\b()\s+)[\w.\\]+/,
});

Prism.languages.insertBefore('zmodel', 'punctuation', {
    'type-args': /\b(?:references|fields|onDelete|onUpdate):/,
});

Prism.languages.json5 = Prism.languages.js;
