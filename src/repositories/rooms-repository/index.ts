import { prisma } from '@/config';

async function getRoomById(id: number) {
  return await prisma.room.findUnique({
    where: {
      id,
    },
  });
}

const roomsRepository = {
  getRoomById,
};

export default roomsRepository;
