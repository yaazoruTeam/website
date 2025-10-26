import { createCustomer } from '../../api/customerApi'
import { createComment } from '../../api/comment'
import { Customer, EntityType, CreateCommentDto } from '@model'
import { AddCustomerFormInputs } from './AddCustomerForm'
import { tempCommentsManager } from '../../utils/tempCommentsManager'

export const addCustomer = async (data: AddCustomerFormInputs, tempEntityId?: string): Promise<Customer.Model> => {
  
  const customerData: Customer.Model = {
    customer_id: '',
    first_name: data.first_name,
    last_name: data.last_name,
    id_number: data.id_number,
    email: data.email,
    phone_number: data.phone_number,
    additional_phone: data.additional_phone,
    city: data.city,
    address1: data.address,
    address2: '',
    zipCode: '2222',
    status: '',
    created_at: new Date(Date.now()),
    updated_at: new Date(Date.now()),
  }

  try {
    // יצירת הלקוח החדש
    const newCustomer = await createCustomer(customerData)

    // אם יש הערות זמניות, נוסיף אותן ללקוח החדש
    if (tempEntityId && tempCommentsManager.hasComments(tempEntityId)) {
      const tempComments = tempCommentsManager.getComments(tempEntityId)
    
    // הוספת כל ההערות הזמניות ללקוח החדש
    for (const tempComment of tempComments) {
      const commentData: CreateCommentDto.Model = {
        entity_id: String(newCustomer.customer_id),
        entity_type: EntityType.Customer,
        content: tempComment.content,
        created_at: tempComment.created_at.toISOString(),
      }
      
      try {
        await createComment(commentData)
      } catch (error) {
        console.error('Error creating comment for new customer:', error)
        // נמשיך גם אם נכשלנו ביצירת הערה אחת
      }
    }
  }

    return newCustomer
  } catch (error) {
    console.error('Error creating customer:', error)
    // אם יצירת הלקוח נכשלת, לא נניח להערות הזמניות "תקועות"
    if (tempEntityId && tempCommentsManager.hasComments(tempEntityId)) {
      console.log('Customer creation failed, but keeping temp comments for retry')
    }
    throw error
  }
}
