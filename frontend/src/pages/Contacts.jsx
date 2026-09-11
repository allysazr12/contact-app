import { useEffect, useState } from "react";
import "./Contacts.css";

function Contacts() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });

    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/contacts", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch contacts");
            }

            const data = await response.json();
            setContacts(data);
        } catch (error) {
            console.error("Error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/api/contacts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || "Failed to create contact");
            }

            const newContact = await response.json();

            setContacts((prev) => [...prev, newContact]);

            setForm({
                name: "",
                email: "",
                phone: "",
                subject: "",
                message: "",
            });

            alert("Contact created successfully!");
        } catch (error) {
            console.error("Create contact error:", error);
            alert("Failed to create contact");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                `http://localhost:8080/api/contacts/${editingId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(form),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update contact");
            }

            const updatedContact = await response.json();

            setContacts((prev) =>
                prev.map((contact) =>
                    contact.id === editingId ? updatedContact : contact
                )
            );

            setEditingId(null);

            setForm({
                name: "",
                email: "",
                phone: "",
                subject: "",
                message: "",
            });

            alert("Contact updated successfully!");
        } catch (error) {
            console.error("Update contact error:", error);
            alert("Failed to update contact");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this contact?")) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8080/api/contacts/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete contact");
            }

            setContacts((prev) =>
                prev.filter((contact) => contact.id !== id)
            );

            alert("Contact deleted successfully!");
        } catch (error) {
            console.error("Delete contact error:", error);
            alert("Failed to delete contact");
        }
    };

    const handleEdit = (contact) => {
        setEditingId(contact.id);

        setForm({
            name: contact.name,
            email: contact.email,
            phone: contact.phone || "",
            subject: contact.subject || "",
            message: contact.message,
        });
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");

        window.location.href = "/";
    }

    return (
        <div className="contacts-page">
            <div className="contacts-container">

                <div className="contacts-header">
                    <div>
                        <h1>Contact App</h1>
                        <p>Welcome, {username}!</p>
                    </div>

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>

                <div className="contact-card">
                    <h2>
                        {editingId ? "Edit Contact" : "Add Contact"}
                    </h2>

                    <form
                        className="contact-form"
                        onSubmit={editingId ? handleUpdate : handleSubmit}
                    >
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={form.subject}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Message</label>
                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="primary-button"
                            >
                                {editingId
                                    ? "Update Contact"
                                    : "Add Contact"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={() => {
                                        setEditingId(null);
                                        setForm({
                                            name: "",
                                            email: "",
                                            phone: "",
                                            subject: "",
                                            message: "",
                                        });
                                    }}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="contact-card">
                    <h2>Contacts ({contacts.length})</h2>

                    {loading && <p>Loading contacts...</p>}

                    {error && <p>{error}</p>}

                    {!loading &&
                        !error &&
                        contacts.length === 0 && (
                            <div className="empty-state">
                                No contacts found.
                            </div>
                        )}

                    {!loading && contacts.length > 0 && (
                        <div className="contacts-list">
                            {contacts.map((contact) => (
                                <div
                                    className="contact-item"
                                    key={contact.id}
                                >
                                    <h3>{contact.name}</h3>

                                    <div className="contact-info">
                                        <div>
                                            <strong>Email:</strong>{" "}
                                            {contact.email}
                                        </div>

                                        <div>
                                            <strong>Phone:</strong>{" "}
                                            {contact.phone || "-"}
                                        </div>

                                        <div>
                                            <strong>Subject:</strong>{" "}
                                            {contact.subject || "-"}
                                        </div>

                                        <div className="contact-message">
                                            <strong>Message:</strong>
                                            <br />
                                            {contact.message}
                                        </div>
                                    </div>

                                    <div className="contact-actions">
                                        <button
                                            className="edit-button"
                                            onClick={() =>
                                                handleEdit(contact)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="delete-button"
                                            onClick={() =>
                                                handleDelete(contact.id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default Contacts;