import { model, Model, prop, registerRootStore } from 'mobx-keystone';
import { AuthStore } from './auth.store';

@model('web/RootStore')
export class RootStore extends Model({
  authStore: prop<AuthStore>(() => new AuthStore({})),
}) {}

// Create the single production instance of the entire state tree
export const rootStore = new RootStore({});

// Required by MobX-Keystone to establish root tree tracking
registerRootStore(rootStore);
