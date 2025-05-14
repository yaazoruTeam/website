import React, { useState } from "react";
import ChangeAccountModal from "./ChangeAccountModal";
import ReturnButton from "../designComponent/ReturnButton";

const Switchboard: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>פתח פופ-אפ</button>
      <ChangeAccountModal open={open} onClose={() => setOpen(false)} />
      <ReturnButton />
    </>
  );
};

export default Switchboard;
