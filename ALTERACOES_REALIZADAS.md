# Alterações Realizadas no PowerUp App

## 📅 Data: 05 de Dezembro de 2025

---

## ✅ 1. Alteração da Cor Laranja

### Objetivo
Substituir todas as cores laranja no aplicativo pela cor específica **#e16716**.

### Alterações Realizadas
- **89 ocorrências** de cores laranja foram substituídas
- Cores hexadecimais `#FF6B35` e `#F7931E` → `#e16716`
- Classes Tailwind:
  - `text-orange-500` → `text-[#e16716]`
  - `bg-orange-500` → `bg-[#e16716]`
  - `border-orange-500` → `border-[#e16716]`
- Gradientes ajustados proporcionalmente:
  - `from-orange-500` → `from-[#e16716]`
  - `to-orange-600` → `to-[#d15a10]`
  - Estados hover mantêm tons mais escuros

### Resultado
✅ Todas as cores laranja agora utilizam a cor #e16716 consistentemente em toda a interface.

---

## ✅ 2. Implementação de Modo Claro e Modo Escuro

### Objetivo
Adicionar funcionalidade de alternância entre modo claro e modo escuro, com preferência salva.

### Componentes Implementados

#### 2.1 Variáveis CSS
Criadas variáveis CSS personalizadas para suportar ambos os temas:

**Modo Claro (`:root`):**
- `--bg-primary`: #f3f4f6 (fundo principal)
- `--bg-secondary`: #ffffff (fundo secundário)
- `--bg-tertiary`: #e5e7eb (fundo terciário)
- `--text-primary`: #1f2937 (texto principal)
- `--text-secondary`: #4b5563 (texto secundário)
- `--card-bg`: #ffffff (fundo de cards)
- `--input-bg`: #f9fafb (fundo de inputs)
- `--shadow`: rgba(0, 0, 0, 0.1) (sombras)

**Modo Escuro (`[data-theme="dark"]`):**
- `--bg-primary`: #111827
- `--bg-secondary`: #1f2937
- `--bg-tertiary`: #374151
- `--text-primary`: #f9fafb
- `--text-secondary`: #e5e7eb
- `--card-bg`: #1f2937
- `--input-bg`: #374151
- `--shadow`: rgba(0, 0, 0, 0.3)

#### 2.2 Toggle de Alternância
Adicionado na página de **Configurações** > **Aplicação**:
- Toggle switch estilizado com a cor #e16716
- Label "Modo Escuro" com descrição
- Estado visual claro (ativado/desativado)

#### 2.3 Lógica JavaScript
Implementadas três funções principais:

**`initTheme()`**
- Carrega o tema salvo do localStorage
- Define modo escuro como padrão se não houver preferência salva
- Aplica o tema ao carregar a página

**`toggleTheme()`**
- Alterna entre modo claro e escuro
- Atualiza o atributo `data-theme` no elemento HTML
- Salva a preferência no localStorage
- Sincroniza o estado do toggle

**`setupThemeToggle()`**
- Configura o event listener do toggle
- Define o estado inicial baseado no tema atual
- Chamado ao abrir a página de configurações

#### 2.4 Classes CSS Responsivas
Criadas classes que respondem automaticamente ao tema:
- `.theme-bg-primary`, `.theme-bg-secondary`, `.theme-bg-tertiary`
- `.theme-text-primary`, `.theme-text-secondary`
- `.theme-card`, `.theme-input`, `.theme-border`
- Sobrescritas específicas para classes Tailwind existentes

### Características

✅ **Persistência**: A preferência do utilizador é salva no localStorage e carregada automaticamente

✅ **Transições Suaves**: Animações CSS para mudanças de tema sem "flash"

✅ **Cobertura Completa**: Todos os ecrãs e componentes respondem ao tema:
- Tela de login
- Tela de registo
- Dashboard
- Configurações
- Treinos
- Comunidade
- Todas as modais e popups

✅ **Acessibilidade**: Contrastes adequados em ambos os modos para legibilidade

✅ **Manutenibilidade**: Sistema baseado em variáveis CSS facilita ajustes futuros

### Como Usar

1. Abrir o aplicativo
2. Fazer login ou criar conta
3. Ir para **Configurações** (ícone de engrenagem)
4. Na seção **Aplicação**, encontrar o toggle **Modo Escuro**
5. Clicar no toggle para alternar entre modo claro e escuro
6. A preferência é salva automaticamente

### Modo Padrão
O aplicativo inicia em **Modo Escuro** por padrão, ideal para:
- Uso noturno
- Redução de cansaço visual
- Economia de bateria em telas OLED

### Modo Claro
Ativado manualmente pelo utilizador, ideal para:
- Uso diurno
- Ambientes bem iluminados
- Melhor legibilidade em exteriores

---

## 📦 Arquivos Modificados

- `index.html` - Arquivo principal com todas as alterações

## 🔧 Tecnologias Utilizadas

- **HTML5**
- **CSS3** (Variáveis CSS, Media Queries)
- **JavaScript** (ES6+)
- **Tailwind CSS** (Framework de utilidades)
- **LocalStorage API** (Persistência de preferências)

---

## 🎨 Paleta de Cores

### Cor Principal
- **Laranja**: #e16716

### Modo Escuro
- **Fundo**: #111827, #1f2937, #374151
- **Texto**: #f9fafb, #e5e7eb, #d1d5db

### Modo Claro
- **Fundo**: #f3f4f6, #ffffff, #e5e7eb
- **Texto**: #1f2937, #4b5563, #6b7280

---

## 📝 Notas Técnicas

- O tema é aplicado através do atributo `data-theme` no elemento `<html>`
- As variáveis CSS são definidas em `:root` e `[data-theme="dark"]`
- O localStorage usa a chave `'theme'` com valores `'light'` ou `'dark'`
- Todas as transições de cor têm duração de 300ms para suavidade

---

## ✨ Melhorias Futuras Sugeridas

1. Adicionar modo automático baseado na hora do dia
2. Sincronizar com preferências do sistema operativo
3. Adicionar mais opções de personalização de cores
4. Criar temas adicionais (ex: alto contraste)

---

**Desenvolvido com ❤️ para PowerUp App**
