import fs from "node:fs";
import path from "node:path";

export interface GuideMetadata {
  title: string;
  description: string;
  date: string;
  tags: string[];
  slug: string;
}

export interface Guide extends GuideMetadata {
  content: string;
}

const GUIDE_DIRECTORY = path.join(process.cwd(), "content", "guides");
const REQUIRED_FIELDS = ["title", "description", "date", "tags", "slug"] as const;

function isValidDate(value: string): boolean {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return false;
  }

  const [, year, month, day] = match.map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function parseTags(value: string, fileName: string): string[] {
  if (!value.startsWith("[") || !value.endsWith("]")) {
    throw new Error(`${fileName}: tags는 [말하기, 자기소개] 형식이어야 합니다.`);
  }

  const tags = value
    .slice(1, -1)
    .split(",")
    .map((tag) => tag.trim().replace(/^(['"])(.*)\1$/, "$2"))
    .filter(Boolean);

  if (tags.length === 0) {
    throw new Error(`${fileName}: tags를 한 개 이상 입력해야 합니다.`);
  }

  return tags;
}

function parseGuide(source: string, fileName: string): Guide {
  const normalizedSource = source.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  const match = normalizedSource.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

  if (!match) {
    throw new Error(`${fileName}: YAML frontmatter가 필요합니다.`);
  }

  const rawMetadata = new Map<string, string>();
  for (const line of match[1].split("\n")) {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex < 1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line
      .slice(separatorIndex + 1)
      .trim()
      .replace(/^(['"])(.*)\1$/, "$2");
    rawMetadata.set(key, value);
  }

  for (const field of REQUIRED_FIELDS) {
    if (!rawMetadata.get(field)) {
      throw new Error(`${fileName}: ${field} metadata가 필요합니다.`);
    }
  }

  const date = rawMetadata.get("date") as string;
  if (!isValidDate(date)) {
    throw new Error(`${fileName}: date는 실제 존재하는 YYYY-MM-DD 날짜여야 합니다.`);
  }

  const slug = rawMetadata.get("slug") as string;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(`${fileName}: slug는 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다.`);
  }

  const content = match[2].trim();
  if (!content) {
    throw new Error(`${fileName}: 본문이 비어 있습니다.`);
  }

  return {
    title: rawMetadata.get("title") as string,
    description: rawMetadata.get("description") as string,
    date,
    tags: parseTags(rawMetadata.get("tags") as string, fileName),
    slug,
    content,
  };
}

export function getAllGuides(): Guide[] {
  if (!fs.existsSync(GUIDE_DIRECTORY)) {
    return [];
  }

  const guides = fs
    .readdirSync(GUIDE_DIRECTORY)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const filePath = path.join(GUIDE_DIRECTORY, fileName);
      return parseGuide(fs.readFileSync(filePath, "utf8"), fileName);
    })
    .sort((left, right) => right.date.localeCompare(left.date));

  const slugs = new Set(guides.map((guide) => guide.slug));
  if (slugs.size !== guides.length) {
    throw new Error("Guide slug가 중복되었습니다.");
  }

  return guides;
}

export function getGuideBySlug(slug: string): Guide | undefined {
  return getAllGuides().find((guide) => guide.slug === slug);
}

export function formatGuideDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  return `${year}년 ${month}월 ${day}일`;
}
