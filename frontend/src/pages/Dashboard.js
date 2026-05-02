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
        } catch {
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

    const totalIncome = income.reduce(
        (acc, item) => acc + item.amount,
        0
    );

    return (
        <div>
            <h2>Dashboard</h2>

            <button onClick={() => navigate("/add-income")}>Add Income</button>
            <button onClick={logout}>Logout</button>

            <h3>Total Income: ₹{totalIncome}</h3>

            {income.map((item) => (
                <div key={item._id}>

                    <h4>{item.title}</h4>
                    <p>₹{item.amount}</p>
                    <p>{item.category}</p>

                    <button onClick={() => navigate(`/edit/${item._id}`)}>
                        Edit
                    </button>

                    <button onClick={() => deleteIncome(item._id)}>
                        Delete
                    </button>

                </div>
            ))}
        </div>
    );
}

export default Dashboard;