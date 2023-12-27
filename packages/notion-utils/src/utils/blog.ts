import { Client } from "@notionhq/client";
import {
  BlockObjectResponse,
  PartialBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { uploadCloudinary } from "./cloudinary";
import getRandomInt from "../libs/getRandomInt";

const databaseId = process.env.NOTION_DATABASE_ID ?? "";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

interface GetDatabaseParams {
  platform?: "surflog" | "techlog" | "all";
}

const blogUtils = {
  getAllPosts: async ({ platform = "all" }: GetDatabaseParams) => {
    const platformFilter =
      platform === "all"
        ? undefined
        : {
            property: "platform",
            multi_select: {
              contains: platform,
            },
          };
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          timestamp: "created_time",
          direction: "descending",
        },
      ],
      filter: platformFilter,
    });
    return response.results;
  },
  getPostDetailByPageId: async (pageId: string) => {
    const response = await notion.pages.retrieve({ page_id: pageId });
    return response;
  },
  getPostDetailBySlug: async (slug: string) => {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "Slug",
        formula: {
          string: {
            equals: slug,
          },
        },
      },
    });
    if (response?.results?.length) {
      return response?.results?.[0];
    }
    return {};
  },
  getBlocks: async (blockID: string) => {
    const blockId = blockID.replaceAll("-", "");

    let next: string | undefined = "";
    const list: (BlockObjectResponse | PartialBlockObjectResponse)[] = [];
    while (typeof next === "string") {
      const { results, has_more, next_cursor } =
        await notion.blocks.children.list({
          block_id: blockId,
          start_cursor: next || undefined,
        });
      if (has_more && next_cursor) {
        next = next_cursor;
      } else {
        next = undefined;
      }
      list.push(...results);
    }

    // Fetches all child blocks recursively
    // be mindful of rate limits if you have large amounts of nested blocks
    // See https://developers.notion.com/docs/working-with-page-content#reading-nested-blocks
    const childBlocks = list.map(async (block) => {
      const generated = {
        ...block,
      } as BlockObjectResponse & {
        children: any;
      };
      if (generated.has_children) {
        const children = await blogUtils.getBlocks(block.id);
        generated.children = children;
      }
      if (process.env.NODE_ENV === "production" && generated.type === "image") {
        if (generated.image.type === "file") {
          const cloudinary = await uploadCloudinary(generated.image.file.url);
          generated.image.file.url = cloudinary.secure_url;
        }
      }
      return generated;
    });

    return Promise.all(childBlocks).then((blocks) =>
      blocks.reduce((acc, curr) => {
        if (curr.type === "bulleted_list_item") {
          if ((acc[acc.length - 1] as any)?.type === "bulleted_list") {
            (
              acc[acc.length - 1][(acc[acc.length - 1] as any).type] as any
            ).children?.push(curr);
          } else {
            acc.push({
              id: getRandomInt(10 ** 99, 10 ** 100).toString(),
              type: "bulleted_list",
              bulleted_list: { children: [curr] },
            } as never);
          }
        } else if (curr.type === "numbered_list_item") {
          if ((acc[acc.length - 1] as any)?.type === "numbered_list") {
            (
              acc[acc.length - 1][(acc[acc.length - 1] as any).type] as any
            ).children?.push(curr);
          } else {
            acc.push({
              id: getRandomInt(10 ** 99, 10 ** 100).toString(),
              type: "numbered_list",
              numbered_list: { children: [curr] },
            } as never);
          }
        } else {
          acc.push(curr as never);
        }
        return acc;
      }, [])
    );
  },
};

export default blogUtils;
