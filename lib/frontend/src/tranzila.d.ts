// src/tranzila.d.ts

export interface TzlaHostedFieldsError {
  field: string
  message: string
  code: string
}

export interface TzlaHostedFieldsResponse {
  transaction_response: {
    ConfirmationCode?: string
    Response?: string
    TransactionId?: string
    CardMask?: string
    TokenId?: string
    AvsResponseCode?: string
    CvvResponseCode?: string
  }
  token?: string
}

export interface TzlaHostedFieldsOptions {
  sandbox: boolean
  fields: {
    credit_card_number?: FieldOptions
    cvv?: FieldOptions
    expiry?: FieldOptions
    identity_number?: FieldOptions
  }
  styles?: {
    input?: {
      height?: string
      width?: string
      color?: string
      fontSize?: string
      border?: string
      borderRadius?: string
      padding?: string
    }
    select?: {
      height?: string
      width?: string
    }
  }
}

export interface TzlaHostedFieldsInstance {
  charge(
    data: ChargeData,
    callback: (
      err: { messages: TzlaHostedFieldsError[] } | null,
      response: TzlaHostedFieldsResponse | null
    ) => void
  ): void
  destroy(): void
}

export interface FieldOptions {
  selector: string
  placeholder?: string
  tabindex?: number
  version?: string
}

export interface ChargeData {
  terminal_name: string
  amount: number
  tran_mode?: 'A' | 'N' // A = Authorization, N = Authorization + Capture
  tokenize?: boolean
  response_language?: 'Hebrew' | 'English'
  contact?: string
  email?: string
  phone?: string
  description?: string
}

declare global {
  interface Window {
    TzlaHostedFields: {
      create(options: TzlaHostedFieldsOptions): TzlaHostedFieldsInstance
      destroy(): void
    }
    fieldsInitialized: boolean
  }
}

export {}
