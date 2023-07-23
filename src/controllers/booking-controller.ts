import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares';
import bookingService from '../services/booking-service';

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const roomId: number = req.body.roomId;

  const result = await bookingService.newBooking(roomId, req.userId);
  res.send(result);
}

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const result = await bookingService.getBooking(req.userId);
  res.send(result);
}

export async function modifyBooking(req: AuthenticatedRequest, res: Response) {
  const roomId: number = req.body.roomId;

  const result = await bookingService.changeBooking(roomId, req.userId);
  res.send(result);
}
