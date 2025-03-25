import { STORAGE_KEY } from "./constants";
import { Presentation } from "@shared/schema";
import { createEmptyPresentation } from "./templates";

// Функция для загрузки презентаций из локального хранилища
export function loadPresentationsFromLocalStorage(): Presentation[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Ошибка при загрузке презентаций:", error);
  }
  
  // Возвращаем пустую презентацию, если ничего не найдено
  return [createEmptyPresentation("Новая презентация")];
}

// Функция для сохранения презентаций в локальное хранилище
export function savePresentationToLocalStorage(presentation: Presentation): void {
  try {
    // Получаем существующие презентации
    const presentations = loadPresentationsFromLocalStorage();
    
    // Проверяем, существует ли презентация с таким ID
    const index = presentations.findIndex(p => p.id === presentation.id);
    
    if (index >= 0) {
      // Обновляем существующую презентацию
      presentations[index] = presentation;
    } else {
      // Добавляем новую презентацию
      presentations.push(presentation);
    }
    
    // Сохраняем все презентации
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presentations));
  } catch (error) {
    console.error("Ошибка при сохранении презентации:", error);
  }
}

// Функция для удаления презентации из локального хранилища
export function deletePresentationFromLocalStorage(presentationId: string): void {
  try {
    // Получаем существующие презентации
    const presentations = loadPresentationsFromLocalStorage();
    
    // Фильтруем презентации, исключая удаляемую
    const updatedPresentations = presentations.filter(p => p.id !== presentationId);
    
    // Сохраняем обновленный список
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPresentations));
  } catch (error) {
    console.error("Ошибка при удалении презентации:", error);
  }
}