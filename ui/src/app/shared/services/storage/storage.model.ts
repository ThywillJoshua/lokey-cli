import { ICreateOrganizationForm } from '../../../containers/organizations/create-organization/create-organization.models';

export interface IUserProfile {
  email: string;
  name?: string;
}

export interface IStorage {
  'lokey.tokens': {
    access_token: string;
    refresh_token: string;
  };
  'lokey.user': IUserProfile;
  'lokey.create-organization-form': ICreateOrganizationForm;
}
