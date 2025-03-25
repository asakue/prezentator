// Available animation types
export const ANIMATION_TYPES = [
  { value: "none", label: "Без анимации" },
  { value: "fadeIn", label: "Появление" },
  { value: "slideIn", label: "Скольжение" },
  { value: "scaleIn", label: "Увеличение" },
  { value: "bounce", label: "Отскок" }
];

// Available transition types
export const TRANSITION_TYPES = [
  { value: "none", label: "Без перехода" },
  { value: "fade", label: "Затухание" },
  { value: "slide", label: "Скольжение" },
  { value: "zoom", label: "Масштабирование" }
];

// Available text styles
export const TEXT_STYLES = [
  { value: "p", label: "Параграф" },
  { value: "h1", label: "Заголовок 1" },
  { value: "h2", label: "Заголовок 2" },
  { value: "h3", label: "Заголовок 3" }
];

// Available font families
export const FONT_FAMILIES = [
  { value: "Inter", label: "Inter" },
  { value: "Poppins", label: "Poppins" },
  { value: "Arial", label: "Arial" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Lato", label: "Lato" },
  { value: "Oswald", label: "Oswald" },
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "Merriweather", label: "Merriweather" },
  { value: "Source Sans Pro", label: "Source Sans Pro" },
  { value: "Fira Sans", label: "Fira Sans" },
  { value: "PT Sans", label: "PT Sans" }
];

// Background colors for slides
export const SLIDE_BACKGROUNDS = [
  { value: "#FFFFFF", label: "Белый" },
  { value: "#EFF6FF", label: "Светло-голубой" },
  { value: "#ECFDF5", label: "Светло-зеленый" },
  { value: "#FFFBEB", label: "Светло-желтый" },
  { value: "#F5F3FF", label: "Светло-фиолетовый" },
  { value: "#FEF2F2", label: "Светло-красный" },
  { value: "#F0FDFA", label: "Мятный" },
  { value: "#F8FAFC", label: "Серебристый" },
  { value: "#F3F4F6", label: "Светло-серый" },
  { value: "#FFF7ED", label: "Персиковый" },
  { value: "#111827", label: "Темный" },
  { value: "#1E293B", label: "Темно-синий" },
  { value: "#0F172A", label: "Глубокий темный" },
  { value: "#18181B", label: "Антрацитовый" },
  { value: "#292524", label: "Темно-коричневый" }
];

// Template categories
export const TEMPLATE_CATEGORIES = [
  { value: "all", label: "Все шаблоны" },
  { value: "business", label: "Бизнес" },
  { value: "education", label: "Образование" },
  { value: "creative", label: "Творчество" },
  { value: "portfolio", label: "Портфолио" },
  { value: "minimal", label: "Минималистичный" }
];

// LocalStorage key for presentations
export const STORAGE_KEY = 'presentcraft-presentations';

// Default slide dimensions aspect ratio
export const SLIDE_ASPECT_RATIO = 16 / 9;

// Default canvas width (height will be calculated based on aspect ratio)
export const DEFAULT_CANVAS_WIDTH = 1200;
