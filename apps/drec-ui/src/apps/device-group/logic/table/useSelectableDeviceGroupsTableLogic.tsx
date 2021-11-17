import { CodeNameDTO, SelectableDeviceGroupDTO } from '@energyweb/origin-drec-api-client';
import { TableComponentProps } from '@energyweb/origin-ui-core';
import { Checkbox } from '@material-ui/core';
import { getFuelNameFromCode } from '../../../../utils';

const prepareSelectableDeviceGroupsData = (
    group: SelectableDeviceGroupDTO,
    allFuelTypes: CodeNameDTO[],
    handleChecked: (id: SelectableDeviceGroupDTO['id'], checked: boolean) => void
) => ({
    id: group.id,
    country: group.countryCode,
    organization: group.organization.name,
    fuelCode: getFuelNameFromCode(group.fuelCode, allFuelTypes),
    capacityRange: group.capacityRange,
    installations: group.installationConfigurations.join().replaceAll(',', ', '),
    offTakers: group.offTakers.join().replaceAll(',', ', '),
    sectors: group.sectors.join().replaceAll(',', ', '),
    commissioningDateRange: group.commissioningDateRange.join().replaceAll(',', ', '),
    standardCompliance: group.standardCompliance,
    checked: (
        <Checkbox
            checked={group.selected}
            color="default"
            size="medium"
            onChange={(event) => handleChecked(group.id, event.target.checked)}
        />
    )
});

export const useSelectableDeviceGroupsTableLogic = (
    groups: SelectableDeviceGroupDTO[],
    handleChecked: (id: SelectableDeviceGroupDTO['id'], checked: boolean) => void,
    loading: boolean,
    allFuelTypes: CodeNameDTO[]
): TableComponentProps<SelectableDeviceGroupDTO['id']> => {
    return {
        header: {
            country: 'Country',
            organization: 'Organization',
            fuelCode: 'Fuel Code',
            capacityRange: 'Capacity Range',
            installations: 'Installations',
            offTakers: 'Offtakers',
            sectors: 'Sectors',
            commissioningDateRange: 'Commissioning Date Range',
            standardCompliance: 'Standard Compliance',
            checked: ''
        },
        loading,
        pageSize: 25,
        data:
            groups?.map((group) =>
                prepareSelectableDeviceGroupsData(group, allFuelTypes, handleChecked)
            ) ?? []
    };
};