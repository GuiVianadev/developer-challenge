from fastapi import FastAPI
from routes.auth import router as auth_router
from routes.user import router as user_router
from routes.contacts import router as contacts_router

app = FastAPI()

app.include_router(user_router)
app.include_router(auth_router)
app.include_router(contacts_router)


@app.get('/')
def read_root():
    return {'message': 'Olá Mundo!'}
