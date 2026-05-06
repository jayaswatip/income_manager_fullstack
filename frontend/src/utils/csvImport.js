export const parseCSV = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const text = e.target.result;
            const lines = text.split('\n').filter(line => line.trim());
            
            if (lines.length < 2) {
                reject(new Error("CSV file is empty or invalid"));
                return;
            }
            
            // Parse headers
            const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
            
            // Expected headers: type, title, amount, category, date
            const requiredHeaders = ['type', 'title', 'amount', 'category', 'date'];
            const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
            
            if (missingHeaders.length > 0) {
                reject(new Error(`Missing required headers: ${missingHeaders.join(', ')}`));
                return;
            }
            
            // Parse data rows
            const data = [];
            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',').map(v => v.trim());
                
                if (values.length !== headers.length) continue;
                
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index];
                });
                
                // Validate type
                if (!['income', 'expense'].includes(row.type?.toLowerCase())) {
                    console.warn(`Skipping row ${i}: invalid type "${row.type}"`);
                    return;
                }
                
                // Validate amount
                const amount = parseFloat(row.amount);
                if (isNaN(amount) || amount <= 0) {
                    console.warn(`Skipping row ${i}: invalid amount "${row.amount}"`);
                    return;
                }
                
                // Validate date
                const date = new Date(row.date);
                if (isNaN(date.getTime())) {
                    console.warn(`Skipping row ${i}: invalid date "${row.date}"`);
                    return;
                }
                
                data.push({
                    type: row.type.toLowerCase(),
                    title: row.title,
                    amount: amount,
                    category: row.category,
                    date: date.toISOString().split('T')[0]
                });
            }
            
            resolve(data);
        };
        
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsText(file);
    });
};

export const generateCSVTemplate = () => {
    const headers = ["type", "title", "amount", "category", "date"];
    const sampleRows = [
        ["income", "Monthly Salary", "50000", "Salary", "2024-01-15"],
        ["expense", "Grocery Shopping", "3500", "Food", "2024-01-10"],
        ["expense", "Electric Bill", "1200", "Utilities", "2024-01-05"],
        ["income", "Freelance Project", "15000", "Freelance", "2024-01-20"]
    ];
    
    const csvContent = [
        headers.join(","),
        ...sampleRows.map(row => row.join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "import_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
};
