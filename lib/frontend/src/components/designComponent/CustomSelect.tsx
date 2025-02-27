import React, { useState } from 'react';
import { FormControl, Select, MenuItem, InputAdornment } from '@mui/material';
import { Controller } from 'react-hook-form';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { colors } from '../../styles/theme';
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import CustomTypography from './Typography';


interface CustomSelectProps {
    name: string;
    control: any;
    options: { label: string, value: string }[];
    label: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ name, control, options, label }) => {
    const [open, setOpen] = useState(false);

    const handleIconClick = () => {
        setOpen(prevState => !prevState);
    };

    return (
        <FormControl sx={{ width: '100%' }}>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Select
                        {...field}
                        label={
                            <CustomTypography
                                text={label}
                                variant='h4'
                                weight='regular'
                                color={colors.brand.color_9}
                            />
                        }
                        open={open}
                        onOpen={() => setOpen(true)}
                        onClose={() => setOpen(false)}
                        sx={{
                            textAlign: 'right',
                            backgroundColor: colors.brand.color_11,
                            border: 'none',
                            boxShadow: 'none',
                            '.MuiOutlinedInput-notchedOutline': { border: 'none' },
                            '& .MuiSelect-icon': {
                                display: 'none',
                            },
                            width: '100%',
                            height: '44px',
                            padding: '0 10px',
                            '& .MuiSelect-root': {
                                paddingLeft: '30px',
                            }
                        }}
                        value={field.value || ''}
                        endAdornment={
                            <InputAdornment position="end" onClick={handleIconClick}>
                                <ChevronDownIcon style={{ width: '21.5px', height: '16px', color: colors.brand.color_8 }} />
                            </InputAdornment>
                        }
                    >
                        {options.map((option) => (
                            <MenuItem key={option.value} value={option.value}
                                sx={{
                                    direction: 'rtl'
                                }}
                            >
                                <CustomTypography
                                    text={option.label}
                                    variant='h4'
                                    weight='regular'
                                    color={colors.brand.color_9}
                                />
                            </MenuItem>
                        ))}
                    </Select>
                )}
            />
        </FormControl>
    );
};

export default CustomSelect;
