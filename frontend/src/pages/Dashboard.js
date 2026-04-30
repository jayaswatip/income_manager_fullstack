import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {

    const [income, setIncome] = useState([]);
    const navigate = useNavigate();

    const fetchIncome = async () => {
        try {
            const res = await API.get("/income/get");
            setIncome(res.data);
        } catch (error) {
            alert("Please login again");
            navigate("/");
        }
    };

    const deleteIncome = async (id) => {
        await API.delete(`/income/delete/${id}`);
        fetchIncome();
    };

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    useEffect(() => {
        fetchIncome();
    }, []);

    return (
        <div>
            <h2>Dashboard</h2>

            <button onClick={() => navigate("/add-income")}>
                Add Income
            </button>

            <button onClick={logout}>
                Logout
            </button>

            {income.length === 0 && <p>No income found</p>}

            {income.map((item) => (
                <div key={item._id}>

                    <h4>{item.title}</h4>
                    <p>₹{item.amount}</p>
                    <p>{item.category}</p>

                    <button onClick={() => deleteIncome(item._id)}>
                        Delete
                    </button>

                </div>
            ))}
        </div>
    );
}

export default Dashboard;