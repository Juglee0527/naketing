import fs from "node:fs";
import path from "node:path";

export interface BlogPostMetadata {
  title: string;
  description: string;
  date: string;
  tags: string[];
  slug: string;
}

export interface BlogPost extends BlogPostMetadata {
  content: string;
}

const BLOG_DIRECTORY = path.join(process.cwd(), "content", "blog");
const REQUIRED_FIELDS = ["title", "description", "date", "tags"] as const;

function isValidDate(date: string): boolean {
  const match = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return false;
  }

  const [, year, month, day] = match.map(Number);
  const parsedDate = new Date(Date.UTC(year, month - 1, day));

  return (
    parsedDate.getUTCFullYear() === year &&
    parsedDate.getUTCMonth() === month - 1 &&
    parsedDate.getUTCDate() === day
  );
}

function parseFrontmatter(source: string, fileName: string): BlogPost {
  const normalizedSource = source.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  const frontmatterMatch = normalizedSource.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

  if (!frontmatterMatch) {
    throw new Error(`${fileName}: YAML frontmatter가 필요합니다.`);
  }

  const rawMetadata = new Map<string, string>();
  for (const line of frontmatterMatch[1].split("\n")) {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex < 1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    rawMetadata.set(key, value.replace(/^(["'])(.*)\1$/, "$2"));
  }

  for (const field of REQUIRED_FIELDS) {
    if (!rawMetadata.get(field)) {
      throw new Error(`${fileName}: ${field} metadata가 필요합니다.`);
    }
  }

  const date = rawMetadata.get("date") as string;
  if (!isValidDate(date)) {
    throw new Error(`${fileName}: date는 YYYY-MM-DD 형식이어야 합니다.`);
  }

  const tagValue = rawMetadata.get("tags") as string;
  const tags = tagValue
    .replace(/^\[/, "")
    .replace(/\]$/, "")
    .split(",")
    .map((tag) => tag.trim().replace(/^(["'])(.*)\1$/, "$2"))
    .filter(Boolean);

  if (tags.length === 0) {
    throw new Error(`${fileName}: tags를 한 개 이상 입력해야 합니다.`);
  }

  const fileSlug = fileName.replace(/\.md$/, "");
  const slug = rawMetadata.get("slug") ?? fileSlug;

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(`${fileName}: slug는 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다.`);
  }

  return {
    title: rawMetadata.get("title") as string,
    description: rawMetadata.get("description") as string,
    date,
    tags,
    slug,
    content: frontmatterMatch[2].trim(),
  };
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIRECTORY)) {
    return [];
  }

  const posts = fs
    .readdirSync(BLOG_DIRECTORY)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const filePath = path.join(BLOG_DIRECTORY, fileName);
      return parseFrontmatter(fs.readFileSync(filePath, "utf8"), fileName);
    })
    .sort((left, right) => right.date.localeCompare(left.date));

  const uniqueSlugs = new Set(posts.map((post) => post.slug));
  if (uniqueSlugs.size !== posts.length) {
    throw new Error("블로그 글 slug가 중복되었습니다.");
  }

  return posts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

export function formatPostDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  return `${year}년 ${month}월 ${day}일`;
}
