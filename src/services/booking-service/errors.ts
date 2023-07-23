import { ApplicationError } from '@/protocols';

export function NoVacancyError(): ApplicationError {
  return {
    name: 'NoVacancyError',
    message: 'No vacancy available',
  };
}

export function BussinesRuleError(): ApplicationError {
  return {
    name: 'BussinesRuleError',
    message: 'Ticket is online, has no hotel included or is not paid',
  };
}
