import React from 'react';

const RecycleForm = ({ onSubmit }) => (
  <form className="recycle-form" onSubmit={onSubmit}>
    <input type="file" accept="image/*" />
    <input type="date" />
    <input type="time" />
    <input type="number" placeholder="Quantity" />
    <input type="text" placeholder="Bin Location" />
    <button type="button" className="qr-scan">Scan QR code</button>
    <button type="submit">Submit</button>
  </form>
);

export default RecycleForm;
