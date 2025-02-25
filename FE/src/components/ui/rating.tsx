import { Star } from "lucide-react";

export default function Rating({ rating }: { rating: number }) {
  // Ensure that rating is a valid number between 0 and 5
  const validRating = isNaN(rating) || rating < 0 ? 0 : Math.min(rating, 5);

  return (
    <section className="grid grid-flow-col place-items-center gap-1">
      {/* Only render stars if validRating is greater than 0 */}
      {Array.from({ length: validRating }, (_, index) => (
        <Star key={index} className="size-4 fill-yellow-500" />
      ))}
    </section>
  );
}
