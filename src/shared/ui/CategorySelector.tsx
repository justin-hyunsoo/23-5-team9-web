interface Category {
  value: string;
  label: string;
}

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string;
  onSelect: (value: string) => void;
}

export default function CategorySelector({ categories, selectedCategory, onSelect }: CategorySelectorProps) {
  return (
    <div className="flex gap-2 mb-6 flex-wrap pb-4 border-b border-border">
      {categories.map((category) => {
        const isActive = selectedCategory === category.value;
        return (
          <button
            key={category.value}
            onClick={() => onSelect(category.value)}
            className={`
              px-4 py-2 text-sm font-bold border rounded-[20px] transition-all duration-200 cursor-pointer
              ${isActive 
                ? 'bg-primary text-white border-primary' 
                : 'bg-white text-gray border-border hover:bg-gray-50'
              }
            `}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
