from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pydantic import BaseModel, Field

# --- Настройка базы данных ---
DATABASE_URL = "sqlite:///./products.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# --- Модель SQLAlchemy ---
class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    price = Column(Float)

# --- Создание таблицы ---
Base.metadata.create_all(bind=engine)

# --- Pydantic-схемы ---
class ProductCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    price: float = Field(..., ge=0, description="Цена должна быть больше или равна 0")

class ProductRead(BaseModel):
    id: int
    name: str
    price: float

    class Config:
        orm_mode = True

# --- Инициализация FastAPI ---
app = FastAPI(title="Product API")

# --- Эндпоинт: Получить все продукты ---
@app.get("/products", response_model=List[ProductRead])
def get_products():
    db = SessionLocal()
    products = db.query(Product).all()
    db.close()
    return products

# --- Эндпоинт: Добавить новый продукт ---
@app.post("/products", response_model=ProductRead)
def create_product(product: ProductCreate):
    db = SessionLocal()
    db_product = Product(name=product.name, price=product.price)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    db.close()
    return db_product
