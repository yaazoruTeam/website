import React from "react";
import { Box } from "@mui/system";
import { ChevronLeftIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import DeviceForm from "./deviceForm";
import { colors } from "../../styles/theme";
import CustomTypography from "../designComponent/Typography";
import StatusTag from "../designComponent/Status";
import { formatDateToString } from "../designComponent/FormatDate";
import { CustomerDevice, Device } from "../../model/src";

interface Props {
    device: Device.Model;
    customerDevice: CustomerDevice.Model;
    isOpen?: boolean;
    onClick?: () => void;
    showForm?: boolean;
}

const statusMap: Record<string, 'active' | 'inactive' | 'blocked' | 'canceled' | 'imei_locked'> = {
    active: 'active',
    inactive: 'inactive',
    blocked: 'blocked',
    canceled: 'canceled',
    imei_locked: 'imei_locked'
};

const DeviceRow: React.FC<Props> = ({ device, customerDevice, isOpen = false, onClick }) => {
    return (
        <Box>
            <Box
                onClick={onClick}
                sx={{
                    backgroundColor: isOpen ? colors.c13 : colors.c6,
                    border: `1px solid ${colors.c13}`,
                    borderRadius: '6px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    marginBottom: '11px'
                }}
            >
                <CustomTypography
                    text={device.device_number}
                    variant="h1"
                    weight="medium"
                    color={colors.c8}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    {!isOpen && device.status && statusMap[device.status] && (
                        <StatusTag status={statusMap[device.status]} />
                    )}
                    {isOpen ? (
                        <ChevronUpIcon style={{ width: 24, height: 24, color: colors.c11 }} />
                    ) : (
                        <ChevronLeftIcon style={{ width: 24, height: 24, color: colors.c11 }} />
                    )}
                </Box>
            </Box>

            {isOpen && (
                <DeviceForm
                    initialValues={{
                        SIM_number: device.SIM_number,
                        IMEI_1: device.IMEI_1,
                        mehalcha_number: device.mehalcha_number,
                        model: device.model,
                        received_at: formatDateToString(customerDevice.receivedAt),
                        planEndDate: formatDateToString(customerDevice.planEndDate ? customerDevice.planEndDate : ''),
                        filterVersion: customerDevice.filterVersion ? customerDevice.filterVersion : '',
                        deviceProgram: customerDevice.deviceProgram ? customerDevice.deviceProgram : '',
                        notes: ''
                    }}
                />
            )}
        </Box>
    );
};

export default DeviceRow;
