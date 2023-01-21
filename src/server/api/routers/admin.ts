import { z } from "zod";

import { createTRPCRouter, publicProcedure, adminProcedure } from "../trpc";

export const adminRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getSecretMessage: adminProcedure.query(() => {
    return "you can now see this secret admin message!";
  }),
  //add room
  addRoom: adminProcedure
    .input(
      z.object({
        roomNumber: z.string(),
        roomTypeId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const room = await ctx.prisma.room.create({
        data: {
          roomNumber: input.roomNumber,
          roomType: {
            connect: {
              id: input.roomTypeId,
            },
          },
        },
      });
      return room;
    }),
  //update room
  updateRoom: adminProcedure
    .input(
      z.object({
        id: z.string(),
        roomNumber: z.string(),
        roomTypeId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const room = await ctx.prisma.room.update({
        where: {
          id: input.id,
        },
        data: {
          roomNumber: input.roomNumber,
          roomType: {
            connect: {
              id: input.roomTypeId,
            },
          },
        },
      });
      return room;
    }),

  //add room type
  addRoomType: adminProcedure
    .input(
      z.object({
        roomName: z.string(),
        pricePerNight: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const roomType = await ctx.prisma.roomType.create({
        data: {
          roomName: input.roomName,
          roomPricePerNight: input.pricePerNight,
        },
      });
      return roomType;
    }),

  //update room type
  updateRoomType: adminProcedure
    .input(
      z.object({
        id: z.string(),
        roomName: z.string(),
        pricePerNight: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const roomType = await ctx.prisma.roomType.update({
        where: {
          id: input.id,
        },
        data: {
          roomName: input.roomName,
          roomPricePerNight: input.pricePerNight,
        },
      });
      return roomType;
    }),
});
