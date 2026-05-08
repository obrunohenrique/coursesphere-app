import httpx
from fastapi import HTTPException

async def get_random_instructor():
    url = "https://randomuser.me/api/?inc=name,picture,email&nat=br" # nat=br para trazer nomes brasileiros
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, timeout=5.0)
            response.raise_for_status() # Lança erro se a API estiver fora
            
            data = response.json()
            user = data["results"][0]
            
            # Formatamos os dados para o que o nosso frontend vai precisar
            return {
                "name": f"{user['name']['first']} {user['name']['last']}",
                "email": user["email"],
                "photo": user["picture"]["large"]
            }
        except httpx.HTTPStatusError:
            raise HTTPException(status_code=502, detail="Erro ao se comunicar com a API RandomUser")
        except Exception:
            raise HTTPException(status_code=500, detail="Erro interno ao buscar instrutor convidado")