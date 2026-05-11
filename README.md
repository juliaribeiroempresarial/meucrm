# MEU CRM 🏆

Sistema de Gestão Comercial completo — Leads, Metas, Fechamentos, Produção, Ranking e muito mais.

## 🚀 Deploy Rápido na Vercel

### Opção 1 — GitHub + Vercel (recomendado)

1. Crie um repositório no GitHub e faça upload desta pasta
2. Acesse [vercel.com](https://vercel.com) e clique em **"Add New Project"**
3. Importe o repositório do GitHub
4. As configurações são detectadas automaticamente (Vite + React)
5. Clique em **Deploy** — pronto!

### Opção 2 — Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## 💻 Rodar localmente

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
# Acesse: http://localhost:3000

# Build para produção
npm run build

# Preview do build
npm run preview
```

---

## 📁 Estrutura do Projeto

```
meu-crm/
├── public/
│   └── favicon.svg          # Ícone do site
├── src/
│   ├── App.jsx              # Aplicação completa (componentes + lógica)
│   └── main.jsx             # Entry point React
├── index.html               # HTML raiz
├── package.json             # Dependências
├── vite.config.js           # Configuração do Vite
├── vercel.json              # Configuração da Vercel (SPA routing)
└── .gitignore
```

---

## ⚙️ Stack

- **React 18** — Interface
- **Vite 5** — Build tool
- **CSS-in-JS** — Estilos inline (sem dependência de CSS externo)
- **localStorage** — Persistência de dados no navegador

---

## 🔐 Primeiro Acesso

Na primeira vez que abrir o sistema, uma tela de **configuração inicial** vai aparecer para você criar sua conta de **Administrador** com nome, e-mail e senha.

Após isso, o login é feito com e-mail + senha. O administrador pode adicionar outros usuários (Supervisor e Vendedor) em **Configurações → Usuários do Sistema**.

---

## 💾 Dados

Os dados são salvos no **localStorage** do navegador de cada usuário. Isso significa:

- ✅ Funciona sem banco de dados externo
- ✅ Gratuito e sem configuração
- ⚠️ Os dados são por dispositivo — cada computador/celular tem seus próprios dados

Para sincronizar entre dispositivos, seria necessário integrar um backend (Firebase, Supabase, etc.).

---

## 📋 Funcionalidades

| Módulo | Descrição |
|--------|-----------|
| **Dashboard** | Visão geral com calendário de meses, KPIs e gráficos |
| **Leads** | Gestão completa com histórico, status e filtros |
| **Metas** | Meta mensal geral e individual por vendedor |
| **Fechamentos** | Registro de vendas com status (Ativa/Pendente/Cancelada) |
| **Comissões** | Área protegida com ranking e histórico |
| **Equipe** | Cadastro de vendedores com registro de vendas |
| **Produção Diária** | Planilha operacional com metas D/S/M |
| **Meta Diária** | Progresso individual em tempo real |
| **Ranking** | Diário, semanal e mensal com pódio |
| **Agenda Comercial** | Timeline de eventos por hora |
| **Tarefas** | Lista com prioridades e responsáveis |
| **Reuniões** | Gestão de reuniões com status |
| **Central de Indicadores** | KPIs, funil de conversão e performance |
| **Relatórios** | Análise por origem, status e vendedor |
| **Configurações** | Usuários, metas e dados do sistema |

---

## 👥 Perfis de Acesso

| Perfil | Acesso |
|--------|--------|
| 👑 **Admin** | Acesso total, gerencia usuários, vê comissões |
| 📊 **Supervisor** | Leads, equipe, relatórios, edita metas |
| 💼 **Vendedor** | Seus próprios leads e fechamentos |

---

*MEU CRM v2.0 — Feito com React + Vite*
