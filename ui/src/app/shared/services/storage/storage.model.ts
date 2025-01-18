import { ICreateOrganizationForm } from '../../../containers/organizations/create-organization/create-organization.models';

export interface IUserProfile {
  email: string;
  name?: string;
}

export interface IStorage {
  'echo.tokens': {
    access_token: string;
    refresh_token: string;
  };
  'echo.user': IUserProfile;
  'echo.create-organization-form': ICreateOrganizationForm;
}
