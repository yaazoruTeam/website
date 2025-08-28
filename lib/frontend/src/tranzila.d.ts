// src/tranzila.d.ts

// Tranzila error interface
interface TranzilaError {
  message: string
  code?: string
  details?: unknown
}

// Tranzila response interface
interface TranzilaResponse {
  success: boolean
  transaction_id?: string
  error?: TranzilaError
  [key: string]: unknown
}

declare global {
  interface TzlaHostedFields {
    create(options: TzlaHostedFieldsOptions): TzlaHostedFieldsInstance
    destroy(): void
  }

  interface TzlaHostedFieldsOptions {
    sandbox: boolean
    fields: {
      credit_card_number: FieldOptions
      cvv: FieldOptions
      expiry: FieldOptions
    }
  }

  interface TzlaHostedFieldsInstance {
    charge(data: ChargeData, callback: (err: TranzilaError | null, response: TranzilaResponse | null) => void): void
  }

  interface FieldOptions {
    selector: string
    placeholder: string
    tabindex: number
    version?: string
  }

  interface ChargeData {
    terminal_name: string
    amount: string
    contact: string
  }
}
declare global {
  interface Window {
    TzlaHostedFields: TzlaHostedFields
  }
}

// כדי להבטיח ש-TypeScript יטפל בטיפוסים המורחבים, עלינו לייצא את הקובץ הזה
export {}
