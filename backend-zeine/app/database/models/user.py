from sqlalchemy.orm import Mapped, mapped_column, relationship

from database.models.contact import Contact
from database.models.db_registry import table_registry


@table_registry.mapped_as_dataclass
class User:
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(init=False, primary_key=True)
    name: Mapped[str]
    email: Mapped[str] = mapped_column(unique=True)
    password: Mapped[str]
    contacts: Mapped[list["Contact"]] = relationship(
        "Contact", init=False,back_populates="user")
