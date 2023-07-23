import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares';
import bookingService from '../services/booking-service';

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const roomId: number = req.body.roomId;

  const result = await bookingService.newBooking(roomId, req.userId);
  res.send(result);
}
