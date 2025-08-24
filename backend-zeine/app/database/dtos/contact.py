from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class ContactCreateDTO(BaseModel):
    name: str = Field(
        ...,
        min_length=3,
        description="Name must have at least 3 characters"
    )
    email: EmailStr
    telefone: str = Field(
        ...,
        min_length=11,
        description="Telefone must have at least 11 digits"
    )
    foto: Optional[str] = None
    reference: Optional[str] = None

class ContactUpdateDTO(BaseModel):
    name: Optional[str] = Field(None, min_length=3)
    email: Optional[EmailStr] = None
    telefone: Optional[str] = Field(None, min_length=11)
    foto: Optional[str] = None
    reference: Optional[str] = None

    class Config:
        from_attributes = True

class ContactResponseDTO(BaseModel):
    id: int
    name: str
    email: EmailStr
    telefone: str
    foto: Optional[str] = None
    reference: Optional[str] = None

    class Config:
        from_attributes = True