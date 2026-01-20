import { format } from 'date-fns';
import slugify from 'slugify';

export const getSafeSlug = (slug: string) => {
  return slugify(slug, {
    replacement: '-', // 공백을 "-"로 변환
    lower: true, // 소문자로 변환
    strict: false, // 특수 문자 제거
    remove: /[[\]*+~.()'"?!:@,&<>〈〉#]/g, // 특정 특수문자 제거
  });
};

// Function to generate unique slugs
export async function generateSlug(
  title: string,
  existingCallback: (newSlug: string) => boolean | Promise<boolean>
) {
  let slug = createSlug(title);

  // Check for existing slugs in the database
  let existing = await existingCallback(slug);

  // // If slug already exists, append a number
  if (existing) {
    let counter = 1;
    let newSlug: string;
    do {
      newSlug = `${slug}-${counter}`;
      existing = await existingCallback(newSlug);
      counter++;
    } while (existing);
    slug = newSlug;
  }

  return slug;
}

const replacements = [
  [/#/g, 'no'],
  [/&/g, 'and'],
  [/%/g, 'percent'],
] as const;

function preprocess(title: string) {
  return replacements.reduce(
    (acc, [regex, value]) => acc.replace(regex, value),
    title
  );
}

// 서수 접미사 함수
function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

function formatDateSlug(date: Date): string {
  const day = Number(format(date, 'd')); // 1~31
  const month = format(date, 'MMM').toLowerCase(); // "Oct" → "oct"
  const ordinal = getOrdinalSuffix(day);
  return `${day}${ordinal}-${month}`;
}

export const createSlug = (valueToSlugify: string) => {
  const slug = slugify(preprocess(`${valueToSlugify}`), {
    replacement: '-', // 공백을 "-"로 변환
    lower: true, // 소문자로 변환
    strict: false, // 특수 문자 제거
    remove: /[\/[\]*+~.()'"?!:@,<>〈〉]/g, // 특정 특수문자 제거
  });
  return slug;
};

export const createSlugHashtag = (valueToSlugify: string) => {
  const slug = slugify(preprocess(`${valueToSlugify}`), {
    replacement: '_', // 공백을 "_"로 변환
    lower: true, // 소문자로 변환
    strict: false, // 특수 문자 제거
    remove: /[\/[\]*+~.()'"?!:@,<>〈〉]/g, // 특정 특수문자 제거
  });
  return slug;
};

// Function to generate unique slugs
export const createConcertSlug = ({
  title,
  date,
  venueName,
  area,
}: {
  title: string;
  date: Date;
  venueName?: string;
  area?: string;
}) => {
  let value = `${title}-${formatDateSlug(date)}`;
  if (venueName) {
    value += `-${venueName}`;
  }
  if (area) {
    value += `-${area}`;
  }
  value += '-티켓';
  const slug = slugify(preprocess(`${value}`), {
    replacement: '-', // 공백을 "-"로 변환
    lower: true, // 소문자로 변환
    strict: false, // 특수 문자 제거
    remove: /[\/[\]*+~.()'"?!:@,<>〈〉]/g, // 특정 특수문자 제거
  });

  return slug;
};

// Function to generate unique slugs
export async function generateConcertSlug(
  { title, date, venueName, area }: Parameters<typeof createConcertSlug>[0],
  existingCallback: (newSlug: string) => boolean | Promise<boolean>
) {
  let slug = createConcertSlug({ title, date, venueName, area });

  // Check for existing slugs in the database
  let existing = await existingCallback(slug);

  // // If slug already exists, append a number
  if (existing) {
    let counter = 1;
    let newSlug: string;
    do {
      newSlug = `${slug}-${counter}`;
      existing = await existingCallback(newSlug);
      counter++;
    } while (existing);
    slug = newSlug;
  }

  return slug;
}
