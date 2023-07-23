import { Router } from 'express';
import { bookingSchema } from '../schemas';
import { getBooking, modifyBooking, postBooking } from '../controllers';
import { authenticateToken, validateBody } from '@/middlewares';

const bookingRouter = Router();

bookingRouter.use(authenticateToken);

bookingRouter.post('', validateBody(bookingSchema), postBooking);
bookingRouter.get('', getBooking);
bookingRouter.put('/:bookingId', validateBody(bookingSchema), modifyBooking);

export { bookingRouter };
