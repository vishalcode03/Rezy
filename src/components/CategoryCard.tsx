import { Card, CardContent } from '@/components/ui/card';

interface CategoryCardProps {
  name: string;
  image: string;
  onClick?: () => void;
}

const CategoryCard = ({ name, image, onClick }: CategoryCardProps) => {
  return (
    <Card 
      className="cursor-pointer overflow-hidden transition-all hover:shadow-md hover:-translate-y-1"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative h-32 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <h3 className="absolute bottom-3 left-3 font-semibold text-white text-lg">{name}</h3>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
