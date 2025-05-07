import React from "react";
import { Box } from "@mui/material";
import CustomTypography from "../../components/designComponent/Typography";
import { colors } from "../../styles/theme";

interface RecordCustomerProps {
    name: string;
    phone: string;
    email: string;
    onClick?: () => void;
    sx?: string;
}

export const RecordCustomer: React.FC<RecordCustomerProps> = ({
    name,
    phone,
    email,
    onClick,
    sx,
    ...props
}) => {
    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                paddingTop: 2,
                paddingBottom: 2,
                backgroundColor: colors.c6,
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 1.625,
                display: 'inline-flex',
                cursor: 'pointer',
            }}
            onClick={onClick}
        >
            <Box
                sx={{
                    height: 58,
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    gap: 1.5,
                    display: 'flex',
                }}
            >
                <CustomTypography
                    text={name}
                    variant='h3'
                    weight='regular'
                    color={colors.c0}
                    sx={{
                        alignSelf: 'stretch',
                        textAlign: 'right',
                        wordWrap: 'break-word',
                    }}
                />
                <Box
                    sx={{
                        alignSelf: 'stretch',
                        display: 'inline-flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <CustomTypography
                        text={email}
                        variant='h3'
                        weight='regular'
                        color={colors.c0}
                        sx={{
                            wordWrap: 'break-word',
                            width: 211.2,
                        }}
                    />
                    <CustomTypography
                        text={phone}
                        variant='h3'
                        weight='regular'
                        color={colors.c0}
                        sx={{
                            wordWrap: 'break-word',
                            textAlign: 'right', flexBasis: '50%',  // הטלפון תופס חצי מרחב של הקופסה
                        }}
                    />
                </Box>
            </Box>
        </Box>
    );
};
