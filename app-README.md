# 💪 Workout App - Gerenciador de Treinos

App completo para gerenciar treinos de musculação com 3 planos (A, B, C), timer de descanso e histórico de treinos.

## 🎯 Funcionalidades

### ✨ Recursos Principais
- **3 Planos de Treino** (A, B, C) com exercícios específicos
- **Timer de Descanso** - 90 segundos automáticos entre séries
- **Rastreamento de Séries** - marca quantas séries você completou
- **Navegação Entre Exercícios** - anterior/próximo exercício
- **Histórico de Treinos** - veja quantos treinos completou
- **Estatísticas Mensais** - acompanhe seu progresso

### 🎨 Design
- **Tema Preto e Roxo** elegante e moderno
- **Interface Responsiva** - funciona em desktop e mobile
- **Animações Suaves** - transições agradáveis
- **Cores Gradientes** - visual profissional

## 🏋️ Planos de Treino

### A – Quadríceps
- Agachamento livre – 4×8–10
- Leg Press 45° – 4×10–12
- Afundo búlgaro – 3×10 cada perna
- Cadeira extensora – 3×12–15
- Abdômen – 3 séries

### B – Posterior e Glúteos
- Levantamento terra – 4×6–8
- Elevação pélvica – 4×10–12
- Mesa flexora – 4×10–12
- Cadeira flexora – 3×12–15
- Coice no cabo – 3×12–15 cada perna
- Abdutora – 3×15–20
- Panturrilha em pé ou no Leg Press – 4×12–15

### C – Superiores
- Puxada frontal – 4×10–12
- Remada baixa – 3×10–12
- Supino inclinado com halteres – 3×10–12
- Desenvolvimento com halteres – 3×10–12
- Elevação lateral – 3×12–15
- Tríceps na polia – 3×10–12
- Rosca direta ou alternada – 3×10–12

## 🚀 Como Usar

1. **Abra o arquivo `index.html` no navegador**
2. **Selecione um plano** (A, B ou C)
3. **Para cada exercício:**
   - Leia o nome, séries e repetições
   - Clique "Série Concluída" ao terminar cada série
   - O app ativa um timer de 90 segundos de descanso
   - Use os botões "Anterior/Próximo" para navegar
4. **Ao terminar todos os exercícios:**
   - Clique "Completar Treino"
   - O treino será registrado no histórico

## 📊 Estatísticas

- **Visualize na tela inicial:**
  - Quantos treinos A, B e C você fez este mês
  - Total de treinos completados
  - Opção de limpar o histórico

## 🛠️ Estrutura de Arquivos

```
├── index.html          # Interface HTML
├── style.css           # Estilos (tema preto e roxo)
├── app.js              # Lógica principal
├── workouts.js         # Dados dos planos de treino
├── storage.js          # Gerenciamento de localStorage
└── README.md           # Documentação
```

## 💾 Armazenamento

Todo o histórico é salvo **localmente no navegador** (localStorage):
- Sem necessidade de backend
- Dados persistem entre sessões
- Limpe o histórico quando desejar

## 🎨 Tema

**Cores Principais:**
- Roxo primário: `#9D4EDD`
- Roxo claro: `#C77DFF`
- Roxo bem claro: `#E0AAFF`
- Preto: `#1A1A2E`
- Preto profundo: `#0F0F1E`
- Sucesso: `#06D6A0`

## 📱 Compatibilidade

- ✅ Chrome, Firefox, Safari, Edge (navegadores modernos)
- ✅ Desktop e Mobile
- ✅ Sem dependências externas

## 🚀 Próximas Melhorias

- [ ] Adicionar mais planos de treino
- [ ] Personalizar séries e repetições
- [ ] Gráficos de progresso
- [ ] Exportar histórico
- [ ] Modo offline com Service Worker

## 📝 Licença

MIT - Sinta-se livre para usar e modificar!

---

**Desenvolvido para seus alunos de musculação! 💪**
