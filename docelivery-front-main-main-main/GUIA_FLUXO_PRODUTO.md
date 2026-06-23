# 📋 Guia Completo: Fluxo de Criação/Edição de Produtos

## 🎯 Resumo do Problema Original

O backend espera requisições **multipart/form-data** divididas em partes (@RequestPart), mas o frontend estava enviando JSON comum. Agora está 100% alinhado.

---

## 📦 FLUXO CORRETO DE ENVIO DE DADOS

### 1️⃣ **Frontend - CardapioManager.jsx (Preparação)**

```
┌─────────────────────────────────────────────────────────────┐
│ HANDLECHANGE (Usuário preenche o formulário)                 │
│ → Nome, Preço, Categoria, Descrição, Imagem                 │
│ → formData = { nome, preco, categoria, estoque, ... }       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ HANDLESAVE (Usuário clica em "Salvar")                       │
│                                                              │
│ ✅ PASSO 1: Validações básicas                              │
│    - Nome não vazio                                          │
│    - Preço > 0                                               │
│    - Categoria selecionada                                   │
│                                                              │
│ ✅ PASSO 2: Mapear categoria nome → ID numérico             │
│    'bolos' → 1, 'cupcakes' → 2, etc.                        │
│    (Via categoryMap)                                         │
│                                                              │
│ ✅ PASSO 3: Construir objeto ProdutoDTO                     │
│    {                                                         │
│      nome: "Brigadeiro",                                     │
│      preco: 5.50,          // NÚMERO                         │
│      estoque: 10,          // NÚMERO                         │
│      categoriaId: 6,       // 🔴 ID NUMÉRICO (não objeto)   │
│      descricao: "...",                                       │
│      disponivel: true                                        │
│    }                                                         │
│                                                              │
│ ✅ PASSO 4: Chamar ProdutoService.criarProduto()           │
│    - Passa: dados, imagem, confeiteiroId                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
```

### 2️⃣ **Frontend - ProdutoService.js (Estruturação)**

```
┌─────────────────────────────────────────────────────────────┐
│ CRIARPRODUCTO(dados, imagem, confeiteiroId)                │
│                                                              │
│ ✅ VALIDAÇÃO: Dados obrigatórios                            │
│    - dados != null                                           │
│    - dados.nome não vazio                                    │
│    - dados.preco > 0                                         │
│    - dados.categoriaId > 0                                   │
│    - confeiteiroId > 0                                       │
│                                                              │
│ ✅ NORMALIZAÇAO: Converter tipos                             │
│    - preco: string → parseFloat                              │
│    - estoque: string → parseInt                              │
│                                                              │
│ ✅ CONSTRUIR FORMDATA:                                       │
│    const formData = new FormData();                          │
│                                                              │
│    // Parte 1: JSON do produto como Blob                     │
│    formData.append(                                          │
│      "produto",  // 🔴 Nome EXATO esperado pelo backend      │
│      new Blob([JSON.stringify(dados)], {                     │
│        type: 'application/json'                              │
│      })                                                      │
│    );                                                        │
│                                                              │
│    // Parte 2: Arquivo de imagem (opcional)                  │
│    if (imagem) {                                             │
│      formData.append(                                        │
│        "imagem",  // 🔴 Nome EXATO esperado pelo backend     │
│        imagem     // File object do input                    │
│      );                                                      │
│    }                                                         │
│                                                              │
│ ✅ CONSTRUIR URL com Query Parameter:                       │
│    URL = /api/produtos?confeiteiroId=10005                  │
│    └─ confeiteiroId como query param, NÃO no body           │
│                                                              │
│ ✅ POST sem headers manuais:                                │
│    axios.post(url, formData)                                │
│    └─ Navegador define Content-Type automaticamente         │
│       com boundary correto                                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
```

### 3️⃣ **Requisição HTTP (Tráfego de Rede)**

```
POST /api/produtos?confeiteiroId=10005 HTTP/1.1
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...

------WebKitFormBoundary...
Content-Disposition: form-data; name="produto"
Content-Type: application/json

{
  "nome": "Brigadeiro",
  "preco": 5.50,
  "estoque": 10,
  "categoriaId": 6,
  "descricao": "Brigadeiro gourmet",
  "disponivel": true
}
------WebKitFormBoundary...
Content-Disposition: form-data; name="imagem"; filename="brigadeiro.jpg"
Content-Type: image/jpeg

[bytes do arquivo JPEG...]
------WebKitFormBoundary...--
```

### 4️⃣ **Backend - ProdutoController.java (Recepção)**

```java
@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<?> create(
    @RequestPart("produto") ProdutoDTO dto,      // ← Blob JSON decodificado
    @RequestPart(value = "imagem", required = false) MultipartFile imagem,  // ← File
    @RequestParam("confeiteiroId") Long confeiteiroId   // ← Query param
)

// ✅ Spring automaticamente:
// 1. Detecta Content-Type com boundary
// 2. Separa as partes pelo boundary
// 3. Decodifica JSON do "produto" → ProdutoDTO
// 4. Extrai arquivo de "imagem" → MultipartFile
// 5. Lê query param confeiteiroId
```

---

## 🔴 ERROS COMUNS E COMO EVITÁ-LOS

### ❌ Erro 1: Enviando string em vez de número para categoriaId
```javascript
// ERRADO
{
  categoriaId: "6"  // String
}

// CORRETO
{
  categoriaId: 6  // Número
}
```

### ❌ Erro 2: Forçando Content-Type manualmente
```javascript
// ERRADO
axios.post(url, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }  // NÃO FAÇA ISTO
})

// CORRETO
axios.post(url, formData)  // Deixe o navegador cuidar
```

### ❌ Erro 3: Enviando objeto Categoria completo
```javascript
// ERRADO
{
  categoria: {
    id: 6,
    nome: "Brigadeiros"
  }
}

// CORRETO
{
  categoriaId: 6
}
```

### ❌ Erro 4: Não estruturar como FormData
```javascript
// ERRADO
axios.post(url, dados)  // JSON plano

// CORRETO
const formData = new FormData();
formData.append("produto", new Blob([JSON.stringify(dados)], { type: 'application/json' }));
formData.append("imagem", imagem);
axios.post(url, formData)
```

---

## 🧪 COMO TESTAR

### 1. **Abra o DevTools (F12)**
Vá em: Network (Rede) → XHR (XMLHttpRequest)

### 2. **Preencha o formulário**
- Nome: "Brigadeiro Gourmet"
- Preço: 5.50
- Categoria: "Brigadeiros" ✅ (DEVE SER SELECIONADA)
- Estoque: 10
- Upload de imagem (opcional)

### 3. **Clique em "💾 Salvar Produto"**

### 4. **Verifique a requisição**
Na aba Network, procure pela requisição POST e clique nela:

#### **Headers**
```
POST /api/produtos?confeiteiroId=10005
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW
Authorization: Bearer [token]
```

#### **Payload (ou Form Data)**
Deve mostrar 2 partes:
- `produto`: JSON do DTO
- `imagem`: nome do arquivo

### 5. **Verifique o Console (F12 → Console)**
Você deve ver logs como:
```
📦 ProdutoService.criarProduto():
   URL: /api/produtos?confeiteiroId=10005
   Dados: { nome: "Brigadeiro...", categoriaId: 6, ... }
   Imagem: brigadeiro.jpg (45234 bytes)
```

---

## ✅ CHECKLIST FINAL

Antes de enviar, certifique-se:

- [ ] Categoria foi **selecionada** no formulário
- [ ] categoryMap tem mapeamento para a categoria selecionada
- [ ] `categoriaId` está como **NÚMERO**, não string
- [ ] FormData está estruturado com chaves "produto" e "imagem"
- [ ] JSON do produto está dentro de um Blob com type 'application/json'
- [ ] `confeiteiroId` vai como **query parameter** (?confeiteiroId=...)
- [ ] NÃO há header 'Content-Type' manual
- [ ] URL correta: `/api/produtos?confeiteiroId=...`
- [ ] Imagem é um File object real (não URL ou string)
- [ ] Preço e estoque são NÚMEROS, não strings

---

## 📚 Arquivos Modificados

1. **produtoService.js**
   - ✅ Validações completas
   - ✅ Logs detalhados de debug
   - ✅ Documentação em comentários

2. **CardapioManager.jsx**
   - ✅ 7 passos de validação e envio
   - ✅ Logs em console.group()
   - ✅ Mensagens de erro descritivas

---

## 🚀 RESUMO EXECUTIVO

```
Usuario preenche formulário
        ↓
Clica "Salvar"
        ↓
handleSave() valida dados
        ↓
Mapeia categoria nome → ID numérico
        ↓
Chama ProdutoService.criarProduto()
        ↓
ProdutoService monta FormData:
  - "produto" = Blob JSON
  - "imagem" = File
  - confeiteiroId = query param
        ↓
Envia multipart/form-data
        ↓
Backend recebe com @RequestPart e @RequestParam
        ↓
Salva no banco ✅
```

