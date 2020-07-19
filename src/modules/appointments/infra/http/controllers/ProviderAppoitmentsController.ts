import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderAppoitmentsService from '../../../services/ListProvidersAppointmentsService';

export default class ProviderAppoitmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const provider_id = request.user.id;
    const { day, month, year } = request.query;

    const listProviderAppoitments = container.resolve(
      ListProviderAppoitmentsService,
    );

    const appoitments = await listProviderAppoitments.execute({
      provider_id,
      day: Number(day),
      month: Number(month),
      year: Number(year),
    });

    return response.json(appoitments);
  }
}
