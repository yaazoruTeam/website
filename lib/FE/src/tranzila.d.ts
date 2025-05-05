// src/tranzila.d.ts

declare global {
    interface TzlaHostedFields {
      create(options: TzlaHostedFieldsOptions): TzlaHostedFieldsInstance;
      destroy(): void;
    }
  
    interface TzlaHostedFieldsOptions {
      sandbox: boolean;
      fields: {
        credit_card_number: FieldOptions;
        cvv: FieldOptions;
        expiry: FieldOptions;
      };
    }
  
    interface TzlaHostedFieldsInstance {
      charge(data: ChargeData, callback: (err: any, response: any) => void): void;
    }
  
    interface FieldOptions {
      selector: string;
      placeholder: string;
      tabindex: number;
      version?: string;
    }
  
    interface ChargeData {
      terminal_name: string;
      amount: string;
      contact: string;
    }
  }
    declare global {
    interface Window {
      TzlaHostedFields: any;  // תוכל לשנות את ה-any לסוג מדויק יותר אם יש לך מידע על הפונקציות שלה
    }
  }
  
  // כדי להבטיח ש-TypeScript יטפל בטיפוסים המורחבים, עלינו לייצא את הקובץ הזה
  export {};
  