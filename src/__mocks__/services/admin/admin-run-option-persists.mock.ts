import {FlowContext, typeMenuAdmin} from '@/flow.context';
import {IFlowResult} from '@/interfaces/flow';
import {AdminRunOptionPersists} from '@/services/admin';
import {FindConversationsServiceStub} from '../find-conversation-service.mock';
import {FindMeetingsOfDayServiceStub} from '../find-meetings-of-day-service.mock';
import {DisableMeetingsOfIntervalServiceStub} from '../disable-meetings-of-interval.service.mock';
import {AdminRunOptionStub} from './admin-run-option.mock';
import {WelcomeAdminAndShowMenuStub} from './welcome-admin-and-show-menu.mock';

/**
 * Etapa responsável executar a funcionalidade solicitada pelo admin
 * '1- Visualizar agendamentos de algum dia',
 * '2- Desmarcar horários'
 */
export class AdminRunOptionPersistsStub extends AdminRunOptionPersists {
  constructor(
    private readonly findConversationServiceStub: FindConversationsServiceStub,
    private readonly findMeetingsOfDayServiceStub: FindMeetingsOfDayServiceStub,
    private readonly disableMeetingsOfIntervalServiceStub: DisableMeetingsOfIntervalServiceStub,
  ) {
    super(
      findConversationServiceStub,
      findMeetingsOfDayServiceStub,
      disableMeetingsOfIntervalServiceStub,
    );
  }

  public async getMenuRequest(phone: number): Promise<typeMenuAdmin> {
    return Promise.resolve(typeMenuAdmin.MARK_OFF_MEETING);
  }

  async execute(phone: number): Promise<IFlowResult> {
    try {
      const typeMenu = await this.getMenuRequest(phone);

      if (typeMenu === typeMenuAdmin.MARK_OFF_MEETING) {
        const adminRunOptionStub = new AdminRunOptionStub(
          this.findConversationServiceStub,
          this.findMeetingsOfDayServiceStub,
        );
        const {startDate, endDate} =
          await adminRunOptionStub.getAppointmentsToDisable(phone);

        await this.disableMeetingsOfIntervalServiceStub.execute({
          startDate,
          endDate,
        });

        return {response: FlowContext.SUCCESSFUL_OPERATION, step: 4};
      }

      if (typeMenu === typeMenuAdmin.SHOW_MENU_AGAIN) {
        const welcomeAdminAndShowMenuStub = new WelcomeAdminAndShowMenuStub();
        const {response, step} = welcomeAdminAndShowMenuStub.execute();

        return {response, step};
      }
    } catch (error) {
      console.error(error);
      //call previous step
      const welcomeAdminAndShowMenuStub = new WelcomeAdminAndShowMenuStub();
      const {response, step} = welcomeAdminAndShowMenuStub.execute();

      return {response, step};
    }
  }
}
