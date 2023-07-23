import { notFoundError } from '../../errors';
import bookingRepository from '../../repositories/booking-repository';
import enrollmentRepository from '../../repositories/enrollment-repository';
import roomsRepository from '../../repositories/rooms-repository';
import ticketsRepository from '../../repositories/tickets-repository';
import { BussinesRuleError, NoVacancyError } from './errors';

async function verifyBussinesRule(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) return true;

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket?.status === 'RESERVED' || !ticket?.TicketType?.includesHotel || ticket?.TicketType?.isRemote)
    return true;

  return false;
}

async function newBooking(roomId: number, userId: number) {
  const room = await roomsRepository.getRoomById(roomId);
  if (!room) throw notFoundError();

  const booking = await bookingRepository.getBookingByRoomId(roomId);
  if (booking) throw NoVacancyError();

  if (await verifyBussinesRule(userId)) throw BussinesRuleError();

  const newBooking = await bookingRepository.createBooking(userId, roomId);
  return {
    id: newBooking.id,
  };
}

const bookingService = {
  newBooking,
};

export default bookingService;
