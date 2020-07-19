import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import AppoitmentsController from '../controllers/AppoitmentsControler';
import ensureAuth from '../../../../../shared/infra/http/middlewares/ensureAuthenticated';
import ProviderAppoitmentsController from '../controllers/ProviderAppoitmentsController';

const appoitmentRouter = Router();
const appoitmentsControler = new AppoitmentsController();
const providerAppoitmentsController = new ProviderAppoitmentsController();

appoitmentRouter.use(ensureAuth);

appoitmentRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.date(),
    },
  }),
  appoitmentsControler.create,
);

appoitmentRouter.get('/me', providerAppoitmentsController.index);

export default appoitmentRouter;
