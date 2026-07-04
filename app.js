// Lógica principal do app
let currentWorkout = null;
let currentExerciseIndex = 0;
let completedSets = {};

// Elementos do DOM
const workoutSelector = document.getElementById('workout-selector');
const workoutContainer = document.getElementById('workout-container');
const exerciseContainer = document.getElementById('exercise-container');
const workoutTitle = document.getElementById('workout-title');
const exerciseName = document.getElementById('exercise-name');
const setsInfo = document.getElementById('sets-info');
const repsInfo = document.getElementById-reps-info');
const completeSetBtn = document.getElementById('complete-set-btn');
const nextExerciseBtn = document.getElementById('next-exercise-btn');
const prevExerciseBtn = document.getElementById('prev-exercise-btn');
const completeWorkoutBtn = document.getElementById('complete-workout-btn');
const timerContainer = document.getElementById('timer-container');
const restTimer = document.getElementById('rest-timer');
const historyStats = document.getElementById('history-stats');
const clearHistoryBtn = document.getElementById('clear-history-btn');

// Seleção de treino
function selectWorkout(type) {
  currentWorkout = { type, ...WORKOUTS[type] };
  currentExerciseIndex = 0;
  completedSets = {};
  
  workoutSelector.style.display = 'none';
  workoutContainer.style.display = 'block';
  
  updateDisplay();
  updateStats();
}

// Atualizar exibição do exercício
function updateDisplay() {
  if (!currentWorkout) return;

  const exercise = currentWorkout.exercises[currentExerciseIndex];
  workoutTitle.textContent = currentWorkout.name;
  exerciseName.textContent = exercise.name;
  setsInfo.textContent = `Séries: ${exercise.sets}`;
  repsInfo.textContent = `Repetições: ${exercise.reps}`;

  // Atualizar progresso
  document.getElementById('exercise-progress').textContent = 
    `Exercício ${currentExerciseIndex + 1} de ${currentWorkout.exercises.length}`;

  // Desabilitar botões conforme necessário
  prevExerciseBtn.disabled = currentExerciseIndex === 0;
  nextExerciseBtn.disabled = currentExerciseIndex === currentWorkout.exercises.length - 1;
}

// Completar série
function completeSet() {
  const key = `${currentExerciseIndex}`;
  completedSets[key] = (completedSets[key] || 0) + 1;
  
  const exercise = currentWorkout.exercises[currentExerciseIndex];
  if (completedSets[key] >= exercise.sets) {
    completeSetBtn.textContent = '✓ Completado!';
    completeSetBtn.disabled = true;
    startRestTimer();
  } else {
    completeSetBtn.textContent = `✓ Série ${completedSets[key]}/${exercise.sets}`;
    startRestTimer();
  }
}

// Iniciar timer de descanso (90 segundos)
function startRestTimer() {
  let timeLeft = 90;
  timerContainer.style.display = 'block';
  
  const interval = setInterval(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    restTimer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    if (timeLeft <= 0) {
      clearInterval(interval);
      timerContainer.style.display = 'none';
      completeSetBtn.textContent = 'Série Concluída';
      completeSetBtn.disabled = false;
    }
    timeLeft--;
  }, 1000);
}

// Próximo exercício
function nextExercise() {
  if (currentExerciseIndex < currentWorkout.exercises.length - 1) {
    currentExerciseIndex++;
    completeSetBtn.textContent = 'Série Concluída';
    completeSetBtn.disabled = false;
    updateDisplay();
  }
}

// Exercício anterior
function prevExercise() {
  if (currentExerciseIndex > 0) {
    currentExerciseIndex--;
    completeSetBtn.textContent = 'Série Concluída';
    completeSetBtn.disabled = false;
    updateDisplay();
  }
}

// Completar treino
function completeWorkout() {
  storage.addCompletedWorkout(currentWorkout.type);
  alert('🎉 Treino concluído com sucesso!');
  backToMenu();
}

// Voltar ao menu
function backToMenu() {
  workoutSelector.style.display = 'block';
  workoutContainer.style.display = 'none';
  currentWorkout = null;
  updateStats();
}

// Atualizar estatísticas
function updateStats() {
  const stats = storage.getMonthlyStats();
  const workoutCounts = { A: 0, B: 0, C: 0 };
  
  stats.forEach(w => {
    if (workoutCounts.hasOwnProperty(w.type)) {
      workoutCounts[w.type]++;
    }
  });

  historyStats.innerHTML = `
    <div class="stat-item">
      <span>Treino A</span>
      <strong>${workoutCounts.A}</strong>
    </div>
    <div class="stat-item">
      <span>Treino B</span>
      <strong>${workoutCounts.B}</strong>
    </div>
    <div class="stat-item">
      <span>Treino C</span>
      <strong>${workoutCounts.C}</strong>
    </div>
    <div class="stat-item">
      <span>Total</span>
      <strong>${stats.length}</strong>
    </div>
  `;
}

// Event listeners
completeSetBtn.addEventListener('click', completeSet);
nextExerciseBtn.addEventListener('click', nextExercise);
prevExerciseBtn.addEventListener('click', prevExercise);
completeWorkoutBtn.addEventListener('click', completeWorkout);
clearHistoryBtn.addEventListener('click', () => {
  if (confirm('Limpar todo o histórico?')) {
    storage.clearHistory();
    updateStats();
  }
});

// Inicializar
updateStats();