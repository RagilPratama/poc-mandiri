import { logActivitySimple } from "../../utils/activity-logger.js";

interface Tool {
  name: string;
  description: string;
  inputSchema: object;
  handler: (args: unknown) => Promise<unknown>;
}

const handleError = (error: unknown): string => {
  return error instanceof Error ? error.message : String(error);
};

export const activityTools: Tool[] = [
  {
    name: "log_activity",
    description: "Log an activity for audit trail",
    inputSchema: {
      type: "object",
      properties: {
        aktivitas: {
          type: "string",
          description:
            "Activity type: CREATE | UPDATE | DELETE | LOGIN | LOGOUT | VIEW | ERROR",
        },
        modul: { type: "string", description: "Module name (e.g., PEGAWAI, BANTUAN)" },
        deskripsi: { type: "string", description: "Activity description" },
        dataBaru: {
          type: "string",
          description: "New data (JSON stringified, for CREATE/UPDATE)",
        },
        dataLama: {
          type: "string",
          description: "Old data (JSON stringified, for UPDATE/DELETE)",
        },
        errorMessage: { type: "string", description: "Error message (for ERROR activities)" },
        status: {
          type: "string",
          description: "Status: SUCCESS | ERROR | WARNING",
        },
      },
      required: ["aktivitas", "modul", "deskripsi"],
    },
    handler: async (args: unknown) => {
      const {
        aktivitas,
        modul,
        deskripsi,
        dataBaru,
        dataLama,
        errorMessage,
        status,
      } = args as Record<string, unknown>;

      try {
        await logActivitySimple({
          context: {
            headers: new Map([["user-agent", "mcp-server"]]),
            request: {
              url: "mcp://internal",
              method: "MCP_CALL",
            },
            path: `/api/activity/${modul}`,
          } as unknown as any,
          aktivitas: aktivitas as "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT" | "VIEW",
          modul: modul as string,
          deskripsi: deskripsi as string,
          data_baru: dataBaru ? JSON.parse(dataBaru as string) : undefined,
          data_lama: dataLama ? JSON.parse(dataLama as string) : undefined,
          error_message: errorMessage as string | undefined,
          status: ((status as string | undefined) || "SUCCESS") as "SUCCESS" | "FAILED" | "ERROR" | undefined,
        });

        return {
          success: true,
          message: "Activity logged successfully",
          modul,
          aktivitas,
        };
      } catch (error) {
        throw new Error(`Activity logging failed: ${handleError(error)}`);
      }
    },
  },
];
