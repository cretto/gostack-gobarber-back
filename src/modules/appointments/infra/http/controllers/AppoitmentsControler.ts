import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateAppoitmentService from '../../../services/CreateAppoitmentSevice';

export default class AppoitmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const { provider_id, date } = request.body;

    const createAppoitment = container.resolve(CreateAppoitmentService);

    const appoitment = await createAppoitment.execute({
      date,
      provider_id,
      user_id,
    });

    return response.json(appoitment);
  }
}
