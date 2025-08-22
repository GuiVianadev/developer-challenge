from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database.models.contact import Contact
from database.dtos.contact import ContactCreateDTO, ContactUpdateDTO


class ContactRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all_by_user(self, user_id: int) -> list[Contact]:
        result = await self.db.execute(
            select(Contact).where(Contact.user_id == user_id)
        )
        return result.scalars().all()

    async def get_by_initial(self, user_id: int, initial: str) -> list[Contact]:
        result = await self.db.execute(
            select(Contact)
            .where(Contact.user_id == user_id)
            .where(Contact.name.ilike(f"{initial}%"))
        )
        return result.scalars().all()
    
    async def find_by_id(self, contact_id: int, user_id: int) -> Contact | None:
        result = await self.db.execute(
            select(Contact)
            .where(Contact.id == contact_id)
            .where(Contact.user_id == user_id)
        )
        return result.scalar_one_or_none()

    async def create(self, contact_dto: ContactCreateDTO, user_id: int) -> Contact:
        contact = Contact(
            name=contact_dto.name,
            email=contact_dto.email,
            telefone=contact_dto.telefone,
            foto=contact_dto.foto,
            reference=contact_dto.reference,
            user_id=user_id
        )
        self.db.add(contact)
        await self.db.commit()
        await self.db.refresh(contact)
        return contact

    async def update(self, contact: Contact, updates: ContactUpdateDTO) -> Contact:
        for key, value in updates.model_dump(exclude_unset=True).items():
            setattr(contact, key, value)
        self.db.add(contact)
        await self.db.commit()
        await self.db.refresh(contact)
        return contact

    async def delete(self, contact: Contact) -> None:
        await self.db.delete(contact)
        await self.db.commit()
