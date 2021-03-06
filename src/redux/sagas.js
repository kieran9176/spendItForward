import { all } from 'redux-saga/effects'
import user from './user/sagas'
import menu from './menu/sagas'
import settings from './settings/sagas'
import profile from './profile/sagas'
import builds from './builds/sagas'
import assets from './assets/sagas'
import socials from './socials/sagas'

export default function* rootSaga() {
  yield all([user(), menu(), settings(), profile(), builds(), assets(), socials()])
}
