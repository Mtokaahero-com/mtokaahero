

// interface CategoriesProps {
//     id: number;
//     name: string;
// }[]


const Categories = () => {
    // when backend is ready, we will fetch the categories from the backend
    const categories = [
        {
            id: 1,
            name: "programming "
        },
        {
            id: 2,
            name: "Gaming"
        },
        {
            id: 3,
            name: "Music"
        },
        {
            id: 4,
            name: "Movies"
        },
        {
            id: 5,
            name: "Books"
        },
        {
            id: 6,
            name: "Podcasts"
        },
        {
            id: 7,
            name: "News"
        },
        {
            id: 8,
            name: "Sports"
        },
        {
            id: 9,
            name: "Tech"
        },
        {
            id: 10,
            name: "Science"
        },
        {
            id: 11,
            name: "Health"
        },
        {
            id: 12,
            name: "Fashion"
        },
        {
            id: 13,
            name: "Food"
        },
        {
            id: 14,
            name: "Travel"
        },
        {
            id: 15,
            name: "Art"
        },
        {
            id: 16,
            name: "Design"
        },
        {
            id: 17,
            name: "Photography"
        },
        {
            id: 18,
            name: "DIY"
        },
        {
            id: 19,
            name: "Parenting"
        },
        {
            id: 20,
            name: "Beauty"
        },
        {
            id: 21,
            name: "Fitness"
        },
        {
            id: 22,
            name: "Lifestyle"
        },
        {
            id: 23,
            name: "Business"
        },
        {
            id: 24,
            name: "Finance"
        },
        {
            id: 25,
            name: "Marketing"
        },
        {
            id: 26,
            name: "Education"
        },
        {
            id: 27,
            name: "Entertainment"
        },
        {
            id: 28,
            name: "History"
        },
        {
            id: 29,
            name: "Home"
        },
        {
            id: 30,
            name: "Humor"
        },
        {
            id: 31,
            name: "Relationships"
        },
        {
            id: 32,
            name: "Self-Improvement"
        },
        {
            id: 33,
            name: "Society"
        },
        {
            id: 34
            ,
            name: "Spirituality"
        },
    ] 

  return (
    <div className="text-white font-bold overflow-x-scroll">
        <ul className="flex space-x-4 py-4 px-2 whitespace-nowrap">
              {categories.map((category) => (
                <li key={category.id}>{category.name}</li>
            ))}
        </ul>
    </div>
  )
}

export default Categories