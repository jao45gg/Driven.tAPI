import { cleanDb } from '../helpers';
import ticketsRepository from '@/repositories/tickets-repository';
import roomsRepository from '@/repositories/rooms-repository';
import bookingRepository from '@/repositories/booking-repository';
import { init } from '@/app';
import bookingService from '@/services/booking-service';
import enrollmentRepository from '@/repositories/enrollment-repository';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

describe('POST booking unit tests', () => {
  it('should throw an error when user ticket is not paid', () => {
    jest.spyOn(roomsRepository, 'getRoomById').mockImplementationOnce((): any => {
      return true;
    });
    jest.spyOn(bookingRepository, 'getBookingByRoomId').mockImplementationOnce((): any => {
      return false;
    });
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
      return true;
    });
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
      return {
        status: 'RESERVED',
        TicketType: {
          includesHotel: true,
          isRemote: false,
        },
      };
    });

    const promise = bookingService.newBooking(1, 2);

    expect(promise).rejects.toEqual({
      name: 'BussinesRuleError',
      message: 'Ticket is online, has no hotel included or is not paid',
    });
  });
  it('should throw an error when user ticket has no hotel', () => {
    jest.spyOn(roomsRepository, 'getRoomById').mockImplementationOnce((): any => {
      return true;
    });
    jest.spyOn(bookingRepository, 'getBookingByRoomId').mockImplementationOnce((): any => {
      return false;
    });
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
      return true;
    });
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
      return {
        status: 'PAID',
        TicketType: {
          includesHotel: false,
          isRemote: false,
        },
      };
    });

    const promise = bookingService.newBooking(1, 2);

    expect(promise).rejects.toEqual({
      name: 'BussinesRuleError',
      message: 'Ticket is online, has no hotel included or is not paid',
    });
  });
  it('should throw an error when user ticket is remote', () => {
    jest.spyOn(roomsRepository, 'getRoomById').mockImplementationOnce((): any => {
      return true;
    });
    jest.spyOn(bookingRepository, 'getBookingByRoomId').mockImplementationOnce((): any => {
      return false;
    });
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
      return true;
    });
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
      return {
        status: 'PAID',
        TicketType: {
          includesHotel: true,
          isRemote: true,
        },
      };
    });

    const promise = bookingService.newBooking(1, 2);

    expect(promise).rejects.toEqual({
      name: 'BussinesRuleError',
      message: 'Ticket is online, has no hotel included or is not paid',
    });
  });
});
