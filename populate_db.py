"""
Script para popular o banco de dados com dados de exemplo
Execute com: python populate_db.py
"""

import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'CardapioDigital.settings')
django.setup()

from menu_app.models import Categoria, ItemMenu

def popular_banco():
    """Popula o banco com categorias e itens de exemplo"""
    
    # Limpar dados anteriores (opcional)
    print("Limpando dados anteriores...")
    Categoria.objects.all().delete()
    ItemMenu.objects.all().delete()

    # Criar categorias
    print("Criando categorias...")
    
    categorias_data = [
        {
            "nome": "Sanduíches",
            "emoji": "",
            "slug": "sanduiches",
            "itens": [
                {
                    "nome": "Sanduíche Chicken",
                    "descricao": "Pão brioche, frango grelhado, alface, tomate e maionese especial",
                    "preco": 22.90,
                    "imagem_url": "/imagens/SanduicheChicken.jpg"
                },
                {
                    "nome": "Sanduíche Fish",
                    "descricao": "Pão ciabatta, filé de peixe empanado, molho tártaro e rúcula",
                    "preco": 25.90,
                    "imagem_url": "/imagens/SanduicheFish.jpg"
                },
                {
                    "nome": "Sanduíche Tradicional",
                    "descricao": "Pão francês, hambúrguer artesanal, queijo, alface e tomate",
                    "preco": 19.90,
                    "imagem_url": "/imagens/SanduicheTradicional.jpg"
                },
            ]
        },
        {
            "nome": "Hot Dogs",
            "emoji": "",
            "slug": "hotdogs",
            "itens": [
                {
                    "nome": "Hot Dog Tradicional",
                    "descricao": "Pão normal, 2 salsichas, batata palha, mostarda, ketchup e vinagrete",
                    "preco": 14.90,
                    "imagem_url": "/imagens/HotDogTradicional.webp"
                },
                {
                    "nome": "Hot Dog Frango",
                    "descricao": "Pão especial, salsicha de frango, milho, ervilha e molho rosé",
                    "preco": 16.90,
                    "imagem_url": "/imagens/HotDogFrango.webp"
                },
                {
                    "nome": "Hot Dog Não Tradicional",
                    "descricao": "Pão artesanal, salsicha gourmet, cheddar, bacon e cebola caramelizada",
                    "preco": 19.90,
                    "imagem_url": "/imagens/HotDogNaoTradicional.webp"
                },
            ]
        },
        {
            "emoji": "",
            "nome": "Pizzas",
            "slug": "pizzas",
            "itens": [
                {
                    "nome": "Pizza Calabresa",
                    "descricao": "Mozzarela, calabresa e cebola",
                    "preco": 35.00,
                    "imagem_url": "/imagens/PizzaCalabresa.webp"
                },
                {
                    "nome": "Pizza Frango",
                    "descricao": "Mozzarela, frango desfiado e catupiry",
                    "preco": 38.00,
                    "imagem_url": "/imagens/PizzaFrango.webp"
                },
                {
                    "nome": "Pizza Ricota",
                    "descricao": "Ricota, tomate e alho",
                    "preco": 32.00,
                    "imagem_url": "/imagens/PizzaRicota.webp"
                },
            ]
        },
        {emoji": "",
            "
            "nome": "Bebidas",
            "slug": "bebidas",
            "itens": [
                {
                    "nome": "Coca-Cola",
                    "descricao": "Refrigerante Coca-Cola 350ml",
                    "preco": 5.00,
                    "imagem_url": "/imagens/CocaCola.webp"
                },
                {
                    "nome": "Guaraná",
                    "descricao": "Guaraná 350ml",
                    "preco": 4.50,
                    "imagem_url": "/imagens/Guarana.webp"
                },
                {
                    "nome": "Suco Vale",
                    "descricao": "Suco natural 500ml",
                    "preco": 6.00,
                    "imagem_url": "/imagens/SucoVale.webp"
                },
            ]
        },emoji": "",
            "
        {
            "nome": "Milkshakes",
            "slug": "milkshakes",
            "itens": [
                {
                    "nome": "Milkshake Chocolate",
                    "descricao": "Milkshake de chocolate cremoso",
                    "preco": 12.00,
                    "imagem_url": "/imagens/MilkshakeChocolatudo.webp"
                },
                {
                    "nome": "Milkshake Moranguete",
                    "descricao": "Milkshake de morango fresco",
                    "preco": 12.00,
                    "imagem_url": "/imagens/MilkshakeMoranguete.webp"
                },
                {
                    "nome": "Milkshake Kit Kat",
                    "descricao": "Milkshake com chocolate Kit Kat",
                    "preco": 14.00,
                    "imagem_url": "/imagens/MilkshakeKitKat.webp"
                },
            ]
        },
    ]

    # Inserir categorias e itens
    for cat_data in categorias_data:
        itens = cat_data.pop('itens')
        
        # Criar categoria
        categoria = Categoria.objects.create(**cat_data)
        print(f"✓ Categoria criada: {categoria.nome}")

        # Criar itens da categoria
        for item_data in itens:
            item_data['categoria'] = categoria
            item = ItemMenu.objects.create(**item_data)
            print(f"  ✓ Item criado: {item.nome} (R$ {item.preco})")

    print("\n✅ Banco de dados populado com sucesso!")
    print(f"Total de categorias: {Categoria.objects.count()}")
    print(f"Total de itens: {ItemMenu.objects.count()}")

if __name__ == '__main__':
    popular_banco()
