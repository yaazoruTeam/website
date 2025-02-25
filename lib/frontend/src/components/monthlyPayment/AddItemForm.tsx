import React, { useEffect } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useForm } from "react-hook-form";
import { CustomTextField } from "../designComponent/Input";
import CustomSelect from "../../stories/Select/CustomSelect";
import { CustomButton } from "../designComponent/Button";
import trashIcon from '../../assets/trash-can.svg';
import { ItemForMonthlyPayment } from "../../model/src";
import { useTranslation } from "react-i18next";

interface ItemFormProps {
    onSubmit: (data: ItemForMonthlyPayment.Model) => void;
    initialValues?: ItemForMonthlyPayment.Model | null;
}

const ItemForm: React.FC<ItemFormProps> = ({ onSubmit, initialValues }) => {
      const { t } = useTranslation();
    const isMobile = useMediaQuery('(max-width:600px)');
    const { control, handleSubmit, reset, watch, setValue } = useForm<ItemForMonthlyPayment.Model>({
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

    const onFormSubmit = (data: ItemForMonthlyPayment.Model) => {
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
                    label={t('approval')}
                    size={isMobile ? 'small' : 'large'}
                    state="hover"
                    buttonType="first"
                    onClick={handleSubmit(onFormSubmit)}
                />
            </Box>
            {/* שדות הטופס */}
            <CustomTextField
                label={t('total')}
                name="total"
                control={control}
                placeholder="₪ 0.00"
            />
            <CustomTextField
                label={t('price')}
                name="price"
                control={control}
                placeholder={t('price')}
            />
            <CustomTextField
                label={t('amount')}
                name="quantity"
                control={control}
                placeholder={t('InstructionForAmount')}
            />
            <CustomTextField
                label={t('description')}
                name="description"
                control={control}
                placeholder={t('InstructionForDescription')}
            />
            <CustomSelect
                label={t('paymentType')}
                name="paymentType"
                control={control}
                options={[{ label: t('standingOrder'), value: t('standingOrder') }, { label: t('oneTimePayment'), value: t('oneTimePayment') }]}
            />
        </Box>
    );
};

export default ItemForm;
