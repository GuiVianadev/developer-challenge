from config.database import get_session
from fastapi import APIRouter, Depends, HTTPException
from http import HTTPStatus
from sqlalchemy.ext.asyncio import AsyncSession

from database.dtos.user import UserCreateDTO, UserResponseDTO
from services.user import UserService

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/", response_model=UserResponseDTO)
async def create_user(user: UserCreateDTO, db: AsyncSession = Depends(get_session)):
    try:
        service = UserService(db)
        return await service.create_user(user)
    except ValueError as e:
        raise HTTPException(
            status_code=HTTPStatus.CONFLICT,
            detail=str(e)
        )


@router.get("/", response_model=list[UserResponseDTO])
async def list_user(db: AsyncSession = Depends(get_session)):
    service = UserService(db)
    return await service.get_users()
