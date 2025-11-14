# 🏠 All Sites DF - Sistema CRM Avançado com IA

Sistema completo de gestão imobiliária com CRM visual, automação via WhatsApp, Lead Scoring inteligente e muito mais!

[![Deploy](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

## 🚀 **Funcionalidades Principais**

### 📊 **CRM Visual Kanban**
- Interface drag & drop profissional
- 7 stages do funil de vendas
- Histórico completo de mudanças
- Cards visuais com informações do lead
- Operações em lote

### 🎯 **Lead Scoring Automático**
- Pontuação inteligente 0-100
- 14 regras configuráveis
- Classificação: Cold/Warm/Hot/Very Hot
- Breakdown por categoria (perfil, engajamento, intenção, match)
- Histórico de evolução do score

### 🤖 **Bot WhatsApp com IA**
- Responde automaticamente 24/7
- IA especializada (Claude Sonnet 4.5)
- Extração inteligente de dados
- Criação automática de leads
- Cálculo de Lead Score em tempo real
- Multi-provedor (Evolution/Twilio/UltraMsg)

### 💬 **Monitor de Conversas**
- Visualização de chats em tempo real
- Lista de conversas ativas
- Lead Score visual de cada conversa
- Auto-refresh a cada 10s
- Assumir conversa manualmente

### 📋 **Sistema de Tarefas**
- Tarefas com prazos e prioridades
- Criação automática via bot
- Follow-ups agendados
- Notificações

### 🏠 **Gestão de Imóveis**
- CRUD completo
- Upload de múltiplas imagens
- Vídeos integrados
- Geolocalização GPS
- Mapas interativos
- Filtros avançados

---

## 📸 **Screenshots**

### CRM Kanban
![CRM Kanban](docs/screenshots/crm-kanban.png)

### Monitor de Conversas
![Bot Monitor](docs/screenshots/bot-monitor.png)

### Lead Scoring
![Lead Scoring](docs/screenshots/lead-scoring.png)

---

## 🛠️ **Tecnologias**

- **Frontend:** Next.js 15, React 19, TypeScript
- **Backend:** Next.js API Routes
- **Banco de Dados:** PostgreSQL (Prisma ORM)
- **IA:** Anthropic Claude Sonnet 4.5
- **UI:** Tailwind CSS, @hello-pangea/dnd
- **Autenticação:** NextAuth.js
- **Deploy:** Vercel

---

## 🏗️ **Instalação Local**

### **Pré-requisitos**

- Node.js 18+
- PostgreSQL (ou Neon/Supabase)
- Chave API Anthropic

### **Passo a Passo**

```bash
# 1. Clone o repositório
git clone https://github.com/gpropadm/bsimoveisdf.git
cd bsimoveisdf

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais

# 4. Configure o banco de dados
npx prisma generate
npx prisma db push

# 5. Popule dados iniciais
node prisma/seed-crm.js

# 6. Inicie o servidor
npm run dev
```

Acesse: http://localhost:3000

---

## 🌐 **Deploy em Produção**

Veja o guia completo: **[CONFIGURACAO_PRODUCAO.md](CONFIGURACAO_PRODUCAO.md)**

### **Quick Start:**

1. Importe na Vercel: https://vercel.com/
2. Configure variáveis de ambiente
3. Deploy automático!

**Variáveis obrigatórias:**
- `DATABASE_URL` - PostgreSQL
- `NEXTAUTH_URL` - URL do site
- `NEXTAUTH_SECRET` - Chave secreta
- `ANTHROPIC_API_KEY` - Chave Claude

---

## 📚 **Documentação**

- **[CRM_AVANCADO_PROGRESSO.md](CRM_AVANCADO_PROGRESSO.md)** - Progresso da implementação
- **[BOT_WHATSAPP_GUIA.md](BOT_WHATSAPP_GUIA.md)** - Guia completo do bot
- **[DEPLOY_GUIDE.md](DEPLOY_GUIDE.md)** - Guia de deploy
- **[CONFIGURACAO_PRODUCAO.md](CONFIGURACAO_PRODUCAO.md)** - Configuração de produção

---

## 🧪 **Testes**

### **Testar Bot WhatsApp**

```bash
# Execute o script de teste
node test-bot.js
```

### **Testar via API**

```bash
curl -X POST http://localhost:3000/api/bot/whatsapp/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "from": "+5561999999999",
    "text": "Quero apartamento 2 quartos",
    "id": "test_1"
  }'
```

---

## 📊 **Estrutura do Projeto**

```
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── crm/              # CRM Kanban
│   │   │   ├── bot-monitor/      # Monitor de conversas
│   │   │   ├── leads/            # Gestão de leads
│   │   │   └── ...
│   │   ├── api/
│   │   │   ├── bot/              # APIs do bot WhatsApp
│   │   │   ├── admin/
│   │   │   │   ├── crm/          # APIs do CRM
│   │   │   │   ├── bots/         # APIs de gestão de bots
│   │   │   │   └── lead-scoring/ # APIs de scoring
│   │   │   └── ...
│   │   └── ...
│   ├── components/
│   │   ├── CRMKanban.tsx         # Componente Kanban
│   │   ├── BotMonitor.tsx        # Monitor de conversas
│   │   └── ...
│   ├── lib/
│   │   ├── bot-engine.ts         # Motor do bot com IA
│   │   ├── prisma.ts             # Cliente Prisma
│   │   └── ...
│   └── ...
├── prisma/
│   ├── schema.prisma             # Schema do banco
│   └── seed-crm.js               # Seed de dados
├── test-bot.js                   # Script de testes
└── ...
```

---

## 🔐 **Variáveis de Ambiente**

Veja `.env.example` para a lista completa.

### **Essenciais:**

```bash
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://seu-dominio.com"
NEXTAUTH_SECRET="senha_secreta"
ANTHROPIC_API_KEY="sk-ant-..."
```

### **WhatsApp Bot (Opcional):**

```bash
WHATSAPP_PROVIDER="evolution"
EVOLUTION_API_URL="http://localhost:8080"
EVOLUTION_API_KEY="sua_chave"
EVOLUTION_INSTANCE_NAME="bot-imoveis"
```

---

## 🤝 **Contribuindo**

Contribuições são bem-vindas!

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'feat: Nova funcionalidade'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

---

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🆘 **Suporte**

- **Issues:** https://github.com/gpropadm/bsimoveisdf/issues
- **Documentação:** Veja os arquivos .md no repositório
- **Email:** [seu-email@exemplo.com]

---

## 🎯 **Roadmap**

### **Implementado (75%)** ✅
- [x] CRM Kanban Visual
- [x] Lead Scoring Automático
- [x] Bot WhatsApp com IA
- [x] Monitor de Conversas
- [x] Sistema de Tarefas (estrutura)
- [x] Gestão de Imóveis
- [x] Dashboard

### **Em Desenvolvimento (20%)** 🚧
- [ ] Processamento Multimodal (áudio, imagem, PDF)
- [ ] Follow-ups Automáticos
- [ ] Templates de Mensagens
- [ ] Analytics Avançado

### **Planejado (5%)** 📋
- [ ] App Mobile
- [ ] Integração com ERPs
- [ ] Chamadas telefônicas
- [ ] Sistema de Billing

---

## 🏆 **Créditos**

Desenvolvido com ❤️ usando:
- **Claude Code** (Anthropic)
- **Next.js** (Vercel)
- **Prisma** (Prisma Labs)
- E muitas outras ferramentas incríveis!

---

## 📞 **Contato**

- **Website:** https://bsimoveisdf.com.br
- **Email:** contato@bsimoveisdf.com.br
- **GitHub:** https://github.com/gpropadm/bsimoveisdf

---

**⭐ Se este projeto te ajudou, considere dar uma estrela no GitHub!**
