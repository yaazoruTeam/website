import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import React, { useEffect, useState } from "react";
import ItemForm from "./AddItemForm";
import trashIcon from '../../assets/trash-can.svg';
import edited from '../../assets/edited.svg';
import { ItemForMonthlyPayment } from "../../model/src";

const FormToAddItems: React.FC<{ onItemsChange: (items: ItemForMonthlyPayment.Model[]) => void }> = ({ onItemsChange }) => {
  const [items, setItems] = useState<ItemForMonthlyPayment.Model[]>([]);
  const [editingItem, setEditingItem] = useState<ItemForMonthlyPayment.Model | null>(null);

  const addItem = (data: ItemForMonthlyPayment.Model) => {
    console.log(data);
    setItems(prevItems => [...prevItems, data]);
  }

  const deleteItem = (itemToDelete: ItemForMonthlyPayment.Model) => {
    console.log('delete item', itemToDelete);
    setItems(prevItems => prevItems.filter(item => item !== itemToDelete));
  }

  const editItem = (itemToEdit: ItemForMonthlyPayment.Model) => {
    console.log('edit item', itemToEdit);
    setEditingItem(itemToEdit);
  }

  const saveEditedItem = (updatedItem: ItemForMonthlyPayment.Model) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item === editingItem ? updatedItem : item
      )
    );
    setEditingItem(null);
  }

  useEffect(() => {
    onItemsChange(items); 
  }, [items, onItemsChange]);

  useEffect(() => {
    console.log("פריטים מעודכנים:", items);
  }, [items]);

  return <>
    <Box style={{ width: '100%', height: '100%', padding: 28, background: 'white', borderRadius: 6, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end', gap: 28, display: 'inline-flex' }}>
      <TableContainer >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>סה"כ</TableCell>
              <TableCell>מחיר</TableCell>
              <TableCell>כמות</TableCell>
              <TableCell>תיאור</TableCell>
              <TableCell>סוג תשלום</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length > 0 ? (
              items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell><img src={edited} alt="edit" onClick={() => editItem(item)} style={{ cursor: 'pointer' }} /></TableCell>
                  <TableCell><img src={trashIcon} alt="delete" onClick={() => deleteItem(item)} style={{ cursor: 'pointer' }} /></TableCell>
                  <TableCell>{item.total}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.paymentType}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} style={{ textAlign: 'center' }}>אין פריטים להציג</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <ItemForm onSubmit={editingItem ? saveEditedItem : addItem} initialValues={editingItem} />
    </Box>
  </>
};

export default FormToAddItems;
