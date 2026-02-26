import Imagekit from "imagekit";

interface Tool {
  name: string;
  description: string;
  inputSchema: object;
  handler: (args: unknown) => Promise<unknown>;
}

const handleError = (error: unknown): string => {
  return error instanceof Error ? error.message : String(error);
};

const imagekit = new Imagekit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",
});

export const fileTools: Tool[] = [
  {
    name: "file_upload",
    description: "Upload a file to ImageKit",
    inputSchema: {
      type: "object",
      properties: {
        fileName: { type: "string", description: "File name" },
        file: { type: "string", description: "Base64 encoded file content" },
        folder: { type: "string", description: "ImageKit folder path (optional)" },
        tags: { type: "array", description: "Array of tags (optional)" },
      },
      required: ["fileName", "file"],
    },
    handler: async (args: unknown) => {
      const { fileName, file, folder, tags } = args as Record<string, unknown>;

      try {
        const response = await imagekit.upload({
          file: file as string,
          fileName: fileName as string,
          folder: folder as string | undefined,
          tags: tags as string[] | undefined,
        });

        return {
          success: true,
          fileId: response.fileId,
          url: response.url,
          name: response.name,
          size: response.size,
        };
      } catch (error) {
        throw new Error(
          `ImageKit upload failed: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    },
  },
  {
    name: "file_delete",
    description: "Delete a file from ImageKit by ID",
    inputSchema: {
      type: "object",
      properties: {
        fileId: { type: "string", description: "ImageKit file ID" },
      },
      required: ["fileId"],
    },
    handler: async (args: unknown) => {
      const { fileId } = args as Record<string, unknown>;

      try {
        await imagekit.deleteFile(fileId as string);
        return {
          success: true,
          fileId,
          deleted: true,
        };
      } catch (error) {
        throw new Error(
          `ImageKit delete failed: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    },
  },
  {
    name: "file_list",
    description: "List files from ImageKit folder",
    inputSchema: {
      type: "object",
      properties: {
        path: { type: "string", description: "Folder path (e.g., '/documents')" },
        limit: { type: "number", description: "Max files to return (default: 10)" },
      },
      required: ["path"],
    },
    handler: async (args: unknown) => {
      const { path, limit = 10 } = args as Record<string, unknown>;

      try {
        const response = await imagekit.listFiles({
          path: path as string,
          limit: limit as number,
        });

        return {
          path,
          count: response.length,
          files: response.map(f => ({
            fileId: f.fileId,
            name: f.name,
            size: f.size,
            url: f.url,
            type: f.type,
          })),
        };
      } catch (error) {
        throw new Error(
          `ImageKit list failed: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    },
  },
];
