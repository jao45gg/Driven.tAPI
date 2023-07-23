import { prisma } from '@/config';

async function getBookingByRoomId(roomId: number) {
  return await prisma.booking.findFirst({
    where: {
      roomId,
    },
  });
}

async function createBooking(userId: number, roomId: number) {
  return await prisma.booking.create({
    data: {
      roomId,
      userId,
      updatedAt: new Date(),
    },
  });
}

const bookingRepository = {
  getBookingByRoomId,
  createBooking,
};

export default bookingRepository;
