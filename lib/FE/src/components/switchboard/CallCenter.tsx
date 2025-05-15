import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import PhoneNumber from "./PhoneNumer";
import { formatDateToString } from "../designComponent/FormatDate";
import CustomSwitch from "../designComponent/Switch";
import { Box } from "@mui/system";
import CustomTypography from "../designComponent/Typography";
import { CustomButton } from "../designComponent/Button";
import CustomTable from "../designComponent/CustomTable";
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { TrashIcon } from '@heroicons/react/24/outline';
import TableWithArrow from '../../assets/TableWithArrow.svg';
import ChangingDestinations from '../../assets/ChangingDestinations.svg';
import CallLog from '../../assets/CallLog.svg';

const CallCenter: React.FC = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [calls, setCalls] = useState<any[]>([{
        organizationName: "1234",
        number: "125-324-6587",
        country: "Isral",
        target: "125-324-6587",
        fromDate: new Date(Date.now()),
        definedAsAnIdentifier: true,
        monthlyCost: 100,
        outgoingCalls: false,
    }]);
    const editCallCenter = () => {
        console.log('editCallCenter');
    }
    const callLog = (call: any) => {
        console.log('callLog', call);
        navigate(`./callLog/${call.target}`);
    }
    const switchAccount = () => {
        console.log('Switch account');
    }
    const tableWithArrow = () => {
        console.log('tableWithArrow');
    }
    const deleteCall = () => {
        console.log('deleteCall');
    }

    //to do : לשנות ולהתאים את זה
    const columns = [
        { label: t('organizationName'), key: 'organizationName' },
        { label: t('number'), key: 'number' },
        { label: t('target'), key: 'target' },
        { label: t('fromDate'), key: 'fromDate' },
        { label: t('definedAsAnIdentifier'), key: 'definedAsAnIdentifier' },
        { label: t('monthlyCost'), key: 'monthlyCost' },
        { label: t('outgoingCalls'), key: 'outgoingCalls' },
        { label: '', key: 'icons' },

    ];
    const tableData = calls.map((call) => ({
        organizationName: call.organizationName,
        //to do : לבדוק איך בדיוק הנתונים ניראים ולהתאים את זה
        number: <PhoneNumber phoneNumber={call.number} country={call.country} />,
        target: <PhoneNumber phoneNumber={call.target} country={call.country} />,
        fromDate: formatDateToString(call.fromDate),
        definedAsAnIdentifier: <CustomSwitch checked={call.definedAsAnIdentifier} onChange={(e) => { changeDefinedAsAnIdentifier(e) }} />,
        monthlyCost: call.monthlyCost,
        outgoingCalls: <CustomSwitch checked={call.outgoingCalls} onChange={(e) => { changeOutgoingCalls(e) }} />,
        icons: <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '8px',
            width: '100%',
        }}>
            <PencilSquareIcon style={{ width: '24px', height: '24px', cursor: 'pointer' }} onClick={editCallCenter} />
            <img src={CallLog} alt="callLog" style={{ width: '24px', height: '24px', cursor: 'pointer' }} onClick={() => callLog(call)} />
            <img src={ChangingDestinations} alt="changingDestinations" style={{ width: '24px', height: '24px', cursor: 'pointer' }} onClick={switchAccount} />
            <img src={TableWithArrow} alt="TableWithArrow" style={{ width: '24px', height: '24px', cursor: 'pointer' }} onClick={tableWithArrow} />
            <TrashIcon style={{ width: '24px', height: '24px', cursor: 'pointer' }} onClick={deleteCall} />
        </Box>
    }));

    const changeDefinedAsAnIdentifier = (e: any) => {
        //to do : קריאת שרת לשינוי של כיבוי או הדלקה של מוגדר כמזהה
        console.log('changeDefinedAsAnIdentifier', e);
        //שינוי הסטטוס לבינתיים
        setCalls((prevCalls) =>
            prevCalls.map((call, i) =>
                i === 0 ? { ...call, definedAsAnIdentifier: e } : call
            )
        );

    }

    const changeOutgoingCalls = (e: any) => {
        //to do : קריאת שרת לשינוי של כיבוי או הדלקה של שיחות יוצאות
        console.log('changeOutgoingCalls', e);
        //שינוי הסטטוס לבינתיים
        setCalls((prevCalls) =>
            prevCalls.map((call, i) =>
                i === 0 ? { ...call, outgoingCalls: e } : call
            )
        );
    }
    const editAccount = () => {
        console.log('editAccount');
    }
    const purchasingNewNumber = () => {
        console.log('purchasingNewNumber');
    }
    return (
        <Box sx={{
            paddingLeft: '10%',
            paddingRight: '15%',
        }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                my: '24px'
            }}>
                <CustomTypography
                    text={`${t('callCenter')}/ ${id}`}//to do : לשנות לשם הארגון לאחר שיהיה לי את הנתונים האמיתיים
                    weight="bold"
                    variant="h1"
                />
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                }}>
                    <CustomButton
                        label={t('editAccount')}
                        buttonType="third"
                        state="active"
                        onClick={editAccount}
                    />
                    <CustomButton
                        label={t('purchasingNewNumber')}
                        onClick={purchasingNewNumber}
                    />

                </Box>
            </Box>
            <CustomTable
                columns={columns}
                data={tableData}
            // onClickRow={(row) => { }}//to do : ליצור פונקציה לשינוי

            />

        </Box>
    );
};

export default CallCenter;
