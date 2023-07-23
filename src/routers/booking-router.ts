import { Router } from 'express';
import { bookingSchema } from '../schemas';
import { postBooking } from '../controllers';
import { authenticateToken, validateBody } from '@/middlewares';

const bookingRouter = Router();

bookingRouter.use(authenticateToken);

bookingRouter.post('', validateBody(bookingSchema), postBooking);

export { bookingRouter };
