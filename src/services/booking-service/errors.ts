import { ApplicationError } from '@/protocols';

export function NoVacancyError(): ApplicationError {
  return {
    name: 'NoVacancyError',
    message: 'No vacancy available',
  };
}

export function UserUnableToMakeBooking(): ApplicationError {
  return {
    name: 'BussinesRuleError',
    message: 'Ticket is online, has no hotel included or is not paid',
  };
}

export function NoBookingFoundForUser(): ApplicationError {
  return {
    name: 'BussinesRuleError',
    message: 'User has no booking to modify',
  };
}
