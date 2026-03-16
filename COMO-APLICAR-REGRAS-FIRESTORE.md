# Como Aplicar as Regras do Firestore

## ⚠️ IMPORTANTE: O erro de permissões ocorre porque as regras não foram publicadas no Firebase Console.

## Passos para Aplicar as Regras:

### 1. Abrir o Firebase Console
- Vai a: https://console.firebase.google.com/
- Seleciona o projeto: **powerup-a8304**

### 2. Navegar para Firestore Database
- No menu lateral esquerdo, clica em **"Firestore Database"**
- Clica no separador **"Regras"** (Rules) no topo

### 3. Copiar as Regras
- Abre o ficheiro `firestore-rules.txt` neste projeto
- Copia **TODO** o conteúdo do ficheiro

### 4. Colar no Editor de Regras
- No Firebase Console, no editor de regras, **apaga tudo** que está lá
- Cola o conteúdo completo do `firestore-rules.txt`

### 5. Publicar as Regras
- Clica no botão **"Publicar"** (Publish) no topo direito
- Aguarda a confirmação de que as regras foram publicadas

### 6. Verificar
- Após publicar, espera alguns segundos (10-30 segundos)
- Recarrega a aplicação no navegador
- O erro de permissões deve desaparecer

## 🔍 Verificação das Regras

As regras devem incluir esta secção para `prebuilt_workouts`:

```
match /prebuilt_workouts/{workoutId} {
  allow read: if true; // Qualquer pessoa pode ler
  allow write: if false; // Apenas admins podem escrever
}
```

## ⚠️ Nota de Segurança

As regras permitem leitura pública de:
- `prebuilt_workouts` (workouts pré-feitos)
- `exercise_library` (biblioteca de exercícios)
- `professionals` (profissionais)
- `app_config` (configuração da app)

Isto é **intencional** porque estes dados devem ser acessíveis a todos os utilizadores da aplicação.

## 🐛 Se o Erro Persistir

1. Verifica se copiaste **TODO** o conteúdo do ficheiro (incluindo `rules_version = '2';` no início)
2. Verifica se não há erros de sintaxe no editor (o Firebase mostra erros em vermelho)
3. Aguarda 30-60 segundos após publicar antes de testar
4. Limpa a cache do navegador (Ctrl+Shift+Delete)
5. Verifica se estás autenticado na aplicação (o erro pode aparecer se não estiveres logado)

