"""
Script de teste da API - Verifica se tudo está funcionando
Execute com: python teste_api.py
"""

import requests
import json
from typing import Dict, Any

API_BASE = "http://localhost:8000/api"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

def print_test(name: str, success: bool, message: str = ""):
    status = f"{Colors.GREEN}✓ PASSOU{Colors.END}" if success else f"{Colors.RED}✗ FALHOU{Colors.END}"
    print(f"[{status}] {name}")
    if message:
        print(f"     {message}\n")
    else:
        print()

def test_connection():
    """Testa conexão com o servidor"""
    print(f"{Colors.BLUE}=== Testando Conexão ==={Colors.END}\n")
    try:
        response = requests.get(API_BASE, timeout=5)
        print_test("Conexão com servidor", response.status_code < 500)
    except requests.exceptions.ConnectionError:
        print_test("Conexão com servidor", False, 
                  f"Erro: Não conseguiu conectar em {API_BASE}")
        return False
    except Exception as e:
        print_test("Conexão com servidor", False, f"Erro: {str(e)}")
        return False
    
    return True

def test_get_categorias():
    """Testa GET /api/categorias/"""
    print(f"{Colors.BLUE}=== Testando GET /api/categorias/ ==={Colors.END}\n")
    try:
        response = requests.get(f"{API_BASE}/categorias/")
        success = response.status_code == 200
        
        if success:
            data = response.json()
            categorias_count = len(data) if isinstance(data, list) else 0
            print_test("GET /api/categorias/", True, 
                      f"Retornou {categorias_count} categorias")
            
            if categorias_count > 0:
                cat = data[0]
                print(f"     Exemplo: {cat.get('emoji', '')} {cat.get('nome', '')}")
                itens_count = len(cat.get('itens', []))
                print(f"     Itens nesta categoria: {itens_count}\n")
        else:
            print_test("GET /api/categorias/", False, 
                      f"Status HTTP: {response.status_code}")
            
        return success
    except Exception as e:
        print_test("GET /api/categorias/", False, f"Erro: {str(e)}")
        return False

def test_get_itens():
    """Testa GET /api/itens/"""
    print(f"{Colors.BLUE}=== Testando GET /api/itens/ ==={Colors.END}\n")
    try:
        response = requests.get(f"{API_BASE}/itens/")
        success = response.status_code == 200
        
        if success:
            data = response.json()
            itens_count = len(data) if isinstance(data, list) else 0
            print_test("GET /api/itens/", True, 
                      f"Retornou {itens_count} itens")
            
            if itens_count > 0:
                item = data[0]
                print(f"     Exemplo: {item.get('nome', '')} (R$ {item.get('preco', 0)})\n")
        else:
            print_test("GET /api/itens/", False, 
                      f"Status HTTP: {response.status_code}")
            
        return success
    except Exception as e:
        print_test("GET /api/itens/", False, f"Erro: {str(e)}")
        return False

def test_create_pedido():
    """Testa POST /api/pedidos/"""
    print(f"{Colors.BLUE}=== Testando POST /api/pedidos/ ==={Colors.END}\n")
    try:
        pedido_data = {
            "nome_cliente": "Teste API",
            "mesa": 99,
            "total": 50.00,
            "itens": [
                {
                    "item_menu": 1,
                    "quantidade": 1,
                    "observacao": "Teste"
                }
            ]
        }
        
        response = requests.post(f"{API_BASE}/pedidos/", json=pedido_data)
        success = response.status_code == 201
        
        if success:
            data = response.json()
            pedido_id = data.get('id')
            print_test("POST /api/pedidos/", True, 
                      f"Pedido criado com ID: {pedido_id}")
            print(f"     Cliente: {data.get('nome_cliente')}")
            print(f"     Mesa: {data.get('mesa')}")
            print(f"     Total: R$ {data.get('total')}")
            print(f"     Status: {data.get('status')}\n")
            return pedido_id
        else:
            print_test("POST /api/pedidos/", False, 
                      f"Status HTTP: {response.status_code}")
            print(f"     Resposta: {response.text}\n")
            return None
            
    except Exception as e:
        print_test("POST /api/pedidos/", False, f"Erro: {str(e)}")
        return None

def test_get_pedidos():
    """Testa GET /api/pedidos/"""
    print(f"{Colors.BLUE}=== Testando GET /api/pedidos/ ==={Colors.END}\n")
    try:
        response = requests.get(f"{API_BASE}/pedidos/")
        success = response.status_code == 200
        
        if success:
            data = response.json()
            pedidos_count = len(data) if isinstance(data, list) else 0
            print_test("GET /api/pedidos/", True, 
                      f"Retornou {pedidos_count} pedidos\n")
        else:
            print_test("GET /api/pedidos/", False, 
                      f"Status HTTP: {response.status_code}")
            
        return success
    except Exception as e:
        print_test("GET /api/pedidos/", False, f"Erro: {str(e)}")
        return False

def test_update_status(pedido_id: int):
    """Testa PATCH /api/pedidos/{id}/status/"""
    print(f"{Colors.BLUE}=== Testando PATCH /api/pedidos/{pedido_id}/status/ ==={Colors.END}\n")
    try:
        status_data = {"status": "preparando"}
        response = requests.patch(f"{API_BASE}/pedidos/{pedido_id}/status/", 
                                json=status_data)
        success = response.status_code == 200
        
        if success:
            data = response.json()
            print_test("PATCH /api/pedidos/{id}/status/", True, 
                      f"Status atualizado para: {data.get('status')}\n")
        else:
            print_test("PATCH /api/pedidos/{id}/status/", False, 
                      f"Status HTTP: {response.status_code}")
            
        return success
    except Exception as e:
        print_test("PATCH /api/pedidos/{id}/status/", False, f"Erro: {str(e)}")
        return False

def main():
    print(f"\n{Colors.YELLOW}{'='*50}")
    print(f"TESTE DA API - INTEGRAÇÃO FRONTEND-BACKEND")
    print(f"{'='*50}{Colors.END}\n")
    
    # Teste 1: Conexão
    if not test_connection():
        print(f"{Colors.RED}Não conseguiu conectar ao servidor Django!{Colors.END}")
        print("Execute em outro terminal: python manage.py runserver")
        return
    
    # Teste 2: Categorias
    test_get_categorias()
    
    # Teste 3: Itens
    test_get_itens()
    
    # Teste 4: Listar pedidos (antes)
    test_get_pedidos()
    
    # Teste 5: Criar pedido
    pedido_id = test_create_pedido()
    
    # Teste 6: Listar pedidos (depois)
    test_get_pedidos()
    
    # Teste 7: Atualizar status
    if pedido_id:
        test_update_status(pedido_id)
    
    print(f"{Colors.GREEN}{'='*50}")
    print("TESTES CONCLUÍDOS")
    print(f"{'='*50}{Colors.END}\n")

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}Teste interrompido pelo usuário{Colors.END}")
    except Exception as e:
        print(f"\n{Colors.RED}Erro inesperado: {str(e)}{Colors.END}")
