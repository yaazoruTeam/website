import React from "react";
import { Box } from "@mui/material";
import { CustomTextField } from "../Input/Input";
import { additionalPhoneArgs, addressArgs, cityArgs, emailArgs, firstNameArgs, idNumberArgs, lastNameArgs, phoneNumberArgs } from "../Input/Input.stories";
import { useForm } from "react-hook-form";
import { CustomButton } from "../Button/Button";
import { saveArgs } from "../Button/Button.stories";

interface AddCustomerFormProps {
    onSubmit: (data: AddCustomerFormInputs) => void;
}

export interface AddCustomerFormInputs {
    first_name: string;
    last_name: string;
    id_number: string;
    phone_number: string;
    additional_phone: string;
    email: string;
    address: string;
    city: string;
}

const AddCustomerForm: React.FC<AddCustomerFormProps> = ({ onSubmit }) => {

    const { control, handleSubmit } = useForm<AddCustomerFormInputs>();

    return (
        <Box style={{
            alignSelf: 'stretch',
            height: 459,
            width: '100%',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            gap: 80,
            display: 'flex'
        }}
        >
            <Box style={{
                alignSelf: 'stretch',
                height: 459,
                boxShadow: '0px 4px 10px rgba(41.60, 59.76, 109.70, 0.04)',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'flex-start',
                gap: 20,
                display: 'flex'
            }}
            >
                <Box style={{
                    alignSelf: 'stretch',
                    height: 459,
                    padding: 28,
                    background: 'white',
                    borderRadius: 6,
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-start',
                    gap: 28,
                    display: 'flex'
                }}
                >
                    <Box style={{
                        alignSelf: 'stretch',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-start',
                        gap: 28,
                        display: 'flex'
                    }}
                    >
                        <Box style={{
                            flex: '1 1 0',
                            height: 90,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                            gap: 8,
                            display: 'flex'
                        }}
                        >
                            <CustomTextField {...idNumberArgs} control={control} />
                        </Box>                        <Box style={{ flex: '1 1 0', height: 90, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', gap: 8, display: 'flex' }}>
                            <CustomTextField {...lastNameArgs} control={control} />
                        </Box>
                        <Box style={{ flex: '1 1 0', height: 90, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', gap: 8, display: 'flex' }}>
                            <CustomTextField {...firstNameArgs} control={control} />
                        </Box>
                    </Box>
                    <Box style={{
                        alignSelf: 'stretch',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-start',
                        gap: 28,
                        display: 'flex'
                    }}
                    >
                        <Box style={{
                            flex: '1 1 0',
                            height: 90,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                            gap: 8,
                            display: 'flex'
                        }}>
                            <CustomTextField {...emailArgs} control={control} />
                        </Box>
                        <Box style={{
                            flex: '1 1 0',
                            height: 90,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                            gap: 8,
                            display: 'flex'
                        }}>
                            <CustomTextField {...additionalPhoneArgs} control={control} />
                        </Box>
                        <Box style={{
                            flex: '1 1 0',
                            height: 90,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                            gap: 8,
                            display: 'flex'
                        }}
                        >
                            <CustomTextField {...phoneNumberArgs} control={control} />
                        </Box>
                    </Box>
                    <Box style={{
                        alignSelf: 'stretch',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        gap: 28,
                        display: 'flex'
                    }}
                    >
                        <Box style={{
                            flex: '1 1 0',
                            height: 90,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                            gap: 8,
                            display: 'flex'
                        }}
                        >
                            <CustomTextField {...phoneNumberArgs} control={control} />
                        </Box>
                        <Box style={{
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            gap: 16,
                            display: 'flex'
                        }}
                        >
                            <CustomTextField {...cityArgs} control={control} />
                        </Box>
                        <Box style={{
                            flex: '1 1 0',
                            height: 90,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                            gap: 8,
                            display: 'flex'
                        }}
                        >
                            <CustomTextField {...addressArgs} control={control} />
                        </Box>
                    </Box>
                    <CustomButton {...saveArgs}
                        onClick={handleSubmit(onSubmit)}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default AddCustomerForm;