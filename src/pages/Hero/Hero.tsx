import { formatDistanceToNow } from "date-fns";

interface categoryProps {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  Autthor: string;
  category: string;
}

const featuredPost = [
  {
    title: "The best tech podcasts to listen to in 2021",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac purus nec diam laoreet sollicitudin. Fusce ullamcorper, mauris non posuere fermentum, felis eros tempus metus, non tincidunt nunc turpis nec sapien.",
    image:
      "https://plus.unsplash.com/premium_photo-1682146176956-756032bdc7c6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "podcast",
  },
];

const posts: categoryProps[] = [
  {
    id: 1,
    title: "The best tech podcasts to listen to in 2021",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac purus nec diam laoreet sollicitudin. Fusce ullamcorper, mauris non posuere fermentum, felis eros tempus metus, non tincidunt nunc turpis nec sapien.",
    createdAt: "2021-09-01",
    Autthor: "John Doe",
    category: "Tech",
  },
  {
    id: 2,
    title: "The best tech podcasts to listen to in 2021",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac purus nec diam laoreet sollicitudin. Fusce ullamcorper, mauris non posuere fermentum, felis eros tempus metus, non tincidunt nunc turpis nec sapien.",
    createdAt: "2021-09-01",
    Autthor: "John Doe",
    category: "Tech",
  },
  {
    id: 3,
    title: "The best tech podcasts to listen to in 2021",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac purus nec diam laoreet sollicitudin. Fusce ullamcorper, mauris non posuere fermentum, felis eros tempus metus, non tincidunt nunc turpis nec sapien.",
    createdAt: "2021-09-01",
    Autthor: "John Doe",
    category: "Tech",
  },
  {
    id: 4,
    title: "The best tech podcasts to listen to in 2021",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac purus nec diam laoreet sollicitudin. Fusce ullamcorper, mauris non posuere fermentum, felis eros tempus metus, non tincidunt nunc turpis nec sapien.",
    createdAt: "2021-09-01",
    Autthor: "John Doe",
    category: "Tech",
  },
  {
    id: 5,
    title: "The best tech podcasts to listen to in 2021",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac purus nec diam laoreet sollicitudin. Fusce ullamcorper, mauris non posuere fermentum, felis eros tempus metus, non tincidunt nunc turpis nec sapien.",
    createdAt: "2021-09-01",
    Autthor: "John Doe",
    category: "Tech",
  },
];

const formatDate = (date: string) => {
  const parsedDate = new Date(date);
  return formatDistanceToNow(parsedDate, { addSuffix: true });
};

const truncateContent = (content: string, maxLength: number) => {
  if (content.length <= maxLength) {
    return content;
  }
  return content.slice(0, maxLength) + "......";
};

const Hero = () => {
  return (
    <div className="bg-gray-900 px-7 py-11">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          {featuredPost.map((post, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h1 className="text-3xl font-bold mb-4 text-white">
                {post.title}
              </h1>
              <img
                src={post.image}
                alt={post.alt}
                className="w-full rounded-lg mb-4"
              />
              <p className="text-gray-300">{post.description}</p>
            </div>
          ))}
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-6 text-white">Latest Posts</h1>
          {posts.map((post, index) => (
            <div
              key={index}
              className="bg-gray-800 p-6 rounded-lg shadow-md mb-6"
            >
              <h2 className="text-2xl font-bold mb-2 text-white">
                {post.title}
              </h2>
              <p className="text-gray-300 mb-4">
                {truncateContent(post.content, 150)}
              </p>
              <div className="flex justify-between text-gray-400">
                <p>{formatDate(post.createdAt)}</p>
                <p className="text-blue-600">{post.category}</p>
                <p className="text-green-600">{post.Autthor}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
