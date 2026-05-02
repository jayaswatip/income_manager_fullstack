import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function AddIncome() {

    const [form, setForm] = useState({
        title: "",
        amount: "",
        category: "",
        date: ""
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await API.post("/income/add", form);
        navigate("/dashboard");
    };

    return (
        <div>
            <h2>Add Income</h2>

            <form onSubmit={handleSubmit}>
                <input name="title" placeholder="Title" onChange={handleChange} />
                <input name="amount" placeholder="Amount" onChange={handleChange} />
                <input name="category" placeholder="Category" onChange={handleChange} />
                <input name="date" type="date" onChange={handleChange} />

                <button type="submit">Add</button>
            </form>
        </div>
    );
}

export default AddIncome;