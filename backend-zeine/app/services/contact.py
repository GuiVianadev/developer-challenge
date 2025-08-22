from repository.contact import ContactRepository
from database.dtos.contact import ContactCreateDTO, ContactUpdateDTO
from sqlalchemy.ext.asyncio import async_session

from database.models.contact import Contact


class ContactService:
    def __init__(self, db: async_session):
        self.repo = ContactRepository(db)

    async def list_contacts(self, user_id: int) -> list[Contact]:
        return await self.repo.get_all_by_user(user_id)

    async def list_by_initial(self, user_id: int, initial: str) -> list[Contact]:
        return await self.repo.get_by_initial(user_id, initial)

    async def create_contact(self, contact_dto: ContactCreateDTO, user_id: int) -> Contact:
        contacts = await self.repo.get_all_by_user(user_id)
        if any(c.email == contact_dto.email for c in contacts):
            raise ValueError("Email already exists for this user")

        return await self.repo.create(contact_dto, user_id)

    async def update_contact(self, contact_id: int, updates: ContactUpdateDTO, user_id: int) -> Contact:
        contact = await self.repo.find_by_id(contact_id, user_id)
        if not contact:
            raise ValueError("Contact not found")

        return await self.repo.update(contact, updates)

    async def delete_contact(self, contact_id: int, user_id: int) -> dict:
        contact = await self.repo.find_by_id(contact_id, user_id)
        if not contact:
            raise ValueError("Contact not found")

        await self.repo.delete(contact)
        return {"message": "Contact deleted successfully"}
