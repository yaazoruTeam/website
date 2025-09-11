import { useEffect, useState } from 'react'
import { colors } from '../../styles/theme'
import CustomModal from '../designComponent/Modal'
import CustomTypography from '../designComponent/Typography'
import { useTranslation } from 'react-i18next'
import { Box } from '@mui/material'
import { CustomButton } from '../designComponent/Button'
import CustomRadioBox from '../designComponent/RadioBox'
import { CustomTextField } from '../designComponent/Input'
import { useForm } from 'react-hook-form'
import usaIcon from '../../assets/USA.svg'
import israelIcon from '../../assets/Israel.svg'
import englandIcon from '../../assets/England.svg'
import CustomSelect from '../designComponent/CustomSelect'
import { Switchboard } from '@model'

//to do: טיפוס זמני לשנות לטיפוס הנכון
type NumberPlan = Switchboard.NumberPlan
//to do: טיפוס זמני לשנות לטיפוס הנכון
type PurchasingNumberFormData = Switchboard.PurchasingNumberFormData
interface PurchasingNewNumberProps {
  open: boolean
  onClose: () => void
}

const PurchasingNewNumber: React.FC<PurchasingNewNumberProps> = ({ open, onClose }) => {
  const { t } = useTranslation()
  //to do : קריאת שרת לכל סוגי המספרים והמחירים שלהם לפי זה להציג את זה
  const [numbers, setNumbers] = useState<NumberPlan[]>([])
  const [selectedPrice, setSelectedPrice] = useState<string>('') // או '24' כברירת מחדל
  const [openDetailsForm, setOpenDetailsForm] = useState<boolean>(false)
  const { control, handleSubmit } = useForm<PurchasingNumberFormData>({})
  const [errorNotSelectedNumber, setErrorNotSelectedNumber] = useState<boolean>(false)

  useEffect(() => {
    const getPlans = () => {
      //to do : בקשה לשרת לקבל את כל סוגי התוכניות שיש
      //להחזיר אותן
      const plans = [
        {
          number: '053-3198756',
          price: '43',
        },
        {
          number: '053-3187542',
          price: '23',
        },
        {
          number: '052-7854120',
          price: '24',
        },
      ]
      return plans
    }
    setNumbers(getPlans())
  }, [])

  const approval = () => {
    if (selectedPrice) {
      setOpenDetailsForm(true)
      onClose()
    } else {
      setErrorNotSelectedNumber(true)
    }
  }
  const saveBuyNewNumber = () => {
    //to do : קריאת שרת לעידכון הנתונים בשרת וביצוע הקניה
    console.log('save changes')
    setOpenDetailsForm(false)
  }

  return (
    <Box>
      <CustomModal open={openDetailsForm} onClose={() => setOpenDetailsForm(false)}>
        <Box>
          <Box
            sx={{
              my: '24px',
            }}
          >
            <Box sx={{ my: '10px' }}>
              <CustomTextField
                control={control}
                name='personalID'
                label={t('settingPersonalID')}
                placeholder={'0548494926'}
              />
            </Box>
            <Box sx={{ my: '10px' }}>
              <CustomSelect
                control={control}
                name='target'
                label={t('target')}
                options={[
                  {
                    label: '053-3198756',
                    icon: <img src={israelIcon} alt='' style={{ width: '20px', height: '15px' }} />,
                    value: '053-3198756',
                  },
                  {
                    label: '053-3187542',
                    icon: <img src={usaIcon} alt='' style={{ width: '20px', height: '15px' }} />,
                    value: '053-3187542',
                  },
                  {
                    label: '052-7854120',
                    icon: (
                      <img src={englandIcon} alt='' style={{ width: '20px', height: '15px' }} />
                    ),
                    value: '052-7854120',
                  },
                ]}
              />
            </Box>
            <Box sx={{ my: '10px' }}>
              <CustomTextField
                control={control}
                name='notes'
                label={t('notes')}
                placeholder={'0548494926'}
              />
            </Box>
            <Box sx={{ my: '10px' }}>
              <CustomTextField
                control={control}
                name='SMSToEmail'
                label={t('toReceiveSMSToEmail')}
                placeholder={'0548494926'}
              />
            </Box>
            <Box sx={{ my: '10px' }}>
              <CustomTextField
                control={control}
                name='notifyEmailCalls'
                label={t('notifyEmailOfAllCalls')}
                placeholder={'0548494926'}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'left',
              alignItems: 'center',
              gap: '13px',
            }}
          >
            <CustomButton
              label={t('cancellation')}
              buttonType='third'
              state='default'
              onClick={() => setOpenDetailsForm(false)}
            />
            <CustomButton
              label={t('savingChanges')}
              buttonType='second'
              state='default'
              onClick={handleSubmit(saveBuyNewNumber)}
            />
          </Box>
        </Box>
      </CustomModal>
      <CustomModal open={open} onClose={onClose} maxWidth='520px' padding='32px'>
        <Box
          sx={{
            width: '520px',
            height: 'auto',
          }}
        >
          <CustomTypography
            text={t('numberSelection')}
            variant='h1'
            weight='bold'
            color={colors.blue600}
          />
          <Box sx={{ my: '32px' }}>
            {numbers.map((item, index) => (
              <Box key={index}>
                <CustomRadioBox
                  options={[
                    {
                      value: item.price,
                      label: (
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'start',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <CustomTypography text={item.number} variant='h3' weight='regular' />
                          <CustomTypography
                            text={`${item.price}₪ ${t('perMonth')}`}
                            variant='h3'
                            weight='regular'
                            color={colors.blue500}
                          />
                        </Box>
                      ),
                    },
                  ]}
                  value={selectedPrice}
                  onChange={setSelectedPrice}
                />
              </Box>
            ))}
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'left',
              alignItems: 'center',
              gap: '13px',
            }}
          >
            <CustomButton label={t('approval')} onClick={approval} />
            <CustomButton
              label={t('cancellation')}
              buttonType='third'
              state='default'
              onClick={onClose}
            />
          </Box>
          {errorNotSelectedNumber && !selectedPrice && (
            <Box>
              <CustomTypography
                text={t('errorNoPlanSelectedBuyingNewNumber')}
                variant='h4'
                weight='regular'
              />
            </Box>
          )}
        </Box>
      </CustomModal>
    </Box>
  )
}

export default PurchasingNewNumber
