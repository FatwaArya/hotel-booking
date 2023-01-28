import { z } from "zod";
import { s3Client } from "./../../s3";
import {
  createTRPCRouter,
  publicProcedure,
  receptionistProcedure,
} from "../trpc";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const receptionistRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {}),

  createRoom: receptionistProcedure
    .input(
      z.object({
        content: z.string(),
        files: z
          .array(
            z.object({
              key: z.string().min(1),
              ext: z.string().min(1),
            })
          )
          .max(4),
      })
    )

    .mutation(async ({ ctx, input }) => {
      //upload files to s3
      const files = input.files;

      for (const upload of files) {
        const { key, ext } = upload;
        const uuid = uuidv4();
        const name = uuid + "." + upload.ext;

        await s3Client.send(
          new PutObjectCommand({
            Bucket: "hotel-room",
            Key: name,
          })
        );
      }
    }),

  createPresignedUrl: receptionistProcedure.query(async () => {
    const key = uuidv4();
    const url = await getSignedUrl(
      s3Client,
      new PutObjectCommand({
        Bucket: "hotel-room",
        Key: key,
      })
    );
    return {
      key,
      url,
    };
  }),
});
