import { createCustomer } from '../../api/customerApi'
import { createComment } from '../../api/comment'
import { Customer, EntityType, CreateCommentDto, TempComment } from '@model'
import { AddCustomerFormInputs } from './AddCustomerForm'

export const addCustomer = async (data: AddCustomerFormInputs, localComments?: TempComment.Model[]): Promise<Customer.Model> => {
  
  const customerData: Customer.Model = {
    customer_id: 0,
    first_name: data.first_name,
    last_name: data.last_name,
    id_number: data.id_number,
    email: data.email,
    phone_number: data.phone_number,
    additional_phone: data.additional_phone,
    city: data.city,
    address: data.address,
    status: '',
    created_at: new Date(Date.now()),
    updated_at: new Date(Date.now()),
  }

  try {
    // יצירת הלקוח החדש
    const newCustomer = await createCustomer(customerData)
    // אם יש הערות מקומיות שנכתבו בטופס, נשמור אותן בבסיס הנתונים מיד אחרי שיש לנו customer_id
    if (localComments && localComments.length > 0) {
      for (const tempComment of localComments) {
        const commentData: CreateCommentDto.Model = {
          entity_id: newCustomer.customer_id,
          entity_type: EntityType.CUSTOMER,
          content: tempComment.content,
          created_at: tempComment.created_at.toISOString(),
        }

        try {
          await createComment(commentData)
        } catch (err) {
          console.error('Error creating comment:', err)
        }
      }
    }

    return newCustomer
  } catch (error) {
    console.error('Error creating customer:', error)
    throw error
  }
}
