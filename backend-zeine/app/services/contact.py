from repository.contact import ContactRepository
from database.dtos.contact import ContactCreateDTO, ContactUpdateDTO
from sqlalchemy.ext.asyncio import AsyncSession
from database.models.contact import Contact
from services.cloudinary_service import CloudinaryService
from fastapi import UploadFile
from typing import Optional
import asyncio
import logging

logger = logging.getLogger(__name__)


class ContactService:
    def __init__(self, db: AsyncSession):
        self.repo = ContactRepository(db)
        self.cloudinary = CloudinaryService()
    
    def get_default_avatar(self) -> str:
        return None
    
    async def list_contacts(self, user_id: int) -> list[Contact]:
        return await self.repo.get_all_by_user(user_id)
    
    async def list_by_initial(self, user_id: int, initial: str) -> list[Contact]:
        return await self.repo.get_by_initial(user_id, initial)
    
    async def _validate_unique_email(self, email: str, user_id: int, exclude_contact_id: Optional[int] = None):
        contacts = await self.repo.get_all_by_user(user_id)
        for contact in contacts:
            if contact.email == email and contact.id != exclude_contact_id:
                raise ValueError("Email already exists for this user")
    
    async def _handle_image_upload(self, foto: Optional[UploadFile]) -> Optional[str]:
    
        if not foto or not foto.filename or foto.size == 0:
            return None
        
        try:
    
            if foto.size > 5 * 1024 * 1024: 
                raise ValueError("Image size must be less than 5MB")
            
            foto_url = await asyncio.wait_for(
                self.cloudinary.upload_image(foto), 
                timeout=45.0  
            )
            
            logger.info(f"Image uploaded successfully: {foto_url}")
            return foto_url
            
        except asyncio.TimeoutError:
            logger.error("Image upload timeout after 45 seconds")
            raise ValueError("Image upload timeout - please try with a smaller image")
        except ValueError as e:
            logger.error(f"Image upload validation error: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Unexpected image upload error: {str(e)}")
            raise ValueError(f"Failed to upload image: {str(e)}")
    
    async def _cleanup_old_image(self, old_image_url: Optional[str]):
        """Remove imagem antiga do Cloudinary"""
        if not old_image_url or "cloudinary.com" not in old_image_url:
            return
        
        try:
            public_id = self.cloudinary.get_public_id_from_url(old_image_url)
            if public_id:
                asyncio.create_task(self._delete_image_background(public_id))
        except Exception as e:
            logger.warning(f"Failed to cleanup old image {old_image_url}: {str(e)}")
    
    async def _delete_image_background(self, public_id: str):
        """Deleta imagem em background"""
        try:
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(None, self.cloudinary.delete_image, public_id)
            logger.info(f"Successfully deleted image: {public_id}")
        except Exception as e:
            logger.warning(f"Background image deletion failed for {public_id}: {str(e)}")
    
    # ✅ MANTIDA: Esta é a função que seu endpoint chama.
    async def create_contact(
        self,
        name: str,
        email: str,
        telefone: str,
        reference: Optional[str],
        foto: Optional[UploadFile],
        user_id: int
    ) -> Contact:
        await self._validate_unique_email(email, user_id)
        
        foto_url = await self._handle_image_upload(foto)
        
        try:
            contact_dto = ContactCreateDTO(
                name=name,
                email=email,
                telefone=telefone,
                foto=foto_url,
                reference=reference
            )
            
            contact = await self.repo.create(contact_dto, user_id)
            logger.info(f"Contact created successfully: {contact.id}")
            return contact
            
        except Exception as e:
            if foto_url:
                await self._cleanup_old_image(foto_url)
            raise
    async def _create_from_dto(self, contact_dto: ContactCreateDTO, user_id: int) -> Contact:
        await self._validate_unique_email(contact_dto.email, user_id)
        
        if not contact_dto.foto:
            contact_dto.foto = None
        
        return await self.repo.create(contact_dto, user_id)
    
    async def update_contact(self, contact_id: int, updates: ContactUpdateDTO, user_id: int) -> Contact:
        contact = await self.repo.find_by_id(contact_id, user_id)
        if not contact:
            raise ValueError("Contact not found")
        
        if updates.email and updates.email != contact.email:
            await self._validate_unique_email(updates.email, user_id, contact_id)
        
        return await self.repo.update(contact, updates)
    
    async def update_contact_with_upload(
        self,
        contact_id: int,
        name: Optional[str],
        email: Optional[str],
        telefone: Optional[str],
        reference: Optional[str],
        foto: Optional[UploadFile],
        user_id: int
    ) -> Contact:
        contact = await self.repo.find_by_id(contact_id, user_id)
        if not contact:
            raise ValueError("Contact not found")
        
    
        if email and email != contact.email:
            await self._validate_unique_email(email, user_id, contact_id)
        
        foto_url = contact.foto
        old_foto_url = contact.foto
        
    
        if foto and foto.filename and foto.size > 0:
            foto_url = await self._handle_image_upload(foto)
        
        try:
            updates = ContactUpdateDTO(
                name=name,
                email=email,
                telefone=telefone,
                foto=foto_url,
                reference=reference
            )
            
            updated_contact = await self.repo.update(contact, updates)
            
            if foto_url != old_foto_url and old_foto_url:
                await self._cleanup_old_image(old_foto_url)
            
            logger.info(f"Contact updated successfully: {contact_id}")
            return updated_contact
            
        except Exception as e:
            if foto_url != old_foto_url and foto_url:
                await self._cleanup_old_image(foto_url)
            raise
    
    async def delete_contact(self, contact_id: int, user_id: int) -> dict:
        contact = await self.repo.find_by_id(contact_id, user_id)
        if not contact:
            raise ValueError("Contact not found")
        
        await self.repo.delete(contact)
        
        if contact.foto:
            await self._cleanup_old_image(contact.foto)
        
        logger.info(f"Contact deleted successfully: {contact_id}")
        return {"message": "Contact deleted successfully"}