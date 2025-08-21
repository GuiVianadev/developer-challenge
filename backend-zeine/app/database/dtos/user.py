from pydantic import BaseModel, EmailStr, Field



class UserCreateDTO(BaseModel):
    name: str = Field(..., min_length=3, description="Name must have at least 2 characters")
    email: EmailStr
    password: str = Field(..., min_length=8, description="Password must have at least 8 characters")
    
class UserResponseDTO(BaseModel):
    id: int
    name: str
    email: EmailStr


class LoginDTO(BaseModel):
    email: EmailStr
    password: str
