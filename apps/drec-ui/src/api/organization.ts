import {
    useOrganizationControllerGetAll,
    useOrganizationControllerGetOrganizationUsersByCode,
    useOrganizationControllerGetOrganizationByCode
} from '@energyweb/origin-drec-api-client';

export const useAllOrganizations = () => {
    const { data: organizations, isLoading: organizationsLoading } =
        useOrganizationControllerGetAll();

    return {
        organizations,
        organizationsLoading
    };
};

export const useOrganizationUsers = () => {
    const { data, isLoading: usersLoading } = useOrganizationControllerGetOrganizationUsersByCode();

    return {
        users: data,
        usersLoading
    };
};

export const useOrganization = () => {
    const { data: organization, isLoading: organizationLoading } =
        useOrganizationControllerGetOrganizationByCode();
    return {
        organization,
        organizationLoading
    };
};
