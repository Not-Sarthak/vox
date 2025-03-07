import exploreData from "@/utils/explore";
import { generateSlug } from "@/store/store";

const ExploreItemPage = async ({ params }: { params: { slug: string } }) => {
  const item = exploreData.find(item => generateSlug(item.title) === params.slug);

  if (!item) {
    return <div>Item not found</div>;
  }

  return (
    <div>
      <h1>{item.title}</h1>
      <img src={item.bgImage} alt={item.title} />
    </div>
  );
};

export default ExploreItemPage;