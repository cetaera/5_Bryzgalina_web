import React, { useEffect, useState } from "react";

export default function App() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    fetch("/products")
      .then(res => res.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (name.length < 2 || name.length > 100) {
      alert("Название должно содержать от 2 до 100 символов");
      return;
    }
    if (isNaN(price) || Number(price) < 0) {
      alert("Цена должна быть числом, больше или равна 0");
      return;
    }

    const newProduct = { name, price: Number(price) };

    try {
      const res = await fetch("/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Ошибка при добавлении продукта");
      }

      const createdProduct = await res.json();
      setProducts([...products, createdProduct]);
      setName("");
      setPrice("");
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Удалить этот продукт?")) return;

    try {
      const res = await fetch(`/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Ошибка при удалении продукта");

      // Обновляем список продуктов, исключая удалённый
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  return (
  <div
    style={{
      maxWidth: 500,
      margin: "2rem auto",
      fontFamily: "Arial, sans-serif",
      display: "flex",
      flexDirection: "column",
      height: "80vh",    
      border: "1px solid #ddd",
      borderRadius: 8,
      padding: "1rem",
    }}
  >
    <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>Каталог продуктов</h1>

    {/* Форма сверху */}
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1rem" }}
    >
      <input
        type="text"
        placeholder="Название продукта"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        minLength={2}
        maxLength={100}
        style={{ padding: "0.5rem", fontSize: "1rem" }}
      />
      <input
        type="number"
        step="0.01"
        placeholder="Цена"
        value={price}
        onChange={e => setPrice(e.target.value)}
        required
        min="0"
        style={{ padding: "0.5rem", fontSize: "1rem" }}
      />
      <button type="submit" style={{ padding: "0.75rem", fontSize: "1rem", cursor: "pointer" }}>
        Добавить продукт
      </button>
    </form>

    <div
      style={{
        flexGrow: 1,         
        overflowY: "auto",   
        borderTop: "1px solid #ccc",
        paddingTop: "1rem",
      }}
    >
      <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
        {products.map(p => (
          <li
            key={p.id}
            style={{
              padding: "0.5rem 0",
              borderBottom: "1px solid #ddd",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>
              <strong>{p.name}</strong> — {p.price.toFixed(2)} ₽
            </span>
            <button
              onClick={() => handleDelete(p.id)}
              style={{
                backgroundColor: "#e74c3c",
                color: "white",
                border: "none",
                padding: "0.25rem 0.5rem",
                cursor: "pointer",
                borderRadius: 4,
              }}
              aria-label={`Удалить продукт ${p.name}`}
            >
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
}