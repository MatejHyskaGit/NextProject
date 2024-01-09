"use client";
import { classNames } from 'primereact/utils';
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { ProgressSpinner } from 'primereact/progressspinner';
import Navbar from './components/Navbar';
import Contact from './models/Contact';

export default function Home() {
  let emptyContact: Contact = {
    id: null,
    name: '',
    number: '',
    createdAt: null,
    updatedAt: null
  };

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactDialog, setContactDialog] = useState<boolean>(false);
  const [deleteContactDialog, setDeleteContactDialog] = useState<boolean>(false);
  const [contact, setContact] = useState<Contact>(emptyContact);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const dt = useRef<DataTable<Contact[]>>(null);
  const toast = useRef<Toast>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/contacts')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setContacts(data)
        setLoading(false);
        if (data.message) {
          toast.current?.show({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
        }
      });
  }, []);

  const confirmDeleteContact = (contact: Contact) => {
    setContact(contact);
    setDeleteContactDialog(true);
  };

  const deleteContact = () => {
    setLoading(true)
    var status = 200
    fetch(`/api/contacts`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id: contact.id})
    })
      .then((response) => {
        status = response.status
        return response.json()
      })
      .then((deletedContact) => {
        setContacts(contacts.filter((contact) => contact.id !== deletedContact.id));
        fetch('/api/contacts')
          .then((response) => {
            status = response.status
            return response.json()
          })
          .then((data) => {
            setContacts(data)
            setLoading(false);
            if (data.message) {
              toast.current?.show({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
            }
          });
        hideDeleteContactDialog()
        if (status != 200) {
          toast.current?.show({ severity: 'error', summary: 'Error', detail: deletedContact.message, life: 3000 });
        }
        else {
          toast.current?.show({ severity: 'success', summary: 'Successful', detail: deletedContact.message, life: 3000 });
        }
      });
  };

  const hideDeleteContactDialog = () => {
    setDeleteContactDialog(false);
  };

  
  const actionBodyTemplate = (rowData: Contact) => {
    return (
        <React.Fragment>
            <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteContact(rowData)} />
        </React.Fragment>
    );
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    const val = (e.target && e.target.value) || '';
    let _contact = { ...contact };

    // @ts-ignore
    _contact[`${name}`] = val;

    setContact(_contact);
  };

  const deleteContactDialogFooter = (
    <React.Fragment>
        <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteContactDialog} />
        <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteContact} />
    </React.Fragment>
  );

  const openNew = () => {
    setContact(emptyContact);
    setSubmitted(false);
    setContactDialog(true);
  };

  const saveContact = () => {
    setSubmitted(true);
    setLoading(true)

    fetch('/api/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: contact.name, number: contact.number }),
    })
      .then((response) => response.json())
      .then((createdContact) => {
        setContacts([...contacts, createdContact]);
        setContact({ id: '', name: '', number: '', createdAt: null, updatedAt: null });
        fetch('/api/contacts')
          .then((response) => response.json())
          .then((data) => {
            setContacts(data)
            setLoading(false);
            if (data.message) {
              toast.current?.show({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
            }
          });
        hideDialog()
        if (createdContact.id) {
          toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Device Created: ' + createdContact.id, life: 3000 });
        }
        else {
          toast.current?.show({ severity: 'error', summary: 'Error', detail: createdContact.message, life: 3000 });
        }
      });
  };

  const hideDialog = () => {
    setSubmitted(false);
    setContactDialog(false);
  };

  const leftToolbarTemplate = () => {
    return (
        <div className="flex flex-wrap gap-2">
            <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
        </div>
    );
  };

  const contactDialogFooter = (
    <React.Fragment>
        <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
        <Button label="Save" icon="pi pi-check" onClick={saveContact} />
    </React.Fragment>
  );

  return (
    <>
      <Navbar />
      <div className="m-3">
        <div className="row">
          <div className="flex-auto w-full">
            <h1>Contacts</h1>
            <Toast ref={toast} />
            <div className="card">
              {loading ? (
                <div className="flex justify-content-center flex-wrap">
                  <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                </div>
              ) : (
                <div>
                  <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
                  <DataTable ref={dt} value={contacts}
                          // dataKey="id"  paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
                          // paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} devices">
                      <Column field="name" header="Name" sortable></Column>
                      <Column field="number" header="Number" sortable></Column>
                      <Column field="createdAt" header="Created" sortable></Column>
                      <Column body={actionBodyTemplate} exportable={false}></Column>
                  </DataTable>
                </div>
              )}
            </div>
            <Dialog visible={contactDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Contact Details" modal className="p-fluid" footer={contactDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Name
                    </label>
                    <InputText id="name" value={contact.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !contact.name })} />
                    {submitted && !contact.name && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="number" className="font-bold">
                        Number
                    </label>
                    <InputText id="number" value={contact.number} onChange={(e) => onInputChange(e, 'number')} required className={classNames({ 'p-invalid': submitted && !contact.number })} />
                    {submitted && !contact.number && <small className="p-error">Number is required.</small>}
                </div>
            </Dialog>
            <Dialog visible={deleteContactDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteContactDialogFooter} onHide={hideDeleteContactDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {contact && (
                        <span>
                            Are you sure you want to delete <b>{contact.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
          </div>
        </div>
      </div>
    </>
  )
}