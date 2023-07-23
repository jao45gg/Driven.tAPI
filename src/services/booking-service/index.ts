import { notFoundError } from '../../errors';
import bookingRepository from '../../repositories/booking-repository';
import enrollmentRepository from '../../repositories/enrollment-repository';
import roomsRepository from '../../repositories/rooms-repository';
import ticketsRepository from '../../repositories/tickets-repository';
import { UserUnableToMakeBooking, NoVacancyError, NoBookingFoundForUser } from './errors';

async function verifyBussinesRuleOfNew(userId: number) {
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

  if (await verifyBussinesRuleOfNew(userId)) throw UserUnableToMakeBooking();

  const newBooking = await bookingRepository.createBooking(userId, roomId);
  return {
    bookingId: newBooking.id,
  };
}

async function getBooking(userId: number) {
  const booking = await bookingRepository.getBookingByUserId(userId);
  if (!booking) throw notFoundError();

  return {
    id: booking.id,
    Room: booking.Room,
  };
}

async function changeBooking(roomId: number, userId: number) {
  const room = await roomsRepository.getRoomById(roomId);
  if (!room) throw notFoundError();

  const booking = await bookingRepository.getBookingByRoomId(roomId);
  if (booking) throw NoVacancyError();

  const userBooking = await bookingRepository.getBookingByUserId(userId);
  if (!userBooking) throw NoBookingFoundForUser();

  const newBooking = await bookingRepository.modifyBooking(userBooking.id, roomId);
  return {
    bookingId: newBooking.id,
  };
}

const bookingService = {
  newBooking,
  getBooking,
  changeBooking,
};

export default bookingService;
