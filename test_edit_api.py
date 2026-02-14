import requests
import json

# Get an item to see the structure
print("GET /api/itens/1/:")
response = requests.get("http://localhost:8000/api/itens/1/")
item = response.json()
print(json.dumps(item, indent=2))

# Try to update it
print("\n\nPATCH /api/itens/1/:")
payload = {
    "nome": item["nome"],
    "descricao": item["descricao"],
    "preco": str(item["preco"]),
    "categoria": item["categoria"],
    "imagem_url": item["imagem_url"],
}
print("Payload:", json.dumps(payload, indent=2))

response = requests.patch(
    "http://localhost:8000/api/itens/1/",
    json=payload,
    headers={"Content-Type": "application/json"}
)
print(f"Status: {response.status_code}")
print(f"Response: {response.text}")
