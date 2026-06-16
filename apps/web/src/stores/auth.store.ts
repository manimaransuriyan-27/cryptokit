import type { User } from '@/types'; // Update to your real path mapping
import { computed } from 'mobx';
import { Model, model, modelAction, prop } from 'mobx-keystone';

@model('web/AuthStore')
export class AuthStore extends Model({
  user: prop<User | null>(null),
  isInitialized: prop<boolean>(() => false),
  isLoading: prop<boolean>(() => false),
  error: prop<string | null>(() => null),
  preAuthEmail: prop<string | undefined>(() => ''),
  pendingOTPUserId: prop<string | null>(() => null),
  emailId: prop<string | undefined>(() => ''),
  registrationInitiated: prop<boolean>(() => false),
  registrationCompleted: prop<boolean>(() => false),
  emailVerified: prop<boolean>(() => false),
  completionToken: prop<string | null>(() => null),
  loggingIn: prop<boolean>(() => false),
  loggingOut: prop<boolean>(() => false),
}) {
  @computed
  get isAuthenticated(): boolean {
    return this.user !== null;
  }

  @computed
  get hasPendingOtp(): boolean {
    return this.pendingOTPUserId !== '';
  }

  @computed
  get isEmailVerified(): boolean {
    return this.emailVerified;
  }

  @computed
  get isRegistrationCompleted(): boolean {
    return this.registrationCompleted;
  }

  @modelAction
  setUser(user: User | null) {
    this.user = user;
  }

  @modelAction
  setInitialized(value: boolean) {
    this.isInitialized = value;
  }

  @modelAction
  setIsLoading(value: boolean) {
    this.isLoading = value;
  }

  @modelAction
  setPreAuthEmail(email: string | undefined) {
    this.preAuthEmail = email;
  }

  @modelAction
  setPendingOtpUserId(userId: string | null) {
    this.pendingOTPUserId = userId;
  }

  @modelAction
  setEmailId(Id: string | undefined) {
    this.emailId = Id;
  }

  @modelAction
  setRegistrationInitiated(isInitiated: boolean) {
    this.registrationInitiated = isInitiated;
  }

  @modelAction
  setEmailVerified(isVerified: boolean) {
    this.emailVerified = isVerified;
  }

  @modelAction
  setCompletionToken(token: string | null) {
    this.completionToken = token;
  }

  @modelAction
  setRegistrationCompleted(value: boolean) {
    this.registrationCompleted = value;
  }

  @modelAction
  setLoggingIn(value: boolean) {
    this.loggingIn = value;
  }

  @modelAction
  setLoggingOut(value: boolean) {
    this.loggingOut = value;
  }

  @modelAction
  clearSession() {
    this.user = null;
    this.isInitialized = true;
    this.preAuthEmail = '';
    this.emailId = '';
    this.pendingOTPUserId = '';
    this.isLoading = false;
    this.registrationInitiated = false;
    this.emailVerified = false;
    this.completionToken = null;
    this.registrationCompleted = false;
    this.loggingIn = false;
    this.loggingOut = false;
  }
}
