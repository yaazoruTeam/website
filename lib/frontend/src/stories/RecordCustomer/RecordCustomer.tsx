import React from "react";
import { Box, Typography } from "@mui/material";

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
                backgroundColor: 'white',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 3,
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
                    gap: 1,
                    display: 'flex',
                }}
            >
                <Typography
                    sx={{
                        alignSelf: 'stretch',
                        textAlign: 'right',
                        color: '#1F1F1F',
                        fontSize: 18,
                        fontFamily: 'Heebo',
                        fontWeight: 400,
                        wordWrap: 'break-word',
                    }}
                >
                    {name}
                </Typography>
                <Box
                    sx={{
                        alignSelf: 'stretch',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        display: 'inline-flex',
                    }}
                >
                    <Typography
                        sx={{
                            width: 211.2,
                            color: '#1F1F1F',
                            fontSize: 18,
                            fontFamily: 'Heebo',
                            fontWeight: 400,
                            wordWrap: 'break-word',
                        }}
                    >
                        {email}
                    </Typography>
                    <Typography
                        sx={{
                            textAlign: 'right',
                            color: '#1F1F1F',
                            fontSize: 18,
                            fontFamily: 'Heebo',
                            fontWeight: 400,
                            wordWrap: 'break-word',
                        }}
                    >
                        {phone}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};
