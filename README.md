# ⏱️ Workout Timer

Um **timer simples, rápido e configurável para treinos**, pensado especialmente para aulas de **boxe, funcional, HIIT, circuito e personal training**.

O projeto roda direto no navegador, sem instalação e sem dependências externas.

## 🚀 Abrir o Timer

**[▶️ Abrir Workout Timer](https://hezirbrasil.github.io/Workout_Timer/)**

---

## ✨ Recursos

### 🧱 Montagem dos blocos

Monte sua aula bloco por bloco:

- ➕ Adicionar novos blocos
- ✏️ Editar nome e duração
- ⬆️ Mover bloco para cima
- ⬇️ Mover bloco para baixo
- 📋 **Duplicar bloco**
- 💤 **Adicionar descanso de 30 segundos**
- 🗑️ Excluir bloco
- 🧹 Limpar e restaurar os rounds padrão

Cada bloco pode ter qualquer nome: `Round 1`, `Saco`, `Funcional`, `Descanso`, `Troca`, `Core Blast`, etc.

### ⏱️ Timer

- Contagem regressiva em tempo real
- Anel visual de progresso
- Exibição do bloco atual
- Contador de blocos
- Tempo total do treino
- Modo de tela cheia/compacto para usar durante a aula
- Botão **← Menu** no canto superior esquerdo para sair do modo de execução

### 🔊 Avisos sonoros

O timer utiliza a **Web Audio API** para gerar os sons diretamente no navegador.

- 🔔 Aviso nos últimos **3 segundos** de cada bloco
- 🔄 Som de transição ao entrar no próximo bloco
- 🏁 Som de encerramento ao finalizar o treino
- O áudio é inicializado ao tocar em **Iniciar**, melhorando a compatibilidade com iPhone/iPad

### 💾 Salvamento automático

As configurações dos blocos são salvas no `localStorage` do navegador. Assim, ao abrir novamente o timer no mesmo dispositivo, seu treino continua disponível.

---

## 📱 Feito para aulas

O Workout Timer foi pensado para situações em que o professor precisa **montar a sequência rapidamente e deixar o timer rodando durante a aula**.

Exemplo:

```text
Aquecimento       05:00
Round 1            01:00
Descanso           00:30
Round 2            01:00
Descanso           00:30
Round 3            01:00
Descanso           00:30
Encerramento       01:00
```

Você também pode duplicar um round e inserir descansos rapidamente para montar sequências maiores.

---

## 🛠️ Tecnologias

- **HTML5**
- **CSS3**
- **JavaScript Vanilla**
- **Web Audio API**
- **LocalStorage**
- **GitHub Pages**

Sem frameworks e sem bibliotecas externas.

---

## 📂 Estrutura

```text
Workout_Timer/
├── index.html
├── app.js
├── enhancements.js
├── .gitignore
└── README.md
```

O `index.html` contém a interface principal do timer, enquanto os demais arquivos suportam a estrutura do projeto e suas melhorias.

---

## 📲 Compatibilidade

Funciona em navegadores modernos em:

- iPhone / iPad
- Android
- macOS
- Windows
- Linux

Para uma experiência melhor durante uma aula, use o timer em **tela cheia**.

---

## 🔮 Próximas ideias

Algumas funcionalidades que podem entrar no futuro:

- [ ] Salvar vários treinos
- [ ] Presets de treino
- [ ] Compartilhar um treino por link
- [ ] Personalizar os sons
- [ ] Personalizar cores e temas
- [ ] Vibração no celular
- [ ] PWA / instalação como aplicativo
- [ ] Histórico de treinos
- [ ] Versão Pro para professores e academias

---

## 👤 Autor

Desenvolvido por **Hezir Brasil**.

Projeto criado para facilitar a montagem e execução de aulas de **boxe, funcional, HIIT e treinamento personalizado**.

---

## 📄 Licença

MIT License.

Você pode usar, modificar e adaptar o projeto de acordo com os termos da licença.

---

**Sugestões, melhorias ou encontrou um bug? Abra uma issue no repositório.**