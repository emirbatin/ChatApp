import React from "react";

const AlertPopup = ({ show, message, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed bottom-10 right-10 bg-red-500 text-white p-4 rounded">
      {message}
    </div>
  );
};

export default AlertPopup;
