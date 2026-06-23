import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  image: string;
  readTime: number;
  content: string;
  locale: string;
}

const postsDirectory = path.join(process.cwd(), 'content/blog');

export function getAllBlogPosts(locale: string = 'es'): BlogPost[] {
  const files = fs.readdirSync(postsDirectory).filter((file) => file.endsWith('.md'));

  const posts: BlogPost[] = files.map((filename) => {
    const slug = filename.replace('.md', '');
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title,
      description: data.description,
      author: data.author,
      date: data.date,
      category: data.category,
      tags: data.tags,
      image: data.image,
      readTime: data.readTime,
      content,
      locale,
    };
  });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBlogPostBySlug(slug: string, locale: string = 'es'): BlogPost | null {
  try {
    const filePath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title,
      description: data.description,
      author: data.author,
      date: data.date,
      category: data.category,
      tags: data.tags,
      image: data.image,
      readTime: data.readTime,
      content,
      locale,
    };
  } catch {
    return null;
  }
}

export function getBlogPostsByCategory(category: string, locale: string = 'es'): BlogPost[] {
  return getAllBlogPosts(locale).filter((post) => post.category === category);
}

export function getBlogPostsByTag(tag: string, locale: string = 'es'): BlogPost[] {
  return getAllBlogPosts(locale).filter((post) => post.tags.includes(tag));
}

export function getAllBlogCategories(locale: string = 'es'): string[] {
  const posts = getAllBlogPosts(locale);
  const categories = new Set(posts.map((post) => post.category));
  return Array.from(categories).sort();
}

export function getAllBlogTags(locale: string = 'es'): string[] {
  const posts = getAllBlogPosts(locale);
  const tags = new Set<string>();
  posts.forEach((post) => post.tags.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}
