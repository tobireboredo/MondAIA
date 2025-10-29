from sqlmodel import SQLModel, Field

class CreateUserDB(SQLModel):   
    id: int | None = Field(default=None, primary_key=True)
    password: str
    name: str