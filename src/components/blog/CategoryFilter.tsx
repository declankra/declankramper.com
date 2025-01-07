import { Button } from "@/components/ui/button";
import { BlogCategory } from '@/types/blog';

interface CategoryFilterProps {
  categories: BlogCategory[];
  selectedCategories: BlogCategory[];
  onCategoryChange: (categories: BlogCategory[]) => void;
}

export default function CategoryFilter({ 
  categories, 
  selectedCategories, 
  onCategoryChange 
}: CategoryFilterProps) {
  const toggleCategory = (category: BlogCategory) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategories.includes(category) ? "default" : "ghost"}
          onClick={() => toggleCategory(category)}
          className="text-xs h-7 px-2 hover:bg-secondary/80"
          size="sm"
        >
          {category.toLowerCase()}
        </Button>
      ))}
    </div>
  );
}