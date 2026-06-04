# ERP Automação — Império do Gás
## Documentação da API REST

**Base URL:** `http://localhost:8081`  
**Formato de Resposta:** Todas as respostas seguem o envelope padrão `ApiResponse<T>`:

```json
{
  "success": true,
  "data": { ... }
}
```

---

## Categorias de Produto (ENUM Fixo)

Os produtos são categorias pré-definidas — não existe mais uma tabela de produtos:

| Valor ENUM | Descrição |
|---|---|
| `GLP_13KG_CHEIO` | Botijão 13kg Cheio |
| `GLP_13KG_VAZIO` | Botijão 13kg Vazio |
| `GLP_20KG_CHEIO` | Botijão 20kg Cheio |
| `GLP_20KG_VAZIO` | Botijão 20kg Vazio |
| `GLP_45KG_CHEIO` | Botijão 45kg Cheio |
| `GLP_45KG_VAZIO` | Botijão 45kg Vazio |

---

## People (Pessoas)

### `GET /api/people`
Lista todas as pessoas cadastradas.

**Resposta 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "João da Silva",
      "document": "123.456.789-00",
      "phone": "(11) 99999-0001",
      "person_type": "FISICA"
    }
  ]
}
```

---

### `GET /api/people/{id}`
Retorna uma pessoa pelo UUID.

---

### `POST /api/people`
Cria uma nova pessoa.

**Body:**
```json
{
  "name": "João da Silva",
  "document": "123.456.789-00",
  "phone": "(11) 99999-0001",
  "person_type": "FISICA"
}
```

| Campo | Tipo | Obrigatório | Valores |
|---|---|---|---|
| `name` | string | ✅ | — |
| `document` | string | ❌ | CPF ou CNPJ |
| `phone` | string | ❌ | — |
| `person_type` | string | ✅ | `FISICA`, `JURIDICA` |

---

### `PUT /api/people/{id}`
Atualiza os dados de uma pessoa. Mesmo body do POST.

---

### `DELETE /api/people/{id}`
Remove uma pessoa.

---

## Clients (Clientes)

### `GET /api/clients`
Lista todos os clientes com dados da pessoa vinculada.

**Resposta 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "payment_deadline_days": 30,
      "active": true,
      "people": {
        "id": "uuid",
        "name": "João da Silva"
      }
    }
  ]
}
```

---

### `GET /api/clients/{id}`
Retorna um cliente pelo UUID.

---

### `POST /api/clients`
Cria um cliente vinculado a uma pessoa pré-existente.

**Body:**
```json
{
  "person_id": "uuid-da-pessoa",
  "payment_deadline_days": 30,
  "active": true
}
```

| Campo | Tipo | Obrigatório |
|---|---|---|
| `person_id` | UUID | ✅ |
| `payment_deadline_days` | integer | ❌ (padrão: 30) |
| `active` | boolean | ❌ (padrão: true) |

---

### `PUT /api/clients/{id}` / `DELETE /api/clients/{id}`
Mesmo padrão dos outros recursos.

---

## Inbounds (Entradas de Estoque / Remessas)

### `GET /api/inbounds`
Lista todas as remessas com seus itens de estoque aninhados.

**Resposta 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "invoice_number": "NF-001234",
      "truck_plate": "ABC-1234",
      "status": "ABERTO",
      "totalAmount": 5970.00,
      "created_at": "2026-06-04T15:30:00",
      "items": [
        {
          "id": "uuid-do-item",
          "category": "GLP_13KG_CHEIO",
          "quantity": 100,
          "availableQuantity": 95,
          "unitCost": 45.00,
          "subtotal": 4500.00
        }
      ]
    }
  ]
}
```

> [!IMPORTANT]
> O campo `items[].id` (UUID do InboundItem) é o que deve ser usado no corpo de criação de pedidos como `inboundItemId`.

---

### `POST /api/inbounds`
Registra uma nova remessa de entrada com seus itens por categoria.

**Body:**
```json
{
  "invoiceNumber": "NF-001234",
  "truckPlate": "ABC-1234",
  "items": [
    {
      "category": "GLP_13KG_CHEIO",
      "quantity": 100,
      "unitCost": 45.00
    },
    {
      "category": "GLP_20KG_CHEIO",
      "quantity": 50,
      "unitCost": 72.00
    }
  ]
}
```

| Campo | Tipo | Obrigatório |
|---|---|---|
| `invoiceNumber` | string | ✅ |
| `truckPlate` | string | ✅ |
| `items` | array | ✅ |
| `items[].category` | ProductCategory ENUM | ✅ |
| `items[].quantity` | integer | ✅ |
| `items[].unitCost` | decimal | ✅ |

**Comportamento automático:**
- `availableQuantity` de cada item iniciará igual ao `quantity` informado
- `status` do inbound iniciará como `"ABERTO"`
- `totalAmount` do inbound é calculado como `SUM(quantity * unitCost)`

---

## Orders (Vendas / Pedidos)

### `GET /api/orders`
Lista todos os pedidos.

**Resposta 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "sale_type": "DINHEIRO",
      "status": "FINALIZADO",
      "total_amount": 300.00,
      "created_at": "2026-06-04T16:00:00",
      "clients": { "id": "uuid" },
      "delivery_driver_id": null,
      "items": [
        {
          "id": "uuid",
          "inboundItem": { "id": "uuid", "category": "GLP_13KG_CHEIO" },
          "quantity": 5,
          "unitPrice": 60.00,
          "subtotal": 300.00
        }
      ]
    }
  ]
}
```

---

### `GET /api/orders/{id}`
Retorna um pedido específico pelo UUID.

---

### `POST /api/orders`
Registra uma nova venda. Este é o endpoint crítico do fluxo de rastreabilidade.

**Body:**
```json
{
  "clientId": "uuid-do-cliente",
  "driverId": null,
  "saleType": "DINHEIRO",
  "status": "FINALIZADO",
  "items": [
    {
      "inboundItemId": "uuid-do-inbound-item",
      "quantity": 5,
      "unitPrice": 60.00
    }
  ]
}
```

| Campo | Tipo | Obrigatório | Notas |
|---|---|---|---|
| `clientId` | UUID | ❌ | Vendas avulsas aceitam null |
| `driverId` | UUID | ❌ | Retirada no balcão = null |
| `saleType` | string | ✅ | `DINHEIRO`, `FIADO`, `CARTAO`, `PIX` |
| `status` | string | ❌ | Padrão: `ABERTO`. Valores: `ABERTO`, `FINALIZADO`, `CANCELADO` |
| `items[].inboundItemId` | UUID | ✅ | UUID do item do lote (de GET /api/inbounds) |
| `items[].quantity` | integer | ✅ | Não pode exceder `availableQuantity` do lote |
| `items[].unitPrice` | decimal | ✅ | Preço de **venda** (não o custo) |

**Regras de negócio:**
1. Para cada item, o sistema busca o `InboundItem` pelo `inboundItemId`
2. Valida: `quantity <= inboundItem.availableQuantity`
3. Se validação falhar → erro `"Quantidade insuficiente em estoque para o lote selecionado."`
4. Se OK → `availableQuantity -= quantity` (operação transacional `@Transactional`)
5. `totalAmount` = `SUM(quantity * unitPrice)` de todos os itens

> [!CAUTION]
> O backend realiza validação de estoque **server-side**. Mesmo que o frontend bloqueie quantidades inválidas, o backend rejeitará a venda se o saldo for insuficiente no momento do processamento.

---

### `PUT /api/orders/{id}`
Atualiza um pedido existente. Aceita o body da entidade `Order` diretamente.

> [!WARNING]
> Esta rota **não** recalcula saldos de estoque. Use apenas para atualizar metadados como `status`.

---

### `DELETE /api/orders/{id}`
Remove um pedido. **Não** estorna o estoque automaticamente.

---

## Fluxo Completo de Uso Recomendado

```
1. POST /api/people         → Cria uma pessoa
2. POST /api/clients        → Vincula a pessoa como cliente
3. POST /api/inbounds       → Registra uma remessa com os itens (GLP categories + custo)
4. GET  /api/inbounds       → Lista lotes disponíveis (filtre por availableQuantity > 0 no frontend)
5. POST /api/orders         → Cria venda referenciando inboundItemId dos itens do lote
6. GET  /api/orders         → Lista pedidos realizados
```
