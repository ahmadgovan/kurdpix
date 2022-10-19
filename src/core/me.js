/**
 *
 * Userdata that gets sent to the client on
 * various api endpoints.
 *
 */
import { getLocalicedCanvases } from '../canvasesDesc';
import { USE_MAILER } from './config';
import chatProvider from './ChatProvider';


export default async function getMe(user, lang = 'default') {
  const userdata = await user.getUserData();
  // sanitize data
  const {
    name, verified,
  } = userdata;
  if (!name) userdata.name = null;
  const messages = [];
  if (USE_MAILER && name && !verified) {
    messages.push('not_verified');
  }
  if (messages.length > 0) {
    userdata.messages = messages;
  }
  delete userdata.verified;

  userdata.canvases = getLocalicedCanvases(lang);
  userdata.channels = {
    ...chatProvider.getDefaultChannels(lang),
    ...userdata.channels,
  };

  return userdata;
}
