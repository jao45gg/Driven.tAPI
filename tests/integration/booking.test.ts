import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import supertest from 'supertest';
import * as jwt from 'jsonwebtoken';
import { TicketStatus } from '.prisma/client';
import { cleanDb, generateValidToken } from '../helpers';
import {
  createEnrollmentWithAddress,
  createHotel,
  createPayment,
  createRoomWithHotelId,
  createTicket,
  createTicketTypeRemote,
  createTicketTypeWithHotel,
  createUser,
} from '../factories';
import { createBooking } from '../factories/booking-factory';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('POST booking', () => {
  describe('when token is not valid', () => {
    it('should respond with status 401 if no token is given', async () => {
      const response = await server.post('/booking');

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe('when token is valid', () => {
    it('should return bookingId and 200 in case of sucess', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const createdHotel = await createHotel();
      const room = await createRoomWithHotelId(createdHotel.id);

      const { status, body } = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({
        roomId: room.id,
      });

      expect(status).toBe(httpStatus.OK);
      expect(body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
        }),
      );
    });
    it('should return 404 when roomId is not found', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const { status, body } = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({
        roomId: 99999999,
      });

      expect(status).toBe(httpStatus.NOT_FOUND);
      expect(body.message).toEqual('No result for this search!');
    });
    it('should return 403 when room has no vacancy', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const createdHotel = await createHotel();
      const room = await createRoomWithHotelId(createdHotel.id);
      await createBooking(user.id, room.id);

      const { status, body } = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({
        roomId: room.id,
      });

      expect(status).toBe(httpStatus.FORBIDDEN);
      expect(body.message).toEqual('No vacancy available');
    });
  });
});

describe('GET booking', () => {
  describe('when token is not valid', () => {
    it('should respond with status 401 if no token is given', async () => {
      const response = await server.get('/booking');

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });
  describe('when token is valid', () => {
    it('should return booking with room and 200 in case of sucess', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const createdHotel = await createHotel();
      const room = await createRoomWithHotelId(createdHotel.id);
      const booking = await createBooking(user.id, room.id);

      const { status, body } = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(status).toBe(httpStatus.OK);
      expect(body).toEqual(
        expect.objectContaining({
          id: booking.id,
          Room: expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            capacity: expect.any(Number),
            hotelId: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        }),
      );
    });
    it('should return 404 when booking is not found', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const { status, body } = await server.get('/booking').set('Authorization', `Bearer ${token}`);
      expect(status).toBe(httpStatus.NOT_FOUND);
      expect(body.message).toEqual('No result for this search!');
    });
  });
});
