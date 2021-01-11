export interface TableColumn<T> {
  label: string;
  property: keyof T | string;
  type: 'text' | 'image' | 'badge' | 'progress' | 'checkbox' | 'button' | 'edit' | 'more';
  visible?: boolean;
  cssClasses?: string[];
  footer?: string;
}
