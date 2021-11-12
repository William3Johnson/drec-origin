import { DeviceGroupModalsActionsEnum, useDeviceGroupModalsDispatch } from '../../context';
import {
    UnreservedFormFormValues,
    useSelectableDeviceGroupsTableLogic,
    useDeviceGroupsFilterFormLogic
} from '../../../logic';
import { GenericFormProps } from '@energyweb/origin-ui-core';
import { useAllDeviceFuelTypes, useUnreservedDeviceGroups } from '../../../data';
import { useEffect, useState } from 'react';
import { SelectableDeviceGroupDTO } from '@energyweb/origin-drec-api-client';

export const useUnreservedPageEffects = () => {
    const initialFormValues: UnreservedFormFormValues = {
        country: [],
        fuelCode: [],
        installationConfiguration: '',
        offTaker: '',
        sector: '',
        standardCompliance: '',
        gridInterconnection: '',
        commissioningDateRange: '',
        capacityRange: ''
    };
    const [filterUnreserved, setFilterUnreserved] = useState(initialFormValues);
    const { deviceGroups, isLoading: IsLoadingDeviceGroups } =
        useUnreservedDeviceGroups(filterUnreserved);
    const [selectedDeviceGroupList, setSelectedDeviceGroupList] = useState(deviceGroups);
    const dispatchModals = useDeviceGroupModalsDispatch();

    const { allTypes, isLoading: isDeviceTypesLoading } = useAllDeviceFuelTypes();

    const { fields, initialValues, validationSchema, buttonText } = useDeviceGroupsFilterFormLogic(
        filterUnreserved,
        allTypes
    );

    const handleChecked = (id: SelectableDeviceGroupDTO['id'], checked: boolean) => {
        const groupIndex = deviceGroups.findIndex((selectable) => selectable.id === id);
        const updatedDeviceGroups = [...deviceGroups];
        if (groupIndex !== -1) {
            updatedDeviceGroups[groupIndex].selected = checked;
        }
        setSelectedDeviceGroupList(updatedDeviceGroups);
    };

    const tableProps = useSelectableDeviceGroupsTableLogic(
        deviceGroups,
        handleChecked,
        IsLoadingDeviceGroups,
        allTypes
    );

    useEffect(() => {
        setSelectedDeviceGroupList(deviceGroups);
    }, [deviceGroups]);

    const submitHandler = (values: UnreservedFormFormValues) => {
        setFilterUnreserved(values);
    };
    const isLoading = IsLoadingDeviceGroups || isDeviceTypesLoading;
    const formData: GenericFormProps<UnreservedFormFormValues> = {
        fields,
        initialValues,
        validationSchema,
        buttonText,
        submitHandler
    };

    const onReserveHandler = () => {
        const autoSelected: SelectableDeviceGroupDTO[] = selectedDeviceGroupList.filter(
            (group: SelectableDeviceGroupDTO) => group.selected === true
        );
        dispatchModals({
            type: DeviceGroupModalsActionsEnum.RESERVE,
            payload: {
                open: true,
                selected: autoSelected
            }
        });
    };

    const noUnreservedDeviceGroupsTitle =
        'Currently there aren`t any unreserved device groups for the selection criteria';

    const disableReserveButton =
        selectedDeviceGroupList?.filter(
            (group: SelectableDeviceGroupDTO) => group.selected === true
        ).length === 0;

    return {
        deviceGroups,
        tableProps,
        formData,
        isLoading,
        noUnreservedDeviceGroupsTitle,
        onReserveHandler,
        disableReserveButton
    };
};
