import { Router } from 'express';
import appoitmentRouter from '../../../../modules/appointments/infra/http/routes/appoitment.routes';
import providersRouter from '../../../../modules/appointments/infra/http/routes/providers.routes';
import usersRouter from '../../../../modules/users/infra/http/routes/users.routes';
import sessionsRouter from '../../../../modules/users/infra/http/routes/sessions.routes';
import passwordRouter from '../../../../modules/users/infra/http/routes/password.routes';
import profileRouter from '../../../../modules/users/infra/http/routes/profile.routes';

const routes = Router();

routes.use('/providers', providersRouter);
routes.use('/profile', profileRouter);
routes.use('/password', passwordRouter);
routes.use('/appointments', appoitmentRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);

export default routes;
