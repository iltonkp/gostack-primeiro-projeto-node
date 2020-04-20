import { Router } from 'express';
import { startOfHour, parseISO } from 'date-fns';

import AppoitmentsRepository from '../repositories/AppointmentsRepository';

const appointmentsRouter = Router();
const appointmentsRepository = new AppoitmentsRepository();

appointmentsRouter.get('/', (request, response) => {
  const appointments = appointmentsRepository.all();

  return response.json(appointments);
});

appointmentsRouter.post('/', (request, response) => {
  const { provider, date } = request.body;

  const parsedDate = startOfHour(parseISO(date));

  const findAppointementInSameDate = appointmentsRepository.findByDate(
    parsedDate,
  );

  if (findAppointementInSameDate) {
    return response
      .status(400)
      .json({ mensage: 'This appointment is already booked' });
  }
  const appointment = appointmentsRepository.create({
    provider,
    date: parsedDate,
  });

  return response.json(appointment);
});

export default appointmentsRouter;
