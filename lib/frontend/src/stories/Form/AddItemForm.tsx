import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { CustomTextField } from "../Input/Input";
import CustomSelect from "../Select/CustomSelect";
import { CustomButton } from "../../components/Button/Button";
import trashIcon from '../../assets/trash-can.svg';

export interface ItemFormInputs {
    description: string;
    quantity: number | string;
    price: number | string;
    total: number | string;
    paymentType: string;
}

interface ItemFormProps {
    onSubmit: (data: ItemFormInputs) => void;
    initialValues?: ItemFormInputs | null;
}

const ItemForm: React.FC<ItemFormProps> = ({ onSubmit, initialValues }) => {
    const { control, handleSubmit, reset, watch, setValue } = useForm<ItemFormInputs>({
        defaultValues: {
            description: '',
            quantity: '',
            price: '',
            total: '',
            paymentType: ''
        }
    });
    const quantity = watch("quantity");
    const price = watch("price");

    useEffect(() => {
        if (quantity && price) {
            const total = Number(quantity) * Number(price);
            setValue("total", total);
        }
    }, [quantity, price, setValue]);

    useEffect(() => {
        if (initialValues) {
            reset(initialValues);
        }
    }, [initialValues, reset]);

    const onFormSubmit = (data: ItemFormInputs) => {
        onSubmit(data);
        reset({
            description: '',
            quantity: '',
            price: '',
            total: '',
            paymentType: ''
        });
    };
    const deleteForm = () => {
        console.log('delete form');

        reset({
            description: '',
            quantity: '',
            price: '',
            total: '',
            paymentType: ''
        });
    };

    return (
        <Box style={{ alignSelf: 'stretch', justifyContent: 'flex-end', alignItems: 'flex-end', gap: 24, display: 'inline-flex' }}>
            <Box style={{ flex: '1 1 0', height: 50, justifyContent: 'flex-start', alignItems: 'center', gap: 8, display: 'flex' }}>
                <Box style={{ width: 24, height: 24, position: 'relative' }}>
                    <img src={trashIcon} alt="delete" onClick={() => deleteForm()} style={{ cursor: 'pointer' }} />
                </Box>
                <CustomButton
                    label="אישור"
                    sx={{
                        background: 'rgba(21.45, 53.71, 70.41, 0.37)',
                        color: 'white',
                    }}
                    onClick={handleSubmit(onFormSubmit)}
                />
            </Box>
            {/* שדות הטופס */}
            <CustomTextField
                label="סך הכל"
                name="total"
                control={control}
                placeholder="₪ 0.00"
                sx={{
                    direction: "rtl"
                }}
            />
            <CustomTextField
                label="מחיר"
                name="price"
                control={control}
                placeholder="מחיר"
                sx={{
                    direction: "rtl"
                }}
            />
            <CustomTextField
                label="כמות"
                name="quantity"
                control={control}
                placeholder="יש להזין כמות"
                sx={{
                    direction: "rtl"
                }}
            />
            <CustomTextField
                label="תיאור"
                name="description"
                control={control}
                placeholder="כאן יהיה תיאור"
                sx={{
                    direction: "rtl"
                }}
            />
            <CustomSelect
                label="סוג תשלום"
                name="paymentType"
                control={control}
                options={[{ label: 'הוראת קבע', value: 'הוראת קבע' }, { label: 'תשלום חד פעמי', value: 'תשלום חד פעמי' }]}
            />
        </Box>
    );
};

export default ItemForm;
