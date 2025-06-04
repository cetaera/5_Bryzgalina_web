from sqlalchemy import Column, Integer, String, Float
from pydantic import BaseModel, Field, ConfigDict
from .database import Base

# SQLAlchemy модель
class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    price = Column(Float)

# Pydantic схемы
class ProductCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    price: float = Field(..., ge=0, description="Цена должна быть больше или равна 0")

class ProductRead(BaseModel):
    id: int
    name: str
    price: float

    model_config = ConfigDict(from_attributes=True)
