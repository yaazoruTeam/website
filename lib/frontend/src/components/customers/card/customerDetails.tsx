import { forwardRef, useImperativeHandle, useRef, useState, useEffect, useCallback } from 'react'
import AddCustomerForm from '../AddCustomerForm'
import { Customer, Comment, EntityType } from '@model'
import { Box } from '@mui/system'
import { getCommentsByEntityTypeAndEntityId } from '../../../api/comment'

export interface CustomerDetailsRef {
  getCustomerData: () => Partial<Customer.Model>
  submitForm: () => void
}

const CustomerDetails = forwardRef<CustomerDetailsRef, { 
  customer: Customer.Model,
  onCustomerUpdate?: (customerData: Partial<Customer.Model>) => Promise<void>,
}>(
  ({ customer, onCustomerUpdate }, ref) => {
    const formValuesRef = useRef<Partial<Customer.Model>>({})
    const formSubmitRef = useRef<() => void>(() => {})
    const [lastComment, setLastComment] = useState<Comment.Model | null>(null)

    useImperativeHandle(ref, () => ({
      getCustomerData: () => {
        return formValuesRef.current
      },
      submitForm: () => {
        if (formSubmitRef.current) {
          formSubmitRef.current()
        }
      },
    }))

    // הבאת ההערה האחרונה של הלקוח
    const fetchLastComment = useCallback(async () => {
      if (!customer.customer_id) return
      
      try {
        const response = await getCommentsByEntityTypeAndEntityId(
          EntityType.Customer,
          customer.customer_id.toString(),
          1
        )
        
        if (response.data && response.data.length > 0) {
          setLastComment(response.data[0])
        } else {
          setLastComment(null)
        }
      } catch (error) {
        console.error('Error fetching comments:', error)
      }
    }, [customer.customer_id])

    useEffect(() => {
      fetchLastComment()
    }, [fetchLastComment])

    return (
      <Box sx={{ marginBottom: '80px' }}>
        <AddCustomerForm
          key={lastComment?.comment_id || 'no-comment'}
          customerId={customer.customer_id?.toString()}
          lastCommentDate={lastComment ? new Date(lastComment.created_at).toLocaleDateString('he-IL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }) : undefined}
          lastComment={lastComment ? lastComment.content : undefined}
          onCommentsRefresh={fetchLastComment}
          onSubmit={async (data) => {
            formValuesRef.current = data
            if (onCustomerUpdate) {
              await onCustomerUpdate(data)
            }
          }}
          setSubmitHandler={(submitFn) => {
            formSubmitRef.current = submitFn
          }}
          initialValues={{
            first_name: customer.first_name,
            last_name: customer.last_name,
            id_number: customer.id_number,
            phone_number: customer.phone_number,
            additional_phone: customer.additional_phone,
            email: customer.email,
            address: customer.address1,
            city: customer.city,
          }}
        />
      </Box>
    )
  },
)

export default CustomerDetails
