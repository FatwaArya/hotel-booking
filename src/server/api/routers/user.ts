import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
  //get available room by availability and show facility
  getAvailableRoom: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.room.findMany({
      where: {
        roomStatus: "AVAILABLE",
      },
      include: {
        roomType: true,
      },
    });
  }),
  //get available room by checkin and checkout date
  getAvailableRoomByDate: publicProcedure
    .input(
      z.object({
        checkIn: z.string().datetime(),
        checkOut: z.string().datetime(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.room.findMany({
        where: {
          roomStatus: "AVAILABLE",
          Reservation: {
            every: {
              OR: [
                {
                  checkIn: {
                    gte: input.checkIn,
                    lte: input.checkOut,
                  },
                },
                {
                  checkOut: {
                    gte: input.checkIn,
                    lte: input.checkOut,
                  },
                },
              ],
            },
          },
        },
      });
    }),

  reservation: protectedProcedure
    .input(
      z.object({
        checkIn: z.string().datetime(),
        checkOut: z.string().datetime(),
        roomTypeId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      //user can only reserve one room type in one reservation but can reserve multiple room in one reservation
      const room = await ctx.prisma.room.findFirst({
        where: {
          roomStatus: "AVAILABLE",
          roomTypeId: input.roomTypeId,
          Reservation: {
            every: {
              OR: [
                {
                  checkIn: {
                    gte: input.checkIn,
                    lte: input.checkOut,
                  },
                },
                {
                  checkOut: {
                    gte: input.checkIn,
                    lte: input.checkOut,
                  },
                },
              ],
            },
          },
        },
        select: {
          id: true,
        },
      });
      if (!room) {
        throw new Error("Room not available");
      }
      const reservation = await ctx.prisma.reservation.create({
        data: {
          checkIn: input.checkIn,
          checkOut: input.checkOut,
          room: {
            connect: {
              id: room.id,
            },
          },
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
      return reservation;
    }),
  //get all reservation by user
  getReservation: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.reservation.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        room: true,
      },
    });
  }),
});
