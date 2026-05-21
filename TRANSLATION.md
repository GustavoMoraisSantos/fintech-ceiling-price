# Translation System Documentation

## 📚 Overview

O projeto agora possui suporte para internacionalização (i18n) com suporte para **inglês (en)** e **português brasileiro (pt-BR)**.

## 🗂️ Estrutura de Arquivos

```
src/
├── locales/
│   ├── en.json          # Traduções em inglês
│   └── pt-BR.json       # Traduções em português brasileiro
└── hooks/
    └── useTranslation.ts # Hook personalizado para uso de traduções
```

## 📖 Como Usar

### 1. No seu componente, importe o hook:

```typescript
import { useTranslation } from '@/hooks/useTranslation';

export default function MyComponent() {
  const { t, locale, toggleLocale } = useTranslation();
  
  return (
    <div>
      <h1>{t('header.title')}</h1>
      <p>Idioma atual: {locale}</p>
      <button onClick={toggleLocale}>
        Mudar para {locale === 'en' ? 'Português' : 'English'}
      </button>
    </div>
  );
}
```

### 2. Use o hook com a notação de ponto para acessar as chaves de tradução:

```typescript
const greeting = t('header.title');        // "Ceiling Price" ou "Preço Teto"
const button = t('header.addStock');       // "Add Stock" ou "Adicionar Ação"
const errorMsg = t('errors.fetchFailed');  // "Failed to fetch" ou "Falha ao buscar"
```

## 🔄 Funcionamento

O hook `useTranslation`:

1. **Inicialização**: Na primeira renderização, verifica se há uma preferência de idioma salva no `localStorage`
2. **Detecção automática**: Se não houver preferência salva, detecta o idioma do navegador:
   - Se o navegador está em português, seleciona `pt-BR`
   - Caso contrário, usa `en` (inglês) como padrão
3. **Fallback**: Se uma tradução não existir, retorna a versão em inglês
4. **Alternância**: A função `toggleLocale()` permite alternar entre idiomas e salva a preferência

## 📝 Adicionando Novas Traduções

Para adicionar novas chaves de tradução:

1. Abra ambos os arquivos de tradução (`en.json` e `pt-BR.json`)
2. Adicione a mesma chave com as respectivas traduções:

**en.json:**
```json
{
  "newSection": {
    "newKey": "English translation"
  }
}
```

**pt-BR.json:**
```json
{
  "newSection": {
    "newKey": "Tradução em português"
  }
}
```

3. Use no componente:
```typescript
const text = t('newSection.newKey');
```

## 🌐 Estrutura de Chaves

As chaves seguem uma hierarquia lógica:

- **header**: Textos do cabeçalho
- **dashboard**: Textos do dashboard/página principal
- **table**: Textos da tabela de ações
- **modal**: Textos do modal de adicionar ação
- **errors**: Mensagens de erro

## 💾 Persistência

A preferência de idioma do usuário é salva automaticamente em `localStorage` com a chave `'locale'`, garantindo que a escolha seja mantida entre sessões.

## ⚙️ Migração de Componentes

Para migrar componentes existentes para usar o novo sistema de tradução, substitua strings hardcoded por chamadas ao hook `useTranslation`. Exemplo:

**Antes:**
```typescript
<button>{isRefreshing ? "Updating..." : "Refresh All"}</button>
```

**Depois:**
```typescript
import { useTranslation } from '@/hooks/useTranslation';

export default function Header() {
  const { t } = useTranslation();
  
  return (
    <button>{isRefreshing ? t('header.updating') : t('header.refreshAll')}</button>
  );
}
```
