// Gerenciamento de armazenamento local
class WorkoutStorage {
  constructor() {
    this.key = 'workout_history';
  }

  // Adicionar treino concluído
  addCompletedWorkout(workoutType, date = new Date()) {
    const history = this.getHistory();
    history.push({
      type: workoutType,
      date: date.toISOString(),
      completed: true
    });
    localStorage.setItem(this.key, JSON.stringify(history));
  }

  // Obter histórico
  getHistory() {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  // Obter treinos concluídos este mês
  getMonthlyStats() {
    const history = this.getHistory();
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return history.filter(workout => {
      const date = new Date(workout.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
  }

  // Obter próximo treino recomendado
  getNextWorkout() {
    const history = this.getHistory();
    if (history.length === 0) return 'A';

    const lastWorkout = history[history.length - 1];
    const sequence = { A: 'B', B: 'C', C: 'A' };
    return sequence[lastWorkout.type] || 'A';
  }

  // Limpar histórico
  clearHistory() {
    localStorage.removeItem(this.key);
  }
}

const storage = new WorkoutStorage();