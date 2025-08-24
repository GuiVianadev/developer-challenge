from fastapi import APIRouter, Depends, HTTPException, Query, Form, File, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from http import HTTPStatus
from typing import Optional
import logging

from config.database import get_session
from services.contact import ContactService
from database.dtos.contact import ContactResponseDTO
from utils.security import get_current_user
from database.models.user import User

router = APIRouter(prefix="/contacts", tags=["Contacts"])
logger = logging.getLogger(__name__)


def get_contact_service(db: AsyncSession = Depends(get_session)):
    return ContactService(db)


@router.get("/", response_model=list[ContactResponseDTO])
async def list_contacts(
    service: ContactService = Depends(get_contact_service),
    user: User = Depends(get_current_user)
):
    try:
        contacts = await service.list_contacts(user.id)
        logger.info(f"Listed {len(contacts)} contacts for user {user.id}")
        return contacts
    except Exception as e:
        logger.error(f"Error listing contacts for user {user.id}: {str(e)}")
        raise HTTPException(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            detail="Failed to list contacts"
        )


@router.get("/filter/", response_model=list[ContactResponseDTO])
async def filter_contacts_by_initial(
    initial: str = Query(..., min_length=1, max_length=1, description="First letter of contact name"),
    service: ContactService = Depends(get_contact_service),
    user: User = Depends(get_current_user)
):
    try:
        contacts = await service.list_by_initial(user.id, initial.upper())
        logger.info(f"Filtered {len(contacts)} contacts by initial '{initial}' for user {user.id}")
        return contacts
    except Exception as e:
        logger.error(f"Error filtering contacts by initial '{initial}' for user {user.id}: {str(e)}")
        raise HTTPException(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            detail="Failed to filter contacts"
        )


@router.post("/", response_model=ContactResponseDTO)
async def create_contact(
    name: str = Form(..., min_length=1, max_length=100),
    email: str = Form(..., regex=r'^[^@]+@[^@]+\.[^@]+$'),
    telefone: str = Form(..., min_length=10, max_length=15),
    reference: Optional[str] = Form(None, max_length=200),
    foto: Optional[UploadFile] = File(None),
    service: ContactService = Depends(get_contact_service),
    user: User = Depends(get_current_user)
):
    
    if foto and foto.size == 0:
        foto = None
    
    if foto and not foto.content_type.startswith("image/"):
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail="File must be an image"
        )
    
    try:
        logger.info(f"Creating contact '{name}' for user {user.id}")
        
        contact = await service.create_contact(
            name=name.strip(),
            email=email.strip().lower(),
            telefone=telefone.strip(),
            reference=reference.strip() if reference else None,
            foto=foto,
            user_id=user.id
        )
        
        logger.info(f"Contact created successfully: {contact.id}")
        return contact
        
    except ValueError as e:
        logger.warning(f"Validation error creating contact for user {user.id}: {str(e)}")
        raise HTTPException(status_code=HTTPStatus.BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error creating contact for user {user.id}: {str(e)}")
        raise HTTPException(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            detail="Failed to create contact"
        )


@router.patch("/{contact_id}", response_model=ContactResponseDTO)
async def update_contact(
    contact_id: int,
    name: Optional[str] = Form(None, min_length=1, max_length=100),
    email: Optional[str] = Form(None, regex=r'^[^@]+@[^@]+\.[^@]+$'),
    telefone: Optional[str] = Form(None, min_length=10, max_length=15),
    reference: Optional[str] = Form(None, max_length=200),
    foto: Optional[UploadFile] = File(None),
    service: ContactService = Depends(get_contact_service),
    user: User = Depends(get_current_user)
): 
    if not any([name, email, telefone, reference, foto]):
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail="At least one field must be provided for update"
        )
    
    if foto and foto.size == 0:
        foto = None
    
    if foto and not foto.content_type.startswith("image/"):
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail="File must be an image"
        )
    
    try:
        logger.info(f"Updating contact {contact_id} for user {user.id}")
        
        contact = await service.update_contact_with_upload(
            contact_id=contact_id,
            name=name.strip() if name else None,
            email=email.strip().lower() if email else None,
            telefone=telefone.strip() if telefone else None,
            reference=reference.strip() if reference else None,
            foto=foto,
            user_id=user.id
        )
        
        logger.info(f"Contact {contact_id} updated successfully")
        return contact
        
    except ValueError as e:
        logger.warning(f"Error updating contact {contact_id} for user {user.id}: {str(e)}")
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error updating contact {contact_id} for user {user.id}: {str(e)}")
        raise HTTPException(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            detail="Failed to update contact"
        )


@router.delete("/{contact_id}")
async def delete_contact(
    contact_id: int,
    service: ContactService = Depends(get_contact_service),
    user: User = Depends(get_current_user)
):
    try:
        logger.info(f"Deleting contact {contact_id} for user {user.id}")
        
        result = await service.delete_contact(contact_id, user.id)
        
        logger.info(f"Contact {contact_id} deleted successfully")
        return result
        
    except ValueError as e:
        logger.warning(f"Error deleting contact {contact_id} for user {user.id}: {str(e)}")
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error deleting contact {contact_id} for user {user.id}: {str(e)}")
        raise HTTPException(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            detail="Failed to delete contact"
        )