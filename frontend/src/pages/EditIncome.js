import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

function EditIncome() {
    const [form, setForm] = useState({
        title: "",
        amount: "",
        category: "",
        date: ""
    });

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchIncome = async () => {
            try {
                const res = await API.get(`/income/get`);
                const income = res.data.find(item => item._id === id);
                if (income) {
                    setForm({
                        title: income.title,
                        amount: income.amount,
                        category: income.category,
                        date: income.date.split('T')[0]
                    });
                }
            } catch (error) {
                alert("Failed to load income data");
            }
        };
        fetchIncome();
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await API.put(`/income/update/${id}`, form);
            navigate("/dashboard");
        } catch (error) {
            alert("Failed to update income");
        }
    };

    return (
        <div>
            <h2>Edit Income</h2>

            <form onSubmit={handleSubmit}>
                <input
                    name="title"
                    placeholder="Title"
                    value={form.title}
                    onChange={handleChange}
                />
                <input
                    name="amount"
                    placeholder="Amount"
                    value={form.amount}
                    onChange={handleChange}
                />
                <input
                    name="category"
                    placeholder="Category"
                    value={form.category}
                    onChange={handleChange}
                />
                <input
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                />

                <button type="submit">Update</button>
                <button type="button" onClick={() => navigate("/dashboard")}>
                    Cancel
                </button>
            </form>
        </div>
    );
}

export default EditIncome;
