# menu_app/serializers.py

from rest_framework import serializers
from .models import Categoria, ItemMenu, Pedido, ItemPedido

class ItemMenuSerializer(serializers.ModelSerializer):
    categoria_slug = serializers.CharField(source='categoria.slug', read_only=True)
    
    class Meta:
        model = ItemMenu
        fields = ['id', 'nome', 'descricao', 'preco', 'categoria', 'categoria_slug', 'imagem_url']

class CategoriaSerializer(serializers.ModelSerializer):
    itens = ItemMenuSerializer(many=True, read_only=True)
    class Meta:
        model = Categoria
        fields = ['id', 'nome', 'emoji', 'slug', 'itens']

class ItemPedidoWriteSerializer(serializers.ModelSerializer):
    """Serializer para escrita de itens do pedido"""
    class Meta:
        model = ItemPedido
        fields = ['item_menu', 'quantidade', 'observacao']

class ItemPedidoSerializer(serializers.ModelSerializer):
    nome_item = serializers.CharField(source='item_menu.nome', read_only=True)
    preco_item = serializers.DecimalField(source='item_menu.preco', max_digits=8, decimal_places=2, read_only=True)
    class Meta:
        model = ItemPedido
        fields = ['id', 'item_menu', 'nome_item', 'preco_item', 'quantidade', 'observacao']

class PedidoSerializer(serializers.ModelSerializer):
    itens = serializers.SerializerMethodField()

    class Meta:
        model = Pedido
        fields = ['id', 'nome_cliente', 'mesa', 'total', 'status', 'criado_em', 'itens', 'problema']

    def get_itens(self, obj):
        """Para leitura, retorna itens com informações completas"""
        return ItemPedidoSerializer(obj.itens.all(), many=True).data

    def create(self, validated_data):
        """Cria o pedido e seus itens em uma transação"""
        # Extrai itens dos dados iniciais (antes de validated_data ser processado)
        request = self.context.get('request')
        itens_data = request.data.get('itens', []) if request else []
        
        # Cria o pedido sem itens
        pedido = Pedido.objects.create(**validated_data)
        
        # Cria cada item do pedido
        for item_data in itens_data:
            ItemPedido.objects.create(
                pedido=pedido,
                item_menu_id=item_data.get('item_menu'),
                quantidade=item_data.get('quantidade', 1),
                observacao=item_data.get('observacao', '')
            )
        
        return pedido
