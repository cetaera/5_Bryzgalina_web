from fastapi import FastAPI, HTTPException
from typing import List
from sqlalchemy.orm import Session
from . import models, database

# Создание таблицы
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Product API")

# Зависимость — сессия БД
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Получить все продукты
@app.get("/products", response_model=List[models.ProductRead])
def get_products():
    db = database.SessionLocal()
    products = db.query(models.Product).all()
    db.close()
    return products

# Добавить новый продукт
@app.post("/products", response_model=models.ProductRead)
def create_product(product: models.ProductCreate):
    db = database.SessionLocal()
    db_product = models.Product(name=product.name, price=product.price)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    db.close()
    return db_product

from fastapi import Path

@app.delete("/products/{product_id}", status_code=204)
def delete_product(product_id: int = Path(..., gt=0)):
    db = database.SessionLocal()
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        db.close()
        raise HTTPException(status_code=404, detail="Продукт не найден")
    db.delete(product)
    db.commit()
    db.close()
    return
