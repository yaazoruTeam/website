import React, { useState } from "react";
import ChangeAccountModal from "./ChangeAccountModal";

const Switchboard: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>פתח פופ-אפ</button>
      <ChangeAccountModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default Switchboard;