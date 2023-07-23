import { prisma } from '@/config';

async function getBookingByRoomId(roomId: number) {
  return await prisma.booking.findFirst({
    where: {
      roomId,
    },
  });
}

async function getBookingByUserId(userId: number) {
  return await prisma.booking.findFirst({
    where: {
      userId,
    },
    include: {
      Room: true,
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

async function modifyBooking(bookingId: number, roomId: number) {
  return await prisma.booking.update({
    data: {
      roomId,
    },
    where: {
      id: bookingId,
    },
  });
}

const bookingRepository = {
  getBookingByRoomId,
  createBooking,
  getBookingByUserId,
  modifyBooking,
};

export default bookingRepository;
