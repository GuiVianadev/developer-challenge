from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from http import HTTPStatus

from config.database import get_session
from repository.contact import ContactRepository
from services.contact import ContactService
from database.dtos.contact import ContactCreateDTO, ContactUpdateDTO, ContactResponseDTO
from utils.security import get_current_user
from database.models.user import User


router = APIRouter(prefix="/contacts", tags=["Contacts"])

def get_contact_service(db: AsyncSession = Depends(get_session)):
    return ContactService(db)


@router.get("/", response_model=list[ContactResponseDTO])
async def list_contacts(
    service: ContactService = Depends(get_contact_service),
    user: User = Depends(get_current_user)
):
    return await service.list_contacts(user.id)


@router.get("/filter/", response_model=list[ContactResponseDTO])
async def filter_contacts_by_initial(
    initial: str = Query(..., min_length=1, max_length=1, description="First letter of contact name"),
    service: ContactService = Depends(get_contact_service),
    user: User = Depends(get_current_user)
):
    return await service.list_by_initial(user.id, initial)


@router.post("/", response_model=ContactResponseDTO)
async def create_contact(
    contact: ContactCreateDTO,
    service: ContactService = Depends(get_contact_service),
    user: User = Depends(get_current_user)
):
    try:
        return await service.create_contact(contact, user.id)
    except ValueError as e:
        raise HTTPException(status_code=HTTPStatus.CONFLICT, detail=str(e))


@router.patch("/{contact_id}", response_model=ContactResponseDTO)
async def update_contact(
    contact_id: int,
    updates: ContactUpdateDTO,
    service: ContactService = Depends(get_contact_service),
    user: User = Depends(get_current_user)
):
    try:
        return await service.update_contact(contact_id, updates, user.id)
    except ValueError as e:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail=str(e))


@router.delete("/{contact_id}")
async def delete_contact(
    contact_id: int,
    service: ContactService = Depends(get_contact_service),
    user: User = Depends(get_current_user)
):
    try:
        return await service.delete_contact(contact_id, user.id)
    except ValueError as e:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail=str(e))
