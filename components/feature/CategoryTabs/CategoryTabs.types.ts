export interface TabItem {
  id: string
  label: string
  color?: string
}

export interface CategoryTabsProps {
  tabs: TabItem[]
  activeCategory: string
  onCategoryChange: (event: React.MouseEvent<HTMLElement>, newCategory: string) => void
}