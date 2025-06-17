import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Exercise {
  id: number;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  topics: string[];
  completed: boolean;
}

@Component({
  selector: 'app-exercises',
  imports: [CommonModule, FormsModule],
  templateUrl: './exercises.component.html',
  styleUrl: './exercises.component.scss'
})
export class ExercisesComponent {
  exercises: Exercise[] = [
    {
      id: 1,
      title: 'Code Understanding with Cody',
      description: 'Use Cody AI assistant to understand the Laptops4U codebase architecture, components, and data flow',
      difficulty: 'Beginner',
      topics: ['Code Analysis', 'AI Assistant', 'Codebase Understanding', 'Architecture'],
      completed: false
    },
    {
      id: 2,
      title: 'Code Generation with Cody',
      description: 'Build a complete favorites feature including service creation, component development, UI integration, and routing setup',
      difficulty: 'Intermediate',
      topics: ['Code Generation', 'Angular Services', 'Component Development', 'State Management', 'Routing'],
      completed: false
    },
    {
      id: 3,
      title: 'Backend Refactoring with Cody',
      description: 'Refactor Express.js backend by extracting service layers, adding error handling middleware, and improving separation of concerns',
      difficulty: 'Advanced',
      topics: ['Backend Architecture', 'Service Layer', 'Error Handling', 'Separation of Concerns', 'Node.js Best Practices'],
      completed: false
    },
    {
      id: 4,
      title: 'Debugging & Troubleshooting with Cody',
      description: 'Learn to identify and fix common frontend bugs including memory leaks, performance issues, race conditions, and validation problems using Cody as your debugging assistant',
      difficulty: 'Intermediate',
      topics: ['Memory Leaks', 'Performance Optimization', 'Race Conditions', 'Error Handling', 'Code Quality'],
      completed: false
    }
  ];

  expandedExercises: Set<number> = new Set([1]); // Start with first exercise expanded

  filteredExercises: Exercise[] = [...this.exercises];
  selectedDifficulty: string = 'All';
  searchTerm: string = '';

  difficultyLevels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  ngOnInit() {
    this.filterExercises();
  }

  toggleComplete(exercise: Exercise) {
    exercise.completed = !exercise.completed;
  }

  filterExercises() {
    this.filteredExercises = this.exercises.filter(exercise => {
      const matchesDifficulty = this.selectedDifficulty === 'All' || 
                               exercise.difficulty === this.selectedDifficulty;
      const matchesSearch = exercise.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           exercise.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           exercise.topics.some(topic => topic.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      return matchesDifficulty && matchesSearch;
    });
  }

  onDifficultyChange() {
    this.filterExercises();
  }

  onSearchChange() {
    this.filterExercises();
  }

  get completedCount(): number {
    return this.exercises.filter(ex => ex.completed).length;
  }

  get totalCount(): number {
    return this.exercises.length;
  }

  get progressPercentage(): number {
    return (this.completedCount / this.totalCount) * 100;
  }

  getDifficultyClass(difficulty: string): string {
    switch(difficulty) {
      case 'Beginner': return 'difficulty-beginner';
      case 'Intermediate': return 'difficulty-intermediate'; 
      case 'Advanced': return 'difficulty-advanced';
      default: return '';
    }
  }

  trackByExerciseId(index: number, exercise: Exercise): number {
    return exercise.id;
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      // Could add a toast notification here
      console.log('Prompt copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  }

  toggleExercise(exerciseId: number) {
    if (this.expandedExercises.has(exerciseId)) {
      this.expandedExercises.delete(exerciseId);
    } else {
      this.expandedExercises.add(exerciseId);
    }
  }

  isExpanded(exerciseId: number): boolean {
    return this.expandedExercises.has(exerciseId);
  }
}
