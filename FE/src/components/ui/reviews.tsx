import { Review } from "@/types";
import Rating from "./rating";
import { Progress } from "@/components/ui/progress";
type ReviewByGroup = {
  [key: PropertyKey]: Review[];
};

export default function Reviews({ reviews }: { reviews: Review[] }) {
  // Passing these reviews from dashboard
  // console.log(reviews[0]);
  // console.log(reviews[1]);
  // console.log(reviews[2]);
  const reviewsByGroup: ReviewByGroup = (Object as any).groupBy(
    reviews,
    (review: Review) => review.rating
  );
  console.log(reviewsByGroup);

  return Object.entries(reviewsByGroup)
    .reverse()
    .map(([rating, reviewList]) => {
      return (
        <section className="grid items-center grid-cols-2 gap-2" key={rating}>
          <p className="flex gap-1">
            <Rating rating={Number(rating)} />
          </p>
          <p className="flex gap-1 items-center">
            <Progress value={(reviewList.length / reviews.length) * 100} />
            <span className="text-sm font-bold">
              {Math.round((reviewList.length / reviews.length) * 100)}%
            </span>
          </p>
        </section>
      );
    });
}
