import React, { FC } from 'react';
import type { PaymentClient } from '../../types';
import { PlusIcon, RefreshIcon, TrashIcon, DotsVerticalIcon } from '../common/Icons';

interface PaymentClientsTableProps {
    clients: PaymentClient[];
}

export const PaymentClientsTable: FC<PaymentClientsTableProps> = ({ clients }) => {
    return (
        <div className="payment-clients-table-container">
            <div className="table-toolbar">
                <button className="btn btn-secondary">
                    <PlusIcon />
                    הקמת לקוח משלם חדש
                </button>
                <div className="actions">
                     <button className="btn btn-secondary"><RefreshIcon /></button>
                     <button className="btn btn-secondary" disabled><TrashIcon /></button>
                     <button className="btn btn-secondary"><DotsVerticalIcon /></button>
                </div>
            </div>
            <div className="table-wrapper">
                <table className="patient-table payment-clients-table">
                    <thead>
                        <tr>
                            <th><input type="checkbox" /></th>
                            <th>מספר משלם-שנה</th>
                            <th>שם מלא (שם המטופל)</th>
                            <th>דרגה</th>
                            <th>תעריף חודש</th>
                            <th>סוג טיפול</th>
                            <th>מצב</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map(client => (
                            <tr key={client.id}>
                                <td><input type="checkbox" /></td>
                                <td>{client.id}</td>
                                <td>{client.fullName}</td>
                                <td>{client.rank}</td>
                                <td>{client.newTariffDate}</td>
                                <td>{client.treatmentType}</td>
                                <td>{client.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <div className="pagination">
                <span className="pagination-info">
                    מציג {clients.length} מתוך {clients.length}
                </span>
                <div className="buttons">
                    <button className="btn btn-secondary" disabled>הקודם</button>
                    <span>עמוד 1 מתוך 1</span>
                    <button className="btn btn-secondary" disabled>הבא</button>
                </div>
            </div>
        </div>
    );
};
