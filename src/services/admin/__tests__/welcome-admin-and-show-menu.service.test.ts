import {FlowContext} from '@/flow.context';
import * as Step from '../welcome-admin-and-show-menu.service';

describe('Welcome admin and show menu', () => {
  test('should return welcome message + menu list and step 6', () => {
    const result = new Step.WelcomeAdminAndShowMenu().execute();

    expect(result.response).toEqual(
      expect.stringMatching(FlowContext.ADMIN_WELCOME),
    );
    expect(result.response).toEqual(expect.any(String));
    expect(result.step).toBe(6);
  });
});
