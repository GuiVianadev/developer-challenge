from http import HTTPStatus

from config.database import get_session
from database.dtos.user import UserCreateDTO, UserResponseDTO
from fastapi import APIRouter, Depends, HTTPException
from services.user import UserService
from sqlalchemy.ext.asyncio import AsyncSession


router = APIRouter(prefix="/users", tags=["Users"])

def get_user_service(db: AsyncSession = Depends(get_session)):
    return UserService(db)


@router.post("/", response_model=UserResponseDTO)
async def create_user(
    user: UserCreateDTO, 
    service: UserService = Depends(get_user_service)
    ):
    try:
        return await service.create_user(user)
    except ValueError as e:
        raise HTTPException(
            status_code=HTTPStatus.CONFLICT,
            detail=str(e)
        )


@router.get("/", response_model=list[UserResponseDTO])
async def list_user(
    service: UserService = Depends(get_user_service)
    ):
    return await service.get_users()
