# Switchboard Types - README

## Overview

This document explains the temporary type definitions created for the switchboard components while the server-side models are still in development.

## Files Created

### `/lib/model/src/Switchboard.ts`
Contains all the temporary type definitions for switchboard functionality.

## Type Definitions

### Core Interfaces

#### `SwitchboardAccount`
```typescript
interface SwitchboardAccount {
  ID: number
  customerName: string
  email: string
  notes: string
  balanceForUse: number
}
```
Used for: Main switchboard accounts listing

#### `SwitchboardCall`
```typescript
interface SwitchboardCall {
  organizationName: string
  number: string
  country: string
  target: string
  fromDate: Date
  definedAsAnIdentifier: boolean
  monthlyCost: number
  outgoingCalls: boolean
}
```
Used for: Individual calls within a switchboard account

#### `CallLogEntry`
```typescript
interface CallLogEntry {
  country: string
  target: string
  date: number
  durationCall: string
  timeCall: string
  costInShekels: string
  penniesPerMinute: string
}
```
Used for: Call log entries for detailed call history

#### `NumberPlan`
```typescript
interface NumberPlan {
  number: string
  price: string
}
```
Used for: Available phone number plans for purchase

#### `EditNumberFormData`
```typescript
interface EditNumberFormData {
  target: string
  notes: string
  notifyEmailOfAllCalls: string
  toReceiveSMSToEmail: string
}
```
Used for: Edit number configuration form

#### `PurchasingNumberFormData`
```typescript
interface PurchasingNumberFormData {
  personalID: string
  target: string
  notes: string
  SMSToEmail: string
  notifyEmailCalls: string
}
```
Used for: Purchasing new number form

### Function Type Definitions

#### `SwitchEventHandler`
```typescript
interface SwitchEventHandler {
  (checked: boolean): void
}
```
Used for: Switch component event handlers

#### `CallActionHandler`
```typescript
interface CallActionHandler {
  (call: SwitchboardCall): void
}
```
Used for: Actions performed on call entries

#### `RowActionHandler`
```typescript
interface RowActionHandler {
  (row: SwitchboardAccount): void
}
```
Used for: Actions performed on switchboard account rows

## Usage

Import the types in your components:

```typescript
import { Switchboard } from '../../../../model/src'

//to do: טיפוס זמני לשנות לטיפוס הנכון
type SwitchboardCall = Switchboard.SwitchboardCall
//to do: טיפוס זמני לשנות לטיפוס הנכון
type SwitchEventHandler = Switchboard.SwitchEventHandler
```

## Migration Strategy

When the server-side models become available:

1. **Replace type definitions**: Update `/lib/model/src/Switchboard.ts` with the actual server models
2. **Verify field mappings**: Ensure all field names match between frontend and backend
3. **Update interfaces**: Modify any interfaces that have changed in the final API
4. **Test integration**: Verify that all components work with the new types

## Benefits of This Approach

1. **ESLint Compliance**: Eliminates all `any` type usage and related lint errors
2. **Type Safety**: Provides compile-time type checking even with temporary data
3. **Code Documentation**: Makes the expected data structure clear to developers
4. **Easy Migration**: When server models are ready, only the type definitions need to be updated
5. **IntelliSense Support**: Provides better IDE support and autocomplete functionality

## Files Updated

The following components have been updated to use these types:

- `CallCenter.tsx` - Main call center interface
- `CallLog.tsx` - Call log display
- `Switchboard.tsx` - Main switchboard listing
- `EditNumberForm.tsx` - Edit number configuration
- `PurchasingNewNumber.tsx` - Purchase new numbers modal

## Note

These are temporary types based on the current frontend implementation. They should be replaced with the actual server-side models once available.

**Important**: All type aliases are marked with `//to do: טיפוס זמני לשנות לטיפוס הנכון` comments to remind developers that these are temporary types that need to be replaced when the server models become available.
